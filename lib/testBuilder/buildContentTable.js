module.exports = function buildContentTable(outline)
{
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

    return {tableOfContent, tableOfContentLength};
};
