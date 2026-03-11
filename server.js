const http = require('http');
const { handleRoutes } = require('./routes/routes');

const PORT = 3000;

const server = http.createServer((req, res) => {
  handleRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`  GET    /              -> Trang chu (index.html)`);
  console.log(`  GET    /api/users     -> Danh sach users`);
  console.log(`  GET    /api/users/:id -> User theo id`);
  console.log(`  POST   /api/users     -> Them user moi`);
  console.log(`  DELETE /api/users/:id -> Xoa user`);
});
