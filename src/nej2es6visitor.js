import generate from '@babel/generator';
import babel from '@babel/core';
import template from '@babel/template';
import * as t from '@babel/types';
// var babel = require('@babel/core');
// var template = require("@babel/template");
// debugger;


module.exports = function (babel) {

  let importList = [];
  const buildImport = template.smart(`var IMPORT_NAME = require(SOURCE); `);

  const v1 = {
    Identifier(path) {
      if (path.node.name == 'define') {
        let defineList = path.parent.arguments[0].elements;
        let defineFnParams = path.parent.arguments[1].params;
        // path.node.name = path.node.name.split('').reverse().join('');
        for (var i = 0, len = defineList.length; i < len; i++) {
          var imp = buildImport({
            IMPORT_NAME: t.identifier(defineFnParams[i].name), //为什么是identifier,因为ast解析出来就是这个类型。
            SOURCE: t.stringLiteral(defineList[i].value),
          });

          importList.push(imp);
          // path.insertBefore(imp);
          // console.log(generate(imp).code)
        }
        // visitor模式无法返回。
        // return arr;
      }
    },
  };
  return {
    visitor: {
      Program(path, state) {
        path.traverse(v1);
        path.pushContainer('body', importList);
      },
    },
  };
};
