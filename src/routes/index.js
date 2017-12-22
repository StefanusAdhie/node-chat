const modules = require('../modules')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/chat')


var clientid = []
exports.routes = (io) => {
	io.on('connection', (socket) => {
		console.log('user connected', socket.id, socket.client.conn.remoteAddress, socket.handshake.address)
		clientid.push({clientid: socket.id})

		socket.on('clientid', (res) => {
			console.log('===== clientid =====', clientid)
			modules.check_token(res.headers, (token) => {
				if(token) {
					for(var i in clientid) {
						/*
						*
						remove old client id
						*
						*/
						if(clientid.length > 1) {
							if(clientid[i].userid === token) {
								console.log(i)
								clientid.splice(i, 1)
							}
						}
						/**/

						/*
						*
						add new client id
						*
						*/
						if(clientid[i].clientid === res.data) {
							socket.emit('clientid', token)
							return clientid[i]['userid'] = token
						}
						/**/
					}
					
					socket.emit('clientid', token)
					// clientid.push(res)
				}

				socket.emit('clientid', false)
			})
		})

		/*
		*
		check
		*
		*/
		socket.on('check_users', (res) => {
			console.log('check_users', res)
			modules.check_users(res, (value) => {
				console.log('===== modules check_users =====', value)
				socket.emit('check_users', value)
			})
		})

		/*
		*
		register
		*
		*/
		socket.on('register_users', (res) => {
			modules.register_users(res, (value) => {
				console.log('===== modules register_users =====', value)
				socket.emit('register_users', value)
			})
		})
		/**/


		/*
		*
		login
		*
		*/
		socket.on('login', (res) => {
			modules.login(res, (value) => {
				console.log('===== modules login =====', value)
				socket.emit('login', value)
			})
		})
		/**/


		/*
		*
		update
		*
		*/
		socket.on('update_users', (res) => {
			modules.update_users(res, (value) => {
				console.log('===== modules update_users =====', value)
				socket.emit('update_users', value)
			})
		})
		/**/


		/* send message */
		socket.on('send_message', (res) => {
			/*modules.check_token(res.headers, (token) => {
				if(token) {
					socket.emit('send_message', modules.response(200, 'success send message'))

					for(var i in clientid) {
						if(clientid[i].userid === res.data.to) {
							const get_message = {
								from: token,
								message: res.data.message
							}
							socket.broadcast.to(clientid[i].clientid).emit('get_message', modules.response(200, 'get message', get_message))
						}
					}
				}
			})*/ 

			modules.message(clientid, res, (value1, id, value2) => {
				console.log('===== modules message =====', value1)
				socket.emit('send_message', value1)
				if(id) {
					console.log('===== modules message =====', id, value2)
					socket.broadcast.to(id).emit('get_message', value2)
				}
			})

			/* get message */
			/*io.sockets.connected[id[0]].emit('get_message', res)
			socket.broadcast.to(id[0]).emit('get_message', res + '123')*/
			/**/

			/* room */
			/* call join to subscribe the socket */
			/*socket.join('room')
			io.to('room').emit('event')*/

			/* default room */
			// socket.emit('say to someone', (id, msg) => {
			// })
		})
		/**/
	})
}
