var note, noteView;

$(function() {
  var note_id = getRoomId();
  bindHeaderLinks();
  render(note_id);

  function getRoomId() {
    if (location.search) {
      _id = location.search.substr(1, location.search.length);
    }
    $("#roomIdHeader").text(_id);
    return _id;
  }
  function bindHeaderLinks() {
    $("#view-link").click(function() {
      showRightPanel();
    });
    $("#create-link").click(function() {
      showLeftPanel();
    });
  }
  function render(_id) {
    if (location.hash === "#creator") {
      showLeftPanel();
    }
    // Create a note model that binds to a websocket connection 
    note = new Take.Note({ id: _id, socket: socket });

    // Create a view that updates the DOM when receiving updates for a given note
    insightsView = new Take.InsightsView({note: note, el: "#note-insights-header"});
    noteView = new Take.NoteView({note: note, el: "#topic-tree", socket: socket, textarea: ".braindump"});
    noteView.on("changes", function() {
        insightsView.render();
    });
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