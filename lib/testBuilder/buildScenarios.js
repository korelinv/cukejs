module.exports = function buildScenarios(feature, nameBuilder)
{
    return feature.scenario.map((scenario) => {
        let tags = feature.tags;
        let name = nameBuilder({
            feature: feature.name,
            background: feature.background.name,
            scenario: scenario.name
        });
        let content = feature.background.content.concat(scenario.content);
        return {tags, name, content};
    });
};
