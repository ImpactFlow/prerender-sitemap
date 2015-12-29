'use strict';

var database = require('./database.js');
var fs = require('fs');
var Promise = require('es6-promise').Promise;
var request = require('./request.js');
var xml2js = require('xml2js');


var prerenderServerUrl = 'http://localhost:3000/';

database.initialize();

var prerenderSitemap = function (xmlInput) {
    var sitemapData;

    xml2js.parseString(xmlInput, function (err, result) {
        sitemapData = result;
    });

    var pages = sitemapData.urlset.url;
    pages.reduce(function (promise, page) {
        return promise.then(function () {
            var url = page.loc[0];
            var lastMod = page.lastmod ? page.lastmod[0] : null;

            return database.get(url).then(
                function (stored) {
                    return new Promise(function (resolve, reject) {
                        if (stored) {
                            var storedLastMod = (new Date(stored.lastmod)).getTime();
                            var sitemapLastMod = (new Date(lastMod)).getTime();
                            if (storedLastMod >= sitemapLastMod) {
                                return reject();
                            }
                        }

                        resolve();
                    });
                }
            ).then(
                function () {
                    return new Promise(function (resolve, reject) {
                        request.post(prerenderServerUrl + url, {}, function () {
                            resolve();
                        });
                    });
                },
                Function
            ).then(
                function () {
                    return new Promise(function (resolve, reject) {
                        database.update(url, lastMod);
                        resolve();
                    });
                }
            );
        });
    }, Promise.resolve());
};

module.exports = prerenderSitemap;
