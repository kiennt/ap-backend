"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var PinterestClient = require("./pinterest-client").PinterestClient;

var Bot = exports.Bot = (function () {
    function Bot(authKey, type) {
        _classCallCheck(this, Bot);

        switch (type) {
            case "pinterest":
                this.client = new PinterestClient(authKey);
        }
    }

    _createClass(Bot, {
        run: {
            value: function run() {
                this.client.likeAPin("83879611786469438");
            }
        }
    });

    return Bot;
})();

Object.defineProperty(exports, "__esModule", {
    value: true
});
