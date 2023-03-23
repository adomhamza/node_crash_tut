const http = require("http");
const fs = require("fs");
const url = require("url");
// const DB = fs.readFileSync("./db.json", "utf-8");
// const data = JSON.parse(DB);
const querystring = require("querystring");
const bodyParser = require("body-parser");
let db;
function readFile(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      // return null;
    }
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    db = jsonData;
    // return jsonData;
  });
}
readFile("./db.json");
const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const reqPath = reqUrl.pathname;
  const reqQuery = reqUrl.query;

  if (req.method === "GET") {
    // Handle GET request
    res.writeHead(200, { "Content-Type": "application/json" });

    let user = db?.users?.find((e) => e.id === reqQuery.id);
    const message = user ? "User found" : "User not found";
    const responseData = { user, message };
    res.end(JSON.stringify(responseData));
  } else if (req.method === "PUT" && reqPath === "/update")
    bodyParser.json()(req, res, () => {
      // Handle PUT request
      const { id, name } = req.body;

      const users = db.users;

      const userToUpdate = users.find((user) => user.id === id);
      if (userToUpdate) {
        userToUpdate.name = name;
        const responseData = { message: "User update Successful" };
        res.end(JSON.stringify(responseData));
        const newDB = { ...db };
        newDB["users"] = users;
        fs.writeFile(
          "db.json",
          JSON.stringify(newDB),
          { flag: "w+" },
          (err) => {
            if (err) {
              const responseData = { message: "User update unsuccessful" };
              res.end(JSON.stringify(responseData));
              return;
            }
            // console.log("File written successfully!");
            // const responseData = { message: "User update successful" };
            // res.end(JSON.stringify(responseData));
          }
        );
        readFile("./db.json");
      } else {
        console.log(`User with ID ${id} not found.`);
        const responseData = { message: "User update unsuccessful" };
        res.end(JSON.stringify(responseData));
      }
    });
  else if (req.method === "POST" && reqPath === "/add") {
    bodyParser.json()(req, res, () => {
      const { id, name, age } = req.body;
      const userToInsert = {
        id: id,
        name: name,
        age: age,
      };
      const userExists = db.users.find((user) => user.name === name);
      if (userExists) {
        const responseData = { message: "User already exists." };
        res.end(JSON.stringify(responseData));
        return;
      }
      db.users.push(userToInsert);
      console.log(db);
      res.end(JSON.stringify(db));
      fs.writeFile("db.json", JSON.stringify(db), { flag: "w+" }, (err) => {
        if (err) {
          const responseData = { message: "User update unsuccessful" };
          res.end(JSON.stringify(responseData));
          return;
        }
        // console.log("File written successfully!");
        // const responseData = { message: "User update successful" };
        // res.end(JSON.stringify(responseData));
      });
      readFile("./db.json");
    });
  } else {
    // Handle 404 Not Found error
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
