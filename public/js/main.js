$(document).ready(function () {
	picker = $.farbtastic("#colorpicker", function(e) {
    var rgb  = hexToRgb(e);
    grey = (rgb.r + rgb.g + rgb.b)/3;
    if(grey > 80){
      grey = 255;
    }else{
      grey = 0;
    }
    $('.color-code').css({color: 'rgb(' + (255 - grey) + ', ' + (255 - grey) + ', ' + (255 - grey) + ')'});

    $('body').css({backgroundColor:e}).val(e);
    $('#hex span').text(e);
    $('#r').text(rgb.r);
    $('#g').text(rgb.g);
    $('#b').text(rgb.b);
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
