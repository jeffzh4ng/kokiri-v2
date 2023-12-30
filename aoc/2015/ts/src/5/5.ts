import * as assert from 'assert';
import * as fs from 'fs';

const VOWEL =  {
  a: 'a',
  e: 'e',
  i: 'i',
  o: 'o',
  u: 'u'
} as const

type Vowel = keyof typeof VOWEL

// isVowel: string -> boolean
// Purpose: Refines the consumed input to type Vowel if the value is in VOWEL
const isVowel = (input: string): input is Vowel =>
  Object.values(VOWEL).includes(input as any)

// threeVowels: string -> boolean
const threeVowels = (input: string): boolean =>
  Array.from(
  input
    .split('')
    .reduce((p, c) =>
      isVowel(c) ?
        new Map([...Array.from(p.entries()), [c as Vowel, (p.get(c as Vowel) ?? 0) + 1]]) : p
    , new Map<Vowel, number>())
    .values()
    )
    .reduce((p, c) => p + c, 0) >= 3
    

// Tests:
const threeVowelsTests = () => {
  assert.equal(threeVowels("aaa"), true)
  assert.equal(threeVowels("aei"), true)
  assert.equal(threeVowels("xazegov"), true)
  assert.equal(threeVowels("aeiouaeiouaeiou"), true)
}

// twice: string -> boolean
// Purpose: Produces true if the string contains at least one letter that appears twice in a row
const twice = (input: string): boolean =>
  input
    .split('')
    .reduce<[boolean, string]>((p, c) => [p[0] || p[1] == c, c], [false, ""])[0]

// Tests:
const twiceTests = () => {
  assert.equal(twice("aa"), true)
  assert.equal(twice("yy"), true)
  assert.equal(twice("ythequicky"), false)
  assert.equal(twice("thequicky"), false)
}

// blackList: string -> boolean
// Purpose: Produces true if the input is in the blacklist, and false o/w
const blackList = (input: string): boolean => input.includes('ab') ||
    input.includes('cd') ||
    input.includes('pq') ||
    input.includes('xy')


// Tests:
const blackListTests = () => {
  assert.equal(blackList("ab"), true)
  assert.equal(blackList("aba"), true)
  assert.equal(blackList("aaba"), true)
  assert.equal(blackList("foo"), false)
}

const isNice = (input: string): boolean => {
  return threeVowels(input) && twice(input) && !blackList(input)
}

const isNiceTests = () => {
  assert.equal(isNice("ugknbfddgicrmopn"), true)
  assert.equal(isNice("aaa"), true)
}

// twoLettersTwice: string -> boolean
// Purpose: Produces true if consumed string contains two letters twice
const twoLettersTwiceMap = (input: string): Map<string, number> =>
  input
    .split('')
    .reduce<[Map<string, number>, string]>((p, c) =>
      [new Map([
        ...Array.from(p[0].entries()),
        [`${p[1]}${c}`, (p[0].get(`${p[1]}${c}`) ?? 0) + 1]]), c]
      , [new Map<string, number>(), ""])[0]

// overlap: string -> boolean
// Purpose: produces true if needle overlaps with another instance of itself
const overlap = (haystack: string, needle: string): boolean =>
  haystack.includes(needle) ?
    haystack.indexOf(needle) + 1 === haystack.lastIndexOf(needle) :
    false


// Tests:
const overlapTests = () => {
  assert.equal(overlap("aaa", "aa"), true)
  assert.equal(overlap("xyxy", "xy"), false)
}

const twoLettersTwiceNoOverlap = (input: string): boolean =>
  Array.from(twoLettersTwiceMap(input)
    .entries())
    .filter(([_, count]) => count >= 2)
    .map(([needle, _]) => !overlap(input, needle))
    .reduce((p, c) => p || c, false)

const twoLettersTwiceTest = () => {
  assert.equal(twoLettersTwiceNoOverlap("xyxy"), true)
  assert.equal(twoLettersTwiceNoOverlap("aabcdefgaa"), true)
  assert.equal(twoLettersTwiceNoOverlap("aaa"), false)
  assert.equal(twoLettersTwiceNoOverlap("aaaxyxy"), true)
  assert.equal(twoLettersTwiceNoOverlap("aaaa"), true)
}

// alternating: string -> boolean
// Purpose: produces true if the string contains a letter with exactly one letter
//          in between
const alternating = (input: string): boolean => {
  const [found, lastAcc] = input
    .split('')
    .reduce<[boolean, string]>((p, c) =>
      [
        p[0] || (p[1].length === 3 && ((p[1][0] === p[1][2]) && (p[1][0] !== p[1][1]))),
        p[1].length < 3 ? `${p[1]}${c}` : `${p[1][1]}${p[1][2]}${c}`
      ]
    , [false, ""])

    return found || lastAcc.length === 3 && ((lastAcc[0] === lastAcc[2]) && (lastAcc[0] != lastAcc[1]))
}

// Tests:
const alternatingTests = () => {
  assert.equal(alternating("aba"), true)
  assert.equal(alternating("efe"), true)

  assert.equal(alternating("abb"), false)
  assert.equal(alternating("abaaaa"), true)
}

const isNiceImproved = (input: string): boolean =>
  twoLettersTwiceNoOverlap(input) && alternating(input)

const isNiceImprovedTests = () => {
  assert.equal(isNiceImproved("qjhvhtzxzqqjkmpb"), true)
  assert.equal(isNiceImproved("xxyxx"), true)
  assert.equal(isNiceImproved("uurcxstgmygtbstg"), false)
  assert.equal(isNiceImproved("ieodomkazucvgmuy"), false)
}


const niceCount = (input: Array<string>): number => input.filter(s => isNice(s)).length
const niceImprovedCount = (input: Array<string>): number => input.filter(s => isNiceImproved(s)).length


const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const outputOne = niceCount(input)
  const outputTwo = niceImprovedCount(input)

  console.log(outputOne)
  console.log(outputTwo)
}

const tests = () => {
  blackListTests()
  twiceTests()
  threeVowelsTests()
  isNiceTests()

  overlapTests()
  twoLettersTwiceTest()
  alternatingTests()
  isNiceImprovedTests()
}

const main = () => {
  stars()
  tests()
}

main()