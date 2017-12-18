/*
*
schema mongoose
*
*/
const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
	from: String,
	to: String,
	create_at: {
		type: Date
	}
})

exports.schema = mongoose.model('Message', Schema)
/**/
