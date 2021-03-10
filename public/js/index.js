const results = {};
const acceptableTypes = ["image/png", "image/jpeg"];

$("#uploadButton").click(function () {
  $("#fileUpload").click();
});

$("#fileUpload").on("change", function () {
  if (!acceptableTypes.includes(this.files[0].type)) {
    alert("Please upload a JPG or PNG file type.");
    return;
  }
  $.ajax({
    url: "/upload",
    type: "POST",
    data: new FormData($("form")[0]),
    cache: false,
    contentType: false,
    processData: false,
    complete: function (jqXHR, status) {
      let retval = makeDice(jqXHR.responseJSON);
    },
  });
});

$(".image-select button").click(function () {
  let imageName = this.name;
  if (imageName in results) {
    $("pre").text(results[imageName]);
    return;
  }
  $.get(`/results/${imageName}`, function (imgArray) {
    let retval = makeDice(imgArray);
    results[imageName] = retval;
  });
});

function makeDice(imgArray) {
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
  $("pre").text(retval);
  return retval;
}
