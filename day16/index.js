'use strict'

import fs from "fs";
import path from "path";
import readline from "readline";

let lines = [];
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const readable = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
const fileReader = readline.createInterface({ input: readable, crlfDelay: Infinity });
for await (const line of fileReader) lines.push(line);

class Parser {

    constructor(bits) {
        this.bits = bits;
        this.pointer = 0;
    }

    read(length) {
        const buffer = this.bits.substring(this.pointer, this.pointer + length);
        this.pointer += length;
        return buffer;
    }

    parse() {

        const header = {
            version: parseInt(this.read(3), 2),
            typeid: parseInt(this.read(3), 2)
        }

        if (header.typeid == 4) {
            return new Packet(header, this);
        } else {
            return new OpPacket(header, this);
        }

    }

}

class Packet {

    constructor(header, parser) {
        this.subpackets = [];
        this.header = header;
        this.value = '';
        this.readPacket(parser);
    }

    readPacket(parser) {
        let prefix = 1;
        do {
            prefix = parseInt(parser.read(1));
            this.value += parser.read(4);
        } while (prefix > 0);
    }

    getVersionSum() {
        return this.header.version;
    }

    getValue() {
        return parseInt(this.value, 2);
    }

}

class OpPacket extends Packet {

    readPacket(parser) {

        const lengthid = parseInt(parser.read(1));

        if (lengthid == 1) {
            let count = parseInt(parser.read(11), 2);
            for (let i = 0; i < count; i++) {
                this.subpackets.push(parser.parse());
            }
        } else {
            const length = parseInt(parser.read(15), 2);
            const pointer = parser.pointer;
            while (parser.pointer - pointer < length) {
                this.subpackets.push(parser.parse());
            }
        }
    }

    getVersionSum() {
        return this.header.version + this.subpackets.reduce((prev, curr) => prev + curr.getVersionSum(), 0);
    }

    getValue() {

        let value = null;
        
        const values = this.subpackets.map((packet) => packet.getValue());

        switch (this.header.typeid) {
            case 0:
                value = values.reduce((c, p) => c + p, 0);
                break;
            case 1:
                value = values.reduce((c, p) => c * p, 1);
                break;
            case 2:
                value = Math.min(...values);
                break;
            case 3:
                value = Math.max(...values);
                break;
            case 4:
                value = 0;
                break;
            case 5:
                value = (values[0] > values[1]) ? 1 : 0;
                break;
            case 6:
                value = (values[0] < values[1]) ? 1 : 0;
                break;
            case 7:
                value = (values[0] == values[1]) ? 1 : 0;
                break;
        }

        return value;
    }

}

class Solution {

    constructor(lines) {
        let bits = lines[0].split('').map((char) => {
            return parseInt(char, 16).toString(2).padStart(4, '0');
        }).reduce((prev, curr) => prev + curr, '');
        const parser = new Parser(bits);
        this.packet = parser.parse();
    }

    solvePartOne() {
        return this.packet.getVersionSum();
    }

    solvePartTwo() {
        return this.packet.getValue();
    }

}

const solution = new Solution(lines);
console.log('Solution Part 1:', solution.solvePartOne());
console.log('Solution Part 2:', solution.solvePartTwo());
