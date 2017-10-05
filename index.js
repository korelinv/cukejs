const RunBundle = require('./lib/bundleRunner');

module.exports = RunBundle;


const parse = require('./lib/featureParser/featureParser')();

console.log(JSON.stringify(parse('test.feature'), null, '  '));
