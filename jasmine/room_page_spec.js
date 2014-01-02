//     Specs for Take.Note
describe("Take.RoomPage spec", function() {
  var socket = socket  || io.connect('http://'+document.domain);
  var roomPage = new RoomPage({note_id: 1, socket: socket});

  describe("Constructor", function() {
    it("should be constructed successfully", function() {   
    });
  });

  describe("#findNextTick()", function() {
    it ("should find the next min interval", function (){
      expect(roomPage.findNextTick(1)).toEqual(15);
      expect(roomPage.findNextTick(16)).toEqual(30);
      expect(roomPage.findNextTick(33)).toEqual(45);
      expect(roomPage.findNextTick(51)).toEqual(0);
    });
  });

  describe("#setClockInterval()", function() {
    it("should set the time to the closest 15min mark", function() {

      var d1 = new Date("October 13, 1975 11:58:00");
      expect(roomPage.setClockInterval(d1)).toEqual("12:00");
      
      var d2 = new Date("October 13, 1975 12:01:00")
      expect(roomPage.setClockInterval(d2)).toEqual("12:15");
      
      var d3 = new Date("October 13, 1975 12:16:00")
      expect(roomPage.setClockInterval(d3)).toEqual("12:30");
      
      var d4 = new Date("October 13, 1975 12:51:00")
      expect(roomPage.setClockInterval(d4)).toEqual("1:00");
      
      var d5 = new Date("October 13, 1975 00:13:00")
      expect(roomPage.setClockInterval(d5)).toEqual("12:15");
      
      var d6 = new Date("October 13, 1975 00:53:00")
      expect(roomPage.setClockInterval(d6)).toEqual("1:00");

    });
  });

  describe("#setMinRemaining()", function() {
    it("should set the time to the closest 15min mark", function() {
        var d1 = new Date("October 13, 1975 11:58:00");
        expect(roomPage.setMinRemaining(d1)).toEqual("2");
        
        var d2 = new Date("October 13, 1975 12:01:00")
        expect(roomPage.setMinRemaining(d2)).toEqual("14");
        
        var d3 = new Date("October 13, 1975 12:17:00")
        expect(roomPage.setMinRemaining(d3)).toEqual("13");
        
        var d4 = new Date("October 13, 1975 12:51:00")
        expect(roomPage.setMinRemaining(d4)).toEqual("9");
        
        var d5 = new Date("October 13, 1975 00:13:00")
        expect(roomPage.setMinRemaining(d5)).toEqual("2");
        
        var d6 = new Date("October 13, 1975 00:53:00")
        expect(roomPage.setMinRemaining(d6)).toEqual("7");

    });
  });

});