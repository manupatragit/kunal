var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    GetLanguageList();
});
/*Get language list details*/
function GetLanguageList() {
    $.ajax({
        type: "POST",
        url: "/api/Tools/LanguageList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#sourcelanguage").append($("<option></option>").val(value.vLId).text(value.vLanguage));
                    $("#targetlanguage").append($("<option></option>").val(value.vLId).text(value.vLanguage));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Clear new search for translator*/
$("#clearnewsearchtranslate").click(function () {
    $("#sourcetext,#outputtext").val("");
    $("#clearnewsearchtranslate").hide();
});
/*Get source text on keyup*/
$("#sourcetext").keyup(function () {
    var txtlength = $(this).val().length;
    if (txtlength == 0) {
        $("#sourcetext,#outputtext").val("");
        $("#clearnewsearchtranslate").hide();
    }
});
/*Swap language*/
$("#swaplanguage").click(function () {
    var tl = $("#targetlanguage").val();
    var sl = $("#sourcelanguage").val();
    $("#sourcelanguage").val(tl);
    $("#targetlanguage").val(sl);
    var svl = $("#sourcetext").val();
    var tvl = $("#outputtext").val();
    $("#sourcetext").val(tvl);
    $("#outputtext").val(svl);
});
$("#cmdbutton").click(function () {
    var stext = $("#sourcetext").val();
    var slanguage = $("#targetlanguage").val();
    var sourcelanguage = $("#sourcelanguage").val();
    if (stext == "") {
        alert("Enter text to translate");
        $("#sourcetext").focus();
        return false;
    }
    if (sourcelanguage == "") {
        alert("Select source language");
        $("#sourcelanguage").focus();
        return false;
    }
    if (slanguage == "") {
        alert("Select output language");
        $("#targetlanguage").focus();
        return false;
    }
    if (sourcelanguage == slanguage) {
        alert("Source and output language should be different");
        return false;
    }
    openload();
    const _0x50f0 = ['google-translate1.p.rapidapi.com', 'POST', 'https://google-translate1.p.rapidapi.com/language/translate/v2', 'd3c5952951msh159a02ae574c174p1b2e0bjsnf8197dc6895d', 'application/x-www-form-urlencoded']; (function (_0x2c537a, _0x424029) { const _0x50f0b4 = function (_0x2e90b1) { while (--_0x2e90b1) { _0x2c537a['push'](_0x2c537a['shift']()); } }; _0x50f0b4(++_0x424029); }(_0x50f0, 0xfb)); const _0x2e90 = function (_0x2c537a, _0x424029) { _0x2c537a = _0x2c537a - 0xf8; let _0x50f0b4 = _0x50f0[_0x2c537a]; return _0x50f0b4; }; const _0x965b34 = _0x2e90, settings = { 'async': !![], 'crossDomain': !![], 'url': _0x965b34(0xf9), 'method': _0x965b34(0xf8), 'headers': { 'content-type': _0x965b34(0xfb), 'x-rapidapi-key': _0x965b34(0xfa), 'x-rapidapi-host': _0x965b34(0xfc) }, 'data': { 'q': stext, 'source': sourcelanguage, 'target': slanguage } };
    $.ajax(settings).done(function (response) {
        $.each(response.data.translations, function (i, a) {
            $("#clearnewsearchtranslate").show();
            $("#outputtext").val(decodeEntities(a.translatedText)).text();
            closeload();
        });
        closeload();
    });
    function decodeEntities(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }
});