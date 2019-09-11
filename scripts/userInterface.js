'use strict'

const read = require('../lib/read.js')
const fs    = require('fs')
const { createUserInfo } = require('./createToken')


function promptInfo() {
	read({ prompt: 'Username: ', default: 'test-user', silent: false }, function (er, user) {
		read({ prompt: 'Password: ', default: 'test-pass', silent: true }, function (er, pass) {
			read({ prompt: 'Password again: ', default: 'test-pass', silent: true }, function (er, pass2) {
				read({ prompt: 'URL to login ', default: 'google', silent: false }, function (er, url) {
					const verification = (pass === pass2)
					const userConfiguration = {
						user,
						pass,
						url : 'https://' + url + '.com'
					}

					if (verification) {
						if (!fs.existsSync('.secret.json')) fs.writeFile('.secret.json', JSON.stringify(userConfiguration), function () {})
						// eslint-disable-next-line no-console
						console.log('Creating user ...')
						createUserInfo()
						return
					} else {
						read({ prompt: 'Your password did not match! Try again? (y/N)', default: '' }, function (er, question) {
							if (question == 'y' || question == 'Y') {
								promptInfo()
							} else {
							// eslint-disable-next-line no-console
								return console.error('Exiting the user configuration!')
							}
						})

					}
				})
			})
		})
	})
}

if (fs.existsSync('.secret.json')) {
	createUserInfo()
} else {
	promptInfo()
}

module.exports = {
	promptInfo,
}



