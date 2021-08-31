/**
 * 3. 状态机 | 不使用状态机处理字符串（一）作业
 * 判断字符串中的'a'
 */
function matchA(str) {
  // 方法1：用indexof
  // return str.indexOf('a')<0? false:true;
  // 方法2： 用includs
  // return str.includes('a');
  // 老师方法：
  for(let i of str){
    if(i == 'a')
    return true
  }
  return false;
}
