'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

let lines = [];
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const readable = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
const fileReader = readline.createInterface({ input: readable, crlfDelay: Infinity });
for await (const line of fileReader) lines.push(line);

class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(
            this.x + v.x,
            this.y + v.y
        )
    }
}

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    parseInput() {
        const pairs = lines[0].substring(13).split(', ');
        const [xMin, xMax] = pairs[0].substring(2).split('..').map((v) => parseInt(v));
        const [yMin, yMax] = pairs[1].substring(2).split('..').map((v) => parseInt(v));
        return [xMin, xMax, yMin, yMax];
    }

    solvePartOne() {
        const yMin = this.parseInput()[2];
        return (Math.abs(yMin) * (Math.abs(yMin) - 1) / 2);
    }

    solvePartTwo() {
        const [xMin, xMax, yMin, yMax] = this.parseInput();

        let hits = [];
        for (let x = 0; x <= Math.max(xMin, xMax); x++) {
            for (let y = Math.min(yMin, yMax); y < Math.abs(yMin); y++) {

                let position = new Vector(0, 0);
                let velocity = new Vector(x, y);

                let finished = false;
                while (!finished) {

                    // Update the position
                    position = position.add(velocity);

                    // Handle gravity and drag
                    let drag = new Vector((velocity.x > 0) ? -1 : (velocity < 0) ? 1 : 0, 0);
                    let gravity = new Vector(0, -1);

                    // Update the velocity
                    velocity = velocity.add(drag).add(gravity);

                    if (position.x >= xMin && position.x <= xMax && position.y >= yMin && position.y <= yMax) {
                        hits.push(`${x},${y}`);
                        finished = true;
                    }
                    else if (position.x > xMax || (position.y < yMin && velocity.y < 0)) {
                        finished = true;
                    }
                }
            }
        }

        return hits.length;
    }

}

const solution = new Solution(lines);
console.log('Solution Part 1:', solution.solvePartOne());
console.log('Solution Part 2:', solution.solvePartTwo());
