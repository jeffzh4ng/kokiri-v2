import * as assert from 'assert'
import * as fs from 'fs'
import * as rl from 'readline'

interface PresentDimension {
  length: number
  width: number
  height: number
}

// paperCount: PresentDimension -> number
// Purpose: Produces the required amount of wrapping paper for each gift
const paperCount = (input: PresentDimension): number => {
  const x = 2 * input.length * input.width
  const y = 2 * input.width * input.height
  const z = 2 * input.height * input.length

  const a1 = input.length * input.width
  const a2 = input.width * input.height
  const a3 = input.height * input.length
  const s = Math.min(a1, a2, a3)

  return x + y + z + s
}


const paperCountTests = () => {
  const testOneInput = {
    length: 2,
    width: 3,
    height: 4
  }
  assert.equal(paperCount(testOneInput), 58)
  
  const testTwoInput = {
    length: 1,
    width: 1,
    height: 10
  }
  assert.equal(paperCount(testTwoInput), 43)
}

const paperCounts = (input: Array<PresentDimension>): number => input.reduce((prev, cur): number => prev + paperCount(cur), 0)

const paperCountsTests = () => {
  const testOneInput = {
    length: 2,
    width: 3,
    height: 4
  }

  const testTwoInput = {
    length: 1,
    width: 1,
    height: 10
  }

  const tests = [testOneInput, testTwoInput]

  assert.equal(paperCounts(tests), 101)
}

// ribbonCount: PresentDimension -> number
// Purpose: Produces the required amount of ribbon for each gift
const ribbonCount = (input: PresentDimension): number => {
  const p1 = (input.length * 2) + (input.width * 2)
  const p2 = (input.width * 2) + (input.height * 2)
  const p3 = (input.height * 2) + (input.length * 2)

  const baseCount = Math.min(p1, p2, p3)
  const bowCount = input.length * input.width * input.height

  return baseCount + bowCount
}

const ribbonCountTests = () => {
  const testThreeInput = {
    length: 2,
    width: 3,
    height: 4
  }
  assert.equal(ribbonCount(testThreeInput), 34)

  const testFourInput = {
    length: 1,
    width: 1,
    height: 10
  }
  assert.equal(ribbonCount(testFourInput), 14)
}

const ribbonCounts = (input: Array<PresentDimension>): number => input.reduce((prev, cur) => prev + ribbonCount(cur), 0)

const stars = () => {
  const input = rl.createInterface({
    input: fs.createReadStream('./input'),
  })

  const parsedInput: Array<PresentDimension> = []

  input.on('line', line => {
    const splitLine = line.split('x')
    if (splitLine.length > 3) {
      console.log('error')
    }

    parsedInput.push({
      length: parseInt(splitLine[0]),
      width: parseInt(splitLine[1]),
      height: parseInt(splitLine[2])
    })
  })

  input.on('close', () => {
    const outputOne = paperCounts(parsedInput)
    const outputTwo = ribbonCounts(parsedInput)
    
    console.log(outputOne)
    console.log(outputTwo)
  })
}

const main = () => {
  stars()
  paperCountTests()
  paperCountsTests()
  ribbonCountTests()
}

main()