const uuidv4 = require('uuid/v4');
const GeneratorFactory = require('./shared/generatorFactory');
const WaitFor = require('./shared/waitFor');
const featureParser = require('./featureParser');
const testBuilder = require('./testBuilder');
const runTest = require('./testExecutor');
const GetDefenitions = require('./stepsDefiner');

/**
* @param {array<string>} features
* @return {array<object>}
*/
function importFeatures(features)
{
    return features.map((feature) => testBuilder(featureParser(feature)))
                   .reduce((tests, all) => all.concat(tests),[]);
};

/**
* @param
* @property {array} features
* @property {object} options
* @property {array} steps
* @property {object} hooks
*/
module.exports = function BundleRunner({features, options, steps, hooks}, callback)
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
        features,
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


    WaitFor(() => report.before(bundle))
        .then(() => {
            let instances = [];
            for (let instance = 1; maxInstances >= instance; instance++)
            {
                instances.push(new Promise(function(resolve, reject) {
                    runNextTest(resolve);
                }));
            };
            return Promise.all(instances)
        })
        .then(() => WaitFor(() => report.after(bundle)))
        .then(() => {
            if (!!callback)
            {
                callback();
            };
        })
        .catch((error) => {
            throw error;
        });

};
