'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class Navigation {

    constructor(nodes) {
        this.nodes = nodes;
        this.paths = [];
        this.allowOneRevisit = false;
    }

    countAllPaths() {
        this.traverse(['start']);
        return this.paths.length;
    }

    countAllPathsWithRevisit() {
        this.allowOneRevisit = true;
        return this.countAllPaths();
    }

    traverse(path, revisit = null) {

        const head = path.at(-1);

        // Hard stop if we've reached the end of the given path
        if (head === 'end') {
            this.paths.push(path);
            return;
        }

        for (const node of this.findNodes(head)) {

            // Get the tail value of the node
            const tail = node.getTail(head);

            // Skip over any possible dead ends
            if (tail === 'start') {
                continue;
            }

            // If a lowercase letter shows up twice, continue if possible.
            if (path.includes(tail) && (tail === tail.toLowerCase())) {
                if (revisit === null && this.allowOneRevisit) {
                    this.traverse([...path, tail], tail);
                }
                continue;
            }

            // Traverse down the new path
            this.traverse([...path, tail], revisit);
        }

    }

    findNodes(value) {
        const nodes = [];
        for (const node of this.nodes) {
            if (node.has(value)) {
                nodes.push(node);
            }
        }
        return nodes;
    }

}

class CaveNode {
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
        this.data = {};
        this.data[head] = tail;
        this.data[tail] = head;
    }

    has(headOrTail) {
        return (this.head === headOrTail || this.tail === headOrTail);
    }

    getTail(head) {
        return this.data[head] ?? null;
    }
}


class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        const caves = [];
        for (const line of this.lines) {
            const [head, tail] = line.split('-');
            caves.push(new CaveNode(head, tail));
        }
        const nav = new Navigation(caves);
        return nav.countAllPaths();
    }

    solvePartTwo() {
        const caves = [];
        for (const line of this.lines) {
            const [head, tail] = line.split('-');
            caves.push(new CaveNode(head, tail));
        }
        const nav = new Navigation(caves);
        return nav.countAllPathsWithRevisit();
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
