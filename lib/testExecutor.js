const uuidv4 = require('uuid/v4');
const GeneratorFactory = require('./shared/generatorFactory');
const ParseSteps = require('./stepsParser');

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
* @return {promise}
*/
module.exports = function RunTest({test, stepDefenitions, hooks, bundle})
{
    return new Promise(function(resolve, reject) {
        test.tid = uuidv4();
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
            bundle,
            test,
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
                resolve();
            },
            reject: (scope) => {
                report.testFailed(scope)
                report.after(scope);
                resolve();
            },
            scope
        });

    });

};
