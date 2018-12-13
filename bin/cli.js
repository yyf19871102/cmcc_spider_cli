#!/usr/bin/env node

/**
 * @auth yangyufei
 * @date 2018-12-11 19:14:23
 * @desc
 */
const program   = require('commander');
const Promise   = require('bluebird');
const download  = require('download-git-repo');
const downloadP = Promise.promisify(download);
const path      = require('path');
const chalk     = require('chalk');
const inquirer  = require('inquirer');
const fs        = require('fs');

const SysConf   = require('../config');

const error     = chalk.bold.dim.red;
const warning   = chalk.keyword('orange');

/**
 * 校验输入字符串
 * @param str
 * @return {boolean}
 */
const checkStr  = function (str) {
	let result = /\w|\d/g.test(str);
	!result && console.log(error(' 错误：输入只接受英文字符、数字和_，请重新输入！'));
	return result;
};

program
	.version('0.0.1')
	.usage('cmcc_spider爬虫脚手架')
	.description('生成爬虫项目（NODEJS实现）骨架')
	.action(async () => {
		try {
			let answer = await inquirer.prompt([
				{
					type    : 'input',
					name    : 'author',
					message : '请输入开发者名字：',
					validate: checkStr,
				},
				{
					type    : 'input',
					name    : 'project',
					message : '请输入工程名称：',
					validate: input => {
						if (!checkStr(input)) return false;

						let projectDir = path.join(process.cwd(), input);
						if (fs.existsSync(projectDir)) {
							console.log(error(` 错误：该工程（${projectDir}）已经存在，请重新填写工程名！`));
							return false;
						}

						return true;
					},
				},
				{
					type    : 'input',
					name    : 'version',
					message : '请选择版本：',
				}
			]);

			let gitUrl = `${SysConf.GIT_URL}#${answer.version || ''}`;
			console.log(answer);
			console.log(gitUrl);
			// await downloadP(gitUrl, process.cwd());
		} catch (err) {
			console.error(err);
		}
	})
	.parse(process.argv);