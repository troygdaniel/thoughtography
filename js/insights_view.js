var Take = Take || {};

Take.InsightsView = function(options) {
  var insights = new Take.Insights({note: options.note});
  var elementHtml = html = '<span style="padding:5px;"><a href="#">#content</a></span>'
  var note = options.note;
  var el = options.el;
  var $el = $(el);

  // Public methods

  function getNote() {
    return note;
  }
  function setContent(v) {
    note.setContent(v);
  }
  function renderParticipants() {
    var ppl = insights.getParticipants();
    var pplHtml = "";
    for (var i = 0; i < ppl.length; i++) {
      pplHtml += new String(elementHtml).replace("#content", ppl[i]);
    }
    return pplHtml;
  }

  function render() {
    console.log(renderParticipants());
    $el.html(renderParticipants());
  }

  return {
    getNote: getNote,
    render: render,
    setContent: setContent,
    renderParticipants: renderParticipants
  };
};