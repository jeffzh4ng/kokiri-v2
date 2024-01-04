import * as crypto from 'crypto'

// mineMD5ForFive: -> number
// Purpose: Produces the first index where md5(puzzle + index) results in a hash
//          with five zeros, in base 16
const mineMD5ForFive = (): number => {
  const prefix = 'yzbqklnj'
  let i = 0
  
  while (true) {
    const hash =  crypto.createHash('md5').update(`${prefix}${i}`).digest('hex')
    if (hash.substring(0, 5) === '00000') {
      return i
    }

    i += 1
  }
}

// mineMD5ForSix: -> number
// Purpose: Produces the first index where md5(puzzle + index) results in a hash
//          with six zeros, in base 16
const mineMD5ForSix = (): number => {
  const prefix = 'yzbqklnj'
  let i = 0
  
  while (true) {
    const hash =  crypto.createHash('md5').update(`${prefix}${i}`).digest('hex')
    if (hash.substring(0, 6) === '000000') {
      return i
    }

    i += 1
  }
}


const stars = () => {
  const outputOne = mineMD5ForFive()
  const outputTwo = mineMD5ForSix()

  console.log(outputOne)
  console.log(outputTwo)
}

const tests = () => {

}

const main = () => {
  stars()
  tests()
}

main()