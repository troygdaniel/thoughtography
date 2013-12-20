var Take = Take || {};

Take.MarkupParser = function(options) {
  var json = options.json;
  var textData = options.textData;
  this.hasChanges = false;

  // Public methods
  // --------------
  function prepare(json, prevJson, lineNum) {
    this.hasChanges = false;

    if (typeof lineNum === "undefined") lineNum = 0;

    for (var i = 0; i < json.length; i++) {
      // Set the absolute line number
      lineNum++;
      json[i].lineNum = lineNum;

      // Check if there are any diffs from previous edits
      if (prevJson && prevJson[i] && json[i].text != "") {
        if (prevJson[i].text.toString() != json[i].text.toString()) {
          json[i].hasChanged = true;
          this.hasChanges = true;
        }
      }
      // Check if there are any diffs from previous children edits
      var prevChildren;
      if (prevJson && prevJson[i] && prevJson[i].children)
        prevChildren = prevJson[i].children;
      lineNum = prepare(json[i].children, prevChildren, lineNum);
    }
    return lineNum;
  }

  function generateHTML(node) {
    var h3Tag = h3TagForNode(node);
    var parentNum = node.lineNum;
    var childUL = "";
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childUL += buildChildrenULTags(node.children[i], parentNum);
      }
    }
    return h3Tag + childUL + '</span>';
  }

  function h3TagForNode(node) {    
    var lineNumClass = "line-num-" + node.lineNum;
    var headerStyle = "";
    if (node.hasChanged === true) {
      return '<h3 style="background-color:#F5F6CE" class="header-line-num-' + node.lineNum + '">' + titleForNode(node) + ' ' + textForNode(node) + '</h3><span style="display: block;" id="header-line-num-' + node.lineNum + '">';
    } else {
      return '<h3 style="background-color:#FFF"  class="header-line-num-' + node.lineNum + '">' + titleForNode(node) + ' ' + textForNode(node) + '</h3><span style="display: block;" id="header-line-num-' + node.lineNum + '">';   
    }
  }

  function buildChildrenULTags(node, parentLine) {
    var openUL = openULTag(node, parentLine);
    var childUL = "";

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childUL += buildChildrenULTags(node.children[i], node.lineNum);
      }
    }
    return openUL + childUL + '</li></ul>';
  }

  // Private methods
  // ---------------
  function openULTag(node, parentLine) {
    var parentNumClass = "parent-line-num-" + parentLine;
    var headerStyle = "", childUL = "";
    if (node.hasChanged === true) {
      headerStyle = 'style="background-color:#F5F6CE"';
    }
    var lineNumClass = "line-num-" + node.lineNum;
    var openUL = '<ul ' + headerStyle + '><li class="' + parentNumClass + ' ' + lineNumClass + '"><span class="' + parentNumClass + ' ' + lineNumClass + '">' + titleForNode(node) + '</span>&nbsp;' + textForNode(node);
    return openUL;
  }

  function hashTagFromText(text) {
    var wordArray = text.split(" ");

    for (var i = 0; i < wordArray.length; i++) {
      if (wordArray[i][0] === "#") {
        return wordArray[i].substr(0, wordArray[i].length);
      }
    }
    return "";
  }
  
  function titleFromText(text) {
    return text.substr(0,text.indexOf(":")+1);
  }  

  function lastChar(word) {
    if (word)
      return word[word.length - 1];
    return "";
  }

  function titleForNode(node) {
    if (typeof node.text === "undefined") return;
    var title = "";

    if (boldedText(node.text))
      title = boldedText(node.text);

    if (title === "") {
      title = titleFromText(node.text);
    }

    if (title === "") {
      title = hashTagFromText(node.text);
    }
    return "<B style='color:#0283A4'>" + title.trim() + "</B>";
  }

  function textForNode(node) {
    if (wordCount(node.text) <= 2) {
      return "";
    } else {
      return stripFirstBoldedText(node.text).trim();
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

  function boldedText(source) {
    if (source)
      return source.substr(source.indexOf("*") + 1, (source.lastIndexOf("*") - source.indexOf("*") - 1));
  }
  return {
    hashTagFromText: hashTagFromText,
    titleFromText: titleFromText,
    json: json,
    generateHTML: generateHTML,
    textData: textData,
    prepare: prepare,
    h3TagForNode: h3TagForNode,
    buildChildrenULTags: buildChildrenULTags
  };
}