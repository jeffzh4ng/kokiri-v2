let rec last = function
  | [] -> None
  | [x] -> Some x
  | _ :: r -> last r

let rec last_pair = function
  | [] -> None
  | [x; y] -> Some (x, y)
  | _ :: r -> last_pair r

let rec nth l x =
  match l with
  | [] -> None
  | f :: r -> if x = 0 then Some f else nth r (x-1)

let rec length l =
  match l with
  | [] -> 0
  | _ :: r -> 1 + length r