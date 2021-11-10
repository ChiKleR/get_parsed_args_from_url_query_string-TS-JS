This module exports a function ``get_parsed_args_from_url_query_string``, which takes a query string from a url and a variadic functions which will parse and check each argument from the query string, and returns a pair ``[ success, parsed_and_checked_args ]``.

Compile to JS:
``deno bundle ../src/lib/mod.ts ../src/lib/mod.js``
Test:
``deno test --allow-net --allow-read ../src/``