"use strict";

var _HelloWorld = _interopRequireDefault(require("./HelloWorld.vue"));

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

new _vue["default"]({
  el: "#app",
  render: function render(h) {
    return h(_HelloWorld["default"]);
  }
});