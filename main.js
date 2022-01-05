'use strict';

//Connect RSA library
const NodeRSA = require('node-rsa');

//Connect FS library
const fs = require('fs');

//Variables for key and its data
let key;
let keyData = '';

//Calculate if you need to update key
let time = fs.readFileSync('./time.txt', 'utf8');
let oldDate = new Date(time);
let currentDate = new Date(Date.now());

//259200 - 3 days in seconds
if (isValidDate(oldDate) || Math.abs(currentDate.getTime() - oldDate.getTime()) < 259200) {
    keyData = fs.readFileSync('./key.txt', 'utf8');
    key = new NodeRSA(keyData);
}
else{
    fs.writeFileSync('./time.txt',currentDate.toString());
    //Key length (For my variant 80 bit)
    //But with key = 80 bit RSA sends error : "data too large for key size"
    //So I take required minimum - 360
    key = new NodeRSA({b: 360});
    fs.writeFileSync('./key.txt',key.exportKey());
}


//Check if data in ./time.txt is valid
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

//Text for encryption (4 bytes)
// In js => 1 symbol = 2 bytes
const text = 'xx';
console.log('base text: ', text);

//Encryption process
const encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);

//Decryption process
const decrypted = key.decrypt(encrypted, 'utf8');
console.log('decrypted: ', decrypted);