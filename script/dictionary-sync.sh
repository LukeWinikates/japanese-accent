#! /bin/bash

## download the sqlite file from Wordnet?

pushd data || exit 1
curl -O http://compling.hss.ntu.edu.sg/wnja/data/1.1/wnjpn.db.gz
gunzip wnjpn.db.gz
rm wnjpn.db.gz
popd

echo "done"