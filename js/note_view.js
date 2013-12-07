var Take = Take || {};

Take.NoteView = function(options) {
  var prevJson;
  var el = options.el;
  var $el = $(el);
  var note = options.note;
  var collapsedHeaders = [];
  var textarea = options.textarea;
  var $textarea = $(textarea);
  var socket = options.socket;

  var markupParser = new Take.MarkupParser({
    textData: note.getContent(),
    json: note.getJSON()
  });

  socket.on('shared_note_changes:' + note.getId(), render);

  // Private methods
  // ---------------
  function generateHTML(node) {
    var h3Tag = markupParser.h3TagForNode(node);
    var parentNum = node.lineNum;
    var childUL = "";
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        childUL += markupParser.buildChildrenULTags(node.children[i], parentNum);
      }
    }
    return h3Tag + childUL + '</span>';
  }

  function bindClickableToTree() {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('h3').on('click', function() {
      var headerClass = $(this).attr("class");
      var $headerChild = $("#" + headerClass);

      if ($headerChild.is(":visible")) {
        $headerChild.hide('fast');
        addCollapsedHeader(headerClass);
      } else {
        $headerChild.show('fast');
        removeCollapsedHeader(headerClass);
      }
    });
  }

  function addCollapsedHeader(headerClass) {
    if ($.inArray(headerClass, collapsedHeaders))
      collapsedHeaders.push(headerClass);
  }

  function removeCollapsedHeader(headerClass) {
    collapsedHeaders.pop(headerClass);
  } 

  function hideCollapsedHeaders() {
    for (var i = 0; i < collapsedHeaders.length; i++) {
      $("#" + collapsedHeaders[i]).hide();
    }
  }

  // Public methods
  // --------------
  function preview(textData) {
    render(textData, true);
  }
  function render(textData, forceUpdate) {
    if (typeof forceUpdate === "undefined") forceUpdate = false;
    if (forceUpdate === false && note.getContent() === textData) return;
    $textarea.val(textData);
    var json = getJSON(textData);
    markupParser.prepare(json, prevJson);

    $el.empty();
    if (json.length) {
      for (var i = 0; i < json.length; i++) {
        $el.append(generateHTML(json[i]));
      }
    }
    bindClickableToTree();
    hideCollapsedHeaders();
    prevJson = json;

  }

  function getJSON(v) {
    return note.getJSON(v);
  }

  // Setters / getters
  // -----------------

  return {
    note: note,
    el: el,
    preview: preview,
    render: render,
    getJSON: getJSON
  };
};