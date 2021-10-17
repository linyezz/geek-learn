"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Realm = exports.Reference = exports.EnvironmentRecord = exports.ExecutionContext = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExecutionContext = function ExecutionContext(realm, lexicalEnvironment, variableEnvironment) {
  _classCallCheck(this, ExecutionContext);

  variableEnvironment = variableEnvironment || lexicalEnvironment;
  this.lexicalEnvironment = lexicalEnvironment;
  this.variableEnvironment = variableEnvironment;
  this.realm = realm;
};

exports.ExecutionContext = ExecutionContext;

var EnvironmentRecord = function EnvironmentRecord() {
  _classCallCheck(this, EnvironmentRecord);

  this.outer = null;
  this.variables = new Map();
  this.thisValue;
};

exports.EnvironmentRecord = EnvironmentRecord;

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

exports.Reference = Reference;

var Realm = function Realm() {
  _classCallCheck(this, Realm);

  this.global = new Map(), this.object = new Map(), this.object.call = function () {};
  this.object_prototype = new Map();
};

exports.Realm = Realm;