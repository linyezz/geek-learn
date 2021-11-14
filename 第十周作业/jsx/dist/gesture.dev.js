"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableGesture = enableGesture;
exports.Recognizer = exports.Listener = exports.Dispatch = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var isListeningMouse = false;
var element = document.documentElement;
var contexts = new Map();
/*element.addEventListener('mousedown',event=>{
  let context = Object.create(null)
  contexts.set("mouse"+ (1 << event.button), context)
  // event.button
  start(event,context)
  let mousemove = event => {
    let button = 1
    while(button <= event.buttons){
      if(button & event.buttons){
        // order of buttons & button property is not same
        let key;
        if(button === 2)
          key = 4
        else if( button === 4)
          key = 2
        else 
          key = button
        
        let context = contexts.get('mouse' + key)
        move(event, context)
      }
      
      button = button << 1
    }
  }

  let mouseup = event=>{
    let context = contexts.get('mouse' + (1 << event.button))
    end(event, context)
    contexts.delete('mouse' + (1 << event.button))

    if(event.buttons === 0){
      document.removeEventListener("mousemove", mousemove)
      document.removeEventListener("mouseup", mouseup)
      isListeningMouse = false
    }
    
  }

  if(!isListeningMouse){
    document.addEventListener("mousemove", mousemove)
    document.addEventListener("mouseup", mouseup)

    isListeningMouse = true
  }
  // element.addEventListener('mousemove',mousemove)
  // element.addEventListener('mouseup',mouseup)
})



element.addEventListener("touchstart",event=>{
  for(let touch of event.changedTouches){
    let context = Object.create(null)
    contexts.set(touch.identifier,context)
    start(touch,context)
  }
})
element.addEventListener("touchmove",event=>{
  for(let touch of event.changedTouches){
    let context = contexts.get(touch.identifier)
    move(touch,context)
  }
})
element.addEventListener("touchend",event=>{
  for(let touch of event.changedTouches){
    let context = contexts.get(touch.identifier)
    end(touch,context)
    contexts.delete(touch.identifier)
  }
})
element.addEventListener("touchcancel",event=>{
  for(let touch of event.changedTouches){
    let context = contexts.get(touch.identifier)
    cancel(touch,context)
  }
}) */
// let handler;
// let startX,startY;
// let isPan = false, isTap = true,isPress = false;
// let start = (point,context)=>{
//   context.startX = point.clientX,context.startY = point.clientY;
//   context.points = [{
//     t:Date.now(),
//     x:point.clientX,
//     y:point.clientY
//   }];
//   context.isPan = false;
//   context.isTap = true;
//   context.isPress = false
//   context.handler = setTimeout(()=>{
//     //press start
//     context.isTap = false;
//     context.isPan = false;
//     context.isPress = true;
//     context.handler = null;
//   },500)
// }
// let move = (point,context)=>{
//   let dx = point.clientX-context.startX, dy = point.clientY - context.startY;
//   // console.log(context)
//   if(!context.isPan && dx ** 2 + dy ** 2<100){
//     context.isPan = true;
//     context.isTap = false;
//     context.isPress = false
//     clearTimeout(context.handler);
//   }
//   if(context.isPan){
//     // pan
//   }
//   context.points = context.points.filter((point) => {
//     return Date.now() - point.t<500
//   })
//   context.points.push({
//     t:Date.now(),
//     x:point.clientX,
//     y:point.clientY
//   })
// }
// let end = (point,context)=>{
//   if(context.isTap){
//     // tag
//     this.dispatcher.dispatch("tap",{})
//     console.log('tag')
//     clearTimeout(context.handler);
//   }
//   if(context.isPan){
//     // pan end
//     console.log('pan end')
//   }
//   if(context.isPress){
//     // press end
//     console.log('isPress end')
//   }
//   context.points = context.points.filter((point) => {
//     return Date.now() - point.t<500
//   })
//   let d,v;
//   if(!context.points){
//     v = 0
//   }else{
//      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + 
//     (point.clientY - context.points[0].y) ** 2) ;
//      v = d /(Date.now() - context.points[0].t) ;
//   }
//   if(v > 1.5){
//     context.isFlick = true;
//   }else{
//     context.isFlick = false;
//   }
//   console.log('v:',v)
// }
// let cancel = (point,context)=>{
//   clearTimeout(context.handler);
// }
// export function dispatch (type,properties){
//   let event = new Event(type);
//   for(let name in properties){
//     event[name] = properties[name]
//   }
//   element.dispatchEvent(event)
// }

var Dispatch =
/*#__PURE__*/
function () {
  function Dispatch(element) {
    _classCallCheck(this, Dispatch);

    this.element = element;
  }

  _createClass(Dispatch, [{
    key: "dispatch",
    value: function dispatch(type, properties) {
      var event = new Event(type);

      for (var name in properties) {
        event[name] = properties[name];
      }

      this.element.dispatchEvent(event);
    }
  }]);

  return Dispatch;
}();

exports.Dispatch = Dispatch;

var Listener = function Listener(element, recognizer) {
  _classCallCheck(this, Listener);

  var isListeningMouse = false;
  var contexts = new Map();
  element.addEventListener('mousedown', function (event) {
    var context = Object.create(null);
    contexts.set("mouse" + (1 << event.button), context); // event.button

    recognizer.start(event, context);

    var mousemove = function mousemove(event) {
      var button = 1;

      while (button <= event.buttons) {
        if (button & event.buttons) {
          // order of buttons & button property is not same
          var key = void 0;
          if (button === 2) key = 4;else if (button === 4) key = 2;else key = button;

          var _context = contexts.get('mouse' + key);

          recognizer.move(event, _context);
        }

        button = button << 1;
      }
    };

    var mouseup = function mouseup(event) {
      var context = contexts.get('mouse' + (1 << event.button));
      recognizer.end(event, context);
      contexts["delete"]('mouse' + (1 << event.button));

      if (event.buttons === 0) {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
        isListeningMouse = false;
      }
    };

    if (!isListeningMouse) {
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
      isListeningMouse = true;
    } // element.addEventListener('mousemove',mousemove)
    // element.addEventListener('mouseup',mouseup)

  });
  element.addEventListener("touchstart", function (event) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = event.changedTouches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var touch = _step.value;
        var context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
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
  });
  element.addEventListener("touchmove", function (event) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = event.changedTouches[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var touch = _step2.value;
        var context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
  element.addEventListener("touchend", function (event) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = event.changedTouches[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var touch = _step3.value;
        var context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts["delete"](touch.identifier);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  });
  element.addEventListener("touchcancel", function (event) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = event.changedTouches[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var touch = _step4.value;
        var context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  });
};

exports.Listener = Listener;

var Recognizer =
/*#__PURE__*/
function () {
  function Recognizer(dispatcher) {
    _classCallCheck(this, Recognizer);

    this.dispatcher = dispatcher;
  }

  _createClass(Recognizer, [{
    key: "start",
    value: function start(point, context) {
      var _this = this;

      context.startX = point.clientX, context.startY = point.clientY;
      context.points = [{
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      }];
      context.isPan = false;
      context.isTap = true;
      context.isPress = false;
      this.dispatcher.dispatch('start', {
        startX: point.clientX,
        startY: point.clientY,
        clientX: point.clientX,
        clientY: point.clientY
      });
      context.handler = setTimeout(function () {
        //press start
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        context.handler = null;

        _this.dispatcher.dispatch("press", {});
      }, 500);
    }
  }, {
    key: "move",
    value: function move(point, context) {
      var dx = point.clientX - context.startX,
          dy = point.clientY - context.startY;

      if (!context.isPan && Math.pow(dx, 2) + Math.pow(dy, 2) > 100) {
        context.isPan = true;
        context.isTap = false;
        context.isPress = false;
        context.isVertical = Math.abs(dx) < Math.abs(dy);
        this.dispatcher.dispatch("panstart", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical
        });
        clearTimeout(context.handler);
      }

      if (context.isPan) {
        // pan
        this.dispatcher.dispatch("pan", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical
        });
      }

      context.points = context.points.filter(function (point) {
        return Date.now() - point.t < 500;
      });
      context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      });
    }
  }, {
    key: "end",
    value: function end(point, context) {
      if (context.isTap) {
        // tag
        console.log(this.dispatcher);
        this.dispatcher.dispatch("tap", {});
        console.log('tag');
        clearTimeout(context.handler);
      }

      if (context.isPress) {
        // press end
        console.log('isPress end');
        this.dispatcher.dispatch("pressend", {});
      }

      context.points = context.points.filter(function (point) {
        return Date.now() - point.t < 500;
      });
      var d, v;

      if (!context.points) {
        v = 0;
      } else {
        d = Math.sqrt(Math.pow(point.clientX - context.points[0].x, 2) + Math.pow(point.clientY - context.points[0].y, 2));
        v = d / (Date.now() - context.points[0].t);
      }

      if (v > 1.5) {
        context.isFlick = true;
        this.dispatcher.dispatch("flick", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick,
          velocity: v
        });
      } else {
        context.isFlick = false;
      }

      if (context.isPan) {
        // pan end
        console.log('pan end');
        this.dispatcher.dispatch("panend", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick
        });
      }

      this.dispatcher.dispatch('end', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        velocity: v,
        isFlick: context.isFlick
      });
      console.log('v:', v);
    }
  }, {
    key: "cancel",
    value: function cancel(point, context) {
      clearTimeout(context.handler);
      this.dispatcher.dispatch("cancel", {});
    }
  }]);

  return Recognizer;
}();

exports.Recognizer = Recognizer;

function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatch(element)));
}