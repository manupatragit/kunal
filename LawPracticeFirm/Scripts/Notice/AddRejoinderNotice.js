var editDetails;
$(document).ready(function () {
    if ($("#InitiatedById").val() == "opponent") {
        $("#dynamicstyle").css('display', 'block');
    }
    GetNoticeSubjectForDropdown();
    GetNoticestatusForDropdown();
    GetContactForDropdownValue();
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
        var today = new Date().toISOString().split('T')[0];
    });
    var noticeId = sessionStorage.getItem("RejoinderNoticeId");
    var NoticeType = localStorage.getItem("NType");
    if (NoticeType == 'CreateReceived') {
        $("#dynamicrejoindernotiheader").html("Add Rejoinder Notice Received");
    }
    else if (NoticeType == 'UpdateReceived') {
        $("#dynamicrejoindernotiheader").html("Update Rejoinder Notice Received");
    }
    else if (NoticeType == 'Sent') {
        $("#dynamicrejoindernotiheader").html("Add Rejoinder Notice Sent");
    }
    else {
        $("#dynamicrejoindernotiheader").html("Update Rejoinder Notice Sent");
    }
    if (noticeId != "" && noticeId != null && noticeId != undefined) {
        fnGetNoticeById(noticeId);
        $("#resetcf").hide();
    }
    else {
        $("#resetcf").show();
        fnGetMainNoticeDetailById();
    }
    jQuery('#txtModeofdeliveryrejoinder').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
    jQuery('#txtrejoinderthrough1').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
    var today = new Date().toISOString().split('T')[0];
    CKEDITOR.instances['CreateNotice'].setData(today + '</br> To,');
    var addrestovalur = "";
    var txtaddress = "";
    var txtnoticesub = "";
    var txtnotice = "";
    var Refernceno = "";
    var txtsendername = "";
    var txtsenderaddress = "";
    var txtdateofnotice = "";
    //fill value auto populated
    $("#txtrejoindernoticeto").change(function () {
        addrestovalur = $(this).val();
        txtnoticesub = $("#txtrejoindersub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + addrestovalur + '</br>' + $("#txtaddressto").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtrejoindertitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    $("#txtaddressto").change(function () {
        txtaddress = $(this).val();
        //txtnoticesub = $("#txtrejoindersub option:selected").text();
        txtnoticesub = $("#txtrejoindersub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtrejoindernoticeto").val() + '</br>' + txtaddress + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtrejoindertitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    $("#txtrejoindersub").change(function () {
        txtnoticesub = $("#txtrejoindersub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtrejoindernoticeto").val() + '</br>' + $("#txtaddressto").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtrejoindertitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    $("#txtrejoindertitle").change(function () {
        txtnotice = $(this).val();
        txtnoticesub = $("#txtrejoindersub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtrejoindernoticeto").val() + '</br>' + $("#txtaddressto").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + txtnotice + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    $('#txtsenderaddress').on('change', function () {
        txtsenderaddress = $(this).val();
        txtnoticesub = $("#txtrejoindersub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtrejoindernoticeto").val() + '</br>' + $("#txtaddressto").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtrejoindertitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + txtsenderaddress);
    });
    $('#txtdateofcreaterejoinder').on('change', function () {
        txtdateofnotice = $(this).val();
        txtnoticesub = $("#txtrejoindersub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(txtdateofnotice + '</br></br> To,' + '</br>' + $("#txtrejoindernoticeto").val() + '</br>' + $("#txtaddressto").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtrejoindertitle").val() + '</br></br>Reference No.:' + Refernceno + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
});

/*Get notice subject dropdown value*/
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
/*Get notice details by notice id*/
function fnGetMainNoticeDetailById() {
    var mainnoticeid = $("#mainnoticeid").val();
    var formdata = new FormData();
    formdata.append("NoticeID", EncodeText(mainnoticeid))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response1) {
            var data = JSON.parse(response1.Data);
            var item = window.localStorage.getItem("NType");
            var rejoindetempaddres = "";
            if (item == "Sent") {
                $('#txtrejoindernoticeto').val(data.AddressedTo);
                rejoindetempaddres = data.AddressedTo;
            }
            else {
                $('#txtrejoindernoticeto').val(data.RejoinderAddressedto);
                rejoindetempaddres = data.RejoinderAddressedto;
            }
            $("#txtStatusOfNotice").val(data.CaseStatus);
            $("#ddlnoticetype").val(data.NoticeType);
            $('#txtaddressto').val(data.AddresseeAddress);
            $('#txtotherdetailsofaddress').val(data.OtherDetailsofAddressee);
            $('#txtrejoindersub').val(data.RejoinderSubject == "" ? data.NoticeSubject : data.RejoinderSubject);
            $("#txtrejoindertitle").val(data.NoticeTitle);
            $('#txtsendername').val(data.SenderNameId);
            if (data.SenderNameId == "Other") {
                $('#txtsendernameother').val(data.Senderothertxt);
                $('#txtothersenderdiv').show();
            }
            else {
                $('#txtothersenderdiv').hide();
            }
            $('#txtotherdetailsofsender').val(data.OtherDetailsofSender);
            $("#txtsenderaddress").val(data.SendersAddress);
            $('#txtaddressto').val(data.AddresseeAddress);
            $('#txtotherdetailsofaddress').val(data.OtherDetailsofAddressee);
            $("#txtCriticality").val(data.Criticality);
            if (data.Criticality == "High") {
                $("#divhighpriorityreson").css('display', 'block');
                $("#reasonforhighpriority").val(data.Resonforhighpriority);
            }
            $('#txtotherdetailsrespondent').val(data.OtherDetailsofSender);
            $("#txtamountclaimed").val(data.AmountClaimed);
            $("#txttag").val(data.Tag);
            if (data.NoticeThrough != "") {
                var selectedOptionsmodeaaa = data.NoticeThrough.split(",");
                for (var i in selectedOptionsmodeaaa) {
                    var optionValmodeaa = selectedOptionsmodeaaa[i];
                    $("#txtrejoinderthrough1").find("option[value=" + optionValmodeaa + "]").prop("selected", "selected");
                }
                $("#txtrejoinderthrough1").multiselect('reload');
            }
            if (data.ModeofReceipt != "") {
                var selectedOptionsmode = data.ModeofReceipt.split(",");
                for (var i in selectedOptionsmode) {
                    var optionValmode = selectedOptionsmode[i];
                    $("#txtModeofdeliveryrejoinder").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                }
                $("#txtModeofdeliveryrejoinder").multiselect('reload');
            }
            if (data.DueDateOfNotice != null && data.DueDateOfNotice != '1900-01-01T00:00:00') {
                $('#txtduedatenotice').val((data.DueDateOfNotice.split("T"))[0]);
            }
            var todays = new Date().toISOString().split('T')[0];
            var sendernametemp = "";
            if (data.SenderNameId == "Other") {
                sendernametemp = data.Senderothertxt;
            } else {
                sendernametemp = $("#txtsendername option:selected").text();
            }
            var rejoindersubjecttemp = $("#txtrejoindersub option:selected").text();
            if (rejoindersubjecttemp == 'Please Select') {
                rejoindersubjecttemp = '';
            }
            var daterejoindersss = (data.DateofCreatingRejoinder.split("T"))[0];
            CKEDITOR.instances['CreateNotice'].setData(todays + '</br></br> To,' + '</br>' + rejoindetempaddres + '</br>' + data.AddresseeAddress + '</br></br></br>Sub: ' + rejoindersubjecttemp + '</br>Title: ' + data.NoticeTitle + '</br></br>Reference No.:</br></br></br></br>' + sendernametemp + '</br>' + data.SendersAddress);
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
}
/*Bind contact dropdown details*/
function GetContactForDropdownValue() {
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
/*Get notice details by notice id*/
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
            editDetails = datas;
            $.each(datas, function (k, data) {
                setTimeout(function () {
                    CKEDITOR.instances['CreateNotice'].setData(data.CreateRejoinder);
                }, 5000);
                $('#txtrejoindersub').val(data.RejoinderSubject);
                $("#ddlnoticetype").val(data.NoticeType);
                $("#hiddenid").val(data.NoticeID);
                $("#mainnoticeid").val(data.RootNoticeId);
                $('#txtsendername').val(data.SenderNameId);
                if (data.SenderNameId == "Other") {
                    $('#txtsendernameother').val(data.Senderothertxt);
                    $('#txtothersenderdiv').show();
                }
                else {
                    $('#txtothersenderdiv').hide();
                }
                $('#txtotherdetailsofsender').val(data.OtherDetailsofSender);
                $('#txtStatusOfNotice').val(data.CaseStatus);
                if (data.DateofReceipt != "1900-01-01T00:00:00") {
                    $('#txtdateofreceipt').val((data.DateofReceipt.split("T"))[0]);
                }
                else {
                    $('#txtdateofreceipt').val('');
                }
                if (data.RejoinderThrough == "null" || data.RejoinderThrough == null || data.RejoinderThrough == "") {
                }
                else {
                    var selectedOptionsmodeaaa = data.RejoinderThrough.split(",");
                    for (var i in selectedOptionsmodeaaa) {
                        var optionValmodeaa = selectedOptionsmodeaaa[i];
                        $("#txtrejoinderthrough1").find("option[value=" + optionValmodeaa + "]").prop("selected", "selected");
                    }
                    $("#txtrejoinderthrough1").multiselect('reload');
                }
                $("#txtsenderaddress").val(data.SendersAddress);
                if (data.ModeofDeliveryofRejoinder == "null" || data.ModeofDeliveryofRejoinder == null || data.ModeofDeliveryofRejoinder == "") {
                }
                else {
                    var selectedOptionsmode = data.ModeofDeliveryofRejoinder.split(",");
                    for (var i in selectedOptionsmode) {
                        var optionValmode = selectedOptionsmode[i];
                        $("#txtModeofdeliveryrejoinder").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                    }
                    $("#txtModeofdeliveryrejoinder").multiselect('reload');
                }
                $('#txtrejoindernoticeto').val(data.RejoinderAddressedto);
                $('#txtaddressto').val(data.AddresseeAddress);
                $('#txtotherdetailsofaddress').val(data.OtherDetailsofAddressee);
                $('#txtrejoindertitle').val(data.NoticeTitle);
                if (data.DueDateOfNotice != '1900-01-01T00:00:00') {
                    $('#txtduedatenotice').val((data.DueDateOfNotice.split("T"))[0]);
                }
                else {
                    $('#txtduedatenotice').val('');
                }
                //Add auto fill rejoinder 
                //CKEDITOR.instances['CreateNotice'].setData(data.CreateRejoinder);
                $("#txtDateofDelivery").val((data.DateofDelivery.split("T"))[0]);
                $("#txtcurrentstatus").val(data.CurrentStatus);
                if (data.DateofCreatingRejoinder != '1900-01-01T00:00:00') {
                    $("#txtdateofcreaterejoinder").val((data.DateofCreatingRejoinder.split("T"))[0]);
                }
                else {
                    $("#txtdateofcreaterejoinder").val('');
                }
                $("#txtCriticality").val(data.Criticality);
                if (data.Criticality == "High") {
                    $("#divhighpriorityreson").css('display', 'block');
                    $("#reasonforhighpriority").val(data.Resonforhighpriority);
                }
                $('#txtotherdetailsrespondent').val(data.OtherDetailsofSender);
                $("#txtamountclaimed").val(data.AmountClaimed);
                $("#txttag").val(data.Tag);
            });
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
                $.each(response, function (key, value) {
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
            $("#statusname").val("");
            alert(response.message);
            GetNoticeStatusRecord();
            GetNoticestatusForDropdown();
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
})
/*Delete notice custom status by id*/
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
                alert(response.message);
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
//Add new custom type contacts
$(document).on("change", "#txtsendername", function () {
    var vall = $("#txtsendername option:selected").text();
    if (vall == "Others") {
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
//hide show opterpartydetails
function myhideshowOCRNotice() {
    var x = document.getElementById("OtherOCRNotice");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
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
$(document).on('click', '#savereplynotice', function () {
    var chktype = $("#savereplynotice").attr("type");
    if (chktype == "button")
        alert("Please first save/publish new added custom field.");
});
//Save new rejoinder details
$(document).ready(function () {
    $('form[id="addrejoinder"]').validate({
        submitHandler: function (form) {
            var txtdateofreceipt = $('#txtdateofreceipt').val();
            var txtrejoinderthroughtextst = $('#txtrejoinderthrough1 option:selected').text();
            var txtrejoinderthrough = $('#txtrejoinderthrough1').val();
            var txtrejoindersub = $('#txtrejoindersub').val();
            var casestatus = $('#txtStatusOfNotice').val();
            var ddlnoticetype = $("#ddlnoticetype").val();
            var ddlrejoinder = "Yes";
            var txtdateofreceivingreply = "";
            var txtModeofdeliveryrejoinder = $('#txtModeofdeliveryrejoinder').val();
            var txtrejoindernoticeto = $('#txtrejoindernoticeto').val();
            var txtaddressto = $('#txtaddressto').val();
            var txtotherdetailsofaddress = $('#txtotherdetailsofaddress').val();
            var txtrejoindertitle = $('#txtrejoindertitle').val();
            var CreateNotice = CKEDITOR.instances.CreateNotice.getData();
            var txtDateofDelivery = $("#txtDateofDelivery").val();
            var txtcurrentstatus = $("#txtcurrentstatus").val();
            var txtdateofcreaterejoinder = $("#txtdateofcreaterejoinder").val();
            var parentId = $('#parentId').val();
            var initiatedby = $("#InitiatedById").val();
            var sendernameid = $('#txtsendername').val();
            var txtsendername = $('#txtsendername option:selected').text();
            var txtsenderothervalue = $('#txtsendernameother').val();
            var txtsenderaddress = $('#txtsenderaddress').val();
            var txtotherdetailsrespondent = $('#txtotherdetailsrespondent').val();
            var txttag = $("#txttag").val();
            var txtCriticality = $("#txtCriticality").val();
            var txtreasonforhighpriority = $("#reasonforhighpriority").val();
            var txtamountclaimed = $("#txtamountclaimed").val();
            var duedateofnoticed = $("#txtduedatenotice").val();
            var subjectName = $('#txtrejoindersub option:selected').text();
            var Ntype = localStorage.getItem("NType");
            if (sendernameid == "0") {
                alert("Please Select Sender Name");
                return false;
            }
            if (txtrejoindertitle == "") {
                alert("Please Add Title !");
                return false;
            }
            if (txtModeofdeliveryrejoinder == "") {
                //alert("Please Add Mode of Delivery of Rejoinder");
                //return false;
            }
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            var totalFiles = document.getElementById("txtrejoinderfile").files.length;
            if (totalFiles > 0) {
                formData.append("FileAvailable", EncodeText(true));
            }
            else {
                formData.append("FileAvailable", EncodeText(false));
            }
            if (initiatedby == "opponent") {
                //if (totalFiles<1) {
                //    alert("Please attached received notice file.")
                //    return false;
                //}
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
            formData.append("ddlrejoinder", EncodeText(ddlrejoinder));
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
            formData.append("txtnoticereplyreference", EncodeText(""));
            formData.append("txtotherdetailsofaddress", EncodeText(txtotherdetailsofaddress));
            formData.append("txtaddressto", EncodeText(txtaddressto));
            formData.append("txtrejoindernoticeto", EncodeText(txtrejoindernoticeto));
            formData.append("txtModeofdeliveryrejoinder", EncodeText(txtModeofdeliveryrejoinder));
            formData.append("txtdateofrejoinder", EncodeText(""));
            formData.append("txtmodeofReceipt", EncodeText(""));
            formData.append("txtdateofreceivingreply", EncodeText(txtdateofreceivingreply));
            formData.append("dateofServiceofNotice", EncodeText(""));
            formData.append("txtdateofdispatch", EncodeText(""));
            formData.append("txtdateofnotice", EncodeText(""));
            formData.append("tatdate", EncodeText(""));
            formData.append("hidden", EncodeText($("#hiddenid").val()));
            formData.append("parentId", EncodeText(parentId));
            formData.append("initiatedby", EncodeText(initiatedby));
            formData.append("rootNoticeId", EncodeText($("#mainnoticeid").val()));
            formData.append("sendernameid", EncodeText(sendernameid));
            formData.append("txtsendername", EncodeText(txtsendername));
            formData.append("txtsenderothervalue", EncodeText(txtsenderothervalue));
            formData.append("txtsenderaddress", EncodeText(txtsenderaddress));
            formData.append("txtotherdetailsrespondent", EncodeText(txtotherdetailsrespondent));
            formData.append("txttag", EncodeText(txttag));
            formData.append("txtCriticality", EncodeText(txtCriticality));
            formData.append("txtreasonforhighpriority", EncodeText(txtreasonforhighpriority));
            formData.append("txtamountclaimed", EncodeText(txtamountclaimed));
            formData.append("duedateofnoticed", EncodeText(duedateofnoticed));
            formData.append("txtSubjectName", EncodeText(subjectName));
            formData.append("Ntype", EncodeText(Ntype));
            commonFormsavevariablevalue(formData);
            openload();
            $.ajax({
                type: "POST",
                url: "/api/RejoinderNotice/AddRejoinderNotice",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    closeload();
                    alert(data.Data.message);
                    sessionStorage.removeItem("RejoinderNoticeId");
                    var firmcode = localStorage.getItem("FirmCode");
                    window.history.back();
                },
                failure: function (data) {
                    closeload();
                    alert(data.message);
                },
                error: function (data) {
                    closeload();
                    alert(data.message);
                }
            });
        }
    });
});
//Get sender details address
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
