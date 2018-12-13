/**
 * @auth yangyufei
 * @date 2018-12-04 12:53:28
 * @desc
 */
const _     = require('lodash');
const fs    = require('fs');
const path  = require('path');

const ENV   = process.env.NODE_ENV || 'development';

let config = {
	// 错误相关信息
	ERROR_OBJ   : {
		SUCCESS     : {code: 0, msg: '操作成功！'},

		DEFAULT     : {code: 100, msg: '系统错误！'},
	},

	GIT_URL     : 'yyf19871102/cmcc_spider_template'
};

// 读取config目录下所有配置文件，并合并到system当中
fs.readdirSync(__dirname).forEach(fileName => {
	let stats = fs.statSync(path.join(__dirname, fileName));

	if (!stats.isDirectory() && fileName.startsWith(`${ENV}_`) && fileName.endsWith('.js')) {
		let key = fileName.replace(`${ENV}_`, '').replace('.js', '').toUpperCase();
		let value = require(path.join(__dirname, fileName));
		config.hasOwnProperty(key) ? _.merge(config[key], value) : (config[key] = value);
	}
});

module.exports = config;