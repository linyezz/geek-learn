"use strict";

/**
 * 7. 状态机 | 使用状态机处理字符串（二）
 * 使用状态机完成'abababx'的处理
 */
function match(str) {
  var state = start;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;
      state = state(i);
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

  return state == end;
}

function end(i) {
  return end;
}

function start(i) {
  if (i == 'a') {
    return findA;
  } else {
    return start;
  }
}

function findA(i) {
  if (i == 'b') {
    return findB;
  } else {
    return start(i);
  }
}

function findB(i) {
  if (i == 'a') {
    return findC;
  } else {
    return start(i);
  }
}

function findC(i) {
  if (i == 'b') {
    return findD;
  } else {
    return start(i);
  }
}

function findD(i) {
  if (i == 'a') {
    return findE;
  } else {
    return start(i);
  }
}

function findE(i) {
  if (i == 'b') {
    return findF;
  } else {
    return start(i);
  }
}

function findF(i) {
  if (i == 'x') {
    return end;
  } else {
    return start(i);
  }
}

console.log(match('abababdabxabababxababddab'));