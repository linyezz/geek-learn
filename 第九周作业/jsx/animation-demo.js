import {TimeLine, Animation} from './animation.js'
import {ease} from './cubicBezier.js'
let tl = new TimeLine()
tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 500, 5000, 0, ease, v => `translateX(${v}px)`))
tl.start()

document.querySelector("#btn-pause").addEventListener("click", ()=>tl.pause())
document.querySelector("#btn-resume").addEventListener("click", ()=>tl.resume())

 document.querySelector("#el2").style.transition = 'transform ease 5s'
document.querySelector("#el2").style.transform = "translateX(500px)"