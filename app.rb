class App < Sinatra::Base
  INIT_COLOR = '2c2c2c'

  set :assets, Sprockets::Environment.new(root)

  configure do
    assets.append_path File.join(root, 'assets', 'stylesheets')
    assets.append_path File.join(root, 'assets', 'javascripts')

    mime_type :png, 'image/png'

    Sprockets::Helpers.configure do |config|
      config.environment = assets
      config.prefix      = '/assets'
    end
  end

  configure :production do
    assets.css_compressor = YUI::CssCompressor.new
    assets.js_compressor  = Uglifier.new(mangle: true)

    Sprockets::Helpers.configure do |config|
      config.digest      = true
      config.asset_host  = ENV['ASSET_HOST']
    end
  end

  helpers do
    include Sprockets::Helpers

    def format_as_hex_values(colors)
      "##{colors.gsub('-',' #')}"
    end
  end

  get '/:colors.png' do
    colors = params[:colors].split('-')
    side = 400

    png = ChunkyPNG::Image.new side, side, ChunkyPNG::Color::TRANSPARENT

    if colors.size == 1
      png.rect -1,-1, side, side, ChunkyPNG::Color::TRANSPARENT, ChunkyPNG::Color.from_hex(colors.shift)
    else
      png.rect -1,-1, side, side/2, ChunkyPNG::Color::TRANSPARENT, ChunkyPNG::Color.from_hex(colors.shift)

      compliment_color_size = (side.to_f/colors.size).ceil

      colors.each_with_index do |hex, index|
        left = (index*compliment_color_size)-1
        png.rect left,side/2, left+compliment_color_size, side, ChunkyPNG::Color::TRANSPARENT, ChunkyPNG::Color.from_hex(hex)
      end
    end

    content_type :png
    response.write png.to_datastream
  end

  get '/?:colors?' do
    @colors = params[:colors] || INIT_COLOR
    erb :index
  end

end
