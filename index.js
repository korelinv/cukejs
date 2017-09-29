const featureParser = require('./lib/featureParser');
const testBuilder = require('./lib/testBuilder');
const GetDefenitions = require('./lib/stepsDefiner');
const testExecutor = require('./lib/testExecutor');

/*
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
*/

let defs = [
    require('./steps/given.js'),
    require('./steps/then.js'),
    require('./steps/when.bootstrap.js'),
    require('./steps/when.js'),
    require('./steps/when.kpgz.js')
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
