'use strict'

const fs    = require('fs')
const jwt = require('jsonwebtoken');


let secretContent

function createUserInfo() {
	fs.readFile('.secret.json', 'utf8', function(err, contents) {
		secretContent = JSON.parse(contents)
		const token = jwt.sign({ user: secretContent.user, pass: secretContent.pass, url: 'someUrl' }, 'fooshh');
		fs.writeFile('token.json', JSON.stringify({token}), function () {})
		fs.unlink('.secret.json',function(){});  
	});
}



module.exports = {
	createUserInfo,
}
