const gulp = require('gulp');
const selenium = require('selenium-standalone');
const runSequence = require('run-sequence');
const RunBundle = require('./lib/bundleRunner');

const webdriver = require('selenium-webdriver');

gulp.task('selenium:start', function (done) {
    return selenium.install({}, function (err) {
        if (err) {
            return done(err);
        }

        selenium.start(function (err, child) {
            if (err) {
                return done(err);
            }
            selenium.child = child;
            done();
        });
    });
});

gulp.task('selenium:end', function () {
    if (selenium.child)
    {
        return selenium.child.kill();
    }
});

gulp.task('tests:run', function(done) {
    RunBundle({
        steps: [
            require('./steps/all.js')
        ],
        features: [
            './features/test.feature'
        ],
        options: {
            instances: 1
        },
        hooks: {
            //before: () => console.log('before'),
            //after: () => console.log('after'),
            beforeTest: ({context}) => {
                context.by = webdriver.By;
                context.until = webdriver.until;

                return context.driver = new webdriver.Builder()
                    .forBrowser('chrome')
                    .usingServer('http://localhost:4444/wd/hub')
                    .build();
            },
            afterTest: (data) => {
                return data.context.driver.close();
            },
            //testPassed: () => console.log('testPassed'),
            //testFailed: () => console.log('testFailed'),
            //beforeStep: () => console.log('beforeStep'),
            //afterStep: () => console.log('afterStep'),
            //stepPassed: () => console.log('stepPassed'),
            //stepFailed: () => console.log('stepFailed')
        }
    }, done);
});

gulp.task('test:local', function() {
    return runSequence('selenium:start', 'tests:run', 'selenium:end');
});
