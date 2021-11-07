"use strict";

var _animation = require("./animation.js");

var _cubicBezier = require("./cubicBezier.js");

var tl = new _animation.TimeLine();
tl.add(new _animation.Animation(document.querySelector("#el").style, "transform", 0, 500, 5000, 0, _cubicBezier.ease, function (v) {
  return "translateX(".concat(v, "px)");
}));
tl.start();
document.querySelector("#btn-pause").addEventListener("click", function () {
  return tl.pause();
});
document.querySelector("#btn-resume").addEventListener("click", function () {
  return tl.resume();
});
document.querySelector("#el2").style.transition = 'transform ease 5s';
document.querySelector("#el2").style.transform = "translateX(500px)";