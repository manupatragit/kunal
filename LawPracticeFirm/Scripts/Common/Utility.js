$.support.cors = true;
Date.prototype.toMMDDYYYY = function () {
    var result = "";
    if (this) {
        var year = this.getFullYear();
        var month = (1 + this.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = this.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        result = month + '/' + day + '/' + year;
    }
    return result;
};

String.prototype.toMMDDYYYY = function () {
    var result;
    var d = new Date(this);
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
            return "";
        }
        else {
            var year = d.getFullYear();
            var month = (1 + d.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = d.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            result = month + '/' + day + '/' + year;
            return result;
        }
    }
    else {
        return "";
    }
};

String.prototype.toYYYYMMDD = function () {
    var result;
    var d = new Date(this);
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
            return "";
        }
        else {
            var year = d.getFullYear();
            var month = (1 + d.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = d.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            result =  year+ '-' +month  + '-' +day ;
            return result;
        }
    }
    else {
        return "";
    }
};


String.prototype.toMMDD = function () {
    var result;
    var d = new Date(this);
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
            return "";
        }
        else {
            var month = (1 + d.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = d.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            result = month + '/' + day;
            return result;
        }
    }
    else {
        return "";
    }
};

String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};

var Utility = {
    pageSize: 0,
    isLoad: false,
    SessionId: "",
    UserType: "",
    UserInfo: {},
    URL: "<protocol>//<host>:<port>/",
    setBreadCrumb: function (val) {
        var x = val.split("$@$");
        $(">li:not(.crumb-active)", $('#ol_breadcrumb')).remove();
        $.each(x, function () {
            if ($.trim(this) != "") {
                $('#ol_breadcrumb').append(this);
            }
        });

        var li = $(">li", $('#ol_breadcrumb')).eq(1);
        $(" li>a", $("#menu")).removeClass("focus");
        var obj = $.grep($(" li>a>span", $("#menu")), function (a, i) {

            var t = $(a).attr("title");
            if (t) {
                t = t.toUpperCase();
            }
            return t == $(li).text();
        });
        if (obj.length > 0) {
            $($(obj[0]).parent()).addClass("focus");
        }
    },
    openSplashScreen: function (element) {

        $('#ui-widget-overlay').css('height', $(document.body).height() + 'px');

        //Utility.centerMe(element);
        $(element).show();
        $('.ui-widget-overlay').show();
    },
    closeDialog: function (element) {
        $(element).hide();
        $('.ui-widget-overlay').hide();

    },
    openModalLoading: function (element) {

        //$('#ui-widget-overlay').css('height', $(document.body).height() + 'px');

        //Utility.centerMe(element);
        $(element).show();
        $('#overlay').show();
    },
    closeModalLoading: function (element) {
        $(element).hide();
        $('#overlay').hide();

    },
    centerMe: function (element) {
        //pass element name to be centered on screen
        var pWidth = $(window).width();
        var pHeight = $(window).height();
        var pTop = $(window).scrollTop();
        //var eWidth = $(element).width()
        //var height = $(element).height()
        $(element).css('top', parseInt((pHeight / 2)) + 'px');
        $(element).css('left', parseInt((pWidth / 2)) + 'px');
    },
    recieveFileDateFromServer: function (response, dataType, callback, additionalParams) {
        try {
            if (dataType === "json") {
                if (typeof (response) === "string") {
                    response = eval("(" + response + ")");
                }
                switch (response) {
                    case "**ERROR**":
                        //currentObj.Events.OnError({ message: response }, additionalParams);
                        break;
                    case "**TIMEOUT**":
                        //currentObj.Events.OnSessionExpire(response, additionalParams);
                        break;
                    default:
                        if (callback) {
                            callback(response, additionalParams);
                        }
                        break;
                }

            } else {
                switch (response) {
                    case "**ERROR**":
                        //currentObj.Events.OnError({ message: response }, additionalParams);
                        break;
                    case "**TIMEOUT**":
                        //currentObj.Events.OnSessionExpire(response, additionalParams);
                        break;
                    default:
                        if (callback) {
                            callback(response, additionalParams);
                        }
                        break;
                }
            }
        }
        catch (ex) { /*currentObj.Events.OnError(ex, response);*/ }
    },
    postFileToServer: function (requrl, files, dataParams, headerparams, dataType, callback, errorcallback, additionalParams, async, contentType) {

        dataParams["SessionKey"] = Utility.getQueryStringValue("key");
        var fileData = new FormData();
        var fileData = new FormData();
        $.each(files, function (k, v) {
            if (v != null)
                fileData.append(v.name, v);
        });
        $.each(dataParams, function (k, v) {
            fileData.append(k, v);
        });
        $.ajax({  async: true, 
            url: Utility.URL + requrl,
            type: "POST",
            enctype: 'multipart/form-data',
            //crossDomain: true,
            data: fileData,
            async: true,
            contentType: false,
            processData: false,
            //contentType: "application/json",
            beforeSend: function (xhr) {
                //xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                //xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + fileData.boundary);
                Utility.openModalLoading("#loader");
            },
            success: function (response) {
                if (response.Message == "Session is expired." || response.Message == "Session key can not be null or blank." || response.Message == "Session key is missing.") {
                    window.location.replace(Utility.URL);
                } else {
                    Utility.recieveFileDateFromServer(response, dataType, callback, additionalParams);
                }

            },
            error: function (error) {
                Utility.sendToError();
            },
            complete: function () {
                Utility.closeModalLoading("#loader");
            }
        });
    },
    recieveDataFromServer: function (response, dataType, callback, additionalParams) {
        try {
            if (dataType === "json") {
                if (typeof (response) === "string") {
                    response = eval("(" + response + ")");
                }
                switch (response) {
                    case "**ERROR**":
                        //currentObj.Events.OnError({ message: response }, additionalParams);
                        break;
                    case "**TIMEOUT**":
                        //currentObj.Events.OnSessionExpire(response, additionalParams);
                        break;
                    default:
                        if (callback) {
                            callback(response, additionalParams);
                        }
                        break;
                }

            } else {
                switch (response) {
                    case "**ERROR**":
                        //currentObj.Events.OnError({ message: response }, additionalParams);
                        break;
                    case "**TIMEOUT**":
                        //currentObj.Events.OnSessionExpire(response, additionalParams);
                        break;
                    default:
                        if (callback) {
                            callback(response, additionalParams);
                        }
                        break;
                }
            }
        }
        catch (ex) { /*currentObj.Events.OnError(ex, response);*/ }
    },
    postDataToServer: function (requrl, dataParams, headerparams, dataType, callback, errorcallback, additionalParams, async, contentType) {
       //dataParams["SessionKey"] = Utility.getQueryStringValue("key");
        $("#divLoding").show();
        Utility.openSplashScreen("#loader");
        $.ajax({  async: true, 
            url: Utility.URL + requrl,
            type: "POST",
            crossDomain: true,
            data: JSON.stringify(dataParams),
            async: (async == null ? true : async),
            dataType: dataType,
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                for (var k in headerparams) {
                    xhr.setRequestHeader(k, headerparams[k]);
                }
                //Show Process Bar
               
            },
            success: function (response) {
                if (response.Message == "Session is expired." || response.Message == "Session key can not be null or blank." || response.Message == "Session key is missing.") {
                    window.location.replace(Utility.URL);
                } else {
                    Utility.recieveDataFromServer(response, dataType, callback, additionalParams);
                }

            },
            error: function (error) {
                if (errorcallback) {
                    errorcallback(error.Message, additionalParams);
                } else {
                    //Utility.sendToError();
                }

            },
            complete: function (res) {
                Utility.closeModalLoading("#loader");
            }
        });
    },
    recieveLoadPartialViewData: function (response, dataType, callback) {
        if (callback) {
            callback(response);
        }
    },
    LoadPartialView: function (requrl, dataType, callback, errorcallback, contentType) {
        $.ajax({  async: true, 
            url: requrl,
            type: "POST",
            crossDomain: true,
            dataType: dataType,
            contentType: contentType,
            beforeSend: function (xhr) {
                
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                //Show Process Bar
                Utility.openSplashScreen("#loader");
            },
            success: function (response) {
               
                if (response != "") {
                    Utility.recieveLoadPartialViewData(response, dataType, callback);
                }
                else {
                    Utility.sendToError();
                }
            },
            error: function (errorresponse) {
                
                Utility.recieveLoadPartialViewData(errorresponse, dataType, errorcallback);
            },
            complete: function () {
                //Hide Process Bar
                //$("#divLoding").hide();
                Utility.closeDialog("#loader");
            }
        });
    },
    isValidEmailAddress: function (emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);;
        return pattern.test(emailAddress);
    },
    isValidSubDomainAddress: function (emailAddress) {
        var pattern = new RegExp(/^(([A-Za-z0-9-])+\.+([A-Za-z]{2,4}))$/);

        return pattern.test(emailAddress);
    },
    isAlphaNumeric: function (data) {
        var pattern = new RegExp(/^[a-zA-Z0-9]{7,15}$/);
        return pattern.test(data);
    },
    isNumeric: function (data) {
        var pattern = new RegExp(/^\d+$/);
        return pattern.test(data);
    },
    isContactNumber: function (data) {
        var pattern = new RegExp(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/);
        return pattern.test(data);
    },
    isZip: function (data) {
        var pattern = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
        return pattern.test(data);
    },
    jsonEscape: function (str) {
        return str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
    },
    getQueryStringValue: function (key) {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars[key];
    },
    validateSession: function () {
        var data = { "SessionKey": Utility.SessionId };
        Utility.postDataToServer(Utility.URL + "user/info", data, [], "json", Utility.validSession, Utility.invalidSession, null, false);
    },
    validSession: function (info) {
        if (typeof (info.data) === "string") {
            Utility.userinfo = eval("(" + info.data + ")");
        }
        else {
            Utility.userinfo = info.data;
            $("#spnName").text(Utility.userinfo.name);
        }
    },
    invalidSession: function () {
        window.location.replace("sessionexpired.html?key=" + Utility.SessionId);
    },
    setSessionExpire: function () {
        var data = { "SessionKey": Utility.SessionId };
        Utility.postDataToServer(Utility.URL + "user/info", data, [], "json", Utility.setSessionExpire, Utility.sendToError, null, false);
    },
    sendToError: function () {
        window.location.replace(Utility.URL + "Error/ShowErrorResult");
    },
    showLoading: function () {
        $('#loading').show();
    },
    closeLoading: function () {
        $('#loading').hide();
    },
    Redirect: function (url) {
        window.location.href = url;
    },
    ReLoad: function () {
        window.location.href = window.location.href;
    },
    addQueryString: function (url, key, value) {
        if (url == null) {
            url = window.location.href;
        }
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = url.indexOf('?') !== -1 ? "&" : "?";
        if (url.match(re)) {
            return url.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return url + separator + key + "=" + value;
        }
    },
    createCookie: function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    readCookie: function (name) {
        var nameEq = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length, c.length);
        }
        return null;
    },
    eraseCookie: function (name) {
        Utility.createCookie(name, "", -1);
    },
    IsCookieEnabled: function (){
        var cookieEnabled = (navigator.cookieEnabled) ? true : false; if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { document.cookie = "testcookie"; cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false; } return (cookieEnabled);
    },
    showToast: function (type, msg, title)
    {
        toastr.options.timeOut = 2000;
        switch (type.toLowerCase()) {
            case "info":
                toastr.info(msg, title);
                break;
            case "success":
                toastr.success(msg, title);
                break;
            case "error":
                toastr.error(msg, title);
                break;
            default:
                break;
        }
    },
};

var Encoder = {

    // When encoding do we convert characters into html or numerical entities
    EncodeType: "entity", // entity OR numerical

    isEmpty: function (val) {
        if (val) {
            return ((val === null) || val.length == 0 || /^\s+$/.test(val));
        } else {
            return true;
        }
    },

    // arrays for conversion from HTML Entities to Numerical values
    arr1: ['&nbsp;', '&iexcl;', '&cent;', '&pound;', '&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;', '&laquo;', '&not;', '&shy;', '&reg;', '&macr;', '&deg;', '&plusmn;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;', '&sup1;', '&ordm;', '&raquo;', '&frac14;', '&frac12;', '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;', '&Aring;', '&AElig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;', '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;', '&ETH;', '&Ntilde;', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;', '&times;', '&Oslash;', '&Ugrave;', '&Uacute;', '&Ucirc;', '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;', '&aacute;', '&acirc;', '&atilde;', '&auml;', '&aring;', '&aelig;', '&ccedil;', '&egrave;', '&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;', '&icirc;', '&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;', '&otilde;', '&ouml;', '&divide;', '&oslash;', '&ugrave;', '&uacute;', '&ucirc;', '&uuml;', '&yacute;', '&thorn;', '&yuml;', '&quot;', '&amp;', '&lt;', '&gt;', '&OElig;', '&oelig;', '&Scaron;', '&scaron;', '&Yuml;', '&circ;', '&tilde;', '&ensp;', '&emsp;', '&thinsp;', '&zwnj;', '&zwj;', '&lrm;', '&rlm;', '&ndash;', '&mdash;', '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;', '&bdquo;', '&dagger;', '&Dagger;', '&permil;', '&lsaquo;', '&rsaquo;', '&euro;', '&fnof;', '&Alpha;', '&Beta;', '&Gamma;', '&Delta;', '&Epsilon;', '&Zeta;', '&Eta;', '&Theta;', '&Iota;', '&Kappa;', '&Lambda;', '&Mu;', '&Nu;', '&Xi;', '&Omicron;', '&Pi;', '&Rho;', '&Sigma;', '&Tau;', '&Upsilon;', '&Phi;', '&Chi;', '&Psi;', '&Omega;', '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;', '&theta;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&rho;', '&sigmaf;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;', '&thetasym;', '&upsih;', '&piv;', '&bull;', '&hellip;', '&prime;', '&Prime;', '&oline;', '&frasl;', '&weierp;', '&image;', '&real;', '&trade;', '&alefsym;', '&larr;', '&uarr;', '&rarr;', '&darr;', '&harr;', '&crarr;', '&lArr;', '&uArr;', '&rArr;', '&dArr;', '&hArr;', '&forall;', '&part;', '&exist;', '&empty;', '&nabla;', '&isin;', '&notin;', '&ni;', '&prod;', '&sum;', '&minus;', '&lowast;', '&radic;', '&prop;', '&infin;', '&ang;', '&and;', '&or;', '&cap;', '&cup;', '&int;', '&there4;', '&sim;', '&cong;', '&asymp;', '&ne;', '&equiv;', '&le;', '&ge;', '&sub;', '&sup;', '&nsub;', '&sube;', '&supe;', '&oplus;', '&otimes;', '&perp;', '&sdot;', '&lceil;', '&rceil;', '&lfloor;', '&rfloor;', '&lang;', '&rang;', '&loz;', '&spades;', '&clubs;', '&hearts;', '&diams;'],
    arr2: ['&#160;', '&#161;', '&#162;', '&#163;', '&#164;', '&#165;', '&#166;', '&#167;', '&#168;', '&#169;', '&#170;', '&#171;', '&#172;', '&#173;', '&#174;', '&#175;', '&#176;', '&#177;', '&#178;', '&#179;', '&#180;', '&#181;', '&#182;', '&#183;', '&#184;', '&#185;', '&#186;', '&#187;', '&#188;', '&#189;', '&#190;', '&#191;', '&#192;', '&#193;', '&#194;', '&#195;', '&#196;', '&#197;', '&#198;', '&#199;', '&#200;', '&#201;', '&#202;', '&#203;', '&#204;', '&#205;', '&#206;', '&#207;', '&#208;', '&#209;', '&#210;', '&#211;', '&#212;', '&#213;', '&#214;', '&#215;', '&#216;', '&#217;', '&#218;', '&#219;', '&#220;', '&#221;', '&#222;', '&#223;', '&#224;', '&#225;', '&#226;', '&#227;', '&#228;', '&#229;', '&#230;', '&#231;', '&#232;', '&#233;', '&#234;', '&#235;', '&#236;', '&#237;', '&#238;', '&#239;', '&#240;', '&#241;', '&#242;', '&#243;', '&#244;', '&#245;', '&#246;', '&#247;', '&#248;', '&#249;', '&#250;', '&#251;', '&#252;', '&#253;', '&#254;', '&#255;', '&#34;', '&#38;', '&#60;', '&#62;', '&#338;', '&#339;', '&#352;', '&#353;', '&#376;', '&#710;', '&#732;', '&#8194;', '&#8195;', '&#8201;', '&#8204;', '&#8205;', '&#8206;', '&#8207;', '&#8211;', '&#8212;', '&#8216;', '&#8217;', '&#8218;', '&#8220;', '&#8221;', '&#8222;', '&#8224;', '&#8225;', '&#8240;', '&#8249;', '&#8250;', '&#8364;', '&#402;', '&#913;', '&#914;', '&#915;', '&#916;', '&#917;', '&#918;', '&#919;', '&#920;', '&#921;', '&#922;', '&#923;', '&#924;', '&#925;', '&#926;', '&#927;', '&#928;', '&#929;', '&#931;', '&#932;', '&#933;', '&#934;', '&#935;', '&#936;', '&#937;', '&#945;', '&#946;', '&#947;', '&#948;', '&#949;', '&#950;', '&#951;', '&#952;', '&#953;', '&#954;', '&#955;', '&#956;', '&#957;', '&#958;', '&#959;', '&#960;', '&#961;', '&#962;', '&#963;', '&#964;', '&#965;', '&#966;', '&#967;', '&#968;', '&#969;', '&#977;', '&#978;', '&#982;', '&#8226;', '&#8230;', '&#8242;', '&#8243;', '&#8254;', '&#8260;', '&#8472;', '&#8465;', '&#8476;', '&#8482;', '&#8501;', '&#8592;', '&#8593;', '&#8594;', '&#8595;', '&#8596;', '&#8629;', '&#8656;', '&#8657;', '&#8658;', '&#8659;', '&#8660;', '&#8704;', '&#8706;', '&#8707;', '&#8709;', '&#8711;', '&#8712;', '&#8713;', '&#8715;', '&#8719;', '&#8721;', '&#8722;', '&#8727;', '&#8730;', '&#8733;', '&#8734;', '&#8736;', '&#8743;', '&#8744;', '&#8745;', '&#8746;', '&#8747;', '&#8756;', '&#8764;', '&#8773;', '&#8776;', '&#8800;', '&#8801;', '&#8804;', '&#8805;', '&#8834;', '&#8835;', '&#8836;', '&#8838;', '&#8839;', '&#8853;', '&#8855;', '&#8869;', '&#8901;', '&#8968;', '&#8969;', '&#8970;', '&#8971;', '&#9001;', '&#9002;', '&#9674;', '&#9824;', '&#9827;', '&#9829;', '&#9830;'],

    // Convert HTML entities into numerical entities
    HTML2Numerical: function (s) {
        return this.swapArrayVals(s, this.arr1, this.arr2);
    },

    // Convert Numerical entities into HTML entities
    NumericalToHTML: function (s) {
        return this.swapArrayVals(s, this.arr2, this.arr1);
    },


    // Numerically encodes all unicode characters
    numEncode: function (s) {
        if (this.isEmpty(s)) return "";

        var a = [],
            l = s.length;

        for (var i = 0; i < l; i++) {
            var c = s.charAt(i);
            if (c < " " || c > "~") {
                a.push("&#");
                a.push(c.charCodeAt()); //numeric value of code point 
                a.push(";");
            } else {
                a.push(c);
            }
        }

        return a.join("");
    },

    // HTML Decode numerical and HTML entities back to original values
    htmlDecode: function (s) {

        var c, m, d = s;

        if (this.isEmpty(d)) return "";

        // convert HTML entites back to numerical entites first
        d = this.HTML2Numerical(d);

        // look for numerical entities &#34;
        arr = d.match(/&#[0-9]{1,5};/g);

        // if no matches found in string then skip
        if (arr != null) {
            for (var x = 0; x < arr.length; x++) {
                m = arr[x];
                c = m.substring(2, m.length - 1); //get numeric part which is refernce to unicode character
                // if its a valid number we can decode
                if (c >= -32768 && c <= 65535) {
                    // decode every single match within string
                    d = d.replace(m, String.fromCharCode(c));
                } else {
                    d = d.replace(m, ""); //invalid so replace with nada
                }
            }
        }

        return d;
    },

    // encode an input string into either numerical or HTML entities
    htmlEncode: function (s, dbl) {

        if (this.isEmpty(s)) return "";
        s = s.replace(/\r?\n/g, '<br />');
        // do we allow double encoding? E.g will &amp; be turned into &amp;amp;
        dbl = dbl || false; //default to prevent double encoding

        // if allowing double encoding we do ampersands first
        if (dbl) {
            if (this.EncodeType == "numerical") {
                s = s.replace(/&/g, "&#38;");
            } else {
                s = s.replace(/&/g, "&amp;");
            }
        }

        // convert the xss chars to numerical entities ' " < >
        s = this.XSSEncode(s, false);

        if (this.EncodeType == "numerical" || !dbl) {
            // Now call function that will convert any HTML entities to numerical codes
            s = this.HTML2Numerical(s);
        }

        // Now encode all chars above 127 e.g unicode
        s = this.numEncode(s);

        // now we know anything that needs to be encoded has been converted to numerical entities we
        // can encode any ampersands & that are not part of encoded entities
        // to handle the fact that I need to do a negative check and handle multiple ampersands &&&
        // I am going to use a placeholder

        // if we don't want double encoded entities we ignore the & in existing entities
        if (!dbl) {
            s = s.replace(/&#/g, "##AMPHASH##");

            if (this.EncodeType == "numerical") {
                s = s.replace(/&/g, "&#38;");
            } else {
                s = s.replace(/&/g, "&amp;");
            }

            s = s.replace(/##AMPHASH##/g, "&#");
        }

        // replace any malformed entities
        s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

        if (!dbl) {
            // safety check to correct any double encoded &amp;
            s = this.correctEncoding(s);
        }

        // now do we need to convert our numerical encoded string into entities
        if (this.EncodeType == "entity") {
            s = this.NumericalToHTML(s);
        }

        return s;
    },

    // Encodes the basic 4 characters used to malform HTML in XSS hacks
    XSSEncode: function (s, en) {
        if (!this.isEmpty(s)) {
            en = en || true;
            // do we convert to numerical or html entity?
            if (en) {
                s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                s = s.replace(/\"/g, "&quot;");
                s = s.replace(/</g, "&lt;");
                s = s.replace(/>/g, "&gt;");
            } else {
                s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                s = s.replace(/\"/g, "&#34;");
                s = s.replace(/</g, "&#60;");
                s = s.replace(/>/g, "&#62;");
            }
            return s;
        } else {
            return "";
        }
    },

    // returns true if a string contains html or numerical encoded entities
    hasEncoded: function (s) {
        if (/&#[0-9]{1,5};/g.test(s)) {
            return true;
        } else if (/&[A-Z]{2,6};/gi.test(s)) {
            return true;
        } else {
            return false;
        }
    },

    // will remove any unicode characters
    stripUnicode: function (s) {
        return s.replace(/[^\x20-\x7E]/g, "");

    },

    // corrects any double encoded &amp; entities e.g &amp;amp;
    correctEncoding: function (s) {
        return s.replace(/(&amp;)(amp;)+/, "$1");
    },


    // Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
    swapArrayVals: function (s, arr1, arr2) {
        if (this.isEmpty(s)) return "";
        var re;
        if (arr1 && arr2) {
            //ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
            // array lengths must match
            if (arr1.length == arr2.length) {
                for (var x = 0, i = arr1.length; x < i; x++) {
                    re = new RegExp(arr1[x], 'g');
                    s = s.replace(re, arr2[x]); //swap arr1 item with matching item from arr2	
                }
            }
        }
        return s;
    },

    inArray: function (item, arr) {
        for (var i = 0, x = arr.length; i < x; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    }

};

$(document).ready(function () {
    Utility.URL = Utility.URL.replace(/<protocol>/i, location.protocol);
    Utility.URL = Utility.URL.replace(/<host>/i, location.hostname);
    if (location.port) {
        Utility.URL = Utility.URL.replace(/<port>/i, location.port);
    } else {
        Utility.URL = Utility.URL.replace(/:<port>/i, "");
        Utility.URL = Utility.URL.replace(/":"/i, location.port);
    }
    var pagename = (location.pathname.substring(1)).toLowerCase();
    Utility.SessionId = Utility.getQueryStringValue("key");
    var pattern = new RegExp(/value$/);
    if (pattern.test(Utility.SessionId)) {
        Utility.SessionId = Utility.SessionId.replace("#", "");
    }
    //if (pagename != "") {
    //    Utility.isLoad = true;
    //}

    $('.dropdown li').click(function (e) {
        e.stopPropagation();
    });
    $('.dropdown-inner').click(function (e) {
        e.stopPropagation();
        $(this).toggleClass('open').trigger('shown.bs.dropdown');
    });
});
$(window).resize(function () {
    return false;
});

