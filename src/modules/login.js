const Joi = require('joi')
const Users = require('../schema/users')


this._cekPassword = (value, db, callback) => {
	for(var i in db) {
		if(db[i].email == value.userid || db[i].phone == value.userid) {
			if(value.password == db[i].password) {
				/* user found */
				return callback(db[i])
			}
			/* wrong password */
			return console.log('wrong password')
		}
		/* user not found */
		return console.log('user not found')
	}
}

this.response = (code, message, data) => {
	const value = {
		headers: {
			status: code,
			message: message
		},
		data: data
	}
	return value
}

const login = (data, callback) => {
	Joi.validate(data, Users.schemaLogin, (err, value) => {
		if(err) {
			/* failed joi validation */
			return callback(err)
		}

		/*
		*
		find email
		*
		*/
		Users.schema.find({email: value.userid}, (errEmail, dbEmail) => {
			if(errEmail) {
				/* error find email in db */
				return callback(errEmail)
			}

			if(dbEmail.length == 0) {
				/*
				*
				find phone number
				*
				*/
				Users.schema.find({phone: value.userid}, (errPhone, dbPhone) => {
					if(errPhone) {
						/* error find phone number in db */
						return callback(errPhone)
					}

					if(dbPhone.length == 0) {
						return callback(this.response(400, 'user not found'))
					}

					/* cek password */
					this._cekPassword(value, dbPhone, (res) => {
						return callback(res)
					})
				})
				/**/
			}

			/* cek password */
			this._cekPassword(value, dbEmail, (res) => {
				return callback(res)
			})
		})
		/**/
	})
}

module.exports = login