// ** BEGINNING OF VARIABLE DECLARATION/INITIALIZATION ** //
const allMessages = [];
// ** END OF VARIABLE DECLARATION/INITIALIZATION ** //

/**
 * Function that generates the day and time a message is sent
 * it is based of the local time
 * @returns String, formatted time to "Day at hh:mm am/pm"
 */
function getTime(){
    const today = new Date();
    const options = {
        weekday: "long",
    };
    const day = today.toLocaleDateString("en-US",options);
    var hours = today.getHours(); 
    var minutes = today.getMinutes();
    minutes = minutes < 10 ? "0"+minutes : minutes;
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12; 
    hours = hours ? hours : 12;
    return day + " at " + hours + ":" + minutes + " " + ampm;
}

/**
 * Function that creates the message to be sent based on the user's display
 * @param {String} username, the user's username 
 * @param {String} text, the user's message sent
 * @param {String} userDisplay, the class name for the div. Either "current-user" or "other-user"
 * @returns String, the corrected formatted html message
 */
function createMessage(username, text, userDisplay){
    return formulateMessage(username, text, userDisplay);
}

/**
 * Function that properly formats and creates the html message to be sent
 * @param {String} username, the user's username 
 * @param {String} text, the user's message sent
 * @param {String} userDisplay, the class name for the div. Either "current-user" or "other-user"
 * @returns String, the corrected formatted html message
 */
function formulateMessage(username, text, userDisplay){
    return `
        <div class="box radius-10px ${userDisplay} margin-left-right-15px">
            <img src="images/avatar.png" alt="" class="user-profile-img">
            <div class="detail-container">
                <span class="username">${username}</span> 
                <span class="time">${getTime()}</span>
            </div> 
            <p class="message">
                ${text}
            </p>   
        </div>
    `;
}

/**
 * Add the message that is sent to the Array of all messages
 * @param {String} username, the user's username 
 * @param {String} text, the user's message sent
 */
function addToMessages(username, text){
    allMessages.push(formulateMessage(username, text, "other-user"));
}

/**
 * returns the AllMessage Array once called
 * @returns Array, All the messages
 */
function getAllMessages(){
    return allMessages;
}

module.exports = {
    createMessage,
    addToMessages,
    getAllMessages
};