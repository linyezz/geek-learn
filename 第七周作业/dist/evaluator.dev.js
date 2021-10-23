"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Evaluator = void 0;

var _runtime = require("./runtime.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// class Runtime {
//   constructor(){
//     this.realm = new Realm()
//      this.ecs = [new ExecutionContext];
//      this.globalObject
//   }
// }
var Evaluator =
/*#__PURE__*/
function () {
  function Evaluator() {
    _classCallCheck(this, Evaluator);

    this.realm = new _runtime.Realm();
    this.globalObject = new _runtime.JSObject();
    this.globalObject.set("log", new _runtime.JSObject());

    this.globalObject.get("log").call = function (args) {
      console.log(args);
    };

    this.ecs = [new _runtime.ExecutionContext(this.realm, new _runtime.ObjectEnvironmentRecord(this.globalObject), new _runtime.ObjectEnvironmentRecord(this.globalObject))];
  }

  _createClass(Evaluator, [{
    key: "evaluateModule",
    value: function evaluateModule(node) {
      var globalEC = this.ecs[0];
      var newEC = new _runtime.ExecutionContext(this.realm, new _runtime.EnvironmentRecord(globalEC.lexicalEnvironment), new _runtime.EnvironmentRecord(globalEC.lexicalEnvironment));
      this.ecs.push(newEC);
      var result = this.evaluate(node);
      this.ecs.pop();
      return result;
    }
  }, {
    key: "evaluate",
    value: function evaluate(node) {
      if (this[node.type]) {
        var r = this[node.type](node);
        return r;
      }
    }
  }, {
    key: "Program",
    value: function Program(node) {
      return this.evaluate(node.children[0]);
    }
  }, {
    key: "IfStatement",
    value: function IfStatement(node) {
      var condition = this.evaluate(node.children[2]);

      if (condition instanceof _runtime.Reference) {
        condition = condition.get();
      }

      if (condition.toBoolean().value) {
        return this.evaluate(node.children[4]);
      }
    }
  }, {
    key: "WhileStatement",
    value: function WhileStatement(node) {
      while (true) {
        var condition = this.evaluate(node.children[2]);

        if (condition instanceof _runtime.Reference) {
          condition = condition.get();
        }

        if (condition.toBoolean().value) {
          var record = this.evaluate(node.children[4]);
          if (record.type === "continue") continue;
          if (record.type === "break") return new _runtime.CompletionRecord("normal");
        } else {
          return new _runtime.CompletionRecord("normal");
        }
      }
    }
  }, {
    key: "BreakStatement",
    value: function BreakStatement(node) {
      return new _runtime.CompletionRecord("break");
    }
  }, {
    key: "ContinueStatement",
    value: function ContinueStatement(node) {
      return new _runtime.CompletionRecord("continue");
    }
  }, {
    key: "StatementList",
    value: function StatementList(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      } else {
        var record = this.evaluate(node.children[0]); // return this.evaluate(node.children[1]);

        if (record.type === "normal") return this.evaluate(node.children[1]);else return record;
      }
    }
  }, {
    key: "Statement",
    value: function Statement(node) {
      return this.evaluate(node.children[0]);
    }
  }, {
    key: "VariableDecaration",
    value: function VariableDecaration(node) {
      // console.log('declare variable ' + node.children[1].name)
      var runingEC = this.ecs[this.ecs.length - 1]; // runingEC.variableEnvironment.add(node.children[1].name); 

      runingEC.lexicalEnvironment.add(node.children[1].name);
      return new _runtime.CompletionRecord("normal", new _runtime.JSUndefined());
    }
  }, {
    key: "ExpressionStatement",
    value: function ExpressionStatement(node) {
      //  this.evaluate(node.children[0]); 
      var r = this.evaluate(node.children[0]);
      if (r instanceof _runtime.Reference) r = r.get();
      return new _runtime.CompletionRecord("normal", r);
    }
  }, {
    key: "Expression",
    value: function Expression(node) {
      return this.evaluate(node.children[0]);
    }
  }, {
    key: "AdditiveExpression",
    value: function AdditiveExpression(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      } else {
        var left = this.evaluate(node.children[0]);
        var right = this.evaluate(node.children[2]);
        if (left instanceof _runtime.Reference) left = left.get();
        if (right instanceof _runtime.Reference) right = right.get();

        if (node.children[1].type === "+") {
          return new _runtime.JSNumber(left.value + right.value);
        }

        if (node.children[1].type === "-") {
          return new _runtime.JSNumber(left.value - right.value);
        }
      }
    }
  }, {
    key: "MuliplicativeExpression",
    value: function MuliplicativeExpression(node) {
      if (node.children.length === 1) return this.evaluate(node.children[0]);else {// TODO
      }
    }
  }, {
    key: "PrimaryExpression",
    value: function PrimaryExpression(node) {
      if (node.children.length === 1) return this.evaluate(node.children[0]);
    }
  }, {
    key: "Literal",
    value: function Literal(node) {
      return this.evaluate(node.children[0]);
    }
  }, {
    key: "NumbericLiteral",
    value: function NumbericLiteral(node) {
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
      } else if (str.match(/^Ox/)) {
        n = 16;
        l -= 2;
      }

      while (l--) {
        var c = str.charCodeAt(str.length - l - 1);

        if (c >= 'a'.charCodeAt(0)) {
          c = c - 'a'.charCodeAt(0) + 10;
        } else if (c >= 'A'.charCodeAt(0)) {
          c = c - 'A'.charCodeAt(0) + 10;
        } else if (c >= '0'.charCodeAt(0)) {
          c = c - '0'.charCodeAt(0);
        }

        value = value * n + c;
      } //   return Number(node.value);


      return new _runtime.JSNumber(node.value);
    }
  }, {
    key: "StringLiteral",
    value: function StringLiteral(node) {
      var i = 1;
      var result = [];

      for (var _i = 1; _i < node.value.length - 1; _i++) {
        if (node.value[_i] === '\\') {
          ++_i;
          var c = node.value[_i];
          var map = {
            "\"": "\"",
            "\'": "\'",
            "\\": "\\",
            "0": String.fromCharCode(0x0000),
            "b": String.fromCharCode(0x0008),
            "f": String.fromCharCode(0x000C),
            "n": String.fromCharCode(0x000A),
            "r": String.fromCharCode(0x000D),
            "t": String.fromCharCode(0x0009),
            "v": String.fromCharCode(0x000B)
          };

          if (c in map) {
            result.push(map[c]);
          } else {
            result.push(c);
          }
        } else {
          result.push(node.value[_i]);
        }
      } //   console.log(result);
      // return new JSString(result.join(''));


      return new _runtime.JSString(result);
    }
  }, {
    key: "BooleanLiteral",
    value: function BooleanLiteral(node) {
      if (node.value == "false") return new _runtime.JSBoolean(false);else return new _runtime.JSBoolean(true);
    }
  }, {
    key: "NullLiteral",
    value: function NullLiteral() {
      return new _runtime.JSNull();
    }
  }, {
    key: "ObjectLiteral",
    value: function ObjectLiteral(node) {
      if (node.children.length === 2) {
        return {};
      }

      if (node.chi1dren.length === 3) {
        var object = new _runtime.JSObject();
        this.PropertyList(node.children[1], object);
        return object;
      }
    }
  }, {
    key: "PropertyList",
    value: function PropertyList(node, object) {
      if (node.children.length === 1) {
        this.Property(node.children[0], object);
      } else {
        this.PropertyList(node.children[0], object);
        this.Property(node.children[2], object);
      }
    }
  }, {
    key: "Property",
    value: function Property(node, object) {
      var name;

      if (node.children[0].type === "Identifier") {
        name = node.children[0].name;
      } else if (node.children[0].type === "StringLiteral") {
        name = this.evaluate(node.children[0]);
      }

      object.set(name, {
        value: this.evaluate(node.children[2]),
        writable: true,
        enumerable: true,
        configable: true
      });
    }
  }, {
    key: "AssignmentExpression",
    value: function AssignmentExpression(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      }

      var left = this.evaluate(node.children[0]);
      var right = this.evaluate(node.children[2]);
      left.set(right);
    }
  }, {
    key: "LogicalORExpression",
    value: function LogicalORExpression(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      }

      var result = this.evaluate(node.children[0]);

      if (result) {
        return result;
      } else {
        return this.evaluate(node.children[2]);
      }
    }
  }, {
    key: "LogicalANDExpression",
    value: function LogicalANDExpression(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      }

      var result = this.evaluate(node.children[0]);

      if (!result) {
        return result;
      } else {
        return this.evaluate(node.children[2]);
      }
    }
  }, {
    key: "LeftHandSideExpression",
    value: function LeftHandSideExpression(node) {
      return this.evaluate(node.children[0]);
    }
  }, {
    key: "NewExpression",
    value: function NewExpression(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      }

      if (node.children.length === 2) {
        var cls = this.evaluate(node.children[1]);
        return cls.construct();
        /*  let object = this.realm.Object.construct();
          let cls = this.evaluate(node.children[1]);
          let result = cls.call(object)
        //   return cls.construct();
        if(typeof result === 'object'){
            return result;
        }else{
            return object;
        }*/
      }
    }
  }, {
    key: "CallExpression",
    value: function CallExpression(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      }

      if (node.children.length === 2) {
        var func = this.evaluate(node.children[0]);
        var args = this.evaluate(node.children[1]);
        if (func instanceof _runtime.Reference) func = func.get();
        return func.call(args);
      }
    }
  }, {
    key: "MemberExpression",
    value: function MemberExpression(node) {
      if (node.children.length === 1) {
        return this.evaluate(node.children[0]);
      }

      if (node.children.length === 3) {
        // debugger;
        var obj = this.evaluate(node.children[0]).get();
        var prop = obj.get(node.children[2].name);
        if ("value" in prop) return prop.value;
        if ("get" in prop) return prop.get.call(obj);
      }
    }
  }, {
    key: "Identifier",
    value: function Identifier(node) {
      var runningEC = this.ecs[this.ecs.length - 1];
      return new _runtime.Reference(runningEC.lexicalEnvironment, node.name);
    }
  }, {
    key: "Arguments",
    value: function Arguments(node) {
      if (node.children.length === 2) return [];else return this.evaluate(node.children[1]);
    }
  }, {
    key: "ArgumentList",
    value: function ArgumentList(node) {
      if (node.children.length === 1) {
        var result = this.evaluate(node.children[0]);
        if (result instanceof _runtime.Reference) result = result.get();
        return [result];
      } else {
        var _result = this.evaluate(node.children[2]);

        if (_result instanceof _runtime.Reference) _result = _result.get();
        return this.evaluate(node.children[0]).concat(_result);
      }
    }
  }, {
    key: "Block",
    value: function Block(node) {
      if (node.children.length === 2) {
        return;
      }

      var runningEC = this.ecs[this.ecs.length - 1];
      var newEC = new _runtime.ExecutionContext(runningEC.realm, new _runtime.EnvironmentRecord(runningEC.lexicalEnvironment), runningEC.variableEnvironment);
      this.ecs.push(newEC);
      var result = this.evaluate(node.children[1]);
      this.ecs.pop(newEC);
      return result;
    }
  }, {
    key: "FunctionDecaration",
    value: function FunctionDecaration(node) {
      var _this = this;

      var name = node.children[1].name;
      var code = node.children[node.children.length - 2];
      var func = new _runtime.JSObject();

      func.call = function (args) {
        var newEC = new _runtime.ExecutionContext(_this.realm, new _runtime.EnvironmentRecord(func.environment), new _runtime.EnvironmentRecord(func.environment));

        _this.ecs.push(newEC);

        _this.evaluate(code);

        _this.ecs.pop();
      };

      var runningEC = this.ecs[this.ecs.length - 1];
      runningEC.lexicalEnvironment.add(name);
      runningEC.lexicalEnvironment.set(name, func);
      func.environment = runningEC.lexicalEnvironment;
      return new _runtime.CompletionRecord("normal");
    }
  }]);

  return Evaluator;
}();

exports.Evaluator = Evaluator;