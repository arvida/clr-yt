class App < Sinatra::Base

  get %r{(?<color>\w{6}|)$} do
    @color = '#' + (params['color'].empty? ? 'eeede3' : params['color'])
    erb :index
  end

end
