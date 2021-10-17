import { scan } from './LexParser.js';
// 定义
let syntax = {
    Program: [
        ['StatementList', 'EOF']
    ],
    StatementList: [
        ['Statement'],
        ['StatementList', 'Statement']
    ],
    Statement: [
        ['ExpressionStatement'],
        ['IfStatement'],
        ['VariableDecaration'],
        ['FunctionDecaration'],
    ],
    
    ExpressionStatement: [
        ['Expression', ';']
    ],
    Expression: [
        ["AssignmentExpression"]
    ],
    AssignmentExpression: [
        ['LeftHandSideExpression', "=", "LogicalORExpression"],
        ['LogicalORExpression'],
    ],
    LogicalORExpression: [
        ["LogicalANDExpression"],
        ["LogicalORExpression", "||", "LogicalANDExpression"],
    ],
    LogicalANDExpression:[
        ["AdditiveExpression"],
        ["LogicalANDExpression", "&&", "AdditiveExpression"],
    ],
    IfStatement: [
        ['if', '(', 'Expression', ')', 'Statement']
    ],
    VariableDecaration: [
        ['var', 'Identifier', ';'],
        ['let', 'Identifier', ';'],
        ['const', 'Identifier', ';'],
    ],
    FunctionDecaration: [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}']
    ],
    AdditiveExpression: [
        ['MuliplicativeExpression'],
        ['AdditiveExpression', '+', 'MuliplicativeExpression'],
        ['AdditiveExpression', '-', 'MuliplicativeExpression']
    ],
    MuliplicativeExpression: [
        ['LeftHandSideExpression'],
        ['MuliplicativeExpression', '*', 'LeftHandSideExpression'],
        ['MuliplicativeExpression', '/', 'LeftHandSideExpression']
    ],
    LeftHandSideExpression:[
        ["CallExpression"],
        ["NewExpression"],
    ],
    CallExpression:[
        ["MemberExpression","Arguments"],
        ["CallExpression","Arguments"],
    ],
    Arguments:[
        ["(", ")"],
        ["(", "ArgumentList" ,")"],
    ],
    ArgumentList:[
        ["AssignmentExpression"],
        ["ArgumentList", "," ,"AssignmentExpression"],
    ],
    NewExpression:[
        ["MemberExpression"],
        ["new","NewExpression"]
    ], 
    MemberExpression: [
        ["PrimaryExpression"],
        ["PrimaryExpression", ".", "Identifier"],
        ["PrimaryExpression", "[", "Expression", "]"]
    ],
    PrimaryExpression: [
        ['(', 'EXpression', ')'],
        ['Literial'],
        ['Identifier']
    ],
    Literial: [
        ['NumbericLiteral'],
        ['StringLiteral'],
        ['BooleanLiteral'],
        ['NullLiteral'],
        ['RegularExpression'],
        ["ObjectLiteral"],
        ["ArrayLiteral"],
    ],
    ObjectLiteral:[
        ["{" , "}"],
        ["{" , "PropertyList" , "}"],
    ],
    PropertyList:[
        ["Property"],
        ["PropertyList", "," ,"Property"],
    ],
    Property:[
        ["StringLiteral", ":" ,"AdditiveExpression"],
        ["Identifier", ":" ,"AdditiveExpression"],
    ],
}

let end = {
  $isEnd: true,
}
let start = {
  Program: end
}

let hash = {}

function closure(state) {
  hash[JSON.stringify(state)] = state;
  let quene = [];
  for (let symbol in state) {
      if (symbol.match(/^\$/)) {
          continue;
      }
      quene.push(symbol);
  }
  while(quene.length) {
      let symbol = quene.shift();
      if (syntax[symbol]) {
          for (let rule of syntax[symbol]) {
              if (!state[rule[0]]){
                  quene.push(rule[0]);
                }
              let current = state;
              for (let part of rule) {
                  if (!current[part]){
                    current[part] = {};
                  }   
                  current = current[part];
              }
              current.$reduceType = symbol;
              current.$reduceLength = rule.length;
          }
      }
  }
  for (let symbol in state) {
      if (symbol.match(/^\$/)) {
          continue;
      }
      if (hash[JSON.stringify(state[symbol])]){
          state[symbol] = hash[JSON.stringify(state[symbol])];
        }
      else closure(state[symbol]);
  }
}

closure(start);
console.log(start)
export function parse(source) {
  let stack = [start];
  let symbolStack = [];
  function reduce() {
      let state = stack[stack.length - 1];
      if (state.$reduceType) {
          let children = [];
          for (let i = 0; i < state.$reduceLength; i++) {
              stack.pop();
              children.push(symbolStack.pop());
          }
          // create a non-terminal symbol and shift it
          return {
              type: state.$reduceType,
              children: children.reverse()
          }
      } else {
          throw new Error('unexpected token');
      }
  }
  function shift(symbol) {
      let state = stack[stack.length - 1];
      if (symbol.type in state) {
          stack.push(state[symbol.type]);
          symbolStack.push(symbol);
      } else {
          // reduce to non-terminal symbol
          shift(reduce());
          shift(symbol);
      }
  }
  for (let symbol of scan(source)) {
      console.log(symbol)
    // console.log(symbol)
      shift(symbol);
  }
  return reduce();
}