const Joi = require('joi')
const Users = require('../schema/users')


const register_users = (data, callback) => {
	Joi.validate(data, Users.schemaRegister, (err, value) => {
		if(err) {
			/* failed joi validation */
			return callback(err)
		}

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
				return callback(errEmail)
			}

			if(dbEmail.length > 0) {
				/* found email */
				return console.log('email sudah ada di db')
			}

			/*
			*
			find phone number
			*
			*/
			Users.schema.find({phone: value.phone}, (errPhone, dbPhone) => {
				if(errPhone) {
					/* error find phone in db */
					return callback(err)
				}

				if(dbPhone.length > 0) {
					/* found phone */
					return console.log('phone sudah ada di db')
				}

				/*
				*
				save to db
				*
				*/
				users.save((err) => {
					if(err) {
						/* err save to db */
						return callback(err)
					}

					return callback(true)
				})
				/**/
			})
			/**/
		})
		/**/
	})
}

module.exports = register_users