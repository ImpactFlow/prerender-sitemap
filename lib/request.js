'use strict';

var http = require('http');
var Promise = require('es6-promise').Promise;
var urlParse = require('url').parse;


module.exports = {
    post: function (url, body, callback) {
        return new Promise(function (resolve, reject) {
            var parsedUrl = urlParse(url);

            body = JSON.stringify(body);

            callback = callback || function (response, resolve) {
                return resolve();
            };

            var request = new http.ClientRequest({
                hostname: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
            });

            request.end(body);

            request.on('response', function (response) {
                callback(response, resolve, reject);
            });

            request.on('error', function (err) {
                callback(err, resolve, reject);
            });
        });
    },
};
