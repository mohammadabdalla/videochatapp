

var  joinInput = document.getElementById("joinInput");
var  nameInput = document.getElementById("nameInput");

function Join_Room(){
    var room_id = joinInput.value.trim()
    var name = nameInput.value.trim()
 if(room_id.length == 0 || name.length == 0){
     return
 }
 
 console.log('in the the join room function')
 //console.log(`http://localhost:3000/rooms/${name}/${room_id}`)
 // window.location.href = `http://localhost:3000/rooms/${name}/${room_id}`
 window.location.href = `http://localhost:3000/rooms/${name}/${room_id}`

}


joinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        Join_Room()
    }
  });