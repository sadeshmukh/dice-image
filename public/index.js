$("#fileUpload").on("change", function () {
  $("#fileChosen").text(this.files[0].name);
});
