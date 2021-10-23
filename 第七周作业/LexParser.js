class XRegExp {
  constructor(xregexp, root, flag) {
      // 保存每一个inputelement在正则中的位置
      this.table = new Map();
      let regexp = this.compileRegExp(xregexp, root).source;
      this.regexp = new RegExp(regexp, flag);
  }
  compileRegExp(xregexp, name, start = 0) {
      if (xregexp[name] instanceof RegExp) {
          return {
              source: xregexp[name].source,
              length: 0
          };
      } else {
          let length = 0;
          let regexp = xregexp[name].replace(/\<([^>]+)\>/g, (str, $1) => {
              this.table.set(start + length, $1);
              length ++;
              let r = this.compileRegExp(xregexp, $1, start + length);
              length += r.length;
              return '(' + r.source + ')';
          })
          return {
              source: regexp,
              length: length
          }
      }
  }
  exec(str) {
      let r = this.regexp.exec(str);
      for (let i = 1; i < r.length; i++) {
          if (r[i] !== void 0) {
              r[this.table.get(i - 1)] = r[i];
          }
      }
      return r;
  }
  get lastIndex() {
      return this.regexp.lastIndex;
  }
  set lastIndex(value) {
      return this.regexp.lastIndex = value;
  }
}

let xregexp = {
  InputElement: '<Whitespace>|<LineTerminator>|<Comments>|<Token>',
  Whitespace: / /,
  LineTerminator: /\n/,
  Comments: /\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
  Token: '<Literal>|<Keywords>|<Identifier>|<Punctuator>',
  Literal: '<NumbericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>',
  Keywords: /if|else|forEach|for|function|let|var|const|new|while|break|continue/,
  Identifier: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
  NumbericLiteral: /(?:0x[0-9a-zA-Z]+|0o[0-7]+|0b[01]+|[1-9][0-9]*|0)(?:\.[0-9]*)?|.[0-9]+/,
  Punctuator: /\:|\&\&|\|\||\<|\>|\;|\+|\-|\,|\?|\{|\}|\.|\(|\)|\=|\+\+|\=\=|\[|\]|\=\>|\>/,
  BooleanLiteral: /true|false/,
  StringLiteral: /\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]\\[\s\S])*\'/,
  NullLiteral: /null/,
}

export function* scan(str) {
  let regexp = new XRegExp(xregexp, 'InputElement', 'g');
  while (regexp.lastIndex < str.length) {
      let r = regexp.exec(str);
      // console.log(r);
      if (r.Whitespace) {

      } else if (r.LineTerminator) {

      } else if (r.Comments) {

      } else if (r.NumbericLiteral) {
          yield {
              type: 'NumbericLiteral',
              value: r[0]
          }
      } else if (r.BooleanLiteral) {
          yield {
              type: 'BooleanLiteral',
              value: r[0]
          }
      } else if (r.StringLiteral) {
          yield {
              type: 'StringLiteral',
              value: r[0]
          }
      } else if (r.NullLiteral) {
          yield {
              type: 'NullLiteral',
              value: null
          }
      } else if (r.Identifier) {
          yield {
              type: 'Identifier',
              name: r[0]
          }
      } else if (r.Keywords) {
          yield {
              type: r[0]
          }
      } else if (r.Punctuator) {
          yield {
              type: r[0]
          }
      } else {
          throw new Error('unexpected token ' + r[0]);
      }

      if (!r[0].length)
          break;
  }
  yield {
      type: 'EOF'
  }
}