module.exports = function(buildContentTable, bindVariables)
{
    buildContentTable = (!!buildContentTable) ? buildContentTable : require('./buildContentTable');
    bindVariables = (!!bindVariables) ? bindVariables : require('./bindVariables');

    return function buildOutlines(feature, nameBuilder)
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
};
