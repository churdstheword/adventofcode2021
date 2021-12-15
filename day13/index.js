'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class OrigamiPaper {

    constructor(dots) {
        this.dots = dots;
    }

    fold(axis, value) {

        let transform, rangeCheck;
        switch (axis) {
            case 'x':
                transform = (dot) => [Number(dot[0] + 2 * (value - dot[0])), Number(dot[1])];
                rangeCheck = (dot) => (dot[0] >= 0 && dot[0] < value);
                break;
            case 'y':
                transform = (dot) => [Number(dot[0]), Number(dot[1] + 2 * (value - dot[1]))];
                rangeCheck = (dot) => (dot[1] >= 0 && dot[1] < value);
                break;
            default:
                return;
        }

        const reflected = this.dots.map(transform);
        this.dots = [...reflected, ...this.dots].filter(rangeCheck);
    };

    countVisibleDots() {
        return Array.from(new Set(this.dots.map(JSON.stringify))).map(JSON.parse).length;
    }

    toString() {

        const maxX = Math.max(...this.dots.map((value) => value[0]));
        const maxY = Math.max(...this.dots.map((value) => value[1]));

        // Build an empty map
        const dotmap = new Array(maxY + 1);
        for (let i = 0; i < dotmap.length; i++) {
            dotmap[i] = new Array(maxX + 1).fill(0);
        }

        // Fill out the dotmap with our dot locations
        for (const dot of this.dots) {
            dotmap[dot[1]][dot[0]] = Number(dotmap[dot[1]][dot[0]]) + 1;
        }

        // For readability's sake, lets transform the dotmap into only dashes and hashes
        for (let i = 0; i < dotmap.length; i++) {
            for (let j = 0; j < dotmap[i].length; j++) {
                dotmap[i][j] = (dotmap[i][j] > 0) ? '#' : '-';
            }
        }

        // Stringify the dotmap for console output
        const formatValue = (value) => value.toString()
        const formatRow = (row) => "[ " + row.map(formatValue).join(", ") + " ]";
        return dotmap.map(formatRow).join("\n");
    }

}

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        const splitIndex = this.lines.indexOf('');
        const dots = this.lines.slice(0, splitIndex).map((value) => value.split(',').map((value) => Number(value)));
        const folds = this.lines.slice(splitIndex + 1).map((value) => value.split(' ')[2].split('='));

        const paper = new OrigamiPaper(dots);
        const [axis, value] = folds[0];
        paper.fold(axis, value);

        return paper.countVisibleDots();
    }

    solvePartTwo() {
        const splitIndex = this.lines.indexOf('');
        const dots = this.lines.slice(0, splitIndex).map((value) => value.split(',').map((value) => Number(value)));
        const folds = this.lines.slice(splitIndex + 1).map((value) => value.split(' ')[2].split('='));

        const paper = new OrigamiPaper(dots);
        for (const [axis, value] of folds) {
            paper.fold(axis, value);
        }

        return "\n" + paper.toString();
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
