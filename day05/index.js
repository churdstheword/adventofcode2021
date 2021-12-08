'use strict';

import fs from "fs";
import path from "path";
import readline from "readline";

class Diagram {

    constructor(lines, allowDiagonals = false) {

        this.data = [];
        this.allowDiagonals = allowDiagonals;

        // Configure an empty board
        for (let i = 0; i < 1000; i++) {
            this.data.push(Array(1000).fill(0));
        }

        // Draw the lines on the diagram
        for (const line of lines) {
            const [point1, point2] = line.split(' -> ');
            this.drawLine(
                ...point1.split(',').map(v => parseInt(v)),
                ...point2.split(',').map(v => parseInt(v))
            );
        }
    }

    drawLine(x1, y1, x2, y2) {

        const dx = x2 - x1;
        const dy = y2 - y1;

        if (dx == 0 && dy == 0) {
            // Single Point
            this.markPoint(x1, y1);
        } else if (dx == 0) {
            // Vertical Line
            let x = x1;
            for (let y = y1; (Math.sign(dy) > 0 ? (y <= y2) : (y >= y2)); y += Math.sign(dy)) {
                this.markPoint(x, y);
            }
        } else if (dy == 0) {
            // Horizontal Line
            let y = y1;
            for (let x = x1; (Math.sign(dx) > 0 ? (x <= x2) : (x >= x2)); x += Math.sign(dx)) {
                this.markPoint(x, y);
            }
        } else {
            // Diagonal Line
            if (this.allowDiagonals) {
                let y = y1, x = x1;
                while ((Math.sign(dy) > 0 ? (y <= y2) : (y >= y2)) && (Math.sign(dx) > 0 ? (x <= x2) : (x >= x2))) {
                    this.markPoint(x, y);
                    y += Math.sign(dy);
                    x += Math.sign(dx);
                }
            }
        }
    }

    getPoint(x, y) {
        return this.data[y][x];
    }

    setPoint(x, y, value) {
        this.data[y][x] = value;
    }

    markPoint(x, y) {
        this.setPoint(x, y, this.getPoint(x, y) + 1);
    }

    countOverlaps() {
        let count = 0
        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[y].length; x++) {
                if (this.data[y][x] > 1) {
                    count++;
                }
            }
        }
        return count;
    }

    toString() {
        const formatValue = (value) => value.toString().padStart(2, " ")
        const formatRow = (row) => "[ " + row.map(formatValue).join(", ") + " ]";
        return this.data[0].map((_, colIndex) => this.data.map(row => row[colIndex])).map(formatRow).join("\n");
    }

}

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        const diagram = new Diagram(this.lines);
        return diagram.countOverlaps();
    }

    solvePartTwo() {
        const diagram = new Diagram(this.lines, true);
        return diagram.countOverlaps();
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
