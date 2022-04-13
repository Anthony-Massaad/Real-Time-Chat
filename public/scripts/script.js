// ** BEGINNING OF VARIABLE DECLARATIONS/INITIALIZATIONS ** //
const socket = io(); 
const chatClass = $(".chat");
const CURRENT_USER_CLASS_NAME = "current-user";
const OTHER_USER_CLASS_NAME = "other-user";
// parse query string for the username when user enters
const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// ** END OF VARIABLE DECLARATIONS/INITIALIZATIONS ** // 

/**
 * Handle socket event when a user joins the room
 */
socket.emit('joinRoom', {username});

/**
 * Socket event that handles the functionality for when a user joins or leaves the room. 
 * In this case, it would display all the users in the sidebar
 */
socket.on("allUsers", ({users})=>{
    outputAllUsers(users);
});

/**
 * Socket event that handles the functioanlity for when a user joins the room, allowing them 
 * to see all the previous sent messages
 */
socket.on("displayAllMessages", ({messages}) => {
    outputAllMessages(messages);
});

/**
 * Socket event that handles the functioanlity to appending the message for the user only
 */
socket.on("userMessageFormat", (formattedMessage) => {
    sendMessage(formattedMessage);
    scrollDownChatBoxOnMessage();
});

/**
 * Socket event that handles the functioanlity to appending the message for others users only
 */
socket.on("otherUserMessageFormat", (formattedMessage) => {
    sendMessage(formattedMessage);
    scrollDownChatBoxOnMessage();
});

/**
 * On click functionality that will display the side bar when the user clicks the 
 * circular image at the top left of the container 
 */
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

/**
 * When the user hits the enter key without the shift keys being pressed,
 * it will send the message they wrote to the chat as long as at least one letter or 
 * number was typed in the textarea. 
 * 
 * It will emit the message to all users with the div class name of .other-user, while for the 
 * user who sent the message will see the message with div classs name of .current-user. This is to 
 * differentiate the two text boxes of the user who sent it, and how other users will see the message.
 */
$("#msg").keypress(function (e) {
    if(e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        // get the message and checks if it is a valid msg to send
        var msg = $(this).val();
        msg = msg.trim();
        if (!msg) {
            return;
        }
        // sends the message in two different appearances. 
        //For the current user, and other users
        socket.emit("CurrUserMessage", msg, CURRENT_USER_CLASS_NAME);
        socket.emit("otherUserMessage", msg, OTHER_USER_CLASS_NAME);
        // resets the textarea for the user
        $(this).val("");
    }
}); 

/**
 * Function that will append a formatted message to the div with class name "chat" 
 * under chat.ejs.
 * @param {String} msgFormat, Formatted message
 */
function sendMessage(msgFormat){
    chatClass.append(msgFormat);
}

/**
 * Function that will output all the users that is connected to the sidebar. 
 * @param {Array} users, An array of users that is connected to the server
 */
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

/**
 * Function that will output all the previous messages when a user first joins the chat
 * @param {Array} messages, An array of messages that was sent throughout the chat 
 */
function outputAllMessages(messages){
    messages.forEach(message => sendMessage(message));
}

/**
 * Function that will scroll to the bottom of the .chat div when an user sends a message
 */
function scrollDownChatBoxOnMessage(){
    chatClass.scrollTop(chatClass[0].scrollHeight);
}
