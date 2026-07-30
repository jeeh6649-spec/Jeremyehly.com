# GitHub Pages 223 uses Liquid 4, which still calls Ruby's removed taint API.
# GitHub's build environment is unaffected; this keeps local Ruby 4 builds usable.
if RUBY_VERSION >= "4.0"
  class Object
    def tainted?
      false
    end

    def untaint
      self
    end
  end
end
