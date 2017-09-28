const featureParser = require('./lib/featureParser');
const testBuilder = require('./lib/testBuilder');
const testExecutor = require('./lib/testExecutor');


function DefineStep(regexp, method)
{
    return {
        method,
        regexp,
    };
};

function GetDefenitions(files)
{
    let defenitions = [];
    let context = {
        Given: (regexp, method) => defenitions.push(DefineStep(regexp, method)),
        When: (regexp, method) => defenitions.push(DefineStep(regexp, method)),
        Then: (regexp, method) => defenitions.push(DefineStep(regexp, method))
    };

    files.forEach((filePath) => require(filePath).apply(context));

    return defenitions;
};

let defs = [
    './steps/given.js',
    './steps/then.js',
    './steps/when.bootstrap.js',
    './steps/when.js',
    './steps/when.kpgz.js'
];

console.log(GetDefenitions(defs));


/*
let tests = testBuilder(featureParser('./features/test.feature'));

let sd = [
    DefineStep(/^Log in as "(.*)"$/, function(user) {
        //console.log(user)
    }),
    DefineStep(/^logout$/, function() {
        //throw 'error thrown';
        //console.log('logout');
    })
];
let hooks = {

    //before: ({tid, context}) => console.log('before'),
    after: (data) => {
        console.log(data);
        //console.log('after');
    },
    //testPassed: () => console.log('testPassed'),
    //testFailed: () => console.log('testFailed'),
    //beforeStep: (data) => {},
    //afterStep: (data) => console.log(data),
    //stepPassed: () => console.log('stepPassed'),
    //stepFailed: () => console.log('stepFailed')

}
testExecutor(tests[0], sd, hooks);
*/
