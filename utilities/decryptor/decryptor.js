const path = require("path");
require("dotenv").config({ path: "../.env" });
const sk = process.env.SECRET;
const CryptoJS = require("crypto-js");

var protector = {
    encrypt: (nor_text) => {
        nor_text = nor_text.toString();
        let c_encrypted = CryptoJS.AES.encrypt(nor_text, sk).toString();
        return c_encrypted;
    },

    decrypt: (cipher_text) => {
        let bytes = CryptoJS.AES.decrypt(cipher_text, sk);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    },

    cjs_encrypt: (nor_text) => {
        let string = nor_text.toString();
        let secret_key = process.env.SECRET_KEY;
        let secret_iv = process.env.SECRET_IV;
        var key = Sha256(secret_key).toString(Hex).substr(0, 32); // Use the first 32 bytes (see 2.)
        var iv = Sha256(secret_iv).toString(Hex).substr(0, 16);
        var output = false;

        output = AES.encrypt(string, Utf8.parse(key), {
            iv: Utf8.parse(iv),
        }).toString();
        output = Utf8.parse(output).toString(Base64);
        return output;
    },
    cjs_decrypt: (cipher_text) => {
        try {
            let string = cipher_text.toString();
            let secret_key = process.env.SECRET_KEY;
            let secret_iv = process.env.SECRET_IV;
            var key = Sha256(secret_key).toString(Hex).substr(0, 32); // Use the first 32 bytes (see 2.)
            var iv = Sha256(secret_iv).toString(Hex).substr(0, 16);
            var output = false;

            string = base64.decode(string);

            output = AES.decrypt(string, Utf8.parse(key), {
                iv: Utf8.parse(iv),
            }).toString(Utf8);
            return output;
        } catch (error) {
            return false;
        }
    },
};

module.exports = protector;
