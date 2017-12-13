const Joi = require('joi')
const Users = require('../schema/users')
const modules = require('.')


const _findPhone = (value, cb) => {
	modules.phoneNumber(value, (res) => {
		if(res) {
			Users.schema.find({phone: value}, (errPhone, dbPhone) => {
				if(errPhone) {
					/* error find phone */
					return cb(modules.response(400, 'user not found'))
				}
				console.log('=====', dbPhone)
				if(dbPhone.length === 0) {
					return cb(modules.response(400, 'user not found'))
				} else {
					/* found phone number */
					return cb(modules.response(200, 'user found'))
				}
			})
		} else {
			return cb(modules.response(400, 'user not found'))
		}
	})
}

const _findEmail = (value, cb) => {
	Users.schema.find({email: value}, (errEmail, dbEmail) => {
		if(errEmail) {
			/* error find email */
			return cb(modules.response(400, 'user not found'))
		}
		
		if(dbEmail.length === 0) {
			/* find phone number */
			_findPhone(value, (res) => {
				return cb(res)
			})
		} else {
			/* found email */
			return cb(modules.response(200, 'user found'))
		}
	})
}

const check_users = (data, callback) => {
	try {
		modules.check_token(data.headers, (token) => {
			if(token === false) {
				/* find email */
				_findEmail(data.data, (cb) => {
					return callback(cb)
				})
			} else {
				/* user have token */
				return callback(modules.response(400, 'user not found'))
			}
		})
	} catch(err) {}
}

module.exports = check_users