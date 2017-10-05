module.exports = function(TOKENS, E_TOKEN) {

    E_TOKEN = (!!E_TOKEN) ? E_TOKEN : require('./tokenEnum').E_TOKEN;
    TOKENS = (!!TOKENS) ? TOKENS : require('./tokenEnum').TOKENS;

    return function IdentifyLine(line)
    {
        let result = TOKENS.filter((token) => (-1 !== line.search(token.regexp)));
        return (0 < result.length) ? result[0].type : E_TOKEN.NOMATCH;
    };

};
