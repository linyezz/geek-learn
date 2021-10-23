"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scan = scan;

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(scan);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var XRegExp =
/*#__PURE__*/
function () {
  function XRegExp(xregexp, root, flag) {
    _classCallCheck(this, XRegExp);

    // 保存每一个inputelement在正则中的位置
    this.table = new Map();
    var regexp = this.compileRegExp(xregexp, root).source;
    this.regexp = new RegExp(regexp, flag);
  }

  _createClass(XRegExp, [{
    key: "compileRegExp",
    value: function compileRegExp(xregexp, name) {
      var _this = this;

      var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (xregexp[name] instanceof RegExp) {
        return {
          source: xregexp[name].source,
          length: 0
        };
      } else {
        var length = 0;
        var regexp = xregexp[name].replace(/\<([^>]+)\>/g, function (str, $1) {
          _this.table.set(start + length, $1);

          length++;

          var r = _this.compileRegExp(xregexp, $1, start + length);

          length += r.length;
          return '(' + r.source + ')';
        });
        return {
          source: regexp,
          length: length
        };
      }
    }
  }, {
    key: "exec",
    value: function exec(str) {
      var r = this.regexp.exec(str);

      for (var i = 1; i < r.length; i++) {
        if (r[i] !== void 0) {
          r[this.table.get(i - 1)] = r[i];
        }
      }

      return r;
    }
  }, {
    key: "lastIndex",
    get: function get() {
      return this.regexp.lastIndex;
    },
    set: function set(value) {
      return this.regexp.lastIndex = value;
    }
  }]);

  return XRegExp;
}();

var xregexp = {
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
  NullLiteral: /null/
};

function scan(str) {
  var regexp, r;
  return regeneratorRuntime.wrap(function scan$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          regexp = new XRegExp(xregexp, 'InputElement', 'g');

        case 1:
          if (!(regexp.lastIndex < str.length)) {
            _context.next = 52;
            break;
          }

          r = regexp.exec(str); // console.log(r);

          if (!r.Whitespace) {
            _context.next = 6;
            break;
          }

          _context.next = 48;
          break;

        case 6:
          if (!r.LineTerminator) {
            _context.next = 9;
            break;
          }

          _context.next = 48;
          break;

        case 9:
          if (!r.Comments) {
            _context.next = 12;
            break;
          }

          _context.next = 48;
          break;

        case 12:
          if (!r.NumbericLiteral) {
            _context.next = 17;
            break;
          }

          _context.next = 15;
          return {
            type: 'NumbericLiteral',
            value: r[0]
          };

        case 15:
          _context.next = 48;
          break;

        case 17:
          if (!r.BooleanLiteral) {
            _context.next = 22;
            break;
          }

          _context.next = 20;
          return {
            type: 'BooleanLiteral',
            value: r[0]
          };

        case 20:
          _context.next = 48;
          break;

        case 22:
          if (!r.StringLiteral) {
            _context.next = 27;
            break;
          }

          _context.next = 25;
          return {
            type: 'StringLiteral',
            value: r[0]
          };

        case 25:
          _context.next = 48;
          break;

        case 27:
          if (!r.NullLiteral) {
            _context.next = 32;
            break;
          }

          _context.next = 30;
          return {
            type: 'NullLiteral',
            value: null
          };

        case 30:
          _context.next = 48;
          break;

        case 32:
          if (!r.Identifier) {
            _context.next = 37;
            break;
          }

          _context.next = 35;
          return {
            type: 'Identifier',
            name: r[0]
          };

        case 35:
          _context.next = 48;
          break;

        case 37:
          if (!r.Keywords) {
            _context.next = 42;
            break;
          }

          _context.next = 40;
          return {
            type: r[0]
          };

        case 40:
          _context.next = 48;
          break;

        case 42:
          if (!r.Punctuator) {
            _context.next = 47;
            break;
          }

          _context.next = 45;
          return {
            type: r[0]
          };

        case 45:
          _context.next = 48;
          break;

        case 47:
          throw new Error('unexpected token ' + r[0]);

        case 48:
          if (r[0].length) {
            _context.next = 50;
            break;
          }

          return _context.abrupt("break", 52);

        case 50:
          _context.next = 1;
          break;

        case 52:
          _context.next = 54;
          return {
            type: 'EOF'
          };

        case 54:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}