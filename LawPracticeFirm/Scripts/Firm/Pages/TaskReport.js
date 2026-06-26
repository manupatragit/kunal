var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {
    //Reset Form 
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $("#taskClearReport").click(function () {
        $('#idtaskformreset')[0].reset();
    });
    $("#oexcel").click(function () {
        var fromdatefilter, todatefilter;
        fromdatefilter = $("#searchfrom").val();
        todatefilter = $("#searchto").val();
        var pagenum = pageindex;
        var pagesize = pagesize;
        var datefilterfrom = fromdatefilter;
        var datefilterto = todatefilter;
        var filtertask = $("#filtertask").val();
        var filterclient = $("#tasktimecontactvalue").val();
        var filteruser = $("#taskfilteruserschedule").val();
        var filterStatus = $("#taskfilterStatus").val();
        var filteruserby = "";
        var filteruserto = "";
        var filterduedate = "";
        var filtercasescheduler = $("#taskmatter").val();
        var filterscttime = "";
        var filterAcceptRejectBy = "";
        window.location = encodeURI("/Firm/ExportoExcelTaskReport?pagenum=1&pagesize=5000&datefilterfrom=" + datefilterfrom + "&datefilterto=" + datefilterto + "&filtertask=" + filtertask + "&filterclient=" + filterclient + "&filteruser=" + filteruser + "&filterStatus=" + filterStatus +
            "&filteruserby=" + filteruserby + "&filteruserto=" + filteruserto + "&filterduedate=" + filterduedate + "&filtercasescheduler=" + filtercasescheduler + "&filterscttime=" + filterscttime + "&filterAcceptRejectBy=" + filterAcceptRejectBy);
    });
    /*Pdf*/
    $("#opdf").click(function () {
        var fromdatefilter, todatefilter;
        fromdatefilter = $("#searchfrom").val();
        todatefilter = $("#searchto").val();
        var pagenum = pageindex;
        var pagesize = pagesize;
        var datefilterfrom = fromdatefilter;
        var datefilterto = todatefilter;
        var filtertask = $("#filtertask").val();
        var filterclient = $("#tasktimecontactvalue").val();
        var filteruser = $("#taskfilteruserschedule").val();
        var filterStatus = $("#taskfilterStatus").val();
        var filteruserby = "";
        var filteruserto = "";
        var filterduedate = "";
        var filtercasescheduler = $("#taskmatter").val();
        var filterscttime = "";
        var filterAcceptRejectBy = "";
        window.location = encodeURI("/Firm/ExportoPDFTaskReport?pagenum=1&pagesize=5000&datefilterfrom=" + datefilterfrom + "&datefilterto=" + datefilterto + "&filtertask=" + filtertask + "&filterclient=" + filterclient + "&filteruser=" + filteruser + "&filterStatus=" + filterStatus +
            "&filteruserby=" + filteruserby + "&filteruserto=" + filteruserto + "&filterduedate=" + filterduedate + "&filtercasescheduler=" + filtercasescheduler + "&filterscttime=" + filterscttime + "&filterAcceptRejectBy=" + filterAcceptRejectBy);
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
});
/*Load task details*/
function LoadTaskData(pageindex) {
    $("#tfooter").html("");
    var fromdatefilter, todatefilter;
    fromdatefilter = $("#searchfrom").val();
    todatefilter = $("#searchto").val();
    var srhmatter = $("#taskmatter option:selected").text();
    if (srhmatter == "Select") {
        srhmatter = "";
    }
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", EncodeText(pageindex));
    formData.append("pagesize", EncodeText(pagesize));
    formData.append("datefilterfrom", EncodeText(fromdatefilter));
    formData.append("datefilterto", EncodeText(todatefilter));
    formData.append("filtertask", EncodeText($("#filtertask").val()));
    formData.append("filterclient", EncodeText($("#tasktimecontactvalue").val()));
    formData.append("filteruser", EncodeText($("#taskfilteruserschedule").val()));
    formData.append("filterStatus", EncodeText($("#taskfilterStatus").val()));
    formData.append("filteruserby", EncodeText(""));
    formData.append("filteruserto", EncodeText(""));
    formData.append("filterduedate", EncodeText(""));
    formData.append("filtercasescheduler", EncodeText($("#taskmatter").val()));
    formData.append("filterscttime", EncodeText(""));
    formData.append("filterAcceptRejectBy", EncodeText(""));
    openload();
    var sct1 = $.ajax({
        async: true,
        type: "POST",
        url: "/api/ReportApi/PersonalDashboardCaseTaskList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#dataescstatus").html("");
                $("#taskpagination").show();
                $("#pdatastatus").hide();
            }
            else {
                $("#taskpagination").hide();
                $("#pdatastatus").show();
                //$("#dataescstatus").html("No result found !");
                closeload();
            }
            //var obj = JSON.parse(response1.Data);
            var length = response1.Data.length;
            var qty1 = 0;
            $.each(response1.Data, function (i, a) {
                if (i === 0) {
                    firstvalue = a.rownum;
                }
                var totdata = a.totRow;
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
                //    firstvalue = a.rownum;
                //}
                //if (i === (length - 1)) {
                //    var pnext = pageindex;
                //    var pprev = pageindex;
                //    var pageno = pageindex;
                //    var totdata = a.totRow;
                //    var totpage = 0;
                //    if (a.totRow > 0) {
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
                //    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                //    tfot += '<li><span>|</span></li>'
                //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                //    tfot += '<li><span>|</span></li>'
                //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                //    if (a.totRow <= length) {
                //    }
                //    else if (pageno == 1) {
                //    }
                //    else if (pageno == totpage) {
                //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                //    }
                //    else {
                //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                //    }
                //    if (pageno < totpage) {
                //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                //    }
                //    $("#tfooter").html(tfot);
                }
                qty1 = qty1 + 1;
                var AssignBycolor = "";
                var AssignTocolor = "";
                var ClientName = a.ClientName;
                var CaseName = a.CaseName;
                var AssignBy = a.AssignBy;
                var AssignTo = a.AssignTo;
                if (AssignTo == "ME") {
                    var AssignTocolor = "#069";
                }
                else {
                    var AssignTocolor = "maroon";
                }
                var AssignBy = a.AssignBy;
                if (AssignBy == "ME") {
                    AssignBycolor = "#069";
                }
                else {
                    var AssignBycolor = "maroon";
                }
                html3 += '<tr>'
                html3 += '<td class="scttime"><span>' + formatDatetoIST(a.CreateDate) + '</span></td>'
                html3 += '<td class="scttype"><span>' + a.TaskName + '</span></td>'
                html3 += '<td class="sctclient">'
                html3 += '<div style="float:left">'
                html3 += '<span id="clname" class="LoginId" style="cursor: pointer; color: #069" data-id="' + a.ClientId + '">' + ClientName + '</span><br>'
                html3 += '</div>'
                html3 += '</td>'
                html3 += '<td class="sctcase"><span id="caseid" style="cursor: pointer; color: #069" sno="' + a.CaseId + '">' + CaseName + '</span></td>'
                if (a.TDetails == "" || a.TDetails == null || a.TDetails == "null") {
                    html3 += '<td scope="row" class="sctbrief" ></td>'
                }
                else {
                    if (a.TDetails.length > 60) {
                        html3 += '<td class="sctbrief"><span class="comment more" style="">' + a.TDetails.substring(0, 60) + '</span>'
                        html3 += '<span data-toggle="collapse" data-target="#dt' + qty1 + '" style="color:#069;cursor:pointer"> more</span>'
                        html3 += ' <div id="dt' + qty1 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                        html3 += '' + a.TDetails + ''
                        html3 += '</div>'
                        html3 += '</td>'
                    }
                    else {
                        html3 += '<td class="sctbrief"><span class="comment more" style="">' + a.TDetails + '</span></td>'
                    }
                }
                html3 += '<td style=text-align:center>'
                html3 += '<span id="clname" > ' + AssignBy + '</span><br>'
                html3 += '</td>'
                html3 += '<td style="text-align:center" class="sctassigntoby">'
                html3 += '<span > ' + AssignTo + '</span>'
                html3 += '</td>'
                if (a.ActionByDate == "" || a.ActionByDate == null || a.ActionByDate == "null") {
                    html3 += '<td scope="row" class="AcceptRejectBy"></td>'
                }
                else {
                    html3 += '<td scope="row" class="AcceptRejectBy"><span class="text-success">' + formatDatetoIST(a.ActionByDate) + '</span></td>'
                }
                html3 += '<td style="text-align:center" class="sctduedate">' + formatDatetoIST(a.TaskDueDate) + '</td>'
                if (a.Status == "Completed") {
                    html3 += '<td><span  style="color:#76923c !important;font-size:12px;">' + a.Status + '</span></td>'
                }
                else if (a.Status == "In Process") {
                    html3 += '<td><span  style="color:#069 !important;font-size:12px;">' + a.Status + '</span></td>'
                }
                else {
                    html3 += '<td><span  style="color:red !important;font-size:12px;">' + a.Status + '</span></td>'
                }
                html3 += '</tr>'
            });
            $("#bindcasetask").html("");
            $("#bindcasetask").append(html3);
            var showChar = 150;
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
            closeload();
        },
        failure: function (data) {
            alert(data.responseText);
            closeload();
        },
        error: function (data) {
            alert(data.responseText);
            closeload();
        }
    });
    $.when(sct1).then(function (data, textStatus, jqXHR) {
        $("#schduleolli li input:checkbox:not(:checked)").each(function () {
            var column = "#schedulertable ." + $(this).attr("name");
            $(column).hide();
        });
        closeload();
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
    $("#pageNumbers").html(paginationHtml);
    $("#prev").toggleClass("disabled", pageindex === 1);
    $("#next").toggleClass("disabled", pageindex === totPages);
    isRenderPage = true;
}

var setPageNo = 1;
//$(document).on("click", ".page-btn", function () {
//    let page = $(this).data("page");
//    setPageNo = page;
//    //if (page) changePage(page);
//    loadflag = true;
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    LoadTaskData(setPageNo);
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
    LoadTaskData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

//$("#prev").click(function () {

//    if (setPageNo > 1) {
//        setPageNo = setPageNo - 1;
//    }
//    loadflag = true;
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    //renderPagination(setPageNo, totalPageRec)
//    LoadTaskData(setPageNo);
//    $(".page-btn").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});


$(document).on("click", "#prev", function ()  {

    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = false;
    $("#txtgopage").val("");
    //renderPagination(setPageNo, totalPageRec)
    LoadTaskData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

//$("#next").click(function () {
//    if (setPageNo => 1) {
//        setPageNo = setPageNo + 1;
//    }
//    loadflag = true;
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    LoadTaskData(setPageNo);
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
    LoadTaskData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

//$("#divGo").click(function () {
//    let goToPage = parseInt($("#txtgopage").val());
//    if (!isNaN(goToPage)) {
//        setPageNo = goToPage;
//    }
//    loadflag = true;
//    isRenderPage = true;
//    LoadTaskData(setPageNo);
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
    LoadTaskData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});


    /*Pagination End*/

$(document).on('click', '#searchdatas', function () {
    isRenderPage = false;
    LoadTaskData(pageindex);
});
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
            $("#taskfilteruserschedule option").remove();
            var option = '<option value="" selected>Select</option>';
            var html3 = '';
            $("#taskfilteruserschedule").append(option);
            $.each(obj, function (i, a) {
                if (a.roleid == 1) {
                    option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                    $("#taskfilteruserschedule").append(option);
                }
                else {
                    if (a.IsPartner == 1) {
                        if (a.roleid != 3) {
                            option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                            $("#taskfilteruserschedule").append(option);
                        }
                    }
                    else {
                        if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                            if (a.roleid != 3) {
                                option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                                $("#taskfilteruserschedule").append(option);
                            }
                        }
                        else {
                            if (a.roleid != 3) {
                                option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                                $("#taskfilteruserschedule").append(option);
                            }
                        }
                    }
                }
            });
            return false;
            //End of foreach Loop
            //console.log(response);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
$(document).on("click", ".LoginId", function () {
    var token = $(this).attr("data-id");
    var fcode = localStorage.getItem("FirmCode");
    var urls = "/" + fcode + "/Firm/ClientCaseList";
    url_redirect({
        url: urls,
        method: "post",
        data: { "clienttoken": token }
    });
});
$(document).on("click", "#caseid", function () {
    var token = $(this).attr("sno");
    var fcode = localStorage.getItem("FirmCode");
    var urls = "/" + fcode + "/Firm/NewCaseDashboard";
    url_redirect({
        url: urls,
        method: "post",
        data: { "token": token }
    });
});
$('#divcontent').off("click").on('click', '#getdatabypagenum', function () {
    pageindex = $("#pagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var pageindesx = $("#sotopage").text();
            if (pageindex <= parseInt(pageindesx)) {
                LoadTaskData(pageindex);
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
                return false;
            }
        }
    }
});
$(document).on('click', '#paginate', function () {
    pageindex = $(this).attr("index");
    LoadTaskData(pageindex);
});

$(document).on('change', '.chkdhide', function () {
    // your code
    var column = "." + $(this).attr("name");
    $(column).toggle();
});