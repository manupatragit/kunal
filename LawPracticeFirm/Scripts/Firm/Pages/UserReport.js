var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {
    debugger
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
    //Reset Form 
    $("#ClearuserReport").click(function () {
        $('#iduserformreser')[0].reset();
    });

    $("#ColumnSelectionopen").click(function () {
        $("#myModalCustomizedcolumn").modal('show'); // Opens the modal
    });

    $(document).click(function (event) {
        if ($(event.target).is(".myModal")) {
            $("#myModalCustomizedcolumn").modal('hide'); // Closes the modal
        }
    });
    /*Export user report in excel*/
    $("#oexcel").click(function () {
        var pagenum = pageindex;
        var pagesize = pagesize;
        var search = "";
        var usertype = $('#rptusertype').val();
        var designation = $('#userdesignation').val();
        var branch = $('#userbranch').val();
        var department = $('#userdepartment').val();
        var status = $('#userfilterStatus').val();
        var datefrom = $('#searchfrom').val();
        var dateto = $('#searchto').val();
        window.location = encodeURI("/firm/ExportoExcelUserReport?pagenum=1&pagesize=5000&search=" + search + "&usertype=" + usertype + "&designation=" + designation + "&branch=" + branch + "&department=" + department + "&status=" + status + "&datefrom=" + datefrom + "&dateto=" + dateto);
    });
    /*Export user report in pdf*/
    $("#opdf").click(function () {
        var pagenum = pageindex;
        var pagesize = pagesize;
        var search = "";
        var usertype = $('#rptusertype').val();
        var designation = $('#userdesignation').val();
        var branch = $('#userbranch').val();
        var department = $('#userdepartment').val();
        var status = $('#userfilterStatus').val();
        var datefrom = $('#searchfrom').val();
        var dateto = $('#searchto').val();
        window.location = encodeURI("/firm/ExportoPdfUserReport?pagenum=1&pagesize=5000&search=" + search + "&usertype=" + usertype + "&designation=" + designation + "&branch=" + branch + "&department=" + department + "&status=" + status + "&datefrom=" + datefrom + "&dateto=" + dateto);
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
    var type = 9;
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    Loadstructure();
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoExcelUser?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    });
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoPdfUser?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    });

    var chksflag = true;
    $("#searchdatas").click(function () {
        isRenderPage = false;
        exportfilter = true;
        loadtabledata();
        chksflag = true;
    });
});
/*Load user report details*/
function loadtabledata() {
    var $table = '';
    var $header = '';
    var dt = '';
    var q1 = 2;
    $table = $('<table id="example"  style="overflow-x:auto;" /><tr><th bgcolor="DIMGRAY">').addClass('table-panel');
    $header = $('<thead  >').html('');
    $head1 = $('<th  class="cname"  onclick="sortTable(0)"><div class="thbg">User Name <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="username"  onclick="sortTable(1)"><div class="thbg">Login UserName <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="email"  onclick="sortTable(2)"><div class="thbg">Email <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="mobile"  onclick="sortTable(3)"><div class="thbg">Mobile <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="date_time"  onclick="sortTable(4,1)" width="10%"><div class="thbg">Date <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="odetails"  onclick="sortTable(5)"><div class="thbg">Other Details<span class="fa fa-sort fa-fw pull-right"></div></th><th  class="status1"  onclick="sortTable(6)"><div class="thbg">Status <span class="fa fa-sort fa-fw pull-right"></div></th> <th  class="address"  onclick="sortTable(7)"><div class="thbg">Address <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="city"  onclick="sortTable(8)"><div class="thbg">City <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="state"  onclick="sortTable(9)"><div class="thbg">State <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="country"  onclick="sortTable(10)"><div class="thbg">Country <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="landline"  onclick="sortTable(11)"><div class="thbg">Landline <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="barno"  onclick="sortTable(12)"><div class="thbg">Bar No <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="CreatedBy"  onclick="sortTable(13)"><div class="thbg">Created by <span class="fa fa-sort fa-fw pull-right"></div></th><th  class="designation"  onclick="sortTable(14)"><div class="thbg">Designation<span class="fa fa-sort fa-fw pull-right"></div></th><th  class="department"  onclick="sortTable(15)"><div class="thbg">Department<span class="fa fa-sort fa-fw pull-right"></div></th><th  class="branch"  onclick="sortTable(16)"><div class="thbg">Branch<span class="fa fa-sort fa-fw pull-right"></div></th><th  class="utype"  onclick="sortTable(17)"><div class="thbg">User Type<span class="fa fa-sort fa-fw pull-right"></div></th><th  class="rmanager"  onclick="sortTable(18)"><div class="thbg">Reporting Manager<span class="fa fa-sort fa-fw pull-right"></div></th><th class="qualification"  onclick = "sortTable(19)"> <div class="thbg">Qualification <span class="fa fa-sort fa-fw pull-right" ></div></th><th  class="pqe"  onclick = "sortTable(20)"> <div class="thbg">PQE <span class="fa fa-sort fa-fw pull-right"></div></th><th class="firmexperience"  onclick="sortTable(21)"> <div class="thbg">Firm Experience <span class="fa fa-sort fa-fw pull-right"></div></th><th class= "areaofexpertise"  onclick ="sortTable(22)"><div class="thbg"> Area of Expertise <span class= "fa fa-sort fa-fw pull-right"></div></th><th class= "ppartner"  onclick = "sortTable(23)"><div class="thbg"> Parent Partner <span class= "fa fa-sort fa-fw pull-right"></div></th> <th class="hrate" onclick="sortTable(24,2)"><div class="thbg">Rate/hour<span class="fa fa-sort fa-fw pull-right"></div></th><th class="empcode" onclick="sortTable(25)"><div class="thbg">Employee Code<span class="fa fa-sort fa-fw pull-right"></div></th><th class="extention" onclick="sortTable(26)"><div class="thbg">Extension<span class="fa fa-sort fa-fw pull-right"></div></th>');
    $header.append($head1);
    $table.append($header);
    $table.append('<tbody style="clear:both" id="loadactivitydatas">');
    $('#updatePanel').html($table);
    setTimeout(function () {
        loaddatalist(pageindex);
    }, 1000);
}
flaghide = true;
function loaddatalist(pageindex) {
    $("#loadactivitydatas").empty();
    var fcode = localStorage.getItem("FirmCode");
    var formdata = new FormData();
    formdata.append("pagenum", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("search", EncodeText(""));
    formdata.append("usertype", EncodeText($('#rptusertype').val()));
    formdata.append("designation", EncodeText($('#userdesignation').val()));
    formdata.append("branch", EncodeText($('#userbranch').val()));
    formdata.append("department", EncodeText($('#userdepartment').val()));
    formdata.append("status", EncodeText($('#userfilterStatus').val()));
    formdata.append("datefrom", EncodeText($('#searchfrom').val()));
    formdata.append("dateto", EncodeText($('#searchto').val()));
    var ajaxTime = new Date().getTime();
    var $row = "";
    $.ajax({
        async: true,
        url: '/api/ReportApi/UserReports',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var totalTime = new Date().getTime() - ajaxTime;
            console.log("details:" + totalTime);
            $("#tfooter").html("");
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
                closeload();
            }
            else {
                $("#datastatus").html("No result found !");
                closeload();
            }
            if (obj.length == 0) {
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            }

            var it = 2;
            var bclass = '';
            var bdata = '';
            $("#loadactivitydatas tr").remove();
            $.each(obj, function (i, val) {
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                var totdata = val.totRow;
                var totpage = 0;
                if (i === (length - 1)) {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

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
                //        $("#usrpagnumvalue").attr("max", totpage);
                //    }
                //    var tfot = '';
                //    tfot += '<ul>'
                //    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="usrsotopage" style="display:none">' + totpage + '</span></li>'
                //    tfot += '<li><span>|</span></li>'
                //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                //    tfot += '<li><span>|</span></li>'
                //    tfot += '<li ><input type="number" id="usrpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="usergetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                //    if (val.totRow <= length) {
                //    }
                //    else if (pageno == 1) {
                //    }
                //    else if (pageno == totpage) {
                //        tfot += '<li><span><a id="usrpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                //    }
                //    else {
                //        tfot += '<li><span><a id="usrpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                //    }
                //    if (pageno < totpage) {
                //        tfot += '<a  id="usrpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                //    }
                //    tfot += '</ul>'
                //    $("#tfooter").html("");
                //    $("#tfooter").html(tfot);
                //    closeload();
                }
                if (val.IsActive == true) {
                    bclass = "label label-success";
                    bdata = "Enabled";
                }
                if (val.IsActive == false) {
                    bclass = "label label-danger";
                    bdata = "Disabled";
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
                $row = $('<tr  />');
                $row.append($('<td class="cname" />').html("<span>" + (val.cfname != null ? val.cfname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                $row.append($('<td class="username" />').html("<span>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="email" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="mobile" />').html("<span>" + (val.cmobile != null ? val.cmobile : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="date_time" />').html("" + (val.date_time != null ? formatDatetoIST(val.date_time) : '<span style="visibility: hidden;">.</span>')));
                $row.append($('<td class="odetails" />').html("<span>" + (val.OtherDetails != null ? val.OtherDetails : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="status1" />').html("<span class='" + bclass + "'>" + (bdata != "" ? bdata : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="address" />').html("<span>" + (val.caddress != null ? val.caddress : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="city" />').html("<span>" + (val.ccity != null ? val.ccity : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="state" />').html("<span>" + (val.cstate != null ? val.cstate : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="country" />').html("<span>" + (val.country != null ? val.country : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="landline" />').html("<span>" + (val.clandline != null ? val.clandline : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="barno" />').html("<span>" + (val.BARNo != null ? val.BARNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="CreatedBy" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="designation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="department" />').html("<span>" + (val.Department != null ? val.Department : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="branch" />').html("<span>" + (val.Branch != null ? val.Branch : '<span style="visibility: hidden;">&nbsp;</span>')));
                if (val.IsPartner == "1") {
                    $row.append($('<td class="utype" />').html("<span>Partner</span>"));
                }
                else {
                    $row
                        .append($('<td class="utype" />').html("<span>User</span>"));
                }
                $row.append($('<td class="rmanager" />').html("<span>" + (val.ReportManagerName != null ? val.ReportManagerName : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="qualification" />').html("<span>" + (val.Qualification != null ? val.Qualification : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="pqe" />').html("<span>" + (val.PQE != null ? val.PQE : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="firmexperience" />').html("<span>" + (val.FirmExperience != null ? val.FirmExperience : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="areaofexpertise" />').html("<span>" + (val.AreaOfExpertise != null ? val.AreaOfExpertise : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="ppartner" />').html("<span>" + (val.PartnerName != null ? val.PartnerName : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="hrate" />').html("" + (val.HRate != null ? val.HRate : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="empcode" />').html("<span>" + (val.EmployeeCode != null ? val.EmployeeCode : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="extention" />').html("<span>" + (val.Extention != null ? val.Extention : '<span style="visibility: hidden;">&nbsp;</span>')));
                if (val.oedit == 1 || roleids == 1) {
                    //$row.append($('<td />').html("<span class='glyphicon glyphicon-edit' id='edituser' style='color:#069;cursor:pointer;' title='Edit member' id-val=" + val.LoginId + "></span>"));
                }
                else {
                    // $row.append($('<td />').html(""));
                }
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
            closeload();
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

$(document).on("click", "#prev", function () {

    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = true;
    $("#txtgopage").val("");
    //renderPagination(setPageNo, totalPageRec)
    loaddatalist(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

$(document).on("click", "#next", function (){
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
$(document).on("click", "#divGo", function (){
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
/*User report by page number*/
$('#divcontent').off("click").on('click', '#usergetdatabypagenum', function () {
    pageindex = $("#usrpagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var pageindesx = $("#usrsotopage").text();
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

$(document).on('click', '#usrpaginate', function () {
    pageindex = $(this).attr("index");
    loaddatalist(pageindex);
});
/*Load user report structure*/
function Loadstructure() {
    $("#userdesignation,#userbranch,#userdepartment").html('');
    var option7 = '<option value="" > Select</option>';
    $("#userdesignation,#userbranch,#userdepartment").append(option7);
    var formData = new FormData();
    $.ajax({
        async: true,
        url: '/api/CallApi/LoadFirmStructureAll',
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }
            $.each(obj, function (i, a) {
                if (a.SType == "Designation") {
                    var option = '<option value="' + a.Id + '" > ' + a.Name + '</option>';
                    $("#userdesignation").append(option);
                }
                if (a.SType == "Branch") {
                    var option = '<option value="' + a.Id + '" > ' + a.Name + '</option>';
                    $("#userbranch").append(option);
                }
                if (a.SType == "Department") {
                    var option = '<option value="' + a.Id + '" > ' + a.Name + '</option>';
                    $("#userdepartment").append(option);
                }
            });
        },
        failure: function (response) {
            alert(data.responseText);
        },
        error: function (response) {
            alert(data.responseText);
        }
    });
}

$(document).on('change', '.chkdhide', function () {
    // your code
    var column = "." + $(this).attr("name");
    $(column).toggle();
});