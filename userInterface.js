var read = require('./lib/read.js')
const fs    = require('fs')


function prompt() {
	read({ prompt: 'Username: ', default: 'test-user' }, function (er, user) {
		read({ prompt: 'Password: ', default: 'test-pass', silent: true }, function (er, pass) {
			read({ prompt: 'Password again: ', default: 'test-pass', silent: true }, function (er, pass2) {
				const verification = (pass === pass2)
				const userCredentials = {
					user,
					pass
				}

				if (verification) {
					if (!fs.existsSync('user.json')) fs.writeFile('user.json', JSON.stringify(userCredentials), function () {})
					return
				} else {
					console.log('Password did not match, please try again!')
					prompt()
				}
			})
		})
	})
}


prompt()

 