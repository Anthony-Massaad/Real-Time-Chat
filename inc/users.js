// ** BEGINNING OF VARIABLE DECLARATION/INITIALIZATION ** //
const users = [];
// ** END OF VARIABLE DECLARATION/INITIALIZATION ** //

/**
 * Handle function that adds the user when joining the room
 * user is based of their userID and username 
 * @param {Integer} id, a unique id based on the user's socket.id 
 * @param {String} username, the user's username they entered in the login chat
 * @returns Array, the user's array
 */
function userJoin(id, username){
    const user = {
        id, username
    };
    users.push(user);
    return user; 
}

/**
 * Handle function that removes the user when leaving the room
 * @param {Integer} id, a unique id based on the user's socket.id 
 * @returns ARray, the new array when splicing the leaving user
 */
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}

/**
 * Handle function that will get all the user's that username does not have undefined
 * @returns Array, Users whose names are not undefined
 */
function getAllUsers(){
    return users.filter(user => user.username !== undefined); 
}

/**
 * Handle function that will get the user based on their socket id
 * @param {Integer} id, a unique id based on the user's socket.id 
 * @returns user, the dictionary data type of the user consisting of id and username
 */
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

module.exports = {
    userJoin, 
    getCurrentUser,
    userLeave,
    getAllUsers
};