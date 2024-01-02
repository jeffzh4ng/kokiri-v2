import * as assert from 'assert'

// lookAndSay :: number -> number
// Purpose: produces the look-and-say number of the consumed input
const lookAndSay = (input: string): string => {
  const pass = input
    .split('')
    .reduce<[string, string, number]>((p, c, i) => {
      const [res, acc, count] = p
      const last = i === input.length - 1

      if (c === acc) { // look
        const newP: [string, string, number] = [res, acc, count + 1]
        return newP
      } else { // say
        const say = `${count}${acc}`
        const newP: [string, string, number] = [`${res}${say}`, c, 1]
        return newP
      }
    }, ['', input[0], 0])

  const finalPass = pass[0] + `${pass[2]}${pass[1]}`
  return finalPass
}

const lookAndSayTests = () => {
  assert.equal(lookAndSay('1'), '11')
  assert.equal(lookAndSay('11'), '21')
  assert.equal(lookAndSay('21'), '1211')
  assert.equal(lookAndSay('1211'), '111221')
  assert.equal(lookAndSay('111221'), '312211')
}

const lookAndSayN = (input: string, n: number): string =>
  Array(n)
    .fill(0)
    .reduce((p, _) => lookAndSay(p), input)


const stars = () => {
  const input = 1113222113
  const output = lookAndSayN(input.toString(), 40)
  console.log(output.length)
}

const tests = () => {
  lookAndSayTests()
}

const main = () => {
  stars()
  tests()
}

main()