const {TOKENS, E_TOKEN} = require('./tokenEnum');

/**
* @param {string} line
* @return {E_TOKEN}
*/
function IdentifyLine(line)
{
    let result = TOKENS.filter((token) => (-1 !== line.search(token.regexp)));
    return (0 < result.length) ? result[0].type : E_TOKEN.NOMATCH;
};

module.exports = IdentifyLine;
