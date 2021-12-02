'use strict';

import fs from "fs";
import path from "path";
import readline from "readline";

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        let count = 0;
        for (let i = 1; i < this.lines.length; i++) {
            if (this.lines[i] - this.lines[i - 1] > 0) {
                count++;
            }
        }
        return count;
    }

    solvePartTwo() {
        let count = 0;
        let prev = Number(this.lines[0]) + Number(this.lines[1]) + Number(this.lines[2]);     
        for (let i = 1; i < this.lines.length - 2; i++) {
            let curr = Number(this.lines[i]) + Number(this.lines[i + 1]) + Number(this.lines[i + 2]);
            if (curr - prev > 0) {
                count++;
            }
            prev = curr
        }
        return count;
    }

}

let lines = [];
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const readable = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
const fileReader = readline.createInterface({ input: readable, crlfDelay: Infinity })
for await (const line of fileReader) lines.push(line);

const solution = new Solution(lines);
console.log('Solution Part 1:', solution.solvePartOne())
console.log('Solution Part 2:', solution.solvePartTwo())
