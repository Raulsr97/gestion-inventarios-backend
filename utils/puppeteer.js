const isProduction = process.env.NODE_ENV === 'production';

let puppeteer;
let launchOptions;

if (isProduction) {
  // En producción usamos chrome-aws-lambda
  puppeteer = require('puppeteer-core');
  const chromium = require('chrome-aws-lambda');

  launchOptions = async () => ({
    args: [...chromium.args, '--no-sandbox'],
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  }) 
} else {
  // En desarrollo usamos puppeteer normal
  puppeteer = require('puppeteer');
  launchOptions = {
    headless: true,
  };
}

module.exports = {
  puppeteer,
  launchOptions,
};

