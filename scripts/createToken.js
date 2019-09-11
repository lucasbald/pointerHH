'use strict'

const fs    = require('fs')
const jwt = require('jsonwebtoken')


let secretContent

function createUserInfo() {
	try {
		fs.readFile('.secret.json', 'utf8', function(err, contents) {
			secretContent = JSON.parse(contents)
			const token = jwt.sign({ user: secretContent.user, pass: secretContent.pass, url: secretContent.url}, 'fooshh')
			fs.writeFile('token.json', JSON.stringify({token}), function () {})
			fs.unlink('.secret.json',function(){})
		})
		// eslint-disable-next-line no-console
		console.log('User created!')
	}
	catch(e) {
		// eslint-disable-next-line no-console
		console.error('ERROR creating user!', e)
	}
}



module.exports = {
	createUserInfo,
}
