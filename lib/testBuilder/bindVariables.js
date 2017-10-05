module.exports = function bindVariables(line, tableOfContent, index)
{
    let resultLine = line;
    for (variable in tableOfContent)
    {
        let variableRegexp = new RegExp(`<${variable}>`,'g');
        let variableValue = tableOfContent[variable][index];
        resultLine = resultLine.replace(variableRegexp, variableValue);
    };

    return resultLine;
};
