$(function() {


  $(".toggle-writer").click(function() {
    var $leftpanel = $("#left-panel");
    $leftpanel.toggle();
    if ($leftpanel.is(":visible")) {
      $(".toggle-writer").html("Hide writer");
      $("#mid-panel").css("width","40%");
      $("#mid-panel").css("font-size","10px");
    } else {
      $(".toggle-writer").html("Show writer");
      $("#mid-panel").css("width","100%");
      $("#mid-panel").css("font-size","14px");
    }
  });

  var $braindump = $(".braindump")
  var p = new Parser();
  var jsonValue = p.serialize($braindump.val());
  window.json = jsonValue;
  MeetingNotesView.render(jsonValue);

});