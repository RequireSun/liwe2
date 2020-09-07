import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
} from 'react-router-dom'
import Components from './components';
import Index from './pages/index/index.lml';
import Form from './pages/form/index.lml';

// components 实现的比较粗糙, 后面再说
ReactDOM.render(
    <Router>
        <nav>
            <ul>
                <li>
                    <Link to="/">Index</Link>
                </li>
                <li>
                    <Link to="/form">Form</Link>
                </li>
            </ul>
        </nav>
        <Switch>
            <Route exact path="/">
                <Index Components={Components} />
            </Route>
            <Route path="/form">
                <Form Components={Components} />
            </Route>
        </Switch>
    </Router>,
    document.getElementById('root'),
);
