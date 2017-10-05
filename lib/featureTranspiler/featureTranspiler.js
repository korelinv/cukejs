module.exports = function(featureParser, testBuilder) {

    featureParser = (!!featureParser) ? featureParser : require('../featureParser/featureParser')();
    testBuilder = (!!testBuilder) ? testBuilder : require('../featureParser/testBuilder')();

    return function featureTranspiler(filepath, options) {

        options = options || {};

        let tests = testBuilder(featureParser(filepath), {nameBuilder: options.nameBuilder});

    };
};
