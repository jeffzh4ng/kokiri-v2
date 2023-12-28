import * as fs from 'fs'

type Direction = "up" | "right" | "down" | "left"

type Coordinate = [number, number]
type DeliveryMap = Map<string, number>
interface DeliveryInfo {
  map: DeliveryMap,
  coord: Coordinate
}

const serializeCoord = (coord: Coordinate): string => `${coord[0]}${coord[1]}`

// deliverByCoord: DeliveryInfo, Direction -> DeliveryInfo
// Purpose: Produces a new DeliveryInfo based on the consumed Direction
const deliverByCoord = (info: DeliveryInfo, cur: Direction): DeliveryInfo => {
  const coord = info.coord
  
  if (cur == "up") {
    coord[1] += 1
  } else if (cur == "right") {
    coord[0] += 1
  } else if (cur == "down") {
    coord[1] -= 1
  } else if (cur == "left") {
    coord[0] -= 1
  }

  const map = info.map
  const serializedCoord = serializeCoord(coord)

  if (map.has(serializedCoord)) {
    map.set(serializedCoord, map.get(serializedCoord)! + 1)
  } else {
    map.set(serializedCoord, 1)
  }

  return {
    map,
    coord
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

  if (!(deliveryInfo.map.has("01") && deliveryInfo.map.get("01") == 1)) {
    console.log('test 1.2 failed')
  }

  console.log('test 1 passed')
}

// deliverByDirections: Array<Direction> -> DeliveryMap
// Purpose: Produces a delivered map derived from the consumed directions
const deliverByDirections = (input: Array<Direction>): DeliveryMap => {
  const init: DeliveryInfo = {map: new Map(), coord: [0, 0]};
  const delivered = input.reduce(deliverByCoord, init)
  return delivered.map
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