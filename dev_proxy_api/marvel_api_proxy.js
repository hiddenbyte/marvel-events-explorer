'use strict';

var http 	= require('http');
var url 	= require('url');
var crypto 	= require('crypto');
var config 	= require('./config.js');


var marvel_account_privateKey  = config.marvel_account_privateKey;
var marvel_api_host  = config.marvel_api_host;


var computeHash = function(privateKey,publicKey,ts) {
	var md5 = crypto.createHash('md5');
	md5.update(ts + privateKey + publicKey, 'utf8');
	return md5.digest('hex');
};


var server = http.createServer(function(req, proxy_response) {
	
	var request_url = url.parse(req.url, true);

	var public_key = request_url.query['apikey'];

	var ts = request_url.query['ts'] = (new Date()).getMilliseconds() + '';

	request_url.query['hash'] = computeHash(marvel_account_privateKey, public_key, ts);

	request_url.search = request_url.path = request_url.href = null;

	request_url.protocol ='http';
	request_url.host = marvel_api_host;

	var marvel_request_url = url.format(request_url);

	console.log('Requesting ' + marvel_request_url);

	var request_marvel = http.request(marvel_request_url, function(marvel_response) {

		for(var header_name in marvel_response.headers)
			proxy_response.setHeader(header_name, marvel_response.headers[header_name]);

		marvel_response.on('data', function(chunk) {
			proxy_response.write(chunk);
		});

		marvel_response.on('end', function() {
			proxy_response.end();
		});

	});

	request_marvel.end();
});


server.listen(config.proxy_port);

console.log('Development Marvel api proxy has started.');