module.exports = function(buildScenarios, buildOutlines)
{

    buildScenarios = (!!buildScenarios) ? buildScenarios : require('./buildScenarios');
    buildOutlines = (!!buildOutlines) ? buildOutlines : require('./buildOutlines')();

    return function testBuilder(feature, options)
    {
        options = options || {};

        let defaultNamebuilder = ({feature, background, scenario, outline, index}) => [feature, background, scenario, outline, index]
            .filter((element) => !!element)
            .join(' ')
            .trim();
        let nameBuilder = options.nameBuilder || defaultNamebuilder;
        let scenarios = buildScenarios(feature, nameBuilder);
        let outlines = buildOutlines(feature, nameBuilder);

        return [].concat(scenarios).concat(...outlines);
    };
};
