"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var css = require('css');

var layout = require('./layout');

var EOF = Symbol('EOF');
var currentToken = null;
var currentAttribute = null;
var currentTextNode = null;
var stack = [{
  type: 'document',
  children: []
}];
var rules = [];

function addCSSRules(s) {
  var ast = css.parse(s);
  rules.push.apply(rules, _toConsumableArray(ast.stylesheet.rules));
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  if (selector.charAt(0) === '#') {
    var attr = element.attributes.find(function (item) {
      return item.name === 'id';
    });

    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    }
  } else if (selector.charAt(0) === '.') {
    var _attr = element.attributes.find(function (item) {
      return item.name === 'class';
    });

    if (_attr && _attr.value === selector.replace('.', '')) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
}

function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(' ');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = selectorParts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var part = _step.value;

      if (part.charAt(0) === '#') {
        p[1] += 1;
      } else if (part.charAt(0) === '.') {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return p;
}

function compare(sp1, sp2) {
  for (var i = 0; i < sp1.length; i++) {
    if (sp1[i] - sp2[i]) {
      return sp1[i] - sp2[i];
    }
  }

  return 0;
}

function computeCSS(element) {
  var elements = stack.slice().reverse();
  rules.forEach(function (rule) {
    rule.selectors.forEach(function (selector) {
      var selectorParts = selector.split(' ');

      if (!match(element, selectorParts[selectorParts.length - 1])) {
        return false;
      }

      selectorParts.pop();
      elements.forEach(function (element) {
        if (selectorParts.length > 0 && match(element, selectorParts[selectorParts.length - 1])) {
          selectorParts.pop();
        }
      }); //selectorParts 为空表示css规则匹配成功

      if (selectorParts.length === 0) {
        var sp = specificity(selector);
        var computedStyle = element.computedStyle;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = rule.declarations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var declaration = _step2.value;

            if (!computedStyle[declaration.property]) {
              computedStyle[declaration.property] = {};
            }

            if (!computedStyle[declaration.property].specificity) {
              computedStyle[declaration.property].value = declaration.value;
              computedStyle[declaration.property].specificity = sp;
            } else if (compare(sp, computedStyle[declaration.property].specificity) >= 0) {
              computedStyle[declaration.property].specificity = sp;
              computedStyle[declaration.property].value = declaration.value;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    });
  });
}

function emit(token) {
  var top = stack[stack.length - 1];

  if (token.type === 'startTag') {
    var element = {
      type: 'element',
      computedStyle: {},
      children: [],
      attributes: []
    };
    element.tagName = token.tagName;
    Object.keys(token).forEach(function (key) {
      if (!['type', 'tagName', 'isSelfClosing'].includes(key)) {
        element.attributes.push({
          name: key,
          value: token[key]
        });
      }
    });
    computeCSS(element);
    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (token.tagName === top.tagName) {
      //关闭标签为style时，执行添加CSS规则的操作
      if (token.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }

      layout(top);
      stack.pop();
    } else {
      console.log('top:', top);
      console.log('token:', token);
      throw new Error('startTag.tagName !== endTag.tagName');
    }

    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      };
      top.children.push(currentTextNode);
    }

    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
    return;
  } else {
    emit({
      type: 'text',
      content: c
    }); //文本节点

    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c === '>') {// return data;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    };
    return tagName(c);
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
  } else {
    return;
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforAttributeName;
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {} else {
    currentAttribute = {
      name: '',
      value: ''
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforAttributeValue;
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
} //<div a b >


function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    };
    return attributeName(c);
  }
}

function beforAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforAttributeValue;
  } else if (c === '"') {
    return dubleQutoedAttributeValue;
  } else if (c === "'") {
    return singleQutoedAttributeValue;
  } else {
    return UnQutoedAttributeValue;
  }
}

function dubleQutoedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQutoedAttributeValue;
  } else if (c === EOF) {} else {
    currentAttribute.value += c;
    return dubleQutoedAttributeValue;
  }
}

function singleQutoedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQutoedAttributeValue;
  } else if (c === EOF) {} else {
    currentAttribute.value += c;
    return singleQutoedAttributeValue;
  }
}

function UnQutoedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {} else {
    currentAttribute.value += c;
    return UnQutoedAttributeValue;
  }
}

function afterQutoedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
    return;
  } else {
    return;
  }
}

module.exports.parseHTML = function parseHTML(html) {
  var state = data;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = html[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var c = _step3.value;
      state = state(c);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  state = state(EOF);
  return stack[0];
};