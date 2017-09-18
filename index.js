const featureParser = require('./lib/featureParser');


function testBuilder(feature)
{

    let scenarios = feature.scenario.map((scenario) => {
        let tags = feature.tags;
        let name = `${feature.name} ${feature.background.name} ${scenario.name}`.trim();
        let content = feature.background.content.concat(scenario.content);
        return {tags, name, content};
    });

    let outlines = feature.outline
        .map((outline) => {
            let tags = feature.tags;
            let name = `${feature.name} ${feature.background.name} ${outline.name}`.trim();

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

            let content = feature.background.content.concat(outline.content);

            return new Array(tableOfContentLength).fill().map((element, index) => {
                return {
                    tags,
                    name: `${name} #${index}`,
                    content: content.map((line) => {
                        let resultLine = line;
                        for (variable in tableOfContent)
                        {
                            let variableRegexp = new RegExp(`<${variable}>`,'g');
                            let variableValue = tableOfContent[variable][index];
                            resultLine = resultLine.replace(variableRegexp, variableValue);
                        };
                        return resultLine;
                    })
                };
            });

        });

    return [].concat(scenarios).concat(...outlines);
};

console.log(JSON.stringify(testBuilder(featureParser('./features/test.feature')), null, '  '));



function DefineStep(regexp, method) {
    return {
        method,
        regexp,
    };
};

function FindDefenition(text, defenitions) {
    let matches = defenitions.filter(({regexp}) => {
        return -1 !== text.search(regexp);
    });

    if (1 < matches.length) throw new Error('more than one defeniton is matched');
    if (0 === matches.length) throw new Error('no matching defenitions');

    return matches[0];
};

function BuidStep(text, defeniton) {

    let params = defeniton.regexp.exec(text)
    params = params.filter((value, index) => ((0 < index) && (index <= params.length)));
    let method = defeniton.method;

    return {method, params};
};

function LaunchStep(step) {
    return step.method.apply(this, step.params);
};

function ParseSteps(block, defenitions) {
    return block.map((step) => FindDefenition(step, defenitions));
};
