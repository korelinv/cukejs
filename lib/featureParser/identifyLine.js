module.exports = function(TOKENS) {

    TOKENS = (!!TOKENS) ? TOKENS : require('./tokenEnum');

    return function IdentifyLine(line)
    {
        let result = TOKENS.filter((token) => (-1 !== line.search(token.regexp)));
        return (0 < result.length) ? result[0].name : -1;
    };

};
