class App < Sinatra::Base
  set :assets, Sprockets::Environment.new(root)

  configure do
    assets.append_path File.join(root, 'assets', 'stylesheets')
    assets.append_path File.join(root, 'assets', 'javascripts')

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
  end

  get '/' do
    erb :index
  end

end
