const allUsers = [];

// Join user to chat
function userJoin(user_id, username, userColor, wb_id, wb_name) {
  const user = { user_id, username, userColor, wb_id, wb_name };
  allUsers.push(user);
  return user;
}



// Remove duplicate user
function removeDuplicate_id(all) {
  return all.filter((item, index) => all.indexOf(item) === index)
}
function removeDuplicate(allUsers) {
  let uniqueUsers = Array.from(new Set(allUsers.map(a => a.user_id)))
    .map(user_id => {
      return allUsers.find(a => a.user_id === user_id)
    })
  return uniqueUsers;
}

// Get users in this room
function getRoomUsers(wb_id) {
  let sameRoom = allUsers.filter(user => user.wb_id === wb_id);
  let uniqueUsers = removeDuplicate(sameRoom)
  // console.log('userInRoom~~', removeDuplicate(sameRoom));  //
  return uniqueUsers;
}

// Get online user count
function getUserCount() {
  // unique user_id array
  let allUsers_id = []
  for (let i = 0; i < allUsers.length; i++) {
    allUsers_id.push(allUsers[i].user_id)
  }
  return removeDuplicate_id(allUsers_id).length
}

// Get current user
function getCurrentUser(user_id) {
  return allUsers.find(user => user.user_id === user_id);
}

// User leaves chat
function userLeave(user_id) {
  const index = allUsers.findIndex(user => user.user_id === user_id);

  if (index !== -1) {
    return allUsers.splice(index, 1)[0];
  }
}



module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUserCount
};
