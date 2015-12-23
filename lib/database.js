'use strict';

var fs = require('fs');
var Promise = require('es6-promise').Promise;
var sqlite3 = require('sqlite3');

var file = 'sitemap.db';
var dbExists = fs.existsSync(file);
var db = new sqlite3.Database(file);


module.exports = {
    initialize: function () {
        db.serialize(function() {
            if (!dbExists) {
                db.exec('CREATE TABLE Urls (url TEXT UNIQUE, lastmod TEXT)');
            }
        });
    },

    get: function (url) {
        return new Promise(function (resolve, reject) {
            db.get('SELECT * FROM Urls WHERE url="' + url + '";', function (err, row) {
                resolve(row);
            });
        });
    },

    update: function (url, lastMod) {
        return new Promise(function (resolve, reject) {
            // add or update
            var sqlStatement = 'INSERT OR IGNORE INTO Urls (url, lastmod) VALUES("' + url + '", "' + lastMod + '");' +
                'UPDATE Urls SET lastmod = "' + lastMod + '" WHERE url="' + url+ '";';
            db.exec(sqlStatement, resolve);
        });
    },
};
