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

  if (paperCount(testOneInput) == 58) {
    console.log('test 1 passed')
  } else {
    console.log('test 1 failed')
  }
  
  const testTwoInput = {
    length: 1,
    width: 1,
    height: 10
  }
  
  if (paperCount(testTwoInput) == 43) {
    console.log('test 2 passed')
  } else {
    console.log(paperCount(testTwoInput))
    console.log('test 2 failed')
  }
}

const paperCounts = (input: Array<PresentDimension>): number => {
  return input.reduce((prev, cur): number => {
    return prev + paperCount(cur)
  }, 0)
}

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

  if (paperCounts(tests) == 101) {
    console.log('test 3 passed')  
  } else {
    console.log('test 4 passed')  
  }
}

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
    const output = paperCounts(parsedInput)
    console.log(output)
  })
}

const main = () => {
  stars()
  paperCountTests()
  paperCountsTests()
}

main()