const CryptoJS = require('crypto-js');
const ByteArray = require('bytearray-node');
//需要将bytearray-node 模块下的 AMF3.js 26行 !== 改为 !=
/**
 *
 * @param data 加密内容
 * @param key 秘钥16位
 * @param iv 偏移量16位
 * @returns {string}
 * @constructor
 */
let CBC_encryption = function (data, key, iv) {
    let BA = new ByteArray();
    BA.writeObject(data);
    BA.buffer = BA.buffer.slice(0, BA.writePosition);
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    //加密Base64格式内容
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Base64.parse(BA.buffer.toString('base64')), key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();

};

/**
 *
 * @param data 需要解密的内容
 * @param key 解密的秘钥
 * @param iv 偏移量
 * @returns {*}
 * @constructor
 */
let CBC_decryption = function (data, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    let decrypted = CryptoJS.AES.decrypt(data, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 解析Base64编码
    let buffer = new Buffer(decrypted.toString(CryptoJS.enc.Base64), "base64");
    return new ByteArray(buffer).readObject();
};
