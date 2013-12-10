var Take = Take || {};

Take.Insights = function (options) {
  var note, _previousNote;
  var participants = [], tags = [], wikis = [];
  var areParticipantsUpdated = false;

  initialize(options);

  // Private methods
  // ---------------

  function initialize(options) {
    setNote(options.note);
  }

  function isNewParticipant(p) {
    p = p.trim();
    return (p[0] === "@" && ($.inArray(p, participants) === -1))
  }

  function isNewTag(p) {
    p = p.trim();
    return (p[0] === "#" && ($.inArray(p, tags) === -1))
  }

  function quoted(word) {
    var firstChar = word[0];
    var lastChar = word[word.length-1];    
    return (firstChar === "\"" && lastChar === "\"");
  }

  function quoteless(word) {
    return word.substr(1,word.length-2);
  }

  function nextTwoWords(words, i) {
    var word = words[i];
    return words[i].substr(1,word.length-1)+"_"+words[i+1].substr(0,word.length-1)
  }

  function addParticipant(v) {
    participants.push(v.trim());
  }

  function addTag(v) {
    tags.push(v.trim());
  }

  function wordsArray(v) {
    var retVal = v;
    if (retVal) {
      retVal = retVal.split("\n").join(" ").split("\t").join(" ");
    }
    return retVal.split(' ');;
  }

  // Public methods
  function sanitizedWords(v) {
    var retVal = v;
    if (retVal) {
      retVal = retVal.split(".").join(" ").split("\n").join(" ").split("\t").join(" ");
    }
    return retVal.split(' ');;
  }

  function setNote(v){    
    _previousNote = note;
    note = v;
  }

  function getNote(){
    return note;
  }

  function getParticipants() {
    var words = sanitizedWords(note.getContent());
    participants = [];
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (isNewParticipant(word)) { 
        addParticipant(word) 
      }
    }
    return participants;
  }

  function getTags() {
    var words = sanitizedWords(note.getContent());
    tags = [];
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (isNewTag(word)) { 
        addTag(word);  
      }
    }
    return tags;    
  }

  function getWikis() {
    var words = sanitizedWords(note.getContent());
    var href="http://en.m.wikipedia.org/w/index.php?title=";
    wikis = [];
    for (var i = 0; i < words.length; i++) {
        if (words[i] === "wiki") {
          var wikiHash = {};
          wikiHash[wikiWord(words,i)] = href+wikiWord(words,i);
          wikis.push(wikiHash);
        }
    }
    return wikis; 
  }

  function wikiWord(words, startIndx) {    
    for (var i = startIndx+1; i < words.length; i++) {
      var word = words[i];
      
      if (quoted(word) === true) { 
        return quoteless(word);
      } 
      return nextTwoWords(words, i);
    }
  }

  function actionItems() {
    var words = wordsArray(note.getContent());
    var items = {};

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var nextWord = words[i+1];
      
      if (word[0] === "@" && nextWord === "will") { 
        if (typeof items[word] === "undefined") {
          items[word] = [];
        }
        items[word].push(actionItemSentence(words, i+1));
      }
    }
    return items;
  }

  function actionItemSentence(words, i) {
    var actionString = "";
    for (var indx = i+1; indx < words.length; indx++) {
      var word = words[indx];
      var lastChar = word[word.length-1];
      actionString = actionString + word + " ";
      if (lastChar === ".") {
        break;
      }
    }
    return actionString.trim();
  }

  return {
    getParticipants: getParticipants,
    wordsArray: wordsArray,
    sanitizedWords: sanitizedWords,
    actionItems: actionItems,
    actionItemSentence: actionItemSentence,
    getWikis: getWikis,
    wikiWord: wikiWord,
    getNote: getNote,
    getTags: getTags
  };
};