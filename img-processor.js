const Jimp = require("jimp");

module.exports.prepare = function (filePath) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;
    file.grayscale();
    if (file.getHeight() > 200 && file.getHeight() >= file.getWidth()) {
      file.resize(Jimp.AUTO, 200);
    } else if (file.getWidth() > 200) {
      file.resize(200, Jimp.AUTO);
    }
    file.resize(file.getWidth() / 3, Jimp.AUTO);
    file.write(filePath);
  });
};

module.exports.quantize = function (filePath, callback) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;
    console.log("\n\n--Start--\n\n");
    let imgArray = [];
    for (xpixel = 0, width = file.getWidth(); xpixel < width; xpixel++) {
      let pixels = [];
      for (ypixel = 0, height = file.getHeight(); ypixel < height; ypixel++) {
        let rgbVal = Jimp.intToRGBA(file.getPixelColor(xpixel, ypixel));
        let quantVal = rgbVal.r;
        pixels.push(quantVal);
      }
      imgArray.push(pixels);
    }
    callback(imgArray);
  });
};

module.exports.dither = function (filePath) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;
    module.exports.prepare(filePath);
    module.exports.quantize(filePath, (imgArray) => {
      console.log(imgArray);
      console.log("\n\nDone\n\n");
    });
  });
};
