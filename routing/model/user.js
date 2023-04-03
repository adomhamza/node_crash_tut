const users = require("../data/db.json");
const { v4: uuidv4 } = require("uuid");
const { writeTofile } = require("../utils/writer");

function fetchAll() {
  return new Promise((resolve, rejects) => {
    resolve(users);
  });
}

function fetchbyId(id) {
  return new Promise((resolve, rejects) => {
    const user = users.users?.find((user) => user.id === id);
    resolve(user);
  });
}

function create(user) {
  return new Promise((resolve, rejects) => {
    const newUser = { id: uuidv4(), ...user };
    users.users.push(newUser);
    writeTofile("./data/db.json", users);
    resolve(newUser);
  });
}

function update(id, user) {
  return new Promise((resolve, rejects) => {
    const index = users.users.findIndex((x) => x.id === id);
    users.users[index] = { id, ...user };
    writeTofile("./data/db.json", users);
    resolve(users.users[index]);
  });
}
function remove(id) {
  return new Promise((resolve, reject) => {
    const index = users.users.findIndex((x) => x.id === id);
    users.users.splice(index, 1);
    writeTofile("./data/db.json", users);
    resolve();
  });
}
module.exports = { fetchAll, fetchbyId, create, update, remove };
