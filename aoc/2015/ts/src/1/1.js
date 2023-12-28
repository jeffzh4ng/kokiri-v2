"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// floorCount: String -> number
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
        console.log('test 1 passed');
    }
    else {
        console.log('test 1 failed');
    }
    if (floorCount("()()") == 0) {
        console.log('test 2 passed');
    }
    else {
        console.log('test 2 failed');
    }
    if (floorCount("(((") == 3) {
        console.log('test 3 passed');
    }
    else {
        console.log('test 3 failed');
    }
    if (floorCount("(()(()(") == 3) {
        console.log('test 3 passed');
    }
    else {
        console.log('test 3 failed');
    }
    if (floorCount("))(((((") == 3) {
        console.log('test 4 passed');
    }
    else {
        console.log('test 4 failed');
    }
    if (floorCount("())") == -1) {
        console.log('test 5 passed');
    }
    else {
        console.log('test 5 failed');
    }
    if (floorCount("))(") == -1) {
        console.log('test 6 passed');
    }
    else {
        console.log('test 6 failed');
    }
    if (floorCount(")))") == -3) {
        console.log('test 7 passed');
    }
    else {
        console.log('test 7 failed');
    }
    if (floorCount(")())())") == -3) {
        console.log('test 8 passed');
    }
    else {
        console.log('test 8 failed');
    }
};
// basementCount: String -> number
// Purpose: Produces the position of the first instruction that instructs Santa to the basement
var basementCountHelper = function (input, acc, index) {
    if (input.length == 0) {
        return new Error("basementCount is not defined on input with length 0");
    }
    else {
        var step = input[0] == '(' ? 1 : -1;
        if (acc + step < 0) {
            return index;
        }
        else {
            return basementCountHelper(input.slice(1, input.length), acc + step, index + 1);
        }
    }
};
var basementCount = function (input) {
    return basementCountHelper(input, 0, 1);
};
var basementCountTests = function () {
    if (basementCount("") instanceof Error) {
        console.log("test 9 passed");
    }
    else {
        console.log("test 9 failed");
    }
    if (basementCount(")") == 1) {
        console.log("test 10 passed");
    }
    else {
        console.log("test 10 failed");
    }
    if (basementCount("()())") == 5) {
        console.log("test 11 passed");
    }
    else {
        console.log("test 11 failed");
    }
};
var stars = function () {
    var data = fs.readFileSync("./input", 'utf8');
    var outputOne = floorCount(data);
    var outputTwo = basementCount(data);
    console.log(outputOne);
    console.log(outputTwo);
};
var main = function () {
    stars();
    floorCountTests();
    basementCountTests();
};
main();
