import * as assert from 'assert'
import * as fs from 'fs'

// state
type LightState = number
type Row = Array<LightState>
type Grid = Array<Row>

// instruction
type Coordinate = [number, number]
type Command = 'on' | 'off' | 'toggle'
interface Instruction {
  cmd: Command,
  start: Coordinate,
  stop: Coordinate
}

// applyCommand :: LightState, Command -> LightState
// Purpose: produces a new light state after applying command
const applyCommand = (cell: LightState, cmd: Command): LightState => {
  switch (cmd) {
    case 'on': return cell + 1
    case 'off': (cell - 1 < 0) ? 0 : cell - 1
    case 'toggle': return cell + 2
  }
}

// evalInstruction: Row, Instruction -> Row
// Purpose: Produces a new row after evaluating instruction
const evalInstructionOnRow = (row: Row, ins: Instruction): Row =>
  row.map((cell, colIndex) =>
    (ins.start[1] <= colIndex && colIndex <= ins.stop[1]) ?
      applyCommand(cell, ins.cmd) : cell
  )

const evalInstructionOnRowTests = () => {
  const ins: Instruction = {
    cmd: 'on',
    start: [0, 0],
    stop: [9, 9]
  }

  const expected = [...Array(10).fill(1), ...Array(990).fill(0)]
  const actual = evalInstructionOnRow(Array(1000).fill(0), ins)

  assert.deepEqual(expected, actual)
}

// evalInstruction: Grid, Instruction -> Grid
// Purpose: Produces a new grid after evaluating instruction
const evalInstructionOnGrid = (grid: Grid, ins: Instruction): Grid =>
  grid.map((row, rowIndex) =>
    (ins.start[0] <= rowIndex && rowIndex <= ins.stop[0]) ?
      evalInstructionOnRow(row, ins) : row
  )

// evalInstructionsOnGrid :: Grid -> Array<Instruction> -> Grid
const evalInstructionsOnGrid = (grid: Grid, ins: Array<Instruction>): Grid =>
  ins.reduce((p, c) => evalInstructionOnGrid(p, c), grid)

// lightCount :: Grid -> number
// Purpose: Produce the number of lights turned on
const lightCount = (grid: Grid): number =>
  grid
    .map(r =>((row: Row): number => row.reduce<number>((p, c) => p + c, 0))(r))
    .reduce((p, c) => p + c, 0)

// parseCommand :: string -> Command
// Purpose: produces the parsed command from the input string
const parseCommand = (input: string): Command =>
  input.includes('turn on') ? 'on' :
    input.includes('turn off') ? 'off' :
      'toggle'

// parseStartCoordinate: string -> [Coordinate, Coordinate]
// Purpose: Parses the start and stop coordinates from the consumed string
const parseCoordinates = (input: string): [Coordinate, Coordinate] => {
  const cmd = input.includes('turn on') ? 'turn on ' :
                input.includes('turn off ') ? 'turn off' :
                  'toggle '
  const trimmedInput = input.replace(cmd, '')
  const firstSeparator = trimmedInput.indexOf(',')
  const lastSeparator = trimmedInput.lastIndexOf(',')
  const throughSeperator = trimmedInput.indexOf('through')

  const xStart = parseInt(trimmedInput.substring(0, firstSeparator))
  const yStart = parseInt(trimmedInput.substring(firstSeparator+1, throughSeperator-1))

  const xStop = parseInt(trimmedInput.substring(throughSeperator + 'through'.length + 1, lastSeparator))
  const yStop = parseInt(trimmedInput.substring(lastSeparator+1))

  return [[xStart, yStart], [xStop, yStop]]
}

const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const parsedInput: Array<Instruction> = input.map(line => ({
    cmd: parseCommand(line),
    start: parseCoordinates(line)[0],
    stop: parseCoordinates(line)[1]
  }))

  const output = lightCount(evalInstructionsOnGrid(
    [...Array(1000)].map(_ => Array(1000).fill(0)),
    parsedInput))
  console.log(output)
}

const tests = () => {
  evalInstructionOnRowTests()
}

const main = () => {
  stars()
  tests()
}
main()