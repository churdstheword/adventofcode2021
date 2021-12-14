'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class OctoGrid {

    constructor(data) {
        this.data = data;
        this.flashed = [];
        this.flashing = [];
        this.flashers = 0;
    }

    raiseEnergyLevel(x, y) {
        if (y >= 0 && y < this.data.length && x >= 0 && x < this.data[0].length) {
            this.data[y][x]++;
        }
    }

    getEnergyLevel(x, y) {
        let value = -1;
        if (y >= 0 && y < this.data.length && x >= 0 && x < this.data[0].length) {
            value = this.data[y][x];
        }
        return value
    }

    resetEnergyLevel(x, y) {
        if (y >= 0 && y < this.data.length && x >= 0 && x < this.data[0].length) {
            this.data[y][x] = 0;
        }
    }

    step() {

        this.flashing = [];
        this.flashed = [];

        for (let row = 0; row < this.data.length; row++) {
            for (let col = 0; col < this.data[row].length; col++) {
                this.raiseEnergyLevel(col, row);
                if (this.getEnergyLevel(col, row) > 9) {
                    this.flashing.push([col, row]);
                }
            }
        }

        while (this.flashing.length > 0) {
            const point = this.flashing.pop();
            this.flash(point[0], point[1]);
        }

        for (let row = 0; row < this.data.length; row++) {
            for (let col = 0; col < this.data[row].length; col++) {
                if (this.getEnergyLevel(col, row) > 9) {
                    this.resetEnergyLevel(col, row);
                }
            }
        }

    }

    flash(x, y) {

        const adjacent = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1],
        ];

        for (const point of adjacent) {
            this.raiseEnergyLevel(point[0], point[1]);
            let value = this.getEnergyLevel(point[0], point[1]);
            if (value > 9 && !this.isFlashing(point[0], point[1]) && !this.hasFlashed(point[0], point[1])) {
                this.flashing.push(point);
            }
        }

        this.flashed.push([x, y]);
        this.flashers++;
    }

    isFlashing(x, y) {
        for (const point of this.flashing) {
            if (point[0] == x && point[1] == y) {
                return true;
            }
        }
        return false;
    }

    hasFlashed(x, y) {
        for (const point of this.flashed) {
            if (point[0] == x && point[1] == y) {
                return true;
            }
        }
        return false;
    };

    getFlashers() {
        return this.flashers;
    }

    toString() {
        const formatRow = (value) => "[ " + value.join(", ") + " ]";
        return this.data.map(formatRow).join("\n");
    }
}


class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {

        const data = [];
        for (const line of this.lines) {
            data.push(line.split('').map((value) => Number(value)));
        }

        const octo = new OctoGrid(data);
        for (let i = 0; i < 100; i++) {
            octo.step();
        }

        return octo.getFlashers();
    }

    solvePartTwo() {

        const data = [];
        for (const line of this.lines) {
            data.push(line.split('').map((value) => Number(value)));
        }

        const octo = new OctoGrid(data);

        let step = 0;
        let found = false;
        while (!found && ++step < 1000) {
            octo.step();
            if (octo.flashed.length == 100) {
                found = true
            }
        }

        return step;
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
