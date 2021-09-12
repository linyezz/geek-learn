"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var net = require('net'); // const { parse } = require('path/posix');


var parser = require('./parser.js');

var Request =
/*#__PURE__*/
function () {
  function Request(options) {
    var _this = this;

    _classCallCheck(this, Request);

    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencode";
    }

    if (this.headers["Content-Type"] == 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] = "application/x-www-form-urlencode") {
      this.bodyText = Object.keys(this.body).map(function (key) {
        return "".concat(key, "=").concat(encodeURIComponent(_this.body[key]));
      }).join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  _createClass(Request, [{
    key: "send",
    value: function send(connection) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var parser = new ResponseParse();

        if (connection) {
          connection.write(_this2.toString());
        } else {
          connection = net.createConnection({
            host: _this2.host,
            port: _this2.port
          }, function () {
            connection.write(_this2.toString());
          });
        }

        connection.on('data', function (data) {
          // console.log(data.toString());
          parser.reveive(data.toString());

          if (parser.isFinshed) {
            resolve(parser.response);
            connection.end();
          }
        });
        connection.on('error', function (error) {
          reject(error);
          connection.end();
        });
      });
    }
  }, {
    key: "toString",
    value: function toString() {
      var _this3 = this;

      // return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key=>`${key}:${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`
      return "".concat(this.method, " ").concat(this.path, " HTTP/1.1\r\n").concat(Object.keys(this.headers).map(function (key) {
        return "".concat(key, ": ").concat(_this3.headers[key]);
      }).join('\r\n'), "\r\n\r\n").concat(this.bodyText);
    }
  }]);

  return Request;
}(); //ResponseParse 实现


var ResponseParse =
/*#__PURE__*/
function () {
  function ResponseParse() {
    _classCallCheck(this, ResponseParse);

    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEAD_NAME = 2;
    this.WAITING_HEAD_SPACE = 3;
    this.WAITING_HEAD_VALUE = 4;
    this.WAITING_HEAD_LINE_END = 5;
    this.WAITING_HEAD_BLOCK_END = 6;
    this.WAITING_BODY = 7;
    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  _createClass(ResponseParse, [{
    key: "reveive",
    value: function reveive(str) {
      for (var i = 0; i < str.length; i++) {
        this.receiveChar(str.charAt(i));
      }
    }
  }, {
    key: "receiveChar",
    value: function receiveChar(_char) {
      // console.log('headname:',char)
      if (this.current == this.WAITING_STATUS_LINE) {
        if (_char === '\r') {
          this.current = this.WAITING_STATUS_LINE_END;
        } else {
          this.statusLine += _char;
        }
      } else if (this.current === this.WAITING_STATUS_LINE_END) {
        if (_char === '\n') {
          this.current = this.WAITING_HEAD_NAME;
        }
      } else if (this.current == this.WAITING_HEAD_NAME) {
        if (_char === ':') {
          this.current = this.WAITING_HEAD_SPACE;
        } else if (_char === '\r') {
          this.current = this.WAITING_HEAD_BLOCK_END; //创建bodyparse方法
          // console.log(this.headers)

          if (this.headers['Transfer-Encoding'] === 'chunked') {
            this.bodyParser = new TrunkedBodyParser();
          }
        } else {
          this.headerName += _char;
        }
      } else if (this.current == this.WAITING_HEAD_SPACE) {
        if (_char === ' ') {
          this.current = this.WAITING_HEAD_VALUE;
        }
      } else if (this.current === this.WAITING_HEAD_VALUE) {
        if (_char === '\r') {
          this.current = this.WAITING_HEAD_LINE_END;
          this.headers[this.headerName] = this.headerValue;
          this.headerName = "";
          this.headerValue = "";
        } else {
          this.headerValue += _char;
        }
      } else if (this.current == this.WAITING_HEAD_LINE_END) {
        if (_char === '\n') {
          this.current = this.WAITING_HEAD_NAME;
        }
      } else if (this.current == this.WAITING_HEAD_BLOCK_END) {
        if (_char == "\n") {
          this.current = this.WAITING_BODY;
        }
      } else if (this.current == this.WAITING_BODY) {
        // console.log(char)
        this.bodyParser.receiveChar(_char);
      }
    }
  }, {
    key: "isFinshed",
    get: function get() {
      return this.bodyParser && this.bodyParser.isFinshed;
    }
  }, {
    key: "response",
    get: function get() {
      this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
      return {
        statusCode: RegExp.$1,
        statusText: RegExp.$2,
        headers: this.headers,
        body: this.bodyParser.content.join('')
      };
    }
  }]);

  return ResponseParse;
}();

var TrunkedBodyParser =
/*#__PURE__*/
function () {
  function TrunkedBodyParser() {
    _classCallCheck(this, TrunkedBodyParser);

    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.RADING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinshed = false;
    this.current = this.WAITING_LENGTH;
  }

  _createClass(TrunkedBodyParser, [{
    key: "receiveChar",
    value: function receiveChar(_char2) {
      if (this.current === this.WAITING_LENGTH) {
        if (_char2 === '\r') {
          if (this.length == 0) {
            this.isFinshed = true;
          }

          this.current = this.WAITING_LENGTH_LINE_END;
        } else {
          this.length *= 16;
          this.length += parseInt(_char2, 16);
        }
      } else if (this.current === this.WAITING_LENGTH_LINE_END) {
        if (_char2 === '\n') {
          this.current = this.RADING_TRUNK;
        }
      } else if (this.current === this.RADING_TRUNK) {
        this.content.push(_char2);
        this.length--;

        if (this.length === 0) {
          this.current = this.WAITING_NEW_LINE;
        }
      } else if (this.current === this.WAITING_NEW_LINE) {
        if (_char2 === '\r') {
          this.current = this.WAITING_NEW_LINE_END;
        }
      } else if (this.current === this.WAITING_NEW_LINE_END) {
        if (_char2 === '\n') {
          this.current = this.WAITING_LENGTH;
        }
      }
    }
  }]);

  return TrunkedBodyParser;
}();

void function _callee() {
  var request, response, dom;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          request = new Request({
            method: "POST",
            host: '127.0.0.1',
            port: '8088',
            parth: '/',
            headers: _defineProperty({}, 'X-Foo2', "customed"),
            body: {
              name: 'linyezz'
            }
          });
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(request.send());

        case 4:
          response = _context.sent;
          console.log(response.body);
          dom = parser.parseHTML(response.body);
          console.log('123');
          console.log(dom);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}();