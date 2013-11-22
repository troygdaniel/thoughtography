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
    
    //************ activates all popovers in the page with class ".popover-test"
    $('.popover-test').popover({trigger:'hover', html : true});
    
    //************ activate all tooltips within <a> tags
    $('.tooltip-test').tooltip({html : true});


    
    //all your JS should go in here!
});