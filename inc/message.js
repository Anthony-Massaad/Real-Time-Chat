const allMessages = [];

function getTime(){
    const today = new Date();
    const options = {
        weekday: "long",
    };
    const day = today.toLocaleDateString("en-US",options);
    var hours = today.getHours(); 
    var minutes = today.getMinutes();
    minutes = minutes < 10 ? "0"+minutes : minutes;
    const ampm = hours >= 12 ? "pm" : "am" 
    hours = hours ? hours : 12;
    return day + " at " + hours%12 + ":" + minutes + " " + ampm;
}

function createMessage(username, text, userDisplay){
    return formulateMessage(username, text, userDisplay);
}

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

function addToMessages(username, text){
    allMessages.push(formulateMessage(username, text, "other-user"));
}

function getAllMessages(){
    return allMessages;
}

module.exports = {
    createMessage,
    addToMessages,
    getAllMessages
};