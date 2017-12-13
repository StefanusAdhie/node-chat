const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Users = require('../schema/users')
const modules = require('.')


this._cekPassword = (value, db, callback) => {
	for(var i in db) {
		if(db[i].email == value.userid || db[i].phone == value.userid) {
			bcrypt.compare(value.password, db[i].password, function(err, res) {
				if(err) {
					return callback(modules.response(400, 'wrong user or password'))
				}

				if(res) {
					const data = {
						_id: db[i]._id,
						email: db[i].email,
						phone: db[i].phone
					}

					jwt.sign(data, 'asdf123*', function(err, token) {
						if(err) {
							return callback(modules.response(400, 'wrong user or password'))
						}

						data['token'] = token
						return callback(modules.response(200, 'user found', data))
					})
				} else {
					return callback(modules.response(400, 'wrong user or password'))
				}
			})
		}
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
	modules.check_token(data.headers, (token) => {
		if(token === false) {
			Joi.validate(data.data, Users.schemaLogin, (err, value) => {
				if(err) {
					/* failed joi validation */
					// return callback(err)
					return callback(modules.response(400, 'wrong user or password'))
				}

				/*
				*
				find email
				*
				*/
				Users.schema.find({email: value.userid}, (errEmail, dbEmail) => {
					if(errEmail) {
						/* error find email in db */
						// return callback(errEmail)
						return callback(modules.response(400, 'wrong user or password'))
					}

					if(dbEmail.length == 0) {
						/*
						*
						find phone number
						*
						*/
						modules.phoneNumber(value.userid, (res) => {
							if(res) {
								Users.schema.find({phone: value.userid}, (errPhone, dbPhone) => {
									if(errPhone) {
										/* error find phone number in db */
										// return callback(errPhone)
										return callback(modules.response(400, 'wrong user or password'))
									}

									if(dbPhone.length == 0) {
										return callback(modules.response(400, 'wrong user or password'))
									} else {
										/* cek password */
										this._cekPassword(value, dbPhone, (res) => {
											return callback(res)
										})
									}
								})	
							} else {
								/* error format phone */
								return callback(modules.response(400, 'wrong user or password'))
							}
						})
						/**/
					} else {
						/* cek password */
						this._cekPassword(value, dbEmail, (res) => {
							return callback(res)
						})
					}
				})
				/**/
			})
		} else {
			/* user have token */
			return callback(modules.response(400, 'user not found'))
		}
	})
}

module.exports = login