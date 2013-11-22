/* 
 *
 * This is a page-specific JS
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

    //activate validation for wizard every form
    $('form').removeAttr("novalidate");
    $('form').validate();
    
    //wizard and modal wizard
    $('#myWizard').wizard();
    $('#MyWizard').on('change', function(e, data) {
        
        var noprogress = false;
        var completness = (data.step * 2.2)*10;

        if(data.step===3 && data.direction==='next') {
            $('#wizardValidate').valid();
            if($('#wizardValidate input').hasClass("error")){
                e.preventDefault();
                noprogress = true;
            }else{
                alert('AJAX Submit here (or something else)');
            }
        }
        if(!noprogress){
            //fill progressbars
            $('.wizardProgress').css('width',completness+'%');
        }
    });
    $('#MyWizard').on('changed', function(e, data) {
        console.log('changed');
    });
    $('#MyWizard').on('finished', function(e, data) {
        console.log('finished');
        $('.btnWizardNext, .btnWizardPrev').hide();

        $('#step5').html('<h1><small><i class="icon-flag-checkered"></i><br>Well Done!<br>You are a champion!</small></h1>');

        alert('WELL DONE!');

        //fill progressbars
        var completness = 100;
        $('.wizardProgress').css('width',completness+'%');
    });
    $('.btnWizardPrev').on('click', function() {
        $('#MyWizard').wizard('previous');
    });
    $('.btnWizardNext').on('click', function() {
        $('#MyWizard').wizard('next','foo');
    });
    $('#btnWizardStep').on('click', function() {
        var item = $('#MyWizard').wizard('selectedItem');
        console.log(item.step);
    });
    $('#MyWizard').on('stepclick', function(e, data) {
        $('.btnWizardNext, .btnWizardPrev').show();

        console.log('step' + data.step + ' clicked');
        if(data.step===1) {
            // return e.preventDefault();
        }
    });

});