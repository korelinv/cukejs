const HOOKS = {
    before: () => {},
    after: () => {},
    beforeStep: () => {},
    afterStep: () => {},
    stepPassed: () => {},
    stepFailed: () => {}
};

/**
* @param {array} array
* @return {generator}
*/
function generatorFactory(array) {
    function* generator (array) {
        yield* array;
    };
    let gen = generator(array);
    return () => gen.next();
};

/**
* @param {object}
* @property {generator} generator
* @property {object} hooks
* @property {function} resolve
* @property {function} reject
*/
function execute({generator, hooks, resolve, reject}) {
    let {done, value} = generator();
    if (done)
    {
        resolve();
    }
    else
    {
        let proceed = () => process.nextTick(() => {
            hooks.passed();
            execute({generator, hooks, resolve, reject});
        });
        let stop = (error) => {
            hooks.failed();
            reject(error)
        };
        let result;
        try
        {
            result = value();
            if (!!result && !!result.then)
            {
                result
                .then(() => proceed())
                .catch((error) => stop(error));
            }
            else
            {
                proceed();
            }
        }
        catch (error)
        {
            stop(error);
        }
    };
};
