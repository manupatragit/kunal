
var key = CryptoJS.enc.Utf8.parse(parseInt(atob(dtqwe), 16));
var iv = CryptoJS.enc.Utf8.parse(parseInt(atob(dtqwe), 16));


function enctype(data) 
{
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,

        });
        var encryptdata = etod(encrypted);
        return encryptdata;

}
function enctypesingle(data1) {
    var encrypted1 = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data1), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,

        });
   
    return encrypted1;

}


function etod(base64) {

    var raw = atob(base64);

    var HEX = '';

    for (i = 0; i < raw.length; i++) {

        var _hex = raw.charCodeAt(i).toString(16)

        HEX += (_hex.length == 2 ? _hex : '0' + _hex);

    }

    return HEX;

}



function dtoe(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function (a) {


        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

