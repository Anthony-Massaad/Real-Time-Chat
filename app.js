//jshint esversion:6
const {userJoin, getCurrentUser, userLeave, getAllUsers} = require("./inc/users");
const {createMessage, addToMessages, getAllMessages} = require('./inc/message');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
// create server
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// run when client connects .on checks for an event
io.on("connection", socket => {    
    socket.on('joinRoom', ({username}) =>{
        const user = userJoin(socket.id, username);
        // send users info to the sidebar
        io.emit('allUsers', {
            users: getAllUsers()
        });
    });
    socket.emit('displayAllMessages', {
        messages: getAllMessages()
    });
    // emits to only the current user the message format of 
    // class current-user in the div
    socket.on("CurrUserMessage", function(msg, userDisplay){
        const user = getCurrentUser(socket.id);
        socket.emit("userMessageFormat", createMessage(user.username, msg, userDisplay));
        addToMessages(user.username, msg);
    });
    // Broadcasts the user's message to all users but itself 
    // with div class as other-user
    socket.on("otherUserMessage", function(msg, userDisplay){
        const user = getCurrentUser(socket.id);
        socket.broadcast.emit("otherUserMessageFormat", createMessage(user.username, msg, userDisplay));
    });
    // On user disconnect, update the amount of users in the room
    socket.on("disconnect", function(){
        const user = userLeave(socket.id);
        io.emit('allUsers', {
            users: getAllUsers()
        });
    });
});

app.get("/", function(req, res){
    res.redirect("login")
});

app.get("/login", function(req, res){
    res.render('login');
});

app.post("/", function(req, res){
    var username = encodeURIComponent(req.body.username);
    res.redirect("chat?username="+username);
});

app.get("/chat", function(req, res){
    res.render("chat");
});

server.listen(3000, function() {
    console.log("Server started on port 3000");
});

