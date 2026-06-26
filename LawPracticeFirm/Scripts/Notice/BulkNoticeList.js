var current_page = 1;
var records_per_page = 10;
var PageNumber = 0;
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var maintemplateId = sessionStorage.getItem("maintemplateid");
var ocreate, oedit, odelete = "";
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var noticeIddod = "";
var totpage = 0;
function fnfillDateOfDelivery(noticeid) {
    noticeIddod = noticeid;
    $("#dateOfDeliveryModal").modal('show');
}
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    /*New case dashboard*/
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });

    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = true;
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
        isRenderPage = true;
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
        isRenderPage = true;
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
        PageNumber = setPageNo;
        if (PageNumber > totpage) {
            alert("Please enter the valid page number.")
            return;
        }
        isRenderPage = true;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    /*Update Date Of Delivery For Notice*/
    $("#btnsavedod").click(function () {
        var dateofdelivered = $("#dateofdelivered").val();
        if (dateofdelivered == "") {
            alert("Please enter date of delivered.")
            return false;
        }
        var formData = new FormData();
        formData.append("dateOfDelivery", EncodeText(dateofdelivered));
        formData.append("moduleType", EncodeText("BulkNotice"));
        formData.append("noticeId", EncodeText(noticeIddod));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/updateDateOfDeliveryForNotice',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                if (response.Data.status) {
                    alert("Status updated successfully.");
                    $('#dateOfDeliveryModal').modal('hide');
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
/*Ceate bulk notice for matter*/
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
/*Link to matter*/
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
                        isRenderPage = false;
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
});
window.onload = function () {
    isRenderPage = false;
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
};
function changePage(page) {
    isRenderPage = false;
    PageNumber = page;
    callapi();
}
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
function convertjsondate(dateval) {
    var date = dateval;
    var nowDate = new Date(parseInt(date.substr(6)));
    var result = "";
    result += nowDate.format("dd/mm/yyyy");
}
$(".notistatustype").click(function () {
    isRenderPage = false;
    callapi();
})
/*Zip file status*/
function fnZipfileStatus() {
    var formData = new FormData();
    formData.append("maintemplateid", EncodeText(maintemplateId));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/checkZipStatus",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            if (response.message == "" || response.message == "null" || response.message == null) {
                $("#spanIdDownloadLink").html('<button type="button" value="Send Multiple" class="button4" onclick="fnDownloadAllDraft()" title="Download all drafts as compressed folders">Compress Folders</button></span >');
                clearInterval(myVar);
            }
            else if (response.message == "Processing..,please wait it will take some time.......") {
                $("#spanIdDownloadLink").html(response.message + "|" + '<span  title="Undo action" style="cursor:pointer" onclick="fnDeleteZipFolder()">Undo</span>');
            }
            else {
                var path = response.message;
                $("#spanIdDownloadLink").html('<span id="zipDownloadId" data-val="' + path + '" title="Click to download zip folder" style="cursor:pointer">Click to download compressed folder</span> | <span  title="Delete compressed folder" style="cursor:pointer" onclick="fnDeleteZipFolder()">Delete compressed folder</span>');
            }
            closeload();
        },
        error: function (xhr) {
        }
    });
}

/*Delete zip folder from bulk notice*/
function fnDeleteZipFolder() {
    var formdata = new FormData();
    formdata.append('maintemplateId', EncodeText(maintemplateId));
    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/removeZipFolder",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            closeload();
            alert(data.message);
            fnZipfileStatus();
        },
        failure: function (data) {
            closeload();
            alert(data.message);
        },
        error: function (data) {
            closeload();
            alert(data.message);
        }
    })
}

/*Download zip folder*/
$(document).on('click', '#zipDownloadId', function () {
    var path = $(this).attr("data-val");
    var anchor = document.createElement('a');
    $('body').append(anchor);
    anchor.href = path;
    anchor.download = "Notice_Copy";
    anchor.target = "_blank";
    anchor.click();
});

/*Get bulk notice details*/
var callapi = function () {
    $("#bulknoticelistdiv").html("");
    openload();
    var html = '';
    var notistatus = $('input[name=statustype]:checked').val();
    SearchValue = document.getElementById("myInput").value;
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(SearchValue));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("maintemplateid", EncodeText(maintemplateId));
    formData.append("notistatus", EncodeText(notistatus));
    formData.append("NoticeId", EncodeText(NoticeId));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/BulkNoticeListByTemplateId",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            closeload();
            $("#bulknoticelistdiv").empty();
            $("#bulkNoticetablevalue").empty();

            if (response[1].length == 0) {
                $("#bulknoticelistdiv").empty();
                //document.querySelector(".pagination").style.display = "none";
                document.querySelector(".pagination").style.display = "none";

                $("#bulknoticelistdiv").append(
                    //'<img src="/newassets/img/not-found.png" alt="Not Found" >' +
                    '<h4 style="text-align:center;"><img src="/newassets/img/not-found.png" alt="Not Found" ></br>No  List Found</h4>'
                );
                $("#pagenatedArea").css("display", "none");
                $("#pageNumbers").html("");
                return false;
            }
            else {
                $("#pagenatedArea").css("display", "");
                document.querySelector(".pagination").style.display = "flex";

                var dynamictablhtml = "";

                dynamictablhtml += '<table id="example" class="table-panel">';
                dynamictablhtml += '<thead>';
                dynamictablhtml += '<tr>';
                dynamictablhtml += '<th style="min-width:50px;"><div class="thbg"><input type="checkbox" name="checkedAll" id="parentcheckboxid"></div></th>';

                for (var i = 0; i < response[0].length; i++) {
                    dynamictablhtml += '<th><div class="thbg">' + response[0][i] + '</div></th>';
                }

                dynamictablhtml += '<th><div class="thbg">Notice</div></th>';
                dynamictablhtml += '<th><div class="thbg">Receiver Email</div></th>';
                dynamictablhtml += '<th style="width:0%"><div class="thbg">Mail Status</div></th>';
                dynamictablhtml += '<th style="width:0%"><div class="thbg">Notice Sent Date</div></th>';
                dynamictablhtml += '<th style="width:0%"><div class="thbg">Date of Delivery</div></th>';
                dynamictablhtml += '<th style="width:0%"><div class="thbg">Consignment No.</div></th>';
                dynamictablhtml += '<th style="min-width:160px;"><div class="thbg">Action</div></th>';
                dynamictablhtml += '</tr>';
                dynamictablhtml += '</thead>';
                dynamictablhtml += '<tbody id="bulkNoticetablevalue"></tbody>';
                dynamictablhtml += '</table>';

                // Pagination panel
//                dynamictablhtml += `
//    <div class="table-panel">
//        <div class="row settingpanel">
           
//        </div>
//    </div>
//`;

                $("#bulknoticelistdiv").append(dynamictablhtml);

                $.each(response[1], function (i, a) {
      

                    resultset = a.MainTemplateId;
                    oedit = a.oedit;
                    const d = new Date(a.ConsignDate.toLocaleString());
                    odelete = a.odelete;
                    ocreate = a.ocreate;
                    var jsoncontentparse = JSON.parse(response[1][i].TemplateContentJson);
                    if (i === 0) {
                        firstvalue = a.RowId;
                    }
                    var totdata = a.TotalRows;

                    if (i === (response.length - 1)) {
                        totrecord = a.TotalRows;

                        totpage = parseInt(totdata) / parseInt(10);
                        if (parseInt(totdata) % parseInt(10) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (PageNumber == totpage) {
                            $('#next').hide();
                            $('#prev').css("display", "block");
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
                    for (var i = 0; i < jsoncontentparse.length; i++) {
                        html += "<tr class='tbltrcls " + a.Id + "'>"
                        html += "<td><input type='checkbox' name='checkAll' class='checkSingle' value='" + a.Id + "'> <span style='font-size:15px !important'>"
                        for (var k = 0; k < response[0].length; k++) {
                            var showfieldval = "";
                            var fieldval = jsoncontentparse[0]["" + response[0][k] + ""]
                            if (fieldval.indexOf("00:00:00") != -1) {
                                var splitval = fieldval.split(" ");
                                var splitval1 = splitval[0];
                                var splitval2 = splitval1.split("-")
                                showfieldval = splitval2[2] + "/" + splitval2[1] + "/" + splitval2[0]
                            }
                            else if (fieldval.indexOf("12:00:00 AM") != -1) {
                                var splitval = fieldval.split(" ");
                                var splitval1 = splitval[0];
                                var splitval2 = splitval1.split("/")
                                showfieldval = splitval2[1] + "/" + splitval2[0] + "/" + splitval2[2]
                            }
                            else {
                                showfieldval = jsoncontentparse[0]["" + response[0][k] + ""]
                            }
                            html += "<td>" + showfieldval + "</td>"
                        }
                    }
                    html += "<td style='cursor:pointer;text-align:center'><span title='Download Notice in doc' onclick=fnmakenoticedraft('" + a.Id + "','" + a.SelfTemplateId + "','" + encodeURIComponent(a.TemplateContentJson) + "','" + a.MainTemplateId + "','doc')><img src='/newassets/img/doc-icon.png' /></span>&nbsp;&nbsp;<span title='Download Notice in pdf' onclick=fnmakenoticedraft('" + a.Id + "','" + a.SelfTemplateId + "','" + encodeURIComponent(a.TemplateContentJson) + "','" + a.MainTemplateId + "','pdf')><img src='/newassets/img/pdf-icon.png' /></span></td>"
                    if (a.ReceiverEmail == "null" || a.ReceiverEmail == null) {
                        html += "<td>&nbsp;</td>";
                    }
                    else {
                        html += "<td>" + a.ReceiverEmail + "</td>";
                    }
                    if (a.MailSentStatus) {
                        var date = dateFormat(new Date(a.MaleSentTime))
                        html += "<td>Mail Sent<br/>(" + a.MaleSentTime + ")</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    html += "<td>" + a.DateOfDelivery + "</td>";
                    html += "<td>" + (a.NoticeSentToClientDate == null || a.NoticeSentToClientDate == "1900-01-01T00:00:00" ? ' ' : a.NoticeSentToClientDate) + "</td>"
                    html += "<td>" + a.ConsignmentNum + "</td>";
                    if (String(a.IsLinkToMatter) == "1") {
                        html += "<td><div style='color:#069;text-align:left;cursor:pointer;' data-val='" + a.NoticeID + "'  title='View Matter Dashboard' id='transferpage' href='javascript:void()' sno='" + a.MatterId + "'>Linked To Matter</div></td>";
                    }
                    else if (String(a.CaseStatus) == "Convert to case") {
                        html += "<td><div style='color:Red;text-align:left;cursor:pointer;' data-val='" + a.Id + "' IsLinkToMatter ='" + a.IsLinkToMatter + "' id='linkmatter' title='Convert to matter'>Convert To Matter</div></td>";
                    }
                    else if (String(a.CaseStatus) == "Settled") {
                        html += "<td><div style='color:green;text-align:left'>Settled</div></td>";
                    }
                    else {
                        if (roleid == "1") {
                            html += '<td>';
                            html += '<a onclick=fnMailSend("' + a.Id + '","' + a.ReceiverEmail + '") title="Send notice on mail" style="cursor:pointer"><img src="/newassets/img/mail-icon.png" /></a>';
                            html += '<a style="cursor: pointer; " onclick=fnfillDateOfDelivery("' + a.Id + '") title = "Fill Date Of Delivery" ><img src="/newassets/img/date-icon.png" /></a>';
                            if (a.TrackingId != "") {
                                html += '<a style="cursor:pointer;" onclick=fnfillNoticePostDetails("' + a.Id + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title = "Save Notice post details" ><img src="/newassets/img/save-icon.png" /></a><a style="cursor: pointer;" onclick=SearchPostDetails("' + a.TrackingId + '") title = "View Notice post details" ><img src="/newassets/img/view-icon.png" /></a>';
                            }
                            else {
                                html += '<a style="cursor:pointer;" onclick=fnfillNoticePostDetails("' + a.Id + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title = "Save Notice post details" ><img src="/newassets/img/save-icon.png" /></a>';
                            }
                            html += '</td>';
                        }
                        else if (roleid == "2") {
                        }
                    }
                    html += "</tr>"
                });
                $("#bulkNoticetablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
        },
        error: function (xhr) {
            alert(xhr.responseText);
            closeload();
        }
    });
};
var statusnotisId = ""
/*Change notice status*/
function ChangeStatus(noticeId) {
    statusnotisId = noticeId;
    $("#NoticeStatusModal").modal('show');
}
$("#statusnoticebtn").click(function () {
    var status = $("#notistatus").val();
    var feedback = $("#feedbacktext").val();
    if (feedback == "") {
        alert("Feedback can't be empty.");
        return false;
    }
    var noticeId = statusnotisId;
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
                $("#notistatus").val("");
                $("#feedbacktext").val("");
                $("#NoticeStatusModal").modal("hide");
                isRenderPage = false;
                callapi();
            }
            else {
                alert("Alert ! Something went wrong.");
                $("#NoticeStatusModal").modal("hide");
            }
        },
    })
})
var closurenoticeid = "";
function ClouserNotice(noticeid) {
    closurenoticeid = noticeid;
    $("#ActualclosurModal").modal('show');
    var formData = new FormData();
    formData.append("closurenoticeid", closurenoticeid);
}
$(document).on("click", "#noticerejoinderdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=RejoinderNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
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
    formData.append("frombulkupload", EncodeText("frombulkupload"));
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
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReplyToNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
/*Edit reply bulk notice*/
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
            $.each(response.Data, function (i, a) {
                $("#ReceivedReplyModal").modal('show');
                $('#txtreplyreciveddate').val((a.ReceivedDate.split("T"))[0]);
                $('#txtsetreplydate').val((a.Setdateofreply.split("T"))[0]);
                $("#txtreplyrecivedthrough").val(a.ReceivedThrogh);
                $("#hiddenreplynoticeid").val(a.Id);
                outnoticeidd = a.NoticeId;
            });
        },
        error: function (response) {
        }
    })
}

/*Edit confirm delete notice*/
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
/*Add create reply notice*/
function AddCreateReply(noticeid, mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice?Id=" + noticeid + "&Main=" + mainnoticeid + "&InitiatedBy=plaintiff";
}
var childtblclickcount1 = 0;
/*View notice details by parent notice id*/
function ViewMoreItem1(parentId) {
    if (childtblclickcount1 == 1) {
        $("#childtbltr1").remove();
        childtblclickcount1 = 0;
    }
    else {
        childtblclickcount1 = 1;
        $(`<tr id="childtbltr1"><td colspan="27"><div id="tblincmingnotice" class="table-panel table-responsive" style="padding:10px 0 0 0; overflow-x:auto;" data-example-id="hoverable-table">
         <table class= "table " id="table`+ parentId + `">
        <thead>
            <tr class="childtbltr1cls">
                            <th class="childtbltsssr1cls"><div class="thbg"></div></th>
                            <th class="receivedreplythrough childtbltsssr1cls"><div class="thbg">Received Reply Through</div></th>
                            <th class="receivedreplydate childtbltsssr1cls"><div class="thbg">Date of Reply Received</div></th>
                            <th class="childtbltsssr1cls"><div class="thbg">Reply to Notice Created On</div></th>
                            <th class="receivedattachment childtbltsssr1cls"><div class="thbg">Document's</div></th>
                             <th class="dateofreplycls childtbltsssr1cls"><div class="thbg">Date of Reply</div></th>
                            <th class="receivedreplyaction childtbltsssr1cls"><div class="thbg">Action</div></th>
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
                        $.each(response.Data, function (i, a) {
                            var trval = "";
                            if ((dateFormat(new Date()) == dateFormat(new Date(a.Setdateofreply)))) {
                                trval = "<tr class=" + a.Id + " id=reminderhighlighcls>";
                            }
                            else {
                                trval = "<tr class=" + a.Id + ">";
                            }
                            html += trval;
                            // html += "<tr class=" + a.Id + ">";
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
                            html += "<td>" + (a.Setdateofreply == null ? ' ' : dateFormat(new Date(a.Setdateofreply))) + "</td>";
                            html += '<td class="receivedreplyaction"><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=IncomingEditNotice("' + a.Id + '") title="Edit Received Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=IncomingConfirmDelete("' + a.Id + '") title = "Delete Received Notice" ></a> | <a class="fa fa-plus" style="cursor:pointer;" onclick=AddCreateReply("' + a.Id + '","' + a.NoticeId + '") title = "Create Reply To Notice" ></a></td>';
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
var childtblclickcount = 0;
function ViewMoreItem(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="27"><div id="tblpoitem" class="table-panel table-responsive" style="padding:10px 0 0 0; overflow-x:auto;" data-example-id="hoverable-table">
        <table class= "table" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr>
                        <th class="childnoticefrom" data-column="Rejoinder" data-order="desc"><div class="thbg">Rejoinder</div></th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc"><div class="thbg">Rejoinder Subject</div></th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc"><div class="thbg">Notice Title</div></th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc"><div class="thbg">Notice Type</div></th>
                        <th class="childnoticedate" data-column="DateofNotice" data-order="desc"><div class="thbg">Notice Date</div></th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc"><div class="thbg">Notice Status</div></th>
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc"><div class="thbg">Date of Delivery</div></th>
                        <th width="100px;" class="childservedon" data-column="DateofReceipt" data-order="desc"><div class="thbg">Date of Receipt</div></th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc"><div class="thbg">Remarks &#x25B2</div></th>
                        <th class="childmanagerapprove"><div class="thbg">Sent To Manager</div></th>
                        <th class="childclientapprove"><div class="thbg">Sent To Client</div></th>
                        <th class="childgenerationofalerts" data-column="GenerationofAlerts" data-order="desc"><div class="thbg">Generation of Alerts</div></th>
                        <th class="childdateofdispatchofnotice" data-column="DateofDispatchofNotice" data-order="desc"><div class="thbg">Date of Dispatch of Notice</div></th>
                        <th class="childdateofserviceofnotice" data-column="DateofServiceofNotice" data-order="desc"><div class="thbg">Date of Service of Notice</div></th>
                        <th class="childdateofreceivingreply" data-column="DateofReceivingReply" data-order="desc"><div class="thbg">Date of Receiving Reply</div></th>
                        <th class="childmodeofreceipt" data-column="ModeofReceipt" data-order="desc"><div class="thbg">Mode of Receipt</div></th>
                        <th class="childdateofrejoinder" data-column="DateofRejoinder" data-order="desc"><div class="thbg">Date of Rejoinder</div></th>
                        <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc"><div class="thbg">Mode of Delivery of Rejoinder</div></th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc"><div class="thbg">Rejoinder Addressed to</div></th>
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc"><div class="thbg">Addressee Address</div></th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc"><div class="thbg">Other Details of Addressee</div></th>
                        <th class="childnoticeandreplyreference" data-column="NoticeandReplyReference" data-order="desc"><div class="thbg">Notice and Reply Reference</div></th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc"><div class="thbg">Rejoinder Through</div></th>
                        <th class="childcurrentstatus" data-column="CurrentStatus" data-order="desc"><div class="thbg">Current Status</div></th>
                        <th class="childdateofcreatingrejoinder" data-column="DateofCreatingRejoinder" data-order="desc"><div class="thbg">Date of Creating Rejoinder</div></th>
                        <th class="childattachment">Attachment</th>
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
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticefrom" checked><a href="#">Rejoinder</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject" checked><a href="#">Rejoinder Subject</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle" checked><a href="#">Notice Title</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childstatutory" checked><a href="#">Notice Type</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticedate" checked><a href="#">Notice Date</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending" checked><a href="#">Notice Status</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdispatched"><a href="#">Date of Delivery </a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#">Remarks</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmanagerapprove" checked><a>Sent To Manager</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childclientapprove" checked><a>Sent To Client</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childservedon"><a href="#" class="dropdown-item">Date of Receipt</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childgenerationofalerts"><a href="#">Generation of Alerts</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofdispatchofnotice"><a href="#">Date of Dispatch of Notice</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofserviceofnotice"><a href="#">Date of Service of Notice</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofreceivingreply"><a href="#">Date of Receiving Reply</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofreceipt"><a href="#">Mode of Receipt</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofrejoinder"><a href="#">Date of Rejoinder</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofdeliveryofrejoinder"><a href="#">Mode of Delivery of Rejoinder</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderaddressedto"><a href="#" class="dropdown-item">Rejoinder Addressed to</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Addressee Address</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Addressee</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticeandreplyreference"><a href="#">Notice and Reply Reference</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderthrough"><a href="#">Rejoinder Through</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childcurrentstatus"><a href="#">Current Status</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofcreatingrejoinder"><a href="#">Date of Creating Rejoinder</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childattachment"><a>Attachments</a></li>
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
        formData.append("parentId", EncodeText(parentId));
        var html = '';
        $.ajax({
            type: "POST",
            // url: '/api/ReplyToNotice/ReplyToNoticeListByNoticeId',
            url: '/api/RejoinderNotice/RejoinderNoticeListbyNoticeId',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response1) {
                var response = JSON.parse(response1.Data);
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
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                                if (a.TotalRows <= response.length) {
                                }
                                else if (pageno == 1) {
                                }
                                else if (pageno == totpage) {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                }
                                else {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                }
                                if (pageno < totpage) {
                                    tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="margin-left:5px;"></a ></span ></li >'
                                }
                                tfot += '</ul>'
                                $("#listingTableReplyFooter").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateRejoinder;
                            html += "<tr>";
                            html += "<td  class='childnoticefrom'>" + a.Rejoinder + ' ' + '<i class="fa fa-arrow-right" title="Go for more..." onclick=fnViewmorereplytonotice("' + a.NoticeID + '")></i>' + "</td>";
                            html += "<td class='childnoticesubject'>" + a.RejoinderSubject + "</td>";
                            html += "<td class='childnoticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='childstatutory'>" + a.NoticeType + "</td>";
                            html += "<td class='childnoticedate'>" + (a.DateofNotice == null ? ' ' : dateFormat(new Date(a.DateofNotice))) + "</td>";
                            html += "<td class='childpending'>" + a.CaseStatus + "</td>";
                            html += "<td class='childdispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td class='childservedon'>" + (a.DateofReceipt == null ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>";
                            if (a.CreateRejoinder.length > 60) {
                                html += "<td  class='childremark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"> view more</a>' + "</td>";
                            }
                            else {
                                html += "<td  class='childremark'>" + span.innerText + "</td>";
                            }
                            if (a.ApproveByManager) {
                                html += "<td class='childmanagerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><a href='#' style='padding-left:30px;' onclick=fnviewlog('" + a.NoticeID + "','2') title='View more'>View Log</a></td>";
                            }
                            else {
                                html += "<td class='childmanagerapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                            }
                            if (a.ApproveByClient) {
                                html += "<td class='childmanagerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><a href='#' style='padding-left:30px;' onclick=fnviewlog('" + a.NoticeID + "','3') title='View more'>View Log</a></td>";
                            } else {
                                html += "<td class='childclientapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                            }
                            html += "<td class='childgenerationofalerts'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td class='childdateofdispatchofnotice'>" + (a.DateofDispatchofNotice == null ? ' ' : dateFormat(new Date(a.DateofDispatchofNotice))) + "</td>";
                            html += "<td class='childdateofserviceofnotice'>" + (a.DateofServiceofNotice == null ? ' ' : dateFormat(new Date(a.DateofServiceofNotice))) + "</td>";
                            html += "<td class='childdateofreceivingreply'>" + (a.DateofReceivingReply == null ? ' ' : dateFormat(new Date(a.DateofReceivingReply))) + "</td>";
                            html += "<td class='childmodeofreceipt'>" + a.ModeofReceipt + "</td>";
                            html += "<td class='childdateofrejoinder'>" + (a.DateofRejoinder == null ? ' ' : dateFormat(new Date(a.DateofRejoinder))) + "</td>";
                            html += "<td class='childmodeofdeliveryofrejoinder'>" + a.ModeofDeliveryofRejoinder + "</td>";
                            html += "<td class='childrejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                            html += "<td  class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childnoticeandreplyreference'>" + a.NoticeandReplyReference + "</td>";
                            html += "<td class='childrejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' ? '' : a.RejoinderThrough) + "</td>";
                            html += "<td class='childcurrentstatus'>" + (a.CurrentStatus == undefined ? '' : a.CurrentStatus) + "</td>";
                            html += "<td class='childdateofcreatingrejoinder'>" + (a.DateofCreatingRejoinder == null ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                            if (a.IsFileAvailable) {
                                html += '<td class="childattachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerejoinderdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="childattachment"></td>';
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

/*Remove reply notice*/
function fnViewmorereplytonotice(mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/RejoinderHome"
    sessionStorage.setItem("mainnoticeid", mainnoticeid);
}
var outnoticeidd = "";
/*Add reply notice*/
function AddInComingReply(outnoticeid) {
    outnoticeidd = outnoticeid;
    $("#ReceivedReplyModal").modal('show');
}
/*Save reply notice*/
$("#savereplytonotice").click(function () {
    var noticeid = outnoticeidd;
    var txtreplyreciveddate = $("#txtreplyreciveddate").val();
    var txtreplyrecivedthrough = $("#txtreplyrecivedthrough").val();
    var txtsetreplydate = $("#txtsetreplydate").val();
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
    if (txtreplyrecivedthrough == "") {
        alert("Please select reply received through.");
        return false;
    }
    if ($("#hiddenreplynoticeid").val() == "") {
        if (totalFiles == 0) {
            alert("Please choose file.");
            return false;
        }
    }
    if (txtsetreplydate == "") {
        alert("Please select reply date.");
        return false;
    }
    formData.append("noticeid", EncodeText(noticeid));
    formData.append("txtreplyreciveddate", EncodeText(txtreplyreciveddate));
    formData.append("txtreplyrecivedthrough", EncodeText(txtreplyrecivedthrough));
    formData.append("hiddenreplynoticeid", EncodeText($("#hiddenreplynoticeid").val()));
    formData.append("txtsetreplydate", EncodeText(txtsetreplydate));
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

/*Confirm delete notice*/
function ConfirmDelete(noticeid) {
    if (confirm("Are you sure you want to remove this entry.")) {
        var formdata = new FormData();
        formdata.append('noticeid', EncodeText(noticeid));
        $.ajax({
            type: "POST",
            url: "/NoticeTemplate/RemoveRecordFromExcelNotice",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                alert(response);
                changePage(pageindex);
            },
        })
    }
}
/*Snd notice for approval*/
var approvalnoticeid = "";
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    arrayforselectedrow.push(noticeid);
    $("#AssignModal").modal('show');
}
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*Download all draft notice*/
var myVar = setInterval(fnZipfileStatus, 1000);
function fnDownloadAllDraft() {
    openload();
    if (confirm("Are you sure you want to compress all draft notice,it will take some time.")) {
        
        //fnDownloadAllDraft1();
        //closeload();
        setTimeout(function () {
            fnDownloadAllDraft1();
            closeload();
        }, 2000);
    }
}
function fnDownloadAllDraft1() {
    var formdata = new FormData();
    formdata.append('MainTemplateId', EncodeText(resultset));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/downloadNoticesInBulk",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            var myVar = setInterval(fnZipfileStatus, 1000);
        },
        failure: function (data) {
            closeload();
            alert(data);
        },
        error: function (data) {
            closeload();
            alert(data);
        }
    })
}
var arrayforselectedrow = [];
$(document).on('click', '#parentcheckboxid', function (e) {
    if (this.checked) {
        $(".checkSingle").each(function () {
            this.checked = true;
        })
    } else {
        $(".checkSingle").each(function () {
            this.checked = false;
        })
    }
    arrayforselectedrow = [];
    $("tr.tbltrcls").each(function () {
        if ($(this).find('.checkSingle').is(':checked')) {
            var quantity1 = $(this).find('.checkSingle').val()
            arrayforselectedrow.push(quantity1);
        }
    });
});
$(document).on('click', '.checkSingle', function (e) {
    if ($(this).is(":checked")) {
        var isAllChecked = 0;
        $(".checkSingle").each(function () {
            if (!this.checked)
                isAllChecked = 1;
        })
        if (isAllChecked == 0) { $("#parentcheckboxid").prop("checked", true); }
    } else {
        $("#parentcheckboxid").prop("checked", false);
    }
    arrayforselectedrow = [];
    $("tr.tbltrcls").each(function () {
        if ($(this).find('.checkSingle').is(':checked')) {
            var quantity1 = $(this).find('.checkSingle').val()
            arrayforselectedrow.push(quantity1);
        }
    });
});
var selectedrowlength = "";
function assignmodal() {
    selectedrowlength = arrayforselectedrow.length;
    if (selectedrowlength < 1) {
        alert("Please select at least one row.");
        return false;
    }
    $("#AssignModal").modal('show');
}
$(".assignto").change(function () {
    Getmanagerlist();
})
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
        formData.append("multipleNoticeArray", arrayforselectedrow);
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
                arrayforselectedrow = [];
            }
        })
    }
})

/*View log file*/
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
            $("#modlbody").html('');
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

/*Make as draft notice*/
function fnmakenoticedraft(noticeid, selftemplateid, templatecontent, MainTemplateId, filetype) {
    var formData = new FormData();
    formData.append("noticeid", EncodeText(noticeid));
    formData.append("selftemplateid", EncodeText(selftemplateid));
    formData.append("templatecontent", JSON.stringify(JSON.parse(decodeURIComponent(templatecontent))[0]));
    formData.append("MainTemplateId", EncodeText(MainTemplateId));
    formData.append("Filextension", EncodeText(filetype));
    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/PrintNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data == "") {
                return false;
            }
            var path = "/DownloadFile.ashx?ftoken=" + data + "&module=BulkDraftNotice";
            var anchor = document.createElement('a');
            $('body').append(anchor);
            anchor.href = path;
            anchor.download = "Notice_Copy";
            anchor.target = "_blank";
            anchor.click();
            closeload();
        },
        failure: function (data) {
            closeload();
            alert(data);
        },
        error: function (data) {
            closeload();
            alert(data);
        }
    });
}
var noticeIdd = "";
var receiverEmaill = "";
function fnMailSend(noticeid, receiverEmail) {
    noticeIdd = noticeid;
    receiverEmaill = receiverEmail;
    $("#mailModal").modal('show');
    if (receiverEmaill == "null" || receiverEmaill == null) {
        receiverEmaill = "";
    }
    $("#receiverEmail").val(receiverEmaill);
}
$("#btnDraftOnEmail").click(function () {
    var email = $("#receiverEmail").val();
    if (email != "") {
        $("#spanEmailId").hide();
        if (IsEmail(email) == false) {
            alert("Please enter valid EmailId");
            return false;
        }
        var formdata = new FormData();
        formdata.append('Id', EncodeText(noticeIdd));
        formdata.append('receiverEmaill', EncodeText(email));
        $.ajax({
            type: "POST",
            url: "/NoticeTemplate/sendDraftOnMail",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                if (String(response.message) == "EmptyEmail") {
                    alert("Please update emailId to send document.");
                    return false;
                }
                else {
                    alert(response.message);
                    $("#mailModal").modal('hide');
                }
            },
            error: function (err) {
                alert(err.responseText)
            }
        })
    }
    else {
        $("#spanEmailId").show();
    }
})
function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
function renderPagination(PageNumber, totdata) {
    let totPages = totdata;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === PageNumber ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn ${i === PageNumber ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn ${j === PageNumber ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbers").html(paginationHtml);
    isRenderPage = true;
}