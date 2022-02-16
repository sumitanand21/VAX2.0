#!/bin/bash

file_list=$(ls dist/ | grep ".js")

css_file=$(ls dist/ | grep ".css")

woff_file=$(ls dist/ | grep ".woff")

woff2_file=$(ls dist/ | grep ".woff2")

ttf_file=$(ls dist/ | grep ".ttf")

eot_file=$(ls dist/ | grep ".eot")

module=()
nomodule=()
script=

cp dist/$css_file ../apps/vax/static/

for file in $woff_file
do
    cp dist/$file ../apps/vax/static/
done

for file in $woff2_file
do
    cp dist/$file ../apps/vax/static/
done

for file in $ttf_file
do
    cp dist/$file ../apps/vax/static/
done

for file in $eot_file
do
    cp dist/$file ../apps/vax/static/
done

for file in $file_list
do
    cp dist/$file ../apps/vax/static/
done

for file in $file_list
do
    if [[ "$file" != *"-"* ]]; then
        script="$file"
    elif [[ "${module[*]}" != *"$match"* ]]; then
        match=$(echo "$file" | cut -f1 -d'-')
        module="$module $file"
    else
        match=$(echo "$file" | cut -f1 -d'-')
        nomodule="$nomodule $file"
    fi
done

sed -i "s/styles\..*\.css/$css_file/g" ../apps/vax/templates/container/index.html

sed -i "s/scripts.*\x27/$script\x27/g" ../apps/vax/templates/container/index.html

for mod in $module
do
    match=$(echo "$mod" | cut -f1 -d'-')
    sed -i "s/$match-.*\" type/$mod\x27 %}\" type/g" ../apps/vax/templates/container/index.html
done

for nomod in $nomodule
do
    match=$(echo "$nomod" | cut -f1 -d'-')
    sed -i "s/$match-.*\" nomodule/$nomod\x27 %}\" nomodule/g" ../apps/vax/templates/container/index.html
done
