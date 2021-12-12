'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class SevenSegmentDisplay {

    constructor() {
        this.digits = {};
    }

    decode(signalPatterns) {

        let d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        let p1, p2, p3, p4, p5, p6, p7;

        const occurences = { 'a': 0, 'b': 0, 'c': 0, 'd': 0, 'e': 0, 'f': 0, 'g': 0 };

        // Parse out known values by segment length and calculate occurences
        for (const pattern of signalPatterns) {

            // We can determine some digits based on pattern length
            switch (pattern.length) {
                case 2:
                    d1 = this.getValue(pattern);
                    break;
                case 3:
                    d7 = this.getValue(pattern);
                    break;
                case 4:
                    d4 = this.getValue(pattern);
                    break;
                case 7:
                    d8 = this.getValue(pattern);
                    break;
            }

            // Track the occurences of each segment in each pattern
            for (const segment of pattern.split('')) {
                occurences[segment]++;
            }
        }

        // Determine which value has highest occurence
        let max = Object.values(occurences).sort((a, b) => Number(a) - Number(b)).at(-1);

        // Now, determine the most commonly occuring segment 
        let mostCommonSegment = '';
        for (const prop in occurences) {
            if (Number(occurences[prop]) == max) {
                mostCommonSegment = prop;
            }
        }

        // d2 will be the only pattern missing the most common segment
        for (const pattern of signalPatterns) {
            if (!pattern.includes(mostCommonSegment)) {
                d2 = this.getValue(pattern);
                p6 = this[mostCommonSegment];
            }
        }

        // Determine other values based on the knowledge we've gained so far
        p1 = d7 ^ d1;
        p2 = (d8 ^ d2) ^ p6;
        p3 = d1 ^ p6;
        d6 = (d8 ^ p3);
        p4 = (d4 ^ d1) ^ p2;
        d0 = d8 ^ p4;

        // d9 is the final only remaining length 6 pattern in the list
        for (const pattern of signalPatterns) {
            let value = this.getValue(pattern);
            if (pattern.length == 6 && value != d6 && value != d0) {
                d9 = value;
            }
        }

        // Now that we have the last piece of the puzzle, derive the final remaining values.
        p5 = d9 ^ d8;
        d3 = d8 ^ (p2 | p5);
        d5 = d8 ^ (p3 | p5);
        p7 = ((d8 ^ d4) ^ (d1 ^ d7)) ^ p5;


        // And we did it!
        this.digits = {
            'd0': d0, 'd1': d1, 'd2': d2, 'd3': d3, 'd4': d4,
            'd5': d5, 'd6': d6, 'd7': d7, 'd8': d8, 'd9': d9,
        };

    }

    getDisplayValue(signalPatterns) {
        let output = '';
        for (const pattern of signalPatterns) {
            const signalValue = this.getValue(pattern);
            for (const [key, digitValue] of Object.entries(this.digits)) {
                if (signalValue == digitValue) {
                    output += key.substring(1);
                    break;
                }
            }
        }
        return output;
    }

    getValue(pattern) {
        let value = 0;
        for (const segment of pattern) {
            value += this[segment]
        }
        return value;
    }

    getPattern(value) {
        let pattern = '';
        for (const segment of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
            if ((Number(value) & this[segment]) !== 0) {
                pattern += segment;
            }
        }
        return pattern;
    }

    get a() {
        return 1;
    }

    get b() {
        return 2;
    }

    get c() {
        return 4;
    }

    get d() {
        return 8;
    }

    get e() {
        return 16;
    }

    get f() {
        return 32;
    }

    get g() {
        return 64;
    }

}


class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {

        let count = 0;
        for (const line of this.lines) {
            const [input, output] = line.split(' | ');
            let digits = output.split(' ');
            for (let digit of digits) {
                switch (digit.length) {
                    case 2:
                    case 3:
                    case 4:
                    case 7:
                        count++;
                        break;
                    default:
                        break
                }
            }
        }

        return count;
    }

    solvePartTwo() {

        let total = 0;
        for (const line of this.lines) {

            const display = new SevenSegmentDisplay();
            const [input, output] = line.split(' | ');

            // Decode the input signals
            let signalInput = input.split(' ');
            display.decode(signalInput);

            // Get the display value of the output
            const signalOutput = output.split(' ');
            const displayValue = display.getDisplayValue(signalOutput);
            total += Number(displayValue);

        }

        return total;

    }

}

let lines = [];
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const readable = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
const fileReader = readline.createInterface({ input: readable, crlfDelay: Infinity })
for await (const line of fileReader) lines.push(line);

const solution = new Solution(lines);
console.log('Solution Part 1:', solution.solvePartOne());
console.log('Solution Part 2:', solution.solvePartTwo());
