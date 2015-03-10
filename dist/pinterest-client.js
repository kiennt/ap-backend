"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var DOMAIN = "https://api.pinterest.com/v3";
var CLIENT_ID = "1431594";

var GET = "get";
var POST = "post";
var PUT = "put";

var request = require("request");

var PinterestClient = exports.PinterestClient = (function () {
	function PinterestClient(authKey) {
		_classCallCheck(this, PinterestClient);

		this.authKey = authKey;
	}

	_createClass(PinterestClient, {
		getURL: {
			value: function getURL(methodName, path, params) {
				var url = "" + DOMAIN + "/" + path;

				if (params) {
					var stringOfParams = "";
					for (var key in params) {
						stringOfParams += "" + key + "=" + params[key] + "&";
					};
					url += "?" + stringOfParams;
				}

				return url;
			}
		},
		requestToServer: {
			value: function requestToServer(methodName, path, params, data) {
				var url = this.getURL(methodName, path, params);
				console.log(url);

				var func;
				switch (methodName) {
					case PUT:
						func = request.put;
						break;
					case POST:
						func = request.post;
						break;
					case DELETE:
						func = request["delete"];
						break;
					default:
						break;
				}
				func({
					url: url,
					formData: {
						access_token: this.authKey
					}
				}, function (error, response, body) {
					if (!error) {
						switch (response.statusCode) {
							case 200:
								console.log(body);
								break;
							case 401:
								console.log(body);
								break;
							default:
						}
					} else {
						throw error;
					}
				});
			}
		},
		likeAPin: {
			value: function likeAPin(pinId) {
				var params = {
					access_token: this.authKey
				};
				this.requestToServer(PUT, "pins/" + pinId + "/like/", null, params);
			}
		}
	});

	return PinterestClient;
})();

Object.defineProperty(exports, "__esModule", {
	value: true
});
