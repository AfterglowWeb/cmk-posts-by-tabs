#!/bin/bash

PLUGIN_DIR="."
OUTPUT_ZIP="posts-by-tabs.zip"
rm -f $OUTPUT_ZIP
zip -r $OUTPUT_ZIP $PLUGIN_DIR -x "*/node_modules/*" -x "node_modules/*" -x "*/.git/*" -x ".git/*"

echo "Plugin zipped successfully as $OUTPUT_ZIP, excluding node_modules."