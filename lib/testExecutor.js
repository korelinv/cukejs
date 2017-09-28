const uuidv4 = require('uuid/v4');
const ParseSteps = require('./stepsParser');

/**
* default executor hooks
* @property {function} before
* @property {function} after
* @property {function} testPassed
* @property {function} testFailed
* @property {function} beforeStep
* @property {function} afterStep
* @property {function} stepPassed
* @property {function} stepFailed
*/
const HOOKS = {
    before: () => {},
    after: () => {},
    testPassed: () => {},
    testFailed: () => {},
    beforeStep: () => {},
    afterStep: () => {},
    stepPassed: () => {},
    stepFailed: () => {}
};

/**
* @param {array} array
* @return {generator}
*/
function GeneratorFactory(array) {
    function* generator (array) {
        yield* array;
    };
    let gen = generator(array);
    return () => gen.next();
};

/**
* @param {object}
* @property {function} executor
* @property {generator} generator
* @property {object} hooks
* @property {function} resolve
* @property {function} reject
*/
function Execute({executor, generator, hooks, resolve, reject}) {
    let {done, value} = generator();
    if (done)
    {
        resolve();
    }
    else
    {
        hooks.before({step: value});
        let proceed = () => process.nextTick(() => {
            hooks.passed({step: value});
            hooks.after({step: value});
            Execute({executor, generator, hooks, resolve, reject});
        });
        let stop = (error) => {
            hooks.failed({error, step: value});
            hooks.after({step: value});
            reject({error, step: value})
        };
        let result;
        try
        {
            result = executor(value);
            if (!!result && !!result.then)
            {
                result
                .then(() => proceed())
                .catch((error) => stop(error));
            }
            else
            {
                proceed();
            }
        }
        catch (error)
        {
            stop(error);
        }
    };
};

/**
* @param {object} step
* @return {any}
*/
function LaunchStep(step, context)
{
    return step.method.apply(context, step.params);
};

/**
* @param {object} test
* @param {array} stepDefenitions
* @param {object} hooks
*/
module.exports = function RunTest(test, stepDefenitions, hooks)
{

    let report = Object.assign(HOOKS, hooks);
    let steps = ParseSteps(test.content, stepDefenitions);

    let tid = uuidv4();
    let context = {};

    report.before({tid, context});
    Execute({
        executor: (step) => LaunchStep(step, context),
        generator: GeneratorFactory(steps),
        hooks: {
            before: report.beforeStep,
            after: report.afterStep,
            passed: report.stepPassed,
            failed: report.stepFailed
        },
        resolve: () => {
            report.testPassed({tid, context});
            report.after({tid, context});
        },
        reject: ({error, step}) => {
            report.testFailed({tid, context, error, step})
            report.after({tid, context, error, step});
        }
    });

};
