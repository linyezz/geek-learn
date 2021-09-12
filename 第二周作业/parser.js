// const { match } = require('assert');
const css = require('css')

/**
 * 第二周作业，解析html
 */
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let rules = []; // css规则


const EOF = Symbol("EOF");

let stack = [{type:"document",children:[]}];

// 输出状态机的状态
function emit(token){
  console.log(token);
  // html 语法分析
  let top = stack[stack.length-1];
  // 如果是开始标签，新建element
  if(token.type == "startTag"){
    let element = {
      type:'element',
      children:[],
      attributes: []
    };

    element.tagName = token.tagName;
    // 循环token内容
    for(let p in token){
      if(p != "type" && p != 'tagName'){
        // 当前为属性
        element.attributes.push({
          name:p,
          value:token[p]
        });
      }
    };

    // 计算css
    computeCss(element)
    // 标签入栈
    top.children.push(element);
    element.parent = top;

    if(!token.isSelfClosing){
      // 判断自封闭标签。自封闭标签入栈
      stack.push(element)
    }
    currentTextNode = null
  } else if(token.type == 'endTag'){
    // 遇到结束标签
    if(top.tagName != token.tagName){
      throw new Error("Tage start end doesn't match");
    } else {
      // 遇到style标签是，执行添加css规则的操作
      if(top.tagName == "style") {
        addCSSRules(top.children[0].content)
      }
      // 标签出栈
      stack.pop();
    }
    currentToken = null;
  } else if(token.type == "text"){
    // 遇到文本节点
    if(currentTextNode == null){
      currentTextNode = {
        type: "text",
        content: ""
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content
  }


}

function data(c){
  if(c=='<'){
    return tagOpen;
  } else if( c == EOF){
    emit({
      type:"EOF"
    })
    return ;
  } else {
    emit({
      type: "text",
      content: c
    })
    return data;
  }
}

function tagOpen(c){
  if(c=='/'){
    return endTagOpen;
  } else if(c.match(/^[a-zA-Z0-9]$/)) {
    //是一个开始标签，或者是自封闭标签
    currentToken = {
      type: "startTag",
      tagName: ""
    }
    return tagName(c);
  } else {
    return ;
  }
}

function endTagOpen(c) {
  if(c.match(/^[a-zA-Z0-9]$/)) {
    //是字符或者数字串创造一个结束标签。
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(c);
  } else if(c == '>'){
    console.error('>异常报错')
  } else if(c == EOF){
    console.error('EOF异常报错')
  } else {
    console.error('异常报错')
  }
}

function tagName(c){
  if(c.match(/^[\t\n\f ]$/)){
    // 标签名 以空白符结束 后面跟属性 进入属性名函数
    return beforeAttributeName;
  } else if(c == '/'){
    // 如果是/符号，表示自封标签
    return selfClosingStartTAg
  } else if(c.match(/^[a-zA-Z]$/)){
    // 如果还是字符，说明还是标签名

    // 添加标签名称
    currentToken.tagName += c;
    return tagName;
  } else if(c == '>'){
    // > 是一个普通的开始标签。结束这个标签
    emit(currentToken) // 输出状态
    return data;
  } else {
    return tagName;
  }
}

// 开始处理属性
function beforeAttributeName(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName;
  } else if(c == '>' || c=='>' || c==EOF){
    return afterAttributeName

  } else if(c == '='){
    // 属性开通有等号报错
  } else {
    currentAttribute ={
      name: "",
      value: ""
    }
    return attributeName(c);
  }
}

function attributeName(c){
  if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
    return afterAttributeName(c);
  } else if( c == "=" ){
    return beforeAttributeValue;
  } else if(c == "\u0000"){

  } else if(c == "\"" || c == " " || c == "<"){

  } else {
    currentAttribute.name += c;
    return attributeName
  }
}

function beforeAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
    return beforeAttributeValue;
  } else if(c == "\"") {
    // 双引号
    return doubleQuotedAttributeValue;
  } else if(c == "\'") {
    // 单引号
    return singleQutedAttributeValue;
  } else if(c == ">"){

  } else {
    return UnquotedAttributeValue(c);
  }
}

// 双引号只招双引号结束
function doubleQuotedAttributeValue(c) {
  if(c == "\""){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if(c == "\u0000"){

  } else if(c == EOF){

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

// 单引号只找单引号结束
function singleQutedAttributeValue(c) {
  if(c == "\'"){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if(c == "\u0000"){

  } else if(c == EOF){

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}


function afterQuotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName;
  } else if(c == "/"){
    return selfClosingStartTAg;
  } else if(c == ">"){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if(c == EOF){

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

// 空白符只找空白符
function UnquotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    // 如果是空格，接下来可能还是属性
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if(c == "/"){
    // 自封闭标签
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTAg;
  } else if( c==">"){
    // 遇到结束标签，输出状态。
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if(c == "\u0000"){

  } else if(c == "\"" || c=="\'" || c == "<" || c == "=" || c=="`"){

  }else if(c == EOF) {

  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }

}

function afterAttributeName(c){
  if(c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if(c == "/"){
    return selfClosingStartTAg;
  } else if(c == "="){
    return beforeAttributeValue;
  } else if(c == ">" ){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if(c == EOF){

  }else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    };
    return attributeName(c);
  }
}

function selfClosingStartTAg(c){
  //当遇到自封闭标签时，只有>才符合，其余都会报错
  if( c == '>'){
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if( c == EOF){

  } else {

  }
}
// css规则函数
function addCSSRules(text){
  // 用css解析ast树
  let ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

// 计算css函数
function computeCss(element){
  let elements = stack.slice().reverse();  // slice不传参数时，默认复制一遍原数组.但不是深拷贝
  if(!element.computedStyle){
    element.computedStyle = {};
  }
    for(let rule of rules) {
      let selectorParts = rule.selectors[0].split(" ").reverse();

      if(!match(element, selectorParts[0])){
        continue;
      }

      let matched = false;

      var j = 1;
      for(var i = 0; i<elements.length;i++){
        if(match(elements[i],selectorParts[j])){
          j++;
        }
      }
      if(j >= selectorParts.length){
        matched = true;
      }
      if(matched){
        var sp = specificity(rule.selectors[0])
        var computedStyle = element.computedStyle;
        for(let declaration of rule.declarations){
          if(!computedStyle[declaration.property]){
            computedStyle[declaration.property] = {}
          }
          if(!computedStyle[declaration.property].specificity){
            computedStyle[declaration.property].value = declaration.value
            computedStyle[declaration.property].specificity = sp;
          } else if(compare(computedStyle[declaration.property].specificity,sp)<0){
            computedStyle[declaration.property].value = declaration.value
            computedStyle[declaration.property].specificity = sp;
          }
          // computedStyle[declaration.property].value = declaration.value
        }
        console.log(element.computedStyle)
      }
    }
  
}

function match(element, selector){
  if(!selector || !element.attributes){
    return false;
  }
  // #开头为id选择器
  if(selector.charAt(0) == "#"){
    var attr = element.attributes.filter(attr => attr.name === "id")[0]
    if(attr && attr.value === selector.replace("#"," ")){
      return true
    }
  } else if(selector.charAt(0) == "."){
    var attr = element.attributes.filter(attr => attr.name === "class")[0]
    if(attr && attr.value === selector.replace("."," ")){
      return true
    }
  } else {
    if(element.tagName === selector){
      return true
    }
  }
  return false;
}

function specificity(selector){
  let p = [0,0,0,0];
  let selectorParts = selector.split(" ");
  for(let part of selectorParts){
    if(part.charAt(0) == "#"){
      p[1] += 1;
    } else if(part.charAt(0) == "."){
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}
function compare(sp1,sp2){
  if(sp1[0]-sp2[0]){
    return sp1[0] - sp2[0];
  }
  if(sp1[1]-sp2[1]){
    return sp1[1]-sp2[1]
  }
  if(sp1[2]-sp2[2]){
    return sp1[2]-sp2[2]
  }
  return sp1[3]-sp2[3]
}

module.exports.parseHTML = function(html){
  let state = data;
  for(let c of html){
    state = state(c)
  }
  state = state(EOF);
  return stack[0]
}