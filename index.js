const featureParser = require('./lib/featureParser');
const testBuilder = require('./lib/testBuilder');
const testExecutor = require('./lib/testExecutor');


function DefineStep(regexp, method) {
    return {
        method,
        regexp,
    };
};

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
let tests = testBuilder(featureParser('./features/test.feature'));

let sd = [
    DefineStep(/^Log in as "(.*)"$/, (user) => {console.log(user)}),
    DefineStep(/^logout$/, () => {})
];
let hooks = {
    /*
    before: () => console.log('before'),
    after: () => console.log('after'),
    testPassed: () => console.log('testPassed'),
    testFailed: () => console.log('testFailed'),
    beforeStep: () => console.log('beforeStep'),
    afterStep: () => console.log('afterStep'),
    stepPassed: () => console.log('stepPassed'),
    stepFailed: () => console.log('stepFailed')
    */
}
testExecutor(tests[0], sd, hooks);
