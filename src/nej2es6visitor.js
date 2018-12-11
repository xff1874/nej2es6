import generate from "@babel/generator";
var babel = require('@babel/core');
var template = require("@babel/template");
debugger;

var buildImport = template.smart(
  `var IMPORT_NAME = require(SOURCE); `
)

module.exports = function(babel) {
  var t = babel.types;
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name == "define") {
          let defineList = path.parent.arguments[0].elements;
          let defineFnParams = path.parent.arguments[1].params;
          // path.node.name = path.node.name.split('').reverse().join('');
          for (var i = 0, len = defineList.length; i < len; i++) {
            var imp = buildImport({
              IMPORT_NAME: t.identifier(defineFnParams[i].name),//为什么是identifier,因为ast解析出来就是这个类型。
              SOURCE: t.stringLiteral(defineList[i].value)
            })
            console.log(generate(imp).code)
          }
        }
      }
    }
  };
};