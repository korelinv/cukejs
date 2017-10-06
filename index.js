const RunBundle = require('./lib/bundleRunner');

module.exports = RunBundle;


const transpile = require('./lib/featureTranspiler/featureTranspiler')();

transpile('test.feature', {
    nameBuilder: () => 'foo',
    indent: true,
    indentation: '    ',
    space: true,
    spacing: 1
}).map(el => console.log(el));
