const Joi = require('joi')
const bcrypt = require('bcrypt')
const saltRounds = 10
const Users = require('../schema/users')
const modules = require('.')


const register_users = (data, callback) => {
	modules.check_token(data, (token) => {
		if(token === false) {
			Joi.validate(data.data, Users.schemaRegister, (err, value) => {
				if(err) {
					/* failed joi validation */
					// return callback(err)
					return callback(modules.response(400, 'failed register'))
				}

				bcrypt.hash(value.password, saltRounds, function(err, hash) {
					value['password'] = hash
				
					/* register date */
					value['create_at'] = new Date()
					var users = new Users.schema(value)

					/* 
					*
					find email
					*
					*/
					Users.schema.find({email: value.email}, (errEmail, dbEmail) => {
						if(errEmail) {
							/* error find email in db */
							// return callback(errEmail)
							return callback(modules.response(400, 'failed register'))
						}

						if(dbEmail.length > 0) {
							/* found email */
							// return console.log('email sudah ada di db')
							return callback(modules.response(400, 'failed register'))
						}

						/*
						*
						find phone number
						*
						*/
						modules.phoneNumber(value.phone, (res) => {
							if(res) {
								Users.schema.find({phone: value.phone}, (errPhone, dbPhone) => {
									if(errPhone) {
										/* error find phone in db */
										// return callback(err)
										return callback(modules.response(400, 'failed register'))
									}

									if(dbPhone.length > 0) {
										/* found phone */
										// return console.log('phone sudah ada di db')
										return callback(modules.response(400, 'failed register'))
									}

									/*
									*
									save to db
									*
									*/
									users.save((err) => {
										if(err) {
											/* err save to db */
											// return callback(err)
											return callback(modules.response(400, 'failed register'))
										}

										// return callback(true)
										return callback(modules.response(200, 'success register'))
									})
									/**/
								})
							} else {
								/* error format phone */
								return callback(modules.response(400, 'failed register'))
							}

						})
						/**/
					})
				})
				/**/
			})
		} else {
			/* user have token */
			return callback(modules.response(400, 'user not found'))
		}
	})
}

module.exports = register_users