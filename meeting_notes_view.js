window.MeetingNotesView = function() {};

MeetingNotesView.collapsedHeaders = [];
MeetingNotesView.collapsedLines = [];
MeetingNotesView.prevJson = {};
MeetingNotesView.lineCounter = 0;

/* MeetingNotesView.render(json) */
MeetingNotesView.render = function(json) {
  MeetingNotesView.compareJson(json,MeetingNotesView.prevJson);
  MeetingNotesView.lineCounter = 0;
  $("#topic-tree").empty();
  if (json.length) {
    for (var i = 0; i < json.length; i++) {
      $("#topic-tree").append(MeetingNotesView.titleTextForNode(json[i]));
    };
  }
  MeetingNotesView.bindClickableToTree();
  MeetingNotesView.hideCollapsedChildren();
  MeetingNotesView.hideCollapsedHeaders();
  MeetingNotesView.prevJson = json;
}

MeetingNotesView.compareJson = function(json, prevJson) {
  for (var i = 0; i < json.length; i++) {
    if (prevJson && prevJson[i] && json[i].text != "") {
      if (prevJson[i].text.toString() != json[i].text.toString()) {
        json[i].hasChanged=true;
      }
    }
    if (prevJson[i] && prevJson[i].children)
      MeetingNotesView.compareJson(json[i].children,prevJson[i].children);
  }
}

/* MeetingNotesView.titleTextForNode(node) */
MeetingNotesView.titleTextForNode = function(node) {
  MeetingNotesView.lineCounter++
  var parentNum = MeetingNotesView.lineCounter;
  var lineNumClass = "line-num-" + MeetingNotesView.lineCounter;
  var headerId = MeetingNotesView.makeId();
  var headerStyle = "";
  if (node.hasChanged === true) {
    headerStyle = 'style="background-color:#F5F6CE"';
  }
  var openTag = '<h3 '+headerStyle+' class="header-line-num-' + parentNum + '">' + MeetingNotes.titleForNode(node) + ' ' + MeetingNotes.textForNode(node) + '</h3><span style="display: block;" id="header-line-num-' + parentNum + '">';
  var childUL = "";
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      childUL += MeetingNotesView.ulTextForNode(node.children[i], parentNum);
    }
  }
  return openTag + childUL + '</span>';
}

/* MeetingNotesView.ulTextForNode(node) */
MeetingNotesView.ulTextForNode = function(node, parentLine) {
  var parentNumClass = "parent-line-num-" + parentLine;
  MeetingNotesView.lineCounter++;

  var headerStyle = "";
  if (node.hasChanged === true) {
    headerStyle = 'style="background-color:#F5F6CE"';
  }
  var parentNum = MeetingNotesView.lineCounter;
  var lineNumClass = "line-num-" + MeetingNotesView.lineCounter;
  var openUL = '<ul '+headerStyle+'><li class="' + parentNumClass + ' ' + lineNumClass + '"><span class="' + parentNumClass + ' ' + lineNumClass + '">' + MeetingNotes.folderIcon(node) + MeetingNotes.titleForNode(node) + '</span>&nbsp;' + MeetingNotes.textForNode(node);
  var wikiText = MeetingNotes.wikiFromText(node.text);

  var iFrameTag = '<br/><iframe width="500px" height="200px" src="http://en.m.wikipedia.org/wiki/' + wikiText + '"></iframe>';
  var childUL = "";
  var completeTag = ""
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      childUL += MeetingNotesView.ulTextForNode(node.children[i], parentNum);
    }
  }
  if (wikiText)
    completeTag = openUL + iFrameTag + childUL + '</li></ul>';
  else 
  completeTag = openUL + childUL + '</li></ul>';
  return completeTag;
}

/* MeetingNotesView.bindClickableToTree() */
MeetingNotesView.bindClickableToTree = function() {

  $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
  $('h3').on('click', function(e) {
    var headerClass = $(this).attr("class");
    var $headerChild = $("#" + headerClass);

    if ($headerChild.is(":visible")) {
      $headerChild.hide('fast');
      MeetingNotesView.addCollapsedHeader(headerClass);
    } else {
      $headerChild.show('fast');
      MeetingNotesView.removeCollapsedHeader(headerClass);
    }
  });

  $('.tree li.parent_li > span').on('click', function(e) {
    var children = $(this).parent('li.parent_li').find(' > ul > li');
    if (children.is(":visible")) {
      MeetingNotesView.addCollapsedChild($(this).attr("class").split(" "));
      children.hide('fast');
      $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
    } else {
      MeetingNotesView.removeCollapsedChild($(this).attr("class").split(" "));
      children.show('fast');
      $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
    }
    e.stopPropagation();
  });
}

MeetingNotesView.addCollapsedHeader = function(headerClass) {
  if ($.inArray(headerClass, MeetingNotesView.collapsedHeaders))
    MeetingNotesView.collapsedHeaders.push(headerClass);
}
MeetingNotesView.removeCollapsedHeader = function(headerClass) {
  MeetingNotesView.collapsedHeaders.pop(headerClass);
}

MeetingNotesView.addCollapsedChild = function(classArray) {
  for (var i = 0; i < classArray.length; i++) {
    if (classArray[i].indexOf("parent-line-num-") === -1) {
      if ($.inArray(classArray[i], MeetingNotesView.collapsedLines))
        MeetingNotesView.collapsedLines.push(classArray[i]);
    }
  }
}
MeetingNotesView.removeCollapsedChild = function(classArray) {
  for (var i = 0; i < classArray.length; i++) {
    if (classArray[i].indexOf("parent-line-num-") === -1) {
      MeetingNotesView.collapsedLines.pop(classArray[i]);
    }
  }
}
MeetingNotesView.hideCollapsedChildren = function() {
  for (var i = 0; i < MeetingNotesView.collapsedLines.length; i++) {
    $(".parent-" + MeetingNotesView.collapsedLines[i]).hide();
  }
}
MeetingNotesView.hideCollapsedHeaders = function() {
  for (var i = 0; i < MeetingNotesView.collapsedHeaders.length; i++) {
    $("#" + MeetingNotesView.collapsedHeaders[i]).hide();
  }
}

/* MeetingNotesView.makeId() */
MeetingNotesView.makeId = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}