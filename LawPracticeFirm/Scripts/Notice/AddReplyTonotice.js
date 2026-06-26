var editDetails;
$(document).ready(function () {
    GetNoticeSubjectForDropdown();
    GetContactForDropdown();
    GetNoticestatusForDropdown();
    $("#dynamicreptonotiheader").html("Create Reply To Notice Received");
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
        $('#txtdate').attr('min', maxDate);
    });
    var noticeId = sessionStorage.getItem("ReplyNoticeId");
    if (noticeId != "" && noticeId != null && noticeId != undefined) {
        $("#dynamicreptonotiheader").html("Update Reply To Notice");
        openload();
        setTimeout(function () {
            fnGetNoticeById(noticeId);
        }, 3000);
    }
    else {
        fnGetMainNoticeDetailById();
    }
    jQuery('#txtnoticethroughs').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
    jQuery('#txtmodeofservice').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
    var today = new Date().toISOString().split('T')[0];
    //for cretion of standard reply template 
    var addrestovalur = "";
    var txtaddress = "";
    var txtnoticesub = "";
    var txtnotice = "";
    var Refernceno = "";
    var txtsendername = "";
    var txtsenderaddress = "";
    var txtdateofnotice = "";
    //fill value auto populated
    $("#txtreplyaddress").change(function () {
        addrestovalur = $(this).val();
        txtnoticesub = $("#txtreplysubject option:selected").text();
        if (txtnoticesub == 'Please Select') {
            txtnoticesub = '';
        }
        else {
            txtnoticesub = txtnoticesub;
        }
        txtsendername = $("#txtsendername option:selected").text();
        if (txtsendername == 'Others') {
            txtsendername = $('#txtsendernameother').val();
        }
        else {
            txtsendername = txtsendername;
        }
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + addrestovalur + '</br>' + $("#txtaddressaddress").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnoticetitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddresss').val());
    });
    $("#txtaddressaddress").change(function () {
        txtaddress = $(this).val();
        txtnoticesub = $("#txtreplysubject option:selected").text();
        if (txtnoticesub == 'Please Select') {
            txtnoticesub = '';
        }
        else {
            txtnoticesub = txtnoticesub;
        }
        txtsendername = $("#txtsendername option:selected").text();
        if (txtsendername == 'Others') {
            txtsendername = $('#txtsendernameother').val();
        }
        else {
            txtsendername = txtsendername;
        }
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtreplyaddress").val() + '</br>' + txtaddress + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnoticetitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddresss').val());
    });
    $("#txtreplysubject").change(function () {
        txtnoticesub = $("#txtreplysubject option:selected").text();
        if (txtnoticesub == 'Please Select') {
            txtnoticesub = '';
        }
        else {
            txtnoticesub = txtnoticesub;
        }
        txtsendername = $("#txtsendername option:selected").text();
        if (txtsendername == 'Others') {
            txtsendername = $('#txtsendernameother').val();
        }
        else {
            txtsendername = txtsendername;
        }
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtreplyaddress").val() + '</br>' + $("#txtaddressaddress").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnoticetitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddresss').val());
    });
    $("#txtnoticetitle").change(function () {
        txtnotice = $(this).val();
        txtnoticesub = $("#txtreplysubject option:selected").text();
        if (txtnoticesub == 'Please Select') {
            txtnoticesub = '';
        }
        else {
            txtnoticesub = txtnoticesub;
        }
        txtsendername = $("#txtsendername option:selected").text();
        if (txtsendername == 'Others') {
            txtsendername = $('#txtsendernameother').val();
        }
        else {
            txtsendername = txtsendername;
        }
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtreplyaddress").val() + '</br>' + $("#txtaddressaddress").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + txtnotice + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddresss').val());
    });
    $('#txtsenderaddresss').on('change', function () {
        txtsenderaddress = $(this).val();
        txtnoticesub = $("#txtreplysubject option:selected").text();
        if (txtnoticesub == 'Please Select') {
            txtnoticesub = '';
        }
        else {
            txtnoticesub = txtnoticesub;
        }
        txtsendername = $("#txtsendername option:selected").text();
        if (txtsendername == 'Others') {
            txtsendername = $('#txtsendernameother').val();
        }
        else {
            txtsendername = txtsendername;
        }
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtreplyaddress").val() + '</br>' + $("#txtaddressaddress").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnoticetitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + txtsenderaddress);
    });

    $('#txtreplytonoticecreatedon').on('change', function () {
        txtdateofnotice = $(this).val();
        txtnoticesub = $("#txtreplysubject option:selected").text();
        if (txtnoticesub == 'Please Select') {
            txtnoticesub = '';
        }
        else {
            txtnoticesub = txtnoticesub;
        }
        txtsendername = $("#txtsendername option:selected").text();
        if (txtsendername == 'Others') {
            txtsendername = $('#txtsendernameother').val();
        }
        else {
            txtsendername = txtsendername;
        }
        CKEDITOR.instances['CreateNotice'].setData(txtdateofnotice + '</br></br> To,' + '</br>' + $("#txtreplyaddress").val() + '</br>' + $("#txtaddressaddress").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnoticetitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddresss').val());
    });
});

/*Bind contact dropdown*/
function GetContactForDropdown() {
    $.ajax({
        type: "POST",
        url: '/api/CallApi/SpClientDataNew',
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
                //  alert("not found");
            }
            $("#txtsendername").html("");
            $("#txtsendername").append($("<option></option>").val("0").text('Please Select'));
            if (response != null) {
                $(".ms-selectall").show();
                $.each(obj, function (key, value) {
                    $("#txtsendername").append($("<option></option>").val(value.val).text(value.label));
                });
                $("#txtsendername").append($("<option></option>").val("Other").text('Others'));
            } else {
                $("#txtsendername").append($("<option></option>").val("Other").text('Others'));
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

//Add new custom type contacts
$(document).on("change", "#txtsendername", function () {
    var vall = $("#txtsendername option:selected").text();
    if (vall == "Add new contact") {
        $('#txtothersenderdiv').hide();
        $('#contacttypereset')[0].reset();
        $(".ms-options").hide();
        $("#myModalcontacttype").modal('show');
        GetCustomContactsType();
        $("#txtsenderaddress").val('');
    } else if (vall == "Others") {
        $("#txtsenderaddress").val('');
        $('#txtothersenderdiv').show();
    }
    else {
        $("#txtsenderaddress").val('');
        var sendernameid = $(this).val();
        if (sendernameid != "") {
            GetsenderdetailsBySenderId(sendernameid);
        }
        $('#txtothersenderdiv').hide();
    }
    vall = "";
})
/*Get notice subject for dropdown*/
function GetNoticeSubjectForDropdown() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeSubjectList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#txtreplysubject").html("");
            $("#txtreplysubject").append($("<option></option>").val("").text('Please Select'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#txtreplysubject").append($("<option></option>").val(value.Id).text(value.Name));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Get notice reply details by notice id*/
function fnGetMainNoticeDetailById() {
    var mainnoticeid = $("#parentId").val();
    var formdata = new FormData();
    formdata.append("NoticeID", EncodeText(mainnoticeid))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {
            var data = JSON.parse(response.Data);
            $("#txtStatusOfNotice").val(data.CaseStatus);
            $('#txtsenderaddresss').val(data.SendersAddress);
            $('#txtsendername').val(data.SenderNameId);
            if (data.SenderNameId == "Other") {
                $('#txtsendernameother').val(data.Senderothertxt);
                $('#txtothersenderdiv').show();
            }
            else {
                $('#txtothersenderdiv').hide();
            }
            if (data.ModeofReceipt != "") {
                var selectedOptionsmode = data.ModeofReceipt.split(",");
                for (var i in selectedOptionsmode) {
                    var optionValmode = selectedOptionsmode[i];
                    $("#txtmodeofservice").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                }
                $("#txtmodeofservice").multiselect('reload');
            }
            if (data.NoticeThrough != "") {
                var selectedOptions = data.NoticeThrough.split(",");
                for (var i in selectedOptions) {
                    var optionVal = selectedOptions[i];
                    $("#txtnoticethroughs").find("option[value=" + optionVal + "]").prop("selected", "selected");
                }
                $("#txtnoticethroughs").multiselect('reload');
            }
            $("#ddlnoticetype").val(data.NoticeType);
            $("#txtnoticetitle").val(data.NoticeTitle);
            $('#txtaddressaddress').val(data.AddresseeAddress);
            $('#txtotherdetailsofaddress').val(data.OtherDetailsofAddressee);
            //Change As Per Requirement 
            // $('#txtmodeofservice').val(data.ModeofReceipt);
            $('#txtreplysubject').val(data.RejoinderSubject);
            $('#txtnoticereference').val(data.NoticeandReplyReference);
            var receiveddateofnotice = data.DateOfNotice == null || data.DateOfNotice == "1900-01-01T00:00:00" ? "" : (data.DateOfNotice.split("T"))[0];
            $('#txtreplytonoticecreatedon').val(receiveddateofnotice);
            var dateofreceivingreply = data.DateofReply == null || data.DateofReply == "1900-01-01T00:00:00" ? "" : (data.DateofReply.split("T"))[0];
            $('#txtreplyaddress').val(data.RejoinderAddressedto);
            var texrteduedatofnoti = data.DueDateOfNotice == "1900-01-01T00:00:00" ? "" : (data.DueDateOfNotice.split("T"))[0];
            $('#txtduedatenotice').val(texrteduedatofnoti);
            var rejoindetempaddres = "";
            var todays = new Date().toISOString().split('T')[0];
            var sendernametemp = "";
            if (data.SenderNameId == "Other") {
                sendernametemp = data.Senderothertxt;
            } else {
                sendernametemp = $("#txtsendername option:selected").text();
            }
            var rejoindersubjecttemp = $("#txtreplysubject option:selected").text();
            if (rejoindersubjecttemp == 'Please Select') {
                rejoindersubjecttemp = '';
            }
            var daterejoindersss = (data.DateofCreatingRejoinder.split("T"))[0];
            CKEDITOR.instances['CreateNotice'].setData(todays + '</br></br> To,' + '</br>' + data.RejoinderAddressedto + '</br>' + data.AddresseeAddress + '</br></br></br>Sub: ' + rejoindersubjecttemp + '</br>Title: ' + data.NoticeTitle + '</br></br>Reference No.:</br></br></br></br>' + sendernametemp + '</br>' + data.SendersAddress);
            $('#txtrespondentaddress').val(data.RespondentsAddress);
            $("#txtCriticality").val(data.Criticality);
            if (data.Criticality == "High") {
                $("#divhighpriorityreson").css('display', 'block');
                $("#reasonforhighpriority").val(data.Resonforhighpriority);
            }
            $('#txtotherdetailsrespondent').val(data.OtherDetailsofSender);
            $("#txtamountclaimed").val(data.AmountClaimed);
            $("#txttag").val(data.Tag);
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
}
function fnhighpriorityreason() {
    var txtCriticality = $("#txtCriticality").val();
    if (txtCriticality == "High") {
        $("#divhighpriorityreson").css('display', 'block');
    }
    else {
        $("#divhighpriorityreson").css('display', 'none');
    }
}
/*Get notice details*/
function fnGetNoticeById(id) {
    var formdata = new FormData();
    formdata.append("NoticeID", EncodeText(id))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response1) {
            var data = JSON.parse(response1.Data);
            editDetails = data;
            $("#txtStatusOfNotice").val(data.CaseStatus);
            $("#ddlnoticetype").val(data.NoticeType);
            $("#txtreplyaddress").val(data.ReplyAddressedto);
            $('#txtsenderaddresss').val(data.SendersAddress);
            $('#txtsendername').val(data.SenderNameId);
            if (data.SenderNameId == "Other") {
                $('#txtsendernameother').val(data.Senderothertxt);
                $('#txtothersenderdiv').show();
            }
            else {
                $('#txtothersenderdiv').hide();
            }
            if (data.NoticeThrough != null && data.NoticeThrough != "") {
                var selectedOptions = data.NoticeThrough.split(",");
                for (var i in selectedOptions) {
                    var optionVal = selectedOptions[i];
                    $("#txtnoticethroughs").find("option[value=" + optionVal + "]").prop("selected", "selected");
                }
                $("#txtnoticethroughs").multiselect('reload');
            }
            $("#txtnoticerecievedbyclient").val(data.NoticeReceivedbyClient);
            $("#txtNoticeBroughtbyClientforReply").val(data.NoticeBroughtbyClientforReply);
            $("#txtnoticetitle").val(data.NoticeTitle);
            var replytonoticecreatedon = data.ReplytoNoticeCreatedOn == "1900-01-01T00:00:00" ? "" : (data.ReplytoNoticeCreatedOn.split("T"))[0];
            $("#txtreplytonoticecreatedon").val(replytonoticecreatedon);
            $('#txtcurrentstatus').val(data.CurrentStatus);
            $('#txtrespondentaddress').val(data.RespondentsAddress);
            $('#txtotherdetailsrespondent').val(data.OtherDetailsofSender);
            $('#txtnoticereference').val(data.NoticeReference);
            $('#txtrespondentname').val(data.RespondentsName);
            $('#txtreplysubject').val(data.RejoinderSubject);
            $('#txtreplysubject').val(data.ReplySubject);
            $('#txtreplythrough option:selected').text(data.ReplyThrough);
            setTimeout(function () {
                CKEDITOR.instances['CreateNotice'].setData(data.CreateReply);
            }, 5000);
            var dateofdel = data.DateofDelivery == "1900-01-01T00:00:00" ? "" : (data.DateofDelivery.split("T"))[0];
            $('#txtdateofdelivery').val(dateofdel);
            var dateofreceipt = data.DateofReceipt == "1900-01-01T00:00:00" ? "" : (data.DateofReceipt.split("T"))[0];
            $('#txtdateofreceipt').val(dateofreceipt);
            var generationofalrt = data.GenerationofAlerts == "1900-01-01T00:00:00" ? "" : (data.GenerationofAlerts.split("T"))[0];
            $('#txtdate').val(generationofalrt);
            var texrteduedatofnoti = data.DueDateOfNotice == "1900-01-01T00:00:00" ? "" : (data.DueDateOfNotice.split("T"))[0];
            $('#txtduedatenotice').val(texrteduedatofnoti);
            if (data.ModeofServiceorDelivery != null && data.ModeofServiceorDelivery != "") {
                var selectedOptionsmode = data.ModeofServiceorDelivery.split(",");
                for (var i in selectedOptionsmode) {
                    var optionValmode = selectedOptionsmode[i];
                    $("#txtmodeofservice").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                }
                $("#txtmodeofservice").multiselect('reload');
            }
            $('#txtaddressaddress').val(data.AddresseeAddress);
            $('#txtotherdetailsofaddress').val(data.OtherDetailsofRespondent);
            $("#hiddenid").val(data.NoticeID);
            $("#rootId").val(data.RootNoticeId);
            $("#txtCriticality").val(data.Criticality);
            if (data.Criticality == "High") {
                $("#divhighpriorityreson").css('display', 'block');
                $("#reasonforhighpriority").val(data.Resonforhighpriority);
            }
            $("#txtamountclaimed").val(data.AmountClaimed);
            $("#txttag").val(data.Tag);
            closeload();
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
}
//bind custmized  Notice status 
function GetNoticestatusForDropdown() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeStatusList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#txtStatusOfNotice").html("");
            $("#txtStatusOfNotice").append($("<option selected></option>").val("").text('Please Select'));
            $("#txtStatusOfNotice").append($("<option style='font-weight:bold;color:#069;font-size: 11px;'></option>").val("").text('Add new status'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#txtStatusOfNotice").append($("<option data-id=" + value.Id + "></option>").val(value.Id).text(value.Name));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
$("#txtStatusOfNotice").change(function () {
    var vall = $("#txtStatusOfNotice option:selected").text();
    if (vall == "Add new status") {
        $("#myModalnoticestatus").modal('show');
        GetNoticeStatusRecord();
    }
})
function GetNoticeStatusRecord() {
    var html = '';
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeStatusList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    html += "<tr>";
                    html += "<td>" + value.RowId + "</td>";
                    html += "<td>" + value.Name + "</td>";
                    if (value.IsMaster != 1) {
                        html += "<td><a class='glyphicon glyphicon-trash' style='cursor:pointer;' onclick=DeleteNiticeRecordt('" + value.Id + "') title = 'Delete Status'></a></td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                })
                $("#tblcustomnotiststus").html(html);
            }
            else {
                $("#subjectstatuss").show();
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
$("#btnStatussubmit").click(function () {
    var statusname = $("#statusname").val();
    if (statusname == "") {
        alert("Status can't be empty.")
        return false;
    }
    if (statusname.length > 100) {
        alert("Status length can't be greater than 100 character.")
        return false;
    }
    var formData = new FormData();
    formData.append('StatusName', EncodeText(statusname));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/SaveCustomNoticeStatus",
        dataType: 'json',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            ;
            $("#statusname").val("");
            alert(response.Data.message);
            GetNoticeStatusRecord();
            GetNoticestatusForDropdown();
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
})

/*Delete notice records*/
function DeleteNiticeRecordt(Id) {
    if (confirm("Are you sure you want to remove this record?")) {
        var formData = new FormData();
        formData.append('StatusId', EncodeText(Id));
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/RemoveNoticeCustomStatus",
            data: formData,
            dataType: 'json',
            async: false,
            contentType: false,
            processData: false,
            success: function (response) {
                alert(response.Data.message);
                GetNoticeStatusRecord();
                GetNoticestatusForDropdown();
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    }
}
$("#savereplttonotice").click(function () {
    var casestatus = $("#txtStatusOfNotice").val();
    var ddlnoticetype = $("#ddlnoticetype").val();
    var sendernameid = $('#txtsendername').val();
    var txtsendername = $('#txtsendername option:selected').text();
    var txtsenderaddresss = $('#txtsenderaddresss').val();
    var txtnoticethroughId = $("#txtnoticethroughs").val();
    var txtCriticality = $("#txtCriticality").val();
    var txtreasonforhighpriority = $("#reasonforhighpriority").val();
    var duedateofnoticed = $("#txtduedatenotice").val();
    var txtamountclaimed = $("#txtamountclaimed").val();
    var txtsenderothervalue = $('#txtsendernameother').val();
    var txttag = $("#txttag").val();
    var txtmodeofservice = $('#txtmodeofservice').val();
    var txtreplyaddress = $('#txtreplyaddress').val();
    var txtaddressaddress = $('#txtaddressaddress').val();
    var txtotherdetailsofaddress = $('#txtotherdetailsofaddress').val();
    var txtnoticerecievedbyclient = $('#txtnoticerecievedbyclient').val();
    var txtNoticeBroughtbyClientforReply = $('#txtNoticeBroughtbyClientforReply').val();
    var txtrespondentname = $('#txtsendername option:selected').text();
    var txtrespondentaddress = $('#txtsenderaddresss').val();
    var txtotherdetailsrespondent = $('#txtotherdetailsrespondent').val();
    var txtnoticereference = $('#txtnoticereference').val();
    var CreateNotice = CKEDITOR.instances.CreateNotice.getData();
    var txtreplysubject = $('#txtreplysubject').val();
    var txtreplythrough = $('#txtreplythrough option:selected').text();
    var txtdateofreceipt = "";
    var txtdateofreply = "";
    var tatdate = "";
    var txtnoticetitle = $('#txtnoticetitle').val();
    var txtcurrentstatus = $("#txtcurrentstatus").val();
    var txtDateofDelivery = "";
    var txtreplytonoticecreatedon = $('#txtreplytonoticecreatedon').val();
    var replySubjct = $("#txtreplysubject option:selected").text();
    var parentId = $('#parentId').val();
    if (txtsendername == "" || txtsendername == null || txtsendername == "Please Select") {
        alert("Please Add Sender's Name");
        return false;
    }
    if (txtnoticetitle == "") {
        alert("Please Add Title");
        return false;
    }
    if (txtreplythrough == "Please Select") {
        alert("Please add Reply Through");
        return false;
    }
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    var totalFiles = document.getElementById("txtfileupload").files.length;
    var IsFileAvailable;
    if (totalFiles > 0) {
        IsFileAvailable = true;
    }
    else {
        IsFileAvailable = false;
    }
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("txtfileupload").files[i];
        var filename = file.name;
        if (filename.length > 100) {
            alert("File name should not be more than 100 character. Please check file name: " + filename);
            return false;
        }
        formData.append("FileUpload", file);
        try {
            if (typeof (file) != "undefined") {
                size = parseFloat(file.size / 1024).toFixed(2);
                tottempsize = parseFloat(tottempsize) + parseFloat(size);
                tempsize = parseFloat(size);
            }
        }
        catch (err) {
            //alert(err.message);
        }
        tempsize = tempsize.toFixed(2);
        var filesize = 20480;
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    formData.append("IsFileAvailable", EncodeText(IsFileAvailable));
    formData.append("txtreplytonoticecreatedon", EncodeText(txtreplytonoticecreatedon));
    formData.append("txtnoticetitle", EncodeText(txtnoticetitle));
    formData.append("txtdateofreply", EncodeText(txtdateofreply));
    formData.append("txtreplythrough", EncodeText(txtreplythrough));
    formData.append("txtreplysubject", EncodeText(txtreplysubject));
    formData.append("txtnoticereference", EncodeText(txtnoticereference));
    formData.append("txtotherdetailsrespondent", EncodeText(txtotherdetailsrespondent));
    formData.append("txtrespondentaddress", EncodeText(txtrespondentaddress));
    formData.append("txtrespondentname", EncodeText(txtrespondentname));
    formData.append("txtNoticeBroughtbyClientforReply", EncodeText(txtNoticeBroughtbyClientforReply));
    formData.append("txtnoticerecievedbyclient", EncodeText(txtnoticerecievedbyclient));
    formData.append("txtaddressaddress", EncodeText(txtaddressaddress));
    formData.append("txtreplyaddress", EncodeText(txtreplyaddress));
    formData.append("txtmodeofservice", EncodeText(txtmodeofservice));
    formData.append("ddlnoticetype", EncodeText(ddlnoticetype));
    formData.append("casestatus", EncodeText(casestatus));
    formData.append("txtdateofreceipt", EncodeText(txtdateofreceipt));
    formData.append("txtcurrentstatus", EncodeText(txtcurrentstatus));
    formData.append("txtDateofDelivery", EncodeText(txtDateofDelivery));
    formData.append("CreateNotice", EncodeText(CreateNotice));
    formData.append("txtotherdetailsofaddress", EncodeText(txtotherdetailsofaddress));
    formData.append("tatdate", EncodeText(tatdate));
    formData.append("hidden", EncodeText($("#hiddenid").val()));
    formData.append("parentId", EncodeText(parentId));
    if ($("#rootId").val() != "" && $("#rootId").val() != null && $("#rootId").val() != undefined) {
        formData.append("rootId", EncodeText($("#rootId").val()));
    }
    else {
        formData.append("rootId", EncodeText(parentId));
    }
    formData.append("sendernameId", EncodeText(sendernameid));
    formData.append("txtsendername", EncodeText(txtsendername));
    formData.append("txtsenderaddresss", EncodeText(txtsenderaddresss));
    formData.append("txtnoticethrough", EncodeText(txtnoticethroughId));
    formData.append("txtCriticality", EncodeText(txtCriticality));
    formData.append("Duedateofnotice", EncodeText(duedateofnoticed));
    formData.append("txtsenderothervalue", EncodeText(txtsenderothervalue));
    formData.append("txtamountclaimed", EncodeText(txtamountclaimed));
    formData.append("txttag", EncodeText(txttag));
    formData.append("textroof", EncodeText(""));
    formData.append("txtreasonforhighpriority", EncodeText(txtreasonforhighpriority));
    formData.append("replySubjct", EncodeText(replySubjct));
    commonFormsavevariablevalue(formData);
    openload();
    $.ajax({
        type: "POST",
        url: "/api/ReplyToNotice/AddReplyToNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.Data.message);
            sessionStorage.removeItem("ReplyNoticeId");
            var firmcode = localStorage.getItem("FirmCode");
            window.history.back();
        },
        failure: function (data) {
            alert(data.Data.message);
            closeload();
        },
        error: function (data) {
            alert(data.Data.message);
            closeload();
        }
    });
});

//hide show opterpartydetails
function myhideshowOCRNotice() {
    var x = document.getElementById("OtherOCRNotice");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

//get sender details address
function GetsenderdetailsBySenderId(Senderidss) {
    var formData = new FormData();
    formData.append('SenderId', EncodeText(Senderidss))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/GetSenderDetailsBySenderId",
        dataType: 'json',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != "") {
                $("#txtsenderaddresss").val(response.Data.addresss);
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

//bind custom contact type
function GetCustomContactsType() {
    openload();
    var html1 = '';
    var formdata = new FormData();
    formdata.append("userid", EncodeText(""));
    $.ajax({
        type: "POST",
        url: "/api/Home/ClientDetailsList",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            $("#tblcustomecontatype").html("");
            $("#customecontauss").html("");
            if (response == "") {
                $("#customecontauss").append("No client record found.");
                closeload();
                return false;
            }
            else {
                $.each(response, function (i, a) {
                    html1 += '<tr scope="row">';
                    html1 += '<td>' + a.rownum + '</td>';
                    html1 += '<td>' + a.ContactType + '</td>';
                    html1 += '<td>' + a.fname + '</td>';
                    html1 += '<td>' + a.lname + '</td>';
                    html1 += '<td>' + a.mobno + '</td>';
                    html1 += '<td>' + a.cemail + '</td>';
                    html1 += '<td><a class="glyphicon glyphicon-trash" style="cursor:pointer;"onclick=DeleteClient("' + a.ClientId + '") title="Delete Client"></a></td>';
                    html1 += '</tr>';
                });
                $("#tblcustomecontatype").append(html1);
            }
            closeload();
        },
        failure: function (response) {
            alert(data.responseText);
            closeload();
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
            closeload();
        } //End of AJAX error function
    });
}
$('.UserType').change(function () {
    var value = $(this).filter(':checked').val();
    if (value == "True") {
        $("#clientdata").css("display", "block");
        $("#managerdata").css("display", "none");
    }
    else if (value == "False") {
        $("#clientdata").css("display", "none");
        $("#managerdata").css("display", "block");
    }
});
