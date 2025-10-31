/**
 * 是否是微信WebView
 * @return {Boolean} 是否是微信WebView
 */
export function isWechatWebview () {
  // return /micromessenger/i.test(navigator.userAgent.toLowerCase())
  return /wechat|weixin/i.test(navigator.userAgent.toLowerCase())
}

export function isAMapWebview () {
  return /amap/.test(navigator.userAgent.toLowerCase())
}

/**
 * 是否是苹果WebView
 * @return {Boolean} 是否是苹果WebView
 */
export function isIOSWebview () {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

/**
 * 是否是安卓WebView
 * @return {Boolean} 是否是安卓WebView
 */
export function isAndroidWebview () {
  return (
    navigator.userAgent.indexOf('Android') > -1 ||
    navigator.userAgent.indexOf('Adr') > -1
  )
}
/**
 * 是否是小程序WebView
 * @return {Boolean} 是否是小程序WebView
 */
export function isAppletWebview () {
  return (navigator.userAgent.match(/micromessenger/i) && navigator.userAgent.match(/miniprogram/i)) || window.__wxjs_environment === 'miniprogram'
}
export function isArray (o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}
/**
 * 判断是移动端
 * @return {Boolean} 是否是移动端
 */
export function isMobile () {
  return /mobile/i.test(navigator.userAgent.toLowerCase())
}
/**
 * 判断当前页面位置是否在app内
 */
export function inApp () {
  let isBrowser = isHave('Browser')
  return isBrowser
}
function isHave (m) {
  let userAgent = navigator.userAgent
  if (userAgent.indexOf(m) === -1) {
    return false
  } else {
    return true
  }
}
/**
 * 是否是身份证
 * @return {Boolean} 是否是安卓WebView
 */
export function isIdCard (str) {
  let idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  if (idCardReg.test(str)) {
    return true
  }
  return false
}
/**
 * 获取当前页面的根域名
 * @return {String} 是否是安卓WebView
 */
export function getRootDomain () {
  const temp = window.location.host.split('.').reverse()
  return '.' + temp[1] + '.' + temp[0]
}

/**
 * 根据两个经纬度获取距离
 * @return {String} 是否是安卓WebView
 */
export function getDistance (lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0
  var radLat2 = lat2 * Math.PI / 180.0
  var a = radLat1 - radLat2
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137 // EARTH_RADIUS
  s = Math.round(s * 10000) / 10000
  return s
}

export function getNowFormatDate () {
  var date = new Date()
  var seperator1 = '-'
  var seperator2 = ':'
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
          ' ' + date.getHours() + seperator2 + date.getMinutes() +
          seperator2 + date.getSeconds()
  return currentdate
}
export function compareDate (d1, d2) {
  return ((new Date(d1.replace(/-/g, '/'))) > (new Date(d2.replace(/-/g, '/'))))
}
export function compareSum (property) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

// 百度坐标转高德（传入经度、纬度）
export function bdDecrypt (bdLng, bdLat) {
  var X_PI = Math.PI * 3000.0 / 180.0
  var x = bdLng - 0.0065
  var y = bdLat - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
  var ggLng = z * Math.cos(theta)
  var ggLat = z * Math.sin(theta)
  return { lng: ggLng, lat: ggLat }
}
// 高德坐标转百度（传入经度、纬度）
export function bdEncrypt (ggLng, ggLat) {
  var X_PI = Math.PI * 3000.0 / 180.0
  var x = ggLng; var y = ggLat
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI)
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI)
  var bdLng = z * Math.cos(theta) + 0.0065
  var bdLat = z * Math.sin(theta) + 0.006
  return {
    bd_lat: bdLat,
    bd_lng: bdLng
  }
}
export function getDPR () {
  return document.getElementsByTagName('html')[0].getAttribute('data-dpr')
}

export function remToPx (pxValue) {
  const dpr = getDPR()
  switch (dpr) {
    case '1':
      return 36 * pxValue
    case '2':
      return 75 * pxValue
    case '3':
      return 124.2 * pxValue
    default:
      return 36 * pxValue
  }
}
// 卡号脱敏
export function desensitizationNo (str, start, end, length) {
  if (typeof str === 'string') {
    var ruten = str.substring(start, end)
    var t = ''
    for (var i = 0; i < length; i++) {
      t += '*'
    }
    return str.replace(ruten, t)
  }
}

// 两数之和
export function twoSum (nums, target) {
  // MAP， 运行时间复杂度进行优化 O(1)。
  const _mayMap = new Map()
  for (let i = 0; i < nums.length; i++) {
    if (_mayMap.has(target - nums[i])) {
      console.log([_mayMap.get(target - nums[i]), i])
      return [_mayMap.get(target - nums[i]), i]
    }
    _mayMap.set(nums[i], i)
  }
  // 1、暴利循环 O(n^2).
  // for (let i = 0; i < nums.length; i++) {
  //   for (let j = i; j < nums.length; j++) {
  //     if (arr[i] + arr[j] === target) {
  //       console.log(i)
  //       console.log(j)
  //     }
  //   }
  // }
}

export function loopDecodeURIComponent (query) {
  if (!query) return null
  let newQuery = {}
  Object.keys(query).forEach(key => {
    newQuery[key] = decodeURIComponent(query[key])
  })
  if (newQuery?.isDecode && !/^[\u4E00-\u9FA5]+$/.test(newQuery.isDecode)) {
    return loopDecodeURIComponent(newQuery)
  }
  return newQuery
}

export function noPassByName (str) {
  if (!str) return ''
  if (str.length === 2) {
    return str.substring(0, 1) + '*'
  } else if (str.length === 3) {
    return str.substring(0, 1) + '*' + str.substring(2, 3)
  } else if (str.length>3) {
    return str.substring(0, 1) + '**' + str.substring(3, str.length)
  }
}

export function noPassByPhone (str) {
  if (!str) return ''
  return str.replace(/(\d{3}).*(\d{4})/, '$1****$2')
}

export function noPassByIdcard (str) {
  if (!str) return ''
  return str.replace(/(\d{4}).*(\d{2})/, '$1************$2')
}
