const assert = require('assert');
const getFile = require('../lib/featureParser/getFile');
const identifyLine = require('../lib/featureParser/identifyLine');
const featureParser = require('../lib/featureParser/featureParser');

describe('Feature Parser module', function() {

    describe('#TOKENS', function() {

        let TOKENS = require('../lib/featureParser/tokenEnum');

        it('tokens should have name and regexp fields', function() {
            TOKENS.forEach((token, index) => {
                assert.equal(!!token.name, true, `token[${index}] should have property "name"`);
                assert.equal(!!token.regexp, true, `token[${index}] should have property "regexp"`);
            });
        });

        it('tokens should have consistent structure', function() {
            let keys = Object.keys(TOKENS[0]);

            TOKENS.forEach((token, index) => {
                assert.deepStrictEqual(Object.keys(token), keys);
            });
        });

        it('tokens should contain essential values', function() {
            let shouldContain = [
                'comment',
                'tag',
                'feature',
                'background',
                'scenario',
                'scenario outline',
                'step',
                'examples',
                'table row'
            ];

            shouldContain.forEach((value) => TOKENS.findIndex((token) => value === token.name));
        });

    });

    describe('#getFile(path)', function() {

        let fsMock = {
            readFileSync: () => `


                @tag

                Feature: ft

                    Background: bg
                        Given first

                    Scenario: sc
                        Then second

                    Scenario Outline:
                        Then second outline <foo>

                    Examples:
                        | foo |
                        | bar |


                        `
        };
        let get = getFile(fsMock);

        it('should split file into array of lines & strip off empty ones', function() {
            let expected = [
                '@tag',
                'Feature: ft',
                'Background: bg',
                'Given first',
                'Scenario: sc',
                'Then second',
                'Scenario Outline:',
                'Then second outline <foo>',
                'Examples:',
                '| foo |',
                '| bar |'
            ];
            let result = get('foo');

            assert.deepStrictEqual(result, expected);
        });

    });

    describe('#identifyLine(line)', function() {

        let etokenMock = {
            FOO: 0,
            BAR: 1
        };
        let tokensMock = [
            {
                name: 0,
                regexp: /foo/
            }
        ];
        let identify = identifyLine(tokensMock, etokenMock);

        it('shoud identify line', function() {
            let expected = 0
            let result = identify('foo');

            assert.equal(result, expected);
        });

        it('shoud return nomatch code', function() {
            let expected = -1
            let result = identify('bar');

            assert.equal(result, expected);
        });

    });

    describe('#featureParser(path)', function() {

        let getFileMock = () => [
            '@tag',
            'Feature: ft',
            'Background: bg',
            'Given first',
            'Scenario: sc',
            'Then second',
            'Scenario Outline:',
            'Then second outline <foo>',
            'Examples:',
            '| foo |',
            '| bar |'
        ];
        let parse = featureParser(null, getFileMock, null);

        it('should return exact feature object', function() {
            let expected = {
                tags: [
                    '@tag'
                ],
                name: 'ft',
                background: {
                    name: 'bg',
                    content: [
                        'first'
                    ]
                },
                scenario: [
                    {
                        name: 'sc',
                        content: [
                            'second'
                        ]
                    }
                ],
                outline: [
                    {
                        name: '',
                        content: [
                            'second outline <foo>'
                        ],
                        tableOfContent: [
                            [
                                'foo'
                            ],
                            [
                                'bar'
                            ]
                        ]
                    }
                ]
            };
            let result = parse('foo');

            assert.deepStrictEqual(result, expected);
        });
    });

});
