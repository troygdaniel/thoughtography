var note, noteView;

$(function() {
  window.knwl = new Knwl();
  var noteId;
  if (location.search) {
    noteId = location.search.substr(1,location.search.length);
  }

  // Create a note model that binds to a websocket connection 
  note = new Take.Note({id: noteId,socket: socket});

  // Create a view that updates the DOM when receiving updates for a given note
  noteView = new Take.NoteView({note: note,el: "#topic-tree",socket: socket});

  $(".braindump").keyup(function() {
    note.shareChanges($(this).val());
    noteView.render($(this).val());
    knwl.init($(this).val());
  });

  $(".toggle-writer").click(function() {
    var $leftpanel = $("#left-panel");
    $leftpanel.toggle();
    if ($leftpanel.is(":visible")) {
      $(".toggle-writer").html("Hide writer");
      $("#mid-panel").css("width", "40%");
      $("#mid-panel").css("font-size", "10px");
    } else {
      $(".toggle-writer").html("Show writer");
      $("#mid-panel").css("width", "100%");
      $("#mid-panel").css("font-size", "18px");
    }
  });

  // Handle the tab key event in the textarea
  $(".braindump").keydown(function(e) {
    var content;
    var $this = $(this);
    var value = $this.val();
    if (e.keyCode === 9) { // tab was pressed
      // get caret position/selection
      var start = this.selectionStart;
      var end = this.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      content = value.substring(0, start) + "\t" + value.substring(end);
      $this.val(content);

      // put caret at right position again (add one for the tab)
      this.selectionStart = this.selectionEnd = start + 1;

      // prevent the focus lose
      e.preventDefault();
    } else {
      content = value;
    };
  });
});

window.onload = function () {
  var area = new AutoSuggestControl("text-area");    
}