class App < Sinatra::Base

  get '/' do
    @color = '#eeede3'
    erb :index
  end

end
