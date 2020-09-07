const path = require('path');
const fs = require('fs');
const compiler = require('vue-template-compiler');
const nunjucks = require('nunjucks');
const LqlParser = require('./lql-parser');
const LmlParser = require('./lml-parser');

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

    return nunjucks.render(path.resolve(__dirname, './template/lml.js'), {
        hasStoreFile: jsExist,
        storeEnhancers: [
            lqlContent,
        ],
        jsx: LmlParser(AST),
    });
    // 调试用的
    // return 'import React from "react"; export default function () { return <div>123</div> }';
};

