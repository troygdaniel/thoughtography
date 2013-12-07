var note, noteView;

$(function() {
  window.knwl = new Knwl();
  var noteId;
  if (location.search) {
    noteId = location.search.substr(1,location.search.length);
  }
  $("#roomIdHeader").text(noteId);
  
  // Create a note model that binds to a websocket connection 
  note = new Take.Note({id: noteId,socket: socket});
  // Create a view that updates the DOM when receiving updates for a given note
  noteView = new Take.NoteView({note: note,el: "#topic-tree",socket: socket, textarea: ".braindump"});

  if (location.hash === "#creator") {
    var $leftpanel = $("#left-panel");
    $leftpanel.show();
    $("#temp-content-reader").hide();
    $("#temp-content-creator").show();
    $(".toggle-writer").html("Hide writer");
    $("#mid-panel").css("width", "40%");
    $("#mid-panel").css("font-size", "10px");
  }
});

window.onload = function () {
  // var area = new AutoSuggestControl("text-area");    
}