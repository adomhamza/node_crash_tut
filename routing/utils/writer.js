const fs = require("fs");

function writeTofile(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf-8", (error) => {
    if (error) {
      console.log(error);
    }
  });
}
module.exports = { writeTofile };
