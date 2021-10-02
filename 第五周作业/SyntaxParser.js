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
        ['FunctionDecaration']
    ],
    ExpressionStatement: [
        ['Expression', ':']
    ],
    Expression: [
        ['AddtiveExpression']
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
    AddtiveExpression: [
        ['MuliplicativeExpression'],
        ['AddtiveExpression', '+', 'MuliplicativeExpression'],
        ['AddtiveExpression', '-', 'MuliplicativeExpression']
    ],
    MuliplicativeExpression: [
        ['PrimaryExpression'],
        ['MuliplicativeExpression', '*', 'PrimaryExpression'],
        ['MuliplicativeExpression', '/', 'PrimaryExpression']
    ],
    PrimaryExpression: [
        ['(', 'EXpression', ')'],
        ['Literial'],
        ['Identifier']
    ],
    Literial: [
        ['Number'],
        ['String'],
        ['Boolean'],
        ['Null'],
        ['RegularExpression']
    ]
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
        if (hash[JSON.stringify(state[symbol])])
            state[symbol] = hash[JSON.stringify(state[symbol])];
        else closure(state[symbol]);
    }
}

closure(start);

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
        shift(symbol);
    }
    return reduce();
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
        console.log('declare variable ' + node.children[1].name)
    },
    EOF() {
        return null;
    }
}

function evaluate(node) {
  // console.log(node)
    if (evaluator[node.type]) {
        return evaluator[node.type](node);
    }
}

////////////////////////
let source = `
let a ;
var b ;
const c ;
function d (){}
`;
let tree = parse(source);
console.log(tree)
// evaluate(tree);
console.log(evaluate(tree))