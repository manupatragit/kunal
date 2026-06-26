var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var fromdaterange = "";
var start = "";
var end = "";
var fromreminder = "";
var remindernoticeid = "";
var ocreate, oedit, odelete = "";
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
    pageindex = $("#ppagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var ppageindesx = $("#psotopage").text();
            if (pageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                changePage(pageindex);
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
    pageindex = $(this).attr("index");
    changePage(pageindex);
});
$(document).ready(function () {
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
$(".notistatustype").click(function () {
    callapi();
})
/*Get settled notice details*/
var callapi = function () {
    openload();
    var html = '';
    var notistatus = $('input[name=statustype]:checked').val();
    var notistatus1;
    if (notistatus == "Home") {
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
    SearchValue = document.getElementById("myInput").value;
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(SearchValue));
    formData.append("ColumName", EncodeText(ColumName));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("notistatus", EncodeText(notistatus1));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/SettledNoticeList",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            closeload();
            $("#tablevalue").html("");
            $("#noticetbldashboardfooter").html("");
            $("#nonotice").html("");
            if (response.length == "") {
                $("#nonotice").append("No Records found.");
                return false;
            }
            else {
                $.each(response, function (i, a) {
                    oedit = a.oedit;
                    odelete = a.odelete;
                    ocreate = a.ocreate;
                    return false;
                });
                if (notistatus == "Home") {
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
                            $("#noticetbldashboardfooter").append(tfot);
                        }
                        var span = document.createElement('span');
                        span.innerHTML = a.CreateNotice;
                        html += "<tr class=" + a.NoticeID + ">";
                        html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                        html += "<td class='noticeby'>" + a.SendersName + "</td>";
                        html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                        html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                        html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                        html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                        html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                        html += "<td class='pending'>" + a.CaseStatus + "</td>";
                        html += "<td  class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                        html += "<td  class='servedon'>" + dateFormat(new Date(a.DateofReceipt)) + "</td>"
                        if (a.CreateNotice.length > 60) {
                            html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
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
                        html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                        html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                        html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                        html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                        html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                        html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                        html += "<td  class='noticethrough'><span style='cursor:pointer;color:#069;' title='View Client Notice' id='ViewClientNoticeList' value='" + a.NoticeThroughId + "'>" + a.ClientName + "</span></td>";
                        html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                        if (a.IsFileAvailable) {
                            html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                        }
                        else {
                            html += '<td class="attachment"></td>';
                        }
                        //}
                        html += "<tr>";
                    });
                    $("#tablevalue").append(html);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                }
                else if (notistatus == "Draft") {
                    $.each(response, function (i, a) {
                        if (a.ApproveByClient == false && a.ApproveByManager == false) {
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
                                $("#noticetbldashboardfooter").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateNotice;
                            html += "<tr class=" + a.NoticeID + ">";
                            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                            html += "<td class='noticeby'>" + a.SendersName + "</td>";
                            html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                            html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                            html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td  class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                            html += "<td  class='servedon'>" + dateFormat(new Date(a.DateofReceipt)) + "</td>"
                            if (a.CreateNotice.length > 60) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
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
                            html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                            html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                            html += "<td  class='noticethrough'><span style='cursor:pointer;color:#069;' title='View Client Notice' id='ViewClientNoticeList' value='" + a.NoticeThroughId + "'>" + a.ClientName + "</span></td>";
                            html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                            if (a.IsFileAvailable) {
                                html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="attachment"></td>';
                            }
                            html += "<tr>";
                        }
                    });
                    $("#tablevalue").append(html);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                }
                else if (notistatus == "Sent") {
                    $.each(response, function (i, a) {
                        if (a.ApproveByClient == true || a.ApproveByManager == true) {
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
                                $("#noticetbldashboardfooter").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateNotice;
                            html += "<tr class=" + a.NoticeID + ">";
                            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                            html += "<td class='noticeby'>" + a.SendersName + "</td>";
                            html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                            html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                            html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td  class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                            html += "<td  class='servedon'>" + dateFormat(new Date(a.DateofReceipt)) + "</td>"
                            if (a.CreateNotice.length > 60) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
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
                            html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                            html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                            html += "<td  class='noticethrough'><span style='cursor:pointer;color:#069;' title='View Client Notice' id='ViewClientNoticeList' value='" + a.NoticeThroughId + "'>" + a.ClientName + "</span></td>";
                            html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                            if (a.IsFileAvailable) {
                                html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="attachment"></td>';
                            }
                            html += "<tr>";
                        }
                    });
                    $("#tablevalue").append(html);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                }
                else if (notistatus == "FinalApproved") {
                    $.each(response, function (i, a) {
                        if (a.ApprovedForDispatch == "Approve") {
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
                                $("#noticetbldashboardfooter").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateNotice;
                            html += "<tr class=" + a.NoticeID + ">";
                            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                            html += "<td class='noticeby'>" + a.SendersName + "</td>";
                            html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                            html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                            html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td  class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                            html += "<td  class='servedon'>" + dateFormat(new Date(a.DateofReceipt)) + "</td>"
                            if (a.CreateNotice.length > 60) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
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
                            html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                            html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                            html += "<td  class='noticethrough'><span style='cursor:pointer;color:#069;' title='View Client Notice' id='ViewClientNoticeList' value='" + a.NoticeThroughId + "'>" + a.ClientName + "</span></td>";
                            html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                            if (a.IsFileAvailable) {
                                html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="attachment"></td>';
                            }
                            html += "<tr>";
                        }
                    });
                    $("#tablevalue").append(html);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                }
                else if (notistatus == "Rejected") {
                    $.each(response, function (i, a) {
                        if (a.iApprovalStatus == "Reject") {
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
                                $("#noticetbldashboardfooter").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateNotice;
                            html += "<tr class=" + a.NoticeID + ">";
                            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                            html += "<td class='noticeby'>" + a.SendersName + "</td>";
                            html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                            html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                            html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                            //html += "<td  class='noticedate'>" + dateFormat(new Date(parseInt((a.DateofNotice).match(/\d+/)[0]))) + "</td>";
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td  class='dispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                            html += "<td  class='servedon'>" + dateFormat(new Date(a.DateofReceipt)) + "</td>"
                            if (a.CreateNotice.length > 60) {
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
                            html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                            html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                            html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                            html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                            html += "<td  class='noticethrough'><span style='cursor:pointer;color:#069;' title='View Client Notice' id='ViewClientNoticeList' value='" + a.NoticeThroughId + "'>" + a.ClientName + "</span></td>";
                            html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                            if (a.IsFileAvailable) {
                                html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                            }
                            else {
                                html += '<td class="attachment"></td>';
                            }
                            html += "<tr>";
                        }
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
            closeload();
        }
    })
};
/*Move notice to archive*/
function MoveToArchive(noticeid) {
    if (confirm("Are you sure you want to retrieve from archive this notice?")) {
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
                    alert("Notice retrieved from archive successfully.");
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
            alert(data.Data.message);
        },
        error: function (data) {
            alert(data.Data.message);
        }
    });
})
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
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=CreateNotice&data=" + fileid + "&mode=" + mode;
    // var url = "/NoticeNew/multiplefilelist/?ftype=NewNoticeDocument&data=" + fileid + "&mode=" + mode + "&FirmId=" + userDetails.FirmId + "&LoginUserId=" + userDetails.Id + "&RoleId=" + userDetails.RoleId;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReplyToNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});

/*Add new reply notice details*/
function AddCreateReply(noticeid, mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice?Id=" + noticeid + "&Main=" + mainnoticeid + "&InitiatedBy=plaintiff";
}
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
                            <th class="receivedattachment childtbltsssr1cls">Reply to Notice Created On</th>
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
                        $.each(response.Data, function (i, a) {
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
/*Remove notice file data*/
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
/*Permanently delete notice*/
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
                        <th class="childnoticefrom" data-column="Rejoinder" data-order="desc">Rejoinder</th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc">Rejoinder Subject</th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc">Notice Title</th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc">Notice Type</th>
                        <th class="childnoticedate" data-column="DateofNotice" data-order="desc">Notice Date</th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc">Notice Status</th>
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc">Date of Delivery</th>
                        <th width="100px;" class="childservedon" data-column="DateofReceipt" data-order="desc">Date of Receipt</th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc">Remarks &#x25B2</th>
                        <th class="childmanagerapprove">Sent To Manager</th>
                        <th class="childclientapprove">Sent To Client</th>
                        <th class="childgenerationofalerts" data-column="GenerationofAlerts" data-order="desc">Generation of Alerts</th>
                        <th class="childdateofdispatchofnotice" data-column="DateofDispatchofNotice" data-order="desc">Date of Dispatch of Notice</th>
                        <th class="childdateofserviceofnotice" data-column="DateofServiceofNotice" data-order="desc">Date of Service of Notice</th>
                        <th class="childdateofreceivingreply" data-column="DateofReceivingReply" data-order="desc">Date of Receiving Reply</th>
                        <th class="childmodeofreceipt" data-column="ModeofReceipt" data-order="desc">Mode of Receipt</th>
                        <th class="childdateofrejoinder" data-column="DateofRejoinder" data-order="desc">Date of Rejoinder</th>
                        <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc">Mode of Delivery of Rejoinder</th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc">Rejoinder Addressed to</th>
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc">Addressee Address</th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc">Other Details of Addressee</th>
                        <th class="childnoticeandreplyreference" data-column="NoticeandReplyReference" data-order="desc">Notice and Reply Reference</th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc">Rejoinder Through</th>
                        <th class="childcurrentstatus" data-column="CurrentStatus" data-order="desc">Current Status</th>
                        <th class="childdateofcreatingrejoinder" data-column="DateofCreatingRejoinder" data-order="desc">Date of Creating Rejoinder</th>
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
        formData.append("PageNumber", EncodeText(pageindex));
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
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                                if (a.TotalRows <= response.length) {
                                }
                                else if (pageno == 1) {
                                }
                                else if (pageno == totpage) {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                                }
                                else {
                                    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
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
function fnViewmorereplytonotice(mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/RejoinderHome"
    sessionStorage.setItem("mainnoticeid", mainnoticeid);
}
/*View file log*/
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
/*Edit settled notice*/
function EditNotice(noticeid) {
    window.location.href = "/NoticeNew/Insert"
    sessionStorage.setItem("NoticeId", noticeid)
}
var approvalnoticeid = "";
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
$(".assignto").change(function () {
    Getmanagerlist();
})
/*View more content details*/
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
/*Get manager list details*/
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
                    alert("Something went wrong.")
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
            }
        })
    }
})
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
    sessionStorage.removeItem("NoticeId");
};
var DelNoticeId = "";
var ConfirmDelete = function (NoticeID) {
    DelNoticeId = NoticeID;
    $("#myModal").modal('show');
}
/*Delete notice details*/
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
