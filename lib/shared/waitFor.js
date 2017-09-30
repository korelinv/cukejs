/**
* @param {function} method
* @return {promise}
*/
module.exports = function WaitFor(method)
{
    return new Promise(function(resolve, reject) {
        reject = reject || resolve;
        let result;
        try
        {
            result = method();

            if (!!result && !!result.then)
            {
                result.then((data) => resolve(data))
                      .catch((error) => reject(error));
            }
            else {
                resolve(result);
            }
        }
        catch (error)
        {
            reject(error);
        };
    });
};
