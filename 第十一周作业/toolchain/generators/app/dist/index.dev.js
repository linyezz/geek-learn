"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Generator = require('yeoman-generator');

module.exports =
/*#__PURE__*/
function (_Generator) {
  _inherits(_class, _Generator);

  function _class(args, opts) {
    var _this;

    _classCallCheck(this, _class);

    // Calling the super constructor is important so our generator is correctly set up
    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, args, opts)); // Next, add your custom code

    _this.option('babel'); // This method adds support for a `--babel` flag


    return _this;
  } //依赖


  _createClass(_class, [{
    key: "initPackage",
    value: function initPackage() {
      var pkgJson = {
        devDependencies: {
          eslint: '^3.15.0'
        },
        dependencies: {
          react: '^16.2.0'
        }
      }; // Extend or create package.json file in destination path

      this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
      this.npmInstall();
    }
  }, {
    key: "step1",
    value: function step1() {
      return regeneratorRuntime.async(function step1$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('public/index.html'), {
                title: 'Templating with Yeoman'
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "method1",
    value: function method1() {// const answers = await this.prompt([
      //   {
      //     type: "input",
      //     name: "name",
      //     message: "Your project name",
      //     default: this.appname // Default to current folder name
      //   },
      //   {
      //     type: "confirm",
      //     name: "cool",
      //     message: "Would you like to enable the Cool feature?"
      //   }
      // ]);
      // this.log("app name", answers.name);
      // this.log("cool feature", answers.cool);
      // this.log('method 1 just ran');
    }
  }, {
    key: "method2",
    value: function method2() {
      this.log('method 2 just ran');
    }
  }]);

  return _class;
}(Generator);