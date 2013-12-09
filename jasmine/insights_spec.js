//     Specs for Take.Insights
describe("Take.Insights spec", function() {
  var noteContent = 'This is a test @daniel @troy @jeff.\n\tThis is a child with a wiki "hyperlink" #interwebs\nThis is another parent with a #hashtag topic\n\tThis is another child that @troy will order lunch tomorrow.\n\t\tThis is a grandchild with @jeff\n';
  var socket = socket || io.connect('http://' + document.domain);
  var note = new Take.Note({id: 123,socket: socket});
  window.insights = new Take.Insights({note: note});  

  describe("Constructor", function() {
    it("should have an instance of a Take.Insights", function() {
      expect(insights.getNote()).toEqual(note);
    });
  });
  
  describe("#sanitizedWords", function() {
    it("should return an array of words", function() {
      var expectedArray = ["This", "is", "a", "test", "@daniel", "@troy", "@jeff", "", "", "This", "is", "a", "child", "with", "a", "wiki", "\"hyperlink\"", "#interwebs", "This", "is", "another", "parent", "with", "a", "#hashtag", "topic", "", "This", "is", "another", "child", "that", "@troy", "will", "order", "lunch", "tomorrow", "", "", "", "This", "is", "a", "grandchild", "with", "@jeff", ""];
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

  describe("#wikiWord", function () {
    it("should find the (single) wiki word from a given index", function() {
      var noteTxt = 'This is a test example with wiki "medical science"\n\tThis is a child with a wiki "hyperlink" #interwebs\n';
      var words = insights.sanitizedWords(noteTxt);
      // wiki "hyperlink"
      expect(insights.wikiWord(words,16)).toEqual("hyperlink");
   });

    it("should find the wiki words from a given index", function() {
      var noteTxt = 'This is a test example with wiki "medical science"\n\tThis is a child with a wiki "hyperlink" #interwebs\n';
      var words = insights.sanitizedWords(noteTxt);
      // wiki "medical science"
      expect(insights.wikiWord(words,6)).toEqual("medical_science");
    });
  });

  describe("#getWikis()", function() {
    it("should have array wiki links", function() {
      var noteTxt = 'This is a test example with wiki "medical science"\n\tThis is a child with a wiki "hyperlink" #interwebs\n';
      var href="http://en.m.wikipedia.org/w/index.php?title=";
      var wikiArray = [{medical_science: href+"medical_science"},{hyperlink: href+"hyperlink"}];
      note.setContent(noteTxt);
      expect(insights.getWikis()).toEqual(wikiArray);
    });
  });


  describe("#actionItemSentence", function() {
    it("should associate the line note with a participant", function() {
      var words = insights.wordsArray(noteContent);
      
      expect(insights.actionItemSentence(words, 32)).toEqual("order lunch tomorrow.");
    });
  });

  describe("#actionItems", function() {
    it("should associate the line note with a participant", function() {
      var items = {"@troy": ["order lunch tomorrow."]};
      var txt = noteContent;

      note.setContent(txt);
      expect(insights.actionItems()).toEqual(items);

      txt += "and @daniel will ask @george if the requirements were correct."
      note.setContent(txt);
      
      items["@daniel"] = ["ask @george if the requirements were correct."];
      expect(insights.actionItems()).toEqual(items);      
    });
   });

});