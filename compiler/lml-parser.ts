import { ASTNode, ASTElement, ASTExpression, ASTText } from 'vue-template-compiler';

enum ASTType {
    Element = 1,
    Expression = 2,
    Text = 3,
}

function isElement(elem: ASTNode): elem is ASTElement {
    return elem && elem.type === ASTType.Element;
}
// function isExpression(elem: ASTNode): elem is ASTExpression {
//     return elem && elem.type === ASTType.Expression;
// }
// function isText(elem: ASTNode): elem is ASTText {
//     return elem && elem.type === ASTType.Text;
// }

const MAP_EVENT = {
    'click': 'onClick',
};

// 目前先做成返回 string, 后面再看要不要搞花活
const MAP_RENDER: {
    [key in ASTType]: (AST: ASTNode) => string;
} = {
    [ASTType.Element](AST: ASTElement) {
        return '';
    },
    [ASTType.Expression](AST: ASTExpression) {
        return AST.tokens.map(token => {
            if (typeof(token) === 'string') {
                return token;
            } else {
                // 应该只有这两种 case, 所以这里就不判断 @binding 了
                return `{${token['@binding']}}`;
            }
        }).join('');
    },
    [ASTType.Text](AST: ASTText) {
        // 不知道为什么, text 类型还有个 static 标记, 我生成的 case 都是 true
        // 但如果里面加了字段读取, 就直接退化成表达式了
        // 那这个 static 有什么用呢
        return AST.text;
    },
};

module.exports = function vue2jsx(elem: ASTNode) {
    if(isElement(elem)) {
        // 老逻辑
        // 有 tag, 是个标签
        const hasChildren = elem.children && elem.children.length;
        const tagFor = elem.attrsMap && elem.attrsMap['v-for'];
        const hasEvent = elem.events && Object.keys(elem.events).length;
        const hasBinds = elem.attrs && elem.attrs.length;
        const hasModel = elem.model;
        const changeDirective = elem.directives && elem.directives.find(di => di.name  === 'model');

        const inner = `<${elem.tag}${
            // 事件绑定 (目前只实现了 click)
            hasEvent ? ` ${(Object.entries(elem.events!) as any[]).map(([event, { value }]) => {
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
            // 这里跟声明的结构对不上, 只能强行写了
            hasBinds ? ` ${elem.attrs!.map(({ name, value, dynamic }: { name: string; value: any, dynamic: any; }) => {
                return dynamic !== undefined ? `${name}={${value}}` : `${name}=${value}`;
            }).join(' ')}` : ''
        }${
            // 数据双向绑定 (目前只实现了 v-model)
            hasModel ? ` value={${elem.model!.value}} onChange={${elem.model!.callback.replace(/^function \(\$\$v\)/, '(\$\$\$\$v) =>')}}` : ''
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
        // 新逻辑
        return MAP_RENDER[elem.type](elem);
    }
};
