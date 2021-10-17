"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

var _LexParser = require("./LexParser.js");

// 定义
var syntax = {
  Program: [['StatementList', 'EOF']],
  StatementList: [['Statement'], ['StatementList', 'Statement']],
  Statement: [['ExpressionStatement'], ['IfStatement'], ['VariableDecaration'], ['FunctionDecaration']],
  ExpressionStatement: [['Expression', ';']],
  Expression: [["AssignmentExpression"]],
  AssignmentExpression: [['LeftHandSideExpression', "=", "LogicalORExpression"], ['LogicalORExpression']],
  LogicalORExpression: [["LogicalANDExpression"], ["LogicalORExpression", "||", "LogicalANDExpression"]],
  LogicalANDExpression: [["AdditiveExpression"], ["LogicalANDExpression", "&&", "AdditiveExpression"]],
  IfStatement: [['if', '(', 'Expression', ')', 'Statement']],
  VariableDecaration: [['var', 'Identifier', ';'], ['let', 'Identifier', ';'], ['const', 'Identifier', ';']],
  FunctionDecaration: [['function', 'Identifier', '(', ')', '{', 'StatementList', '}']],
  AdditiveExpression: [['MuliplicativeExpression'], ['AdditiveExpression', '+', 'MuliplicativeExpression'], ['AdditiveExpression', '-', 'MuliplicativeExpression']],
  MuliplicativeExpression: [['LeftHandSideExpression'], ['MuliplicativeExpression', '*', 'LeftHandSideExpression'], ['MuliplicativeExpression', '/', 'LeftHandSideExpression']],
  LeftHandSideExpression: [["CallExpression"], ["NewExpression"]],
  CallExpression: [["MemberExpression", "Arguments"], ["CallExpression", "Arguments"]],
  Arguments: [["(", ")"], ["(", "ArgumentList", ")"]],
  ArgumentList: [["AssignmentExpression"], ["ArgumentList", ",", "AssignmentExpression"]],
  NewExpression: [["MemberExpression"], ["new", "NewExpression"]],
  MemberExpression: [["PrimaryExpression"], ["PrimaryExpression", ".", "Identifier"], ["PrimaryExpression", "[", "Expression", "]"]],
  PrimaryExpression: [['(', 'EXpression', ')'], ['Literial'], ['Identifier']],
  Literial: [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral'], ['RegularExpression'], ["ObjectLiteral"], ["ArrayLiteral"]],
  ObjectLiteral: [["{", "}"], ["{", "PropertyList", "}"]],
  PropertyList: [["Property"], ["PropertyList", ",", "Property"]],
  Property: [["StringLiteral", ":", "AdditiveExpression"], ["Identifier", ":", "AdditiveExpression"]]
};
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