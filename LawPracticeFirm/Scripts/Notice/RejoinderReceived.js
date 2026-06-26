var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
function changePage(page) {
    PageNumber = page;
    callapi(pageindex);
}
GetNoticestatusForDropdown();
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
/*Get rejoinder received notice details by page number*/
$(document).on('click', '#pgetdatabypagenum', function () {
    pageindex = $("#ppagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var ppageindesx = $("#psotopage").text();
            if (pageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                callapi(pageindex);
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
    callapi(ppageindex);
});
$('div .dropdown-menu').on('click', function (event) {
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});

/*Get reeceived rejoinder by status type*/
$("#notistatustype").change(function () {
    callapi(pageindex);
})
/*Get received rejoinder by type*/
$("#ddlnoticetypess").change(function () {
    callapi(pageindex);
})
$("#ddlnoticestatus").change(function () {
    callapi(pageindex);
})
/*Get rejoinder notice details*/
var callapi = function (pageindex) {
    openload();
    ploadtabledata('Rejoinder');
    var html = '';
    var notistatus = $('#notistatustype').val();
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
    var noticetitlesrch = $("#noticeTitless").val();
    var ddlnoticestatus = $("#ddlnoticestatus").val();
    var sendernamesearch = $("#noticebyIds").val();
    var Noticesubjectsrc = $("#noticeSubjects").val();
    var Noticetypesrc = "";
    var noticeid = sessionStorage.getItem("mainnoticeid");
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(noticetitlesrch));
    formData.append("ColumName", EncodeText(ddlnoticestatus));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(pageindex));
    formData.append("PageSize", EncodeText(10));
    formData.append("noticeid", EncodeText(noticeid));
    formData.append("RejoinderInitiateBy", EncodeText("opponent"));
    formData.append("notistatus", EncodeText(notistatus1));
    formData.append("SenderNamesrch", EncodeText(sendernamesearch));
    formData.append("Noticesubjectsrc", EncodeText(Noticesubjectsrc));
    formData.append("Noticetypesrc", Noticetypesrc);
    $.ajax({
        type: "POST",
        url: '/api/RejoinderNotice/RejoinderNoticeList',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            closeload();
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
                        firstvalue = a.RowId;
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
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer" class="gobtn">Go</button> </li>'
                        if (a.TotalRows <= response.length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
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
                    html += "<td class='rejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                    if (a.IsReplyReceivedCount > 0) {
                        html += "<td  class='noticeby'>" + a.SendersName + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor: pointer;' onclick=ViewMoreItem('" + a.NoticeID + "')></span></td>";
                    }
                    else {
                        html += "<td  class='noticeby'>" + a.SendersName + "</td>";
                    }
                    html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                    html += "<td class='noticesubject'>" + a.RejoinderSubject + "</td>";
                    html += "<td class='dateofrejoinder'>" + (a.DateofCreatingRejoinder == null || a.DateofCreatingRejoinder == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                    html += "<td class='Duedate'>" + (a.DueDateOfNotice == null || a.DueDateOfNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                    if (a.CreateRejoinder.length > 0) {
                        html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '") title="View more"> View more</a>' + "</td>";
                    }
                    else {
                        html += "<td  class='remark'>" + span.innerText + "</td>";
                    }
                    if (a.iApprovalStatusForUser != null) {
                        var status = a.iApprovalStatusForUser == 'Approve' ? 'Approved' : a.iApprovalStatusForUser == 'Reject' ? 'Rejected' : a.iApprovalStatusForUser;
                        html += "<td class='managerapprove'><span style='padding-left:45px;color:#337ab7'>" + status + "</span><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','2') title='View more'></span></td>";
                    }
                    else {
                        html += "<td class='managerapprove'></td>";
                    }
                    if (a.iApprovalStatusForClient != null) {
                        var statusclient = a.iApprovalStatusForClient == 'Approve' ? 'Approved' : a.iApprovalStatusForClient == 'Reject' ? 'Rejected' : a.iApprovalStatusForClient;
                        html += "<td class='clientapprovestatus'><span style='color:#337ab7'>" + statusclient + "</span><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','3') title='View more'></span></td>";
                    }
                    else {
                        html += '<td class="clientapprovestatus"></td>';
                    }
                    html += "<td class='dateofcreatingrejoinder'>" + (a.DateofCreatingRejoinder == null || a.DateofCreatingRejoinder == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                    html += "<td  class='noticeTrackingId'>" + a.ConsignmentNum + "</td>";
                    html += "<td class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                    html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                    html += "<td class='modeofreceipt'>" + a.ModeofDeliveryofRejoinder + "</td>";
                    html += "<td class='rejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' ? '' : a.RejoinderThrough) + "</td>";
                    html += "<td  class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                    html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                    html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                    html += "<td class='dateofreceivingreply'>" + (a.DateofReceivingReply == null || a.DateofReceivingReply == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceivingReply))) + "</td>";
                    html += "<td class='pending'>" + a.CaseStatus + "</td>";
                    html += "<td class='OtherdetailsofReceiver'>" + a.OtherDetailsofSender + "</td>";
                    html += "<td class='criticality'>" + a.Criticality + "</td>";
                    html += "<td class='resonforhighpriority'>" + a.Resonforhighpriority + "</td>";
                    html += "<td class='amountclaimed'>" + a.AmountClaimed + "</td>";
                    html += "<td class='tags'>" + a.Tag + "</td>";
                    if (a.IsFileAvailable) {
                        html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                    }
                    else {
                        html += '<td class="attachment"></td>';
                    }
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
    SortData();
};
function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}
/*Sort customize data*/
function SortData() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od").
            appendChild(e));
}
/*Send notice for approval*/
var noticeIdFinalStatus = "";
function FinalApproved(noticeId) {
    noticeIdFinalStatus = noticeId
    $("#FinalStatusModal").modal('show');
}
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

/*Get notice status for dropdown*/
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
            $("#txtStatusOfNotice").append($("<option></option>").val("").text('Notice Status'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    if (value.Name == "Active") {
                        $("#ddlnoticestatus").append($("<option data-id=" + value.Id + " selected></option>").val(value.Id).text(value.Name));
                        $("#ddlnoticestatus").append($("<option data-id=" + value.Id + " selected></option>").val("").text("notice status"));
                    }
                    if (value.Name == "InActive" || value.Name == "Settled" || value.Name == "Convert to case") {
                        $("#ddlnoticestatus").append($("<option data-id=" + value.Id + "></option>").val(value.Id).text(value.Name));
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
/*Create rejoinder received reply notice*/
function AddCreateReply(noticeid, rootId) {
    window.location.href = "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid + "&rootId=" + rootId;
}
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=RejoinderNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
/*Edit notice*/
function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice"
    sessionStorage.setItem("RejoinderNoticeId", noticeid)
}
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
    sessionStorage.removeItem("RejoinderNoticeId");
    //callapi();
};
var DelNoticeId = "";
var ConfirmDelete = function (NoticeID) {
    DelNoticeId = NoticeID;
    $("#myModal").modal('show');
}
/*Delete rejoinder details*/
function DeleteRejoinder() {
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
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
$(".assignto").change(function () {
    Getmanagerlist();
})
function viewcontent(noticeid) {
    $("#ViewMoreModal").modal('show');
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('param', EncodeText('Rejoinder'));
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
    if (confirm("Are you sure you want to send this Rejoinder?")) {
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
                    alert("Notice assigned successfully.");
                }
                else {
                    alert("Notice already sent for Approval.");
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
            }
        })
    }
})
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
                    alert("Record deleted successfully.")
                    window.location.reload();
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
$("#clearnewsearchforsender").click(function () {
    $("#noticebyIds").val("");
    $("#clearnewsearchforsender").css("display", "none");
    // loadflag = true;
    callapi(pageindex);
})
$("#searchdatas").click(function () {
    var casefiltercasename = $("#noticebyIds").val();
    if (casefiltercasename == "") {
        alert("enter sender name");
        $("#noticebyIds").focus();
        return false;
    }
    $("#clearnewsearchforsender").css("display", "unset")
    callapi(pageindex);
    // chksflag = true;
});
$("#clearnewsearchforsendersub").click(function () {
    $("#noticeSubjects").val("");
    $("#clearnewsearchforsendersub").css("display", "none");
    // loadflag = true;
    callapi(pageindex);
})
$("#searchdatassub").click(function () {
    var casefiltercasename = $("#noticeSubjects").val();
    if (casefiltercasename == "") {
        alert("enter subject type");
        $("#noticeSubjects").focus();
        return false;
    }
    $("#clearnewsearchforsendersub").css("display", "unset")
    callapi(pageindex);
    // chksflag = true;
});
$("#clearnewsearchforsendertitl").click(function () {
    $("#noticeTitless").val("");
    $("#clearnewsearchforsendertitl").css("display", "none");
    // loadflag = true;
    callapi(pageindex);
})
$("#searchdatatitl").click(function () {
    var casefiltercasename = $("#noticeTitless").val();
    if (casefiltercasename == "") {
        alert("enter notice title");
        $("#noticeTitless").focus();
        return false;
    }
    $("#clearnewsearchforsendertitl").css("display", "unset")
    callapi(pageindex);
    // chksflag = true;
});