import * as fs from 'fs'

type Path = [string, string, number]

type From = string
type To = [string, number]
type State =  Map<From, Array<To>>

// buildState :: Array<Path> -> State
// Purpose: builds state from a list of paths
const buildState = (input: Array<Path>): State =>
  input.reduce((p, c) => {
    const [from, to, cost] = c
    const pathsForFrom: Array<To> = [...p.get(from) || [], [to, cost]]
    const newState = new Map([...Array.from(p.entries()), [from, pathsForFrom]])

    return newState
  }, new Map<From, Array<To>>())

// sortTos :: Array<To> -> Array<To>
// Purpose: sorts a list of path from cheapest to most expensive
const sortTos = (tos: Array<To>): Array<To> =>
  [...tos].sort((a, b) => a[1] - b[1])

// cheapestRouteFromStart :: State From -> Array<From>
// Purpose: produces the cheapest route that hits all cities given a starting city
const cheapestRouteFromStart = (unseen: State, seen: Set<From>, start: From): Array<From> => {
  const tos = unseen.get(start)
  if (tos === undefined) return [start]

  // 1. unseen--
  const newUnseen = new Map(Array.from(unseen.entries()).filter(([f, t]) => f !== start))

  // 2. seen++
  const newSeen = new Set([...Array.from(seen.values()), start])
  const unseenTos = sortTos(tos).filter(to => !seen.has(to[0])) // invariant 1

  for (const t of unseenTos) {
    // 3. newStart
    const newStart = t[0]
    const path = cheapestRouteFromStart(newUnseen, newSeen, newStart) // recur
    const illegalPath = path.length != Array.from(unseen.entries()).length
    if (illegalPath) continue // invariant 2

    return [start, ...path]
  }

  // all paths from current node are illegal
  // return illegal path and let parent call filter out current path
  return [start, ...cheapestRouteFromStart(newUnseen, newSeen, unseenTos[0][0])]

}

// cheapestRouteFromStart recurs on one node at a time
// so we lose the cost information
// -> we can't return Array<[From, Cost]> because we don't have access
//    to cost at the base case

// -> we can refactor, or right a calculateCost function like below

// calculateCost :: State Array<From> -> number
// Purpose: produces the cost associated with the route
const calculateCost = (state: State, route: Array<From>): number => {
  const pairs = route.slice(1).reduce<[Array<[From, From]>, From]>((p, c) => {
    const pair: [From, From] = [p[1], c]
    return [[...p[0], pair], c]

  }, [[], route[0]])[0]

  const cost = pairs.reduce((p, c) => {
    const [f, t] = c
    const ts = state.get(f)
    if (ts === undefined) throw new Error()


    const matchingT = ts.filter(pt => pt[0] === t)[0]
    const cost = matchingT[1]

    return p + cost
  }, 0)

  return cost
}

const cheapestRouteOverall = (state: State): number =>
  Array
    .from(state.entries())
    .map(([f, _]) => cheapestRouteFromStart(state, new Set(), f))
    .filter(r => r.length === Array.from(state.entries()).length + 1)
    .map(r => calculateCost(state, r))
    .reduce((p, c) => Math.min(p, c), Number.MAX_SAFE_INTEGER)

// parseInput :: string -> Foo
// Purpose: parses an input line to Foo
const parseInput = (input: string): Path => {
  const foo = input.split(' ')
  return [foo[0], foo[2], parseInt(foo[foo.length-1])]
}

const stars = () => {
  const input = fs.readFileSync('input', 'utf-8').split('\n')
  const parsedInput = input.map(i => parseInput(i))
  const state = buildState(parsedInput)
  const output = cheapestRouteOverall(state)
  
  console.log(output)
}

const tests = () => {
  const input = fs.readFileSync('input-test', 'utf-8').split('\n')
  const parsedInput = input.map(i => parseInput(i))
  const state = buildState(parsedInput)
  const output = cheapestRouteOverall(state)
  
  console.log(output)
}


const main = () => {
  stars()
  tests()
}

main()