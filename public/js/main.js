var addthis_share = {url:"http://www.johndoe.com"}
$(document).ready(function () {

	picker = $.farbtastic("#colorpicker", function(e) {
    var rgb  = hexToRgb(e);
    grey = (rgb.r + rgb.g + rgb.b)/3;
    if(grey > 80){
      grey = 225;
    }else{
      grey = 0;
    }

    $('body').css({color: 'rgb(' + (225 - grey) + ', ' + (225 - grey) + ', ' + (225 - grey) + ')'});
    $('body').css({backgroundColor:e}).val(e);
    $('#hex span').text(e);
    $('#r').text(rgb.r);
    $('#g').text(rgb.g);
    $('#b').text(rgb.b);

    var link = 'http://clr.yt/' + e;
    $('#url a').text(link).attr('href', link);
    window.location.hash = e;

	})

  picker.setColor($('body').data('color'));
});

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}
