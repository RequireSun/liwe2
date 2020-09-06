import React from 'react';
import ReactDOM from 'react-dom';
import Components from './components';
import Index from './pages/index/index.lml';

// components 实现的比较粗糙, 后面再说
ReactDOM.render(
    <Index Components={Components} />,
    document.getElementById('root'),
);
