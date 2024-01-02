(* exercise 1 *)
let e1x = 7 * (1 + 2 + 3)
let e1y = "CS" ^ string_of_int 3110

(* exercise 2 *)
let e2x = 42 * 10
let e2y = 3.14 *. 2.0
let e2z = 4.2 *. 4.2 *. 4.2 *. 4.2 *. 4.2 *. 4.2 *. 4.2

(* exercise 3 *)
let e3x = 42 = 42
let e3y = "hi" = "hi"
let e3z = "hi" == "hi"

(* exercise 4 *)
let e4x = if 2 > 1 then 42 else 7

(* exercise 5 *)
let double x = x * 2
let _ = assert (double 7 = 14)

(* exercise 6 *)
let cube x = x *. x *.x
let _ = assert (cube 1.1 = 1.33100000000000041)
let _ = assert (cube 2.1 = 9.26100000000000101)

let sign x =
  if x > 0 then 1
  else if x < 0 then -1
  else 0

let _ = assert (sign 8 = 1)
let _ = assert (sign 9 = 1)
let _ = assert (sign (-1000) = -1)
let _ = assert (sign 0 = 0)

(* exercise 7 *)
let area r =
  3.14 *. r *. r
let _ = assert ((area 4.) -. 50.24 <= 0.0001)
let _ = assert ((area 2.) -. 12.56636 <= 0.0001)

(* exercise 8 *)
let rms x y =
  sqrt(((x *. x) +. (y *. y)) /. 2.)

let _ = assert ((rms 3. 4.) -. 3.53553391 <= 0.0001)
let _ = assert ((rms 5. 6.) -. 5.52268051 <= 0.0001)

(* exercise 9 *)
let valid_date d m =
  match m with
  | "Jan" | "Mar" | "May" | "Jul" | "Aug" | "Oct" | "Dec" -> d >= 1 && d <= 31
  | "Apr" | "Jun" | "Sep" | "Nov" -> d >= 1 && d <= 30
  | _ -> d >= 1 && d <= 28 

(* exercise 10 *)
let rec fib n =
  match n with
  | 1 -> 1
  | 2 -> 1
  | n -> fib (n-1) + fib (n-2)