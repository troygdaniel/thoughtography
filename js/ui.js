/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
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

    //************ INK File Picker init
    $('filePicker').on('click',function(){
        filepicker.pick(function(InkBlob){
          console.log(InkBlob.url);
        })
    });

    //************ sidenav messages / communications / after-refresh form responses
    $('.sidenav-messages').find('.icon-remove').on('click',function(){
        $('.sidenav-messages').remove();
    });
    $('.sidenav-stuff').find('.icon-remove').on('click',function(){
        $('.sidenav-stuff').remove();
    });

    //************ fake loading for loading buttons
    $('#loading-btn-h5a, #loading-btn-bs3').click(function(){
        var $this = $(this);
        $this.attr('disabled', 'disabled').html("Loading...");
        setTimeout(function () {
            $this.removeAttr('disabled').html('Loading State (done)');
        }, 3000)
    });

    //************ datepickers
    $('.datepicker').datepicker({autoclose:true});
    //************ date range pickers
    $('#date-range').daterangepicker();
    $('#date-range-predefined').daterangepicker(
                            {
                              ranges: {
                                 'Today': [moment(), moment()],
                                 'Last 7 Days': [moment().subtract('days', 6), moment()],
                              },
                              startDate: moment().subtract('days', 29),
                              endDate: moment()
                            },
                            function(start, end) {
                                $('#date-range-predefined span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                            }
    );
    //************ time picker
    $('#timepicker').timepicker(
            {
                defaultTime: 'current',
                minuteStep: 1,
                showSeconds: true,
                showMeridian: false
            });

    //
    $('.slider').slider();
    //onslide:
    //$('#dp5').slider()
    //.on('slide', function(ev){
    //    ....
    //});

    //************ tags manager
    jQuery("#tags-input").tagsManager();

    //************ simple color picker
    $('#colorpicker').simplecolorpicker({picker: true});
    $('#colorpicker-inline').simplecolorpicker();

    //************ wysiwyg Editor
    $('#editor').summernote({height:150});

    //************ multiselect
    $('#select-sizes').multiSelect();
    
});

