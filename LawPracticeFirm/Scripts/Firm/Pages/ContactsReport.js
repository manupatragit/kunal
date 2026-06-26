/**Load contact type */
function loadContacttype() {
    try {
        $("#rptclienttype").empty();
        $("#rptclienttype").removeAttr("disabled");
    }
    catch (er) {
    }
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CallApi/BindContactsType",
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
            $.each(obj, function (i, a) {
                var option = '<option value="' + a["Id"] + '" >' + a["ProfileType"] + '</option>';
                if (a["ProfileType"] == "Others") {
                    //$("#commoncontacttype,#coctype").append(option);
                }
                else {
                    if (a["Id"] != "f898340d-5a87-47f5-a82b-e34f03c6ae3b" && a["Id"] != "c5ad313d-60c5-4897-98fd-751d34f38424"
                        && a["Id"] != "c5ad313d-60c5-4897-98fd-751d34f38424" && a["Id"] != "fd7ab522-9c37-4456-a256-f19b3745fa7a") {
                        $("#rptclienttype").append(option);
                        if (a["ProfileType"] != "Client") {
                            var option3 = '<option value="' + a["Id"] + '" >' + a["ProfileType"] + '</option>';
                            $("#ecoctype").append(option3);
                        }
                        if (a["ProfileType"] == "Client") {
                            $('#rptclienttype option[value="' + a["Id"] + '"]').attr("selected", true);
                        }
                    }
                }
            });
            //End of foreach Loop
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        } //End of AJAX error function
    });
}
loadCompany();
/*Load company*/
function loadCompany() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CallApi/BindContactCompany",
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
            $("#company option").remove();
            $("#company").append('<option value="" selected="">Select</option>');
            $.each(obj, function (i, a) {
                var option = '<option value="' + a["ID"] + '" >' + a["CompanyName"] + '</option>';
                //$("#company").append(option);
                try {
                    $("#company").append(option);
                }
                catch (er) {
                }
            });
            //End of foreach Loop
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        } //End of AJAX error function
    });
}
$(document).ready(function () {
    //Reset Form 
    $("#ClearConatReport").click(function () {
        $('#IdContactReportform')[0].reset();
    });
    /*Download contact report in pdf*/
    $("#opdf").click(function () {
        var pagenum = pageindex;
        var pagesize = pagesize;
        var search = "";
        var type = $('#rptclienttype option:selected').text();
        var ptype = $('#rptclienttype option:selected').val();
        var status = $('#confilterStatus').val();
        var company = $('#company').val();
        var datefrom = $('#searchfrom').val();
        var dateto = $('#searchto').val();
        window.location = encodeURI("/firm/ExportoPdfContactsReport?pagenum=1&pagesize=5000&type=" + type + "&status=" + status + "&company=" + company + "&datefrom=" + datefrom + "&dateto=" + dateto + "&ptype=" + ptype + "&search=" + search);
    });

    /*Download contact report in excel*/
    $("#oexcel").click(function () {
        var pagenum = pageindex;
        var pagesize = pagesize;
        var search = "";
        var type = $('#rptclienttype option:selected').text();
        var ptype = $('#rptclienttype option:selected').val();
        var status = $('#confilterStatus').val();
        var company = $('#company').val();
        var datefrom = $('#searchfrom').val();
        var dateto = $('#searchto').val();
        window.location = encodeURI("/firm/ExportoExcelContactsReport?pagenum=1&pagesize=5000&type=" + type + "&status=" + status + "&company=" + company + "&datefrom=" + datefrom + "&dateto=" + dateto + "&ptype=" + ptype + "&search=" + search);
    });
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        $('input[type = "date"]').attr("onkeydown", "");
        $('input[type = "date"]').attr("onkeypress", "");
    }
    $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
    $('input[type = "date"]').blur(function () {
        var dateString = $(this).val();
        if (dateString != "") {
            var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
            var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
            var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
            //Check whether valid dd/MM/yyyy Date Format.
            if (regex.test(dateString)) {
                var parts = dateString.split("-");
                var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                if (parseInt(parts[0]) < 1900) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[0]) > 3000) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[2]) == 00) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                var dtCurrent = new Date();
                return true;
            } else {
                $(this).focus();
                $(this).val("");
                alert("Invalid Date");
                return false;
            }
        }
    });
    $('div .dropdown-menu').off("click").on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    loadContacttype();
    loadCompany();
    var cexportfilter = false;
    /*Export client list in excel*/
    $("#ocallexcel").click(function () {
        var searchdata = $('#searchdata').val();
        var pagetype = $('#rptclienttype').val();
        window.location = encodeURI("/firm/ExportoExcelAllClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter + "&pagetype=" + pagetype);
    })
    $("#ocallpdf").click(function () {
        var searchdata = $('#searchdata').val();
        var pagetype = $('#rptclienttype').val();
        window.location = encodeURI("/firm/ExportoPdfAllClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter + "&pagetype=" + pagetype);
    })
    setInterval(function () {
        var tempcases = localStorage.getItem("shortcontact");
        var lists2 = $("#rptclienttype option:selected").text();
        if (tempcases != "") {
            if (lists2 == "Prospect") {
                $("#Propectdiv").css("display", "block");
                $("#clientdiv").css("display", "none");
                $("#otherdiv").css("display", "none");
                $("#allcontactsdiv").css("display", "none");
                ploadtabledata();
            }
            else if (lists2 == "Client") {
                $("#Propectdiv").css("display", "none");
                $("#clientdiv").css("display", "block");
                $("#otherdiv").css("display", "none");
                $("#allcontactsdiv").css("display", "none");
                cloadtabledata();
            }
            else if (lists2 == "All") {
                $("#Propectdiv").css("display", "none");
                $("#clientdiv").css("display", "none");
                $("#otherdiv").css("display", "none");
                $("#allcontactsdiv").css("display", "block");
                allloadtabledata();
            }
            else {
                $("#Propectdiv").css("display", "none");
                $("#clientdiv").css("display", "none");
                $("#otherdiv").css("display", "block");
                $("#allcontactsdiv").css("display", "none");
                oloadtabledata();
            }
            localStorage.setItem("shortcontact", "");
        }
    }, 2000);

    /*Special charcter*/
    function specialcharecterpass(str) {
        var strretrn = "0";
        var iChars = "`%&()+=[]\\\';,./{}|\":<>? ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `%&()+=[]\\\';,./{}|\":<>?  special characters are allowed in the password.");
                document.getElementById("clnpassword").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    function specialcharectercpass(str) {
        var strretrn = "0";
        var iChars = "`%&()+=[]\\\';,./{}|\":<>? ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `%&()+=[]\\\';,./{}|\":<>?  special characters are allowed in the confirm password.");
                document.getElementById("clcpassword").focus();
                // document.getElementById("txtCallSign").value = "";
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    function specialcharecter() {
        var strretrn = "0";
        var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
        var data = document.getElementById("clusername").value;
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert("Special characters and spaces are not allowed in the User Id.");
                document.getElementById("clusername").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    $(document).on("click", "#CreateClientlogin", function () {
        var token = $(this).attr("data-val");
        $("#cltoken").val(token);
        $("#frmpass")[0].reset();
        $('#myModalccc').modal({ show: true });
    });
    $("#chngclpwd").click(function () {
        var password = $("#clnpassword").val();
        var confirmPassword = $("#clcpassword").val();
        var username = $("#clusername").val();
        if (username == "") {
            alert("Please enter a User Id.");
            document.getElementById("clusername").focus();
            return false;
        }
        if (username.length < 5) {
            alert("User id should be more than or equal to five characters.");
            document.getElementById("clusername").focus();
            return false;
        }
        if (specialcharecter() == "1") {
            return false;
        }
        if (password == "") {
            alert("Please set the password for the User Id.");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if (password.length < 10) {
            alert("Password must be atleast 10 Characters ");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if ($("#clnpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
            if (reg.test($("#clnpassword").val()) == false) {
                alert("Password must be minimum ten characters, with atleast 1 uppercase, 1 lowercase and 1 special character");
                document.getElementById("clnpassword").focus();
                return false;
            }
        }
        if (specialcharecterpass($("#clnpassword")) == "1") {
            return false;
        }
        if (confirmPassword == "") {
            alert("Please confirm your password that you want to set.");
            document.getElementById("clcpassword").focus();
            return false;
        }
        if (confirmPassword.length < 10) {
            alert("Confirm password must be atleast 10 Characters ");
            document.getElementById("clcpassword").focus();
            return false;
        }
        if ($("#clcpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
            if (reg.test($("#clcpassword").val()) == false) {
                alert("Confirm Password must be minimum ten characters, with atleast 1 uppercase, 1 lowercase and 1 special character");
                document.getElementById("clcpassword").focus();
                return false;
            }
        }
        if (specialcharectercpass($("#clcpassword")) == "1") {
            return false;
        }
        if (password != confirmPassword) {
            alert("Password did not match!");
        }
        else {
            var formData = new FormData();
            formData.append("userid", EncodeText(username));
            formData.append("cpassword", EncodeText(confirmPassword));
            formData.append("token", $("#cltoken").val());
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/CallApi/CreateClientLogin", // Controller/View
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (String(data.Data) == "ExistUserID") {
                            alert('User id already exists. Please try different user id');
                            closeload();
                            return false;
                        }
                        else {
                            $("#frmpass")[0].reset();
                            alert("Client credentials have been created successfully.");
                            document.getElementById("closemodel").click();
                            cloadcontactlist(cpageindex);
                            closeload();
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

    /*Edit contact*/
    $(document).on("click", "#transferpage", function () {
        var type = $(this).attr("data-type");
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/EditContacts";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token, "type": type }
        });
    });

    /*Client case list*/
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });

    /*Export in excel*/
    var exportfilter = false;
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        var cltypes = $("#rptclienttype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        window.location = encodeURI("/firm/ExportoExcelContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes);
    })
    /*Export in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        var cltypes = $("#rptclienttype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        window.location = encodeURI("/firm/ExportoPdfContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes);
    })
    //$(document).on("click", "#oexcel", function () {
    //    var searchdata = "";
    //    var cltypes = $("#rptclienttype").val();
    //    if (cltypes == "") {
    //        alert("Please select the contact type.");
    //        return false;
    //    }
    //    window.location = encodeURI("/firm/ExportoExcelContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes);
    //})
    ///*Export contact in pdf*/
    //$(document).on("click", "#opdf", function () {
    //    var searchdata = $('#searchdata').val();
    //    var cltypes = $("#rptclienttype").val();
    //    if (cltypes == "") {
    //        alert("Please select the contact type.");
    //        return false;
    //    }
    //    window.location = encodeURI("/firm/ExportoPdfContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes);
    //})
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var cpageindex = 1, cpagesize = 10, crecordcount = 0, ctotrecord = 0;
    var opageindex = 1, opagesize = 10, orecordcount = 0, ototrecord = 0;
    var alpageindex = 1, alpagesize = 10, alrecordcount = 0, altotrecord = 0;
    openload();
    cloadtabledata();
    function CallGrid() {
        $("#searchdata").val("");
        var lists = $("#rptclienttype option:selected").text();
        if (lists == "") {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "none");
        }
        else if (lists == "Prospect") {
            $("#Propectdiv").css("display", "block");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "none");
            ploadtabledata();
        }
        else if (lists == "Client") {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "block");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "none");
            cloadtabledata();
        }
        else if (lists == "All") {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "block");
            allloadtabledata();
        }
        else {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "block");
            $("#allcontactsdiv").css("display", "none");
            oloadtabledata();
        }
    }
    var chksflag = true;
    $("#searchdatas").click(function () {
        isRenderPage = false;
        CallGrid();
        chksflag = true;
    });
    $("#ClearCustomSelection").click(function () {
        isRenderPage = false;
        $('#company option').prop('selected', false); 
        $('#searchfrom').val('');
        $('#searchto').val('');
        cloadcontactlist(cpageindex);
        chksflag = true;
    })

    /*Search data on keyup*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                if ($("#rptclienttype option:selected").text() == "Client") {
                    cloadtabledata(1);
                    cexportfilter = false;
                }
                else if ($("#rptclienttype option:selected").text() == "Prospect") {
                    ploadtabledata(1);
                }
                else {
                    oloadtabledata(1);
                }
                chksflag = false;
            }
        }
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    ////////////////Start Propect///////////// 
    $('#Propectdiv').off("click").on('click', '#pgetdatabypagenum', function () {
        ppageindex = $("#ppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadcontactlist(ppageindex);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#ppaginate', function () {
        ppageindex = $(this).attr("index");
        loadcontactlist(ppageindex);
    });

    /*Load contact report custom field data*/
    function ploadtabledata() {
        var $table = '';
        var $header = '';
        var $head1 = '';
        var dt = '';
        var q1 = 2;
        var sort = 17;
        $table = $('<table id="pexample"  class="" style="overflow-x:auto;" /><tr><th>').addClass('table-panel');
        var rt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $header = $('<thead>').html('');
                    $head1 += '<th class="pfname" onclick = "psortTable(1)" width = "20%" ><div class="thbg"> Prospect Name <span class="fa fa-fw fa-sort pull-right"></span><div></th>';
                    $head1 += '<th  class="pmobno"><div class="thbg"><span style="padding-right: 10px !important;"> Mobile</span><div></th>';
                    $head1 += '<th onclick="psortTable(3)" class="pContactType"><div class="thbg"> <span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span><div></th>';
                    $head1 += '<th  class="pcemail"><div class="thbg"> <span style="padding-right: 10px !important;">Email</span><div></th>';
                    $head1 += '<th onclick="psortTable(5)" class="pPtype"><div class="thbg"> <span style="padding-right: 20px !important;">Propspect Type</span><span class="fa fa-fw fa-sort pull-right"></span><div></th>';
                    $head1 += '<th onclick="psortTable(6)" class="psource"><div class="thbg"> <span style="padding-right: 20px !important;">Source/Reference</span><span class="fa fa-fw fa-sort pull-right"></span><div></th>';
                    $head1 += '<th  onclick="psortTable(7)" class="pcadd1"><div class="thbg"> <span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span><div></th>';
                    $head1 += '<th  onclick="psortTable(8)" class="pcweb"><div class="thbg"> <span style="padding-right: 10px !important;">Website</span><span class="fa fa-fw fa-sort pull-right"></span><div></th> ';
                    $head1 += '<th  onclick="psortTable(10)" class="pdesignation"><div class="thbg"> <span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th  onclick="psortTable(11)" class="pcompanyname"><div class="thbg"> <span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th  onclick="psortTable(12)" class="pinfo"><div class="thbg"> <span style="padding-right: 10px !important;">Add. Info</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th  onclick="psortTable(13)" class="ppin"><div class="thbg"> <span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th  onclick="psortTable(14)" class="pcountry"><div class="thbg"> <span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th  style="display:none" onclick="psortTable(15)" class="pstate"><div class="thbg"> <span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th  onclick="psortTable(16)" class="pcity"><div class="thbg"> <span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th onclick="psortTable(17)" class="pcasetype"><div class="thbg"> <span style="padding-right: 10px !important;">Matter Type</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $head1 += '<th onclick="psortTable(18)" class="pcreatedby"><div class="thbg"> <span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span><div></th >';
                    $header.append($head1);
                    var option = "";
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        sort = sort + 1;
                        $header.append('<th   onclick="sortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" class="class' + q1 + '">' + val.FieldName + ' <span class="fa fa-fw fa-sort pull-right"></span></th>');
                    });
                    $header.append('</thead>');
                    $table.append($header);
                    $table.append('<tbody style="clear:both" id="loadactivitydatas">');
                    $('#pupdatePanel').html($table);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            loadcontactlist(pageindex);
        });
    }
    flaghide = true;

    /*Load contact list*/
    function loadcontactlist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText(""));
        formdata.append("type", EncodeText($('#rptclienttype').val()));
        formdata.append("status", EncodeText($('#confilterStatus').val()));
        formdata.append("company", EncodeText($('#company').val()));
        formdata.append("datefrom", EncodeText($('#searchfrom').val()));
        formdata.append("dateto", EncodeText($('#searchto').val()));
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/ReportApi/ContactsReports',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#ptfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#pdatastatus").html("");
                }
                else {
                    $("#pdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $("#loadactivitydatas tr").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (val.totRow > 0) {
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
                        tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="pgetdatabypagenum" style="margin-left:10px;">Go</a></button> </li>'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#ptfooter").html("");
                        $("#ptfooter").html(tfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    if (val.oedit == 1 || roleids == 1) {
                        $row.append($('<td class="pfname" />').html("<a name=" + val.fname + " id='transferpage' href='javascript:void()' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "><span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    }
                    else {
                        $row.append($('<td class="pfname" />').html("<span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    }
                    $row.append($('<td class="pmobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pContactType" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pPtype" />').html("<span>" + (val.PropectType != null ? val.PropectType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="psource" />').html("<span>" + (val.SourceRef != null ? val.SourceRef : '<span >&nbsp;</span>')));
                    $row.append($('<td class="pcadd1" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcweb" />').html("<span>" + (val.cwebsite != null ? val.cwebsite : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pdesignation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcompanyname" />').html("<span>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pinfo" />').html("<span>" + (val.cnotes != null ? val.cnotes : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ppin" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcountry" />').html("<span>" + (val.Country != null ? val.Country : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pstate" />').html("<span>" + (val.State != null ? val.State : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcity" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcasetype" />').html("<span>" + (val.casetype != null ? val.casetype : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcreatedby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    if (val.odelete == 1 || roleids == 1) {
                        //$row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='removeprospect' style='color:red;cursor:pointer;' title='Remove propsect' id-val=" + val.cid + "></span>"));
                    }
                    else {
                        //$row.append($('<td />').html(""));
                    }
                    try {
                        var countcf = countcustomfoeld;
                    }
                    catch
                    {
                    }
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    $("#loadactivitydatas").append($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    ploadmenu();
    /*Load menu*/
    function ploadmenu() {
        var qp = 2;
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                $.each(obj, function (i, a) {
                    qp = qp + 1;
                    var option = '<li><input  class="chkdhide"  type="checkbox"  name="class' + qp + '" ><a href="#" class="small" data-value="option' + qp + '" tabIndex="-1">' + a.FieldName + '</a></li>';
                    $("#bd").append(option);
                }); //End of foreach Loop
                //console.log($("#bd").html());
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    ////////////////END Propect/////////////
    ////////////////Start Client/////////////
    var fcode = localStorage.getItem("FirmCode");
    var cexportfilter = false;
    $("#cexcel").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoExcelClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter);
    })
    $("#cpdf").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoPdfClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter);
    })
    function checkEmail(email) {
        // var regExp = /(^[a-z][0-9]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    try {
        $("#sharedocs").click(function () {
            var formdata = new FormData();
            var emailto = $("#shareemail").val();
            if (emailto == "") {
                alert("Please enter the E-mail Id.");
                return false;
            }
            else {
                if (emailto != "") {
                    var emailArray = emailto.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            //  alert("true");
                            vEmails = "true";
                        } else {
                            vEmails = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid email format!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
            }
            if (vEmails == "" || vEmails == "true") {
                formdata.append("email", emailto);
                openload();
                $.ajax({
                    async: true,
                    url: '/firm/SendContactsClientList',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        new PNotify({
                            title: 'Success!',
                            text: ' Data has been sent Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#shareemail").val("");
                        closeload();
                        document.getElementById("closesharebox").click();
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
        closeload();
    }
    var selectedID = new Array();
    $("#enable").click(function () {
        selectedID = [];
        enableclient();
        /*Enable client*/
        function enableclient() {
            var result = confirm("Are you sure to Enable Account?");
            if (result) {
                $('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/EnableClient',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: '  ' + clientlable + '  Account Activated Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                cloadcontactlist(cpageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            alert('Error!');
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' You do not have selected any row to activate account?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();

    /*Remove prospect*/
    $(document).on("click", "#removeprospect", function () {
        selectedID = [];
        var cltypes = $("#rptclienttype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        var ids = $(this).attr("id-val");
        deletecontactsingle();
        //}
        function deletecontactsingle() {
            var result = confirm("Are you sure to delete contacts ?");
            if (result) {
                selectedID.push(ids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadcontactlist(pageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });

    /*Remove others*/
    $(document).on("click", "#removeothers", function () {
        selectedID = [];
        var cltypes = $("#rptclienttype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        var ids = $(this).attr("id-val");
        odeletecontactsingle();
        function odeletecontactsingle() {
            var result = confirm("Are you sure to delete Contacts?");
            if (result) {
                selectedID.push(ids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                oloadcontactlist(opageindex);
                                alladcontactlist(opageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    var selectedID = new Array();
    $("#premove").click(function () {
        selectedID = [];
        var cltypes = $("#rptclienttype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        deletecontact();
        //}
        function deletecontact() {
            var result = confirm("Are you sure to delete Contact?");
            if (result) {
                $('#loadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadcontactlist(pageindex);
                                closeload();
                            }
                            else {
                                closeload();
                                //alert("not found");
                            }
                        },
                        error: function () {
                            closeload();
                            //  alert('Error!');
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    $("#oremove").click(function () {
        selectedID = [];
        var cltypes = $("#rptclienttype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        odeletecontact();
        //}
        function odeletecontact() {
            var result = confirm("Are you sure to delete Contact?");
            if (result) {
                $('#oloadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                oloadcontactlist(opageindex);
                                closeload();
                            }
                            else {
                                closeload();
                                //alert("not found");
                            }
                        },
                        error: function () {
                            closeload();
                            //  alert('Error!');
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    var selectedIDSync = new Array();
    /*Save Sync Row Data*/
    $("#syncrqst").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", "client");
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data sync request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            cloadcontactlist(cpageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to sync?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });
    $("#syncrqstprospect").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#loadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                //  alert("hi");
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", "contact");
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data sync request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            loadcontactlist(pageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to sync?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });
    $("#syncrqstothers").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#oloadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                //  alert("hi");
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("contact"));
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data sync request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            oloadcontactlist(opageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to sync?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });

    /*Disable client*/
    var selectedID = new Array();
    $("#disable").click(function () {
        selectedID = [];
        disableclient();
        function disableclient() {
            var result = confirm("Are you sure to Disable Account?");
            if (result) {
                $('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/DisableClient',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: '  ' + clientlable + '  Account De-activated  Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                cloadcontactlist(cpageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' You do not have selected any row to De-activate Account ?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });


    $('#clientdiv').off("click").on('click', '#cgetdatabypagenum', function () {
        cpageindex = $("#cpagnumvalue").val();
        if (cpageindex != "undefined") {
            if (Math.sign(cpageindex) == 1) {
                var cpageindesx = $("#csotopage").text();
                if (cpageindex <= parseInt(cpageindesx)) {
                    openload();
                    cloadcontactlist(cpageindex);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
            else {
                alert("Please enter a valid page number.");
                return false;
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#cpaginate', function () {
        cpageindex = $(this).attr("index");
        cloadcontactlist(cpageindex);
    });

    /*load table data*/
    function cloadtabledata() {
        var $ctable = '';
        var $cheader = '';
        var $chead1 = '';
        var cdt = '';
        var cq1 = 2;
        var csort = 10;
        $ctable = $('<table id="cexample"   class="" style="overflow-x:auto;" /><tr><th>').addClass('table-panel');
        var crt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $cheader = $('<thead>').html('');
                    $chead1 += '<th class="cufname" onclick = "sortTable(0)" width = "20%" ><div class="thbg">  First Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
                    $chead1 += '<th class="lname" onclick = "sortTable(1)" width = "20%" ><div class="thbg">  Last Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
                    $chead1 += '<th  onclick="sortTable(2)" class="companyname"><div class="thbg"> <span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $chead1 += '<th  class="mobno"><div class="thbg"> <span style="padding-right: 10px !important;">Mobile</span></div></th>';
                    $chead1 += '<th onclick ="sortTable(4)" class="ContactType" width = "12%"  ><div class="thbg">  <span style="padding-right: 10px !important;">Contact Type</span> <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $chead1 += '<th  class="ccemail"><div class="thbg"> <span style="padding-right: 10px !important;">Email</span></div></th>';
                    $chead1 += '<th onclick="sortTable(6)" class="userid"><div class="thbg"> <span style="padding-right: 20px !important;">UserId</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $chead1 += '<th  onclick="sortTable(7)" class="landline"><div class="thbg"> <span style="padding-right: 20px !important;">Landline</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $chead1 += '<th  onclick="sortTable(8)" class="cadd1"><div class="thbg"> <span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $chead1 += '<th   onclick="sortTable(10)" class="designation"><div class="thbg"> <span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $chead1 += '<th  onclick="sortTable(11)" class="country"><div class="thbg"> <span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $chead1 += '<th onclick="sortTable(12)" class="state"><div class="thbg"> <span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $chead1 += '<th  onclick="sortTable(13)" class="city"><div class="thbg"> <span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $chead1 += '<th  onclick="sortTable(14)" class="pin"><div class="thbg"> <span style="padding-right: 10px !important;">Pin</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $chead1 += '<th  onclick="sortTable(15)" class="createdby"><div class="thbg"> <span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $cheader.append($chead1);
                    $cheader.append('</thead>');
                    $ctable.append($cheader);
                    $ctable.append('<tbody style="clear:both" id="cloadactivitydatas">');
                    $('#cupdatePanel').html($ctable);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(crt1).then(function (data, textStatus, jqXHR) {
            cloadcontactlist(cpageindex);
        });
    }
    var rer = 1;
    cflaghide = true;

    /*Cloud contact list*/
    function cloadcontactlist(cpageindex) {
        $("#cloadactivitydatas").html("");
        $("#cloadactivitydatas").empty("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        cltype = $('#rptclienttype').val();
        if (cltype == "") {
            var cltype = "Client";
        }
        if (cltype != "Client") {
            cltype = "Client";
        }
        formdata.append("pagenum", EncodeText(cpageindex));
        formdata.append("pagesize", EncodeText(cpagesize));
        formdata.append("search", EncodeText(""));
        formdata.append("type", EncodeText(cltype));
        formdata.append("status", EncodeText($('#confilterStatus').val()));
        formdata.append("company", EncodeText($('#company').val()));
        formdata.append("datefrom", EncodeText($('#searchfrom').val()));
        formdata.append("dateto", EncodeText($('#searchto').val()));
        var ajaxTime = new Date().getTime();
        openload();
        var cld12 = $.ajax({
            async: true,
            url: '/api/ReportApi/ContactsReports',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#ctfooter").html("");
                $("#ctokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var clength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#cdatastatus").html("");
                    closeload();
                }
                else {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    $("#cdatastatus").html("No result found");
                    closeload();
                }
                if (obj.length == 0) {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                }
                var qty = 0;
                $("#cloadactivitydatas tr").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (i === (clength - 1)) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (cpageindex == totpage) {
                            $('#next').hide();
                            //$('#next').css("display", "none");
                            $('#prev').css("display", "block");
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (cpageindex == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }

                        if (isRenderPage == false) {
                            renderPagination(cpageindex, totpage);
                        }
                    //if (i === 0) {
                    //    cfirstvalue = val.rownum;
                    //}
                    //if (i === (clength - 1)) {
                    //    var cpnext = cpageindex;
                    //    var cpprev = cpageindex;
                    //    var cpageno = cpageindex;
                    //    var ctotdata = val.totRow;
                    //    var ctotpage = 0;
                    //    if (val.totRow > 0) {
                    //        cpnext = parseInt(cpnext) + 1;
                    //        if (cpnext == 0) cpnext = 1;
                    //        cpprev = parseInt(cpageno) - 1;
                    //        if (cpprev == 0) cpprev = 1;
                    //        ctotpage = parseInt(ctotdata) / parseInt(cpagesize);
                    //        if (parseInt(ctotdata) % parseInt(cpagesize) != 0) {
                    //            ctotpage = parseInt(ctotpage) + 1;
                    //        }
                    //        $("#cpagnumvalue").attr("max", ctotpage);
                    //    }
                    //    var ctfot = '';
                    //    ctfot += '<ul>'
                    //    ctfot += '<li>results <span>' + val.totRow + '</span>  <span id="csotopage" style="display:none">' + ctotpage + '</span></li>'
                    //    ctfot += '<li><span>|</span></li>'
                    //    ctfot += '<li>pages ' + cpageindex + '/ ' + parseInt(ctotpage) + '</li>'
                    //    ctfot += '<li><span>|</span></li>'
                    //    ctfot += '<li ><input type="number" id="cpagnumvalue" min="1" class="footerInput"><a class="gobtn"  style="cursor:pointer" type="button" id="cgetdatabypagenum" >Go</a> </li>'
                    //    if (val.totRow <= clength) {
                    //    }
                    //    else if (cpageno == 1) {
                    //    }
                    //    else if (cpageno == ctotpage) {
                    //        ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                    //    }
                    //    else {
                    //        ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                    //    }
                    //    if (cpageno < ctotpage) {
                    //        ctfot += '<a  id="cpaginate" title="Next Page" href="javascript:void()" index="' + cpnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }
                    //    ctfot += '</ul>'
                    //    $("#ctfooter").html("");
                    //    $("#ctfooter").html(ctfot);
                    }
                    qty = qty + 1;
                    var btitle = "";
                    var bclass = "";
                    var bdata = "";
                    if (val.IsActive == true) {
                        bclass = "label label-success";
                        bdata = "Enabled";
                        btitle = "Client credentials inactive"
                    }
                    if (val.IsActive == false) {
                        bclass = "label label-danger";
                        bdata = "Disabled";
                        btitle = "Client credentials active";
                        //alert(bdata);
                    }
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    $row.append($('<td class="cufname" />').html("<span name = '" + val.cufname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.cufname != null ? val.cufname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="clname"  />').html("<span name = '" + val.clname.trim() + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.clname != null ? val.clname.trim() : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="companyname" />').html("<span>" + (val.CompanyName != null ? val.CompanyName : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="mobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ContactType" />').html("<span  name='Client'>Client</span>"));
                    $row.append($('<td class="ccemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="userid" />').html("<span>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="landline" />').html("<span>" + (val.clandline != null ? val.clandline : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cadd1" />').html("<span>" + (val.caddress != null ? val.caddress : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="designation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="country" />').html("<span>" + (val.country != null ? val.country : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="state" />').html("<span>" + (val.cstate != null ? val.cstate : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="city" />').html("<span>" + (val.ccity != null ? val.ccity : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="pin" />').html("<span>" + (val.pin != null ? val.pin : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="createdby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.oedit == 1 || roleids == 1) {
                        //$row.append($('<td />').html("<span class='glyphicon glyphicon-edit' id='editclient' style='color:#069;cursor:pointer;' title='Edit client' id-val=" + val.LoginId + "></span>"));
                    }
                    else {
                        //$row.append($('<td />').html(""));
                    }
                    $("#cloadactivitydatas").append($row);
                    //$("#loadactivitydata").html($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(cld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    function renderPagination(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

            let start = Math.max(2, pageindex - delta);
            let end = Math.min(totPages - 1, pageindex + delta);
            if (pageindex <= maxVisible) {
                start = 2;
                end = maxVisible;
            }

            if (pageindex >= totPages - maxVisible + 1) {
                start = totPages - maxVisible + 1;
                end = totPages - 1;
            }
            if (start > 2) paginationHtml += `<span class="dots">...</span>`;
            for (let i = start; i <= end; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
            paginationHtml += `<button class="page-btn ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#pageNumbers").html(paginationHtml);
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totPages);
        isRenderPage = true;
    }


    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#prev").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#next").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        PageNumber = setPageNo;
        isRenderPage = false;
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    /*Pagination End*/
    ////////////////END Client/////////////
    ////////////////Start Others/////////////
    var otrgr = true;
    /*Load menu*/
    function loadmenu() {
        var qo = 2;
        if (otrgr == false) {
            return false;
        }
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                $.each(obj, function (i, a) {
                    qo = qo + 1;
                    var option = '<li><input  class="chkdhide"  type="checkbox"  name="class' + qo + '" ><a href="#" class="small" data-value="option' + qo + '" tabIndex="-1">' + a.FieldName + '</a></li>';
                    $("#od").append(option);
                }); //End of foreach Loop
                otrgr = false;
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $('#otherdiv').off("click").on('click', '#ogetdatabypagenum', function () {
        opageindex = $("#opagnumvalue").val();
        if (opageindex != "undefined") {
            if (Math.sign(opageindex) == 1) {
                var opageindesx = $("#osotopage").text();
                if (opageindex <= parseInt(opageindesx)) {
                    openload();
                    oloadcontactlist(opageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
            else {
                alert("Please enter a valid page number.");
                return false;
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#opaginate', function () {
        opageindex = $(this).attr("index");
        oloadcontactlist(opageindex);
    });
    /*Open table data*/
    function oloadtabledata() {
        var $otable = '';
        var $oheader = '';
        var $ohead1 = '';
        var dt = '';
        var q1 = 2;
        var sort = 10;
        $otable = $('<table id="oexample"   class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
        var ort1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $oheader = $('<thead>').html('');
                    $ohead1 += '<th class="ofname" onclick = "osortTable(1)" width = "20%" ><div class="thbg"> Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th  class="omobno"><div class="thbg"><span style="padding-right: 10px !important;"> Mobile</span></div></th>';
                    $ohead1 += '<th onclick="osortTable(3)" class="oContactType"><div class="thbg"> <span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th  class="ocemail"><div class="thbg"><span style="padding-right: 10px !important;"> Email</span></div></th>';
                    $ohead1 += '<th onclick="osortTable(5)" class="ocadd1"><div class="thbg"> <span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th onclick="osortTable(6)" class="ocweb"><div class="thbg"> <span style="padding-right: 10px !important;">Website</span><span class="fa fa-fw fa-sort pull-right"></span></div></th> ';
                    $ohead1 += '<th onclick="osortTable(7)" class="odesignation"><div class="thbg"> <span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(8)" class="ocompanyname"><div class="thbg"> <span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(9)" class="oinfo"><div class="thbg"> <span style="padding-right: 10px !important;">Add. Info</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(10)" class="opin"><div class="thbg"> <span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(11)" class="ocountry"><div class="thbg"> <span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(12)" class="ostate"><div class="thbg"> <span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(13)" class="ocity"><div class="thbg"> <span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(14)" class="ocreatedby"><div class="thbg"> <span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $oheader.append($ohead1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        sort = sort + 1;
                        $oheader.append('<th  onclick="osortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" class="class' + q1 + '"><div class="thbg">' + val.FieldName + ' <span class="fa fa-fw fa-sort pull-right"></span></div></th>');
                    });
                    $oheader.append('</thead>');
                    $otable.append($oheader);
                    $otable.append('<tbody style="clear:both" id="oloadactivitydatas">');
                    $('#oupdatePanel').html($otable);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(ort1).then(function (data, textStatus, jqXHR) {
            loadmenu();
            oloadcontactlist(pageindex);
        });
    }

    /*Load contact list*/
    function oloadcontactlist(opageindex) {
        $("#oloadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(opageindex));
        formdata.append("pagesize", EncodeText(opagesize));
        formdata.append("search", EncodeText(""));
        formdata.append("type", EncodeText($('#rptclienttype').val()));
        formdata.append("status", EncodeText($('#confilterStatus').val()));
        formdata.append("company", EncodeText($('#company').val()));
        formdata.append("datefrom", EncodeText($('#searchfrom').val()));
        formdata.append("dateto", EncodeText($('#searchto').val()));
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/ReportApi/ContactsReports',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#otfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var olength = obj.length;
                }
                else {
                    //alert("not found");
                }

                if (response.Data.length > 2) {
                    $("#odatastatus").html("");
                }
                else {
                    $("#odatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $("#oloadactivitydatas tr").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        ofirstvalue = val.rownum;
                    }
                    if (i === (olength - 1)) {
                        var opnext = opageindex;
                        var opprev = opageindex;
                        var opageno = opageindex;
                        var ototdata = val.totRow;
                        var ototpage = 0;
                        if (val.totRow > 0) {
                            opnext = parseInt(opnext) + 1;
                            if (opnext == 0) opnext = 1;
                            opprev = parseInt(opageno) - 1;
                            if (opprev == 0) opprev = 1;
                            ototpage = parseInt(ototdata) / parseInt(opagesize);
                            if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                                ototpage = parseInt(ototpage) + 1;
                            }
                            $("#opagnumvalue").attr("max", ototpage);
                        }
                        var otfot = '';
                        otfot += '<ul>'
                        otfot += '<li>results <span>' + val.totRow + '</span>  <span id="osotopage" style="display:none">' + ototpage + '</span></li>'
                        otfot += '<li><span>|</span></li>'
                        otfot += '<li>pages ' + opageindex + '/ ' + parseInt(ototpage) + '</li>'
                        otfot += '<li><span>|</span></li>'
                        otfot += '<li ><input type="number" id="opagnumvalue" min="1"  class="footerInput"><a class="gobtn"  style="cursor:pointer" type="button" id="ogetdatabypagenum" >Go</a> </li>'
                        if (val.totRow <= olength) {
                        }
                        else if (opageno == 1) {
                        }
                        else if (opageno == ototpage) {
                            otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (opageno < ototpage) {
                            otfot += '<a  id="opaginate" title="Next Page" href="javascript:void()" index="' + opnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        otfot += '</ul>'
                        $("#otfooter").append(otfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    if (val.oedit == 1 || roleids == 1) {
                        $row.append($('<td class="ofname" />').html("<a name=" + val.fname + " id='transferpage' href='javascript:void()' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "><span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    }
                    else {
                        $row.append($('<td class="ofname" />').html("<span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    }
                    $row.append($('<td class="omobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="oContactType" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocadd1" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocweb" />').html("<span>" + (val.cwebsite != null ? val.cwebsite : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="odesignation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocompanyname" />').html("<span>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="oinfo" />').html("<span>" + (val.cnotes != null ? val.cnotes : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="opin" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocountry" />').html("<span>" + (val.Country != null ? val.Country : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ostate" />').html("<span>" + (val.State != null ? val.State : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocity" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocreatedby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    if (val.odelete == 1 || roleids == 1) {
                        //$row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='removeothers' style='color:red;cursor:pointer;' title='Remove propsect' id-val=" + val.cid + "></span>"));
                    }
                    else {
                        //$row.append($('<td />').html(""));
                    }
                    var countcf = countcustomfoeld;
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    $("#oloadactivitydatas").append($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    ////////////////END Propect/////////////
    /////////////start all//////
    cflaghideall = true;
    function alladcontactlist(opageindex) {
        $("#alloadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(opageindex));
        formdata.append("pagesize", EncodeText(opagesize));
        formdata.append("search", EncodeText(""));
        formdata.append("type", EncodeText($('#rptclienttype').val()));
        formdata.append("status", EncodeText($('#confilterStatus').val()));
        formdata.append("company", EncodeText($('#company').val()));
        formdata.append("datefrom", EncodeText($('#searchfrom').val()));
        formdata.append("dateto", EncodeText($('#searchto').val()));
        var ajaxTime = new Date().getTime();
        openload();
        $("#alloadactivitydatas tr").remove();
        var ld12 = $.ajax({
            async: true,
            url: '/api/ReportApi/ContactsReports',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#alfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var olength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#alldatastatus").html("");
                }
                else {
                    $("#alldatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        ofirstvalue = val.rownum;
                    }
                    if (i === (olength - 1)) {
                        var opnext = opageindex;
                        var opprev = opageindex;
                        var opageno = opageindex;
                        var ototdata = val.totRow;
                        var ototpage = 0;
                        if (val.totRow > 0) {
                            opnext = parseInt(opnext) + 1;
                            if (opnext == 0) opnext = 1;
                            opprev = parseInt(opageno) - 1;
                            if (opprev == 0) opprev = 1;
                            ototpage = parseInt(ototdata) / parseInt(opagesize);
                            if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                                ototpage = parseInt(ototpage) + 1;
                            }
                            $("#alpagnumvalue").attr("max", ototpage);
                        }
                        var alfot = '';
                        alfot += '<ul>'
                        alfot += '<li>results <span>' + val.totRow + '</span>  <span id="alsotopage" style="display:none">' + ototpage + '</span></li>'
                        alfot += '<li><span>|</span></li>'
                        alfot += '<li>pages ' + opageindex + '/ ' + parseInt(ototpage) + '</li>'
                        alfot += '<li><span>|</span></li>'
                        alfot += '<li ><input type="number" id="alpagnumvalue" min="1"  class="footerInput"><a class="gobtn"  style="cursor:pointer" type="button" id="algetdatabypagenum" >Go</a> </li>'
                        if (val.totRow <= olength) {
                        }
                        else if (opageno == 1) {
                        }
                        else if (opageno == ototpage) {
                            alfot += '<li><span><a id="alpaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            alfot += '<li><span><a id="alpaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (opageno < ototpage) {
                            alfot += '<a  id="alpaginate" title="Next Page" href="javascript:void()" index="' + opnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        alfot += '</ul>'
                        $("#alfooter").append(alfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    $row.append($('<td class="s" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork' style='display:none'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    if (val.oedit == 1 || roleids == 1) {
                        if (val.ProfileType == "Client" || val.ProfileType == "") {
                            $row.append($('<td class="ofnameal" />').html("<span style='cursor:pointer;color:#069;' name=" + val.fname + "  id='transferpagetocase' href='javascript:void()' data-id=" + val.Id + " sno=" + qty + " ><span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                        }
                        else {
                            $row.append($('<td class="ofnameal" />').html("<a name=" + val.fname + " id='transferpage' href='javascript:void()' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "><span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                        }
                    }
                    else {
                        if (val.ProfileType == "Client" || val.ProfileType == "") {
                            $row.append($('<td class="ofnameal" />').html("<span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                        }
                        else {
                            $row.append($('<td class="ofnameal" />').html("<span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                        }
                    }
                    $row.append($('<td class="omobnoal" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    if (val.ProfileType == "Client" || val.ProfileType == "") {
                        $row.append($('<td class="oContactTypeal" />').html("<span>Client</span>"));
                    }
                    else {
                        $row.append($('<td class="oContactTypeal" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    }
                    $row.append($('<td class="ocemailal" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocadd1al" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocwebal" />').html("<span>" + (val.cwebsite != null ? val.cwebsite : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="odesignational" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocompanynameal" />').html("<span>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="oinfoal" />').html("<span>" + (val.cnotes != null ? val.cnotes : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="opinal" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocountryal" />').html("<span>" + (val.Country != null ? val.Country : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ostateal" />').html("<span>" + (val.State != null ? val.State : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocityal" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocreatedbyal" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    var countcf = countcustomfoeld;
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    if (val.odelete == 1 || roleids == 1) {
                        if (val.ProfileType == "Client" || val.ProfileType == "") {
                            $row.append($('<td />').html(""));
                        }
                        else {
                            $row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='removeothers' style='color:red;cursor:pointer;' title='Remove' id-val=" + val.cid + "></span>"));
                        }
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $("#alloadactivitydatas").append($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("#odal li input:checkbox:not(:checked)").each(function () {
                var column = "#alexample ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }

    /*Load table data*/
    function allloadtabledata() {
        var $altable = '';
        var $alheader = '';
        var $alhead1 = '';
        var dt = '';
        var q1 = 2;
        var sort = 10;
        $altable = $('<table id="alexample"  class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
        var alrt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $alheader = $('<thead>').html('');
                    $alhead1 += '<th><input type="checkbox" id="select_all"/></th>'
                    $alhead1 += '<th class="ofnameal" onclick = "asortTable(1)" width = "20%" ><div class="thbg"> Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $alhead1 += '<th  class="omobnoal"><div class="thbg"> <span style="padding-right: 10px !important;">Mobile</span></div></th>';
                    $alhead1 += '<th onclick="asortTable(3)" class="oContactTypeal"><div class="thbg"> <span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $alhead1 += '<th  class="ocemailal"><div class="thbg"> <span style="padding-right: 10px !important;">Email</span></div></th>';
                    $alhead1 += '<th onclick="asortTable(5)" class="ocadd1al"><div class="thbg"> <span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $alhead1 += '<th onclick="asortTable(6)" class="ocwebal"><div class="thbg"> <span style="padding-right: 10px !important;">Website</span><span class="fa fa-fw fa-sort pull-right"></span></div></th> ';
                    $alhead1 += '<th onclick="asortTable(7)" class="odesignational"><div class="thbg"> <span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(8)" class="ocompanynameal"><div class="thbg"> <span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(9)" class="oinfoal"><div class="thbg"> <span style="padding-right: 10px !important;">Add. Info</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(10)" class="opinal"><div class="thbg"> <span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(11)" class="ocountryal"><div class="thbg"> <span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(12)" class="ostateal"><div class="thbg"> <span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(13)" class="ocityal"><div class="thbg"> <span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(14)" class="ocreatedbyal"><div class="thbg"> <span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alheader.append($alhead1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        sort = sort + 1;
                        $alheader.append('<th  onclick="asortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" class="class' + q1 + '">' + val.FieldName + ' <span class="fa fa-fw fa-sort pull-right"></span></th>');
                    });
                    $alheader.append('<th ><span style="padding-right: 10px !important;"></span>Áction</th>');
                    $alheader.append('</thead>');
                    $altable.append($alheader);
                    $altable.append('<tbody style="clear:both" id="alloadactivitydatas">');
                    $('#allupdatePanel').html($altable);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(alrt1).then(function (data, textStatus, jqXHR) {
            // loadmenu();
            alladcontactlist(alpageindex);
        });
    }
    $(document).on('click', '#alpaginate', function () {
        /* your code here */
        cpageindex = $(this).attr("index");
        alladcontactlist(cpageindex);
    });
    $('#parentdivs').off("click").on('click', '#algetdatabypagenum', function () {
        ppageindex = $("#alpagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#alsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    alladcontactlist(ppageindex);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    //////end///////////////
    var fcode = localStorage.getItem("FirmCode");
    $(document).on('click', '#editclient', function () {
        var loginid = $(this).attr("id-val");
        var urls = "/" + fcode + "/Firm/EditClient";
        url_redirect({
            url: urls,
            method: "post",
            data: { "loginid": loginid }
        });
    });
});

$(document).on('change', '.chkdhide', function () {
    // your code
    var column = "." + $(this).attr("name");
    $(column).toggle();
});