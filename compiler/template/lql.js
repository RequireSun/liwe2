
const STORE_METHODS = {
    get(store, key) {
        return store[key];
    },
    set(store, key, value) {
        store[key] = value;
    },
    push(store, key, value) {
        if (Array.isArray(store[key])) {
            store[key].push(value);
        }
    },
    splice(store, start, delCount, ...inserted) {
        if (Array.isArray(store[key])) {
            store[key].splice(start, delCount, ...inserted);
        }
    },
};

const MAP_METHODS = {
    number(store, ast) {
        return ast.value;
    },
    bool(store, ast) {
        return ast.value;
    },
    insert(store, ast) {
        // 这里判断不够严谨
        if (
            ast.table && ast.columns && ast.columns.length &&
            ast.values && ast.values[0] && ast.values[0].value &&
            ast.values[0].type === 'expr_list' && ast.values[0].value.length &&
            ast.columns.length === ast.values[0].value.length
        ) {
            STORE_METHODS.push(store, ast.table, ast.columns.reduce((record, key, index) => {
                const wrapped = methodsRouter(store, ast.values[0].value[index]);
                record[key] = undefined !== wrapped ? (typeof wrapped === 'object' ? wrapped[key] : wrapped) : undefined;
                return record;
            }, {}));
        }
    },
    update(store, ast) {
        if (ast.table && ast.set && ast.set.length) {
            // TODO where
            for (const { value } of ast.set) {
                // TODO 这里直接把值填入了, 后面定好 schema 规则以后肯定不能这么干
                STORE_METHODS.set(store, ast.table, value.value);
            }
        }
    },
    select(store, ast) {
        // TODO join 的情况暂时没考虑
        // TODO as 还没考虑 (在 col.as 字段上)
        if (
            ast.from && ast.from[0] && ast.from[0].table &&
            ast.columns && ast.columns.length
        ) {
            return ast.columns.reduce((record, col) => {
                record[col.expr.column] = STORE_METHODS.get(store, col.expr.column);
                return record;
            }, {});
        }
    },
};

function methodsRouter(store, ast) {
    if (MAP_METHODS[ast.type]) {
        return MAP_METHODS[ast.type](store, ast);
    } else {
        return null;
    }
}

extendObservable(store, {
    {% for action in actions %}
        {{ action | safe }},
    {% endfor %}
});
