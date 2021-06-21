#!/bin/bash

export tmp_dir=$(mktemp -d)
echo "dir: $tmp_dir"
cd /Users/luke/Library/Application\ Support/japanese-accent/data/
tar -zcf "$tmp_dir/data.tar" .

checksum=$(md5 "$tmp_dir/data.tar")

gsutil cp "$tmp_dir/data.tar" "gs://frokat-japanese-accent/$checksum/data.tar"