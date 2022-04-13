//jshint esversion:6

// ** BEGINNING OF VARIABLE DECLARATIONS/INITIALIZATIONS ** //
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
// ** END OF VARIABLE DECLARATIONS/INITIALIZATIONS ** //

// ** INITIALIZING THE APP ** //
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// ** INITIALIZING THE APP ** //

// On socket connection
io.on("connection", socket => {    
    // Socket event for when a user Joins the room
    socket.on('joinRoom', ({username}) =>{
        const user = userJoin(socket.id, username);
        // send users info to the sidebar
        io.emit('allUsers', {
            users: getAllUsers()
        });
        // Send all previous messages to the user joining
        socket.emit('displayAllMessages', {
            messages: getAllMessages()
        });
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

// redirection method to the login page on initial load
app.get("/", function(req, res){
    res.redirect("login")
});

// Render the login page when redirected
app.get("/login", function(req, res){
    res.render('login');
});

// On login, redirect to the chat room with the username query in place
app.post("/", function(req, res){
    var username = encodeURIComponent(req.body.username);
    res.redirect("chat?username="+username);
});

// Render the chat page when redirected
app.get("/chat", function(req, res){
    res.render("chat");
});

// On server listen to http://localhost:3000/
server.listen(3000, function() {
    console.log("Server started on http://localhost:3000/");
});

