var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $('#hideIPList').remove();

    if (IPname == "1") {
        document.getElementById('txtapplicationno').placeholder = 'Application Number';
        $('#dynamiciprheader').text('Trademark');
        $('#btnNameDetail').html('Add Trademark');
        $('#searchHeaderName').text('Trademark');
        $('#jAlertHistorytab').css("display", "block");
        //$('#spPhoneticSearch').show();
        IPRSearchlist(pageindex);
    }
    else if (IPname == "2") {
        document.getElementById('txtapplicationno').placeholder = 'Diary No.';
        $('#dynamiciprheader').text('Copyright');
        $('#btnNameDetail').html('Add Copyright');
        $('#jAlertHistorytab').css("display", "none");
        IPRCopyrightSearchlist(pageindex);
    }
    else if (IPname == "3") {
        document.getElementById('txtapplicationno').placeholder = 'Application Number';
        $('#dynamiciprheader').text('Patent');
        $('#btnNameDetail').html('Add Patent');
        $('#jAlertHistorytab').css("display", "none");
        IPRPatentSearchlist(pageindex);
    }
    else if (IPname == "4") {
        document.getElementById('txtapplicationno').placeholder = 'Application Number';
        $('#dynamiciprheader').text('GI');
        $('#btnNameDetail').html('Add GI');
        $('#jAlertHistorytab').css("display", "none");
        IPRGISearchlist(pageindex);
    }
    else if (IPname == "5") {
        document.getElementById('txtapplicationno').placeholder = 'Design Number';
        $('#btnNameDetail').html('Add Design');
        $('#dynamiciprheader').text('Design');
        $('#jAlertHistorytab').css("display", "none");
        IPRDesignSearchlist(pageindex);
    }
});

$(document).on('click', '#ddlbtnsearch', function () {
    isRenderPage = false;
    if (IPname == '1') {
        IPRSearchlist(pageindex);
    }
    else if (IPname == "2") {
        IPRCopyrightSearchlist(pageindex);
    }
    else if (IPname == "3") {
        IPRPatentSearchlist(pageindex);
    }
    else if (IPname == "4") {
        IPRGISearchlist(pageindex);
    }
    else if (IPname == "5") {
        IPRDesignSearchlist(pageindex);
    }
});

$(document).on("click", "#idcustomcommonFilter", function () {

    $("#ddliprform")[0].reset();
    $('#myModalCustomCommonFilter').modal({ show: true });
})

function convertdateyyyymmdd(datevalue) {
    if (!datevalue) return '';
    datevalue = datevalue.replace(/\.$/, '');
    let newdate = '';
    let parsedDate = new Date(datevalue);
    if (!isNaN(parsedDate.getTime())) {
        newdate = parsedDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return newdate;
}

function convertdateddmmyyyy(datevalue) {
    if (!datevalue) return '';
    datevalue = datevalue.replace(/\.$/, '');
    let newdate = '';
    var datearray = datevalue.split('/');
    datevalue = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    let parsedDate = new Date(datevalue);
    if (!isNaN(parsedDate.getTime())) {
        newdate = parsedDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return newdate;
}
/*Start page redirection*/
//$(document).on('click', "#searchPhonetictab", function () {
//    window.location.href = `/${fcode}/IPR/PhoneticSearch?IP=${IPname}`;
//})
$(document).on('click', "#trackertab", function () {
    window.location.href = `/${fcode}/IPR/ViewAddedTrademarks?IP=${IPname}`;
})
$(document).on('click', "#mylisttab", function () {
    window.location.href = `/${fcode}/IPR/ViewIPRCase?IP=${IPname}`;
})
$(document).on('click', "#searchtab", function () {
    window.location.href = `/${fcode}/IPR/TrademarkArchive?IP=${IPname}`;
})
$(document).on('click', "#deletemattertab", function () {
    window.location.href = `/${fcode}/IPR/ViewDeletedTrademarks?IP=${IPname}`;
})
$(document).on('click', "#AddmanuallyTrade", function () {
    window.location.href = `/${fcode}/IPR/CreateIPRCase?IP=${IPname}`;
})
$(document).on('click', "#AddTradeAfterSearch", function () {
    window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
})
$(document).on('click', "#SharedTradetab", function () {
    window.location.href = `/${fcode}/IPR/ViewSharedTrademark?IP=${IPname}`;
})
$(document).on('click', "#jAlertHistorytab", function () {
    window.location.href = `/${fcode}/IPR/JournalAlertHistory?IP=${IPname}`;
})

    /*End page redirection*/
var setTotalRecord = 1;
function IPRSearchlist(pageindex, colname, sort) {
    openload();
    var htmls = '';
    var txtapplicationno  = $("#txtapplicationno").val();
    var filtertradmark = $("#filtertradmark").val();

    var headername = '';
    headername += '<th style="display:none;"><div class="thbg">S.No</div></th > ';
    headername += '<th id="th3"><div class="thbg" >Client/Proprietor Name</div></th> '
    headername += '<th id="th1"><div class="thbg" >Application No</div></th> '
    headername += '<th id="th2"><div class="thbg" >Mark</div></th> '
    headername += '<th id="th4"><div class="thbg" >Status</div></th> '
    headername += '<th id="th5"><div class="thbg" >Class Details</div></th> '
    headername += '<th id="th6"><div class="thbg" >Date Of Application</div></th> '
    headername += '<th id="th7"><div class="thbg" >User Details</div></th> '
    headername += '<th id="th8"><div class="thbg" >Created By User</div></th> '
    headername += '<th><div class="thbg text-center" style="display:flex; justify-content:center;">Action</div></th> '
    $('#thval').html('')
    $('#thval').html(headername)

    var formData = new FormData();
    formData.append("filtertradmark", EncodeText(filtertradmark));
    formData.append("applicationno", EncodeText(txtapplicationno));
    formData.append("pagenum", pageindex);
    pagesize = 10;
    formData.append("pagesize", pagesize);

    $.ajax(
        {
            type: "POST",
            url: "/api/IPRApi/ViewDeletedTradeMarkDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var length = response1.Data.length;
                var qty = 0;
                if (length > 0) {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $.each(response1.Data, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = val.TotalRecord;
                        //    var totpage = 0;
                        //    if (val.TotalRecord > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(pagesize);
                        //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#pagnumvalue").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    $("#exportrecords").val(val.TotalRecord);
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#DeleteTradeCount").text(" (" + val.TotalRecord + ")");
                            $("#exportrecords").val(val.TotalRecord);
                            var totdata = val.TotalRecord;
                            var totpage = 0;
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
                                setTotalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                        htmls += '<tr>';
                        htmls += '<td style="text-align: center; display:none;" id ="rowid">' + val.RowId + '</td>';
                        htmls += '<td id = "prop"><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vProprietor + '</td >';
                        htmls += '<td id="applno">' + val.vApplNo + '</td>';
                        htmls += '<td id="wordmark">' + val.vWordMark + '</td>';
                        htmls += '<td>' + val.vStatus + '</td>';
                        htmls += '<td>' + val.vClass + '</td>';
                        htmls += '<td>' + (val.dApplDate == '01/01/1900' ? '' : convertdateddmmyyyy(val.dApplDate))  + '</td>';
                        htmls += '<td>' + val.vUsedSince + '</td>';
                        htmls += '<td>' + val.CreatedByUser + '</td>';
                        htmls += '<td><ul class="table_action">' +
                           
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="restoretrademark" style="cursor:pointer;" title="Restore Trademark" tradeid="' + val.tradeiid + '" iid="' + val.iid + '">' +
                            '<img src="/newassets/img/refreshCW.svg" alt="Restore Trademark" />' +
                            '</span>' +
                            '</li>' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="removetrademark" style="cursor:pointer;" title="Permanent Remove Trademark" tradeid="' + val.tradeiid + '" iid="' + val.iid + '">' +
                            '<img src="/newassets/img/trash.svg" alt="Remove Trademark" />' +
                            '</span>' +
                            '</li>' +
                            '</ul></td>';
                        htmls += '</tr>';

                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center><center><div class="notfound" style=""><img src="/newassets/img/not-found.png"><h4>Data Not Found</h4></div></center></td>'
                    //htmls += '</tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    $("#dtNotFound").html("Data not found");
                }                   
                $("#ddlbindIPRSearchData").html('').html(htmls);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
}

/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
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

var setPageNo = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isRenderPage = false;
    $("#txtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    }
    else if (IPname == "2") {
        IPRCopyrightSearchlist(setPageNo);
    }
    else if (IPname == "3") {
        IPRPatentSearchlist(setPageNo);
    }
    else if (IPname == "4") {
        IPRGISearchlist(setPageNo);
    }
    else if (IPname == "5") {
        IPRDesignSearchlist(setPageNo);
    }

    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = false;
    $("#txtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    }
    else if (IPname == "2") {
        IPRCopyrightSearchlist(setPageNo);
    }
    else if (IPname == "3") {
        IPRPatentSearchlist(setPageNo);
    }
    else if (IPname == "4") {
        IPRGISearchlist(setPageNo);
    }
    else if (IPname == "5") {
        IPRDesignSearchlist(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    } 
    isRenderPage = false;
    $("#txtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    }
    else if (IPname == "2") {
        IPRCopyrightSearchlist(setPageNo);
    }
    else if (IPname == "3") {
        IPRPatentSearchlist(setPageNo);
    }
    else if (IPname == "4") {
        IPRGISearchlist(setPageNo);
    }
    else if (IPname == "5") {
        IPRDesignSearchlist(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isRenderPage = false;
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    }
    else if (IPname == "2") {
        IPRCopyrightSearchlist(setPageNo);
    }
    else if (IPname == "3") {
        IPRPatentSearchlist(setPageNo);
    }
    else if (IPname == "4") {
        IPRGISearchlist(setPageNo);
    }
    else if (IPname == "5") {
        IPRDesignSearchlist(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

function IPRCopyrightSearchlist(pageindex, colname, sort) {
    openload();
    var htmls = '';
    var txtapplicationno = $("#txtapplicationno").val();
    var filtertradmark = $("#filtertradmark").val();
    var headername = '';
    headername += '<th style="display:none;"><div class="thbg" >S.No</div></th > ';
    headername += '<th id="th1"><div class="thbg" >Applicant Name</div></th> '
    headername += '<th id="th2"><div class="thbg" >Title Of Work</div></th> '
    headername += '<th id="th3"><div class="thbg" >Diary No.</div></th> '
    headername += '<th id="th4"><div class="thbg" >Status</div></th> '
    headername += '<th id="th5"><div class="thbg" >Date Of Application</div></th> '
    headername += '<th id="th6"><div class="thbg" >Category</div></th> '
    headername += '<th id="th7"><div class="thbg" >Created By User</div></th> '
    headername += '<th><div class="thbg text-center" style="display:flex; justify-content:center;">Action</div></th> ' 
    $('#thval').html('')
    $('#thval').html(headername)

    var formData = new FormData();
    formData.append("filtertradmark", EncodeText(filtertradmark));
    formData.append("applicationno", EncodeText(txtapplicationno));
    formData.append("pagenum", pageindex);
    pagesize = 10;
    formData.append("pagesize", pagesize);

    $.ajax(
        {
            type: "POST",
            url: "/api/IPRApi/ViewDeletedCopytightDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var length = response1.Data.length;
                var qty = 0;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $.each(response1.Data, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = val.TotalRecord;
                        //    var totpage = 0;
                        //    if (val.TotalRecord > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(pagesize);
                        //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#pagnumvalue").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    $("#exportrecords").val(val.TotalRecord);
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}
                        if (i === (length - 1)) {
                            $("#DeleteTradeCount").text(" (" + val.TotalRecord + ")");
                            $("#exportrecords").val(val.TotalRecord);
                            var totdata = val.TotalRecord;
                            var totpage = 0;
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
                                setTotalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                        htmls += '<tr>';
                        htmls += '<td style="text-align: center; display:none;" id ="rowid">' + val.RowId + '</td>';
                        htmls += '<td id="applno"><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vApplicantName + '</span></td>';
                        htmls += '<td id="wordmark"><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vTitleofWork + '</td>';
                        htmls += '<td id = "prop" > ' + val.vDiaryNo + '</td >';
                        htmls += '<td>' + val.vStatus + '</td>';
                        htmls += '<td>' + (val.dApplDate == '1900/01/01' ? '' : convertdateyyyymmdd(val.dApplDate))  + '</td>';
                        htmls += '<td>' + val.vCategoryName + '</td>';
                        htmls += '<td>' + val.CreatedByUser + '</td>';
                        htmls += `<td>
                        <ul class="table_action">
                           
                            <li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="restoretrademark"
                                   title="Restore Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/refreshCW.svg" alt="Restore" />
                                </a>
                            </li>
 <li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="removetrademark"
                                   title="Permanent Remove Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/trash.svg" alt="Delete" />
                                </a>
                            </li>
                        </ul>
                    </td>`;
                        htmls += '</tr>';

                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center><center><div class="notfound" style=""><img src="/newassets/img/not-found.png"><h4>Data Not Found</h4></div></center></td>'
                    //htmls += '</tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not found");
                }
                $("#ddlbindIPRSearchData").html('').html(htmls);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
}

function IPRPatentSearchlist(pageindex, colname, sort) {
    openload();
    var htmls = '';
    var txtapplicationno = $("#txtapplicationno").val();
    var filtertradmark = $("#filtertradmark").val();
    var headername = '';
    headername += '<th style="display:none;"><div class="thbg" style="display:flex; justify-content:center;">S.No</div></th > ';
    headername += '<th id="th2" style="width:380px;"><div class="thbg" >Title</div></th> '
    headername += '<th id="th1"><div class="thbg" >Application No.</div></th> '
    headername += '<th id="th3"><div class="thbg" >Status.</div></th> '
    headername += '<th id="th4"><div class="thbg" >Date Of Filing</div></th> '
    headername += '<th id="th5"><div class="thbg" >Name Of Applicant</div></th> '
    headername += '<th id="th6"><div class="thbg" >Patent No</div></th> '
    headername += '<th id="th7"><div class="thbg" >Created By User</div></th> '
    headername += '<th><div class="thbg text-center" style="display:flex; justify-content:center;">Action</div></th> '
    $('#thval').html('')
    $('#thval').html(headername)

    var formData = new FormData();
    formData.append("filtertradmark", EncodeText(filtertradmark));
    formData.append("applicationno", EncodeText(txtapplicationno));
    formData.append("pagenum", pageindex);
    pagesize = 10;
    formData.append("pagesize", pagesize);


    $.ajax(
    {
        type: "POST",
        url: "/api/IPRApi/ViewDeletedPatentDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var length = response.Data.length;
            if (length > 0) {
                $("#pdatastatus").hide();
                $("#tradePagination").show();
                $("#dtNotFound").html("");
                $.each(response.Data, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.RowId;
                    }
                    //if (i === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;
                    //    var totdata = val.TotalRecord;
                    //    var totpage = 0;
                    //    if (val.TotalRecord > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(pagesize);
                    //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#pagnumvalue").attr("max", totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                    //    if (val.TotalRecord <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }
                    //    tfot += '</ul>'
                    //    $("#ptfooter").html("");
                    //    $("#ptfooter").html(tfot);
                    //}

                    if (i === (length - 1)) {
                        $("#DeleteTradeCount").text(" (" + val.TotalRecord + ")");
                        $("#exportrecords").val(val.TotalRecord);
                        var totdata = val.TotalRecord;
                        var totpage = 0;
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
                            setTotalRecord = totpage;
                            renderPagination(pageindex, totpage);
                        }
                    }
                    htmls += '<tr>';
                    htmls += '<td style="text-align: center; display:none;" id ="rowid" >' + val.RowId + '</td>';
                    htmls += '<td id="wordmark"><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vInventionTitle + '</span></td>';
                    htmls += '<td id="applno">' + val.vApplNo + '</td>';
                    htmls += '<td id = "prop" > ' + val.StatusName + '</td >';
                    htmls += '<td>' + (val.dDateOffiling == '01/01/1900' ? '' : convertdateddmmyyyy(val.dDateOffiling))  + '</td>';
                    htmls += '<td>' + val.vApplicantName + '</td>';
                    htmls += '<td>' + (val.PatentNo == 'NA' ? '' : val.PatentNo) + '</td>';
                    htmls += '<td>' + val.CreatedByUser + '</td>';
                    htmls += `<td>
                        <ul class="table_action">
                            
                            <li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="restoretrademark"
                                   title="Restore Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/refreshCW.svg" alt="Restore" />
                                </a>
                            </li>
<li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="removetrademark"
                                   title="Permanent Remove Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/trash.svg" alt="Delete" />
                                </a>
                            </li>
                        </ul>
                    </td>`;
                    htmls += '</tr>';

                });
            }
            else {
                //htmls += '<tr>'
                //htmls += '<td colspan=11 align=center><center><div class="notfound" style=""><img src="/newassets/img/not-found.png"><h4>Data Not Found</h4></div></center></td>'
                //htmls += '</tr>'
                $("#pdatastatus").show();
                $("#tradePagination").hide();
                $("#dtNotFound").html("Data not found");
            }
            $("#ddlbindIPRSearchData").html('').html(htmls);
            closeload();
        },
        failure: function (data) {
            alert(data.responseText);
            closeload();
        },
        error: function (data) {
            alert(data.responseText);
            closeload();
        }
    });
}

function IPRGISearchlist(pageindex, colname, sort) {
    openload();
    var htmls = '';
    var txtapplicationno = $("#txtapplicationno").val();
    var filtertradmark = $("#filtertradmark").val();
    var headername = '';
    headername += '<th style="display:none;"><div class="thbg" style="display:flex; justify-content:center;">S.No</div></th > ';
    headername += '<th id="th1"><div class="thbg" >Name Of GI</div></th> '
    headername += '<th id="th2"><div class="thbg" >Applicant</div></th> '
    headername += '<th id="th3"><div class="thbg" >Status</div></th> '
    headername += '<th id="th4"><div class="thbg" >Class</div></th> '
    headername += '<th id="th5"><div class="thbg" >Date Of Filing</div></th> '
    headername += '<th id="th6"><div class="thbg" >Application No</div></th> '
    headername += '<th id="th7"><div class="thbg" >Created By User</div></th> '
    headername += '<th><div class="thbg text-center" style="display:flex; justify-content:center;">Action</div></th> '
    $('#thval').html('')
    $('#thval').html(headername)

    var formData = new FormData();
    formData.append("filtertradmark", EncodeText(filtertradmark));
    formData.append("applicationno", EncodeText(txtapplicationno));
    formData.append("pagenum", pageindex);
    pagesize = 10;
    formData.append("pagesize", pagesize);

    $.ajax(
        {
            type: "POST",
            url: "/api/IPRApi/ViewDeletedGIDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var length = response.Data.length;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $.each(response.Data, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = val.TotalRecord;
                        //    var totpage = 0;
                        //    if (val.TotalRecord > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(pagesize);
                        //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#pagnumvalue").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#DeleteTradeCount").text(" (" + val.TotalRecord + ")");
                            $("#exportrecords").val(val.TotalRecord);
                            var totdata = val.TotalRecord;
                            var totpage = 0;
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
                                setTotalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }
                        htmls += '<tr>';
                        htmls += '<td style="text-align: center; display:none;" id ="rowid">' + val.RowId + '</td>';
                        htmls += '<td id="applno"><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vGeoIndication + '</span></td>';
                        htmls += '<td id="wordmark"><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vApplicantName + '</span></td>';
                        htmls += '<td id = "prop" > ' + val.vStatus + '</td >';
                        htmls += '<td>' + val.vClass + '</td>';
                        htmls += '<td>' + (val.dDateofFiling == '01/01/1900' ? '' : convertdateddmmyyyy(val.dDateofFiling)) + '</td>';
                        htmls += '<td>' + val.vApplicationNo + '</td>';
                        htmls += '<td>' + val.CreatedByUser + '</td>';
                        htmls += `<td>
                        <ul class="table_action">
                          
                            <li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="restoretrademark"
                                   title="Restore Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/refreshCW.svg" alt="Restore" />
                                </a>
                            </li>
  <li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="removetrademark"
                                   title="Permanent Remove Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/trash.svg" alt="Delete" />
                                </a>
                            </li>
                        </ul>
                    </td>`;
                        htmls += '</tr>';

                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center><center><div class="notfound" style=""><img src="/newassets/img/not-found.png"><h4>Data Not Found</h4></div></center></td>'
                    //htmls += '</tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not found");
                }
                $("#ddlbindIPRSearchData").html('').html(htmls);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
}


function IPRDesignSearchlist(pageindex, colname, sort) {
    openload();
    var htmls = '';
    var txtapplicationno = $("#txtapplicationno").val();
    var filtertradmark = $("#filtertradmark").val();
    var headername = '';
    headername += '<th style="display:none;"><div class="thbg" >S.No</div></th > ';
    headername += '<th id="th5"><div class="thbg" >Title</div></th> '
    headername += '<th id="th1"><div class="thbg" >Design Number</div></th> '
    headername += '<th id="th2"><div class="thbg" >Class</div></th> '
    headername += '<th id="th3"><div class="thbg" >Address</div></th> '
    headername += '<th id="th4"><div class="thbg" >Date Of Registration</div></th> '
    headername += '<th id="th6"><div class="thbg" >Patent Office Journal No.</div></th> '
    headername += '<th id="th7"><div class="thbg" >Created By User</div></th> '
    headername += '<th><div class="thbg text-center" style="display:flex; justify-content:center;">Action</div></th> '
    $('#thval').html('')
    $('#thval').html(headername)

    var formData = new FormData();
    formData.append("filtertradmark", EncodeText(filtertradmark));
    formData.append("applicationno", EncodeText(txtapplicationno));
    formData.append("pagenum", pageindex);
    pagesize = 10;
    formData.append("pagesize", pagesize);

    $.ajax(
        {
            type: "POST",
            url: "/api/IPRApi/ViewDeletedDesignDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var length = response.Data.length;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $.each(response.Data, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = val.TotalRecord;
                        //    var totpage = 0;
                        //    if (val.TotalRecord > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(pagesize);
                        //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#pagnumvalue").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}
                        if (i === (length - 1)) {
                            $("#DeleteTradeCount").text(" (" + val.TotalRecord + ")");
                            $("#exportrecords").val(val.TotalRecord);
                            var totdata = val.TotalRecord;
                            var totpage = 0;
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
                                setTotalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }
                        htmls += '<tr>';
                        htmls += '<td style="text-align: center; display:none;" id ="rowid">' + val.RowId + '</td>';
                        htmls += '<td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vTitle + '</span></td>';
                        htmls += '<td id="applno" >' + val.vDesignNo + '</td>';
                        htmls += '<td id="wordmark">' + val.vClass + '</td>';
                        htmls += '<td id = "prop" ><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vAddress + '</span></td >';
                        htmls += '<td>' + (val.dDateOfRegistration == '01/01/1900' ? '' : convertdateddmmyyyy(val.dDateOfRegistration)) + '</td>';
                        htmls += '<td>' + (val.vPatentOffJournalNo == null ? '' : val.vPatentOffJournalNo) + '</td>';
                        htmls += '<td>' + val.CreatedByUser + '</td>';
                        htmls += `<td>
                        <ul class="table_action">
                           
                            <li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="restoretrademark"
                                   title="Restore Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/refreshCW.svg" alt="Restore" />
                                </a>
                            </li>
 <li>
                                <a href="javascript:void(0);" class="taskoutboxbtnicon" id="removetrademark"
                                   title="Permanent Remove Trademark" tradeid="${val.tradeiid}" iid="${val.iid}">
                                    <img src="/newassets/img/trash.svg" alt="Delete" />
                                </a>
                            </li>
                        </ul>
                    </td>`;
                        htmls += '</tr>';

                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11><center><div class="notfound" style=""><img src="/newassets/img/not-found.png"><h4>Data Not Found</h4></div></center></td>'
                    //htmls += '</tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not Found");
                }
                $("#ddlbindIPRSearchData").html('').html(htmls);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
}


$(document).on('click', '#paginate', function () {
    ppageindex = $(this).attr("index");
    if (IPname == '1') {
        IPRSearchlist(ppageindex);
    }
    else if (IPname == '2') {
        IPRCopyrightSearchlist(ppageindex);
    }
    else if (IPname == '3') {
        IPRPatentSearchlist(ppageindex);
    }
    else if (IPname == '4') {
        IPRGISearchlist(ppageindex);
    }
    else if (IPname == '5') {
        IPRDesignSearchlist(ppageindex);
    }
});

$(document).on('click', '#ddlbtnclear', function () {
    $('#filtertradmark').val('');
    $('#txtapplicationno').val('');
    if (IPname == '1') {
        IPRSearchlist(pageindex);
    }
    else if (IPname == '2') {
        IPRCopyrightSearchlist(pageindex);
    }
    else if (IPname == '3') {
        IPRPatentSearchlist(pageindex);
    }
    else if (IPname == '4') {
        IPRGISearchlist(pageindex);
    }
    else if (IPname == '5') {
        IPRDesignSearchlist(pageindex);
    }
});


$(document).on('click', '#getdatabypagenum', function () {
    ppageindex = $("#pagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#sotopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                openload();
                if (IPname == '1') {
                    IPRSearchlist(ppageindex);
                }
                else if (IPname == '2') {
                    IPRCopyrightSearchlist(ppageindex);
                }
                else if (IPname == '3') {
                    IPRPatentSearchlist(ppageindex);
                }
                else if (IPname == '4') {
                    IPRGISearchlist(ppageindex);
                }
                else if (IPname == '5') {
                    IPRDesignSearchlist(ppageindex);
                }
                closeload();
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
                return false;
            }
        }
    }
});



$(document).on('click', '#restoretrademark', function () {
    var trademarkIdDe = $(this).attr("tradeid");
    var iidDe = $(this).attr("iid");
    //if (confirm("Are you sure you want to Restore?")) {
        
    //}
    
    if (IPname == 1) {
        $("#ids_restoreTraderequesr").text("Restore Trademark Request");
        $("#msgRestorUSure").text("Are you sure you want to restore this trademark?");
    } else if (IPname == 2) {
        $("#ids_restoreTraderequesr").text("Restore Copyright Request");
        $("#msgRestorUSure").text("Are you sure you want to restore this copyright?");
    } else if (IPname == 3) {
        $("#ids_restoreTraderequesr").text("Restore Patent Request");
        $("#msgRestorUSure").text("Are you sure you want to restore this patent?");
    }
    else if (IPname == 4) {
        $("#ids_restoreTraderequesr").text("Restore GI Request");
        $("#msgRestorUSure").text("Are you sure you want to restore this gi?");
    }
    else {
        $("#ids_restoreTraderequesr").text("Restore Design Request");
        $("#msgRestorUSure").text("Are you sure you want to restore this design?");
    }

    $("#myModalmarkRestoreTradeconfirmation").modal();
    $("#restoreTrademarkDetails").attr("id-val", trademarkIdDe);
    $("#restoreTrademarkDetails").attr("tradeid-val", iidDe);
});


function RestoreMarkDetail(trademarkId, iid, IPname) {
    var formData = new FormData();
    formData.append("trademarkId", trademarkId);
    formData.append("iid", iid);
    formData.append("ip", IPname);
    $.ajax(
        {
            type: "POST",
            url: "/api/IPRApi/RestoreDeletedTradeMarkDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#myModalmarkRestoreTradeconfirmation").modal("hide");
                if (IPname == '1') {
                    //alert('Trade Mark Restored successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Trademark Restored successfully.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRSearchlist(pageindex);
                }
                else if (IPname == '2') {
                    //alert('Copyright Restored successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Copyright Restored successfully.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRCopyrightSearchlist(pageindex);
                }
                else if (IPname == '3') {
                    //alert('Patent Restored successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Patent Restored successfully.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRPatentSearchlist(pageindex);
                }
                else if (IPname == '4') {
                    //alert('GI Restored successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'GI Restored successfully.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRGISearchlist(pageindex);
                }
                else if (IPname == '5') {
                    //alert('Design Restored successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Design Restored successfully.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRDesignSearchlist(pageindex);
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
$(document).on('click', '#restoreTrademarkDetails', function () {
    trademarkId = $(this).attr("id-val");
    iid = $(this).attr("tradeid-val");
    RestoreMarkDetail(trademarkId, iid, IPname);
});

$(document).on('click', '#removetrademark', function () {
    var trademarkId = $(this).attr("tradeid");
    var iid = $(this).attr("iid");
    if (IPname == 1) {
        $("#ids_deleteTraderequesr").text("Delete Trademark Request");
        $("#msgRUSure").text("Are you sure you want to delete this trademark?");
    } else if (IPname == 2) {
        $("#ids_deleteTraderequesr").text("Delete Copyright Request");
        $("#msgRUSure").text("Are you sure you want to delete this copyright?");
    } else if (IPname == 3) {
        $("#ids_deleteTraderequesr").text("Delete Patent Request");
        $("#msgRUSure").text("Are you sure you want to delete this patent?");
    }
    else if (IPname == 4) {
        $("#ids_deleteTraderequesr").text("Delete GI Request");
        $("#msgRUSure").text("Are you sure you want to delete this gi?");
    }
    else {
        $("#ids_deleteTraderequesr").text("Delete Design Request");
        $("#msgRUSure").text("Are you sure you want to delete this design?");
    }
    
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", trademarkId);
    $("#deleteTrademarkDetails").attr("tradeid-val", iid);
});

$(document).on('click', '#deleteTrademarkDetails', function () {
    trademarkId = $(this).attr("id-val");
    iid = $(this).attr("tradeid-val");
    RemoveTrademarkDetail(trademarkId, iid, IPname);
});

function RemoveTrademarkDetail(trademarkId, iid, IPname) {
    var formData = new FormData();
    formData.append("trademarkId", trademarkId);
    formData.append("iid", iid);
    formData.append("ip", IPname);
    $.ajax(
        {
            type: "POST",
            url: "/api/IPRApi/RemoveDeletedTradeMarkDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#myModalmarkdeleteTradeconfirmation").modal("hide");
                if (IPname == '1') {
                    //alert('Trade Mark Removed successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Trademark deleted successfully!',
                        type: 'success',
                        delay: 3000
                    });
                    IPRSearchlist(pageindex);
                }
                else if (IPname == '2') {
                    //alert('Copyright Removed successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Copyright deleted successfully!',
                        type: 'success',
                        delay: 3000
                    });
                    IPRCopyrightSearchlist(pageindex);
                }
                else if (IPname == '3') {
                    //alert('Patent Removed successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Patent deleted successfully!',
                        type: 'success',
                        delay: 3000
                    });
                    IPRPatentSearchlist(pageindex);
                }
                else if (IPname == '4') {
                    //alert('GI Removed successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'GI deleted successfully!',
                        type: 'success',
                        delay: 3000
                    });
                    IPRGISearchlist(pageindex);
                }
                else if (IPname == '5') {
                    //alert('Design Removed successfully.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Design deleted successfully!',
                        type: 'success',
                        delay: 3000
                    });
                    IPRGISearchlist(pageindex);
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);

            }
        });
}


$(document).on('mouseenter', '.freeze-text', function (e) {
    const text = $(this).text().trim();
    // Show tooltip only if text exceeds 35 characters
    if (text.length > 35) {
        $('body').append('<div id="custom-tooltip"></div>');
        $('#custom-tooltip')
            .text(text)
            .css({
                position: 'absolute',
                top: e.pageY + 10,
                left: e.pageX + 10,
                background: '#000',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                zIndex: 1000,
                whiteSpace: 'normal',
                maxWidth: '300px'
            });
    }
});

$(document).on('mouseleave', '.freeze-text', function () {
    $('#custom-tooltip').remove();
});

$(document).on('mousemove', '.freeze-text', function (e) {
    $('#custom-tooltip').css({
        top: e.pageY + 10,
        left: e.pageX + 10
    });
});
