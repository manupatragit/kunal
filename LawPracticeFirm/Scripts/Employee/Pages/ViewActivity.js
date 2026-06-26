$(document).ready(function () {
    $(function () {
    });
    var fcode = localStorage.getItem("FirmCode");
    /*Export Excel Activity List*/
    $("#excel").click(function () {
        var pagestypes = $("#filter").val();
        var searchdatss = "";
        searchdatss = $("#myInput").val();
        if (searchdatss == "") {
            searchdatss = $("#fstatus").val();
        }
        window.location = encodeURI("/employee/ExportoExcelActivityList?status=true&pagetype=" + pagestypes + "&search=" + searchdatss);
    })
    /*Export pdf Activity List*/
    $("#pdf").click(function () {
        var pagestypes = $("#filter").val();
        var searchdatss = "";
        searchdatss = $("#myInput").val();
        if (searchdatss == "") {
            searchdatss = $("#fstatus").val();
        }
        window.location = encodeURI("/employee/ExportoPdfActivityList?status=true&pagetype=" + pagestypes + "&search=" + searchdatss);
    })
    /*transfer page event*/
    $(document).on("click", "#transferpageevent", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/employee/EventSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
/*transfer page note*/
    $(document).on("click", "#transferpagenote", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/employee/NoteSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
/*transfer page task*/
    $(document).on("click", "#transferpagetask", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/employee/TaskSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
/*transfer page call*/
    $(document).on("click", "#transferpagecall", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/employee/CallSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
/*transfer page*/
    $(document).on("click", "#transferpage", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/firm/CustomActivitySingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    loadform();
/*Load form*/
    function loadform() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomActivity",
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
                    //alert(a.Id);
                    var option = '<p> <a class="dropdown-item" href="#" data-toggle="modal" data-target="#myModal" data-val="' + a.ActivityName + '" id-val="' + a.Id + '" id="customact">  <i class="glyphicon glyphicon-th-list"></i> ' + a.ActivityName + '</a></p>';
                    // '<p value="' + enctype(a["Id"]) + '" > ' + a["ActivityName"] + '</option>';
                    $("#loadcustomactivity").append(option);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedIDscall = new Array();
    var titlecall = new Array();
    var selectedIDsnote = new Array();
    var titlenote = new Array();
    var selectedIDstask = new Array();
    var titletask = new Array();
    var selectedIDsevent = new Array();
    var titleevent = new Array();
    var selectedIDscustom = new Array();
    var titlecustom = new Array();
    var countdelete = 0;
    var vcall = "";
    var vnote = "";
    var vtask = "";
    var vevent = "";
    var vcustom = "";
    var j1 = '';
    var j2 = '';
    $(document).on("click", "#delete", function () {
        deleteactivity();
        function data() {
            $('.pagination').hide();
            $('#maxRows option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#filter option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#updatePanel').html('');
            vcall = "";
            vnote = "";
            vtask = "";
            vevent = "";
            vcustom = "";
            try {
                table();
            }
            catch (err) {
            }
            try {
                event();
            }
            catch (err) {
            }
            try {
                task();
            }
            catch (err) {
            }
            try {
                note();
            }
            catch (err) {
            }
            try {
                call();
            }
            catch (err) {
            }
            try {
                customactivity();
            }
            catch (err) {
            }
        }
        function deleteactivity() {
            var result = confirm("Assigned Activities will not be deleted. Are you sure to delete Activities?");
            if (result) {
                openload();
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        if ($(this).attr('ntype') == 'task') {
                            titletask.push($(this).attr("ntype"));
                            selectedIDstask.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'call') {
                            titlecall.push($(this).attr("ntype"));
                            selectedIDscall.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'event') {
                            titleevent.push($(this).attr("ntype"));
                            selectedIDsevent.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'note') {
                            titlenote.push($(this).attr("ntype"));
                            selectedIDsnote.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'custom') {
                            titlecustom.push($(this).attr("ntype"));
                            selectedIDscustom.push($(this).val());
                        }
                    }
                });
                // Delete Event
                if (JSON.stringify(selectedIDsevent) != "[]") {
                    $.ajax({
                        async: true,
                        url: '/api/EmployeeApi/RemoveEvent',
                        data: JSON.stringify(selectedIDsevent),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDsevent = [];
                            titleevent = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                //alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
                // Delete Call
                if (JSON.stringify(selectedIDscall) != "[]") {
                    j1 = $.ajax({
                        async: true,
                        url: '/api/EmployeeApi/RemoveCall',
                        data: JSON.stringify(selectedIDscall),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDscall = [];
                            titlecall = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                // alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
                // Delete Note
                if (JSON.stringify(selectedIDsnote) != "[]") {
                    //$('#updatePanel').html('');
                    $.ajax({
                        async: true,
                        url: '/api/EmployeeApi/RemoveNote',
                        data: JSON.stringify(selectedIDsnote),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDsnote = [];
                            titlenote = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                vnote = "success";
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                // alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
                // Delete Task
                if (JSON.stringify(selectedIDstask) != "[]") {
                    //  $('#updatePanel').html('');
                    j2 = $.ajax({
                        async: true,
                        url: '/api/EmployeeApi/RemoveTask',
                        data: JSON.stringify(selectedIDstask),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDstask = [];
                            titletask = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                // alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    })
                }
                //delete custom
                if (JSON.stringify(selectedIDscustom) != "[]") {
                    //  $('#updatePanel').html('');
                    j2 = $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveCustomActivities',
                        data: JSON.stringify(selectedIDscustom),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDscustom = [];
                            titlecustom = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                // alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    })
                }
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to delete?',
                    type: 'error',
                    delay: 3000
                });
            }
        }
        $.when(j1, j2).then(function (a1, a2) {
            closeload();
            data();
            closeload();
        }, function (jqXHR, textStatus, errorThrown) {
        });
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    setInterval(function () {
        var setvalue = localStorage.getItem("setname");
        if (String(setvalue) != "") {
            loaddatalist(pageindex);
            localStorage.setItem("setname", "");
        }
    }, 3000);
    var urlpath = location.pathname.split('/');
    var activityname = urlpath[4];
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    var searchflag = false;
    var chckfilter = false;
    var tempexcel = false;
    $(document).on('click', '#getdatabypagenum', function () {
        var chksearchs = $("#myinput").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    //openload();
                    loaddatalist(pageindex);
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
    var chksflag = true;
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        /* your code here */
        searchflag = true;
        tempexcel = true;
        loaddatalist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#myInput', function () {
        /* your code here */
        $("#fstatus").val("");
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loaddatalist(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        /* your code here */
        var chksearchs = $("#myinput").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    var urlpath = location.pathname.split('/');
    var activityname = urlpath[4];
    // alert(activityname);
    function table() {
        $("#updatePanel").html("");
        $table = $('<table id="example" border = "1px solid" class=""  style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('');
        $head1 = $('<th bgcolor="DIMGRAY"><input type="checkbox" id="select_all"/></th><th bgcolor="DIMGRAY"  onclick="sortTable(1)" class="Activity">Activity <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(2)" class="Status12">Status <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(3)" class="Date">Date <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(4)" class="Matter">Case <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(5)" class="assignto">Assign To <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(6)" class="assignby">Assign By <span class="fa fa-sort "></span></th>');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $('#updatePanel').html($table);
        setTimeout(function () {
            loaddatalist(pageindex);
        }, 500);
    }
    table();
/*Load page data*/
    function loaddatalist(pageindex) {
        var inpt = $('#myInput').val();
        var penfilter = $('#fstatus').val();
        var fltr = $('#filter').val();
        if (penfilter == "") {
            if (chckfilter == false) {
                if (activityname != "") {
                    if (activityname == "Pending") {
                        fltr = "task";
                        $('#filter option[value="task"]').attr("selected", true);
                    }
                    else {
                        fltr = activityname;
                        $('#filter option[value="' + activityname + '"]').attr("selected", true);
                    }
                }
            }
            if (searchflag == true) {
                inpt = inpt;
                if (fltr == "" || fltr == "task") {
                    if (inpt == "Pending" || inpt == "pending") {
                        inpt = "not completed";
                    }
                }
                searchflag = false;
            }
            else {
                inpt = "";
                searchflag = false;
            }
        }
        else {
            inpt = penfilter;
        }
        openload();
        $("#loadactivitydatas").html("");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", inpt);
        formdata.append("type", fltr);
        var f1 = $.ajax({
            async: true,
            url: '/api/CallApi/LoadAllActivityDatabyrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#tfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    objtask = JSON.parse(response.Data);
                    var length = objtask.length;
                }
                else {
                    // alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    closeload();
                }
                else {
                    $("#datastatus").html("No result found!");
                    closeload();
                }
                var it = 2;
                var bclass = '';
                var t2 = 0;
                $.each(objtask, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.TotalRows;
                        var totpage = 0;
                        if (val.TotalRows > 0) {
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
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + val.rownum + '</b> of <b style="font-size:12px;">' + val.TotalRows + ' Entries</b>'
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
                    t2 = t2 + 1;
                    $("#tokens").append('<input type="hidden" id="hidtask' + t2 + '" value="' + val.Id + '">')
                    if (val.status == "Completed") {
                        bclass = "label label-success";
                    }
                    if (val.status == "Not Completed") {
                        bclass = "label label-danger";
                    }
                    if (val.status == "In Progress") {
                        bclass = "label label-warning";
                    }
                    var dat = val.date_time;
                    var dates1 = formatDatetoIST(dat);
                    var statusvalue = "";
                    if (val.status == "Not Completed") {
                        statusvalue = "Pending";
                    }
                    else {
                        statusvalue = val.status;
                    }
                    it = it + 1;
                    var $row = $('<tr />');
                    if (String(val.TempField) == "task") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-file-text-o'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpagetask' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>')));
                    }
                    if (String(val.TempField) == "note") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='note' class='checkbox' ntype='note'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-sticky-note'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpagenote' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>')));
                    }
                    if (String(val.TempField) == "call") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='call' class='checkbox' ntype='call'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-phone'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpagecall' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>')));
                    }
                    if (String(val.TempField) == "event") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='event' class='checkbox' ntype='event'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-calendar'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpageevent' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>')));
                    }
                    if (String(val.TempField) == "cactivity") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='custom' class='checkbox' ntype='custom'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='glyphicon glyphicon-th-list'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpage' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>')));
                    }
                    $row.append($('<td class="Status12" />').html("<span class='" + bclass + "'>" + (statusvalue != null ? statusvalue : '')));
                    $row.append($('<td class="Date" />').html("<span  name='" + val.date_time + "'>" + (dates1 != null ? dates1 : '')));
                    $row.append($('<td class="Matter" />').html("<span>" + (val.mattername != null ? val.mattername : '')));
                    $row.append($('<td class="assignto" />').html("<span>" + (val.assignuserto != null ? val.assignuserto : '')));
                    $row.append($('<td class="assignby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '')));
                    $("#loadactivitydatas").append($row);
                });
                closeload();
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(f1).then(function (x) {
            $("#searchdatas").removeAttr("disabled");
            if (activityname == "Pending") {
                fsearchPending(activityname);
                closeload();
                $('#fstatus option[value="Pending"]').attr("selected", true);
                $('#filter option[value="Tasks"]').attr("selected", true);
            }
        });
    }
    $('#fstatus').on('change', function () {
        $("#myInput").val("");
        searchflag = false;
        chckfilter = true;
        tempexcel = false;
        loaddatalist(1);
    });
    $('#filter').on('change', function () {
        $("#myInput").val("");
        $("#fstatus").val("");
        chckfilter = true;
        tempexcel = false;
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
        searchflag = false;
        loaddatalist(1);
    });
});
