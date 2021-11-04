function get_parsed_args_from_url_query_string1(url_query_string, ...parse_and_check_arg_fns) {
    const parse_and_check_arg_fns_length = parse_and_check_arg_fns.length;
    const parsed_and_checked_args = new Array(parse_and_check_arg_fns_length);
    let i = 0;
    for (const [k, v] of new URLSearchParams(url_query_string).entries()){
        if (i == parse_and_check_arg_fns_length) {
            return [
                false,
                undefined
            ];
        } else {
            const [checks, parsed] = parse_and_check_arg_fns[i](k, v);
            if (checks) {
                parsed_and_checked_args[i] = parsed;
            } else {
                return [
                    false,
                    undefined
                ];
            }
            i++;
        }
    }
    if (i == parse_and_check_arg_fns_length) {
        return [
            true,
            parsed_and_checked_args
        ];
    } else {
        return [
            false,
            undefined
        ];
    }
}
export { get_parsed_args_from_url_query_string1 as get_parsed_args_from_url_query_string };
