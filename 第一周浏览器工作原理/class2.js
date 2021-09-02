/**
 * 4. 状态机 | 不使用状态机处理字符串（二）
 * 判断字符串中的'ab'
 */
function match(str){
  // 方法1：用indexof
  // return str.indexOf('ab')<0? false:true;
  // 方法2： 用includs
  return str.includes('ab');
 
}
// 老师的实现
function tMatch(str){
  let findA = false;
  for(let i of str){
    if(i == 'a'){
      findA = true
    }else if(findA && i=='b'){
      return true
    }else{
      findA = false
    }
  }
  return false;
}