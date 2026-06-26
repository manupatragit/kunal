$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/employee/ExportoExcelClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/employee/ExportoPdfClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Send to client login*/
    $(document).on("click", "#sendlogin", function () {
        var result = confirm("Are you sure to send  " + clientlable + "  crediantials to mail?");
        if (result) {
            var clienid = $(this).attr("data-val");
            var formdata = new FormData();
            formdata.append("ctoken", clienid);
            openload();
            $.ajax({
                async: true,
                url: '/api/CallApi/SendClientLogin',
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
                            text: '' + clientlable + '  crediantials has been sent successfully.',
                            type: 'success',
                            delay: 3000
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
    });
    /*Transfer pages*/
    $(document).on("click", "#transferpage", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hid" + serial).val();
        var urls = "/" + fcode + "/Firm/ClientProfileDashboard";
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
                $.ajax({
                    async: true,
                    url: '/firm/SendClientList',
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
                    },
                    error: function () {
                        alert('Error!');
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
    }
    $("#linkclient").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateClient");
    });
    $(document).on("click", "#addleadcall", function () {
        var lids = $(this).attr("val-data");
        $("#textleadid").text(lids);
        loadleadcalls();
        $('#myModalleadcall').modal({ show: true });
    });
    /*Load lead details*/
    function loadleadcalls() {
        $("#assignuserdata").html("");
        $("#calldatastatus").html("");
        var html = '';
        var leadid = $("#textleadid").text();
        var formData = new FormData();
        formData.append("leadid", leadid);
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
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();
    /*Enable client*/
    $(document).on("click", "#enable", function () {
        selectedID = [];
        enableclient()();
        function enableclient() {
            var result = confirm("Are you sure to  Enable Account?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
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
                                    text: ' ' + clientlable + '  Account Activated Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadtabledata();
                                $('.pagination').hide();
                                $('#maxRows option').prop('selected', function () {
                                    return this.defaultSelected;
                                });
                            }
                            else {
                            }
                        },
                        error: function () {
                            alert('Error!');
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
                }
            }
        }
    });
    /*Select all client list*/
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();
    /*Disable client*/
    $(document).on("click", "#disable", function () {
        selectedID = [];
        enableclient()();
        function enableclient() {
            var result = confirm("Are you sure to  Disable Account?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
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
                                    text: '' + clientlable + '  Account  De-activated  Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadtabledata();
                                $('.pagination').hide();
                                $('#maxRows option').prop('selected', function () {
                                    return this.defaultSelected;
                                });
                            }
                            else {
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' You do not have selected any row to to De-activate  Account ?',
                        type: 'error',
                        delay: 3000
                    });
                }
            }
        }
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    loadtabledata();

    /*Search data*/
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
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        exportfilter = true;
        loaddatalist(1);
    });
    /*Search data on keyup*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            exportfilter = false;
            loaddatalist(1);
        }
    });
    /*Pagination*/
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    /*Load table data*/
    function loadtabledata() {
        openload();
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example"   border="1px solid" style="overflow-x:auto;" />').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('');
        $head1 = $('<th><input type="checkbox" id="select_all"/></th><th bgcolor="DIMGRAY"class="cname" onclick="sortTable(1)">' + clientlable + ' Name <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="username" onclick="sortTable(2)">Login UserName <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="email" onclick="sortTable(3)">Email <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="mobile" onclick="sortTable(4)">Mobile <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="date_time" width="10%" onclick="sortTable(5)">Date <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="photo">Profile Image</th><th bgcolor="DIMGRAY"class="status1" onclick="sortTable(7)">Status <span class="fa fa-sort "></th> <th bgcolor="DIMGRAY"class="address" onclick="sortTable(8)">Adddress <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="city" onclick="sortTable(9)">City <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="state" onclick="sortTable(10)">State <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="country" onclick="sortTable(11)">Country <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="landline" onclick="sortTable(12)">Landline <span class="fa fa-sort "></th><th bgcolor="DIMGRAY"class="calls">Action </th>');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $('#updatePanel').html($table);
        setTimeout(function () {
            loaddatalist(pageindex);
        }, 1000);
    }
    flaghide = true;
    /*Client user data by rowid*/
    function loaddatalist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        $.ajax({
            async: true,
            url: '/api/CallApi/SpClientDatabyuserrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#tfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                }
                else {
                    $("#datastatus").html("No result found !");
                }
                var it = 2;
                var bclass = '';
                var bdata = '';
                var qty = 0;
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
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.LoginId + '">')
                    if (val.IsActive == true) {
                        bclass = "label label-success";
                        bdata = "Enabled";
                    }
                    if (val.IsActive == false) {
                        bclass = "label label-danger";
                        bdata = "Disabled";
                    }
                    it = it + 1;
                    var $row = $('<tr />');
                    var whtsdata = "";
                    if (val.cfname != "" && val.cfname != null) {
                        whtsdata = whtsdata.concat("Client Name: " + val.cfname);
                    }
                    if (val.cmobile != "" && val.cmobile != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.cmobile);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.caddress != "" && val.caddress != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.caddress);
                    }
                    $row.append($('<td class="s" />').html("<span>.<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.LoginId + "'/> <a id='socialnetwork'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    $row.append($('<td class="cname" />').html("<span name = '" + val.cfname + "'   id='transferpage'  sno=" + qty + " class='mycursor'>" + (val.cfname != "" ? val.cfname : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="username" />').html("<span>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="email" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="mobile" />').html("<span>" + (val.cmobile != null ? val.cmobile : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="date_time" />').html("<span  name='" + val.date_time + "'>" + (val.date_time != null ? formatDatetoIST(val.date_time) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="photo"  style="display: block"/>').html("<span >" + (val.cphoto != null ? '.' + '<img src="' + val.cphoto + '" height="70px" width="70px;">' : '<img src="/PanelDesign/images/Default_User_pic_new.png" height="70px" width="70px;">')));
                    $row.append($('<td class="status1" />').html("<span class='" + bclass + "'>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="address" />').html("<span>" + (val.caddress != null ? val.caddress : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="city" />').html("<span>" + (val.ccity != null ? val.ccity : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="state" />').html("<span>" + (val.cstate != null ? val.cstate : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="country" />').html("<span>" + (val.country != null ? val.country : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="landline" />').html("<span>" + (val.clandline != null ? val.clandline : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="55" />').html("<span><button type='button' val-data='" + val.leadid + "' id='addleadcall' title='Call details' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-earphone'></span>&nbsp; </button>&nbsp;</button>&nbsp;<button type='button' class='btn btn-info' style='cursor:pointer' id='sendlogin' data-val='" + val.LoginId + "' title='Email Client Creditails.'><i class='glyphicon glyphicon-envelope'></i></button></span>"));
                    $("#loadactivitydatas").append($row);
                });
                $("#searchdatas").removeAttr("disabled");
                if (flaghide == true) {
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                    $("input:checkbox").click(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).toggle();
                    });
                    flaghide = false;
                }
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                closeload();
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    /*Hide empty columns*/
    function hideEmptyCols(table) {
        var numCols = $("th", table).length;
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
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
            }
        }
    }
    /*Open caselist*/
    $(document).on("click", "#opencaselist", function () {
        openload();
        var clientid = $(this).attr("client-id");
        window.location = encodeURI("/" + fcode + "/firm/ClientProfileDashboard/" + clientid);
    });
    var q = 2;
    loadmenu();
    /*Load menu*/
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/Demo/SpColMaps1',
            headers: {
                'fid': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
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

