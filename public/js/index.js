const results = {};
const acceptableTypes = ["image/png", "image/jpeg"];
const diceCounts = {};

$("#uploadButton").click(function () {
  $("#fileUpload").click();
});

$("#fileUpload").on("change", function () {
  if (!acceptableTypes.includes(this.files[0].type)) {
    alert("Please upload a JPG or PNG file type.");
    return;
  }

  $(".uploadSpinner").attr("hidden", false);
  $("#uploadButton p").text(" Loading...");
  $("#uploadButton").attr("disabled", true);

  $.ajax({
    url: "/upload",
    type: "POST",
    data: new FormData($("form")[0]),
    cache: false,
    contentType: false,
    processData: false,
    complete: function (jqXHR, status) {
      makeDice(jqXHR.responseJSON);
      $(".uploadSpinner").attr("hidden", true);
      $("#uploadButton p").text("Upload");
      $("#uploadButton").attr("disabled", false);
    },
  });
});

$(".sample-image").click(function () {
  let imageName = this.name;
  if (imageName in results) {
    $("#diceImage").text(results[imageName]);
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
      if (diceCounts[dots[row[y]]]) {
        diceCounts[dots[row[y]]] += 1;
      } else {
        diceCounts[dots[row[y]]] = 1;
      }
    }
    retval += line + "\n";
  }
  console.log(diceCounts);
  $("#diceImage").text(retval);
  let i = 0;
  let reversedDots = [...dots].reverse();
  $(".dicecount").each(function () {
    let currentDice = reversedDots[i];
    $(this).text(`${currentDice} ${diceCounts[currentDice]}`);
    i++;
    console.log("HI" + i);
  });
  return retval;
}
