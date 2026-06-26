$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    /*Export timer list in excel*/
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/employee/ExportoExcelTimerList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Export timer list in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/employee/ExportoPdfTimerList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Transfer pages*/
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Employee/MatterSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Link to create lead*/
    $("#linklead").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateLead");
    });
    setInterval(function () {
        var tempdata = localStorage.getItem("setname1");
        if (tempdata != "") {
            loadtabledata(pageindex);
            localStorage.setItem("setname1", "");
        }
    }, 4000);
    $(document).on("click", "#edittime", function () {
        var timeids = $(this).attr("data-id");
        openload();
        var url = "/employee/editConfigtimer?data=true&token=" + timeids;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    setInterval(function () {
        var temp = localStorage.getItem("setname");
        if (temp != "") {
            $('#updatePanel').html("");
            loadtabledata();
            localStorage.setItem("setname", "");
        }
    }, 2000);
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();
    /*Delete lead*/
    $(document).on("click", "#delete", function () {
        selectedID = [];
        deletecontact();
        //}
        function deletecontact() {
            var result = confirm("Are you sure to   delete Case time entry ?");
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
                        url: '/api/CallApi/RemoveuserTimeEntry',
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
                                    text: ' Case time entry removed successfully',
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
    function openload() {
        $('#myOverlay').css("display", "block");
    }
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

    /*//search data*/
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
        exportfilter = true;
        isRenderPage = false;
        loaddatalist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#searchdata', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                exportfilter = false;
                isRenderPage = false;
                loaddatalist(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        isRenderPage = false;
        loaddatalist(pageindex);
    });
    //load table data
    function loadtabledata() {
        openload();
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" border="1px solid" class="" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('');
        $head1 = $('<th bgcolor="DIMGRAY"><input type="checkbox" id="select_all"/></th><th bgcolor="DIMGRAY" onclick="sortTable(1)">Sl. No.<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(2)" class="matter">Case Name <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(3)" class="client">Client <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(4)" class="date">Date <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY"  class="duration">Duration </th><th bgcolor="DIMGRAY" onclick="sortTable(6)" class="billedby">Billed By <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(7)" class="createdby">Created By <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" class="action">Action </th><th bgcolor="DIMGRAY" onclick="sortTable(9)" class="hrate">Hourly Rate (INR) <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(10)" class="total">Total <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(11)" class="item">Item <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(12)" class="tdetails">details <span class="fa fa-sort "></span></th> ');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $('#updatePanel').html($table);
        setTimeout(function () {
            isRenderPage = false;
            loaddatalist(pageindex);
        }, 1000);
    }
    flaghide = true;
    function loaddatalist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/LoadTimerDatabyrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                debugger
                $("#tfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                }
                else {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    $("#datastatus").html("No result found !");
                }
                var it = 2;
                var qty = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

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
                    var $row = $('<tr />');
                    $row.append($('<td class="s1" />').html("<span>&nbsp;<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.Id + "'/>"));
                    $row.append($('<td class="s" />').html("<span>" + qty + ""));
                    $row.append($('<td class="matter" />').html("<a  id='transferpage' href='javascript:void()' data-val=" + val.tmatter + "><span>" + (val.mattername != null ? val.mattername : '</a>')));
                    $row.append($('<td class="client" />').html("<span>" + (val.client != null ? val.client : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="date" />').html("<span>" + (val.tdate != null ? formatDatetoIST(val.tdate) : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="duration" />').html("<span>" + (val.callDura != null ? formatTimeEntry(val.callDura) : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="billedby" />').html("<span>" + (val.billedby != null ? val.billedby : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="createdby" />').html("<span>" + (val.createdby != null ? val.createdby : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="action" />').html("<span><button type='button' class='btn btn-info btn-md' data-id='" + val.Id + "' id='edittime'><span class='fa fa-pencil'></span>  </button></span>"));
                    $row.append($('<td class="hrate" />').html("<span>" + (hrate != null ? hrate : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="total" />').html("<span>" + (total != null ? total : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="item" />').html("<span>" + (val.titem != null ? val.titem : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="tdetails" />').html("<span>" + (val.tdetails != null ? val.tdetails : '<span style="visibility: hidden;">.</span>')));
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
                // hideEmptyCols($("#example"));
            },
            error: function () {
                alert('Error!');
            }
        });
    }

    var q = 2;
    loadmenu();
    /*Lpad menu*/
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
                    //alert("not found");
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
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

