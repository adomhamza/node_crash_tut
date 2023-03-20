const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
let db = {};
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

  if (req.method === "GET" && reqPath === "/data") {
    // Handle GET request to /data
    res.writeHead(200, { "Content-Type": "application/json" });

    let user = db?.users?.find((e) => e.id === reqQuery.id);
    const message = user ? "User found" : "User not found";
    const responseData = { user, message };
    res.end(JSON.stringify(responseData));
  } else if (req.method === "PUT" && reqPath === "/data") {
    // Handle PUT request to /data
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const putData = querystring.parse(body);
      console.log("PUT data:", putData);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Received PUT data: ${JSON.stringify(putData)}`);
    });
  } else if (req.method === "POST" && reqPath === "/data") {
    // Handle POST request to /data
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const postData = querystring.parse(body);
      console.log("POST data:", postData);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Received POST data: ${JSON.stringify(postData)}`);
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
