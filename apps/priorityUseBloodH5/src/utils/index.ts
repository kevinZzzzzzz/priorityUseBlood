
/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
 export const isType = (val: any) => {
	if (val === null) return "null";
	if (typeof val !== "object") return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
};

/**
 * @description 多类名处理
 * @param arr 类名数组
 * @returns 合并后的类名字符串
 */
export const multiClassName = (arr: any) => {
  return arr.map((d: any) => `${d}`).join(" ")
}
/**
 * @description 对象数组深克隆
 * @param {Object} obj 源对象
 * @return object
 */
export const deepCopy = <T>(obj: any): T => {
	let newObj: any;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (typeof obj[attr] === "object") {
			newObj[attr] = deepCopy(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
};


/**
 * @desc 格式化GET请求的参数
 * @example formatQueryParam({label: '全部', value: ''})
 * @param {object}  obj - {label: '全部', value: ''}
 * @return {string} - 默认返回空字符串
 */
export const formatQueryParam = function (obj) {
  obj = formatPostTrim(obj);
  let temp = '';
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(elem => {
          temp += `${key}=${elem}&`;
        });
      } else {
        if (obj[key] !== null) {
          temp += `${key}=${obj[key]}&`;
        } else {
          temp += `${key}=&`;
        }
      }
    }
  }

  if (temp.length > 0) {
    temp = `?${temp}`;
    return temp.substring(0, temp.length - 1);
  } else {
    return '';
  }
};
// * 格式化POST请求的参数
export const formatPostTrim = function (data: Array<any> | Object) {
  everyTrim(data);
  return data;
};
// * 递归格式化POST请求的参数
export const everyTrim = function (data: Array<any> | Object) {
  for (const key in data) {
    if (typeof data[key] === 'object') {
      everyTrim(data[key]);
    } else {
      if (typeof data[key] === 'string') {
        data[key] = trim(data[key]);
      }
    }
  }
};

/**
 * 去除字符串空格
 * @param {string} str
 * @param {Boolean} global
 * @returns {string}
 */
export const trim = function (str: string, global: Boolean = false) {
  let result = str.replace(/(^\s+)|(\s+$)/g, '');
  if (global) {
    result = result.replace(/\s/g, '');
  }
  return result;
};

/*
 * @method 延时执行
 * @param {*} time 时间
 * @return promise回调
 */
export const sleep = async (time: any) => {
  let timer = null
  await new Promise(
    (cb) =>
      (timer = setTimeout(() => {
        cb(1)
        clearTimeout(timer)
      }, time))
  )
}


/**
 * isCaid 身份证校验
 * @param {*} code 身份证
 */
 export function isCaid(code:string) {
  let city = {11: "北京",12: "天津",13: "河北",14: "山西",15: "内蒙古",21: "辽宁",22: "吉林",23: "黑龙江 ",31: "上海",32: "江苏",33: "浙江",34: "安徽",35: "福建",36: "江西",37: "山东",41: "河南",42: "湖北 ",43: "湖南",44: "广东",45: "广西",46: "海南",50: "重庆",51: "四川",52: "贵州",53: "云南",54: "西藏 ",61: "陕西",62: "甘肃",63: "青海",64: "宁夏",65: "新疆",71: "台湾",81: "香港",82: "澳门",91: "国外"};
  let pass = true;
  let msg = "验证成功";
  let len = code.length;
  if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(code))) {
    msg = "身份证号长度不正确或不符合规定！";
    return false;
  }
  if (len == 15) {
    let a = code.match(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/) || [];
    let D: any = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]);
    let B = D.getYear()==a[3] && (D.getMonth()+1 )== a[4] && D.getDate() == a[5];
    if (!B) {
      msg = "出生日期错误";
      return false;
    }
  } else {
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)) {
      pass = false;
      msg = "身份证号格式错误";
    } else if (!city[code.slice(0,2)]){
      pass=false;
      msg = "身份证号地址编码错误";
    } else {
      //18位身份证需要验证最后一位校验位
      let code1 = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //校验位
      let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = Number(code1[i]);
        wi = factor[i];
        sum += ai * wi;
      }
      if (parity[sum % 11] != code1[17].toUpperCase()) {
        pass = false;
        msg = "身份证号校验位错误";
      }
    }
  }
  //验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
  return pass ;
}
  /**
   * getSexByIdCard 根据身份证获取性别
   * @param {*} idCard 身份证
   */
  export function getSexByIdCard(idCard) {
    if (idCard.length === 15) {
      return ['女', '男'][idCard.substr(14, 1) % 2]
    } else if (idCard.length === 18) {
      return ['女', '男'][idCard.substr(16, 1) % 2]
    }
    return ''
  }
  /**
   * getAgeByIdCard 根据身份证获取年龄
   * @param {*} idCard 身份证
   */
  export function getAgeByIdCard(idCard) {
    const sexAndAge: any = {}
    //获取用户身份证号码
    const userCard = idCard

    //如果用户身份证号码为undefined则返回空
    if (!userCard) {
      return sexAndAge
    }

    // 获取出生日期
    const yearBirth = userCard.substring(6, 10)
    const monthBirth = userCard.substring(10, 12)
    const dayBirth = userCard.substring(12, 14)
    // 获取当前年月日并计算年龄
    const myDate = new Date()
    const monthNow = myDate.getMonth() + 1
    const dayNow = myDate.getDate()
    let age = myDate.getFullYear() - yearBirth
    if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) age--
    // 得到年龄
    sexAndAge.age = age
    return sexAndAge.age
  }