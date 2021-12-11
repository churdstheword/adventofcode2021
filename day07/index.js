'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        let swarm = this.lines[0].split(',');
        let sorted = swarm.sort((a, b) => Number(a) - Number(b));
        let smallestCost = Infinity;
        for (let n of sorted) {
            let cost = 0;
            for (let p of swarm) {
                cost += Math.abs(p - n);
            }
            if (cost < smallestCost) {
                smallestCost = cost;
            }
        }
        return smallestCost;
    }

    solvePartTwo() {
        let swarm = this.lines[0].split(',');
        let sorted = swarm.sort((a, b) => Number(a) - Number(b));
        let smallestCost = Infinity;
        for (let n of sorted) {
            let cost = 0;
            for (let p of swarm) {
                let d = Math.abs(p - n);
                for (let c = 0; c <= d; c++) {
                    cost += c
                }
            }
            if (cost < smallestCost) {
                smallestCost = cost;
            }
        }
        return smallestCost;
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
