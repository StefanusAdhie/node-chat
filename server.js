const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/src/index.html')
})

require('./src/routes').routes(io)


http.listen(3000, '0.0.0.0', () => {
	console.log('this server running on port 3000')
})