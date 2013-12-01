var Take = Take || {};

Take.Note = function (options) {
  var socket = options.socket;
  var parser = new Parser();
  var id, content, json;
  var onSharedChanges;

  initialize(options);
  
  // Listen for changes
  var that = this;

  // Private methods
  // ---------------

  function initialize(options) {
    var _id;
    // initialize with options
    if (options) {
      if (options.id) {
        _id = options.id;
        onSharedChanges = options.onSharedChanges;
      } else {
        // assume the id alone was passed in as a param
        _id = options;
      }
    }
    setId(_id);
  }

  // Public methods
  // --------------

  function shareChanges(textData) {
    if (textData) {
      setContent(textData);
    }
    socket.emit('share_note:'+getId(), getContent());
  }


  // Setters / getters
  // -----------------
  
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

  return {
    getId: getId,
    setId: setId,
    getContent: getContent,
    setContent: setContent,
    getJSON: getJSON,
    setJSON: setJSON,
    shareChanges: shareChanges,
    onSharedChanges: onSharedChanges
  };
}