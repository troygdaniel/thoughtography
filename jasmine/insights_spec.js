//     Specs for Take.Insights
describe("Take.Insights spec", function() {
  window.noteContent = 'This is a test @daniel @troy @jeff.\n\tThis is a child with a wiki "hyperlink" #interwebs\nThis is another parent with a #hashtag topic\n\tThis is another child that @troy mentioned\n\t\tThis is a grandchild with @jeff\n';
  var socket = socket || io.connect('http://' + document.domain);
  window.note = new Take.Note({id: 123,socket: socket});
  window.insights = new Take.Insights({note: note});


  describe("Constructor", function() {
    it("should have an instance of a Take.Insights", function() {
      expect(insights.getNote()).toEqual(note);
    });
  });
  
  describe("#sanitizedWords", function() {
    it("should return an array of words", function() {
      var expectedArray = ["This", "is", "a", "test", "@daniel", "@troy", "@jeff", "", "", "This", "is", "a", "child", "with", "a", "wiki", "\"hyperlink\"", "#interwebs", "This", "is", "another", "parent", "with", "a", "#hashtag", "topic", "", "This", "is", "another", "child", "that", "@troy", "mentioned", "", "", "This", "is", "a", "grandchild", "with", "@jeff", ""];
      console.log(insights.sanitizedWords(noteContent));
      expect(insights.sanitizedWords(noteContent)).toEqual(expectedArray);
    });
  });

  describe("#getParticipants", function() {
    it("should have an array of getParticipants", function() {
      var array = ["@daniel", "@troy", "@jeff"];
      var txt = noteContent;

      note.setContent(txt);
      expect(insights.getParticipants()).toEqual(array);

      txt += "and @daniel will ask @george is the requirements were correct"
      note.setContent(txt);
      array.push("@george");      
      expect(insights.getParticipants()).toEqual(array);

    });
  });

  describe("#getTags()", function() {
    it("should have array of tags", function() {
      var tagArray = ["#interwebs", "#hashtag"];
      var txt = noteContent;

      note.setContent(txt);
      expect(insights.getTags()).toEqual(tagArray);

      txt += "and #topics will change and #becomesrelevant only as times pass."
      tagArray.push("#topics");
      tagArray.push("#becomesrelevant");
      note.setContent(txt);
      expect(insights.getTags()).toEqual(tagArray);
    });
  });

  describe("#getWikis()", function() {
    it("(pending...) should have array wiki links", function() {
    });
  });

 describe("#getLinks", function() {
    it("(pending...) should have array web links", function() {
    });
  });

  describe("#linesWithParticipant", function() {
    it("(pending...) should associate the line note with a participant", function() {
      // Annotate the JSON?
      // return the lines?
    });
   });

  describe("#actionItemsForParticipant", function() {
    it("(pending...) should associate the line note with a participant", function() {
      // Annotate the JSON?
      // return the lines?
    });
   });

  describe("#linesWithTag", function() {
    it("(pending...) should have array of tags", function() {
      // Annotate the JSON?
      // return the lines?
    });
  });


});