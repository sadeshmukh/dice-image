const Jimp = require("jimp");
const fs = require("fs");
const NUMLEVELS = 7;
const LEVELWIDTH = 256 / NUMLEVELS;
const RESIZECLAMP = 250;
const SOURCE_DIR = "/Users/sdeshmukh/Downloads/unsplash";

function scaleToFit(filePath, resultFileName) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;
    if (file.getHeight() > RESIZECLAMP && file.getHeight() >= file.getWidth()) {
      file.resize(Jimp.AUTO, RESIZECLAMP);
    } else if (file.getWidth() > RESIZECLAMP) {
      file.resize(RESIZECLAMP, Jimp.AUTO);
    }
    let targetFilePath = `tmp/resized/${resultFileName}`;
    console.log(`Writing: ${targetFilePath}`);
    file.write(targetFilePath);
  });
}

allFiles = fs.readdirSync(SOURCE_DIR);

allFiles.forEach(function (val, i) {
  console.log(val, i);
  scaleToFit(`${SOURCE_DIR}/${val}`, val);
});
