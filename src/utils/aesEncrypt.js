import CryptoJs from 'crypto-js'
//首先声明两个变量，加密的时候要用到，要和后台沟通，保持一致
const key = CryptoJs.enc.Utf8.parse("1234567890ABCDEF"); //16位
const iv = CryptoJs.enc.Utf8.parse("TRYTOCN394402133");

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
  let content = CryptoJs.enc.Utf8.parse(data);
  let encrypted = CryptoJs.AES.encrypt(content, key, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 * ecb模式
 * @param data
 **/
export function decryptByECB(data) {
  let content = CryptoJs.AES.decrypt(data, key, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7
  });
  return CryptoJs.enc.Utf8.stringify(content).toString();
}

/**
 * cbc模式
 * @param word
 **/
export function encryptByCBC(word) {
  console.log(word)
  let encrypted = "";
  if (typeof word == "string") {
    const srcs = CryptoJs.enc.Utf8.parse(word);
    encrypted = CryptoJs.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJs.mode.CBC,
      padding: CryptoJs.pad.Pkcs7
    });
  } else if (typeof word == "object") {
    //对象格式的转成json字符串
    const data = JSON.stringify(word);
    const srcs = CryptoJs.enc.Utf8.parse(data);
    encrypted = CryptoJs.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJs.mode.CBC,
      padding: CryptoJs.pad.Pkcs7
    });
  }
  return encrypted.ciphertext.toString();
}

// aes解密
export function decryptByCBC(data) {
  const encryptedHexStr = CryptoJs.enc.Hex.parse(data);
  const srcs = CryptoJs.enc.Base64.stringify(encryptedHexStr);
  const content = CryptoJs.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJs.mode.CBC,
    padding: CryptoJs.pad.Pkcs7
  });
  const decryptedStr = content.toString(CryptoJs.enc.Utf8);
  return decryptedStr.toString();
}

