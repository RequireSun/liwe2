import { ASTElement } from 'vue-template-compiler';
const path = require('path');
const fs = require('fs');
const compiler = require('vue-template-compiler');
const nunjucks = require('nunjucks');
const LqlParser = require('./lql-parser');
const LmlParser = require('./lml-parser');

const SWITCH_PRINT_VUE_AST = true;

module.exports = function (source) {
    let jsExist = false;
    let lqlContent = '';
    const PATH_BASE = path.dirname(this._module.resource);
    const PATH_JS = path.resolve(PATH_BASE, 'index.js');
    const PATH_LQL = path.resolve(PATH_BASE, 'index.lql');
    try {
        fs.statSync(PATH_JS);
        jsExist = true;
    } catch(ex) {
        // 文件不存在
    }
    try {
        lqlContent = fs.readFileSync(PATH_LQL, 'utf-8');
    } catch(ex) {
        // 文件不存在
    }

    if (lqlContent) {
        lqlContent = LqlParser(lqlContent);
    }

    const AST = compiler.compile(source).ast;

    // 调试专用 - 打印 vue AST 树
    if (SWITCH_PRINT_VUE_AST) {
        forEachDeep(AST, (obj: any) => {
            if (typeof(obj) === 'object' && obj !== null) {
                delete (obj as ASTElement).parent;
            }
        });
        console.log(JSON.stringify(AST, undefined, 2));
    }

    return nunjucks.render(path.resolve(__dirname, './template/lml.js'), {
        hasStoreFile: jsExist,
        storeEnhancers: [
            lqlContent,
        ],
        jsx: LmlParser(AST),
    });
    // 调试用的 - 内部代码跑不通但是想运行一下的时候用
    // return 'import React from "react"; export default function () { return <div>123</div> }';
};

// 调试用的 - 打印 vue AST 树
function forEachDeep(obj, fn) {
    for (const [, v] of Object.entries(obj)) {
        fn(v);
        if (typeof(v) === 'object' && v !== null) {
            forEachDeep(v, fn);
        }
    }
}

