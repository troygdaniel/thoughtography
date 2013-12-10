var note, noteView;

$(function() {
  var noteId;
  if (location.search) {
    noteId = location.search.substr(1, location.search.length);
  }
  $("#roomIdHeader").text(noteId);
  $("#view-link").click(function() {
    showRightPanel();
  });
  $("#create-link").click(function() {
    showLeftPanel();
  });

  // Create a note model that binds to a websocket connection 
  note = new Take.Note({
    id: noteId,
    socket: socket
  });
  // Create a view that updates the DOM when receiving updates for a given note
  insightsView = new Take.InsightsView({note: note, el: "#top-header"});
  noteView = new Take.NoteView({note: note, el: "#topic-tree", socket: socket, textarea: ".braindump"});
  noteView.on("keydown", function() {
      insightsView.render();
  });

  if (location.hash === "#creator") {
    showLeftPanel();
  }

  function showLeftPanel() {
    $("#left-panel").show();
    $("#temp-content-reader").hide();
    $("#temp-content-creator").show();
    $("#mid-panel").css("width", "40%");
    $("#mid-panel").css("font-size", "10px");
  }

  function showRightPanel() {
    $("#left-panel").hide()
    $("#temp-content-reader").show();
    $("#temp-content-creator").hide();
    $("#mid-panel").css("width", "100%");
    $("#mid-panel").css("font-size", "18px");
  }
});

window.onload = function() {
  // var area = new AutoSuggestControl("text-area");    
}