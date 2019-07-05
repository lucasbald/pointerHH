'use strict'

const puppeteer = require('puppeteer')
const expect = require('chai').expect
const pixelmatch = require('pixelmatch')
const atob = require('atob');
const PNG = require('pngjs').PNG
const fs    = require("fs")
const jsonData = require('./token.json');

let { token } = jsonData
let url // Some URL

let testFolder = 'testFolder'
let goldenFolder = 'goldenFolder'
let report = []
let tokenResponse
let env

process.argv.forEach(function(element) {
  const regex = /(?<=\=).*/g
  if (element.indexOf('ENV=') >= 0){
     env = element.match(regex).toString()
  } 
});

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

async function takeAndCompareScreenshot(page, action) {
  let testImage

  switch (action) {
    case 'open':
      await page.screenshot({path: `${testFolder}/abrirSite.png`})
      testImage = 'abrirSite'
      break
    case 'login':
        await page.type('div#conteudoTela table#camposRelogioVirtual input#ext-gen40', tokenResponse.user)
        await page.screenshot({path: `${testFolder}/colocarLogin.png`})
        testImage = 'colocarLogin'
        break
    case 'senha':
        await page.type('div#conteudoTela table#camposRelogioVirtual input#ext-gen42', tokenResponse.pass)
        await page.screenshot({path: `${testFolder}/colocarSenha.png`})
        testImage = 'colocarSenha'
        break
    case 'apontar':
      await page.click('div#conteudoTela input#ext-gen44')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await page.screenshot({path: `${testFolder}/baterPonto.png`})
      testImage = 'baterPonto'
      break
    default:
      console.log('TO DO! ')
  }
  

  return compareScreenshots(testImage);
}

function compareScreenshots(testImage) {
  return new Promise((resolve, reject) => {
    // Create the images to compare
    const img1 = fs.createReadStream(`${testFolder}/${testImage}.png`).pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream(`${goldenFolder}/${testImage}.png`).pipe(new PNG()).on('parsed', doneReading);

    let filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // The files should be the same size.
      expect(img1.width, 'image widths are the same').equal(img2.width);
      if (testImage === 'apontar') {
        expect(img1.height, 'image heights are the same').equal(767);
      } else {
        expect(img1.height, 'image heights are the same').equal(img2.height);
      }

      // Do the visual diff.
      const diff = new PNG({width: img1.width, height: img2.height});
      const numDiffPixels = pixelmatch(
          img1.data, img2.data, diff.data, img1.width, img1.height,
          {threshold: 0.1});
      
      
      // Creating the report
      const temp = {}
      temp[testImage] = numDiffPixels
      report.push(temp)

      // Save the image with the difference
      if (numDiffPixels > 250) {
        fs.writeFileSync(`${testFolder}/diff-${testImage}.png`, PNG.sync.write(diff));
      }

      // The files should look the same.
      expect(numDiffPixels, 'number of different pixels').to.be.below(250);

      resolve('Done');

      reject('Error');
    }
  });
}

describe('Criando diretórios', function() {
  if (!fs.existsSync(testFolder)) fs.mkdirSync(testFolder)
  if (!fs.existsSync(goldenFolder)) fs.mkdirSync(goldenFolder)
})


describe('Fazer apontamento', function() {
  let browser, page

  before(async function() {
    tokenResponse = parseJwt(token)
    env === 'DEBUG' ? browser = await puppeteer.launch({
            headless: false,
            slowMo: 250
          }) : browser = await puppeteer.launch({})
    page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('div#conteudoTela', { visible: true })
  })

  it('Abrir o site', async function() {
    const action = 'open'
    return takeAndCompareScreenshot(page, action)
  })

  it('Colocar o Login', async function() {
    const action = 'login'
    return takeAndCompareScreenshot(page, action)
  })

  it('Colocar a Senha', async function() {
    const action = 'senha'
    return takeAndCompareScreenshot(page, action)
  })

  it('Bater o ponto', async function() {
    const action = 'apontar'
    return takeAndCompareScreenshot(page, action)
  })


  after(async ()=>{
    await browser.close()
    
    const reportToExport = JSON.stringify(report)

    //Create a file with all the specs
    fs.writeFile('report.json', reportToExport, function (err) {
      if (err) throw err;
      console.log('Report is created successfully.');
    }); 
  })
})

