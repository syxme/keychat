function getRandom(min, max)
{
  return Math.random() * (max - min) + min;
}



$(document).ready( function(){
	var socket = io();
	var optionShow = true;
	$('.rename').click(function(){
		socket.emit('set_name',$('#chat_name').val())
	});

	$('#m').keydown(function() {
    if (event.keyCode == 13&&!event.shiftKey) {
       	sendMessage(-1,$('#m').val());
       	$('#m').val('');
        return false;
     }
	});
	$('.options-btn').click(function(){
		$('.options').css('bottom',optionShow? '100px':"22px");
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
		console.log(msg)
		msg.msg = msg.msg;
		$('#messages').append('<div><b class="green">'+msg.name+': </b>'+msg.msg+'</div>');
       	scroll(0,document.body.scrollHeight);
	}



	//SOCK
	socket.on('chat message', function(msg){
		message(msg)
	});
	socket.on('event', function(msg){
		message(msg);
	});
});