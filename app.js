const express = require("express");
const fileUpload = require("express-fileupload");
const imgProcessor = require(`${__dirname}/img-processor.js`);
const fs = require("fs");
const os = require("os");
const imageCache = {};
const app = express();
const numSampleImages = 4;
const allowedImageTypes = ["image/png", "image/jpeg"];

fs.readdirSync("public/images/samples", {
  withFileTypes: true,
})
  .filter((dirent) => dirent.name.endsWith("jpg") && dirent.isFile())
  .forEach(function (dirent, i) {
    imgProcessor.dither(
      `${__dirname}/public/images/samples/${dirent.name}`,
      (err, imgArray) => {
        imageCache[dirent.name.slice(0, -4)] = imgArray;
      }
    );
  });

app.use(express.static(`${__dirname}/public`));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let sampleImages = [];
  i = 0;
  let imageCacheKeys = Object.keys(imageCache);
  while (sampleImages.length < numSampleImages) {
    let randomImage =
      imageCacheKeys[Math.floor(Math.random() * imageCacheKeys.length)];
    if (
      randomImage &&
      !sampleImages.includes(randomImage) &&
      randomImage.charAt(0) != "."
    ) {
      sampleImages.push(randomImage);
    }
    i++;
  }

  res.render("index2", { sampleImages: sampleImages });
});

app.get("/results/:image", function (req, res) {
  if (imageCache[req.params.image]) {
    res.send(imageCache[req.params.image]);
    return;
  }
});

app.post("/upload", function (req, res) {
  let file = req.files.file;
  if (!allowedImageTypes.includes(file.mimetype)) {
    res.status(415).send(`Unsupported media type: ${file.mimetype}.`);
  } else {
    imgProcessor.prepare(file.tempFilePath, () =>
      imgProcessor.dither(file.tempFilePath, (err, imgArray) => {
        if (err) res.status(503).send("An error occurred in the application.");
        else res.send(imgArray);
      })
    );
  }
});

app.get("*", function (req, res) {
  res.status(404).render("404");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running");
});
