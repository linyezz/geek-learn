export function creatElement(type,attributes,...children){
  let element ;
  if(typeof type === "string"){
    // element =  document.createElement(type);
    element =  new ElementWrapper(type);
  } else {
    element = new type;
  }
  for(let name in attributes){
    element.setAttribute(name,attributes[name])
  }
  for(let child of children){
    if(typeof child === "string"){
      // child = document.createTextNode(child)
      child = new TextWrapper(child)
    }
    element.appendChild(child)
  }
  return element;
}
export class Component{
  constructor(type){
    // this.root = this.rander()
  }
  
  setAttribute(name,value){
    this.root.setAttribute(name,value);
  }
  appendChild(child){
    // this.root.appendChild(child);
    child.mountTo(this.root)
  }
  mountTo(parent){
    // this.root = document.createElement('div');
    parent.appendChild(this.root)
  }
}
class ElementWrapper extends Component{
  constructor(type){
    this.root = document.createElement(type);
  }
  
}
class TextWrapper extends Component{
  constructor(content){
    this.root = document.createTextNode(content);
  }
  
}
