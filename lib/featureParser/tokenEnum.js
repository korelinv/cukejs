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

module.exports = {E_TOKEN, TOKENS};
