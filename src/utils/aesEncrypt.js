import CryptoJs from 'crypto-js'
//首先声明两个变量，加密的时候要用到，要和后台沟通，保持一致
const AES_KEY = '1234567890ABCDEF';
const IV = 'TRYTOCN394402133';

/**
 * 这里只使用ECB模式
 * 接口数据加密函数
 * @param key string 加密key(16位)
 * @param iv string 加密向量(16位)
 */
/**
 * 接口数据加密函数
 * @param word
 */
export function encrypt(word) {
  let key = CryptoJs.enc.Utf8.parse(AES_KEY);
  let srcs = CryptoJs.enc.Utf8.parse(word);
  let encrypted = CryptoJs.AES.encrypt(srcs, key, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 *
 * @param word
 **/
export function decrypt(word) {
  let key = CryptoJs.enc.Utf8.parse(AES_KEY);
  let decrypt = CryptoJs.AES.decrypt(word, key, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7
  });
  return CryptoJs.enc.Utf8.stringify(decrypt).toString();
}
