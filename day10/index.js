'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

class SubsystemSyntaxLinter {

    constructor() {

    }

    checkCorruptedLines(lines) {

        let score = 0;
        for (const line of lines) {
            let status = this.lint(line).split(':');
            if (status[0] == 1) {
                switch (status[1]) {
                    case ')':
                        score += 3;
                        break;
                    case ']':
                        score += 57;
                        break;
                    case '}':
                        score += 1197;
                        break;
                    case '>':
                        score += 25137;
                        break;
                }
            }
        }

        return score;
    }

    checkIncompleteLines(lines) {

        const scores = [];

        for (const line of lines) {
            let result = this.lint(line);
            let status = result.split(':');
            if (status[0] == -1) {
                let score = 0;
                for (const char of status[1].split('')) {
                    score = score * 5;
                    switch (char) {
                        case ')':
                            score += 1;
                            break;
                        case ']':
                            score += 2;
                            break;
                        case '}':
                            score += 3;
                            break;
                        case '>':
                            score += 4;
                            break;
                    }

                }

                scores.push(score);
            }
        }

        scores.sort((a, b) => Number(a) - Number(b));
        return scores[((scores.length - 1) / 2)];
    }

    lint(line) {

        let status = '0:0';

        try {

            const stack = [];
            const input = line.split('');

            for (let i = 0; i < input.length; i++) {

                const curr = input[i];
                const prev = stack.at(-1) ?? '';

                switch (curr) {
                    case '(':
                    case '[':
                    case '{':
                    case '<':
                        stack.push(curr);
                        break;
                    case ')':
                    case ']':
                    case '}':
                    case '>':
                        switch (prev + curr) {
                            case '()':
                            case '[]':
                            case '{}':
                            case '<>':
                                stack.pop();
                                break;
                            default:
                                throw new Error(`1:${curr}:${i}`);
                        }
                        break;
                }

            }

            if (stack.length != 0) {
                const complete = [];
                while (stack.length > 0) {
                    switch (stack.pop()) {
                        case '(':
                            complete.push(')');
                            break;
                        case '[':
                            complete.push(']');
                            break;
                        case '{':
                            complete.push('}');
                            break;
                        case '<':
                            complete.push('>')
                            break;
                    }
                }
                throw new Error(`-1:${complete.join('')}`);
            }

        } catch (error) {
            status = error.message;
        }

        return status;

    }

}

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    solvePartOne() {
        const linter = new SubsystemSyntaxLinter();
        return linter.checkCorruptedLines(this.lines);

    }

    solvePartTwo() {
        const linter = new SubsystemSyntaxLinter();
        return linter.checkIncompleteLines(this.lines);
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
