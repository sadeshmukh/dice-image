const results = {};
const acceptableTypes = ["image/png", "image/jpeg"];
const MB = 1024 * 1024;
const maxFileSize = 5 * MB;
const diceHistogramTotal = 35;
const dots = ["▢", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"].reverse();
const reversedDots = [...dots].reverse();

$.get("/txt/bannerTitle.txt", function (data) {
  // Show banner title in console
  console.log(data);
});

$.get("/txt/banner.txt", function (data) {
  // Show banner in console
  console.log(data);
});

$("#uploadButton").click(function () {
  $("#fileUpload").click();
});

$("#fileUpload").on("change", function () {
  if (this.files[0].size > maxFileSize) {
    alert(
      `File size ${(this.files[0].size / MB).toFixed(2)}MB larger than ${
        maxFileSize / MB
      }MB.`
    );
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
      calculateStats(makeDice(jqXHR.responseJSON).counts);
      $(".uploadSpinner").attr("hidden", true);
      $("#uploadButton p").text("Upload");
      $("#uploadButton").attr("disabled", false);
      $("#statsTrigger").attr("hidden", false);
    },
  });
});

$(".sample-image").click(function () {
  let imageName = this.name;
  if (imageName in results) {
    $("#diceImage").text(results[imageName].text);
    calculateStats(results[imageName].counts);
  } else {
    $.get(`/results/${imageName}`, function (imgArray) {
      $("#statsTrigger").attr("hidden", false);
      results[imageName] = makeDice(imgArray);
      calculateStats(results[imageName].counts);
    });
  }
});

function makeDice(imgArray) {
  // let dots = ['#000', '#111', '#333', '#666', '#999', '#ccc', '#fff'];
  let retval = {
    text: "",
    counts: {},
  };
  for (let x = 0; x < imgArray.length; x++) {
    let row = imgArray[x];
    let line = "";
    for (let y = 0; y < imgArray[0].length; y++) {
      line += dots[row[y]];
      if (retval.counts[dots[row[y]]]) {
        retval.counts[dots[row[y]]] += 1;
      } else {
        retval.counts[dots[row[y]]] = 1;
      }
    }
    retval.text += line + "\n";
  }
  $("#diceImage").text(retval.text);
  return retval;
}

function calculateStats(diceCounts) {
  let i = 0;
  $(".dicecount").each(function () {
    let currentDice = reversedDots[i];
    $(this).text(`${diceCounts[currentDice]}`);
    i++;
  });
  $("#diceTotal").text(Object.values(diceCounts).reduce((a, b) => a + b, 0));
}
