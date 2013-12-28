var Take = Take || {};

Take.Note = function (options) {
  var socket = options.socket;
  var parser = new Parser();
  var id, content, json;
  var onSharedChanges;

  initialize(options);

  function initialize(options) {
    // initialize with options
    if (options) {
      if (options.id) {
        setId(options.id);
        onSharedChanges = options.onSharedChanges;
      } else {
        // assume the id alone was passed in as a param
        setId(options);
      }
    }
  }

  function shareChanges(textData) {
    if (textData) {
      setContent(textData);
    }
    socket.emit('share_note:'+getId(), getContent());
  }

  function setContent(v) {
    content = v;
    setJSON(parser.serialize(content));
  }
  function getContent() {
    return content;
  }
  function getId() {
    return id;
  }
  function setId(v) {
    id = v;
  }
  function getJSON(v) {
    if (v) {
      setContent(v);
    }
    return json;
  }
  function setJSON(v) {
    json = v;
  }
  function append(txt) {
    setContent(content + "\n\t"+txt);
    return getContent();
  }

  return {
    append: append,
    getId: getId,
    setId: setId,
    getContent: getContent,
    setContent: setContent,
    getJSON: getJSON,
    setJSON: setJSON,
    shareChanges: shareChanges,
    onSharedChanges: onSharedChanges
  };
};