"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Purpose: Produces the floor number based on the instructions
var floorCount = function (input) {
    if (input.length == 0) {
        return 0;
    }
    else {
        var step = input[0] == '(' ? 1 : -1;
        return step + floorCount(input.slice(1, input.length));
    }
};
var floorCountTests = function () {
    // Examples:
    if (floorCount("(())") == 0)
        console.log('example passed');
    // Tests
    if (floorCount("(())") == 0) {
        console.log('example 1 passed');
    }
    else {
        console.log('example 1 failed');
    }
    if (floorCount("()()") == 0) {
        console.log('example 2 passed');
    }
    else {
        console.log('example 2 failed');
    }
    if (floorCount("(((") == 3) {
        console.log('example 3 passed');
    }
    else {
        console.log('example 3 failed');
    }
    if (floorCount("(()(()(") == 3) {
        console.log('example 3 passed');
    }
    else {
        console.log('example 3 failed');
    }
    if (floorCount("))(((((") == 3) {
        console.log('example 4 passed');
    }
    else {
        console.log('example 4 failed');
    }
    if (floorCount("())") == -1) {
        console.log('example 5 passed');
    }
    else {
        console.log('example 5 failed');
    }
    if (floorCount("))(") == -1) {
        console.log('example 6 passed');
    }
    else {
        console.log('example 6 failed');
    }
    if (floorCount(")))") == -3) {
        console.log('example 7 passed');
    }
    else {
        console.log('example 7 failed');
    }
    if (floorCount(")())())") == -3) {
        console.log('example 8 passed');
    }
    else {
        console.log('example 8 failed');
    }
};
var main = function () {
    var data = fs.readFileSync("./input", 'utf8');
    var output = floorCount(data);
    console.log(output);
};
main();
floorCountTests();
