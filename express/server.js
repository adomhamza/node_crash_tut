const express = require("express");
const app = express();
const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file.originalname);
  res.send(`${req.file.originalname} File uploaded!`);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
