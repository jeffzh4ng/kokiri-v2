import * as fs from 'fs'

const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  console.log(input)
}

const tests = () => { }

const main = () => {
  stars()
  tests()
}
main()