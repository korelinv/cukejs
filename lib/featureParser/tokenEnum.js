module.exports = [
    {
        name: 'comment',
        regexp: /^\s*#.*/
    },
    {
        name: 'tag',
        regexp: /@.*/
    },
    {
        name: 'feature',
        regexp: /^\s*Feature:(.*)/
    },
    {
        name: 'background',
        regexp: /^\s*Background:(.*)/
    },
    {
        name: 'scenario',
        regexp: /^\s*Scenario:(.*)/
    },
    {
        name: 'scenario outline',
        regexp: /^\s*Scenario Outline:(.*)/
    },
    {
        name: 'step',
        regexp: /^\s*(?:Given|When|Then|And) (.+)/
    },
    {
        name: 'examples',
        regexp: /^\s*Examples:(.*)/
    },
    {
        name: 'table row',
        regexp: /([^\|]+)/g
    }
];
