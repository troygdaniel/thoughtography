/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/* jQuery READY */
$(function() {
    "use strict";
    //************ affix the side navigation
    $('.h5a-sidebar').affix({
        offset: {
          top: 330
        , bottom: function () {
            return (this.bottom = $('.bs-footer').outerHeight(true))
          }
        }
    });

    //************ randomize colors of a container in the dashaboard
    $('#changeColor').on('click', function(ev){
        ev.preventDefault();
        var colors  = ['red', 'green', 'blue', 'violet', 'orange', 'gray'];
        var item    = colors[Math.floor(Math.random()*colors.length)];
        $('#colorChanger').removeClass('red green blue violet orange gray');
        $('#colorChanger').addClass(item);
    })
    
    //************ activates all popovers in the page with class ".popover-test"
    $('.popover-test').popover({trigger:'hover', html : true});
    
    //************ activate all tooltips within <a> tags
    $('.tooltip-test').tooltip({html : true});

    //************ sparkline graphs example (incons with graph in it)
    $('.inlinebar').sparkline('html', {type: 'bar', barColor: 'white', height: '50', barWidth: '10%'} );
    
    //************ close blocks in the sidenav
    $('.sidenav-stuff').find('.icon-remove').on('click',function(){
        $('.sidenav-stuff').remove();
    });
    
    /* ************************************************************************ */
    /* ************************************************************************ */
    /* ************************ START charts examples */
    
    //************ example: big CHART (in dashboard's "Big Graph Example") */
    $("#exampleChart").css({"width":"100%","height":"300px" });
    
    var data = [
        {label: 'foo', color:'rgb(184,214,230)', data: [[1,300], [2,Math.floor(Math.random() * 200)], [3,300], [4,300], [5,Math.floor(Math.random() * 300)]]},
        {label: 'baz', color:'rgb(233,233,233)', data: [[1,Math.floor(Math.random() * 600)], [2,200], [3,300], [4,Math.floor(Math.random() * 400)], [5,500]]},
    ];

    var plot = $.plot("#exampleChart", data, {
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        grid: { show: 1,
                color: "rgb(210, 210, 210)",
                tickColor: "rgba(220, 220, 220, 1)",
                backgroundColor: "rgb(255,255,255)",
                hoverable: true,
                clickable: true
              }
    });

    function showTooltip(x, y, contents) {
        $("<div id='tooltip'>" + contents + "</div>").css({
            position: "absolute",
            display: "none",
            top: y + 5,
            left: x + 5,
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }

    var previousPoint = null;
    $("#exampleChart").bind("plothover", function (event, pos, item) {

        if ($("#enablePosition:checked").length > 0) {
            var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
            $("#hoverdata").text(str);
        }

        if ($("#enableTooltip:checked").length > 0) {
            if (item) {
                if (previousPoint != item.dataIndex) {

                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY,
                        item.series.label + " of " + x + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;            
            }
        }
    });

    $("#exampleChart").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
            plot.highlight(item.series, item.datapoint);
        }
    });
    
    
    
    //************ example: small pie CHART (in dashboard's top boxes) */
    var data = [],
    series = Math.floor(Math.random() * 6) + 3;

    for (var i = 0; i < 3; i++) {
        data[i] = {
            label: "Serie #" + (i + 1),
            data: Math.floor(Math.random() * 100) + 1
        }
    }
    $("#examplePie").css({"width":"100%","height":"70px" });
    var placeholder = $("#examplePie");
    placeholder.unbind();

    $("#title").text("Interactivity");
    $("#description").text("The pie can be made interactive with hover and click events.");

    $.plot(placeholder, data, {
        series: {
            pie: { 
                show: true
            }
        },
        grid: {
            hoverable: true,
            clickable: true
        }
    });
    placeholder.bind("plothover", function(event, pos, obj) {
        if (!obj) { return; }
        var percent = parseFloat(obj.series.percent).toFixed(2);
        $("#hover").html("<span style='font-weight:bold; color:" + obj.series.color + "'>" + obj.series.label + " (" + percent + "%)</span>");
    });
    placeholder.bind("plotclick", function(event, pos, obj) {
        if (!obj) {
            return;
        }
        percent = parseFloat(obj.series.percent).toFixed(2);
        
        $('#chartsModal .modal-body').html("<p><h4>"  + obj.series.label + "</h4> <h2>" + percent + "%</h1></p>");
        $('#chartsModal').modal('toggle');
    });
    
    
    
    //************ example small stacking CHART (in dashboard's top boxes) */
    $("#exampleStacking").css({"width":"100%","height":"70px" });
    var placeholder = $("#exampleStacking");
    placeholder.unbind();
    var data = [];
    data = [
        {label: 'foo', color:'rgb(184,214,230)', data: [[1,300], [2,Math.floor(Math.random() * 200)], [3,300], [4,300], [5,Math.floor(Math.random() * 300)]]},
        {label: 'baz', color:'rgb(233,233,233)', data: [[1,Math.floor(Math.random() * 600)], [2,200], [3,300], [4,Math.floor(Math.random() * 400)], [5,500]]},
        {label: 'bar', color:'rgb(197,224,238)', data: [[1,500], [2,600], [3,400], [4,Math.floor(Math.random() * 300)], [5,0]]},
    ];
    $.plot(placeholder, data, {
        series: {
            stack: 1,
            bars: {
                show: true,
                barWidth: 0.4,
                fill:1
            },
            highlightColor: 'white'
        },
        grid: { show: false,
                color: "rgb(255, 255, 255, 1)",
                tickColor: "rgba(255, 255, 255, 1)",
                backgroundColor: "rgb(255, 255, 255)",
                hoverable: true,
                clickable: true
              }
    });
    placeholder.bind("plotclick", function(event, pos, obj) {
        if (!obj) {
            return;
        }
        $('#chartsModal .modal-body').html("<p><h2>You clicked: graph with bars!</h1> (and you have the clicked Object here.)<p>");
        $('#chartsModal').modal('toggle');
    });
    
    
    /* ************************ END charts examples */
    /* ************************************************************************ */
    /* ************************************************************************ */
    
    
    //************ demo tables
    $('#demoProducts').dataTable();
    $('#demoUsers').dataTable();
    
    //************ demo close box click
    $('.close_box').on('click', function(ev){
        ev.preventDefault();
        alert('Here you could close this box and rearrange the one next to it.');
    });

    //************ demo of knobs (counter with round progressbar)
    $(".dial").knob();
    
    
    //************ example forms
    $('#userForm').validate();
    $('#productForm').validate();

    //************ INK File Picker init
    $('filePicker').on('click',function(){
        filepicker.pick(function(InkBlob){
          console.log(InkBlob.url);
        })
    });
    
});

