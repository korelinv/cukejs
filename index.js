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
    return steps.map((step) => Object.assign(FindDefenition(step, defenitions), {raw: step}));
};





function generatorFactory(array) {
    function* generator (array) {
        yield* array;
    };
    let gen = generator(array);
    return () => gen.next();
};

function execute({executor, generator, hooks, resolve, reject}) {
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
            execute({executor, generator, hooks, resolve, reject});
        });
        let stop = (error) => {
            hooks.failed({error, step: value});
            hooks.after({step: value});
            reject(error)
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


function runTest(test, stepDefenitions, hooks)
{

    let report = Object.assign(HOOKS, hooks);
    let steps = parseSteps(test.content, stepDefenitions);

//    report.before();
//
//    steps.forEach((step) => {
//
//        let status = STEP_STATUS.PENDING;
//        let error;
//
//        report.beforeStep();
//        try
//        {
//            launchStep(step)
//            status = STEP_STATUS.PASSED;
//            report.stepPassed({status, step: step.raw});
//        }
//        catch (error)
//        {
//            status = STEP_STATUS.FAILED;
//            report.stepFailed({error, status, step: step.raw});
//        };
//        report.afterStep();
//    });
//
//    report.after();

    execute({
        executor: launchStep,
        generator: generatorFactory(steps),
        hooks: {
            before: () => {},
            after: () => {},
            passed: (data) => console.log(data),
            failed: (data) => console.log(data)
        },
        resolve: () => console.log('done'),
        reject: (e) => console.log(`failed: ${e}`)
    })

};

const HOOKS = {
    before: () => {},
    after: () => {},
    beforeStep: () => {},
    afterStep: () => {},
    stepPassed: () => {},
    stepFailed: () => {}
};
let tests = testBuilder(featureParser('./features/test.feature'));
/*
const STEP_STATUS = {
    PENDING: 0,
    PASSED: 1,
    FAILED: 2
};
*/
let sd = [
    defineStep(/^Log in$/, () => {}),
    defineStep(/^logout$/, () => {throw 'error thrown'})
];
let hooks = {
    stepPassed: (data) => console.log(data),
    stepFailed: (data) => console.log(data)
}
runTest(tests[0], sd, hooks);

/*
function randomDelay() {
    let delay = Math.floor(Math.random() * 5) * 1000;
    return () => new Promise(function(resolve, reject) {
        setTimeout(function () {
            //console.log(`delay was ${delay} ms`);
            resolve();
        }, delay);
    });
}
let test = generatorFactory([
    randomDelay(),
    randomDelay(),
    randomDelay(),
    randomDelay(),
    randomDelay()
]);

execute({
    generator: test,
    hooks: {
        passed: () => console.log('passed'),
        failed: () => console.log('failed')
    },
    resolve: () => console.log('done 1'),
    reject: (error) => console.log(error)
});
*/
