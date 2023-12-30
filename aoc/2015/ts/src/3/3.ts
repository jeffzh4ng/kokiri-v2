import * as fs from 'fs'

type Direction = "up" | "right" | "down" | "left"

type Coordinate = [number, number]
type DeliveryMap = Map<string, number>
interface DeliveryInfo {
  map: DeliveryMap,
  coord: Coordinate
}

const serializeCoord = (coord: Coordinate): string => `${coord[0]},${coord[1]}`

const move = (coord: Coordinate, direction: Direction): Coordinate => {
  switch (direction) {
    case "up": return [coord[0], coord[1] + 1];
    case "right": return [coord[0] + 1, coord[1]];
    case "down": return [coord[0], coord[1] - 1];
    case "left": return [coord[0] - 1, coord[1]];
  }
}

// deliverByCoord: DeliveryInfo, Direction -> DeliveryInfo
// Purpose: Produces a new DeliveryInfo based on the consumed Direction
const deliverByCoord = (info: DeliveryInfo, dir: Direction): DeliveryInfo => {
  const newCoord = move(info.coord, dir)
  const serializedCoord = serializeCoord(newCoord)
  const visits = info.map.get(serializedCoord) ?? 0;

  const newMap = new Map(info.map);
  newMap.set(serializedCoord, visits + 1);

  return {
    map: newMap,
    coord: newCoord
  }
}

const deliveryByCoordTests = () => {
  const info: DeliveryInfo = {
    map: new Map<string, number>(),
    coord: [0, 0]
  }

  const direction = "up"
  const deliveryInfo = deliverByCoord(info, direction)

  if (deliveryInfo.coord[0] != 0 && deliveryInfo.coord[1] != 1) {
    console.log('test 1.1 failed')
  }

  if (!(deliveryInfo.map.has("0,1") && deliveryInfo.map.get("0,1") == 1)) {
    console.log('test 1.2 failed')
  }

  console.log('test 1 passed')
}

// deliverByDirections: Array<Direction> -> DeliveryMap
// Purpose: Produces a delivered map derived from the consumed directions
const deliverByDirections = (input: Array<Direction>): DeliveryMap => {
  const init: DeliveryInfo = {map: new Map(), coord: [0, 0]};

  const santaDelivered = input.filter((_, i) => i % 2 == 0)
                              .reduce(deliverByCoord, init)

  const turboDelivered = input.filter((_, i) => i % 2 != 0)
                              .reduce(deliverByCoord, init)

  
  const mergedDeliveries = new Map([
    ...Array.from(santaDelivered.map.entries()),
    ...Array.from(turboDelivered.map.entries())
  ])

  return mergedDeliveries
}

const countUniqueDeliveries = (input: Array<Direction>): number => {
  const deliveredMap = deliverByDirections(input)
  const unique = Array.from(deliveredMap.values()).length
  return unique
}

const stars = () => {
  const input = fs.readFileSync('input', 'utf-8')
  const parsedInput = input.split('').map(c => {
    if (c == '^') {
      return "up"
    } else if (c == '>') {
      return "right"
    } else if (c == 'v') {
      return "down"
    } else if (c == '<') {
      return "left"
    } else {
      throw new Error("")
    }
  })
  
  const output = countUniqueDeliveries(parsedInput)
  console.log(output)
}

const main = () => {
  stars()
  deliveryByCoordTests()
}

main()