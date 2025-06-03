const puppeteer = require('puppeteer');

const launchOptions = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

module.exports = {
  puppeteer,
  launchOptions,
};

