'use strict';

var database = require('./database.js');
var fs = require('fs');
var Promise = require('es6-promise').Promise;
var request = require('./request.js');
var xml2js = require('xml2js');


database.initialize();

var prerenderSitemap = function (xmlInput) {
    var sitemapData;
    var output;

    xml2js.parseString(xmlInput, function (err, result) {
        output = result;
        sitemapData = result;
    });

    var pages = sitemapData.urlset.url;
    pages.forEach(function (page) {
        var url = page.loc[0];
        var lastMod = page.lastmod ? page.lastmod[0] : null;

        database.get(url).then(
            function (stored) {
                return new Promise(function (resolve, reject) {
                    if (stored) {
                        var storedLastMod = (new Date(stored.lastmod)).getTime();
                        var sitemapLastMod = (new Date(lastMod)).getTime();
                        // if we don't need to update, skip
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
                    request.post(url + '?_escaped_fragment_', {}, function () {
                        resolve();
                    });
                });
            }
        ).then(
            function () {
                return new Promise(function (resolve, reject) {
                    database.update(url, lastMod);
                    resolve();
                });
            }
        );
    });
};

module.exports = prerenderSitemap;
