const fs = require('fs');

const E_TOKEN = {
    COMMENT: 0,
    TAG: 1,
    FEATURE: 2,
    BACKGROUND: 3,
    SCENARIO: 4,
    SCENARIO_OUTLINE: 5,
    STEP: 6,
    EXAMPLES: 7,
    TABLEROW: 8,
    NOMATCH: 9
};
const TOKENS = [
    {
        type: E_TOKEN.COMMENT,
        regexp: /^\s*#.*/
    },
    {
        type: E_TOKEN.TAG,
        regexp: /@.*/
    },
    {
        type: E_TOKEN.FEATURE,
        regexp: /^\s*Feature:(.*)/
    },
    {
        type: E_TOKEN.BACKGROUND,
        regexp: /^\s*Background:(.*)/
    },
    {
        type: E_TOKEN.SCENARIO,
        regexp: /^\s*Scenario:(.*)/
    },
    {
        type: E_TOKEN.SCENARIO_OUTLINE,
        regexp: /^\s*Scenario Outline:(.*)/
    },
    {
        type: E_TOKEN.STEP,
        regexp: /^\s*(?:Given|When|Then|And) (.+)/
    },
    {
        type: E_TOKEN.EXAMPLES,
        regexp: /^\s*Examples:(.*)/
    },
    {
        type: E_TOKEN.TABLEROW,
        regexp: /([^\|]+)/g
    }
];

/**
* @param {string} filepath
* @return {array<string>}
*/
function getFile(filepath)
{
    return fs.readFileSync(filepath, 'utf8')
        .split('\n')
        .filter((line) => ('' !== line.trim()));
};

/**
* @param {string} line
* @return {E_TOKEN}
*/
function IdentifyLine(line)
{
    let result = TOKENS.filter((token) => (-1 !== line.search(token.regexp)));
    return (0 < result.length) ? result[0].type : E_TOKEN.NOMATCH;
};

/**
* @param {string} filepath
* @return {object}
*/
module.exports = function featureParser(filepath)
{

    let content = getFile(filepath);
    let feature = {
        tags: [],
        name: '',
        background: {
            name: '',
            content: []
        },
        scenario: [],
        outline: []
    };
    let focus;

    content.forEach((line) => {
        switch (IdentifyLine(line)) {

            case E_TOKEN.TAG:
                feature.tags.push(line);
                break;

            case E_TOKEN.FEATURE:
                feature.name = line.match(TOKENS[E_TOKEN.FEATURE].regexp)[1].trim();
                break;

            case E_TOKEN.BACKGROUND:
                focus = E_TOKEN.BACKGROUND;
                feature.background.name = line.match(TOKENS[E_TOKEN.BACKGROUND].regexp)[1].trim();
                break;

            case E_TOKEN.SCENARIO:
                focus = E_TOKEN.SCENARIO;
                feature.scenario.push({
                    name: line.match(TOKENS[E_TOKEN.SCENARIO].regexp)[1].trim(),
                    content: []
                });
                break;

            case E_TOKEN.SCENARIO_OUTLINE:
                focus = E_TOKEN.SCENARIO_OUTLINE;
                feature.outline.push({
                    name: line.match(TOKENS[E_TOKEN.SCENARIO_OUTLINE].regexp)[1].trim(),
                    content: [],
                    tableOfContent: []
                });
                break;

            case E_TOKEN.STEP:
                let step = line.match(TOKENS[E_TOKEN.STEP].regexp)[1];
                if (focus === E_TOKEN.BACKGROUND)
                {
                    feature.background.content.push(step);
                }
                else if (focus === E_TOKEN.SCENARIO)
                {
                    let indexOfLastScenario = feature.scenario.length - 1;
                    feature.scenario[indexOfLastScenario].content.push(step);
                }
                else if (focus === E_TOKEN.SCENARIO_OUTLINE)
                {
                    let indexOfLastOutline = feature.outline.length - 1;
                    feature.outline[indexOfLastOutline].content.push(step);
                }
                else
                {
                    throw new Error('unexpected step defenition');
                };
                break;

            case E_TOKEN.EXAMPLES:
                if (focus === E_TOKEN.SCENARIO_OUTLINE) focus = E_TOKEN.EXAMPLES;
                else throw new Error('unexpected content table');
                break;

            case E_TOKEN.TABLEROW:
                if (focus === E_TOKEN.EXAMPLES)
                {
                    let args = line.trim()
                        .match(TOKENS[E_TOKEN.TABLEROW].regexp)
                        .map((element) => element.trim());
                    let indexOfLastOutline = feature.outline.length - 1;
                    feature.outline[indexOfLastOutline].tableOfContent.push(args);
                }
                else throw new Error('unexpecte token: TABLEROW');
                break;

            case E_TOKEN.NOMATCH:
                // append previous
                break;

            case E_TOKEN.COMMENT:
                break;

            default:
                // do nothing
                break;
        }
    });

    return feature;
};
