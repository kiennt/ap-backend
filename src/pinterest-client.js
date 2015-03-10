const DOMAIN = 'https://api.pinterest.com/v3';
const CLIENT_ID = "1431594";

const GET = "get";
const POST = "post";
const PUT = "put";

var request = require('request');

export class PinterestClient {
	constructor(authKey) {
		this.authKey = authKey;
	}

	getURL(methodName, path, params) {
		let url = `${DOMAIN}/${path}`;

		if (params) {
			let stringOfParams = "";
			for (var key in params) {
				stringOfParams += `${key}=${params[key]}&`;
			};
			url += `?${stringOfParams}`;
		}

		return url;
	}

	requestToServer(methodName, path, params, data) {
		let url = this.getURL(methodName, path, params);
		console.log(url);

		var func;
		switch(methodName) {
			case PUT:
				func = request.put;
				break;
			case POST:
				func = request.post;
				break;
			case DELETE:
				func = request.delete;
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
				switch(response.statusCode) {
					case 200:
						console.log(body);
						break
					case 401:
						console.log(body);
						break
					default:
				}
			} else {
				throw error;
			}
		});
	}

	likeAPin(pinId) {
		let params = {
			"access_token" : this.authKey
		};
		this.requestToServer(PUT, `pins/${pinId}/like/`, null, params);
	}
}