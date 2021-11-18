#!/usr/bin/env nix-shell
#!nix-shell -i bash -p zip

name=$(basename $(pwd))
zip -r -FS ./$name.zip * \
    --exclude '*.zip' \
    --exclude '*.git*' \
    --exclude '*.sh' \
    --exclude 'README.md'
