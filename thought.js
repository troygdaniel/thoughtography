$(function() {

  $(".toggle-writer").click(function() {
    var $leftpanel = $("#left-panel");
    $leftpanel.toggle();
    if ($leftpanel.is(":visible")) {
      $(".toggle-writer").html("Hide writer");
      $("#mid-panel").css("width","50%");
    } else {
      $(".toggle-writer").html("Show writer");
      $("#mid-panel").css("width","100%");
    }
  });

  $.ajax("thought.json").done(function(json) {
    MeetingNotesView.render(json);
  });
});