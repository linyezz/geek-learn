"use strict";

var puppeteer = require('puppeteer');

(function _callee() {
  var browser, page, imgs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(puppeteer.launch());

        case 2:
          browser = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(browser.newPage());

        case 5:
          page = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(page["goto"]('http://127.0.0.1:8080/main.html'));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(page.$$('a'));

        case 10:
          imgs = _context.sent;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
})();