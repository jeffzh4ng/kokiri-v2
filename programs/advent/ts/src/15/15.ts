import * as fs from 'fs'

type Cookie = string
type CookieMap = Map<Cookie, Array<number>>

const cookieScore = (cookie: Cookie, map: CookieMap, n: number): number => {



  return 0
}


const permScore = (perm: Array<number>, map: CookieMap): number => {
  cookieScore(map)

  return 0
}

const highScore = (perms: Array<Array<number>>, map: CookieMap): number => {



  return 0
}

// ingredients: s, b, choc, can
// a + b = 100
// a + b + c = 100
// a + b + c + d = 100

// TODO: generative recursion
const sols = (summandCount: number, sum: number): Array<Array<number>> => {
  if (summandCount === 0) {
    throw new Error() // expression is a value, not an equation
  } else if (summandCount === 1) { // x = 100
    const singleSol = [sum]
    return [singleSol]
  } else if (summandCount === 2) { // x + y = 100
    const output = []
    for (let x = 0; x <= sum; x++) {
      let y = sum - x
      if (Number.isInteger(y)) output.push([x, y])
    }


    return output
  } else { // x0 + x1 + ... xn = 100
    const output = []
    const nMinusOne = summandCount - 1

    for (let a = 0; a <= sum; a++) {
      const bcSols = sols(nMinusOne, sum - a)
      const abcSols = bcSols.map(bcSol => [a, ...bcSol])

      output.push(...abcSols)
    }

    return output
  }
}

const parseInput = (input: Array<string>): CookieMap =>
  input.reduce((p, c) => {
    const tokens = c.split(' ')
    const [i, cap, d, f, t, cal] = [
      tokens[0],
      parseInt(tokens[2]),
      parseInt(tokens[4]),
      parseInt(tokens[6]),
      parseInt(tokens[8]),
      parseInt(tokens[10])
    ]

    const newEntry: [Cookie, Array<number>] = [i, [cap, d, f, t, cal]]
    const newMap = new Map([...Array.from(p.entries()), newEntry])

    return newMap
  }, new Map())

const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const parsedInput = parseInput(input)
  const perms = sols(4, 100)
  const ps = permScore(perms,)
  console.log(parsedInput)
}

const tests = () => {
  const two = sols(2, 100)
  const three = sols(3, 100)
  const four = sols(4, 100)

  console.log(four)
}

const main = () => {
  stars()
  tests()
}
main()