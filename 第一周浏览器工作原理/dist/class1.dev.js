"use strict";

/**
 * 3. 状态机 | 不使用状态机处理字符串（一）作业
 * 判断字符串中的'a'
 */
function matchA(str) {
  // 方法1：用indexof
  // return str.indexOf('a')<0? false:true;
  // 方法2： 用includs
  // return str.includes('a');
  // 老师方法：
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;
      if (i == 'a') return true;
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