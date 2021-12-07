'use strict';

import fs from "fs";
import path from "path";
import readline from "readline";

class BingoGame {

    constructor() {
        this.boards = [];
        this.balls = [];
    }

    setBalls(balls) {
        this.balls = balls.reverse();
    }

    pickBall() {
        return this.balls.pop();
    }

    addBoard(board) {
        if (typeof board === 'object' && Array.isArray(board)) {
            this.boards.push(new BingoBoard(board));
        } else if (typeof board === 'object' && board instanceof BingoBoard) {
            this.boards.push(board);
        } else {
            throw new Error('Board must be objects of type BingoBoard or Array!');
        }
    }

}

class BingoBoard {

    constructor(boardValues, markedValues = []) {
        this.boardValues = boardValues;
        this.markedValues = markedValues;
    }

    getValue(row, col) {
        return this.boardValues[row][col];
    }

    markValue(value) {
        this.markedValues.push(String(value));
    }

    checkValue(value) {
        return this.markedValues.includes(String(value));
    }

    checkBoard() {

        // Check the board rows for a winner
        const rows = this.boardValues;
        for (let i = 0; i < rows.length; i++) {
            const checksum = rows[i].reduce((prev, curr) => prev + (this.checkValue(curr) ? 1 : 0), 0)
            if (checksum == rows[i].length) {
                return true;
            }
        }

        // Check the board columns a winner
        const columns = this.boardValues[0].map((_, colIndex) => this.boardValues.map(column => column[colIndex]));
        for (let i = 0; i < columns.length; i++) {
            const checksum = columns[i].reduce((prev, curr) => prev + (this.checkValue(curr) ? 1 : 0), 0);
            if (checksum == columns[i].length) {
                return true;
            }
        }

        return false;
    }

    getScore() {

        let unmarkedSum = 0;
        for (let i = 0; i < this.boardValues.length; i++) {
            for (let j = 0; j < this.boardValues[0].length; j++) {
                const value = this.getValue(i, j);
                if (!this.checkValue(value)) {
                    unmarkedSum += Number(value);
                }
            }
        }

        return unmarkedSum * Number(this.markedValues.at(-1));
    }

    toString() {

        const formatValue = (value) => {
            const isMarked = this.checkValue(String(value))
            return ((isMarked) ? '(' : ' ') + value.toString().padStart(2, "0") + ((isMarked) ? ')' : ' ');
        }

        const formatRow = (row) => {
            return "[ " + row.map(formatValue).join(", ") + " ]";
        }

        return this.boardValues.map(formatRow).join("\n");
    }

}

class Solution {

    constructor(lines) {
        this.lines = lines;
    }

    createGame() {

        // Create a new bingo game
        const game = new BingoGame();

        // Queue up a set of bingo balls to draw from
        game.setBalls(this.lines[0].split(','));

        // Build the bingo boards from the input
        for (let i = 1; i < this.lines.length; i = i + 6) {
            const values = [];
            for (let j = i + 1; j < i + 6; j++) {
                values.push(this.lines[j].trim().split(/\s+/));
            }
            const board = new BingoBoard(values);
            game.addBoard(board);
        }

        return game;
    }

    solvePartOne() {

        // Create a new bingo game
        const game = this.createGame();
        const winners = new Set();
        while (winners.size == 0) {
            // Draw a number
            const value = game.pickBall();
            // Determine any winners
            for (const board of game.boards) {
                // Mark the value on the board
                board.markValue(value);
                // Check for a winner
                if (board.checkBoard()) {
                    winners.add(board);
                };
            }
        }

        // Calculate the winning board's score and return it
        const winner = Array.from(winners).at(0);
        console.log('Winner:');
        console.log(winner.toString());
        return winner.getScore();
    }

    solvePartTwo() {

        // Create a new bingo game
        const game = this.createGame();
        const winners = new Set();
        while (winners.size < game.boards.length) {
            // Draw a number
            const value = game.pickBall();
            // Determine any winners
            for (const board of game.boards) {
                // Mark the value on the board
                board.markValue(value);
                // Check for a winner
                if (board.checkBoard()) {
                    winners.add(board);
                }
            }

        }

        // Calculate the final winning board's score and return it
        const loser = Array.from(winners).at(-1);
        console.log('Best Loser:');
        console.log(loser.toString());
        return loser.getScore();

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
