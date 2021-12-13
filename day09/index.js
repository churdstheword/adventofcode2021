'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class CaveFloorMap {

    constructor(data) {
        this.data = data;
    }

    determineLowPoints() {

        const points = [];

        for (let row = 0; row < this.data.length; row++) {
            for (let column = 0; column < this.data[0].length; column++) {
                let height = this.getHeight(column, row);

                const adjacent = [
                    this.getHeight(column + 1, row),
                    this.getHeight(column - 1, row),
                    this.getHeight(column, row + 1),
                    this.getHeight(column, row - 1),
                ]

                if (height < Math.min(...adjacent)) {
                    points.push([column, row]);
                }
            }
        }

        return points;

    }

    getHeight(column, row) {
        let height = 9;
        if (row >= 0 && row < this.data.length) {
            if (column >= 0 && column < this.data[row].length) {
                height = this.data[row][column];
            }
        }
        return height;
    }

    getBasin(column, row, basin = []) {

        basin.push([column, row]);

        const adjacent = [
            [column + 1, row],
            [column - 1, row],
            [column, row + 1],
            [column, row - 1],
        ];

        let basinIncludesPoint = (basin, column, row) => {
            for (const point of basin) {
                if (point[0] == column && point[1] == row) {
                    return true;
                }
            }
            return false;
        };

        for (const point of adjacent) {
            let height = this.getHeight(point[0], point[1]);
            if (height < 9 && !basinIncludesPoint(basin, point[0], point[1])) {
                basin = this.getBasin(point[0], point[1], basin);
            }
        }

        return basin;

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

        const map = new CaveFloorMap(data);

        let total = 0;
        const points = map.determineLowPoints();
        for (const point of points) {
            total += map.getHeight(point[0], point[1]) + 1;
        }

        return total;
    }

    solvePartTwo() {

        const data = [];
        for (const line of this.lines) {
            data.push(line.split('').map((value) => Number(value)));
        }

        const map = new CaveFloorMap(data);

        const basins = [];
        const points = map.determineLowPoints();
        for (const point of points) {
            basins.push(map.getBasin(point[0], point[1]));
        }

        basins.sort((a, b) => b.length - a.length);

        let total = 1;
        for (let i = 0; i < 3; i++) {
            total = total * basins[i].length;
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
