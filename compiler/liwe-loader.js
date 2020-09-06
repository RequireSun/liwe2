const compiler = require('vue-template-compiler');
const path = require('path');
const fs = require('fs');
// const loaderUtils = require('loader-utils');
// var headerPath = path.resolve('header.js');
//
// this.addDependency(headerPath);
//
// fs.readFile(headerPath, 'utf-8', function(err, header) {
//     if(err) return callback(err);
//     callback(null, header + "\n" + source);
// });
// const options = getOptions(this);
//
// source = source.replace(/\[name\]/g, options.name);

module.exports = function (source) {
    // var callback = this.async();
    let jsExist = false;
    const PATH_JS = path.resolve(path.dirname(this._module.resource), 'index.js');
    try {
        fs.statSync(PATH_JS);
        // js = fs.readFileSync(PATH_JS, 'utf-8');
        jsExist = true;
    } catch(ex) {
        // 文件不存在
    }

//     if (js) {
//         js = `function Page(config) {
//     return class Store {
//         @observable
//     }
// }
// const store = ${js}`;
//     }
    const js = jsExist ?
        `
import Store from "./index.js"; 
` :
        `
class Store {}
`;

    const AST = compiler.compile(source).ast;
    // console.log(AST.children[6]);
    // console.log(AST.children[4].events.click);
    // console.log(AST.children[0].children);
    // console.log(AST.children[2].children[0].children[0].children[0]);
    // 先用字符串了
    const result = `
import React from "react";
import { Provider, observer, inject } from "mobx-react";
${js}

const store = new Store();
window.__store__ = store;

const App = inject('store')(observer(function (props) {
    const { Components, store } = props;
    function $set(store, key, value) {
        store[key] = value;
    }

    return (
        ${vue2jsx(AST)}
    );
}));

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

// TODO type 肯定是用来描述节点类型的, 但是现在没空看了
function vue2jsx(elem) {
    const isText = elem.type === 2;
    if (isText) {
        if (elem.static) {
            return elem.text;
        } else {
            return elem.tokens.reduce((text, token) => {
                return text.replace(new RegExp(`{{${token['@binding']}}}`, 'g'), `{${token['@binding']}}`);
            }, elem.text);
        }
    } else {
        const hasTag = elem.tag;

        if (hasTag) {
            const hasChildren = elem.children && elem.children.length;
            const tagFor = elem.attrsMap && elem.attrsMap['v-for'];
            const hasEvent = elem.events && Object.keys(elem.events).length;
            const hasBinds = elem.attrs && elem.attrs.length;
            const hasModel = elem.model;

            const inner = `<${elem.tag}${hasEvent ? ` ${Object.entries(elem.events).map(([event, { value }]) => {
                return `${MAP_EVENT[event]}={${value}}`;
            })}` : ''}${hasBinds ? ` ${elem.attrs.map(({ name, value, dynamic }) => {
                return dynamic !== undefined ? `${name}={${value}}` : `${name}=${value}`;
            }).join(' ')}` : ''}${
                hasModel ? ` value={${elem.model.value}} onChangeValue={${elem.model.callback.replace(/^function \(\$\$v\)/, '(\$\$\$\$v) =>')}}` : ''
            }${hasChildren ? `>${elem.children.map(vue2jsx).join('')}</${elem.tag}>` : '/>'}`;

            if (tagFor) {
                // const [, item, list] = tagFor.match(/^(\w+) in (\w+)$/);
                // return `{${list}.map((${item}) => ${inner})}`;
                return `{${elem.for}.map((${elem.alias}) => ${inner})}`;
            } else {
                return inner;
            }
        } else {
            return elem.text;
        }
    }
}
