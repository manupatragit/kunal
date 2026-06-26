var current_page = 1;
var records_per_page = 10;
var PageNumber = 1;
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
var start = null;
var end = null;
var fromdaterange = false;
var fromreminder = false;
var remindernoticeid = "";
var callapiresponse = "";
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
$("#dynamicnotiheader").html("List Of Deleted Notices - Sent")
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var urltype = getUrlVars()["type"];
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    //changePage(1);
};
//function changePage(page) {
//    PageNumber = page;
//    callapi();
//}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
$(document).ready(function () {
    /*Pagination Start*/
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });


    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        PageNumber = setPageNo;
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
        PageNumber = setPageNo;
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
        PageNumber = setPageNo;
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
        PageNumber = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    callapi();
});

/*Get delete notice by page number*/
//$(document).on('click', '#pgetdatabypagenum', function () {
//    ppageindex = $("#ppagnumvalue").val();
//    if (ppageindex != "undefined") {
//        if (Math.sign(ppageindex) == 1) {
//            var ppageindesx = $("#psotopage").text();
//            if (ppageindex <= parseInt(ppageindesx)) {
//                loadflag = true;
//                changePage(ppageindex);
//            }
//            else {
//                alert("Invalid page no.");
//            }
//        }
//        else {
//            alert("Invalid page no.");
//        }
//    }
//});
//$(document).on('click', '#ppaginate', function () {
//    pageindex = $(this).attr("index");
//    changePage(pageindex);
//});
/*Get deleted notice by notice type*/
$("#ddlnoticetypess").change(function () {
    isRenderPage = false;
    callapi();
})
setTimeout(function () {
    ploadtabledata();
}, 3000);

/*Capitalize first letter in custom field*/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*Sort custom field details*/
function SortData() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od").
            appendChild(e));
}
function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}

/*Get deleted notice*/
var callapi = function () {
    openload();
    var html = '';
    var notistatus = "";
    var notistatus1;
    if (notistatus == "") {
        notistatus1 = "";
    }
    else if (notistatus == "Draft") {
        notistatus1 = "0"
    }
    else if (notistatus == "Sent") {
        notistatus1 = "Pending"
    }
    else if (notistatus == "FinalApproved") {
        notistatus1 = "Approve"
    }
    else if (notistatus == "Rejected") {
        notistatus1 = "Reject"
    }
    var formData = new FormData();
    var sendernamesearch = $("#noticebyIds").val();
    var Noticesubjectsrc = $("#noticeSubjects").val();
    var Noticetitlesrc = $("#noticeTitless").val();
    var Noticetypesrc = $("#ddlnoticetypess").val();
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("sendername", EncodeText(sendernamesearch));
    formData.append("notistatus", EncodeText(notistatus1));
    formData.append("fromreminder", EncodeText(fromreminder));
    formData.append("noticeid", EncodeText(remindernoticeid));
    formData.append("Noticesubjectsrc", EncodeText(Noticesubjectsrc));
    formData.append("Noticetitlesrc", EncodeText(Noticetitlesrc));
    formData.append("Noticetypesrc", EncodeText(Noticetypesrc));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/GetDeleteNoticeList",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            closeload();
            $("#tablevalue").html("");
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            $("#noticetbldashboardfooter").html("");
            $("#nonotice").html("");
            if (response == "") {

                var htmls = '<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No Archive list found</h4>' +
                    '<p>We found no Archive list.</p>' +
                    '</div>';
                $("#nonotice").append(htmls);
                isRenderPage = false;

              //  document.querySelector(".pagination").style.display = "none";
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                return false;
            }
            else {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    document.querySelector(".pagination").style.display = "flex"; // Ensure it's visible when data exists

                    var amountclaimed = a.AmountClaimed == "0" || a.AmountClaimed == null ? "" : a.AmountClaimed;
                    if (i === 0) {
                        firstvalue = a.RowId;
                    }
                    var totpage = 0;
                    if (i === (obj.length - 1)) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                        var totdata = a.TotalRows;
                        //For Total Grid Count
                        $("#DelNoticeCount").text("(" + totdata + ")");
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (PageNumber == totpage) {
                            $('#next').hide();
                            //$('#next').css("display", "none");
                            $('#prev').css("display", "block"); s
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (PageNumber == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }

                        if (isRenderPage == false) {
                            renderPagination(PageNumber, totpage);
                        }
                    }
                    var span = document.createElement('span');
                    span.innerHTML = a.CreateNotice;
                    var trval = "";
                    if ((dateFormat(new Date()) == dateFormat(new Date(a.DateofNotice))) && (a.iApprovalStatus == null || a.iApprovalStatus == "" || a.iApprovalStatus == "Pending")) {
                        trval = "<tr class=" + a.NoticeID + " id=reminderhighlighcls>";
                    }
                    else {
                        trval = "<tr class=" + a.NoticeID + ">";
                    }
                    html += trval;
                    html += "<td rowspan='2'>" + a.RowId + "</td>";
                    if (a.IsReplyReceivedCount > 0) {
                        html += "<td  class='noticeby'><a style='color:#1F2937 !important' href='#' onclick=fnfilterdata1('SendersName','" + encodeURIComponent(a.SendersName) + "')>" + a.SendersName + "</a><span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor:pointer; ' onclick=ViewMoreItem1('" + a.NoticeID + "')></span></td>";
                    }
                    else {
                        html += "<td  class='noticeby'><a style='color:#1F2937 !important' href='#' onclick=fnfilterdata1('SendersName','" + encodeURIComponent(a.SendersName) + "')>" + a.SendersName + "</a></td>";
                    }
                    html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                    html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                    html += "<td  class='noticesubject'>" + (a.NoticeSubject == "'" ? "" : a.NoticeSubject) + "</td>";
                    html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                    html += "<td  class='noticedate'>" + (a.DateofNotice == null || a.DateofNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofNotice))) + "</td>";
                    if (a.CreateNotice.length > 0) {
                        html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                    }
                    else {
                        html += "<td  class='remark'>" + span.innerText + "</td>";
                    }
                    html += "<td  class='noticeduedate'>" + (a.DueDateOfNotice == null || a.DueDateOfNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                    const statusKey = (a.CaseStatus || "").toLowerCase();
                    if (statusClassMap[statusKey]) {
                        html += `<td class="pending"><div class="status_badge"><span class="${statusClassMap[statusKey]}"></span>${a.CaseStatus || ""}</div></td>`;
                    }
                    else {
                        html += "<td class='pending'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";
                    }
                    html += "<td  class='noticeTrackingId'>" + a.ConsignmentNum + "</td>";
                    html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                    html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                    const priorityKey = (a.Criticality || "").toLowerCase();
                    if (priorityClassMap[priorityKey]) {
                        html += `<td class="criticality"><div class="status_badge"><span class="${priorityClassMap[priorityKey]}"></span>${a.Criticality || ""}</div></td>`;
                    }
                    else {
                        html += "<td  class='criticality'>" + (a.Criticality == 0 ? '' : a.Criticality) + "</td>";
                    }                      html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                    html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                    html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                    html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                    html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                    html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                    html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";
                    if (a.IsFileAvailable) {
                        html += '<td class="attachment"><i aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '" id-type="CreateNotice"><img src="/newassets/img/folder-icon.png" /></i></td>';
                    }
                    else {
                        html += '<td class="attachment"></td>';
                    }
                    html += "<td  class='tags'>" + a.Tag + "</td>";
                    html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                    if (a.IsOtherDetailsOfReceiver > 0) {
                        html += "<td  class='Receiverdetails'><a href='#' onclick=viewreceiverdetails('" + a.NoticeID + "') title='View more'>View</a></td>";
                    } else {
                        html += '<td class="Receiverdetails"></td>';
                    }
                    html += "<td  class='ReferenceNumber'>" + (a.NoticeReference == undefined ? '' : a.NoticeReference) + "</td>";
                    html += "<td  class='InternalNumber'>" + (a.IntNoticeReference == undefined ? '' : a.IntNoticeReference) + "</td>";
                    html += "<td class='dispatched'>" + (a.Dateofdispatch == null || a.Dateofdispatch == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.Dateofdispatch))) + "</td>";
                    html += "<td class='deliveryDispatch'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                    bindCustomizehtml = "";
                    var val = a;
                    var countcf = countcustomfoeld;
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "" || val.col1 == null) {
                                bindCustomizehtml += "<td class='Class3'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class3'> " + checkdatetimecustom(val.col1) + "</td>";
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "" || val.col2 == null) {
                                bindCustomizehtml += "<td class='Class4'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class4'> " + checkdatetimecustom(val.col2) + "</td>";
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "" || val.col3 == null) {
                                bindCustomizehtml += "<td class='Class5'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class5'> " + checkdatetimecustom(val.col3) + "</td>";
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "" || val.col4 == null) {
                                bindCustomizehtml += "<td class='Class6'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class6'> " + checkdatetimecustom(val.col4) + "</td>";
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "" || val.col5 == null) {
                                bindCustomizehtml += "<td class='Class7'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class7'> " + checkdatetimecustom(val.col5) + "</td>";
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "" || val.col6 == null) {
                                bindCustomizehtml += "<td class='Class8'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class8'> " + checkdatetimecustom(val.col6) + "</td>";
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "" || val.col7 == null) {
                                bindCustomizehtml += "<td class='Class9'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class9'> " + checkdatetimecustom(val.col7) + "</td>";
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "" || val.col8 == null) {
                                bindCustomizehtml += "<td class='Class10'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class10'> " + checkdatetimecustom(val.col8) + "</td>";
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "" || val.col9 == null) {
                                bindCustomizehtml += "<td class='Class11'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class11'> " + checkdatetimecustom(val.col9) + "</td>";
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "" || val.col10 == null) {
                                bindCustomizehtml += "<td class='Class12'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class12'> " + checkdatetimecustom(val.col10) + "</td>";
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "" || val.col11 == null) {
                                bindCustomizehtml += "<td class='Class13'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class13'> " + checkdatetimecustom(val.col11) + "</td>";
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "" || val.col12 == null) {
                                bindCustomizehtml += "<td class='Class14'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class14'> " + checkdatetimecustom(val.col12) + "</td>";
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "" || val.col13 == null) {
                                bindCustomizehtml += "<td class='Class15'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class15'> " + checkdatetimecustom(val.col13) + "</td>";
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "" || val.col14 == null) {
                                bindCustomizehtml += "<td class='Class16'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class16'> " + checkdatetimecustom(val.col14) + "</td>";
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "" || val.col15 == null) {
                                bindCustomizehtml += "<td class='Class17'><span>&nbsp;</span></td>";
                            }
                            else {
                                bindCustomizehtml += "<td class='Class17'> " + checkdatetimecustom(val.col15) + "</td>";
                            }
                        }
                    }
                    html += "" + bindCustomizehtml + "";
                    if (a.CaseStatus == "Convert to case") {
                        html += '<td><b style="color:red">Convert to case</b></td>'
                    }
                    else if (a.CaseStatus == "Settled") {
                        html += '<td><b style="color:Green">Settled</b></td>'
                    }
                    else {
                        html += '<td>';
                        html += '<a  style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title="Restore Notice"><img src="/newassets/img/restore-icon.png" /></a><a style="cursor:pointer;"  onclick=fnviewlog("' + a.NoticeID + '","3") title="View Feedback"><img src="/newassets/img/causelist-icon.png" /></a><a style="cursor:pointer;" onclick=FinalConfirmDelete("' + a.NoticeID + '") title="Delete Permanently"><img src="/newassets/img/deletecasesingle-icon.png" /></a>'
                    }
                    html += "<tr>"
                });
                $("#tablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
        },
        error: function (xhr) {
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            alert('error');
        }
    });
};


$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var filetype = $(this).attr("id-type");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=" + filetype + "&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
//Add serch on colomn
$("#clearnewsearchforsender").click(function () {
    $("#noticebyIds").val("");
    $("#clearnewsearchforsender").css("display", "none");
    isRenderPage = false;
    callapi();
})
/*Search data by sender name*/
$("#searchdatas").click(function () {
    var casefiltercasename = $("#noticebyIds").val();
    if (casefiltercasename == "") {
        alert("enter sender name");
        $("#noticebyIds").focus();
        return false;
    }
    $("#clearnewsearchforsender").css("display", "unset")
    isRenderPage = false;
    callapi();
});
/*Load data after clear subject*/
$("#clearnewsearchforsendersub").click(function () {
    $("#noticeSubjects").val("");
    $("#clearnewsearchforsendersub").css("display", "none");
    isRenderPage = false;
    callapi();
})
$("#searchdatassub").click(function () {
    var casefiltercasename = $("#noticeSubjects").val();
    if (casefiltercasename == "") {
        alert("enter subject type");
        $("#noticeSubjects").focus();
        return false;
    }
    $("#clearnewsearchforsendersub").css("display", "unset")
    isRenderPage = false;
    callapi();
});
$("#clearnewsearchforsendertitl").click(function () {
    $("#noticeTitless").val("");
    $("#clearnewsearchforsendertitl").css("display", "none");
    isRenderPage = false;
    callapi();
})
$("#searchdatatitl").click(function () {
    var casefiltercasename = $("#noticeTitless").val();
    if (casefiltercasename == "") {
        alert("enter notice title");
        $("#noticeTitless").focus();
        return false;
    }
    $("#clearnewsearchforsendertitl").css("display", "unset")
    isRenderPage = false;
    callapi();
    // chksflag = true;
});
//delete Notice
var DelNoticeId = "";
var FinalNoticeId = "";
var ConfirmDelete = function (NoticeID) {
    DelNoticeId = NoticeID;
    //$("#myModal").modal('show');
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

var DeleteNotice = function () {
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
            $("#myModal").modal("hide");
            //window.location.href = "/NoticeNew/Home";
            window.location.reload();
        }
    })
}
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
/*Filter data*/
function fnfilterdata(param, paramid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeNew/Filter";
    sessionStorage.setItem("param", param);
    sessionStorage.setItem("paramid", decodeURIComponent(paramid));
}
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
            $("#viewmoreheader").html("Notice");
            $("#viewmorecontent").html(data.Data.message)
        },
    })
}
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*Load custom field*/
function ploadtabledata() {
    var $table = '';
    var $header = '';
    var $head1 = '';
    var dt = '';
    var q1 = 2;
    var Iscustomflag = 0;
    var columnvalue = 0;
    var sort = 18;
    var type = 12;
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
                $('#newnoticeheadrow').append($header);
                $("#od").append(option);
                SortData();
                var option1 = '<li><input id="select_allcfield"   type="checkbox"   > Select All</a></li>';
                $("#od").append(option1);
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
            // setTimeout(function () {
            isRenderPage = false;
            callapi();
            // },5000);
        }
        else {
            //  setTimeout(function () {
            isRenderPage = false;
            callapi();
            //  },2000);
        }
    });
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

/*View notice log details*/
function fnviewlog(noticeid, usertype) {
    $("#ViewLogModal").modal('show');
    var html = '';
    var ApproveType = '';
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
            $("#modlbody").html('');
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

/*Get reply notice details*/
var childtblclickcount = 0;
var childtblclickcount1 = 0;
function ViewMoreItem1(parentId, CaseStatus = null) {
    if (childtblclickcount1 == 1) {
        $("#childtbltr1").remove();
        childtblclickcount1 = 0;
    }
    else {
        childtblclickcount1 = 1;
        $(`<tr id="childtbltr1"><td colspan="11"><div id="tblincmingnotice" class="table-panel table-responsive poptable" data-example-id="hoverable-table">
          <h2>REPLY</h2>
         <table class= "tblreplyclass" id="table`+ parentId + `">
        <thead>
            <tr class="childtbltr1cls">
                            <th class="childtbltsssr1cls">No.</th>
                            <th class="fromreceiver">From</th>
                            <th class="childtbltsssr1cls">Date Of Reply</th>
                            <th class="receivedreplydate childtbltsssr1cls">Reply Received On</th>                       
                            <th class="dateofreplycls childtbltsssr1cls">Set Date for Rejoinder</th>
                            <th class="modeofdelivery childtbltsssr1cls">Mode</th>
                            <th class="receivedreplythrough childtbltsssr1cls">NOTICE THROUGH/TO</th>
                            <th class="receivedreplydoc childtbltsssr1cls">Docs</th>
            </tr>
        </thead>
        <tbody id="incomingReplytonotice"></tbody>
                        </table >
        <center> <div id="incomingnoreplytonotice"> </div></center>
                            <div id="IncomingNoticeTableReplyFooter"></div>
                        </div>
                        <div class="col-md-6" style="padding-right:20px">
                                                    </div>
                    </div>
                </div>
       </div></td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        var formData = new FormData();
        formData.append("noticeid", EncodeText(parentId));
        formData.append("incomingreplyid", EncodeText(""));
        var html = '';
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/IncomingNotice',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                closeload();
                $("#incomingReplytonotice").html("");
                $("#IncomingNoticeTableReplyFooter").html("");
                $("#incomingnoreplytonotice").html("");
                if (response == "") {
                    $("#incomingnoreplytonotice").append("No Records found.");
                    return false;
                }
                else {
                    if (1 == 1) {
                        $.each(response.Data.reverse(), function (i, a) {
                            var trval = "";
                            if ((dateFormat(new Date()) == dateFormat(new Date(a.Setdateofreply)))) {
                                trval = "<tr class=" + a.Id + " style='background-color:#fff;' id=reminderhighlighcls>";
                            }
                            else {
                                trval = "<tr class=" + a.Id + ">";
                            }
                            html += trval;

                            if (a.IsReplyReceivedCount > 0) {
                                html += "<td>" + a.RowId + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor: pointer;position:relative;left:5px' onclick=ViewMoreItem('" + a.Id + "')></span></td>";
                            }
                            else {
                                html += "<td>" + a.RowId + "</td>";
                            }
                            html += '<td class="fromreceiver">' + a.ReceiverName + '</td>'
                            html += "<td>" + (a.DateOfReply == null ? ' ' : dateFormat(new Date(a.DateOfReply))) + "</td>";
                            html += "<td class='receivedreplydate'>" + (a.ReceivedDate == null ? ' ' : dateFormat(new Date(a.ReceivedDate))) + "</td>";
                            if (a.Setdateofreply == "1900-01-01T00:00:00") {
                                html += "<td></td>"
                            }
                            else {
                                html += "<td>" + (a.Setdateofreply == null ? ' ' : dateFormat(new Date(a.Setdateofreply))) + "</td>";
                            }
                            if (a.ModeofDelievery == "null") {
                                html += "<td class='modeofdelivery childtbltsssr1cls'></td>";
                            }
                            else {
                                html += "<td class='modeofdelivery childtbltsssr1cls'>" + a.ModeofDelievery + "</td>";
                            }
                            if (a.IsReplyReceivedCount > 0) {
                                html += "<td  class='receivedreplythrough'>" + (a.ReceivedThrogh == "null" ? '' : a.ReceivedThrogh) + "</td>";
                            } else {
                                html += "<td  class='receivedreplythrough'>" + (a.ReceivedThrogh == "null" ? '' : a.ReceivedThrogh) + "</td>";
                            }
                            if (a.IsFileAvailable) {
                                html += '<td class="receivedattachment"><i aria-hidden="true" id="incomingnoticerelevantdoc" style="cursor:pointer;" id-val="' + a.Id + '" id-type="ReplyToNotice"><img src="/newassets/img/folder-icon.png" /></i></td>';
                            }
                            else {
                                html += '<td class="receivedattachment"></td>';
                            }
                            html += "<tr>";
                        });
                        $("#incomingReplytonotice").append(html);
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

/*View rejoinder notice*/
function ViewMoreItem(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="29"><div class="poptable" style="overflow-x: unset;">
<div id="tblpoitem" class="table-panel table-responsive poptable" data-example-id="hoverable-table">
<h2>REJOINDER</h2>
        <table class= "table tblrejoinderclass" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr>
                        <th class="childnoticefrom" data-column="Rejoinder" data-order="desc">No.</th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc">Receiver's Name</th>
                        <th class="childrejoindersendername" data-column="Rejoindersendername" data-order="desc">Sender's Name</th>
                        <th class="childrejoindersenderaddress" data-column="Rejoindersenderaddress" data-order="desc">Sender's Address</th>
                       <th class="childrejoinderotherdetailssender" data-column="Rejoinderotherdetailssender" data-order="desc">Other Details of sender</th>
                        <th class="childdateofcreatingrejoinder" data-column="DateofCreatingRejoinder" data-order="desc">Date of Rejoinder</th>
                        <th class="childsenton" data-column="" data-order="desc">Date of Dispatch</th>
                        <th class="childduedate" data-column="" data-order="desc">Due Date</th>
                        <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc">Mode of Delivery</th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc">Notice Text</th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc">Subject</th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc">Title</th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc">Type</th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc">Status</th>
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc">Date of Delivery</th>
                        <th class="childdateofdispatchofnotice" data-column="DateofDispatchofNotice" data-order="desc">Date of Dispatch</th>
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc">RECEIVER'S ADDRESS</th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc">OTHER DETAILS OF RECEIVER</th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc">Notice through/to</th>
                        <th class="childrejoinderconsignmentNo" data-column="RejoinderConsignmentNo" data-order="desc">Consignment No.</th>
                        <th class="childattachment" data-column="childattachment" data-order="desc"><div>docs</div></th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonotice"></tbody>
                        </table >
        <center> <div id="noreplytonotice"> </div></center>
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
                                            <ul class="dropdown-menu settingshowhide" id="od" style="width:260px">
                                             <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderconsignmentNo"><a href="#">Consignment No.</a></li>
                                          <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdispatched"><a href="#">Date of Delivery </a></li>
                                        <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofdispatchofnotice"><a href="#">Date of Dispatch</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofcreatingrejoinder" checked><a href="#">Date of Rejoinder</a></li>
                                        <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childattachment" checked><a href="#">docs</a></li>
                                         <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childduedate" checked><a href="#">Due Date</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofdeliveryofrejoinder" checked><a href="#">Mode of Delivery</a></li>
                                             <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderthrough"><a href="#">Notice through/to</a></li>
                                     <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#">Notice Text</a></li>
                                        <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderotherdetailssender" ><a href="#">Other Details of sender</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                                     <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Receiver's Address</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderaddressedto" checked><a href="#" class="dropdown-item">Receiver's Name</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childsenton" checked><a href="#">Sent On</a></li>
                                         <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoindersendername" checked><a href="#">Sender's Name</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoindersenderaddress" ><a href="#">Sender's Address</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject"><a href="#">Subject</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending"><a href="#">Status</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle"><a href="#">Title</a></li>
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
                </div></div>
       </div></td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
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
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a type="button" id="pgetdatabypagenum" class="gobtn" style="margin-left:10px;cursor:pointer">Go</a> </li>'
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
                            var RSubject = "";
                            if (a.RejoinderSubject == "'") {
                                RSubject = "NA";
                            }
                            else {
                                RSubject = a.RejoinderSubject;
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateRejoinder;
                            html += "<tr>";
                            html += "<td  class='childnoticefrom'>" + a.RowId + "</td>";
                            html += "<td class='childrejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                            html += "<td class='childrejoindersendername'>" + a.SendersName + "</td>";
                            html += "<td class='childrejoindersenderaddress'>" + a.SendersAddress + "</td>";
                            html += "<td class='childrejoinderotherdetailssender'>" + a.OtherDetailsofSender + "</td>";
                            html += "<td class='childdateofcreatingrejoinder'>" + (a.DateofCreatingRejoinder == null || a.DateofCreatingRejoinder == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                            /*html += "<td  class='childsenton'>" + (a.DateofCreatingRejoinder == null ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";*/
                            html += "<td  class='childsenton'>" + (a.DateOfDispatch == null ? ' ' : dateFormat(new Date(a.DateOfDispatch))) + "</td>";
                            html += "<td  class='childduedate'>" + (a.DueDateOfNotice == null ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                            html += "<td class='childmodeofdeliveryofrejoinder'>" + (a.ModeofDeliveryofRejoinder == null || a.ModeofDeliveryofRejoinder == 'null' ? ' ' : a.ModeofDeliveryofRejoinder) + "</td>";
                            if (a.CreateRejoinder.length > 0) {
                                html += "<td  class='childremark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='childremark'>" + span.innerText + "</td>";
                            }
                            html += "<td class='childnoticesubject'>" + RSubject + ' ' + "</td>";
                            html += "<td class='childnoticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='childstatutory'>" + a.NoticeType + "</td>";
                            html += "<td class='childpending'>" + a.CaseStatus + "</td>";
                            if (a.DateofDelivery == "1900-01-01T00:00:00") {
                                html += "<td class='childdispatched'></td>";
                            }
                            else {
                                html += "<td class='childdispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            }
                            html += "<td class='childdateofdispatchofnotice'>" + (a.DateofDispatchofNotice == null ? ' ' : dateFormat(new Date(a.DateofDispatchofNotice))) + "</td>";
                            html += "<td  class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childrejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' ? '' : a.RejoinderThrough) + "</td>";
                            html += "<td class='childrejoinderconsignmentNo'>" + (a.ConsignmentNo == null ? '' : a.ConsignmentNo) + "</td>";
                            if (a.IsFileAvailable) {
                                html += '<td class="childattachment"><i aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '" id-type="RejoinderNotice"><img src="/newassets/img/folder-icon.png" /></i></td>'
                            }
                            else {
                                html += '<td class="childattachment"></td>'
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
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReplyToNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});

//Pagination
var isRenderPage = false;
var totalPageRec = "";
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

//function renderPagination(ps, totdata) {

//    let totPages = totdata;
//    setPageNo = ps;
//    totalPageRec = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis
//    if (totdata <= maxVisible + 2) {
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn ${i === ps ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (ps <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === ps ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === ps ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        }
//    }
//    $("#pageNumbers").html(paginationHtml);
//    $("#prev").toggleClass("disabled", ps === 1);
//    $("#next").toggleClass("disabled", ps === totdata);
//    isRenderPage = true;
//}
$("#ColumnSelectionopen").click(function () {
    //LoadColumnMaster();
    $('#myModalCustomizedcolumn').modal({ show: true });

});
