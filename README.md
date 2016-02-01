# Fire

My JS1K entry


## Tasks

### `./tasks/build.sh`

Runs UglifyJS against the index.js script and uses sed to inject it into the index.html file that's copied to the dist directory. Once built, it will be opened by the configured browser (defaulting to `chromium-browser`.)