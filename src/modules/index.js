'use strict'

exports.check_token = require('./check_token')
exports.check_users = require('./check_users')
exports.register_users = require('./register_users')
exports.login = require('./login')
exports.update_users = require('./update_users')

exports.response = (code, message, data) => {
	const value = {
		headers: {
			status: code,
			message: message
		},
		data: data ? data : null
	}
	return value
}

exports.phoneNumber = (text, cb) => {
	var a = /[^0-9]/
	return cb(!a.test(text))
}