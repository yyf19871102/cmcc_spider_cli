/**
 * @auth yangyufei
 * @date 2018-06-18 18:45:15
 * @desc 工具集合
 */
const config        = require('../config/index');
const {ERROR_OBJ}   = config;

/**
 * 抛出指定异常
 * @param errObj
 * @param errMsg
 * @param errData
 */
exports.threw = (errObj = ERROR_OBJ.DEFAULT, errMsg = '', errData = {}) => {
	let code = errObj.code && !isNaN(errObj.code) ? errObj.code : ERROR_OBJ.DEFAULT.code;
	let msg = errObj.msg || ERROR_OBJ.DEFAULT.msg;

	let err = new Error(msg);
	err.code = code;
	err.data = errData;

	throw err;
};