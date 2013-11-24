  window.MeetingNotes = function() {};

  MeetingNotes.folderIcon = function(node) {

  	if (node.children && node.children.length > 0)
  		return '<i class="icon-folder-open"></i>';
  	return "";
  }

  MeetingNotes.boldedText = function(source) {
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

  MeetingNotes.titleFromText = function(text) {
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
  	}
  	return "";
  }
  MeetingNotes.wordCount = function (txt) {
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
  	var words = text.split(" ");
  	var theLastWord = false;
  	var newWordArray = [];

  	if (words[0][0] != "*") {
  		return text;
  	}

  	for (i = 0; i < words.length; i++) {
  		if (theLastWord === true) {
  			newWordArray.push(words[i]);
  		}

  		if (words[i][words[i].length - 1] === "*")
  			theLastWord = true;
  	}
  	return newWordArray.join(" ");
  }

  