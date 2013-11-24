window.MeetingNotesView = function() {};

MeetingNotesView.makeId = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

MeetingNotesView.ulTextForNode = function(node) {
  var openUL = '<ul><li><span>' + MeetingNotes.folderIcon(node) + MeetingNotes.titleForNode(node) + '</span>&nbsp;' + MeetingNotes.textForNode(node);
  var wikiText = MeetingNotes.wikiFromText(node.text);

  var iFrameTag = '<br/><iframe width="500px" height="200px" src="http://en.m.wikipedia.org/wiki/'+wikiText+'"></iframe>';
  var childUL = "";
  var completeTag = ""
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      childUL += MeetingNotesView.ulTextForNode(node.children[i]);
    }
  }
  // if (wikiText)
  //   completeTag = openUL + iFrameTag + childUL + '</li></ul>';
  // else 
    completeTag = openUL + childUL + '</li></ul>';
  return completeTag;
}
MeetingNotesView.render = function(json) {
  $("#topic-tree").empty();
  if (json.length) {
    for (var i = 0; i < json.length; i++) {
      $("#topic-tree").append(MeetingNotesView.titleTextForNode(json[i]));
    };
  }
  MeetingNotesView.bindClickableToTree();
}

MeetingNotesView.titleTextForNode = function(node) {
  var headerId = MeetingNotesView.makeId();
  var openTag = '<h3 class=' + headerId + '>' + MeetingNotes.titleForNode(node) + ' ' + MeetingNotes.textForNode(node) + '</h3><span id="' + headerId + '">';
  var childUL = "";
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      childUL += MeetingNotesView.ulTextForNode(node.children[i]);
    }
  }
  return openTag + childUL + '</span>';
}
MeetingNotesView.bindClickableToTree = function() {

  $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
  $('h3').on('click', function(e) {
    var headerClass = $(this).attr("class");
    $("#" + headerClass).slideToggle('fast');
  });

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