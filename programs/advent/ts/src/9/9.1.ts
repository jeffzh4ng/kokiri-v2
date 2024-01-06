import * as assert from 'assert'
import * as fs from 'fs'

type Cost = number
type ParsedLine = [From, To, Cost]

type From = string
type To = string
type Path = [To, number]
type PathMap = Map<From, Array<Path>>

// insertEverywhere: 1, [] -> [1]
// insertEverywhere: 2, [1] -> [[1, 2], [2, 1]]
//                            /
//                          /
//                        /
// insertEverywhere: 3, [1, 2] -> [[1, 2, 3], [1, 3, 2], [3, 1, 2]]


const insertEverywhere = (x: string, list: Array<string>): Array<Array<string>> => {
  if (list.length === 0) {
    return [[x]]
  } else {
    const [f, r] = [list[0], list.slice(1)]


  }
}

const pathPermutationsHelper = (input: Array<string>): Array<Array<string>> => {
  if (input.length === 0) {
    return []
  } else {
    const [f, r] = [input[0], input.slice(1)]

    return pathPermutationsHelper(r).flatMap(p => insertEverywhere(f, p))
  }
}

// pathPermutations :: PathMap -> Array<string>
// Purpose: produces a list of all permutations of the cities in PathMap
const pathPermutations = (input: PathMap): Array<Array<string>> =>
  pathPermutationsHelper(
    Array.from(input.entries())
      .map(e => e[0]))

const testPathPermutations = () => {
  const input: PathMap = new Map([
    ['London', [['Dublin', 464], ['Belfast', 518]]],
    ['Dublin', [['London', 464], ['Belfast', 141]]],
    ['Belfast', [['London', 518], ['Dublin', 141]]],
  ])

  const expected = [
    ['London', 'Dublin', 'Belfast'],
    ['London', 'Belfast', 'Dublin'],
    ['Dublin', 'London', 'Belfast'],
    ['Dublin', 'Belfast', 'London'],
    ['Belfast', 'London', 'Dublin'],
    ['Belfast', 'Dublin', 'London']
  ]

  assert.deepEqual(pathPermutations(input), expected)
}

// pathMap :: Array<ParsedLine> -> PathMap
// Purpose: produces an undirected graph as a PathMap from an Array<ParsedLine>
const pathMap = (input: Array<ParsedLine>): PathMap =>
  input.reduce((p, c) => {
    const [from, to, cost] = c
    const fromPaths = p.get(from) || []
    const toPaths = p.get(to) || []

    const newFromPaths = [...fromPaths, [to, cost]]
    const newToPaths = [...toPaths, [to, cost]]

    const newMap = new Map([
      ...Array.from(p.entries()),
      [from, newFromPaths],
      [to, newToPaths]
    ])

    return newMap
  }, new Map())


const pathMapTests = () => {
  const input: Array<ParsedLine> = [
    ['London', 'Dublin', 464],
    ['London', 'Belfast', 518],
    ['Dublin', 'Belfast', 141]
  ]

  const expected = new Map([
    ['London', [['Dublin', 464], ['Belfast', 518]]],
    ['Dublin', [['London', 464], ['Belfast', 141]]],
    ['Belfast', [['London', 518], ['Dublin', 141]]],
  ])

  assert.deepEqual(pathMap(input).entries(), expected.entries())
}

// parseInput :: string -> Foo
// Purpose: parses an input line to Foo
const parseInput = (input: string): ParsedLine => {
  const foo = input.split(' ')
  return [foo[0], foo[2], parseInt(foo[foo.length - 1])]
}

const stars = () => {
}

const tests = () => {
  const input = fs.readFileSync('input-test', 'utf-8').split('\n')
  const parsedInput = input.map(i => parseInput(i))
  const pm = pathMap(parsedInput)

  pathMapTests()

  console.log(pm)
}


const main = () => {
  stars()
  tests()
}

main()