#!/usr/bin/env bash

script=index.pre-min.js
out_script=index.pre-crush.js
regpack_script=index.regpack.js

echo "Minifying with Closure Compiler..."
closure-compiler --js $script --js_output_file $out_script --compilation_level ADVANCED_OPTIMIZATIONS --externs "externs.js" --warning_level QUIET --language_in ECMASCRIPT5 --language_out ECMASCRIPT5
echo "Done!"