var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month.toString().length == '1') {
        month = "0" + month;
    }
    if (day.toString().length == '1') {
        day = "0" + day;
    }
    var maxDate = year + '-' + month + '-' + day;
    $('#p_dob').attr('max', maxDate);
    $('#p_dob2').attr('max', maxDate);
    $('#DateOfBirth').attr('max', maxDate);
    openload();
    clear();
});
$("#btnprintCaseextraparty").click(function () {
    var fcode = localStorage.getItem("FirmCode");
    var urls = "/" + fcode + "/Firm/printExtraPartyInformation";
    url_redirect({
        url: urls,
        method: "post",
        data: { "token": token }
    });
});

/*Bind data*/
function binddata(pageindex, pagesize) {
    $("#tfooter").html("");
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("caseid", token);
    openload();
    var lsdata = $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/getExtraParty",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Data != "") {
                $("#dataStatus").html("");
            }
            else {
                $("#dataStatus").html("No result found !");
                closeload();
            }
            var length = response.Data.length;
            $.each(response.Data, function (i, a) {
                if (i === 0) {
                    firstvalue = a.rownum;
                }
                if (i === (length - 1)) {
                    var pnext = pageindex;
                    var pprev = pageindex;
                    var pageno = pageindex;
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (a.totRow > 0) {
                        pnext = parseInt(pnext) + 1;
                        if (pnext == 0) pnext = 1;
                        pprev = parseInt(pageno) - 1;
                        if (pprev == 0) pprev = 1;
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#pagnumvalue").attr("max", totpage);
                    }
                    var tfot = '';
                    tfot += '<ul>'
                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="lctopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="pagnumvalue" min="1" style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="getlcdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    if (a.totRow <= length) {
                    }
                    else if (pageno == 1) {
                    }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="lpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="lpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a  id="lpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                    }
                    $("#tfooter").append(tfot);
                }
                var edit = '<a data-toggle="tab" href="#" class="btn-sm btn-success EditAction" data-id="' + a.Id + '" data-name="' + a.Name + '" data-fname="' + a.GuardianName + '" data-address="' + a.Address + '" data-adhar="' + a.AadharNo + '" data-sex="' + a.Gender + '" data-dob="' + a.DOB + '" data-nationality="' + a.Nationality + '" data-mobile="' + a.MobileNo + '" data-email="' + a.Email + '"  ><i class="fa fa-pencil-square-o"></i></a>';
                var action = '<a data-toggle="tab" href="#" style="margin-left:5px;" class="btn-sm btn-danger RemoveAction" data-id="' + a.Id + '"><i class="fa fa-trash-o"></i></a>';
                html3 += '<tr>'
                html3 += '<td class="lCasename">'
                html3 += '<span id="clname">' + a.Name + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCaseNo">'
                html3 += '<span id="clname">' + a.GuardianName + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCNRno">'
                html3 += '<span id="clname">' + a.Address + '</span>'
                html3 += '</td>'
                html3 += '<td class="lAlertdate">'
                html3 += '<span id="clname">' + a.AadharNo + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCourt">'
                html3 += '<span id="clname" >' + a.Gender + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCasetype">'
                html3 += '<span id="clname" >' + formatDatetoIST(a.DOB) + '</span>'
                html3 += '</td>'
                html3 += '<td class="lialert">'
                html3 += '<span id="clname" >' + a.Nationality + '</span>'
                html3 += '</td>'
                html3 += '<td class="laction">'
                html3 += '<span id="clname" >' + a.MobileNo + '</span>'
                html3 += '</td>'
                html3 += '<td class="lStatus">'
                html3 += '<span id="clname" >' + a.Email + '</span>'
                html3 += '</td>'
                html3 += '<td >'
                html3 += '<span id="clname">' + edit + action + '</span>'
                html3 += '</td>'
                html3 += '</tr>'
            });
            $("#tbody_data").html("");
            $("#tbody_data").append(html3);
            closeload();
        },
        failure: function (data) {
            console.log(data.responseText);
            closeload();
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

/*Validate email address*/
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}

/*Save data*/
$("#btnSave").click(function () {
    if ($("#PartyName").val() == "") {
        alert("Enter Name of Extra Party ");
        $("#PartyName").focus();
        return false;
    }
    if ($("#FatherName").val() == "") {
        alert("Enter S/o, W/o,D/o ");
        $("#FatherName").focus();
        return false;
    }
    if ($("#Address").val() == "") {
        alert("Enter Address");
        $("#Address").focus();
        return false;
    }
    var adharno = $("#AdharCardNo").val();
    if (adharno != "") {
        if (adharno.length < 12) {
            alert("ADHAR CARD NO should be 12 digit");
            $("#AdharCardNo").focus();
            return false;
        }
    }
    if ($("#Gender").val() == "") {
        alert("Select Gender");
        $("#Gender").focus();
        return false;
    }
    if ($("#DateOfBirth").val() == "") {
        alert("select Date of Birth/Age");
        $("#DateOfBirth").focus();
        return false;
    }
    var mobileno = $("#MobileNo").val();
    if ($("#MobileNo").val() == "") {
        alert("Select Mobile No");
        $("#MobileNo").focus();
        return false;
    }
    if (mobileno != "") {
        if (mobileno.length < 10) {
            alert("MOBILE NO should be 10 digit");
            $("#MobileNo").focus();
            return false;
        }
    }
    if ($("#Email").val() == "") {
        alert("Enter Email");
        $("#Email").focus();
        return false;
    }
    if ($("#Email").val() != "") {
        if (isValidEmailAddress($("#Email").val())) {
        }
        else {
            alert("Enter valid email");
            $("#Email").focus();
            return false;
        }
    }
    var formData = new FormData();
    formData.append("PartyName", $("#PartyName").val());
    formData.append("FatherName", $("#FatherName").val());
    formData.append("Address", $("#Address").val());
    formData.append("AdharCardNo", $("#AdharCardNo").val());
    formData.append("Gender", $("#Gender").val());
    formData.append("DateOfBirth", $("#DateOfBirth").val());
    formData.append("Nationality", $("#Nationality").val());
    formData.append("MobileNo", $("#MobileNo").val());
    formData.append("Email", $("#Email").val());
    formData.append("caseid", token);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/PostExtraParty",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                alert("Successfully saved");
                clear();
                binddata(pageindex, pagesize);
            }
            else {
                alert("Oops! Something went wrong..");
            }
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
});

/*Clear extra patry details*/
function clear() {
    $("#hdnid").val('');
    $("#PartyName").val('');
    $("#FatherName").val('');
    $("#Address").val('');
    $("#AdharCardNo").val('');
    $("#DateOfBirth").val('');
    $("#MobileNo").val('');
    $("#Email").val('');
    $("#btnSave").show();
    $("#btnUpdate").hide();
    $("#btnCancel").hide();
    $("#Gender").prop("selectedIndex", 0);
    binddata(pageindex, pagesize);
}

/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}

/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}

/*Edit action*/
$(document).on('click', '.EditAction', function () {
    var id = $(this).data("id");
    $("#hdnid").val(id);
    $("#PartyName").val($(this).data("name"));
    $("#FatherName").val($(this).data("fname"));
    $("#Address").val($(this).data("address"));
    $("#AdharCardNo").val($(this).data("adhar"));
    $("#Gender").val($(this).data("sex"));
    $("#DateOfBirth").val($(this).data("dob"));
    $("#Nationality").val($(this).data("nationality"));
    $("#MobileNo").val($(this).data("mobile"));
    $("#Email").val($(this).data("email"));
    $("#btnSave").hide();
    $("#btnUpdate").show();
    $("#btnCancel").show();
});
$("#btnCancel").click(function () {
    clear();
});

/*Update extra party name*/
$("#btnUpdate").click(function () {
    if ($("#PartyName").val() == "") {
        alert("Enter Name of Extra Party ");
        $("#PartyName").focus();
        return false;
    }
    if ($("#FatherName").val() == "") {
        alert("Enter S/o, W/o,D/o ");
        $("#FatherName").focus();
        return false;
    }
    if ($("#Address").val() == "") {
        alert("Enter Address");
        $("#Address").focus();
        return false;
    }
    var adharno = $("#AdharCardNo").val();
    if (adharno != "") {
        if (adharno.length < 12) {
            alert("ADHAR CARD NO should be 12 digit");
            $("#AdharCardNo").focus();
            return false;
        }
    }
    if ($("#Gender").val() == "") {
        alert("Select Gender");
        $("#Gender").focus();
        return false;
    }
    if ($("#DateOfBirth").val() == "") {
        alert("select Date of Birth/Age");
        $("#DateOfBirth").focus();
        return false;
    }
    var mobileno = $("#MobileNo").val();
    if (mobileno != "") {
        if (mobileno.length < 10) {
            alert("MOBILE NO should be 10 digit");
            $("#MobileNo").focus();
            return false;
        }
    }
    if ($("#Email").val() != "") {
        if (isValidEmailAddress($("#Email").val())) {
        }
        else {
            alert("Enter valid email");
            $("#Email").focus();
            return false;
        }
    }
    var formData = new FormData();
    formData.append("Id", $("#hdnid").val());
    formData.append("PartyName", $("#PartyName").val());
    formData.append("FatherName", $("#FatherName").val());
    formData.append("Address", $("#Address").val());
    formData.append("AdharCardNo", $("#AdharCardNo").val());
    formData.append("Gender", $("#Gender").val());
    formData.append("DateOfBirth", $("#DateOfBirth").val());
    formData.append("Nationality", $("#Nationality").val());
    formData.append("MobileNo", $("#MobileNo").val());
    formData.append("Email", $("#Email").val());
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/UpdateExtraParty",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                alert("Successfully Updated");
                clear();
            }
            else {
                alert("Oops! Something went wrong..");
            }
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
});

/*Delete extra party name*/
$(document).on('click', '.RemoveAction', function () {
    // your function here
    var Id = $(this).data("id");
    var formData = new FormData();
    formData.append("Id", Id);
    var r = confirm("Are you Sure to Delete?");
    if (r == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExtraParty/DeleteExtraParty",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    alert("Successfully Removed");
                    clear();
                }
                else {
                    alert("Oops! Something went wrong..");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
});