var Take = Take || {};

Take.NoteView = function(options) {
  var events = [];
  var prevJson;
  var el = options.el;
  var $el = $(el);
  var note = options.note;
  var collapsedHeaders = [];
  var $textarea = $(options.textarea);
  var socket = options.socket;
  var markupParser = new Take.MarkupParser({ textData: note.getContent(), json: note.getJSON() });

  initialize(options);

  function initialize(options) {

    bindChangesEvent(options.changes);
    this.fullname = options.fullname;
    bindWebSocketToRender();

    onKeyUp();
    onKeyDown();

    $textarea.focus();
  }

  function bindChangesEvent(callblack) {
    if (callblack) { events["changes"] = callblack; }
  }

  function bindWebSocketToRender() {
    socket.on('shared_note_changes:' + note.getId(), render);
  }

  function onKeyUp() {
    $textarea.keyup(function(e) {
      note.shareChanges($(this).val());
      localPreview($(this).val());
      events["changes"](e);
      // knwl.init($(this).val());
    });
  }

  function onKeyDown() {
    $textarea.keydown(function(e) {
      
      // Was a '-' char pressed?
      if (e.keyCode === 189) {        
        var sel = $textarea.get(0).selectionStart;
        var lastChar = $textarea.val().substr(sel-1,1);

        if (lastChar === '\t' || lastChar === '\n') {
          onTabDown(this);
          e.preventDefault();
        }
      }
      // Is the key a tab?
      if (e.keyCode === 9) {
        onTabDown(this);
        e.preventDefault();
      } 
      // Is the key <enter> ?
      if (e.keyCode === 13) { 
        onEnterDown(this);
        e.preventDefault();    
      }
    });
  }

  function onTabDown(txtArea) { 
    var orginalStart = txtArea.selectionStart;
    insertIntoTextArea("\t", txtArea);
    // reset caret at correct position 
    txtArea.selectionStart = txtArea.selectionEnd = orginalStart + 1;
  }

  function onEnterDown(txtArea) {
    var originalEnd = txtArea.selectionEnd;
    insertIntoTextArea("\n\t", txtArea);
    // reset caret at correct position 
    txtArea.selectionStart = txtArea.selectionEnd = originalEnd + 2;    
  }

  function insertIntoTextArea(str, txtArea) {
    var value = $textarea.val();    
    var content = value.substring(0, txtArea.selectionStart) + str + value.substring(txtArea.selectionEnd);
    $textarea.val(content);
  }

  function markHeaderAsHidden(headerClass) {
    if ($.inArray(headerClass, collapsedHeaders))
      collapsedHeaders.push(headerClass);
  }

  function removeHeaderAsHidden(headerClass) {
    collapsedHeaders.pop(headerClass);
  } 

  function hideCollapsedHeaders() {
    for (var i = 0; i < collapsedHeaders.length; i++) {
      $("#" + collapsedHeaders[i]).hide();
    }
  }

  function skipRender(textData, forceUpdate) {
    if (typeof forceUpdate === "undefined") forceUpdate = false;
    if (forceUpdate === false && note.getContent() === textData) return true;
    return false;
  }

  function localPreview(textData) {
    render(textData, true);
  }

  function updateTextArea(textData) {
    var txtArea = $textarea.get(0);
    var selectionStart = txtArea.selectionStart;
    var selectionEnd = txtArea.selectionEnd;
    $textarea.val(textData);
    txtArea.selectionStart = selectionStart;
    txtArea.selectionEnd = selectionEnd;
  }

  function render(textData, forceUpdate) {
    if (skipRender(textData, forceUpdate) === true) return;
    
    if ($textarea && $textarea.get(0)) {
      updateTextArea(textData);
    }

    // identifyChanges made in the JSON and update the DOM
    var json = getJSON(textData);
    markupParser.identifyChanges(json, prevJson);
    updateDOMWithHtml(json);

    // Manage and trigger events
    if (events["changes"]) events["changes"]();
    bindClickableToTree();
    hideCollapsedHeaders();
    prevJson = json;
  }

  function updateDOMWithHtml(json) {
    $el.empty();
    $el.append(markupParser.toHtml(json));
  }

  function bindClickableToTree() {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('h3').on('click', function() {
      var headerClass = $(this).attr("class");
      var $headerChild = $("#" + headerClass);

      if ($headerChild.is(":visible")) {
        $headerChild.hide('fast');
        markHeaderAsHidden(headerClass);
      } else {
        $headerChild.show('fast');
        removeHeaderAsHidden(headerClass);
      }
    });
  }
  function append(txt) {
    note.append(txt);
    render(note.getContent(), true);
    note.shareChanges();
  }
  function getJSON(v) {
    return note.getJSON(v);
  }

  function on(k, callblack) {
    events[k] = callblack;
  }

  return {
    append: append,
    note: note,
    el: el,
    $textarea: $textarea,
    on: on,
    localPreview: localPreview,
    render: render,
    getJSON: getJSON
  };
};