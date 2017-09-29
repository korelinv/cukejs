/**
* @param {regexp} regexp
* @param {function} method
* @return {object}
*/
function DefineStep(regexp, method)
{
    return {
        method,
        regexp,
    };
};

/**
* @param {array<function>} headers
* @return {array<object>}
*/
module.exports = function GetDefenitions(headers)
{
    let defenitions = [];
    let context = {
        Given: (regexp, method) => defenitions.push(DefineStep(regexp, method)),
        When: (regexp, method) => defenitions.push(DefineStep(regexp, method)),
        Then: (regexp, method) => defenitions.push(DefineStep(regexp, method))
    };
    headers.forEach((header) => header.apply(context));
    return defenitions;
};
