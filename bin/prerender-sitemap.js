#!/usr/bin/env node

'use strict';

var fs = require('fs');
var prerenderSitemap = require('../lib/prerender-sitemap.js');

if (process.argv.length < 2) {
    console.error('Too few arguments');
    process.exit(1);
}

var sourceFile = process.argv[2];

if (!fs.existsSync(sourceFile)) {
    console.error('File does not exist: ' + sourceFile);
    process.exit(1);
}

var filedata = fs.readFileSync(sourceFile);
prerenderSitemap(filedata.toString());
