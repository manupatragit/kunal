var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
var editDetails;
var companycountdata = 0;
var editcountdata = 0;
var countdata = 0;
$(document).ready(function () {
    $("#dynamicnotiheader").html("Create Notice");
    /*Get notice subject data for bind dropdown*/
    GetNoticeSubjectForDropdown();
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
        $('#txtduedatenotice').attr('min', maxDate);
    });
    try {
        var today = new Date().toISOString().split('T')[0];
        $("#txtdateofnotice").val(today);
        //For Add Drft Notice
        CKEDITOR.instances['CreateNotice'].setData(today + '</br> To,');
    }
    catch (er) {
    }
    var noticeId = sessionStorage.getItem("NoticeId");
    if (noticeId != "" && noticeId != null && noticeId != undefined) {
        $("#dynamicnotiheader").html("Edit Notice");
        $("#txtsendername").prop('disabled', true);
        $("#txtsendernameother").prop('disabled', true);
        fnGetNoticeById(noticeId);
        //document.getElementById("Reset").style.display = "none";


        $("#resetcf").hide();
    }
    else {
        //document.getElementById("Reset").style.display = "flex";

        $("#resetcf").show();
    }
    GetContactForDropdown();
    GetNoticestatusForDropdown();
    //default section of status
    /*bind multi select*/
    jQuery('#txtmodeofservice').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
    jQuery('#txtnoticethrough1').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });

    var addrestovalur = "";
    var txtaddress = "";
    var txtnoticesub = "";
    var txtnotice = "";
    var Refernceno = "";
    var txtsendername = "";
    var txtsenderaddress = "";
    var txtdateofnotice = "";

    //fill value auto populated
    $("#txtaddressto").change(function () {
        addrestovalur = $(this).val();
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + addrestovalur + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    $("#txtaddressee").change(function () {
        txtaddress = $(this).val();
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + txtaddress + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    /*Bind data on change notice cubject*/
    $("#txtnoticesub").change(function () {
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    /*Bind data on change notice text*/
    $("#txtnotice").change(function () {
        txtnotice = $(this).val();
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + txtnotice + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    /*Bind data on change reference number*/
    $("#Refernceno").change(function () {
        Refernceno = $(this).val();
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    $("#Refernceno").change(function () {
        Refernceno = $(this).val();
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    $('#txtsendernameother').change(function () {
        Refernceno = $(this).val();
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    })
    $('#txtsendername').on('change', function () {
        txtsendername = $("#txtsendername option:selected").text();
        if (txtsendername == 'Others') {
            txtsendername = "";
            $('#txtsendernameother').val("");
        }
        else {
            txtsendername = txtsendername;
        }
        txtnoticesub = $("#txtnoticesub option:selected").text();
        if (txtnoticesub == 'Please Select') {
            txtnoticesub = '';
        }
        else {
            txtnoticesub = txtnoticesub;
        }
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.: ' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
    /*Get data on change sender address*/
    $('#txtsenderaddress').on('change', function () {
        txtsenderaddress = $(this).val();
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        CKEDITOR.instances['CreateNotice'].setData(today + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + txtsenderaddress);
    });
    $('#txtdateofnotice').on('change', function () {
        txtnoticesub = $("#txtnoticesub option:selected").text();
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
        txtdateofnotice = $(this).val();
        CKEDITOR.instances['CreateNotice'].setData(txtdateofnotice + '</br></br> To,' + '</br>' + $("#txtaddressto").val() + '</br>' + $("#txtaddressee").val() + '</br></br></br>Sub: ' + txtnoticesub + '</br>Title: ' + $("#txtnotice").val() + '</br></br>Reference No.:' + $("#Refernceno").val() + '</br></br></br></br>' + txtsendername + '</br>' + $('#txtsenderaddress').val());
    });
});
/*High priority reason*/
function fnhighpriorityreason() {
    var txtCriticality = $("#txtCriticality").val();
    if (txtCriticality == "High") {
        $("#divhighpriorityreson").css('display', 'block');
    }
    else {
        $("#divhighpriorityreson").css('display', 'none');
    }
}
/*Get contact details form dropdown*/
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
/*Bind notice subject dropdown*/
function GetNoticeSubjectForDropdown() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeSubjectList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#txtnoticesub").html("");
            $("#txtnoticesub").append($("<option></option>").val("").text('Please Select'));
            $("#txtnoticesub").append($("<option style='font-weight:bold;color:#069;'></option>").val("").text('Add new subject'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#txtnoticesub").append($("<option></option>").val(value.Id).text(value.Name));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

$(document).on('change', '#txtnoticesub', function () {
    var vall = $("#txtnoticesub option:selected").text();
    if (vall == "Add new subject") {
        $("#myModalnoticesubjectname").modal('show');
        GetNoticeSubjectRecord();
    }
});
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
$("#custcocountry").change(function () {
    var countryid = $(this).val();
    GetstatebybyId(countryid, "custmstate")
});
$("#custmstate").change(function () {
    var stateid = $(this).val();
    GetcitybybyStateId(stateid, "custcity")
});

//bind custom state dropdown 
function GetstatebybyId(contryid, controlname) {
    var selecttext = "Please select";
    var html1 = '<option value="">' + selecttext + '</option>';
    $("#" + controlname).empty();
    $("#" + controlname).append(html1);
    var formData = new FormData();
    formData.append('countryId', EncodeText(contryid))
    $.ajax({
        type: "POST",
        url: "/api/Home/BindStateDropdown",
        dataType: 'json',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#" + controlname).append($("<option></option>").val(value.StateId).text(value.StateName));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

//bind custom city dropdown 
function GetcitybybyStateId(stateid, controlnames) {
    $("#" + controlnames).empty();
    var formData = new FormData();
    formData.append('stateid', EncodeText(stateid))
    $.ajax({
        type: "POST",
        url: "/api/Home/BindCityDropdown",
        dataType: 'json',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#" + controlnames).append($("<option></option>").val(value.CityId).text(value.CityName));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Get notice subject details*/
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
                        html += '<td><a style="cursor:pointer;" onclick=DeleteSubjectRecordt("' + value.Id + '") title = "Delete Subject"><img src="/newassets/img/deletecasesingle-icon.png" /></a></td>'
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
/*Save notice subject details*/
$(document).on("click", "#btnSubject", function () {
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

/*Delete notice subject*/
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
        success: function (data) {
            var obj = JSON.parse(data.Data);
            editDetails = obj;
            $.each(obj, function (k, val) {
                $("#txtStatusOfNotice").val(val.CaseStatus);
                $("#txtCriticality").val(val.Criticality);
                if (val.Criticality == "High") {
                    $("#divhighpriorityreson").css('display', 'block');
                    $("#reasonforhighpriority").val(val.Resonforhighpriority);
                }
                $("#txtamountclaimed").val(val.AmountClaimed);
                $("#ddlnoticetype").val(val.NoticeType);
                if (val.GenerationofAlerts == "1900-01-01T00:00:00") {
                    $('#txtdate').val("");
                }
                else {
                    $('#txtdate').val((val.GenerationofAlerts.split("T"))[0]);
                }
                if (val.DateofNotice != null) {
                    if (val.DateofNotice == "1900-01-01T00:00:00") {
                        $('#txtdateofnotice').val("");
                    }
                    else {
                        $('#txtdateofnotice').val((val.DateofNotice.split("T"))[0]);
                    }
                }
                if (val.DueDateOfNotice != null) {
                    if (val.DueDateOfNotice == "1900-01-01T00:00:00") {
                        $('#txtduedatenotice').val("");
                    }
                    else {
                        $('#txtduedatenotice').val((val.DueDateOfNotice.split("T"))[0]);
                    }
                }
                //bind mode of delevery
                if (val.Modeofservicedeliverylist == "null" || val.Modeofservicedeliverylist == null || val.Modeofservicedeliverylist == "") {
                }
                else {
                    var selectedOptionsmode = val.Modeofservicedeliverylist.split(",");
                    for (var i in selectedOptionsmode) {
                        var optionValmode = selectedOptionsmode[i].trim();
                        $("#txtmodeofservice").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                    }
                }
                $("#txtmodeofservice").multiselect('reload');
                $('#txtaddressee').val(val.AddresseeAddress);
                $('#txtaddressto').val(val.AddressedTo);
                $('#txtsenderaddress').val(val.SendersAddress);
                $('#txtotherdetailsofaddress').val(val.OtherDetailsofAddressee);
                $('#txtsendername').val(val.SenderNameId);
                if (val.SenderNameId == "Other") {
                    $('#txtsendernameother').val(val.Senderothertxt);
                    $('#txtothersenderdiv').show();
                }
                else {
                    $('#txtothersenderdiv').hide();
                }
                $('#txtotherdetailsofsender').val(val.OtherDetailsofSender);
                $('#txtnoticesub').val(val.NoticeSubject);
                $("#txtnotice").val(val.NoticeTitle);
                setTimeout(function () {
                    CKEDITOR.instances['CreateNotice'].setData(val.CreateNotice);
                }, 10000);
                if (val.NoticeThrough == "null" || val.NoticeThrough == null || val.NoticeThrough == "") {
                }
                else {
                    var selectedOptions = val.NoticeThrough.split(",");
                    for (var i in selectedOptions) {
                        var optionVal = selectedOptions[i];
                        $("#txtnoticethrough1").find("option[value=" + optionVal + "]").prop("selected", "selected");
                    }
                }
                $("#txtnoticethrough1").multiselect('reload');
                $('#txtdateofreceipt').val((val.DateofReceipt.split("T"))[0]);
                if (val.DateofDelivery != null) {
                    $("#dateofddel").val((val.DateofDelivery.split("T"))[0]);
                } else {
                    $("#dateofddel").val("");
                }
                $("#currentstatus").val(val.CurrentStatus);
                $("#hiddenid").val(val.NoticeID);
                $("#txttag").val(val.Tag);
                $("#textsonof").val(val.SonOf);
                $("#Refernceno").val(val.NoticeReference);
                $("#IntRefernceno").val(val.IntNoticeReference);
                if (k >= 1) {
                    editcountdata += 1;
                    var data = "";
                    data += "<fieldset style='border:none !important;'>";
                    data += "<div class='row'>";
                    data += "<div class='form-group col-md-4'>";
                    data += "</div>";
                    data += "<div class='form-group col-md-4'>";
                    data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Receiver's Email </span></label>";
                    data += " <div class='col-md-12'>";
                    data += "<input autofocus='' class='form-control receiversemail inputFormat' type='text' value='" + val.ReceiverEmails + "'  name='receiverssemail' id='receiverssemail' autocomplete='new-text' />";
                    data += "</div> ";
                    data += "</div>";
                    data += "<div class='form-group col-md-4'>";
                    data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Receiver's Phone No</span></label>";
                    data += "<div class='col-md-12'>";
                    data += " <input autofocus='' class='form-control receiversmobi inputFormat' type='text' value='" + val.ReceiverPhone + "' name='receiverssmobile' id='receiverssmobile' onkeypress='return isNumberKey(event)' maxlength='10' autocomplete='new-text'/>";
                    data += "</div>";
                    data += "</div>";
                    data += "</div>";
                    data += "<div class='row'>";
                    data += "<div class='form-group col-md-4'>";
                    data += "</div>";
                    data += "<div class='form-group col-md-4'>";
                    data += " <label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Second Address </span></label>";
                    data += " <div class='col-md-12'>";
                    data += "<input autofocus='' class='form-control receiverssecondad inputFormat' type='text' value='" + val.SecondAddress + "'  name='receiverssecondad' id='receiverssecondad' autocomplete='new-text' style='width:90%;float:left;' />";
                    data += " </div> ";
                    data += "</div>";
                    data += "</div>";
                    data += " </fieldset>";
                    $('#dvadd_receiverotherdetils').append(data);
                    $("#rowcounterdata").val('');
                    $("#rowcounterdata").val(editcountdata);
                }
                else {
                    $("#receiverssemail").val(val.ReceiverEmails);
                    $("#receiverssmobile").val(val.ReceiverPhone);
                    $("#receiverssecondad").val(val.SecondAddress);
                    $("#OtherOCRNotice").show();
                }
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
            $("#txtStatusOfNotice").append($("<option style='font-weight:bold;color:#069;'></option>").val("").text('Add new status'));
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
/*Get notice status*/
$(document).on('change', '#txtStatusOfNotice', function () {
    var vall = $("#txtStatusOfNotice option:selected").text();
    if (vall == "Add new status") {
        $("#myModalnoticestatus").modal('show');
        GetNoticeStatusRecord();
    }
});
/*Get notice status details*/
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
/*Save custom notice status*/
$(document).on("click", "#btnStatussubmit", function () {
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

/*Delete custom notice status*/
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
//Add other Receivers detils
//Add dynamic fields for companyllp/llc
$(document).on("click", "#btn_addreceiverdetails", function () {
    if (companycountdata < 15) {
        companycountdata += 1;
        var data = "";
        //data += "<fieldset style='border:none !important;'>";
        data += "<div class='row' id='DeleteReciverArea'>";
        data += "<div class='col-md-4'>";
        data += "</div> ";
        data += "<div class='col-md-8'>";
        data += "<div class='form-group col-md-6'>";
        data += "<label>Receiver's Email</label>";
        //data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control receiversemail inputFormat' type='text' value=''  name='receiverssemail' id='receiverssemail' autocomplete='new-text' />";
        //data += "</div> ";
        data += "</div>";
        data += "<div class='form-group col-md-6'>";
        data += "<label>Receiver's Phone No</label>";
        //data += "<div class='col-md-12'>";
        data += " <input autofocus='' class='form-control receiversmobi inputFormat' type='text' value='' name='receiverssmobile' id='receiverssmobile' onkeypress='return isNumberKey(event)' maxlength='10' autocomplete='new-text'/>";
        //data += "</div>";
        data += "</div>";
        
        
        data += "<div class='form-group col-md-6'>";
        data += " <label>Second Address</label>";
        //data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control receiverssecondad inputFormat' type='text' value=''  name='receiverssecondad' id='receiverssecondad' autocomplete='new-text' style='width:100%;float:left;' />";
        //data += " </div> ";
        data += "</div>";
        data += "<div class='form-group col-md-6'><div onclick='delete_div($(this))' class='delete_div'><span style='cursor: pointer;margin: 32px 0 0 0;display:block;' title='Delete'><img src='/newassets/img/deletematter.png' /></span></div></div>"
        data += "</div>";
        
        data += "</div>";
        data += "</div>";
        
        //data += " </fieldset>";
        $('#dvadd_receiverotherdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(companycountdata);
    }
    else {
        alert("You Can't add more than 15 Member");
    }
});

//delete custom fields
function delete_div(data) {

    countdata = countdata - 1;
    companycountdata = companycountdata - 1;
    $("#rowcounterdata").val('');
    $("#rowcounterdata").val(companycountdata);
    document.getElementById('DeleteReciverArea').remove();
    //data.parents('fieldset').remove();
}
$(document).on('click', '#savenoticebtn', function () {
    var chktype = $("#savenoticebtn").attr("type");
    if (chktype == "button")
        alert("Please first save/publish new added custom field.");
    submitNotice();
});
function submitNotice() {
    /*Add/Update notice details*/
    //$('form[id="noticeform"]').validate({
    //    submitHandler: function (form) {
            var casestatus = $("#txtStatusOfNotice").val();
            var ddlnoticetype = $("#ddlnoticetype").val();
            var tatdate = "";
            var EmailArray = "";
            var PhoneArray = "";
            var SecondAddressArray = "";
            var txtdateofnotice = $('#txtdateofnotice').val();
            var txtmodeofservice = $('#txtmodeofservice').val();
            var txtaddressee = $('#txtaddressee').val();
            var txtaddressto = $('#txtaddressto').val();
            var txtsenderaddress = $('#txtsenderaddress').val();
            var txtotherdetailsofaddress = $('#txtotherdetailsofaddress').val();
            var sendernameid = $('#txtsendername').val();
            var txtsendername = $('#txtsendername option:selected').text();
            var txtsenderothervalue = $('#txtsendernameother').val();
            var txtotherdetailsofsender = $('#txtotherdetailsofsender').val();
            var txtnoticesub = $('#txtnoticesub').val();
            var noticetitle = $("#txtnotice").val();
            var CreateNotice = CKEDITOR.instances.CreateNotice.getData();
            var txtdateofreceipt = $('#txtdateofreceipt').val();
            var dateofddel = $("#dateofddel").val();
            var curstatus = $("#currentstatus").val();
            var NoticeCreateddate = $("#NoticeCreateddate").val();
            var txtCriticality = $("#txtCriticality").val();
            var txtamountclaimed = $("#txtamountclaimed").val();
            var textsonof = "";
            var textroof = "";
            var txttag = $("#txttag").val();
            var txtreasonforhighpriority = $("#reasonforhighpriority").val();
            var txtnoticethroughId = $("#txtnoticethrough1").val();
            var txtnoticesubId = $("#txtnoticesub option:selected").attr("data-id");
            var duedateofnoticed = $("#txtduedatenotice").val();
            //add multiple custom fields
    var Receiverrowcountdata = $("#rowcounterdata").val();

    var subjectName = $("#txtnoticesub option:selected").text();
    if (subjectName == 'Please Select') {
        subjectName = "";
    }
            //Email Array
            $.each($('.receiversemail'), function (i, a) {
                EmailArray += $(a).val() + ',';
            });
            //Mobile Array
            $.each($('.receiversmobi'), function (i, a) {
                PhoneArray += $(a).val() + ',';
            });
            //LastName Array
            $.each($('.receiverssecondad'), function (i, a) {
                SecondAddressArray += $(a).val() + ',';
            });
            // Add two New colomn 
            var Refernceno = $("#Refernceno").val();
            var IntRefernceno = $("#IntRefernceno").val();
            if (txtsendername == "Please Select") {
                alert("Please Add Sender's Name");
                return false;
            }
            if (txtsendername == 'Others') {
                if (txtsenderothervalue == "") {
                    alert("Please enter others name");
                    return false;
                }
            }
            else {
                txtsenderothervalue = "";
            }
            if (txtaddressto == "") {
                alert("Please enter Receiver's name");
                return false;
            }
            if (CreateNotice == "") {
                alert("Please Add Notice Text");
                return false;
            }
            if (noticetitle == "") {
                alert("Please Add title");
                return false;
            }
            if (txtdateofnotice == "") {
                alert("Please Select Date of Notice");
                return false;
            }
            if (txtdateofnotice == "") {
                alert("Please Select Date of Notice");
                return false;
            }
            else if (txtCriticality == "High") {
                if (txtreasonforhighpriority == "") {
                    alert("Please Add Reason For High Priority.");
                    return false;
                }
            }
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            var totalFiles = document.getElementById("postedFile").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("postedFile").files[i];
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
            formData.append("casestatus", EncodeText(casestatus));
            formData.append("ddlnoticetype", EncodeText(ddlnoticetype));
            formData.append("tatdate", EncodeText(tatdate));
            formData.append("txtdateofnotice", EncodeText(txtdateofnotice));
            formData.append("txtmodeofservice", EncodeText(txtmodeofservice));
            formData.append("txtaddressee", EncodeText(txtaddressee));
            formData.append("txtaddressto", EncodeText(txtaddressto));
            formData.append("txtsenderaddress", EncodeText(txtsenderaddress));
            formData.append("txtnoticethrough", EncodeText(txtnoticethroughId));
            formData.append("txtdateofreceipt", EncodeText(txtdateofreceipt));
            formData.append("txtotherdetailsofaddress", EncodeText(txtotherdetailsofaddress));
            formData.append("txtotherdetailsofsender", EncodeText(txtotherdetailsofsender));
            formData.append("dateofddel", EncodeText(dateofddel));
            formData.append("curstatus", EncodeText(curstatus));
            formData.append("txtnoticesub", EncodeText(txtnoticesub));
            formData.append("noticetitle", EncodeText(noticetitle));
            formData.append("CreateNotice", EncodeText(CreateNotice));
            formData.append("txtsendername", EncodeText(txtsendername));
            formData.append("NoticeCreateddate", EncodeText(NoticeCreateddate));
            formData.append("hidden", EncodeText($("#hiddenid").val()));
            formData.append("txtCriticality", EncodeText(txtCriticality));
            formData.append("txtamountclaimed", EncodeText(txtamountclaimed));
            formData.append("textsonof", EncodeText(textsonof));
            formData.append("textroof", EncodeText(textroof));
            formData.append("txttag", EncodeText(txttag));
            formData.append("txtreasonforhighpriority", EncodeText(txtreasonforhighpriority));
            formData.append("NoticeThroughId", EncodeText(txtnoticethroughId));
            formData.append("SubectId", EncodeText(txtnoticesubId));
            formData.append("Duedateofnotice", EncodeText(duedateofnoticed));
            formData.append("txtsenderothervalue", EncodeText(txtsenderothervalue));
            formData.append("sendernameId", EncodeText(sendernameid));
            formData.append("Receiveremailsarray", EncodeText(EmailArray));
            formData.append("Receiverphonesarray", EncodeText(PhoneArray));
            formData.append("SecondAddressarray", EncodeText(SecondAddressArray));
            formData.append("Receiverrowcountdata", EncodeText(Receiverrowcountdata));
            formData.append("Referncenumber", EncodeText(Refernceno));
    formData.append("IntReferncenuber", EncodeText(IntRefernceno));
    formData.append("ddlsubjectName", subjectName);
            commonFormsavevariablevalue(formData);
            var headerval2 = formData.get("headerval");
            var headervalues = JSON.parse(headerval2);
            openload();
            $.ajax({
                type: "POST",
                url: "/api/NoticeNew/AddNotice",
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
                        $("#postedFile").val("");
                        alert(data.Data.message);
                        sessionStorage.removeItem("NoticeId");
                        var firmcode = localStorage.getItem("FirmCode");
                        window.location.href = "/" + firmcode + "/NoticeNew/NewNoticeList"
                    }
                },
                failure: function (data) {
                    alert(data.message);
                },
                error: function (data) {
                    alert(data.message);
                }
            });
    //    }
    //});
}

//Add custom type subject
$(document).on("click", "#btnContactypeSubject", function () {
    //start adding new field requiremnts
    var Fname = "";
    var MiddlaeName = "";
    var LASTNAME = "";
    var MOBILENO = "";
    var EMAILs = "";
    var LANDLINE = "";
    var SOnDOf = "";
    var ADDRESS = "";
    var PIN = "";
    var COUNTRY = "";
    var STATE = "";
    var CITY = "";
    var AADHAR = "";
    var PANNO = "";
    var GSTINNO = "";
    var WEBSITE = "";
    var ADDITIONALINFO = "";
    var Organizationname = "";
    var firstnamearray = "";
    var MiddlaeNamearray = "";
    var LastNamearray = "";
    var MobileNoarray = "";
    var EmailArray = "";
    var AadharArray = "";
    var PanArray = "";
    var loginidArray = "";
    var formData = new FormData();
    var contactype = $('#ccustcontacttype').val();
    Fname = $("#cusfname").val();
    MiddlaeName = "";
    LASTNAME = $("#cuslname").val();
    MOBILENO = $("#cusmobileno").val();
    EMAILs = $("#cusemailid").val();
    LANDLINE = "";
    SOnDOf = "";
    ADDRESS = "";
    PIN = $("#cuspinno").val();
    COUNTRY = $("#custcocountry option:selected").text();
    STATE = $("#custmstate option:selected").text();
    CITY = $("#custcity option:selected").text();
    AADHAR = "";
    PANNO = "";
    GSTINNO = "";
    WEBSITE = "";
    ADDITIONALINFO = "";
    if (contactype == "") {
        alert("Contact type can't be empty.")
        return false;
    }
    if (Fname == "") {
        alert("First name can't be empty.")
        return false;
    }
    if (LASTNAME == "") {
        alert("Last name can't be empty.")
        return false;
    }
    if (MOBILENO == "") {
        alert("Mobile number can't be empty.")
        return false;
    }
    else if (MOBILENO.length < 10) {
        alert("Mobile Phone should be 10 digit.");
        return false;
    }
    if (EMAILs != "") {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(EMAILs)) {
            alert("Please provide a valid email address");
            return false;
        }
    } else {
        alert("Please enter Email Id");
    }
    // DOCUMENTS = "";
    var couserid = "";
    var cocpassword = "";
    var contcatflag1 = 0;
    if (PIN != "") {
        if (PIN.length < 6) {
            alert("Pin should be 6 digit. ")
            return false;
        }
    }
    formData.append("istypes", EncodeText(contactype));
    formData.append("gstinno", EncodeText(GSTINNO));
    formData.append("panno", EncodeText(PANNO));
    formData.append("cofname", EncodeText(Fname));
    formData.append("comname", EncodeText(MiddlaeName));
    formData.append("colname", EncodeText(LASTNAME));
    formData.append("cocomanyname", EncodeText(Organizationname));
    formData.append("comobile", EncodeText(MOBILENO));
    formData.append("coemail", EncodeText(EMAILs));
    formData.append("colandline", EncodeText(LANDLINE));
    formData.append("coaddress", EncodeText(ADDRESS));
    formData.append("copin", EncodeText(PIN));
    formData.append("cocountry", EncodeText(COUNTRY));
    formData.append("costate", EncodeText(STATE));
    formData.append("cocity", EncodeText(CITY));
    formData.append("cowebsite", EncodeText(WEBSITE));
    formData.append("couserid", EncodeText(couserid));
    formData.append("cocpassword", EncodeText(cocpassword));
    formData.append("contcatflag", EncodeText(contcatflag1));
    formData.append("coaadharno", EncodeText(AADHAR));
    formData.append("hiddenId", EncodeText(""));
    formData.append("Addinfo", EncodeText(ADDITIONALINFO));
    formData.append("SonofDof", EncodeText(SOnDOf));
    formData.append("Fnamearray", EncodeText(Fname));
    formData.append("Mnamearray", EncodeText(MiddlaeName));
    formData.append("Lnameaaray", EncodeText(LASTNAME));
    formData.append("MobileNoarray", EncodeText(MOBILENO));
    formData.append("emailarray", EncodeText(EMAILs));
    formData.append("aadhararray", EncodeText(AadharArray));
    formData.append("panarray", EncodeText(PanArray));
    formData.append("loginidarray", EncodeText(loginidArray));
    formData.append("hiddenrgnizationtypeId", EncodeText(""));
    formData.append("Iscustomcontact", EncodeText("1"));
    $.ajax({
        type: "POST",
        url: "/api/Home/SaveClientData",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            $('#contacttypereset')[0].reset();
            alert(data.message);
            if (data.status) {
                GetCustomContactsType();
            }
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
})
//delete custom point
function DeleteClient(Id) {
    if (confirm("Alert ! are you sure")) {
        var formdata = new FormData();
        formdata.append("ClientId", EncodeText(Id));
        $.ajax({
            type: "POST",
            url: "/api/Home/InactiveClient",
            dataType: 'json',
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                alert(response.message);
                GetCustomContactsType();
            },
            error: function (response) {
                alert(response.message);
                GetCustomContactsType();
            }
        })
    }
}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
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
function resetForm() {
    clearpostedFileUpload();
    window.location.reload();
}

let selectedpostedFile = [];
$(document).on('change', '#postedFile', function (e) {
    selectedpostedFile = [];
    var fileCount = this.files.length;
    if (fileCount > 0) {
        $("#dropContainer").attr("title", "Document Attached");
    }
    else {
        $("#dropContainer").attr("title", "upload Attachment");
    }

    const files = Array.from(e.target.files);
    selectedpostedFile = [...selectedpostedFile, ...files];
    displaypostedFile();
});

$(document).on('click', '.remove-file-postedFile', function () {
    const index = $(this).data('index');
    selectedpostedFile.splice(index, 1);
    displaypostedFile();
});

function displaypostedFile() {
    const fileList = $('#fileListTMApplication');
    fileList.empty();
    const fCount = selectedpostedFile.length;
    selectedpostedFile.slice(0, 5).forEach((file, index) => {
        const fileItem = $(`
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="remove-file-postedFile" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
        fileList.append(fileItem);
    });
    if (fCount > 5) {
        const remaining = fCount - 5;
        fileList.append(`
            <div class="file-summary" style="margin-top:5px;color:#555;">
                +${remaining} more (Total ${fCount} files selected)
            </div>
        `);
    }
    updatepostedFileInput();
}

function updatepostedFileInput() {
    const dt = new DataTransfer();
    selectedpostedFile.forEach(file => dt.items.add(file));
    document.getElementById('postedFile').files = dt.files;
}

function clearpostedFileUpload() {
    selectedpostedFile = [];
    const fileInput = document.getElementById("postedFile");
    if (fileInput) fileInput.value = "";
    $('#fileListTMApplication').empty();
    $("#dropContainer").attr("title", "Upload Attachment");
}