/**
 * Created by Albert on 10/23/2016.
 */
/*

Example multiway conferencing with SimpleWebRTC framework
Adapted from SimpleWebRTC documentation

 --
 Modified by Alberto G
 */

window.onload = function () {
    var firsttimedone=false;
    // Grab the room name from the URL
    var room = location.search+"1234";

    // Create our WebRTC connection
    var webrtc = new SimpleWebRTC({
        // the element that will hold local video
        localVideoEl: 'localVideo',
        // the element that will hold remote videos
        remoteVideosEl: 'remotes',
        autoRequestMedia: false,
        enableDataChannels: true,
        log: true,
        muted: true
    });
    // When it's ready, and we have a room from the URL, join the call
    webrtc.joinRoom(room);


    $('.videocall').click(function(){
        $(this).attr("disabled", "disabled");
        webrtc.startLocalVideo();
        webrtc.on('readyToCall', function() {
            if (room){
                webrtc.leaveRoom();
                webrtc.joinRoom(room);}
        });
        webrtc.unmute();
        webrtc.on('videoAdded', function (video, peer) {
        console.log('video added', peer);
        var remotes = document.getElementById('remotes');
        if (remotes) {
            var container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + webrtc.getDomId(peer);
            container.appendChild(video);

            // suppress contextmenu
            video.oncontextmenu = function () { return false; };

            remotes.appendChild(container);
        }
    });
    });
    //keep checking remotes even if i didn't press videocall
    //...TBC

//voice only
    $('.call').click(function(){
        webrtc.unmute();
        webrtc.stopLocalVideo();
        webrtc.on('readyToCall', function() {
            if (room){
                webrtc.leaveRoom();
                webrtc.joinRoom(room);
            }
        });
        try{
            $( '.remotes' ).remove();
            console.log('videos removed ', peer);
            var remotes = document.getElementById('remotes');
            var el = document.getElementById('container_' + webrtc.getDomId(peer));
            if (remotes && el) {
                remotes.removeChild(el);
        }}catch(err){}
    });

    // When message sent
    webrtc.connection.on('message', function(data){
        if(data.type === 'chat'){
            console.log('chat received',data);
            if(data.payload.nick){
                $('.messages').append('<div>' + data.payload.nick.substring(0,10)+ ': ' + data.payload.data+'\n'+'<div>');
            }else{
            $('.messages').append('<div>' + data.from.substring(0,5)+ ': ' + data.payload.data+'\n'+'<div>');}
            //scroll down auto
            var wrapper = $('.messages'),
                element = wrapper.find('.amessage'),
                lastElement = wrapper.find('.amessage:last-child');
                //lastElementTop = lastElement.position().top,
                //elementsHeight = element.outerHeight(),
                //scrollAmount = lastElementTop - 2 * elementsHeight;

            $('.messages').animate({
                scrollTop: 100000
            }, 1, function() {
                lastElement.addClass('current-last');
            });
        }
    });

    // Set the room name
    function setRoom(name) {
        $('form').remove();
        $('h1').text('Welcome to room: ' + name);
        $('#subTitle').text('Share this link to have friends join you:');
        $('#roomLink').text(location.href);
        $('body').addClass('active');
    }

    // If there's a room, show it in the UI
    if (room) {
        setRoom(room);
    } else {  // If not, submit email
        $('form').submit(function () {
            var email = $('#form-email').val().replace(/\s/g, '');
            //TBC
            return false;
        });
    }

    //append text to messages
    $('.send_message').click(function(){
        //if contains info append
        if ($('textarea#message_input').val()){
        var msg = $('textarea#message_input').val()+'\n';
        webrtc.sendToAll('chat', {data: msg,nick: $('#form-email').val().replace(/\s/g, '')});
        $('.messages').append('<div class="amessage">'+'You:'+msg+'</div>');
        $('textarea#message_input').val('');
        //scroll down auto
        var wrapper = $('.messages'),
                element = wrapper.find('.amessage'),
                lastElement = wrapper.find('.amessage:last-child'),
                lastElementTop = lastElement.position().top,
                elementsHeight = element.outerHeight(),
                scrollAmount = lastElementTop;
        $('.messages').animate({
            scrollTop: 100000
                //scrollTop: scrollAmount
        }, 1, function() {
            lastElement.addClass('current-last');
        });}
        });


(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('textarea#message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('textarea#message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('textarea#message_input').keyup(function (e) {
            //enter key
            if (e.ctrlKey && e.which === 13) {
                    var msg = $('textarea#message_input').val()+'\n';
                    webrtc.sendToAll('chat', {data: msg,nick: $('#form-email').val().replace(/\s/g, '')});
                    $('.messages').append('<div class="amessage">'+'You:'+msg+'</div>');
                    $('textarea#message_input').val('');
                    //scroll down auto
                    var wrapper = $('.messages'),
                        element = wrapper.find('.amessage'),
                        lastElement = wrapper.find('.amessage:last-child'),
                        lastElementTop = lastElement.position().top,
                        elementsHeight = element.outerHeight(),
                        scrollAmount = lastElementTop;
                    $('.messages').animate({
                        scrollTop: 100000
                        //scrollTop: scrollAmount
                    }, 1, function() {
                        lastElement.addClass('current-last');
                    });
                return sendMessage(getMessageText());
                //return sendMessage(getMessageText());
            } else if ( e.which === 13){
                if(!firsttimedone){
                    console.log("Press Ctrl+Enter for sending the text");
                }else{
                    firsttimedone=true;
                }
            }
        });
    });
}.call(this));

    function hangUp() {
        webrtc.stopLocalVideo();
        webrtc.stopRemoteVideo();
        webrtc.leaveRoom();
        $( "body.my-video" ).empty();
        $( "div.their-video" ).empty();
    }
    //minimize
    $(function()
    {
        var expanded = true;
    $('.button.minimize').click(function(){
        if (!expanded) {
            $('.chat_window').animate({'top' : '75%'}, {duration: 400});
            expanded=true;
        }else{
            // $('.chat_window').slideUp();
            $('.chat_window').animate({'top' : '110%'});
            expanded=false;}
    });
    });


    //close button
    $( '.button.close' ).click(function() {
        $( '.chat_window' ).remove();
        hangUp();
    });
checkCookie();
}

//Cookies

function setCookie(cemail, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*3600));
    var expires = "expires="+d.toUTCString();
    document.cookie = cemail + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cemail) {
    var email = cemail + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(email) == 0) {
            return c.substring(email.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("email");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        //get the paramete from inside and then use here...
        user = $('#form-email').val().replace(/\s/g, '');
        if (user != "" && user != null) {
            setCookie("email", user, 365);
        }
    }
}


