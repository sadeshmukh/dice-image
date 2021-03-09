const express = require("express");
const fileUpload = require("express-fileupload");
const imgProcessor = require(`${__dirname}/img-processor.js`);
const fs = require("fs");
const imageCache = {};
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
  allFiles = fs.readdirSync("public/images/samples");

  allFiles.forEach(function (val, i) {
    allFiles[i] = allFiles[i].slice(0, -4);
  });

  console.log(allFiles);
  const countFiles = allFiles.length;
  let sampleImages = [];

  i = 0;

  while (sampleImages.length < 3) {
    let randomImage = allFiles[Math.floor(Math.random() * countFiles)];
    if (!sampleImages.includes(randomImage) && randomImage.charAt(0) != ".") {
      sampleImages.push(randomImage);
      // console.log(randomImage);
    }
    i++;
  }

  console.log(sampleImages);
  res.render("index2", { imageArray: [], sampleImages: sampleImages });
});

// app.get("/results/:path", function (req, res) {
//   res.sendFile(`${__dirname}/results/${req.params.path}`);
// });

app.get("/results/:image", function (req, res) {
  if (imageCache[req.params.image]) {
    res.send(imageCache[req.params.image]);
    console.log(imageCache);
    return;
  }

  imgProcessor.dither(
    `${__dirname}/public/images/samples/${req.params.image}.jpg`,
    (err, imgArray) => {
      console.log("callback called back");
      imageCache[req.params.image] = imgArray;
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
