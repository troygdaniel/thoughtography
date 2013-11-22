/* 
 *
 * This is the starting point for Javascripts of a new page
 * 
 */


/* jQuery READY */
$(function() {

    //************ affix the side navigation
    $('.h5a-sidebar').affix({
        offset: {
          top: -10
        , bottom: function () {
            return (this.bottom = $('.bs-footer').outerHeight(true))
          }
        }
    });

    //************ activate drang and drop
    $("#categories").sortable({
        tolerance: 'pointer',
        items: ".gate",
        revert: "invalid",
        axis: "x",
        cursor: "move"
    });
    $(".gate").sortable({
        tolerance: 'pointer',
        dropOnEmpty: true,
        items: ".category",
        //revert: "invalid",
        connectWith: ".gate",
        cursor: "move",
        placeholder: "ui-state-highlight category"
    });
    $(".category").sortable({
        greedy: true,
        dropOnEmpty: true,
        tolerance: 'pointer',
        items: ".activity",
        //revert: "invalid",
        connectWith: ".category",
        cursor: "move",
        placeholder: "ui-state-highlight"
    });

    //************ activate file tree!
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > span').on('click', function (e) {
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

});