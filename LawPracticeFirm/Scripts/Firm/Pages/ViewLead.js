$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    /*Export lead detail in excel*/
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoExcelLeadList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Export lead detail in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoPdfLeadList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    function checkEmail(email) {
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
                    url: '/firm/SendPropsectData',
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
                    },
                    error: function (response) {
                        closeload();
                        //  alert(response.responseText);
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
        closeload();
    }
    /*View single lead by serial number*/
    $(document).on("click", "#transferpage", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hid" + serial).val();
        var urls = "/" + fcode + "/Firm/LeadSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $("#linklead").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateLead");
    });
    $("#btnImport").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/ImportLead");
    });
    $(document).on("click", "#addleadcall", function () {
        var lids = $(this).attr("val-data");
        $("#textleadid").text(lids);
        loadleadcalls();
        $('#myModalleadcall').modal({ show: true });
    });
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=Lead&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    /*Load lead calls*/
    function loadleadcalls() {
        $("#assignuserdata").html("");
        $("#calldatastatus").html("");
        var html = '';
        var leadid = $("#textleadid").text();
        var formData = new FormData();
        formData.append("leadid", leadid);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadLeadCalls",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                if (response1.Data == "[]") {
                    $("#calldatastatus").html("No Call Details available");
                }
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td>' + qty1 + '</td><td>' + a.leadname + '</td><td>' + a.Calltype + '</td><td>' + formatDatetoIST(a.date_time) + " " + String(a.date_time).substring(11, 19) + '</td><td>' + a.Details + '</td><td>' + a.UserName + '</td></tr>';
                });
                $("#assignuserdata").append(html);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    $("#saveleadcall").click(function () {
        try {
            var formData = new FormData();
            var lidsid = $("#textleadid").text();
            var calltype = $("#calltype").val();
            var calldetails = $("#calldetails").val();
            if (calltype == "") {
                new PNotify({
                    title: 'Warning!',
                    text: ' Please Select Call Type',
                    type: 'error',
                    delay: 3000
                });
                return false;
            }
            if (calldetails == "") {
                new PNotify({
                    title: 'Warning!',
                    text: 'Call Description Can not be blank',
                    type: 'error',
                    delay: 3000
                });
                return false;
            }
            formData.append("lidsid", lidsid);
            formData.append("calltype", calltype);
            formData.append("calldetails", calldetails);
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/CallApi/PostSaveLeadCall", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        var datas = JSON.stringify(data);
                        loadleadcalls();
                        $("#saveleadcallform")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: 'Prospect Call Saved Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        loadtabledata();
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
        catch (err) {
            alert(err.message);
            closeload();
        }
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedIDSync = new Array();
    /*Save Sync Row Data*/
    $(document).on("click", "#syncrqst", function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", "lead");
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
                            loaddatalist(pageindex);
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
    var selectedID = new Array();
    $(document).on("click", "#delete", function () {
        selectedID = [];
        deletecontact();

        /*Delete contact*/
        function deletecontact() {
            var result = confirm("Are you sure to delete prospect?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/LeadApi/RemoveLead',
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
                                    text: ' Prospect Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadtabledata();
                                $('.pagination').hide();
                                $('#maxRows option').prop('selected', function () {
                                    return this.defaultSelected;
                                });
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
                        text: 'You have not selected any row to delete?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    if (type == "7") {
        $("#updatePanel").css("display", "block");
    }
    else {
        $("#updatePanel").css("display", "hide");
    }
    openload();
    loadtabledata();

    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    loaddatalist(pageindex);
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
    var chksflag = true;
    /*Load detail list*/
    $("#searchdatas").click(function () {
        $("#searchdatas").attr("disabled", true);
        exportfilter = true;
        loaddatalist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                exportfilter = false;
                loaddatalist(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    //load table data
    var countcustomfoeld = "";
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        var sorts = 15;
        $table = $('<table id="example" border="1px solid" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        var rt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployees1',
            headers: {
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $header = $('<thead  >').html('');
                    $head1 = $('<th bgcolor="DIMGRAY"><input type="checkbox" id="select_all"/></th><th bgcolor="DIMGRAY" class="ldn" onclick="sortTable(1)">Prospect Name <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldp" onclick="sortTable(2)">Contact Person <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldorg" onclick="sortTable(3)">Organization <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldmob" onclick="sortTable(4)">Mobile <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldemail"  onclick="sortTable(5)">Email <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="lddate" onclick="sortTable(6)">Date <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="addcall">Action</th><th bgcolor="DIMGRAY" class="docs">Documents</th><th bgcolor="DIMGRAY" class="lddesign" onclick="sortTable(9)">Designation <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldcity" onclick="sortTable(10)">City <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldstate" onclick="sortTable(11)">State <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldcase" onclick="sortTable(12)">Case Type <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldsource" onclick="sortTable(13)">Source <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldcat" onclick="sortTable(14)">Category <span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" class="ldltype" onclick="sortTable(15)">Prospect Type <span class="fa fa-sort pull-right"></span></th> ');
                    $header.append($head1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        sorts = sorts + 1;
                        $header.append('<th bgcolor="DIMGRAY" style="text-align: center; padding-top: 12px;" class="class' + q1 + '" onclick="sortTable(' + sorts + ')">' + val.FieldName + ' <span class="fa fa-sort pull-right"></span></th>');
                    });
                    $header.append('</thead>');
                    $table.append($header);
                    $table.append('<tbody style="clear:both" id="loadactivitydatas">');
                    $('#updatePanel').html($table);
                }
                else {
                    alert("not found");
                }
            },
            error: function () {
                alert('Error!23');
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            loadmenu();
            loaddatalist(pageindex);
        });
    }
    /*Load lead data by row id*/
    flaghide = true;
    function loaddatalist(pageindex) {
        var qty1 = 0;
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        var ajaxTime = new Date().getTime();
        var ld12 = $.ajax({
            async: true,
            url: '/api/LeadApi/SpLeadDataByRowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("LeadData:" + totalTime);
                $("#tfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    // alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                }
                else {
                    $("#datastatus").html("No result found !");
                }
                var calldate = "";
                var it = 2;
                var leadtype = [];
                $("#le").html("");
                $("#le").append("<option value=''>Select</option>");
                var source = [];
                $("#se").html("");
                $("#se").append("<option value=''>Select</option>");
                var state = [];
                $("#ste").html("");
                $("#ste").append("<option value=''>Select</option>");
                var city = [];
                $("#cty").html("");
                $("#cty").append("<option value=''>Select</option>");
                var category = [];
                $("#cy").html("");
                $("#cy").append("<option value=''>Select</option>");
                var casetype = [];
                $("#ct").html("");
                $("#ct").append("<option value=''>Select</option>");
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
                        tfot += '<table style="width:100%;background:white"><tr><td colspan = "12">'
                        tfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + pageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + val.rownum + '</b> of <b style="font-size:12px;">' + val.totRow + ' Entries</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  style="width: 30px;"><button type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button>'
                        tfot += '</div>'
                        tfot += '<div style="float:right;">'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        tfot += '</td >'
                        tfot += '</tr >'
                        $("#tfooter").append(tfot);
                        closeload();
                    }
                    qty1 = qty1 + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty1 + '" value="' + val.lid + '">')
                    if (val.ldltype != null) {
                        if (leadtype.indexOf(val.ldltype) == -1) {
                            $('#le').append($("<option></option>").attr("value", val.ldltype).text(val.ldltype));
                            leadtype.push(val.ldltype);
                        }
                    }
                    if (val.ldctype != null) {
                        if (casetype.indexOf(val.ldctype) == -1) {
                            $('#ct').append($("<option></option>").attr("value", val.ldctype).text(val.ldctype));
                            casetype.push(val.ldctype);
                        }
                    }
                    if (val.ldcategory != null) {
                        if (category.indexOf(val.ldcategory) == -1) {
                            $('#cy').append($("<option></option>").attr("value", val.ldcategory).text(val.ldcategory));
                            category.push(val.ldcategory);
                        }
                    }
                    if (val.ldcity != null) {
                        if (city.indexOf(val.ldcity) == -1) {
                            $('#cty').append($("<option></option>").attr("value", val.ldcity).text(val.ldcity));
                            city.push(val.ldcity);
                        }
                    }
                    if (val.ldstate != null) {
                        if (state.indexOf(val.ldstate) == -1) {
                            $('#ste').append($("<option></option>").attr("value", val.ldstate).text(val.ldstate));
                            state.push(val.ldstate);
                        }
                    }
                    if (val.ldsource != null) {
                        if (source.indexOf(val.ldsource) == -1) {
                            $('#se').append($("<option></option>").attr("value", val.ldsource).text(val.ldsource));
                            source.push(val.ldsource);
                        }
                    }
                    if (val.topcalldate != null) {
                        calldate = "(" + formatDatetoIST(val.topcalldate) + " " + String(val.topcalldate).substring(11, 19) + ")";
                    }
                    else {
                        calldate = "";
                    }
                    if (val.lddocs == null) {
                        ldshcss = "display:none";
                    }
                    else if (val.lddocs == "") {
                        ldshcss = "display:none";
                    }
                    else {
                        ldshcss = "display:unset";
                    }
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr />');
                    $row.append($('<td class="s" />').html("<span>&nbsp;<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.lid + "'/>"));
                    $row.append($('<td class="ldn" />').html("<a name=" + val.ldname + "  id='transferpage' href='javascript:void()' sno=" + qty1 + "><span>" + (val.ldname != "" ? val.ldname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="ldp" />').html("<span>" + (val.ldcperson != null ? val.ldcperson : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ldorg" />').html("<span>" + (val.ldorg != null ? val.ldorg : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldmob" />').html("<span>" + (val.ldmob != null ? val.ldmob : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldemail" />').html("<span>" + (val.ldemail != null ? val.ldemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="lddate" />').html("<span  name='" + val.date_time + "'>" + (val.date_time != null ? formatDatetoIST(val.date_time) : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="55" />').html("<span><button type='button' val-data='" + val.lid + "' id='addleadcall'  title='Prospect call' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-earphone'></span>&nbsp; </button> " + calldate + ""));
                    $row.append($('<td class="docs" align="center" />').html("<span>" + "<center><a class='btn btn-primary btn-sm ' title='Prospect documents' style='cursor:pointer;" + ldshcss + "' id='filelink'  data-val=" + val.lddocs + "  id-val=" + val.lid + "><span class='glyphicon glyphicon-folder-open'></span>&nbsp;</center></a>"));
                    $row.append($('<td class="lddesign" />').html("<span>" + (val.lddesign != null ? val.lddesign : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldcity" />').html("<span>" + (val.ldcity != null ? val.ldcity : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldstate" />').html("<span>" + (val.ldstate != null ? val.ldstate : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldcase" />').html("<span>" + (val.ldctype != null ? val.ldctype : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldsource" />').html("<span>" + (val.ldsource != null ? val.ldsource : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldcat" />').html("<span>" + (val.ldcategory != null ? val.ldcategory : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ldltype" />').html("<span>" + (val.ldltype != null ? val.ldltype : '<span style="">&nbsp;</span>')));
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
                                $row.append($('<td class="class13" />').html("<span>" + checkdatetimecustom(val.col11)));
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
            error: function () {
                alert('Error!');
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            $("input:checkbox").click(function () {
                var column = "table ." + $(this).attr("name");
                $(column).toggle();
            });
            closeload();
        });
    }
    function hideEmptyCols(table) {
        //counti # of columns
        var numCols = $("th", table).length;
        //   alert(numCols);
        for (var i = 1; i <= 24; i++) {
            var empty = true;
            //grab all the <td>'s of the column at i
            $("td:nth-child(" + i + ")", table).each(function (index, el) {
                //check if the <span> of this <td> is empty
                if ($("span", el).text() != "") {
                    empty = false;
                    return false; //break out of each() early
                }
            });
            if (empty) {
                //if()
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
                // $("th:nth-child(" + i + ")", table).hide(); //hide header <th>
            }
        }
    }
    var q = 2;
    //  loadmenu();
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            //url: '/api/Demo/SpColMaps1', '
            url: '/api/demo/FirmEmployees1',
            headers: {
                // 'fid': type
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $.each(obj, function (i, a) {
                    q = q + 1;
                    var option = '<li><a href="#" class="small" data-value="option' + q + '" tabIndex="-1"><input  type="checkbox"  name="class' + q + '" >' + a["FieldName"] + '</a></li>';
                    $("#bd").append(option);
                }); //End of foreach Loop
                var options = [];
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $("#example tr td").each(function () {
        //  alert("gi");
    });

});
