const { readUsersFromFile, writeUsersToFile, getRequestBody, sendJSON } = require('../utils/helper');

function getAllUsers(req, res) {
  const users = readUsersFromFile();
  sendJSON(res, 200, { success: true, count: users.length, data: users });
}

function getUserById(req, res, id) {
  const users = readUsersFromFile();
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return sendJSON(res, 404, { success: false, message: `User with id ${id} not found` });
  }

  sendJSON(res, 200, { success: true, data: user });
}

async function createUser(req, res) {
  try {
    const body = await getRequestBody(req);
    const { name, email, phone } = body;

    if (!name || !email) {
      return sendJSON(res, 400, { success: false, message: 'Name and email are required' });
    }

    const users = readUsersFromFile();
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      name,
      email,
      phone: phone || ''
    };

    users.push(newUser);
    writeUsersToFile(users);

    sendJSON(res, 201, { success: true, message: 'User created successfully', data: newUser });
  } catch (err) {
    sendJSON(res, 400, { success: false, message: err.message });
  }
}

function deleteUser(req, res, id) {
  const users = readUsersFromFile();
  const index = users.findIndex((u) => u.id === parseInt(id));

  if (index === -1) {
    return sendJSON(res, 404, { success: false, message: `User with id ${id} not found` });
  }

  const deleted = users.splice(index, 1);
  writeUsersToFile(users);

  sendJSON(res, 200, { success: true, message: 'User deleted successfully', data: deleted[0] });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser
};
