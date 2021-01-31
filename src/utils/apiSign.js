import CryptoJS from 'crypto-js'
import CryptoJs from 'crypto-js'
import Config from '@/settings'
import 'js-base64'
const key = CryptoJs.enc.Utf8.parse("1234567890ABCDEF"); //16位
const iv = CryptoJs.enc.Utf8.parse("TRYTOCN394402133");

export function secretSignature() {
  let params = {
    key: Config.appKey,
    timestamp: new Date().getTime(),
    nonce_str: Math.random()
  }
  let array = []
  for (let i in params) {
    array.push(i + '=' + params[i]);
  }
  let paramArray = [...array]
  array.push('secret_key=' + Config.secretKey)
  // 数组排序
  paramArray.sort()
  array.sort()
  // 参数排序
  // 数组变字符串
  array = array.join('&')
  paramArray = paramArray.join("&")
  // 将排序好当参数进行MD5加密作为接口当签名
  let  signature = CryptoJS.MD5(array)
  // 将排序好当参数和接口签名拼接上进行加密
  let encodeData = paramArray + '&sign=' + signature
  let encryptResult = CryptoJS.AES.encrypt(encodeData,key, {   //  AES加密
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7  // 后台用的是pad.Pkcs5,前台对应为Pkcs7
  });
  return Base64.encode(encryptResult.ciphertext.toString())
}



export function decryption(data) {
  let baseResult=CryptoJS.enc.Base64.parse(data);   // Base64解密
  let ciphertext=CryptoJS.enc.Base64.stringify(baseResult);     // Base64解密
  let decryptResult = CryptoJS.AES.decrypt(ciphertext,key, {    //  AES解密
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let resData=decryptResult.toString(CryptoJS.enc.Utf8).toString();
  return JSON.parse(resData);
}
