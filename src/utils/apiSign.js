import CryptoJS from 'crypto-js'
import Config from '@/settings'
import 'js-base64'

const key = CryptoJS.enc.Utf8.parse("1234567890ABCDEF"); //16位
const iv = CryptoJS.enc.Utf8.parse("TRYTOCN394402133");

export function secretSignature() {
  let params = {
    apply_id: Config.applyId,
    timestamp: new Date().getTime(),
    nonce_str: Math.random()
  }
  let array = []
  for (let paramsKey in params) {
    array.push(paramsKey + '=' + params[paramsKey]);
  }
  // 应用密钥进行md5加密
  let encodeApplySecret = CryptoJS.MD5(Config.applySecret).toString()
  let paramArray = [...array]
  array.push('apply_secret=' + encodeApplySecret)
  // 参数排序
  paramArray.sort()
  // 数组排序
  array.sort()
  // 数组变字符串
  array = array.join('&')
  paramArray = paramArray.join("&")
  // 将排序好当参数进行HmacSHA1加密作为接口当签名
  let signature = CryptoJS.HmacSHA1(array, encodeApplySecret)
  // 将排序好当参数和接口签名拼接上进行加密
  let encodeData = paramArray + '&sign=' + signature;
  //  AES加密
  let encryptResult = CryptoJS.AES.encrypt(encodeData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    // 后台用的是pad.Pkcs5,前台对应为Pkcs7
    padding: CryptoJS.pad.Pkcs7
  });
  return Base64.encode(encryptResult.ciphertext.toString())
}

export function openSignature() {
  let rawParams = {
    apply_id: Config.applyId,
    timestamp: new Date().getTime(),
    nonce_str: Math.random()
  }
  let rawArray = []
  for (let key in rawParams) {
    rawArray.push(key + '=' + rawParams[key])
  }
  let encodeApplySecret = CryptoJS.MD5(Config.applySecret).toString()
  rawArray.push('apply_secret=' + encodeApplySecret)
  // 参数排序
  rawArray.sort()
  rawArray = rawArray.join('&')
  // 签名
  rawParams['sign'] = CryptoJS.HmacSHA1(rawArray, encodeApplySecret).toString()
  return rawParams
}


export function decryption(data) {
  // Base64解密
  let baseResult = CryptoJS.enc.Base64.parse(data);
  // Base64解密
  let ciphertext = CryptoJS.enc.Base64.stringify(baseResult);
  //  AES解密
  let decryptResult = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let resData=decryptResult.toString(CryptoJS.enc.Utf8).toString();
  return JSON.parse(resData);
}
