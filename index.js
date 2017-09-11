function FindDefenition(text, defenitions) {
    let matches = defenitions.filter(({regexp}) => {
        return -1 !== text.search(regexp);
    });

    if (1 < matches.length) throw new Error('more than one defeniton is matched');
    if (0 === matches.length) throw new Error('no matching defenitions');

    return matches[0];
};

function BuidStep(text, defeniton) {

    let params = defeniton.regexp.exec(text)
        .filter((value, index) => ((0 < index) && (index <= params.length)));
    let method = defeniton.method;

    return {method, params};
};

function ParseSteps(block, defenitions) {
    return block.map((step) => FindDefenition(step, defenitions));
};


//testdata

let testDefs = [
    {
        regexp: /test (a)(bc)/,
        method: function a() {}
    },
    {
        regexp: /no match/g,
        method: () => {}
    },
    {
        regexp: /random/g,
        method: () => {}
    }
];

console.log(
    BuidStep('Then test abc', FindDefenition('Then test abc', testDefs))
);
