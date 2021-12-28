import { get_parsed_args_from_url_query_string } from "./get_parsed_args_from_url_query_string.ts";

import { assert } from "https://deno.land/std@0.119.0/testing/asserts.ts";





interface Baz
{
  qux : number,
  quz : string
}

function is_Baz(obj : any) : obj is Baz
{
  return (
    (Object.keys(obj).length == 2) &&
    obj.hasOwnProperty("qux") &&
    ((typeof obj.qux) == "number") &&
    obj.hasOwnProperty("quz") &&
    ((typeof obj.quz) == "string")
  );
}

function equals_Baz(obj : any, baz : Baz)
{
  return (
    is_Baz(obj) &&
    (obj.qux == baz.qux) &&
    (obj.quz == baz.quz)
  );
}


function parse_and_check_arg__foo(k : string, v : string) : ([ true, number ] | [ false, undefined ])
{
  const v_parsed = +v;

  if ((k == "foo") && ((typeof v_parsed) == "number"))
  {
    return ([ true, v_parsed ]);
  }
  else
  {
    return ([ false, undefined ]);
  }
}

function parse_and_check_arg__bar(k : string, v : string) : ([ true, string ] | [ false, undefined ])
{
  if (k == "bar")
  {
    return ([ true, v ]);
  }
  else
  {
    return ([ false, undefined ]);
  }
}

function parse_and_check_arg__baz(k : string, v : string) : ([ true, Baz ] | [ false, undefined ])
{
  try {
    var v_parsed = JSON.parse(v);
  } catch {
    //
  }

  if ((k == "baz") && (is_Baz(v_parsed)))
  {
    return ([ true, v_parsed ]);
  }
  else
  {
    return ([ false, undefined ]);
  }
}


Deno.test("./src/lib/get_parsed_args_from_url_query_string.ts", function()
{
  const url_query_string__foo = "foo=123";
  const url_query_string__bar = "bar=abc";
  const url_query_string__baz = `baz={"qux":123,"quz":"abc"}`;
  const url_query_string__foo_bar_baz = `foo=123&bar=abc&baz={"qux":123,"quz":"abc"}`;

  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
        url_query_string__foo,
        parse_and_check_arg__foo
    );

    assert(success && (args![0] == 123));
  }
  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
        url_query_string__bar,
        parse_and_check_arg__bar
    );

    assert(success && (args![0] == "abc"));
  }
  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
        url_query_string__baz,
        parse_and_check_arg__baz
    );

    assert(success && equals_Baz(args![0], { qux: 123, quz: "abc" }));
  }
  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
        url_query_string__foo_bar_baz,
        parse_and_check_arg__foo,
        parse_and_check_arg__bar,
        parse_and_check_arg__baz
    );

    assert(success && (args![0] == 123) && (args![1] == "abc") && equals_Baz(args![2], { qux: 123, quz: "abc" }));
  }

  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
      url_query_string__foo,
      parse_and_check_arg__bar
    );

    assert((!success) && (args === undefined));
  }
  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
      url_query_string__bar,
      parse_and_check_arg__foo
    );

    assert((!success) && (args === undefined));
  }

  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
      url_query_string__foo,
      parse_and_check_arg__foo,
      parse_and_check_arg__bar,
      parse_and_check_arg__baz
    );

    assert((!success) && (args === undefined));
  }
  {
    const [ success, args ] = get_parsed_args_from_url_query_string(
      url_query_string__foo_bar_baz,
      parse_and_check_arg__foo
    );

    assert((!success) && (args === undefined));
  }
});