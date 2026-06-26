var cdecpageindex = 1, cdcpagesize = 10, cdcrecordcount = 0, cdctotrecord = 0;
jQuery(document).ready(function () {
    if (dashcw == "display:unset") {
        $(".casecasedetails").show();
    }
    else {
        $(".casecasedetails").hide();
    }
    bindCommonDropdown("fstatus", "Case_Status", 'Status');
    bindCommonDropdown("cdcfilterstatustype", "Case_Status", 'Status');
    /*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", EncodeText(dropdownname));
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
                    if (dropdownname == "Court_Type") {
                        html1 += '<option value="' + a.Value + '" >  ' + a.Name + '</option>';
                    }
                    else {
                        html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    }
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
    var strmatterstatus = localStorage.getItem("matterstatus");
    if (strmatterstatus != "" && strmatterstatus != null) {
        loaddatabystatus(strmatterstatus)
        localStorage.setItem("matterstatus", "");
    }
    else {
        loaddata(cdecpageindex);
    }
    if (strmatterstatus == "open") {
        $('#fstatus option[value="Open"]').attr("selected", true);
    }
    if (strmatterstatus == "pending") {
        $('#fstatus option[value="Pending"]').attr("selected", true);
    }
    if (strmatterstatus == "close") {
        $('#fstatus option[value="Close"]').attr("selected", true);
    }
    /*Export client case in excel*/
    $("#oexcel").click(function () {
        var casefiltercasename = $('#casefiltercasename').val();
        var cdcfiltercourttype = $('#cdcfiltercourttype').val();
        var cdcfilterstatustype = $('#cdcfilterstatustype').val();
        window.location = encodeURI("/firm/ExportoExcelClientCase?result=true&searchdata=" + casefiltercasename + "&court=" + cdcfiltercourttype + "&status=" + cdcfilterstatustype);
    })
    /*Export client case in pdf*/
    $("#opdf").click(function () {
        var casefiltercasename = $('#casefiltercasename').val();
        var cdcfiltercourttype = $('#cdcfiltercourttype').val();
        var cdcfilterstatustype = $('#cdcfilterstatustype').val();
        window.location = encodeURI("/firm/ExportoPdfClientCase?result=true&searchdata=" + casefiltercasename + "&court=" + cdcfiltercourttype + "&status=" + cdcfilterstatustype);
    })
    /*Multiple file link details*/
    $(document).on("click", "#filelink", function () {
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=case&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            $('#myModal1').modal({ show: true });
        });
    });
    $(document).on("click", "#opencase", function () {
        var serial = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": serial }
        });
    });
    /*Get case details*/
    $(document).on("click", "#casedetails", function () {
        var transferid = $(this).attr("data-val");
        var CNRNumber = "";
        var IsRevenueCourt = "";
        var IsReraCourt = "";
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid, "IsRevenueCourt": IsRevenueCourt, "IsRera": IsReraCourt, "CNRNumber": CNRNumber }
        });
        //url_redirect({
        //    url: urls,
        //    method: "post",
        //    data: { "token": serial }
        //});
    });
    $(document).on("click", "#tst", function () {
        var caseid = $(this).attr("data-val");
        $("#textcaseid").text(caseid);
        loadcasetime();
        $('#myModalleadcall').modal({ show: true });
    });
    /*Load case time details*/
    function loadcasetime() {
        $("#assignuserdata").html("");
        var html = '';
        var caseid = $("#textcaseid").text();
        var formData = new FormData();
        formData.append("caseid", EncodeText(caseid));
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCasetime",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td>' + qty1 + '</td><td>' + a.mattername + '</td><td>' + formatTimeEntry(a.callDura) + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.createdby + '</td></tr>';
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
    /*Get data by page number*/
    $(document).on('click', '#tgetdatabypagenum', function () {
        cdecpageindex = $("#tpagnumvalue").val();
        if (cdecpageindex != "undefined") {
            if (Math.sign(cdecpageindex) == 1) {
                var ipageindesx = $("#tsotopage").text();
                if (cdecpageindex <= parseInt(ipageindesx)) {
                    loaddata(cdecpageindex);
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
    $(document).on('click', '#tpaginate', function () {
        cdecpageindex = $(this).attr("index");
        loaddata(cdecpageindex);
    });
});

/*Filter table data*/
function filtertable() {
    input = document.getElementById("fstatus")
    filter = input.value.toLowerCase();
    if (filter == "") {
        loaddata(cdecpageindex);
    }
    else {
        loaddatabystatus(filter);
    }
}

/*Export new case in excel*/
$("#cmexcel").click(function () {
    var esearchdata = $('#casefiltercasename').val();
    var ecasefilterdate = $('#casefilterdate').val();
    var ecasefilterclient = $('#casefilterclient').val();
    var ecasefiltercourt = $('#casefiltercourt').val();
    var ecasefilterstatus = $('#casefilterstatus').val();
    var eusers = $('#filtercaseuser').val();
    window.location = encodeURI("/firm/ExportoExcelNewCases?status=true&esearchdata=" + esearchdata + "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient + "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers);
})
/*Export new case in pdf*/
$("#cmpdf").click(function () {
    var court = $("#cdcfiltercourttype").val();
    var status = $("#cdcfilterstatustype").val();
    window.location = encodeURI("/Client/ExportoExcelClientsMatter?status=" + status + "&court=" + court);
})
/*Search data*/
$(document).on("click", "#searchdatas", function () {
    var casefiltercasename = $("#casefiltercasename").val();
    if (casefiltercasename == "") {
        alert("Please enter the matter name.");
        $("#casefiltercasename").focus();
        return false;
    }
    $("#searchdatas").attr("disabled", true);
    $("#clearnewsearchcase").css("display", "unset")
    loadflag = true;
    loaddata(cdecpageindex);
    chksflag = true;
});
$(document).on("click", "#clearnewsearchcase", function () {
    $("#casefiltercasename").val("");
    $("#searchdatas").css("display", "unset");
    $("#clearnewsearchcase").css("display", "none");
    loadflag = true;
    loaddata(cdecpageindex);
    chksflag = true;
})
var tatalRecordCount = 1;
/*Load matter list by user data*/
function loaddata(cdecpageindex) {
    $("#ptfooter").html("");
    var formData = new FormData();
    var court = $("#cdcfiltercourttype").val();
    var status = $("#cdcfilterstatustype").val();
    var mattername = $("#casefiltercasename").val();
    var strtable = '';
    var strheader = '';
    var stritem = '';
    var q1 = 0;
    var qty = 0;
    openloader();
    $.ajax(
        {
            type: "POST",
            url: "/api/WorkFlowNewApi/MatterListByUser", // Controller/View
            dataType: 'json',
            data: formData,
            headers: { status: status, court: court, pagenum: cdecpageindex, pagesize: cdcpagesize, mattername: mattername },
            contentType: 'application/json;charset=utf-8',
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                    if (length == 0) {
                        $("#pdatastatus").show();
                        $("#divPagination").hide();
                    } else {
                        $("#pdatastatus").hide();
                        $("#divPagination").show();
                    }
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(cdcpagesize);
                            if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (cdecpageindex == totpage) {
                                $('#nexts').hide();
                                $('#prevs').css("display", "block"); 
                            }
                            else {
                                $('#nexts').css("display", "block");
                            }
                            if (cdecpageindex == 1) {
                                $('#prevs').css("display", "none");
                            }
                            else {
                                $('#prevs').css("display", "block");
                            }

                            if (isRenderPage == false) {
                                tatalRecordCount = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        //if (i === 0) {
                        //    firstvalue = val.rownum;
                        //}
                        //if (i === (length - 1)) {
                        //    var pnext = cdecpageindex;
                        //    var pprev = cdecpageindex;
                        //    var pageno = cdecpageindex;
                        //    var totdata = val.totRow;
                        //    var totpage = 0;
                        //    if (val.totRow > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(cdcpagesize);
                        //        if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#tpagnumvalue").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="tsotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + cdecpageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="tpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="tgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    if (val.totRow <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="tpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").append(tfot);
                        }
                        console.log(val.UserCaseid);
                        if (val.UserCaseid != "9dbUKXJkvTHXCyGY/dv0JQ==") {
                            btnclass = " details";
                            usercaseid = "<span><img src='/newassets/img/casedetail-grey.png' /></span>";
                            fileiconcase = "<img src='/newassets/img/casedetail-grey.png' />";
                            btnstyle = "";
                        }
                        else {
                            btnclass = "";
                            usercaseid = "";
                            fileiconcase = "";
                            btnstyle = "display:none";
                        }
                        if (val.cfile != null) {
                            btnclassdocs = "  ";
                            userdocs = "";
                            fileicon = "glyphicon glyphicon-folder-open";
                        }
                        else {
                            btnclassdocs = "";
                            userdocs = "";
                            fileicon = "";
                        }
                        qty = qty + 1;
                        var strodate = val.odate == null ? '' : formatDatetoIST(val.odate);
                        var strcdate = val.cdate == null ? '' : formatDatetoIST(val.cdate);
                        var tst = val.TotalCaseTime == null ? '' : val.TotalCaseTime;
                        var ftoken = "/DownloadFile.ashx?module=module&ftoken=" + enctypesingle(val.cfile);
                        var CourtName = "";
                        if (val.CourtName == "null" || val.CourtName == null || val.CourtName == "") {
                            CourtName = "";
                        }
                        else {
                            CourtName = val.CourtName;
                        }
                        stritem += '<tr>';
                        stritem += '<td>' + strodate + '</td>';
                        stritem += '<td ><a class="mycursor" id="opencase" data-val="' + val.Id + '">' + val.mname + '</a></td>';
                        stritem += '<td class="cstatus">' + CourtName + '</td>';
                        stritem += '<td class="casecasedetails"><a id="casedetails" href="javascript:void()" data-val="' + val.UserCaseid + '"  class="' + btnclass + '"  style="' + btnstyle + '">' + usercaseid + '</a></td>';
                        stritem += '<td>' + val.cstatus + '</td>';
                        stritem += '<td>' + val.assignuserto + '</td>';
                        stritem += '<td>' + val.PrimaryContactName + '</td>';
                        stritem += '<td>' + strcdate + '</td>';
                        stritem += '</tr >';
                        
                    });
                    $('#matterdata').html(stritem);
                    if (dashcw == "display:unset") {
                        $(".casecasedetails").show();
                    }
                    else {
                        $(".casecasedetails").hide();
                    }
                    closeloader();
                }
            },
            failure: function (data) {
                alert(data.responseText);
                closeloader();
            },
            error: function (data) {
                alert(data.responseText);
                closeloader();
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
//    $("#prev").toggleClass("disabled", pageindex === 1);
//    $("#next").toggleClass("disabled", pageindex === totdata);
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
    $("#pageNumberss").html(paginationHtml);
    $("#prevs").toggleClass("disabled", pageindex === 1);
    $("#nexts").toggleClass("disabled", pageindex === totPages);
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
    loaddata(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prevs", function () {

    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = true;
    $("#txtgopage").val("");
    loaddata(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#nexts", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    loadflag = true;
    isRenderPage = true;
    $("#txtgopage").val("");
    loaddata(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > tatalRecordCount) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    loadflag = true;
    isRenderPage = true;
    loaddata(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

    /*Pagination End*/
$(document).on("change", "#cdcfiltercourttype", function () {
    loaddata(1)
})
$(document).on("change", "#cdcfilterstatustype", function () {
    loaddata(1)
})
/*Load client matter data by status*/
function loaddatabystatus(strstatus) {
    var formData = new FormData();
    var strtable = '';
    var strheader = '';
    var stritem = '';
    var q1 = 0;
    openloader();
    strtable = $('<table id="example" border="1px solid" style="overflow-x:auto;" /><tr><th >').addClass('dataTable table table-bordered table-striped');
    $.ajax(
        {
            type: "POST",
            url: "/api/WorkFlowNewApi/MatterListByUser", // Controller/View
            dataType: 'json',
            data: formData,
            headers: { status: strstatus },
            contentType: 'application/json;charset=utf-8',
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    strheader = $('<thead><tr><th  class="name">Open Date</th><th  class="name">Case Name</th><th  class="name">Court</th><th  class="casecasedetails">Case Hearings</th><th  class="name">Status</th><th  class="name">Team Members</th><th  class="name">Client Contact </th> <th>Close Date </th></tr></thead>');
                    strtable.append(strheader);
                    stritem = "<tbody id='tbody'>";
                    $.each(obj, function (i, val) {
                        console.log(val.UserCaseid);
                        if (val.UserCaseid != "9dbUKXJkvTHXCyGY/dv0JQ==") {
                            btnclass = " details";
                            usercaseid = "<span><img src='/newassets/img/casedetail-grey.png' /></span>";
                            fileiconcase = "<img src='/newassets/img/casedetail-grey.png' />";
                            btnstyle = "";
                        }
                        else {
                            btnclass = "";
                            usercaseid = "";
                            fileiconcase = "";
                            btnstyle = "display:none";
                        }
                        if (val.cfile != null) {
                            btnclassdocs = "  ";
                            userdocs = "";
                            fileicon = "glyphicon glyphicon-folder-open";
                        }
                        else {
                            btnclassdocs = "";
                            userdocs = "";
                            fileicon = "";
                        }
                        q1 = q1 + 1;
                        var strodate = val.odate == null ? '' : val.odate.substring(0, 10);
                        var strcdate = val.cdate == null ? '' : val.cdate.substring(0, 10);
                        var tst = val.TotalCaseTime == null ? '' : val.TotalCaseTime;
                        var ftoken = "/DownloadFile.ashx?module=module&ftoken=" + enctypesingle(val.cfile);
                        var CourtName = "";
                        if (val.CourtName == "null" || val.CourtName == null || val.CourtName == "") {
                            CourtName = "";
                        }
                        else {
                            CourtName = val.CourtName;
                        }
                        stritem += '<tr><td>' + strodate + '</td><td ><a class="mycursor" id="opencase" data-val="' + val.Id + '">' + mname + '</a></td><td class="cstatus">' + CourtName + '</td><td class="casecasedetails"><a id="casedetails" href="javascript:void()" data-val="' + val.UserCaseid + '"  class="' + btnclass + '"  style="' + btnstyle + '">' + usercaseid + '</a></td><td>' + val.cstatus + '</td><td>' + val.assignuserto + '</td><td>' + val.PrimaryContactName + '</td><td>' + strcdate + '</td></tr>';
                        //}
                    });
                    stritem += "</tbody>";
                    strtable.append(stritem);
                    $('#matterdata').html(strtable);
                    if (dashcw == "display:unset") {
                        $(".casecasedetails").show();
                    }
                    else {
                        $(".casecasedetails").hide();
                    }
                    closeloader();
                }
            },
            failure: function (data) {
                alert(data.responseText);
                closeloader();
            },
            error: function (data) {
                alert(data.responseText);
                closeloader();
            }
        });
}
$(document).on("click", "#cnrcaselink", function () {
    var idstemp = $(this).attr("data-val");
    var caseidtemps = $(this).attr("case-val");
    var urls = "/" + fcode + "/Firm/cnrCasedetails";
    url_redirect({
        url: urls,
        method: "post",
        data: { "token": caseidtemps, "cnr": idstemp }
    });
});