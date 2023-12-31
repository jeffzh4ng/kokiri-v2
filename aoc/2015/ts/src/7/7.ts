import * as assert from 'assert'
import * as fs from 'fs'

type State = Map<Binding, number>

type Binding = string // rhs id
type Instructions = Map<Binding, Expr>
interface ParsedBinding {
  id: Binding
  expr: Expr
}

// exprs
type Expr = Id | OpTree

// identifiers, optrees
interface Id { // lhs id
  kind: "id"
  val: string
}
interface OpTree {
  kind: "optree"
  tree: UnaryOp | BinaryOp
}

// ^
// |   (values are used in exprs as atomic values)
// |
interface Value {
  kind: "value"
  val: number
}
// |
// |   (values are operands)
// v

// operators
type Operand = Id | Value // we don't have type Operand = Expr because the
                          // Operand type here denotes more of a syntax tree semantics

type UnaryOpCode = "STORE" | "NOT"
interface UnaryOp {
  cmd: UnaryOpCode
  a: Operand
}

type BinaryOpCode = "AND" | "OR" | "LSHIFT" | "RSHIFT"
interface BinaryOp {
  cmd: BinaryOpCode
  a: Operand
  b: Operand
}

// evaluate :: State Identifier -> Value
// Purpose: Produces the value associated with identifier given a state of bindings
const evaluate = (memo: State, instrs: Instructions, binding: Binding): Value => {
  if (memo.has(binding)) return {kind: "value", val: memo.get(binding)! }

  const expr = instrs.get(binding)

  switch (expr?.kind) {
    case 'id': return evaluate(memo, instrs, expr.val)
    case 'optree': {
      switch (expr.tree.cmd) {
        case 'STORE': {
          switch (expr.tree.a.kind) {
            case 'id': return evaluate(memo, instrs, expr.tree.a.val)
            case 'value': {
              memo.set(binding, expr.tree.a.val)
              return expr.tree.a // val is atomic operand
            }
          }
        }
        case 'NOT': {
          const { val: a }  = expr.tree.a.kind === 'id' ? evaluate(memo, instrs, expr.tree.a.val) : expr.tree.a
          memo.set(binding, ~a & 0xffff)
          return {
            kind: "value",
            val: ~a & 0xffff // bitwise not
          }
        }
        case 'AND': {
          const { val: a } = expr.tree.a.kind === 'id' ? evaluate(memo, instrs, expr.tree.a.val) : expr.tree.a
          const { val: b } = expr.tree.b.kind === 'id' ? evaluate(memo, instrs, expr.tree.b.val) : expr.tree.b
          memo.set(binding, a & b)

          return {
            kind: "value",
            val: a & b // bitwise and
          }
        }
        case 'OR': {
          const { val: a } = expr.tree.a.kind === 'id' ? evaluate(memo, instrs, expr.tree.a.val) : expr.tree.a
          const { val: b } = expr.tree.b.kind === 'id' ? evaluate(memo, instrs, expr.tree.b.val) : expr.tree.b
          memo.set(binding, a | b)

          return {
            kind: "value",
            val: a | b // bitwise or
          }
        }
        case 'LSHIFT': {
          const { val: a } = expr.tree.a.kind === 'id' ? evaluate(memo, instrs, expr.tree.a.val) : expr.tree.a
          const { val: b } = expr.tree.b.kind === 'id' ? evaluate(memo, instrs, expr.tree.b.val) : expr.tree.b
          memo.set(binding, a << b)

          return {
            kind: "value",
            val: a << b // bitwise left shift
          }
        } 
        case 'RSHIFT': {
          const { val: a } = expr.tree.a.kind === 'id' ? evaluate(memo, instrs, expr.tree.a.val) : expr.tree.a
          const { val: b } = expr.tree.b.kind === 'id' ? evaluate(memo, instrs, expr.tree.b.val) : expr.tree.b
          memo.set(binding, a >> b)

          return {
            kind: "value",
            val: a >> b // bitwise right shift
          }
        } 
      }
    }
    default: {
      throw new Error("invalid expr")
    }
  }
}

// parseIdentifier :: string -> string
// Purpose: Parses identifier out of consumed instruction line
const parseIdentifier = (input: string): string => input.substring(input.indexOf('>') + 2, input.length)

// parseUnaryOperand :: string UnaryCmd -> Operand
// Purpose: Parses unary operand out of consumed instruction line
const parseUnaryOperand = (input: string, cmd: UnaryOpCode): Operand => {
  const tokens = input.split(' ')
  switch (cmd) {
    case "STORE": return isNaN(parseInt(tokens[0])) ? { kind: "id", val: tokens[0] } : { kind: "value", val: parseInt(tokens[0]) }
    case "NOT": return isNaN(parseInt(tokens[1])) ? { kind: "id", val: tokens[1] } : { kind: "value", val: parseInt(tokens[1]) }
  }
}

type Side = "left" | "right"

// parseBinaryOperand :: string Side -> Operand
// Purpose: Parses the left or right operand from the input
const parseBinaryOperand = (input: string, side: Side): Operand => {
  const tokens = input.split(' ')
  const lhs: Operand = isNaN(parseInt(tokens[0])) ? { kind: "id", val: tokens[0] } : { kind: "value", val: parseInt(tokens[0]) }
  const rhs: Operand = isNaN(parseInt(tokens[2])) ? { kind: "id", val: tokens[2] } : { kind: "value", val: parseInt(tokens[2]) }

  return side === 'left' ? lhs : rhs
}

// parseInstruction :: string -> Instruction
// Purpose: Produces a parsed Instruction from the consumed string
const parseInstruction = (input: string): ParsedBinding => {
  const id = parseIdentifier(input)

  if (input.includes("NOT")) {
    return {
      id,
      expr: {
        kind: "optree",
        tree: {
          cmd: "NOT",
          a: parseUnaryOperand(input, "NOT"),
        }
      },
    }
  } else if (input.includes("AND")) {
    return {
      id,
      expr: {
        kind: "optree",
        tree: {
          cmd: "AND",
          a: parseBinaryOperand(input, "left"),
          b: parseBinaryOperand(input, "right"),
        }
      },
    }
  } else if (input.includes("OR")) {
    return {
      id,
      expr: {
        kind: "optree",
        tree: {
          cmd: "OR",
          a: parseBinaryOperand(input, "left"),
          b: parseBinaryOperand(input, "right"),
        }
      },
    }
  } else if (input.includes("LSHIFT")) {
    return {
      id,
      expr: {
        kind: "optree",
        tree: {
          cmd: "LSHIFT",
          a: parseBinaryOperand(input, "left"),
          b: parseBinaryOperand(input, "right"),
        }
      },
    }
  } else if (input.includes("RSHIFT")) {
    return {
      id,
      expr: {
        kind: "optree",
        tree: {
          cmd: "RSHIFT",
          a: parseBinaryOperand(input, "left"),
          b: parseBinaryOperand(input, "right"),
        }
      },
    }
  } else {
    return {
      id,
      expr: {
        kind: "optree",
        tree: {
          cmd: "STORE",
          a: parseUnaryOperand(input, "STORE"),
        }
      },
    }
  }
}

const stars = () => {
  const input = fs.readFileSync('./input', 'utf-8').split('\n')
  const parsedInput = input.map(line => parseInstruction(line))
  const instrs = parsedInput.reduce((p, c) => new Map([...Array.from(p.entries()), [c.id, c.expr]]), new Map<Binding, Expr>())
  const state = new Map<Binding, number>()

  const output = evaluate(state, instrs, 'a',)
  console.log(output)
}

const tests = () => {
  const input = fs.readFileSync('./input-test', 'utf-8').split('\n')
  const parsedInput = input.map(line => parseInstruction(line))
  const instrs = parsedInput.reduce((p, c) => new Map([...Array.from(p.entries()), [c.id, c.expr]]), new Map<Binding, Expr>())
  const state = new Map<Binding, number>()

  assert.equal(evaluate(state, instrs, 'y').val, 456)
  assert.equal(evaluate(state, instrs, 'x').val, 123)
  assert.equal(evaluate(state, instrs, 'd').val, 72)
  assert.equal(evaluate(state, instrs, 'e').val, 507)
  assert.equal(evaluate(state, instrs, 'f').val, 492)
  assert.equal(evaluate(state, instrs, 'g').val, 114)
  assert.equal(evaluate(state, instrs, 'h').val, 65412)
  assert.equal(evaluate(state, instrs, 'i').val, 65079)
}

const main = () => {
  stars()
  tests()
}
main()