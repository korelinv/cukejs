const assert = require('assert');
const tokenEnum = require('../lib/featureParser/tokenEnum');
const getFile = require('../lib/featureParser/getFile');
const identifyLine = require('../lib/featureParser/identifyLine');
const featureParser = require('../lib/featureParser/featureParser');

describe('Parse feature', function() {

    describe('#getFile(path)', function() {

        let fs = {
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
        let get = getFile(fs);

        it('should split file into trimmed lines & strip of empty lines', function() {
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
        let parse = featureParser(null, null, getFileMock, null);

        it('should return valid feature object', function() {
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
