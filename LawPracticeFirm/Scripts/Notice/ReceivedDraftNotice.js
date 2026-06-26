var current_page = 1;
var records_per_page = 10;
var PageNumber = 1;
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
function changePage(page) {
    PageNumber = page;
    callapi();
}
$(document).ready(function () {
    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
    });

    var setPageNo = 1;
    $(document).on("click", ".page-btnRD", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = true;
        $("#txtgopageRD").val("");
        PageNumber = setPageNo;
        callapi();
        $(".page-btnRD").removeClass("active");
        $(".page-btnRD[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prevRD").click(function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = true;
        $("#txtgopageRD").val("");
        PageNumber = setPageNo;
        callapi();
        $(".page-btnRD").removeClass("active");
        $(".page-btnRD[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#nextRD").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = true;
        $("#txtgopageRD").val("");
        PageNumber = setPageNo;
        callapi();

        $(".page-btnRD").removeClass("active");
        $(".page-btnRD[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGoRD").click(function () {
        let goToPage = parseInt($("#txtgopageRD").val());
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
        $(".page-btnRD").removeClass("active");
        $(".page-btnRD[data-page='" + setPageNo + "']").addClass("active");
    });

});

$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
/*Get received draft notice details by page number*/
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
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    //changePage(1);
};
$("#ddlnoticetypess").change(function () {
    callapi();
});

/*Get received draft notice details*/
function callapi() {
    try {
        openload();
    }
    catch (er) {
    }
    var html = '';
    var notistatus = $('input[name=statustype]:checked').val();
    var notistatus1 = "";
    var formData = new FormData();
    var sendernamesearch = $("#noticebyIds").val();
    var Noticesubjectsrc = $("#noticeSubjects").val();
    var Noticetitlesrc = $("#noticeTitless").val();
    var Noticetypesrc = $("#ddlnoticetypess").val();
    formData.append("SearchValue", EncodeText(""));
    formData.append("ColumName", EncodeText(""));
    formData.append("SortedOrder", EncodeText(""));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("notistatus", EncodeText(notistatus1));
    formData.append("NoticeId", EncodeText(NoticeId));
    formData.append("Noticesubjectsrc", EncodeText(Noticesubjectsrc));
    formData.append("Noticetitlesrc", EncodeText(Noticetitlesrc));
    formData.append("Noticetypesrc", EncodeText(Noticetypesrc));
    formData.append("sendername", EncodeText(sendernamesearch));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ReceiveDraftNoticeList",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            try {
                openload();
            }
            catch (ex) {
            }
            $("#tablevalue").html("");
            $("#noticetbldashboardfooter").html("");
            $("#nonotice").html("");
            if (response == "") {
                document.querySelector(".pagination").style.display = "none";
                $("#pagenatedArea").css("display", "none");
                $("#nonotice").append('<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No  list found</h4>' +
                    '<p>We found no  list.</p>' +
                    '</div>');
                var response = JSON.parse(response1.Data);
                try {
                    closeload();
                }
                catch (ex) {
                }
                return false;
            }
            else {
                $("#pagenatedArea").css("display", "flex");
                var qty = 0;
                $.each(response, function (i, a) {
                    var amountclaimed = a.AmountClaimed == "0" || a.AmountClaimed == null ? "" : a.AmountClaimed;
                    var dateofdel = a.DateofDelivery == "1900-01-01T00:00:00" || a.DateofDelivery == null ? '' : a.DateofDelivery;
                    var dateofreceipt = a.DateofReceipt == "1900-01-01T00:00:00" || a.DateofReceipt == null ? '' : a.DateofReceipt;
                    if (1 == 1) {
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        var totdata = a.TotalRows;

                        $("#ShareNoticeCount").text("(" + totdata + ")");
                        if (i === (response.length - 1)) {
                            document.querySelector(".pagination").style.display = "flex";

                            totrecord = a.TotalRows;

                            totpage = parseInt(totdata) / parseInt(10);
                            if (parseInt(totdata) % parseInt(10) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            //if (PageNumber == totpage) {
                            //    $('#nextRD').hide();
                            //    $('#prevRD').css("display", "block");
                            //}
                            //else {
                            //    $('#nextRD').css("display", "block");
                            //}
                            //if (PageNumber == 1) {
                            //    $('#prevRD').css("display", "none");
                            //}
                            //else {
                            //    $('#prevRD').css("display", "block");
                            //}
                            if (PageNumber == totpage) {
                                $('#nextRD').hide();
                                $('#prevRD').css("display", "block");
                            }
                            else {
                                $('#nextRD').css("display", "block");
                            }
                            if (PageNumber == 1) {
                                $('#prevRD').css("display", "none");
                            }
                            else {
                                $('#prevRD').css("display", "block");
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
                            html += "<td  class='noticeby'>" + a.SendersName + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor:pointer; ' onclick=ViewMoreItem1('" + a.NoticeID + "')></span></td>";
                        }
                        else {
                            html += "<td  class='noticeby'>" + a.SendersName + "</td>";
                        }
                        html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                        html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                        html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                        html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                        html += "<td  class='dateofreceiveddraftnotice'>" + (a.DateofNotice == null || a.DateofNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofNotice))) + "</td>";
                        html += "<td  class='servedon'>" + (a.DateofServiceofNotice == null || a.DateofServiceofNotice == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofServiceofNotice))) + "</td>";
                        if (a.DueDateOfNotice == "1900-01-01T00:00:00" || a.DueDateOfNotice == null) {
                            html += "<td  class='noticeduedate'></td>";
                        }
                        else {
                            html += "<td  class='noticeduedate'>" + dateFormat(new Date(a.DueDateOfNotice)) + "</td>";
                        }
                        if (a.CreateNotice.length > 5) {
                            html += "<td  class='noticetext'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReceivedNotice") title="View more"> <img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                        }
                        else {
                            html += "<td  class='noticetext'>" + span.innerText + "</td>";
                        }
                        html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                        html += "<td class='pending'>" + a.CaseStatus + "</td>";
                        html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                        html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                        html += "<td  class='criticality'>" + a.Criticality + "</td>";
                        html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                        html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                        html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                        html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                        html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                        html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                        html += "<td  class='tags'>" + a.Tag + "</td>";
                        html += "<td  class='ReferenceNumber'>" + a.NoticeReference + "</td>";
                        html += "<td  class='InternalNumber'>" + a.IntNoticeReference + "</td>";
                        if (a.ActualDateOfClosure == null || a.ActualDateOfClosure == '1900-01-01T00:00:00') {
                            html += "<td class='closdate'></td>";
                        }
                        else {
                            html += "<td class='closdate'>" + dateFormat(new Date(a.ActualDateOfClosure)) + "</td>";
                        }
                        if (a.IsFileAvailable) {
                            html += '<td class="attachment"><i aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer;" id-val="' + a.NoticeID + '"><img src="/newassets/img/folder-icon.png" /></i></td>'
                        }
                        else {
                            html += '<td class="attachment"></td>';
                        }
                        //for custmized fields start
                        var countcf = countcustomfoeld;
                        for (var str = 1; str <= countcf; str++) {
                            if (str == 1) {
                                if (a.col1 == "") {
                                    html += "<td  class='class3'><span>&nbsp;</span></td>";
                                }
                                else if (a.col1 == null) {
                                    html += "<td  class='class3'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col1, qty + 'a' + str);
                                    html += "<td  class='class3'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 2) {
                                if (a.col2 == "") {
                                    html += "<td  class='class4'><span>&nbsp;</span></td>";
                                }
                                else if (a.col2 == null) {
                                    html += "<td  class='class4'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col2, qty + 'a' + str);
                                    html += "<td  class='class4'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 3) {
                                if (a.col3 == "") {
                                    html += "<td  class='class5'><span>&nbsp;</span></td>";
                                }
                                else if (a.col3 == null) {
                                    html += "<td  class='class5'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col3, qty + 'a' + str);
                                    html += "<td  class='class5'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 4) {
                                if (a.col4 == "") {
                                    html += "<td  class='class6'><span>&nbsp;</span></td>";
                                }
                                else if (a.col4 == null) {
                                    html += "<td  class='class6'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col4, qty + 'a' + str);
                                    html += "<td  class='class6'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 5) {
                                if (a.col5 == "") {
                                    html += "<td  class='class7'><span>&nbsp;</span></td>";
                                }
                                else if (a.col5 == null) {
                                    html += "<td  class='class7'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col5, qty + 'a' + str);
                                    html += "<td  class='class7'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 6) {
                                if (a.col6 == "") {
                                    html += "<td  class='class8'><span>&nbsp;</span></td>";
                                }
                                else if (a.col6 == null) {
                                    html += "<td  class='class8'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col6, qty + 'a' + str);
                                    html += "<td  class='class8'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 7) {
                                if (a.col7 == "") {
                                    html += "<td  class='class9'><span>&nbsp;</span></td>";
                                }
                                else if (a.col7 == null) {
                                    html += "<td  class='class9'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col7, qty + 'a' + str);
                                    html += "<td  class='class9'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 8) {
                                if (a.col8 == "") {
                                    html += "<td  class='class10'><span>&nbsp;</span></td>";
                                }
                                else if (a.col8 == null) {
                                    html += "<td  class='class10'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col8, qty + 'a' + str);
                                    html += "<td  class='class10'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 9) {
                                if (a.col9 == "") {
                                    html += "<td  class='class11'><span>&nbsp;</span></td>";
                                }
                                else if (a.col9 == null) {
                                    html += "<td  class='class11'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col9, qty + 'a' + str);
                                    html += "<td  class='class11'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 10) {
                                if (a.col10 == "") {
                                    html += "<td  class='class12'><span>&nbsp;</span></td>";
                                }
                                else if (a.col10 == null) {
                                    html += "<td  class='class12'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col10, qty + 'a' + str);
                                    html += "<td  class='class12'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 11) {
                                if (a.col11 == "") {
                                    html += "<td  class='class13'><span>&nbsp;</span></td>";
                                }
                                else if (a.col11 == null) {
                                    html += "<td  class='class13'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col11, qty + 'a' + str);
                                    html += "<td  class='class13'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 12) {
                                if (a.col12 == "") {
                                    html += "<td  class='class14'><span>&nbsp;</span></td>";
                                }
                                else if (a.col12 == null) {
                                    html += "<td  class='class14'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col12, qty + 'a' + str);
                                    html += "<td  class='class14'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 13) {
                                if (a.col13 == "") {
                                    html += "<td  class='class15'><span>&nbsp;</span></td>";
                                }
                                else if (a.col13 == null) {
                                    html += "<td  class='class15'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col13, qty + 'a' + str);
                                    html += "<td  class='class15'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 14) {
                                if (a.col14 == "") {
                                    html += "<td  class='class16'><span>&nbsp;</span></td>";
                                }
                                else if (a.col14 == null) {
                                    html += "<td  class='class16'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col14, qty + 'a' + str);
                                    html += "<td  class='class16'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 15) {
                                if (a.col15 == "") {
                                    html += "<td  class='class17'><span>&nbsp;</span></td>";
                                }
                                else if (a.col15 == null) {
                                    html += "<td  class='class17'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col15, qty + 'a' + str);
                                    html += "<td  class='class17'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                        }
                        //End
                        if (roleid == 2 || roleid == 3) {
                            html += '<td><a  style="cursor:pointer;"  onclick=ChangeStatus("' + a.NoticeID + '") title="Feedback"><img src="/newassets/img/DraftS_Notice.png"></a> <a title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("' + a.NoticeID + '")><img src="/newassets/img/ViewDNotice.png"></a> <a style="cursor:pointer;"  onclick=fnviewlog("' + a.NoticeID + '","3") title="View Feedback"><img src="/newassets/img/ViewFeedS.png"></a></td>';
                        }
                        else {
                            html += '<td><a style="cursor:pointer;"  onclick=ChangeStatus("' + a.NoticeID + '") title="Change Status"><img src="/newassets/img/DraftS_Notice.png"></a> <a class="glyphicon glyphicon-folder-open" title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("' + a.NoticeID + '")><img src="/newassets/img/ViewDNotice.png"></a> <a style="cursor:pointer;"  onclick=fnviewlog("' + a.NoticeID + '","3") title="View Feedback"><img src="/newassets/img/ViewFeedS.png"></a></td>';
                        }
                        html += "<tr>";
                    }
                });
                $("#tablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                try {
                    closeload();
                }
                catch (ex) {
                }
            }
        },
        error: function (xhr) {
            alert('error');
        }
    })
};
var closurenoticeid = "";
function ClouserNotice(noticeid) {
    closurenoticeid = noticeid;
    $("#ActualclosurModal").modal('show');
    var formData = new FormData();
    formData.append("closurenoticeid", EncodeText(closurenoticeid));
}
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
//Add custom field dynamic
setTimeout(function () {
    ploadtabledata();
}, 3000);
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var countcustomfoeld = 0;

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
    var type = 13;
    var rt = $.ajax({
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
                var option1 = '<li><input id="select_allcfield"   type="checkbox"   >Select All</a></li>';
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
    $.when(rt).then(function (data, textStatus, jqXHR) {
        //callapi();
        if (urltype == "status" || urltype == "type" || urltype == "subject") {
            //        // setTimeout(function () {
            callapi();
            //        // },5000);
        }
        else {
            //        //  setTimeout(function () {
            callapi();
            //        //  },2000);
        }
    });
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var urltype = getUrlVars()["type"];
function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}
/*Sort data*/
function SortData() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od").
            appendChild(e));
}
/*Sort data for rejoinder*/
function SortDataForRejoinder() {
    var subjects =
        document.querySelectorAll("[data-subject1]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#odRejoinder").
            appendChild(e));
}
$(document).ready(function () {
    if (urltype == "1") {
        $("#dynamicnotiheader").html("notices - converted to case");
    }
    else if (urltype == "2") {
        $("#dynamicnotiheader").html("settled notice");
    }
    else {
        $("#dynamicnotiheader").html("List of Shared Notices - Received");
    }
});

/*View draft notice*/
function ViewNoticeDraft(noticeid) {
    $("#NoticeDraftModal").modal('show');
    $("#draftnoticemodlbody").html('');
    var html = '';
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
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
var outnoticeidd = "";
function AddInComingReply(outnoticeid) {
    outnoticeidd = outnoticeid;
    $("#ReceivedReplyModal").modal('show');
}
/*Save reply notice details*/
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
    if (totalFiles == 0) {
        alert("Please choose file.");
        return false;
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
/*Add notice rejoinder*/
var childtblrejoinderclickcount = 0;
function ViewMoreItem2(parentId) {
    if (childtblrejoinderclickcount == 1) {
        $("#childrejoindertbltr").remove();
        childtblrejoinderclickcount = 0;
    }
    else {
        childtblrejoinderclickcount = 1;
        $(`<tr id="childrejoindertbltr"><td colspan="27"><div id="tblrejoinderitem" class="table-panel table-responsive" style="padding:10px; overflow-x:auto;" data-example-id="hoverable-table">
<h2>REJOINDER</h2>
        <table class= "table tblrejoinderclass" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr>
                        <th class="childrejoinderSN" data-column="RejoinderSN" data-order="desc"><div>No</div></th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc" title="Sender's Name"><div>Received From</div></th>
                        <th class="childnoticesender" data-column="SendersName" data-order="desc" title="Receiver's Name"><div>Sent To</div></th>
                        <th class="childdateofrejoinder" data-column="DateofRejoinder" data-order="desc"><div>Date of Rejoinder</div></th>
                        <th class="childdateofreceipt" data-column="DateofReceipt" data-order="desc"><div>Received on Date</div></th>
                        <th class="childnoticeduedate" data-column="DueDateOfNotice" data-order="desc"><div>Due Date</div></th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc"><div>Title</div></th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc"><div>Subject</div></th>
                       <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc"><div>Mode</div></th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc"><div>Text </div></th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc"><div>Status</div></th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc"><div>Type</div></th>                        
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc"><div>Date of Delivery</div></th>                        
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc"><div>Receiver's Address</div></th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc"><div>Other Details of Receiver</div></th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc"><div>Notice Through/To</div></th>
                        <th class="childcriticality" data-column="Criticality" data-order="desc"><div>Priority</div></th>
                        <th class="childreasonforhighpriority" data-column="Resonforhighpriority" data-order="desc"><div>Reason For High Priority</div></th>
                        <th class="childtag" data-column="Tag" data-order="desc"><div>Tags</div></th>
                        <th class="childclaimamount" data-column="AmountClaimed" data-order="desc"><div>Amount Claimed</div></th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonotice"></tbody>
                        </table >
        <center> <div id="noreplytonotice"> </div></center>
       </div>

                    <div class="row settingpanel">
                        <div class="col-md-6" id="footer-data">
                            <div style="float: left;padding: 0 10px 0 0;">
                                <ul>
                                    <li>
                                        <div class="btn-group dropup">
                                            <a href="javascript:void()" class="dropdown-toggle selctInputFormat" style="background-color: #ebebeb !important;margin-top: -5px !important;margin-left: 15px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="glyphicon glyphicon-cog" style="font-size:14px;color:black;padding:0 5px 0 0 "></span>
                                                Customize Fields <span class="glyphicon glyphicon-chevron-down"></span>
                                            </a>
                                            <ul class="dropdown-menu settingshowhide" id="odRejoinder" style="width:260px">
<li data-subject="Amount Claimed"><input type="checkbox" class="shcheckbox1 chkdhide" name="childclaimamount"><a href="#">Amount Claimed</a></li>
 <li data-subject="Date of Delivery"><input type="checkbox" class="shcheckbox1 chkdhide" name="childdispatched"><a href="#">Date of Delivery </a></li>
<li data-subject="Date of Rejoinder"><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofrejoinder" checked><a href="#">Date of Rejoinder</a></li>
<li data-subject="Due Date"><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticeduedate" checked><a href="#">Due Date</a></li>
                                            <li data-subject="Mode of Delivery"><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofdeliveryofrejoinder" checked><a href="#">Mode of Delivery</a></li>
<li data-subject="Notice Status"><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending"><a href="#">Notice Status</a></li>
                                            <li data-subject="Notice Text"><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#">Notice Text</a></li>
                                            <li data-subject="Notice Through/To"><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderthrough"><a href="#">Notice Through/To</a></li>
 <li data-subject="Other Details of Receiver"><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                                            <li data-subject="Priority"><input type="checkbox" class="shcheckbox1 chkdhide" name="childcriticality"><a href="#">Priority</a></li>
                                            <li data-subject="Received"><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderaddressedto" checked><a href="#" class="dropdown-item">Received From</a></li>
                                            <li data-subject="Reason For High Priority"><input type="checkbox" class="shcheckbox1 chkdhide" name="childreasonforhighpriority"><a href="#">Reason For High Priority</a></li>
                                            <li data-subject="Receiver's Address"><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Receiver's Address</a></li>
                                            <li data-subject=><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesender" checked><a href="#">Sent To</a></li>
                                            <li data-subject="Subject"><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject"><a href="#">Subject</a></li>
                                            <li data-subject="Tags"><input type="checkbox" class="shcheckbox1 chkdhide" name="childtag"><a href="#">Tags</a></li>
                                            <li data-subject="Title"><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle" ><a href="#">Title</a></li>
                                            <li data-subject="Type"><input type="checkbox" class="shcheckbox1 chkdhide" name="childstatutory"><a href="#">Type</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="listingTableReplyFooter" style="display:none;"></div>
                        </div>
                        <div class="col-md-6" style="padding-right:20px">
                                                   
                    </div>
                </div>
</td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
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
                            span.innerHTML = a.CreateRejoinder;
                            html += "<tr>";
                            html += "<td class='childrejoinderSN'>" + a.RowId + "</td>";
                            html += "<td class='childrejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                            html += "<td class='childnoticesender'>" + a.SendersName + "</td>";
                            html += "<td class='childdateofrejoinder'>" + (a.DateofCreatingRejoinder == null ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                            html += "<td class='childdateofrejoinder'>" + (a.DateofReceipt == null || a.DateofReceipt == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>";
                            html += "<td class='childnoticeduedate'>" + (a.DueDateOfNotice == null || a.DueDateOfNotice == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>"; //for due date of notice in Received Rejoinder Table
                            html += "<td class='childnoticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='childnoticesubject'>" + (a.RejoinderSubject == "'" ? "" : a.RejoinderSubject) + "</td>";
                            html += "<td class='childmodeofdeliveryofrejoinder'>" + (a.ModeofDeliveryofRejoinder == "null" ? "" : a.ModeofDeliveryofRejoinder) + "</td>";
                            if (a.CreateRejoinder.length > 3) {
                                //html += "<td  class='childremark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"> <img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                                html += "<td  class='childremark'>"+'<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"> <img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='childremark'>" + span.innerText + "</td>";
                            }
                            html += "<td class='childpending'>" + a.CaseStatus + "</td>";
                            html += "<td class='childstatutory'>" + a.NoticeType + "</td>";
                            html += "<td class='childdispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td  class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childrejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' || "null" ? '' : a.RejoinderThrough) + "</td>";
                            html += "<td class='childcriticality'>" + (a.Criticality == "0" ? "" : a.Criticality) + "</td>";
                            html += "<td class='childreasonforhighpriority'>" + a.Resonforhighpriority + "</td>";
                            html += "<td class='childtag'>" + a.Tag + "</td>";
                            if (a.AmountClaimed == null || a.AmountClaimed == "0") {
                                html += "<td class='childclaimamount'></td>";
                            }
                            else {
                                html += "<td class='childclaimamount'>" + a.AmountClaimed + "</td>";
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
var childtblclickcount = 0;
/*Redirect reply notice details*/
function fnViewmorereplytonotice(mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/ReplyToNoticeHome"
    sessionStorage.setItem("mainnoticeid", mainnoticeid);
}
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReceivedNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
var statusnotisId = ""
function ChangeStatus(noticeId) {
    statusnotisId = noticeId;
    $("#NoticeStatusModal").modal('show');
}
$("#statusnoticebtn").click(function () {
    var status = $("#notistatus").val();
    var feedback = $("#feedbacktext").val();
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
                callapi();
            }
            else {
                alert("Alert ! Something went wrong.");
                $("#NoticeStatusModal").modal("hide");
            }
        },
    })
})
/*View received draft more details*/
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
/*View log*/
function fnviewlog(noticeid, usertype) {
    $("#ViewLogModal").modal('show');
    var html = '';
    var qty = 0;
    var casenotfoundcolorstyle = "";
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
                if (data.iApproverType == 2) {
                    ApproveType = "User";
                } else if (data.iApproverType == 3) {
                    ApproveType = "Client";
                } else {
                    ApproveType = "NA";
                }
                qty = qty + 1;
                html += `<tr>
                        <td>`+ data.sendername + `</td>
                        <td>`+ data.receivername + `</td>
                        <td>`+ dateFormat(new Date(data.dSendDate)) + '</td>'
                html += '<td>' + ApproveType + '</td>'
                if (remark == "" || remark == null || remark == "null") {
                    html += '<td>&nbsp;</td>'
                }
                // ======    Add more remarks ==================//
                else {
                    if (remark.length > 10) {
                        html += '<td>'
                        html += '<span class="comment more" style="">' + remark.substring(0, 10) + '</span>'
                        html += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                        html += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                        html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                        html += '' + remark + ''
                        html += '</div>'
                        html += '</td>'
                    }
                    else {
                        html += '<td style="' + casenotfoundcolorstyle + '">' + (remark == null ? "" : remark) + '</td>'
                    }
                }
                html += '</tr>'
            })
            $("#modlbody").html(html);
        },
    })
}
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReplyToNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
/*Edit notice details*/
function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeNew/CreateNewNotice"
    sessionStorage.setItem("NoticeId", noticeid)
}
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*Get reply notice details for received draft notice*/
var childtblclickcount1 = 0;
function ViewMoreItem1(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="28"><div class="poptable" style="overflow-x: unset;">
        <div id="tblpoitem" class="table-panel table-responsive poptable" data-example-id="hoverable-table" style="width:100%">
        <h2>REPLY</h2>
        <table class= "tblReplyReceived" style="width:100%" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr>
                           <th class="childtbltreplycls">No</th>
                            <th class="replyfrom" data-column="RespondentsName" data-order="desc">Sender's Name </th>
                            <th class="replyaddressedto" data-column="ReplyAddressedto" data-order="desc" title="Receiver's Name">Sent To</th>
                            <th class="noticedate" data-column="ReplytoNoticeCreatedOn" data-order="desc">Date of reply</th>
                            <th class="noticesenddatechild">Date of dispatch</th>
                            <th class="duedate" data-column="DueDateOfNotice" data-order="desc">Due Date</th>
                            <th class="remark" data-column="CreateReply" data-order="desc">Text </th>
                            <th class="modeofserviceordelivery" data-column="ModeofServiceorDelivery" data-order="desc">Mode</th>
                            <th class="replythrough" data-column="ReplyThrough" data-order="desc">Notice Through/To</th>
                            <th class="noticetitle" data-column="NoticeTitle" data-order="desc">Title </th>
                            <th class="noticesubject" data-column="ReplySubject" data-order="desc">Subject</th>
                            <th class="statutory" data-column="NoticeType" data-order="desc">Type </th>
                            <th class="tags" data-column="Tag" data-order="desc">Tags</th>
                            <th class="priority" data-column="Criticality" data-order="desc">Priority</th>
                            <th class="reasonforhighpriority" data-column="Resonforhighpriority" data-order="desc">Reason For High Priority</th>
                            <th class="claimamount" data-column="AmountClaimed" data-order="desc">Amount Claimed</th>
                            <th class="pending" data-column="CaseStatus" data-order="desc">Status</th>
                            <th class="dispatched" data-column="DateofDelivery" data-order="desc">Date of Delivery </th>                            
                            <th class="addresseeaddress" data-column="AddresseeAddress" data-order="desc">Receiver's Address </th>
                            <th class="otherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc">Other Details of Receiver </th>
                            <th class="respondentsaddress" data-column="RespondentsAddress" data-order="desc">Sender's Address </th>
                            <th class="otherdetailsofrespondent" data-column="OtherDetailsofRespondent" data-order="desc">Other Details of Sender </th>
                            <th class="noticeTrackingIdchild">Consignment No.</th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonoticechild"></tbody>
                        </table >
        <center> <div id="noreplytonoticechild"> </div></center>
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
                                            <ul class="dropdown-menu settingshowhide" id="od1" style="width:255px">
                                                <li data-subject="Amount Claimed"><input type="checkbox" class="shcheckbox1 chkdhide" name="claimamount"><a href="#">Amount Claimed</a></li>
                                                <li data-subject="Consignment No"><input type="checkbox" class="shcheckbox1 chkdhide" name="noticeTrackingIdchild"><a>Consignment No.</a></li>
                                                <li data-subject="Date of Delivery"><input type="checkbox" class="shcheckbox1 chkdhide" name="dispatched"><a href="#">Date of Delivery</a></li>
                                                <li data-subject="Date of dispatch"><input type="checkbox" class="shcheckbox1 chkdhide" name="noticesenddatechild" checked><a>Date of dispatch</a></li>
                                                <li data-subject="Date of Notice"><input type="checkbox" class="shcheckbox1 chkdhide" name="noticedate" checked><a href="#">Date of Notice</a></li>
                                                <li data-subject="Due Date"><input type="checkbox" class="shcheckbox1 chkdhide" name="duedate" checked><a href="#">Due Date</a></li>
                                                <li data-subject="Mode"><input type="checkbox" class="shcheckbox1 chkdhide" name="modeofserviceordelivery" checked><a href="#">Mode</a></li>
                                                <li data-subject="Notice Status"><input type="checkbox" class="shcheckbox1 chkdhide" name="pending"><a href="#">Notice Status</a></li>
                                                <li data-subject="Notice Text"><input type="checkbox" class="shcheckbox1 chkdhide" name="remark" checked><a href="#" class="dropdown-item">Notice Text</a></li>
                                                <li data-subject="Notice Through/To"><input type="checkbox" class="shcheckbox1 chkdhide" name="replythrough" checked><a href="#">Notice Through/To</a></li>
                                                <li data-subject="Title"><input type="checkbox" class="shcheckbox1 chkdhide" name="noticetitle"><a href="#">Title</a></li>
                                                <li data-subject="Other Details of Sender"><input type="checkbox" class="shcheckbox1 chkdhide" name="otherdetailsofrespondent"><a href="#" class="dropdown-item">Other Details of Sender</a></li>
                                                <li data-subject="Other Details of Receiver"><input type="checkbox" class="shcheckbox1 chkdhide" name="otherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                                                <li data-subject="Priority"><input type="checkbox" class="shcheckbox1 chkdhide" name="priority"><a href="#">Priority</a></li>
                                                <li data-subject="Reason For High Priority"><input type="checkbox" class="shcheckbox1 chkdhide" name="reasonforhighpriority"><a href="#">Reason For High Priority</a></li>
                                                <li data-subject="Receiver's Address"><input type="checkbox" class="shcheckbox1 chkdhide" name="addresseeaddress"><a href="#">Receiver's Address</a></li>
                                                <li data-subject="Subject"><input type="checkbox" class="shcheckbox1 chkdhide" name="noticesubject"><a href="#">Subject</a></li>
                                                <li data-subject="Sender's Address"><input type="checkbox" class="shcheckbox1 chkdhide" name="respondentsaddress"><a href="#">Sender's Address</a></li>
                                                <li data-subject="Sender's Name"><input type="checkbox" class="shcheckbox1 chkdhide" name="replyfrom" checked><a href="#">Sender's Name</a></li>
                                                <li data-subject="Sent To"><input type="checkbox" class="shcheckbox1 chkdhide" name="replyaddressedto" checked><a href="#">Sent To</a></li>
                                                <li data-subject="Tags"><input type="checkbox" class="shcheckbox1 chkdhide" name="tags"><a href="#">Tags</a></li>
                                                <li data-subject="Type"><input type="checkbox" class="shcheckbox1 chkdhide" name="statutory"><a href="#">Type</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="listingTableReplyFooterchild"></div>
                        </div>
                        <div class="col-md-6">
                                                    </div>
                </div>
</div>
       </div></td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        NoticeParentId = parentId;
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
            url: '/api/ReplyToNotice/ReplyToNoticeListByNoticeId',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                var response1 = JSON.parse(response.Data);
                response1 = response1.reverse();
                closeload();
                $("#tablevalueReplytonoticechild").html("");
                $("#listingTableReplyFooterchild").html("");
                $("#noreplytonoticechild").html("");
                if (response1 == "") {
                    $("#noreplytonoticechild").append("No Records found.");
                    return false;
                }
                else {
                    if (1 == 1) {
                        $.each(response1, function (i, a) {
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
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer" class="gobtn">Go</button> </li>'
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
                                $("#listingTableReplyFooterchild").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateReply;
                            html += "<tr class=" + a.NoticeID + ">";
                            if (a.IsReplyReceivedCount > 0) {
                                html += "<td>" + a.RowId + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor: pointer;position:relative;left:5px' onclick=ViewMoreItem2('" + a.NoticeID + "')></span></td>";
                            }
                            else {
                                html += "<td>" + a.RowId + "</td>";
                            }
                            html += "<td  class='replyfrom'>" + a.SendersName + "</td>";
                            html += "<td class='replyaddressedto'>" + a.ReplyAddressedto + "</td>";
                            html += "<td class='noticedate'>" + (a.ReplytoNoticeCreatedOn == null || a.ReplytoNoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ReplytoNoticeCreatedOn))) + "</td>";
                            html += "<td  class='noticesenddatechild'>" + (a.DateOfDispatch == null || a.ddate == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateOfDispatch))) + "</td>"
                            if (a.DueDateOfNotice == "1900-01-01T00:00:00" || a.DueDateOfNotice == null) {
                                html += "<td class='duedate'></td>";
                            }
                            else {
                                html += "<td class='duedate'>" + (a.DueDateOfNotice == null ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                            }
                            if (a.CreateReply.length > 0) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReplyNotice") title="View more"> <img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='remark'>" + span.innerText + "</td>";
                            }
                            html += "<td  class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td  class='replythrough'>" + (a.NoticeThrough == "null" ? "" : a.NoticeThrough) + "</td>";
                            html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='noticesubject'>" + (a.ReplySubject == "'" ? "" : a.ReplySubject) + "</td>";
                            html += "<td class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td  class='tags'>" + a.Tag + "</td>";
                            if (a.Criticality == null || a.Criticality == "0") {
                                html += "<td class='priority'></td>";
                            }
                            else {
                                html += "<td class='priority'>" + a.Criticality + "</td>";
                            }
                            if (a.Resonforhighpriority == null) {
                                html += "<td class='reasonforhighpriority'></td>";
                            }
                            else {
                                html += "<td class='reasonforhighpriority'>" + a.Resonforhighpriority + "</td>";
                            }
                            if (a.AmountClaimed == "0" || a.AmountClaimed == null) {
                                html += "<td class='claimamount'></td>";
                            }
                            else {
                                html += "<td class='claimamount'>" + a.AmountClaimed + "</td>";
                            }
                            html += "<td class='pending'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";
                            html += "<td class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='otherdetailsofaddressee'>" + (a.OtherDetailsofAddressee == "undefined" ? '' : a.OtherDetailsofAddressee) + "</td>";
                            html += "<td class='respondentsaddress'>" + a.RespondentsAddress + "</td>";
                            html += "<td class='otherdetailsofrespondent'>" + a.OtherDetailsofRespondent + "</td>";
                            html += "<td  class='noticeTrackingIdchild'>" + a.ConsignmentNum + "</td>";
                            html += "<tr>";
                        });
                        $("#tablevalueReplytonoticechild").append(html);
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
//Add serch on colomn
$("#clearnewsearchforsender").click(function () {
    $("#noticebyIds").val("");
    $("#clearnewsearchforsender").css("display", "none");
    callapi();
})
$("#searchdatas").click(function () {
    var casefiltercasename = $("#noticebyIds").val();
    if (casefiltercasename == "") {
        alert("enter sender name");
        $("#noticebyIds").focus();
        return false;
    }
    $("#clearnewsearchforsender").css("display", "unset")
    callapi();
});
$("#clearnewsearchforsendersub").click(function () {
    $("#noticeSubjects").val("");
    $("#clearnewsearchforsendersub").css("display", "none");
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
    callapi();
});
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
/*Get customize field details*/
function Custommore(valcol1, qty) {
    var htmlNew = "";
    if (valcol1.length > 60) {
        htmlNew += '<span class="comment more" style="">' + valcol1.substring(0, 60) + '</span>'
        htmlNew += '<span data-toggle="collapse" data-target="#dtn2' + qty + '" style="color:black;cursor:pointer"> more</span>'
        htmlNew += ' <div id="dtn2' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
        htmlNew += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn2' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
        htmlNew += '' + valcol1 + ''
        htmlNew += '</div>'
    }
    else {
        htmlNew += valcol1;
    }
    return htmlNew;
}
var arrcolmenuseleciton = [];
var arrcolmenuselecitonfix = [];
$(document).on('change', '#select_allcfield', function () {
    if ($(this).is(':checked')) {
        $('.chkdhide').each(function () {
            if ($(this).prop('checked')) {
                var column = "." + $(this).attr("name");
                $(column).toggle();
            }
        });
    }
    else;
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
    callapi();
});
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
            paginationHtml += `<button class="page-btnRD ${i === PageNumber ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btnRD ${i === PageNumber ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btnRD ${j === PageNumber ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbersRD").html(paginationHtml);
    isRenderPage = true;
}