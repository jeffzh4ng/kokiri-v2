import * as fs from 'fs';

// countLiteralLength :: string -> number
// Purpose: produces the literal length
const literalLength = (input: string): number => input.length


// hexStringToAscii :: string -> string
// Purpose: produces the ascii character associated with the hex encoded input
const hexStringToAscii = (input: string): string => String.fromCharCode(parseInt(input, 16));

// unEsc :: string -> string
// Purpose: Unescapes the string
const unEsc = (input: string): string => {
  const escToken = '\\'
  const quoteToken = '\"'
  const hexToken = 'x'

  const output = input.split('').reduce<[string, string]>((p, c) => {
    if (p[1].length === 0) {
      return c === escToken ? [p[0], escToken] : [`${p[0]}${c}`, '']
    } else if (p[1].length === 1) {
      if (c === escToken) {
        return [`${p[0]}${escToken}`, ''] // add \ to string accumulator
      } else if (c === quoteToken) { // add ' to string accumulator
        return [`${p[0]}${quoteToken}`, '']
      } else if (c === hexToken) {
        return [p[0], `${escToken}${hexToken}`] // add \x to escape accumulator
      }
    } else if (p[1].length === 2) {
      return [p[0], `${escToken}${hexToken}${c}`]
    } else if (p[1].length === 3) {
      const hex = `${p[1][2]}${c}`
      return [`${p[0]}${hexStringToAscii(hex)}`, '']
    }

    throw new Error("") // even if we typed the escape accumualator to string
                        // of length 0, 1, or 2, javascript's static semantics
                        // don't support exhaustive pattern matching
                        // (we would still throw or fail on a switch's default arm)
  }, ["", ""])

  return output[0]
}

// countSymbolLength :: string -> number
// Purpose: produces the symbol length
const symbolLength = (input: string): number => {
  const trimmedInput = input.substring(1, input.length - 1)
  const unescapedInput = unEsc(trimmedInput)
  console.log(unescapedInput)
  return unescapedInput.length
}

// difference :: string -> number
// Purpose: produces the difference of the literal length and symbol length
const difference = (input: string): number => {
  const ll = literalLength(input)
  const ss = symbolLength(input)
  return ll - ss
}

const sumOfDifferences = (input: Array<string>): number =>
  input
    .map(difference)
    .reduce((p, c) => p + c, 0)

const stars = () => { 
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const output = sumOfDifferences(input)
  console.log(output)
}

const tests = () => {
  
}

const main = () => {
  stars()
  tests()
}

main()