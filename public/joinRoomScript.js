

var  joinInput = document.getElementById("joinInput");

function Join_Room(){
    var room_id = joinInput.value
 if(room_id.length == 0){
     return
 }
 
 console.log('in the the join room function')
 console.log(`http://localhost:3000/rooms/${room_id}`)
 window.location.href = `http://localhost:3000/rooms/${room_id}`

}


joinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        Join_Room()
    }
  });