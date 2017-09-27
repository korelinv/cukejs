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

    if (1 < matches.length) throw new Error('more than one defeniton is matching');
    if (0 === matches.length) throw new Error('no matching defenitions');

    return matches[0];
};

/**
*
*/
module.exports = function parseSteps(steps, defenitions)
{
    return steps.map((step) => Object.assign(FindDefenition(step, defenitions), {raw: step}));
};
