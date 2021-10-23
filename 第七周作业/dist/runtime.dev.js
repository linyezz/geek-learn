"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompletionRecord = exports.Realm = exports.JSSymbol = exports.JSUndefined = exports.JSNull = exports.JSObject = exports.JSBoolean = exports.JSString = exports.JSNumber = exports.JSValue = exports.Reference = exports.ObjectEnvironmentRecord = exports.EnvironmentRecord = exports.ExecutionContext = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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

var EnvironmentRecord =
/*#__PURE__*/
function () {
  function EnvironmentRecord(outer) {
    _classCallCheck(this, EnvironmentRecord);

    this.outer = outer;
    this.variables = new Map();
  }

  _createClass(EnvironmentRecord, [{
    key: "add",
    value: function add(name) {
      this.variables.set(name, new JSUndefined());
    }
  }, {
    key: "get",
    value: function get(name) {
      if (this.variables.has(name)) {
        return this.variables.get(name);
      } else if (this.outer) {
        return this.outer.get(name);
      } else {
        return JSUndefined;
      }
    }
  }, {
    key: "set",
    value: function set(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new JSUndefined();

      if (this.variables.has(name)) {
        return this.variables.set(name, value);
      } else if (this.outer) {
        return this.outer.set(name, value);
      } else {
        return this.variables.set(name, value);
      }
    }
  }]);

  return EnvironmentRecord;
}();

exports.EnvironmentRecord = EnvironmentRecord;

var ObjectEnvironmentRecord =
/*#__PURE__*/
function () {
  function ObjectEnvironmentRecord(object, outer) {
    _classCallCheck(this, ObjectEnvironmentRecord);

    this.object = object;
    this.outer = outer;
  }

  _createClass(ObjectEnvironmentRecord, [{
    key: "add",
    value: function add(name) {
      this.object.set(name, new JSUndefined());
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.object.get(name); //TOD0:with statement need outer
    }
  }, {
    key: "set",
    value: function set(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new JSUndefined();
      this.object.set(name, value); //TODO:with statement need outer
    }
  }]);

  return ObjectEnvironmentRecord;
}();

exports.ObjectEnvironmentRecord = ObjectEnvironmentRecord;

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
      this.object.set(this.property, value); // this.object[this.property] = value;
    }
  }, {
    key: "get",
    value: function get() {
      return this.object.get(this.property); // return this.object[this.property]
    }
  }]);

  return Reference;
}(); // number string noolean object null undefined symbol


exports.Reference = Reference;

var JSValue =
/*#__PURE__*/
function () {
  function JSValue() {
    _classCallCheck(this, JSValue);
  }

  _createClass(JSValue, [{
    key: "type",
    get: function get() {
      if (this.constructor === JSNumber) {
        return "number";
      }

      if (this.constructor === JSString) {
        return "string";
      }

      if (this.constructor === JSBoolean) {
        return "boolean";
      }

      if (this.constructor === JSObject) {
        return "object";
      }

      if (this.constructor === JSNull) {
        return "null";
      }

      if (this.constructor === JSSymbol) {
        return "symbol";
      }

      return "undefined";
    }
  }]);

  return JSValue;
}();

exports.JSValue = JSValue;

var JSNumber =
/*#__PURE__*/
function (_JSValue) {
  _inherits(JSNumber, _JSValue);

  function JSNumber(value) {
    var _this;

    _classCallCheck(this, JSNumber);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(JSNumber).call(this));
    _this.memory = new ArrayBuffer(8);
    if (arguments.length) new Float64Array(_this.memory)[0] = value;else new Float64Array(_this.memory)[0] = 0;
    return _this;
  }

  _createClass(JSNumber, [{
    key: "toString",
    value: function toString() {}
  }, {
    key: "toNumber",
    value: function toNumber() {
      return this;
    }
  }, {
    key: "toBoolean",
    value: function toBoolean() {
      if (new Float64Array(this.memory)[0] === 0) {
        return new JSBoolean(false);
      } else {
        return new JSBoolean(true);
      }
    }
  }, {
    key: "toObject",
    value: function toObject() {// 先不做
    }
  }, {
    key: "value",
    get: function get() {
      return new Float64Array(this.memory)[0];
    }
  }]);

  return JSNumber;
}(JSValue);

exports.JSNumber = JSNumber;

var JSString =
/*#__PURE__*/
function (_JSValue2) {
  _inherits(JSString, _JSValue2);

  function JSString(characters) {
    var _this2;

    _classCallCheck(this, JSString);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(JSString).call(this)); // this.memory = new ArrayBuffer(characters.length * 2);

    _this2.characters = characters;
    return _this2;
  }

  _createClass(JSString, [{
    key: "toString",
    value: function toString() {
      return this;
    }
  }, {
    key: "toNumber",
    value: function toNumber() {}
  }, {
    key: "toBoolean",
    value: function toBoolean() {
      if (new Float64Array(this.memory)[0] === 0) {
        return new JSBoolean(false);
      } else {
        return new JSBoolean(true);
      }
    }
  }]);

  return JSString;
}(JSValue);

exports.JSString = JSString;

var JSBoolean =
/*#__PURE__*/
function (_JSValue3) {
  _inherits(JSBoolean, _JSValue3);

  function JSBoolean(value) {
    var _this3;

    _classCallCheck(this, JSBoolean);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(JSBoolean).call(this));
    _this3.value = value || false;
    return _this3;
  }

  _createClass(JSBoolean, [{
    key: "toString",
    value: function toString() {
      if (this.value) return new JSString(["t", "r", "u", "e"]);else return new JSString(["f", "a", "l", "s", "e"]);
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      if (this.value) return new JSNumber(1);else return new JSNumber(0);
    }
  }, {
    key: "toBoolean",
    value: function toBoolean() {
      return this;
    }
  }]);

  return JSBoolean;
}(JSValue);

exports.JSBoolean = JSBoolean;

var JSObject =
/*#__PURE__*/
function (_JSValue4) {
  _inherits(JSObject, _JSValue4);

  function JSObject(proto) {
    var _this4;

    _classCallCheck(this, JSObject);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(JSObject).call(this));
    _this4.properties = new Map();
    _this4.prototype = proto || null;
    return _this4;
  }

  _createClass(JSObject, [{
    key: "set",
    value: function set(name, value) {
      //TODO: writable etc.
      this.setProperty(name, {
        value: value,
        enumerable: true,
        configurable: true,
        writeable: true
      });
    }
  }, {
    key: "get",
    value: function get(name) {
      //TODO : prototype chain && getter
      return this.getProperty(name).value;
    }
  }, {
    key: "setProperty",
    value: function setProperty(name, attributes) {
      this.properties.set(name, attributes);
    }
  }, {
    key: "getProperty",
    value: function getProperty(name) {
      return this.properties.get(name);
    }
  }, {
    key: "setPrototype",
    value: function setPrototype(proto) {
      return this.prototype = null;
    }
  }]);

  return JSObject;
}(JSValue);

exports.JSObject = JSObject;

var JSNull =
/*#__PURE__*/
function (_JSValue5) {
  _inherits(JSNull, _JSValue5);

  function JSNull() {
    _classCallCheck(this, JSNull);

    return _possibleConstructorReturn(this, _getPrototypeOf(JSNull).apply(this, arguments));
  }

  _createClass(JSNull, [{
    key: "toString",
    value: function toString() {
      return new JSString(["n", "u", "l", "l"]);
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      return new JSNumber(0);
    }
  }, {
    key: "toBoolean",
    value: function toBoolean() {
      return new JSBoolean(false);
    }
  }]);

  return JSNull;
}(JSValue);

exports.JSNull = JSNull;

var JSUndefined =
/*#__PURE__*/
function (_JSValue6) {
  _inherits(JSUndefined, _JSValue6);

  function JSUndefined() {
    _classCallCheck(this, JSUndefined);

    return _possibleConstructorReturn(this, _getPrototypeOf(JSUndefined).apply(this, arguments));
  }

  _createClass(JSUndefined, [{
    key: "toString",
    value: function toString() {
      return new JSString(["u", "n", "d", "e", "f", "i", "n", "e"]);
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      return new JSNumber(NaN);
    }
  }, {
    key: "toBoolean",
    value: function toBoolean() {
      return new JSBoolean(false);
    }
  }]);

  return JSUndefined;
}(JSValue);

exports.JSUndefined = JSUndefined;

var JSSymbol =
/*#__PURE__*/
function (_JSValue7) {
  _inherits(JSSymbol, _JSValue7);

  function JSSymbol(name) {
    var _this5;

    _classCallCheck(this, JSSymbol);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(JSSymbol).call(this));
    _this5.name = name || "";
    return _this5;
  }

  return JSSymbol;
}(JSValue);

exports.JSSymbol = JSSymbol;

var Realm = function Realm() {
  _classCallCheck(this, Realm);

  this.global = new Map(), this.Object = new Map(), this.Object.call = function () {};
  this.Object_prototype = new Map();
};

exports.Realm = Realm;

var CompletionRecord = function CompletionRecord(type, value, target) {
  _classCallCheck(this, CompletionRecord);

  this.type = type || "normal";
  this.value = value || new JSUndefined();
  this.target = target || null;
};

exports.CompletionRecord = CompletionRecord;