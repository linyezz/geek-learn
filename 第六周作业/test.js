{Expression(node){
  return evaluate(node.children[0]);
},
AddtiveExpression(node){
  if(node.children.length === 1){
      return evaluate(node.children[0]);
  }else{
      let left = evaluate(node.children[0]);
      let right = evaluate(node.children[2]);
      // todo
  }
  
},
MuliplicativeExpression(node){
  if(node.children.length === 1){
      return evaluate(node.children[0]);
  }else{
      let left = evaluate(node.children[0]);
      let right = evaluate(node.children[2]);
      // todo
  }
  
},
PrimaryExpression(node){
  if(node.children.length === 1){
      return evaluate(node.children[0]);
  }
},
Literial(node){
  return evaluate(node.children[0]);
},
NumbericLiteral(node){
  let str = node.value;
  let l = str.length;
  let value = 0;
  let n = 10;
  if (str.match(/^0b/)) {
      n = 2;
      l -= 2;
    } else if (str.match(/^0o/)) {
      n = 8;
      l -= 2;
    } else if (str.match(/^0x/)) {
      n = 16;
      l -= 2;
    }
    while (l--) {
      let c = str.charCodeAt(str.length - l - 1);
      if (c >= "a".charCodeAt(0)) {
        c = c - "a".charCodeAt(0) + 10;
      } else if (c >= "A".charCodeAt(0)) {
        c = c - "A".charCodeAt(0) + 10;
      } else if (c >= "0".charCodeAt(0)) {
        c = c - "0".charCodeAt(0);
      }
      value = value * n + c;
    }
    console.log(value)
  //   return Number(node.value)
}}
