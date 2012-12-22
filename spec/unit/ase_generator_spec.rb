require "minitest/autorun"

require_relative '../../lib/ase_generator'

describe 'ASEGenerator', 'Generates ASE files from colors in hex format' do
  let(:ase_file_body) {
    "415345460001000000000004c0010000001000070043006c0072002e007900740000000100000024000800230032003600420035004400310000524742203e1898993f35b5b63f51d1d20000000100000024000800230035003500340035003400340000524742203eaaaaab3e8a8a8b3e8888890000c00200000000"
  }

  it 'generates a ASE file' do
    generator = ASEGenerator.new(palette_name: 'Clr.yt', colors: ['26B5D1', '554544'])
    body_as_string = generator.body.unpack('H*')[0]

    body_as_string.must_equal ase_file_body
  end

  describe '#valid?' do

    it 'returns false on invalid options' do
      generator = ASEGenerator.new(palette_name: 'Clr.yt', colors: ['xx'])

      generator.valid?.must_equal false
    end

    it 'returns true on valid options' do
      generator = ASEGenerator.new(palette_name: 'Clr.yt', colors: ['ffffff'])

      generator.valid?.must_equal true
    end
  end
end
