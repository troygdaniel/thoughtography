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

  describe("#identifyChanges()", function() {
    it("should pre-parse and identifyChanges the json.", function() {
      markupParser.identifyChanges(tabJSON, tabJSONChanged);
      expect(tabJSON).toEqual(tabJSONWithChanges);
      expect(markupParser.textData).toEqual(tabText);
    });
  });

  describe("#titleFromText()", function() {
    it("should parse out the title from the text", function() {
      var example = "This: would have a title of 'This'";
      expect(markupParser.titleFromText(example)).toEqual("This:");
      example = "This example: would have a title of 'This example:'";
      expect(markupParser.titleFromText(example)).toEqual("This example:");
    });
  });

  describe("#hashTagFromText()", function() {
    it("should parse out the hash tag substring from the text", function() {
      var example = "This would return a #title value of '#title'";
      expect(markupParser.hashTagFromText(example)).toEqual("#title");
      
      example = "This example #would have a title of '#would'";
      expect(markupParser.hashTagFromText(example)).toEqual("#would");
    });
  });


});