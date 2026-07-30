source "https://rubygems.org"

# This mirrors the GitHub Pages build environment so a local `bundle exec
# jekyll serve` matches what GitHub actually builds and publishes.
gem "github-pages", group: :jekyll_plugins

# Ruby 3.4+ no longer ships CSV as a default gem, while Jekyll 3 still
# requires it during startup.
gem "csv"
gem "bigdecimal"
gem "webrick"

# Windows and JRuby do not include zoneinfo files by default.
install_if -> { RUBY_PLATFORM =~ %r{mingw|mswin|java} } do
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows.
gem "wdm", "~> 0.1.1", install_if: Gem.win_platform?
