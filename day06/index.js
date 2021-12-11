
import fs from "fs";
import path from "path";
import readline from "readline";

class Solution {

    constructor(lines) {
        this.lines = lines;
        this.cache = {}
    }

    simulate(days, offset, total = 0) {

        let d = days - (offset + 1);

        if (d >= 0) {

            // Continue with the next cycle
            let key = `d${d}o6`;
            if (!this.cache[key]) {
                this.cache[key] = this.simulate(d, 6);
            }
            total += this.cache[key];

            // Begin a new cycle for the offspring
            let key2 = `d${d}o8`;
            if (!this.cache[key2]) {
                this.cache[key2] = this.simulate(d, 8);
            }
            total += this.cache[key2] + 1;

        }

        return total;
    }


    solvePartOne() {
        let total = 0;
        this.cache = {};
        let school = this.lines[0].split(',');
        for (const fish of school) {
            total += this.simulate(80, Number(fish), 1)
        }
        return total;
    }

    solvePartTwo() {
        let total = 0;
        this.cache = {};
        let school = this.lines[0].split(',');
        for (const fish of school) {
            total += this.simulate(256, Number(fish), 1)
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
