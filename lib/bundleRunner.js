const uuidv4 = require('uuid/v4');
const GeneratorFactory = require('./shared/generatorFactory');
const featureParser = require('./featureParser');
const testBuilder = require('./testBuilder');
const runTest = require('./testExecutor');
const GetDefenitions = require('./stepsDefiner');

function importFeatures(features)
{
    return features.map((feature) => testBuilder(featureParser(feature)))
                   .reduce((tests, all) => all.concat(tests),[]);
};

module.exports = function BundleRunner({features, options, steps, hooks})
{

    options = options || {};
    let maxInstances = options.maxInstances || 1;
    let tests = importFeatures(features);
    let stepDefenitions = GetDefenitions(steps);

    let getTest = GeneratorFactory(tests);
    let report = {
        before: () => {},
        after: () => {},
        beforeTest: () => {},
        afterTest: () => {},
        testPassed: () => {},
        testFailed: () => {},
        beforeStep: () => {},
        afterStep: () => {},
        stepPassed: () => {},
        stepFailed: () => {}
    };

    Object.assign(report, hooks);

    let bundle = {
        options,
        bid: uuidv4()
    };


    function runNextTest(callback)
    {
        let {value, done} = getTest();
        if (done)
        {
            callback();
        }
        else
        {
            runTest({
                bundle,
                test: value,
                stepDefenitions,
                hooks: {
                    before: report.beforeTest,
                    after: report.afterTest,
                    testPassed: report.testPassed,
                    testFailed: report.testFailed,
                    beforeStep: report.beforeStep,
                    afterStep: report.afterStep,
                    stepPassed: report.stepPassed,
                    stepFailed: report.stepFailed
                }
            })
            .then(() => process.nextTick(runNextTest(callback)))
            .catch(() => {});
        };
    };


    report.before();
    let instances = [];
    for (let instance = 1; maxInstances >= instance; instance++)
    {
        instances.push(new Promise(function(resolve, reject) {
            runNextTest(resolve());
        }));
    };

    Promise.all(instances)
        .then(() => report.after())
        .catch(() => {});

};
