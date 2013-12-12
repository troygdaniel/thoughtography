var Take = Take || {};

Take.NoteView = function(options) {
  var events = [];
  var prevJson;
  var el = options.el;
  var $el = $(el);
  var note = options.note;
  var collapsedHeaders = [];
  var textarea = options.textarea;
  var $textarea = $(textarea);
  var socket = options.socket;
  var markupParser;

  initialize(options);

  // Private methods
  // ---------------

  function initialize(options) {

    markupParser = new Take.MarkupParser({
      textData: note.getContent(),
      json: note.getJSON()
    });

    if (options.changes) { events["changes"] = options.changes; }

    socket.on('shared_note_changes:' + note.getId(), render);

    $textarea.keyup(function(e) {
      note.shareChanges($(this).val());
      preview($(this).val());
      events["changes"](e);
      // knwl.init($(this).val());
    });

    $textarea.focus();
    // Handle the tab key event in the textarea
    $textarea.keydown(function(e) {
      var content;
      var $this = $(this);
      var value = $this.val();
      if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        content = value.substring(0, start) + "\t" + value.substring(end);
        $this.val(content);

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
      } else if (e.keyCode === 13) { // enter key was pressed
        var start = this.selectionStart;
        var end = this.selectionEnd;        
        content = value.substring(0, start) + "\n\t" + value.substring(end);
        $this.val(content);
        this.selectionStart = this.selectionEnd = end+2;
        e.preventDefault();        
      } else {
        content = value;
      };
    });
  }

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
    events["changes"]();
    bindClickableToTree();
    hideCollapsedHeaders();
    prevJson = json;

  }

  function getJSON(v) {
    return note.getJSON(v);
  }

  function on(k, callblack) {
    events[k] = callblack;
  }

  // Setters / getters
  // -----------------

  return {
    note: note,
    el: el,
    on: on,
    preview: preview,
    render: render,
    getJSON: getJSON
  };
};