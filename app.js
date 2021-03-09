const express = require("express");
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

app.get("/new", function (req, res) {
  res.render("index2", { imageArray: [] });
});

// app.get("/results/:path", function (req, res) {
//   res.sendFile(`${__dirname}/results/${req.params.path}`);
// });

app.get("/results/:image", function (req, res) {
  imgProcessor.dither(
    `${__dirname}/public/images/samples/${req.params.image}.jpg`,
    (err, imgArray) => {
      console.log("callback called back");
      res.send(imgArray);
    }
  );
});

app.post("/", function (req, res) {
  let file = req.files.file;
  console.log(file.tempFilePath);
  imgProcessor.dither(file.tempFilePath, (err, imgArray) => {
    console.log("callback called back");
    res.render("index", {
      imageArray: imgArray,
    });
  });
});

app.post("/new", function (req, res) {
  let file = req.files.file;
  console.log(file.tempFilePath);
  imgProcessor.dither(file.tempFilePath, (err, imgArray) => {
    console.log("callback called back");
    res.render("index2", {
      imageArray: imgArray,
    });
  });
});

app.listen(3000, function () {
  console.log("Server running");
});
