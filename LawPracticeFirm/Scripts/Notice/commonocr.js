var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    $("#showomoredetail").hide();
});
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
    if (cityName == "ocrorignalimage") {
        // $("#ocrimgdiv").html('<iframe src="http://docs.google.com/gview?url=' + originalimagepath + '&embedded=true" style="width:600px; height:500px;" frameborder="0"></iframe>');
        $("#ocrimgdiv").html('<iframe src="' + originalimagepath + '" style="width:100%; height:620px;" frameborder="0"></iframe>');
    }
}
/*Validate file*/
function fileValidation() {
    var fileInput = document.getElementById('attachment');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    if (!allowedExtensions.exec(filePath)) {
        alert('Please upload file having extensions .jpeg/.jpg/.png/.pdf only.');
        fileInput.value = '';
        return false;
    } else {
    }
}
function msToTime(ms) {
    var seconds = (ms / 1000);
    var minutes = parseInt(seconds / 60, 10);
    seconds = seconds % 60;
    var hours = parseInt(minutes / 60, 10);
    minutes = minutes % 60;
    return hours + 'h:' + minutes + 'm:' + seconds.toFixed(0) + 's';
}
function randomString() {
    var chars = "012345";
    var string_length = 2;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}
var ocrcontent = "";
var originalimagepath = "";
$("#savecasefilenew").click(function () {
    var comparesize = 0;
    var filename = "";
    try {
        var fileUpload = document.getElementById("attachment");
        if (typeof (fileUpload.files) != "undefined") {
            var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
            comparesize = size;
            if (size > newfilesize) {
                new PNotify({
                    title: 'Warning!',
                    text: 'Document size greater than 20 MB cannot be accepted',
                    type: 'error',
                    delay: 3000
                });
                return false
            }
        }
    }
    catch (err) {
        //alert(err.message);
    }
    var desc = $("#desc").val();
    //var ocrlanguage = $("#ocrlanguage").val();
    var ocrlanguage = "eng";
    if (ocrlanguage == "") {
        alert("Please Select OCR Language.");
        return false;
    }
    var formData = new FormData();
    var tempsize = 0;
    var totalFiles = document.getElementById("attachment").files.length;
    if (totalFiles == "0") {
        alert("Please Select File.");
        return false;
    }
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("attachment").files[i];
        filename = file.name;
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        formData.append("FileUpload", file);
        try {
            if (typeof (file) != "undefined") {
                size = parseFloat(file.size / 1024).toFixed(2);
                tempsize = parseFloat(tempsize) + parseFloat(size);
            }
        }
        catch (err) {
            //alert(err.message);
        }
    }
    tempsize = tempsize.toFixed(2);
    if (tempsize > newfilesize) {
        new PNotify({
            title: 'Warning!',
            text: 'Maximum File size 20MB Allowed for each File',
            type: 'error',
            delay: 3000
        });
        return false
    }
    try {
        formData.append("desc", EncodeText(desc));
        var chkstatus = $("#chkSave").is(":checked");
        formData.append("chkSave", EncodeText(chkstatus));
        formData.append("language", EncodeText(ocrlanguage));
        if (comparesize < 100) {
            $("#esttime").html(" 1 Minute");
        }
        else if (comparesize > 100 && comparesize < 400) {
            $("#esttime").html(" 1 Minute " + randomString() + " Seconds");
        }
        else if (comparesize > 400 && comparesize < 1000) {
            $("#esttime").html(" 2 minute " + randomString() + " Seconds");
        }
        else if (comparesize > 1000) {
            $("#esttime").html(" 5 minute");
        }
        else if (comparesize > 5000) {
            $("#esttime").html(" 8 minute");
        }
        else if (comparesize > 10000) {
            $("#esttime").html(" 12 minute");
        }
        else if (comparesize > 15000) {
            $("#esttime").html(" 15 minute");
        }
        openload();
        var mykasefileidocr = $("#mykasefileidocr").val();
        if (String(mykasefileidocr) == "undefined") {
            mykasefileidocr = "";
        }
        formData.append("savemykasefileid", EncodeText(mykasefileidocr));
        if (ocrlanguage == "eng") {
            $.ajax({
                type: "POST",
                url: "/api/OocrApi/ViewUserGroupsData",
                contentType: false,
                processData: false,
                data: formData,
                success: function (response) {
                    if (response.Data != null) {
                        $("#showomoredetail").show();
                        $('#divOCRContent').html('<label style="border-bottom:1px solid black; font-weight:600;">Ocr Text</label><br/>' + response.Data.result);
                        $("#myOCRModal").modal('show');
                        var pather = window.location.origin + "//" + response.Data.filePath;
                        originalimagepath = pather;
                    }
                    closeload();
                },
                error: function (xhr) {
                    alert('error');
                }
            })
        }
        else {
            $.ajax({
                url: '/api/OcrInvoiceApi/PostSaveOcrFilesNew',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                start_time: new Date().getTime(),
                // this part is progress bar
                complete: function (response) {
                    var ds = msToTime((new Date().getTime() - this.start_time));
                },
                success: function (response) {
                    if (response != null) {
                        $('#divOCRContent').html(response);
                        $("#divlabelchkbox").css("display", "block");
                    }
                    closeload();
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    }
    catch (msg) {
        //alert(msg.message);
    }
    //}
});
$("#showomoredetail").click(function () {
    $("#myOCRModal").modal('show');
})
/*Check OCR copy*/
function fncheckocrcopy() {
    $("#myOCRModalContent").modal('show');
    $("#divOCRContentresponse").html(ocrcontent);
}
/*Check OCR original copy*/
function fncheckoriginalcopy() {
    window.open("" + originalimagepath + "", '_blank');
}
$(document).on('click', 'input[dirname="abcv"]', function () {
    $('input[type="checkbox"]').not(this).prop('checked', false);
    var tt = $("input[type='checkbox']:checked").attr('name');
    var kk = $("input[type='checkbox']:checked").val();
    var selectedText = getSelectionText();
    if (selectedText != "") {
        if (tt == "CreateNotice") {
            CKEDITOR.instances['CreateNotice'].setData(selectedText);
        }
        else if ($("#" + tt).prop('type') == "date") {
            selectedText = selectedText.replace(/\//g, "-");
            var setDate = $("#" + tt).val(selectedText);
            if ($("#" + tt).val() == "") {
                var date = fnConvertTodate(selectedText, this);
                if (date != "") {
                    $("#" + tt).val(date);
                }
                else {
                    return;
                }
            }
        }
        else {
            $("#" + tt).val(selectedText);
        }
        alert("Form control filled successfully.")
        $(this).prop('checked', false);
        $("#" + tt + "lbl").next("label").css("color", "#999903");
    }
    else {
        alert("Please select text to fill form control value.");
        $(this).prop('checked', false);
    }
});
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function fnConvertTodate(inputdate, thisvalue) {
    if (inputdate.length != 10) {
        alert("Please enter date in correct format ex. dd,mm,yyyy")
        $(thisvalue).prop('checked', false);
        return "";
    }
    inputdate = inputdate.replace("/", "-")
    var char0 = inputdate.charAt(0);
    var char1 = inputdate.charAt(1);
    var char2 = inputdate.charAt(3);
    var char3 = inputdate.charAt(4);
    var char4 = inputdate.charAt(6);
    var char5 = inputdate.charAt(7);
    var char6 = inputdate.charAt(8);
    var char7 = inputdate.charAt(9);
    return "" + char4 + "" + char5 + "" + char6 + "" + char7 + "-" + char2 + "" + char3 + "-" + char0 + "" + char1 + "";
}
