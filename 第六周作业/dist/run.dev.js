"use strict";

var _evaluator = require("./evaluator.js");

var _SyntaxParser = require("./SyntaxParser.js");

document.getElementById("run").addEventListener('click', function (event) {
  var r = new _evaluator.Evaluator().evaluate((0, _SyntaxParser.parse)(document.getElementById("text").value));
  console.log(r);
});