const User = require("../model/user");
const { postData } = require("../utils/data");

async function getUsers(req, res) {
  try {
    const users = await User.fetchAll();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.log(er);
  }
}

async function getUser(req, res, id) {
  try {
    const user = await User.fetchbyId(id);
    if (user) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User Not Found" }));
    }
  } catch (error) {
    console.log(error);
  }
}

async function createUser(req, res) {
  try {
    const body = await postData(req);
    const { name, age, blogs } = JSON.parse(body);
    const user = { name, age, blogs: blogs || [] };
    const newUser = await User.create(user);
    res.writeHead(201, { "Content-Type": "application/json" });

    return res.end(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
async function updateUserById(req, res, id) {
  try {
    const user = await User.fetchbyId(id);
    if (user) {
      const body = await postData(req);
      const { name, age, blogs } = JSON.parse(body);

      (user.name = name ?? user.name),
        (user.age = age ?? user.age),
        // user.blogs.push(blogs) ?? user.blogs,
        console.log(user);
      if (blogs === undefined) {
        user.blogs;
      } else {
        user.blogs.push(blogs);
      }

      const updateUser = await User.update(id, user);
      res.writeHead(200, { "Content-Type": "application/json" });

      return res.end(JSON.stringify(updateUser));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User Not Found" }));
    }
  } catch (error) {
    console.log(error);
  }
}
async function deleteUserById(req, res, id) {
  try {
    const user = await User.fetchbyId(id);
    if (user) {
      await User.remove(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: `User ${user.name} deleted` }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User Not Found" }));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserById,
  deleteUserById,
};
