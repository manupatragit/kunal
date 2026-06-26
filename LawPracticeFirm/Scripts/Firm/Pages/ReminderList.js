(function ($) {
    //code here 
})(jQuery);
$(document).ready(function () {
    var type = 9;
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    $("#createreminder").click(function () {
        window.location = encodeURI("/" + fcodes + "/Firm/createreminder");
    });
    $(document).on("click", "#edittime", function () {
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/CalendarEvent";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $("#linklead").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateLead");
    });
    setInterval(function () {
        var tempdata = localStorage.getItem("setname1");
        if (tempdata != "") {
            loadtabledata();
            localStorage.setItem("setname1", "");
        }
    }, 4000);
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
    $("#delete").click(function () {
        selectedID = [];
        deletetime();
        function deletetime() {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedID.push($(this).val());
                }
            });
            if (JSON.stringify(selectedID) != "[]") {
                var result = confirm("Are you sure to delete event?");
                if (result) {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveReminder',
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
                                    text: ' Event removed successfully',
                                    type: 'success',
                                    delay: 3000
                                });
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
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        exportfilter = true;
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
                loaddatalist(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    //load table data
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" class="" /><tr><th>').addClass('table-panel ');
        $header = $('<thead  >').html('');
        $head1 = $('<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th><th  onclick="sortTable(1)"><div class="thbg">Sl. No. </div></th><th  onclick="sortTable(2)" class="titles"><div class="thbg">Title </div></th><th  onclick="sortTable(3)" class="details"><div class="thbg">Description </div></th><th   class="edate" onclick="sortTable(4)"><div class="thbg">Event Date </div></th><th  onclick="sortTable(6)" class="stime"><div class="thbg">Start Time </div></th><th  onclick="sortTable(7)" class="etime"><div class="thbg">End Time</div></th><th  class="allday"><div class="thbg">AllDay </div></th><th  onclick="sortTable(10)" class="location"><div class="thbg">Location </div></th><th  onclick="sortTable(12)" class="createdby"><div class="thbg">Created By</div> </th><th  onclick="sortTable(12)" class="cdate"><div class="thbg">Create Date</div> </th> <th  onclick="sortTable(13)" class="action"><div class="thbg">Action </div></th>');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody id="loadactivitydatas">');
        $table.append('<tfoot id="statusfooter"><tr><td colspan="100%"><center><span id="datastatus"></span></td></tr></tfoot>');
        $('#updatePanel').html($table);
        setTimeout(function () {
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
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadReminder',
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
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                    closeload();
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    $("#statusfooter").hide();
                    closeload();
                }
                else {
                    $("#datastatus").html("No result found !");
                    $("#statusfooter").show();
                    closeload();
                }
                var it = 2;
                var qty = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
                            //$('#next').css("display", "none");
                            $('#prev').css("display", "block");
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (pageindex == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }

                        if (isRenderPage == false) {
                            renderPagination(pageindex, totpage);
                        }
                    //if (i === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;
                    //    var totdata = val.totRow;
                    //    var totpage = 0;
                    //    if (val.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(pagesize);
                    //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#pagnumvalue").attr("max", totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    //    if (val.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                    //    }
                    //    tfot += '</ul>'
                    //    $("#tfooter").append(tfot);
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
                    $row.append($('<td class="s1" />').html("<span><input type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.Rid + "'/>"));
                    $row.append($('<td class="s" />').html("<span>" + val.rownum + ""));
                    $row.append($('<td class="titles" />').html("<span>" + (val.ETitle != null ? val.ETitle : '<span style="visibility: hidden;">&nbsp;</span>')));
                    var html3 = '';
                    if (val.EDescription == "" || val.EDescription == null || val.EDescription == "null") {
                        html3 += '&nbsp;'
                    }
                    else {
                        if (val.EDescription.length > 60) {
                            html3 += '<span class="comment more" style="">' + val.EDescription.substring(0, 60) + '</span>'
                            html3 += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:#069;cursor:pointer"> more</span>'
                            html3 += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                            html3 += '' + val.EDescription + ''
                            html3 += '</div>'
                        }
                        else {
                            html3 += '<span class="comment more" style="">' + val.EDescription + '</span>'
                        }
                    }
                    $row.append($('<td class="details" />').html("<span>" + (html3)));
                    $row.append($('<td class="edate" />').html("<span name='" + val.EDate + "'>" + (val.EDate != null ? formatDatetoIST(val.EDate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="stime" />').html("<span>" + (val.EStartTime != null ? val.EStartTime : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="stime" />').html("<span>" + (val.EEndTime != null ? val.EEndTime : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="allday" />').html("<span>" + (val.AllDay != null ? val.AllDay == 0 ? 'No' : 'Yes' : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="location" />').html("<span>" + (val.Location != null ? val.Location : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="createdby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cdate" />').html("<span name='" + val.date_time + "'>" + (val.date_time != null ? formatDatetoIST(val.date_time) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="action" />').html("<span type='button' style='cursor: pointer;' title='Edit Reminder' class='' data-id='" + val.Rid + "' id='edittime'><img src='/newassets/img/edit-icon.png' /></span>"));
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
    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    function renderPagination(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;
        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis
        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#pageNumbers").html(paginationHtml);
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totdata);
        isRenderPage = true;
    }


    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        loadflag = true;
        isRenderPage = true;
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
    /*Hide employee cols*/
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
    });
});
