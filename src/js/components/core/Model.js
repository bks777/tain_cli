export default class Model {
    constructor() {
        this._data = {};
    }

    getData(alias){
        return this._data[alias];
    }

    setData(alias, data){
        this._data[alias] = data;

        return this._data[alias];
    }

    deleteData(alias){
        delete this._data[alias];
    }
}