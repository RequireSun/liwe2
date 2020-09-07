import React from 'react';
import { extendObservable } from 'mobx';
import { Provider, observer, inject } from 'mobx-react';
{% if hasStoreFile %}
import Store from './index.js';
{% endif %}

{# 不存在 store 文件时要搞个假的 store #}
{% if not hasStoreFile %}
class Store {}
{% endif %}

const store = new Store();
// 调试用
window.__store__ = store;

{% for enhancer in storeEnhancers %}
    {{ enhancer | safe }}
{% endfor %}

// 数据注入
const App = inject('store')(observer(function (props) {
    const { Components, store } = props;
    function $set(store, key, value) {
        store[key] = value;
    }

    return (
        {{ jsx | safe }}
    );
}));

// provider 包裹 (里面还有 Components)
export default function (props) {
    return (
        <Provider store={store}>
            <App {...props} />
        </Provider>
    );
}
