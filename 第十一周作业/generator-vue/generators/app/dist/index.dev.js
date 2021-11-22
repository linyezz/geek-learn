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

var Generator = require("yeoman-generator");

module.exports =
/*#__PURE__*/
function (_Generator) {
  _inherits(_class, _Generator);

  // The name `constructor` is important here
  function _class(args, opts) {
    _classCallCheck(this, _class);

    // Calling the super constructor is important so our generator is correctly set up
    return _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, args, opts)); // Next, add your custom code
    // this.option("babel"); // This method adds support for a `--babel` flag
  }

  _createClass(_class, [{
    key: "initPackage",
    value: function initPackage() {
      var answers, pkgJson;
      return regeneratorRuntime.async(function initPackage$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.prompt([{
                type: "input",
                name: "name",
                message: "Your project name",
                "default": this.appname // Default to current folder name

              }]));

            case 2:
              answers = _context.sent;
              pkgJson = {
                name: answers.name,
                version: "1.0.0",
                description: "",
                main: "generators/app/index.js",
                scripts: {
                  test: 'echo "Error: no test specified" && exit 1'
                },
                keywords: [],
                author: "",
                license: "ISC",
                dependencies: {},
                devDependencies: {}
              }; // Extend or create package.json file in destination path

              this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
              this.npmInstall(["vue"], {
                "save-dev": false
              });
              this.npmInstall(["webpack", "webpack-cli", "vue-template-compiler", "vue-loader", "vue-style-loader", "css-loader", "copy-webpack-plugin"], {
                "save-dev": true
              }); // this.spawnCommand("npm", ["i", "vue"], { "save-dev": false });
              // this.spawnCommand("npm", ["i"], {
              //   "save-dev": true,
              // });

              this.fs.copyTpl(this.templatePath("HelloWorld.vue"), this.destinationPath("src/HelloWorld.vue"), {});
              this.fs.copyTpl(this.templatePath("webpack.config.js"), this.destinationPath("webpack.config.js"), {});
              this.fs.copyTpl(this.templatePath("main.js"), this.destinationPath("src/main.js"), {});
              this.fs.copyTpl(this.templatePath("index.html"), this.destinationPath("src/index.html"), {
                title: answers.name
              });
              this.fs.copyTpl(this.templatePath(".gitignore"), this.destinationPath(".gitignore"), {});

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);

  return _class;
}(Generator);