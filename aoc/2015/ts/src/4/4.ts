import * as crypto from 'crypto'

// mineMD5: -> number
// Purpose: Produces the first index where md5(puzzle + index) results in a hash
//          with five zeros, in base 16
const mineMD5 = (): number => {
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


const stars = () => {
  const output = mineMD5()
  console.log(output)
}

const tests = () => {

}

const main = () => {
  stars()
  tests()
}

main()