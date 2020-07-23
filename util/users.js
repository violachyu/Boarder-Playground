const allUsers = [];

// Join user to chat
function userJoin(user_id, username, wb_id, wb_name) {
  const user = { user_id, username, wb_id, wb_name };
  allUsers.push(user);
  return user;
}
// Get users in this room
function getRoomUsers(wb_id) {
  return allUsers.filter(user => user.wb_id === wb_id);
}

// Get online user count
function getUserCount() {
  return allUsers.length
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
