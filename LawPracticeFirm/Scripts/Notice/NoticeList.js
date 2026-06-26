var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
var start = "";
var end = "";
var fromdaterange = false;
var fromreminder = false;
var remindernoticeid = "";
var callapiresponse = "";
var companycountdata = 0;
var editcountdata = 0;
var countdata = 0;
var duedatenotification;
var dynamicFieldCount = 0;
var arrcolmenuseleciton = [];
var arrcolmenuselecitonfix = [];
const statusClassMap = {
    "converted to matter": "Convertedmatter",
    "active": "active1",
    "settled": "Settled",
    "inactive": "InActive"
};
const priorityClassMap = {
    "low": "low",
    "medium": "medium",
    "high": "high",
};
$(document).ready(function () {
    //document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $('#Delete_final').off('click').on('click', function () {

        var noticeid = $(this).data('noticeid');

        formdata = new FormData();
        formdata.append("NoticeId", EncodeText(noticeid))
        formdata.append("deleteflag", EncodeText("1"))
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/NoticeDelete",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (result) {
                $('#myModalDeleteconfirmation').modal('hide');

                if (result) {
                    alert("Record deleted successfully.");
                    isRenderPage = false;
                    callapi();
                }
                else {
                    alert("Something went wrong.")
                }
            }
        })
    });

    $('#archivesingle_final').off('click').on('click', function () {
        var noticeid = $(this).data('noticeid');

        var formData = new FormData();
        formData.append("archivenoticeid", EncodeText(noticeid));
        formData.append("IsArchive", EncodeText(true));

        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/ArchiveNotice',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                $('#myModalmarkArchiveconfirmation').modal('hide');

                if (response) {
                    alert("Notice moved to archive successfully.");
                    isRenderPage = false;
                    callapi();
                } else {
                    alert("Something went wrong.");
                }
            },
            error: function () {
                $('#myModalmarkArchiveconfirmation').modal('hide');
                alert("Something went wrong.");
            }
        });
    });
    $("#ColumnSelectionopen").click(function () {
        $('#myModalCustomizedcolumn').modal({ show: true });

    });
    document.querySelector(".pagination").style.display = "none";
    try {
        sessionStorage.removeItem("NoticeId")

    }
    catch (ex) {

    }

    $("#dynamicnotiheader").html("Notices");
    ploadtabledata();
    /**multi select bind */
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
    jQuery('#txtreplyrecivedthrough').multiselect({
        columns: 1,
        search: true,
        selectAll: true
    });
    jQuery('#txtreplyModeOfDelievery').multiselect({
        columns: 1,
        search: true,
        selectAll: true
    });
    jQuery('#Modesofdeleverypost').multiselect({
        columns: 1,
        search: true,
        selectAll: true
    });
    GetNoticestatusForDropdown();
    /*Pagination Start*/


    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    PageNumber = setPageNo;
    //    callapi();
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
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

    $(document).on("click", "#next", function ()  {
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
        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage = false;
        PageNumber = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

});
/*Load Custom field data*/
function ploadtabledata() {
    var $table = '';
    var $header = '';
    var $head1 = '';
    var dt = '';
    var q1 = 2;
    var Iscustomflag = 0;
    var columnvalue = 0;
    var sort = 18;
    var type = 12;
    openload();
    var rt1 = $.ajax({
        async: false,
        type: 'POST',
        url: '/api/demo/FirmEmployees1',
        headers: {
            'configurationtype': type
        },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (response) {
            if (response.Status == true) {
                var obj = JSON.parse(response.Data);
                countcustomfoeld = obj.length;
                var $header = "";
                var option = "";
                $.each(obj, function (i, val) {
                    q1 = q1 + 1;
                    Iscustomflag = Iscustomflag + 1;
                    columnvalue = columnvalue + 1;
                    sort = sort + 1;
                    $header += '<th  class="Class' + q1 + '"><div class="thbg"><div style="float:left;width:100%"><input class="" id=customfieldsfilter' + q1 + ' type="text" placeholder="' + val.FieldName + '" name="Class' + q1 + '" disabled style="width:100%" ></div></div></th>';
                    //End
                    option += '<li data-subject="' + capitalizeFirstLetter(val.FieldName) + '"><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                });
                $header += '<th class="actioncase"><div class="thbg"><p style="width:130px;">Action</p></div></th>';
                $('#newnoticeheadrow').append($header);
                $("#od").append(option);
                SortData();
                var option1 = '<li><input id="select_allcfield"   type="checkbox"   ><a href="#">Select All</a></li>';
                $("#od").append(option1);
                callapi();
            }
            else {
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}
/**
 * Load Notice details
 * */
function callapi() {
    if (PageNumber == "") {
        PageNumber = 1;
    }
    openload();
    var html = '';
    var notistatus1 = "";
    var formData = new FormData();
    var sendernamesearch = $("#noticebyIds").val();
    var Noticesubjectsrc = $("#noticeSubjects").val();
    var Noticetitlesrc = $("#noticeTitless").val();
    var Noticetypesrc = $("#ddlnoticetypess").val();
    var txtStatusOfNotice = $("#txtStatusOfNotice").val();
    if (txtStatusOfNotice == null) {
        txtStatusOfNotice = "";
    }
    var othdetailsofsender = $("#othdetailsofsender").val();
    formData.append("SearchValue", EncodeText(othdetailsofsender));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("sendername", EncodeText(sendernamesearch));
    formData.append("addressedto", EncodeText(""));
    formData.append("noticethrough", EncodeText(""));
    formData.append("notistatus", EncodeText(notistatus1));
    formData.append("fromdaterange", EncodeText(fromdaterange));
    formData.append("startdate", EncodeText($("#rangefromdate").val()));
    formData.append("enddate", EncodeText($("#rangetodate").val()));
    formData.append("fromreminder", EncodeText(fromreminder));
    formData.append("noticeid", EncodeText(remindernoticeid));
    formData.append("Noticesubjectsrc", EncodeText(Noticesubjectsrc));
    formData.append("Noticetitlesrc", EncodeText(Noticetitlesrc));
    formData.append("Noticetypesrc", EncodeText(Noticetypesrc));
    formData.append("CaseNoticeStatus", EncodeText(txtStatusOfNotice));
    formData.append("IsArchived", EncodeText(""));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeList",
        contentType: false,
        processData: false,
        async: false,
        data: formData,
        success: function (response) {
            
            openload();
            $("#tablevalue").html("");
            $("#noticetbldashboardfooter").html("");
            $("#nonotice").html("");
            if (response.Data == "[]" || response.Data == "" || response.Data == "null" || response.Data == null) {
               
                var htmls = '<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No sent notice list found</h4>' +
                    '<p>We found no sent notice list.</p>' +
                    '</div>';
                $("#nonotice").append(htmls);
                isRenderPage = false;

                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
                closeload();
                return false;
            }
            else {
                
                var obj = JSON.parse(response.Data);
    
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });
 //document.querySelector(".pagination").style.display = "flex"; // Ensure it's visible when data exists
                
                $.each(obj, function (i, a) {
                    var amountclaimed = a.AmountClaimed == "0" || a.AmountClaimed == null ? "" : a.AmountClaimed;
                    if (i === 0) {
                        firstvalue = a.RowId;
                    }
                    var totpage = 0;
                    if (i === (obj.length - 1)) {
                        var totdata = a.TotalRows;
                        $('#tonotice').text(totdata);
                        $('#setNotice').text(a.SetteldCount); 
                        $('#contomatNotice').text(a.ConvertedtoMatter);
                        //For Total Grid Count
                        $("#AllNoticeCount").text("(" + totdata + ")");
                        
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (PageNumber == totpage) {
                            $('#next').hide();
                            //$('#next').css("display", "none");
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





                        //var pnext = PageNumber;
                        //var pprev = PageNumber;
                        //var pageno = PageNumber;
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
                        //tfot += '<li>pages ' + PageNumber + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a type="button" class="gobtn" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a> </li>'
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
                        //$("#noticetbldashboardfooter").append(tfot);
                    }
                    var span = document.createElement('span');
                    span.innerHTML = a.CreateNotice;
                    var trval = "";
                    if ((dateFormat(new Date()) == dateFormat(new Date(a.DueDateOfNotice)))) {
                        trval = "<tr class='tbltrcls " + a.NoticeID + "' Id='trcolhighlighbydate'>";
                    }
                    else {
                        trval = "<tr class='tbltrcls " + a.NoticeID + "'>";
                    }
                    html += trval;
                    html += "<td><input type='checkbox' name='checkAll' class='checkSingle' value='" + a.NoticeID + "'></td>";
                    html += "<td>" + a.RowId + "</td>";
                    if (a.IsReplyReceivedCount > 0) {
                        html += "<td  class='noticeby'>" + a.SendersName + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor:pointer; ' onclick=ViewMoreItem1('" + a.NoticeID + "','" + (a.CaseStatus) + "')></span></td>";
                    }
                    else {
                        html += "<td  class='noticeby'>" + a.SendersName + "</td>";
                    }
                    html += "<td class='senderaddress' >" + a.SendersAddress + "</td>";
                    html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                    html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                    html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                    html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                    html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                    html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                    html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                    var tempnoticedate = dateFormat(new Date(a.DateofNotice));
                    if (tempnoticedate != "01 Jan 1970" && tempnoticedate != '01 Jan 1900') {
                        html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                    }
                    else {
                        html += "<td  class='noticedate'></td>";
                    }
                    html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                    html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                    const priorityKey = (a.Criticality || "").toLowerCase();
                    if (priorityClassMap[priorityKey]) {
                        html += `<td class="criticality"><div class="status_badge"><span class="${priorityClassMap[priorityKey]}"></span>${a.Criticality || ""}</div></td>`;
                    }
                    else {
                        html += "<td  class='criticality'>" + (a.Criticality == 0 ? '' : a.Criticality) + "</td>";
                    }
                    //html += "<td  class='criticality'>" + (a.Criticality == 0 ? '' : a.Criticality) + "</td>";
                    html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                    if (a.CreateNotice.length > 5) {
                        html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                    }
                    else {
                        html += "<td  class='remark'>" + span.innerText + "</td>";
                    }
                    var tempduedate = dateFormat(new Date(a.DueDateOfNotice));
                    if (tempduedate != "01 Jan 1900") {
                        html += "<td  class='noticeduedate'>" + dateFormat(new Date(a.DueDateOfNotice)) + "</td>";
                        var duedatenotification = dateFormat(new Date(a.DueDateOfNotice))
                    }
                    else {
                        html += "<td  class='noticeduedate'></td>";
                    }
                    const statusKey = (a.CaseStatus || "").toLowerCase();
                    if (statusClassMap[statusKey]) {
                        html += `<td class="pending"><div class="status_badge"><span class="${statusClassMap[statusKey]}"></span>${a.CaseStatus || ""}</div></td>`;
                    }
                    else {
                        html += "<td class='pending'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";
                    }
                    //if (a.CaseStatus == "Converted to Matter") {
                    //    html += "<td class='Convertedmatter'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";

                    //}
                    //else if (a.CaseStatus == "Active") {
                    //    html += "<td class='active'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";

                    //}
                    //else if (a.CaseStatus == "Settled") {
                    //    html += "<td class='Settled'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";

                    //}
                    //else if (a.CaseStatus == "InActive") {
                    //    html += "<td class='InActive'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";

                    //}
                    //else;
                    html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                    html += "<td  class='tags'>" + a.Tag + "</td>";
                    html += "<td  class='noticeTrackingId'>" + a.ConsignmentNum + "</td>";
                    html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                    html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";
                    if (a.IsOtherDetailsOfReceiver > 0) {
                        html += "<td  class='Receiverdetails'><a href='#' onclick=viewreceiverdetails('" + a.NoticeID + "') title='View more'>View</a></td>";
                    } else {
                        html += '<td class="Receiverdetails"></td>';
                    }
                    html += "<td  class='ReferenceNumber'>" + a.NoticeReference + "</td>";
                    html += "<td  class='InternalNumber'>" + a.IntNoticeReference + "</td>";
                    html += "<td class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                    html += "<td class='deliveryDispatch'>" + (a.NoticeSentToClientDate == null || a.NoticeSentToClientDate == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeSentToClientDate))) + "</td>";
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
                    html += '<td class="attachment"><i title="View notice draft" aria-hidden="true"  id="noticerelevantdoc1" style="cursor:pointer;" onclick=ViewNoticeDraft("' + a.NoticeID + '") id-type="CreateNotice"><img src="/newassets/img/folder-icon.png" /></i></td>';
                    html += "" + bindCustomizehtml + "";
                    if (String(a.IsLinkToMatter) == "1") {
                        html += "<td><a style='cursor:pointer;' data-val='" + a.NoticeID + "'  title='View Matter Dashboard' id='transferpage' href='javascript:void()' sno='" + a.MatterId + "'><img src='/newassets/img/view-icon.png' /></a>" + '' + '<a style="cursor:pointer;"onclick="MoveToArchive( \'' +
                            a.NoticeID + '\',\'' + a.NoticeTitle +'\')" title="Archive">' +
        '<img src="/newassets/img/archive-icon.png" /></a>' + "</td>";
                    }
                    else if (String(a.CaseStatus) == "Converted to Matter") {
                        if ($('#hdnLMPack').val() == 'display:unset') {
                            html += "<td><a style='cursor:pointer;' data-val='" + a.NoticeID + "' IsLinkToMatter ='" + a.IsLinkToMatter + "' id='linkmatter' title='Connect to Matter'><img src='/newassets/img/connect-icon.png' /></a>" + '' + '<a style="cursor:pointer;" onclick="MoveToArchive( \'' +
                                a.NoticeID + '\',\'' + a.NoticeTitle +'\')" title="Archive">' +
        '<img src="/newassets/img/archive-icon.png" /></a>' + "</td>";
                        } else {
                            html += "<td><div class='glyphicon glyphicon-link' style='color:#0059c1;text-align:left;cursor:pointer;' data-val='" + a.NoticeID + "' IsLinkToMatter ='" + a.IsLinkToMatter + "' id='linkmatter1' title='Converted to matter'></div>" + '' + '<a style="cursor:pointer;" onclick="onclick="MoveToArchive( \'' +
                                a.NoticeID + '\',\'' + a.NoticeTitle +'\')" title="Archive">' +
        '<img src="/newassets/img/archive-icon.png" /></a>' + "</td>";
                        }
                    }
                    else if (a.CaseStatus == "Settled") {
                        html += '<td><a style="cursor:pointer;"onclick="MoveToArchive( \'' +
                            a.NoticeID + '\',\'' + a.NoticeTitle +'\')" title="Archive">' +
                            '<img src="/newassets/img/archive-icon.png" /></a></td>';
                    }
                    else {
                        html += '<td class="actioncase" style="display: table-cell;">';
                        //html += '<ul class="action-ul"><li><button  type="button   onclick=EditNotice("' + a.NoticeID + '") title="Edit Notice" style="border-radius: 8px; padding: 5px;"><span><img src="/newassets/img/edit-icon.png" height="32" width="32"></span</button>  <button><a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("' + a.NoticeID + '") title="Share Notice"></a></button>|<a href="#" onclick=fnsetnotificationalert("' + a.NoticeID + '","' + "Sent" + '") title="Set alert"><span class="glyphicon glyphicon-bell" style="padding:0;"></span></a>|</li>'
                        html += '<ul class="action-ul">'
                            + '<li>'
                            + '<button type="button" onclick="EditNotice(\'' + a.NoticeID + '\')" title="Edit Notice">'
                            + '<span><img src="/newassets/img/edit-icon.png" height="32" width="32"></span>'
                            + '</button></li>'

                            + '<li><button type="button" onclick="SendApproval(\'' + a.NoticeID + '\')" title="Share Notice">'
                            + '<span style="cursor:pointer;"><img src="" /><img src="/newassets/img/share-icon.png" /></span>'
                            + '</button></li>'

                            + '<li><button type="button" onclick="fnsetnotificationalert(\'' + a.NoticeID + '\', \'Sent\')" title="Set Alert"> <a href="#"  >'
                            + '<spanstyle="cursor:pointer;"><img src="/newassets/img/bell-icon.png" /></span>'
                            + '</button>'

                            + '</li>';

                        html += '<li><div class="dropdown">'
                            + '<button class="dropdown-toggle" id="menu1" type="button" data-toggle="dropdown" title="More Actions">'
                            + '<img src="/newassets/img/more-action.png" height="32" width="32">'
                            + '</button>'
                            + '<ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">'

                            // Add Details Button
                            + '<li>'
                            + '<button type="button" onclick="AddInComingReply(\'' + a.NoticeID + '\')" title="Add Details: Reply To Notice Received" style="border: none; background: none;cursor: pointer;font-size: inherit;font-weight: normal;white-space: nowrap;">'
                            + '<div><span style="padding:0 3px 0 0;"><img src="/newassets/img/plus-icon-black.png" /></span>Add Details</div>'
                            + '</button>'
                            + '</li>'

                            // View Feedback Button
                            + '<li>'
                            + '<button type="button" onclick="fnviewlog(\'' + a.NoticeID + '\', \'3\')" title="View Feedback" style="border: none; background: none;cursor: pointer;font-size: inherit;font-weight: normal;white-space: nowrap;">'
                            + '<div><span style="padding:0 3px 0 0;"><img src="/newassets/img/vewdetails.png" /></span>View Feedback</div>'
                            + '</button>'
                            + '</li>';

                         /*   + '</ul></li>';*/
                        
                        if (a.TrackingId != "") {
                            html += '<li>' +
                                '<button style="border: none;background: none;cursor: pointer;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:3px;" onclick=DocumnetSend("' + a.NoticeID + '") title="Upload Document"><img src="/newassets/img/uploaddocument-icon.png" /> Upload Document</button>' +
                                '</li><li>' +
                                '<button style="cursor:pointer; border: none;background: none;cursor: pointer;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:5px;" onclick=fnfillNoticePostDetails("' + a.NoticeID + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title="Save Dispatch Details"><img src="/newassets/img/save-btn-icon.png" /> Save Dispatch Details</button>' +
                                '</li><li>' +
                                '<button style="cursor:pointer; border: none;background: none;cursor: pointer;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:5px;" onclick=SearchPostDetailsnew("' + a.TrackingId + '","' + a.NoticeID + '") title="Speed Post Tracking"><img src="/newassets/img/search-lg.png" /> Speed Post Tracking</button>' +
                                '</li><li>' +
                                '<button style="cursor:pointer; border: none;background: none;cursor: pointer;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:3px;" onclick=ClouserNotice("' + a.NoticeID + '") title="Mark Status"><img src="/newassets/img/mark-status.png" /> Mark Status</button>' +
                                '</li><li>' +
                                '<button style="cursor:pointer;border: none;background: none;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:5px;" ' +
                                'onclick="MoveToArchive( \'' + a.NoticeID + '\',\'' + a.NoticeTitle +'\')">' +
                                '<img src="/newassets/img/archive.png" /> Archive</button>' +
                                '</li><li>' +
                                 '<button style="cursor:pointer; border: none; background: none; font-size: inherit; font-weight: normal; text-align: left; white-space: nowrap; padding-bottom:5px;" ' +
                                'onclick="ConfirmDelete( \'' + a.NoticeID + '\',\'' + a.NoticeTitle +'\')" title="Delete">' +
                                    '<img src="/newassets/img/deletematter.png" /> Delete</button>'+

                                '</li></ul></div></li></ul>';
                        }

                   
                        else {
                            html += '<li>' +
                                '<button style="border: none;background: none;cursor: pointer;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:3px;" onclick=DocumnetSend("' + a.NoticeID + '") title="Upload Document"><img src="/newassets/img/uploaddocument-icon.png" /> Upload Document</button>' +
                                '</li><li>' +
                                '<button style="cursor:pointer; border: none;background: none;cursor: pointer;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:5px;" onclick=fnfillNoticePostDetails("' + a.NoticeID + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title="Save Dispatch details"><img src="/newassets/img/save-btn-icon.png" /> Save Dispatch Details</button>' +
                                '</li><li>' +                      
                                '<button style="cursor:pointer; border: none;background: none;cursor: pointer;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:5px;" onclick=ClouserNotice("' + a.NoticeID + '") title="Mark Status"><img src="/newassets/img/mark-status.png" /> Mark Status</button>' +
                                '</li><li>' +
                                '<button style="cursor:pointer;border: none;background: none;font-size: inherit;font-weight: normal;text-align: left;white-space: nowrap; padding-bottom:5px;" onclick="MoveToArchive( \'' +
                                a.NoticeID + '\',\'' + a.NoticeTitle +'\')" title="Archive">' +
                                '<img src="/newassets/img/archive.png" /> Archive</button>' +
                                '</li><li>' +
                                '<button style="cursor:pointer; border: none; background: none; font-size: inherit; font-weight: normal; text-align: left; white-space: nowrap; padding-bottom:5px;" ' +
                                'onclick="ConfirmDelete( \'' + a.NoticeID + '\',\'' + a.NoticeTitle +'\')" title="Delete">' +
        '<img src="/newassets/img/deletematter.png" /> Delete</button>' +
                                '</li></ul></div></li></ul>';
                        }
                    }
                    html += "<tr>"
                });
                $("#tablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () { 
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                closeload();
            }
        },
        error: function (xhr) {
            alert('error');
            closeload();
        }
    });
};
/**Sort custom field data */
function SortData() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od").
            appendChild(e));
}

//Pagination
var isRenderPage = false;
var totalPageRec = "";
//function renderPagination(ps, totdata) {

//    let totPages = totdata;
//    setPageNo = ps;
//    totalPageRec = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis
//    if (totdata <= maxVisible + 2) {
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn ${i === ps ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (ps <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === ps ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === ps ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        }
//    }
//    $("#pageNumbers").html(paginationHtml);
//    $("#prev").toggleClass("disabled", ps === 1);
//    $("#next").toggleClass("disabled", ps === totdata);
//    isRenderPage = true;
//}


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

/**
 * Compare Data
 * @param {any} a
 * @param {any} b
 */
function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}
/**
 * Get Notice status
 * */
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
            $("#txtStatusOfNotice").append($("<option></option>").val("").text('Status'));
            $("#ddlnoticestatus").html("");
            $("#ddlnoticestatus").append($("<option></option>").val("").text('Status'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#txtStatusOfNotice").append($("<option data-id=" + value.Id + " ></option>").val(value.Name).text(value.Name));
                    $("#ddlnoticestatus").append($("<option data-id=" + value.Id + "></option>").val(value.Id).text(value.Name));
                });
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/**
 * Date Format
 * @param {any} d
 */
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
//function changePage(page) {
//    PageNumber = page;
//    callapi();
//}
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
    pageindex = $(this).attr("index");
    changePage(pageindex);
});
function openload() {
    $('#myOverlay').css("display", "block");
}
function closeload() {
    $('#myOverlay').css("display", "none");
}
/**Bind calender */
function bindcalender() {
    start = moment();
    end = moment();
    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }
    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
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
/**
 * Search by date
 * @param {any} e
 */
function fnsearchbydate(e) {
    var fromdate = $("#rangefromdate").val();
    var rangetodate = $("#rangetodate").val();
    if (fromdate == "") {
        alert("Please seclect from date!");
        return false;
    }
    if (rangetodate == "") {
        alert("Please seclect to date!");
        return false;
    }
    if (rangetodate < fromdate) {
        alert("To date is greater than from date!");
        return false;
    }
    start = formatDateNew(fromdate);
    end = formatDateNew(rangetodate);
    fromdaterange = true;
    $("#btclear").show();
    isRenderPage = false;
    callapi();
}
/**
 * Clear Input details
 * @param {any} e
 */
function fnclearinput(e) {
    $("#rangefromdate").val('');
    $("#rangetodate").val('');
    $("#btclear").hide();
    fromdaterange = false;
    isRenderPage = false;

    callapi();
}
/**
 * Format new date
 * @param {any} date
 */
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
$('div .dropdown-menu').on('click', function (event) {
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});
/** Change status of notice*/
$(document).on('change', '#txtStatusOfNotice', function () {
    isRenderPage = false;

    callapi();
});
$(document).on('change', '#ddlnoticetypess', function () {
    isRenderPage = false;

    callapi();
})

/*Capitalize custom field first data*/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
$(document).on('change', '#select_allcfield', function () {
    if ($(this).is(':checked')) {
        $('.chkdhide').each(function () {
            if ($(this).prop('checked')) {
                var column = "." + $(this).attr("name");
                $(column).toggle();
            }
        });
    }
    else {
    }
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
    isRenderPage = false;

    callapi();
});
$(document).on('change', '#receiverEmailidd', function () {
    var textvalues = $(this).val();
    if (textvalues == "Other") {
        $("#receiverEmailiddother").val('');
        $("#receiverEmailidddiv").show();
    }
    else {
        $("#receiverEmailidddiv").hide();
    }
});
/**
 * View more details
 * @param {any} noticeid
 */
function ViewNoticeDraft(noticeid) {
    $("#NoticeDraftModal").modal('show');
    $("#Prime").show();
    $("#Second").hide();
    $("#primeSectionData").show();
    $("#SecondDataSection").hide();

    $("#draftnoticemodlbody").html('');
    $("#receiverEmailidd").html('');
    $("#receiverEmailiddother").val('');
    $("#receiverEmailidddiv").hide();
    $("#spanEmailId").hide();
    $("#noticemailaudit").html('');
    $("#nonoticemailaudit").html('');
    var html = '';
    var html1 = '';
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
                    $('#lbltitle').val(data.NoticeTitle);
                    var path = "/DownloadFile.ashx?ftoken=" + data.Id + "&module=DraftNotice";
                    html += `<tr>
                        <td><input type='checkbox' name='checkAll' class='checkboxcls' value='`+ data.Filename + `' data-val='` + noticeid + `'> </td>
                       
                        <td>`+ dateFormat(new Date(data.CreatedDate)) + `</td>
                        <td> <span>Version - ` + len + `</span></td>
                        <td>`+ data.CreatedByName + `</td>
                         <td> <a href=` + path + ` download="Version - ` + len + `"><img src="/newassets/img/download-icon.png" /></a></td>
                        <tr/>`
                    len = (len - 1);
                })
                $("#draftnoticemodlbody").html(html);
            }
            else {
                $("#nodraftnotice").append("No records found.");
            }
            if (response.Data[1].length > 0) {
                $.each(response.Data[1], function (key, data) {
                    html1 += `<tr>
                        <td>`+ data.DisplayFileName + `</td>
                        <td>`+ data.SentFromMailId + `</td>
                        <td>`+ data.SentToMailId + `</td>
                         <td>`+ data.MailStatusMessage.replace('On', '') + `</td>
                        <td>`+ dateFormat(new Date(data.MailSentTime)) + `</td>
                        <tr/>`
                    len = (len - 1);
                })
                $("#noticemailaudit").html(html1);
            }
            else {
                $("#nonoticemailaudit").append("No records found.");
            }
            if (response.Data[2].length > 0) {
                $("#receiverEmailidd").html("");
                $("#receiverEmailidd").append($("<option></option>").val("").text('Select email'));
                $("#receiverEmailidd").append($("<option></option>").val("Other").text('Others'));
                $.each(response.Data[2], function (key, data) {
                    if (data.ReceiverEmails != "") {
                        $("#receiverEmailidd").append($("<option data-id=" + data.Id + "></option>").val(data.ReceiverEmails).text(data.ReceiverEmails));
                    }
                })
            }
            else {
                $("#receiverEmailidd").append($("<option></option>").val("").text('Select email'));
                $("#receiverEmailidd").append($("<option></option>").val("Other").text('Others'));
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
/**
 * Search new post details
 * @param {any} trackingId
 * @param {any} Noticeidss
 */
function SearchPostDetailsnew(trackingId, Noticeidss) {
    $("#ViewMultiplePostdetils").modal('show');
    $("#Trackingnumberlist").html('');
    var formData = new FormData();
    formData.append("paramNoticeId", EncodeText(Noticeidss));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/ViewSpeedPostDetailByNoticeId',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            $("#Trackingnumberlist").append($("<option></option>").val("").text('Please Select'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#Trackingnumberlist").append($("<option></option>").val(value.TrackingId).text(value.consignementnum));
                })
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
$(document).on('click', '#btnsearchconsignment', function () {
    var trackingId = $("#Trackingnumberlist option:selected").val();
    if (trackingId == "") {
        alert("No Consignment No. found.")
        return false;
    }
    var formData = new FormData();
    formData.append("paramtrakingId", EncodeText(trackingId));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/ViewNoticePostDetail',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response1) {
            var response = response1.Data;
            if (response != null) {
                if (response.vText != null && response.vText != "" && response.vText != "null") {
                    const winHtml = `<!DOCTYPE html>
                    <html>
                    <head>
                    <title>Window with Blob</title>
                    </head>
                    <body><style>
                    #postofficetrackdiv #ctl00_PlaceHolderMain_ucNewLegacyControl_lnkFAQ,#ctl00_PlaceHolderMain_ucNewLegacyControl_lblQuickHelp,#ctl00_PlaceHolderMain_ucNewLegacyControl_lblRequiredField{display:none}
                    #postofficetrackdiv h1{
                    text-align:center;
                    }
                    #postofficetrackdiv {
                    font-family: Arial, Helvetica, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                    }
                    #postofficetrackdiv .btn{display:none;}
                    #postofficetrackdiv table td, #postofficetrackdiv table th {
                    border: 1px solid #ddd;
                    padding: 8px;
                    }
                    #postofficetrackdiv table tr:nth-child(even){background-color: #f2f2f2;}
                    #postofficetrackdiv table tr:hover {background-color: #ddd;}
                    #postofficetrackdiv table{
                    width:100%;
                    }
                    #postofficetrackdiv table th {
                    padding-top: 5px;
                    padding-bottom: 5px;
                    text-align: left;
                    background-color: #aa042a;
                    color: white;
                    }
                    </style>
                    <div id="postofficetrackdiv">
           `+ response.vText + `   </div>     </body>
    </html>`;
                    const winUrl = URL.createObjectURL(
                        new Blob([winHtml], { type: "text/html" })
                    );
                    const win = window.open(
                        winUrl,
                        "win",
                        `width=800,height=400,screenX=200,screenY=200`
                    );
                }
                else {
                    alert("Details are being fetched. Please wait.");
                }
            }
            else {
                alert("Details are being fetched. Please wait.");
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
});
var closurenoticeid = "";
function ClouserNotice(noticeid) {
    closurenoticeid = noticeid;
    $('#markstatusreset')[0].reset();
    $("#ActualclosurModal").modal('show');
    var formData = new FormData();
    formData.append("closurenoticeid", EncodeText(closurenoticeid));
}
/**Save closure date*/
$(document).on('click', '#saveclosuedate', function () {
    var closuredate = $("#dateofclosure").val();
    var ddlnoticestatus = $("#ddlnoticestatus").val();
    if (ddlnoticestatus == "" || ddlnoticestatus == "notice status") {
        alert("Please select notice status")
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
var noticeIddod = "";
function fnfilterdata(param, paramid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeNew/Filter";
    sessionStorage.setItem("param", param);
    sessionStorage.setItem("paramid", decodeURIComponent(paramid));
}
var outnoticeidd = "";
function AddInComingReply(outnoticeid) {
    outnoticeidd = outnoticeid;
    $('#receivedreplyform')[0].reset();
    $("#ReceivedReplyModal").modal('show');
}
/*Add reply notice details*/
$("#savereplytonotice").click(function () {
    var noticeid = outnoticeidd;
    var txtreplyreciveddate = $("#txtreplyreciveddate").val();
    var txtnoticethroughs = $("#txtreplyrecivedthrough option:selected").map(function (i, el) {
        return $(el).val();
    }).get().join(',');
    var txtsetreplydate = $("#txtsetreplydate").val();
    var txtnoticethroughs = $('#txtreplyrecivedthrough').val();
    var modeofdeleiveryreply = $('#txtreplyModeOfDelievery').val();
    var txtsetreplytxtreplydateofnotice = $("#txtreplydateofnotice").val();
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
    formData.append("noticeid", EncodeText(noticeid));
    formData.append("txtreplyreciveddate", EncodeText(txtreplyreciveddate));
    formData.append("hiddenreplynoticeid", EncodeText($("#hiddenreplynoticeid").val()));
    formData.append("txtsetreplydate", EncodeText(txtsetreplydate));
    formData.append("txtreplyrecivedthrough", EncodeText(txtnoticethroughs));
    formData.append("replymodeofdelvivery", EncodeText(modeofdeleiveryreply));
    formData.append("DateOfReplytxt", EncodeText(txtsetreplytxtreplydateofnotice));
    formData.append("FileUpload", EncodeText(file));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/AddIncomingNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.Data.message != null) {
                alert(data.Data.message);
            }
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
var noticeIdFinalStatus = "";
function FinalApproved(noticeId) {
    noticeIdFinalStatus = noticeId
    $("#FinalStatusModal").modal('show');
}
/**Save final status details*/
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
    var filetype = $(this).attr("id-type");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=" + filetype + "&data=" + fileid + "&mode=" + mode;
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
/**
 * Add Create reply
 * @param {any} noticeid
 * @param {any} mainnoticeid
 */
function AddCreateReply(noticeid, mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.localStorage.setItem("NType", "Sent")
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice?Id=" + noticeid + "&Main=" + mainnoticeid + "&InitiatedBy=plaintiff";
}
/**View more details */
var childtblclickcount1 = 0;
function ViewMoreItem1(parentId, CaseStatus = null) {
    var hidedivaction = "";
    if (CaseStatus == "Converttocase" || CaseStatus == "Settled") {
        hidedivaction = "display:none";
    }
    else {
        hidedivaction = "";
    }
    if (childtblclickcount1 == 1) {
        $("#childtbltr1").remove();
        childtblclickcount1 = 0;
    }
    else {
        childtblclickcount1 = 1;
        $(`<tr id="childtbltr1"><td colspan="11"><div id="tblincmingnotice" class="table-panel table-responsive poptable" data-example-id="hoverable-table">
          <h2>REPLY</h2>
         <table class= "tblreplyclass" id="table`+ parentId + `">
        <thead>
            <tr class="childtbltr1cls">
                            <th class="childtbltsssr1cls"><div class="thbg">No.</div></th>
                            <th class="fromreceiver"><div class="thbg">From</div></th>
                            <th class="childtbltsssr1cls"><div class="thbg">Date Of Reply</div></th>
                            <th class="receivedreplydate childtbltsssr1cls"><div class="thbg">Reply Received On</div></th>
                            <th class="dateofreplycls childtbltsssr1cls"><div class="thbg">Set Date for Rejoinder</div></th>
                            <th class="modeofdelivery childtbltsssr1cls"><div class="thbg">Mode</div></th>
                            <th class="receivedreplythrough childtbltsssr1cls"><div class="thbg">Notice Through/To</div></th>
                            <th class="receivedreplydoc childtbltsssr1cls"><div class="thbg">Docs</div></th>
                            <th class="receivedreplyaction childtbltsssr1cls" style=`+ hidedivaction + `><div class="thbg">Action</div></th>
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
                if (response.Data.length == 0) {
                    isRenderPage = false;

                    callapi();
                }
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
                        $.each(response.Data.reverse(), function (i, a) {
                            var trval = "";
                            if ((dateFormat(new Date()) == dateFormat(new Date(a.Setdateofreply)))) {
                                trval = "<tr class=" + a.Id + " style='background-color:#fff;' id=reminderhighlighcls>";
                            }
                            else {
                                trval = "<tr class=" + a.Id + ">";
                            }
                            html += trval;
                            if (a.IsReplyReceivedCount > 0) {
                                html += "<td>" + a.RowId + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor: pointer;position:relative;left:5px' onclick=ViewMoreItem('" + a.Id + "')></span></td>";
                            }
                            else {
                                html += "<td>" + a.RowId + "</td>";
                            }
                            html += '<td class="fromreceiver">' + a.ReceiverName + '</td>'
                            html += "<td>" + (a.DateOfReply == null ? ' ' : dateFormat(new Date(a.DateOfReply))) + "</td>";
                            html += "<td class='receivedreplydate'>" + (a.ReceivedDate == null ? ' ' : dateFormat(new Date(a.ReceivedDate))) + "</td>";
                            if (a.Setdateofreply == "1900-01-01T00:00:00") {
                                html += "<td></td>"
                            }
                            else {
                                html += "<td>" + (a.Setdateofreply == null ? ' ' : dateFormat(new Date(a.Setdateofreply))) + "</td>";
                            }
                            if (a.ModeofDelievery == "null") {
                                html += "<td class='modeofdelivery childtbltsssr1cls'></td>";
                            }
                            else {
                                html += "<td class='modeofdelivery childtbltsssr1cls'>" + a.ModeofDelievery + "</td>";
                            }
                            if (a.IsReplyReceivedCount > 0) {
                                html += "<td  class='receivedreplythrough'>" + (a.ReceivedThrogh == "null" ? '' : a.ReceivedThrogh) + "</td>";
                            } else {
                                html += "<td  class='receivedreplythrough'>" + (a.ReceivedThrogh == "null" ? '' : a.ReceivedThrogh) + "</td>";
                            }
                            if (a.IsFileAvailable) {
                                html += '<td class="receivedattachment"><i aria-hidden="true" id="incomingnoticerelevantdoc" style="cursor:pointer;" id-val="' + a.Id + '" id-type="ReplyToNotice"><img src="/newassets/img/folder-icon.png" /></i></td>';
                            }
                            else {
                                html += '<td class="receivedattachment"></td>';
                            }
                            if (CaseStatus == "Converttocase" || CaseStatus == "Settled") {
                            }
                            else {
                                html += '<td class="receivedreplyaction"><a style="cursor:pointer;"  onclick=IncomingEditNotice("' + a.Id + '") title="Edit Received Notice"><img src="/newassets/img/edit-icon.png" /></a><a style="cursor:pointer;" onclick=AddCreateReply("' + a.Id + '","' + a.NoticeId + '") title = "Create Rejoinder" ><img src="/newassets/img/viewmore-icon.png" /></a><a style="cursor:pointer;" onclick=IncomingConfirmDelete("' + a.Id + '") title="Delete"><img src="/newassets/img/deletecasesingle-icon.png" /></a> </td>'
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
/**
 * Edit reply notice
 * @param {any} incomingreplyid
 */
function IncomingEditNotice(incomingreplyid) {
    var formData = new FormData();
    $('#receivedreplyform')[0].reset();
    formData.append("noticeid", EncodeText(""));
    formData.append("incomingreplyid", EncodeText(incomingreplyid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/IncomingNotice',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            $.each(response.Data, function (i, a) {
                $("#ReceivedReplyModal").modal('show');
                $('#txtreplyreciveddate').val((a.ReceivedDate.split("T"))[0]);
                if (a.Setdateofreply != '1900-01-01T00:00:00') {
                    $('#txtsetreplydate').val((a.Setdateofreply.split("T"))[0]);
                }
                if (a.DateOfReply != null) {
                    $('#txtreplydateofnotice').val((a.DateOfReply.split("T"))[0]);
                }
                if (a.ModeofDelievery == "null" || a.ModeofDelievery == null || a.ModeofDelievery == "") {
                }
                else {
                    var selectedOptionsmode = a.ModeofDelievery.split(",");
                    for (var i in selectedOptionsmode) {
                        var optionValmode = selectedOptionsmode[i];
                        $("#txtreplyModeOfDelievery").find("option[value=" + optionValmode + "]").prop("selected", "selected");
                    }
                }
                $("#txtreplyModeOfDelievery").multiselect('reload');
                if (a.ReceivedThrogh == "null" || a.ReceivedThrogh == null || a.ReceivedThrogh == "") {
                }
                else {
                    var selectedReceivedThrogh = a.ReceivedThrogh.split(",");
                    for (var i in selectedReceivedThrogh) {
                        var optionReceivedThrogh = selectedReceivedThrogh[i];
                        $("#txtreplyrecivedthrough").find("option[value=" + optionReceivedThrogh + "]").prop("selected", "selected");
                    }
                }
                $("#txtreplyrecivedthrough").multiselect('reload');
                $("#hiddenreplynoticeid").val(a.Id);
                outnoticeidd = a.NoticeId;
            });
        },
        error: function (response) {
        }
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
/**
 * Delete reply notice
 * @param {any} incomingreplyid
 */
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
/**
 * Notice move to archive list
 * @param {any} noticeid
 */
//function MoveToArchive(noticeid) {
//    debugger
//    if (confirm("Are you sure you want to archive this notice?")) {
//        var formData = new FormData();
//        formData.append("archivenoticeid", EncodeText(noticeid));
//        formData.append("IsArchive", EncodeText(true));
//        $.ajax({
//            type: "POST",
//            url: '/api/NoticeNew/ArchiveNotice',
//            contentType: false,
//            processData: false,
//            data: formData,
//            success: function (response) {
//                if (response) {
//                    alert("Notice move to archive successfully.");
//                    isRenderPage = false;

//                    callapi();
//                }
//                else {
//                    alert("Something went wrong.")
//                }
//            },
//            error: function (response) {
//                alert("Something went wrong.")
//            }
//        })
//    }
//}

function MoveToArchive(noticeid,Noticetitles) {
    // Store the notice ID in a data attribute on the confirm button
    $('#archivesingle_final').data('noticeid', noticeid);
    // Optionally set the matter name in the modal
    $('#id_Archivematternames').text(Noticetitles); // Replace or format as needed

    // Show the modal
    $('#myModalmarkArchiveconfirmation').modal('show');
}


//$('#archivesingle_final').off('click').on('click', function () {
//    debugger
//    var noticeid = $(this).data('noticeid');

//    var formData = new FormData();
//    formData.append("archivenoticeid", EncodeText(noticeid));
//    formData.append("IsArchive", EncodeText(true));

//    $.ajax({
//        type: "POST",
//        url: '/api/NoticeNew/ArchiveNotice',
//        contentType: false,
//        processData: false,
//        data: formData,
//        success: function (response) {
//            $('#myModalmarkArchiveconfirmation').modal('hide');

//            if (response) {
//                alert("Notice moved to archive successfully.");
//                isRenderPage = false;
//                callapi();
//            } else {
//                alert("Something went wrong.");
//            }
//        },
//        error: function () {
//            $('#myModalmarkArchiveconfirmation').modal('hide');
//            alert("Something went wrong.");
//        }
//    });
//});
/**Get Rejoinder notice list details */
var childtblclickcount = 0;
function ViewMoreItem(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="30"><div class="poptable">
<div id="tblpoitem" class="poptable" data-example-id="hoverable-table" style="width:100% !important">
<h2>REJOINDER</h2>
        <table class="table-panel tblrejoinderclass" id="table`+ parentId + `">
        <thead style=" text-align:center;">
            <tr>
                        <th class="childnoticefrom" data-column="Rejoinder" data-order="desc">No.</th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc">Receiver's Name</th>
                        <th class="childrejoindersendername" data-column="Rejoindersendername" data-order="desc">Sender's Name</th>
                        <th class="childrejoindersenderaddress" data-column="Rejoindersenderaddress" data-order="desc">Sender's Address</th>
                       <th class="childrejoinderotherdetailssender" data-column="Rejoinderotherdetailssender" data-order="desc">Other Details of sender</th>
                        <th class="childdateofcreatingrejoinder" data-column="DateofCreatingRejoinder" data-order="desc">Date of Rejoinder</th>
                        <th class="childsenton" data-column="" data-order="desc">Date of Dispatch</th>
                        <th class="childduedate" data-column="" data-order="desc">Due Date</th>
                        <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc">Mode of Delivery</th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc">Notice Text</th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc">Subject</th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc">Title</th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc">Type</th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc">Status</th>
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc">Date of Delivery</th>
                        <th class="childmodeofreceipt" data-column="ModeofReceipt" data-order="desc">Mode of Receipt</th>
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc">RECEIVER'S ADDRESS</th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc">OTHER DETAILS OF RECEIVER</th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc">Notice through/to</th>
                        <th class="childrejoinderconsignmentNo" data-column="RejoinderConsignmentNo" data-order="desc">Consignment No.</th>
                        <th class="childattachment" data-column="childattachment" data-order="desc"><div>docs</div></th>
                        <th class="receivedreplyaction childtbltsssr1cls" >Action</th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonotice"></tbody>
                        </table >
        <center> <div id="noreplytonotice"> </div></center>
</div>
        
                    <div class="settingpanel">
                        <div class="col-md-12" id="footer-data">
                            <div style="float: left;padding: 0 10px 0 0;">
                                <ul>
                                    <li>
                                        <div class="btn-group dropup">
                                            <a href="javascript:void()" class="dropdown-toggle selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="glyphicon glyphicon-cog" style="font-size:14px;color:black;padding:0 5px 0 0 "></span>
                                                Customize Fields
                                            </a>
                                            <ul class="dropdown-menu settingshowhide" id="od" style="width:260px">
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderconsignmentNo"><a href="#">Consignment No.</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofcreatingrejoinder" checked><a href="#">Date of Rejoinder</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdispatched"><a href="#">Date of Delivery </a></li>
<li><input type="checkbox" class="shcheckbox1 chkdhide" name="childsenton" checked><a href="#">Date of Dispatch</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childduedate" checked><a href="#">Due Date</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childattachment" checked><a href="#">docs</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofreceipt"><a href="#">Mode of Receipt</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofdeliveryofrejoinder" checked><a href="#">Mode of Delivery</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderthrough"><a href="#">Notice through/to</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#">Notice Text</a></li>
                                    <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderotherdetailssender" ><a href="#">Other Details of sender</a></li>
                                     <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                                     <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderaddressedto" checked><a href="#" class="dropdown-item">Receiver's Name</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Receiver's Address</a></li>
                                         <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoindersendername" checked><a href="#">Sender's Name</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoindersenderaddress" ><a href="#">Sender's Address</a></li>
                                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending"><a href="#">Status</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject"><a href="#">Subject</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle"><a href="#">Title</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childstatutory"><a href="#">Type</a></li>
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
       </div></td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        var formData = new FormData();
        formData.append("SearchValue", EncodeText(""));
        formData.append("ColumName", EncodeText(ColumName));
        formData.append("SortedOrder", EncodeText(SortedOrder));
        formData.append("PageNumber", EncodeText(1));
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
                                tfot += '<ul style="display:flex">'
                                tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                tfot += '<li style="margin-left:1000px;"><span>|</span></li>'
                                tfot += '<li><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a type="button" id="pgetdatabypagenum" class="gobtn" style="margin-left:10px;cursor:pointer;background-color: #0C4A6E !important;">Go</a> </li>'
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
                            var RSubject = "";
                            if (a.RejoinderSubject == "'") {
                                RSubject = " ";
                            }
                            else {
                                RSubject = a.RejoinderSubject;
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateRejoinder;
                            html += "<tr>";
                            html += "<td  class='childnoticefrom'>" + a.RowId + "</td>";
                            html += "<td class='childrejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                            html += "<td class='childrejoindersendername'>" + a.SendersName + "</td>";
                            html += "<td class='childrejoindersenderaddress'>" + a.SendersAddress + "</td>";
                            html += "<td class='childrejoinderotherdetailssender'>" + a.OtherDetailsofSender + "</td>";
                            html += "<td class='childdateofcreatingrejoinder'>" + (a.DateofCreatingRejoinder == null || a.DateofCreatingRejoinder == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                            html += "<td  class='childsenton'>" + (a.DateOfDispatch == null ? ' ' : dateFormat(new Date(a.DateOfDispatch))) + "</td>";
                            html += "<td  class='childduedate'>" + (a.DueDateOfNotice == null ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                            html += "<td class='childmodeofdeliveryofrejoinder'>" + (a.ModeofDeliveryofRejoinder == null || a.ModeofDeliveryofRejoinder == 'null' ? ' ' : a.ModeofDeliveryofRejoinder) + "</td>";
                            if (a.CreateRejoinder.length > 0) {
                                html += "<td  class='childremark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='childremark'>" + span.innerText + "</td>";
                            }
                            html += "<td class='childnoticesubject'>" + RSubject + ' ' + "</td>";
                            html += "<td class='childnoticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='childstatutory'>" + a.NoticeType + "</td>";
                            html += "<td class='childpending'>" + a.CaseStatus + "</td>";
                            if (a.DateofDelivery == "1900-01-01T00:00:00") {
                                html += "<td class='childdispatched'></td>";
                            }
                            else {
                                html += "<td class='childdispatched'>" + (a.DateofDelivery == null ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            }
                            html += "<td class='childmodeofreceipt'>" + a.ModeofReceipt + "</td>";
                            html += "<td  class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childrejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' || a.RejoinderThrough == "null" ? '' : a.RejoinderThrough) + "</td>";
                            html += "<td class='childrejoinderconsignmentNo'>" + (a.ConsignmentNo == null ? '' : a.ConsignmentNo) + "</td>";
                            html += '<td class="childattachment"><i title="View notice draft" aria-hidden="true"  id="noticerelevantdoc11" style="cursor:pointer;" onclick=ViewNoticeDraft("' + a.NoticeID + '") id-val="' + a.NoticeID + '" id-type="RejoinderNotice"><img src="/newassets/img/folder-icon.png"></i></td>'
                            if (a.TrackingId != "") {
                                html += '<td class="receivedreplyaction"><a  style="cursor:pointer;"  onclick=RejoinderEditNotice("' + a.NoticeID + '") title="Edit Notice"><img src="/newassets/img/edit-icon.png"></a><a style="cursor:pointer;" onclick=AddInComingReply("' + a.ParentNoticeId + '") title = "Add Details:Create Reply To Notice" ><img src="/newassets/img/viewmore-icon.png"></a><a style="cursor:pointer;" onclick=fnfillNoticePostDetails("' + a.NoticeID + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title = "Save Dispatch Details" ><img src="/newassets/img/save-icon.png" /></a><a style="cursor:pointer;" onclick=DeleteRejoinder("' + a.NoticeID + '") title = "Delete" ><img src="/newassets/img/deletecasesingle-icon.png" /></a></td>';
                            }
                            else {
                                html += '<td class="receivedreplyaction"><a style="cursor:pointer;"  onclick=RejoinderEditNotice("' + a.NoticeID + '") title="Edit Notice"><img src="/newassets/img/edit-icon.png"></a><a style="cursor:pointer;" onclick=AddInComingReply("' + a.ParentNoticeId + '") title = "Create Reply To Notice" ><img src="/newassets/img/viewmore-icon.png"></a><a style="cursor:pointer;" onclick=fnfillNoticePostDetails("' + a.NoticeID + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title = "Save Dispatch Details" ><img src="/newassets/img/save-icon.png" /></a><a style="cursor:pointer;" onclick=DeleteRejoinder("' + a.NoticeID + '") title = "Delete " ><img src="/newassets/img/deletecasesingle-icon.png" /></a></td>';
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
/**
 * Get rejoinder list
 * @param {any} mainnoticeid
 */
function fnViewmorereplytonotice(mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/RejoinderHome"
    sessionStorage.setItem("mainnoticeid", mainnoticeid);
}
/**
 * View notice log details
 * @param {any} noticeid
 * @param {any} usertype
 */
function fnviewlog(noticeid, usertype) {
    $("#ViewLogModal").modal('show');
    var html = '';
    var ApproveType = '';
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
                if (data.iApproverType == 2) {
                    ApproveType = "User";
                } else if (data.iApproverType == 3) {
                    ApproveType = "Client";
                } else {
                    ApproveType = "NA";
                }
                html += `<tr>
                        <td>`+ data.sendername + `</td>
                        <td>`+ data.receivername + `</td>
                        <td>`+ dateFormat(new Date(data.dSendDate)) + `</td>
                        <td>`+ ApproveType + `</td>
                        <td>`+ remark + `</td >
                        <tr/>`
            })
            $("#modlbody").html(html);
        },
    })
}
/**
 * Edit sent notice details
 * @param {any} noticeid
 */
function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    sessionStorage.removeItem("NoticeId")
    sessionStorage.setItem("NoticeId", noticeid)
    window.location.href = "/" + firmcode + "/NoticeNew/CreateNewNotice"
   // sessionStorage.setItem("NoticeId", noticeid)
}
function newNotice() {
        var firmcode = localStorage.getItem("FirmCode");
        sessionStorage.removeItem("NoticeId")
        window.location.href = "/" + firmcode + "/NoticeNew/CreateNewNotice"
    
}

var approvalnoticeid = "";
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
$(document).on('change', '.assignto', function () {
    Getmanagerlist();
})
/**
 * View more content in notice
 * @param {any} noticeid
 * @param {any} param
 */
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
/**
 * View receiver detail
 * @param {any} noticeid
 */
function viewreceiverdetails(noticeid) {
    $("#ReceiverListModal").modal('show');
    var html = '';
    var formdata = new FormData();
    formdata.append('NoticeID', EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeReciverById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#receiverListmodlbody").html('');
            $.each(data.Data, function (key, val) {
                html += `<tr>
                        <td>`+ val.ReceiverEmails + `</td>
                        <td>`+ val.ReceiverPhone + `</td>
                        <td>`+ val.SecondAddress + `</td>
                        <td>`+ dateFormat(new Date(val.Created_Date)) + `</td>
                        <tr/>`
            })
            $("#receiverListmodlbody").html(html);
        },
    })
}
/**Get Manager list details */
function Getmanagerlist() {
    //$.ajax({
    //    type: "POST",
    //    url: "/api/NoticeNew/PartnerList",
    //    dataType: 'json',
    //    async: false,
    //    contentType: false,
    //    processData: false,
    //    success: function (response) {
    //        $("#bindusr").html("");
    //        $("#bindusr").append($("<option></option>").val("0").text("Please Select"));
    //        var checkboxval = $("input[name='assignee']:checked").val();
    //        if (response != null) {
    //            $.each(response.Data, function (key, value) {
    //                if (roleid != "1") {
    //                    if (checkboxval == "manager") {
    //                        if (value.RoleId == 2) {
    //                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
    //                        }
    //                    }
    //                    else if (checkboxval == "client") {
    //                        if (value.RoleId == 3) {
    //                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
    //                        }
    //                    }
    //                }
    //                else {
    //                    if (checkboxval == "manager") {
    //                        if (value.RoleId == 2) {
    //                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
    //                        }
    //                    }
    //                    else if (checkboxval == "client") {
    //                        if (value.RoleId == 3) {
    //                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
    //                        }
    //                    }
    //                }
    //            })
    //        }
    //    },
    //    failure: function (response) {
    //    },
    //    error: function (response) {
    //    }
    //});
    var checkboxval = $("input[name='assignee']:checked").val();
    if (checkboxval == "client") {
        checkboxval = "Client";
    } else {
        checkboxval = "User";
    }
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/AllAssignuser",
        contentType: "application/json; charset=utf-8",
        headers: {
            "usertype": checkboxval,
            "userid": ""
        },
        dataType: "json",
        success: function (response) {
             $("#bindusr").html("");
             $("#bindusr").append($("<option></option>").val("0").text("Please Select"));
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
                // alert("not found");
            }
            if (response != null) {
                $.each(obj, function (key, value) {
                    if (value.RoleId != 1) {
                        $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                    }
                })
            }
        },
        failure: function (response) {
            alert(data.responseText);
        },
        error: function (response) {
            alert(data.responseText);
        }
    });

}
/**Assign notice to user*/
$("#assignnoticebtn").click(function () {
    if (confirm("Are you sure you want to send this Notice?")) {
        var receiverid = $("#bindusr").val();
        if (receiverid == "0" || receiverid == "" || receiverid == "undefind" || receiverid == "Please Select" || receiverid == null) {
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
                if (result.Data == true) {
                    alert("Notice shared successfully.")
                }
                else {
                    alert("Notice is already shared.")
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
                arrayforselectedrow = [];
            }
        })
    }
})
window.onload = function () {
    if ($("#fromreminder").val() != "") {
        fromreminder = true;
        remindernoticeid = $("#reminderid").val()
    }
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    sessionStorage.removeItem("NoticeId");
};
/**Delete notice */
var DelNoticeId = "";


function ConfirmDelete(noticeid,noticetitle) {
    // Store the notice ID in a data attribute on the confirm button
    $('#Delete_final').data('noticeid', noticeid);

    // Optionally set the matter name in the modal
    $('#id_Deletematternames').text(noticetitle); // Replace or format as needed

    // Show the modal
    $('#myModalDeleteconfirmation').modal('show');
}



//var ConfirmDelete = function (NoticeID) {
//    DelNoticeId = NoticeID;
//    var result = confirm("Are you sure you want to delete notice?");
//    if (result) {
//        formdata = new FormData();
//        formdata.append("NoticeId", EncodeText(DelNoticeId))
//        formdata.append("deleteflag", EncodeText("1"))
//        $.ajax({
//            type: "POST",
//            url: "/api/NoticeNew/NoticeDelete",
//            data: formdata,
//            contentType: false,
//            processData: false,
//            success: function (result) {
//                if (result) {
//                    alert("Record deleted successfully.")
//                }
//                else {
//                    alert("Something went wrong.")
//                }
//                window.location.reload();
//            }
//        })
//    }
//}
/**
 * Set notification alert detail
 * @param {any} idsss
 * @param {any} typeofnotices
 */
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
    $('#dvadd_noticeSetdetils').html("");
    $('#txtdateofnotice_0').val('');
    $("#multiplereminderdiv_0").html("");
    $("#txtRemark_0").val("");
    $("#myModalNotificationsetting ").modal('show');
    fnnotificationalerttype(idsss, typeofnotices);
}
/**
 * Notification alert type
 * @param {any} NoticeIdss
 * @param {any} typeofnotices
 */
function fnnotificationalerttype(NoticeIdss, typeofnotices) {
    var selecteddlval = "individual";
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
/**
 * Get set alert notification details
 * @param {any} NoticeId
 * @param {any} typeofnotices
 */
function fillAlertNotification(NoticeId, typeofnotices) {
    $('#dvadd_noticeSetdetils').html('');
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
                if (response.Data.length > 0) {
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
                            data += "<fieldset class='ec_bgAlert'>";
                            data += "<div class='row'>";
                            data += "<div class='col-md-4'>";
                            data += "<label>Custom Date<span>*</span></label>";
                            data += "<input type='date' class='inputFormat setValue' value='" + setCustomDate + "' id='txtdateofnotice_" + count + "' onchange='ResetField()' />";
                            data += "</div>"
                            data += "<div class='col-md-4'>";
                            data += "<label>Alert Condition<span>*</span></label>";
                            data += "<select class='dropdown - toggle inputFormat setValue' onChange='ResetByAlert()' value='" + setAlertBA + "' id='txtalertcondition_" + count + "' style='background:white'>";
                            data += "<option value='beforeduedate'>Before</option>";
                            data += "<option value='afterreceivedate'>After</option>";
                            data += "</select>";
                            data += "</div>";
                            data += "<div class='col-md-4'>";
                            data += "<label>Set Days<span>*</span></label>";
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
                            data += "</div>"
                            data += "<div class='row'>";
                            data += "<div class='col-md-4'>"
                            data += "<label>Reminder Date</label>"
                            data += "<div id='multiplereminderdiv_" + count + "' class='inputFormat setValue' style='background:#fff; overflow: hidden; height: 35px!important;'></div>"
                            data += "</div>"
                            data += "<div class='col-md-8'>";
                            data += "<label>Remarks</label>";
                            data += "<textarea id='txtRemark_" + count + "'  class='inputFormat setValue' style='width: 100 %; height: 35px!important; border-radius:7px;'>" + setRemark + "</textarea>"
                            data += "</div>";
                            data += "</div>";
                            data += "<div class='col-md-4'>";
                            data += " </fieldset>";
                            $('#dvadd_noticeSetdetils').append(data);
                            $("#multiplereminderdiv_" + count).append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(setReminderSetDate))
                            $('#alertbeforeincaseallddl1_' + count).val(setDays);
                            $('#txtalertcondition_' + count).val(setAlertBA);
                            prevReminderDate = $("#multiplereminderdiv_" + count).html().substr(52, 11);
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
                            $("#rowcounterdata").val('');
                        }
                    }
                    dynamicFieldCount = count;
                }
                else {
                }
            }
        });
    }
}
var alertType = "";
/**
 * Get dropdown list details
 * @param {any} Noticeidss
 * @param {any} valType
 */
function GetNoticeListForDdl(Noticeidss, valType) {
    alertType = valType;
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeListForddl",
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            $("#ddlnoticelist").html("");
            $("#userTitle").html("");
            if (response != null) {
                $.each(response, function (key, value) {
                    if (value.NoticeId == Noticeidss) {

                        var textval = "<strong>Receiver's Name:</strong> " + value.AddressedTo + " <strong>Title:</strong> " + value.Title;
                        $("#userTitle").html(textval);

                        $("#ddlnoticelist").append($("<option data-id=" + value.DateofNotice + "></option>").val(value.NoticeId).text(textval));
                        if (value.DueDateOfNotice != null) {
                            var DueDateOfNotice = value.DueDateOfNotice.split("T");
                            $("#txtduedate").html(formatDatetoIST(DueDateOfNotice));
                        }
                        else {
                            $("#txtduedate").html("");
                        }
                    }
                })
                Getdateforalertbynoticeid();
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/**Get date for alert by notice id */
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
$('#txtdateofnotice').change(function () {
    $('#alertbeforeincaseallddl').val('');
    fndisplayreminder();
    $('#multiplereminderdiv').html("");
    $('.select2-selection__rendered').empty();
});
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
        var day = alertbeforeincaseallddl;
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
                    /* alert("You have already choose Please change date or days to set reminder");*/
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
                    /*alert("You have already choose Please change date or days to set reminder");*/
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
/**Save notification details*/
$("#savenotificationsettings").click(function () {
    var finalData = [];
    var setId = 0;
    var reminderdate = "";
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
        finalData.push({
            customDate: customDate,
            alertBA: alertBA,
            setDays: setDays,
            reminderDate: formatDatetoIST(reminderdate),
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
                reminderDate: formatDatetoIST(reminderdate),
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
$("#clearnewsearchforsender").click(function () {
    $("#noticebyIds").val("");
    $("#clearnewsearchforsender").css("display", "none");
    isRenderPage = false;

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
    isRenderPage = false;
    callapi();
});
$("#clearnewsearchforsendersub").click(function () {
    $("#noticeSubjects").val("");
    $("#clearnewsearchforsendersub").css("display", "none");
    isRenderPage = false;

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
    isRenderPage = false;

    callapi();
});
$("#clearnewsearthdetl").click(function () {
    $("#othdetailsofsender").val("");
    $("#clearnewsearthdetl").css("display", "none");
    isRenderPage = false;

    callapi();
})
$("#searchothdetl").click(function () {
    var casefiltercasename = $("#othdetailsofsender").val();
    if (casefiltercasename == "") {
        alert("enter other details of sender");
        $("#othdetailsofsender").focus();
        return false;
    }
    $("#clearnewsearthdetl").css("display", "unset")
    isRenderPage = false;

    callapi();
});
$(document).on('click', '#clearnewsearchforsendertitl', function () {
    $("#noticeTitless").val("");
    $("#clearnewsearchforsendertitl").css("display", "none");
    isRenderPage = false;

    callapi();
})
$(document).on('click', '#searchdatatitl', function () {
    var casefiltercasename = $("#noticeTitless").val();
    if (casefiltercasename == "") {
        alert("enter notice title");
        $("#noticeTitless").focus();
        return false;
    }
    $("#clearnewsearchforsendertitl").css("display", "unset")
    isRenderPage = false;
    PageNumber = 1;
    callapi();
});
/**
 * Update rejoinder notice
 * @param {any} noticeid
 */
function RejoinderEditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.localStorage.setItem("NType", "UpdateSent")
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice"
    sessionStorage.setItem("RejoinderNoticeId", noticeid)
}
/**
 * Delete rejoinder notice
 * @param {any} DelNoticeId
 */
function DeleteRejoinder(DelNoticeId) {
    if (confirm("Are you sure you want to remove this rejoinder?")) {
        formdata = new FormData();
        formdata.append("NoticeId", EncodeText(DelNoticeId))
        formdata.append("deleteflag", EncodeText("1"))
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
                callapi(pageindex);
            }
        })
    }
}
/**
 * Send approval rejoinder
 * @param {any} noticeid
 */
function SendApprovalRejoinder(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}
/**
 * Create reply rejoinder
 * @param {any} noticeid
 * @param {any} rootId
 */
function AddCreateReplyRejoinder(noticeid, rootId) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid + "&rootId=" + rootId;
}
/**
 * Get uploaded document
 * @param {any} noticeid
 */
function DocumnetSend(noticeid) {
    var formData = new FormData();
    formData.append("docnoticeid", EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/GetDocumnetDetailsById',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            //transfer page to perticular
            var transferid = response.Data.dirtoken;
            if (transferid != "") {
                var fcode5 = localStorage.getItem("FirmCode");
                var urls = "/" + fcode5 + "/azure/DirectoryList/1";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "token": transferid }
                });
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
/**
 * Redirect URL
 * @param {any} options
 */
function url_redirect(options) {
    validnavigation = true;
    window.onbeforeunload = null;
    var $form = $("<form />");
    $form.attr("action", options.url);
    $form.attr("method", options.method);
    for (var data in options.data)
        $form.append('<input type="hidden" name="' + data + '" value="' + options.data[data] + '" />');
    $("body").append($form);
    $form.submit();
}
/**
 * Notice export to excel
 * @param {any} noticecomefrom
 */
function ExportToExcelNotice(noticecomefrom) {
    var ddlnoticestatusss = $("#txtStatusOfNotice").val();
    var notistatus1 = "";
    var sendernamesearch = $("#noticebyIds").val();
    var Noticesubjectsrc = $("#noticeSubjects").val();
    var Noticetitlesrc = $("#noticeTitless").val();
    var Noticetypesrc = $("#ddlnoticetypess").val();
    var txtStatusOfNotice = $("#txtStatusOfNotice").val();
    var CFieldtype = "12";
    window.location = encodeURI("/NoticeNew/ExportToExcel?SearchValue=" + SearchValue + "&ColumName=" + ColumName + "&SortedOrder=" + SortedOrder + "&notistatus=" + notistatus1 + "&fromdaterange=" + fromdaterange + "&startdate=" + start + "&enddate=" + end + "&fromreminder=" + fromreminder + "&noticeid=" + remindernoticeid + "&noticecomefrom=" + noticecomefrom + "&notitypes=" + ddlnoticestatusss + "&sendernamesearch=" + sendernamesearch + "&Noticesubjectsrc=" + Noticesubjectsrc + "&Noticetitlesrc=" + Noticetitlesrc + "&Noticetypesrc=" + Noticetypesrc + "&txtStatusOfNotice=" + txtStatusOfNotice + "&CFieldtype=" + CFieldtype);
}
/**Link to matter*/
$(document).on("click", "#transferpage", function () {
    var fcode = localStorage.getItem("FirmCode");
    var token = $(this).attr("sno");
    var urls = "/" + fcode + "/Firm/NewCaseDashboard";
    url_redirect({
        url: urls,
        method: "post",
        data: { "token": token }
    });
});
$(document).on("click", "#linkmatter", function () {
    $("#livecaseidhide,#mattersforlink2").val("");
    var ids = $(this).attr("data-val");
    var IsLinkToMatter = $(this).attr("IsLinkToMatter");
    $("#savelinkmatter,#CreateNoticetoMatter").attr("data-case", ids).attr("IsLinkToMatter", IsLinkToMatter);
    $('#myModallinkcase').modal({ show: true });
});
/**Link notice to matter*/
$(document).on("click", "#CreateNoticetoMatter", function () {
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
/**Map notice to mattter*/
$(document).on("click", "#savelinkmatter", function () {
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
/**Add postal details*/
$(document).on("click", "#btn_addpostaldetails", function () {
    if (companycountdata < 5) {
        companycountdata += 1;
        var data = "";
        data += "<fieldset class='ec_bg'>";
        data += "<div class='row'>";
        data += "<div class='form-group col-md-4'>";
        data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of dispatch <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
        data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control dateofdispatch inputFormat' type='date' value=''  name='noticeSendDate' id='noticeSendDate' autocomplete='new-text' />";
        data += "</div> ";
        data += "</div>";
        data += "<div class='form-group col-md-4'>";
        data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Consignment No.</span></label>";
        data += "<div class='col-md-12'>";
        data += " <input autofocus='' class='form-control consignmentno inputFormat' type='text' value='' name='consignmentnum' id='consignmentnum'  autocomplete='new-text'/>";
        data += "</div>";
        data += "</div>";
        data += "<div class='form-group col-md-4'>";
        data += " <label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of delivery <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
        data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control dateofdelivery inputFormat' type='date' value=''  name='dateofdelivered' id='dateofdelivered' autocomplete='new-text' style='width:90%;float:left;' /><div onclick='deleteAlert_div($(this))' class='delete_div pull-right'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;' title='Delete'></span></div>";
        data += " </div> ";
        data += "</div>";
        data += "</div>";
        data += " </fieldset>";
        $('#dvadd_noticepostdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(companycountdata);
    }
    else {
        alert("You Can't add more than 5 Consignment");
    }
});
function delete_div(data) {
    countdata = countdata - 1;
    companycountdata = companycountdata - 1;
    $("#rowcounterdata").val('');
    $("#rowcounterdata").val(companycountdata);
    data.parents('fieldset').remove();
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
var currentDate = new Date().toLocaleDateString('en-CA');
/**
 * View more content
 * @param {any} noticeid
 * @param {any} param
 */
function viewcontent1(noticeid, param) {
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
/**Set alert details*/
$(document).on("click", "#btn_SetAlertDetails", function () {
    if (dynamicFieldCount == 0) {
        dynamicFieldCount = 1;
    }
    else {
        dynamicFieldCount = dynamicFieldCount + 1;
    }
    if (dynamicFieldCount < 5) {
        var data = "";
        data += "<fieldset class='ec_bgAlert'>";
        data += "<div class='row'>";
        data += "<div class='col-md-12'>";
        /*   data += "<span style='display: inline-block; margin-top: 23px'><button type='button' id='btn_addpostaldetails' class='sbtbtn pull - right valid' value='Save'><span class='glyphicon glyphicon-plus-sign' style='cursor: pointer; ' title='Add New'></span>Add</button></span>"*/
        if (checkData == true) {
            data += "<div id='showhide_" + dynamicFieldCount + "' style='display:none'  onclick='deleteAlert_div($(this))' class='delete_div pull-right'><span style='cursor: pointer;' title='Delete'><img src='/newassets/img/deletematter.png' /></span>"
        }
        data += "</div>";
        data += "</div>";
        data += "</div>";
        data += "<div class='row'>";
        data += "<div class='col-md-4'>";
        data += "<label>Custom Date</label><span style='color: red'>*</span><br />";
        data += "<input type='date' class='inputFormat setValue customDT' min='" + currentDate + "' id='txtdateofnotice_" + dynamicFieldCount + "' onchange='ResetField()' />";
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Alert Condition</label><span style='color: red'>*</span>";
        data += "<select class='dropdown - toggle inputFormat setValue alertCD' onChange='ResetByAlert()' id='txtalertcondition_" + dynamicFieldCount + "' style='background:white'>";
        data += "<option value='beforeduedate'>Before</option>";
        data += "<option value='afterreceivedate'>After</option>";
        data += "</select>";
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<label>Set Days</label><span style='color: red'>*</span>";
        data += "<select class='dropdown-toggle inputFormat setValue setDays' id='alertbeforeincaseallddl1_" + dynamicFieldCount + "' onchange='fndisplayreminder()' style='background:white'>"
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
        data += "</div>"
        data += "<div class='row'>"
        data += "<div class='col-md-4'>"
        data += "<label>Reminder Date</label><br />"
        data += "<div id='multiplereminderdiv_" + dynamicFieldCount + "' class='inputFormat setValue reminderDT' style='background:#fff; overflow: hidden; height: 35px!important;'></div>"
        data += "</div>"
        data += "<div class='col-md-8'>";
        data += "<label>Remarks</label>";
        data += "<textarea id='txtRemark_" + dynamicFieldCount + "' class='inputFormat setValue remarkMs' style='width: 100 %; height: 35px!important; border-radius:7px;'></textarea>"
        data += "</div>";
        data += "</div>";

        data += " </fieldset>";
        $('#dvadd_noticeSetdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(dynamicFieldCount);
        showField();
    }
    else {
        dynamicFieldCount = dynamicFieldCount - 1;
        alert("You Can't add more than 5 alert");
    }
});
/**Show/Hide dynamic field */
function showField() {
    for (var j = 1; j <= dynamicFieldCount; j++) {
        if (j == dynamicFieldCount) {
            $('#showhide_' + j).show();
        }
        else {
            $('#showhide_' + j).hide();
        }
    }
}
/**Reset field */
function ResetField() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    $('#alertbeforeincaseallddl1_' + afterSplit).val('');
    $('#txtalertcondition_' + afterSplit).val('beforeduedate');
}
/**Reset field by set alert */
function ResetByAlert() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    $('#alertbeforeincaseallddl1_' + afterSplit).val('');
}
/**
 * Add more dynamic control for set alert
 * @param {any} dynamicFieldCount
 */
function AddMoreControl(dynamicFieldCount) {
    for (var tcount = 1; tcount <= dynamicFieldCount; tcount++) {
        if (tcount == dynamicFieldCount) {
            dynamicFieldCount = tcount;
        }
        var data = "";
        data += "<fieldset class='ec_bgAlert'>";
        data += "<div class='row'>";
        data += "<div class='col-md-4'>";
        data += "<label>Custom Date</label><span style='color: red'>*</span><br />";
        data += "<input type='date' class='inputFormat' min='" + currentDate + "' id='txtdateofnotice_" + tcount + "' onchange='ResetField()' />";
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Alert Condition</label><span style='color: red'>*</span>";
        data += "<select class='dropdown - toggle inputFormat' id='txtalertcondition_" + tcount + "' style='background:white'>";
        data += "<option value='beforeduedate'>Before</option>";
        data += "<option value='afterreceivedate'>After</option>";
        data += "</select>";
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<label>Set Days</label><span style='color: red'>*</span>";
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
        data += "<textarea id='txtRemark_" + tcount + "' class='inputFormat' style='width: 100%; height: 35px!important; border-radius:7px;'></textarea>"
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<div onclick='deleteAlert_div($(this))' class='delete_div pull-right'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;' title='Delete'></span>"
        data += "</div>";
        data += "</div>";
        data += " </fieldset>";
        $('#dvadd_noticeSetdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(tcount);
    }
}
/**Delete dynamic set alert */
var countdata = 0;
function deleteAlert_div(data) {
    if (confirm("Are you sure you want to remove.")) {
        countdata = countdata - 1;
        dynamicFieldCount = dynamicFieldCount - 1;
        $("#rowcounterdata").val(dynamicFieldCount);
        data.parents('fieldset').remove();
        showField();
    }
}



$(document).on('click', '#listVersionData', function () {
    $("#Prime").show();
    $("#Second").hide();
    $("#primeSectionData").show();
    $("#SecondDataSection").hide();

    
    
});
$(document).on('click', '#SentRecordList', function () {
    $("#Prime").hide();
    $("#Second").show();
    $("#primeSectionData").hide();
    $("#SecondDataSection").show();



});
