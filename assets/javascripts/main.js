(function($) {
  var Clryt = (function(){
    function Clryt(element, initColor){
      this.element = $(element);
      this.colorCode = initColor;

      this.linkElement = this.element.find('#url a');
      this.hexElement = this.element.find('#hex span');
      this.rgbElement = this.element.find('#rgb span');

      this.rgbCache = {};
      this.hexColorRegexp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
      this.darkTextColor = '#414141';
      this.darkLinkColor = '#333';
      this.lightTextColor = '#eee';
      this.lightLinkColor = '#ccc';

      this.setupClipboard();
      this.setupListeners();

      this.picker.setColor(this.colorCode);
      this.hideButtonsForMobile();
    }

    Clryt.prototype.setupClipboard = function(){
      ZeroClipboard.setMoviePath('/ZeroClipboard.swf');

      this.clipboard_hex = new ZeroClipboard.Client();
      this.clipboard_rgb = new ZeroClipboard.Client();

      this.clipboard_hex.glue('copy-hex', 'buttons');
      this.clipboard_rgb.glue('copy-rgb', 'buttons');
    }

    Clryt.prototype.setupListeners = function(){
      var self = this;
      this.picker = $.farbtastic("#colorpicker", function(e) {
        self.colorCode = e.trim();

        self.adjustUIColors();
        self.updateColorInfo();

        self.clipboard_hex.setText(self.colorCode);
        self.clipboard_rgb.setText(self.rgb().join(', '));

        window.location.hash = '';
      });

      if(Modernizr.hashchange){
        window.onhashchange = function(){
          if(self.hexColorRegexp.exec(window.location.hash)){
            self.picker.setColor(window.location.hash);
          }
        }
      }
    }

    Clryt.prototype.adjustUIColors = function () {
      var grey = (this.rgb()[0] + this.rgb()[1] + this.rgb()[2])/3;

      if(grey > 110){
        $('body').css({color: this.darkTextColor});
        $('a').css({color: this.darkLinkColor});
      }else{
        $('body').css({color: this.lightTextColor});
        $('a').css({color: this.lightLinkColor});
      }

      $('body').css({backgroundColor: this.colorCode});
    }

    Clryt.prototype.updateColorInfo = function() {
      this.hexElement.text(this.colorCode);
      this.rgbElement.text(this.rgb().join(', '));

      var link = 'http://clr.yt/' + this.colorCode
      this.linkElement.text(link).attr('href', link);
    }

    Clryt.prototype.rgb = function() {
      if(!this.rgbCache[this.colorCode]){
        var match = this.hexColorRegexp.exec(this.colorCode);
        this.rgbCache[this.colorCode] = match ? [
          parseInt(match[1], 16),
          parseInt(match[2], 16),
          parseInt(match[3], 16)
        ] : null;
      }

      return this.rgbCache[this.colorCode];
    }

    Clryt.prototype.hideButtonsForMobile = function(){
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        this.element.find('#buttons').hide();
      }
    }

    return Clryt;
  })();

  $(document).ready(function () {
    new Clryt('#main', window.location.hash || '#eeede3');
  });
}(jQuery));
