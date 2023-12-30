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
  if (threeVowels("aaa")) {
    console.log('test 15 passed')
  } else {
    console.log('test 15 failed')
  }


  if (threeVowels("aei")) {
    console.log('test 9 passed')
  } else {
    console.log('test 9 failed')
  }

  if (threeVowels("xazegov")) {
    console.log('test 10 passed')
  } else {
    console.log('test 10 failed')
  }

  if (threeVowels("aeiouaeiouaeiou")) {
    console.log('test 11 passed')
  } else {
    console.log('test 11 failed')
  }
}

// twice: string -> boolean
// Purpose: Produces true if the string contains at least one letter that appears twice in a row
const twice = (input: string): boolean =>
  input
    .split('')
    .reduce<[boolean, string]>((p, c) => [p[0] || p[1] == c, c], [false, ""])[0]

// Tests:
const twiceTests = () => {
  if (twice("aa")) {
    console.log('test 5 passed')
  } else {
    console.log('test 5 failed')
  }

  if (twice("yy")) {
    console.log('test 6 passed')
  } else {
    console.log('test 6 failed')
  }

  if (!twice("ythequicky")) {
    console.log('test 7 passed')
  } else {
    console.log('test 7 failed')
  }

  if (!twice("thequicky")) {
    console.log('test 8 passed')
  } else {
    console.log('test 8 failed')
  }
}

// blackList: string -> boolean
// Purpose: Produces true if the input is in the blacklist, and false o/w
const blackList = (input: string): boolean => input.includes('ab') ||
    input.includes('cd') ||
    input.includes('pq') ||
    input.includes('xy')


// Tests:
const blackListTests = () => {
  // do no harm
  if (blackList("ab") == true) {
    console.log('test 1 passed')
  } else {
    console.log('test 1 failed')
  }

  if (blackList("aba") == true) {
    console.log('test 2 passed')
  } else {
    console.log('test 2 failed')
  }

  if (blackList("aaba") == true) {
    console.log('test 3 passed')
  } else {
    console.log('test 3 failed')
  }

  if (blackList("foo") == false) {
    console.log('test 4 passed')
  } else {
    console.log('test 4 failed')
  }
}

const isNice = (input: string): boolean => {
  return threeVowels(input) && twice(input) && !blackList(input)
}

const isNiceTests = () => {
  if (isNice("ugknbfddgicrmopn")) {
    console.log('test 13 passed')
  } else {
    console.log('test 13 failed')    
  }

  if (isNice("aaa")) {
    console.log('test 14 passed')
  } else {
    console.log(
      threeVowels('aaa'), twice('aaa'), !blackList('aaa')
    )
    console.log('test 14 failed')    
  }
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
  if (overlap("aaa", "aa")) {
    console.log('test 16 passed')
  } else {
    console.log('test 16 failed')
  }

  if (!overlap("xyxy", "xy")) {
    console.log('test 17 passed')
  } else {
    console.log('test 17 failed')
  }
}

const twoLettersTwiceNoOverlap = (input: string): boolean =>
  Array.from(twoLettersTwiceMap(input)
    .entries())
    .filter(([_, count]) => count >= 2)
    .map(([needle, _]) => !overlap(input, needle))
    .reduce((p, c) => p || c, false)

const twoLettersTwiceTest = () => {
  if (twoLettersTwiceNoOverlap("xyxy")) {
    console.log('test 18 passed')
  } else {
    console.log('test 18 failed')
  }

  if (twoLettersTwiceNoOverlap("aabcdefgaa")) {
    console.log('test 19 passed')
  } else {
    console.log('test 19 failed')
  }

  if (!twoLettersTwiceNoOverlap("aaa")) {
    console.log('test 20 passed')
  } else {
    console.log('test 20 failed')
  }

  if (twoLettersTwiceNoOverlap("aaaxyxy")) {
    console.log('test 21 passed')
  } else {
    console.log('test 21 failed')
  }

  if (twoLettersTwiceNoOverlap("aaaa")) {
    console.log('test 22 passed')
  } else {
    console.log('test 22 failed')
  }
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
  if (alternating("aba")) {
    console.log('test 23 passed')
  } else {
    console.log('test 23 failed')
  }

  if (alternating("efe")) {
    console.log('test 24 passed')
  } else {
    console.log('test 24 failed')
  }

  if (!alternating("abb")) {
    console.log('test 25 passed')
  } else {
    console.log('test 25 failed')
  }

  if (alternating("abaaaa")) {
    console.log('test 26 passed')
  } else {
    console.log('test 26 failed')
  }
}

const isNiceImproved = (input: string): boolean =>
  twoLettersTwiceNoOverlap(input) && alternating(input)

const isNiceImprovedTests = () => {
  if (isNiceImproved("qjhvhtzxzqqjkmpb")) {
    console.log('test 27 passed')
  } else {
    console.log('test 27 failed')
  }

  if (isNiceImproved("xxyxx")) {
    console.log('test 28 passed')
  } else {
    console.log('test 28 failed')
  }
  
  if (!isNiceImproved("uurcxstgmygtbstg")) {
    console.log('test 29 passed')
  } else {
    console.log('test 29 failed')
  }

  if (!isNiceImproved("ieodomkazucvgmuy")) {
    console.log('test 30 passed')
  } else {
    console.log('test 30 failed')
  }
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