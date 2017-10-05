module.exports = function(TOKENS, getFile, identifyLine) {

    TOKENS = (!!TOKENS) ? TOKENS : require('./tokenEnum');
    getFile = (!!getFile) ? getFile : require('./getFile')();
    identifyLine = (!!identifyLine) ? identifyLine : require('./identifyLine')();

    return function featureParser(filepath)
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
        let findToken = (token) => TOKENS.find((element) => token === element.name);
        let grabValue = (line, token) => line.match(findToken(token).regexp)[1].trim();
        let grabValues = (line, token) => line.match(findToken(token).regexp).map((element) => element.trim());

        content.forEach((line) => {

            let type = identifyLine(line);

            switch (type) {

                case 'tag':
                    feature.tags.push(line);
                    break;

                case 'feature':
                    feature.name = grabValue(line, type);
                    break;

                case 'background':
                    focus = type;
                    feature.background.name = grabValue(line, type);
                    break;

                case 'scenario':
                    focus = type;
                    feature.scenario.push({
                        name: grabValue(line, type),
                        content: []
                    });
                    break;

                case 'scenario outline':
                    focus = type;
                    feature.outline.push({
                        name: grabValue(line, type),
                        content: [],
                        tableOfContent: []
                    });
                    break;

                case 'step':
                    let step = grabValue(line, type);
                    if (focus === 'background')
                    {
                        feature.background.content.push(step);
                    }
                    else if (focus === 'scenario')
                    {
                        let indexOfLastScenario = feature.scenario.length - 1;
                        feature.scenario[indexOfLastScenario].content.push(step);
                    }
                    else if (focus === 'scenario outline')
                    {
                        let indexOfLastOutline = feature.outline.length - 1;
                        feature.outline[indexOfLastOutline].content.push(step);
                    }
                    else
                    {
                        throw new Error('unexpected step defenition');
                    };
                    break;

                case 'examples':
                    if (focus === 'scenario outline') focus = 'examples';
                    else throw new Error('unexpected content table');
                    break;

                case 'table row':
                    if (focus ==='examples')
                    {
                        let args = grabValues(line, type);
                        let indexOfLastOutline = feature.outline.length - 1;
                        feature.outline[indexOfLastOutline].tableOfContent.push(args);
                    }
                    else throw new Error('unexpecte token: TABLEROW');
                    break;

                case -1:
                    // append previous
                    break;

                case 'comment':
                    break;

                default:
                    // do nothing
                    break;
            }
        });

        return feature;
    };

};
