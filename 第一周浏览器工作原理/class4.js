/**
 * 7. 状态机 | 使用状态机处理字符串（二）
 * 使用状态机完成'abababx'的处理
 */

function match(str){
  let state = start
  for(let i of str){
     state = state(i);
  }
  return state == end;
}
function end(i){
  return end;
}
function start(i){
  if(i == 'a'){
    return findA
  } else{
    return start
  }
}
function findA(i){
  if(i == 'b'){
    return findB
  } else{
    return start(i)
  }
}
function findB(i){
  if(i == 'a'){
    return findC
  }else{
    return start(i)
  }
}
function findC(i){
  if(i == 'b'){
    return findD
  }else{
    return start(i)
  }
  
}
function findD(i){
  if(i == 'a'){
    return findE
  }else{
    return start(i)
  }
  
}
function findE(i){
  if(i == 'b'){
    return findF
  }else{
    return start(i)
  }
  
}
function findF(i){
  if(i == 'x'){
    return end
  }else{
    return start(i)
  }
  
}
console.log(match('abababdabxabababxababddab'))