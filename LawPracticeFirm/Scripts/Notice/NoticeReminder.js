var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var dynamicFieldCount = 0;
var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
const priorityClassMap = {
    "sent": "sent",
    "received": "received",
};
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});


//function ConfirmDeleteReminder(noticeid) {
//    if (confirm("Are you sure you want to remove this reminder?")) {
//        formdata = new FormData();
//        formdata.append("NoticeId", EncodeText(noticeid))
//        $.ajax({
//            type: "POST",
//            url: "/api/NoticeNew/RemoveReminder",
//            data: formdata,
//            contentType: false,
//            processData: false,
//            success: function (result) {
//                if (result) {
//                    alert("Record deleted successfully.");
//                    isRenderPage = false;
//                    callapi(1);
//                }
//                else {
//                    alert("Something went wrong.")
//                }
//            }
//        })
//    }
//}


$('#Delete_final').off('click').on('click', function () {

    var noticeid = $(this).data('noticeid');

    formdata = new FormData();
    formdata.append("NoticeId", EncodeText(noticeid))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/RemoveReminder",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (result) {
            $('#myModalDeleteconfirmation').modal('hide');

            if (result) {
                alert("Record deleted successfully.");
                isRenderPage = false;
                callapi(1);
            }
            else {
                alert("Something went wrong.")
            }
        }
    })
});
var setPageNo = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    //if (page) changePage(page);
    isRenderPage = false;
    $("#txtgopage").val("");
    pageindex = setPageNo;
    callapi(pageindex);
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
    callapi(pageindex);
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
    callapi(pageindex);

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
    callapi(pageindex);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
///*Get reminder notice by page number*/
//$(document).on('click', '#pgetdatabypagenum', function () {
//    pageindex = $("#ppagnumvalue").val();
//    if (pageindex != "undefined") {
//        if (Math.sign(pageindex) == 1) {
//            var ppageindesx = $("#psotopage").text();
//            if (pageindex <= parseInt(ppageindesx)) {
//                loadflag = true;
//                callapi(pageindex);
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
//    callapi(pageindex);
//});
$('div .dropdown-menu').on('click', function (event) {
    event.stopPropagation();
});
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    callapi(1);
    sessionStorage.removeItem("NoticeId");
};
var sortvalue = "Show";
$(document).on('click', '#sortoutbox', function () {
    sortvalue = $(this).attr("sortvalue");
    if (sortvalue == "") {
        $(this).attr("sortvalue", "desc");
        sortvalue = "desc";
    }
    if (sortvalue == "asc") {
        $(this).attr("sortvalue", "desc");
    }
    else {
        $(this).attr("sortvalue", "asc");
    }
    callapi(1);
});

/*Get reminder list*/
var callapi = function (pageindex) {
    openload();
    var html = '';
    var notistatus = $('input[name=statustype]:checked').val();
    SearchValue = "";
    var Noticetitlesrch = $("#Noticetitsrch").val();
    var NoticesendersName = $("#NoticeeendersNametxt").val();
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(SearchValue));
    formData.append("ColumName", EncodeText(ColumName));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(pageindex));
    formData.append("PageSize", EncodeText(10));
    formData.append("sendername", EncodeText(""));
    formData.append("addressedto", EncodeText(""));
    formData.append("noticethrough", EncodeText(""));
    formData.append("Noticetitlesrch", EncodeText(Noticetitlesrch));
    formData.append("NoticesendersName", EncodeText(NoticesendersName));
    if (sortvalue == null) {
        sortvalue = "";
    }
    formData.append("sortvalue", sortvalue);
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ReminderNoticeList",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            closeload();
            $("#tablevalue").html("");
            $("#noticetbldashboardfooter").html("");
            $("#nonotice").html("");
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            var rowIndex = 0;
            if (response == "") {
                document.querySelector(".pagination").style.display = "none";
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                $("#nonotice").append('<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No  list found</h4>' +
                    '<p>We found no  list.</p>' +
                    '</div>');
                return false;
           
            }
            else {
                if (1 == 1) {
                    document.querySelector(".pagination").style.display = "flex";
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                    $.each(response, function (i, a) {
                        var amountclaimed = a.AmountClaimed == "0" || a.AmountClaimed == null ? "" : a.AmountClaimed;
                        rowIndex = rowIndex + 1;
                        if (i === 0) {
                            firstvalue = a.RowId;
                        }
                        var totdata = a.TotalRows;
                        //For Total Grid Count
                        $("#RemNoticeCount").text("(" + totdata + ")");

                        if (i === (response.length - 1)) {

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
                        span.innerHTML = a.CreateNotice;
                        var trval = "";
                        if ((dateFormat(new Date()) == dateFormat(new Date(a.DateofNotice)))) {
                            trval = "<tr class=" + a.NoticeID + " id=reminderhighlighcls>";
                        }
                        else {
                            trval = "<tr class=" + a.NoticeID + ">";
                        }
                        html += trval;
                        html += "<td>" + a.RowId + "</td>";
                        html += "<td  class='noticedate'>" + (a.DueDateOfNotice == "1900-01-01T00:00:00" || a.DueDateOfNotice == null ? '' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                        html += "<td  class='noticetitle'><span id='notieceredirect' style='cursor: pointer; color:#069;' module='" + a.TypeofNotice + "' data-val='" + a.NoticeID + "'>" + a.NoticeTitle + "</span></td>";
                        var NoticeTypeDetail = "";
                        if (a.TypeofNotice == "Notice") {
                            NoticeTypeDetail = "Sent";
                        }
                        else {
                            NoticeTypeDetail = "Received";
                        }

                        const priorityKey = (NoticeTypeDetail || "").toLowerCase();
                        if (priorityClassMap[priorityKey]) {
                            html += `<td class="noticeType"><div class="status_badge"><span class="${priorityClassMap[priorityKey]}"></span>${NoticeTypeDetail || ""}</div></td>`;
                        }
                        else {
                            html += "<td  class='noticeType'>" + (NoticeTypeDetail == 0 ? '' : NoticeTypeDetail) + "</td>";
                        }

                        //html += "<td class='noticeType'>" + NoticeTypeDetail + "</td>";
                        html += "<td class='noticeto'>" + (a.AddressedTo == null ? '' : a.AddressedTo) + "</td>";
                        html += "<td class='noticeby'>" + a.SendersName + "</td>";
                        html += "<td class='customDueDate'>" + (a.CustomDate == "1900-01-01T00:00:00" || a.CustomDate == null ? '' : dateFormat(new Date(a.CustomDate))) + "</td>";
                        html += "<td class='reminderDate'>" + (a.ReminderDate == "1900-01-01T00:00:00" || a.ReminderDate == null ? '' : dateFormat(new Date(a.ReminderDate))) + "</td>";
                        html += "<td  class='remark'>" + '<a href="#" onclick=viewcontent("' + a.ReminderNoticeId + '","SetAlert") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                        html += '<td><a style="cursor:pointer;" onclick=ConfirmDeleteReminder("' + a.ReminderNoticeId + '") title = "Delete Reminder" ><img src="/newassets/img/deletecasesingle-icon.png" /></a><a href="#" onclick=fnsetnotificationalert("' + a.NoticeID + '","' + a.TypeofNotice + '") title="Setting for alert"><img src="/newassets/img/bell-icon.png" /></a></td>';
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
function fnGoOnMainPage(noticeid, typeofnotice) {
}
/*Reminder Notice redirect to received notice details*/
$(document).on("click", "#notieceredirect", function () {
    var fcode = localStorage.getItem("FirmCode");
    var Modules = $(this).attr("module");
    var ValID = $(this).attr("data-val");
    if (Modules == "ReceivedNotice") {
        var urls = "/" + fcode + "/NoticeReceived/ReceivedNoticeList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "NoitceId": ValID }
        });
    }
    else if (Modules == "Notice") {
        var urls = "/" + fcode + "/NoticeNew/NewNoticeList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "NoitceId": ValID }
        });
    }
    else if (Modules == "BulkNotice") {
        var urls = "/" + fcode + "/NoticeTemplate/BulkNoticeList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "NoitceId": ValID }
        });
    }
});

/*Confirm delete reminder by notice id*/

function ConfirmDeleteReminder(noticeid) {
   
    // Store the notice ID in a data attribute on the confirm button
    $('#Delete_final').data('noticeid', noticeid);

    // Optionally set the matter name in the modal
    //$('#id_Deletematternames').text(title); // Replace or format as needed

    // Show the modal
    $('#myModalDeleteconfirmation').modal('show');
}


function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}

/*View file logs*/
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
$("#searchNoticetit").click(function () {
    var casefiltercasename = $("#Noticetitsrch").val();
    if (casefiltercasename == "") {
        alert("enter notice subject");
        $("#Noticetitsrch").focus();
        return false;
    }
    $("#clearnewsearchNoticetit").css("display", "unset")
    isRenderPage = false;
    callapi(pageindex);
});
$("#clearnewsearchNoticetit").click(function () {
    $("#Noticetitsrch").val("");
    $("#clearnewsearchNoticetit").css("display", "none");
    isRenderPage = false;
    callapi(pageindex);
})
//Add serch on colomn
$("#clearnewsearchSendname").click(function () {
    $("#NoticeeendersNametxt").val("");
    $("#clearnewsearchSendname").css("display", "none");
    isRenderPage = false;
    callapi(pageindex);
})
$("#searchNoticeSendname").click(function () {
    var casefiltercasename = $("#NoticeeendersNametxt").val();
    if (casefiltercasename == "") {
        alert("enter sender name");
        $("#NoticeeendersNametxt").focus();
        return false;
    }
    $("#clearnewsearchSendname").css("display", "unset")
    isRenderPage = false;
    callapi(pageindex);
});
/*Format date to IST date*/
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
function viewcontent(noticeid, param) {
    $("#ViewMoreModal").modal('show');
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('param', EncodeText(param));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewMoreSetAlert",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#viewmorecontent").html("");;
            $("#viewmorecontent").html(data.Data.message)
        },
    })
}

/*Add postal details*/
$(document).on("click", "#btn_addpostaldetails", function () {
    if (dynamicFieldCount == 0) {
        dynamicFieldCount = 1;
    }
    else {
        dynamicFieldCount = dynamicFieldCount + 1;
    }
    var cDate = new Date().toLocaleDateString('en-CA');
    if (dynamicFieldCount < 5) {
        var data = "";
        data += "<fieldset class='ec_bgAlert col-md-11'>";
        data += "<div class='row'>";
        data += "<div class='col-md-4'>";
        data += "<label>Custom Date</label><span style='color: red'>*</span><br />";
        data += "<input type='date' class='inputFormat setValue' min='" + cDate + "'  id='txtdateofnotice_" + dynamicFieldCount + "' onchange='ResetField()' />";
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label >Alert Condition</label><span style='color: red'>*</span>";
        data += "<select class='dropdown - toggle inputFormat setValue' onChange='ResetByAlert()' id='txtalertcondition_" + dynamicFieldCount + "' style='background:white'>";
        data += "<option value='beforeduedate'>Before</option>";
        data += "<option value='afterreceivedate'>After</option>";
        data += "</select>";
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<label>Set Days</label><span style='color: red'>*</span>";
        data += "<select class='dropdown-toggle inputFormat setValue' id='alertbeforeincaseallddl1_" + dynamicFieldCount + "' onchange='fndisplayreminder()' style='background:white'>"
        data += "<option value=''>Please select days</option>"
        data += "<option value='1'>1</option>"
        data += "<option value='2'>2</option>"
        data += "<option value='3'>3</option>"
        data += "<option value='4'>4</option>"
        data += "<option value='5'>5</option>"
        data += "<option value='6'>6</option>"
        data += "<option value='7'>7</option>"
        data += "<option value='8'>8</option>"
        data += "<option value='9'>9</option>"
        data += "<option value='10'>10</option>"
        data += "</select>";
        data += "</div>"
        data += "<div class='col-md-4'>"
        data += "<label>Reminder Date </label><br />"
        data += "<div id='multiplereminderdiv_" + dynamicFieldCount + "' class='inputFormat setValue' style='background:#fff; overflow: hidden; height: 35px!important;'></div>"
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Remarks</label>";
        data += "<textarea id='txtRemark_" + dynamicFieldCount + "' class='inputFormat setValue' style='width: 100 %; height: 45px!important;'></textarea>"
        data += "</div>";
        data += "<div class='col-md-4'>";
        if (checkData == true) {
            data += "<div onclick='delete_div($(this))' class='delete_div pull-right'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;' title='Delete'></span>"
        }
        data += "</div>";
        data += "</div>";
        data += " </fieldset>";
        data += " <div class='col-md-1' style='margin-top:7rem'>";
        data += " <button class='delete-btn' style='border:0;background:none;'>";
        data += "<img src='/newassets/img/deletecasesingle-icon.png'>";
        data += " </button>";
        data += " </div>";
        $('#dvadd_noticepostdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(dynamicFieldCount);
    }
    else {
        dynamicFieldCount = dynamicFieldCount - 1;
        alert("You Can't add more than 5 alert");
    }
});

/*Add reminder notice dynamic control*/
function AddMoreControl(dynamicFieldCount) {
    for (var tcount = 1; tcount < dynamicFieldCount; tcount++) {
        if (tcount == dynamicFieldCount) {
            dynamicFieldCount = tcount;
        }
        var data = "";
        data += "<fieldset class='ec_bgAlert col-md-11'>";
        data += "<div class='row'>";
        data += "<div class='col-md-4'>";
        data += "<label>Custom Date</label><span class='required' aria-required='true'>*</span><br />";
        data += "<input type='date' min='" + currentDate + "' class='inputFormat' id='txtdateofnotice_" + tcount + "' onchange='ResetField()' />";
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Alert Condition</label><span class='required' aria-required='true'>*</span>";
        data += "<select class='dropdown - toggle inputFormat' id='txtalertcondition_" + tcount + "' style='background:white'>";
        data += "<option value='beforeduedate'>Before</option>";
        data += "<option value='afterreceivedate'>After</option>";
        data += "</select>";
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<label>Set Days</label><span class='required' aria-required='true'>*</span>";
        data += "<select class='dropdown-toggle inputFormat' id='alertbeforeincaseallddl1_" + tcount + "' onchange='fndisplayreminder()' style='background:white'>"
        data += "<option value='1'>1</option>"
        data += "<option value='2'>2</option>"
        data += "<option value='3'>3</option>"
        data += "<option value='4'>4</option>"
        data += "<option value='5'>5</option>"
        data += "<option value='6'>6</option>"
        data += "<option value='7'>7</option>"
        data += "<option value='8'>8</option>"
        data += "<option value='9'>9</option>"
        data += "<option value='10'>10</option>"
        data += "</select>";
        data += "</div>"
        data += "<div class='col-md-4'>"
        data += "<label>Reminder Date</label><br />"
        data += "<div id='multiplereminderdiv_" + tcount + "' class='inputFormat' style='background:#fff; overflow: hidden; height: 35px!important;'></div>"
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Remarks</label>";
        data += "<textarea id='txtRemark_" + tcount + "' class='inputFormat' style='width: 100 %; height: 45px!important;'></textarea>"
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<div onclick='delete_div($(this))' class='delete_div pull-right'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;' title='Delete'></span>"
        data += "</div>";
        data += "</div>";
        data += " </fieldset>";
        data += " <div class='col-md-1' style='margin-top:7rem'>";
        data += " <button class='delete-btn' style='border:0;background:none;'>";
        data += "<img src='/newassets/img/deletecasesingle-icon.png'>";
        data += " </button>";
        data += " </div>";
        $('#dvadd_noticepostdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(tcount);
    }
}
/*Start set reminder code*/
function fnsetnotificationalert(idsss, typeofnotices) {
    $('#multiplereminderdiv').html("");
    $('#txtdateofnotice').val('');
    $('#txtRemark').val('');
    $('#dvadd_noticepostdetils').html("");
    $("#alertbeforeincaseallddl option:selected").removeAttr("selected");
    $('#alertbeforeincaseallddl1').val('');
    $('.select2-selection__rendered').empty();
    reminderDateArr = [];
    dynamicFieldCount = 0;
    $('#dvadd_noticepostdetils').html("");
    $('#txtdateofnotice_0').val('');
    $("#multiplereminderdiv_0").html("");
    $("#txtRemark_0").val("");
    $("#myModalNotificationsetting ").modal('show');
    fnnotificationalerttype(idsss, typeofnotices);
}
/*Get notification alert type details*/
function fnnotificationalerttype(NoticeIdss, typeofnotices) {
    var selecteddlval = "individual";//$("#ddlnotificationalerttype").val();
    if (selecteddlval == "individual") {
        $("#divnoticelist").show();
        GetNoticeListForDdl(NoticeIdss, typeofnotices);
        fillAlertNotification(NoticeIdss, typeofnotices);
        $("#alertbeforeincaseindividual").css('display', 'block');
    }
    else {
        $("#divnoticelist").hide();
        $("#alertbeforeincaseindividual").css('display', 'none');
    }
}
var prevReminderDate = "";
var checkData = false;
var currentDate = new Date().toLocaleDateString('en-CA');
function fillAlertNotification(NoticeId, typeofnotices) {
    $('#dvadd_noticepostdetils').html('');
    if (NoticeId != "") {
        var formData = new FormData();
        formData.append("NoticeId", EncodeText(NoticeId));
        formData.append("TypeofNotices", EncodeText(typeofnotices));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/GetSetAlertDetails',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                var count = 0;
                var data = "";
                var setCustomDate = "";
                var setAlertBA = "";
                var setDays = "";
                var setReminderSetDate = "";
                var setRemark = "";
                $("#txtdateofnotice_0").attr("min", currentDate);
                if (response.Data.length == 0) {
                    checkData = true;
                }
                else {
                    checkData = false;
                }
                if (count == 0) {
                    setCustomDate = response.Data[0].CustomDate.split("T");
                    setCustomDate = setCustomDate[0];
                    setAlertBA = response.Data[0].AlertCondition;
                    if (response.Data[0].SetDays == null) {
                        setDays = 1;
                    }
                    else {
                        setDays = response.Data[0].SetDays;
                    }
                    setReminderSetDate = response.Data[0].ReminderDate.split("T");;
                    setReminderSetDate = setReminderSetDate[0];
                    setRemark = response.Data[0].Remarks;
                    $('#txtdateofnotice_0').val(setCustomDate);
                    $('#txtalertcondition_0').val(setAlertBA);
                    $('#alertbeforeincaseallddl1_0').val(setDays);
                    $("#multiplereminderdiv_0").append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(setReminderSetDate));
                    $('#txtRemark_0').val(setRemark);
                    prevReminderDate = $("#multiplereminderdiv_0").html().substr(52, 11);
                    if ($.isEmptyObject(reminderDateArr)) {
                        reminderDateArr.push(formatDatetoIST(prevReminderDate));
                    }
                    else {
                        if ($.inArray(formatDatetoIST(prevReminderDate), reminderDateArr) != -1) {
                            alert("A reminder is already set for this date, please set another date for the reminder");
                            return false;
                        }
                        else {
                            reminderDateArr.push(formatDatetoIST(prevReminderDate));
                        }
                    }
                }
                if (response.Data.length > 0) {
                    for (var i = 1; i < response.Data.length; i++) {
                        data = "";
                        setCustomDate = "";
                        setAlertBA = "";
                        setDays = "";
                        setReminderSetDate = "";
                        setRemark = "";
                        count = i;
                        setCustomDate = response.Data[i].CustomDate.split("T");
                        setCustomDate = setCustomDate[0];
                        setAlertBA = response.Data[i].AlertCondition;
                        if (response.Data[i].SetDays == null) {
                            setDays = 1;
                        }
                        else {
                            setDays = response.Data[i].SetDays;
                        }
                        setReminderSetDate = response.Data[i].ReminderDate.split("T");;
                        setReminderSetDate = setReminderSetDate[0];
                        setRemark = response.Data[i].Remarks;
                        data += "<fieldset class='ec_bgAlert col-md-11'>";
                        data += "<div class='row'>";
                        data += "<div class='form-group col-md-4'>";
                        data += "<label>Custom Date</label> <span class='required' aria-required='true'>*</span> <br />";
                        data += "<input type='date' class='inputFormat setValue' min='" + currentDate + "' value='" + setCustomDate + "' id='txtdateofnotice_" + count + "' onchange='ResetField()' />";
                        data += "</div>"
                        data += "<div class='form-group col-md-4'>";
                        data += "<label>Alert Condition</label><span class='required' aria-required='true'>*</span>";
                        data += "<select class='dropdown - toggle inputFormat setValue' onChange='ResetByAlert()' value='" + setAlertBA + "' id='txtalertcondition_" + count + "' style='background:white'>";
                        data += "<option value='beforeduedate'>Before</option>";
                        data += "<option value='afterreceivedate'>After</option>";
                        data += "</select>";
                        data += "</div>";
                        data += "<div class='form-group col-md-4'>";
                        data += "<label>Set Days</label><span class='required' aria-required='true'>*</span>";
                        data += "<select class='dropdown-toggle inputFormat setValue' id='alertbeforeincaseallddl1_" + count + "' onchange='fndisplayreminder()' style='background:white' value='" + setDays + "'>"
                        data += "<option value=''>Please select days</option>"
                        data += "<option value='1'>1</option>"
                        data += "<option value='2'>2</option>"
                        data += "<option value='3'>3</option>"
                        data += "<option value='4'>4</option>"
                        data += "<option value='5'>5</option>"
                        data += "<option value='6'>6</option>"
                        data += "<option value='7'>7</option>"
                        data += "<option value='8'>8</option>"
                        data += "<option value='9'>9</option>"
                        data += "<option value='10'>10</option>"
                        data += "</select>";
                        data += "</div>"
                        data += "<div class='form-group col-md-4'>"
                        data += "<label>Reminder Date</label>"
                        data += "<div id='multiplereminderdiv_" + count + "' class='inputFormat setValue' style='background: #fff; overflow: hidden; height: 35px!important;'></div>"
                        data += "</div>"
                        data += "<div class='form-group col-md-8'>";
                        data += "<label>Remarks</label>";
                        data += "<textarea id='txtRemark_" + count + "'  class='inputFormat setValue' style='width:100%; height:35px!important; border-radius: 7px;'>" + setRemark + "</textarea>"
                        data += "</div>";
                        data += " </fieldset>";
                        data += " <div class='col-md-1' style='margin-top:7rem'>";
                        data += " <button class='delete-btn' style='border:0;background:none;'>";
                        data += "<img src='/newassets/img/deletecasesingle-icon.png'>";
                        data += " </button>";
                        data += " </div>";
                        $('#dvadd_noticepostdetils').append(data);
                        $("#multiplereminderdiv_" + count).append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(setReminderSetDate))
                        $('#alertbeforeincaseallddl1_' + count).val(setDays);
                        $('#txtalertcondition_' + count).val(setAlertBA);
                        prevReminderDate = $("#multiplereminderdiv_" + count).html().substr(52, 11);
                        if ($.isEmptyObject(reminderDateArr)) {
                            reminderDateArr.push(formatDatetoIST(prevReminderDate));
                        }
                        else {
                            if ($.inArray(formatDatetoIST(prevReminderDate), reminderDateArr) != -1) {
                                /*alert("You have already choose Please change date or days to set reminder");*/
                                alert("A reminder is already set for this date, please set another date for the reminder");
                                return false;
                            }
                            else {
                                reminderDateArr.push(formatDatetoIST(prevReminderDate));
                            }
                        }
                        $("#rowcounterdata").val('');
                    }
                }
                dynamicFieldCount = count;
            }
        });
    }
}
//function when click on delete  Button start
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
        // Check if the clicked element or one of its parents has the class 'delete-btn'
        const deleteBtn = e.target.closest(".delete-btn");
        if (deleteBtn) {
            e.preventDefault();

            const deleteContainer = deleteBtn.closest(".col-md-1"); // current div
            const fieldset = deleteContainer?.previousElementSibling; // get previous sibling (fieldset)

            if (fieldset && fieldset.classList.contains("ec_bgAlert")) {
                fieldset.remove(); // remove the fieldset
            }

            deleteContainer?.remove(); // remove the delete button container
        }
    });
});
//function when click on delete  Button end

/*Get notice list for dropdown*/
function GetNoticeListForDdl(NoticeIdss, typeofnotices) {
    var formdata = new FormData();
    formdata.append("typeofnotices", EncodeText(typeofnotices));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeListForReminderddl",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            $("#ddlnoticelist").html("");
            if (response != null) {
                $.each(response, function (key, value) {
                    if (value.NoticeId == NoticeIdss) {
                        if (typeofnotices == 'Notice') {
                            var textval = "Receiver's Name - " + value.AddressedTo + ", Title - " + value.Title;
                        }
                        else {
                            var textval = "Sender's Name - " + value.AddressedTo + ", Title - " + value.Title;
                        }
                        $("#ddlnoticelist").append($("<option data-id=" + value.DateofNotice + "></option>").val(value.NoticeId).text(textval));
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
/*Get date for alert by notice id*/
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
                $("#txtreceiveddate").html(formatDatetoIST(response.ReceivedDate));
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
var reminderDateArr = [];
function fndisplayreminder() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    var duedate = $("#txtdateofnotice_" + afterSplit).val();
    var prevDate = $("#multiplereminderdiv_" + afterSplit).html().substr(52, 11);
    prevDate = prevDate.replace('<', '').trim();
    if (prevDate != null && prevDate != "") {
        reminderDateArr.map(function (obj, index) {
            if (obj == prevDate) {
                reminderDateArr.splice($.inArray(prevDate, reminderDateArr), 1);
            }
        });
    }
    $("#multiplereminderdiv_" + afterSplit).html("");
    if (duedate == "") {
        alert("Please select custom date");
        return false;
    }
    var txtalrtcondition = $("#txtalertcondition_" + afterSplit).val();
    var alertbeforeincaseallddl = $("#alertbeforeincaseallddl1_" + afterSplit).val();
    if (alertbeforeincaseallddl != null) {
        var day = alertbeforeincaseallddl;//$('alertbeforeincaseallddl').val();
        if (txtalrtcondition == "beforeduedate") {
            var date = new Date(duedate);
            if (day == "") {
                alert('Please select days');
                $("#multiplereminderdiv_" + afterSplit).html("");
                return false;
            }
            var reminderdate = date.setDate(date.getDate() - day);
            reminderdate = new Date(reminderdate);
            var fit_end_time = new Date();
            if (new Date(reminderdate) < new Date(fit_end_time)) {
                alert("Reminder date should not be less then current date")
                return false;
            }
            if ($.isEmptyObject(reminderDateArr)) {
                reminderDateArr.push(formatDatetoIST(reminderdate));
            }
            else {
                if ($.inArray(formatDatetoIST(reminderdate), reminderDateArr) != -1) {
                    alert("A reminder is already set for this date, please set another date for the reminder");
                    return false;
                }
                else {
                    reminderDateArr.push(formatDatetoIST(reminderdate));
                }
            }
            $("#multiplereminderdiv_" + afterSplit).append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(reminderdate) + '<br/>')
        }
        else if (txtalrtcondition == "afterreceivedate") {
            var date = new Date(duedate);
            if (day == "") {
                alert('Please select days');
                $("#multiplereminderdiv_" + afterSplit).html("");
                return false;
            }
            var time = parseInt(day) * 24 * 60 * 60 * 1000
            var reminderdate = (date.getTime() + time);
            reminderdate = new Date(reminderdate);
            var fit_end_time = new Date();
            if (new Date(reminderdate) < new Date(fit_end_time)) {
                alert("Reminder date should not be less then current date")
                return false;
            }
            if ($.isEmptyObject(reminderDateArr)) {
                reminderDateArr.push(formatDatetoIST(reminderdate));
            }
            else {
                if ($.inArray(formatDatetoIST(reminderdate), reminderDateArr) != -1) {
                    alert("A reminder is already set for this date, please set another date for the reminder");
                    return false;
                }
                else {
                    reminderDateArr.push(formatDatetoIST(reminderdate));
                }
            }
            $("#multiplereminderdiv_" + afterSplit).append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(reminderdate) + '<br/>')
        }
    }
}

/*Reset field*/
function ResetField() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    $('#alertbeforeincaseallddl1_' + afterSplit).val('');
    $('#txtalertcondition_' + afterSplit).val('beforeduedate');
}
/*Reset by alert*/
function ResetByAlert() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    $('#alertbeforeincaseallddl1_' + afterSplit).val('');
}
$("#savenotificationsettings").click(function () {
    var finalData = [];
    var setId = 0;
    if (dynamicFieldCount == 0) {
        var customDate = $("#txtdateofnotice_" + setId).val();
        var alertBA = $("#txtalertcondition_" + setId).val();
        var setDays = $("#alertbeforeincaseallddl1_" + setId).val();
        if (alertBA == "beforeduedate") {
            var date = new Date(customDate);
            reminderdate = date.setDate(date.getDate() - setDays);
            reminderdate = new Date(reminderdate);
        } else {
            var date = new Date(customDate);
            reminderdate = date.setDate(date.getDate() + parseInt(setDays));
            reminderdate = new Date(reminderdate);
        }
        var remark = $("#txtRemark_" + setId).val();
        if (customDate == "") {
            alert("Please select the custom date");
            return false;
        }
        if (setDays == "" || setDays == "Please select days") {
            alert("Please select the days");
            return false;
        }
        if (reminderdate == "") {
            alert("Please set reminder date");
            return false;
        }
        var reminderMsg = $('#multiplereminderdiv_' + setId).html();
        if (reminderMsg == '') {
            alert("Please set reminder date");
            return false;
        }
        finalData.push({
            customDate: customDate,
            alertBA: alertBA,
            setDays: setDays,
            reminderDate: reminderdate,
            remark: remark
        });
    }
    else {
        for (var i = 0; i <= dynamicFieldCount; i++) {
            setId = i;
            var customDate = $("#txtdateofnotice_" + setId).val();
            var alertBA = $("#txtalertcondition_" + setId).val();
            var setDays = $("#alertbeforeincaseallddl1_" + setId).val();
            if (alertBA == "beforeduedate") {
                var dateD = new Date(customDate);
                reminderdate = dateD.setDate(dateD.getDate() - setDays);
                reminderdate = new Date(reminderdate);
            } else {
                var dateD = new Date(customDate);
                reminderdate = dateD.setDate(dateD.getDate() + parseInt(setDays));
                reminderdate = new Date(reminderdate);
            }
            var remark = $("#txtRemark_" + setId).val();
            if (customDate == "") {
                alert("Please select the custom date");
                return false;
            }
            if (setDays == "" || setDays == "Please select days") {
                alert("Please select the days");
                return false;
            }
            if (reminderdate == "") {
                alert("Please set reminder date");
                return false;
            }
            var reminderMsg = $('#multiplereminderdiv_' + setId).html();
            if (reminderMsg == '') {
                alert("Please set reminder date");
                return false;
            }
            finalData.push({
                customDate: customDate,
                alertBA: alertBA,
                setDays: setDays,
                reminderDate: reminderdate,
                remark: remark
            });
        }
    }
    var notificationfor = "individual";
    var txtnoticeids = $("#ddlnoticelist").val();
    var alertData = JSON.stringify(finalData);
    if (notificationfor == "individual") {
        if (txtnoticeids == "") {
            alert("Please select notice for set alert.");
            return false;
        }
    }
    openload();
    var formdata = new FormData();
    formdata.append("notificationfor", EncodeText(notificationfor));
    formdata.append("txtnoticeids", EncodeText(txtnoticeids));
    formdata.append("alertData", EncodeText(alertData));
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
                $("#multiplereminderdiv").html("");
                $("#txtduedate").html("");
                $("#txtreceiveddate").html("");
                alert("Record saved successfully.")
                $("#myModalNotificationsetting").modal('hide');
                isRenderPage = false;
                callapi(1);
                closeload();
            }
        },
        failure: function (response) {
            closeload();
        },
        error: function (response) {
            closeload();
        }
    });
})
/*Delete div*/
var countdata = 0;
function delete_div(data) {
    if (confirm("Without saving fill data will be loss.")) {
        countdata = countdata - 1;
        $('#dvadd_noticepostdetils').html("");
        $('#txtdateofnotice_0').val('');
        $("#multiplereminderdiv_0").html("");
        $("#txtRemark_0").val("");
        dynamicFieldCount = dynamicFieldCount - 1;
        $("#rowcounterdata").val('');
        reminderDateArr = [];
        $("#rowcounterdata").val(dynamicFieldCount);
        data.parents('fieldset').remove();
        AddMoreControl(dynamicFieldCount);
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



/*End set reminder code*/