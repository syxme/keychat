function getRandom(min, max)
{
  return Math.random() * (max - min) + min;
}

var store_message = [];
var index_message = 0;
var user = {};
$(document).ready( function(){
	var messagem = new Audio("/media/msg.wav");
	var leave = new Audio("/media/leave.mp3");
	var socket = io();
	var optionShow = true;


	$('.rename').click(function(){
		if ($('#chat_name').val()!=''){
			socket.emit('set_name',$('#chat_name').val());
			user.name = $('#chat_name').val();
		}
	});
	
	$('#m').keypress(function(){
		socket.emit('keypress','x');
	});
	
	$('#m').keydown(function() {
	    if (event.keyCode == 13&&!event.shiftKey) {
	    	var msgs = $('#m').val();
	    	if (msgs!=''){
	       		sendMessage(-1,msgs);
	       		$('#m').val('');
	       	}
	        return false;
	    }
	    if (event.keyCode == 38) {
	    	index_message++;
	    	if (store_message.length-index_message<0)
	    		index_message = 0;
	    	$('#m').val(store_message[store_message.length - index_message]);
	    }
	});
	
	var icon = 1;var pre_icon = 'x'+icon;
	$('.saveIcon').click(function(){
		user.icon = icon
		socket.emit('user_info', user);
	});
	
	$('.left-btn.left').click(function(){
		icon--;
		if (icon<1) icon = 20;
		$('.change-icon > .block > .icon').removeClass(pre_icon).addClass('x'+icon);
		pre_icon = 'x'+icon;
	});
	
	$('.left-btn.right').click(function(){
		icon++;
		if (icon>20) icon = 1;
		$('.change-icon > .block > .icon').removeClass(pre_icon).addClass('x'+icon);
		pre_icon = 'x'+icon;
	});
	
	$('.options-btn').click(function(){
		$('.options').css('bottom',optionShow? '100px':"7px");
		optionShow = !optionShow;
	});
	
	$('form span').click(function(){
		if ($('#m').val()!=''){
			sendMessage(-1,$('#m').val());
       		$('#m').val('');
		}
	});

	function sendMessage(to,message){
		if (to==-1){
			store_message.push(message);
			index_message = 0;
			if (store_message.length>30)
				store_message.shift();
			socket.emit('chat message', message);
       		scroll(0,document.body.scrollHeight);
		}
	}

	var sxx = 1;
	function message(msg){
		var style = 'ms';
		if (msg.evn == 7){
			leave.play();
		}else{
			messagem.play();
		}
		if (msg.evn == 11){
		
			for (var i = 0; i<msg.history_ms.length;i++){
				message(msg.history_ms[i]);
			}
			return;
		}

		style = msg.evn? 'mse':'ms';
		var tpl_msg = '<div class="'+style+'"><b  class="user"style="color:'+msg.color+'">'+msg.name+'</b><div class="icon x'+msg.icon+'"></div><div class="msg">'+msg.msg+'</div><div class="timed">'+msg.time+'</div></div>'
		sxx++;
		$('#messages').append(tpl_msg);
       	scroll(0,document.body.scrollHeight);
	}
	var time_out_id = 0;


	//SOCK


	socket.on('keypress', function(msg){
		clearTimeout(time_out_id);
		$('.keypress').text(msg.name+' набирает сообщение').css('display','block');
		time_out_id = setTimeout("$('.keypress').text('').css('display','none')",500);
	});


	socket.on('chat message', function(msg){
		message(msg)
	});
	socket.on('event', function(msg){
		
		message(msg);
	});
	socket.on('user_info', function(msg){
		
		user = msg;
	});
});