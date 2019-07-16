'use strict'

const { compareScreenshots } = require('./compareScreenshot')
let testFolder = 'testFolder'

async function takeScreenshot(page, action, tokenResponse) {
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
	}
  

	return compareScreenshots(testImage)
}

module.exports = {
	takeScreenshot,
}
