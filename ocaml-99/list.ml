let rec last l =
  match l with
  | [] -> None
  | [x] -> Some x
  | _ :: r -> last r

let rec last_two l =
  match l with
  | [] -> None
  | [_] -> None
  | [x; y] -> Some(x, y)
  | _ :: r -> last_two r

let rec nth l n =
  match l with
  | [] -> None
  | f :: r -> if n = 0 then Some f else nth r (n-1)

let rec length l =
  match l with
  | [] -> 0
  | _ :: r -> 1 + length r

let rec rev l =
  match l with
  | [] -> []
  | f :: r -> (rev r) @ [f]

let is_palindrome l = l = rev l