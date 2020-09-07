import { observable } from 'mobx';

export default class Store {
    @observable
    todos = [];
    @observable
    title = '';
    @observable
    deadline = '';
}
