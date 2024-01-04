import * as fs from 'fs'

type Speed = number // km/s
type FlyDuration = number // s
type RestDuration = number // s

interface DeerInfo {
  speed: Speed,
  flyDuration: FlyDuration,
  restDuration: RestDuration
}

type Deer = string
type DeerMap = Map<Deer, DeerInfo>

interface Status {
  kind: string,
  durationLeft: number
}

interface Flying {
  kind: "flying"
  durationLeft: FlyDuration
}

interface Resting {
  kind: "resting"
  durationLeft: RestDuration
}

interface DeerStateInfo {
  distance: number
  status: Status
}
type DeerState = Map<Deer, DeerStateInfo>

const tickN = (state: DeerState, map: DeerMap, n: number): DeerState =>
  Array(n)
    .fill(0)
    .reduce((p, _) => {
      const foo = tick(p, map)
      console.log(foo)
      return foo
    }
      , state)

// tick :: DeerState -> DeerMap -> DeerState
// Purpose: produces the state associated with the next tick
const tick = (state: DeerState, map: DeerMap): DeerState =>
  Array.from(
    state.entries())
    .reduce((p, c) => {
      const [deer, deerStateInfo] = c

      const status = deerStateInfo.status.kind
      let newStateInfo: DeerStateInfo

      if (status === 'flying') {
        const newDistance = deerStateInfo.distance + map.get(deer)?.speed!
        const newStatus = deerStateInfo.status.durationLeft === 1 ? {
          kind: "resting",
          durationLeft: map.get(deer)?.restDuration! // assuming input is valid
        } : {
          kind: "flying",
          durationLeft: deerStateInfo.status.durationLeft - 1
        }

        newStateInfo = {
          distance: newDistance,
          status: newStatus
        }
      } else { // state is 'resting'
        const newStatus = deerStateInfo.status.durationLeft === 1 ? {
          kind: "flying",
          durationLeft: map.get(deer)?.flyDuration! // assuming input is valid
        } : {
          kind: "resting",
          durationLeft: deerStateInfo.status.durationLeft - 1
        }

        newStateInfo = {
          distance: deerStateInfo.distance, // does not change
          status: newStatus
        }
      }

      const newEntry: [Deer, DeerStateInfo] = [deer, newStateInfo]
      const newMap = new Map([...Array.from(p.entries()), newEntry])

      return newMap
    }, new Map())

const initializeState = (map: DeerMap): DeerState =>
  Array.from(
    map.entries())
    .reduce((p, c) => {
      const [deer, deerInfo] = c
      const deerStateInfo: DeerStateInfo = {
        distance: 0,
        status: {
          kind: "flying",
          durationLeft: deerInfo.flyDuration
        }
      }

      const newEntry: [string, DeerStateInfo] = [deer, deerStateInfo]
      const newMap = new Map([...Array.from(p.entries()), newEntry])

      return newMap
    }, new Map())

const parseLine = (input: string): [Deer, DeerInfo] => {
  const tokens = input.split(' ')
  const deer = tokens[0]
  const nums = tokens
    .filter(t => !Number.isNaN(parseInt(t)))
    .map(n => parseInt(n))
  if (nums.length != 3) throw new Error() // assuming input is valid

  const [speed, flyDuration, restDuration] = [nums[0], nums[1], nums[2]]
  return [deer, {
    speed,
    flyDuration,
    restDuration,
  }]
}

const parseInput = (input: Array<string>): DeerMap =>
  input.reduce((p, c) => {
    const newEntry = parseLine(c)
    const newMap = new Map([...Array.from(p.entries()), newEntry])

    return newMap
  }, new Map())

const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const parsedInput = parseInput(input)

  const state = initializeState(parsedInput)
  const output = tickN(state, parsedInput, 2503)

  console.log(output)
}

const tests = () => {
  const input = fs.readFileSync('./input-test', 'utf-8').split('\n')
  const parsedInput = parseInput(input)

  const state = initializeState(parsedInput)
  const output = tickN(state, parsedInput, 1000)

  console.log(output)
}

const main = () => {
  stars()
  // tests()
}
main()