var authors = new tingle.modal();
$.get("authors.html", function (data) {
  authors.setContent(data);
});
$("#a-authors").on("click", function (e) {
  authors.open();
});

var literature = new tingle.modal();
$.get("literature.html", function (data) {
  literature.setContent(data);
});
$("#a-literature").on("click", function (e) {
  literature.open();
});

var glossary = new tingle.modal();
$.get("glossary.html", function (data) {
  glossary.setContent(data);
});
$("#a-glossary").on("click", function (e) {
  glossary.open();

  var dict_data = null;

  $.getJSON("glossary.json", function (json) {
    console.log(json);
    dict_data = json;
    regenerateTable("");
  });

  function regenerateTable(data) {
    let table = $('<table class="table table-bordered table-striped"></table>');
    table.append('<tr style="font-weight:bold;"></tr>');
    $.each(dict_data.dictionary, function (_, item) {
      let index = String(item.termin.toLowerCase()).indexOf(data.toLowerCase());
      if (index > -1) table.append('<tr><td style="font-weight:bold;">' + item.termin + "</td><td>" + item.meaning + "</td></tr>");
    });
    $("#dictionary").html(table);
  }

  $("#query").on("keyup", function (e) {
    regenerateTable(e.currentTarget.value);
  });

  $("#btnClear").on("click", function () {
    $("#query").val("");
    regenerateTable("");
  });
});
