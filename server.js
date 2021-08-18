const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = 3000;

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

var users = [];

const disconnectUser = function (user) {
	let index = users.indexOf(user);
	users.splice(index, 1);
	console.log(users);
};

io.on('connection', function (socket) {
	socket.on('disconnecting', function () {
		socket.emit('disconnectUser');
	});
	socket.on('removeUser', disconnectUser);
	socket.on('sendMessageToAll', function (message) {
		socket.broadcast.emit('sendMessage', message);
	});
	socket.on('addNewUser', function (user) {
		if (user !== '' && users.indexOf(user) === -1) {
			users.push(user);
			this.emit('userConnect', user);
		} else {
			socket.emit('invalidUsername', user);
		}
	});
});

http.listen(port, function () {
	console.log(`listening on port ${port}`);
});
