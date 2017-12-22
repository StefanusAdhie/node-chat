const Joi = require('joi')
const Message = require('../schema/message')
const modules = require('.')


const message = (clientid, data, callback) => {
	modules.check_token(data.headers, (token) => {
		if(token) {
			/*
			dataMessage: {
				from: string,
				to: string,
				message: string
			}
			*/

			for(var i in clientid) {
				if(clientid[i].userid === data.data.to) {
					const _CLIENTID = clientid[i].clientid
					
					const get_message = {
						from: token,
						message: data.data.message
					}

					const dataMessage = {
						from: token,
						to: data.data.to,
						message: data.data.message,
						create_at: new Date()
					}
					const message = new Message.schema(dataMessage)

					/*
					*
					save to db
					*
					*/
					message.save((err) => {
						if(err) {
							/* err save to db */
							// return callback(err)
							return callback(modules.response(400, 'failed send message'))
						}

						// return callback(true)
						return callback(
							modules.response(200, 'success send message'),
							_CLIENTID,
							modules.response(200, 'get message', get_message)
						)
					})
					/**/
				}
			}
		}
	})
}

module.exports = message
