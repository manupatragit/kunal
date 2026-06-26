var editDetails;
$(document).ready(function () {
    $("#dynamicrejoindernotiheader").html("Add Details Of Notices Received ");
    GetNoticeSubjectForDropdown();
    GetContactForDropdown();
    GetNoticestatusForDropdown();
    var noticeId = sessionStorage.getItem("ReceivedNoticeId");
    if (noticeId != "" && noticeId != null && noticeId != undefined) {
        $("#dynamicrejoindernotiheader").html("Update Received Notice Details");
        $("#txtsendernameReceived").prop('disabled', true);
        $("#txtsendernameother").prop('disabled', true);
        $("#resetcf").hide();
        openload();
        // setTimeout(function () {
        fnGetNoticeById(noticeId);
        //  }, 5000);
    }
    else {
        $("#resetcf").show();
    }

    /*Bind multiselect dropdown*/
    jQuery('#txtmodeofReceipt').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
    jQuery('#txtnoticetreceivedhrough').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
});

/*Bind contact for dropdown*/
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
            $("#txtsendernameReceived").html("");
            $("#txtsendernameReceived").append($("<option></option>").val("0").text('Please Select'));
            if (response != null) {
                $(".ms-selectall").show();
                $.each(obj, function (key, value) {
                    $("#txtsendernameReceived").append($("<option></option>").val(value.val).text(value.label));
                });
                $("#txtsendernameReceived").append($("<option></option>").val("Other").text('Others'));
            } else {
                $("#txtsendernameReceived").append($("<option></option>").val("Other").text('Others'));
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

//Add new custom type contacts
$(document).on("change", "#txtsendernameReceived", function () {
    var vall = $("#txtsendernameReceived option:selected").text();
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
            $("#txtrejoindersub").html("");
            $("#txtrejoindersub").append($("<option></option>").val("").text('Please Select'));
            $("#txtrejoindersub").append($("<option style='font-weight:bold;color:#069;'></option>").val("").text('Add new subject'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#txtrejoindersub").append($("<option></option>").val(value.Id).text(value.Name));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Rejoinder subject*/
$("#txtrejoindersub").change(function () {
    var vall = $("#txtrejoindersub option:selected").text();
    if (vall == "Add new subject") {
        $("#myModalnoticesubjectname").modal('show');
        GetNoticeSubjectRecord();
    }
})
/*Get notice subject records*/
function GetNoticeSubjectRecord() {
    var counter = 1;
    var html = '';
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeSubjectList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    if (value.firmid == "" || value.firmid == "null" || value.firmid == null) {
                    }
                    else {
                        html += '<tr>'
                        html += '<td>' + counter + '</td>'
                        html += '<td>' + value.Name + '</td>'
                        html += '<td><a style="cursor:pointer;" onclick=DeleteSubjectRecordt("' + value.Id + '") title = "Delete Subject"><img src="/newassets/img/deletematter.png" /></a></td>'
                        html += '</tr>'
                        counter++;
                    }
                })
                $("#tblsubjectdetailbidy").html(html);
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
/*Save notice subject from received notice*/
$("#btnSubject").click(function () {
    var subjectname = $("#subjectname").val();
    var hiddensubjectid = $("#hiddensubjectid").val();
    if (subjectname == "") {
        alert("Subject name can't be empty.")
        return false;
    }
    var formData = new FormData();
    formData.append('SubjectName', EncodeText(subjectname));
    formData.append('hidden', EncodeText(hiddensubjectid));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/SaveNoticeSubject",
        dataType: 'json',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#subjectname").val("");
            if (String(response.Data) == "true") {
                alert("Notice subject added successfully");
            }
            else {
                alert("Notice subject can not be added");
            }
            GetNoticeSubjectRecord();
            GetNoticeSubjectForDropdown();
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
})
/*Delete custom added notice subject*/
function DeleteSubjectRecordt(Id) {
    if (confirm("Are you sure you want to remove this record?")) {
        var formData = new FormData();
        formData.append('SubjectId', EncodeText(Id));
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/RemoveSubjectType",
            data: formData,
            dataType: 'json',
            async: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (String(response.Data) == "true") {
                    alert("Notice subject removed Successfully");
                }
                else {
                    alert("can not be removed");
                }
                GetNoticeSubjectRecord();
                GetNoticeSubjectForDropdown();
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    }
}

/*Get notice by notice id*/
var totalFiles1 = 0;
function fnGetNoticeById(id) {
    var formdata = new FormData();
    formdata.append("NoticeID", EncodeText(id))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeRecivedDetailsListById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response1) {
            var datas = JSON.parse(response1.Data);
            totalFiles1 = datas.IsFileAvailable;
            editDetails = datas;
            $.each(datas, function (k, data) {
                $("#txtStatusOfNotice").val(data.CaseStatus);
                var dateofreceipt = data.DateofReceipt == null || data.DateofReceipt == "1900-01-01T00:00:00" ? "" : (data.DateofReceipt.split("T"))[0];
                $('#txtdateofreceipt').val(dateofreceipt);
                var rejoinderthrough = data.RejoinderThrough;
                rejoinderthrough = rejoinderthrough.toLowerCase();
                $('#txtrejoinderthrough').val(rejoinderthrough);
                $('#txtrejoindersub').val(data.RejoinderSubject);
                $("#ddlnoticetype").val(data.NoticeType);
                $("#ddlrejoinder").val();
                try {
                    if (data.GenerationofAlerts == "1900-01-01T00:00:00") {
                        $('#txtdate').val("");
                    }
                    else
                        $('#txtdate').val((data.GenerationofAlerts.split("T"))[0]);
                }
                catch {
                }
                try {
                    var dateofnotice = data.DateofNotice == null || data.DateofNotice == "1900-01-01T00:00:00" ? "" : (data.DateofNotice.split("T"))[0];
                    $('#dateofnotice').val(dateofnotice);
                }
                catch {
                }
                var dateofrejoinder = data.DateofRejoinder == null || data.DateofRejoinder == "1900-01-01T00:00:00" ? "" : (data.DateofRejoinder.split("T"))[0];
                $('#txtdateofrejoinder').val(dateofrejoinder);
                $('#txtnoticereplyreference').val(data.NoticeandReplyReference);
                $('#dateofdispatch').val();
                var dateofserviceofnotice = data.DateofServiceofNotice == null || data.DateofServiceofNotice == "1900-01-01T00:00:00" ? "" : (data.DateofServiceofNotice.split("T"))[0];
                $('#dateofServiceofNotice').val(dateofserviceofnotice);
                var dateofreceivingreply = data.DateofReceivingReply == null || data.DateofReceivingReply == "1900-01-01T00:00:00" ? "" : (data.DateofReceivingReply.split("T"))[0];
                $('#txtdateofreceivingreply').val(dateofreceivingreply);
                //bind mode of delevery
                if (data.ModeofReceipt != "") {
                    var selectedOptionsmode = data.ModeofReceipt.split(",");
                    for (var i in selectedOptionsmode) {
                        var optionValmode = selectedOptionsmode[i];
                        $("#txtmodeofReceipt").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                    }
                    $("#txtmodeofReceipt").multiselect('reload');
                }
                if (data.NoticeThrough != "") {
                    var selectedOptions = data.NoticeThrough.split(",");
                    for (var i in selectedOptions) {
                        var optionVal = selectedOptions[i];
                        $("#txtnoticetreceivedhrough").find("option[value=" + optionVal + "]").prop("selected", "selected");
                    }
                    $("#txtnoticetreceivedhrough").multiselect('reload');
                }
                $('#txtsendernameReceived').val(data.SenderNameId);
                if (data.SenderNameId == "Other") {
                    $('#txtsendernameother').val(data.Senderothertxt);
                    $('#txtothersenderdiv').show();
                }
                else {
                    $('#txtothersenderdiv').hide();
                }
                if (data.DueDateOfNotice != null && data.DueDateOfNotice != "1900-01-01T00:00:00") {
                    $('#txtduedatenotice').val((data.DueDateOfNotice.split("T"))[0]);
                }
                $('#txtsenderaddress').val(data.SendersAddress);
                $('#txtModeofdeliveryrejoinder').val(data.ModeofDeliveryofRejoinder);
                $('#txtrejoindernoticeto').val(data.RejoinderAddressedto);
                $('#txtaddressto').val(data.AddresseeAddress);
                $('#txtotherdetailsofaddress').val(data.OtherDetailsofAddressee);
                $('#txtrejoindertitle').val(data.NoticeTitle);
                setTimeout(function () {
                    CKEDITOR.instances['CreateNotice'].setData(data.CreateRejoinder);
                }, 2000);
                if (data.DateofDelivery != null) {
                    $("#txtDateofDelivery").val((data.DateofDelivery.split("T"))[0]);
                }
                $("#txtcurrentstatus").val(data.CurrentStatus);
                if (data.DateofNotice != null) {
                    $("#txtdateofcreaterejoinder").val((data.DateofNotice.split("T"))[0]);
                }
                $("#hiddenid").val(data.NoticeID);
                $("#txtotherdetailsofsender").val(data.OtherDetailsofSender);
                $("#txtCriticality").val(data.Criticality);
                if (data.Criticality == "High") {
                    $("#divhighpriorityreson").css('display', 'block');
                    $("#reasonforhighpriority").val(data.Resonforhighpriority);
                }
                $("#txtamountclaimed").val(data.AmountClaimed);
                $("#txttag").val(data.Tag);
                $("#Refernceno").val(data.NoticeReference);
                $("#IntRefernceno").val(data.IntNoticeReference);
            });
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
function fnhighpriorityreason() {
    var txtCriticality = $("#txtCriticality").val();
    if (txtCriticality == "High") {
        $("#divhighpriorityreson").css('display', 'block');
    }
    else {
        $("#divhighpriorityreson").css('display', 'none');
    }
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
                    if (value.Name == "Active") {
                        $("#txtStatusOfNotice").append($("<option data-id=" + value.Id + " selected></option>").val(value.Id).text(value.Name));
                    }
                    else {
                        $("#txtStatusOfNotice").append($("<option data-id=" + value.Id + "></option>").val(value.Id).text(value.Name));
                    }
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
/*Get notice status details list*/
function GetNoticeStatusRecord() {
    var html = '';
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeStatusDetailList",
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
                        html += "<td><a style='cursor:pointer;' onclick=DeleteNiticeRecordt('" + value.Id + "') title = 'Delete Status'><img src='/newassets/img/deletematter.png' /></a></td>";
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

/*Save custom notice status*/
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

/*Delete custom notice status by notice id*/
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
$(document).on('click', '#savenoticebtn', function () {
    var chktype = $("#savenoticebtn").attr("type");
    if (chktype == "button") {
        alert("Please first save/publish new added custom field.");

    }
    submitNotice();
});
/*Save received notice details*/
//$(document).ready(function () {
//    $('form[id="noticereceivedform"]').validate({
//        submitHandler: function (form) {
function submitNotice(){
            var txtdateofreceipt = $('#txtdateofreceipt').val();
            var txtrejoinderthrough = $('#txtsendernameReceived option:selected').text();
            var txtrejoindersub = $('#txtrejoindersub').val();
            var casestatus = $("#txtStatusOfNotice").val();;
            var ddlnoticetype = $("#ddlnoticetype").val();
            var dateofServiceofNotice = $('#dateofServiceofNotice').val();
            var txtdateofreceivingreply = $('#txtdateofreceivingreply').val();
            var txtrejoindernoticeto = $('#txtrejoindernoticeto').val();
            var txtaddressto = $('#txtaddressto').val();
            var txtotherdetailsofaddress = $('#txtotherdetailsofaddress').val();
            var txtnoticereplyreference = $('#txtnoticereplyreference').val();
            var txtrejoindertitle = $('#txtrejoindertitle').val();
            var CreateNotice = CKEDITOR.instances.CreateNotice.getData();
            var txtDateofDelivery = $("#txtDateofDelivery").val();
            var txtcurrentstatus = $("#txtcurrentstatus").val();
            var txtdateofcreaterejoinder = $("#txtdateofcreaterejoinder").val();
            var txtnoticethroughId = $("#txtsendernameReceived").val();
            var txtnoticesubId = $("#txtrejoindersub option:selected").attr("data-id");
    var txtsenderaddress = $("#txtsenderaddress").val();
    var subjectName = $("#txtrejoindersub option:selected").text();
    if (subjectName == 'Please Select') {
        subjectName = "";
    }
            var txtsentthrough = "";
            var txtnoticetreceivedhrough = $("#txtnoticetreceivedhrough option:selected").map(function () {
                return $(this).val();
            }).get().join(',');
            var txtmodeofReceipt = $("#txtmodeofReceipt option:selected").map(function () {
                return $(this).val();
            }).get().join(',');
            var Refernceno = $("#Refernceno").val();
            var IntRefernceno = $("#IntRefernceno").val();
            var txtduedatenotice = $("#txtduedatenotice").val();
            var txtsendernameother = $("#txtsendernameother").val();
            var DosoReceiver = "";
            var OtherdetailsofSender = $("#txtotherdetailsofsender").val();
            var Criticality = $("#txtCriticality").val();
            var txtreasonforhighpriority = $("#reasonforhighpriority").val();
            var txtamountclaimed = $("#txtamountclaimed").val();
            var txttag = $("#txttag").val();
            if (txtrejoinderthrough == "Please Select") {
                alert("Please select Receiver's name");
                return false;
            }
            if (txtrejoinderthrough == 'Others') {
                if (txtsendernameother == "") {
                    alert("Please enter others name");
                    return false;
                }
            }
            else {
                txtsendernameother = "";
            }
            if (txtrejoindertitle == "") {
                alert("Please Add Title");
                return false;
            }
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            var totalFiles = document.getElementById("txtrejoinderfile").files.length;
            if (totalFiles > 0) {
                formData.append("FileAvailable", EncodeText(true));
            }
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("txtrejoinderfile").files[i];
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
                var filesize = 20480
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
            formData.append("txtdateofnotice", EncodeText(txtdateofcreaterejoinder));
            formData.append("tatdate", EncodeText(""));
            formData.append("hidden", EncodeText($("#hiddenid").val()));
            formData.append("NoticeThroughId", EncodeText(txtnoticethroughId));
            formData.append("SubectId", EncodeText(txtnoticesubId));
            commonFormsavevariablevalue(formData);
            formData.append("txtsenderaddress", EncodeText(txtsenderaddress));
            formData.append("txtsentthrough", EncodeText(txtsentthrough));
            formData.append("txtnoticetreceivedhrough", EncodeText(txtnoticetreceivedhrough));
            formData.append("txtduedatenotice", EncodeText(txtduedatenotice));
            formData.append("txtsendernameother", EncodeText(txtsendernameother));
            formData.append("DosoReceiver", EncodeText(DosoReceiver));
            formData.append("OtherdetailsofSender", EncodeText(OtherdetailsofSender));
            formData.append("Criticality", EncodeText(Criticality));
            formData.append("txtreasonforhighpriority", EncodeText(txtreasonforhighpriority));
            formData.append("txtamountclaimed", EncodeText(txtamountclaimed));
            formData.append("txttag", EncodeText(txttag));
            formData.append("Referncenumber", EncodeText(Refernceno));
            formData.append("IntReferncenuber", EncodeText(IntRefernceno));
            formData.append("ddlsubjectName", subjectName);
            var headerval2 = formData.get("headerval");
            var headervalues = JSON.parse(headerval2);
            openload();
            $.ajax({
                type: "POST",
                url: "/api/NoticeReceived/AddReceivedNotice",
                data: formData,
                headers: headervalues,
                contentType: false,
                processData: false,
                success: function (data) {
                    closeload();
                    if (String(data.Data) == "Already exist title name. please try another title name") {
                        alert(data.Data);
                        return false;
                    }
                    else {
                        alert(data.Data.message);
                        sessionStorage.removeItem("ReceivedNoticeId");
                        var firmcode = localStorage.getItem("FirmCode");
                        window.location.href = "/" + firmcode + "/NoticeReceived/ReceivedNoticeList"
                    }
                },
                failure: function (data) {
                    closeload();
                    alert(data.Data.message);
                },
                error: function (data) {
                    closeload();
                    alert(data.Data.message);
                }
            });
        }
   // });
    /*});*/
//}

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
                $("#txtsenderaddress").val(response.Data.addresss);
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
                    html1 += '<td><a style="cursor:pointer;"onclick=DeleteClient("' + a.ClientId + '") title="Delete Client"><img src="/newassets/img/deletematter.png" /></a></td>';
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


$(document).on('change', '#attachment', function () {
    var fileName = this.files.length ? this.files[0].name : "";
    $("#fileName").text(fileName);
    if (fileName !== "") {
        $("#deleteFile").show();
    }
});

// Delete file
$(document).on('click', '#deleteFile', function () {
    $("#attachment").val("");
    $("#showomoredetail").hide();
    $("#fileName").text("");
    $("#deleteFile").hide();
});