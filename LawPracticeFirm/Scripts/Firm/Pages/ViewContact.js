$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    /*Exprt contact in excel*/
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoExcelContact?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Exprt contact in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoPdfContact?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })

    /*View single contact*/
    $(document).on("click", "#transferpage", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hid" + serial).val();
        var urls = "/" + fcode + "/Firm/ContactSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    $(document).on("click", "#editcontact", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hid" + serial).val();
        var urls = "/" + fcode + "/Firm/ContactSingleEdit";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
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
                    url: '/firm/SendContactData',
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
                    error: function () {
                        closeload();
                    }
                });
            }
        });
    }
    catch (er) {
        closeload();
    }
    $("#linkcontact").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/Configcontact/contact");
    });
    $("#btnImport").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/ImportContact");
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedIDSync = new Array();
    /*Save Sync Row Data*/
    $(document).on("click", "#syncrqst", function () {
        selectedIDSync = [];
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                selectedIDSync.push($(this).val());
            }
        });
        if (JSON.stringify(selectedIDSync) == "[]") {
            new PNotify({
                title: 'Warning',
                text: 'You have not selected any row to sync?',
                type: 'error',
                delay: 3000
            });
            return false;
        }
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
                            loadtabledata();
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
        /*Delete contact details*/
        function deletecontact() {
            var result = confirm("Are you sure to delete Contact?");
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
                        url: '/api/demo/RemoveContact',
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
                                    text: ' Contact Removed Successfully',
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
    var fselectedID = new Array();
    $(document).on("click", "#linkFav", function () {
        fselectedID = [];
        Favcontact();
        /*Load fav contact*/
        function Favcontact() {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    fselectedID.push($(this).val());
                }
            });
            if (JSON.stringify(fselectedID) == "[]") {
                new PNotify({
                    title: 'Warning',
                    text: 'You do not have selected any row to add in favourite?',
                    type: 'error',
                    delay: 3000
                });
                return false;
            }
            var result = confirm("Are you sure to add contact to favourite ?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        fselectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(fselectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/demo/FavContact',
                        data: JSON.stringify(fselectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            fselectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Contact added successfully in favourite.',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                $('input:checkbox.checkbox').each(function () {
                                    $(this).prop('checked', false);
                                });
                                closeload();
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' You are not Authotized, add to favourite this Contact!',
                                    type: 'error',
                                    delay: 2000
                                });
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
                        text: 'You do not have selected any row to add in favourite?',
                        type: 'error',
                        delay: 3000
                    });
                }
            }
        }
    });
    /*Loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    if (type == "7") {
        $("#updatePanel").css("display", "block");
    }
    else {
        $("#updatePanel").css("display", "hide");
    }
    loadtabledata();
    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        // alert(search);
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
                    loadcontactlist(pageindex);
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
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        exportfilter = true;
        loadcontactlist(1);
        chksflag = true;
    });

    /*Search data on key up*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loadcontactlist(1);
                exportfilter = false;
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loadcontactlist(pageindex);
    });

    //load table data  
    openload();
    var countcustomfoeld = "";
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        var sort = 10;
        $table = $('<table id="example" border="1px solid"  class="" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
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
                    $header = $('<thead>').html('');
                    $head1 = $('<th bgcolor="DIMGRAY"  ><input type="checkbox" id="select_all"/></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY" bgcolor="DIMGRAY"  class="fname" onclick="sortTable(1)">First Name <span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"   onclick="sortTable(2)" class="mname"><span style="padding-right: 10px !important;">Middle Name</span><span class="fa fa-sort pull-right" ></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"  onclick="sortTable(3)" class="lname"><span style="padding-right: 10px !important;">Last Name</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"   onclick="sortTable(4)" class="mobno"><span style="padding-right: 10px !important;">Mobile</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"   onclick="sortTable(5)" class="ContactType"><span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"  onclick="sortTable(6)" class="cemail"><span style="padding-right: 10px !important;">Email</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"   onclick="sortTable(7)" class="auser"><span style="padding-right: 20px !important;">Assign To</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"  onclick="sortTable(8)" class="tags"><span style="padding-right: 20px !important;">Tags</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"  onclick="sortTable(9)" class="cadd1"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"><th bgcolor="DIMGRAY"  onclick="sortTable(10)"class="cweb"><span style="padding-right: 10px !important;">Website</span><span class="fa fa-sort pull-right"></span></th bgcolor="DIMGRAY"> ');
                    $header.append($head1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        sort = sort + 1;
                        $header.append('<th bgcolor="DIMGRAY" onclick="sortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" class="class' + q1 + '">' + val.FieldName + ' <span class="fa fa-sort pull-right"></span></th>');
                    });
                    $header.append('<th bgcolor="DIMGRAY" onclick="sortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" >Action</th>');
                    $header.append('</thead>');
                    $table.append($header);
                    $table.append('<tbody style="clear:both" id="loadactivitydatas">');
                    $('#updatePanel').html($table);
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
            loadmenu();
            loadcontactlist(pageindex);
        });
    }
    flaghide = true;
    /*Load contact list*/
    function loadcontactlist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        var ajaxTime = new Date().getTime();
        var ld12 = $.ajax({
            async: true,
            url: '/api/Demo/SpContactData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#tfooter").html("");
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
                    $("#datastatus").html("");
                    closeload();
                }
                else {
                    $("#datastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var usedNames = [];
                $("#fassign").html("");
                $("#fassign").append("<option value=''>Assign-All User</option>");
                var fusedNames = [];
                $("#fcontactType").html("");
                $("#fcontactType").append("<option value=''>Contact Type-All</option>");
                var firstvalue = 0;
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
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    if (usedNames.indexOf(val.assignuser) == -1) {
                        if (String(val.assignuser) != "") {
                            $("#fassign").append("<option value=" + val.assignuser + ">" + val.assignuser + "</option>");
                            usedNames.push(val.assignuser);
                        }
                    }
                    if (val.ContactType != "") {
                        if (fusedNames.indexOf(val.ContactType) == -1) {
                            if (String(val.ContactType) != "") {
                                $("#fcontactType").append("<option value=" + val.ContactType + ">" + val.ContactType + "</option>");
                                fusedNames.push(val.ContactType);
                            }
                        }
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
                    $row.append($('<td class="s" />').html("<span>&nbsp;<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    $row.append($('<td class="fname" />').html("<a name=" + val.fname + " id='transferpage' href='javascript:void()' sno=" + qty + "><span>" + (val.fname != "" ? val.fname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="mname" />').html("<span>" + (val.mname != null ? val.mname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="lname" />').html("<span>" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="mobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="contacttype" />').html("<span>" + (val.ContactType != null ? val.ContactType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="cemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span >&nbsp;</span>')));
                    $row.append($('<td class="auser" />').html("<span>" + (val.assignuser != null ? val.assignuser : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="tags" />').html("<span>" + (val.ctags != null ? val.ctags : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="cadd1" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="cweb" />').html("<span>" + (val.cwebsite != null ? val.cwebsite : '<span style="">&nbsp;</span>')));
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
                    $row.append($('<td class="55" />').html("<span><button type='button' title='Click here to assign Contact' sno=" + qty + " id='editcontact' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-pencil'></span>&nbsp; </button>&nbsp;"));
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
            $("input:checkbox").click(function () {
                var column = "table ." + $(this).attr("name");
                $(column).toggle();
            });
            closeload();
        });
    }
    function hideEmptyCols(table) {
        //  alert(table);
        //counti # of columns
        var numCols = $("th", table).length;
        //   alert(numCols);
        for (var i = 1; i <= numCols; i++) {
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
                // alert("hi");
                //if()
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
                // $("th:nth-child(" + i + ")", table).hide(); //hide header <th>
            }
        }
    }
    var q = 2;
    /*Load menu*/
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/demo/FirmEmployees1',
            headers: {
                'configurationtype': type
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
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $.each(obj, function (i, a) {
                    q = q + 1;
                    var option = '<li><a href="#" class="small" data-value="option' + q + '" tabIndex="-1"><input  type="checkbox"  name="class' + q + '" >' + a["FieldName"] + '</a></li>';
                    $("#bd").append(option);
                }); //End of foreach Loop
                var options = [];

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
    $("#example tr td").each(function () {
        //  alert("gi");
    });
});
