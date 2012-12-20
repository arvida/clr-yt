(function($) {

  var Clryt = (function(){
    function Clryt(element, initColor, initComplimentaryColors){
      this.rgbCache = {};
      this.hexColorRegexp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
      this.darkTextColor = '#414141';
      this.darkLinkColor = '#333';
      this.lightTextColor = '#fefefe';
      this.lightLinkColor = '#eee';

      this.element = $(element);
      this.colorCode = this.rgb(initColor) || this.rgb('#2c2c2c');
      window.colorTarget = $('body');

      window.colorTarget.data('hexLabel', this.element.find('#main-color-codes .hex'));
      window.colorTarget.data('rgbLabel', this.element.find('#main-color-codes .rgb'));

      this.linkElement = this.element.find('#url a');
      this.titleElement = $('title');
      this.addComplimentaryColorButton = this.element.find('#add-complimentary-color');
      this.addComplimentaryColorsContainer = this.element.find('#complimentary-colors');

      this.setupListeners();
      this.hideButtonsForMobile();

      this.picker.setColor(this.colorCode.toHex());
      if(typeof(initComplimentaryColors) != 'undefined'){
        for (var i=0; i<initComplimentaryColors.length; i++) {
          this.addComplimentaryColor(this.rgb(initComplimentaryColors[i]));
        }
      }
      this.adjustUIColors();
      this.updateColorInfo();

      window.colorTarget.addClass('current');
    }

    Clryt.prototype.setupListeners = function(){
      var self = this;
      this.picker = $.farbtastic("#colorpicker",
        function(e) {
          self.colorCode = self.rgb(e.trim());
          window.colorTarget.data('color-code', self.colorCode);

          self.adjustUIColors();
          self.updateColorInfo();
        },
        function(e) {
          self.lazyUpdates()
        }
      );

      self.addComplimentaryColorButton.click(function(e){
        cc = new ComplimentColor; // Move this
        var color = cc.fromRGB(self.colorCode);

        switch(Math.floor(Math.random()*3))
        {
          case 0:
            color.r = Math.floor(Math.random()*255);
            break;
          case 1:
            color.g = Math.floor(Math.random()*255);
            break;
          default:
            color.b = Math.floor(Math.random()*255);
        }

        var newColorElement = self.addComplimentaryColor(color);

        window.colorTarget.parents('.current').removeClass('current');
        $('body').removeClass('current');

        newColorElement.addClass('current');
        window.colorTarget = newColorElement.find('.color');

        self.picker.setColor(color.toHex());

        self.adjustUIColors(true);
        self.updateColorInfo();
        self.lazyUpdates()

        e.stopPropagation();
      });

      $('body').click(function(e){
        window.colorTarget.parents('.current').removeClass('current');
        $('body').removeClass('current');

        if($(e.target).hasClass('color')){
          window.colorTarget = $(e.target);
        }else{
          window.colorTarget = $(this);
        }

        self.picker.setColor(window.colorTarget.data('color-code').toHex());

        if(window.colorTarget.prop("tagName") == 'BODY'){
          window.colorTarget.addClass('current');
        }else{
          window.colorTarget.parent().addClass('current');
        }

        e.stopPropagation();
      });

      $('#complimentary-colors').on('click', 'a', function(e){
        $(this).closest('.ball').remove();

        window.colorTarget = $('body');

        self.addComplimentaryColorButton.show();

        self.updateColorInfo();
        self.lazyUpdates()

        e.preventDefault();
      });

      $('.row').on('click', 'input', function(e){
        var $element = $(this);

        $element.focus();
        $element.select();

        e.preventDefault();
      });

      $('#open-share').click(function(e){
        var url = $('meta[property="og:url"]').attr('content');
        var title = $('title').text();

        $(this).hide();
        $('#share').show()

        $('#share .url').text(url).attr('href', url);
        $('#share .url-image').attr('href', url+'.png');

        if(typeof(twttr) != 'undefined' && twttr.widgets){
          $('#tweetBtn iframe').remove();
          var tweetBtn = $('<a></a>')
            .addClass('twitter-share-button')
            .attr('href', 'http://twitter.com/share')
            .attr('data-url', url)
            .attr('data-text', title);
          $('#tweetBtn').append(tweetBtn);
          twttr.widgets.load();
        }

        var iframe = $("#fbBtn iframe");
        if(iframe[0]){
          iframe[0].src = iframe[0].src.replace(/&href=(.*?)&/, "&href=" + encodeURIComponent(url) +"&");
        }

        e.preventDefault();
      });

      $('#close-share').click(function(e){
        $('#open-share').show();
        $('#share').hide()
        e.preventDefault();
      });
      $('#share').click(function(e){
        if($(e.target).attr('id') == 'share'){
          $('#open-share').show();
          $('#share').hide()
          e.stopPropagation();
        }
      });
    }

    Clryt.prototype.addComplimentaryColor = function(color){
      var hexValue = color.toHex();
      var rgbValue = color.toString();
      var containerElement = $('<div class="ball"><div class="codes">'+
          '<input class="hex" spellcheck="false" readonly="readonly" value="'+hexValue+ '">'+
          '<input class="rgb" spellcheck="false" readonly="readonly" value="'+rgbValue+'">'+
          '<a href="#" class="delete">delete</a></div></div>');
      var color_element = $('<div></div>');

      color_element.addClass('color')
      color_element.css({backgroundColor: rgbValue});
      color_element.data('color-code', color);

      color_element.data('rgbLabel', containerElement.find('.rgb'));
      color_element.data('hexLabel', containerElement.find('.hex'));

      containerElement.prepend(color_element);

      this.addComplimentaryColorsContainer.append(containerElement);

      if($('.ball').length == 3){
        this.addComplimentaryColorButton.hide();
      }

      return containerElement;
    }

    Clryt.prototype.adjustUIColors = function (force) {
      if(window.colorTarget.prop("tagName") == 'BODY' || force != undefined){
        if(this.lightMainColor()){
          $('.container, footer, input').css({color: this.darkTextColor});
          $('.container a, footer a').css({color: this.darkLinkColor});
          $('body').removeClass('dark');
          $('body').addClass('light');
        }else{
          $('.container, footer, input').css({color: this.lightTextColor});
          $('.container a, footer a').css({color: this.lightLinkColor});
          $('body').addClass('dark');
          $('body').removeClass('light');
        }
      }

      window.colorTarget.css({backgroundColor: this.colorCode});
    }

    Clryt.prototype.lightMainColor = function () {
      var rgb = $('body').data('color-code');
      var grey = (rgb.r + rgb.g + rgb.b)/3;

      if(grey > 110){
        return true;
      }else{
        return false;
      }
    }

    Clryt.prototype.updateColorInfo = function() {
      var rgbValue = colorTarget.data('color-code').toString();
      var hexValue = window.colorTarget.data('color-code').toHex();

      window.colorTarget.data('hexLabel').val(hexValue);
      window.colorTarget.data('rgbLabel').val(rgbValue);
    }

    Clryt.prototype.lazyUpdates = function(){
      var mainColorCode = $('body').data('color-code');
      var urlParts = [mainColorCode.toHex().slice(1)]
      $('#complimentary-colors div.color').each(function(index, el){
        var element = $(el);
        urlParts.push(element.data('color-code').toHex().slice(1));
      });

      var link = 'http://clr.yt/' + urlParts.join('-');

      var title = 'Clr.yt ♥ #'+urlParts.join(' #')
      var rgbValue = window.colorTarget.data('color-code').toString();
      var hexValue = window.colorTarget.data('color-code').toHex();

      $('title').text(title);
      $('meta[property="og:url"]').attr('content', link);
      $('meta[property="og:image"]').attr('content', link+'.png');
      $('meta[name="twitter:url"]').attr('content', link);
      $('meta[name="twitter:image"]').attr('content', link+'.png');
      $('meta[name="twitter:description"]').attr('content', 'Color palette with #'+urlParts.join(' #'));

      var newUrl = '/'+urlParts.join('-');
      if(window.location.pathname != newUrl){
        window.history.pushState(null, title, newUrl);

      }
    }

    Clryt.prototype.rgb = function(hex) {
      var hexCode = typeof hex !== 'undefined' ? hex : this.colorCode;

      if(!this.rgbCache[hexCode]){
        var match = this.hexColorRegexp.exec(hexCode);
        this.rgbCache[hexCode] = match ? new RGBColor(
          parseInt(match[1], 16),
          parseInt(match[2], 16),
          parseInt(match[3], 16)
        ) : null;
      }

      return this.rgbCache[hexCode];
    }

    Clryt.prototype.hideButtonsForMobile = function(){
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        this.element.find('#buttons').hide();
      }
    }

    return Clryt;
  })();

  var RGBColor = (function() {

    function RGBColor(r, g, b) {
      this.r = r || 255;
      this.g = g || 255;
      this.b = b || 255;
    }

    RGBColor.prototype.toString = function(){

      return 'rgb('+[this.r, this.g, this.b].join(', ')+')';
    }

    RGBColor.prototype.toHex = function(){
      return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    }

    return RGBColor;
  })();

  // From StackOverflow: http://stackoverflow.com/questions/1664140/js-function-to-calculate-complementary-colour
  //
  // temprgb=thisrgb;
  // temphsv=RGB2HSV(temprgb);
  // temphsv.hue=HueShift(temphsv.hue,180.0);
  // temprgb=HSV2RGB(temphsv);
  var ComplimentColor = (function(){
    function ComplimentColor() {}

    ComplimentColor.prototype.fromRGB = function(rgb) {
      var hsv = this.RGB2HSV(rgb);
      hsv.hue = this.HueShift(hsv.hue, 180.0);

      return this.HSV2RGB(hsv);
    }

    ComplimentColor.prototype.RGB2HSV = function(rgb) {
      hsv = new Object();

      max=this.max3(rgb.r,rgb.g,rgb.b);
      dif=max-this.min3(rgb.r,rgb.g,rgb.b);
      hsv.saturation=(max==0.0)?0:(100*dif/max);
      if (hsv.saturation==0) hsv.hue=0;
      else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
      else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
      else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
      if (hsv.hue<0.0) hsv.hue+=360.0;
      hsv.value=Math.round(max*100/255);
      hsv.hue=Math.round(hsv.hue);
      hsv.saturation=Math.round(hsv.saturation);

      return hsv;
    }

    // RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
    // which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
    ComplimentColor.prototype.HSV2RGB = function(hsv) {
      var rgb=new RGBColor();
      if (hsv.saturation==0) {
        rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
      } else {
        hsv.hue/=60;
        hsv.saturation/=100;
        hsv.value/=100;
        i=Math.floor(hsv.hue);
        f=hsv.hue-i;
        p=hsv.value*(1-hsv.saturation);
        q=hsv.value*(1-hsv.saturation*f);
        t=hsv.value*(1-hsv.saturation*(1-f));
        switch(i) {
          case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
          case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
          case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
          case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
          case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
          default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
        }
        rgb.r=Math.round(rgb.r*255);
        rgb.g=Math.round(rgb.g*255);
        rgb.b=Math.round(rgb.b*255);
      }
      return rgb;
    }

    ComplimentColor.prototype.HueShift = function(h, s) {
      h+=s;

      while (h>=360.0) h-=360.0;
      while (h<0.0) h+=360.0;

      return h;
    }

    ComplimentColor.prototype.min3 = function(a, b, c){
      return (a<b)?((a<c)?a:c):((b<c)?b:c);
    }

    ComplimentColor.prototype.max3 = function(a, b, c){
      return (a>b)?((a>c)?a:c):((b>c)?b:c);
    }

    return ComplimentColor;
  })();

  $(document).ready(function () {
    var initColors = String($('body').data('init-colors')).split('-');
    new Clryt('#main', initColors.shift(), initColors);
  });
}(jQuery));
