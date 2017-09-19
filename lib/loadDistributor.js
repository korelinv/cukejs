const spawn = require('child_process').spawn;

//module.exports =
function loadDistributor({tests, query, options})
{

    query = query || {};

    let {instances} = query;

    instances = instances || 1;

    for (let forks = 0; forks < instances; forks++)
    {
        spawn('console.log(\'this is fork\');');
    };

};

let tests = [
  {
      name: 'test 1',
      tags: [
          '@a',
          '@b',
          '@c'
      ],
      content: []
  },
  {
      name: 'test 2',
      tags: [
          '@a',
          '@b',
          '@c'
      ],
      content: []
  }
]
loadDistributor({tests});
