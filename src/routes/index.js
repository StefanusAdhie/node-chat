const modules = require('../modules')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/chat')


var clientid = []
exports.routes = (io) => {
	io.on('connection', (socket) => {
		console.log('user connected', socket.id, socket.client.conn.remoteAddress, socket.handshake.address)
		clientid.push(socket.id)

		socket.on('userid', (res) => {
			for(var i in clientid) {
				if(clientid[i].userid === res.userid) {
					return clientid[i].clientid = res.clientid
				}
			}
			clientid.push(res)
		})

		/*
		*
		check
		*
		*/
		socket.on('check_users', (res) => {
			modules.check_users(res.data, (value) => {
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
			modules.check_token(res.headers, (token) => {
				if(token) {
					socket.emit('send_message', res.data.message)	
					
					for(var i in clientid) {
						if(clientid[i].userid === res.data.to) {
							const get_message = {
								from: token,
								message: res.data.message
							}
							socket.broadcast.to(clientid[i].clientid).emit('send_message', modules.response(200, 'get message', get_message))
						}
					}
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