const path = require('path');
const fs = require('fs');
const compiler = require('vue-template-compiler');
const LqlParser = require('./lql-parser');

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

    // 不存在数据说明文件时要搞个假的 store
    const js = jsExist ?
        `
import Store from "./index.js"; 
` :
        `
class Store {}
`;
    if (lqlContent) {
        lqlContent = LqlParser(lqlContent);
        // console.log(lqlContent);
    }

    const AST = compiler.compile(source).ast;
    // console.log(AST.children[6]);
    // console.log(AST.children[4].events.click);
    // console.log(AST.children[0].children);
    // console.log(AST.children[2].children[0].children[0].children[0]);
    // 先用字符串了
    const result = `
import React from "react";
import { extendObservable } from "mobx";
import { Provider, observer, inject } from "mobx-react";
${js}

const store = new Store();
// 调试用
window.__store__ = store;

${lqlContent}

// 数据注入
const App = inject('store')(observer(function (props) {
    const { Components, store } = props;
    function $set(store, key, value) {
        store[key] = value;
    }

    return (
        ${vue2jsx(AST)}
    );
}));

// provider 包裹
export default function (props) {
    const { Components } = props;
    return (
        <Provider store={store}>
            <App Components={Components} />
        </Provider>
    );
}
`;
    return result;
    // console.log(result);
    // return 'import React from "react"; export default function () { return <div>123</div> }';
};

const MAP_EVENT = {
    'click': 'onClick',
};

function vue2jsx(elem) {
    // TODO type 肯定是用来描述节点类型的, 但是现在没空看了
    const isText = elem.type === 2;
    if (isText) {
        // 这里没有时间仔细去看文档, 应该是有方法能区分纯 text 和有数据绑定的 text 的
        if (elem.static) {
            return elem.text;
        } else {
            // 有数据绑定的 text
            return elem.tokens.reduce((text, token) => {
                return text.replace(new RegExp(`{{${token['@binding']}}}`, 'g'), `{${token['@binding']}}`);
            }, elem.text);
        }
    } else {
        const hasTag = elem.tag;

        if (hasTag) {
            // 有 tag, 是个标签
            const hasChildren = elem.children && elem.children.length;
            const tagFor = elem.attrsMap && elem.attrsMap['v-for'];
            const hasEvent = elem.events && Object.keys(elem.events).length;
            const hasBinds = elem.attrs && elem.attrs.length;
            const hasModel = elem.model;
            const changeDirective = elem.directives && elem.directives.find(di => di.name  === 'model');

            const inner = `<${elem.tag}${
                // 事件绑定 (目前只实现了 click)
                hasEvent ? ` ${Object.entries(elem.events).map(([event, { value }]) => {
                    if (!MAP_EVENT[event]) {
                        return '';
                    }
                    if (/(\w+\(\),?)+/.test(value)) {
                        return `${MAP_EVENT[event]}={() => { ${value} }}`;
                    } else {
                        return `${MAP_EVENT[event]}={${value}}`;
                    }
                }).join(' ')}` : ''
            }${
                // 数据动态绑定
                hasBinds ? ` ${elem.attrs.map(({ name, value, dynamic }) => {
                    return dynamic !== undefined ? `${name}={${value}}` : `${name}=${value}`;
                }).join(' ')}` : ''
            }${
                // 数据双向绑定 (目前只实现了 v-model)
                hasModel ? ` value={${elem.model.value}} onChange={${elem.model.callback.replace(/^function \(\$\$v\)/, '(\$\$\$\$v) =>')}}` : ''
            }${
                // 目前没搞清为啥原始 DOM 组件的 v-model 标记和自定义组件的不同
                // 个人猜想可能是 input 用 input, checkbox 用 change 这种事件的区别, 导致了这一行为
                changeDirective ? ` value={${changeDirective.value}} onChange={($$v) => $set(store, "${changeDirective.value.replace(/^store\./, '')}", $$v.target.value)}` : ''
            }${
                // 子组件递归
                hasChildren ? `>${elem.children.map(vue2jsx).join('')}</${elem.tag}>` : '/>'
            }`;

            if (tagFor) {
                // v-for 循环逻辑
                return `{${elem.for}.map((${elem.alias}) => ${inner})}`;
            } else {
                return inner;
            }
        } else {
            // 无 tag, 可能就是 innerText
            return elem.text;
        }
    }
}
