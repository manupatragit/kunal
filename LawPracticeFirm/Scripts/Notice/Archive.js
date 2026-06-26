var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
var start = "";
var end = "";
var fromdaterange = false;
var fromreminder = false;
var remindernoticeid = "";
var callapiresponse = "";
var arrcolmenuseleciton = [];
var arrcolmenuselecitonfix = [];
$("#dynamicnotiheader").html("List Of Archived Notices - Sent")
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
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
//function changePage(page) {
//    PageNumber = page;
//    callapi();
//}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
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
/*Bind notice status in dropdown*/
$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $("#alertbeforeincaseallddl").select2();
    GetNoticestatusForDropdown();
    /*Pagination Start*/


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

}
);
/*Bind calender details*/
function bindcalender() {
    start = moment();
    end = moment();
    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }
    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);
    cb(start, end);
}
function fnsearchbydate(e) {
    var fromdate = $("#rangefromdate").val();
    var rangetodate = $("#rangetodate").val();
    if (fromdate == "") {
        alert("Please seclect from date!");
        return false;
    }
    if (rangetodate == "") {
        alert("Please seclect to date!");
        return false;
    }
    if (rangetodate < fromdate) {
        alert("To date is greater than from date!");
        return false;
    }
    start = formatDateNew(fromdate);
    end = formatDateNew(rangetodate);
    fromdaterange = true;
    $("#btclear").show();
    callapi();
}
function fnclearinput(e) {
    $("#rangefromdate").val('');
    $("#rangetodate").val('');
    $("#btclear").hide();
    fromdaterange = false;
    callapi();
}
function formatDateNew(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}
$('div .dropdown-menu').on('click', function (event) {
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});
/*Bind archive list data on change notice status*/
$(document).on('change', '#txtStatusOfNotice', function () {
    callapi();
});
/*Bind archive list data on change notice type*/
$(document).on('change', '#ddlnoticetypess', function () {
    callapi();
})

/*Get archive notice list details*/
var callapi = function () {
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
    var sendernamesearch = $("#NoticeeendersNametxt").val();
    var Noticesubjectsrc = $("#NoticeSubjectsrh").val();
    var Noticetitlesrc = $("#Noticetitsrch").val();
    var Noticetypesrc = "";
    var txtStatusOfNotice = $("#txtStatusOfNotice").val();
    formData.append("SearchValue", EncodeText(""));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("sendername", EncodeText(sendernamesearch));
    formData.append("addressedto", EncodeText(""));
    formData.append("noticethrough", EncodeText(""));
    formData.append("notistatus", EncodeText(notistatus1));
    formData.append("fromdaterange", EncodeText(fromdaterange));
    formData.append("startdate", EncodeText($("#rangefromdate").val()));
    formData.append("enddate", EncodeText($("#rangetodate").val()));
    formData.append("fromreminder", EncodeText(fromreminder));
    formData.append("noticeid", EncodeText(remindernoticeid));
    formData.append("Noticesubjectsrc", EncodeText(Noticesubjectsrc));
    formData.append("Noticetitlesrc", EncodeText(Noticetitlesrc));
    formData.append("Noticetypesrc", EncodeText(Noticetypesrc));
    formData.append("CaseNoticeStatus", EncodeText(txtStatusOfNotice));
    formData.append("IsArchived", EncodeText("1"));
    openload();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeList",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            $("#tablevalue").html("");
            $("#noticetbldashboardfooter").html("");
            $("#nonotice").html("");
            if (response.Data == "[]") {
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                var htmls = '<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No Archive list found</h4>' +
                    '<p>We found no Archive list.</p>' +
                    '</div>';
                $("#nonotice").append(htmls);
                isRenderPage = false;

                document.querySelector(".pagination").style.display = "none";
                closeload();
                return false;
            }
            else {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {

                    document.querySelector(".pagination").style.display = "flex";
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                    // Ensure it's visible when data exists
                    var amountclaimed = a.AmountClaimed == "0" || a.AmountClaimed == null ? "" : a.AmountClaimed;
                    if (i === 0) {
                        firstvalue = a.RowId;
                    }
                    var totpage = 0;
                    if (i === (obj.length - 1)) {
                        var totdata = a.TotalRows;
                        $('#tonotice').text(totdata);
                        $('#setNotice').text(a.SetteldCount);
                        $('#contomatNotice').text(a.ConvertedtoMatter);
                        //For Total Grid Count
                        $("#ArchNoticeCount").text("(" + totdata + ")");

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
                    html += "<tr class=" + a.NoticeID + ">";
                    html += "<td>" + a.RowId + "</td>";
                    if (a.IsReplyReceivedCount > 0) {
                        html += "<td  class='noticeby'>" + a.SendersName + " <span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor:pointer; ' onclick=ViewMoreItem1('" + a.NoticeID + "')></span></td>";
                    }
                    else {
                        html += "<td  class='noticeby'>" + a.SendersName + "</td>";
                    }
                    html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                    html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                    if (a.DateofNotice == '1900-01-01T00:00:00') {
                        html += "<td  class='noticedate'></td>";
                    }
                    else {
                        html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                    }
                    if (a.CreateNotice.length > 0) {
                        html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                    }
                    else {
                        html += "<td  class='remark'>" + span.innerText + "</td>";
                    }
                    var tempduedate = dateFormat(new Date(a.DueDateOfNotice));
                    if (tempduedate != "01 Jan 1900") {
                        html += "<td  class='noticeduedate'>" + dateFormat(new Date(a.DueDateOfNotice)) + "</td>";
                        var duedatenotification = dateFormat(new Date(a.DueDateOfNotice))
                    }
                    else {
                        html += "<td  class='noticeduedate'></td>";
                    }
                    if (String(a.CaseStatus) == "Convert to case") {
                        html += "<td class='pending'></td>";
                    }
                    else if (a.CaseStatus == "Setled") {
                        html += "<td class='pending'></td>";
                    }
                    else;
                    const statusKey = (a.CaseStatus || "").toLowerCase();
                    if (statusClassMap[statusKey]) {
                        html += `<td class="pending"><div class="status_badge"><span class="${statusClassMap[statusKey]}"></span>${a.CaseStatus || ""}</div></td>`;
                    }
                    else {
                        html += "<td class='pending'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";
                    }
                    if (a.IsFileAvailable) {
                        html += '<td class="attachment"><i aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer;" id-val="' + a.NoticeID + '" id-type="CreateNotice"><img src="/newassets/img/folder-icon.png" /></i></td>';
                    }
                    else {
                        html += '<td class="attachment"></td>';
                    }
                    html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                    html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                    html += "<td  class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                    html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                    html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                    html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                    html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                    html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                    html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                    html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                    html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                    const priorityKey = (a.Criticality || "").toLowerCase();
                    if (priorityClassMap[priorityKey]) {
                        html += `<td class="criticality"><div class="status_badge"><span class="${priorityClassMap[priorityKey]}"></span>${a.Criticality || ""}</div></td>`;
                    }
                    else {
                        html += "<td  class='criticality'>" + (a.Criticality == 0 ? '' : a.Criticality) + "</td>";
                    }
                    html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                    html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                    html += "<td  class='noticeTrackingId'>" + a.ConsignmentNum + "</td>";
                    html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";
                    if (a.IsOtherDetailsOfReceiver > 0) {
                        html += "<td  class='Receiverdetails'><a href='#' onclick=viewreceiverdetails('" + a.NoticeID + "') title='View more'>View</a></td>";
                    } else {
                        html += '<td class="Receiverdetails"></td>';
                    }
                    html += "<td  class='ReferenceNumber'>" + a.NoticeReference + "</td>";
                    html += "<td  class='InternalNumber'>" + a.IntNoticeReference + "</td>";
                    html += "<td class='dispatched'>" + (a.Dateofdispatch == null || a.Dateofdispatch == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.Dateofdispatch))) + "</td>";
                    html += '<td><a style="cursor:pointer;" onclick=MoveToArchive("' + a.NoticeID + '") title = "Unarchive" ><img src="/newassets/img/unarchive.png" /></a> <a style="cursor:pointer;"  onclick=fnviewlog("' + a.NoticeID + '","3") title="View Feedback"><img src="/newassets/img/causelist-icon.png" /></a></td>';
                    html += "<tr>";
                });
                $("#tablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                closeload();
            }
        },
        error: function (xhr) {
            alert('error');
            closeload();
        }
    });
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
/*Load custom field details*/
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
                    // $header += '<th  class="Class' + q1 + '">   <div class="thbg">' + val.FieldName + '</div></th>';
                    option += '<li data-subject="' + capitalizeFirstLetter(val.FieldName) + '"><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                });
                $header += '<th class="actioncase"><div class="thbg"><p style="width:130px;">Action</p></div></th>';
                $('#newnoticeheadrow').append($header);
                $("#od").append(option);
                SortData();
                var option1 = '<li><input id="select_allcfield"   type="checkbox"   > Select All</a></li>';
                $("#od").append(option1);
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
            isRenderPage = false;
            callapi();
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
/*Receive email id*/
$(document).on('change', '#receiverEmailidd', function () {
    var textvalues = $(this).val();
    if (textvalues == "Other") {
        $("#receiverEmailiddother").val('');
        $("#receiverEmailidddiv").show();
    }
    else {
        $("#receiverEmailidddiv").hide();
    }
});
/*Get notice status dropdown value*/
function GetNoticestatusForDropdown() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeStatusList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#txtStatusOfNotice").html("");
            $("#txtStatusOfNotice").append($("<option></option>").val("").text('Status'));
            $("#ddlnoticestatus").html("");
            $("#ddlnoticestatus").append($("<option></option>").val("").text('Status'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#txtStatusOfNotice").append($("<option data-id=" + value.Id + " ></option>").val(value.Name).text(value.Name));
                    $("#ddlnoticestatus").append($("<option data-id=" + value.Id + "></option>").val(value.Id).text(value.Name));
                });
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

/*Bind draft notice status*/
function ViewNoticeDraft(noticeid) {
    $("#NoticeDraftModal").modal('show');
    $("#draftnoticemodlbody").html('');
    $("#receiverEmailidd").html('');
    $("#receiverEmailiddother").val('');
    $("#receiverEmailidddiv").hide();
    $("#spanEmailId").hide();
    $("#noticemailaudit").html('');
    $("#nonoticemailaudit").html('');
    var html = '';
    var html1 = '';
    var formData = new FormData();
    formData.append("NoticeId", EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/DraftList',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            if (response.Data[0].length > 0) {
                var len = response.Data[0].length;
                $.each(response.Data[0], function (key, data) {
                    var path = "/DownloadFile.ashx?ftoken=" + data.Id + "&module=DraftNotice";
                    html += `<tr>
                        <td>`+ data.SrNum + `</td>
                        <td><input type='checkbox' name='checkAll' class='checkboxcls' value='`+ data.Filename + `' data-val='` + noticeid + `'> | <a href=` + path + ` download="Draft Version - ` + len + `">Draft Version - ` + len + `</a></td>
                        <td>`+ data.CreatedByName + `</td>
                        <td>`+ dateFormat(new Date(data.CreatedDate)) + `</td>
                        <tr/>`
                    len = (len - 1);
                })
                $("#draftnoticemodlbody").html(html);
            }
            else {
                $("#nodraftnotice").append("No records found.");
            }
            if (response.Data[1].length > 0) {
                $.each(response.Data[1], function (key, data) {
                    html1 += `<tr>
                        <td>`+ data.DisplayFileName + `</td>
                        <td>`+ data.SentFromMailId + `</td>
                        <td>`+ data.SentToMailId + `</td>
                         <td>`+ data.MailStatusMessage.replace('On', '') + `</td>
                        <td>`+ dateFormat(new Date(data.MailSentTime)) + `</td>
                        <tr/>`
                    len = (len - 1);
                })
                $("#noticemailaudit").html(html1);
            }
            else {
                $("#nonoticemailaudit").append("No records found.");
            }
            if (response.Data[2].length > 0) {
                $("#receiverEmailidd").html("");
                $("#receiverEmailidd").append($("<option></option>").val("").text('Please Select'));
                $("#receiverEmailidd").append($("<option></option>").val("Other").text('Others'));
                $.each(response.Data[2], function (key, data) {
                    $("#receiverEmailidd").append($("<option data-id=" + data.Id + "></option>").val(data.ReceiverEmails).text(data.ReceiverEmails));
                })
            }
            else {
                $("#receiverEmailidd").append($("<option></option>").val("").text('Please Select'));
                $("#receiverEmailidd").append($("<option></option>").val("Other").text('Others'));
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
/*Search post details by tracking id*/
function SearchPostDetails(trackingId) {
    if (trackingId == "") {
        alert("No Consignment No. found.")
        return false;
    }
    var formData = new FormData();
    formData.append("paramtrakingId", EncodeText(trackingId));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/ViewNoticePostDetail',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response, "postdetail")
            window.open(response.vImagepath, '_blank');
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
var closurenoticeid = "";
function ClouserNotice(noticeid) {
    closurenoticeid = noticeid;
    $('#markstatusreset')[0].reset();
    $("#ActualclosurModal").modal('show');
    var formData = new FormData();
    formData.append("closurenoticeid", EncodeText(closurenoticeid));
}
/*Save archive notice clauser date*/
$(document).on('click', '#saveclosuedate', function () {
    var closuredate = $("#dateofclosure").val();
    var ddlnoticestatus = $("#ddlnoticestatus").val();
    if (closuredate == "") {
        alert("Please enter date of closure.")
        return false;
    }
    var formData = new FormData();
    formData.append("closurenoticeid", EncodeText(closurenoticeid));
    formData.append("closuredate", EncodeText(closuredate));
    formData.append("ddlnoticestatus", EncodeText(ddlnoticestatus));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/NoticeClosure',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            if (response) {
                alert("Status updated successfully.");
                $('#ActualclosurModal').modal('hide');
                isRenderPage = false;
                callapi();
            }
            else {
                alert("Something went wrong.")
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
})
var noticeIddod = "";
function fnfilterdata(param, paramid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeNew/Filter";
    sessionStorage.setItem("param", param);
    sessionStorage.setItem("paramid", decodeURIComponent(paramid));
}
var outnoticeidd = "";
function AddInComingReply(outnoticeid) {
    outnoticeidd = outnoticeid;
    $('#receivedreplyform')[0].reset();
    $("#ReceivedReplyModal").modal('show');
}
/*Save reply notice*/
$("#savereplytonotice").click(function () {
    var noticeid = outnoticeidd;
    var txtreplyreciveddate = $("#txtreplyreciveddate").val();
    var txtnoticethroughs = $("#txtreplyrecivedthrough option:selected").map(function () {
        return $(this).val();
    }).get().join(',');
    var txtsetreplydate = $("#txtsetreplydate").val();
    var txtnoticethroughs = $('#txtreplyrecivedthrough').val();
    var modeofdeleiveryreply = $('#txtreplyModeOfDelievery').val();
    var txtsetreplytxtreplydateofnotice = $("#txtreplydateofnotice").val();
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    var totalFiles = document.getElementById("replypostedFile").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("replypostedFile").files[i];
        var filename = file.name;
        if (filename.length > 100) {
            alert("File name should not be more than 100 character. Please check file name: " + filename);
            return false;
        }
        formData.append("FileUpload", file);
        try {
            if (typeof (file) != "undefined") {
                size = parseFloat(file.size / 1024).toFixed(2);
                tottempsize = parseFloat(tottempsize) + parseFloat(size);
                tempsize = parseFloat(size);
            }
        }
        catch (err) {
            //alert(err.message);
        }
        tempsize = tempsize.toFixed(2);
        var filesize = 20480
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    if (txtreplyreciveddate == "") {
        alert("Please select reply received date.");
        return false;
    }
    if (txtsetreplydate == "") {
        alert("Please select reply date.");
        return false;
    }
    formData.append("noticeid", EncodeText(noticeid));
    formData.append("txtreplyreciveddate", EncodeText(txtreplyreciveddate));
    formData.append("hiddenreplynoticeid", EncodeText($("#hiddenreplynoticeid").val()));
    formData.append("txtsetreplydate", EncodeText(txtsetreplydate));
    //Add New Requirement
    formData.append("txtreplyrecivedthrough", EncodeText(txtnoticethroughs));
    formData.append("replymodeofdelvivery", EncodeText(modeofdeleiveryreply));
    formData.append("DateOfReplytxt", EncodeText(txtsetreplytxtreplydateofnotice));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/AddIncomingNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.Data.message);
            $("#txtreplyrecivedthrough").val("");
            $("#txtreplyreciveddate").val("");
            $("#txtreplyreciveddate").val("");
            $("#replypostedFile").val("");
            $("#ReceivedReplyModal").modal("hide");
            ViewMoreItem1(noticeid);
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
})
var noticeIdFinalStatus = "";
function FinalApproved(noticeId) {
    noticeIdFinalStatus = noticeId
    $("#FinalStatusModal").modal('show');
}

/*Save final notice status*/
$("#savefinalstatus").click(function () {
    var dateofddel = $("#dateofddel").val();
    var txtdateofreceipt = $('#txtdateofreceipt').val();
    var currentstatus = $('#currentstatus').val();
    if (dateofddel == "") {
        alert("Please Select Date of Notice");
        return false;
    }
    if (txtdateofreceipt == "") {
        alert("Please Select Mode of Service/Delivery");
        return false;
    }
    if (currentstatus == "") {
        alert("Please Add Addressee Address");
        return false;
    }
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    var totalFiles = document.getElementById("postedFile").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("postedFile").files[i];
        var filename = file.name;
        if (filename.length > 35) {
            alert("File name should not be more than 35 character. Please check file name: " + filename);
            return false;
        }
        formData.append("FileUpload", file);
        try {
            if (typeof (file) != "undefined") {
                size = parseFloat(file.size / 1024).toFixed(2);
                tottempsize = parseFloat(tottempsize) + parseFloat(size);
                tempsize = parseFloat(size);
            }
        }
        catch (err) {
            //alert(err.message);
        }
        tempsize = tempsize.toFixed(2);
        var filesize = 20480
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    formData.append("dateofddel", EncodeText(dateofddel));
    formData.append("txtdateofreceipt", EncodeText(txtdateofreceipt));
    formData.append("currentstatus", EncodeText(currentstatus));
    formData.append("NoticeId", EncodeText(noticeIdFinalStatus));
    formData.append("NoticeType", EncodeText("NewNoticeDocument"));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/SaveFinalStatus",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data) {
                alert("Record saved successfully.")
                $("#FinalStatusModal").modal("hide");
            }
            else {
                alert("Something went wrong.")
            }
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
})
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReplyToNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
/*Add reply from rejoinder*/
function AddCreateReply(noticeid, mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice?Id=" + noticeid + "&Main=" + mainnoticeid + "&InitiatedBy=plaintiff";
}
/*Edit reply notice*/
function IncomingEditNotice(incomingreplyid) {
    var formData = new FormData();
    formData.append("noticeid", EncodeText(""));
    formData.append("incomingreplyid", EncodeText(incomingreplyid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/IncomingNotice',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            $.each(response.Data, function (i, a) {
                $("#ReceivedReplyModal").modal('show');
                $('#txtreplyreciveddate').val((a.ReceivedDate.split("T"))[0]);
                $('#txtsetreplydate').val((a.Setdateofreply.split("T"))[0]);
                if (a.DateOfReply != null) {
                    $('#txtreplydateofnotice').val((a.DateOfReply.split("T"))[0]);
                }
                if (a.ModeofDelievery == "null" || a.ModeofDelievery == null || a.ModeofDelievery == "") {
                }
                else {
                    var selectedOptionsmode = a.ModeofDelievery.split(",");
                    for (var i in selectedOptionsmode) {
                        var optionValmode = selectedOptionsmode[i];
                        $("#txtreplyModeOfDelievery").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                    }
                }
                $("#txtreplyModeOfDelievery").multiselect('reload');
                if (a.ModeofDelievery == "null" || a.ModeofDelievery == null || a.ModeofDelievery == "") {
                }
                else {
                    var selectedReceivedThrogh = a.ReceivedThrogh.split(",");
                    for (var i in selectedReceivedThrogh) {
                        var optionReceivedThrogh = selectedReceivedThrogh[i];
                        $("#txtreplyrecivedthrough").find("option[value=" + optionReceivedThrogh + "]").prop("selected", "selected");
                    }
                }
                $("#txtreplyrecivedthrough").multiselect('reload');
                $("#hiddenreplynoticeid").val(a.Id);
                outnoticeidd = a.NoticeId;
            });
        },
        error: function (response) {
        }
    })
}
/*Remove file data*/
function removefiledata(fid) {
    if (confirm("Are you sure you want to remove this file?")) {
        var formData = new FormData();
        formData.append("fid", EncodeText(fid));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/RemoveFileById',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                if (response) {
                    alert("File deleted successfully.");
                    $('#myDocumentModal').modal('hide');
                }
                else {
                    alert("Something went wrong.")
                }
            },
            error: function (response) {
                alert("Something went wrong.")
            }
        })
    }
}
function IncomingConfirmDelete(incomingreplyid) {
    if (confirm("Are you sure you want to remove this reply?")) {
        var formData = new FormData();
        formData.append("incomingreplyid", EncodeText(incomingreplyid));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/IncomingNoticeDelete',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                if (response) {
                    alert("Record deleted successfully.");
                    ViewMoreItem1(incomingreplyid);
                }
                else {
                    alert("Something went wrong.")
                }
            },
            error: function (response) {
                alert("Something went wrong.")
            }
        })
    }
}
/*Move notice from archive*/
function MoveToArchive(noticeid) {
    if (confirm("Are you sure you want unarchive this notice?")) {
        var formData = new FormData();
        formData.append("archivenoticeid", EncodeText(noticeid));
        formData.append("IsArchive", EncodeText(false));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/ArchiveNotice',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                if (response) {
                    alert("Notice unarchived successfully.");
                    isRenderPage = false;
                    callapi();
                }
                else {
                    alert("Something went wrong.")
                }
            },
            error: function (response) {
                alert("Something went wrong.")
            }
        })
    }
}
/*View more reply*/
function fnViewmorereplytonotice(mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/RejoinderHome"
    sessionStorage.setItem("mainnoticeid", mainnoticeid);
}
/*View log*/
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

/*Edit notice details*/
function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeNew/CreateNewNotice"
    sessionStorage.setItem("NoticeId", noticeid)
}
var approvalnoticeid = "";
/*Send notice for approval*/
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}

/*Get manager list for approval*/
$(document).on('change', '.assignto', function () {
    Getmanagerlist();
})
/*View content details*/
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
/*View notice received details by notice id*/
function viewreceiverdetails(noticeid) {
    $("#ReceiverListModal").modal('show');
    var html = '';
    var formdata = new FormData();
    formdata.append('NoticeID', EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeReciverById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#receiverListmodlbody").html('');
            $.each(data.Data, function (key, val) {
                html += `<tr>
                        <td>`+ val.ReceiverEmails + `</td>
                        <td>`+ val.ReceiverPhone + `</td>
                        <td>`+ val.SecondAddress + `</td>
                        <td>`+ dateFormat(new Date(val.Created_Date)) + `</td>
                        <tr/>`
            })
            $("#receiverListmodlbody").html(html);
        },
    })
}
/*Bind manager list*/
function Getmanagerlist() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/PartnerList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#bindusr").html("");
            $("#bindusr").append($("<option></option>").val("0").text("Please Select"));
            var checkboxval = $("input[name='assignee']:checked").val();
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    if (checkboxval == "manager") {
                        if (value.RoleId == 2) {
                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                        }
                    }
                    else if (checkboxval == "client") {
                        if (value.RoleId == 3) {
                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                        }
                    }
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
$("#assignnoticebtn").click(function () {
    if (confirm("Are you sure you want to send this Notice?")) {
        var receiverid = $("#bindusr").val();
        if (receiverid == "0" || receiverid == "" || receiverid == "undefind" || receiverid == "Please Select") {
            alert("Alert ! Please Select User.")
            return false
        }
        var noticeid = approvalnoticeid;
        var approvarType = "";
        var checkboxval = $("input[name='assignee']:checked").val();
        if (checkboxval == "manager") {
            approvarType = 2;
        }
        else if (checkboxval == "client") {
            approvarType = 3;
        }
        var formData = new FormData();
        formData.append("receiverid", EncodeText(receiverid));
        formData.append("noticeid", EncodeText(noticeid));
        formData.append("approvarType", EncodeText(approvarType));
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/NoticeAssign",
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result) {
                    alert("Notice assigned successfully.")
                }
                else {
                    alert("Notice already sent for Approval.")
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
            }
        })
    }
})
window.onload = function () {
    if ($("#fromreminder").val() != "") {
        fromreminder = true;
        remindernoticeid = $("#reminderid").val()
    }
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
   // changePage(1);
    sessionStorage.removeItem("NoticeId");
};
var DelNoticeId = "";
var ConfirmDelete = function (NoticeID) {
    DelNoticeId = NoticeID;
    var result = confirm("Are you sure you want to delete notice?");
    if (result) {
        formdata = new FormData();
        formdata.append("NoticeId", EncodeText(DelNoticeId))
        formdata.append("deleteflag", EncodeText("1"))
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/NoticeDelete",
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
                //$("#myModal").modal("hide");
                window.location.reload();
            }
        })
    }
    // $("#myModal").modal('show');
}
/*Date format*/
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*Set notification alert*/
function fnsetnotificationalert() {
    $("#myModalNotificationsetting ").modal('show');
    fnnotificationalerttype();
}
function fnnotificationalerttype() {
    var selecteddlval = $("#ddlnotificationalerttype").val();
    if (selecteddlval == "individual") {
        $("#divnoticelist").show();
        //$("#ddlnoticelist").select2();
        GetNoticeListForDdl();
        $("#alertbeforeincaseindividual").css('display', 'block');
    }
    else {
        $("#divnoticelist").hide();
        $("#alertbeforeincaseindividual").css('display', 'none');
    }
}
/*Bind notice list for dropdown*/
function GetNoticeListForDdl() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeListForddl",
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            $("#ddlnoticelist").html("");
            $("#ddlnoticelist").append($("<option></option>").val("0").text("Please select"));
            if (response != null) {
                $.each(response, function (key, value) {
                    var textval = "Client Name - " + value.SendersName + ", Notice To - " + value.AddressedTo + ", Notice Subject -" + value.NoticeSubject;
                    $("#ddlnoticelist").append($("<option data-id=" + value.DateofNotice + "></option>").val(value.NoticeId).text(textval));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

/*Get date for notice alert*/
function Getdateforalertbynoticeid() {
    var noticeid = $("#ddlnoticelist").val();
    var duedate = $("#ddlnoticelist option:selected").attr("data-id");
    var formdata = new FormData();
    formdata.append("noticeid", EncodeText(noticeid))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/Dateforalertbynoticeid",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            if (response != null) {
                var receivedate = response.ReceivedDate.split("T");
                $("#txtreceiveddate").html(receivedate[0]);
            }
            var duedate1 = duedate.split("T");
            $("#txtduedate").html(formatDatetoIST(duedate));
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Reminder*/
function fndisplayreminder() {
    var duedate = $("#txtduedate").html();
    var receiveddate = $("#txtreceiveddate").html();
    var txtalrtcondition = $("#txtalertcondition").val();
    var alertbeforeincaseallddl = $("#alertbeforeincaseallddl").val();
    var day = alertbeforeincaseallddl.pop();
    if (txtalrtcondition == "beforeduedate") {
        var date = new Date(duedate);
        var reminderdate = date.setDate(date.getDate() - day);
        reminderdate = new Date(reminderdate);
        $("#multiplereminderdiv").append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(reminderdate) + '<br/>')
    }
    else if (txtalrtcondition == "afterreceivedate") {
        var date = new Date(receiveddate);
        var time = parseInt(day) * 24 * 60 * 60 * 1000
        var reminderdate = (date.getTime() + time);
        reminderdate = new Date(reminderdate);
        var reminderdateformt = reminderdate.split("T");
        $("#multiplereminderdiv").append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(reminderdateformt) + '<br/>')
    }
}
function formatDatetoIST(date) {
    if (date == "1900-01-01T00:00:00" || date == "1900-01-01" || date == "") {
        return "";
    }
    else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
        return formatted_date;
    }
}
$("#savenotificationsettings").click(function () {
    var notificationfor = "individual";
    var txtnoticeids = $("#ddlnoticelist").val();
    var txtalrtbefore = $("#alertbeforeincaseallddl").val();
    var txtduedate = $("#txtduedate").html();
    var txlalertcondition = $("#txtalertcondition").val();
    if (notificationfor == "individual") {
        if (txtnoticeids == "") {
            alert("Please select notice for set alert.");
            return false;
        }
    }
    if (txtalrtbefore == "") {
        if (txlalertcondition == "beforeduedate") {
            alert("Please select alert before day.");
            return false;
        }
        else if (txlalertcondition == "afterreceivedate") {
            alert("Please select alert after day.");
            return false;
        }
    }
    var formdata = new FormData();
    formdata.append("notificationfor", EncodeText(notificationfor));
    formdata.append("txtnoticeids", EncodeText(txtnoticeids));
    formdata.append("txtalrtbefore", EncodeText(txtalrtbefore));
    formdata.append("txtduedate", EncodeText(txtduedate));
    formdata.append("txlalertcondition", EncodeText(txlalertcondition));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/Savedatafornotification",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            if (response) {
                $("#ddlnoticelist").val("0");
                $("#txtalertbefore").val("");
                $("#txtduedate").val("");
                $("#multiplereminderdiv").html("");
                $("#txtduedate").html("");
                $("#txtreceiveddate").html("");
                $("#alertbeforeincaseallddl").select2("val", 0);
                $("#myModalNotificationsetting").modal('hide');
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
})


//Add serch on colomn
$("#clearnewsearchforsender").click(function () {
    $("#NoticeeendersNametxt").val("");
    $("#clearnewsearchforsender").css("display", "none");
    // loadflag = true;
    isRenderPage=false
    callapi();
})
$("#searchdatas").click(function () {
    var casefiltercasename = $("#NoticeeendersNametxt").val();
    if (casefiltercasename == "") {
        alert("enter sender name");
        $("#NoticeeendersNametxt").focus();
        return false;
    }
    $("#clearnewsearchforsender").css("display", "unset")
    isRenderPage = false;
    callapi();
});
$("#clearnewsearchforsendersub").click(function () {
    $("#NoticeSubjectsrh").val("");
    $("#clearnewsearchforsendersub").css("display", "none");
    isRenderPage = false;
    callapi();
})
$("#searchdatassub").click(function () {
    var casefiltercasename = $("#NoticeSubjectsrh").val();
    if (casefiltercasename == "") {
        alert("enter subject type");
        $("#NoticeSubjectsrh").focus();
        return false;
    }
    $("#clearnewsearchforsendersub").css("display", "unset")
    isRenderPage = false;
    callapi();
});
$(document).on('click', '#clearnewsearchforsendertitl', function () {
    $("#Noticetitsrch").val("");
    $("#clearnewsearchforsendertitl").css("display", "none");
    isRenderPage = false;
    callapi();
})
$(document).on('click', '#searchdatatitl', function () {
    var casefiltercasename = $("#Noticetitsrch").val();
    if (casefiltercasename == "") {
        alert("enter notice title");
        $("#Noticetitsrch").focus();
        return false;
    }
    $("#clearnewsearchforsendertitl").css("display", "unset")
    isRenderPage = false;
    callapi();
});
//Rejoinder Actions
function RejoinderEditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice"
    sessionStorage.setItem("RejoinderNoticeId", noticeid)
}
//RejoinderDelete 
function DeleteRejoinder(DelNoticeId) {
    if (confirm("Are you sure you want to remove this rejoinder?")) {
        formdata = new FormData();
        formdata.append("NoticeId", EncodeText(DelNoticeId))
        formdata.append("deleteflag", EncodeText("1"))
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/NoticeDelete",
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
                $("#myModal").modal("hide");
                window.location.reload();
            }
        })
    }
}
//Send Approval
function SendApprovalRejoinder(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
//
function AddCreateReplyRejoinder(noticeid, rootId) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid + "&rootId=" + rootId;
}
//documet upload from individual folder
function DocumnetSend(noticeid) {
    var formData = new FormData();
    formData.append("docnoticeid", EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/GetDocumnetDetailsById',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            //transfer page to perticular
            var transferid = response.Data.dirtoken;
            if (transferid != "") {
                var fcode5 = localStorage.getItem("FirmCode");
                var urls = "/" + fcode5 + "/azure/DirectoryList/1";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "token": transferid }
                });
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
function url_redirect(options) {
    validnavigation = true;
    window.onbeforeunload = null;
    var $form = $("<form />");
    $form.attr("action", options.url);
    $form.attr("method", options.method);
    for (var data in options.data)
        $form.append('<input type="hidden" name="' + data + '" value="' + options.data[data] + '" />');
    $("body").append($form);
    $form.submit();
}
function openload() {
    $('#myOverlay').css("display", "block");
}
function closeload() {
    $('#myOverlay').css("display", "none");
}
//documet upload from individual folder
function DocumnetSend(noticeid) {
    var formData = new FormData();
    formData.append("docnoticeid", EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/GetDocumnetDetailsById',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            //transfer page to perticular
            var transferid = response.Data.dirtoken;
            if (transferid != "") {
                var fcode5 = localStorage.getItem("FirmCode");
                var urls = "/" + fcode5 + "/azure/DirectoryList/1";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "token": transferid }
                });
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var filetype = $(this).attr("id-type");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=" + filetype + "&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
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
                             <th class="childtbltsssr1cls"><div class="thbg">No.</div></th>
                            <th class="fromreceiver"><div class="thbg">From</div></th>
                            <th class="childtbltsssr1cls"><div class="thbg">Date Of Reply</div></th>
                            <th class="receivedreplydate childtbltsssr1cls"><div class="thbg">Reply Received On</div></th>
                            <th class="dateofreplycls childtbltsssr1cls"><div class="thbg">Set Date for Rejoinder</div></th>
                            <th class="modeofdelivery childtbltsssr1cls"><div class="thbg">Mode</div></th>
                            <th class="receivedreplythrough childtbltsssr1cls"><div class="thbg">Notice Through/To</div></th>
                            <th class="receivedreplydoc childtbltsssr1cls"><div class="thbg">Docs</div></th>
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
                                html += '<td class="receivedattachment"><i  aria-hidden="true" id="incomingnoticerelevantdoc" style="cursor:pointer;" id-val="' + a.Id + '" id-type="ReplyToNotice"><img src="/newassets/img/folder-icon.png" /></i></td>';
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
/*Bind  rejoinder for archive notice list*/
function ViewMoreItem(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="11"><div class="poptable">
<div id="tblpoitem" class="poptable" data-example-id="hoverable-table">
<h2>REJOINDER</h2>
<div style="overflow-y:auto;">
        <table class= "table-panel tblrejoinderclass" id="table`+ parentId + `">
        <thead>
            <tr>
                        <th class="childnoticefrom" data-column="Rejoinder" data-order="desc"><div class="thbg">No.</div></th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc"><div class="thbg">Receiver's Name</div></th>
                        <th class="childrejoindersendername" data-column="Rejoindersendername" data-order="desc"><div class="thbg">Sender's Name</div></th>
                        <th class="childrejoindersenderaddress" data-column="Rejoindersenderaddress" data-order="desc"><div class="thbg">Sender's Address</div></th>
                       <th class="childrejoinderotherdetailssender" data-column="Rejoinderotherdetailssender" data-order="desc"><div class="thbg">Other Details of Sender</div></th>
                        <th class="childdateofcreatingrejoinder" data-column="DateofCreatingRejoinder" data-order="desc"><div class="thbg">Date of Rejoinder</div></th>
                        <th class="childsenton" data-column="" data-order="desc"><div class="thbg">Date of Dispatch</div></th>
                        <th class="childduedate" data-column="" data-order="desc"><div class="thbg">Due Date</div></th>
                        <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc"><div class="thbg">Mode of Delivery</div></th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc"><div class="thbg">Notice Text</div></th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc"><div class="thbg">Subject</div></th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc"><div class="thbg">Title</div></th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc"><div class="thbg">Type</div></th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc"><div class="thbg">Status</div></th>
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc"><div class="thbg">Date of Delivery</div></th>
                        <th class="childdateofdispatchofnotice" data-column="DateofDispatchofNotice" data-order="desc"><div class="thbg">Date of Dispatch</div></th>
                        <th class="childmodeofreceipt" data-column="ModeofReceipt" data-order="desc"><div class="thbg">Mode of Receipt</div></th>
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc"><div class="thbg">Receiver's Address</div></th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc"><div class="thbg">Other Details of Receiver</div></th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc"><div class="thbg">Notice Through/to</div></th>
                        <th class="childrejoinderconsignmentNo" data-column="RejoinderConsignmentNo" data-order="desc"><div class="thbg">Consignment No.</div></th>
                        <th class="childattachment" data-column="childattachment" data-order="desc"><div class="thbg">Docs</div></th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonotice"></tbody>
                        </table >
        <center> <div id="noreplytonotice"> </div></center>
</div>
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
                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofcreatingrejoinder" checked><a href="#">Date of Rejoinder</a></li>
                         <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childattachment" checked><a href="#">docs</a></li>
                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childduedate" checked><a href="#">Due Date</a></li>
                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofdispatchofnotice"><a href="#">Date of Dispatch</a></li>
                        <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofreceipt"><a href="#">Mode of Receipt</a></li>
                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofdeliveryofrejoinder" checked><a href="#">Mode of Delivery</a></li>
                        <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderthrough"><a href="#">Notice through/to</a></li>
                         <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#">Notice Text</a></li>
                                  <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderotherdetailssender" ><a href="#">Other Details of sender</a></li>
                             <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                               <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderaddressedto" checked><a href="#" class="dropdown-item">Receiver's Name</a></li>
                                 <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Receiver's Address</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Receiver's Address</a></li>
                                    <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoindersendername" checked><a href="#">Sender's Name</a></li>
                                          <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoindersenderaddress" ><a href="#">Sender's Address</a></li>
                                             <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childsenton" checked><a href="#">Sent On</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject"><a href="#">Subject</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending"><a href="#">Status</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle"><a href="#">Title</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childstatutory"><a href="#">Type</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div style="display:none" id="listingTableReplyFooter"></div>
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
                            html += "<td class='childmodeofreceipt'>" + a.ModeofReceipt + "</td>";
                            html += "<td  class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childrejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' ? '' : a.RejoinderThrough) + "</td>";
                            html += "<td class='childrejoinderconsignmentNo'>" + (a.ConsignmentNo == null ? '' : a.ConsignmentNo) + "</td>";
                            if (a.IsFileAvailable) {
                                html += '<td class="childattachment"><i aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer;" id-val="' + a.NoticeID + '" id-type="RejoinderNotice"><img src="/newassets/img/folder-icon.png"></i></td>'
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


//Pagination
var isRenderPage = false;
var totalPageRec = "";
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

$("#ColumnSelectionopen").click(function () {
    //LoadColumnMaster();
    $('#myModalCustomizedcolumn').modal({ show: true });

});
