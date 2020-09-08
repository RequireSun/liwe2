import { Parser } from 'flora-sql-parser';
import nunjucks from 'nunjucks';
import path from 'path';

const parser = new Parser();

// 目前暂时的对应关系 -> table: 组件
// 其他对应关系先凑合着来

// TODO 这里图省事, 先用逐行读取顶上了, 真要实现肯定要用 PEG 组 AST 的
export default function (source) {
    let start = -1;
    let end = -1;
    const lines = source.split(/\r?\n/);
    const ASTs = {};

    for (let i = 0; i < lines.length; ++i) {
        if (start === -1) {
            if (lines[i].trim().endsWith(':')) {
                start = i;
            }
        }
        if (end === -1) {
            if (lines[i].trim().endsWith(';')) {
                end = i;
            }
        }
        if (start !== -1 && end !== -1) {
            // 没做防重, 先这样了
            const name = lines[start].trim().replace(/:$/, '');
            // 命名行不要, 结束行 +1
            const content = lines.slice(start + 1, end + 1);
            // TODO 这里这么干肯定不对, 有些 IDE 不会自动帮你删除行尾空格
            ASTs[name] = parser.parse(content.join('').trim().replace(/;$/, ''));
            start = end = -1;
        }
    }

    const results: string[] = [];

    for (const [name, ast] of Object.entries(ASTs)) {
        results.push(ast2action(name, ast));
    }

    return nunjucks.render(path.resolve(__dirname, './template/lql.js'), {
        actions: results,
    });
};

function ast2action(name, ast) {
    return `${name}() { methodsRouter(this, ${JSON.stringify(ast, undefined, 2)}) }`;
}
