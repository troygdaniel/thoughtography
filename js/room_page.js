var roomPage;

$(function() {
  roomPage = new RoomPage();
});

function RoomPage() {
  var note, noteView, fullname, note_id, $appendTextField, $textarea, textarea, localNote;

  $appendTextField = $("#appendTextField");  

  note_id = getRoomId();
  bindUIEvents();
  render(note_id);
  fullname = localStorage.getItem("fullname");
  if (!fullname) {
    fullname = prompt("Please enter your name","BillyBob");
    fullname = localStorage.setItem("fullname", fullname);
  }
  resetAppendTextField();
  localNote = localStorage.getItem(note_id);
  console.log(localNote);
  if (localNote) {
    note.setContent(localNote);
    noteView.render(localNote,true);
  }

  function getRoomId() {
    if (location.search) {
      _id = location.search.substr(1, location.search.length);
    }
    $("#roomIdHeader").text(_id);
    return _id;
  }

  function bindUIEvents() {

    $("#view-link").click(function() {
      showRightPanel();
    });

    $("#create-link").click(function() {
      showLeftPanel();
    });

    $(".insights-room-button").click(function () {
      var hyperlink = "http://" + location.host + "/room?"+note_id;
      fullname=prompt("Share this link for others to join.",hyperlink);
    });

    $appendTextField.keydown(function(e) {
      var txtVal = $appendTextField.val().trim();
      if (txtVal[0] === "@") {        
        fullname = txtVal.substr(1, txtVal.indexOf(":")-1);
        localStorage.setItem("fullname", fullname);
      }

      if (e.keyCode === 13) {
        if (txtVal === "edit") {
          showLeftPanel();
          return;
        } else if (txtVal === "@"+fullname+":"){
          return;
        }

        noteView.append($appendTextField.val());
        resetAppendTextField();
        e.preventDefault();    
      }
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
    var options = {note: note, fullname: fullname, el: "#topic-tree", socket: socket, textarea: ".braindump"};     
    noteView = new Take.NoteView(options);
    noteView.on("changes", function() {
        insightsView.render();
        $appendTextField.show();
        localStorage.setItem(_id, note.getContent());
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
    noteView.$textarea.focus();
  }

  function resetAppendTextField() {
    $appendTextField.val("@"+fullname+": ");
  }
}