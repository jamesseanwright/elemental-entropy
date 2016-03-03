#!/usr/bin/env bash

out_dir=dist
header_end_line=124
footer_start_line=125
html_length=154
html_file=index.html
script=index.pre-min.js
min_script=index.min.js
regpack_script=index.regpack.js

if [ ! -e $out_dir ]
then
	mkdir $out_dir
else
	rm -rf $out_dir/*
fi

cp $html_file $out_dir

echo "Minifying with Closure Compiler..."
closure-compiler --js $script --js_output_file $out_dir/$min_script --compilation_level ADVANCED_OPTIMIZATIONS --externs "externs.js" --warning_level QUIET --language_in ECMASCRIPT5 --language_out ECMASCRIPT5

echo "TODO: automate RegPack..."


# Can't use sed as curly braces are metacharacters :(
echo "Injecting into $html_file..."
head --lines $header_end_line $html_file > $out_dir/$html_file
cat $out_dir/index.min.js >> $out_dir/$html_file

footer_lines=$(expr $html_length - $footer_start_line)
tail --lines $footer_lines $html_file >> $out_dir/$html_file
echo "Done!"