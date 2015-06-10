var express = require('express');
var app = express();
var md = require("node-markdown").Markdown;

var http = require('http').Server(app);
var io = require('socket.io')(http);

const root = __dirname+"/";

app.use(express.static('public'));
var id = 0;
var users = [{
	name:'Гость',
	id:id
}];

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * (16 - 5) + 5)];
    }
    return color;
}
var a = 0;
io.on('connection', function(client){
	client.user = {};
  console.log('Connected');
    
    client.user.room = 'freesponds';
    client.user.keypass = '';
    client.user.name = client.user.name===undefined? 'Guest':client.user.name;
    client.user.color = getRandomColor();
    client.join(client.user.room);


  client.broadcast.to(client.user.room).emit('event', {name:"BOT",msg:'В комнату зашел новый человек под номером '+client.id});

  client.on('set_name',function(name){
    client.user.name = name;
  	client.broadcast.to(client.user.room).emit('chat message', {name:'BOT',msg:'Пользователь '+client.user.name+" переименовался на "+client.user.name});
  });

  client.on('disconnect', function(){console.log('Disconnected');});

  client.on('chat message', function(msg){
    if (msg.substr(0,3) =='//-'){
      client.leave(client.user.room);
      client.user.room = msg.substr(4,msg.length);
      console.log(client.user.room); 
      client.join(client.user.room); 
      client.emit('event', {name:"BOT",msg:'В комнате, можно писать и не очковать))'});
      client.broadcast.to(client.user.room).emit('event', {name:"BOT",msg:'В комнате под номером '+client.user.room+' новый чел ))'});
    }else{

    io.sockets.in(client.user.room).emit('chat message', {
      color :client.user.color,
      name  :client.user.name,
      msg   :msg.replace(/(?:\r\n|\r|\n)/g, '<br />')
    });

    }

  });

  client.on('keypress', function(msg){
      client.broadcast.to(client.user.room).emit('keypress', {name:client.user.name});
  });




});


app.get('/', function(req, res){
  res.sendFile(root+'template/index.html');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});