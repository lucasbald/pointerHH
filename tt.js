'use strict'

const puppeteer = require('puppeteer')
const fs    = require('fs')
const jsonData = require('./token.json')
const { parseJwt } = require('./scripts/jwt')
const { takeScreenshot } = require('./scripts/takeScreenshot')

let { token } = jsonData

let testFolder = 'testFolder'
let goldenFolder = 'goldenFolder'
let tokenResponse
let env

process.argv.forEach(function(element) {
	const regex = /(?<==).*/g
	if (element.indexOf('ENV=') >= 0){
		env = element.match(regex).toString()
	} 
})


describe('Criando diretórios', function() {
	if (!fs.existsSync(testFolder)) fs.mkdirSync(testFolder)
	if (!fs.existsSync(goldenFolder)) fs.mkdirSync(goldenFolder)
})


describe('Fazer apontamento', function() {
	let browser, page

	before(async function() {
		tokenResponse = parseJwt(token)
		let { url } = tokenResponse
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
		return takeScreenshot(page, action, tokenResponse)
	})

	it('Colocar o Login', async function() {
		const action = 'login'
		return takeScreenshot(page, action, tokenResponse)
	})

	it('Colocar a Senha', async function() {
		const action = 'senha'
		return takeScreenshot(page, action, tokenResponse)
	})

	it('Bater o ponto', async function() {
		const action = 'apontar'
		return takeScreenshot(page, action, tokenResponse)
	})


	after(async ()=>{
		await browser.close()
	
		// TO DO - Create the report
		//
		// const reportToExport = JSON.stringify(report)

		// //Create a file with all the specs
		// fs.writeFile('report.json', reportToExport, function (err) {
		// 	if (err) throw err
		// 	console.log('Report is created successfully.')
		// })
	})
})

