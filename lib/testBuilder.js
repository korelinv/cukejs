/**
* @param {object} feature
* @return {array<objects>}
*/
function buildScenarios(feature, nameBuilder)
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

/**
* @param {object} outline
* @return {object}
* @property {object} tableOfContent
* @property {number} tableOfContentLength
* @property {object} variablesLookup
*/
function buildContentTable(outline)
{
    let tableOfContent = {};
    let tableOfContentLength = 0;
    let variablesLookup = {};
    outline.tableOfContent.shift()
    .forEach((variableName, index) => {
        variablesLookup[index] = variableName;
        tableOfContent[variableName] = [];
    });
    outline.tableOfContent.forEach((row) => {
        tableOfContentLength++;
        row.forEach((element, index) => {
            tableOfContent[variablesLookup[index]].push(element);
        });
    });

    return {tableOfContent, tableOfContentLength};
};

/**
* @param {string} line
* @param {object} tableOfContent
* @param {number} index
* @return {string}
*/
function bindVariables(line, tableOfContent, index) {
    let resultLine = line;
    for (variable in tableOfContent)
    {
        let variableRegexp = new RegExp(`<${variable}>`,'g');
        let variableValue = tableOfContent[variable][index];
        resultLine = resultLine.replace(variableRegexp, variableValue);
    };

    return resultLine;
};

/**
* @param {object} feature
* @return {array<array<object>>}
*/
function buildOutlines(feature, nameBuilder)
{
    return feature.outline.map((outline) => {
        let content = feature.background.content.concat(outline.content);
        let {tableOfContent, tableOfContentLength} = buildContentTable(outline);

        return new Array(tableOfContentLength).fill().map((element, index) => {
            return {
                tags: feature.tags,
                name: nameBuilder({
                    feature: feature.name,
                    background: feature.background.name,
                    outline: outline.name,
                    index: index + 1
                }),
                content: content.map((line) => bindVariables(line, tableOfContent, index))
            };
        });
    });
};

/**
* @param {object} feature
* @return {array<object>}
*/
module.exports = function testBuilder(feature, nameBuilder)
{
    if (false === !!nameBuilder)
    {
        nameBuilder = ({feature, background, scenario, outline, index}) => [feature, background, scenario, outline, index]
            .filter((element) => !!element)
            .join(' ')
            .trim();
    };

    let scenarios = buildScenarios(feature, nameBuilder);
    let outlines = buildOutlines(feature, nameBuilder);

    return [].concat(scenarios).concat(...outlines);
};
