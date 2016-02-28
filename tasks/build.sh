#!/usr/bin/env bash

out_dir=dist
header_end_line=124
footer_start_line=125
html_length=154
html_file=index.html
script=index.js
source_map=index.map.js

if [ ! -e $out_dir ]
then
	mkdir $out_dir
else
	rm -rf $out_dir/*
fi

cp $html_file $out_dir
uglifyjs $script --compress --screw-ie8 --source-map $out_dir/$source_map --source-map-url $source_map --source-map-root $script > $out_dir/index.min.js

# Can't use sed as curly braces are metacharacters :(
echo "Minified to $out_dir/index.min.js, but going to inject into $html_file..."
head --lines $header_end_line $html_file > $out_dir/$html_file
cat $out_dir/index.min.js >> $out_dir/$html_file

footer_lines=$(expr $html_length - $footer_start_line)
tail --lines $footer_lines $html_file >> $out_dir/$html_file
echo "Done!"