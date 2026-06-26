var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var cpageindex = 1;
/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    LoadSavedLimitations();
    $("#condonation").on('change', function () {
        var convalue = 0;
        if (!$(this).is(':checked')) {
            convalue = 0;
        }
        else {
            convalue = 1;
        }
        var formData = new FormData();
        formData.append("Condonation", convalue);
        formData.append("caseid", caseid);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/SaveCaseCondonation",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "1") {
                    alert("Successfully saved");
                    //$(".close").click();
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
    openload();
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    //LoadLimitationSubject();
    ViewLimitationCase(pageindex);
    /*Load limitation subject*/
    function LoadLimitationSubject() {
        var html3 = '';
        var formData = new FormData();
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/CaseLimitationSubject",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.Data.length;
                html3 += "<option value=''>Select Subject</option>";
                $.each(response1.Data, function (i, a) {
                    var subject = a.Subject;
                    html3 += '<option value=' + subject + '>' + subject + '</option>';
                });
                $("#ddlSubject").html("");
                $("#ddlSubject").append(html3);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
    }
    $(document).on('change', '#ddlSubject', function () {
        ViewLimitationCase(pageindex);
    });

    /*View case limitation*/
    function ViewLimitationCase(pageindex) {
        $("#tfooter").html("");
        var html3 = '';
        var formData = new FormData();
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        formData.append("subject", caseid);
        formData.append("search", search);
        openload();
        var lsdata = $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/ViewLimitationCasesBySearch",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#datalimitstatus").html("");
                }
                else {
                    $("#datalimitstatus").html("No result found !");
                    closeload();
                }
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
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
                        tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getlcdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (a.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="lpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="lpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="lpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        $("#tfooter").append(tfot);
                    }
                    var id = a.id;
                    var LimitationApplicable = a.LimitationApplicable;
                    var Provision = a.Provision;
                    var StartDate = a.StartDate;
                    var DueDays = a.DueDays;
                    var Task = a.Task;
                    var Remarks = a.Remarks;
                    var Subject = a.Subject;
                    var caRemarks = a.caRemarks;
                    var AlertDate = a.AlertDate;
                    var setAlert = a.setAlert;
                    var CaId = a.CaId;
                    var IsAction = a.IsAction;
                    var IsFile = a.IsFile;
                    var Modify_date = a.Modify_date;
                    var duedayDetails = "";
                    if (Modify_date == null) {
                        Modify_date = "";
                    }
                    else {
                        Modify_date = formatDatetoIST(Modify_date);
                    }
                    if (AlertDate == null) { AlertDate = ""; }
                    if (caRemarks != "" && caRemarks != null) {
                        Remarks = caRemarks;
                    }
                    var ialert = 'No';
                    if (setAlert == 1)
                        ialert = 'Yes';
                    var iaction = 'No';
                    if (IsAction == 1)
                        iaction = 'Yes';
                    if (AlertDate != null) {
                        //AlertDate = formatDatetoIST(AlertDate);
                        AlertDate = AlertDate.replace(', ', '<br><br>');
                    }
                    if (StartDate != null) {
                        StartDate = formatDatetoIST(StartDate);
                    }
                    if (a.duedayDetails != "" && a.duedayDetails != null) {
                        duedayDetails = a.duedayDetails;
                    }
                    var limit_Provision = LimitationApplicable;
                    //if (IsAction == "1") {
                    //    html3 += '<tr id="trcolor">'
                    //}
                    //else {
                    //    html3 += '<tr>'
                    //}

                    var action = '<input type="date" title="Enter start date of limitation period and press +" style="width:90%" id="limisdate' + id + '" onkeypress="return false;"/><a data-toggle="tab" href="#"    data onclick=AddLimitation("' + id + '")><span class="glyphicon glyphicon-plus"></span></a>';
                    if (IsAction == "1") {
                        html3 += '<tr id="trcolor">'
                    }
                    else {
                        html3 += '<tr>'
                    }
                    html3 += '<td class="lsubject">'
                    html3 += '<span id="clname">' + Subject + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lprovision">'
                    html3 += '<span id="clname">' + Provision + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="limitapl">'
                    html3 += '<span id="clname">' + limit_Provision + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="ltask">'
                    html3 += '<span id="clname">' + Task + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lduedays">'
                    html3 += '<span id="clname" >' + DueDays + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lremarks">'
                    html3 += '<span id="clname" >' + Remarks + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lduedetails">'
                    html3 += '<span id="clname" >' + duedayDetails + '</span>'
                    html3 += '</td>'
                    html3 += '<td >'
                    html3 += '<span id="clname">' + action + '</span>'
                    html3 += '</td>'
                });
                //alert(html3);
                $("#bindLimitationcase").html("");
                $("#bindLimitationcase").append(html3);
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
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        $.when(lsdata).then(function (data, textStatus, jqXHR) {
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
            var formData = new FormData();
            formData.append("caseid", caseid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/LimitationApi/CaseCondonationCount",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data == 1) {
                        $('#condonation').prop('checked', true);
                    }
                    else {
                        $('#condonation').prop('checked', false);
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
    }
    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    $(document).on('click', '#lpaginate', function () {
        /* your code here */
        cpageindex = $(this).attr("index");
        ViewLimitationCase(cpageindex);
    });
    $(document).on('click', '#getlcdatabypagenum', function () {
        cpageindex = $("#pagnumvalue").val();
        if (cpageindex != "undefined") {
            if (Math.sign(cpageindex) == 1) {
                var cpageindesx = $("#lctopage").text();
                if (cpageindex <= parseInt(cpageindesx)) {
                    openload();
                    ViewLimitationCase(cpageindex);
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
    //Delete case limitation manual data
    $(document).on('click', '#deleteLimitationManualData', function () {
        selectedID = [];
        var caseids = $(this).attr("id-val");
        deletemattersingle();
        function deletemattersingle() {
            var result = confirm("Are you sure to delete Manual limitation? ");
            if (result) {
                selectedID.push(caseids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/LimitationApi/RemoveManualLimitation',
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
                                    text: ' Manual Limitation Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                bind_MatterTypeDetails();
                                closeload();
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' You are not Authotized to delete this Matter !',
                                    type: 'error',
                                    delay: 2000
                                });
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
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });

    /*Save case limitation details*/
    $("#rSaveLimitation").click(function () {
        var ddate = $("#ddate").val();
        var hidid = $("#hidid").val();
        var hidcaid = $("#hidcaid").val();
        var Remarks = $("#Remarks").val();
        var setalert = $("#setalert").prop("checked") == true ? 1 : 0;
        var val = [];
        var userloginids = "";
        var multipledays = "";
        if (ddate == "") {
            alert("Select Date");
            return false;
        }
        if (Remarks == "") {
            alert("Enter Remarks");
            return false;
        }
        multipledays = $("#chkdate").val();
        if (multipledays == "") {
            alert("Select alert day(s)");
            return false;
        }
        $.each($("input[name='fname']:checked"), function () {
            val[i] = $(this).val();
            if (val[i] != "on") {
                userloginids += val[i] + ",";
            }
        });
        if (userloginids == "") {
            alert("Select user(s)");
            return false;
        }
        var formData = new FormData();
        formData.append("id", $("#hidid").val());
        formData.append("Remarks", Remarks);
        formData.append("ddate", ddate);
        formData.append("setalert", setalert);
        formData.append("hidcaid", $("#hidcaid").val());
        formData.append("userloginids", userloginids);
        formData.append("multipledays", multipledays);
        formData.append("caseid", caseid);
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("attachmentcase").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachmentcase").files[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
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
            }
            tempsize = tempsize.toFixed(2);
        }
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/UpdateCaseLimitationAlerts",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    alert("Successfully saved");
                    LoadSavedLimitations();
                    BindAlertusers($("#hidid").val());
                    BindAlertDatebyClId($("#hidid").val());
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

    /*Update manual case limitation alert*/
    $("#rSaveLimitationml").click(function () {
        var ddate = $("#duedateml").val();
        var Remarks = $("#Remarksml").val();
        var setalert = $("#setalertml").prop("checked") == true ? 1 : 0;
        var val = [];
        var userloginids = "";
        var multipledays = "";
        if (ddate == "") {
            alert("Select Due Date");
            return false;
        }
        if (Remarks == "") {
            alert("Enter Remarks");
            return false;
        }
        multipledays = $("#chkdateml").val();
        if (multipledays == "") {
            alert("Select alert day(s)");
            return false;
        }
        $.each($("input[name='fname']:checked"), function () {
            val[i] = $(this).val();
            if (val[i] != "on") {
                userloginids += val[i] + ",";
            }
        });
        if (userloginids == "") {
            alert("Select user(s)");
            return false;
        }
        var formData = new FormData();
        formData.append("id", $("#hididml").val());
        formData.append("Remarks", Remarks);
        formData.append("ddate", ddate);
        formData.append("setalert", setalert);
        formData.append("userloginids", userloginids);
        formData.append("multipledays", multipledays);
        formData.append("caseid", caseid);
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("attachmentcase").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachmentcase").files[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
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
        }
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/UpdateCaseLimitationAlertsManual",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    alert("Successfully saved");
                    $("#lblTeammemberSelectlimitmanual").text("Select");
                    $("#closemanuallimit").click();
                    bind_MatterTypeDetails();
                }
                else if (response1.Data == "previousdate") {
                    alert("You can only set alert for the future date.");
                }
                else {
                    alert("Already Exist");
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

    /*Save limitation action*/
    $("#actionSaveLimitation").click(function () {
        var hidid = $("#hidid").val();
        var hidcaid = $("#hidcaid").val();
        var actfile = $("#actionattachmentcase").val();
        var sremarks = $("#sremarks").val();
        var formData = new FormData();
        formData.append("id", $("#hidid").val());
        formData.append("isaction", $("#actionDone").val());
        formData.append("actonremarks", sremarks);
        formData.append("hidcaid", $("#hidcaid").val());
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("actionattachmentcase").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("actionattachmentcase").files[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
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
            if (tempsize > filesize) {
                new PNotify({
                    title: 'Warning!',
                    text: Filesizelabel,
                    type: 'error',
                    delay: 3000
                });
                return false
            }
        }
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/UpdateCaseLimitationAction",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    alert("Successfully saved");
                    LoadUserGroupData(1);
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
    $("#linklimitationcalendar").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/LimitationCalendar");
    });
    $("#clearnewseach").click(function () {
        $("#search").val("");
        $("#btnSearch").click();
        $("#clearnewseach").css("display", "none");
    });
    $("#btnSearch").click(function () {
        $("#clearnewseach").css("display", "unset");
        search = $("#search").val();
        $("#tfooter").html("");
        var html3 = '';
        var formData = new FormData();
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        formData.append("subject", caseid);
        formData.append("search", search);
        openload();
        var lsdata = $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/ViewLimitationCasesBySearch",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#datalimitstatus").html("");
                }
                else {
                    $("#datalimitstatus").html("No result found !");
                    closeload();
                }
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
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
                        tfot += '<li ><input type="number" id="pagnumvalue" min="1"   class="footerInput"><a class="gobtn" type="button" id="getlcdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (a.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="lpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="lpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="lpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        $("#tfooter").append(tfot);
                    }
                    var id = a.id;
                    var LimitationApplicable = a.LimitationApplicable;
                    var Provision = a.Provision;
                    var StartDate = a.StartDate;
                    var DueDays = a.DueDays;
                    var Task = a.Task;
                    var Remarks = a.Remarks;
                    var Subject = a.Subject;
                    var caRemarks = a.caRemarks;
                    var AlertDate = a.AlertDate;
                    var setAlert = a.setAlert;
                    var CaId = a.CaId;
                    var IsAction = a.IsAction;
                    var IsFile = a.IsFile;
                    var Modify_date = a.Modify_date;
                    var duedayDetails = "";
                    if (Modify_date == null) {
                        Modify_date = "";
                    }
                    else {
                        Modify_date = formatDatetoIST(Modify_date);
                    }
                    if (AlertDate == null) { AlertDate = ""; }
                    if (caRemarks != "" && caRemarks != null) {
                        Remarks = caRemarks;
                    }
                    if (a.duedayDetails != "" && a.duedayDetails != null) {
                        duedayDetails = a.duedayDetails;
                    }
                    var ialert = 'No';
                    if (setAlert == 1)
                        ialert = 'Yes';
                    var iaction = 'No';
                    if (IsAction == 1)
                        iaction = 'Yes';
                    if (AlertDate != null) {
                        AlertDate = AlertDate.replace(', ', '<br><br>');
                    }
                    if (StartDate != null) {
                        StartDate = formatDatetoIST(StartDate);
                    }
                    var limit_Provision = LimitationApplicable + "<br/> " + Provision;
                    var edit = '<a data-toggle="tab" href="#" id="edtLimitation" onclick=fn_SetLimitation("' + id + '")><span class="glyphicon glyphicon-edit"></span></a>';
                    var action = '<input type="date" title="Enter start date of limitation period and press +" style="width:90%" id="limisdate' + id + '" onkeypress="return false;"/><a data-toggle="tab" href="#"    data onclick=AddLimitation("' + id + '")><span class="glyphicon glyphicon-plus"></span></a>';
                    if (IsAction == "1") {
                        html3 += '<tr id="trcolor">'
                    }
                    else {
                        html3 += '<tr>'
                    }
                    html3 += '<td class="lsubject">'
                    html3 += '<span id="clname">' + Subject + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lprovision">'
                    html3 += '<span id="clname">' + Provision + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="limitapl">'
                    html3 += '<span id="clname">' + limit_Provision + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="ltask">'
                    html3 += '<span id="clname">' + Task + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lduedays">'
                    html3 += '<span id="clname" >' + DueDays + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lremarks">'
                    html3 += '<span id="clname" >' + Remarks + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="lduedetails">'
                    html3 += '<span id="clname" >' + duedayDetails + '</span>'
                    html3 += '</td>'
                    html3 += '<td >'
                    html3 += '<span id="clname">' + action + '</span>'
                    html3 += '</td>'
                    html3 += '</tr>'
                });
                $("#bindLimitationcase").html("");
                $("#bindLimitationcase").append(html3);
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
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        $.when(lsdata).then(function (data, textStatus, jqXHR) {
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
            var formData = new FormData();
            formData.append("caseid", caseid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/LimitationApi/CaseCondonationCount",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data == 1) {
                        $('#condonation').prop('checked', true);
                    }
                    else {
                        $('#condonation').prop('checked', false);
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
    });
    $(document).on('change', '#ddate', function () {
        var date = new Date($("#ddate").val()),
            days = parseInt($("#hidDueDays").val(), 10);
        if (!isNaN(date.getTime())) {
            date.setDate(date.getDate() + days);
            $("#duedate").val(date.toInputFormat());
        } else {
            alert("Invalid Date");
        }
    });
    Date.prototype.toInputFormat = function () {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = this.getDate().toString();
        return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
    };
});

/*View saved limitation cases*/
function LoadSavedLimitations() {
    $("#tfooter").html("");
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("caseid", caseid);
    openload();
    var lsdata = $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/ViewSavedLimitationsCases",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#savelimitdiv").css("display", "block");
                $("#datalimitstatus").html("");
            }
            else {
                $("#savelimitdiv").css("display", "none");
                $("#datalimitstatus").html("No result found !");
                closeload();
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var id = a.id;
                var ClId = a.ClId;
                var LimitationApplicable = a.LimitationApplicable;
                var Provision = a.Provision;
                var StartDate = "";
                if (a.StartDate == "" || a.StartDate == "null" || a.StartDate == null) {
                    StartDate = "";
                }
                else {
                    StartDate = formatDatetoIST(a.StartDate);
                }
                var DueDate = a.DueDate;
                var Task = a.Task;
                var Remarks = a.Remarks;
                var Subject = a.Subject;
                var caRemarks = a.caRemarks;
                var AlertDate = a.AlertDate;
                var setAlert = a.setAlert;
                var CaId = a.CaId;
                var IsAction = a.IsAction;
                var IsFile = a.IsFile;
                var Modify_date = a.Modify_date;
                if (Modify_date == null) {
                    Modify_date = "";
                }
                else {
                    Modify_date = formatDatetoIST(Modify_date);
                }
                if (AlertDate == null) { AlertDate = ""; }
                if (caRemarks != "" && caRemarks != null) {
                    Remarks = caRemarks;
                }
                var ialert = 'No';
                if (setAlert == 1)
                    ialert = 'Yes';
                var iaction = 'No';
                if (IsAction == 1)
                    iaction = 'Yes';
                if (AlertDate != "") {
                    AlertDate = formatDatetoIST(AlertDate);
                }
                if (DueDate != null) {
                    DueDate = formatDatetoIST(DueDate);
                }
                var limit_Provision = LimitationApplicable + "<br/> " + Provision;
                var edit = '<a data-toggle="tab" href="#" id="edtLimitation" onclick=fn_SetLimitation("' + ClId + '")><span class="glyphicon glyphicon-bell"></span></a>';
                var action = '<a data-toggle="tab" href="#" id="actionLimitation"  data onclick=DeleteLimitation("' + id + '")><span class="glyphicon glyphicon-trash" style="color:red;"></span></a>';
                if (IsAction == "1") {
                    html3 += '<tr id="trcolor">'
                }
                else {
                    html3 += '<tr>'
                }
                html3 += '<td class="lCaseNo">'
                html3 += '<span id="clname">' + Subject + '</span>'
                html3 += '</td>'
                html3 += '<td class="lProvision">'
                html3 += '<span id="clname">' + Provision + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCasename">'
                html3 += '<span id="clname">' + LimitationApplicable + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCNRno">'
                html3 += '<span id="clname">' + StartDate + '</span>'
                html3 += '</td>'
                html3 += '<td class="lAlertdate">'
                html3 += '<span id="clname">' + AlertDate + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCourt">'
                html3 += '<span id="clname" >' + DueDate + '</span>'
                html3 += '</td>'
                html3 += '<td class="lCasetype">'
                html3 += '<span id="clname" >' + Task + '</span>'
                html3 += '</td>'
                html3 += '<td class="lDuedays">'
                html3 += '<span id="clname" >' + a.DueDays + '</span>'
                html3 += '</td>'
                html3 += '<td class="lStatus">'
                html3 += '<span id="clname" >' + Remarks + '</span>'
                html3 += '</td>'
                html3 += '<td class="lmodify">'
                html3 += '<span id="clname" >' + Modify_date + '</span>'
                html3 += '</td>'
                html3 += '<td >'
                html3 += '<span id="clname">' + action + ' | ' + edit + '</span>'
                html3 += '</td>'
                html3 += '</tr>'
            });
            $("#savedLimtationData").html("");
            $("#savedLimtationData").append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
            closeload();
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $.when(lsdata).then(function (data, textStatus, jqXHR) {
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });
        closeload();
        var formData = new FormData();
        formData.append("caseid", caseid);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/CaseCondonationCount",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == 1) {
                    $('#condonation').prop('checked', true);
                }
                else {
                    $('#condonation').prop('checked', false);
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
}

/*Add limitation cases*/
function AddLimitation(id) {
    var startdate = $("#limisdate" + id).val();
    if (startdate == "") {
        alert("please select start date");
        $("#limisdate" + id).focus();
        return false;
    }
    var r = confirm("Are you Sure you Want to Add this");
    if (r == true) {
        $("#hidid").val(id);
        var formData = new FormData();
        formData.append("id", id);
        formData.append("case", caseid);
        formData.append("startdate", startdate);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/CaseLimitationbyId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    var LimitationApplicable = a.LimitationApplicable;
                    var Provision = a.Provision;
                    var StartDate = a.CaseStartDate;
                    var DueDays = a.DueDays;
                    var Task = a.Task;
                    var id = a.Id;
                    var Remarks = a.Remarks;
                    var caid = a.caid;
                    var caRemarks = a.caRemarks;
                    var AlertDate = a.AlertDate;
                    var spltdate = StartDate.split('T')[0];
                    var reminderdate = AlertDate;
                    $("#ddate").val(spltdate);
                    if (caRemarks != null)
                        Remarks = caRemarks;
                    var setalert = a.setAlert;
                    if (setalert == 1) {
                        document.getElementById("setalert").checked = true;
                    }
                    var dduedate = a.DueDate == null ? "" : formatDatetoIST(a.DueDate.split('T')[0]);
                    var formData2 = new FormData();
                    formData2.append("ClId", id);
                    formData2.append("DueDate", dduedate);
                    formData2.append("caseid", caseid);
                    formData2.append("Remarks", Remarks);
                    formData2.append("startdate", startdate);
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: "/api/LimitationApi/SaveCaseLimtationAlert",
                        dataType: 'json',
                        data: formData2,
                        contentType: false,
                        processData: false,
                        success: function (response2) {
                            console.log(response2);
                            if (response2.Status == true) {
                                alert("Successfully saved");
                                LoadSavedLimitations();
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
                if ($("#hidcaid").val() != "") {
                    BindAlertusers($("#hidid").val());
                    BindAlertDatebyClId($("#hidid").val());
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
}

/*Delete limitation*/
function DeleteLimitation(id) {
    var r = confirm("Are you Sure to Delete?");
    if (r != true) {
        return;
    }
    var formData2 = new FormData();
    formData2.append("id", id);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/DeleteCaseLimtationAlert",
        dataType: 'json',
        data: formData2,
        contentType: false,
        processData: false,
        success: function (response2) {
            if (response2.Status == true) {
                alert("Successfully Removed");
                LoadSavedLimitations();
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
/*Set limitation*/
function fn_SetLimitation(id) {
    $("#divusergroupLabel").html("");
    var lblusergroup = '<h4 class="modal-title" id="myModalLabel">Set Action - Period of Limitation</h4>';
    $("#divusergroupLabel").html(lblusergroup);
    $("#modalLimitation").modal();
    $("#hidid").val(id);
    $("#bindalertdate").html("");
    $("#bindalertuser").html("");
    GetCaseLimitation_id(id);
    Assignuser();
}
$(document).on('click', '#fn_SetLimitationmanual', function () {
    $("#lblTeammemberSelectlimitmanual").text("Select");
    $("#divusergroupLabelmanual").html("");
    var lblusergroup = '<h4 class="modal-title" id="myModalLabel">Set Action - Period of Limitation</h4>';
    $("#divusergroupLabelmanual").html(lblusergroup);
    $("#modalLimitationmanual").modal();
    $("#hididmanual").val($(this).attr("ids"));
    $("#bindalertdate").html("");
    $("#bindalertuser").html("");
    $("#chkdateml").val($(this).attr("data-duedays"));
    GetCaseLimitationmanual_id($(this).attr("ids"));
    Assignuser();
});

/*Get Case Limitation manual by id*/
function GetCaseLimitationmanual_id(id) {
    $("#hididml").val(id);
    var html3 = '';
    var formData = new FormData();
    formData.append("id", id);
    formData.append("case", caseid);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/CaseLimitationmanualbyId",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var id = a.Id;
                var caseaid = a.Caseid;
                var Remarks = a.vDesc;
                var StartDate = a.StartDate;
                var StartDate = StartDate.split('T')[0];
                var StartDate = StartDate == null ? "" : StartDate.split('T')[0];
                var LimitationDate = a.LimitationDate;
                var LimitationDate = LimitationDate.split('T')[0];
                var LimitationDate = LimitationDate == null ? "" : formatDatetoIST(LimitationDate.split('T')[0]);
                //var reminderdate = AlertDate;
                if (Remarks != null)
                    Remarks = Remarks;
                $("#Remarksml").val(Remarks);
                $("#hididml").val(id);
                $("#hidcaidml").val(caseaid);
                $("#ddateml").val(StartDate);
                $("#duedateml").val(LimitationDate);
            });
            BindAlertusers($("#hididml").val(), 1);
            BindAlertDatebyClId($("#hididml").val(), 1);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

/*Get Case Limitation by id*/
function GetCaseLimitation_id(id) {
    $("#hidid").val(id);
    var html3 = '';
    var formData = new FormData();
    formData.append("id", id);
    formData.append("case", caseid);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/CaseLimitationbyId",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var LimitationApplicable = a.LimitationApplicable;
                var Provision = a.Provision;
                var StartDate = a.CaseStartDate;
                var DueDays = a.DueDays;
                var Task = a.Task;
                var id = a.Id;
                var Remarks = a.Remarks;
                var caid = a.caid;
                var caRemarks = a.caRemarks;
                var AlertDate = a.AlertDate;
                var spltdate = StartDate.split('T')[0];
                var reminderdate = AlertDate;
                $("#ddate").val(spltdate);
                if (caRemarks != null)
                    Remarks = caRemarks;
                var setalert = a.setAlert;
                if (setalert == 1) {
                    document.getElementById("setalert").checked = true;
                }
                var dduedate = a.DueDate == null ? "" : formatDatetoIST(a.DueDate.split('T')[0]);
                $("#LimitationApplicable").val(LimitationApplicable);
                $("#Provision").val(Provision);
                $("#sremarks").val(Remarks);
                $("#Remarks").val(Remarks);
                $("#hidid").val(id);
                $("#hidcaid").val(caid);
                $("#duedate").val(dduedate);
                $("#hidDueDays").val(DueDays);
            });
            if ($("#hidcaid").val() != "") {
                BindAlertusers($("#hidid").val());
                BindAlertDatebyClId($("#hidid").val());
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

/*Bind Alert users*/
function BindAlertusers(cval, manualmodule = null) {
    var html3 = '';
    var formData = new FormData();
    formData.append("clid", cval);
    formData.append("case", caseid);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/AlertUsersbyClId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $.each(response.Data, function (i, a) {
                var name = a.cfname;
                var mobile = a.cmobile;
                var email = a.EmailId;
                html3 += '<tr><td>' + name + '</td><td>' + email + '</td><td>' + mobile + '</td></tr>';
            });
            if (manualmodule == "1") {
                $("#bindalertusermanual").html("");
                $("#bindalertusermanual").append(html3);
            }
            else {
                $("#bindalertuser").html("");
                $("#bindalertuser").append(html3);
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
function BindAlertDatebyClId(cval, manualmodule = null) {
    //alert(cval);
    var html3 = '';
    var formData = new FormData();
    formData.append("clid", cval);
    formData.append("caseid", caseid);
    $("#bindalertdate").html("");
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/CaseLimitationAlertDatebyClId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $.each(response.Data, function (i, a) {
                var duedate = a.DueDate;
                var alertdate = a.AlertDate;
                var dduedate = duedate == null ? "" : formatDatetoIST(duedate.split('T')[0]);
                var reminderdate = alertdate == null ? "" : formatDatetoIST(alertdate.split('T')[0]);
                if (reminderdate != "") {
                    html3 += '<tr><td>' + dduedate + '</td><td>' + reminderdate + '</td></tr>';
                }
            });
            if (manualmodule == "1") {
                $("#bindalertdatemanual").html("");
                $("#bindalertdatemanual").append(html3);
            }
            else {
                $("#bindalertdate").html("");
                $("#bindalertdate").append(html3);
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

/*Set action limitation*/
function fn_SetLimitationAction(id) {
    $("#modalactionLimitation").modal();
    $("#hidid").val(id);
    GetCaseLimitation_id(id);
    function GetCaseLimitation_id(id) {
        $("#hidid").val(id);
        var html3 = '';
        var formData = new FormData();
        formData.append("id", id);
        formData.append("case", caseid);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/LimitationApi/CaseLimitationbyId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    debugger;
                    var LimitationApplicable = a.LimitationApplicable;
                    var Provision = a.Provision;
                    var StartDate = a.StartDate;
                    var DueDays = a.DueDays;
                    var Task = a.Task;
                    var id = a.Id;
                    var Remarks = a.Remarks;
                    var caid = a.caid;
                    var caRemarks = a.caRemarks;
                    var AlertDate = a.AlertDate;
                    var IsAction = a.IsAction;
                    var dduedate = a.DueDate == null ? "" : formatDatetoIST(a.DueDate.split('T')[0]);
                    $("#actionLimitationApplicable").val(LimitationApplicable);
                    $("#actionProvision").val(Provision);
                    $("#hidid").val(id);
                    $("#hidcaid").val(caid);
                    $('#actionDone option[value="' + IsAction + '"]').attr("selected", true);
                    $("#dduedate").val(dduedate);
                    $("#sremarks").text(a.ActionRemark);
                });
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
}

/*Assign case users*/
function Assignuser() {
    var html3 = '';
    var html4 = '';
    var formData = new FormData();
    formData.append("token", caseid);
    $.ajax(
        {
            type: "POST",
            url: "/api/callApi/caseAssignUser", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            //},
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    html3 += '<li><input id="chkUsergroup" type="checkbox" class="shcheckbox1" name="fname" value="' + a["val"] + '"><a href="#" class="dropdown-item">' + a["label"] + '</a></li>'
                    html4 += '<li><input id="chkUsergroupml" type="checkbox" class="shcheckbox1" name="fname" value="' + a["val"] + '"><a href="#" class="dropdown-item">' + a["label"] + '</a></li>'
                });
                $("#rUsers,#rUsersml").html("");
                $("#rUsers").append(html3);
                $("#rUsersml").append(html4);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
bind_MatterTypeDetails();
/*Bind matter type by case id*/
function bind_MatterTypeDetails() {
    var formData = new FormData();
    formData.append("caseid", caseid);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/GetLimitationManualData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var mydata = response.Data;
            var html = "";
            $("#savedLimtationManualData").empty();
            $.each(mydata, function (i, item) {
                var AlertDate = "";
                var StartDate = item.StartDate.split('T')[0];
                var LimitationDate = item.LimitationDate.split('T')[0];
                var diffInDays = "";
                try {
                    AlertDate = item.AlertDate.split('T')[0];
                    diffInDays = datediff(new Date(item.AlertDate.split('T')[0]), new Date(item.LimitationDate.split('T')[0]))
                }
                catch
                {
                    AlertDate = "";
                    diffInDays = "";
                }
                if (AlertDate == "1900-01-01") {
                    AlertDate = "";
                    diffInDays = "";
                }
                var Description = item.vDesc;
                html += "<tr>";
                html += "<td>" + StartDate + "</td>";
                html += "<td>" + LimitationDate + "</td>";
                html += "<td>" + AlertDate + "</td>";
                html += "<td>" + diffInDays + "</td>";
                html += "<td>" + Description + "</td>";
                html += "<td><span class='glyphicon glyphicon-trash' id='deleteLimitationManualData' style='color:red;cursor:pointer;' title='Remove Mannual Limitation' id-val=" + item.Id + "></span> | <span class='glyphicon glyphicon-bell' id='fn_SetLimitationmanual' style='color:#069;cursor:pointer;' title='Set alert' ids=" + item.Id + " data-duedays=" + diffInDays + "></span></td>";
                html += "<tr>";
            });
            $("#savedLimtationManualData").append(html);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
function fn_limitation_btnsave() {
    var sd1 = $("#fStartDate").val();
    var rd1 = $("#fLimitationDate").val();
    var rd3 = $("#fDescription").val();
    if (sd1 == "") {
        alert("Select start date");
        $("#fStartDate").focus();
        return false;
    }
    if (rd1 == "") {
        alert("Select Limitation date");
        $("#fLimitationDate").focus();
        return false;
    }
    var formData = new FormData();
    formData.append("caseid", caseid);
    formData.append("fStartDate", $("#fStartDate").val());
    formData.append("fLimitationDate", $("#fLimitationDate").val());
    formData.append("fDateSatisfied", $("#fDateSatisfied").val());
    formData.append("fReminder", "");
    formData.append("fDescription", $("#fDescription").val());
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/LimitationApi/PostSaveLimitationData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                alert("Successfully saved");
                $('#manuallimitform')[0].reset();
                $("#manuallimitclosemodel").click();
                bind_MatterTypeDetails();
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