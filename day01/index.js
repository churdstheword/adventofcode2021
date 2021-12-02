'use strict';

import fs from "fs";
import path from "path";

async function* fileLineIterator(readable) {
    let previous = '';
    for await (const chunk of readable) {
        previous += chunk;
        let lines = previous.split(/\r?\n/);
        while (lines.length > 1) {
            let line = String(lines.shift());
            if (line.length > 0) {
                yield line;
            }
        }
        previous = lines.join('');
    }
    if (previous.length > 0) {
        yield previous;
    }
}

const input = fs.createReadStream(path.resolve('input.txt'));
const reader = fileLineIterator(input);

for await (const line of reader) {
    console.log(line);
}
