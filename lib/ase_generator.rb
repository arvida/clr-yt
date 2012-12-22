class ASEGenerator
  attr_reader :palette_name, :colors

  def initialize options = {}
    @palette_name = options.fetch :palette_name, ''
    @colors = options.fetch :colors
  end

  def valid?
    return false if colors.count { |color| color.nil? || color.size != 6 } > 0

    true
  end

  def body
    [
      header,
      palette_start,
      colors_as_rgb,
      palette_end
    ].join
  end

  private

  def header
    [
      'ASEF',
      [1,0].pack('nn'),
      [colors.size + 2].pack('N') # total colors + palettes * 2
    ].join
  end

  def palette_start
    name = compatable_string palette_name

    [
      [0xC001].pack('n'),
      [(name.size)+4].pack('N'),
      [(name.size/2)+1].pack('n'),
      name,
      [ 0 ].pack("n")
    ].join
  end

  def colors_as_rgb
    result = []

    colors.each do |hex|
      name = "##{hex}"
      result << [ 1 ].pack("n")
      title = compatable_string(name) + [0].pack("n")
      buffer = [title.size/2].pack('n')
      buffer += title

      r, g, b = hex.scan(/../).map { |color| color.to_i(16)}

      r = r / 255.0
      g = g / 255.0
      b = b / 255.0

      buffer += "RGB ";
      buffer += [r].pack("f").reverse
      buffer += [g].pack("f").reverse
      buffer += [b].pack("f").reverse

      buffer += [0].pack("n")

      result << [buffer.size].pack("N")
      result << buffer
    end

    result.join
  end

  def palette_end
    [
      [0xC002].pack('n'),
      [ 0 ].pack("N")
    ].join
  end

  def compatable_string string
    string.encode!('UTF-16')[2..-1].force_encoding("ASCII-8BIT")
  end

end
