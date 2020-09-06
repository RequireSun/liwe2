import { observable, action } from 'mobx';

export default class Store {
    @observable
    list = [{
        name: 'name1',
        count: 0,
        code: 918000,
        addr: 'dont know',
    }];

    @action.bound
    addOne() {
        this.list.push({
            name: `name${Date.now()}`,
            count: Math.floor(Math.random() * 6),
            code: 918000,
            addr: 'dont know',
        });
    }
}
