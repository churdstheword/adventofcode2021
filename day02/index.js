'use strict';

import fs from "fs";
import path from "path";
import readline from "readline";

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        let horizontal = 0, vertical = 0, command, units;
        for (const line of this.lines) {
            [command, units] = line.split(' ');
            switch (command) {
                case 'forward':
                    horizontal += Number(units);
                    break;
                case 'up':
                    vertical -= Number(units);
                    break;
                case 'down':
                    vertical += Number(units);
                    break;
            }
        }
        return vertical * horizontal;
    }

    solvePartTwo() {
        let horizontal = 0, vertical = 0, aim = 0, command, units;
        for (const line of this.lines) {
            [command, units] = line.split(' ');
            switch (command) {
                case 'forward':
                    horizontal += Number(units);
                    vertical += aim * Number(units);
                    break;
                case 'up':
                    aim -= Number(units);
                    break;
                case 'down':
                    aim += Number(units);
                    break;
            }
        }
        return vertical * horizontal;
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
