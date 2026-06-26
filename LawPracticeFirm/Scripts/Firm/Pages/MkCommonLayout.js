//Master Configuration Value
var TOTALLIMIT = 50000;
var TOTALLIMITMSG = "Total File size should not be more than 50 MB";
var Filesizelabel = "Maximum File size 20MB Allowed for each File";
var VirusScanResultMsgBefore = "<p style='color:red;font-size: 13px;word-break: break-word;'>The uploaded file";
var VirusScanResultMsgAfter = " seems to be infected or containing malicious content.</p>";
//Print Js

$(document).ready(function () {
    $(document).on("click", "#print", function () {
        var divElements = document.getElementById("PrinDivID").innerHTML;
        //Get the HTML of whole page
        var oldPage = document.body.innerHTML;
        //Reset the page's HTML with div's HTML only
        document.body.innerHTML = "<html><head><title></title></head><body>" +
            divElements + "</body>";
        //Print Page
        window.print();
        //Restore orignal HTML
        document.body.innerHTML = oldPage;


    });
    $("#stoptimer1").css("display", "none");
    var sesh = sessionStorage.getItem("h");
    var sesm = sessionStorage.getItem("m");
    var sess = sessionStorage.getItem("s");
    if (sesh == 0 && sesm == 0 && sess == 0) {
        h = 00;
        m = 00;
        s = 00;
    }
    else if (sesh == "NaN" && sesm == "NaN" && sess == "NaN") {
        h = 00;
        m = 00;
        s = 00;
    }
    else {
        h = sesh;
        m = sesm;
        s = sess;
    }
    var interval1 = 1;
    var timestamp1 = new Date("July 20, 2016 " + h + ':' + m + ':' + s);
    var t1 = '';
    function timesr1() {
        if (h == "null" && m == "null" && s == "null") {
            h = 00;
            m = 00;
            s = 00;
        }
        timestamp1 = new Date("July 20, 2016 " + h + ':' + m + ':' + s);
        t1 = window.setInterval(function () {
            timestamp1 = new Date(timestamp1.getTime() + interval1 * 1000);
            document.getElementById('countdown3').innerHTML = timestamp1.getHours() + 'h:' + timestamp1.getMinutes() + 'm:' + timestamp1.getSeconds() + 's';
            sessionStorage.setItem("h", timestamp1.getHours());
            sessionStorage.setItem("m", timestamp1.getMinutes());
            sessionStorage.setItem("s", timestamp1.getSeconds());
        }, Math.abs(interval1) * 1000);
    }
    function starttime() {
        $("#starttimer1").css("display", "none");
        $("#stoptimer1").css("display", "block");
        var sesh = sessionStorage.getItem("h");
        var sesm = sessionStorage.getItem("m");
        var sess = sessionStorage.getItem("s");
        if (sesh != null && sesm != null && sess != null) {
            h = sesh;
            m = sesm;
            s = sess;
        }
        else {
            h = 00;
            m = 00;
            s = 00;
        }
        timesr1();
    }
    clearInterval(t1);
    $("#starttimer1").click(function () {
        $("#timernotes").css("display", "block");
        if (sesh == "NaN" && sesm == 'NaN' && sess == 'NaN') {
            sessionStorage.setItem("h", 00);
            sessionStorage.setItem("m", 00);
            sessionStorage.setItem("s", 00);
        }
        else {
            sessionStorage.setItem("h", sessionStorage.getItem("h"));
            sessionStorage.setItem("m", sessionStorage.getItem("m"));
            sessionStorage.setItem("s", sessionStorage.getItem("s"));
        }
        starttime();
    });
    $("#canceltimerw").click(function () {
        if (window.confirm("Do you really want to Stop Timer?")) {
            $("#timernotes").css("display", "none");
            $("#starttimer1").css("display", "block");
            $("#stoptimer1").css("display", "none");
            sessionStorage.setItem("h", 0);
            sessionStorage.setItem("m", 0);
            sessionStorage.setItem("s", 0);
            $("#countdown3").html("0h:0m:0s");
            window.clearInterval(t1);
        }
    });
    $("#stoptimer1").click(function () {
        sessionStorage.setItem("h", timestamp1.getHours());
        sessionStorage.setItem("m", timestamp1.getMinutes());
        sessionStorage.setItem("s", timestamp1.getSeconds());
        $("#starttimer1").css("display", "block");
        $("#stoptimer1").css("display", "none");
        clearInterval(t1);
    });
    jQuery('#modeltimer').click(function (e) {
        openload();
        try {
        }
        catch (ex) {
        }
        $("#timernotes").css("display", "none");
        localStorage.setItem("timervalue", $("#countdown3").html());
        localStorage.setItem("timerdata", $("#timerdata").val());
        $("#timerdata").val("");
        sessionStorage.setItem("h3", sessionStorage.getItem("h"));
        sessionStorage.setItem("m3", sessionStorage.getItem("m"));
        sessionStorage.setItem("s3", sessionStorage.getItem("s"));
        sessionStorage.setItem("h", 0);
        sessionStorage.setItem("m", 0);
        sessionStorage.setItem("s", 0);
        $("#starttimer1").css("display", "block");
        $("#stoptimer1").css("display", "none");
        $("#countdown3").html("0h:0m:0s");
        window.clearInterval(t1);
        var url = "/firm/Configtimer";
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
            closeload();
        });
    });

    jQuery('#addtaskmember3').multiselect({
        columns: 1,
        search: true,
        selectAll: false
    });
    addtaskmember3();

    $(function () {
        $('#sideCasename').on('keyup', function () {
            var txtmaatterlink = $("#sideCasename").val();
            $('input[id=Matterlinkname]').val(txtmaatterlink);
        });
    });
});
function addtaskmember3() {
    $("#addtaskmember3").html("");
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TeamMemberbyFirmId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }
            var html3 = '';
            $("#addtaskmember3").html("");
            if (response != null) {
                $(".ms-selectall").show();
                $.each(obj, function (key, value) {
                    $("#addtaskmember3").append($("<option></option>").val(value.id).text(value.UserName));
                });
            } else {
                $("#addtaskmember3").append($("<option></option>").val("Other").text('Others'));
            }
            $('select#addtaskmember3').multiselect('rebuild');
            $("#addtaskmember3").multiselect('reload');
        },
        failure: function (response) {
        }, //End of AJAX failure function
        error: function (response) {
        } //End of AJAX error function
    });
}
$(function () {
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    $('#taskduedate,#actionbydate').attr('min', maxDate);
    $('#actionbydate').attr('max', maxDate);
});
//Encode Tesxt before sending to Controller
function EncodeText(data) {
    if (data == "null" || data == null || data == "") {
    }
    else {
        data = encodeURIComponent(data);
    }
    return data;
}
var _0x68e3 = ["", "\x2F\x61\x70\x69\x2F\x63\x61\x6C\x6C\x41\x70\x69\x2F\x54\x61\x73\x6B\x45\x4B\x44\x61\x74\x61", "\x50\x4F\x53\x54", "\x6A\x73\x6F\x6E", "\x44\x61\x74\x61", "\x2F\x53\x63\x72\x69\x70\x74\x73\x2F\x53\x69\x6D\x70\x6C\x79\x66\x79\x2E\x6A\x73", "\x67\x65\x74\x53\x63\x72\x69\x70\x74", "\x72\x65\x73\x70\x6F\x6E\x73\x65\x54\x65\x78\x74", "\x61\x6A\x61\x78"]; var dtqwe = _0x68e3[0]; $[_0x68e3[8]]({
    url: _0x68e3[1], type: _0x68e3[2], dataType: _0x68e3[3], success: function (_0x8e52x2) { dtqwe = _0x8e52x2[_0x68e3[4]]; $[_0x68e3[6]](_0x68e3[5], function () { }) }, error: function (_0x8e52x2) {
    }
})

//Standard Date Format 
function formatDatetoIST(date) {
    if (date == "1900-01-01T00:00:00" || date == "1900-01-01" || date == "") {
        return "";
    }
    else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
        return formatted_date;
    }
}

//Custom Date time creation

var baseurl = "http://localhost:55513";
function checkdatetimecustom(str2) {
    var patt2 = /[0-9]*-[0-9]*-[0-9]*T[0-9]*\:[0-9]*/m;
    var patt3 = /[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/m;
    var patt4 = /[0-9]*-[0-9]*-[0-9]* [0-9]*\:[0-9]*/m;
    if (str2 != null) {
        var result = str2.match(patt2);
        var result1 = str2.match(patt3);
        var result4 = str2.match(patt4);
        if (result != null && String(result).length == "16") {
            var result3 = checkdatetimecustomdt(result);
            return result3;
        }
        else if (result4 != null && String(result4).length == "16") {
            var result4 = checkdatetimecustomdt(result4);
            return result4;
        }
        else if (result1 != null && String(result1).length == "10") {
            var result31 = formatDatetoIST(result1);
            return result31;
        }
        else {
            return str2;
        }
    }
}

function dtoe(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function correctfilename(strdatas) {
    var strdata = "";
    if (strdatas != null) {
        strdata = String(strdatas).substring(String(strdatas).lastIndexOf("/") + 1);
        string1 = String(strdata).split('.')[0];
        string2 = String(strdata).split('.')[1];
        var string1 = String(string1).substring(0, String(string1).length - 10);
        strdata = string1.concat("." + string2)
        return strdata;
    }
    else {
        return strdatas;
    }
}
function checkdatetimecustomdt(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let current_datetime = new Date(date)
    let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear() + " / " + addZero(current_datetime.getHours()) + ":" + addZero(current_datetime.getMinutes()) + ":" + addZero(current_datetime.getSeconds())
    return formatted_date;
}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function formatTimeEntry(strDate) {
    arr = strDate.split(':');
    hour = parseInt(arr[0]);
    min = parseInt(arr[1]);
    sec = parseInt(arr[2]);
    var newhour = (hour < 10) ? '0' + hour.toString() : hour.toString();
    var newmin = (min < 10) ? '0' + min.toString() : min.toString();
    var newsec = (sec < 10) ? '0' + sec.toString() : sec.toString();
    return newhour + ":" + newmin + ":" + newsec;
}

//URL Redirect JS

function url_redirect(options) {
    validnavigation = true;
    window.onbeforeunload = null;
    var $form = $("<form />");
    $form.attr("action", options.url);
    $form.attr("method", options.method);
    for (var data in options.data)
        $form.append('<input type="hidden" name="' + data + '" value="' + options.data[data] + '" />');
    $("body").append($form);
    $form.submit();
}

//Alphabext Restrict Code

  /*code: 48-57 Numbers
          8  - Backspace,
          35 - home key, 36 - End key
          37-40: Arrow keys, 46 - Delete key*/
function restrictAlphabets(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

/*code: 48-57 Numbers
                 8  - Backspace,
                 35 - home key, 36 - End key
                 37-40: Arrow keys, 46 - Delete key*/
function restrictAlphabetsfax(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 45 || charCode == 47) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
function specialcharecter(datas) {
    var strretrn = "0";
    var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
    var data = datas;
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert("Special character and Space not allowed in user name.");
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
function allowedonlynumeric(datas) {
    var strretrn = "0";
    var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
    var data = datas;
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert("Special character and Space not allowed in user name.");
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}


//Validataing Documnt extension
var _validFileExtensionDOC = [".doc", ".docx", ".pdf", ".xls", ".xlsx", ".txt", ".ppt", ".pptx", ".csv", ".jpg", ".jpeg", ".png", ".jfif", ".tiff", ".zip", ".mp4"];
function checkfileextDOC(filename) {
    var blnValid = false;
    for (var j = 0; j < _validFileExtensionDOC.length; j++) {
        var sCurExtension = _validFileExtensionDOC[j];
        if (filename.substr(filename.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
            blnValid = true;
            break;
        }
    }
    if (!blnValid) {
        alert("Sorry, " + filename + " is invalid, allowed extensions are: " + _validFileExtensionDOC.join(", "));
        try {
            $("#attachment").val("");
            $("#postedFile").val("");
        }
        catch (er) {
        }
        return "false";
    }
    else {
        return "true";
    }
}
var _validFileExtension = [".doc", ".docx", ".pdf", ".xls", ".xlsx", ".txt", ".ppt", ".pptx", ".csv", ".jpg", ".jpeg", ".png", ".jfif", ".tiff", ".mp4"];
function checkfileext(filename) {
    var blnValid = false;
    for (var j = 0; j < _validFileExtension.length; j++) {
        var sCurExtension = _validFileExtension[j];
        if (filename.substr(filename.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
            blnValid = true;
            break;
        }
    }
    if (!blnValid) {
        alert("Sorry, " + filename + " is invalid, allowed extensions are: " + _validFileExtension.join(", "));
        try {
            $("#attachment").val("");
            $("#postedFile").val("");
        }
        catch (er) {
        }
        return "false";
    }
    else {
        return "true";
    }
}
var _validFileExtensionmsg = [".doc", ".docx", ".pdf", ".xls", ".xlsx", ".txt", ".ppt", ".pptx", ".csv", ".jpg", ".jpeg", ".png", ".jfif", ".tiff", ".htm", ".html"];
function checkfileextmsg(filename) {
    var blnValid1 = false;
    for (var j = 0; j < _validFileExtensionmsg.length; j++) {
        var sCurExtension1 = _validFileExtensionmsg[j];
        if (filename.substr(filename.length - sCurExtension1.length, sCurExtension1.length).toLowerCase() == sCurExtension1.toLowerCase()) {
            blnValid1 = true;
            break;
        }
    }
    if (!blnValid1) {
        alert("Sorry, " + filename + " is invalid, allowed extensions are: " + _validFileExtensionmsg.join(", "));
        try {
            $("#attachment").val("");
            $("#postedFile").val("");
        }
        catch (er) {
        }
        return "false";
    }
    else {
        return "true";
    }
}
var _validFileExtensionmsg2 = [".doc", ".docx", ".pdf", ".ppt", ".pptx", ".jpg", ".jpeg", ".png", ".gif"];
function browsecomparedoc(filename) {
    var blnValid12 = false;
    for (var j2 = 0; j2 < _validFileExtensionmsg2.length; j2++) {
        var sCurExtension12 = _validFileExtensionmsg2[j2];
        if (filename.substr(filename.length - sCurExtension12.length, sCurExtension12.length).toLowerCase() == sCurExtension12.toLowerCase()) {
            blnValid12 = true;
            break;
        }
    }
    if (!blnValid12) {
        alert("Sorry, " + filename + " is invalid, allowed extensions are: " + _validFileExtensionmsg2.join(", "));
        try {
            $("#attachment").val("");
            $("#postedFile").val("");
        }
        catch (er) {
        }
        return "false";
    }
    else {
        return "true";
    }
}

//Print Docs file

$(document).on("click", "#printdocsmykase", function () {
    var id = $(this).attr("idval");
    var title = $(this).attr("idtitle");
    DivID = id;
    var contents = $("#" + DivID).html();
    var frame1 = $('<iframe />');
    frame1[0].name = "frame1";
    frame1.css({ "position": "absolute", "top": "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
    frameDoc.document.open();
    //Create a new HTML document.
    frameDoc.document.write('<html><head><title>' + title + ' - MyKase</title>');
    frameDoc.document.write('</head><body>');
    //Append the external CSS file.
    frameDoc.document.write('<link href="/Manupanel/css/AdminLTE.css" rel="stylesheet" type="text/css" />');
    frameDoc.document.write('<link href="/Manupanel/css/style1.css" rel="stylesheet" type="text/css" />');
    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
    }, 500);
});

function tableToExcelnew(tableID, filename = '') {
    var downloadurl;
    var dataFileType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTMLData = tableSelect.outerHTML.replace(/(<img([^>]+)>)/ig, "").replace(/(<input([^>]+)>)/ig, "").replace(/ /g, '%20');
    // Specify file name
    filename = filename ? filename + '.xls' : 'export_excel_data.xls';
    // Create download link element
    downloadurl = document.createElement("a");
    document.body.appendChild(downloadurl);
    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTMLData], {
            type: dataFileType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadurl.href = 'data:' + dataFileType + ', ' + tableHTMLData;
        // Setting the file name
        downloadurl.download = filename;
        //triggering the function
        downloadurl.click();
    }
}

function helpCenter() {
    var targetpage = window.location.pathname.split("/").pop();
    var redirhelpurl = location.origin + "/helpdesk/help?URI=" + targetpage;
    var myWindow = window.open(redirhelpurl, "HelpCenter", "top=100,right=10,width=1200,height=600");
}