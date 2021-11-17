import CryptoJS from 'crypto-js'

export function md5Encrypt(value) {
  return CryptoJS.MD5(value).toString();
}
