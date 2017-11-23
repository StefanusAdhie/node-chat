const modules = require('../modules')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/chat')


var id = []
exports.routes = (io) => {
	io.on('connection', (socket) => {
		console.log('user connected', socket.id, socket.client.conn.remoteAddress, socket.handshake.address)
		id.push(socket.id)

		/*
		*
		register
		*
		*/
		socket.on('register_users', (res) => {
			modules.register_users(res, (value) => {
				console.log('===== modules register_users =====', value)
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
				socket.emit('login', {data: value})
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
			})
		})
		/**/


		/* send message */
		socket.on('send_message', (res) => {
			socket.emit('send_message', 'send_message success')	

			/* get message */
			io.sockets.connected[id[0]].emit('get_message', res)
			socket.broadcast.to(id[0]).emit('get_message', res + '123')
			/**/

			/* room */
			/* call join to subscribe the socket */
			socket.join('room')
			io.to('room').emit('event')

			/* default room */
			socket.on('say to someone', (id, msg) => {
				socket.broadcast.to(id).emit('my msg', msg)
			})
		})
		/**/
	})
}