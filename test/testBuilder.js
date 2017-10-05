const assert = require('assert');
const buildScenarios = require('../lib/testBuilder/buildScenarios');
const buildContentTable = require('../lib/testBuilder/buildContentTable');
const bindVariables = require('../lib/testBuilder/bindVariables');
const buildOutlines = require('../lib/testBuilder/buildOutlines');
const testBuilder = require('../lib/testBuilder/testBuilder');

describe('Test Builder module', function() {

    let feature, nameBuilderMock;

    beforeEach(function() {
        feature = {
            tags: [
                '@tag'
            ],
            name: 'foo',
            background: {
                name: 'foo',
                content: [
                    'bar'
                ]
            },
            scenario: [
                {
                    name: 'foo',
                    content: [
                        'baz'
                    ]
                },
                {
                    name: 'foo',
                    content: [
                        'fiz',
                        'baz'
                    ]
                }
            ],
            outline: [
                {
                    name: 'foo',
                    content: [
                        'biz <foo>'
                    ],
                    tableOfContent: [
                        [
                            'foo'
                        ],
                        [
                            'bar'
                        ],
                        [
                            'baz'
                        ]
                    ]
                },
                {
                    name: 'bar',
                    content: [
                        'biz <foo>'
                    ],
                    tableOfContent: [
                        [
                            'fiz'
                        ],
                        [
                            'baz'
                        ]
                    ]
                }
            ]
        };
        nameBuilderMock = () => 'baz';
    });

    describe('#buildScenarios(feature, nameBuilder)', function() {

        it('should return array of test builds from feature', function() {
            let result = buildScenarios(feature, nameBuilderMock);
            let expected = [
                {
                    tags: [
                        '@tag'
                    ],
                    name: 'baz',
                    content: [
                        'bar',
                        'baz'
                    ]
                },
                {
                    tags: [
                        '@tag'
                    ],
                    name: 'baz',
                    content: [
                        'bar',
                        'fiz',
                        'baz'
                    ]
                }
            ]

            assert.deepStrictEqual(result, expected);
        });

    });

    describe('#buildContentTable(outline)', function() {

        it('should return table of content object', function() {
            let result = buildContentTable(feature.outline[0]);
            let expected = {
                tableOfContent: {
                    foo: [
                        'bar',
                        'baz'
                    ]
                },
                tableOfContentLength: 2
            };

            assert.deepStrictEqual(result, expected);
        });

    });

    describe('#bindVariables(line, tableOfContent, index)', function() {

        it('should bind values to string from table of content', function() {
            let tableOfContent = {
                foo: [
                    'bar',
                    'baz'
                ]
            };
            let result = bindVariables(feature.outline[0].content[0], tableOfContent, 0);
            let expected = 'biz bar'

            assert.equal(result, expected);
        });

    });

    describe('#buildOutlines(feature, nameBuilder)', function() {

        it('should return array of test builds from outline', function() {
            let build = buildOutlines();
            let result = build(feature, nameBuilderMock);
            let expected = [
                [
                    {
                      'tags': [
                          '@tag'
                      ],
                      'name': 'baz',
                      'content': [
                          'bar',
                          'biz bar'
                      ]
                    },
                    {
                        'tags': [
                            '@tag'
                        ],
                        'name': 'baz',
                        'content': [
                            'bar',
                            'biz baz'
                        ]
                    }
                ],
                [
                    {
                        'tags': [
                            '@tag'
                        ],
                        'name': 'baz',
                        'content': [
                            'bar',
                            'biz <foo>'
                        ]
                    }
                ]
            ];

            assert.deepStrictEqual(result, expected);
        });

    });

    describe('#testBuilder(feature, options)', function() {

        it('should return flat array', function() {
            let buildScenariosMock = () => ['foo','foo'];
            let buildOutlinesMock = () => ['foo','foo'];
            let build = testBuilder(buildScenariosMock, buildOutlinesMock);
            let result = build(feature);
            let expected = ['foo', 'foo', 'foo', 'foo'];

            assert.deepStrictEqual(result, expected);
        });

        it('should return array of test objects', function () {
            let build = testBuilder();
            let result = build(feature);
            let expected = [
                {
                    tags: [
                        '@tag'
                    ],
                    name: 'foo foo foo',
                    content: [
                        'bar',
                        'baz'
                    ]
                },
                {
                    tags: [
                        '@tag'
                    ],
                    name: 'foo foo foo',
                    content: [
                        'bar',
                        'fiz',
                        'baz'
                    ]
                },
                {
                    tags: [
                        '@tag'
                    ],
                    name: 'foo foo foo 1',
                    content: [
                        'bar',
                        'biz bar'
                    ]
                },
                {
                    tags: [
                        '@tag'
                    ],
                    name: 'foo foo foo 2',
                    content: [
                        'bar',
                        'biz baz'
                    ]
                },
                {
                    tags: [
                        '@tag'
                    ],
                    name: 'foo foo bar 1',
                    content: [
                        'bar',
                        'biz <foo>'
                    ]
                }
            ];

            assert.deepStrictEqual(result, expected);
        });

        it('should use namebuilder function to generate name', function() {
            let build = testBuilder();
            let result = build(feature, {nameBuilder: nameBuilderMock});
            let expected = nameBuilderMock();

            result.forEach((test) => assert.equal(test.name, expected, `test name should be ${expected}`));
        });

    });

});
