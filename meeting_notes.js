  window.MeetingNotes = function() {};

  MeetingNotes.folderIcon = function(node) {
  	if (node.children && node.children.length > 0)
  		return '<i class="icon-folder-open"></i>';
  	return "";
  }

  MeetingNotes.boldedText = function(source) {
  	if (source)
  		return source.substr(source.indexOf("*") + 1, (source.lastIndexOf("*") - source.indexOf("*") - 1));
  }

  MeetingNotes.titleForNode = function(node) {
  	var title = "";

  	if (MeetingNotes.boldedText(node.text))
  		title = MeetingNotes.boldedText(node.text);

  	if (title === "") {
  		title = MeetingNotes.titleFromText(node.text);
  	}
  	return "<B style='color:green'>" + title + "</B>";
  }

  MeetingNotes.lastChar = function (word) {
  	if (word)
  		return word[word.length-1];
  	return "";
  }

  MeetingNotes.wikiFromText = function(text) {
  	var wordArray = text.split(" ");
  	var wikiText = false;
  	for (var i = 0; i < wordArray.length; i++) {
  		if (wordArray[i] === "wiki") {
  			if (MeetingNotes.lastChar(wordArray[i+1]) === '"') {
	  			wikiText = wordArray[i+1];
	  			return wikiText.substr(1,wikiText.length-2);
  			}
  		}
  	}
  	return false;
  }

  MeetingNotes.titleFromText = function(text) {
  	if (typeof text === "undefined") return;
  	var wordArray = text.split(" ");
  	var title = ""
  	for (var i = 0; i < wordArray.length; i++) {
  		if (i <= 2) {
  			title += " " + wordArray[i];
  		}
  		if (wordArray[i][0] === "#") {
  			title = wordArray[i].substr(0, wordArray[i].length);
  			return title;
  		}
  		if (MeetingNotes.lastChar(wordArray[i]) === ":") {
  			title = wordArray[i].substr(0, wordArray[i].length-1);
  			return title;
  		}
  	}
  	return "";
  }
  MeetingNotes.wordCount = function (txt) {
    if (typeof txt === "undefined") return;
    txt.split(" ").length;
  }

  MeetingNotes.textForNode = function(node) {
  	if (MeetingNotes.wordCount(node.text) <= 2) {
  		return "";
  	} else {
  		return MeetingNotes.stripFirstBoldedText(node.text);
  	}
  }

  MeetingNotes.stripFirstBoldedText = function(text) {
  	if (typeof text === "undefined") return;
  	var words = text.split(" ");
  	var theLastWord = false;
  	var newWordArray = [];

  	for (i = 0; i < words.length; i++) {
  		if (theLastWord === true) {
  			newWordArray.push(words[i]);
  		}

  		if (MeetingNotes.lastChar(words[i]) === ":") {
  			theLastWord = true;
  		}

  		if (words[i][words[i].length - 1] === "*")
  			theLastWord = true;
  	}
  	if (theLastWord === false) {
  		return text;
  	}
  	return newWordArray.join(" ");
  }

  