const http = require("http");
const url = require("url");

// const bodyParser = require("body-parser");
const {
  getUsers,
  getUser,
  createUser,
  updateUserById,
  deleteUserById,
} = require("./controller/user");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  //Creates user
  //route POST /users/create
  if (req.method === "POST" && req.url == "/users/create") {
    createUser(req, res);
  }
  //Gets all users
  //route GET /users/all
  else if (req.method === "GET" && req.url === "/users/all") {
    getUsers(req, res);
  }
  //Gets user by Id
  //route POST /users/get/:id
  else if (
    req.method === "POST" &&
    req.url.match(
      /users\/get\/([0-9a-f]{8}\-[0-9a-f]{4}\-4[0-9a-f]{3}\-[89ab][0-9a-f]{3}\-[0-9a-f]{12})/
    )
  ) {
    const id = req.url.split("/")[3];
    getUser(req, res, id);
  }
  //Updates user by Id
  //route PUT /users/update/:id
  else if (
    req.method === "PUT" &&
    req.url.match(
      /\/users\/update\/([0-9a-f]{8}\-[0-9a-f]{4}\-4[0-9a-f]{3}\-[89ab][0-9a-f]{3}\-[0-9a-f]{12})/
    )
  ) {
    const id = req.url.split("/")[3];
    updateUserById(req, res, id);
  }
  //Delete user by Id
  //route DELETE /users/delete/:id
  else if (
    req.method === "DELETE" &&
    req.url.match(
      /\/users\/delete\/([0-9a-f]{8}\-[0-9a-f]{4}\-4[0-9a-f]{3}\-[89ab][0-9a-f]{3}\-[0-9a-f]{12})/
    )
  ) {
    const id = req.url.split("/")[3];
    deleteUserById(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});
server.listen(PORT, () => {
  console.log("Server running");
});
