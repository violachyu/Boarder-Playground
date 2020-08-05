const all_users = [];

// Join user to chat
function userJoin(socket_id, user_id, username, user_color, wb_id, wb_name) {
  const user = { socket_id, user_id, username, user_color, wb_id, wb_name };
  all_users.push(user);
  // console.log('allUsers', allUsers);  //
  return user;
}

// Remove duplicate user
function removeDuplicateId(all) {
  return all.filter((item, index) => all.indexOf(item) === index)
}

function removeDuplicate(all_users) {
  let unique_users = Array.from(new Set(all_users.map(a => a.user_id)))
    .map(user_id => {
      return all_users.find(a => a.user_id === user_id)
    })
  return unique_users;
}

// Get users in this room
function getRoomUsers(wb_id) {
  let same_room = all_users.filter(user => user.wb_id === wb_id);
  let unique_users = removeDuplicate(same_room);
  return unique_users;
}

// Get online user count
function getUserCount() {
  // unique user_id array
  let allUsers_id = []
  for (let i = 0; i < all_users.length; i++) {
    allUsers_id.push(all_users[i].user_id);
  }
  return removeDuplicateId(allUsers_id).length;
}

// Get current user
function getCurrentUser(user_id) {
  return all_users.find(user => user.user_id === user_id);
}

// User leaves chat
function userLeave(socket_id) {
  // get user that just left
  let index = all_users.findIndex(user => user.socket_id === socket_id);
  // delete leaving user from allUsers
  let new_users = all_users.reduce((p, c) => (c.socket_id !== socket_id && p.push(c), p), []);

  if (index !== -1) {
    let user_left = all_users.splice(index, 1)[0];
    return { user_left, new_users }
  }
}


module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUserCount
};
