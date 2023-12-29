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
        new Map([...Array.from(p.entries()), [c as Vowel, (p.get(c as Vowel) || 0) + 1]]) : p
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


const niceCount = (input: Array<string>): number => input.filter(s => isNice(s)).length

const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const output = niceCount(input)
  console.log(output)
}

const tests = () => {
  blackListTests()
  twiceTests()
  threeVowelsTests()
  isNiceTests()
}

const main = () => {
  stars()
  tests()
}

main()