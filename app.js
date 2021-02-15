const express = require("express");
const Jimp = require("jimp");
const fileUpload = require("express-fileupload");
const imgProcessor = require(`${__dirname}/img-processor.js`);

const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index", {
    imageArray: [],
  });
});

app.get("/results/:path", function (req, res) {
  res.sendFile(`${__dirname}/results/${req.params.path}`);
});

app.post("/", function (req, res) {
  let file = req.files.file;
  console.log(file.tempFilePath);
  imgProcessor.dither(file.tempFilePath);

  res.render("index", {
    imageArray: [
      [4, 5, 6],
      [7, 8, 9],
    ],
  });
});

app.listen(3000, function () {
  console.log("Server running");
});