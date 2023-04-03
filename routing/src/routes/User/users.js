const http = require("http");
const fs = require("fs");
const url = require("url");
const bodyParser = require("body-parser");
const {} = require("");

let db = {};
function readFile(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return null;
    }
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    db = jsonData;
    // return jsonData;
  });
}
readFile("./db.json");
const PORT = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const reqPath = reqUrl.pathname;
  const reqQuery = reqUrl.query;
  console.log(reqUrl);
  console.log(req.url);
  console.log(reqPath);

  if (req.method === "GET" && reqUrl.pathname === "/user") {
    // Handle GET request
    res.writeHead(200, { "Content-Type": "application/json" });

    let user = db?.users?.find((e) => e.id === reqQuery.id);
    const message = user ? "User found" : "User not found";
    const responseData = { user, message };
    res.end(JSON.stringify(responseData));
  } else if (req.method === "PUT" && reqPath === "/user/update") {
    bodyParser.json()(req, res, () => {
      // Handle PUT request
      const { id, name, age } = req.body;

      const users = db.users;

      const userToUpdate = users.find((user) => user.id === id);
      if (userToUpdate) {
        userToUpdate.name = name;
        userToUpdate.age = age;

        console.log(userToUpdate);
        // res.end(JSON.stringify({ userToUpdate, message }));
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
            console.log("File written successfully!");
          }
        );
        const message = "User updated successfully";
        res.end(JSON.stringify({ userToUpdate, message }));
        readFile("./db.json");
      } else {
        console.log(`User with ID ${id} not found.`);
        const responseData = { message: "User update unsuccessful" };
        res.end(JSON.stringify(responseData));
      }
    });
  } else if (req.method === "POST" && reqPath === "/user/add") {
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

server.listen(PORT, () => {
  console.log("Server listening on port 3000");
});

module.exports = { readFile };
