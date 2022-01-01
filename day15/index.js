'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";
import { PriorityQueue } from "@datastructures-js/priority-queue"

class CavePathFinder {

    constructor(data) {
        this.data = data;
        this.open = new PriorityQueue({
            compare: (node1, node2) => (node1.f > node2.f) ? 1 : -1
        })
        this.path = [];
    }

    search(start, end) {

        // Push our starting node onto the stack
        this.open.enqueue(this.getNode(start.x, start.y));

        while (this.open.size() > 0) {

            // Get the current node
            let current = this.open.dequeue();

            // Check to see if we finished searching
            if (current.pos.x == end.x && current.pos.y == end.y) {
                this.path = [];
                while (current.parent) {
                    this.path.push(current);
                    current = current.parent;
                }
                this.path.push(this.getNode(start.x, start.y))
                this.path = this.path.reverse();
                return this.path;
            }

            // Close the current node
            current.closed = true;

            const neighbors = this.getNeighbors(current);

            for (let i = 0; i < neighbors.length; i++) {

                const neighbor = neighbors[i];

                if (neighbor.closed) {
                    continue;
                }

                // Calculate the gscore
                const gScore = current.g + neighbor.risk;
                const beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    neighbor.visited = true;
                    neighbor.parent = current;
                    neighbor.g = gScore;
                    neighbor.h = this.heuristic(neighbor, this.getNode(end.x, end.y));
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        this.open.enqueue(neighbor);
                    }
                }

            }

        }

        return [];

    }

    heuristic(nodeA, nodeB) {
        return (Math.abs(nodeB.pos.x - nodeA.pos.x) + Math.abs(nodeB.pos.y - nodeA.pos.y));
    }

    getNode(x, y) {
        let node = null;
        if (this.data[y] && this.data[y][x]) {
            node = this.data[y][x];
        }
        return node;
    }

    getNeighbors(node) {
        const nodes = [];
        nodes.push(this.getNode(node.pos.x, node.pos.y - 1));
        nodes.push(this.getNode(node.pos.x, node.pos.y + 1));
        nodes.push(this.getNode(node.pos.x - 1, node.pos.y));
        nodes.push(this.getNode(node.pos.x + 1, node.pos.y));
        return nodes.filter(node => node);
    }

    listContainsNode(list, node) {
        let result = false;
        for (const item of list) {
            if (item.equals(node)) {
                result = true;
                break;
            }
        }
        return result;
    }

    toString() {
        let rowValues = [];
        for (let row = 0; row < this.data.length; row++) {
            let colValues = [];
            for (let col = 0; col < this.data[row].length; col++) {
                let node = this.getNode(col, row);
                if (this.listContainsNode(this.path, node)) {
                    colValues.push('\x1b[32m' + node.risk + '\x1b[0m');
                } else {
                    colValues.push(node.risk);
                }
            }
            rowValues.push("[ " + colValues.join(", ") + " ]");
        }
        return rowValues.join("\n");
    }

}

class CaveNode {
    constructor(x, y, risk) {
        this.pos = { x: x, y: y };
        this.risk = risk;
        this.parent = null;
        this.h = 0; // Heuristic score - Distance to end
        this.g = 0; // Cost from start
        this.f = 0; // Combined score
        this.visited = false;
        this.closed = false;
    }

    equals(node) {
        return (this.pos.x == node.pos.x && this.pos.y == node.pos.y && this.risk == node.risk);
    }
}


class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        const grid = [];
        for (let row = 0; row < this.lines.length; row++) {
            grid.push(
                this.lines[row].split('').map((value, col) => {
                    return new CaveNode(col, row, Number(value))
                })
            );
        }

        const pathfinder = new CavePathFinder(grid);
        const nodes = pathfinder.search({ x: 0, y: 0 }, { x: grid[0].length - 1, y: grid.length - 1 });
        return nodes.at(-1).g;
    }

    solvePartTwo() {
        const grid = [];
        const numRows = this.lines.length;
        for (let row = 0; row < numRows * 5; row++) {
            const numColumns = this.lines[row % numRows].length;
            const gridRow = new Array(numColumns * 5).fill(0);
            for (let col = 0; col < numColumns * 5; col++) {
                let base = Number(this.lines[row % numRows][col % numColumns]) - 1
                let deltaRow = Math.floor(row / numRows);
                let deltaCol = Math.floor(col / numColumns);
                let risk = (((base + deltaRow + deltaCol) % 9) + 1);
                gridRow[col] = new CaveNode(col, row, Number(risk));
            }
            grid.push(gridRow);
        }

        const pathfinder = new CavePathFinder(grid);
        const nodes = pathfinder.search({ x: 0, y: 0 }, { x: grid[0].length - 1, y: grid.length - 1 });
        return nodes.at(-1).g;
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
