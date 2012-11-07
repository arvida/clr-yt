$(document).ready(function () {
  ZeroClipboard.setMoviePath( 'js/vendor/ZeroClipboard.swf' );
  var clip_hex = new ZeroClipboard.Client();
  var clip_rgb = new ZeroClipboard.Client();
  clip_hex.glue('copy-hex');
  clip_rgb.glue('copy-rgb');
  var init_color = window.location.hash;
  if(!init_color){ init_color = '#eeede3'; }
  $('body').data('color', init_color);

	picker = $.farbtastic("#colorpicker", function(e) {
    var rgb  = hexToRgb(e);
    grey = (rgb.r + rgb.g + rgb.b)/3;
    if(grey > 90){
      text_grey = 41;
      link_grey = 61;
    }else{
      text_grey = 225;
      link_grey = 180;
    }

    $('body').css({color: 'rgb(' + (text_grey) + ', ' + (text_grey) + ', ' + (text_grey) + ')'});
    $('a').css({color: 'rgb(' + (link_grey) + ', ' + (link_grey) + ', ' + (link_grey) + ')'});
    $('body').css({backgroundColor:e}).val(e);
    $('#hex span').text(e);
    $('#r').text(rgb.r);
    $('#g').text(rgb.g);
    $('#b').text(rgb.b);

    var link = 'http://clr.yt/' + e;
    $('#url a').text(link).attr('href', link);
    window.location.hash = e;

    clip_hex.setText($('#hex').text().trim());
    clip_rgb.setText(rgb.r+', '+rgb.g+', '+rgb.b);
	})

  picker.setColor($('body').data('color'));

  $('#copy-hex').click(function(){
    console.log($('#hex').text());
  });
  $('#copy-rgb').click(function(){
  });
});

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}
