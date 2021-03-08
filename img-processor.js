const Jimp = require("jimp");
const NUMLEVELS = 7;
const LEVELWIDTH = 256 / NUMLEVELS;
const RESIZECLAMP = 400;

const clamp = (num, a, b) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

module.exports.prepare = function (filePath, callback) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;
    file.grayscale();
    if (file.getHeight() > RESIZECLAMP && file.getHeight() >= file.getWidth()) {
      file.resize(Jimp.AUTO, RESIZECLAMP);
    } else if (file.getWidth() > RESIZECLAMP) {
      file.resize(RESIZECLAMP, Jimp.AUTO);
    }
    file.write(filePath);
    callback(filePath);
  });
};

module.exports.luminance = function (filePath, callback) {
  Jimp.read(filePath, (err, file) => {
    if (err) throw err;

    let imgArray = [];
    for (ypixel = 0, height = file.getHeight(); ypixel < height; ypixel++) {
      let pixels = [];
      for (xpixel = 0, width = file.getWidth(); xpixel < width; xpixel++) {
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
    module.exports.prepare(filePath, (filePath) => {
      module.exports.luminance(filePath, (img) => {
        //   console.log(img);
        console.log(img.length, img[0].length);
        for (let x = 0, row = img[x]; x < img.length; x++, row = img[x]) {
          for (let y = 0, pixel = row[y]; y < row.length; y++, pixel = row[y]) {
            pixel = clamp(pixel, 0, 255);
            let qVal = Math.floor(pixel / LEVELWIDTH);
            img[x][y] = qVal;
            let debt = pixel - qVal * NUMLEVELS;

            // #region Error Correction
            // Right
            y + 1 < row.length &&
              (img[x][y + 1] += Math.round((7 / 16) * debt));
            // Bottom right
            x + 1 < img.length &&
              y + 1 < row.length &&
              (img[x + 1][y + 1] += Math.round(1 / 16) * debt);
            // Bottom
            x + 1 < img.length && (img[x + 1][y] += Math.round(5 / 16) * debt);
            // Bottom left
            x + 1 < img.length &&
              y > 0 &&
              (img[x + 1][y - 1] += Math.round(3 / 16) * debt);
            //#endregion
          }
        }
        console.log(img);
        callback(null, img);
        console.log("\n\nDone\n\n");
      });
    });
  });
};
