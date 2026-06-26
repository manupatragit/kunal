var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var ocreate, oedit, odelete = "";
$(document).ready(function () {
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
        PageNumber = setPageNo;
        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage = false;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    GetTemplateList();

    //For Template Search
    $("#searchnamebulk").click(function () {
        var casefiltercasename = $("#bulknoticename").val();
        if (casefiltercasename == "") {
            //alert("Please enter the template name.");
            new PNotify({
                title: 'Warning!',
                text: 'Please enter the template name.',
                type: 'error',
                delay: 2000
            });
            $("#bulknoticename").focus();
            return false;
        }
        $("#clearnewsearchnamebulk").css("display", "unset")
        PageNumber = 1;
        isRenderPage = false;
        callapi();
    });
    $("#clearnewsearchnamebulk").click(function () {
        $("#bulknoticename").val("");
        $("#clearnewsearchnamebulk").css("display", "none");
        PageNumber = 1;
        isRenderPage = false;
        callapi();
    });

    //For title Search
    $("#searchnamebulkti").click(function () {
        var casefiltercasename = $("#bulknoticenameti").val();
        if (casefiltercasename == "") {
            //alert("Please enter the title name.");
            new PNotify({
                title: 'Warning!',
                text: 'Please enter the title name.',
                type: 'error',
                delay: 2000
            });
            $("#bulknoticenameti").focus();
            return false;
        }
        $("#clearnewsearchnamebulkti").css("display", "unset")
        $("#searchnamebulkti").css("display", "none");
        PageNumber = 1;
        isRenderPage = false;
        callapi();
    });
    $("#clearnewsearchnamebulkti").click(function () {
        $("#bulknoticenameti").val("");
        $("#searchnamebulkti").css("display", "unset");
        $("#clearnewsearchnamebulkti").css("display", "none");
        isRenderPage = false;
        PageNumber = 1;
        callapi();
    });
});
/*Get template list*/
function GetTemplateList() {
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/GetTemplateForddl",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#ddltemplate").empty();
            $("#ddltemplate").append($("<option></option>").val("0").text('Please Select'));
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#ddltemplate").append($("<option></option>").val(value.Id).text(value.TemplateName));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
    // callapi();
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
/*Get bulk notice details by page number*/
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
function checkfile(sender) {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = sender;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
        alert("Invalid file selected, valid files are of " +
            validExts.toString() + " types.");
        return false;
    }
    else return true;
}
/*Post Bulk Notice*/
$("#btnuploadtemplate").click(function () {
    var templateid = $("#ddltemplate").val();
    var noticetype = $("#ddlnoticetype").val();
    var txtnoticetitle = $("#Noticetitle").val();
    //var TempLanguage = $("#ddlLanguageType").val();
    if (templateid == "0") {
        //alert("Please choose template.")
        new PNotify({
            title: 'Warning!',
            text: 'Please choose template.',
            type: 'error',
            delay: 2000
        });
        return false;
    }
    if (noticetype == "") {
        //alert("Please select notice type.")
        new PNotify({
            title: 'Warning!',
            text: 'Please select notice type.',
            type: 'error',
            delay: 2000
        });
        return false;
    }
    if (txtnoticetitle == "") {
        //alert("Notice title can't be empty.")
        new PNotify({
            title: 'Warning!',
            text: 'Notice title can not be empty.',
            type: 'error',
            delay: 2000
        });
        return false;
    }
    var totalFiles = document.getElementById("postedFile").files.length;
    if (totalFiles < 1) {
        //alert("Please choose an excel file");
        new PNotify({
            title: 'Warning!',
            text: 'Please choose an excel file',
            type: 'error',
            delay: 2000
        });
        return false;
    }
    var fileUpload = $("#postedFile").get(0);
    var files = fileUpload.files;
    var fileData = new FormData();
    for (var i = 0; i < files.length; i++) {
        if (!checkfile(files[i].name)) {
            //lert("Please choose an excel file");
            new PNotify({
                title: 'Warning!',
                text: 'Please choose an excel file.',
                type: 'error',
                delay: 2000
            });
            return false;
        }
        fileData.append(files[i].name, files[i]);
    }
    fileData.append("selfcreatednoticeid", EncodeText(templateid));
    fileData.append("noticetype", EncodeText(noticetype));
    fileData.append("noticetitle", EncodeText(txtnoticetitle));
    //fileData.append("TempLanguage", EncodeText(TempLanguage));

    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/PostBulkNotice",
        data: fileData,
        contentType: false,
        processData: false,
        success: function (data) {
            closeload();
            if (data.message == 'Already exist title name. please try another title name') {
                //alert(data.message);
                new PNotify({
                    title: 'Warning!',
                    text: data.message,
                    type: 'error',
                    delay: 2000
                });
                return true;
            }
            if (data.status) {
                //alert("Record added successfully.")
                new PNotify({
                    title: 'Success!',
                    text: 'Record added successfully.',
                    type: 'success',
                    delay: 3000
                });
                $("#postedFile").val("");
                $("#ddltemplate").val("0");
                $("#ddlnoticetype").val("");
                $("#txtnoticetitle").val("")
                $("#Noticetitle").val("");
                $("#fileName").text("");
                $("#deleteFile").hide(); 
                changePage(1);
            }
            else {
                closeload();
                //alert(data.message);
                //alert("Please upload the correct Excel format.");
                new PNotify({
                    title: 'Warning!',
                    text: 'Please upload the correct Excel format.',
                    type: 'error',
                    delay: 2000
                });
            }
        },
        failure: function (data) {
            closeload();
            //alert("Please upload the correct Excel format.");
            new PNotify({
                title: 'Warning!',
                text: 'Please upload the correct Excel format.',
                type: 'error',
                delay: 2000
            });
        },
        error: function (data) {
            closeload();
            //alert("Please upload the correct Excel format.");
            new PNotify({
                title: 'Warning!',
                text: 'Please upload the correct Excel format.',
                type: 'error',
                delay: 2000
            });
        }
    });
});
/*Get bulk notice details*/
var callapi = function () {
    openload();
    var html = '';
    var bulknoticename = $("#bulknoticename").val();
    var bulknoticenameti = $("#bulknoticenameti").val();
    if (bulknoticename != "") {
        SearchValue = bulknoticename;
    }
    else {
        SearchValue = "";
    }
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(SearchValue));
    formData.append("Searchtitle", EncodeText(bulknoticenameti));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/BulkTempList",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            closeload();
            $("#templatetablevalue").html("");
            $("#templatenoticetbldashboardfooter").html("");
            $("#templatenonotice").html("");
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            if (response == "") {
                document.querySelector(".pagination").style.display = "none";
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                $("#templatenonotice").append('<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No  list found</h4>' +
                    '<p>We found no  list.</p>');
                $("#pagenatedArea").css("display", "none");
                $("#pageNumbers").html("");
                return false;
            }
            else {
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                document.querySelector(".pagination").style.display = "flex";

                $.each(response, function (i, a) {
                    oedit = a.oedit;
                    odelete = a.odelete;
                    ocreate = a.ocreate;
                    return false;
                });

                $("#pagenatedArea").css("display", "");
                var hdnVal = $("#hdnWhatsAppBulkN").val().trim();
                var displayStyle = (hdnVal === "display:unset") ? "unset" : "none";

                //$("#btnShowHide").css("display", $("#hdnWhatsAppBulkN").val() === "display:unset" ? "block" : "none");
                $.each(response, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.RowId;
                    }
                    var totdata = a.TotalRows;
                    
                    if (i === (response.length - 1)) {

                        totrecord = a.TotalRows;
                        $('#totaRecordData').text(" (" + totrecord + ")");
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

                        //var pnext = pageindex;
                        //var pprev = pageindex;
                        //var pageno = pageindex;
                        //var totdata = a.TotalRows;
                        //var totpage = 0;
                        //if (a.TotalRows > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;
                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(pagesize);
                        //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }
                        //    $("#pagnumvalue").attr("max", totpage);
                        //}
                        //var tfot = '';
                        //tfot += '<ul>'
                        //tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a type="button" id="pgetdatabypagenum"  class="gobtn" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        //if (a.TotalRows <= response.length) {
                        //}
                        //else if (pageno == 1) {
                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        //}
                        //else {
                        //    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        //}
                        //if (pageno < totpage) {
                        //    tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                        //}
                        //tfot += '</ul>'
                        //$("#templatenoticetbldashboardfooter").append(tfot);
                    }
                    html += "<tr>"
                    html += "<td ><a title='Click for view notice' onclick=fnGetNoticeBulkList(`" + a.Id + "`) style='cursor:pointer'>" + a.Name + "</a> </td>";
                    html += "<td>" + a.NoticeTitle + "</td>";
                    html += "<td>" + a.CreatedBy + "</td>";
                    html += "<td>" + a.CreatedDate + "</td>";
                    if (oedit == "1") {
                        if (a.BulkMailSendStatus != null && a.BulkMailSendStatus != false && a.BulkMailSendStatus != "0") {
                            html += '<td>' +
                                '<span title="Action already performed."><img src="/newassets/img/read-icon.png" /></span>' +
                                '<a style="cursor:pointer;" onclick="DeleteBulkNotice(\'' + a.Id + '\')" title="Delete Template"><img src="/newassets/img/deletecasesingle-icon.png" /></a>' +
                                '<span style="cursor: pointer; color:#337ab7;" onclick="fnDownloadExcel(\'' + a.Id + '\')" title="Download original file"><img src="/newassets/img/download-icon.png" /></span>' +
                                '<span style="cursor: pointer; color:#337ab7;" onclick="fnViewTemplate(\'' + a.SelfTemplateId + '\')" title="View Attached Template"><img src="/newassets/img/view-icon.png" /></span>' +
                                '</td>';
                        }
                        else {
                            html += '<td>' +
                                '<a title="Send Bulk Whatsup" style="cursor:pointer;border: 1px solid #cbcbcb;padding: 5px;border-radius: 8px;display:' + displayStyle + ';" id="btnShowHideaction" onclick="fnBulkNoticeSendToWhatsup(\'' + a.Id + '\')"><img style="width:16px;height:16px;vertical-align: sub;" src="/newassets/images/whatsapp.svg" /></a>' +
                                '<a title="Send Mail" style="cursor:pointer;" onclick="fnBulkNoticeSendToMail(\'' + a.Id + '\')"><img src="/newassets/img/mail-icon.png" /></a>' +
                                '<a title="Delete Template" style="cursor:pointer;" onclick="DeleteBulkNotice(\'' + a.Id + '\')"><img src="/newassets/img/deletecasesingle-icon.png" /></a>' +
                                '<span style="cursor: pointer;" onclick="fnDownloadExcel(\'' + a.Id + '\')" title="Download original file"><img src="/newassets/img/download-icon.png" /></span>' +
                                '<span style="cursor: pointer;" onclick="fnViewTemplate(\'' + a.SelfTemplateId + '\')" title="View Attached Template"><img src="/newassets/img/view-icon.png" /></span>' +
                                '</td>';

                        }
                    }
                    else {
                        html += "<td></td>"
                    }
                    html += "</tr>"
                });
                $("#templatetablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
        },
        error: function (xhr) {
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            alert(xhr.responseText);
            closeload();
        }
    });
};
function fnViewTemplate(SelfTemplateId) {
    $("#viewmorecontent").html("");
    $("#ViewMoreModal").modal('show');
    var formdata = new FormData();
    formdata.append('SelfTemplateId', SelfTemplateId);
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/ShowAttachedTemplate",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#viewmorecontent").html("");
            const parsed = JSON.parse(data.html);
            const templateContent = parsed[0].TemplateContent;

            $("#viewmorecontent").html(templateContent);
        },
    })
}
/*Send bulk notice through mails*/
//function fnBulkNoticeSendToMail(Id) {
//    if (confirm("Are you sure you want to send bulk notice on respective email?")) {
//        var formdata = new FormData();
//        formdata.append("excelfileid", EncodeText(Id));
//        $.ajax({
//            type: "POST",
//            url: "/NoticeTemplate/sendmailInBulk",
//            contentType: false,
//            processData: false,
//            data: formdata,
//            async: false,
//            success: function (response) {
//                alert(response.message);
//            }
//        })
//    }
//}

function fnBulkNoticeSendToMail(Id) {
    //if (confirm("Are you sure you want to send bulk notice on respective email?")) {
    //}
    $("#myModalsharenotice").modal("show");
    $("#btnSendConfirmation").attr("sBulkNoticeId", Id);
}

$(document).on("click", "#btnSendConfirmation", function () {
    var Id = $(this).attr("sBulkNoticeId");//(this).attr("sBulkNoticeId");
    BulkNoticesShareToMail(Id);
});
function BulkNoticesShareToMail(Id) {
    var formdata = new FormData();
    formdata.append("excelfileid", EncodeText(Id));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/sendmailInBulk",
        contentType: false,
        processData: false,
        data: formdata,
        async: false,
        success: function (response) {
            //alert(response.message);
            if (response.message != "Something went wrong.") {
                new PNotify({
                    title: 'Success!',
                    text: response.message,
                    type: 'success',
                    delay: 3000
                });
            }
            else {
                new PNotify({
                    title: 'Info!',
                    text: response.message,
                    type: 'warning',
                    delay: 3000
                });
            }
            $("#myModalsharenotice").modal("hide");
        }
    })
}
function fnBulkNoticeSendToWhatsup(Id) {
    $("#myModalWhatsUpsharenotice").modal("show");
    $("#btnSendWhatsupConfirmation").attr("sBulkNoticeId", Id);
}

$(document).on("click", "#btnSendWhatsupConfirmation", function () {
    var Id = $(this).attr("sBulkNoticeId");//(this).attr("sBulkNoticeId");
    BulkNoticesShareToWhatsUp(Id);
});

function BulkNoticesShareToWhatsUp(Id) {
    var formdata = new FormData();
    formdata.append("excelfileid", EncodeText(Id));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/SendWhatsUpInBulk",  //SendWhatsUpInBulk
        contentType: false,
        processData: false,
        data: formdata,
        async: false,
        success: function (response) {
            //alert(response.message);
            if (response.message != "Something went wrong.") {
                new PNotify({
                    title: 'Success!',
                    text: response.message,
                    type: 'success',
                    delay: 3000
                });
            }
            else {
                new PNotify({
                    title: 'Info!',
                    text: response.message,
                    type: 'warning',
                    delay: 3000
                });
            }
            $("#myModalWhatsUpsharenotice").modal("hide");
        }
    })
}

function BulkNoticesShareToMail(Id) {
    var formdata = new FormData();
    formdata.append("excelfileid", EncodeText(Id));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/sendmailInBulk",
        contentType: false,
        processData: false,
        data: formdata,
        async: false,
        success: function (response) {
            //alert(response.message);
            if (response.message != "Something went wrong.") {
                new PNotify({
                    title: 'Success!',
                    text: response.message,
                    type: 'success',
                    delay: 3000
                });
            }
            else {
                new PNotify({
                    title: 'Info!',
                    text: response.message,
                    type: 'warning',
                    delay: 3000
                });
            }
            $("#myModalsharenotice").modal("hide");
        }
    })
}

/*Delete bulk notice by notice id*/
function DeleteBulkNotice(Id) {
    $("#myModalmarkDeleteconfirmation").modal();
    $("#deletesingle_final").attr("id-val", Id);
}
$(document).on("click", "#deletesingle_final", function () {
    var Id = $(this).attr("id-val");
   // if (confirm("Are you sure you want to remove this entry?")) {
        var formdata = new FormData();
        formdata.append("excelfileid", EncodeText(Id));
        $.ajax({
            type: "POST",
            url: "/NoticeTemplate/RemoveExcelBulkRecord",
            contentType: false,
            processData: false,
            data: formdata,
            async: false,
            success: function (response) {
                //alert(response.message);
                new PNotify({
                    title: 'Success!',
                    text: response.message,
                    type: 'success',
                    delay: 3000
                });
                changePage(1);
                $("#myModalmarkDeleteconfirmation").modal("hide");
            }
        })
   // }
});
/*Get bulk notice by main template id*/
function fnGetNoticeBulkList(maintemplateid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeTemplate/BulkNoticeList";
    sessionStorage.setItem("maintemplateid", maintemplateid);
}

/*Get header list by template id*/
function fnGetHeaderlistbytemplateid(maintempid) {
    var html = '<ul></ul>';
    var formdata = new FormData();
    formdata.append("maintemplateid", EncodeText(maintempid));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/GetTemplateHeader",
        contentType: false,
        processData: false,
        data: formdata,
        async: false,
        success: function (response) {
            $.each(response, function (key, val) {
                html += '<li style="cursor: pointer;color:#0059c1"><b>#' + response[key] + '#<b></li>';
            })
            $("#dividfieldcontrol").html(html);
        }
    })
}
$("#btnopenmoda").click(function () {
    $("#CreateTemplateModal").modal('show');
    fnGetHeaderlistbytemplateid("C165F8C3-662C-40CA-9968-C1C17039EE10")
})
/*Download notice in excel*/
function fnDownloadExcel(excelFileId) {
    var fileid = excelFileId;
    var mode = "view";
    var url = "/Firm/multiplefilelist/?ftype=BulkNoticeExcelDocument&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
}

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


$(document).on('change', '#postedFile', function () {
    var fileName = this.files.length ? this.files[0].name : "";
    $("#fileName").text(fileName);

    if (fileName !== "") {
        $("#deleteFile").show();
    }
});

// Delete file
$(document).on('click', '#deleteFile', function () {
    $("#postedFile").val("");
    $("#fileName").text("");
    $("#deleteFile").hide();
});

$(document).on("click", "#btnUploadHelp", function () {
    $("#myModalBulkNoticeHelp").modal("show");
});