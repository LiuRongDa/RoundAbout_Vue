

/*是否合法IP地址*/
export function validateIP(rule, value,callback) {
    if(value==''||value==undefined||value==null){
        callback();
    }else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的IP地址'));
        } else {
            callback();
        }
    }
}

/**
 * 身份证号码校验
 */
export function isIdentityId(identityId) {
    var patrn = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;//长度或格式校验
    //地区校验
    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    // 出生日期验证
    var sBirthday = (
            identityId.substr(6, 4) +
            "-" +
            Number(identityId.substr(10, 2)) +
            "-" +
            Number(identityId.substr(12, 2))
        ).replace(/-/g, "/"),
        d = new Date(sBirthday)
    // 身份证号码校验 最后4位  包括最后一位的数字/字母X
    var sum = 0,
        weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        codes = "10X98765432";
    for (var i = 0; i < identityId.length - 1; i++) {
        sum += identityId[i] * weights[i];
    }
    var last = codes[sum % 11]; //计算出来的最后一位身份证号码

    var errorMsg = '';
    if (identityId === '') {
        errorMsg = "身份证号不能为空"
    } else if (!patrn.exec(identityId)) {
        errorMsg = "你输入的身份证长度或格式错误"
    } else if (!aCity[parseInt(identityId.substr(0, 2))]) {
        errorMsg = "你的身份证地区非法"
    } else if (sBirthday != d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()) { errorMsg = "身份证上的出生日期非法" } else if (identityId[identityId.length - 1] != last) {
        errorMsg = "你输入的身份证号非法"
    }
    return errorMsg;
}
export function validateIdcard(rule, value, callback) {
    var errorMsg = isIdentityId(value);
    if (errorMsg != "") {
        callback(new Error(errorMsg));
    }
}

//  验证用户名
export function isvalidUsername(rule, value, callback) {
    const reg = /^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$/;
    if(value == '' || value == undefined || value == null){
        callback();
    }else{
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请勿输入非法字符'));
        } else {
            callback();
        }
    }
}


// 验证密码   密码，以字母开头，长度在8~18之间，只能包含字母、数字和下划线
export function isvalidPass(rule, value, callback) {
    const reg = /^[a-zA-Z]\w{8,18}$/;
    if(value == '' || value == undefined || value == null){
        callback();
    }else{
        if ((!reg.test(value)) && value != '') {
            callback(new Error('密码以字母开头，长度在8~18之间，只能包含字母数字和下划线'));
        } else {
            callback();
        }
    }
}


/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback) {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的电话号码或者固话号码'));
        } else {
            callback();
        }
    }
}
/* 是否固话*/
export function validateTelphone(rule, value,callback) {
    const reg =/0\d{2}-\d{7,8}/;
    if(value==''||value==undefined||value==null){
        callback();
    }else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'));
        } else {
            callback();
        }
    }
}
/* 是否手机号码*/
export function validatePhone(rule, value,callback) {
    const reg =/^[1][3,4,5,7,8][0-9]{9}$/;
    if(value==''||value==undefined||value==null){
        callback();
    }else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的电话号码'));
        } else {
            callback();
        }
    }
}
/* 是否身份证号码*/
export function validateIdNo(rule, value,callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(value==''||value==undefined||value==null){
        callback();
    }else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的身份证号码'));
        } else {
            callback();
        }
    }
}
/* 是否邮箱*/
export function validateEMail(rule, value,callback) {
    const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
    if(value==''||value==undefined||value==null){
        callback();
    }else{
        if (!reg.test(value)){
            callback(new Error('请输入正确的邮箱地址'));
        } else {
            callback();
        }
    }
}
/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/*验证内容是否英文数字以及下划线*/
export function isPassword(rule, value, callback) {
    const reg =/^[_a-zA-Z0-9]+$/;
    if(value==''||value==undefined||value==null){
        callback();
    } else {
        if (!reg.test(value)){
            callback(new Error('密码仅由英文字母，数字以及下划线组成'));
        } else {
            callback();
        }
    }
}

/*自动检验数值的范围*/
export function checkMax20000(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
        callback();
    } else if (!Number(value)) {
        callback(new Error('请输入[1,20000]之间的数字'));
    } else if (value < 1 || value > 20000) {
        callback(new Error('请输入[1,20000]之间的数字'));
    } else {
        callback();
    }
}

//验证数字输入框最大数值,32767
export function checkMaxVal(rule, value,callback) {
    if (value < 0 || value > 32767) {
        callback(new Error('请输入[0,32767]之间的数字'));
    } else {
        callback();
    }
}
//验证是否1-99之间
export function isOneToNinetyNine(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入正整数'));
        } else {
            const re = /^[1-9][0-9]{0,1}$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入正整数，值为【1,99】'));
            } else {
                callback();
            }
        }
    }, 0);
}

// 验证是否整数
export function isInteger(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入正整数'));
        } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入正整数'));
            } else {
                callback();
            }
        }
    }, 0);
}
// 验证是否整数,非必填
export function isIntegerNotMust(rule, value, callback) {
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入正整数'));
        } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入正整数'));
            } else {
                callback();
            }
        }
    }, 1000);
}

// 验证是否是[0-1]的小数
export function isDecimal(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入[0,1]之间的数字'));
        } else {
            if (value < 0 || value > 1) {
                callback(new Error('请输入[0,1]之间的数字'));
            } else {
                callback();
            }
        }
    }, 100);
}

// 验证是否是[1-10]的小数,即不可以等于0
export function isBtnOneToTen(rule, value, callback) {
    if (typeof value == 'undefined') {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入正整数，值为[1,10]'));
        } else {
            if (!(value == '1' || value == '2' || value == '3' || value == '4' || value == '5' || value == '6' || value == '7' || value == '8' || value == '9' || value == '10')) {
                callback(new Error('请输入正整数，值为[1,10]'));
            } else {
                callback();
            }
        }
    }, 100);
}
// 验证是否是[1-100]的小数,即不可以等于0
export function isBtnOneToHundred(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入整数，值为[1,100]'));
        } else {
            if (value < 1 || value > 100) {
                callback(new Error('请输入整数，值为[1,100]'));
            } else {
                callback();
            }
        }
    }, 100);
}
// 验证是否是[0-100]的小数
export function isBtnZeroToHundred(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入[1,100]之间的数字'));
        } else {
            if (value < 0 || value > 100) {
                callback(new Error('请输入[1,100]之间的数字'));
            } else {
                callback();
            }
        }
    }, 100);
}

// 验证端口是否在[0,65535]之间
export function isPort(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (value == '' || typeof(value) == undefined) {
            callback(new Error('请输入端口值'));
        } else {
            const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入在[0-65535]之间的端口值'));
            } else {
                callback();
            }
        }
    }, 100);
}
// 验证端口是否在[0,65535]之间，非必填,isMust表示是否必填
export function isCheckPort(rule, value, callback) {
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (value == '' || typeof(value) == undefined) {
            //callback(new Error('请输入端口值'));
        } else {
            const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入在[0-65535]之间的端口值'));
            } else {
                callback();
            }
        }
    }, 100);
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}
/*保留2为小数*/
export function validatetoFixedNew(str) {
    return str ;
}
/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}
