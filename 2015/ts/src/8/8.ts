import * as assert from 'assert';
import * as fs from 'fs';

// hexStringToAscii :: string -> string
// Purpose: produces the ascii character associated with the hex encoded input
const hexStringToAscii = (input: string): string => String.fromCharCode(parseInt(input, 16));

// decode :: string -> string
// Purpose: Produces a decoded string
const decode = (input: string): string => {
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

// encode :: string -> string
// Purpose: produces an encoded string
const encode = (input: string): string =>
  input
    .split('')
    .reduce((p, c) => {
      const escToken = '\\'
      const quoteToken = '\"'

      if (c === quoteToken || c === escToken) {
        return `${p}\\${c}`
      } else {
        return `${p}${c}`
      }
    }, '')


const encodeTests = () => {
  assert.equal(encode("\"\""), "\\\"\\\"")
  assert.equal(encode("\"abc\""), "\\\"abc\\\"")
  assert.equal(encode("\"aaa\\\"aaa\""), "\\\"aaa\\\\\\\"aaa\\\"")
  assert.equal(encode("\"\\x27\""), "\\\"\\\\x27\\\"")
}

// countSymbolLength :: string -> number
// Purpose: produces the symbol length
const decodedLength = (input: string): number => {
  const trimmedInput = input.substring(1, input.length - 1)
  const unescapedInput = decode(trimmedInput)
  return unescapedInput.length
}

// difference :: string -> number
// Purpose: produces the difference of the encoded (literal) length and decoded (symbol) length
const literalLessDecoded = (input: string): number => {
  const ll = input.length
  const dl = decodedLength(input)
  return ll - dl
}

const sumOfDifferences = (input: Array<string>, f: (input: string) => number): number =>
  input
    .map(f)
    .reduce((p, c) => p + c, 0)

const encodedLessLiteral = (input: string): number => {
  const encoded = ['"', ...Array.from(encode(input).split('')), '"'].join('')
  const el = encoded.length
  const ll = input.length
  return el - ll
}

const stars = () => { 
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const outputOne = sumOfDifferences(input, literalLessDecoded)
  const outputTwo = sumOfDifferences(input, encodedLessLiteral)
  console.log(outputOne)
  console.log(outputTwo)
}

const tests = () => {
  encodeTests()
}

const main = () => {
  stars()
  tests()
}

main()