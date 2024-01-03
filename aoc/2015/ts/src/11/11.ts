import * as assert from 'assert'

const hasThreeIncreasing = (input: string): boolean =>
  input
    .split('')
    .reduce<[string, boolean]>((p, c) => {
      const [acc, hasThreeIncreasing] = p

      const newAcc = `${acc}${c}`
      const trimmed = newAcc.length - 3
      const trimmedAcc = newAcc.substring(trimmed)

      if (trimmedAcc.length === 3 && !hasThreeIncreasing) {
        const codePoints = trimmedAcc.split('').map(c => c.charCodeAt(0))
        const second = codePoints[1] - codePoints[0] === 1
        const third = codePoints[2] - codePoints[1] === 1
        const increasing = second && third

        return [trimmedAcc, increasing]
      } else {
        return [trimmedAcc, hasThreeIncreasing]
      }
    }, ['', false])[1]

const hasThreeIncreasingTests = () => {
  assert.equal(hasThreeIncreasing('abcz'), true)
  assert.equal(hasThreeIncreasing('abc'), true)
  assert.equal(hasThreeIncreasing('bcd'), true)
  assert.equal(hasThreeIncreasing('cde'), true)
  assert.equal(hasThreeIncreasing('xyz'), true)
  assert.equal(hasThreeIncreasing('abd'), false)
  assert.equal(hasThreeIncreasing('acb'), false)
  assert.equal(hasThreeIncreasing('bca'), false)
  assert.equal(hasThreeIncreasing('ghjaabcc'), true)
}

const hasBlacklistedChars = (input: string): boolean =>
  input.includes('i') || input.includes('o') || input.includes('l')

const hasTwoRepeaters = (input: string): boolean => {
  const repeatedCount = input.split('').reduce<[string, number]>((p, c) => {
    const [prev, repeatedCount] = p
    if (c === prev) {
      return ['', repeatedCount + 1]
    } else {
      return [c, repeatedCount]
    }
  }, ['', 0])[1]

  return repeatedCount >= 2
}

const hasTwoRepeatersTests = () => {
  assert.equal(hasTwoRepeaters('aabb'), true)
  assert.equal(hasTwoRepeaters('aazbb'), true)
  assert.equal(hasTwoRepeaters('abbazz'), true)

  assert.equal(hasTwoRepeaters('abab'), false)
  assert.equal(hasTwoRepeaters('abba'), false)
}

// incrementPassword :: string -> string
// Purpose: produces a new password by incrementing the previous one wrt base 26
const incrementPassword = (input: string): string =>
  input
    .split('')
    .reduceRight<[string, boolean]>((p, c) => {
      const [res, carry] = p

      if (res.length === 0 || carry) {
        const offset = 'a'.charCodeAt(0)
        const newCharCode = ((c.charCodeAt(0) - offset) + 1) % 26
        const char = String.fromCharCode(newCharCode + offset)

        return char === 'a' ? [`${char}${res}`, true] : [`${char}${res}`, false]
      } else {
        return [`${c}${res}`, false]
      }

    }, ['', false])[0]

const incrementPasswordTests = () => {
  assert.equal(incrementPassword('xx'), 'xy')
  assert.equal(incrementPassword('xy'), 'xz')
  assert.equal(incrementPassword('xz'), 'ya')
  assert.equal(incrementPassword('ya'), 'yb')
}

const validPassword = (input: string): boolean =>
  hasThreeIncreasing(input) && !hasBlacklistedChars(input) && hasTwoRepeaters(input)

const nextPassword = (input: string): string => {
  let candidate = incrementPassword(input)
  while (!validPassword(candidate)) {
    candidate = incrementPassword(candidate)
    console.log(candidate)
  }

  return candidate
}

const stars = () => {
  const input = 'vzbxkghb'
  const output = nextPassword(input)
  console.log(output)
}

const tests = () => {
  const inputOne = 'abcdefgh'
  const outputOne = nextPassword(inputOne)
  console.log(outputOne)

  const inputTwo = 'ghijklmn'
  const outputTwo = nextPassword(inputTwo)
  console.log(outputTwo)

  hasThreeIncreasingTests()
  hasTwoRepeatersTests()
  incrementPasswordTests()
}

const main = () => {
  stars()
  // tests()
}
main()