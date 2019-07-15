'use strict'

const read = require('../lib/read.js')
const fs    = require('fs')
const { createUserInfo } = require('./createToken')


function promptInfo() {
	read({ prompt: 'Username: ', default: 'test-user' }, function (er, user) {
		read({ prompt: 'Password: ', default: 'test-pass', silent: true }, function (er, pass) {
			read({ prompt: 'Password again: ', default: 'test-pass', silent: true }, function (er, pass2) {
				const verification = (pass === pass2)
				const userCredentials = {
					user,
					pass
				}

				if (verification) {
					if (!fs.existsSync('.secret.json')) fs.writeFile('.secret.json', JSON.stringify(userCredentials), function () {})
					console.log('Create token!')
					createUserInfo()
					return
				} else {
					console.log('Password did not match, please try again!')
					prompt()
				}
			})
		})
	})
}

if (fs.existsSync('.secret.json')) {
	console.log('Create token!')
	createUserInfo()
} else {
	promptInfo()
}

module.exports = {
	promptInfo,
}



