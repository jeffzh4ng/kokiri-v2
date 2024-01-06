import * as fs from 'fs'

const foo = (input: Object) => {
  console.log(input)
}

const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8')
  const parsedInput = JSON.parse(input)
  foo(parsedInput)
}

const tests = () => {

}

const main = () => {
  stars()
  tests()
}
main()