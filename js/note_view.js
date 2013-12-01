var Take = Take || {};

Take.NoteView = function(options) {
  var note = options.note;
  var el = options.el;
  var socket = options.socket;
  var json;
  var html = "";
  var lineCounter = 0;
  var prevJson = {};
  var collapsedHeaders = [];
  var collapsedLines = [];

  socket.on('shared_note_changes:' + note.getId(), render);

  // Private methods
  // ---------------
  function topLevelHTMLForNode(node) {
    lineCounter++;
    var parentNum = lineCounter;
    var lineNumClass = "line-num-" + lineCounter;
    var headerStyle = "";
    if (node.hasChanged === true) {
      headerStyle = 'style="background-color:#F5F6CE"';
    }
    var openTag = '<h3 ' + headerStyle + ' class="header-line-num-' + parentNum + '">' + titleForNode(node) + ' ' + textForNode(node) + '</h3><span style="display: block;" id="header-line-num-' + parentNum + '">';
    var childUL = "";
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childUL += ulTextForNode(node.children[i], parentNum);
      }
    }
    return openTag + childUL + '</span>';
  }

  function compareJson(json, prevJson) {
    for (var i = 0; i < json.length; i++) {
      if (prevJson && prevJson[i] && json[i].text != "") {
        if (prevJson[i].text.toString() != json[i].text.toString()) {
          json[i].hasChanged = true;
        }
      }
      if (prevJson[i] && prevJson[i].children)
        compareJson(json[i].children, prevJson[i].children);
    }
  }

  function ulTextForNode(node, parentLine) {
    var parentNumClass = "parent-line-num-" + parentLine;
    lineCounter++;

    var headerStyle = "";
    if (node.hasChanged === true) {
      headerStyle = 'style="background-color:#F5F6CE"';
    }
    var parentNum = lineCounter;
    var lineNumClass = "line-num-" + lineCounter;
    var openUL = '<ul ' + headerStyle + '><li class="' + parentNumClass + ' ' + lineNumClass + '"><span class="' + parentNumClass + ' ' + lineNumClass + '">' + titleForNode(node) + '</span>&nbsp;' + textForNode(node);

    var childUL = "";
    var completeTag = ""
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childUL += ulTextForNode(node.children[i], parentNum);
      }
    }
    completeTag = openUL + childUL + '</li></ul>';
    return completeTag;
  }

  function titleForNode(node) {
    var title = "";

    if (boldedText(node.text))
      title = boldedText(node.text);

    if (title === "") {
      title = titleFromText(node.text);
    }
    return "<B style='color:green'>" + title + "</B>";
  }

  function boldedText(source) {
    if (source)
      return source.substr(source.indexOf("*") + 1, (source.lastIndexOf("*") - source.indexOf("*") - 1));
  }

  function titleFromText(text) {
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
      if (lastChar(wordArray[i]) === ":") {
        title = wordArray[i].substr(0, wordArray[i].length - 1);
        return title;
      }
    }
    return "";
  }

  function lastChar(word) {
    if (word)
      return word[word.length - 1];
    return "";
  }

  function textForNode(node) {
    if (wordCount(node.text) <= 2) {
      return "";
    } else {
      return stripFirstBoldedText(node.text);
    }
  }

  function stripFirstBoldedText(text) {
    if (typeof text === "undefined") return;
    var words = text.split(" ");
    var theLastWord = false;
    var newWordArray = [];

    for (i = 0; i < words.length; i++) {
      if (theLastWord === true) {
        newWordArray.push(words[i]);
      }

      if (lastChar(words[i]) === ":") {
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

  function wordCount(txt) {
    if (typeof txt === "undefined") return;
    txt.split(" ").length;
  }

  // Public methods
  // --------------
  function render(textData) {
    note.setContent(textData);
    var json = getJSON();
    compareJson(json, prevJson);
    $(el).empty();
    if (json.length) {
      for (var i = 0; i < json.length; i++) {
        $(el).append(topLevelHTMLForNode(json[i]));
      }
    }
    prevJson = json;
  }

  function getJSON() {
    return note.getJSON();
  }

  // Setters / getters
  // -----------------

  return {
    note: note,
    el: el,
    render: render,
    getJSON: getJSON,
    html: html
  };
}