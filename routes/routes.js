const fs = require('fs');
const path = require('path');
const { sendJSON, getMimeType } = require('../utils/helper');
const userController = require('../controllers/userController');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function handleRoutes(req, res) {
  const { method, url } = req;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // API Routes
  if (url === '/api/users' && method === 'GET') {
    return userController.getAllUsers(req, res);
  }

  if (url.match(/^\/api\/users\/\d+$/) && method === 'GET') {
    const id = url.split('/')[3];
    return userController.getUserById(req, res, id);
  }

  if (url === '/api/users' && method === 'POST') {
    return userController.createUser(req, res);
  }

  if (url.match(/^\/api\/users\/\d+$/) && method === 'DELETE') {
    const id = url.split('/')[3];
    return userController.deleteUser(req, res, id);
  }

  // Static file serving
  let filePath;
  if (url === '/' || url === '/index.html') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  } else {
    filePath = path.join(PUBLIC_DIR, url);
  }

  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        sendJSON(res, 404, { success: false, message: 'Route not found' });
      } else {
        sendJSON(res, 500, { success: false, message: 'Internal server error' });
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': getMimeType(ext) });
    res.end(content);
  });
}

module.exports = { handleRoutes };
