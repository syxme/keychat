var express = require('express');
var app     = express();
var md = require("node-markdown").Markdown;

var http = require('http').Server(app);
var io  = require('./system/iosettings')(http);

const root = __dirname+"/";

app.use(express.static('public'));


app.get('/', function(req, res){
  res.sendFile(root+'template/index.html');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});