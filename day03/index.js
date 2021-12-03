'use strict';

import fs from "fs";
import path from "path";
import readline from "readline";

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    calculateGammaRate(report) {
        let sum = 0;
        for (const [index, value] of report.reverse().entries()) {
            let digit = (value <= 0) ? 0 : 1;
            sum += digit * Math.pow(2, index);
        }
        return sum
    }

    calculateEpsilonRate(report) {
        let sum = 0;
        for (const [index, value] of report.reverse().entries()) {
            let digit = (value <= 0) ? 1 : 0;
            sum += digit * Math.pow(2, index);
        }
        return sum
    }

    solvePartOne() {
        const report = Array(this.lines[0].length).fill(0);
        for (const line of this.lines) {
            line.split('').map((el, i) => {
                report[i] += (Number(el) == 0) ? -1 : 1;
            });
        }
        return this.calculateGammaRate([...report]) * this.calculateEpsilonRate([...report]);
    }

    solvePartTwo() {
        return null;
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
