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
const rimraf    = require('rimraf');
const rmDirP    = Promise.promisify(rimraf);
const Handlebars= require('handlebars');
const delFile   = Promise.promisify(fs.unlink);
const moment    = require('moment');

const SysConf   = require('../config');

const info      = chalk.bold.dim.green;
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

/**
 * 生成模板文件；
 * @param dirPath 项目根路径
 * @param setting 配置变量
 */
const replaceFile = (dirPath, setting) => {
    for (let fileOrDir of fs.readdirSync(dirPath)) {
        let fileOrDirPath = path.join(dirPath, fileOrDir);

        // 替换模板文件中的变量
        if (fs.statSync(fileOrDirPath).isFile()) {
            if (!/json|js$/.test(fileOrDir)) continue;

            let str = fs.readFileSync(fileOrDirPath, 'utf-8');
            let result = Handlebars.compile(str)(setting);

            fs.writeFileSync(fileOrDirPath, result);
        } else {
            if (/node_modules/.test(fileOrDir)) continue;

            replaceFile(fileOrDirPath, setting);
        }
    }
};

program
	.version('0.1.0')
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

			let tag = answer.version ? `#${answer.version}` : '';
			let gitUrl = `${SysConf.GIT_URL}${tag}`;
			let destPath = path.join(process.cwd(), `cmcc_spider_${answer.project}`);

			console.log(info('\nSTEP1.开始下载模板文件...'));
			await downloadP(gitUrl, destPath);

			await delFile(path.join(destPath, '.gitignore'));
			await delFile(path.join(destPath, 'README.md'));

			// 重构目录
			let templatePath = path.join(destPath, 'template');
			for (let fileOrDir of fs.readdirSync(templatePath)) {
                fs.renameSync(path.join(templatePath, fileOrDir), path.join(destPath, fileOrDir));
            }

            // 删除模板工程
            await rmDirP(templatePath);


			console.log(info('STEP2.开始生成工程文件...'));
			answer.dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
			replaceFile(destPath, answer);

			console.log(info('\ncmcc_spider工程生成结束。'))
		} catch (err) {
		    console.error(err);
			// console.error(error(JSON.stringify(err, null, 4)));
		}
	})
	.parse(process.argv);