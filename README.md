Tested and compiled with Deno.

This module exports a function ``get_parsed_args_from_url_query_string``, which takes a query string from a url and a variadic functions which will parse and check each argument from the query string, returning a pair ``[ success, parsed_and_checked_args ]``.