import { observable } from 'mobx';

export default class Store {
    @observable
    todos = [{
        title: '1',
        deadline: '123',
        done: false,
    }];
    @observable
    title = '';
    @observable
    deadline = '';
}
