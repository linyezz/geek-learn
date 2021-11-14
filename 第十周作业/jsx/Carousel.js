import {Component,creatElement} from './framework.js'
import {enableGesture} from './gesture.js'
import {TimeLine,Animation} from './animation.js'
import {ease} from './cubicBezier.js'

export {STATE, ATTRIBUTE} from './framework'



export class Carousel extends Component{
  constructor(){
    // this.root = document.createElement('div');
    super()
    // this.attributes = Object.create(null)
  }
  // setAttribute(name,value){
  //   this.attributes[name] = value;
  //   // this.root.setAttribute(name,value);
  // }
  rander(){
    this.root = document.createElement('div')
    this.root.className = 'carousel'
    for(let record of this[ATTRIBUTE].src){
      let child = document.createElement("div")
      child.style.backgroundImage = `url(${record.img})`
      this.root.appendChild(child)
    }
    this[STATE].position = 0

    enableGesture(this.root)
    let timeline = new TimeLine;
    timeline.start();
    let handler = null


    let children =  this.root.children;
    let t = 0;
    let ax = 0

    // let position = 0;

    this.root.addEventListener("start", event =>{
      timeLine.pause()
      clearInterval(handler)
      let progress = (Date.now() - t) / 500
      ax = ease(progress) * 500 - 500
    })

    this.root.addEventListener("tap", event =>{
      this.triggerEvent('click', {
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position
      })
    })

    this.root.addEventListener("pan",event=>{
      let x = event.clientX - event.startX;
      let current = position - ((x-x%500)/500);
      for(let offset of [-1,0,1]){
        let pos = current + offset;
        pos = (pos % children.length + children.length) % children.length;
        let child = children[pos];
        child.style.transition = "none"
        child.style.transform = `translateX(${-pos * 500 +  offset*500+x%500}px)`
      }
    })

    this.root.addEventListener("panend",event=>{
      let x = event.clientX-event.startX
      position = Math.round(position - x/500)
      for(let offset of [0,- Math.sign(Math.round(position - x/500)-x+250*Math.sign(x))]){
        let pos = position + offset;
        pos = (pos + children.length) % children.length;
        let child = children[pos];
        child.style.transition = ""
        child.style.transform = `translateX(${-pos * 500 +  offset*500}px)`
      }
    })

    this.root.addEventListener("panstart", event =>{
      let x = event.clientX - event.startX - ax

      let current = this[STATE].position - ((x- x % 500) / 500);
      for(let offset of [-1,0,1]){
        let pos = current + offset
        pos = (pos % children.length + children.length) % children.length

        children[pos].style.transition = "none"
        children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
      }
    })

    this.root.addEventListener("end", event =>{
      timeLine.reset()
      timeLine.start()

      let x = event.clientX - event.startX - ax
      let current = this[STATE].position - ((x- x % 500) / 500);

      let direction = Math.round((x % 500) / 500)

      if(event.isFlick){
        if(event.velocity < 0){
          direction = Math.ceil((x % 500) /500)
        } else {
          direction = Math.floor((x % 500) /500)
        }
      }

      for(let offset of [-1,0,1]){
        let pos = current + offset
        pos = (pos % children.length + children.length) % children.length

        children[pos].style.transition = "none"
        timeLine.add(new Animation(children[pos].style, 'transform',
          -pos * 500 + offset*500 + x%500, -pos*500 + offset * 500 +direction * 500,
          500, 0, ease, v=>`translateX(${v}px)`))
      }

      this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length

      this.triggerEvent("change", {position: this[STATE].position})

    })

    let nextPicture = ()=>{
      let nextIndex = (this[STATE].position+1) % children.length
      let current = children[this[STATE].position]
      let next = children[nextIndex]

      timeLine.add(new Animation(current.style, 'transform',
        -this[STATE].position * 500, -500 - this[STATE].position*500, 500, 0, ease, v=>`translateX(${v}px)`))
      timeLine.add(new Animation(next.style, 'transform',
        500 - nextIndex * 500, -nextIndex * 500 , 500, 0, ease, v=>`translateX(${v}px)`))

      this[STATE].position = nextIndex
      this.triggerEvent("change", {position: this[STATE].position})

    }
    handler = setInterval(nextPicture, 3000)

    return this.root

    


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
  }
  // mountTo(parent){
  //   parent.appendChild(this.rander());
  // }
}