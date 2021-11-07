"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animation = exports.TimeLine = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TICK = Symbol("tick");
var TICK_HANDLER = Symbol("tick-handler");
var ANIMATIONS = Symbol("animations");
var START_TIME = Symbol("startTime");
var PAUSE_START = Symbol("pauseStart");
var PAUSE_TIME = Symbol("startTime");

var TimeLine =
/*#__PURE__*/
function () {
  function TimeLine() {
    _classCallCheck(this, TimeLine);

    // 添加状态管理
    this.state = "Inited";
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  _createClass(TimeLine, [{
    key: "start",
    value: function start() {
      var _this = this;

      if (this.state != "Inited") {
        return;
      }

      this.state = 'started';
      this.startTime = Date.now();
      this[PAUSE_TIME] = 0;

      this[TICK] = function () {
        var now = Date.now();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this[ANIMATIONS][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var animation = _step.value;
            var t = void 0; // 判断delayTime延时

            if (_this[START_TIME].get(animation) < _this.startTime) t = now - _this.startTime - _this[PAUSE_TIME] - animation.delay;else t = now - _this[START_TIME].get(animation) - _this[PAUSE_TIME] - animation.delay;

            if (animation.duration < t) {
              _this[ANIMATIONS]["delete"](animation);

              t = animation.duration;
            }

            if (t > 0) animation.receive(t);
          } // if(this[ANIMATIONS].size){
          //   requestAnimationFrame(this[TICK])
          // }
          // console.log('tick')

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

        _this[TICK_HANDLER] = requestAnimationFrame(_this[TICK]);
      };

      this[TICK]();
    } // set rate(){
    // }
    // get rate(){
    // }
    // 动画暂停

  }, {
    key: "pause",
    value: function pause() {
      if (this.state != "started") {
        return;
      }

      this.state = "paused"; // 记录暂停开始时间

      this[PAUSE_START] = Date.now();
      cancelAnimationFrame(this[TICK_HANDLER]);
    } // 动画重启

  }, {
    key: "resume",
    value: function resume() {
      if (this.state != "paused") {
        return;
      }

      this.state = "started";
      this[PAUSE_TIME] = Date.now() - this[PAUSE_START];
      this[TICK]();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.pause();
      this.state = "Inited";
      this.startTime = Date.now();
      this[PAUSE_TIME] = 0;
      this[ANIMATIONS] = new Set();
      this[START_TIME] = new Map();
      this[PAUSE_START] = 0;
      this[TICK_HANDLER] = null;
    }
  }, {
    key: "add",
    value: function add(animation, startTime) {
      this[ANIMATIONS].add(animation);

      if (arguments.length < 2) {
        startTime = Date.now();
      }

      this[START_TIME].set(animation, startTime);
    }
  }]);

  return TimeLine;
}();

exports.TimeLine = TimeLine;

var Animation =
/*#__PURE__*/
function () {
  function Animation(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    _classCallCheck(this, Animation);

    timingFunction = timingFunction || function (v) {
      return v;
    };

    template = template || function (v) {
      return v;
    };

    this.object = object;
    this.template = template;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }

  _createClass(Animation, [{
    key: "receive",
    value: function receive(time) {
      var range = this.endValue - this.startValue;
      var progress = this.timingFunction(time / this.duration);
      this.object[this.property] = this.template(this.startValue + range * progress);
    }
  }]);

  return Animation;
}();

exports.Animation = Animation;