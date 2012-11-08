require 'bundler/setup'
Bundler.require(:default)

$: << '.'

require 'app'

map '/assets' do
  run App.assets
end

run App
