"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.creatElement = creatElement;
exports.Component = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function creatElement(type, attributes) {
  var element;

  if (typeof type === "string") {
    // element =  document.createElement(type);
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  for (var name in attributes) {
    element.setAttribute(name, attributes[name]);
  }

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  for (var _i = 0, _children = children; _i < _children.length; _i++) {
    var child = _children[_i];

    if (typeof child === "string") {
      // child = document.createTextNode(child)
      child = new TextWrapper(child);
    }

    element.appendChild(child);
  }

  return element;
}

var Component =
/*#__PURE__*/
function () {
  function Component(type) {// this.root = this.rander()

    _classCallCheck(this, Component);
  }

  _createClass(Component, [{
    key: "setAttribute",
    value: function setAttribute(name, value) {
      this.root.setAttribute(name, value);
    }
  }, {
    key: "appendChild",
    value: function appendChild(child) {
      // this.root.appendChild(child);
      child.mountTo(this.root);
    }
  }, {
    key: "mountTo",
    value: function mountTo(parent) {
      // this.root = document.createElement('div');
      parent.appendChild(this.root);
    }
  }]);

  return Component;
}();

exports.Component = Component;

var ElementWrapper =
/*#__PURE__*/
function (_Component) {
  _inherits(ElementWrapper, _Component);

  function ElementWrapper(type) {
    var _this;

    _classCallCheck(this, ElementWrapper);

    _this.root = document.createElement(type);
    return _possibleConstructorReturn(_this);
  }

  return ElementWrapper;
}(Component);

var TextWrapper =
/*#__PURE__*/
function (_Component2) {
  _inherits(TextWrapper, _Component2);

  function TextWrapper(content) {
    var _this2;

    _classCallCheck(this, TextWrapper);

    _this2.root = document.createTextNode(content);
    return _possibleConstructorReturn(_this2);
  }

  return TextWrapper;
}(Component);