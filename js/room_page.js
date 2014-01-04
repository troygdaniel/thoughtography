var roomPage;

$(function() {
  var note_id = getRoomId();
  if (!(typeof socket === "undefined"))
    roomPage = new RoomPage({note_id: note_id, socket: socket});
});

function getRoomId() {
  var _id;
  if (location.search) {
    _id = location.search.substr(1, location.search.length);
  }
  $("#roomIdHeader").text(_id);
  return _id;
}


function RoomPage (options) {
  var note, socket, noteView, fullname, note_id, $textarea, textarea, localNote;
  var $clock_interval = $("#clock-interval");
  var $appendTextField = $("#appendTextField");  
  var $minutes_remaining = $("#minutes-remaining");
  var minInterval = 15;

  note_id = options.note_id;
  socket = options.socket;

  bindUIEvents();
  render(note_id);
  fullname = localStorage.getItem("fullname");
  if (!fullname) {
    fullname = prompt("Please enter your name","BillyBob");
    fullname = localStorage.setItem("fullname", fullname);
  }
  resetAppendTextField();
  localNote = localStorage.getItem(note_id);

  if (localNote) {
    note.setContent(localNote);
    noteView.render(localNote,true);
  }
  var that = this;

  this.heartBeat = function () {
    that.setClockInterval();
    that.setMinRemaining();
  }
  setInterval(this.heartBeat,1000);
  
  this.setMinRemaining = function (d) {
    var now = new Date();
    if (d)  now = d; // allows the function to be testable
    var mnTick = this.findNextTick(now.getMinutes());
    if (mnTick === 0) mnTick = 60;  

    var remaining = ""+(mnTick - now.getMinutes());

    if ($minutes_remaining) { 
      $minutes_remaining.text(remaining);
      var isOrange = $clock_interval.hasClass("orange");
      var isBlue = $clock_interval.hasClass("blue");
      var isRed = $clock_interval.hasClass("red");

      $clock_interval.removeClass("orange blue red");
      
      if (parseInt(remaining) <= 1 ) {
        if (isRed === false)
          shakeClock();
        $clock_interval.addClass("red"); 
      } 
      else if (parseInt(remaining) <= 2 ) {
        if (isOrange === false)
          shakeClock();
        $clock_interval.addClass("orange");
      } 
      else {
        if (isBlue === false)
          shakeClock();
        $clock_interval.addClass("blue"); 
      }

    }
    return remaining;
  };

  // TODO: Promise to make it right
  function shakeClock() {
    $clock_interval.animate({left: "+5"}, 75, function() {
      $clock_interval.animate({left: "0"}, 75, function() {
        $clock_interval.animate({left: "+5"}, 75, function() { 
          $clock_interval.animate({left: "0"}, 75, function() {
            $clock_interval.animate({left: "+5"}, 75, function() { 
              $clock_interval.animate({left: "0"}, 75, function() {
                $clock_interval.animate({left: "+5"}, 75, function() { 
                  $clock_interval.animate({left: "0"}, 75, function() {
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  this.setClockInterval = function (d) {
    var now = new Date();
    if (d)  now = d; // allows the function to be testable
    var hrs = now.getHours();
    var mns = now.getMinutes();
    var mnTick = this.findNextTick(mns);
    
    if (mnTick === 0 ) { hrs=hrs+1; mnTick = "00"; }
    if (mnTick === 5 ) { mnTick = "05"; }
    if (hrs > 12) hrs = hrs-12;
    if (hrs === 0) hrs = 12;
    
    var clockTxt = ""+hrs+":"+mnTick;    
    if ($clock_interval) { $clock_interval.text(clockTxt); }
    
    return clockTxt;
  };

  this.findNextTick = function(min) {    
    var t = [];    
    if (minInterval === 5) {
      t = [00,05, 10,15,20,25,30,35,40,45,50,55];  
    }
    if (minInterval === 10) {
      t = [00,10,20,30,40,50];  
    }
    if (minInterval === 15) {
      t = [00,15,30,45];
    }
    if (minInterval === 30) {
      t = [30];
    }

    for (var i=0; i < t.length; i++) 
      if (min < t[i]) return t[i]; 

    return 00;
  };

  function findNextMinInterval() {
    var now = new Date();
    var curTick = that.findNextTick(now.getMinutes());;
    var intervals = [30, 15, 10, 5, 30, 15, 10, 5];
    var t = [00,10,15,20,25,30,35,40,45,50,55]; 
    var i=0;
    if (minInterval === 30) i = 0;
    if (minInterval === 15) i = 1;
    if (minInterval === 10) i = 2;
    if (minInterval === 5) i = 3;

    // loop through minInterals until nextTick differs
    for (i; i < intervals.length; i++) {
      minInterval = intervals[i];
      var nextTick = that.findNextTick(now.getMinutes());;
      if (nextTick != curTick) break;
    }
  }

  function bindUIEvents() {
    $(".navbar-brand").click(function () {
      var now = new Date();
      var curTick = that.findNextTick(now.getMinutes());;

      findNextMinInterval();
      that.heartBeat();
    });

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
    fullname = localStorage.getItem("fullname");
    $appendTextField.val("@"+fullname+": ");
  }
  this.setClockInterval();
}