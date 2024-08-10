const { Server } = require("socket.io");
require("dotenv").config();
const port = process.env.SOCKET_PORT;
const clienthost = process.env.CLIENT_HOST;
const io = new Server({ cors: clienthost });
let onlineUsers = [];
io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  //listen to a connection
  socket.on("addNewUser", (userid) => {
    !onlineUsers.some((user) => user?.userid === userid) &&
      onlineUsers.push({
        userid,
        socketid: socket.id,
      });
    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  //SEND NOTES WITH CONNECTION REQUEST NOTIFICATION
  socket.on("sendNotes",(notes)=>{
    const user = onlineUsers.find((user)=>user.userid === notes.recipientid);
    // console.log(user);
    console.log(notes);
    if(user){
        io.to(user.socketid).emit("getNotes",notes);
    }
  })
  //SEND MESSAGE TO THE USER
  socket.on("sendMessage",(message)=>{
    console.log("message",message)
    const user = onlineUsers.find((user)=>user.userid === message.recipientid);
    console.log("user",user)
    if(user){
        io.to(user.socketid).emit("getMessage",message);
    }
  })
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketid !== socket.id);
	  io.emit("getOnlineUsers", onlineUsers);
  console.log(onlineUsers);
  });

});

io.listen(port);