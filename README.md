# Elemental Extravaganza

My JS1K entry


## Tasks

### `./tasks/build.sh`

Runs [Closure Compiler](https://developers.google.com/closure/compiler/) (`closure-compiler` must be set on `$PATH`) against the index.js, which is then processed further with the incredible [RegPack](https://www.npmjs.com/package/regpack). with script and injects it into the index.html file that's copied to the configured output directory.