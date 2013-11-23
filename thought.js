$(function() {

  $.ajax("thought.json").done(function(json) {
    renderJsonAsTree(json);
  });

  window.renderJsonAsTree = function(json) {
    $("#topic-tree").empty();
    if (json.length) {
      for (var i = 0; i < json.length; i++) {
        $("#topic-tree").append(ulTextForNode(json[i]));
      };
    }
    bindClickableToTree();
  }

  function ulTextForNode(node) {
    var openUL = '<ul><li><span>' + folderIcon(node) + titleForNode(node) + '</span>&nbsp;' + textForNode(node);
    var childUL = "";
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childUL += ulTextForNode(node.children[i]);
      }
    }
    var closeUL = '</li></ul>';
    return openUL + childUL + closeUL;
  }

  function folderIcon(node) {
    // if (node.children)
    //   return '<i class="icon-folder-open"></i>';
    return "";
  }

  function boldedText(source) {
    return source.substr(source.indexOf("*") + 1, (source.lastIndexOf("*") - source.indexOf("*") - 1));
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

  function titleFromText(text) {
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

  function textForNode(node) {
    if (wordCount(node.text) <= 2) {
      return "";
    } else {

      return stripFirstBoldedText(node.text);
    }
  }

  function stripFirstBoldedText(text) {
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

  function wordCount(txt) {
    txt.split(" ").length;
  }

  function bindClickableToTree() {

    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > span').on('click', function(e) {
      var children = $(this).parent('li.parent_li').find(' > ul > li');
      if (children.is(":visible")) {
        children.hide('fast');
        $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
      } else {
        children.show('fast');
        $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
      }
      e.stopPropagation();
    });
  }

});