var utils = require("./utils");

var Socket = function (http){
	var io = require('socket.io')(http);

	io.on('connection', function(client){

		//console.log(io.sockets.connected);//.adapter.rooms.freesponds);
	  	
	  	console.log('Connected user');
		client.user = {};
		client.user.room = 'freesponds';
		client.user.name = client.user.name===undefined? 'Guest':client.user.name;
		client.user.color = utils.getRandomColor();
		client.user.icon = Math.floor(Math.random() * (20 - 1) + 1);
		client.join(client.user.room);

		client.broadcast.to(client.user.room).emit('event', {color:'#EF8545',name:"BOT",msg:'В комнату зашел новый человек под номером '+client.id});

		client.on('set_name',function(name){
			client.user.name = name;
		  	client.broadcast.to(client.user.room).emit('chat message', {name:'BOT',msg:'Пользователь '+client.user.name+" переименовался на "+client.user.name});
		});
		var tmp = '';
		client.on('chat message', function(msg){
			if (msg.substr(0,5) =='/list'){
				var list_u = io.sockets.adapter.rooms[client.user.room];
				Object.keys(list_u).forEach(function(key) {
					if (client.id!=key){
						tmp +=io.sockets.connected[key].user.name+'<br>';
					}
				});
				client.emit('event', {evn:'6',name:"BOT",msg:tmp,color:'#EF8545'});
				tmp = '';
			}
			return;
			if (msg.substr(0,5) =='/room'){
				client.leave(client.user.room);
				client.user.room = msg.substr(6,msg.length);
				client.join(client.user.room); 
				client.emit('event', {name:"BOT",msg:'В комнате, можно писать и не очковать))',color:'#EF8545'});
				client.broadcast.to(client.user.room).emit('event', {name:"BOT",msg:'В комнате под номером '+client.user.room+' новый чел ))'});
			}else{
				io.sockets.in(client.user.room).emit('chat message', {
					color	:client.user.color,
					name	:client.user.name,
					msg		:msg.replace(/(?:\r\n|\r|\n)/g, '<br />'),
					icon	:client.user.icon
				});
			}
		});

	  client.on('keypress', function(msg){
		  client.broadcast.to(client.user.room).emit('keypress', {name:client.user.name});
	  });

	  client.on('disconnect', function(id){
	  		client.broadcast.to(client.user.room).emit('event', {evn:'7',color:'#EF8545',name:'BOT',msg:'Пользователь '+client.user.name+" ливнул нахуй с чата"});
	  	console.log('Disconnected');});

	});

}

Socket.prototype.getUsers = function () {

}




module.exports = Socket;