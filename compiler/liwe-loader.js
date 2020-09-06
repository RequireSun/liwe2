const compiler = require('vue-template-compiler');

module.exports = function (source) {
    const AST = compiler.compile(source).ast;
    console.log(AST.children[0].children);
    console.log(AST.children[2].children[0].children[0].children[0]);
    // 先用字符串了
    const result = `
import React from "react";

export default function () { 
    return (
        ${vue2jsx(AST)}
    );
}
`;
    console.log(result);
    // return result;
    return 'import React from "react"; export default function () { return <div>123</div> }';
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

            const inner = `<${elem.tag}${hasChildren ? `>${elem.children.map(vue2jsx).join('')}</${elem.tag}>` : '/>'}`;

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
