const Joi = require('joi')
const Users = require('../schema/users')


const update_users = (data, callback) => {
	Joi.validate(data, Users.schema, (err, value) => {
		if(err) {
			/* failed joi validation */
			return callback(err)
		}

		/* update date */
		value['update_at'] = new Date()

		Users.Users.update({email: value.email}, value, (err, db) => {
			if(err) {
				/* error find email in db */
				return callback(err)
			}

			return callback(true)
		})
	})
}

module.exports = update_users