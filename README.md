thoughtography
==============
Simple collaborative meeting notes.  Very rough and PoC-like.

## Run the app
~~~
$ node app.js 
~~~

Access locally at:
http://localhost:3000/index.html


## Documentation

NodeJS server loads "create_or_join.html" initially NodeJS server handles requests for "/room?{roomId}" and loads room.html

~~~
room.html / room_view.js
~~~

The parent view that grabs the roomId from the URL, and creates a note, note_view and an insightsView.

~~~
var note_id = getRoomId();
bindHeaderLinks();
render(note_id);
note.js
~~~

The object that contains the text, JSON and publishes over a websocket.

~~~
note = new Take.Note({ id: _id, socket: socket });
note_view.js
~~~

View object that has a note, a textfield and renders HTML receives changes from a websocket. Requires additional work to become more maintainable.

~~~
noteView = new Take.NoteView({note: note, el: "#topic-tree", socket: socket, textarea: ".braindump"});
noteView.on("changes", function() {
        insightsView.render();
});
~~~

The insights_view.js view object that parses out the #twitter, @participants and wiki "hyperlinks".

insightsView = new Take.InsightsView({note: note, el: "#note-insights-header"});
