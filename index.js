const RunBundle = require('./lib/bundleRunner');

RunBundle({
    steps: [
        require('./steps/given.js'),
        require('./steps/then.js'),
        require('./steps/when.bootstrap.js'),
        require('./steps/when.js'),
        require('./steps/when.kpgz.js')
    ],
    features: [
        './features/Создание, Редактирование, Удаление - Товар.feature'
    ],
    options: {
        instances: 10
    },
    hooks: {
        //before: () => console.log('before'),
        //after: () => console.log('after'),
        //beforeTest: () => console.log('beforeTest'),
        //afterTest: () => console.log('afterTest'),
        //testPassed: () => console.log('testPassed'),
        //testFailed: () => console.log('testFailed'),
        //beforeStep: () => console.log('after'),
        //afterStep: () => console.log('afterStep'),
        //stepPassed: () => console.log('stepPassed'),
        //stepFailed: () => console.log('stepFailed')
    }
});
