module.exports = function(featureParser, testBuilder) {

    featureParser = (!!featureParser) ? featureParser : require('../featureParser/featureParser')();
    testBuilder = (!!testBuilder) ? testBuilder : require('../testBuilder/testBuilder')();

    return function featureTranspiler(filepath, options) {

        options = options || {

            nameBuilder: undefined,
            indent: false,
            indentation: '',
            space: false,
            spacing: 0

        };

        let indent = (level) => options.indentation.repeat(options.indent ? level : 0);
        let space = options.space ? [] : new Array(options.spacing).fill('\n');
        let tests = testBuilder(featureParser(filepath), {nameBuilder: options.nameBuilder});

        return tests.map((test) => {

            let tags = test.tags.map(tag => `@${tag}`);
            let feature = `Feature: ${test.name}`;
            let scenario = `${indent(1)}Scenario: ${test.name}`;
            let steps = test.content.map((step, index) => `${indent(2)}${(0 === index) ? 'Given' : 'Then'} ${step}`);

            return [...tags, ...space, feature, ...space, scenario, ...space, ...steps].join('\n');
        });

    };
};
