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
$(document).on('click', '#pgetdatabypagenum', function () {
    ppageindex = $("#ppagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#psotopage").text();

            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                changePage(ppageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});

$(document).on('click', '#ppaginate', function () {
    ppageindex = $(this).attr("index");
    changePage(ppageindex);
});


$('div .dropdown-menu').on('click', function (event) {
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});

function fnchangerejoinder() {
    callapi();
}

/*Get draft rejoinder notice*/
var callapi = function () {
    try {
        openload();
    }
    catch
    {

    }
    var html = '';

    var noticetitlesrch = $("#noticeTitless").val();
    var ddlnoticestatus = $("#ddlnoticestatus").val();
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(noticetitlesrch));
    formData.append("ColumName", EncodeText(ddlnoticestatus));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));

    formData.append("RejoinderInitiateBy", EncodeText("plaintiff"));
    $.ajax({
        type: "POST",
        url: '/api/RejoinderNotice/DraftRejoinderNoticeList',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {

            var response = JSON.parse(response.Data);
            try {
                closeload();
            }
            catch
            {

            }

            $("#Rejoindertablevalue").html("");
            $("#listingTablefooter").html("");
            $("#rejoindernonotice").html("");

            if (response == "") {
                $("#rejoindernonotice").append("No Records found.");
                return false;
            }
            else {
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
                        $("#listingTablefooter").append(tfot);
                    }
                    var span = document.createElement('span');
                    span.innerHTML = a.CreateRejoinder;
                    html += "<tr class=" + a.NoticeID + ">";
                    html += "<td>" + a.RowId + "</td>";
                    if (a.IsReplyReceivedCount > 0) {
                        // html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem("' + a.NoticeID + '")></span></td>';
                        html += "<td  class='noticefrom'>" + a.Rejoinder + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor: pointer;' onclick=ViewMoreItem('" + a.NoticeID + "')></span></td>";
                    }
                    else {
                        html += "<td  class='noticefrom'>" + a.Rejoinder + "</td>";
                    }
                    html += "<td class='noticesubject'>" + a.RejoinderSubject + "</td>";
                    html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                    html += "<td class='statutory'>" + a.NoticeType + "</td>";
                    html += "<td class='noticedate'>" + (a.DateofNotice == null || a.DateofNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofNotice))) + "</td>";
                    html += "<td class='pending'>" + a.CaseStatus + "</td>";
                    html += "<td class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                    html += "<td class='servedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>";
                    if (a.CreateRejoinder.length > 60) {

                        html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"> view more</a>' + "</td>";
                    }
                    else {
                        html += "<td  class='remark'>" + span.innerText + "</td>";
                    }
                    if (a.iApprovalStatus != null) {
                        var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                        if (roleid == 3) {
                            html += "<td class='managerapprove'><span style='color:#337ab7'>" + status + "</span><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','3') title='View more'></span></td>";
                        } else {
                            html += "<td class='managerapprove'><span style='color:#337ab7'>" + status + "</span><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','2') title='View more'></span></td>";
                        }
                    }
                    else {
                        html += "<td class='managerapprove'></td>";
                    }
                    html += "<td class='generationofalerts'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                    html += "<td class='dateofdispatchofnotice'>" + (a.DateofDispatchofNotice == null || a.DateofDispatchofNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDispatchofNotice))) + "</td>";
                    html += "<td class='dateofserviceofnotice'>" + (a.DateofServiceofNotice == null || a.DateofServiceofNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofServiceofNotice))) + "</td>";
                    html += "<td class='dateofreceivingreply'>" + (a.DateofReceivingReply == null || a.DateofReceivingReply == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceivingReply))) + "</td>";
                    html += "<td class='modeofreceipt'>" + a.ModeofReceipt + "</td>";
                    html += "<td class='dateofrejoinder'>" + (a.DateofRejoinder == null || a.DateofRejoinder == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofRejoinder))) + "</td>";
                    html += "<td class='modeofdeliveryofrejoinder'>" + a.ModeofDeliveryofRejoinder + "</td>";
                    html += "<td class='rejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                    html += "<td  class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                    html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                    html += "<td class='noticeandreplyreference'>" + a.NoticeandReplyReference + "</td>";
                    html += "<td class='rejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' ? '' : a.RejoinderThrough) + "</td>";
                    html += "<td class='currentstatus'>" + (a.CurrentStatus == undefined ? '' : a.CurrentStatus) + "</td>";
                    html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                    html += "<td class='dateofcreatingrejoinder'>" + (a.DateofCreatingRejoinder == null || a.DateofCreatingRejoinder == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                    if (a.IsFileAvailable) {
                        html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                    }
                    else {
                        html += '<td class="attachment"></td>';
                    }

                    html += "<td  class='noticesenddate'>" + (a.NoticeSentToClientDate == null || a.NoticeSentToClientDate == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeSentToClientDate))) + "</td>"


                    html += "<td  class='noticeTrackingId'>" + a.ConsignmentNum + "</td>";

                    bindCustomizehtml = "";
                    var val = a;
                    html += "" + bindCustomizehtml + "";
                    if (roleid == 2) {
                        html += '<td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("' + a.NoticeID + '") title="Edit Notice"></a> | <a class="fa fa-plus" style="cursor:pointer;" onclick=AddCreateReply("' + a.NoticeID + '") title = "Create Reply To Notice" ></a> | <a class="glyphicon glyphicon-tasks" style="cursor:pointer;"  onclick=ChangeStatus("' + a.NoticeID + '") title="Change Status"></a> | <a class="glyphicon glyphicon-folder-open" title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("' + a.NoticeID + '")></a></td>';

                    } else {
                        html += '<td><a class="glyphicon glyphicon-tasks" style="cursor:pointer;"  onclick=ChangeStatus("' + a.NoticeID + '") title="Change Status"></a> | <a class="glyphicon glyphicon-folder-open" title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("' + a.NoticeID + '")></a></td>';
                    }
                    html += "<tr>";

                });

                $("#Rejoindertablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }

        },
        error: function (xhr) {
            alert('error');
        }

    })
};

function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice"
    sessionStorage.setItem("RejoinderNoticeId", noticeid)
}

function AddCreateReply(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid;
}

$(document).on("click", "#noticerelevantdoc", function () {

    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=RejoinderNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {

        $('#myDocumentModal').modal({ show: true });
    });
});



var statusnotisId = ""
function ChangeStatus(noticeId) {
    statusnotisId = noticeId;
    $("#NoticeStatusModal").modal('show');
}
/*Notice status*/
$("#statusnoticebtn").click(function () {
    var status = $("#notistatus").val();
    var feedback = $("#feedbacktext").val();
    var noticeId = statusnotisId;

    if (feedback == "") {
        alert("Feedback can't be empty.");
        return false;
    }

    var formdata = new FormData();
    formdata.append('status', EncodeText(status));
    formdata.append('feedback', EncodeText(feedback));
    formdata.append('noticeId', EncodeText(noticeId));

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
                callapi();
            }
            else {
                alert("Something went wrong.");
                $("#NoticeStatusModal").modal('hide');
            }
        },

    })

})

window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
    sessionStorage.removeItem("RejoinderNoticeId");
};

/*Date format*/
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*Send for approval*/
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}

$(".assignto").change(function () {
    Getmanagerlist();
})
/*View content*/
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

/*Get manager list*/
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
                    alert("Something went wrong.")
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
            }
        })
    }
})
/*View log*/
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
            $.each(response.Data, function (key, data) {
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


$("#clearnewsearchforsendertitl").click(function () {
    $("#noticeTitless").val("");
    $("#clearnewsearchforsendertitl").css("display", "none");
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
    callapi();
});
