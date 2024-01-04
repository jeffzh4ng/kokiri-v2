import * as assert from 'assert/strict';
import * as fs from 'fs';

// floorCount: String -> number
// Purpose: Produces the floor number based on the instructions
const floorCount = (input: String): number => {
  if (input.length == 0) {
    return 0
  } else {
    const step = input[0] == '(' ? 1 : -1
    return step + floorCount(input.slice(1, input.length))
  }
}

const floorCountTests = () => {
  // Examples:
  assert.equal(floorCount("(())"), 0)

  assert.equal(floorCount("(())"), 0)
  assert.equal(floorCount("()()"), 0)
  assert.equal(floorCount("((("), 3)
  assert.equal(floorCount("(()(()("), 3)
  assert.equal(floorCount("))((((("), 3)
  assert.equal(floorCount("())"), -1)
  assert.equal(floorCount("))("), -1)
  assert.equal(floorCount(")))"), -3)
  assert.equal(floorCount(")())())"), -3)
}

// basementCount: String -> number
// Purpose: Produces the position of the first instruction that instructs Santa to the basement
const basementCountHelper = (input: String, acc: number, index: number): number | Error => {
  if (input.length == 0) {
    return new Error("basementCount is not defined on input with length 0")
  } else {
    const step = input[0] == '(' ? 1 : -1
    if (acc + step < 0) {
      return index
    } else {
      return basementCountHelper(input.slice(1, input.length), acc + step, index + 1)
    }
  }
}

const basementCount = (input: String): number | Error => {
  return basementCountHelper(input, 0, 1)
}

const basementCountTests = () => {
  assert.equal(basementCount(")"), 1)
  assert.equal(basementCount("()())"), 5)
}

const stars = () => {
  const input = fs.readFileSync("./input", 'utf8');
  const outputOne = floorCount(input)
  const outputTwo = basementCount(input)

  console.log(outputOne)
  console.log(outputTwo)
}


const main = () => {
  stars()
  floorCountTests()
  basementCountTests()
}

main()