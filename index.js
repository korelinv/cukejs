const featureParser = require('./lib/featureParser');
const testBuilder = require('./lib/testBuilder');


console.log(JSON.stringify(testBuilder(featureParser('./features/test.feature')), null, '  '));



function DefineStep(regexp, method) {
    return {
        method,
        regexp,
    };
};

function FindDefenition(text, defenitions) {
    let matches = defenitions.filter(({regexp}) => {
        return -1 !== text.search(regexp);
    });

    if (1 < matches.length) throw new Error('more than one defeniton is matched');
    if (0 === matches.length) throw new Error('no matching defenitions');

    return matches[0];
};

function BuidStep(text, defeniton) {

    let params = defeniton.regexp.exec(text)
    params = params.filter((value, index) => ((0 < index) && (index <= params.length)));
    let method = defeniton.method;

    return {method, params};
};

function LaunchStep(step) {
    return step.method.apply(this, step.params);
};

function ParseSteps(block, defenitions) {
    return block.map((step) => FindDefenition(step, defenitions));
};
