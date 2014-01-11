var Take = Take || {};

Take.Insights = function (options) {
  var note, _previousNote;
  var participants = [], tags = [], wikis = [];
  var areParticipantsUpdated = false;

  initialize(options);

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
    if (word) {
      var firstChar = word[0];
      var lastChar = word[word.length-1];    
      return (firstChar === "\"" && lastChar === "\"");        
    }
    return false;
  }

  function quoteless(word) {
    return word.substr(1,word.length-2);
  }

  function nextTwoWords(words, i) {
    var word = words[i];
    return words[i].substr(1,word.length-1)+"_"+words[i+1].substr(0,words[i+1].length-1)
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
    if (!v) return;
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
    if (!note.getContent()) return;
    var words = sanitizedWords(note.getContent());
    participants = [];
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word[word.length-1] === ":")
        word = word.substr(0,word.length-1);
      if (isNewParticipant(word)) { 
        addParticipant(word);
      }
    }
    return participants;
  }

  function getTags() {
    if (!note.getContent()) return;
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
          var key = wikiWord(words,i)
          if (key) {
            wikiHash[key] = href+wikiWord(words,i);
            wikis.push(wikiHash);
          }
        }
    }
    return wikis; 
  }

  function wikiWord(words, startIndx) {    
    var word = words[startIndx+1];
    var nextWord = words[startIndx+2];

    if (quoted(word) === true) { 
      return quoteless(word);
    }
    // console.log(nextTwoWords(words, startIndx+1));
    if (nextTwoWords && nextWord[nextWord.length-1] === "\"")
      return nextTwoWords(words, startIndx+1);
    return false;
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