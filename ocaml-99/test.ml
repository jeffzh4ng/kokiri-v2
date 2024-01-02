open OUnit2
open List

let tests = "test suite for sum" >::: [
  "1.1" >:: (fun _ -> assert_equal (Some "d") (last ["a" ; "b" ; "c" ; "d"]));
  "1.2" >:: (fun _ -> assert_equal None (last []));
  "2.1" >:: (fun _ -> assert_equal (Some ("c", "d")) (last_two ["a" ; "b" ; "c" ; "d"]));
  "2.2" >:: (fun _ -> assert_equal None (last_two ["a"]));
  "3.1" >:: (fun _ -> assert_equal (Some 3) (nth [1; 2; 3; 4] 2));
  "3.2" >:: (fun _ -> assert_equal None (nth [] 2));
  "4.1" >:: (fun _ -> assert_equal 3 (length [1; 2; 3]));
  "4.2" >:: (fun _ -> assert_equal 0 (length []));
  "5.1" >:: (fun _ -> assert_equal [3; 2; 1] (rev [1; 2; 3]));
  "5.2" >:: (fun _ -> assert_equal [] (rev []));
  "6.1" >:: (fun _ -> assert_equal true (is_palindrome []));
  "6.2" >:: (fun _ -> assert_equal true (is_palindrome [1; 2; 3; 2; 1]));
  "6.3" >:: (fun _ -> assert_equal false (is_palindrome [1; 2; 3]));
]
let _ = run_test_tt_main tests