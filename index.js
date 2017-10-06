const run = require('./lib/bundleRunner');
const transpile = require('./lib/featureTranspiler/featureTranspiler')();

module.exports = {run, transpile};
