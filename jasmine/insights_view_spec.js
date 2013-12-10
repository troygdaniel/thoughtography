//  Specs for Take.InsightsView
describe("Take.InsightsView spec", function() {
  var noteContent = 'This is a test @daniel @troy @jeff.\n\tThis is a child with a wiki "hyperlink" #interwebs\nThis is another parent with a #hashtag topic\n\tThis is another child that @troy will order lunch tomorrow.\n\t\tThis is a grandchild with @jeff\n';
  var socket = socket  || io.connect('http://'+document.domain);
  var note = new Take.Note({id: 123, socket: socket});
  var insightsView = new Take.InsightsView({note: note, socket: socket});


  describe("Constructor", function() {

    it("should have an instance of a Take.InsightsView", function() {
      expect(insightsView.getNote()).toEqual(note);
    });
  });

  describe("#renderParticipants()", function() {

    it("should render a list of participants", function() {
      var noteContent = 'This is a test @daniel @troy @jeff.\n\tThis is a child with a wiki "hyperlink" #interwebs\nThis is another parent with a #hashtag topic\n\tThis is another child that @troy will order lunch tomorrow.\n\t\tThis is a grandchild with @jeff\n';
      var expectedHtml = '<span style="padding:5px;"><a href="#">@daniel</a></span><span style="padding:5px;"><a href="#">@troy</a></span><span style="padding:5px;"><a href="#">@jeff</a></span>' to equal '<span style="padding:5px;">@daniel</span><span style="padding:5px;">@troy</span><span style="padding:5px;">@jeff</span>';
      insightsView.setContent(noteContent);

      expect(insightsView.renderParticipants()).toEqual(expectedHtml);
    });
  });

  describe("#renderTags()", function() {

    it("(pending...)", function() {});
  });

  describe("#renderWikis()", function() {

    it("(pending...)", function() {});
  });

  describe("#render()", function() {

    it("(pending...)", function() {});
  });

});