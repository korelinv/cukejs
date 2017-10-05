module.exports = function(fs) {

    fs = (!!fs) ? fs : require('fs');

    return function getFile(filepath)
    {
        return fs.readFileSync(filepath, 'utf8')
            .split('\n')
            .map((line) => line.replace(/^(\s*|\r)/, ''))
            .filter((line) => ('' !== line));
    };

};
