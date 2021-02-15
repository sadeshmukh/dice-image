const Jimp = require("jimp");
const NUMLEVELS = 7;
const LEVELWIDTH = 256 / NUMLEVELS;

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

module.exports.luminance = function (filePath, callback) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;

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

module.exports.dither = function (filePath, callback) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;
    console.log("\n\n--Start--\n\n");
    module.exports.prepare(filePath);
    module.exports.luminance(filePath, (img) => {
      //   console.log(img);
      console.log(img.length, img[0].length);
      for (let x = 0, row = img[x]; x < img.length; x++, row = img[x]) {
        for (let y = 0, pixel = img[y]; y < row.length; y++, pixel = row[y]) {
          console.log(y);
          let qVal = Math.floor((pixel + 1) / LEVELWIDTH);
          img[x][y] = qVal;
          let debt = pixel - qVal * 7;
          // #region Error Correction
          // Right
          y < row.length && (img[x][y + 1] += Math.round((7 / 16) * debt));
          // Bottom right
          x < img.length &&
            y < row.length &&
            (img[x + 1][y + 1] += Math.round(1 / 16) * debt);
          // Bottom
          x < img.length && (img[x + 1][y] += Math.round(5 / 16) * debt);
          // Bottom left
          x < img.length &&
            y > 0 &&
            (img[x + 1][y - 1] += Math.round(3 / 16) * debt);
          //#endregion
        }
      }
      console.log(img);
      callback();
      console.log("\n\nDone\n\n");
    });
  });
};
