$(function() {

	$.ajax("thought.json").done(function(json) {
		var title = json.title;
		var body = json.body;

		for (var i = 0; i < body.length; i++) {
			$("#topic-tree").append(ulTextForNode(body[i]));
		};
		bindClickableToTree();
	});

	function ulTextForNode(node) {
		var title = titleForNode(node);
		var text = textForNode(node);
		var openUL = '<ul><li><span>'+  folderIcon(node) + title + '</span>&nbsp;' + text;
		var childUL = "";
		console.log(node);
		if (node.children) {
			for (var i = 0; i < node.children.length; i++) {
				childUL += ulTextForNode(node.children[i]);
			}
		}
		var closeUL = '</li></ul>';
		return openUL + childUL + closeUL;
	}

	function folderIcon(node) {
		if (node.children)
			return '<i class="icon-folder-open"></i>';
		return "";
	}

	function titleForNode(node) {
		var title = "";
		var wordArray = node.text.split(" ");
		for (var i = 0; i < wordArray.length; i++) {
			if (i <= 2) {
				title += " " + wordArray[i];
			}
			if (wordArray[i][0] === "#") {
				title = wordArray[i].substr(1,wordArray[i].length);
				break
			}
		}
		return "<B style='color:green'>"+title+"</B>";
	}
	function textForNode(node) {
		if (node.text.split(" ").length <= 2) {
			return "";
		} else {
			return node.text.substr(0,250);
		}
	}	

	function bindClickableToTree() {

		$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
		$('.tree li.parent_li > span').on('click', function(e) {
			var children = $(this).parent('li.parent_li').find(' > ul > li');
			if (children.is(":visible")) {
				children.hide('fast');
				$(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
			} else {
				children.show('fast');
				$(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
			}
			e.stopPropagation();
		});
	}

});