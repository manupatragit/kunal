var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var start = "";
var end = "";
var fromdaterange = false;
var fromreminder = false;
var remindernoticeid = "";
var ocreate, oedit, odelete = "";
$(document).ready(function () {
    $("#alertbeforeincaseallddl").select2();
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
    bindcalender();
    $('#clearrange').click(function () {
        start = "";
        end = "";
        $('#reportrange span').html("");
        $("#clearrange").hide();
        callapi();
    });
});
/*Bind calender details*/
function bindcalender() {
    function cb(start, end) {
        try {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        catch (er) {
        }
    }
    $('#reportrange').daterangepicker({
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
    var daterange = $('#reportrange span').html();
    if (daterange == "") {
        alert("Please select date range");
        return false;
    }
    var daterangesplit = daterange.split("-");
    start = formatDateNew(daterangesplit[0]);
    end = formatDateNew(daterangesplit[1]);
    fromdaterange = true;
    $("#clearrange").show();
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
function changePage(page) {
    PageNumber = page;
    callapi();
}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
/*Get data by page number*/
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
/*Send for approval*/
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
/*Edit received settled reply notice*/
function EditNoticeReply(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice"
    sessionStorage.setItem("ReplyNoticeId", noticeid)
}
$(document).ready(function () {
    $(".assignto").change(function () {
        Getmanagerlist();
    })
    /*Get manager partner details*/
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
    /*Assign notice to user*/
    $("#assignnoticebtn").click(function () {
        if (confirm("Are you sure you want to send this Rejoinder?")) {
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
                        alert("Something went wrong.")
                    }
                    $("#AssignModal").modal("hide");
                    window.location.reload();
                }
            })
        }
    })
    var $selectAll = $("input:radio[name=selectlinktype]");
    $selectAll.on("change", function () {
        if ($(this).val() == "newmatter") {
            $("#dvlinktocase").hide();
            $("#dvcreatecase").show();
        }
        else {
            $("#dvlinktocase").show();
            $("#dvcreatecase").hide();
        }
    });
    /*Link notice with matter*/
    $("#CreateNoticetoMatter").click(function () {
        var noticeids = $(this).attr("data-case");
        var IsLinkToMatter = $(this).attr("IsLinkToMatter");
        if (IsLinkToMatter == "1") {
            alert("Already linked to matter");
            return false;
        }
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/CreateCase";
        url_redirect({
            url: urls,
            method: "post",
            data: { "NoticeId": noticeids }
        });
    });
    /*Save link with matter*/
    $("#savelinkmatter").click(function () {
        var matterids = $("#livecaseidhide").val();
        var noticeids = $(this).attr("data-case");
        if (matterids == "") {
            alert("please select matter");
            return false;
        }
        var formData = new FormData();
        formData.append("matterid", EncodeText(matterids));
        formData.append("noticeid", EncodeText(noticeids));
        formData.append("type", EncodeText("NewNotice"));
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/matterApi/SaveCaseForNoticeMAP", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (parseInt(response.Data) > 0) {
                        alert("matter added successfully.");
                        $("#livecaseidhide,#mattersforlink2").val("");
                        $("#closelinkmatter").click();
                        callapi();
                        closeload();
                    }
                    else if (String(response.Data) == "-1") {
                        alert("Already linked to matter");
                        closeload();
                    }
                    else {
                        alert(response.Data);
                        closeload();
                    }
                },
                failure: function (response) {
                    alert(data.responseText);
                    closeload();
                },
                error: function (response) {
                    alert(data.responseText);
                    closeload();
                }
            });
    });
    $(document).on("click", "#linkmatter", function () {
        $("#livecaseidhide,#mattersforlink2").val("");
        var ids = $(this).attr("data-val");
        var IsLinkToMatter = $(this).attr("IsLinkToMatter");
        $("#savelinkmatter,#CreateNoticetoMatter").attr("data-case", ids).attr("IsLinkToMatter", IsLinkToMatter);
        $('#myModallinkcase').modal({ show: true });
    });
    $("#alertbeforeincaseallddl").select2();
    $("#savenotificationsettings").click(function () {
        var notificationfor = $("#ddlnotificationalerttype").val();
        var txtnoticeids = $("#ddlnoticelist").val();
        var txtalrtbefore = $("#alertbeforeincaseallddl").val();
        var txtduedate = $("#txtduedate").val();
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
                    $("#ddlnoticelist").val("");
                    $("#txtalertbefore").val("");
                    $("#txtduedate").val("");
                    $("#myModalNotificationsetting").modal('hide');
                    $('#alertbeforeincaseallddl').select2({
                        allowClear: true // This is for clear get the clear button if wanted 
                    });
                    $("#remindercollection").hide();
                    $("#multiplereminderdiv,#txtduedate,#txtreceiveddate").html("");
                    alert("Notification saved succsssfully");
                }
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    })
    /*Save closure date*/
    $("#saveclosuedate").click(function () {
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
    $('th').on('click', function () {
        var column = $(this).data('column')
        var order = $(this).data('order')
        var text = $(this).html()
        text = text.substring(0, text.length - 1)
        ColumName = column;
        SortedOrder = order;
        console.log('column was clicked', column, order);
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
$('div .dropdown-menu').on('click', function (event) {
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});
/*Closure notice by notice id*/
var closurenoticeid = "";
function ClouserNotice(noticeid) {
    closurenoticeid = noticeid;
    $("#ActualclosurModal").modal('show');
    var formData = new FormData();
    formData.append("closurenoticeid", EncodeText(closurenoticeid));
}
/*Get settled reply notice details*/
var callapi = function () {
    openload();
    var html = '';
    var notistatus = $('input[name=statustype]:checked').val();
    SearchValue = document.getElementById("searchnoticeTile").value;
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(SearchValue));
    formData.append("ColumName", EncodeText(ColumName));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("fromdaterange", EncodeText(fromdaterange));
    formData.append("startdate", EncodeText(start));
    formData.append("enddate", EncodeText(end));
    formData.append("fromreminder", EncodeText(fromreminder));
    formData.append("NoitceId", EncodeText(NoticeId));
    $.ajax({
        type: "POST",
        url: '/api/NoticeReceived/ReceivedNoticeListSettled',
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
                            tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                            if (a.TotalRows <= response.length) {
                            }
                            else if (pageno == 1) {
                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            }
                            else {
                                tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#listingTablefooter").append(tfot);
                        }
                        var span = document.createElement('span');
                        span.innerHTML = a.CreateRejoinder;
                        var trval = "";
                        if ((dateFormat(new Date()) == dateFormat(new Date(a.DateofServiceofNotice)))) {
                            trval = "<tr class=" + a.NoticeID + " id=reminderhighlighcls>";
                        }
                        else {
                            trval = "<tr class=" + a.NoticeID + ">";
                        }
                        html += trval;
                        html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem("' + a.NoticeID + '")></span></td>';
                        html += "<td class='noticesubject'>" + a.RejoinderSubject + "</td>";
                        html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                        html += "<td class='statutory'>" + a.NoticeType + "</td>";
                        html += "<td class='pending'>" + a.CaseStatus + "</td>";
                        html += "<td class='servedon'>" + (a.DateofReceipt == null ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>";
                        if (a.CreateRejoinder.length > 60) {
                            html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReceivedNotice") title="View more"> view more</a>' + "</td>";
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
                        html += "<td class='dateofserviceofnotice'>" + (a.DateofServiceofNotice == null ? ' ' : dateFormat(new Date(a.DateofServiceofNotice))) + "</td>";
                        html += "<td class='modeofreceipt'>" + a.ModeofReceipt + "</td>";
                        html += "<td class='dateofrejoinder'>" + (a.DateofRejoinder == null ? ' ' : dateFormat(new Date(a.DateofRejoinder))) + "</td>";
                        html += "<td class='modeofdeliveryofrejoinder'>" + a.ModeofDeliveryofRejoinder + "</td>";
                        html += "<td class='rejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                        html += "<td  class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                        html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                        html += "<td class='noticeandreplyreference'>" + a.NoticeandReplyReference + "</td>";
                        html += "<td  class='rejoinderthrough'><span style='cursor:pointer;color:#069;' title='View Client Notice' id='ViewClientNoticeList' value='" + a.NoticeThroughId + "'>" + a.ClientName + "</span></td>";
                        html += "<td class='currentstatus'>" + (a.CurrentStatus == null || a.CurrentStatus == "undefined" ? "" : a.CurrentStatus) + "</td>";
                        html += "<td class='dateofcreatingrejoinder'>" + (a.DateofCreatingRejoinder == null ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                        if (a.IsFileAvailable) {
                            html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                        }
                        else {
                            html += '<td class="attachment"></td>';
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
/*Create settled reply notice*/
function AddCreateReply(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid;
}
/*View file log*/
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
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
    sessionStorage.removeItem("ReceivedNoticeId");
};
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
var DelNoticeId = "";
var ConfirmDelete = function (NoticeID) {
    DelNoticeId = NoticeID;
    $("#myModal").modal('show');
}
/*Delete received settled notice details*/
function DeleteReceivedNotice() {
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
/*View notice text more content*/
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
/*Set alert notification*/
function fnsetnotificationalert() {
    $("#myModalNotificationsetting ").modal('show');
    fnnotificationalerttype();
}
/*Get notification alert type*/
function fnnotificationalerttype() {
    var selecteddlval = $("#ddlnotificationalerttype").val();
    if (selecteddlval == "individual") {
        $("#divnoticelist").show();
        GetNoticeListForDdl();
        $("#alertbeforeincaseindividual").css('display', 'block');
    }
    else {
        $("#divnoticelist").hide();
        $("#alertbeforeincaseindividual").css('display', 'none');
    }
}
/*Get notice list for dropdown*/
function GetNoticeListForDdl() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeRcvListForddl",
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
        $("#multiplereminderdiv").append('<span style="color:red">*</span> Reminder is set on ' + reminderdate + '<br/>')
    }
    else if (txtalrtcondition == "afterreceivedate") {
        var date = new Date(receiveddate);
        var time = parseInt(day) * 24 * 60 * 60 * 1000
        var reminderdate = (date.getTime() + time);
        reminderdate = new Date(reminderdate);
        $("#multiplereminderdiv").append('<span style="color:red">*</span> Reminder is set on ' + reminderdate + '<br/>')
    }
}
/*Get date for alert by notice id*/
function Getdateforalertbynoticeid() {
    var noticeid = $("#ddlnoticelist").val();
    var duedate = $("#ddlnoticelist option:selected").attr("data-id");
    var duedate1 = duedate.split("T");
    $("#txtduedate").html(duedate1[0]);
    $("#txtduedate").val(duedate1[0]);
}
/*Edit received notice details*/
function EditReceivedNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeReceived/AddReceivedNotice"
    sessionStorage.setItem("ReceivedNoticeId", noticeid)
}
/*Edit notice*/
function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice"
    sessionStorage.setItem("ReplyNoticeId", noticeid)
}
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReceivedNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
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