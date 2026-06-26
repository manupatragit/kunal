var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
window.onload = function () {
    callapi();
};
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
$('div .dropdown-menu').on('click', function (event) {
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});
/*Get schedule notice details*/
var callapi = function () {
    var html = '';
    var formdata = new FormData();
    formdata.append("NoticeID", EncodeText(sessionStorage.getItem("schedulenoticeid")));
    formdata.append("LoginUserId", EncodeText(userDetails.Id));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeByIdList",
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            closeload();
            $("#tablevalue").html("");
            $("#noticetbldashboardfooter").html("");
            $("#nonotice").html("");
            if (response == "") {
                $("#nonotice").append("No Records found.");
                return false;
            }
            else {
                if (1 == 1) {
                    $.each(response, function (i, a) {
                        var amountclaimed = a.AmountClaimed == "0" || a.AmountClaimed == null ? "" : a.AmountClaimed;
                        var span = document.createElement('span');
                        span.innerHTML = a.CreateNotice;
                        html += "<tr class=" + a.NoticeID + ">";
                        html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                        html += "<td class='noticeby'>" + a.SendersName + "</td>";
                        html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                        html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                        html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                        html += "<td  class='criticality'>" + a.Criticality + "</td>";
                        html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                        html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                        html += "<td class='pending'>" + a.CaseStatus + "</td>";
                        html += "<td  class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                        html += "<td  class='servedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>"
                        if (a.CreateNotice.length > 60) {
                            html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
                        }
                        else {
                            html += "<td  class='remark'>" + span.innerText + "</td>";
                        }
                        html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                        html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";
                        if (a.iApprovalStatus != null) {
                            var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                            html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                        }
                        else {
                            html += "<td class='managerapprove'></td>";
                        }
                        html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                        html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                        html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                        html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                        html += "<td  class='addressto'>" + a.AddressedTo + "</td>";
                        html += "<td  class='sendersname'>" + a.SendersName + "</td>";
                        html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                        html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                        html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                        html += "<td class='assignmentoftast'>" + (a.AssignmentofTask == undefined ? '' : a.AssignmentofTask) + "</td>";
                        html += "<td  class='currentstatus'>" + (a.CurrentStatus == undefined ? '' : a.CurrentStatus) + "</td>"
                        html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null || a.NoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                        if (a.IsFileAvailable) {
                            html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                        }
                        else {
                            html += '<td class="attachment"></td>';
                        }
                        html += '<td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("' + a.NoticeID + '") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete Notice" ></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("' + a.NoticeID + '") title = "Send For Approval" ></a> | <a class="fa fa-plus" style="cursor:pointer;" onclick=AddInComingReply("' + a.NoticeID + '") title = "Received Reply To Notice" ></a> | <a class="fa fa-calendar" style="cursor:pointer;" onclick=ClouserNotice("' + a.NoticeID + '") title = "Fill Closure Date" ></a></td>';
                        html += "<tr>";
                    });
                    $("#tablevalue").append(html);
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
/*Delete schedule notice*/
var DelNoticeId = "";
var ConfirmDelete = function (NoticeID) {
    DelNoticeId = NoticeID;
    $("#myModal").modal('show');
}

var DeleteNotice = function () {
    formdata = new FormData();
    formdata.append("NoticeId", EncodeText(DelNoticeId))
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
/*Date format*/
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
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
/* Assign schedule notice to user*/
$("#assignnoticebtn").click(function () {
    if (confirm("Are you sure you want to send this Notice?")) {
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
/*Send notice for approval*/
var approvalnoticeid = "";
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
/*Get manager list*/
$(".assignto").change(function () {
    Getmanagerlist();
})
/*View more content*/
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
            $("#viewmorecontent").html(data.message)
        },
    })
}
/*Edit notice details*/
function EditNotice(noticeid) {
    window.location.href = "/NoticeNew/Insert"
    sessionStorage.setItem("NoticeId", noticeid)
}
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
/*View more content*/
var childtblclickcount = 0;
function ViewMoreItem(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="27"><div id="tblpoitem" class="table-panel table-responsive" style="padding:10px 0 0 0; overflow-x:auto;" data-example-id="hoverable-table">
        <table class= "table table-striped table-bordered" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr>
                            <th class="childreplyfrom" data-column="RespondentsName" data-order="desc">Respondent's Name  &#9650</th>
                            <th class="childreplydate" data-column="DateofReply" data-order="desc">Date of Reply &#9650</th>
                            <th class="childnoticedate" data-column="ReplytoNoticeCreatedOn" data-order="desc">Reply to Notice Created On &#9650</th>
                            <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc">Notice Title &#9650</th>
                            <th class="childnoticesubject" data-column="ReplySubject" data-order="desc">Reply Subject &#9650</th>
                            <th class="childstatutory" data-column="NoticeType" data-order="desc">Notice Type   &#9650</th>
                            <th class="childpending" data-column="CaseStatus" data-order="desc">Case Status &#9650</th>
                            <th class="childdispatched" data-column="DateofDelivery" data-order="desc">Date of Delivery &#9650</th>
                            <th class="childservedon" data-column="DateofReceipt" data-order="desc">Date of Receipt &#9650</th>
                            <th class="childremark" data-column="CreateReply" data-order="desc">Remarks &#x25B2</th>
                            <th class="childmanagerapprove">Sent To Manager</th>
                            <th class="childclientapprove">Sent To Client</th>
                            <th class="childmodeofserviceordelivery" data-column="ModeofServiceorDelivery" data-order="desc">Mode of Service/Delivery  &#9650</th>
                            <th class="childreplyaddressedto" data-column="ReplyAddressedto" data-order="desc">Reply Addressed to &#9650</th>
                            <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc">Addressee Address &#9650</th>
                            <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc">Other Details of Addressee &#9650</th>
                            <th class="childnoticereceivedbyclient" data-column="NoticeReceivedbyClient" data-order="desc">Notice Received by Client &#9650</th>
                            <th class="childnoticebroughtbyclientforreply" data-column="NoticeBroughtbyClientforReply" data-order="desc">Notice Brought by Client for Reply   &#9650</th>
                            <th class="childgenerationofalerts" data-column="GenerationofAlerts" data-order="desc">Generation of Alerts &#9650</th>
                            <th class="childassignmentoftask" data-column="AssignmentofTask" data-order="desc">Assignment of Task &#9650</th>
                            <th class="childrespondentsaddress" data-column="RespondentsAddress" data-order="desc">Respondent's Address &#9650</th>
                            <th class="childotherdetailsofrespondent" data-column="OtherDetailsofRespondent" data-order="desc">Other Detail's of Respondent &#9650</th>
                            <th class="childnoticereference" data-column="NoticeReference" data-order="desc">Notice Reference  &#9650</th>
                            <th class="childreplythrough" data-column="ReplyThrough" data-order="desc">Reply Through &#9650</th>
                            <th class="childcurrentstatus" data-column="CurrentStatus" data-order="desc">Current Status &#9650</th>
                            <th class="childattachment">Attachment</th>
                            <th class="childreplytonoticeaction">Action</th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonotice"></tbody>
                        </table >
        <center> <div id="noreplytonotice"> </div></center>
         <div class="table-panel">
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
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childreplyfrom" checked><a href="#">Respondent's Name</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childreplydate"><a href="#">Date of Reply</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticedate"><a href="#">Reply to Notice Created On</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle" checked><a href="#">Notice Title</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject" checked><a href="#">Reply Subject</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childstatutory" checked><a href="#">Notice Type</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending" checked><a href="#">Case Status</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdispatched"><a href="#">Date of Delivery</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childservedon"><a href="#">Date of Receipt</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#" class="dropdown-item">Remarks</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmanagerapprove" checked><a>Sent To Manager</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childclientapprove" checked><a>Sent To Client</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofserviceordelivery"><a href="#">Mode of Service/Delivery</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childreplyaddressedto"><a href="#">Reply Addressed to</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Addressee Address</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Addressee</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticereceivedbyclient"><a href="#">Notice Received by Client</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticebroughtbyclientforreply"><a href="#">Notice Brought by Client for Reply </a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childgenerationofalerts"><a href="#">Generation of Alerts</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childassignmentoftask"><a href="#">Assignment of Task</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrespondentsaddress"><a href="#">Respondent's Address</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofrespondent"><a href="#" class="dropdown-item">Other Detail's of Respondent</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticereference"><a href="#">Notice Reference</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childreplythrough"><a href="#">Reply Through</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childcurrentstatus"><a href="#" class="dropdown-item">Current Status</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childattachment"><a>Attachments</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childreplytonoticeaction"><a>Action</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="listingTableReplyFooter"></div>
                        </div>
                        <div class="col-md-6" style="padding-right:20px">
                                                    </div>
                    </div>
                </div>
       </div></td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        var formData = new FormData();
        formData.append("SearchValue", EncodeText(""));
        formData.append("ColumName", EncodeText(ColumName));
        formData.append("SortedOrder", EncodeText(SortedOrder));
        formData.append("PageNumber", EncodeText(PageNumber));
        formData.append("PageSize", EncodeText(10));
        formData.append("UserId", EncodeText(userDetails.Id));
        formData.append("RoleId", EncodeText(userDetails.RoleId));
        formData.append("parentId", EncodeText(parentId));
        var html = '';
        $.ajax({
            type: "POST",
            url: '/api/ReplyToNotice/ReplyToNoticeListByNoticeId',
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
                            html += "<tr>";
                            html += "<td  class='childreplyfrom'>" + a.RespondentsName + "</td>";
                            html += "<td class='childreplydate'>" + (a.DateofReply == null || a.DateofReply == "1900-01-01T00:00:00" ? '' : dateFormat(new Date(a.DateofReply))) + "</td>";
                            html += "<td class='childnoticedate'>" + (a.ReplytoNoticeCreatedOn == null || a.ReplytoNoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ReplytoNoticeCreatedOn))) + "</td>";
                            html += "<td class='childnoticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='childnoticesubject'>" + a.ReplySubject + "</td>";
                            html += "<td class='childstatutory'>" + a.NoticeType + "</td>";
                            html += "<td class='childpending'>" + a.CaseStatus + "</td>";
                            html += "<td class='childdispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td class='childservedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? '' : dateFormat(new Date(a.DateofReceipt))) + "</td>";
                            if (a.CreateReply.length > 60) {
                                html += "<td  class='childremark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReplyNotice") title="View more"> view more</a>' + "</td>";
                            }
                            else {
                                html += "<td  class='childremark'>" + span.innerText + "</td>";
                            }
                            if (a.ApproveByManager) {
                                html += "<td class='childmanagerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><a href='#' style='padding-left:30px;' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'>View Log</a></td>";
                            }
                            else {
                                html += "<td class='childmanagerapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                            }
                            if (a.ApproveByClient) {
                                html += "<td class='childmanagerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><a href='#' style='padding-left:30px;' onclick=fnviewlog('" + a.NoticeID + "','Client') title='View more'>View Log</a></td>";
                            } else {
                                html += "<td class='childclientapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                            }
                            html += "<td  class='childmodeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td class='childreplyaddressedto'>" + a.ReplyAddressedto + "</td>";
                            html += "<td class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childnoticereceivedbyclient'>" + a.NoticeReceivedbyClient + "</td>";
                            html += "<td class='childnoticebroughtbyclientforreply'>" + a.NoticeBroughtbyClientforReply + "</td>";
                            html += "<td class='childgenerationofalerts'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td class='childassignmentoftask'>" + a.AssignmentofTask + "</td>";
                            html += "<td class='childrespondentsaddress'>" + a.RespondentsAddress + "</td>";
                            html += "<td class='childotherdetailsofrespondent'>" + a.OtherDetailsofRespondent + "</td>";
                            html += "<td class='childnoticereference'>" + a.NoticeReference + "</td>";
                            html += "<td class='childreplythrough'>" + a.ReplyThrough + "</td>";
                            html += "<td class='childcurrentstatus'>" + a.CurrentStatus + "</td>";
                            if (a.IsFileAvailable) {
                                html += '<td class="childattachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="childattachment"></td>';
                            }
                            html += '<td class="childreplytonoticeaction"><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("' + a.NoticeID + '") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete Notice" ></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("' + a.NoticeID + '") title = "Send For Approval" ></a></td>';
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
/*Edit incoming notice details*/
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
            $("#ReceivedReplyModal").modal('show');
            $('#txtreplyreciveddate').val((response[0].ReceivedDate.split("T"))[0]);
            $("#txtreplyrecivedthrough").val(response[0].ReceivedThrogh);
            $("#hiddenreplynoticeid").val(response[0].Id);
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
/*Delete reply notice details*/
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
/*View more content*/
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
        <thead>
            <tr class="childtbltr1cls">
                            <th class="childtbltsssr1cls"></th>
                            <th class="receivedreplythrough childtbltsssr1cls">Received Reply Through</th>
                            <th class="receivedreplydate childtbltsssr1cls">Date of Reply</th>
                            <th class="childtbltsssr1cls">Reply to Notice Created On</th>
                            <th class="receivedattachment childtbltsssr1cls">Document's</th>
                            <th class="receivedreplyaction childtbltsssr1cls">Action</th>
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
                            html += '<td class="receivedreplyaction"><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=IncomingEditNotice("' + a.Id + '") title="Edit Received Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=IncomingConfirmDelete("' + a.Id + '") title = "Delete Received Notice" ></a> | <a class="fa fa-plus" style="cursor:pointer;" onclick=AddCreateReply("' + a.Id + '") title = "Create Reply To Notice" ></a></td>';
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
function AddCreateReply(noticeid) {
    window.location.href = "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid;
}
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/NoticeNew/multiplefilelist/?ftype=ReplyToNoticeDocument&data=" + fileid + "&mode=" + mode + "&FirmId=" + userDetails.FirmId + "&LoginUserId=" + userDetails.Id + "&RoleId=" + userDetails.RoleId;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
var noticeIdFinalStatus = "";
function FinalApproved(noticeId) {
    noticeIdFinalStatus = noticeId
    $("#FinalStatusModal").modal('show');
}
/*Save final notice status details*/
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
    formData.append("LoginUserId", EncodeText(userDetails.Id));
    formData.append("NoticeId", EncodeText(noticeIdFinalStatus));
    formData.append("FirmIdd", EncodeText(userDetails.FirmId));
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
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/NoticeNew/multiplefilelist/?ftype=NewNoticeDocument&data=" + fileid + "&mode=" + mode + "&FirmId=" + userDetails.FirmId + "&LoginUserId=" + userDetails.Id + "&RoleId=" + userDetails.RoleId;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
var outnoticeidd = "";
function AddInComingReply(outnoticeid) {
    outnoticeidd = outnoticeid;
    $("#ReceivedReplyModal").modal('show');
}
$("#savereplytonotice").click(function () {
    var noticeid = outnoticeidd;
    var txtreplyreciveddate = $("#txtreplyreciveddate").val();
    var txtreplyrecivedthrough = $("#txtreplyrecivedthrough").val();
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    var totalFiles = document.getElementById("replypostedFile").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("replypostedFile").files[i];
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
    formData.append("noticeid", EncodeText(noticeid));
    formData.append("txtreplyreciveddate", EncodeText(txtreplyreciveddate));
    formData.append("txtreplyrecivedthrough", EncodeText(txtreplyrecivedthrough));
    formData.append("FirmIdd", EncodeText(userDetails.FirmId));
    formData.append("LoginUserId", EncodeText(userDetails.Id));
    formData.append("hiddenreplynoticeid", EncodeText($("#hiddenreplynoticeid").val()));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/AddIncomingNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.message);
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
var closurenoticeid = "";
function ClouserNotice(noticeid) {
    closurenoticeid = noticeid;
    $("#ActualclosurModal").modal('show');
}
$("#saveclosuedate").click(function () {
    var closuredate = ("#dateofclosure").val();
    if (closuredate == "") {
        alert("Please enter date of closure.")
        return false;
    }
    var formData = new FormData();
    formData.append("closurenoticeid", EncodeText(closurenoticeid));
    formData.append("LoginUserId", EncodeText(userDetails.Id));
    formData.append("closuredate", EncodeText(closuredate));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/NoticeClosure',
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
})