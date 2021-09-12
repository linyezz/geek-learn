"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// const { match } = require('assert');
var css = require('css');
/**
 * 第二周作业，解析html
 */


var currentToken = null;
var currentAttribute = null;
var currentTextNode = null;
var rules = []; // css规则

var EOF = Symbol("EOF");
var stack = [{
  type: "document",
  children: []
}]; // 输出状态机的状态

function emit(token) {
  console.log(token); // html 语法分析

  var top = stack[stack.length - 1]; // 如果是开始标签，新建element

  if (token.type == "startTag") {
    var element = {
      type: 'element',
      children: [],
      attributes: []
    };
    element.tagName = token.tagName; // 循环token内容

    for (var p in token) {
      if (p != "type" && p != 'tagName') {
        // 当前为属性
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

    ; // 计算css

    computeCss(element); // 标签入栈

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      // 判断自封闭标签。自封闭标签入栈
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type == 'endTag') {
    // 遇到结束标签
    if (top.tagName != token.tagName) {
      throw new Error("Tage start end doesn't match");
    } else {
      // 遇到style标签是，执行添加css规则的操作
      if (top.tagName == "style") {
        addCSSRules(top.children[0].content);
      } // 标签出栈


      stack.pop();
    }

    currentToken = null;
  } else if (token.type == "text") {
    // 遇到文本节点
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: ""
      };
      top.children.push(currentTextNode);
    }

    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c == '<') {
    return tagOpen;
  } else if (c == EOF) {
    emit({
      type: "EOF"
    });
    return;
  } else {
    emit({
      type: "text",
      content: c
    });
    return data;
  }
}

function tagOpen(c) {
  if (c == '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z0-9]$/)) {
    //是一个开始标签，或者是自封闭标签
    currentToken = {
      type: "startTag",
      tagName: ""
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z0-9]$/)) {
    //是字符或者数字串创造一个结束标签。
    currentToken = {
      type: "endTag",
      tagName: ""
    };
    return tagName(c);
  } else if (c == '>') {
    console.error('>异常报错');
  } else if (c == EOF) {
    console.error('EOF异常报错');
  } else {
    console.error('异常报错');
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 标签名 以空白符结束 后面跟属性 进入属性名函数
    return beforeAttributeName;
  } else if (c == '/') {
    // 如果是/符号，表示自封标签
    return selfClosingStartTAg;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 如果还是字符，说明还是标签名
    // 添加标签名称
    currentToken.tagName += c;
    return tagName;
  } else if (c == '>') {
    // > 是一个普通的开始标签。结束这个标签
    emit(currentToken); // 输出状态

    return data;
  } else {
    return tagName;
  }
} // 开始处理属性


function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == '>' || c == '>' || c == EOF) {
    return afterAttributeName;
  } else if (c == '=') {// 属性开通有等号报错
  } else {
    currentAttribute = {
      name: "",
      value: ""
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\0") {} else if (c == "\"" || c == " " || c == "<") {} else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == "\"") {
    // 双引号
    return doubleQuotedAttributeValue;
  } else if (c == "\'") {
    // 单引号
    return singleQutedAttributeValue;
  } else if (c == ">") {} else {
    return UnquotedAttributeValue(c);
  }
} // 双引号只招双引号结束


function doubleQuotedAttributeValue(c) {
  if (c == "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\0") {} else if (c == EOF) {} else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
} // 单引号只找单引号结束


function singleQutedAttributeValue(c) {
  if (c == "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\0") {} else if (c == EOF) {} else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTAg;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {} else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
} // 空白符只找空白符


function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 如果是空格，接下来可能还是属性
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    // 自封闭标签
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTAg;
  } else if (c == ">") {
    // 遇到结束标签，输出状态。
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\0") {} else if (c == "\"" || c == "\'" || c == "<" || c == "=" || c == "`") {} else if (c == EOF) {} else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTAg;
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {} else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    };
    return attributeName(c);
  }
}

function selfClosingStartTAg(c) {
  //当遇到自封闭标签时，只有>才符合，其余都会报错
  if (c == '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == EOF) {} else {}
} // css规则函数


function addCSSRules(text) {
  // 用css解析ast树
  var ast = css.parse(text);
  rules.push.apply(rules, _toConsumableArray(ast.stylesheet.rules));
} // 计算css函数


function computeCss(element) {
  var elements = stack.slice().reverse(); // slice不传参数时，默认复制一遍原数组.但不是深拷贝

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rule = _step.value;
      var selectorParts = rule.selectors[0].split(" ").reverse();

      if (!match(element, selectorParts[0])) {
        continue;
      }

      var matched = false;
      var j = 1;

      for (var i = 0; i < elements.length; i++) {
        if (match(elements[i], selectorParts[j])) {
          j++;
        }
      }

      if (j >= selectorParts.length) {
        matched = true;
      }

      if (matched) {
        var sp = specificity(rule.selectors[0]);
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
            } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
              computedStyle[declaration.property].value = declaration.value;
              computedStyle[declaration.property].specificity = sp;
            } // computedStyle[declaration.property].value = declaration.value

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

        console.log(element.computedStyle);
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
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  } // #开头为id选择器


  if (selector.charAt(0) == "#") {
    var attr = element.attributes.filter(function (attr) {
      return attr.name === "id";
    })[0];

    if (attr && attr.value === selector.replace("#", " ")) {
      return true;
    }
  } else if (selector.charAt(0) == ".") {
    var attr = element.attributes.filter(function (attr) {
      return attr.name === "class";
    })[0];

    if (attr && attr.value === selector.replace(".", " ")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }

  return false;
}

function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(" ");
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = selectorParts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var part = _step3.value;

      if (part.charAt(0) == "#") {
        p[1] += 1;
      } else if (part.charAt(0) == ".") {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
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

  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }

  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }

  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }

  return sp1[3] - sp2[3];
}

module.exports.parseHTML = function (html) {
  var state = data;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = html[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var c = _step4.value;
      state = state(c);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  state = state(EOF);
  return stack[0];
};