import { ASTNode, ASTElement, ASTExpression, ASTText } from 'vue-template-compiler';

enum ASTType {
    Element = 1,
    Expression = 2,
    Text = 3,
}

// function isElement(elem: ASTNode): elem is ASTElement {
//     return elem && elem.type === ASTType.Element;
// }
// function isExpression(elem: ASTNode): elem is ASTExpression {
//     return elem && elem.type === ASTType.Expression;
// }
// function isText(elem: ASTNode): elem is ASTText {
//     return elem && elem.type === ASTType.Text;
// }

const MAP_EVENT = {
    'click': 'onClick',
    'change': 'onChange',
    'input': 'onInput',
};

// 这里先放在一个文件里了, 后面看情况是否独立拆分文件
// 目前先做成返回 string, 后面再看要不要搞花活
const MAP_RENDER: {
    [key in ASTType]: (AST: ASTNode) => string;
} = {
    [ASTType.Element](AST: ASTElement) {
        // TODO v-if 还没实现
        const tag = AST.tag;
        const attrs: string[] = [];
        const inners: string[] = [];

        // 事件绑定 (目前只实现了 click)
        if (AST.events && Object.keys(AST.events).length) {
            for (let [event, handlers] of Object.entries(AST.events)) {
                // TODO 暂时忽略掉不支持的事件, 后面补齐
                if (!MAP_EVENT[event]) {
                    continue;
                }

                // 如果同时存在 v-model 和对应的 change 事件, handlers 就是数组了
                if (!Array.isArray(handlers)) {
                    handlers = [handlers];
                }

                // TODO param 和 modifier 都还没试出来
                // TODO $event 补齐
                if (handlers.length === 1) {
                    const { value } = handlers[0];

                    // param 参数可能用在这里
                    // TODO 这里要兼容用户声明入参的格式
                    if (/^(\w+\(\),?)+$/.test(value)) {
                        // 多个函数串联执行的 case `aaa(),bbb(),ccc()`
                        // 在 JSX 中执行的时候需要包裹一层
                        attrs.push(`${MAP_EVENT[event]}={($event) => { ${value} }}`);
                    } else if (/^[\w\.]+$/.test(value)) {
                        attrs.push(`${MAP_EVENT[event]}={${value}}`);
                    } else {
                        // 非常长的那种带 if-else 的普通语句
                        attrs.push(`${MAP_EVENT[event]}={($event) => {${value}}}`);
                    }
                } else {
                    const fns: string[] = [];
                    for (const { value } of handlers) {
                        // 这些函数都搞成自执行的, 防止那个 return 阻塞了其他事件
                        if (/^(\w+\(\),?)+$/.test(value)) {
                            fns.push(`(function () { ${value} })();`);
                        } else if (/^[\w\.]+$/.test(value)) {
                            fns.push(`${value}($event);`);
                        } else {
                            fns.push(`(function () { ${value} })();`);
                        }
                    }
                    attrs.push(`${MAP_EVENT[event]}={($event) => { ${fns.join('')} }}`);
                }
            }
        }

        // props 传入
        // TODO 使用 attrs 属性取其它属性直接透传到组件上
        // 不明白为什么有的属性传递放在 props 上 (猜测: 原生组件) 有的放在 attrs 上 (猜测: 自定义组件)
        // 虽然声明里 attrs 的 value 是 any, 但这里先凑合用了, 出问题再说
        const declaredProps: { name: string; value: string; }[] = [];

        if (AST.attrs) {
            declaredProps.push(...AST.attrs);
        }
        // 这里顺便也把 v-model 的绑定字段传了
        if (AST.props) {
            declaredProps.push(...AST.props);
        }

        if (declaredProps.length) {
            for (const { name, value } of declaredProps) {
                attrs.push(`${name}={${value}}`);
            }
        }

        if (AST.model) {
            attrs.push(`value={${AST.model.value}}`);
            // 因为正则匹配里 $x 会被替换成正则匹配的 group, 所以就搞成了四个
            attrs.push(`onChange={${AST.model.callback.replace(/^function \(\$\$v\)/, '($$$$v) =>')}}`);
        } else if (AST.directives) {
            // 这里先忽略, 因为我发现 HTML 组件的事件都直接通过 events 注入进去了
        }

        if (AST.children) {
            for (const child of AST.children) {
                inners.push(decisionMaker(child));
            }
        }

        // 根据目前的推论, 自定义组件使用 model 时会有 model & directives 属性, 原生组件只有 directives
        // TODO 只实现单个 v-model, 多个不同值双向绑定的事情以后再说

        const strAttr = attrs.length ? ` ${attrs.join(' ')}` : '';
        const strInner = inners.length ? inners.join('') : '';
        const strElem = strInner ? `<${tag}${strAttr}>${strInner}</${tag}>` : `<${tag}${strAttr} />`;

        // for 循环
        if (AST.for) {
            return `{${AST.for}.map((${AST.alias}) => ${strElem})}`;
        } else {
            return strElem;
        }
        // TODO if-else
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

export default function decisionMaker(AST: ASTNode): string {
    return MAP_RENDER[AST.type] ? MAP_RENDER[AST.type](AST) : '';
}
