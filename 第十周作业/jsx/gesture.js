
let isListeningMouse = false;
let element = document.documentElement;
let contexts = new Map();
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


export class Dispatch {
  constructor(element){
    this.element = element;
  }
  dispatch (type,properties){
      let event = new Event(type);
      for(let name in properties){
        event[name] = properties[name]
      }
      this.element.dispatchEvent(event)
    }
}

export class Listener{
  constructor(element,recognizer) {
    let isListeningMouse = false;
    let contexts = new Map();
    element.addEventListener('mousedown',event=>{
      let context = Object.create(null)
      contexts.set("mouse"+ (1 << event.button), context)
      // event.button
      recognizer.start(event,context)
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
            recognizer.move(event, context)
          }
          
          button = button << 1
        }
      }
    
      let mouseup = event=>{
        let context = contexts.get('mouse' + (1 << event.button))
        recognizer.end(event, context)
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
        recognizer.start(touch,context)
      }
    })
    element.addEventListener("touchmove",event=>{
      for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier)
        recognizer.move(touch,context)
      }
    })
    element.addEventListener("touchend",event=>{
      for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier)
        recognizer.end(touch,context)
        contexts.delete(touch.identifier)
      }
    })
    element.addEventListener("touchcancel",event=>{
      for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier)
        recognizer.cancel(touch,context)
      }
    })
  }
  
}

export class Recognizer{
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start(point,context){
    context.startX = point.clientX,context.startY = point.clientY;
    context.points = [{
      t:Date.now(),
      x:point.clientX,
      y:point.clientY
    }];
  
    context.isPan = false;
    context.isTap = true;
    context.isPress = false

    this.dispatcher.dispatch('start',{
      startX: point.clientX,
      startY: point.clientY,
      clientX: point.clientX,
      clientY:point.clientY
    })

    context.handler = setTimeout(()=>{
      //press start
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
      this.dispatcher.dispatch("press",{})
    },500)
  }
   move(point,context){
    let dx = point.clientX-context.startX, dy = point.clientY - context.startY;
    if(!context.isPan && (dx ** 2 + dy ** 2)>100){
      context.isPan = true;
      context.isTap = false;
      context.isPress = false
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch("panstart",{
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
      clearTimeout(context.handler);
    }
    if(context.isPan){
      // pan
      this.dispatcher.dispatch("pan",{
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
    }
    context.points = context.points.filter((point) => {
      return Date.now() - point.t<500
    })
    context.points.push({
      t:Date.now(),
      x:point.clientX,
      y:point.clientY
    })
  }
  end(point,context){
    if(context.isTap){
      // tag
      console.log(this.dispatcher)
      this.dispatcher.dispatch("tap",{})
      console.log('tag')
      clearTimeout(context.handler);
    }
    
    if(context.isPress){
      // press end
      console.log('isPress end')
      this.dispatcher.dispatch("pressend",{})
    }
    context.points = context.points.filter((point) => {
      return Date.now() - point.t<500
    })
    let d,v;
    if(!context.points){
      v = 0
    }else{
       d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + 
      (point.clientY - context.points[0].y) ** 2) ;
       v = d /(Date.now() - context.points[0].t) ;
    }
    if(v > 1.5){
      context.isFlick = true;
      this.dispatcher.dispatch("flick",{
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity:v
      })
    }else{
      context.isFlick = false;
    }

    if(context.isPan){
      // pan end
      console.log('pan end')
      this.dispatcher.dispatch("panend",{
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      })
    }
    this.dispatcher.dispatch('end',{
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      velocity: v,
      isFlick: context.isFlick
    })
    console.log('v:',v)
  }
   cancel(point,context){
    clearTimeout(context.handler);
    this.dispatcher.dispatch("cancel",{})
  }

}

export function enableGesture(element) {
  new Listener(element,new Recognizer(new Dispatch(element)))
}