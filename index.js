const featureParser = require('./lib/featureParser');
const testBuilder = require('./lib/testBuilder');


function defineStep(regexp, method) {
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

function launchStep(step) {
    return step.method.apply(this, step.params);
};

function parseSteps(steps, defenitions)
{
    return steps.map((step) => FindDefenition(step, defenitions));
};



let tests = testBuilder(featureParser('./features/test.feature'));


const HOOKS = {
    before: () => {},
    after: () => {},
    beforeStep: () => {},
    afterStep: () => {}
};

const STEP_STATUS = {
    PENDING: 0,
    PASSED: 1,
    FAILED: 2
};

function runTest(test, stepDefenitions, hooks)
{

    let report = Object.assign(HOOKS, hooks);
    let steps = parseSteps(test.content, stepDefenitions);

    report.before();

    steps.forEach((step) => {

        let status = STEP_STATUS.PENDING;

        report.beforeStep();
        try
        {
            launchStep(step)
            status = STEP_STATUS.PASSED;
        }
        catch (error)
        {
            status = STEP_STATUS.FAILED;
        };
        report.afterStep();
    });

    report.after();

};

let sd = [
    defineStep(/^Log in$/, () => {}),
    defineStep(/^logout$/, () => {throw 'error thrown'})
];

runTest(tests[0], sd);
