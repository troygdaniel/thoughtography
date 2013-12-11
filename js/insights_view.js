var Take = Take || {};

Take.InsightsView = function(options) {
  var insights = new Take.Insights({note: options.note});
  var html = '<span style="padding:5px;"><a href="#">#content</a></span>'
  var elementHtml = '<span class="rounded-borders" style="padding:5px;"><a href="#">#content</a></span>'
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

  function renderWikis() {
    var wikis = insights.getWikis();
    var wikiHtml = "";
    for (var i = 0; i < wikis.length; i++) {
      for (key in wikis[i]) {
        var partial = new String(elementHtml).replace("#content", "["+key+"]");
        partial = partial.replace('href="#"','href="'+wikis[i][key]+'" target="_new"');
        wikiHtml += partial;
      }
    }

    return wikiHtml;
  }

  function renderTags() {
    var tag = insights.getTags();
    var tagHtml = "";
    for (var i = 0; i < tag.length; i++) {
      tagHtml += new String(elementHtml).replace("#content", tag[i]);
    }
    return tagHtml;
  }
  
  function render() {
    $el.html(renderParticipants() + renderTags() + renderWikis());
  }

  return {
    getNote: getNote,
    render: render,
    setContent: setContent,
    renderParticipants: renderParticipants
  };
};