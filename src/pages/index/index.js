import { observable, action } from 'mobx';

export default class Store {
    @observable
    list = [{
        name: 'name1',
        count: 0,
        code: 918000,
        addr: 'dont know',
    }, ];
    @observable
    options = [{
        label: 'label1',
        value: 1,
    }, {
        label: 'label2',
        value: 2,
    }, ];
    @observable
    selected = [1];
    @observable
    number1 = 1;
    @observable
    number2 = 2;

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
