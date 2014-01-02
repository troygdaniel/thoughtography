//     Specs for Take.Note
describe("Take.RoomPage spec", function() {
  var socket = socket  || io.connect('http://'+document.domain);
  describe("Constructor", function() {
    it("should be constructed successfully", function() {		
    	var roomPage = new RoomPage({note_id: 1, socket: socket});
    });
  });


});