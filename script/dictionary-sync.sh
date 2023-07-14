#! /bin/bash

## download the sqlite file from Wordnet?

pushd tmp || exit 1
curl -LO https://github.com/bond-lab/wnja/releases/download/v1.1/wnjpn.db.gz
gunzip wnjpn.db.gz
rm wnjpn.db.gz
popd

echo "done"
