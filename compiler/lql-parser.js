const { Parser } = require('flora-sql-parser');
const parser = new Parser();

// TODO 这里图省事, 先用逐行读取顶上了, 真要实现肯定要用 PEG 组 AST 的
module.exports = function (source) {
    let start = -1;
    let end = -1;
    const lines = source.split(/\r?\n/);
    const result = {};

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
            result[name] = parser.parse(content.join('').trim().replace(/;$/, ''));
            start = end = -1;
        }
    }

    return result;
};
