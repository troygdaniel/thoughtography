//  Specs for Take.NoteView
describe("Take.NoteView spec", function() {
  var tabJSON = [{"text":"This is a test.","children":[{"text":"This is a child","children":[]}]},{"text":"This is another parent","children":[{"text":"This is another child","children":[{"text":"This is a grandchild","children":[]}]}]}];
  var tabText = 'This is a test.\n\tThis is a child\nThis is another parent\n\tThis is another child\n\t\tThis is a grandchild';
  var expectedHtml = '<h3  class="header-line-num-1"><B style=\'color:green\'></B> This is a test.</h3><span style="display: block;" id="header-line-num-1"><ul ><li class="parent-line-num-1 line-num-2"><span class="parent-line-num-1 line-num-2"><B style=\'color:green\'></B></span>&nbsp;This is a child</li></ul></span><h3  class="header-line-num-3"><B style=\'color:green\'></B> This is another parent</h3><span style="display: block;" id="header-line-num-3"><ul ><li class="parent-line-num-3 line-num-4"><span class="parent-line-num-3 line-num-4"><B style=\'color:green\'></B></span>&nbsp;This is another child<ul ><li class="parent-line-num-4 line-num-5"><span class="parent-line-num-4 line-num-5"><B style=\'color:green\'></B></span>&nbsp;This is a grandchild</li></ul></li></ul></span>';
  var socket = socket  || io.connect('http://'+document.domain);
  var note = new Take.Note({id: 123,socket: socket});
  var noteView = new Take.NoteView({note: note, socket: socket});

  describe("Constructor", function() {
    
    it("should have an instance of a Take.Note", function () {
        noteView = new Take.NoteView({note:note, socket: socket});
        expect(noteView.note).toEqual(note);
    });

    it("should have an el target specified", function() {
      noteView = new Take.NoteView({note:note, el: "#some-div", socket: socket});
      expect(noteView.el).toEqual("#some-div");
    });
  });

  describe("#append()", function() {

    it("should append content to the note and the view", function() {
      var appendText = "@troy: what was that?";
      var expectedContent = tabText + "\n\t"+appendText;

      noteView.render(tabText);

      noteView.append(appendText);
      expect(noteView.note.getContent()).toEqual(expectedContent);
    });
  });

  describe("#render()", function() {

    it("should have generated html", function() {
      note = new Take.Note({id:123});
      noteView = new Take.NoteView({note:note, socket: socket});
      noteView.render(tabText);
    });
  });
});