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
function Execute({executor, generator, hooks, resolve, reject, scope}) {
    let {done, value} = generator();
    if (done)
    {
        resolve();
    }
    else
    {
        let stepScope = {
            scope: scope,
            step: {
                raw: value.raw,
                params: value.params
            }
        };
        hooks.before(stepScope);
        let proceed = () => process.nextTick(() => {
            hooks.passed(stepScope);
            hooks.after(stepScope);
            Execute({executor, generator, hooks, resolve, reject, scope});
        });
        let stop = (error) => {
            Object.assign(stepScope, {error})
            hooks.failed(stepScope);
            hooks.after(stepScope);
            reject(stepScope);
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
    let report = {
        before: () => {},
        after: () => {},
        testPassed: () => {},
        testFailed: () => {},
        beforeStep: () => {},
        afterStep: () => {},
        stepPassed: () => {},
        stepFailed: () => {}
    };
    let steps = ParseSteps(test.content, stepDefenitions);
    let scope = {
        test,
        tid: uuidv4(),
        context: {}
    };

    Object.assign(report, hooks);

    report.before(scope);
    Execute({
        executor: (step) => LaunchStep(step, scope.context),
        generator: GeneratorFactory(steps),
        hooks: {
            before: report.beforeStep,
            after: report.afterStep,
            passed: report.stepPassed,
            failed: report.stepFailed
        },
        resolve: () => {
            report.testPassed(scope);
            report.after(scope);
        },
        reject: (scope) => {
            report.testFailed(scope)
            report.after(scope);
        },
        scope
    });

};
