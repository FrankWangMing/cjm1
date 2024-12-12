import CryptoJS from 'crypto-js';

const KEY = CryptoJS.enc.Utf8.parse('ca@yskj2023#abcd'); // 秘钥
const IV = CryptoJS.enc.Utf8.parse('1234567890123456'); // 初始化向量

/**
 * AES CBC方式加密
 * @param plaintext 明文
 * @returns
 */
function encryptAES_CBC(plaintext) {
  const encrypted = CryptoJS.AES.encrypt(plaintext, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  // 输出密文
  const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  return ciphertext;
}

/**
 * AES CBC方式解密
 * @param plaintext 密文
 * @returns
 */
function decryptAES_CBC(ciphertext) {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  // 输出明文
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}

export { encryptAES_CBC, decryptAES_CBC };
