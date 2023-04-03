const http = require("http");
const fs = require("fs");
const url = require("url");
const bodyParser = require("body-parser");
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
readFile("./blogs.json");
const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const reqPath = reqUrl.pathname;
  const reqQuery = reqUrl.query;
  if (req.method === "POST" && reqPath === "/blog/add") {
    bodyParser.json()(req, res, () => {
      const { id, topic, content, comment } = req.body;
      console.log(id, topic, content, comment);
      const blogToInsert = {
        id,
        topic,
        content,
        comment: comment ?? [],
      };
      const userExists = db.blogs.find((user) => user.id === id);
      if (userExists) {
        const responseData = { message: "Post already exists." };
        res.end(JSON.stringify(responseData));
        return;
      }
      db.blogs.push(blogToInsert);
      console.log(db);
      const message = "Blog post successfull";
      res.end(JSON.stringify({ blogToInsert, message }));
      fs.writeFile("blogs.json", JSON.stringify(db), { flag: "w+" }, (err) => {
        if (err) {
          const responseData = { message: "Post unsuccessful" };
          res.end(JSON.stringify(responseData));
          return;
        }
        // console.log("File written successfully!");
        // const responseData = { message: "User update successful" };
        // res.end(JSON.stringify(responseData));
      });
      readFile("./blogs.json");
    });
  } else if (req.method === "PUT" && reqPath === "/blog/update") {
    bodyParser.json()(req, res, () => {
      // Handle PUT request
      const { id, topic, content, comment } = req.body;

      const posts = db.blogs;

      const postToUpdate = posts.find((user) => user.id === id);
      if (postToUpdate) {
        postToUpdate.topic = topic;
        postToUpdate.content = content;
        postToUpdate.comment?.push(comment);

        const newDB = { ...db };
        newDB["blogs"] = posts;
        fs.writeFile(
          "blogs.json",
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
        res.end(JSON.stringify({ postToUpdate, message }));
        readFile("./blogs.json");
      } else {
        console.log(`User with ID ${id} not found.`);
        const responseData = { message: "User update unsuccessful" };
        res.end(JSON.stringify(responseData));
      }
    });
  } else if (req.method === "GET" && reqPath === "/blog/all") {
    res.writeHead(200, { "Content-Type": "application/json" });
    try {
      const posts = db.blogs;
      const message = "Success";
      res.end(JSON.stringify({ posts, message }));
    } catch (error) {
      const message = "Unsuccessful";
      res.end(JSON.stringify(message));
    }
  } else if (req.method === "DELETE" && reqPath === "/blog/delete") {
    res.writeHead(200, { "Content-Type": "application/json" });
    bodyParser.json()(req, res, () => {
      // Handle PUT request
      readFile("./blogs.json");
      const { id } = req.body;

      const posts = db.blogs;

      const postToDelete = posts.find((post) => post.id === id);
      console.log(postToDelete);

      console.log(posts);

      //   res.end(JSON.stringify(postToDelete));
      if (postToDelete) {
        const indexOfpostToDelete = posts.findIndex(
          (obj) => obj.id === postToDelete.id
        );
        console.log(indexOfpostToDelete);
        posts.splice(indexOfpostToDelete, 1);
        console.log(posts);

        fs.writeFile(
          "blogs.json",
          JSON.stringify({ blogs: posts }),
          { flag: "w+" },
          (err) => {
            if (err) {
              const responseData = { message: "Post delete unsuccessful" };
              res.end(JSON.stringify(responseData));
              return;
            }
            console.log("File written successfully!");
          }
        );
        const message = "Post deleted successfully";
        res.end(JSON.stringify({ message }));
        readFile("./blogs.json");
      } else {
        console.log(`Post with ID ${id} not found.`);
        const responseData = { message: `Post with ID ${id} not found.` };
        res.end(JSON.stringify(responseData));
      }
    });
  }
});

server.listen(3000, () => console.log("Server listening on port 3000"));
