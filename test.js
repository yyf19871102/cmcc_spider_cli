/**
 * @auth yangyufei
 * @date 2018-12-12 09:00:20
 * @desc
 */
const download  = require('download-git-repo');
const Promise   = require('bluebird');
const downloadP = Promise.promisify(download);

downloadP('yyf19871102/test_tags#v0.1.1', 'd://');