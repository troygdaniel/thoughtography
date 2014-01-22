var Take = Take || {};

Take.InsightsView = function(options) {
  var insights = new Take.Insights({note: options.note});
  var html = '<span><a href="#">#content</a></span>'
  var elementHtml = '<span class="rounded-corners" style="padding:5px;"><a href="#">#content</a></span>&nbsp;&nbsp;&nbsp;'
  var note = options.note;
  var el = options.el;
  var $el = $(el);

  function getNote() {
    return note;
  }
  function setContent(v) {
    note.setContent(v);
  }
  function renderParticipants() {
    if (!insights.getParticipants()) return;
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
    if (!wikis) return;
    for (var i = 0; i < wikis.length; i++) {
      for (key in wikis[i]) {
        var partial = new String(elementHtml).replace("#content", "wiki "+key);
        partial = partial.replace('href="#"','class="wiki-link" href="'+wikis[i][key]+'" target="_iframe"');
        wikiHtml += partial;
      }
    }

    return wikiHtml;
  }

  function renderTags() {
    var tag = insights.getTags();
    if (!insights.getTags()) return;
    var tagHtml = "";
    for (var i = 0; i < tag.length; i++) {
      var partial = new String(elementHtml).replace("#content", tag[i]);
      var str = tag[i].replace("#",'');
      partial = partial.replace('href="#"','href="https://twitter.com/search?q=%23'+str+'" target="_twitter"');
      tagHtml += partial;
    }
    return tagHtml;
  }
  
  function render() {
    $el.html(renderParticipants() + renderTags() + renderWikis());
    $(".wiki-link").click(function (){
      $("#_iframe").toggle();
    });
  }

  return {
    getNote: getNote,
    render: render,
    setContent: setContent,
    renderParticipants: renderParticipants
  };
};