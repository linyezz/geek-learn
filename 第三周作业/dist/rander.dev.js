"use strict";

var images = require('images');

function render(viewport, element) {
  if (element.style) {
    var img = images(element.style.width, element.style.height);

    if (element.style['background-color']) {
      var color = element.style['background-color'] || 'rgb(0,0,0)';
      color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }

  if (element.children && element.children.length > 0) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = element.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var child = _step.value;
        render(viewport, child);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
}

module.exports = render;