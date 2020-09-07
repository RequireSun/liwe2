
const MAP_EVENT = {
    'click': 'onClick',
};

module.exports = function vue2jsx(elem) {
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
                hasEvent ? ` ${(Object.entries(elem.events) as any[]).map(([event, { value }]) => {
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
};
