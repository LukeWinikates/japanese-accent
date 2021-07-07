#!/bin/bash

export tmp_dir=$(mktemp -d)
echo "dir: $tmp_dir"
#cd /Users/luke/Library/Application\ Support/japanese-accent/data/
#tar -zcf "$tmp_dir/data.tar" .

#checksum=$(md5 "$tmp_dir/data.tar")

gsutil cp gs://frokat-japanese-accent/7023b28e10c80d472e92338af3351820/data.tar "$tmp_dir/data.tar"

cd "$tmp_dir"

tar -xvf "data.tar"

cp data.db /Users/luke/Library/Application\ Support/japanese-accent/data/