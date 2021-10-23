"use strict";

var _LexParser = require("./LexParser.js");

var _syntax;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 定义
var syntax = (_syntax = {
  Program: [['StatementList', 'EOF']],
  StatementList: [['Statement'], ['StatementList', 'Statement']],
  Statement: [['ExpressionStatement'], ['IfStatement'], ["WhileStatement"], ['VariableDecaration'], ['FunctionDecaration'], ["Block"], ["BreakStatement"], ["ContinueStatement"]],
  WhileStatement: [["while", "(", "Expression", ")", "Statement"]],
  IfStatement: [["if", "(", "Expression", ")", "Statement"]],
  BreakStatement: [["break", ";"]],
  ContinueStatement: [["continue", ";"]],
  Block: [["{", "StatementList", "}"], ["{", "}"]],
  ExpressionStatement: [['Expression', ';']],
  Expression: [["AssignmentExpression"]],
  AssignmentExpression: [['LeftHandSideExpression', "=", "LogicalORExpression"], ['LogicalORExpression']],
  LogicalORExpression: [["LogicalANDExpression"], ["LogicalORExpression", "||", "LogicalANDExpression"]],
  LogicalANDExpression: [["AdditiveExpression"], ["LogicalANDExpression", "&&", "AdditiveExpression"]]
}, _defineProperty(_syntax, "IfStatement", [['if', '(', 'Expression', ')', 'Statement']]), _defineProperty(_syntax, "VariableDecaration", [['var', 'Identifier', ';'], ['let', 'Identifier', ';'], ['const', 'Identifier', ';']]), _defineProperty(_syntax, "FunctionDecaration", [['function', 'Identifier', '(', ')', '{', 'StatementList', '}']]), _defineProperty(_syntax, "AdditiveExpression", [['MuliplicativeExpression'], ['AdditiveExpression', '+', 'MuliplicativeExpression'], ['AdditiveExpression', '-', 'MuliplicativeExpression']]), _defineProperty(_syntax, "MuliplicativeExpression", [['LeftHandSideExpression'], ['MuliplicativeExpression', '*', 'LeftHandSideExpression'], ['MuliplicativeExpression', '/', 'LeftHandSideExpression']]), _defineProperty(_syntax, "LeftHandSideExpression", [["CallExpression"], ["NewExpression"]]), _defineProperty(_syntax, "CallExpression", [["MemberExpression", "Arguments"], ["CallExpression", "Arguments"]]), _defineProperty(_syntax, "Arguments", [["(", ")"], ["(", "ArgumentList", ")"]]), _defineProperty(_syntax, "ArgumentList", [["AssignmentExpression"], ["ArgumentList", ",", "AssignmentExpression"]]), _defineProperty(_syntax, "NewExpression", [["MemberExpression"], ["new", "NewExpression"]]), _defineProperty(_syntax, "MemberExpression", [["PrimaryExpression"], ["PrimaryExpression", ".", "Identifier"], ["PrimaryExpression", "[", "Expression", "]"]]), _defineProperty(_syntax, "PrimaryExpression", [['(', 'EXpression', ')'], ['Literial'], ['Identifier']]), _defineProperty(_syntax, "Literial", [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral'], ['RegularExpression'], ["ObjectLiteral"], ["ArrayLiteral"]]), _defineProperty(_syntax, "ObjectLiteral", [["{", "}"], ["{", "PropertyList", "}"]]), _defineProperty(_syntax, "PropertyList", [["Property"], ["PropertyList", ",", "Property"]]), _defineProperty(_syntax, "Property", [["StringLiteral", ":", "AdditiveExpression"], ["Identifier", ":", "AdditiveExpression"]]), _syntax);
var end = {
  $isEnd: true
};
var start = {
  Program: end
};
var hash = {};

function closure(state) {
  hash[JSON.stringify(state)] = state;
  var quene = [];

  for (var symbol in state) {
    if (symbol.match(/^\$/)) {
      continue;
    }

    quene.push(symbol);
  }

  while (quene.length) {
    var _symbol = quene.shift();

    if (syntax[_symbol]) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = syntax[_symbol][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var rule = _step.value;

          if (!state[rule[0]]) {
            quene.push(rule[0]);
          }

          var current = state;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = rule[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var part = _step2.value;

              if (!current[part]) {
                current[part] = {};
              }

              current = current[part];
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

          current.$reduceType = _symbol;
          current.$reduceLength = rule.length;
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
  }

  for (var _symbol2 in state) {
    if (_symbol2.match(/^\$/)) {
      continue;
    }

    if (hash[JSON.stringify(state[_symbol2])]) {
      state[_symbol2] = hash[JSON.stringify(state[_symbol2])];
    } else closure(state[_symbol2]);
  }
}

closure(start);
console.log(start);

function parse(source) {
  var stack = [start];
  var symbolStack = [];

  function reduce() {
    var state = stack[stack.length - 1];

    if (state.$reduceType) {
      var children = [];

      for (var i = 0; i < state.$reduceLength; i++) {
        stack.pop();
        children.push(symbolStack.pop());
      } // create a non-terminal symbol and shift it


      return {
        type: state.$reduceType,
        children: children.reverse()
      };
    } else {
      throw new Error('unexpected token');
    }
  }

  function shift(symbol) {
    var state = stack[stack.length - 1];

    if (symbol.type in state) {
      stack.push(state[symbol.type]);
      symbolStack.push(symbol);
    } else {
      // reduce to non-terminal symbol
      shift(reduce());
      shift(symbol);
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = (0, _LexParser.scan)(source)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var symbol = _step3.value;
      console.log(symbol); // console.log(symbol)

      shift(symbol);
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

  return reduce();
}

var Realm = function Realm() {
  _classCallCheck(this, Realm);

  this.global = new Map();
  this.Object = new Map();

  this.Object.call = function () {};

  this.Object_prototype = new Map();
};

var ExecutionContext = function ExecutionContext() {
  _classCallCheck(this, ExecutionContext);

  this.lexicalEnvironment = {};
  this.variableEnvironment = this.lexicalEnvironment;
  this.realm = {};
};

var EnvironmentRecord = function EnvironmentRecord(outer) {
  _classCallCheck(this, EnvironmentRecord);

  this.outer = outer;
  this.variable = new Map();
};

var Reference =
/*#__PURE__*/
function () {
  function Reference(object, property) {
    _classCallCheck(this, Reference);

    this.object = object;
    this.property = property;
  }

  _createClass(Reference, [{
    key: "set",
    value: function set(value) {
      this.object.set(this.property, value);
    }
  }, {
    key: "get",
    value: function get() {
      return this.object.get(this.property);
    }
  }]);

  return Reference;
}();

var evaluator = {
  Program: function Program(node) {
    return evaluate(node.children[0]);
  },
  StatementList: function StatementList(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      evaluate(node.children[0]);
      return evaluate(node.children[1]);
    }
  },
  Statement: function Statement(node) {
    return evaluate(node.children[0]);
  },
  VariableDecaration: function VariableDecaration(node) {
    // console.log('declare variable ' + node.children[1].name)
    var runingEC = ecs[ecs.length - 1];
    runingEC.variableEnvironment[node.children[1].name];
  },
  ExpressionStatement: function ExpressionStatement(node) {
    return evaluate(node.children[0]);
  },
  Expression: function Expression(node) {
    return evaluate(node.children[0]);
  },
  AdditiveExpression: function AdditiveExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {// todo
    }
  },
  MuliplicativeExpression: function MuliplicativeExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {// todo
    }
  },
  PrimaryExpression: function PrimaryExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    }
  },
  Literial: function Literial(node) {
    return evaluate(node.children[0]);
  },
  NumbericLiteral: function NumbericLiteral(node) {
    var str = node.value;
    var l = str.length;
    var value = 0;
    var n = 10;

    if (str.match(/^0b/)) {
      n = 2;
      l -= 2;
    } else if (str.match(/^0o/)) {
      n = 8;
      l -= 2;
    } else if (str.match(/^0x/)) {
      n = 16;
      l -= 2;
    }

    while (l--) {
      var c = str.charCodeAt(str.length - l - 1);

      if (c >= "a".charCodeAt(0)) {
        c = c - "a".charCodeAt(0) + 10;
      } else if (c >= "A".charCodeAt(0)) {
        c = c - "A".charCodeAt(0) + 10;
      } else if (c >= "0".charCodeAt(0)) {
        c = c - "0".charCodeAt(0);
      }

      value = value * n + c;
    }

    console.log(value);
    return Number(node.value);
  },
  StringLiteral: function StringLiteral(node) {
    var i = 1;
    var result = [];

    for (var _i = 1; _i < node.value.length - 1; _i++) {
      if (node.value[_i] === "\\") {
        ++_i;
        var c = node.value[_i];
        var map = {
          "\"": "\"",
          "\'": "\'",
          "\\": "\\",
          "0": String.fromCharCode(0x0000),
          "b": String.fromCharCode(0x0008),
          "f": String.fromCharCode(0x000c),
          "n": String.fromCharCode(0x000a),
          "r": String.fromCharCode(0x000d),
          "t": String.fromCharCode(0x0009),
          "v": String.fromCharCode(0x000b)
        };

        if (c in map) {
          result.push(map[c]);
        } else {
          result.push(c);
        }
      } else {
        result.push(node.value[_i]);
      }
    }

    console.log(result);
  },
  ObjectLiteral: function ObjectLiteral(node) {
    if (node.children.length === 2) {
      return {};
    }

    if (node.children.length === 3) {
      var object = new new Map()();
      this.PropertyList(node.children[1], object);
      return object;
    }
  },
  PropertyList: function PropertyList(node, object) {
    if (node.children.length === 1) {
      this.Property(node.children[0], object);
    } else {
      this.PropertyList(node.children[0], object);
      this.Property(node.children[2], object);
    }
  },
  Property: function Property(node, object) {
    var name;

    if (node.children[0].type === "Identifier") {
      name = node.children[0].name;
    } else if (node.children[0].type === "StringLiteral") {
      name = evaluate(node.children[0]);
    }

    object.set(name, {
      value: evaluate(node.children[2]),
      writable: true,
      enumerable: true,
      configable: true
    });
  },
  AssignmentExpression: function AssignmentExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    }

    var left = evaluate(node.children[0]);
    var right = evaluate(node.children[2]);
    left.set(right);
  },
  Identifier: function Identifier(node) {
    var runingEC = ecs[ecs.length - 1];
    return new Reference(runingEC.lexicalEnvironment, node.name);
  },
  BooleanLiteral: function BooleanLiteral(node) {
    if (node.value === "false") {
      return false;
    } else {
      return true;
    }
  },
  NullLiteral: function NullLiteral() {
    return null;
  }
};
var realm = new Realm();
var ecs = [new ExecutionContext()];

function evaluate(node) {
  // console.log(node)
  if (evaluator[node.type]) {
    return evaluator[node.type](node);
  }
} ////////////////////////


var source = "\n\"abc\";\n"; // let tree = parse(source);
// console.log(tree)
// // evaluate(tree);
// console.log(evaluate(tree))

window.toyjs = {
  evaluate: evaluate,
  parse: parse
};