"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "STATE", {
  enumerable: true,
  get: function get() {
    return _framework2.STATE;
  }
});
Object.defineProperty(exports, "ATTRIBUTE", {
  enumerable: true,
  get: function get() {
    return _framework2.ATTRIBUTE;
  }
});
exports.Carousel = void 0;

var _framework = require("./framework.js");

var _gesture = require("./gesture.js");

var _animation = require("./animation.js");

var _cubicBezier = require("./cubicBezier.js");

var _framework2 = require("./framework");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Carousel =
/*#__PURE__*/
function (_Component) {
  _inherits(Carousel, _Component);

  function Carousel() {
    _classCallCheck(this, Carousel);

    // this.root = document.createElement('div');
    return _possibleConstructorReturn(this, _getPrototypeOf(Carousel).call(this)); // this.attributes = Object.create(null)
  } // setAttribute(name,value){
  //   this.attributes[name] = value;
  //   // this.root.setAttribute(name,value);
  // }


  _createClass(Carousel, [{
    key: "rander",
    value: function rander() {
      var _this = this;

      this.root = document.createElement('div');
      this.root.className = 'carousel';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this[ATTRIBUTE].src[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var record = _step.value;
          var child = document.createElement("div");
          child.style.backgroundImage = "url(".concat(record.img, ")");
          this.root.appendChild(child);
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

      this[STATE].position = 0;
      (0, _gesture.enableGesture)(this.root);
      var timeline = new _animation.TimeLine();
      timeline.start();
      var handler = null;
      var children = this.root.children;
      var t = 0;
      var ax = 0; // let position = 0;

      this.root.addEventListener("start", function (event) {
        timeLine.pause();
        clearInterval(handler);
        var progress = (Date.now() - t) / 500;
        ax = (0, _cubicBezier.ease)(progress) * 500 - 500;
      });
      this.root.addEventListener("tap", function (event) {
        _this.triggerEvent('click', {
          data: _this[ATTRIBUTE].src[_this[STATE].position],
          position: _this[STATE].position
        });
      });
      this.root.addEventListener("pan", function (event) {
        var x = event.clientX - event.startX;
        var current = position - (x - x % 500) / 500;

        for (var _i = 0, _arr = [-1, 0, 1]; _i < _arr.length; _i++) {
          var offset = _arr[_i];
          var pos = current + offset;
          pos = (pos % children.length + children.length) % children.length;
          var child = children[pos];
          child.style.transition = "none";
          child.style.transform = "translateX(".concat(-pos * 500 + offset * 500 + x % 500, "px)");
        }
      });
      this.root.addEventListener("panend", function (event) {
        var x = event.clientX - event.startX;
        position = Math.round(position - x / 500);

        for (var _i2 = 0, _arr2 = [0, -Math.sign(Math.round(position - x / 500) - x + 250 * Math.sign(x))]; _i2 < _arr2.length; _i2++) {
          var offset = _arr2[_i2];
          var pos = position + offset;
          pos = (pos + children.length) % children.length;
          var child = children[pos];
          child.style.transition = "";
          child.style.transform = "translateX(".concat(-pos * 500 + offset * 500, "px)");
        }
      });
      this.root.addEventListener("panstart", function (event) {
        var x = event.clientX - event.startX - ax;
        var current = _this[STATE].position - (x - x % 500) / 500;

        for (var _i3 = 0, _arr3 = [-1, 0, 1]; _i3 < _arr3.length; _i3++) {
          var offset = _arr3[_i3];
          var pos = current + offset;
          pos = (pos % children.length + children.length) % children.length;
          children[pos].style.transition = "none";
          children[pos].style.transform = "translateX(".concat(-pos * 500 + offset * 500 + x % 500, "px)");
        }
      });
      this.root.addEventListener("end", function (event) {
        timeLine.reset();
        timeLine.start();
        var x = event.clientX - event.startX - ax;
        var current = _this[STATE].position - (x - x % 500) / 500;
        var direction = Math.round(x % 500 / 500);

        if (event.isFlick) {
          if (event.velocity < 0) {
            direction = Math.ceil(x % 500 / 500);
          } else {
            direction = Math.floor(x % 500 / 500);
          }
        }

        for (var _i4 = 0, _arr4 = [-1, 0, 1]; _i4 < _arr4.length; _i4++) {
          var offset = _arr4[_i4];
          var pos = current + offset;
          pos = (pos % children.length + children.length) % children.length;
          children[pos].style.transition = "none";
          timeLine.add(new _animation.Animation(children[pos].style, 'transform', -pos * 500 + offset * 500 + x % 500, -pos * 500 + offset * 500 + direction * 500, 500, 0, _cubicBezier.ease, function (v) {
            return "translateX(".concat(v, "px)");
          }));
        }

        _this[STATE].position = _this[STATE].position - (x - x % 500) / 500 - direction;
        _this[STATE].position = (_this[STATE].position % children.length + children.length) % children.length;

        _this.triggerEvent("change", {
          position: _this[STATE].position
        });
      });

      var nextPicture = function nextPicture() {
        var nextIndex = (_this[STATE].position + 1) % children.length;
        var current = children[_this[STATE].position];
        var next = children[nextIndex];
        timeLine.add(new _animation.Animation(current.style, 'transform', -_this[STATE].position * 500, -500 - _this[STATE].position * 500, 500, 0, _cubicBezier.ease, function (v) {
          return "translateX(".concat(v, "px)");
        }));
        timeLine.add(new _animation.Animation(next.style, 'transform', 500 - nextIndex * 500, -nextIndex * 500, 500, 0, _cubicBezier.ease, function (v) {
          return "translateX(".concat(v, "px)");
        }));
        _this[STATE].position = nextIndex;

        _this.triggerEvent("change", {
          position: _this[STATE].position
        });
      };

      handler = setInterval(nextPicture, 3000);
      return this.root;
      /**
       *   this.root.addEventListener("mousedown",event => {
         let startX = event.clientX
         let children =  this.root.children;
         let move = event => {
           let x = event.clientX-startX
           let current = position - ((x-x%500)/500);
           for(let offset of [-1,0,1]){
             let pos = current + offset;
             pos = (pos + children.length) % children.length;
             let child = children[pos];
             child.style.transition = "none"
             child.style.transform = `translateX(${-pos * 500 +  offset*500+x%500}px)`
           }
           // for(let child of children){
           //   child.style.transition = "none"
           //   child.style.transform = `translateX(${-position * 500 + x}px)`
           // }
         }
         let up = event => {
           let x = event.clientX-startX
           position = Math.round(position - x/500)
           for(let offset of [0,- Math.sign(Math.round(position - x/500)-x+250*Math.sign(x))]){
             let pos = position + offset;
             pos = (pos + children.length) % children.length;
             let child = children[pos];
             child.style.transition = ""
             child.style.transform = `translateX(${-pos * 500 +  offset*500}px)`
           }
           document.removeEventListener('mousemove',move)
           document.removeEventListener('mouseup',up)
         }
         document.addEventListener("mousemove",move)
         document.addEventListener("mouseup",up)
       })
      
       let currentIndex = 0;
       setInterval(()=>{
        let childen =  this.root.children;
        let nextIndex = (currentIndex+1)%childen.length;
        let current = childen[currentIndex];
        let next = childen[nextIndex]
        next.style.transition = "none"
        next.style.transform = `translateX(${100-nextIndex*100}%)`
          setTimeout(()=>{
         next.style.transition = "";
         current.style.transform = `translateX(${-100-currentIndex*100}%)`;
         next.style.transform = `translateX(${- nextIndex*100}%)`;
         currentIndex = nextIndex;
        },16)
       //  for(let child of childen){
       //   child.style.transform = `translateX(-${current*100}%)`
       //  }
       },2000)*/
      // return this.root;
    } // mountTo(parent){
    //   parent.appendChild(this.rander());
    // }

  }]);

  return Carousel;
}(_framework.Component);

exports.Carousel = Carousel;