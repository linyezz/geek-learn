"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

var _LexParser = require("./LexParser.js");

var _syntax;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 定义
var syntax = (_syntax = {
  Program: [['StatementList', 'EOF']],
  StatementList: [['Statement'], ['StatementList', 'Statement']],
  Statement: [['ExpressionStatement'], ['IfStatement'], ["WhileStatement"], ['VariableDecaration'], ['FunctionDecaration'], ["Block"], ["BreakStatement"], ["ContinueStatement"], ['FunctionDecaration']],
  FunctionDecaration: [['function', 'Identifier', '(', ')', '{', 'StatementList', '}']],
  Block: [["{", "StatementList", "}"], ["{", "}"]],
  BreakStatement: [["break", ";"]],
  ContinueStatement: [["continue", ";"]],
  ExpressionStatement: [['Expression', ';']],
  Expression: [["AssignmentExpression"]],
  AssignmentExpression: [['LeftHandSideExpression', "=", "LogicalORExpression"], ['LogicalORExpression']],
  LogicalORExpression: [["LogicalANDExpression"], ["LogicalORExpression", "||", "LogicalANDExpression"]],
  LogicalANDExpression: [["AdditiveExpression"], ["LogicalANDExpression", "&&", "AdditiveExpression"]],
  IfStatement: [['if', '(', 'Expression', ')', 'Statement']],
  WhileStatement: [["while", "(", "Expression", ")", "Statement"]],
  VariableDecaration: [['var', 'Identifier', ';'], ['let', 'Identifier', ';'], ['const', 'Identifier', ';']]
}, _defineProperty(_syntax, "FunctionDecaration", [['function', 'Identifier', '(', ')', '{', 'StatementList', '}']]), _defineProperty(_syntax, "AdditiveExpression", [['MuliplicativeExpression'], ['AdditiveExpression', '+', 'MuliplicativeExpression'], ['AdditiveExpression', '-', 'MuliplicativeExpression']]), _defineProperty(_syntax, "MuliplicativeExpression", [['LeftHandSideExpression'], ['MuliplicativeExpression', '*', 'LeftHandSideExpression'], ['MuliplicativeExpression', '/', 'LeftHandSideExpression']]), _defineProperty(_syntax, "LeftHandSideExpression", [["CallExpression"], ["NewExpression"]]), _defineProperty(_syntax, "CallExpression", [["MemberExpression", "Arguments"], ["CallExpression", "Arguments"]]), _defineProperty(_syntax, "Arguments", [["(", ")"], ["(", "ArgumentList", ")"]]), _defineProperty(_syntax, "ArgumentList", [["AssignmentExpression"], ["ArgumentList", ",", "AssignmentExpression"]]), _defineProperty(_syntax, "NewExpression", [["MemberExpression"], ["new", "NewExpression"]]), _defineProperty(_syntax, "MemberExpression", [["PrimaryExpression"], ["PrimaryExpression", ".", "Identifier"], ["PrimaryExpression", "[", "Expression", "]"]]), _defineProperty(_syntax, "PrimaryExpression", [['(', 'EXpression', ')'], ['Literal'], ['Identifier']]), _defineProperty(_syntax, "Literal", [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral'], ['RegularExpression'], ["ObjectLiteral"], ["ArrayLiteral"]]), _defineProperty(_syntax, "ObjectLiteral", [["{", "}"], ["{", "PropertyList", "}"]]), _defineProperty(_syntax, "PropertyList", [["Property"], ["PropertyList", ",", "Property"]]), _defineProperty(_syntax, "Property", [["StringLiteral", ":", "AdditiveExpression"], ["Identifier", ":", "AdditiveExpression"]]), _syntax);
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