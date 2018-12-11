var babel = require('@babel/core');

module.exports = function(babel) {
  var t = babel.types;
  return {
    visitor: {
            Identifier(path) {
        path.node.name = path.node.name.split('').reverse().join('');
      }
    }
  };
};