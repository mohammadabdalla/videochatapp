const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer({host:'peer-server-video-chat.herokuapp.com', secure:true})
/* const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
}) */
//tele-api-test.nixpend.com
const myVideo = document.createElement('video')
myVideo.muted = true

const videoEnabledIcon = document.getElementById('videoEnabledIcon')
const videoDisabledIcon = document.getElementById('videoDisabledIcon')


const muteEnabledIcon = document.getElementById('muteEnabledIcon')
const muteDisabledIcon = document.getElementById('muteDisabledIcon')

const peers = {}

let myVideoStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  console.log('rea user deconected',userId)
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})
var myDataConnection = 
myPeer.on('connection', function(dataConnection) {
   console.log(dataConnection)
   myDataConnection = dataConnection
  
  });

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



//this is aimed to enable or disable mic
function Mute_Option_Handler(action){
  if(action === 'enable'){
    myVideoStream.getAudioTracks()[0].enabled = true;
    muteDisabledIcon.classList.add("hideElement");
    muteEnabledIcon.classList.remove("hideElement");
  }else{
    myVideoStream.getAudioTracks()[0].enabled = false;
    muteEnabledIcon.classList.add("hideElement");
    muteDisabledIcon.classList.remove("hideElement");
  }
}

const chatContainer = document.getElementById("chat-container")

function ConversationBarHandler(action){
  show_notification('hide')
if(action=='show'){
  console.log('reached the open')
  chatContainer.classList.add("open");
}else{
  chatContainer.classList.remove("open");
}
}




//this is aimed to enable or disable video
function Video_Option_Handler(action){
  //myVideo.remove()

  if(action === 'enable'){
  myVideoStream.getVideoTracks()[0].enabled = true;
  videoDisabledIcon.classList.add("hideElement");
  videoEnabledIcon.classList.remove("hideElement");
 }else{
  myVideoStream.getVideoTracks()[0].enabled = false;
  videoDisabledIcon.classList.remove("hideElement");
  videoEnabledIcon.classList.add("hideElement");
 } 
 
}


var  chatInput = document.getElementById("chatInput");
var  sendButton = document.getElementById("sendButton");
var  chatMessages = document.getElementById("chatMessages");
sendButton.addEventListener("click", (e) => {
  if (chatInput.value.length !== 0) {
    socket.emit("message", chatInput.value);
    chatInput.value = "";
  }
});


chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (chatInput.value.length !== 0) {
      socket.emit("message", chatInput.value);
      chatInput.value = "";
    }
  }
});

const notificationFlag = document.getElementById('notificationFlag')
function show_notification(action){
  if(action=='show'){
    notificationFlag.classList.remove('hideElement')
  }else{
    notificationFlag.classList.add('hideElement')
  }
}

socket.on("createMessage", (message) => {
  //console.log('new message')
  show_notification('show')
  chatMessages.innerHTML =
    chatMessages.innerHTML +
    `<div  style="margin-bottom:10px;margin-top:10px;">
        <i class="far fa-user-circle" style="color:#EEEEEE;font-size:20px;margin-left:5px;"></i> <span style="color:#EEEEEE;font-size:20px;">user</span>  
        <div style="padding:5px;background-color:#EEEEEE;width:90%;border-radius:10px;margin:5px;overflow-wrap: break-word;" >${message}</div>
    </div>`;
});



function Leave_Call(){
 window.location.href = "/leave";
}

