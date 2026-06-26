(function ($) {
})(jQuery);
$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    /*Export new time entry in excel*/
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        var usersdata = $('#users').val();
        window.location = encodeURI("/firm/ExportoExcelNewTimeEntry?status=true&searchdata=" + searchdata + "&user=" + usersdata);
    })
    /*Export new time entry in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        var usersdata = $('#users').val();
        window.location = encodeURI("/firm/ExportoPdfNewTimeEntry?status=true&searchdata=" + searchdata + "&user=" + usersdata);
    })
    /*View single matter*/
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/MatterSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    assignuser();
    /*Get assign user*/
    function assignuser() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuser",
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
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#users").append(option);
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
    $("#linklead").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateLead");
    });
    setInterval(function () {
        var tempdata = localStorage.getItem("timesetname1");
        if (tempdata != "") {
            loadtabledata();
            localStorage.setItem("timesetname1", "");
        }
    }, 4000);

    /*Edit time*/
    $(document).on("click", "#edittime", function () {
        $('#myModalalltimer12').modal('hide');
        try {
            var timeids = $(this).attr("data-id");
            var url1 = "/firm/EditTimeEntry?data=true&token=" + timeids;
            $('.mymodels5').load(url1, function (result1) {
                $('#myModal5').modal({ show: true });
            });
        }
        catch (err) {
            alert(err.message);
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
                formdata.append("tablekey", "timer");
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
        deletetime();
        /*Delete time*/
        function deletetime() {
            var result = confirm("Are you sure to remove time entry?");
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
                        url: '/api/CallApi/RemoveNewTimeEntry',
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
                                    text: 'Time entry removed successfully',
                                    type: 'success',
                                    delay: 3000
                                });
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
                        title: 'Warn!ng',
                        text: 'You have not selected any row to delete?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });

    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    if (type == "7") {
        $("#updatePanel").css("display", "block");
    }
    else {
        $("#updatePanel").css("display", "hide");
    }
    openload();
    loadtabledata();
    $('#users').on('change', function () {
        loaddatalist(1);
    });

    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    /*Load timer entry data by page number*/
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
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        exportfilter = true;
        loaddatalist(1);
        chksflag = true;
    });
    /*Search data by key up*/
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
    /*Paginate*/
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    //load table data
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" border = "1px solid" class="" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('');
        $head1 = $('<th bgcolor="DIMGRAY"><input type="checkbox" id="select_all"/></th><th bgcolor="DIMGRAY" onclick="sortTable(1)">Sl. No. <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(2)" class="subject">Subject <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(3)" class="date">Date <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(4)" class="duration">Duration <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" class="createdby">Createdby </th><th bgcolor="DIMGRAY" onclick="sortTable(5)" class="matter">Case Name <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(6)" class="tdetails">Details <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(7)" class="action">action <span class="fa fa-sort "></span></th>');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $('#updatePanel').html($table);
        setTimeout(function () {
            loaddatalist(pageindex);
        }, 1000);
    }
    flaghide = true;
    /*Load data list*/
    function loaddatalist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        formdata.append("user", $('#users').val());
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadNewTimerEntryByrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                $("#tfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    closeload();
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    closeload();
                }
                else {
                    $("#datastatus").html("No result found !");
                    closeload();
                }
                var it = 2;
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
                    var hrate = "";
                    if (val.hrrate == null) {
                        hrate = "";
                    }
                    else {
                        hrate = val.hrrate;
                    }
                    var total = "";
                    if (val.total == null) {
                        total = "";
                    }
                    else {
                        total = val.total;
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
                    $row.append($('<td class="s1" />').html("<span>&nbsp;<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.Id + "'/>"));
                    $row.append($('<td class="s" />').html("<span>" + qty + ""));
                    $row.append($('<td class="subject" />').html("<span>" + (val.subject != null ? val.subject : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="date" />').html("<span name='" + val.tdate + "'>" + (val.tdate != null ? formatDatetoIST(val.tdate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="duration" />').html("<span name='" + val.callDura + "'>" + (val.callDura != null ? formatTimeEntry(val.callDura) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="createdby" />').html("<span>" + (val.createdby != null ? val.createdby : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="matter" />').html("<a name='" + String(val.mattername).replace(/\s/g, '') + "' id='transferpage' href='javascript:void()' data-val=" + val.tmatter + "><span>" + (val.mattername != null ? val.mattername : '</a>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="tdetails" />').html("<span>" + (val.tdetails != null ? val.tdetails : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="action" />').html("<span><button title='Click here to edit time entry.' type='button' class='btn btn-info btn-md' data-id='" + val.Id + "' id='edittime'><span class='fa fa-pencil'></span>  </button></span>"));
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
    function hideEmptyCols(table) {
        //  alert(table);
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
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                //$.each(obj, function (i, a) {
                //    q = q + 1;
                //    // var option = ' <li><a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li>';
                //    //var option = '<option value="' + a["Id"] + '" formatter="' + a["Formatter"] + '" defaultvalues="' + (a["DefaultValues"] === null ? "" : a["DefaultValues"]) + '" aurl="' + (a["Url"] === null ? "" : a["Url"]) + '">' + a["Text"] + '</option>';
                //    var option = '<li><a href="#" class="small" data-value="option' + q + '" tabIndex="-1"><input checked type="checkbox"  name="class' + q + '" >' + a["column_name"] + '</a></li>';
                //    $("#bd").append(option);
                //    // alert("d");
                //    //  alert(a.Id);
                //}); //End of foreach Loop
                var options = [];
                //$('input:checkbox.shcheckbox').on('click', function (event) {
                //    //alert($(this).prop('checked', true));
                //    //    ;
                //    //if ($(this).prop('checked') == true) {
                //    //    alert("unck");
                //    //    $(this).prop('checked', false);
                //    //}
                //    //else {
                //    //    alert("ck");
                //    //    $(this).prop('checked', true);
                //    //}
                //    //var $target = $(event.currentTarget),
                //    //    val = $target.attr('data-value'),
                //    //    $inp = $target.find('input'),
                //    //    idx;
                //    //if ((idx = options.indexOf(val)) > -1) {
                //    //    options.splice(idx, 1);
                //    //    setTimeout(function () { $inp.prop('checked', true); }, 0);
                //    //} else {
                //    //    options.push(val);
                //    //    setTimeout(function () { $inp.prop('checked', false); }, 0);
                //    //}
                //    //$(event.target).blur();
                //    //console.log(options);
                //    return false;
                //});
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
    //$(document).on('change', '[type=checkbox]', function (e) {
    //});
});
                //});
