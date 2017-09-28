const featureParser = require('./lib/featureParser');
const testBuilder = require('./lib/testBuilder');
const testExecutor = require('./lib/testExecutor');


function DefineStep(regexp, method) {
    return {
        method,
        regexp,
    };
};

let tests = testBuilder(featureParser('./features/test.feature'));

let sd = [
    DefineStep(/^Log in as "(.*)"$/, function(user) {
        //console.log(user)
    }),
    DefineStep(/^logout$/, function() {
        console.log(this);
        console.log(`tid: ${tid}`);
    })
];
let hooks = {

    before: ({tid, context}) => {
        console.log('before');
        context.tid = tid;
    },
    //after: ({tid}) => {
    //    console.log(tid);
    //    console.log('after');
    //},
    //testPassed: () => console.log('testPassed'),
    //testFailed: () => console.log('testFailed'),
    //beforeStep: () => console.log('beforeStep'),
    //afterStep: () => console.log('afterStep'),
    //stepPassed: () => console.log('stepPassed'),
    //stepFailed: () => console.log('stepFailed')

}
testExecutor(tests[0], sd, hooks);
