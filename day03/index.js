'use strict';

import fs from "fs";
import path from "path";
import readline from "readline";

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    calculateGammaRate(lines) {
        let rate = 0;
        for (let col = 0; col < lines[0].length; col++) {
            const column = this.fetchColumnFromRows(lines, col);
            const mcb = this.getMostCommonBit(column)
            rate += mcb * (Math.pow(2, lines[0].length - (col + 1)));
        }
        return rate;
    }

    calculateEpsilonRate(lines) {
        let rate = 0;
        for (let col = 0; col < lines[0].length; col++) {
            const column = this.fetchColumnFromRows(lines, col);
            const lcb = this.getLeastCommonBit(column);
            rate += lcb * Math.pow(2, lines[0].length - (col + 1));
        }
        return rate;
    }

    calculateCO2ScrubberRaiting(lines) {
        let raiting = '';
        for (let col = 0; lines.length > 1; col++) {
            const column = this.fetchColumnFromRows(lines, col);
            const lcb = this.getLeastCommonBit(column);
            lines = lines.filter(this.columnHasCommonBit(col, lcb))
            if (lines.length == 1) {
                raiting = parseInt(lines[0], 2);
                break;
            }
        }
        return raiting;
    }

    calculate02GeneratorRaiting(lines) {
        let raiting = '';
        for (let col = 0; lines.length > 1; col++) {
            const column = this.fetchColumnFromRows(lines, col);
            const mcb = this.getMostCommonBit(column)
            lines = lines.filter(this.columnHasCommonBit(col, mcb))
            if (lines.length == 1) {
                raiting = parseInt(lines[0], 2);
                break;
            }
        }
        return raiting;
    }

    fetchColumnFromRows(rows, n) {
        const column = [];
        for (let row = 0; row < rows.length; row++) {
            column.push(rows[row].split('')[n]);
        }
        return column;
    }

    getMostCommonBit(column) {
        const reducer = (prev, curr) => prev + ((curr > 0) ? 1 : -1);
        const reducerValue = column.reduce(reducer, 0);
        return ((reducerValue < 0) ? 0 : 1);
    }

    getLeastCommonBit(column) {
        return (this.getMostCommonBit(column) ? 0 : 1)
    }

    columnHasCommonBit(col, bit) {
        return (row) => (row.split('')[col] == bit)
    }

    solvePartOne() {
        return this.calculateGammaRate([...lines]) * this.calculateEpsilonRate([...lines]);
    }

    solvePartTwo() {
        return this.calculate02GeneratorRaiting([...lines]) * this.calculateCO2ScrubberRaiting([...lines]);
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
