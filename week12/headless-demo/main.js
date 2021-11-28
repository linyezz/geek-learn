const puppeteer = require('puppeteer');

(async()=>{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8080/main.html');
  const imgs = await page.$$('a');

})();