/**
* @param {string} text
* @param {array} defenitions
* @return {object}
*/
function FindDefenition(text, defenitions)
{
    let matches = defenitions.filter(({regexp}) => {
        return -1 !== text.search(regexp);
    });

    if (1 < matches.length) throw new Error('more than one defeniton is matched');
    if (0 === matches.length) throw new Error('no matching defenitions');

    return matches[0];
};

/**
* @param {string} text
* @param {object} defenition
* @return {object}
*/
function BuidStep(text, defeniton)
{
    let method = defeniton.method;
    let params = defeniton.regexp.exec(text);
    params = params.filter((value, index) => ((0 < index) && (index <= params.length)));
    return {method, params};
};

/**
* @param {array<object>} steps
* @param {array<objects>} defenitions
* @return {array<objects>}
*/
module.exports = function ParseSteps(steps, defenitions)
{
    return steps.map((step) => {
        let raw = step;
        let builded = BuidStep(raw, FindDefenition(step, defenitions));
        return Object.assign(builded, {raw});
    });
};
