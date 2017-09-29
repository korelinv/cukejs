const GeneratorFactory = require('./lib/shared/generatorFactory');
const featureParser = require('./lib/featureParser');
const testBuilder = require('./lib/testBuilder');
const GetDefenitions = require('./lib/stepsDefiner');
const runTest = require('./lib/testExecutor');

let tests = testBuilder(featureParser('./features/Создание, Редактирование, Удаление - Товар.feature'));

let defs = GetDefenitions([
    require('./steps/given.js'),
    require('./steps/then.js'),
    require('./steps/when.bootstrap.js'),
    require('./steps/when.js'),
    require('./steps/when.kpgz.js')
]);

let hooks = {

    //before: () => console.log('before'),
    //after: () => console.log('after'),
    //beforeTest: () => console.log('beforeTest'),
    //afterTest: () => console.log('afterTest'),
    //testPassed: () => console.log('testPassed'),
    //testFailed: () => console.log('testFailed'),
    //beforeStep: () => console.log('after'),
    //afterStep: () => console.log('afterStep'),
    //stepPassed: () => console.log('stepPassed'),
    //stepPassed: (d) => console.log(d),
    //stepFailed: () => console.log('stepFailed')

}

//runTest(tests[0], defs, hooks);


const uuidv4 = require('uuid/v4');

function importFeatures(features)
{
    return features.map((feature) => testBuilder(featureParser(feature)))
                   .reduce((tests, all) => all.concat(tests),[]);
};

function BundleRunner({features, options, hooks})
{

    options = options || {};
    let maxInstances = options.maxInstances || 1;

    let getTest = GeneratorFactory(importFeatures(features));
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
                stepDefenitions: defs,
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

BundleRunner({
    features: [
        './features/Создание, Редактирование, Удаление - Товар.feature'
    ],
    options: {
        instances: 10
    },
    hooks: hooks
})
