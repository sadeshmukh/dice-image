const RESULTS = {};

$("#fileUpload").on("change", function () {
  $("#fileChosen").text(this.files[0].name);
});

$(".image-select button").click(function () {
  let imageName = this.name;
  if (imageName in RESULTS) {
    $("pre").text(RESULTS[imageName]);
    return;
  }
  $.get(`/results/${imageName}`, function (imgArray) {
    console.log(imgArray);
    let dots = ["□", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"].reverse();
    // let dots = ['#000', '#111', '#333', '#666', '#999', '#ccc', '#fff'];
    let retval = "";
    for (let x = 0; x < imgArray.length; x++) {
      let row = imgArray[x];
      let line = "";
      for (let y = 0; y < imgArray[0].length; y++) {
        line += dots[row[y]];
      }
      retval += line + "\n";
    }
    RESULTS[imageName] = retval;
    $("pre").text(retval);
  });
});
