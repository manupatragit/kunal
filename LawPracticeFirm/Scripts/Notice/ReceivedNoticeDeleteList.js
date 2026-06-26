var current_page = 1;
var records_per_page = 10;
var PageNumber = 1;
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var start = "";
var end = "";
var fromdaterange = false;
var fromreminder = false;
var remindernoticeid = "";
var companycountdata = 0;
var countdata = 0;
var ocreate, oedit, odelete = "";
var SortedOrder = "";
var arrcolmenuseleciton = [];
var arrcolmenuselecitonfix = [];
const statusClassMap = {
    "converted to matter": "Convertedmatter",
    "active": "active1",
    "settled": "Settled",
    "inactive": "InActive"
};
const priorityClassMap = {
    "low": "low",
    "medium": "medium",
    "high": "high",
};

$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $(document).on("click", "#cusnewtaskreq", function () {
        $('#myModalCustomizedcolumn').modal('show');
    });
    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        callapi();

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage = false;
        pageindex = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    GetNoticestatusForDropdown();
    callapi();
});
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
};
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var urltype = getUrlVars()["type"];
setTimeout(function () {
    ploadtabledata();
}, 3000);
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var countcustomfoeld = 0;
/*Load custom field data*/
function ploadtabledata() {
    var $table = '';
    var $header = '';
    var $head1 = '';
    var dt = '';
    var q1 = 2;
    var Iscustomflag = 0;
    var columnvalue = 0;
    var sort = 18;
    var type = 13;
    var rt1 = $.ajax({
        async: true,
        type: 'POST',
        url: '/api/demo/FirmEmployees1',
        headers: {
            'configurationtype': type
        },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                countcustomfoeld = obj.length;
                var $header = "";
                var option = "";
                $.each(obj, function (i, val) {
                    q1 = q1 + 1;
                    Iscustomflag = Iscustomflag + 1;
                    columnvalue = columnvalue + 1;
                    sort = sort + 1;
                    //start coding for custom header search
                    $header += '<th  class="Class' + q1 + '"><div class="thbg"><div style="float:left;width:80%"><input class="" id=customfieldsfilter' + q1 + ' type="text" placeholder="' + val.FieldName + '"  name="Class' + q1 + '" ></div><div style="float:left;width:20%"><span class="glyphicon glyphicon-search" idname="col' + Iscustomflag + '"  seq=' + q1 + ' idvals="' + val.FieldName + '" id="searchcustomfilters" style="margin:5px 0 0 -14px;float:right"></span><span idsss1=' + q1 + ' id="clearcustomfilters" class="clscustomfilters' + q1 + '" style="display:none;font-size:15px;color:black:font-weight:350;cursor:pointer;">x</span></div></div></th>';
                    //End
                    option += '<li data-subject="' + capitalizeFirstLetter(val.FieldName) + '"><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                });
                $header += '<th class="actioncase"><div class="thbg"><p style="width:130px;">Action</p></div></th>';
                $('#headrow1').append($header);
                $("#od1").append(option);
                SortData();
                var option1 = '<li><input id="select_allcfield"   type="checkbox"   > Select All</a></li>';
                $("#od1").append(option1);
            }
            else {
                //  alert("not found");
            }
        },
        error: function () {
            alert('Error!');
        }
    });
    $.when(rt1).then(function (data, textStatus, jqXHR) {
        if (urltype == "status" || urltype == "type" || urltype == "subject") {
            isRenderPage = false;
            callapi();
        }
        else {
            //  setTimeout(function () {
            isRenderPage = false;
            callapi();
            //  },2000);
        }
    });
}
$(document).on("change", "#ddlnoticestatusss", function () {
    isRenderPage = false;
    callapi();
});
/*Get notice status dropdown details*/
function GetNoticestatusForDropdown() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeStatusList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#ddlnoticestatusss").html("");
            $("#ddlnoticestatus").html("");
            $("#ddlnoticestatusss").append($("<option></option>").val("").text('Status'));
            $("#ddlnoticestatus").append($("<option></option>").val("").text(' Status'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#ddlnoticestatusss").append($("<option data-id=" + value.Id + "></option>").val(value.Name).text(value.Name));
                    $("#ddlnoticestatus").append($("<option data-id=" + value.Id + "></option>").val(value.Id).text(value.Name));
                    if (urltype != "undefined") {
                        if (urltype == "1") {
                            $("#ddlnoticestatusss").val("Convert to case");
                        }
                        else if (urltype == "2") {
                            $("#ddlnoticestatusss").val("Settled");
                        }
                    }
                });
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}
// Function to sort Data
function SortData() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od1").
            appendChild(e));
}
/*More custom details*/
function Custommore(valcol1, qty) {
    var htmlNew = "";
    if (valcol1.length > 60) {
        htmlNew += '<span class="comment more" style="">' + valcol1.substring(0, 60) + '</span>'
        htmlNew += '<span data-toggle="collapse" data-target="#dtn2' + qty + '" style="color:black;cursor:pointer"> more</span>'
        htmlNew += ' <div id="dtn2' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
        htmlNew += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn2' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
        htmlNew += '' + valcol1 + ''
        htmlNew += '</div>'
    }
    else {
        htmlNew += valcol1;
    }
    return htmlNew;
}
/*Get delete received notice details list*/
function callapi() {
    openload();
    var html = '';
    var notistatus = $('input[name=statustype]:checked').val();
    var NoticeSubjectsrh = $("#NoticeSubjectsrh").val();
    var Noticetitsrch = $("#Noticetitsrch").val();
    var ddlnoticetypess = $("#ddlnoticetypess").val();
    var ddlnoticestatusss = $("#ddlnoticestatusss").val();
    var SenderNameSrch = $("#NoticeeendersNametxt").val();
    var othdetailsofsender = $("#othdetailsofsender").val();
    if (ddlnoticetypess == null) {
        ddlnoticetypess = "";
    }
    if (ddlnoticestatusss == null) {
        ddlnoticestatusss = "";
    }
    if (SenderNameSrch == null) {
        SenderNameSrch = "";
    }
    if (Noticetitsrch == null) {
        Noticetitsrch = "";
    }
    if (NoticeSubjectsrh == null) {
        NoticeSubjectsrh = "";
    }
    if (othdetailsofsender == null) {
        othdetailsofsender = "";
    }
    var formData = new FormData();
    formData.append("ColumName", EncodeText(othdetailsofsender));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("fromdaterange", EncodeText(fromdaterange));
    formData.append("startdate", EncodeText(start));
    formData.append("enddate", EncodeText(end));
    formData.append("fromreminder", EncodeText(fromreminder));
    formData.append("NoitceId", EncodeText(NoticeId));
    formData.append("SearchValue", EncodeText(Noticetitsrch));
    formData.append("NoticeSubjectsrh", EncodeText(NoticeSubjectsrh));
    formData.append("ddlnoticetypess", EncodeText(ddlnoticetypess));
    formData.append("ddlnoticestatusss", EncodeText(ddlnoticestatusss));
    formData.append("SenderNameSrch", EncodeText(SenderNameSrch));
    formData.append("CaseNoticeStatus", EncodeText(ddlnoticestatusss));
    $.ajax({
        type: "POST",
        url: '/api/NoticeReceived/DeleteReceivedNoticeList',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            closeload();
            $("#Rejoindertablevalue").html("");
            $("#listingTablefooter").html("");
            $("#rejoindernonotice").html("");
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            if (response == "") {
                document.querySelector(".pagination").style.display = "none";
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                $("#rejoindernonotice").append('<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No  list found</h4>' +
                    '<p>We found no  list.</p>' +
                    '</div>');
                return false;
            }
            else {
                document.querySelector(".pagination").style.display = "flex";

                if (1 == 1) {
                    $.each(response, function (i, a) {
                        oedit = a.oedit;
                        odelete = a.odelete;
                        ocreate = a.ocreate;
                        return false;
                    });
                    var qty = 0;
                    $.each(response, function (i, a) {
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        var totdata = a.TotalRows;
                        //For Total Grid Count
                        $("#DelNoticeRCount").text("(" + totdata + ")");
                        if (i === (response.length - 1)) {
                            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                            totrecord = a.TotalRows;

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
                                renderPagination(pageindex, totpage);
                            }

                        }
                        var span = document.createElement('span');
                        span.innerHTML = a.CreateRejoinder;
                        var trcolordata = "";
                        var d1 = new Date();
                        var d2 = new Date(a.DueDateOfNotice);
                        var trval = "";
                        if ((dateFormat(new Date()) == dateFormat(new Date(a.DueDateOfNotice)))) {
                            trval = "<tr class='tbltrcls " + a.NoticeID + "' Id='reminderhighlighcls'>";
                        }
                        else {
                            trval = "<tr class='tbltrcls " + a.NoticeID + "'>";
                        }
                        html += trval;
                        html += "<td>" + a.RowId + "</td>";
                        if (a.IsReplyReceivedCount > 0) {
                            html += "<td class='sendernames'>" + a.SendersName + "  <span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor:pointer; ' onclick=ViewMoreItem1('" + a.NoticeID + "') ></span ></td>";
                        } else {
                            html += "<td class='sendernames'>" + a.SendersName + "</td>";
                        }
                        html += "<td class='rejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                        html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                        html += "<td class='dateofcreatingrejoinder'>" + (a.DateofNotice == null ? ' ' : dateFormat(new Date(a.DateofNotice))) + "</td>";
                        html += "<td class='dateofserviceofnotice'>" + (a.DateofServiceofNotice == null ? ' ' : dateFormat(new Date(a.DateofServiceofNotice))) + "</td>";
                        if (a.DueDateOfNotice == "1900-01-01T00:00:00") {
                            html += "<td class='DuedateOfNotice'></td>";
                        }
                        else {
                            html += "<td class='DuedateOfNotice'>" + (a.DueDateOfNotice == null ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                        }
                        if (a.CreateRejoinder.length > 0) {
                            html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReceivedNotice") title="View more">View more</a>' + "</td>";
                        }
                        else {
                            html += "<td  class='remark'>" + span.innerText + "</td>";
                        }
                        const statusKey = (a.CaseStatus || "").toLowerCase();
                        if (statusClassMap[statusKey]) {
                            html += `<td class="pending"><div class="status_badge"><span class="${statusClassMap[statusKey]}"></span>${a.CaseStatus || ""}</div></td>`;
                        }
                        else {
                            html += "<td class='pending'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";
                        }                        html += "<td class='statutory'>" + a.NoticeType + "</td>";
                        html += "<td class='noticesubject'>" + a.RejoinderSubject + "</td>";
                        html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                        html += "<td class='modeofreceipt'>" + a.ModeofReceipt + "</td>";
                        html += "<td class='rejoinderthrough'>" + a.NoticeThrough + "</td>";
                        const priorityKey = (a.Criticality || "").toLowerCase();
                        if (priorityClassMap[priorityKey]) {
                            html += `<td class="criticality"><div class="status_badge"><span class="${priorityClassMap[priorityKey]}"></span>${a.Criticality || ""}</div></td>`;
                        }
                        else {
                            html += "<td  class='criticality'>" + (a.Criticality == 0 ? '' : a.Criticality) + "</td>";
                        }                         html += "<td class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                        html += "<td class='amountclaimed'>" + (a.AmountClaimed == '0' ? '' : a.AmountClaimed) + "</td>";
                        html += "<td  class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                        html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                        html += "<td  class='SendersAddress'>" + a.SendersAddress + "</td>";
                        html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                        html += "<td class='tags'>" + a.Tag + "</td>";
                        html += "<td  class='ReferenceNumber'>" + a.NoticeReference + "</td>";
                        html += "<td  class='InternalNumber'>" + a.IntNoticeReference + "</td>";
                        if (a.ActualDateOfClosure == null) {
                            html += "<td class='closdate'></td>";
                        }
                        else {
                            html += "<td class='closdate'>" + a.ActualDateOfClosure.split() + "</td>";
                        }
                        if (a.IsFileAvailable) {
                            html += '<td class="attachment"><i  aria-hidden="true" id="incomingnoticerelevantdoc" style="cursor:pointer; textalign:center;color:#fd7e14;" id-val="' + a.NoticeID + '" id-type="ReceivedNotice"><img src="/newassets/img/folder-icon.png"></i></td>';
                        }
                        else {
                            html += '<td class="attachment"></td>';
                        }
                        //for custmized fields start
                        var countcf = countcustomfoeld;
                        for (var str = 1; str <= countcf; str++) {
                            if (str == 1) {
                                if (a.col1 == "") {
                                    html += "<td  class='class3'><span>&nbsp;</span></td>";
                                }
                                else if (a.col1 == null) {
                                    html += "<td  class='class3'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col1, qty + 'a' + str);
                                    html += "<td  class='class3'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 2) {
                                if (a.col2 == "") {
                                    html += "<td  class='class4'><span>&nbsp;</span></td>";
                                }
                                else if (a.col2 == null) {
                                    html += "<td  class='class4'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col2, qty + 'a' + str);
                                    html += "<td  class='class4'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 3) {
                                if (a.col3 == "") {
                                    html += "<td  class='class5'><span>&nbsp;</span></td>";
                                }
                                else if (a.col3 == null) {
                                    html += "<td  class='class5'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col3, qty + 'a' + str);
                                    html += "<td  class='class5'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 4) {
                                if (a.col4 == "") {
                                    html += "<td  class='class6'><span>&nbsp;</span></td>";
                                }
                                else if (a.col4 == null) {
                                    html += "<td  class='class6'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col4, qty + 'a' + str);
                                    html += "<td  class='class6'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 5) {
                                if (a.col5 == "") {
                                    html += "<td  class='class7'><span>&nbsp;</span></td>";
                                }
                                else if (a.col5 == null) {
                                    html += "<td  class='class7'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col5, qty + 'a' + str);
                                    html += "<td  class='class7'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 6) {
                                if (a.col6 == "") {
                                    html += "<td  class='class8'><span>&nbsp;</span></td>";
                                }
                                else if (a.col6 == null) {
                                    html += "<td  class='class8'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col6, qty + 'a' + str);
                                    html += "<td  class='class8'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 7) {
                                if (a.col7 == "") {
                                    html += "<td  class='class9'><span>&nbsp;</span></td>";
                                }
                                else if (a.col7 == null) {
                                    html += "<td  class='class9'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col7, qty + 'a' + str);
                                    html += "<td  class='class9'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 8) {
                                if (a.col8 == "") {
                                    html += "<td  class='class10'><span>&nbsp;</span></td>";
                                }
                                else if (a.col8 == null) {
                                    html += "<td  class='class10'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col8, qty + 'a' + str);
                                    html += "<td  class='class10'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 9) {
                                if (a.col9 == "") {
                                    html += "<td  class='class11'><span>&nbsp;</span></td>";
                                }
                                else if (a.col9 == null) {
                                    html += "<td  class='class11'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col9, qty + 'a' + str);
                                    html += "<td  class='class11'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 10) {
                                if (a.col10 == "") {
                                    html += "<td  class='class12'><span>&nbsp;</span></td>";
                                }
                                else if (a.col10 == null) {
                                    html += "<td  class='class12'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col10, qty + 'a' + str);
                                    html += "<td  class='class12'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 11) {
                                if (a.col11 == "") {
                                    html += "<td  class='class13'><span>&nbsp;</span></td>";
                                }
                                else if (a.col11 == null) {
                                    html += "<td  class='class13'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col11, qty + 'a' + str);
                                    html += "<td  class='class13'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 12) {
                                if (a.col12 == "") {
                                    html += "<td  class='class14'><span>&nbsp;</span></td>";
                                }
                                else if (a.col12 == null) {
                                    html += "<td  class='class14'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col12, qty + 'a' + str);
                                    html += "<td  class='class14'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 13) {
                                if (a.col13 == "") {
                                    html += "<td  class='class15'><span>&nbsp;</span></td>";
                                }
                                else if (a.col13 == null) {
                                    html += "<td  class='class15'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col13, qty + 'a' + str);
                                    html += "<td  class='class15'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 14) {
                                if (a.col14 == "") {
                                    html += "<td  class='class16'><span>&nbsp;</span></td>";
                                }
                                else if (a.col14 == null) {
                                    html += "<td  class='class16'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col14, qty + 'a' + str);
                                    html += "<td  class='class16'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 15) {
                                if (a.col15 == "") {
                                    html += "<td  class='class17'><span>&nbsp;</span></td>";
                                }
                                else if (a.col15 == null) {
                                    html += "<td  class='class17'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col15, qty + 'a' + str);
                                    html += "<td  class='class17'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                        }
                        if (roleid == "3") {
                            html += '<td></td>';
                        }
                        else {
                            html += '<td>';
                            html += '<a style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title="Restore Notice"><img src="/newassets/img/restore-icon.png" /></a> <a style="cursor:pointer;"  onclick=fnviewlog("' + a.NoticeID + '","3") title="View Feedback"><img src="/newassets/img/causelist-icon.png" /></a><a style="cursor:pointer;" onclick=FinalConfirmDelete("' + a.NoticeID + '") title="Delete Permanently"><img src="/newassets/img/deletecasesingle-icon.png" /></a>'
                        }
                        html += "<tr>";
                    });
                    $("#Rejoindertablevalue").append(html);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                }
            }
        },
        error: function (xhr) {
            alert('error');
        }
    })
};
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var filetype = $(this).attr("id-type");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=" + filetype + "&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
/*Date format*/
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
$(document).on('change', '#select_allcfield', function () {
    if ($(this).is(':checked')) {
        $('.chkdhide').each(function () {
            if ($(this).prop('checked')) {
                var column = "." + $(this).attr("name");
                $(column).toggle();
            }
        });
    }
    else {
    }
    $(".chkdhide").prop('checked', $(this).prop('checked'));
    $('.chkdhide').each(function () {
        var column = "." + $(this).attr("name");
        if (String(column) != "undefined") {
            if ($(this).prop('checked')) {
                arrcolmenuseleciton.push($(this).attr("name"));
            }
            else {
                arrcolmenuseleciton.splice($.inArray($(this).attr("name"), arrcolmenuseleciton), 1);
            }
            $(column).toggle();
        }
    });
    isRenderPage = false;
    callapi();
});

/*Confirm delete notice details*/
var ConfirmDelete = function (NoticeID) {
    DelNoticeId = NoticeID;
    /* $("#myModal").modal('show');*/
    if (confirm("Are you sure you want to unmark the Notice from deletion list?")) {
        formdata = new FormData();
        formdata.append("NoticeId", EncodeText(DelNoticeId))
        formdata.append("deleteflag", EncodeText("0"))
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/NoticeDelete",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result) {
                    alert("Record restore successfully.")
                }
                else {
                    alert("Something went wrong.")
                }
                window.location.reload();
            }
        })
    }
    return false;
}
/*Permanently delete notice by notice id*/
var FinalConfirmDelete = function (NoticeID) {
    FinalNoticeId = NoticeID;
    var result = confirm("Are you sure you want to delete notice?");
    if (result) {
        formdata = new FormData();
        formdata.append("NoticeId", EncodeText(FinalNoticeId))
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/FinalNoticeDelete",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result) {
                    alert("Record deleted successfully.")
                }
                else {
                    alert("Something went wrong.")
                }
                window.location.reload();
            }
        })
    }
}
function fnviewlog(noticeid, usertype) {
    $("#ViewLogModal").modal('show');
    $("#modlbody").html('');
    var html = '';
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('Usertype', EncodeText(usertype));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewNoticeLog",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {
            $.each(response.Data, function (key, data) {
                var remark = data.Remark == null ? "" : data.Remark;
                var approvalstatus = data.iApprovalStatus == "Approve" ? "Approved" : data.iApprovalStatus;
                if (data.iApproverType == 2) {
                    ApproveType = "User";
                } else if (data.iApproverType == 3) {
                    ApproveType = "Client";
                } else {
                    ApproveType = "NA";
                }
                html += `<tr>
                        <td>`+ data.sendername + `</td>
                        <td>`+ data.receivername + `</td>
                        <td>`+ dateFormat(new Date(data.dSendDate)) + `</td>
                        <td>`+ ApproveType + `</td>
                        <td>`+ remark + `</td >
                        <tr/>`
            })
            $("#modlbody").html(html);
        },
    })
}
/*View notice more content*/
function viewcontent(noticeid, param) {
    $("#ViewMoreModal").modal('show');
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('param', EncodeText(param));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewMore",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#viewmoreheader").html("");
            $("#viewmorecontent").html("");
            $("#viewmoreheader").html("Rejoinder Notice");
            $("#viewmorecontent").html(data.Data.message)
        },
    })
}
var childtblclickcount1 = 0;
var childtblclickcount = 0;
/*Bind reply notice details*/
function ViewMoreItem1(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="11"><div class="poptable">
        <div id="tblpoitem" class="poptable" data-example-id="hoverable-table">
        <h2>REPLY</h2>
        <table class= "table-panel tblReplyReceived" id="table`+ parentId + `">
        <thead>
            <tr>
                           <th class="childtbltreplycls"><div class="thbg">No</div></th>
                            <th class="replyfrom" data-column="RespondentsName" data-order="desc"><div class="thbg">Sender's Name</div> </th>
                            <th class="replyaddressedto" data-column="ReplyAddressedto" data-order="desc" title="Receiver's Name"><div class="thbg">Sent To</div></th>
                            <th class="noticedate" data-column="ReplytoNoticeCreatedOn" data-order="desc"><div class="thbg">Date of Reply</div></th>
                            <th class="noticesenddatechild"><div class="thbg">Date of dispatch</div></th>
                            <th class="duedate" data-column="DueDateOfNotice" data-order="desc"><div class="thbg">Due Date</div></th>
                            <th class="remark" data-column="CreateReply" data-order="desc"><div class="thbg">Text</div> </th>
                            <th class="modeofserviceordelivery" data-column="ModeofServiceorDelivery" data-order="desc"><div class="thbg">Mode</div></th>
                            <th class="replythrough" data-column="ReplyThrough" data-order="desc"><div class="thbg">Notice Through/To</div></th>
                            <th class="noticetitle" data-column="NoticeTitle" data-order="desc"><div class="thbg">Title</div> </th>
                            <th class="noticesubject" data-column="ReplySubject" data-order="desc"><div class="thbg">Subject</div></th>
                            <th class="statutory" data-column="NoticeType" data-order="desc"><div class="thbg">Type</div> </th>
                            <th class="tags" data-column="Tag" data-order="desc"><div class="thbg">Tags</div></th>
                            <th class="priority" data-column="Criticality" data-order="desc"><div class="thbg">Priority</div></th>
                            <th class="reasonforhighpriority" data-column="Resonforhighpriority" data-order="desc"><div class="thbg">Reason For High Priority</div></th>
                            <th class="claimamount" data-column="AmountClaimed" data-order="desc"><div class="thbg">Amount Claimed</div></th>
                            <th class="pending" data-column="CaseStatus" data-order="desc"><div class="thbg">Status</div></th>
                            <th class="dispatched" data-column="DateofDelivery" data-order="desc"><div class="thbg">Date of Delivery</div> </th>
                            <th class="addresseeaddress" data-column="AddresseeAddress" data-order="desc"><div class="thbg">Receiver's Address</div> </th>
                            <th class="otherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc"><div class="thbg">Other Details of Receiver</div> </th>
                            <th class="respondentsaddress" data-column="RespondentsAddress" data-order="desc"><div class="thbg">Sender's Address</div> </th>
                            <th class="otherdetailsofrespondent" data-column="OtherDetailsofRespondent" data-order="desc"><div class="thbg">Other Details of Sender</div> </th>
                            <th class="noticeTrackingIdchild"><div class="thbg">Consignment No.</div></th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonoticechild"></tbody>
                        </table >
        <center> <div id="noreplytonoticechild"> </div></center>
</div>
         <div class="table-panel">
                    <div class="settingpanel">
                        <div class="col-md-6" id="footer-data">
                            <div style="float: left;padding: 0 10px 0 0;">
                                <ul>
                                    <li>
                                        <div class="btn-group dropup">
                                            <a href="javascript:void()" class="dropdown-toggle selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="glyphicon glyphicon-cog" style="font-size:14px;color:black;padding:0 5px 0 0 "></span>
                                                Customize Fields
                                            </a>
                                            <ul class="dropdown-menu settingshowhide" id="od" style="width:255px">
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="claimamount"><a href="#">Amount Claimed</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticeTrackingIdchild"><a>Consignment No.</a></li>                                            
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="dispatched"><a href="#">Date of Delivery</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticesenddatechild" checked><a>Date of dispatch</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticedate" checked><a href="#">Date of Notice</a></li>                                           
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="duedate" checked><a href="#">Due Date</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="modeofserviceordelivery" checked><a href="#">Mode</a></li>                                               
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="pending"><a href="#">Notice Status</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="remark" checked><a href="#" class="dropdown-item">Notice Text</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="replythrough" checked><a href="#">Notice Through/To</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="otherdetailsofrespondent"><a href="#" class="dropdown-item">Other Details of Sender</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="otherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="priority"><a href="#">Priority</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="reasonforhighpriority"><a href="#">Reason For High Priority</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="addresseeaddress"><a href="#">Receiver's Address</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticesubject"><a href="#">Subject</a></li>                                                
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="respondentsaddress"><a href="#">Sender's Address</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="replyfrom" checked><a href="#">Sender's Name</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="replyaddressedto" checked><a href="#">Sent To</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="tags"><a href="#">Tags</a></li>
<li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticetitle"><a href="#">Title</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="statutory"><a href="#">Type</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="listingTableReplyFooterchild"></div>
                        </div>
                        <div class="col-md-6">
                                                    </div>
                </div>
</div>
       </div></td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        NoticeParentId = parentId;
        var formData = new FormData();
        formData.append("SearchValue", EncodeText(""));
        formData.append("ColumName", EncodeText(ColumName));
        formData.append("SortedOrder", EncodeText(SortedOrder));
        formData.append("PageNumber", EncodeText(PageNumber));
        formData.append("PageSize", EncodeText(10));
        formData.append("parentId", EncodeText(parentId));
        var html = '';
        $.ajax({
            type: "POST",
            url: '/api/ReplyToNotice/ReplyToNoticeListByNoticeId',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                var response1 = JSON.parse(response.Data);
                response1 = response1.reverse();
                closeload();
                $("#tablevalueReplytonoticechild").html("");
                $("#listingTableReplyFooterchild").html("");
                $("#noreplytonoticechild").html("");
                if (response1 == "") {
                    $("#noreplytonoticechild").append("No Records found.");
                    return false;
                }
                else {
                    if (1 == 1) {
                        $.each(response1, function (i, a) {
                            if (i === 0) {
                                firstvalue = a.rownum;
                            }
                            if (i === (response.length - 1)) {
                                var pnext = pageindex;
                                var pprev = pageindex;
                                var pageno = pageindex;
                                var totdata = a.TotalRows;
                                var totpage = 0;
                                if (a.TotalRows > 0) {
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
                                tfot += '<ul>'
                                tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer" class="gobtn">Go</button> </li>'
                                if (a.TotalRows <= response.length) {
                                }
                                else if (pageno == 1) {
                                }
                                else if (pageno == totpage) {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                }
                                else {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                }
                                if (pageno < totpage) {
                                    tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                                }
                                tfot += '</ul>'
                                $("#listingTableReplyFooterchild").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateReply;
                            html += "<tr class=" + a.NoticeID + ">";
                            if (a.IsReplyReceivedCount > 0) {
                                html += "<td>" + a.RowId + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor: pointer;position:relative;left:5px' onclick=ViewMoreItem2('" + a.NoticeID + "')></span></td>";
                            }
                            else {
                                html += "<td>" + a.RowId + "</td>";
                            }
                            html += "<td  class='replyfrom'>" + a.SendersName + "</td>";
                            html += "<td class='replyaddressedto'>" + a.ReplyAddressedto + "</td>";
                            html += "<td class='noticedate'>" + (a.ReplytoNoticeCreatedOn == null || a.ReplytoNoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ReplytoNoticeCreatedOn))) + "</td>";
                            html += "<td  class='noticesenddatechild'>" + (a.DateOfDispatch == null || a.ddate == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateOfDispatch))) + "</td>"
                            if (a.DueDateOfNotice == "1900-01-01T00:00:00" || a.DueDateOfNotice == null) {
                                html += "<td class='duedate'></td>";
                            }
                            else {
                                html += "<td class='duedate'>" + (a.DueDateOfNotice == null ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                            }
                            if (a.CreateReply.length > 0) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReplyNotice") title="View more"><img src="/newassets/img/view-icon.png"></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='remark'>" + span.innerText + "</td>";
                            }
                            html += "<td  class='modeofserviceordelivery'>" + (a.ModeofServiceorDelivery == "null" ? '' : a.ModeofServiceorDelivery) + "</td>";
                            html += "<td  class='replythrough'>" + (a.NoticeThrough == "null" ? '' : a.NoticeThrough) + "</td>";
                            html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='noticesubject'>" + (a.ReplySubject == "'" ? '' : a.ReplySubject) + "</td>";
                            html += "<td class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td  class='tags'>" + a.Tag + "</td>";
                            if (a.Criticality == null || a.Criticality == "0") {
                                html += "<td class='priority'></td>";
                            }
                            else {
                                html += "<td class='priority'>" + a.Criticality + "</td>";
                            }
                            if (a.Resonforhighpriority == null) {
                                html += "<td class='reasonforhighpriority'></td>";
                            }
                            else {
                                html += "<td class='reasonforhighpriority'>" + a.Resonforhighpriority + "</td>";
                            }
                            if (a.AmountClaimed == "0" || a.AmountClaimed == null) {
                                html += "<td class='claimamount'></td>";
                            }
                            else {
                                html += "<td class='claimamount'>" + a.AmountClaimed + "</td>";
                            }
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='otherdetailsofaddressee'>" + (a.OtherDetailsofAddressee == "undefined" ? '' : a.OtherDetailsofAddressee) + "</td>";
                            html += "<td class='respondentsaddress'>" + a.RespondentsAddress + "</td>";
                            html += "<td class='otherdetailsofrespondent'>" + a.OtherDetailsofRespondent + "</td>";
                            html += "<td  class='noticeTrackingIdchild'>" + a.ConsignmentNum + "</td>";
                            html += "<tr>";
                        });
                        $("#tablevalueReplytonoticechild").append(html);
                        $("input:checkbox:not(:checked)").each(function () {
                            var column = "table ." + $(this).attr("name");
                            $(column).hide();
                        });
                    }
                }
            },
            error: function (xhr) {
                alert('error');
            }
        })
    }
}

/*Add rejoinder notice*/
var childtblrejoinderclickcount = 0;
function ViewMoreItem2(parentId) {
    if (childtblrejoinderclickcount == 1) {
        $("#childrejoindertbltr").remove();
        childtblrejoinderclickcount = 0;
    }
    else {
        childtblrejoinderclickcount = 1;
        $(`<tr id="childrejoindertbltr"><td colspan="27"><div id="tblrejoinderitem" class="table-panel table-responsive" style="padding:10px; overflow-x:auto;" data-example-id="hoverable-table">
<h2>REJOINDER</h2>
        <table class= "table tblrejoinderclass" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr>
                        <th class="childrejoinderSN" data-column="RejoinderSN" data-order="desc"><div>No</div></th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc" title="Sender's Name"><div>Received From</div></th>
                        <th class="childnoticesender" data-column="SendersName" data-order="desc" title="Receiver's Name"><div>Sent To</div></th>
                        <th class="childdateofrejoinder" data-column="DateofRejoinder" data-order="desc"><div>Date of Rejoinder</div></th>
                        <th class="childdateofreceipt" data-column="DateofReceipt" data-order="desc"><div>Received on Date</div></th>
                        <th class="childnoticeduedate" data-column="DueDateOfNotice" data-order="desc"><div>Due Date</div></th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc"><div>Title</div></th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc"><div>Subject</div></th>
                       <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc"><div>Mode</div></th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc"><div>Text </div></th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc"><div>Status</div></th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc"><div>Type</div></th>                        
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc"><div>Date of Delivery</div></th>                        
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc"><div>Receiver's Address</div></th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc"><div>Other Details of Receiver</div></th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc"><div>Notice Through/To</div></th>
                        <th class="childcriticality" data-column="Criticality" data-order="desc"><div>Priority</div></th>
                        <th class="childreasonforhighpriority" data-column="Resonforhighpriority" data-order="desc"><div>Reason For High Priority</div></th>
                        <th class="childtag" data-column="Tag" data-order="desc"><div>Tags</div></th>
                        <th class="childclaimamount" data-column="AmountClaimed" data-order="desc"><div>Amount Claimed</div></th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonotice"></tbody>
                        </table >
        <center> <div id="noreplytonotice"> </div></center>
       </div>
<div class="table-panel" style="margin: 6px 0 0 24px;">
                    <div class="row settingpanel">
                        <div class="col-md-6" id="footer-data">
                            <div style="float: left;padding: 0 10px 0 0;">
                                <ul>
                                    <li>
                                        <div class="btn-group dropup">
                                            <a href="javascript:void()" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="glyphicon glyphicon-cog" style="font-size:14px;color:black;padding:0 5px 0 0 "></span>
                                                Customize Fields <span class="glyphicon glyphicon-chevron-down"></span>
                                            </a>
                                            <ul class="dropdown-menu settingshowhide" id="od" style="width:260px">
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childclaimamount"><a href="#">Amount Claimed</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdispatched"><a href="#">Date of Delivery </a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofrejoinder" checked><a href="#">Date of Rejoinder</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticeduedate" checked><a href="#">Due Date</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofdeliveryofrejoinder" checked><a href="#">Mode of Delivery</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending"><a href="#">Notice Status</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#">Notice Text</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderthrough"><a href="#">Notice Through/To</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childcriticality"><a href="#">Priority</a></li>
<li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderaddressedto" checked><a href="#" class="dropdown-item">Received From</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childreasonforhighpriority"><a href="#">Reason For High Priority</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Receiver's Address</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesender" checked><a href="#">Sent To</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject"><a href="#">Subject</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childtag"><a href="#">Tags</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle" ><a href="#">Title</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childstatutory"><a href="#">Type</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="listingTableReplyFooter" style="display:none;"></div>
                        </div>
                        <div class="col-md-6" style="padding-right:20px">
                                                    </div>
                    </div>
                </div>
</td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        var formData = new FormData();
        formData.append("SearchValue", EncodeText(""));
        formData.append("ColumName", EncodeText(ColumName));
        formData.append("SortedOrder", EncodeText(SortedOrder));
        formData.append("PageNumber", EncodeText(PageNumber));
        formData.append("PageSize", EncodeText(10));
        formData.append("parentId", EncodeText(parentId));
        var html = '';
        $.ajax({
            type: "POST",
            url: '/api/RejoinderNotice/RejoinderNoticeListbyNoticeId',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response1) {
                var response = JSON.parse(response1.Data);
                response = response.reverse();
                closeload();
                $("#tablevalueReplytonotice").html("");
                $("#listingTableReplyFooter").html("");
                $("#noreplytonotice").html("");
                if (response == "") {
                    $("#noreplytonotice").append("No Records found.");
                    return false;
                }
                else {
                    if (1 == 1) {
                        $.each(response, function (i, a) {
                            oedit = a.oedit;
                            odelete = a.odelete;
                            ocreate = a.ocreate;
                            return false;
                        });
                        $.each(response, function (i, a) {
                            if (i === 0) {
                                firstvalue = a.rownum;
                            }
                            if (i === (response.length - 1)) {
                                var pnext = pageindex;
                                var pprev = pageindex;
                                var pageno = pageindex;
                                var totdata = a.TotalRows;
                                var totpage = 0;
                                if (a.TotalRows > 0) {
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
                                tfot += '<ul>'
                                tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                                if (a.TotalRows <= response.length) {
                                }
                                else if (pageno == 1) {
                                }
                                else if (pageno == totpage) {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                }
                                else {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                }
                                if (pageno < totpage) {
                                    tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                                }
                                tfot += '</ul>'
                                $("#listingTableReplyFooter").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateRejoinder;
                            html += "<tr>";
                            html += "<td class='childrejoinderSN'>" + a.RowId + "</td>";
                            html += "<td class='childrejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                            html += "<td class='childnoticesender'>" + a.SendersName + "</td>";
                            html += "<td class='childdateofrejoinder'>" + (a.DateofCreatingRejoinder == null ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                            html += "<td class='childdateofrejoinder'>" + (a.DateofReceipt == null || a.DateofReceipt == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>";
                            html += "<td class='childnoticeduedate'>" + (a.DueDateOfNotice == null || a.DueDateOfNotice == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>"; //for due date of notice in Received Rejoinder Table
                            html += "<td class='childnoticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='childnoticesubject'>" + a.RejoinderSubject + "</td>";
                            html += "<td class='childmodeofdeliveryofrejoinder'>" + a.ModeofDeliveryofRejoinder + "</td>";
                            if (a.CreateRejoinder.length > 60) {
                                html += "<td  class='childremark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"><img src="/newassets/img/view-icon.png"></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='childremark'>" + span.innerText + "</td>";
                            }
                            html += "<td class='childpending'>" + a.CaseStatus + "</td>";
                            html += "<td class='childstatutory'>" + a.NoticeType + "</td>";
                            html += "<td class='childdispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td  class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childrejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' ? '' : a.RejoinderThrough) + "</td>";
                            html += "<td class='childcriticality'>" + a.Criticality + "</td>";
                            html += "<td class='childreasonforhighpriority'>" + a.Resonforhighpriority + "</td>";
                            html += "<td class='childtag'>" + a.Tag + "</td>";
                            if (a.AmountClaimed == null || a.AmountClaimed == "0") {
                                html += "<td class='childclaimamount'></td>";
                            }
                            else {
                                html += "<td class='childclaimamount'>" + a.AmountClaimed + "</td>";
                            }
                            html += "<tr>";
                        });
                        $("#tablevalueReplytonotice").append(html);
                        $("input:checkbox:not(:checked)").each(function () {
                            var column = "table ." + $(this).attr("name");
                            $(column).hide();
                        });
                    }
                }
            },
            error: function (xhr) {
                alert('error');
            }
        })
    }
}
/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
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
