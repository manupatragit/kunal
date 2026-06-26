var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    GetContactForDropdown();
    $("#showomoredetail").hide();
});
/*Open city*/
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
/*Get Contact For Dropdown*/
function GetContactForDropdown() {
    $.ajax({
        type: "POST",
        url: "/api/Home/BindContactDropdown",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#txtrejoinderthrough").append($("<option></option>").val("0").text('Please Select'));
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#txtrejoinderthrough").append($("<option></option>").val(value.cid).text(value.fullnsame));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*File validation*/
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

/*Save new case file*/
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
        formData.append("loginusrid", EncodeText(userDetails.Id));
        formData.append("loginfirmid", EncodeText(userDetails.FirmId));
        if (ocrlanguage == "eng") {
            $.ajax({
                type: "POST",
                url: "/api/OocrApi/ViewUserGroupsDatatest",
                contentType: false,
                processData: false,
                data: formData,
                success: function (response) {
                    if (response != null) {
                        $("#showomoredetail").show();
                        $('#divOCRContent').html('</br></br><label style="border-bottom:1px solid black">Ocr Text</label><br/>' + response[1]);
                        $("#myOCRModal").modal('show');
                        ocrcontent = response[1];
                        originalimagepath = response[0];
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
    }
});
$("#showomoredetail").click(function () {
    $("#myOCRModal").modal('show');
})
function fncheckocrcopy() {
    $("#myOCRModalContent").modal('show');
    $("#divOCRContentresponse").html(ocrcontent);
}
/*Check OCR original copy*/
function fncheckoriginalcopy() {
    window.open("" + originalimagepath + "", '_blank');
}
$(document).on('click', 'input[type="checkbox"]', function () {
    $('input[type="checkbox"]').not(this).prop('checked', false);
    var tt = $("input[type='checkbox']:checked").attr('name');
    var kk = $("input[type='checkbox']:checked").val();
    var selectedText = getSelectionText();
    if (tt == "CreateNotice") {
        CKEDITOR.instances['CreateNotice'].setData(selectedText);
    } else {
        $("#" + tt).val(selectedText);
    }
});
/*Get selection text*/
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
/*Save reply notice*/
$("#savereplynotice").click(function () {
    var casestatus = $("input[name='monthlyBy']:checked").val();
    var txtdateofreceipt = $('#txtdateofreceipt').val();
    var txtrejoinderthrough = $('#txtrejoinderthrough').val();
    var txtrejoindersub = $('#txtrejoindersub').val();
    var ddlnoticetype = $("#ddlnoticetype").val();
    var dateofServiceofNotice = $('#dateofServiceofNotice').val();
    var txtdateofreceivingreply = $('#txtdateofreceivingreply').val();
    var txtmodeofReceipt = $('#txtmodeofReceipt').val();
    var txtrejoindernoticeto = $('#txtrejoindernoticeto').val();
    var txtaddressto = $('#txtaddressto').val();
    var txtotherdetailsofaddress = $('#txtotherdetailsofaddress').val();
    var txtnoticereplyreference = $('#txtnoticereplyreference').val();
    var txtrejoindertitle = $('#txtrejoindertitle').val();
    var CreateNotice = CKEDITOR.instances.CreateNotice.getData();
    var txtDateofDelivery = $("#txtDateofDelivery").val();
    var txtcurrentstatus = $("#txtcurrentstatus").val();
    var txtdateofcreaterejoinder = $("#txtdateofcreaterejoinder").val();
    if (txtdateofreceivingreply == "") {
        alert("Please Select Date of Receiving Reply");
        return false;
    }
    if (txtrejoindernoticeto == "") {
        alert("Please Add Rejoinder Addressed to");
        return false;
    }
    if (txtaddressto == "") {
        alert("Please Add Addressee Address");
        return false;
    }
    if (txtotherdetailsofaddress == "") {
        alert("Please Add Other Details of Addressee");
        return false;
    }
    if (txtnoticereplyreference == "") {
        alert("Please Add Notice and Reply Reference");
        return false;
    }
    if (txtrejoindersub == "") {
        alert("Please Add Rejoinder Subject");
        return false;
    }
    if (CreateNotice == "") {
        alert("Please Add Create Rejoinder");
        return false;
    }
    if ($("#txtrejoinderthrough") == "0") {
        alert("Please add Rejoinder Through");
        return false;
    }
    var formData = new FormData();
    formData.append("ddlrejoinder", EncodeText(""));
    formData.append("ddlnoticetype", EncodeText(ddlnoticetype));
    formData.append("casestatus", EncodeText(casestatus));
    formData.append("txtrejoindersub", EncodeText(txtrejoindersub));
    formData.append("txtrejoinderthrough", EncodeText(txtrejoinderthrough));
    formData.append("txtdateofreceipt", EncodeText(txtdateofreceipt));
    formData.append("txtdateofcreaterejoinder", EncodeText(txtdateofcreaterejoinder));
    formData.append("txtcurrentstatus", EncodeText(txtcurrentstatus));
    formData.append("txtDateofDelivery", EncodeText(txtDateofDelivery));
    formData.append("CreateNotice", EncodeText(CreateNotice));
    formData.append("txtrejoindertitle", EncodeText(txtrejoindertitle));
    formData.append("txtnoticereplyreference", EncodeText(txtnoticereplyreference));
    formData.append("txtotherdetailsofaddress", EncodeText(txtotherdetailsofaddress));
    formData.append("txtaddressto", EncodeText(txtaddressto));
    formData.append("txtrejoindernoticeto", EncodeText(txtrejoindernoticeto));
    formData.append("txtModeofdeliveryrejoinder", EncodeText(""));
    formData.append("txtdateofrejoinder", EncodeText(""));
    formData.append("txtmodeofReceipt", EncodeText(txtmodeofReceipt));
    formData.append("txtdateofreceivingreply", EncodeText(txtdateofreceivingreply));
    formData.append("dateofServiceofNotice", EncodeText(dateofServiceofNotice));
    formData.append("txtdateofdispatch", EncodeText(""));
    formData.append("txtdateofnotice", EncodeText(""));
    formData.append("tatdate", EncodeText(""));
    formData.append("FirmIdd", EncodeText(userDetails.FirmId));
    formData.append("LoginUserId", EncodeText(userDetails.Id));
    formData.append("hidden", EncodeText($("#hiddenid").val()));
    $.ajax({
        type: "POST",
        url: "/api/NoticeReceived/AddReceivedNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.message);
            ClearData();
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
});
/*Clear data*/
function ClearData() {
    $('#txtdateofreceipt').val();
    $('#txtrejoinderthrough').val("0");
    $('#txtrejoindersub').val();
    $("#noticestatus").val();
    $("#ddlnoticetype").val();
    $('#dateofServiceofNotice').val();
    $('#txtdateofreceivingreply').val();
    $('#txtmodeofReceipt').val();
    $('#txtrejoindernoticeto').val();
    $('#txtaddressto').val();
    $('#txtotherdetailsofaddress').val();
    $('#txtnoticereplyreference').val();
    $('#txtrejoindertitle').val();
    CKEDITOR.instances.CreateNotice.setData("");
    $("#txtDateofDelivery").val();
    $("#txtcurrentstatus").val();
    $("#txtdateofcreaterejoinder").val();
}