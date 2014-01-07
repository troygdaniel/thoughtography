var Take = Take || {};

Take.MarkupParser = function(options) {
  var json = options.json;
  var textData = options.textData;

  function identifyChanges(json, prevJson, lineNum) {
    if (!json) return;
    
    if (typeof lineNum === "undefined") lineNum = 0;

    for (var i = 0; i < json.length; i++) {
      json[i].lineNum = ++lineNum;

      if (prevJson && jsonHasChanges(json[i], prevJson[i]) === true) 
        json[i].hasChanged = true;

      lineNum = identifyChanges(json[i].children, hasChildren(prevJson, i), lineNum);
    }
    return lineNum;
  }

  function jsonHasChanges (json, prevJson) {
    if (prevJson && json.text != "") {
      if (prevJson.text.toString() != json.text.toString()) {
        return true;
      }
    }
    return false;
  }

  function hasChildren(prevJson, i) {
    if (prevJson && prevJson[i] && prevJson[i].children)
      return prevJson[i].children;
    return false;
  }

  function toHtml(json) {
    var html = "";
    if (json.length) {
      for (var i = 0; i < json.length; i++) {
        html += buildHTML(json[i]);
      }
    }
    return html;
  }

  // Build the top-level HTML and the recursive children
  function buildHTML(node) {
    var parentNum = node.lineNum;
    var childrenHTML = "";

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childrenHTML += buildChildrenText(node.children[i], parentNum);
      }
    }
    return h3TagForNode(node) + childrenHTML + '</span>';
  }

  function h3TagForNode(node) {    
    var bgColor = "#FFF";

    // WARN: Coupled with DOM
    var clockVal = $(".clock-interval").text();
    var headerContent = node.text.trim();
    var hasClockVal = headerContent.indexOf(clockVal);
    var clockVal_replace = '<span class="clock-interval badge">'+clockVal+'</span>';
    // does the text has the clock val?
    if (hasClockVal > 0) {
      headerContent = headerContent.replace(clockVal, '##clockVal_replace##');
    }

    // replace time with badge span html
    var words = headerContent.split(' ');    
    for (var i=0; i < words.length; i++) {
      var indx = words[i].indexOf(":");
      var word = words[i];
      if (indx > 0) {        
        var v = parseInt(word.substr(indx+1,indx+2));
        if (isNaN(v) === false) {
          headerContent = headerContent.replace(word, "<span style='font-size:14px;font-weight:bold'>"+word+"</span>");
        }        
      }
    }
    if (hasClockVal > 0) {
      headerContent = headerContent.replace("##clockVal_replace##", clockVal_replace);
    }

    if (node.hasChanged === true)
      bgColor = "#F5F6CE";      

    return '<h3 style="font-weight:normal;color:#0283A4;background-color:'+bgColor+'" class="header-line-num-' + node.lineNum + '">' + headerContent + '</h3><span style="display: block;" id="header-line-num-' + node.lineNum + '">';
  }

  // TODO: Consider a simplier string search/replace implementation
  function buildChildrenText(node, parentLine) {
    var childHTML = "";

    if (node.children && node.children.length > 0) {
      for (var i = 0; i < node.children.length; i++) {
        childHTML += buildChildrenULTags(node.children[i], node.lineNum);
      }
      return plainChild(node, parentLine) + childHTML + '</span></span>';
    } else {
      return plainChild(node, parentLine) + childHTML + '</span></span><br/>';
    }
    
  }

  // TODO: Consider a simplier string search/replace implementation
  function plainChild(node, parentLine) {
    var bgColor = "#FFF";
    if (node.hasChanged) bgColor = "#F5F6CE";
    var parentNumClass = "parent-line-num-" + parentLine;    
    var lineNumClass = "line-num-" + node.lineNum;

    var openUL = '<span style="background-color:'+bgColor+';position:relative;left:10px" ' + headerStyleForNode(node) + '>';
    var openLI = '<span style="" class="' + parentNumClass + ' ' + lineNumClass + '">';
    var openSpan = '<span class="' + parentNumClass + ' ' + lineNumClass + '">';
    
    return openUL + openLI + openSpan + titleForNode(node) + '</span>&nbsp;' + textForNode(node);
  }

  // TODO: Consider a simplier string search/replace implementation
  function buildChildrenULTags(node, parentLine) {
    var childUL = "";

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childUL += buildChildrenULTags(node.children[i], node.lineNum);
      }
    }
    return openULTag(node, parentLine) + childUL + '</li></ul>';
  }

  // TODO: Consider a simplier string search/replace implementation
  function openULTag(node, parentLine) {
    var bgColor = "#FFF";
    if (node.hasChanged) bgColor = "#F5F6CE";
    var parentNumClass = "parent-line-num-" + parentLine;    
    var lineNumClass = "line-num-" + node.lineNum;

    var openUL = '<ul ' + headerStyleForNode(node) + '>';
    var openLI = '<li style="background-color:'+bgColor+';" class="' + parentNumClass + ' ' + lineNumClass + '">';
    var openSpan = '<span class="' + parentNumClass + ' ' + lineNumClass + '">';
    
    return openUL + openLI + openSpan + titleForNode(node) + '</span>&nbsp;' + textForNode(node);
  }

  function headerStyleForNode(node) {
   if (node.hasChanged === true) 
      headerStyle = 'style="background-color:#F5F6CE"';
    return ""; 
  }

  function hashTagFromText(text) {
    var wordArray = text.split(" ");

    for (var i = 0; i < wordArray.length; i++) {
      if (wordArray[i][0] === "#") 
        return wordArray[i].substr(0, wordArray[i].length);
    }
    return "";
  }
  
  function titleFromText(text) {
    var hasColon = text.indexOf(":");
    if (hasColon > 0)
      return text.substr(0,hasColon+1);
    var hasName = text[0] === "@";
    if (hasName)
      return text.split(' ')[0];
    return "";
  }  

  function lastChar(word) {
    if (word)
      return word[word.length - 1];
    return "";
  }

  function titleForNode(node) {
    if (typeof node.text === "undefined") return;
    var title = "";

    if (boldedText(node.text)) title = boldedText(node.text);
    if (title === "") title = titleFromText(node.text);
    if (title === "") title = hashTagFromText(node.text);

    return "<span style='color:#0283A4'>" + title.trim() + "</span>";
  }

  function textForNode(node) {
    if (wordCount(node.text) <= 2)
      return "";
    return stripFirstBoldedText(node.text).trim();
  }

  function stripFirstBoldedText(text) {
    if (typeof text === "undefined") return;
    var words = text.split(" ");
    var theLastWord = false;
    var boldWordArray = [];

    for (i = 0; i < words.length; i++) {

      // Can we exit the loop?
      if (theLastWord === true) { boldWordArray.push(words[i]) }

      // Did we find a QuickWord: to be bolded?
      if (lastChar(words[i]) === ":") { theLastWord = true; }

      // Did we find a @person to be bolded?
      if (words[i][0] === "@") { theLastWord = true; }

      // Did we find *The last word* having a closing '*'?
      if (words[i][words[i].length - 1] === "*") { theLastWord = true; }
    }

    // Did we find a bolded string?
    if (theLastWord === false) {
      return text;
    }

    // Return the bolded word 
    return boldWordArray.join(" ");
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
    toHtml: toHtml,
    textData: textData,
    identifyChanges: identifyChanges,
    h3TagForNode: h3TagForNode,
    buildChildrenULTags: buildChildrenULTags
  };
}