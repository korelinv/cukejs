const fs = require('fs');
const gulp = require('gulp');
const selenium = require('selenium-standalone');
const runSequence = require('run-sequence');
const jimp = require("jimp");
const resemble = require('node-resemble-js');
const webdriver = require('selenium-webdriver');

const RunBundle = require('./lib/bundleRunner');

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
            maxInstances: 2
        },
        hooks: {
            //before: () => console.log('before'),
            //after: () => console.log('after'),
            beforeTest: ({context, test}) => {
                context.name = test.name;
                context.by = webdriver.By;
                context.until = webdriver.until;
                context.driver = new webdriver.Builder()
                    .forBrowser('chrome')
                    .usingServer('http://localhost:4444/wd/hub')
                    .build();

                return context.driver.manage().window().maximize();
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

gulp.task('artifacts:clean', function() {
    let files = fs.readdirSync('./shots/meta').map((name) => `./shots/meta/${name}`)
        .concat(fs.readdirSync('./shots/source').map((name) => `./shots/source/${name}`))
        .concat(fs.readdirSync('./shots/diff').map((name) => `./shots/diff/${name}`))
        .concat(fs.readdirSync('./shots/candidate').map((name) => `./shots/candidate/${name}`));
    return Promise.all(files.map((file) => {
        return fs.unlink(file);
    }));
});

gulp.task('shots:crop', function() {

    let files = fs.readdirSync('./shots/meta');

    return Promise.all(files.map((file) => {
        let meta = JSON.parse(fs.readFileSync(`./shots/meta/${file}`, 'utf8'));

        return jimp.read(`./shots/source/${meta.id}.png`)
            .then((shot) => shot.crop(meta.x, meta.y, meta.width, meta.height)
                                .write(`./shots/candidate/${meta.name}.png`))
    }));

});

gulp.task('shots:diff', function(done) {

    let q = [];
    let score = 0;

    let files = fs.readdirSync('./shots/candidate');
    files.forEach((file) => {

        let candidate = fs.readFileSync(`./shots/candidate/${file}`);
        if (fs.existsSync(`./shots/master/${file}`))
        {
            let master = fs.readFileSync(`./shots/master/${file}`);
            q.push(new Promise(function(resolve, reject) {
                resemble(candidate)
                    .compareTo(master)
                    .onComplete(function(data) {
                        let {isSameDimensions, dimensionDifference, misMatchPercentage} = data;
                        if (!isSameDimensions || (0 < dimensionDifference.width + dimensionDifference.height) || 1 < parseFloat(misMatchPercentage)) {
                            console.log(`Diff created for "${file}"`);
                            score++;
                            data.getDiffImage().pack().pipe(fs.createWriteStream(`./shots/diff/${file}`));
                        };
                        resolve();
                    });
            }));
        }
        else
        {
            fs.writeFileSync(`./shots/master/${file}`, candidate);
        };

    });

    Promise.all(q)
        .then(() => {
            if (0 === score) console.log('all tests passed');
            else console.log(`${score} tests failed, see shots/diff`);
            done();
        });

});


gulp.task('test:local', function() {
    return runSequence('artifacts:clean', 'selenium:start', 'tests:run', 'selenium:end', 'shots:crop', 'shots:diff');
});
