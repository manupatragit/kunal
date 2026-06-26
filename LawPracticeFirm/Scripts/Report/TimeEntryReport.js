var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {
    /*Export time entry report in excel*/
    $("#oexcel").click(function () {
        var search = $('#tematter').val();
        var client = $('#tetimecontactvalue').val();
        var casename = "";
        var tasktype = $('#teitem').val();
        var islog = $('#hdnisaddedval').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var user = $('#ddlExpUser').val();
        var type = $("#TimeentrytypeReport").val();
        window.location = encodeURI("/Firm/ExportoExcelTimeEntryReport?pagenum=1&pagesize=5000&search=" + search + "&client=" + client +
            "&casename=" + casename + "&tasktype=" + tasktype + "&islog=" + islog + "&datefrom=" + datefrom +
            "&dateto=" + dateto + "&user=" + user + "&type=" + type);
    });
    /*Export time entry report in pdf*/
    $("#opdf").click(function () {
        var search = $('#tematter').val();
        var client = $('#tetimecontactvalue').val();
        var casename = "";
        var tasktype = $('#teitem').val();
        var islog = $('#hdnisaddedval').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var user = $('#ddlExpUser').val();
        var type = $("#TimeentrytypeReport").val();
        window.location = encodeURI("/Firm/ExportoPDFTimeEntryReport?pagenum=1&pagesize=5000&search=" + search + "&client=" + client +
            "&casename=" + casename + "&tasktype=" + tasktype + "&islog=" + islog + "&datefrom=" + datefrom +
            "&dateto=" + dateto + "&user=" + user + "&type=" + type);
    });
    $('#divcontent').off("click").on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    loaddatalist(pageindex);
                    closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
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
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    loadteamleader();
    bindCommonDropdown("teitem", "Task", 'Select Task');
    bindCommonDropdown("TimeentrytypeReport", "TimeEntry_Type", 'Select');
    /*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
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
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Load team leader*/
    function loadteamleader() {
        $("#member").html("");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuserteamlead",
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
                var html3 = '';
                $("#ddlExpUser option").remove();
                $("#ddlExpUser").append("<option value='' selected>Select</option>");
                $.each(obj, function (i, a) {
                    if (a.roleid == 1) {
                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                        $("#ddlExpUser").append(option);
                        html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="#" class="dropdown-item">' + a["UserName"] + '(Admin)</a></li>'
                    }
                    else {
                        if (a.IsPartner == 1) {
                            if (a.roleid != 3) {
                                var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                                $("#ddlExpUser").append(option);
                                html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(' + a.RoleName + ')</a></li>'
                            }
                        }
                        else {
                            if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                                if (a.roleid != 3) {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                                    $("#ddlExpUser").append(option);
                                    html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(User)</a></li>'
                                }
                            }
                            else {
                                if (a.roleid != 3) {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                                    $("#ddlExpUser").append(option);
                                    html3 += '<li ddd><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + ' - (User ' + a.PartnerName + ')</a></li>'
                                }
                            }
                        }
                    }
                });
                $("#member").append(html3);
                $("#member").css("height", "100px !Important");
                return false;
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Load user by firm and role id*/
    function LoadUsersbyFirmid_Roleid() {
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/UsersbyFirmid_Userid_Roleid",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#ddlExpUser").html("");
                }
                html3 += '<option value="00000000-0000-0000-0000-000000000000">Select</option>';
                $.each(response1.Data, function (k, a) {
                    var LoginId = a.LoginId;
                    var cfname = a.cfname + " [" + a.EmailId + "]";
                    var EmailId = a.EmailId;
                    html3 += '<option value=' + LoginId + '>' + cfname + '</option>'
                });
                $("#ddlExpUser").html("");
                $("#ddlExpUser").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    var chksflag = true;
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    flaghide = true;
    //load table data
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example"  class="" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table');
        $header = $('<thead  >').html('');
        $head1 = $('<th  onclick="sortTable(0,2)" style="min-width:100px"><div class="thbg">S.No.<span class="fa fa-sort fa-fw pull-right"></span></div></th><th class="matter"><div class="thbg">Matter Name</div> </th><th  onclick="sortTable(2)" class="client"><div class="thbg">Client <span class="fa fa-sort fa-fw pull-right"></span></div></th><th  onclick="sortTable(3,1)" class="date"><div class="thbg">Date <span class="fa fa-sort fa-fw pull-right"></span></div></th><th   class="duration"><div class="thbg">Duration</div> </th></th><th  onclick="sortTable(5)" class="createdby"><div class="thbg">User <span class="fa fa-sort fa-fw pull-right"></span></div></th><th  onclick="sortTable(6)" class="item"><div class="thbg">Task Type <span class="fa fa-sort fa-fw pull-right"></span></div></th><th  onclick="sortTable(7)" class="tdetails" width="30%"><div class="thbg">Notes <span class="fa fa-sort fa-fw pull-right"></span></div></th><th  onclick="sortTable(8)" class="timertype" width="15%"><div class="thbg">Type <span class="fa fa-sort fa-fw pull-right"></span></div></th><th   class="documents"><div class="thbg">Attachments </div></th> ');
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
        $("#loadactivitydatas").empty();
        $("#tfooter").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText(""));
        formdata.append("case", EncodeText($("#tematter").val()));
        formdata.append("client", EncodeText($("#tetimecontactvalue").val()));
        formdata.append("tasktype", EncodeText($("#teitem").val()));
        formdata.append("islog", EncodeText($("#hdnisaddedval").val()));
        formdata.append("datefrom", EncodeText($("#datefrom").val()));
        formdata.append("dateto", EncodeText($("#dateto").val()));
        formdata.append("user", EncodeText($("#ddlExpUser").val()));
        formdata.append("Type", EncodeText($("#TimeentrytypeReport").val()));
        var ajaxTime = new Date().getTime();
        var totaltime = 0;
        var time2 = [];
        var ld12 = $.ajax({
            async: true,
            url: '/api/ReportApi/LoadTimerEntryReport',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
               // console.log("details:" + totalTime);
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
                var $row = "";
                $("#loadactivitydatas tr").remove();
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
                            $('#prev').css("display", "block"); s
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
                    //if (i === 0) {
                    //    firstvalue = val.rownum;
                    //}
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
                    //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a> </li>'
                    //    if (val.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }
                    //    tfot += '</ul>'
                    //    $("#tfooter").html(tfot);
                    //    closeload();
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
                    $row = $('<tr />');
                    $row.append($('<td class="s" />').html("" + val.rownum + ""));
                    $row.append($('<td class="matter" />').html("<a name='" + String(val.mattername).replace(/\s/g, '') + "' title='View Matter Dashboard' id='transferpage' href='javascript:void()' data-val=" + val.tmatter + "><span>" + (val.mattername != null ? val.mattername : '</a>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="client" />').html("<span>" + (val.client != null ? val.client : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="date" />').html("" + (val.tdate != null ? formatDatetoIST(val.tdate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="duration" />').html("<span name='" + val.callDura + "'>" + (val.callDura != null ? formatTimeEntry(val.callDura) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="createdby" />').html("<span>" + (val.createdby != null ? val.createdby : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="item" />').html("<span>" + (val.titem != null ? val.titem : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.tdetails == "null" || val.tdetails == null) {
                        $row.append($('<td class="tdetails" />').html("<span class='comment more' style='word -break: break-all;'>" + val.tdetails + "</span>"));
                    }
                    else {
                        $row.append($('<td class="tdetails" />').html("<span class='comment more' style='word -break: break-all;'>" + (val.tdetails).replace(/<[^>]+>/gm, '') + "</span>"));
                    }
                    $row.append($('<td class="timertype" />').html("<span class='comment more' style='word -break: break-all;'>" + val.TimeEntryType + "</span>"));
                    if (val.DocsCount > 0) {
                        $row.append($('<td class="documents" />').html("<button type='button' class='btn btn-sm' id-val='" + val.Id + "' id='filelinktimer'><i class='glyphicon glyphicon-folder-open'></i></button>"));
                    }
                    else {
                        $row.append($('<td class="documents" />').html("&nbsp;"));
                    }
                    $("#loadactivitydatas").append($row);
                    time2.push(val.callDura);
                });
                if (JSON.stringify(time2) != "[]") {
                    var timetotal = (time2.toString()).split(',');
                    for (var i = 0; i < timetotal.length; i++) {
                        totaltime = timestrToSec(timetotal[i]) + totaltime;
                    }
                    $("#totaltime").html(formatTime(totaltime));
                    $("#sumdiv").show();
                }
                else {
                    $("#totaltime").html("00:00:00");
                    $("#sumdiv").hide();
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
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
            return false;
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
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
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
    $("#searchdatas").click(function () {
        loadtabledata();
    })
});
function fn_Isloged(val) {
    $("#hdnisaddedval").val(val);
}

$(document).on('change', '.chkdhide', function () {
    // your code
    var column = "." + $(this).attr("name");
    $(column).toggle();
});