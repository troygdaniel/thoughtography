var Take = Take || {};

Take.Insights = function (options) {
  var note, _previousNote;
  var participants = [], tags = [];
  var areParticipantsUpdated = false;

  initialize(options);

  // Private methods
  // ---------------

  function initialize(options) {
    setNote(options.note);
  }

  function isNewParticipant(p) {
    return (p[0] === "@" && ($.inArray(p, participants) === -1))
  }

  function isNewTag(p) {
    return (p[0] === "#" && ($.inArray(p, tags) === -1))
  }

  // Public methods
  function sanitizedWords(v) {
    var retVal = v;
    if (retVal) {
      retVal = retVal.split(".").join(" ");
      retVal = retVal.split("\n").join(" ");
      retVal = retVal.split("\t").join(" ");
    }
    return retVal.split(' ');;
  }

  function setNote(v){    
    _previousNote = note;
    if (v != _previousNote) { setUpdateFlags(true); }
    note = v;
  }
  function getNote(){
    return note;
  }

  function getParticipants() {
    
    var words = sanitizedWords(note.getContent());
    for (var i = 0; i < words.length; i++) {
      if (isNewParticipant(words[i].trim())) { participants.push(words[i].trim());  }
    }

    return participants;
  }

  function getTags() {
    var words = sanitizedWords(note.getContent());
    for (var i = 0; i < words.length; i++) {
      if (isNewTag(words[i].trim())) { tags.push(words[i].trim());  }
    }

    return tags;    
  }

  return {
    getParticipants: getParticipants,
    sanitizedWords: sanitizedWords,
    getNote: getNote,
    getTags: getTags
  };
};