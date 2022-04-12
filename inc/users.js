const users = [];

// join user to chat
function userJoin(id, username){
    const user = {
        id, username
    };
    users.push(user);
    return user; 
}

// user leaves the chat 
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}

function getAllUsers(){
    return users.filter(user => user.username !== undefined); 
}

// get the current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

module.exports = {
    userJoin, 
    getCurrentUser,
    userLeave,
    getAllUsers
};