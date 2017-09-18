const featureParser = require('./lib/featureParser');


function featureBuilder(feature)
{

    let hasBackground = (0 < feature.background.content.length);

    let scenarios = feature.scenario.map((scenario) => {
        let tags = feature.tags;
        let name = `${feature.name} ${feature.background.name} ${scenario.name}`.trim();
        let content = feature.background.content.concat(scenario.content);
        return {tags, name, content};
    });


    return [].concat(scenarios);
};

console.log(featureBuilder(featureParser('./features/test.feature')));



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
