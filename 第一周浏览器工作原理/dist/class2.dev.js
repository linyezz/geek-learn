"use strict";

/**
 * 4. 状态机 | 不使用状态机处理字符串（二）
 * 判断字符串中的'ab'
 */
function match(str) {
  // 方法1：用indexof
  // return str.indexOf('ab')<0? false:true;
  // 方法2： 用includs
  return str.includes('ab');
} // 老师的实现


function tMatch(str) {
  var findA = false;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;

      if (i == 'a') {
        findA = true;
      } else if (findA && i == 'b') {
        return true;
      } else {
        findA = false;
      }
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

  return false;
}