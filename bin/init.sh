#! /bin/bash

PROJECT_DIR=${PWD}
for DAY in {1..25}; do

    # Add padding to day string, if necessary
    DAY_LABEL=$DAY
    if [[ $DAY -lt 10 ]]; then
        DAY_LABEL="0${DAY}"
    fi
    
    # Setup the directory for the challenge
    DAY_DIR="${PROJECT_DIR}/day${DAY_LABEL}"
    mkdir -p $DAY_DIR
    
    # Create the files for the challenge
    touch $DAY_DIR/input.txt
    cat /dev/null > $DAY_DIR/input.txt

    touch $DAY_DIR/index.js
    cat /dev/null > $DAY_DIR/index.js

    # Lets create an README file
    touch $DAY_DIR/README.md
    echo "# DAY ${DAY}" > $DAY_DIR/README.md
    echo "" >> $DAY_DIR/README.md
    echo "[https://adventofcode.com/2021/day/${DAY}](https://adventofcode.com/2021/day/${DAY})" >> $DAY_DIR/README.md
        
    # Lets get the package.json ball rolling!
    touch $DAY_DIR/package.json
    echo "{" > $DAY_DIR/package.json
    echo "    \"name\": \"@churdstheword/aoc2021day${DAY}\"," >> $DAY_DIR/package.json
    echo "    \"version\": \"1.0.0\"," >> $DAY_DIR/package.json
    echo "    \"description\": \"\"," >> $DAY_DIR/package.json
    echo "    \"main\": \"index.js\"," >> $DAY_DIR/package.json
    echo "    \"keywords\": []," >> $DAY_DIR/package.json
    echo "    \"author\": \"\"," >> $DAY_DIR/package.json
    echo "    \"license\": \"ISC\"" >> $DAY_DIR/package.json
    echo "}" >> $DAY_DIR/package.json
    
    # Run NPM init
    cd $DAY_DIR && npm install && cd $PROJECT_DIR
    
done
