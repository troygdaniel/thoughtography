function ParsedLine(level, text, previous) {
  this.level = level;
  this.text = text;
  this.previous = previous;
  this.children = [];
}

ParsedLine.prototype.adjustLevel = function() {
  if (this.previous === null) {
    return this.level = 0;
  } else if (this.level - this.previous.level > 1) {
    return this.level = this.previous.level + 1;
  }
};

ParsedLine.prototype.parentOf = function(child) {
  return (child.level - this.level) === 1;
};

ParsedLine.prototype.addChild = function(child) {
  return this.children.push(child);
};

ParsedLine.prototype.linkToParent = function() {
  var prev;
  if (this.previous == null) {
    return null;
  }
  prev = this.previous;
  while (prev) {
    if (prev.parentOf(this)) {
      prev.addChild(this);
      return prev;
    } else {
      prev = prev.previous;
    }
  }
};

ParsedLine.prototype.serialize = function() {
  var child;
  return {
    text: this.text,
    children: (function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.serialize());
      }
      return _results;
    }).call(this)
  };
};

ParsedLine.analyze = function(line) {
  var r;
  r = line.match(/^(\t+)(.*)/);
  if (r != null) {
    return {
      level: r[1].length,
      text: r[2].trim()
    };
  } else {
    return {
      level: 0,
      text: line.trim()
    };
  }
};

ParsedLine.build = function(rawText, previous) {
  var level, line, text, _ref;
  this.previous = previous;
  _ref = this.analyze(rawText), level = _ref.level, text = _ref.text;
  line = new ParsedLine(level, text, this.previous);
  line.adjustLevel();
  line.linkToParent();
  return line;
};

function Parser() {}

Parser.prototype.toLines = function(content) {
  var prevLine;
  prevLine = null;
  return content.split('\n').map(function(line) {
    var current;
    current = ParsedLine.build(line, prevLine);
    return prevLine = current;
  });
};

Parser.prototype.serialize = function(content) {
  var line, _i, _len, _ref, _results;
  _ref = this.toLines(content);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    line = _ref[_i];
    if (line.level === 0) {
      _results.push(line.serialize());
    }
  }
  return _results;
};