/*
*
schema mongoose
*
*/
const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
	email: String,
	phone: String,
	password: String,
	create_at: {
		type: Date
	},
	update_at: {
		type: Date
	}
})

exports.schema = mongoose.model('Users', Schema)
/**/


/*
*
schema joi register
*
*/
const Joi = require('joi')

exports.schemaRegister = Joi.object().keys({
	email: Joi.string().email(),
	phone: Joi.string(),
	password: Joi.string()
})
/**/


/*
*
schema joi login
*
*/
exports.schemaLogin = Joi.object().keys({
	userid: Joi.string(),
	password: Joi.string()
})
/**/