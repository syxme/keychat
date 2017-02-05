var utils = require("./utils");
var names = [
	'Василий',
	'Петро',
	'Ишак',
	'Иван',
	'Никола',
	'Люся-хуюся',
	'Лопата',
	'Педро',
	'Ведро Фигохуев',
	'Ништяк Голопедов',
	'Шахлык Евродыркин'
	]
var history_ms = [];
var History = false;
function getTime(){
	var time = new Date();
	var sec = time.getSeconds();
	var hour = time.getHours()+3;
	if (hour>24) hour = hour-24;
	var min = time.getMinutes();
	if (sec<10) 
		sec = '0'+sec;
	if (hour<10) 
		hour = '0'+hour;
	if (min<10) 
		min = '0'+min;
	return hour+':'+min+':'+sec;
	
}
var Socket = function (http){
	var io = require('socket.io')(http);
	
	function postOnlineUsers(id,room){
		var list_u = io.sockets.adapter.rooms[room];
		var tmp = '';
		Object.keys(list_u).forEach(function(key) {
			if (id!=key){
				tmp +=io.sockets.connected[key].user.name+'<br>';
			}
		});
		return !tmp? 'Никого':tmp;
	}
	
	io.on('connection', function(client){

		var rn = Math.floor(Math.random() * (11 - 0) + 0);
		console.log('Connected user');
		client.user = {};
		client.user.room = '';
		client.user.name = client.user.name===undefined? names[rn]:client.user.name;
		client.user.color = utils.getRandomColor();
		client.user.icon = Math.floor(Math.random() * (20 - 1) + 1);
		client.join(client.user.room);
		
		 function send(q,msg){
		 	msg.time = getTime();
			client.broadcast.to(client.user.room).emit(q, msg);
			if (client.user.room=='')
				history_ms.push(msg);
			if (history_ms.length>100)history_ms.shift();
		}
		
		if(History){
			client.emit('event',{evn:11,history_ms:history_ms});
		}
		client.emit('user_info',client.user);
		client.emit('event', {evn:'2',name:"Помошник хуев",msg:'Вы можете чатиться, /list узнать есть ли кто нить в чате<br>/room имя_комнаты перейти в другую комнату <br> Для полного кайфа нажми на на F11. <br>'+
		'Сейчас в комнете:<br>'+postOnlineUsers(client.id,client.user.room),color:'#EF8545',time:'NOW'});
		send('event',{evn:2,color:'#EF8545',name:"BOT",msg:'В комнату зашел новый человек под именем '+client.user.name});

		client.on('set_name',function(name){
			send('chat message', {name:'BOT',msg:'Пользователь '+client.user.name+" переименовался на "+name});
			client.user.name = name;
		});
		client.on('user_info',function(usr){
			client.emit('event', {name:"BOT",msg:'Ты изменил аву, красавчег',color:'#EF8545',time:'NOW'});
			client.user = usr;
		});
		var tmp = '';
		client.on('chat message', function(msg){
			if (msg.substr(0,5) =='/list'){
				tmp  = postOnlineUsers(client.id,client.user.room);
				client.emit('event', {evn:'6',name:"BOT",msg:tmp,color:'#EF8545',time:'NOW'});
				return;
			}
			if (msg.substr(0,8) =='/admindx'){
					client.user.name = "System Asdgfasdf";
					client.user.color = '#3FA8FF';
					client.user.icon = 'Admin';
				return;
			}
			if (msg.substr(0,10) =='/onhistory'){
					History = true;
				return;
			}
			if (msg.substr(0,11) =='/offhistory'){
					History = false;
				return;
			}
			if (msg.substr(0,5) =='/room'){
				client.leave(client.user.room);
				client.user.room = msg.substr(6,msg.length);
				client.join(client.user.room); 
				client.emit('event', {name:"BOT",msg:'В комнате, можно писать и не очковать))',color:'#EF8545'});
				send('event', {name:"BOT",msg:'В комнате под номером '+client.user.room+' новый чел ))'});
			}else{
				var msq = {
					color	:client.user.color,
					name	:client.user.name,
					msg		:msg.replace(/(?:\r\n|\r|\n)/g, '<br />'),
					icon	:client.user.icon,
					time 	: getTime()
				}
				if (client.user.room=='')
					history_ms.push(msq);
				if (history_ms.length>500)history_ms.shift();
				io.sockets.in(client.user.room).emit('chat message', msq);
			}
		});

	  client.on('keypress', function(msg){
		  client.broadcast.to(client.user.room).emit('keypress', {name:client.user.name});
	  });

	  client.on('disconnect', function(id){
	  	send('event', {evn:'7',color:'#EF8545',name:'BOT',msg:'Пользователь '+client.user.name+" ливнул нахуй с чата"});
	  	console.log('Disconnected');});

	});

}

Socket.prototype.getUsers = function () {

}




module.exports = Socket;
