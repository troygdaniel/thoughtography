//     Specs for Take.Note
describe("Take.Note spec", function() {
  var tabText = 'This is a test.\n\tThis is a child\nThis is another parent\n\tThis is another child\n\t\tThis is a grandchild';
  var tabJSON = [{"text": "This is a test.","children": [{"text": "This is a child","children": []}]}, {"text": "This is another parent","children": [{"text": "This is another child","children": [{"text": "This is a grandchild","children": []}]}]}];
  var socket = socket || io.connect('http://' + document.domain);
  var note = new Take.Note({id: 123,socket: socket});

  describe("Constructor", function() {
    it("should be constructed with an id", function() {
      expect(note.getId()).toEqual(123);
    });
    it("should allow id as the only parameter", function() {
      note = new Take.Note(234);
      expect(note.getId()).toEqual(234);
    });
  });

  describe("#append()", function() {
    it("appends content to the end of the note", function() {
      note.setContent("this is a showdown.");
      var expectedContent = "this is a showdown.\n\t@troy: what is a showdown?";

      expect(note.append("@troy: what is a showdown?")).toEqual(expectedContent);
    });
  });

  describe("#setContent()", function() {
    it("retain content set by the mutator method", function() {
      note.setContent("this is a showdown.");
      expect(note.getContent()).toEqual("this is a showdown.");
    });
    it("parse text to json", function() {
      note.setContent(tabText);
      expect(note.getJSON()).toEqual(tabJSON);
    });
  });


});