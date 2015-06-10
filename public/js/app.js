function getRandom(min, max)
{
  return Math.random() * (max - min) + min;
}



$(document).ready( function(){
	var messagem = new Audio("/media/msg.wav");

	var socket = io();
	var optionShow = true;

	$('.rename').click(function(){
		socket.emit('set_name',$('#chat_name').val())
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
	});
	$('.options-btn').click(function(){
		$('.options').css('bottom',optionShow? '100px':"7px");
		optionShow = !optionShow;
	});
	$('form span').click(function(){
		sendMessage(-1,$('#m').val());
       	$('#m').val('');
	});

	function sendMessage(to,message){
		if (to==-1){
			socket.emit('chat message', message);
       		scroll(0,document.body.scrollHeight);
		}
	}

	function message(msg){
		messagem.play();
		var time = new Date();
		time = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
		$('#messages').append('<div class="ms"><b style="color:'+msg.color+'">'+msg.name+': </b>'+msg.msg+'<div class="timed">'+time+'</div></div>');
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
});