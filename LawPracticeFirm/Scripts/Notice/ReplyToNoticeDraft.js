var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
function changePage(page) {
    PageNumber = page;
    callapi();
}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
$(document).ready(function () {
    $('th').on('click', function () {
        var column = $(this).data('column')
        var order = $(this).data('order')
        var text = $(this).html()
        text = text.substring(0, text.length - 1)
        ColumName = column;
        SortedOrder = order;
        callapi();
        if (order == 'desc') {
            $(this).data('order', "asc")
            text += "&#9660"
        }
        else {
            $(this).data('order', "desc")
            text += "&#9650"
        }
        $(this).html(text)
    })
}
);
$(".notistatustype").click(function () {
    callapi();
})
/*Get reply draft notice details*/
var callapi = function () {
    openload();
    var html = '';
    var notistatus = $('input[name=statustype]:checked').val();
    SearchValue = document.getElementById("myInput").value;
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(SearchValue));
    formData.append("ColumName", EncodeText(ColumName));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("UserId", EncodeText(userDetails.Id));
    formData.append("RoleId", EncodeText(userDetails.RoleId));
    $.ajax({
        type: "POST",
        url: '/api/ReplyToNotice/ReplyToNoticeDraftList',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            closeload();
            $("#tablevalueReplytonotice").html("");
            $("#listingTableReplyFooter").html("");
            $("#noreplytonotice").html("");
            if (response == "") {
                $("#noreplytonotice").append("No Records found.");
                return false;
            }
            else {
                if (notistatus == "Incomplete") {
                    $.each(response, function (i, a) {
                        if (a.DateofDelivery == null && a.DateofReceipt == null) {
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
                            span.innerHTML = a.CreateReply;
                            html += "<tr class=" + a.NoticeID + ">";
                            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                            html += "<td  class='replyfrom'>" + a.RespondentsName + "</td>";
                            html += "<td class='replydate'>" + dateFormat(new Date(a.DateofReply)) + "</td>";
                            html += "<td class='noticedate'>" + (a.ReplytoNoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.ReplytoNoticeCreatedOn))) + "</td>";
                            html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='noticesubject'>" + a.ReplySubject + "</td>";
                            html += "<td class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td class='servedon'>" + dateFormat(new Date(a.DateofReceipt)) + "</td>";
                            if (a.CreateReply.length > 60) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '") title="View more"> view more</a>' + "</td>";
                            }
                            else {
                                html += "<td  class='remark'>" + span.innerText + "</td>";
                            }
                            if (a.iApprovalStatus != null) {
                                var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                                html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                            }
                            else {
                                html += "<td class='managerapprove'></td>";
                            }
                            html += "<td  class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td class='replyaddressedto'>" + a.ReplyAddressedto + "</td>";
                            html += "<td class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='noticereceivedbyclient'>" + a.NoticeReceivedbyClient + "</td>";
                            html += "<td class='noticebroughtbyclientforreply'>" + a.NoticeBroughtbyClientforReply + "</td>";
                            html += "<td class='generationofalerts'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td class='assignmentoftask'>" + a.AssignmentofTask + "</td>";
                            html += "<td class='respondentsaddress'>" + a.RespondentsAddress + "</td>";
                            html += "<td class='otherdetailsofrespondent'>" + a.OtherDetailsofRespondent + "</td>";
                            html += "<td class='noticereference'>" + a.NoticeReference + "</td>";
                            html += "<td class='replythrough'>" + a.ReplyThrough + "</td>";
                            html += "<td class='currentstatus'>" + a.CurrentStatus + "</td>";
                            if (a.IsFileAvailable) {
                                html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="attachment"></td>';
                            }
                            html += '<td><a class="glyphicon glyphicon-tasks" style="cursor:pointer;"  onclick=ChangeStatus("' + a.NoticeID + '") title="Change Status"></a> </td>';
                            html += "<tr>";
                        }
                    });
                    $("#tablevalueReplytonotice").append(html);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                }
                else if (notistatus == "Completed") {
                    $.each(response, function (i, a) {
                        if (a.DateofDelivery != null && a.DateofReceipt != null) {
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
                            span.innerHTML = a.CreateReply;
                            html += "<tr class=" + a.NoticeID + ">";
                            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                            html += "<td  class='replyfrom'>" + a.RespondentsName + "</td>";
                            html += "<td class='replydate'>" + dateFormat(new Date(a.DateofReply)) + "</td>";
                            html += "<td class='noticedate'>" + (a.ReplytoNoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.ReplytoNoticeCreatedOn))) + "</td>";
                            html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='noticesubject'>" + a.ReplySubject + "</td>";
                            html += "<td class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td class='servedon'>" + dateFormat(new Date(a.DateofReceipt)) + "</td>";
                            if (a.CreateReply.length > 60) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '") title="View more"> view more</a>' + "</td>";
                            }
                            else {
                                html += "<td  class='remark'>" + span.innerText + "</td>";
                            }
                            if (a.iApprovalStatus != null) {
                                var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                                html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                            }
                            else {
                                html += "<td class='managerapprove'></td>";
                            }
                            html += "<td  class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td class='replyaddressedto'>" + a.ReplyAddressedto + "</td>";
                            html += "<td class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='noticereceivedbyclient'>" + a.NoticeReceivedbyClient + "</td>";
                            html += "<td class='noticebroughtbyclientforreply'>" + a.NoticeBroughtbyClientforReply + "</td>";
                            html += "<td class='generationofalerts'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td class='assignmentoftask'>" + a.AssignmentofTask + "</td>";
                            html += "<td class='respondentsaddress'>" + a.RespondentsAddress + "</td>";
                            html += "<td class='otherdetailsofrespondent'>" + a.OtherDetailsofRespondent + "</td>";
                            html += "<td class='noticereference'>" + a.NoticeReference + "</td>";
                            html += "<td class='replythrough'>" + a.ReplyThrough + "</td>";
                            html += "<td class='currentstatus'>" + a.CurrentStatus + "</td>";
                            if (a.IsFileAvailable) {
                                html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="attachment"></td>';
                            }
                            html += '<td><a class="glyphicon glyphicon-tasks" style="cursor:pointer;"  onclick=ChangeStatus("' + a.NoticeID + '") title="Change Status"></a> </td>';
                            html += "<tr>";
                        }
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
};
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
    sessionStorage.removeItem("ReplyNoticeId");
};
var statusnotisId = ""
function ChangeStatus(noticeId) {
    statusnotisId = noticeId;
    $("#NoticeStatusModal").modal('show');
}
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/NoticeNew/multiplefilelist/?ftype=ReplyToNoticeDocument&data=" + fileid + "&mode=" + mode + "&FirmId=" + userDetails.FirmId + "&LoginUserId=" + userDetails.Id + "&RoleId=" + userDetails.RoleId;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
/*Save notice status details*/
$("#statusnoticebtn").click(function () {
    var status = $("#notistatus").val();
    var feedback = $("#feedbacktext").val();
    var noticeId = statusnotisId;
    var formdata = new FormData();
    formdata.append('status', EncodeText(status));
    formdata.append('feedback', EncodeText(feedback));
    formdata.append('noticeId', EncodeText(noticeId));
    formdata.append("UserId", EncodeText(userDetails.Id));
    formdata.append("RoleId", EncodeText(userDetails.RoleId));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeFeedback",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data) {
                alert("Record saved successfully.");
                $("#NoticeStatusModal").modal('hide');
            }
            else {
                alert("Alert ! Something went wrong.");
                $("#NoticeStatusModal").modal('hide');
            }
        },
    })
})
/*View notice log details*/
function fnviewlog(noticeid, usertype) {
    $("#ViewLogModal").modal('show');
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
            $.each(response, function (key, data) {
                var remark = data.Remark == null ? "" : data.Remark;
                var approvalstatus = data.iApprovalStatus == "Approve" ? "Approved" : data.iApprovalStatus;
                html += `<tr>
                        <td>`+ data.sendername + `</td>
                        <td>`+ data.receivername + `</td>
                        <td>`+ dateFormat(new Date(data.dSendDate)) + `</td>
                        <td>`+ approvalstatus + `</td>
                        <td>`+ remark + `</td >
                        <tr/>`
            })
            $("#modlbody").html(html);
        },
    })
}
/*View more notice text content*/
function viewcontent(noticeid) {
    $("#ViewMoreModal").modal('show');
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('param', EncodeText('ReplyNotice'));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewMore",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#viewmoreheader").html("");
            $("#viewmorecontent").html("");
            $("#viewmoreheader").html("Reply Notice");
            $("#viewmorecontent").html(data.message)
        },
    })
}
var approvalnoticeid = "";
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
$(".assignto").change(function () {
    Getmanagerlist();
})
/*Get manager list details*/
function Getmanagerlist() {
    $.ajax({
        type: "POST",
        url: "/api/Home/PartnerList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#bindusr").html("");
            $("#bindusr").append($("<option></option>").val("0").text("Please Select"));
            var checkboxval = $("input[name='assignee']:checked").val();
            if (response != null) {
                $.each(response, function (key, value) {
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
/*Assign notice to user*/
$("#assignnoticebtn").click(function () {
    if (confirm("Alert ! are you sure?")) {
        var senderid = userDetails.Id;
        var receiverid = $("#bindusr").val();
        if (receiverid == "0" || receiverid == "" || receiverid == "undefind" || receiverid == "Please Select") {
            alert("Alert ! Please Select User.")
            return false
        }
        var firmid = userDetails.FirmId;
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
        formData.append("senderid", EncodeText(senderid));
        formData.append("receiverid", EncodeText(receiverid));
        formData.append("firmid", EncodeText(firmid));
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
                    alert("Something went wrong.")
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
            }
        })
    }
})
/*Date format*/
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    console.log(month);
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*View more item*/
var childtblclickcount1 = 0;
function ViewMoreItem1(parentId) {
    if (childtblclickcount1 == 1) {
        $("#childtbltr1").remove();
        childtblclickcount1 = 0;
    }
    else {
        childtblclickcount1 = 1;
        $(`<tr id="childtbltr1"><td colspan="27"><div id="tblincmingnotice" class="table-panel table-responsive" style="padding:10px 0 0 0; overflow-x:auto;" data-example-id="hoverable-table">
        <table class= "table table-striped table-bordered" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr class="childtbltr1cls">
                            <th class="childtbltsssr1cls"></th>
                            <th class="receivedreplythrough childtbltsssr1cls">Respondent's Name</th>
                            <th class="receivedreplydate childtbltsssr1cls">Date of Reply</th>
                            <th class="childtbltsssr1cls">Reply to Notice Created On</th>
                             <th class="receivedattachment childtbltsssr1cls">Reply to Notice Created On</th>
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
                        $.each(response, function (i, a) {
                            html += "<tr class=" + a.Id + ">";
                            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem("' + a.Id + '")></span></td>';
                            html += "<td  class='receivedreplythrough'>" + a.ReceivedThrogh + "</td>";
                            html += "<td class='receivedreplydate'>" + (a.ReceivedDate == null ? ' ' : dateFormat(new Date(a.ReceivedDate))) + "</td>";
                            html += "<td>" + (a.CreateDate == null ? ' ' : dateFormat(new Date(a.CreateDate))) + "</td>";
                            if (a.IsFileAvailable) {
                                html += '<td class="receivedattachment"><i class="fa fa-folder" aria-hidden="true"  id="incomingnoticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.Id + '"></i></td>'
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
