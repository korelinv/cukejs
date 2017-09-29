/**
* @param {array} array
* @return {generator}
*/
module.exports = function GeneratorFactory(array) {
    function* generator (array) {
        yield* array;
    };
    let gen = generator(array);
    return () => gen.next();
};
