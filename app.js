var express = require('express');
var app = express();


var http = require('http').Server(app);
var io = require('socket.io')(http);

const root = __dirname+"/";

app.use(express.static('public'));
var id = 0;
var users = [{
	name:'Гость',
	id:id
}];


io.on('connection', function(client){
	client.user = {};
  console.log('Connected');

  io.emit('event', {name:"BOT",msg:'В Час зашел новый человек под номером '+client.id});
  client.on('set_name',function(name){
  	var storename = client.user.name;
    client.user.name = name;
  	io.emit('chat message', {name:'BOT',msg:'Пользователь '+storename+" переименовался на "+client.user.name});
  });
  client.on('disconnect', function(){
    console.log('Disconnected');
  });

  client.on('chat message', function(msg){
    client.user.name = client.user.name===undefined? 'Guest':client.user.name;
    io.emit('chat message', {name:client.user.name,msg:msg.replace(/(?:\r\n|\r|\n)/g, '<br />')});
  });
});


app.get('/', function(req, res){
  res.sendFile(root+'template/index.html');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});