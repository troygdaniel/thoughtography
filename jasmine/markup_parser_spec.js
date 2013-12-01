//     Specs for Take.MarkupParser
describe("Take.MarkupParser spec", function() {
  var tabText = 'This is a test.\n\tThis is a child\nThis is another parent\n\tThis is another child\n\t\tThis is a grandchild';
  var tabJSON = [{"text": "This is a test.","children": [{"text": "This is a child","children": []}]}, {"text": "This is another parent","children": [{"text": "This is another child","children": [{"text": "This is a grandchild","children": []}]}]}];
  var tabJSONChanged = [{"text": "This is testing!","children": [{"text": "This is a child","children": []}]}, {"text": "This is another parent","children": [{"text": "This is another child","children": [{"text": "This is a grandchild","children": []}]}]}];
  var tabJSONWithChanges = [{"text":"This is a test.","children":[{"text":"This is a child","children":[],"lineNum":2}],"lineNum":1,"hasChanged":true},{"text":"This is another parent","children":[{"text":"This is another child","children":[{"text":"This is a grandchild","children":[],"lineNum":5}],"lineNum":4}],"lineNum":3}];
  var markupParser = new Take.MarkupParser({json: tabJSON, textData: tabText});

  describe("Constructor", function() {
    it("should be constructed with json and textData", function() {
      expect(markupParser.json).toEqual(tabJSON);
      expect(markupParser.textData).toEqual(tabText);
    });
  });

  describe("#prepare()", function() {
    it("should pre-parse and prepare the json.", function() {
      markupParser.prepare(tabJSON, tabJSONChanged);
      expect(tabJSON).toEqual(tabJSONWithChanges);
      expect(markupParser.textData).toEqual(tabText);
    });
  });

});