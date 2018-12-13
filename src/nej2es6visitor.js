import generate from "@babel/generator";
import babel from "@babel/core";
import template from "@babel/template";
import * as t from "@babel/types";

module.exports = function(babel) {
    // visitor模式无法返回,所以用了一个参数保留。
    let importList = [];
    let fnbody;
    const buildImport = template(`import NAME from 'LIB' `);

    const importVisitor = {
        Identifier(path) {
            if (path.node.name == "define") {
                let defineList = path.parent.arguments[0].elements;
                let defineFnParams = path.parent.arguments[1].params;
                for (var i = 0, len = defineList.length; i < len; i++) {
                    var imp = buildImport({
                        NAME: t.identifier(defineFnParams[i].name),
                        LIB: t.stringLiteral(defineList[i].value)
                    });

                    importList.push(imp);
                }

                fnbody = path.parent.arguments[1].body.body;
            }
        }
    };
    return {
        visitor: {
            Program(path, state) {
                path.traverse(importVisitor);
                path.node.body = []; //清空body
                path.pushContainer("body", importList);
                path.pushContainer("body", fnbody);
            }
        }
    };
};
