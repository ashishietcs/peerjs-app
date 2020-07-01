var conn;
var peer_id = "p"+Date.now();
var call;
var username;
var remote_peer_id;
var local_stream;
var peer = new Peer( peer_id, {
    secure: true,
      host: 'chat-module.herokuapp.com',
    port: 443,
    debug:true
  });
document.addEventListener("DOMContentLoaded", function(event){
   
},false);

peer.on('open', function() {
    document.getElementById("peer-id-txt").innerHTML = peer.id;
});

peer.on('connection', function(connection) {
    conn = connection;
    peer_id = connection.peer;
    conn.on('data', handleMessage);
});

peer.on('error', function(error) {
    alert("An error occured with peer: "+error);
    console.log(error);
});


peer.on('call', function(call){
    swal({
        title:"Incoming call!",
        text:"Videocall incoming, accept it?",
        icon:"success",
        buttons:true,
    }).then((isConfirm) => {
        if(isConfirm) {
            requestLocalVideo({
                success: function(stream) {
                    local_stream = stream;
                    onReceiveStream(stream,'my-camera');
                },
                error:function(err){
                    alert("Can not get access to your camera and video!");
                    console.log(err);
                }
            });
            call.answer(local_stream);
            call.on('stream', function(stream){
                window.peer_stream = stream;
                onReceiveStream(stream,'peer-camera');
            });
            call.on('clsoe',function(){
                alert("The video call has finished");
            });
        }  else {
            console.log("Call ended!");
        }
    });
});

function requestLocalVideo(callbacks) {
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: false, video: true },
            callbacks.success, callbacks.error
        );
    } else {
        console.log("getUserMedia not supported");
    }
}

function onReceiveStream(stream, element_id) {
    const mediaStream = new MediaStream();
    var video = document.getElementById(element_id);
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
        video.play();
    }
}


function handleMessage(data) {
    var orientation = "text-left";
    var messageHTML = '<div class="fromMe"><label style="float:right">${data.form} </label><br>${data.text}</div>';
    if (data.from == username) {
        var messageHTML = '<div class="fromOther"><label>${data.form} </label><br>${data.text}</div>';
        orientation = "text-right";
    }
    document.getElementById('msgs').innerHTML += messageHTML;
}

/*
document.getElementById("sendMessage").addEventListener("click", function() {
    var text = document.getElementById("message").value;

    var data = {
        from:username,
        text:text
    };
    conn.send(data);
    handleMessage(data);
    document.getElementById("message").value = "";
}, false);

document.getElementById("call").addEventListener("click",function(){
    document.getElementById('callStop').className = 'btn btn-info';
    document.getElementById('call').className = 'btn btn-info hidden';

    call.on('stream',function(stream){
        window.peer_stream = stream;
        onReceiveStream(stream,'peer-camera');
    });
},false);

document.getElementById("callStop").addEventListener("click",function(){
    document.getElementById('call').className = 'btn btn-info';
    document.getElementById('callStop').className = 'btn btn-info hidden';

    call.close();
},false);

*/
document.getElementById("connect-to-peer-btn").addEventListener("click", function(){
    username = document.getElementById("name").value;
    remote_peer_id = document.getElementById("peerid").value;
    
    if(remote_peer_id && username ) {
        conn = peer.connect(remote_peer_id, {
            metadata: {
                'username':username
            }
        });
        conn.on('open', function(){
            console.log("connect to REMOTE opened", conn);
            conn.send('hi!');
          });
        conn.on('data', handleMessage);
    } else {
        swal({
            title:"Details needed!",
            text:"Please add valid details to start call",
            icon:"error"
        });
        return false;
    }
    //document.getElementById('chat').className = "";
    //document.getElementById("connection-form").className += " hidden";
    //document.getElementById("sidebar").className = "sidenav";
},false);


document.getElementById("start-local-media-btn").addEventListener("click", function(){
    requestLocalVideo({
        success: function(stream) {
            local_stream = stream;
            onReceiveStream(stream,'my-camera');
        },
        error:function(err){
                alert("Can not get access to your camera and video!");
                console.log(err);
            }
    });
},false);

document.getElementById("call-to-peer-btn").addEventListener("click", function(){
    username = document.getElementById("name").value;
    remote_peer_id = document.getElementById("peerid").value;
    
    if(remote_peer_id && username ) {
        requestLocalVideo({
            success: function(stream) {
                local_stream = stream;
                onReceiveStream(stream,'my-camera');
            },
            error:function(err){
                alert("Can not get access to your camera and video!");
                console.log(err);
            }
        });
    
        conn = peer.call(remote_peer_id, local_stream, {
            metadata: {
                'username':username
            }
        });
        conn.on('stream', function(stream){
            window.peer_stream = stream;
            onReceiveStream(stream,'peer-camera');
        });

    } else {
        swal({
            title:"Details needed!",
            text:"Please add valid details to start call",
            icon:"error"
        });
        return false;
    }
},false);