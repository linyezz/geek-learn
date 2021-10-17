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
        ["WhileStatement"],
        ['VariableDecaration'],
        ['FunctionDecaration'],
        ["Block"],
        ["BreakStatement"],
        ["ContinueStatement"]
    ],
    WhileStatement:[
        ["while", "(", "Expression", ")", "Statement"]
    ], 
    IfStatement: [
        ["if", "(", "Expression", ")", "Statement"] 
    ],
    BreakStatement:[
        ["Break",";"]
    ],
    ContinueStatement:[
        ["continue",";"]
    ],
    Block:[
        [ "{" , "StatementList" , "}"],
        [ "{" , "}"],
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
function parse(source) {
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
 class Realm {
    constructor() {
        this.global = new Map();
        this.Object = new Map();
        this.Object.call = function () { };
        this.Object_prototype = new Map();
    }
}
class ExecutionContext{
    constructor() {
        this.lexicalEnvironment = {};
        this.variableEnvironment = this.lexicalEnvironment;
        this.realm = {};
    }
    
}
 class EnvironmentRecord {
    constructor(outer){
        this.outer = outer;
        this.variable = new Map();
    }
    

}

class Reference{
    constructor(object, property) {
        this.object = object;
        this.property = property;
    }
    set(value) {
        this.object.set(this.property, value);
    }
    get() {
        return this.object.get(this.property);
    }
}

let evaluator = {
    Program(node) {
        return evaluate(node.children[0]);
    },
    StatementList(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0]);
        } else {
            evaluate(node.children[0]);
            return evaluate(node.children[1]);
        }
    },
    Statement(node) {
        return evaluate(node.children[0]);
    },
    VariableDecaration(node) {
        // console.log('declare variable ' + node.children[1].name)
        let runingEC = ecs[ecs.length-1];
        runingEC.variableEnvironment[node.children[1].name]
    },
    ExpressionStatement(node){
        return evaluate(node.children[0]); 
    },
    Expression(node){
        return evaluate(node.children[0]);
      },
      AdditiveExpression(node){
        if(node.children.length === 1){
            return evaluate(node.children[0]);
        }else{
            
            // todo
        }
        
      },
      MuliplicativeExpression(node){
        if(node.children.length === 1){
            return evaluate(node.children[0]);
        }else{
           
            // todo
        }
        
      },
      PrimaryExpression(node){
        if(node.children.length === 1){
            return evaluate(node.children[0]);
        }
      },
      Literial(node){
        return evaluate(node.children[0]);
      },
      NumbericLiteral(node){
        let str = node.value;
        let l = str.length;
        let value = 0;
        let n = 10;
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
            let c = str.charCodeAt(str.length - l - 1);
            if (c >= "a".charCodeAt(0)) {
              c = c - "a".charCodeAt(0) + 10;
            } else if (c >= "A".charCodeAt(0)) {
              c = c - "A".charCodeAt(0) + 10;
            } else if (c >= "0".charCodeAt(0)) {
              c = c - "0".charCodeAt(0);
            }
            value = value * n + c;
          }
          console.log(value)
          return Number(node.value)
      },
      StringLiteral(node) {
        let i = 1;
        let result = [];
    
        for (let i = 1; i < node.value.length - 1; i++) {
          if (node.value[i] === "\\") {
            ++i;
            let c = node.value[i];
            let map = {
              "\"": "\"",
              "\'": "\'",
              "\\": "\\",
              "0": String.fromCharCode(0x0000),
              "b": String.fromCharCode(0x0008),
              "f": String.fromCharCode(0x000c),
              "n": String.fromCharCode(0x000a),
              "r": String.fromCharCode(0x000d),
              "t": String.fromCharCode(0x0009),
              "v": String.fromCharCode(0x000b),
            };
            if (c in map) {
              result.push(map[c]);
            } else {
              result.push(c);
            }
          } else {
            result.push(node.value[i]);
          }
        }
        console.log(result)
      },
      ObjectLiteral(node) {
        if (node.children.length === 2) {
          return {};
        }
        if (node.children.length === 3) {
    
          let object = new new Map();
            this.PropertyList(node.children[1], object);
          return object;
        }
      },
      PropertyList(node, object) {
        if (node.children.length === 1) {
          this.Property(node.children[0], object);
        } else {
          this.PropertyList(node.children[0], object);
          this.Property(node.children[2], object)
        }
      },
      Property(node, object) {
        let name;
        if (node.children[0].type === "Identifier") {
          name = node.children[0].name;
        } else if (node.children[0].type === "StringLiteral") {
          name = evaluate(node.children[0]);
        }
        object.set(name, {
          value: evaluate(node.children[2]),
          writable: true,
          enumerable: true,
          configable: true,
        })
      },
      AssignmentExpression(node){
        if (node.children.length === 1) {
            return evaluate(node.children[0]);
        }
        let left = evaluate(node.children[0]);
        let right = evaluate(node.children[2]);
        left.set(right)
      },
      Identifier(node) {
        let runingEC = ecs[ecs.length-1];
        return new Reference(
            runingEC.lexicalEnvironment,
            node.name
            );
    },
      BooleanLiteral(node) {
        if (node.value === "false") {
          return false;
        } else {
          return true;
        }
      },
      NullLiteral() {
        return null;
      }

}
let realm = new Realm()
let ecs = [new ExecutionContext()]
function evaluate(node) {
  // console.log(node)
    if (evaluator[node.type]) {
        return evaluator[node.type](node);
    }
}

////////////////////////
let source = `
"abc";
`;

// let tree = parse(source);
// console.log(tree)
// // evaluate(tree);
// console.log(evaluate(tree))
window.toyjs={
    evaluate, parse
}