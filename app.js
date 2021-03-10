const express = require("express");
const fileUpload = require("express-fileupload");
const imgProcessor = require(`${__dirname}/img-processor.js`);
const fs = require("fs");
const os = require("os");
const imageCache = {};
const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  allFiles = fs.readdirSync("public/images/samples");

  allFiles.forEach(function (val, i) {
    allFiles[i] = allFiles[i].slice(0, -4);
  });

  const countFiles = allFiles.length;
  let sampleImages = [];

  i = 0;

  while (sampleImages.length < 3) {
    let randomImage = allFiles[Math.floor(Math.random() * countFiles)];
    if (!sampleImages.includes(randomImage) && randomImage.charAt(0) != ".") {
      sampleImages.push(randomImage);
    }
    i++;
  }

  res.render("index2", { imageArray: [], sampleImages: sampleImages });
});

app.get("/results/:image", function (req, res) {
  if (imageCache[req.params.image]) {
    res.send(imageCache[req.params.image]);
    return;
  }

  imgProcessor.dither(
    `${__dirname}/public/images/samples/${req.params.image}.jpg`,
    (err, imgArray) => {
      imageCache[req.params.image] = imgArray;
      res.send(imgArray);
    }
  );
});

app.post("/upload", function (req, res) {
  let file = req.files.file;
  console.log(file);
  imgProcessor.dither(file.tempFilePath, (err, imgArray) => {
    if (err) throw err;
    res.send(imgArray);
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running");
});
