'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class Polymerization {

    constructor(polymer, rules) {
        this.polymer = polymer;
        this.rules = rules;
    }

    polymerize(num) {

        let pairs = {};
        for (let i = 0; i < this.polymer.length - 1; i++) {
            let pair = this.polymer[i] + this.polymer[i + 1];
            pairs[pair] = pairs[pair] + 1 || 1;
        }

        let letters = {};
        for (const letter of this.polymer.split('')) {
            letters[letter] = letters[letter] + 1 || 1;
        }

        for (let i = 0; i < num; i++) {
            let updates = {};

            for (let [pair, qty] of Object.entries(pairs)) {
                const letter = this.rules[pair];
                updates[pair[0] + letter] = (updates[pair[0] + letter] + qty) || qty;
                updates[letter + pair[1]] = (updates[letter + pair[1]] + qty) || qty;
                letters[letter] = letters[letter] + qty || qty;
            }

            pairs = updates;
        }

        return (Math.max(...Object.values(letters)) - Math.min(...Object.values(letters)));

    }

}

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        const splitIndex = this.lines.indexOf('');
        const template = this.lines.slice(0, splitIndex)[0];
        const rules = Object.fromEntries(this.lines.slice(splitIndex + 1).map((value) => value.split(' -> ')));
        const manual = new Polymerization(template, rules);
        return manual.polymerize(10);
    }

    solvePartTwo() {
        const splitIndex = this.lines.indexOf('');
        const template = this.lines.slice(0, splitIndex)[0];
        const rules = Object.fromEntries(this.lines.slice(splitIndex + 1).map((value) => value.split(' -> ')));
        const manual = new Polymerization(template, rules);
        return manual.polymerize(40);
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
