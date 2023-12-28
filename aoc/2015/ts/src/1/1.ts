import * as fs from 'fs';

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
  if (floorCount("(())") == 0)  console.log('example passed')

  // Tests
  if (floorCount("(())") == 0)  {
    console.log('example 1 passed')
  } else {
    console.log('example 1 failed')
  }

  if (floorCount("()()") == 0)  {
    console.log('example 2 passed')
  } else {
    console.log('example 2 failed')
  }

  if (floorCount("(((") == 3)  {
    console.log('example 3 passed')
  } else {
    console.log('example 3 failed')
  }

  if (floorCount("(()(()(") == 3)  {
    console.log('example 3 passed')
  } else {
    console.log('example 3 failed')
  }

  if (floorCount("))(((((") == 3)  {
    console.log('example 4 passed')
  } else {
    console.log('example 4 failed')
  }

  if (floorCount("())") == -1)  {
    console.log('example 5 passed')
  } else {
    console.log('example 5 failed')
  }

  if (floorCount("))(") == -1)  {
    console.log('example 6 passed')
  } else {
    console.log('example 6 failed')
  }

  if (floorCount(")))") == -3)  {
    console.log('example 7 passed')
  } else {
    console.log('example 7 failed')
  }

  if (floorCount(")())())") == -3)  {
    console.log('example 8 passed')
  } else {
    console.log('example 8 failed')
  }
}

const main = () => {
  const data = fs.readFileSync("./input", 'utf8');
  const output = floorCount(data)
  console.log(output)
}

main()
floorCountTests()