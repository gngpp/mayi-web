import CryptoJS from 'crypto-js'
import 'js-base64'
//首先声明两个变量，加密的时候要用到，要和后台沟通，保持一致
const key = CryptoJS.enc.Utf8.parse("1234567890ABCDEF"); //16位
const iv = CryptoJS.enc.Utf8.parse("TRYTOCN394402133");

/**
 * 这里只使用ECB模式
 * 接口数据加密函数
 * @param key string 加密key(16位)
 * @param iv string 加密向量(16位)
 */
/**
 * 接口数据加密函数
 * @param data
 */
export function encryptByECB(data) {
  let content = CryptoJS.enc.Utf8.parse(data);
  let encrypted = CryptoJS.AES.encrypt(content, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 * ecb模式
 * @param data
 **/
export function decryptByECB(data) {
  let content = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(content).toString();
}

/**
 * cbc模式
 * @param data
 **/
export function encryptByCBC(data) {
  let encrypted = "";
  if (typeof data == "string") {
    const srcs = CryptoJS.enc.Utf8.parse(data);
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  } else if (typeof data == "object") {
    //对象格式的转成json字符串
    const data = JSON.stringify(data);
    const srcs = CryptoJS.enc.Utf8.parse(data);
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  }
  return Base64.encode(encrypted.ciphertext.toString());
}

// aes解密
export function decryptByCBC(data) {
  const encryptData = Base64.decode(data)
  const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptData);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const content = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = content.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

