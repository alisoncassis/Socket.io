var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000))

var clients = [];
var connections = [];

http.listen(app.get('port'), function() {
	console.log('Porta padrao 3000');
});



app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

//CONNECTION
io.sockets.on("connection", function(socket) {
	connections.push(socket);
	console.log('connected: %s sockets connected', connections.length);

	//DISCONNECT
	socket.on('disconnect', function(data){
		clients.splice(clients.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnect: %s sockets connected', connections.length);
	});

	//SEND MESSAGE
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	//NEW USER
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		clients.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', clients);
	}
});
