const socket = io();
const chatClass = $(".chat");
const CURRENT_USER_CLASS_NAME = "current-user";
const OTHER_USER_CLASS_NAME = "other-user";

// parse query
const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// on user join room
socket.emit('joinRoom', {username});

// get all users and display on side navigation
socket.on("allUsers", ({users})=>{
    outputAllUsers(users);
});

socket.on("displayAllMessages", ({messages}) => {
    outputAllMessages(messages);
});

// format message for the current user message (curre-user class)
socket.on("userMessageFormat", (formattedMessage) => {
    sendMessage(formattedMessage);
    //scroll down
    chatClass.scrollTop(chatClass[0].scrollHeight);
});

// format message for the other users (other-user-class)
socket.on("otherUserMessageFormat", (formattedMessage) => {
    sendMessage(formattedMessage);
    //scroll down
    chatClass.scrollTop(chatClass[0].scrollHeight);
});

// Display the users in the chat 
$("#view-users-entered").click(function(event){
    if ($(this).hasClass("selected")){
        $(this).removeClass("selected");
        $(".user-display").removeClass("open");
        $(".chat-room").removeClass("move-right");
    }   
    else {
        $(this).addClass("selected");
        $(".user-display").addClass("open");
        $(".chat-room").addClass("move-right");
    }
});

// Sends a message
$("#msg").keypress(function (e) {
    if(e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        if ($(this).val() == "") return;
        // get the message
        const msg = $(this).val();
        // sending a message to the server 
        socket.emit("CurrUserMessage", msg, CURRENT_USER_CLASS_NAME);
        socket.emit("otherUserMessage", msg, OTHER_USER_CLASS_NAME);
        // clear textarea
        $(this).val("");
    }
}); 

function sendMessage(msgFormat){
    chatClass.append(msgFormat);
}

function outputAllUsers(users){
    $(".users").html(
        users.map(user => `
        <div class="user-item">
            <img src="images/avatar.png" alt="user-img" class="user-profile-img">
            <h2>${user.username}</h2>
        </div>
        `).join('')
    );
}

function outputAllMessages(messages){
    messages.forEach(message => sendMessage(message));
}

