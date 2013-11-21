// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".
Players = new Meteor.Collection("players");
if (Meteor.isClient) {
    Template.leaderboard.players = function() {
        return Players.find({}, {
            sort: {
                score: -1,
                name: 1
            }
        });
    };

    Template.leaderboard.selected_name = function() {
        var player = Players.findOne(Session.get("selected_player"));
        return player && player.name;
    };

    Template.player.selected = function() {
        return Session.equals("selected_player", this._id) ? "selected" : '';
    };

    Template.leaderboard.events({
        'click input.inc': function() {
            Players.update(Session.get("selected_player"), {
                $inc: {
                    score: 5
                }
            });
        }
    });

    Template.player.events({
        'click': function() {
            Session.set("selected_player", this._id);
        }
    });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Players.find().count() === 0) {
            var names = ["Ada Lovelace",
                "Grace Hopper",
                "Claude Shannon"
            ];
            for (var i = 0; i < names.length; i++)
                Players.insert({
                    name: names[i],
                    score: Math.floor(Random.fraction() * 10) * 5
                });
        }
    });
}
Meteor.startup(function() {
    if (Meteor.isClient) {
        $(".braindump").keydown(function(e) {
          console.log(e.keyCode);
          if (e.keyCode === 8) { // delete was pressed
            
          }
          if (e.keyCode === 9) { // tab was pressed
                // get caret position/selection
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var $this = $(this);
                var value = $this.val();

                // set textarea value to: text before caret + tab + text after caret
                $this.val(value.substring(0, start) + "\t" + value.substring(end));

                // put caret at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

                // prevent the focus lose
                e.preventDefault();
            }
        });
    }
});