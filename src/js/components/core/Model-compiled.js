"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
    function Model() {
        _classCallCheck(this, Model);

        this._data = {};
    }

    _createClass(Model, [{
        key: "getData",
        value: function getData(alias) {
            return this._data[alias];
        }
    }, {
        key: "setData",
        value: function setData(alias, data) {
            this._data[alias] = data;

            return this._data[alias];
        }
    }, {
        key: "deleteData",
        value: function deleteData(alias) {
            delete this._data[alias];
        }

        // parseResourcesJSON(data) {
        //     var me = this;
        //     return new Promise((resolve, reject)=>{
        //         for (let response of data){
        //             let parsed = JSON.parse(response.responseText);
        //             console.log(parsed);
        //         }
        //     })
        // }

    }]);

    return Model;
}();

exports.default = Model;

//# sourceMappingURL=Model-compiled.js.map