(function ($) {
    //code here 
})(jQuery);
var Isdaterangefilter = 0;
localStorage.setItem("savetimeentry", "");
$(document).ready(function () {

    $(document).on('click', 'div .dropdown-menu', function (e) {
        e.stopPropagation();
    });
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    /*Export timer list in excel*/
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        var frmdatefilter = "", todatefilter = "";
        var sfrmdatefilter = $("#casefilterdate").val();
        var stodatefilter = $("#casefilterdateTo").val();
        var datefrmdatefilter = $("#datecasefilterdate").val();
        var datetodatefilter = $("#datecasefilterdateToDate").val();
        var createdbyfilte = $("#filtercaseusermatter").val();
        var timeentrytypefilter = $("#timeentrytpess").val();
        if (Isdaterangefilter == 1) {
            frmdatefilter = datefrmdatefilter;
            todatefilter = datetodatefilter;
        } else {
            frmdatefilter = sfrmdatefilter;
            todatefilter = stodatefilter;
        }
        window.location = encodeURI("/firm/ExportoExcelTimerList?status=true&searchdata=" + searchdata +
            "&exportfilter=" + exportfilter + "&frmdatefilter=" + frmdatefilter +
            "&todatefilter=" + todatefilter + "&createdbyfilte=" + createdbyfilte +
            "&timeentrytypefilter=" + timeentrytypefilter + "&Isdaterangefilter=" + Isdaterangefilter);
    })
    /*Export timer list in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        var frmdatefilter = "", todatefilter = "";
        var sfrmdatefilter = $("#casefilterdate").val();
        var stodatefilter = $("#casefilterdateTo").val();
        var datefrmdatefilter = $("#datecasefilterdate").val();
        var datetodatefilter = $("#datecasefilterdateToDate").val();
        var createdbyfilte = $("#filtercaseusermatter").val();
        var timeentrytypefilter = $("#timeentrytpess").val();
        if (Isdaterangefilter == 1) {
            frmdatefilter = datefrmdatefilter;
            todatefilter = datetodatefilter;
        } else {
            frmdatefilter = sfrmdatefilter;
            todatefilter = stodatefilter;
        }
        window.location = encodeURI("/firm/ExportoPdfTimerList?status=true&searchdata=" + searchdata +
            "&exportfilter=" + exportfilter + "&frmdatefilter=" + frmdatefilter +
            "&todatefilter=" + todatefilter + "&createdbyfilte=" + createdbyfilte +
            "&timeentrytypefilter=" + timeentrytypefilter + "&Isdaterangefilter=" + Isdaterangefilter);
    })
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
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
        var tempdata = localStorage.getItem("savetimeentry");
        if (tempdata != "") {
            loadtabledata();
            localStorage.setItem("savetimeentry", "");
        }
    }, 4000);
    $(document).on("click", "#filelinktimer", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=TimeEntry&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    $("#myModal").click(function () {
        loaddatalist(pageindex);
    });

    /*Edit time*/
    $(document).on("click", "#edittime", function () {
        $('#myModalalltimer12').modal('hide');
        try {
            var timeids = $(this).attr("data-id");
            var url1 = "/firm/editConfigtimer?data=true&token=" + timeids;
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
                formdata.append("tablekey", EncodeText("timer"));
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
                            isRenderPage = false;
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
    /*Delete date time*/
    $(document).on("click", "#deletetime", function () {
        
        var ids = $(this).attr("data-id");
        $("#deletesingle_finaltime").attr("id-val", ids);
        $("#deletetimeentry").modal();
       
    });
    //Convert Final 
    $(document).on("click", "#deletesingle_finaltime", function () {
        var ids = $(this).attr("id-val");
        deletetimesingle();
        selectedID = [];
        function deletetimesingle() {
            //var result = confirm("Are you sure to delete matter time entry?");
            //if (result) {
                selectedID.push(ids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveTimeEntry',
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
                                    text: 'Time Entry Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadtabledata();
                                $("#deletetimeentry").modal("hide");
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
                        title: 'Warn!ng',
                        text: 'You have not selected any row to delete?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
       // }
    });
    $(document).on("click", "#delete", function () {
        selectedID = [];
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                selectedID.push($(this).val());
            }
        });
       
        $("#deletesingle_finaltimeMatter").attr("id-val", selectedID);
        $("#deletetimeentryForMatter").modal();

    });
    $(document).on("click", "#deletesingle_finaltimeMatter", function () {
       
        selectedID = [];
        selectedID = $(this).attr("id-val");
        deletetime();
        /*Delete time*/
        function deletetime() {
            //var result = confirm("Are you sure to delete matter time entry?");
            //if (result) {
            //    $('input:checkbox.checkbox').each(function () {
            //        if ($(this).prop('checked')) {
            //            selectedID.push($(this).val());
            //        }
            //    });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveTimeEntry',
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
                                    text: ' Matter Time Entry Remove Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadtabledata();
                                $("#deletetimeentryForMatter").modal("hide");
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
                        title: 'Warn!ng',
                        text: 'You have not selected any row to delete?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        //}
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
    bindCommonDropdown("timeentrytpess", "TimeEntry_Type", 'Entry Type');
    /*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.length;
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                //alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                //alert(response.responseText);
            } //End of AJAX error function
        });
    }
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
        $("#clearnewseach").css("display", "unset");
        $("#searchdata").focus();
        $("#searchdatas").attr("disabled", true);
        exportfilter = true;
        isRenderPage = false;
        loaddatalist(1);
        chksflag = true;
    });
    /*Clear new search*/
    $("#clearnewseach").click(function () {
        $("#searchdata").val("");
        $("#searchdatas").removeAttr("disabled");
        exportfilter = true;
        isRenderPage = false;
        loaddatalist(1);
        chksflag = true;
        $("#clearnewseach").css("display", "none");
    });
    /*Search data on keyup*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                exportfilter = false;
                isRenderPage = false;
                loaddatalist(1);
                chksflag = false;
                $("#clearnewseach").css("display", "none");
            }
        }
    });
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
        $table = $('<table id="example"  class="" style="overflow-x:auto;" /><tr><th>').addClass('table-panel');
        $header = $('<thead  >').html('');
        $head1 = $('<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th><th class="matter"><div style="min-width: 120px !important;" class="thbg"><input type="text" id="searchdata" placeholder="Matter Name" class="form-control pull-left" style="width:90%"><span style="margin:5px 0px 0 -10px" class= "glyphicon glyphicon-search pull-right" id ="searchdatas" ></span> <span style="margin: 1px 15px 0px -10px;display:none;font-weight: 350;color:black; font-size: 15px;cursor:pointer; " title="Click here to reset search" class="pull-right" id="clearnewseach">x</span></div></th><th  onclick="sortTable(3)" class="client"><div class="thbg">Client Name <span class="fa fa-sort fa-fw pull-right"></span></div></th><th class="date"><div style="min-width: 120px !important;" class="thbg">Task Date <div class="btn-group" style="margin-top: -4px;"><button type="button" style="height: 23px;" class="taskoutboxbtnicon dropdown-toggle pull-right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-calendar"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu" style="width:325px; margin-top: 18px;margin-left: 0;"><li style="padding:4px 5px 8px 5px; float:left"><input type = "date" title="" id = "casefilterdate" placeholder = "Start Date" class= "form-control pull-left" style="width:125px;" onkeydown="return false" /></li ><li style="padding:4px 5px 8px 5px; float:left"><input type="date" title="Matter creation date in myKase" id="casefilterdateTo" placeholder="Start Date" class="form-control " style="width:125px;" onkeydown="return false" /></li><li style="padding:4px 5px 8px 5px; float:left"><span class="glyphicon glyphicon-search" id="searchdatasdate" style="padding:2px 0 0 0 ;background:none"></span></li><li style="padding:4px 5px 8px 5px; float:left"><span class="glyphicon glyphicon-remove" id="casecleardate" title="Click here to clear date" style="display: none; width: 7%; cursor: pointer; font-size:10px; padding:2px 0 0 0;"></span></li></ul ></div ></div></th><th  onclick="sortTable(5)"  class="duration"><div class="thbg">Duration </div></th></th><th class="createdby"><div class="thbg"><div style="min-width:120px;" class="thbg"><select class="form-control col_b" id="filtercaseusermatter"><option value="" selected>Select User</option></select></div></div></th><th  onclick="sortTable(6)" class="item"><div style="min-width: 120px !important;" class="thbg">Task Type <span class="fa fa-sort fa-fw pull-right"></span></div></th><th class="tdetails" ><div style="min-width: 70px !important;" class="thbg">Notes</div></th><th  class="timertype" width="15%">  <div style="min-width:100%;" class="thbg"><select class="form-control" id="timeentrytpess"><option value="" selected="">Entry Type</option></select></div></th><th  onclick="sortTable(10)" class="documents"><div class="thbg">Attachments</div></th><th class="date_time"><div style="min-width:100px !important;" class="thbg">Date<div class="btn-group" style="margin-top:-4px;"><button type="button" style="height:23px;" class="taskoutboxbtnicon dropdown-toggle pull-right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-calendar"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu" style="width:325px;margin-top: 18px;left: -330px;"><li style="padding:4px 5px 8px 5px; float:left"><input type="date" title="" id ="datecasefilterdate" placeholder="Start Date" class="form-control pull-left" style="width:125px;" onkeydown="return false" /></li ><li style="padding:4px 5px 8px 5px; float:left"><input type="date"  id="datecasefilterdateToDate" placeholder="Start Date" class="form-control " style="width:125px;" onkeydown="return false" /></li><li style="padding:4px 5px 8px 5px; float:left"><span class="glyphicon glyphicon-search" id="datesearchdatasdate" style="padding:2px 0 0 0 ;background:none"></span></li><li style="padding:4px 5px 8px 5px; float:left"><span class="glyphicon glyphicon-remove" id="datecasecleardate" title="Click here to clear date" style="display: none; width: 7%; cursor: pointer; font-size:10px; padding:2px 0 0 0;"></span></li></ul ></div ></div></th><th  class="action" ><div style="min-width: 70px !important;" class="thbg">Actions </div></th> ');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $table.append(`
                        <tr id="datastatus" class="notfound" style="display:none;">
                            <td colspan="100%" style="margin-left: 222%; margin-top: 20%; ">
                                <center>
                                    <img src="/newassets/img/not-found.png" />
                                    <p>No data found.</p>
                                </center>
                            </td>
                        </tr>
                    `);
        $('#updatePanel').html($table);
        setTimeout(function () {
            isRenderPage = false;
            loaddatalist(pageindex);
        }, 2000);
    }
    flaghide = true;
    /*Load data list*/
    function loaddatalist(pageindex) {
        openload();
        $("#loadactivitydatas").html("");
        var frmdatefilter = "", todatefilter = "";
        var sfrmdatefilter = $("#casefilterdate").val();
        var stodatefilter = $("#casefilterdateTo").val();
        var datefrmdatefilter = $("#datecasefilterdate").val();
        var datetodatefilter = $("#datecasefilterdateToDate").val();
        var createdbyfilte = $("#filtercaseusermatter").val();
        var timeentrytypefilter = $("#timeentrytpess").val();
        var fcode = localStorage.getItem("FirmCode");
        if (Isdaterangefilter == 1) {
            frmdatefilter = datefrmdatefilter;
            todatefilter = datetodatefilter;
        } else {
            frmdatefilter = sfrmdatefilter;
            todatefilter = stodatefilter;
        }
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText($('#searchdata').val()));
        formdata.append("frmdatefilter", EncodeText(frmdatefilter));
        formdata.append("todatefilter", EncodeText(todatefilter));
        formdata.append("createdbyfilte", EncodeText(createdbyfilte));
        formdata.append("timeentrytypefilter", EncodeText(timeentrytypefilter));
        formdata.append("Isdaterangefilter", EncodeText(Isdaterangefilter));
        var ajaxTime = new Date().getTime();
        var totaltime = 0;
        var totaltimebilled = 0;
        var totaltimeunbilled = 0;
        var time2 = [];
        var time3 = [];
        var time4 = [];
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadTimerDatabyrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                //var totalTime = new Date().getTime() - ajaxTime;
                //console.log("details:" + totalTime);
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
                    $("#datastatus").hide();
                    //$("#datastatus").html("");
                    closeload();
                }
                else {
                    $("#datastatus").show();
                    $("#tradePagination").hide();
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                   // $("#datastatus").html("No result found !");
                    closeload();
                }
                var it = 2;
                var qty = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                        //var pnext = pageindex;
                        //var pprev = pageindex;
                        //var pageno = pageindex;
                        //var totdata = val.totRow;
                        //var totpage = 0;
                        //if (val.totRow > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;
                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(pagesize);
                        //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }
                        //    $("#pagnumvalue").attr("max", totpage);
                        //}
                        //var tfot = '';
                        //tfot += '<ul>'
                        //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //if (val.totRow <= length) {
                        //}
                        //else if (pageno == 1) {
                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //else {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //if (pageno < totpage) {
                        //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //}
                        //tfot += '</ul>'
                        //$("#tfooter").append(tfot);
                        //closeload();

                        var totdata = val.totRow;
                        $("#idtimeentrycount").text(val.totRow);
                        var totpage = 0;
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
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
                            setTotalRecord = totpage;
                            renderPagination(pageindex, totpage);
                        }
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
                    var Isconvertwips = "";
                    if (val.Ischangewip == "1") {
                        Isconvertwips = "trcolor";
                    }
                    else {
                        Isconvertwips = "";
                    }
                    var $row = $('<tr class="' + Isconvertwips + '">');
                    if (val.Isbilling == 1 && roleid == 1) {
                        $row.append($('<td class="s1" valign="top" />').html("<input  type='checkbox' id='task' class='checkbox' ntype='task' valType='" + val.Isbilling + "'  value='" + val.Id + "' checked disabled/>"));
                    }
                    else {
                        $row.append($('<td class="s1" valign="top" />').html("<input  type='checkbox' id='task' class='checkbox' ntype='task' valType='" + val.Isbilling + "'  value='" + val.Id + "'/>"));
                    }
                    $row.append($('<td class="" />').html("<a name='" + String(val.mattername).replace(/\s/g, '') + "' title='View Matter Dashboard' id='transferpage' href='javascript:void()' data-val=" + val.tmatter + "><span>" + (val.mattername != null ? val.mattername : '</a>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="client" />').html("<span>" + (val.client != null ? val.client : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="date" />').html("<span name='" + val.tdate + "'>" + (val.tdate != null ? formatDatetoIST(val.tdate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="duration" />').html("<span name='" + val.callDura + "'>" + (val.callDura != null ? formatTimeEntry(val.callDura) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="createdby" />').html("<span>" + (val.createdby != null ? val.createdby : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="item" />').html("<span>" + (val.titem != null ? val.titem : '<span style="visibility: hidden;">&nbsp;</span>')));
                    var tdetails = "";
                    tdetails = val.tdetails;
                    try {
                        tdetails = (val.tdetails).replace(/<[^>]+>/gm, '');
                    }
                    catch {
                    }
                    var timeentryClass = (val.TimeEntryType == "" ? ' ' : 'batch2')
                    $row.append($('<td class="tdetails" />').html("<span class='comment more' style='word -break: break-all;'>" + tdetails + "</span>"));
                    $row.append($('<td class="timertype" />').html("<span class="+timeentryClass+" >"+ val.TimeEntryType + "</span>"));
                    if (val.DocsCount > 0) {
                        $row.append($('<td class="documents" />').html("<button type='button' class='btn btn-sm' id-val='" + val.Id + "' id='filelinktimer'><i class='glyphicon glyphicon-folder-open'></i></button>"));
                    }
                    else {
                        $row.append($('<td class="documents" />').html("&nbsp;"));
                    }
                    $row.append($('<td class="date_time" />').html("<span name='" + val.date_time + "'>" + (val.date_time != null ? formatDatetoIST(val.date_time) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    var html4 = '';
                    if (val.oedit == 1 || roleid == 1) {
                        if (val.oedit == 1 && val.odelete == 1) {
                            html4 += "<ul class='action-ul'><li><span style='color:#069; cursor:pointer' class='action_one' title='Edit Time Entry' data-id='" + val.Id + "' id='edittime'><img src='/newassets/img/edit.svg' /></span></li> <li><span style='cursor:pointer;color:red;' class='action_one' title='Delete Time Entry'  data-id='" + val.Id + "' id='deletetime'><img src='/newassets/img/delete.svg' /></span> </li></ul>";
                        }
                        else {
                            html4 += "<span><span style='color:#069;cursor:pointer' class='glyphicon glyphicon-edit' title='Edit Time Entry' data-id='" + val.Id + "' id='edittime'></span>";
                        }
                    }
                    else if (val.odelete == 1 || roleid == 1) {
                        if (val.oedit == 1 && val.odelete == 1) {
                            html4 += "<span><span style='color:#069;cursor:pointer' class='glyphicon glyphicon-edit' title='Edit Time Entry' class='' data-id='" + val.Id + "' id='edittime'><span class='fa fa-edit'></span>  </span></span>&nbsp;|&nbsp;<span><span style='color:#069;cursor:pointer;color:red' class='glyphicon glyphicon-trash' title='Remove Time Entry' class='' data-id='" + val.Id + "' id='deletetime'><span class='fa fa-trash'></span>  </span></span>";
                        }
                        else {
                            html4 += "<span><span style='color:#069;cursor:pointer' class='glyphicon glyphicon-trash' title='Remove Time Entry' class='' data-id='" + val.Id + "' id='deletetime'> </span></span>";
                        }
                    }
                    else {
                        html4 += "&nbsp";
                    }
                    if (val.TimeEntryType == "WIP") {
                        html4 += "<span class='glyphicon glyphicon-question-sign' style='cursor: pointer; margin-left: 5px; color: Green;' title='convert time entry type' data-id='" + val.Id + "' id='changetimeentrytype'></span>";
                    }
                    else {
                        html4 += "&nbsp";
                    }
                    $row.append($('<td class="action" />').html(html4));
                    $("#loadactivitydatas").append($row);
                    time2.push(val.callDura);
                    if (val.Isbilling == 1) {
                        time3.push(val.callDura);
                    } else {
                        time4.push(val.callDura);
                    }
                });
                //For Total Billing Hours
                if (JSON.stringify(time2) != "[]") {
                    var timetotal = (time2.toString()).split(',');
                    for (var i = 0; i < timetotal.length; i++) {
                        totaltime = timestrToSec(timetotal[i]) + totaltime;
                    }
                    $("#totalloggedHrs").html(formatTime(totaltime));
                    $("#sumdiv").show();
                }
                else {
                    $("#totalloggedHrs").html("00:00:00");
                    $("#sumdiv").hide();
                }
                //For Total Billed Hours
                if (JSON.stringify(time3) != "[]") {
                    var timetotalbilled = (time3.toString()).split(',');
                    for (var i = 0; i < timetotalbilled.length; i++) {
                        totaltimebilled = timestrToSec(timetotalbilled[i]) + totaltimebilled;
                    }
                    $("#totalBillHrs").html(formatTime(totaltimebilled));
                   // $("#sumdiv").show();
                }
                else {
                    $("#totalBillHrs").html("00:00:00");
                    //$("#sumdiv").hide();
                }
                //For Total Unbilled hours
                if (JSON.stringify(time4) != "[]") {
                    var timetotalnonbilled = (time4.toString()).split(',');
                    for (var i = 0; i < timetotalnonbilled.length; i++) {
                        totaltimeunbilled = timestrToSec(timetotalnonbilled[i]) + totaltimeunbilled;
                    }
                    $("#totalNonbillHrs").html(formatTime(totaltimeunbilled));
                    // $("#sumdiv").show();
                }
                else {
                    $("#totalNonbillHrs").html("00:00:00");
                    //$("#sumdiv").hide();
                }
                var showChar = 50;
                var ellipsestext = "...";
                var moretext = "more";
                var lesstext = "less";
                $('.more').each(function () {
                    var content = $(this).html();
                    if (content.length > showChar) {
                        var c = content.substr(0, showChar);
                        var h = content.substr(showChar - 1, content.length - showChar);
                        var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="javascript:void()" class="morelink">' + moretext + '</a></span>';
                        $(this).html(html);
                    }
                });
                $(".morelink").click(function () {
                    if ($(this).hasClass("less")) {
                        $(this).removeClass("less");
                        $(this).html(moretext);
                    } else {
                        $(this).addClass("less");
                        $(this).html(lesstext);
                    }
                    $(this).parent().prev().toggle();
                    $(this).prev().toggle();
                    return false;
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
    //function renderPagination(pageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = pageindex;
    //    totalPageRec = totdata;
    //    let paginationHtml = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (pageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtml += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers").html(paginationHtml);
    //    isRenderPage = true;
    //}
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
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loaddatalist(setPageNo);
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
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    //$(document).on("click", "#prev", function () {
    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loaddatalist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", "#prev", function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#next", function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loaddatalist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#divGo", function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
    //        alert("Please enter a valid page number.");
    //        setPageNo = 1;
    //        return false;
    //    }
    //    isRenderPage = true;
    //    loaddatalist(setPageNo);

    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", "#divGo", function () {
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
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

/*Pagination End*/

    function pad(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return "" + num;
        }
    }
    function formatTime(seconds) {
        return [pad(Math.floor(seconds / 3600)),
        pad(Math.floor(seconds / 60) % 60),
        pad(seconds % 60),
        ].join(":");
    }
    function timestrToSec(timestr) {
        var parts = timestr.split(":");
        return (parts[0] * 3600) +
            (parts[1] * 60) +
            (+parts[2]);
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
        //  alert("gi");
    });
    /*Search data*/
    $(document).on('click', '#searchdatasdate', function (e) {
        isRenderPage = false;
        var fromd = $("#casefilterdate").val();
        var tod = $("#casefilterdateTo").val();
        if (fromd == "") {
            alert("Please select filter from date");
            $("#casefilterdate").focus();
            return false;
        }
        if (tod == "") {
            alert("Please select filter to date");
            $("#casefilterdateTo").focus();
            return false;
        }
        isRenderPage = false;
        loaddatalist(1);
        $("#casecleardate").css("display", "block");
    });
    $(document).on('click', '#casecleardate', function (e) {
        $("#casefilterdate").val("");
        $("#casefilterdateTo").val("");
        $("#casecleardate").css("display", "none");
        isRenderPage = false;
        loaddatalist(1);
    });

    //for Date fileter implenations
    $(document).on('click', '#datesearchdatasdate', function (e) {
        isRenderPage = false;
        var fromd = $("#datecasefilterdate").val();
        var tod = $("#datecasefilterdateToDate").val();
        Isdaterangefilter = 1;
        if (fromd == "") {
            alert("Please select filter from date");
            $("#datecasefilterdate").focus();
            return false;
        }
        if (tod == "") {
            alert("Please select filter to date");
            $("#datecasefilterdateToDate").focus();
            return false;
        }
        isRenderPage = false;
        loaddatalist(1);
        $("#datecasecleardate").css("display", "block");
    });
    $(document).on('click', '#datecasecleardate', function (e) {
        $("#datecasefilterdate").val("");
        $("#datecasefilterdateToDate").val("");
        $("#datecasecleardate").css("display", "none");
        isRenderPage = false;
        loaddatalist(1);
    });
    $(document).on('change', '#filtercaseusermatter', function (e) {
        isRenderPage = false;
        loaddatalist(1);
    });
    $(document).on('change', '#timeentrytpess', function (e) {
        isRenderPage = false;
        loaddatalist(1);
    });

    //change time entry status
    $(document).on("click", "#changetimeentrytype", function () {
        bindCommonDropdown("timeentrytypeformodel", "TimeEntry_Type", 'Please select');
        var timerids = $(this).attr("data-id");
        $('#selecttimerids').val(timerids);
        $("#myModalwipchange").modal();
    });

    //update time entry  status
    $(document).on("click", "#btnsavestatus", function () {
        var timeridss = $('#selecttimerids').val();
        var timeentryststus = $('#timeentrytypeformodel').val();
        if (timeentryststus == "") {
            alert("Please select time entry type");
            return false;
        }
        var formData = new FormData();
        formData.append("timeridss", EncodeText(timeridss));
        formData.append("timeentryststus", EncodeText(timeentryststus));
        openload();
        $.ajax({
            async: true,
            url: '/api/CallApi/UpdateTimeEntryStatus',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    new PNotify({
                        title: 'Success!',
                        text: ' Status update Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loaddatalist(pageindex);
                    $("#timeentrytypefrm")[0].reset();
                    $("#myModalwipchange").modal('hide');
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
    });

    //for multiple timeentry status
    $(document).on("click", "#ChangeMultipletimeentry", function () {
        multipletimetry = [];
        multipletimetry.length = 0;
        $("#convertbilled").modal();
        deletemattersingle2();
        function deletemattersingle2()
        {
            //var result = confirm("Are you sure to convert billed?");
            //if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        var timeentryids = $(this).attr("value");
                        multipletimetry.push(timeentryids);
                    }
                });
                
           // }
        }
        $("#deletesingle_final").attr("id-val", multipletimetry);
    });
    //Convert Final 
    $(document).on("click", "#deletesingle_final", function () {
        var multipletimetry = $(this).attr("id-val");
        if (JSON.stringify(multipletimetry) != "[]") {
            //  alert("hi");
            openload();
            $.ajax({
                async: true,
                url: '/api/CallApi/TimeEntryStatusChange',
                data: JSON.stringify(multipletimetry),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response) {
                    selectedID = [];
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        $("#convertbilled").modal("hide");
                        $("#successfullyconverted").modal();
                        //new PNotify({
                        //    title: 'Success!',
                        //    text: 'Status change Successfully',
                        //    type: 'success',
                        //    delay: 3000
                        //});
                        $('#select_all').prop('checked', false);
                        loaddatalist(pageindex);
                      
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'Warning!',
                            text: ' You are not Authotized to change time entry !',
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
                text: ' Please select a row to change time entry.',
                type: 'error',
                delay: 3000
            });
            closeload();
        }
    });
    //Add Time Entry 
    $(document).on('click', '#CreateTimeEntrybtn', function (e) {

        $('#myModalAddTimeEntry').modal({ show: true });
    });

    //$("#savetimeentry").click(function () {
    //    var contact = $('#timecontactvalue').val();
    //    var matter = $('#timematter').val();
    //    var item = $('#item').val();
    //    var dt = $('#dt').val();
    //    var Timeentrytype = $('#Timeentrytype').val();
    //    if (item == "") {
    //        alert("select task");
    //        $('#item').focus();
    //        return false;
    //    }
    //    if (item == "Others") {
    //        alert("select task");
    //        $('#item').focus();
    //        return false;
    //    }
    //    if (dt == "") {
    //        alert("select date");
    //        $('#dt').focus();
    //        return false;
    //    }
    //    var duration = $('#duration2').val();
    //    duration = String(duration).replace(/([a-zA-Z ])/g, "");
    //    var patt3 = /[0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}$/m;
    //    var result1 = String(duration).match(patt3);
    //    if (result1 == null) {
    //        new PNotify({
    //            title: 'Warning!',
    //            text: 'Please Enter Correct Call Duration Formate: 00h:00m:00s',
    //            type: 'Warning',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    var array = duration.split(":");
    //    var ahour = String(array[0]).replace(/\D/g, '');
    //    var amin = String(array[1]).replace(/\D/g, '');
    //    var asec = String(array[2]).replace(/\D/g, '');
    //    if (ahour == 0 && amin == 0 && asec == 0) {
    //        new PNotify({
    //            title: 'Warning!',
    //            text: 'Time can not be 0h:0m:0s',
    //            type: 'Warning',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    if (ahour > 23) {
    //        new PNotify({
    //            title: 'Warning!',
    //            text: 'Hour should be less than 24 hour ',
    //            type: 'Warning',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    if (amin > 59) {
    //        new PNotify({
    //            title: 'Warning!',
    //            text: 'Minute should be less than 60 minutes ',
    //            type: 'Warning',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    if (asec > 59) {
    //        new PNotify({
    //            title: 'Warning!',
    //            text: 'Second should be less than 60 seconds',
    //            type: 'Warning',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    var details = $('#details').val();
    //    var formData = new FormData();
    //    var tempsize = 0;
    //    var tottempsize = 0;
    //    var totalFiles = document.getElementById("postedfile").files.length;
    //    for (var i = 0; i < totalFiles; i++) {
    //        var file = document.getElementById("postedfile").files[i];
    //        var filename = file.name;
    //        if (filename.length > 100) {
    //            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
    //            return false;
    //        }
    //        var Extresponse = checkfileext(filename);
    //        if (String(Extresponse) == "false") {
    //            return false;
    //        }
    //        formData.append("FileUpload", file);
    //        try {
    //            if (typeof (file) != "undefined") {
    //                size = parseFloat(file.size / 1024).toFixed(2);
    //                tottempsize = parseFloat(tottempsize) + parseFloat(size);
    //                tempsize = parseFloat(size);
    //            }
    //        }
    //        catch (err) {
    //            //alert(err.message);
    //        }
    //        tempsize = tempsize.toFixed(2);
    //        if (tempsize > filesize) {
    //            new PNotify({
    //                title: 'Warning!',
    //                text: Filesizelabel,
    //                type: 'error',
    //                delay: 3000
    //            });
    //            return false
    //        }
    //    }
    //    formData.append("contact", contact);
    //    formData.append("matter", matter);
    //    formData.append("item", item);
    //    formData.append("dt", dt);
    //    formData.append("duration", duration);
    //    formData.append("details", details);
    //    formData.append("type", Timeentrytype);
    //    formData.append("savemykasefileid", $("#mykasefileidTimeEntry").val());
    //    try {
    //        openload();
    //    }
    //    catch (er) {
    //    }
    //    $.ajax({
    //        type: "POST",
    //        url: "/api/callApi/PostSaveTimer", // Controller/View
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        //},
    //        success: function (data) {
    //            var InfectFilesResult = "";
    //            if (String(data.Data.Result) == "EXCEEDLIMIT") {
    //                alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
    //                closeload();
    //                return false;
    //            }
    //            else if (String(data.Data.Result) == "NOLIMIT") {
    //                alert("Please Upgrade Your Storage Limit");
    //                closeload();
    //                return false;
    //            }
    //            else if (data.Data.InfectFiles != "") {
    //                InfectFilesResult = VirusScanResultMsgBefore + " " + data.Data.InfectFiles + " " + VirusScanResultMsgAfter;
    //            }
    //            $('#item').val('');
    //            $('#dt').val('');
    //            $('#Timeentrytype').val('');
    //            $("#details").val('');
    //            $("#duration2").val('');
    //            new PNotify({
    //                title: 'Success!',
    //                text: 'Time Entry Added Successfully</br>' + InfectFilesResult,
    //                type: 'success',
    //                delay: 3000
    //            });
    //            localStorage.setItem("savetimeentry", "1");
    //            localStorage.setItem("tasktimervalue", $("#duration2").val());
    //            $("#mykasefileidTimeEntry").val("");
    //            $("#postedfile").attr("title", "No file chosen");
    //            $("#browsefilelblTimeEntry").html("No file chosen");
    //            //starttime();
    //            $("#taskstarttimer1").css("display", "block");
    //            $("#taskstoptimer1").css("display", "none");
    //            sessionStorage.setItem("h2", sessionStorage.getItem("h1"));
    //            sessionStorage.setItem("m2", sessionStorage.getItem("m1"));
    //            sessionStorage.setItem("s2", sessionStorage.getItem("s1"));
    //            sessionStorage.setItem("h1", 0);
    //            sessionStorage.setItem("m1", 0);
    //            sessionStorage.setItem("s1", 0);
    //            window.clearInterval(window.t11);
    //            closeload();
    //        }, //End of AJAX Success function
    //        failure: function (data) {
    //            alert(data.responseText);
    //            closeload();
    //        }, //End of AJAX failure function
    //        error: function (data) {
    //            alert(data.responseText);
    //            closeload();
    //        } //End of AJAX error function
    //    });
    //});
    $("#timeattachtitle").on("click", function () {
        $("#uploadTimerDiv").toggle();
    });

});


let selectedLocalfilesTimer = [];
let selectedServerFilesTimer = [];
let isUpdatingFileInput = false; // Add this flag



//$("#postedfile").change(function (e) {
//    const files = Array.from(e.target.files || []);
//    if (files.length) selectedLocalfilesTimer.push(...files);

//    renderAllFilesTimer();

//    // allow selecting same file again
//    this.value = '';
//});


$(document).on('click', '#CreateTimeEntrybtn', function (e) {
    selectedLocalfilesTimer = []; // Clear previous files
    selectedServerFilesTimer = []; // Clear previous files
    $('#fileListTimer').empty();
    $("#dropContainer").attr("title", "upload Attachment");
    $('#myModalAddTimeEntry').modal({ show: true });
});

// Fixed file change handler
$(document).on('change', '#postedfile', function (e) {
    // Prevent recursive calls
    if (isUpdatingFileInput) {
        console.log('Skipping change event - triggered by updateFileInputTimer');
        return;
    }

    console.log('File change event - user selected files');
    const files = Array.from(e.target.files || []);
    if (files.length) {
        // Clear previous local files to avoid duplicates
        selectedLocalfilesTimer = [];
        selectedLocalfilesTimer.push(...files);
        console.log('Files added to array:', selectedLocalfilesTimer.length);
    }

    renderAllFilesTimer();
});

$(document).on('click', '.remove-local-Timer', function () {
    const index = Number($(this).data('index'));
    selectedLocalfilesTimer.splice(index, 1);
    renderAllFilesTimer();
});

$(document).on('click', '.remove-server-Timer', function () {
    const index = Number($(this).data('index'));
    const removed = selectedServerFilesTimer.splice(index, 1)[0];
    renderAllFilesTimer();

    // ✅ If you need to also remove it on backend, call your API here:
    // if (removed?.id) deleteServerFile(removed.id);
});

function displayExistingTimeEntryFile(fileName, fileId) {
    if (!fileName) return;

    // Optional: prevent duplicates by name+id
    const exists = selectedServerFilesTimer.some(x =>
        (fileId && x.id === fileId) || (!fileId && x.name === fileName)
    );
    if (!exists) selectedServerFilesTimer.push({ id: fileId || null, name: fileName });

    renderAllFilesTimer();
}


function updateFileInputTimer() {
    const currentFiles = document.getElementById('postedfile').files;

    // Check if update is actually needed
    if (currentFiles.length === selectedLocalfilesTimer.length) {
        let needsUpdate = false;
        for (let i = 0; i < selectedLocalfilesTimer.length; i++) {
            if (currentFiles[i] !== selectedLocalfilesTimer[i]) {
                needsUpdate = true;
                break;
            }
        }

        if (!needsUpdate) {
            console.log('Input already up to date - skipping update');
            return;
        }
    }

    console.log('updateFileInputTimer called - updating input with', selectedLocalfilesTimer.length, 'files');

    const dt = new DataTransfer();
    selectedLocalfilesTimer.forEach(file => dt.items.add(file));
    document.getElementById('postedfile').files = dt.files;
}

/* ===========================
   Helpers
=========================== */
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[s]));
}
function renderAllFilesTimer() {
    const fileList = $('#fileListTimer');
    fileList.empty(); // ✅ clear UI only

    // 1) Local files
    selectedLocalfilesTimer.forEach((file, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(file.name)}</span>
                <span class="remove-file remove-local-Timer" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });


    // 2) Server files
    selectedServerFilesTimer.forEach((f, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(f.name)}</span>
                <span class="remove-file remove-server-Timer" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });

    // Title update
    const total = selectedLocalfilesTimer.length + selectedServerFilesTimer.length;
    $("#dropContainer").attr("title", total > 0 ? "Document Attached" : "upload Attachment");
    $('#uploadTimerDiv').hide();

    //updateFileInputTimer(); // ✅ updates only local input files
}
//let selectedpostedfile = [];
//$(document).on('change', '#postedfile', function (e) {
//    selectedpostedfile = [];
//    var fileCount = this.files.length;
//    if (fileCount > 0) {
//        $("#dropContainer").attr("title", "Document Attached");
//    }
//    else {
//        $("#dropContainer").attr("title", "upload Attachment");
//    }

//    const files = Array.from(e.target.files);
//    selectedpostedfile = [...selectedpostedfile, ...files];
//    displaypostedfile();
//});

//$(document).on('click', '.remove-file-postedfile', function () {
//    const index = $(this).data('index');
//    selectedpostedfile.splice(index, 1);
//    displaypostedfile();
//});

//function displaypostedfile() {
//    const fileList = $('#fileListTimer');
//    fileList.empty();
//    const fCount = selectedpostedfile.length;
//    selectedpostedfile.slice(0, 5).forEach((file, index) => {
//        const fileItem = $(`
//            <div class="file-item">
//                <span class="file-name">${file.name}</span>
//                <span class="remove-file-postedfile" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
//            </div>
//        `);
//        fileList.append(fileItem);
//    });
//    if (fCount > 5) {
//        const remaining = fCount - 5;
//        fileList.append(`
//            <div class="file-summary" style="margin-top:5px;color:#555;">
//                +${remaining} more (Total ${fCount} files selected)
//            </div>
//        `);
//    }
//    updatepostedfileInput();
//}

//function updatepostedfileInput() {
//    const dt = new DataTransfer();
//    selectedpostedfile.forEach(file => dt.items.add(file));
//    document.getElementById('postedfile').files = dt.files;
//    $('#uploadTimerDiv').hide();
//}

//function clearpostedfileUpload() {
//    selectedpostedfile = [];
//    const fileInput = document.getElementById("postedfile");
//    if (fileInput) fileInput.value = "";
//    $('#fileListTimer').empty();
//    $("#dropContainer").attr("title", "Upload Attachment");
//}

//function displayExistingTimeEntryFile(fileName) {
//    const fileList = $('#fileListTimer');
//    fileList.empty();

//    const fileItem = `
//       <div class="file-item">
//                <span class="file-name">${fileName}</span>
//                <span class="remove-file-postedfile" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
//            </div>
//    `;

//    fileList.append(fileItem);
//    $("#dropContainer").attr("title", "Document Attached");
//    //$('#uploadTimerDiv').hide();
//    updatepostedfileInput();
//}
