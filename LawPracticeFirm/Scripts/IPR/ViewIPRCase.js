var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP")

function checkformatvalue(datavalue) {
    if (datavalue == null || datavalue.toLowerCase() == "null" || datavalue.toLowerCase() == "undefine" || datavalue == "1900-01-01") {
        return "";
    }
    else {
        return datavalue;
    }
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

function convertdate(datevalue) {
    var day;
    var month;
    var year;
    var newdate = '';
    let pattern = /Used Since\s*\:\s*/i;
    var regex = new RegExp(pattern);
    var match = regex.test(datevalue);

    if (match === true) {
        datevalue = datevalue.replace(regex, '');
    }

    if (datevalue != null && datevalue != '') {
        var date = datevalue.split('-');

        if (date.length == 3) {
            day = parseInt(date[0], 10);
            month = parseInt(date[1], 10);
            year = parseInt(date[2], 10);
            newdate = new Date(year, month - 1, day);
            newdate = newdate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        if (IPname == '2') {
            newdate = new Date(datevalue);
            newdate = newdate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }

    if (newdate == undefined) {
        newdate = '';
    }
    return newdate;
}


$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    sessionStorage.removeItem('iprcaseid');
    if (IPname == '1') {
        $("#SharedTradetab").css("display", "block");
        $('#jAlertHistorytab').css("display", "block");
        AddIPRCheckList();
        GetIPRList(pageindex);
        myHeader();
    }
    if (IPname == '2') {
        $('#jAlertHistorytab').css("display", "none");
        GetIPRListForCopyright(pageindex);
        myHeader();
    }
    if (IPname == '3') {
        $('#jAlertHistorytab').css("display", "none");
        AddIPRPatentCheckList();
        GetIPRListForPatent(pageindex);
        myHeader();
    }
    if (IPname == '4') {
        $('#jAlertHistorytab').css("display", "none");
        GetIPRListForGI(pageindex);
        myHeader();
    }
    if (IPname == '5') {
        $('#jAlertHistorytab').css("display", "none");
        AddIPRDesignCheckList();
        GetIPRListForDesign(pageindex);
        myHeader();
    }
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();

        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    GetIPRList(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    return false;
                }
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#paginate', function () {
        ppageindex = $(this).attr("index");
        GetIPRList(ppageindex);
    });

    $(document).on('click', '#getdatabypagenumCategory', function () {
        ppageindex = $("#pagnumvalueCategory").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    GetIPRListForCopyright(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    return false;
                }
            }
        }
    });

    $(document).on('click', '#paginateCategory', function () {
        ppageindex = $(this).attr("index");
        GetIPRListForCopyright(ppageindex);
    });

    $(document).on('click', '#getdatabypagenumPatent', function () {
        ppageindex = $("#pagnumvaluePatent").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    GetIPRListForPatent(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    return false;
                }
            }
        }
    });

    $(document).on('click', '#paginatePatent', function () {
        ppageindex = $(this).attr("index");
        GetIPRListForPatent(ppageindex);
    });

    $(document).on('click', '#getdatabypagenumGI', function () {
        ppageindex = $("#pagnumvalueGI").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    GetIPRListForGI(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    return false;
                }
            }
        }
    });

    $(document).on('click', '#paginateGI', function () {
        ppageindex = $(this).attr("index");
        GetIPRListForGI(ppageindex);
    });

    $(document).on('click', '#getdatabypagenumDesign', function () {
        ppageindex = $("#pagnumvalueDesign").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    GetIPRListForDesign(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    return false;
                }
            }
        }
    });

    $(document).on('click', '#paginateDesign', function () {
        ppageindex = $(this).attr("index");
        GetIPRListForDesign(ppageindex);
    });
});

function clearData() {
    sessionStorage.removeItem('iprcaseid');
}
var totalRecord = 0;
function GetIPRList(pageindex) {
    // Create and append a new table-panel structure
    openload()
    var newTablePanel = $('<div>').addClass('table-panel');
    var newSettingPanel = $('<div>').addClass('settingpanel');
    var newColMd6_1 = $('<div>').addClass('col-md-6');
    newColMd6_1.append('<div style="float: left;padding: 0 10px 0 0;"></div>');
    newColMd6_1.append('<div id="ptfooter"></div>');
    var newColMd6_2 = $('<div>').addClass('col-md-6');
    var newUlPullRight = $('<ul>').addClass('pull-right');
    var newLi = $('<li>');
    var newBtnGroupDropup = $('<div>').addClass('btn-group dropup');
    newBtnGroupDropup.append('<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action Selected</a>');
    var newDropdownMenu = $('<ul>').addClass('dropdown-menu').attr('id', 'myDropdown');
    newDropdownMenu.append('<li><a href="javascript:void()" id="oexcel" title="Export to Excel">Export to Excel</a></li>');
    newDropdownMenu.append('<li><a href="javascript:void()" id="opdf" title="Export data to PDF">Export to PDF</a></li>');
    newBtnGroupDropup.append(newDropdownMenu);
    newLi.append(newBtnGroupDropup);
    newUlPullRight.append(newLi);
    newColMd6_2.append(newUlPullRight);
    newSettingPanel.append(newColMd6_1);
    newSettingPanel.append(newColMd6_2);
    newTablePanel.append(newSettingPanel);

    // Append the new structure outside the table
    $('#newTable').parent().after(newTablePanel);
    $('#IPRheader').html(`
  <tr>
    <th class="text-center" style="display:none;">S.No</th>
    <th class="applicanttype"><div class="thbg">Applicant Type</div></th>
    <th class="applicantname"><div class="thbg">Applicant Name</div></th>
    <th class="applicantadd"><div class="thbg">Applicant Address</div></th>
    <th class="applicantcountry"><div class="thbg">Applicant Country</div></th>
    <th class="applicantstate"><div class="thbg">Applicant State</div></th>
    <th class="applicantdistri"><div class="thbg">Applicant District</div></th>
    <th class="applicantmail"><div class="thbg">Applicant EmailId</div></th>
    <th class="applicantphno"><div class="thbg">Applicant PhoneNo</div></th>
    <th class="legalstat"><div class="thbg">Legal Status</div></th>
    <th class="useofmark"><div class="thbg">Use Of Mark</div></th>
    <th class="markcategory"><div class="thbg">Category of Mark</div></th>
    <th class="titlemark"><div class="thbg">Trade Mark</div></th>
    <th class="vclass"><div class="thbg">Class</div></th>
    <th class="priority"><div class="thbg">Priority</div></th>
    <th style="text-align:center;">Action</th>
  </tr>
`);


    //Event handler for Export to PDF
    $(document).on("click", "#opdf", function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Pdf Trademark My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoPDFfileTrademark" pageno="' + i + '" type="pdf"><img src="/newassets/img/download.svg" /></span></li></ul></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    // Event handler for Export to Excel
    $(document).on("click", "#oexcel", function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Excel Trademark My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoexcelfileTrademark" pageno="' + i + '" type="excel"><img src="/newassets/img/download.svg" /></span></li></ul></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    var formData = new FormData();
    formData.append("pagenum1", pageindex);
    formData.append("pagesize1", pagesize);
    formData.append("iptypeid", IPname)
    var htmls = '';
    $.ajax(
        {
            async: true,
            type: "POST",
            url: "/api/IPRApi/ListForViewIPRCase",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            async: true,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = response1.Data.data;
                var length = obj.length;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $("#divalertlist tr").remove();
                    $.each(obj, function (i, val) {
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
                        //    $("#IPRpaginfield").html("");
                        //    $("#IPRpaginfield").html(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#MyListCount").text(" (" + val.TotalRecord + ")");
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
                                totalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                        var RowId = val.RowId;
                        var iid = val.id

                        htmls += `<tr><td style="text-align:center; display:none;">` + RowId + `</td><td class="applicanttype" >` + checkformatvalue(val.Applicant_Type) + `</td><td class="applicantname" >` + checkformatvalue(val.Applicant_Name) + `</td><td class="applicantadd" >` + checkformatvalue(val.Applicant_Address) + `</td><td class="applicantcountry" >` + checkformatvalue(val.Applicant_Country) + `</td><td class="applicantstate" >` + checkformatvalue(val.Applicant_State) + `</td><td class="applicantdistri" >` + checkformatvalue(val.Applicant_District) + `</td><td class="applicantmail" >` + checkformatvalue(val.Applicant_EmailId) + `</td><td class="applicantphno" >` + checkformatvalue(val.Applicant_PhoneNo) + `</td><td class="legalstat" >` + checkformatvalue(val.Legal_Status) + `</td><td class="useofmark" >` + (val.Use_Of_Mark == "User Detail" ? checkformatvalue(val.vUsedSince) : checkformatvalue(val.Use_Of_Mark)) + `</td><td class="markcategory" >` + checkformatvalue(val.Category_of_Mark) + `</td><td class="titlemark" >` + checkformatvalue(val.Mark_of_Title) + `</td><td class="vclass" >` + checkformatvalue(val.Class) + `</td><td class="priority" >` + checkformatvalue(val.Priority) + `</td><td><ul class="table_action"><li><a class="taskoutboxbtnicon"  title="Edit IPR Case" onclick=editMyList("` + iid + `")><img src="/newassets/img/edit.svg" /></a></li>
                         <li><a class="taskoutboxbtnicon" style="cursor:pointer;" title="Delete" onclick=confirmDeleteTradeMyList("` + iid + `")><img src="/newassets/img/delete.svg" /></a></li></ul></td></tr>`;
                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<tr><td colspan="13" align="center">' +
                    //    '<div class="notfound">' +
                    //    '<img src="/newassets/img/not-found.png">' +
                    //    '<h4>Data Not Found</h4>' +
                    //    '</div>' +
                    //    '</td></tr>';
                    //htmls += '<tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not found");
                }
                $("#bindIPRData").html("");
                $("#bindIPRData").html(htmls);

                $.each($('#CustIPRcreatefield #myDropdown input'), function (i, val) {
                    if (val.checked == false) {
                        $('.' + val.name + '').css('display', 'none');
                    }
                    else {
                        $('.' + val.name + '').css('display', '');
                    }
                });
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

//$(document).on("click", "#opdf", function () {
//    $('#myModalexport').modal('show');
//    $('#modalTitleExport').text('Export To Pdf Trademark My List');
//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';
//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoPDFfileTrademark" pageno="' + i + '" type="pdf"><img src="/newassets/img/download.svg" /></span></li></ul></td>';
//        html += '</tr>';
//    }
//    $("#printexport").html(html);
//});

//$('#opdf1').on('click', function () {
//    $('#myModalexport').modal('show');
//    $('#modalTitleExport').text('Export To Pdf Trademark My List');
//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';
//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoPDFfileTrademark" pageno="' + i + '" type="pdf"><img src="/newassets/img/download.svg" /></span></ul></li></td>';
//        html += '</tr>';
//    }
//    $("#printexport").html(html);
//});
//$(document).on("click", "#oexcel", function () {
//    $('#myModalexport').modal('show');
//    $('#modalTitleExport').text('Export To Excel Trademark My List');
//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';
//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoexcelfileTrademark" pageno="' + i + '" type="excel"><img src="/newassets/img/download.svg" /></span></li></ul></td>';
//        html += '</tr>';
//    }
//    $("#printexport").html(html);
//});


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
        GetIPRList(setPageNo);
    }
    else if (IPname == "2") {
        GetIPRListForCopyright(setPageNo);
    }
    else if (IPname == "3") {
        GetIPRListForPatent(setPageNo);
    }
    else if (IPname == "4") {
        GetIPRListForGI(setPageNo);
    }
    else if (IPname == "5") {
        GetIPRListForDesign(setPageNo);
    }

    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    isRenderPage = false;
    $("#txtgopage").val("");
    if (IPname == 1) {
        GetIPRList(setPageNo);
    }
    else if (IPname == "2") {
        GetIPRListForCopyright(setPageNo);
    }
    else if (IPname == "3") {
        GetIPRListForPatent(setPageNo);
    }
    else if (IPname == "4") {
        GetIPRListForGI(setPageNo);
    }
    else if (IPname == "5") {
        GetIPRListForDesign(setPageNo);
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
        GetIPRList(setPageNo);
    }
    else if (IPname == "2") {
        GetIPRListForCopyright(setPageNo);
    }
    else if (IPname == "3") {
        GetIPRListForPatent(setPageNo);
    }
    else if (IPname == "4") {
        GetIPRListForGI(setPageNo);
    }
    else if (IPname == "5") {
        GetIPRListForDesign(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > totalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isRenderPage = false;
    if (IPname == 1) {
        GetIPRList(setPageNo);
    }
    else if (IPname == "2") {
        GetIPRListForCopyright(setPageNo);
    }
    else if (IPname == "3") {
        GetIPRListForPatent(setPageNo);
    }
    else if (IPname == "4") {
        GetIPRListForGI(setPageNo);
    }
    else if (IPname == "5") {
        GetIPRListForDesign(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/


$(document).on('click', '#ColumnSelectionopen', function () {
    $('#myModalCustomizedcolumn').modal({ show: true });
});

/****** Customise field for TradeMark ********/
function AddIPRCheckList() {
    $('#CustIPRcreatefield').html('');
    $('#CustIPRcreatefield').css('display', 'block');
    $('#CustIPRcreatefield').css('padding', '0 15px 0 0');
    var tfot = '';
    //tfot += '<ul>';
    //tfot += '<li>';
    //tfot += '<div class="btn-group dropup">';
    //tfot += '<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important; white-space: nowrap; width: 105%;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    //tfot += 'Customize Field';
    //tfot += '</a>';
    tfot += `<ul class="" id="myDropdown">`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicanttype" name="applicanttype" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicanttype">Applicant Type</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicantname" name="applicantname" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicantname">Applicant Name</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicantadd" name="applicantadd" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicantadd">Applicant Address</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicantcountry" name="applicantcountry" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicantcountry">Applicant Country</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicantstate" name="applicantstate" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicantstate">Applicant State</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicantdistri" name="applicantdistri" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicantdistri">Applicant District</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicantmail" name="applicantmail" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicantmail">Applicant Emailid</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="applicantphno" name="applicantphno" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="applicantphno">Applicant Phone Number</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="legalstat" name="legalstat" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="legalstat">Legal Status</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="useofmark" name="useofmark" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="useofmark">Use Of Mark</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="markcategory" name="markcategory" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="markcategory">Category Of Mark</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="titlemark" name="titlemark" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="titlemark">Trade Mark</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="vclass" name="vclass" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="vclass">Class</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="priority" name="priority" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="priority">Priority</label>
        </li>`;

    tfot += `</ul>`;
    //tfot += '</div>';
    //tfot += '</li>';
    //tfot += '</ul>';
    $('#CustIPRcreatefield').html(tfot);
}

function editMyList(id) {
    sessionStorage.setItem('iprcaseid', id);
    window.location.href = "/" + fcode + "/IPR/CreateIPRCase?IP=1";
}

function editMyListForCopyright(id) {
    sessionStorage.setItem('iprcaseid', id);
    window.location.href = "/" + fcode + "/IPR/CreateIPRCase?IP=2";

}

function editMyListForPatent(id) {
    sessionStorage.setItem('iprcaseid', id);
    window.location.href = "/" + fcode + "/IPR/CreateIPRCase?IP=3";

}

function editMyListForGI(id) {
    sessionStorage.setItem('iprcaseid', id);
    window.location.href = "/" + fcode + "/IPR/CreateIPRCase?IP=4";

}

function editMyListForDesign(id) {
    sessionStorage.setItem('iprcaseid', id);
    window.location.href = "/" + fcode + "/IPR/CreateIPRCase?IP=5";

}

function myHeader() {
    var IP = '';
    if (IPname == '1') {
        IP = 'Trademark';
        $('#dynamiciprheader').text('Trademark');
        $('#searchHeaderName').text('Trademark');
        $('#btnNameDetail').html('Add Trademark');
        //$('#spPhoneticSearch').show();
    }
    else if (IPname == '2') {
        $('#ColumnSelectionopen').hide();
        IP = 'Copyright';
        $('#btnNameDetail').html('Add Copyright');
    }
    else if (IPname == '3') {
        IP = 'Patent';
        $('#btnNameDetail').html('Add Patent');
    }
    else if (IPname == '4') {
        $('#ColumnSelectionopen').hide();
        IP = 'GI';
        $('#btnNameDetail').html('Add GI');
    }
    else if (IPname == '5') {
        IP = 'Design';
        $('#btnNameDetail').html('Add Design');
    }
    $('#dynamiciprheader').html(IP);
}

$('#myDropdown').on('hide.bs.dropdown', function () {
    return false;
});

$('#myDropdownCategory').on('hide.bs.dropdown', function () {
    return false;
});

$('#myDropdownPatent').on('hide.bs.dropdown', function () {
    return false;
});

$('#myDropdownGI').on('hide.bs.dropdown', function () {
    return false;
});

$('#myDropdownDesign').on('hide.bs.dropdown', function () {
    return false;
});

function Customdisplay(objectValue) {
    openload();
    if (objectValue.checked === false) {
        $('.' + objectValue.name + '').css('display', 'none');
    }
    else {
        $('.' + objectValue.name + '').css('display', '');
    }
    closeload();
}


//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Copyright xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function RemoveAndFillForCopyright() {
    $('#titlemark').text('Copyright');
}

function GetIPRListForCopyright(pageindex) {
    openload();
    $('#hideforCategory').hide();
    // Check if the table already exists
    var newTable = $('#newTable');
    if (newTable.length === 0) {
        newTable = $('<table>').addClass('table-panel fixed_table_head').attr('id', 'newTable');
        var headerRow = $('<thead>').append(`
          <tr>
            <th class="text-center" style="display:none;"><div class="thbg">S.No</div></th>
            <th id="txtApplicantName" ><div class="thbg">Applicant name</div></th>
            <th id="txtAddress1"><div class="thbg">Address</div></th>
            <th id="txtTitleOfWork"><div class="thbg">Title of Work</div></th>
            <th id="txtDiaryNo"><div class="thbg">Diary No.</div></th>
            <th id="txtRocNo"><div class="thbg">ROC No.</div></th>
            <th id="txtCategory"><div class="thbg">Category</div></th>
            <th id="txtCalendarView"><div class="thbg">Date</div></th>
            <th id="action" class="text-center"><div class="thbg" style="display:flex; justify-content:center;">Action</div></th>
          </tr>
        `);

        newTable.append(headerRow);
        var tbody = $('<tbody>').attr('id', 'bindNewIPRData');
        newTable.append(tbody);
        $('#hideforCategory').after(newTable);

        //$('#newPanel').hide();
        //var newTablePanel = $('<div>').addClass('table-panel');
        //var newSettingPanel = $('<div>').addClass('settingpanel');
        //var newColMd6_1 = $('<div>').addClass('col-md-6');
        //newColMd6_1.append('<div style="float: left;padding: 0 10px 0 0;"></div>');
        //newColMd6_1.append('<div id="ptfooter"></div>');
        //var newColMd6_2 = $('<div>').addClass('col-md-6');
        //var newUlPullRight = $('<ul>').addClass('pull-right');
        //var newLi = $('<li>');
        //var newBtnGroupDropup = $('<div>').addClass('btn-group dropup');
        //newBtnGroupDropup.append('<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action Selected</a>');
        //var newDropdownMenu = $('<ul>').addClass('dropdown-menu').attr('id', 'myDropdown');
        //newDropdownMenu.append('<li><a href="javascript:void()" id="oexcel" title="Export to Excel">Export to Excel</a></li>');
        //newDropdownMenu.append('<li><a href="javascript:void()" id="opdf" title="Export data to PDF">Export to PDF</a></li>');
        //newBtnGroupDropup.append(newDropdownMenu);
        //newLi.append(newBtnGroupDropup);
        //newUlPullRight.append(newLi);
        //newColMd6_2.append(newUlPullRight);
        //newSettingPanel.append(newColMd6_1);
        //newSettingPanel.append(newColMd6_2);
        //newTablePanel.append(newSettingPanel);
        //$('#newTable').parent().after(newTablePanel);
    }

    // Event handler for Export to PDF
    $('#opdf').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Pdf Copyright My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';

            //html += '<td>' +
            //    '<ul class="table_action">' +
            //    '<li>' +
            //    '<span style="cursor:pointer;color:#069;" id="exporttoPDFfileCopyright" pageno="' + i + '" type="pdf">' +
            //    '<img src="/newassets/img/download.svg" alt="Download File" />' +
            //    'Download File' +
            //    '</span>' +
            //    '</li>' +
            //    '</ul>' +
            //    '</td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoPDFfileCopyright" pageno="' + i + '" type="pdf"><img src="/newassets/img/download.svg" /></span></li></ul></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    // Event handler for Export to Excel
    $('#oexcel').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Excel Copyright My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            //html += '<td>' +
            //    '<ul class="table_action">' +
            //    '<li>' +
            //    '<span style="cursor:pointer;color:#069;" id="exporttoexcelfileCopyright" pageno="' + i + '" type="excel">' +
            //    '<img src="/newassets/img/download.svg" alt="Download File" />' +
            //    'Download File' +
            //    '</span>' +
            //    '</li>' +
            //    '</ul>' +
            //    '</td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoexcelfileCopyright" pageno="' + i + '" type="excel"><img src="/newassets/img/download.svg" /></span></li></ul></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    var formData = new FormData();
    formData.append("pagenum1", pageindex);
    formData.append("pagesize1", pagesize);
    var htmls = '';
    $.ajax(
        {
            async: true,
            type: "POST",
            url: "/api/IPRApi/ListForIPRCopyrightCase",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            async: true,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = response1.Data.data;
                var length = obj.length;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $("#divalertlist tr").remove();
                    $.each(obj, function (i, val) {
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

                        //        $("#pagnumvalueCategory").attr("max", totpage);
                        //    }

                        //    var tfot = '';
                        //    $("#exportrecords").val(val.TotalRecord);
                        //    tfot += '<ul>'

                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalueCategory" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenumCategory" style="margin-left:10px;">Go</button></a> </li>'

                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginateCategory"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginateCategory"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginateCategory" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }

                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#MyListCount").text(" (" + val.TotalRecord + ")");
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
                                totalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var iid = val.iid

                        htmls += `<tr>
            <td style="text-align:center; display:none;" >` + RowId + `</td>
            <td>` + checkformatvalue(val.ApplicantCat_Name) + `</td>
            <td>` + checkformatvalue(val.ApplicantCat_Address) + `</td>
            <td>` + checkformatvalue(val.Title_Work) + `</td>
            <td>` + checkformatvalue(val.Diary_No) + `</td>
            <td>` + checkformatvalue(val.Roc_No) + `</td>
            <td>` + checkformatvalue(val.Category) + `</td>
            <td>` + convertdate(checkformatvalue(val.dDate)) + `</td>
            <td>
                <ul class="table_action">
                    <li>
                        <a href="javascript:void(0);" class="taskoutboxbtnicon" title="Edit IPR Case" onclick=editMyListForCopyright("` + iid + `")>
                            <img src="/newassets/img/edit.svg" alt="Edit"/>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" class="taskoutboxbtnicon" title="Delete" onclick=confirmDeleteCopyMyList("` + iid + `")>
                            <img src="/newassets/img/delete.svg" alt="Delete" />
                        </a>
                    </li>
                </ul>
            </td>
          </tr>`;

                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<tr><td colspan="13" align="center">' +
                    //    '<div class="notfound">' +
                    //    '<img src="/newassets/img/not-found.png">' +
                    //    '<h4>Data Not Found</h4>' +

                    //    '</div>' +
                    //    '</td></tr>';
                    //htmls += '<tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not found");
                }
                $("#bindNewIPRData").html("");
                $("#bindNewIPRData").html(htmls);
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

function GetIPRListForPatent(pageindex) {
    openload();
    var newTablePanel = $('<div>').addClass('table-panel');
    var newSettingPanel = $('<div>').addClass('settingpanel');
    var newColMd6_1 = $('<div>').addClass('col-md-6');
    newColMd6_1.append('<div style="float: left;padding: 0 10px 0 0;"></div>');
    newColMd6_1.append('<div id="ptfooter"></div>');
    var newColMd6_2 = $('<div>').addClass('col-md-6');
    var newUlPullRight = $('<ul>').addClass('pull-right');
    var newLi = $('<li>');
    var newBtnGroupDropup = $('<div>').addClass('btn-group dropup');
    newBtnGroupDropup.append('<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action Selected</a>');
    var newDropdownMenu = $('<ul>').addClass('dropdown-menu').attr('id', 'myDropdown');
    newDropdownMenu.append('<li><a href="javascript:void()" id="oexcel" title="Export to Excel">Export to Excel</a></li>');
    newDropdownMenu.append('<li><a href="javascript:void()" id="opdf" title="Export data to PDF">Export to PDF</a></li>');
    newBtnGroupDropup.append(newDropdownMenu);
    newLi.append(newBtnGroupDropup);
    newUlPullRight.append(newLi);
    newColMd6_2.append(newUlPullRight);
    newSettingPanel.append(newColMd6_1);
    newSettingPanel.append(newColMd6_2);
    newTablePanel.append(newSettingPanel);

    // Append the new structure outside the table
    $('#newTable').parent().after(newTablePanel);
    $('#IPRheader').html(`
  <tr>
    <th class="text-center" style="display:none;">S.No</th>
    <th class="ApplicantName"><div class="thbg">Applicant Name</div></th>
    <th class="ApplicationNo"><div class="thbg">Application No.</div></th>
    <th class="PublicationDate"><div class="thbg">Publication Date</div></th>
    <th class="FilingDate"><div class="thbg">Date of filing of Application</div></th>
    <th class="TitleOfInvention"><div class="thbg">Title of the Invention</div></th>
    <th class="InternationalClassification"><div class="thbg">International Classification</div></th>
    <th class="PriorityDocumentNo"><div class="thbg">Priority Document No.</div></th>
    <th class="PriorityDate"><div class="thbg">Priority Date</div></th>
    <th class="PriorityCountry"><div class="thbg">Name of Priority Country</div></th>
    <th class="InternationalApplicationNo"><div class="thbg">International Application No.</div></th>
    <th class="InternationalFilingDate"><div class="thbg">International Application Filing Date</div></th>
    <th class="InternationalPublicationNo"><div class="thbg">International Publication No.</div></th>
    <th class="PatentAdditionNo"><div class="thbg">Patent of Addition to Application Number</div></th>
    <th class="FilingDatePatentAddition"><div class="thbg">Patent of Addition to Application Filing Date</div></th>
    <th class="DivisionalNo"><div class="thbg">Divisional to Application Number</div></th>
    <th class="FilingDateInventor"><div class="thbg">Divisional to Application Filing Date</div></th>
    <th class="InventorName"><div class="thbg">Name of Inventor</div></th>
    <th class="Abstract"><div class="thbg">Abstract</div></th>
    <th class="NoOfPages"><div class="thbg">No. of pages</div></th>
    <th class="NoOfClaims"><div class="thbg">No. of claims</div></th>
    <th class="PatentOfficeJournal"><div class="thbg">The Patent Office Journal</div></th>
    <th class="action"><div class="thbg" style="display:flex; justify-content:center;">Action</div></th>
  </tr>
`);


    // Event handler for Export to PDF
    $('#opdf').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Pdf Patent My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            //html += '<td>' +
            //    '<ul class="table_action">' +
            //    '<li>' +
            //    '<span style="cursor:pointer;color:#069;" id="exporttoPDFfilePatent" pageno="' + i + '" type="pdf">' +
            //    '<img src="/newassets/img/download.svg" alt="Download File" />' +
            //    'Download File' +
            //    '</span>' +
            //    '</li>' +
            //    '</ul>' +
            //    '</td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoPDFfilePatent" pageno="' + i + '" type="pdf"><img src="/newassets/img/download.svg" /></span></li></ul></td>';

            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    // Event handler for Export to Excel
    $('#oexcel').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Excel Patent My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            //html += '<td>' +
            //    '<ul class="table_action">' +
            //    '<li>' +
            //    '<span style="cursor:pointer;color:#069;" id="exporttoexcelfilePatent" pageno="' + i + '" type="excel">' +
            //    '<img src="/newassets/img/download.svg" alt="Download File" />' +
            //    'Download File' +
            //    '</span>' +
            //    '</li>' +
            //    '</ul>' +
            //    '</td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoexcelfilePatent" pageno="' + i + '" type="excel"><img src="/newassets/img/download.svg" /></span></li></ul></td>';

            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    var formData = new FormData();
    formData.append("pagenum1", pageindex);
    formData.append("pagesize1", pagesize);
    formData.append("iptypeid", IPname)

    var htmls = '';
    $.ajax(
        {
            async: true,
            type: "POST",
            url: "/api/IPRApi/ListForIPRPatentCase",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            async: true,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = response1.Data.data;
                var length = obj.length;
                var obj1 = obj.data;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $("#divalertlist tr").remove();
                    $.each(obj, function (i, val) {
                        // alert(val.RowId);
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
                        //        $("#pagnumvaluePatent").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    $("#exportrecords").val(val.TotalRecord);
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvaluePatent" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenumPatent" style="margin-left:10px;">Go</button></a> </li>'

                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginatePatent"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginatePatent"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginatePatent" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }

                        //    $("#IPRpaginfield").html("");
                        //    $("#IPRpaginfield").html(tfot);
                        //}
                        if (i === (length - 1)) {

                            $("#MyListCount").text(" (" + val.TotalRecord + ")");
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
                                totalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }


                        var RowId = val.RowId;
                        var iid = val.iid;
                        htmls += `<tr>
            <td style="text-align:center; display:none;" >` + RowId + `</td>
            <td class="ApplicantName">` + checkformatvalue(val.ApplicantName) + `</td>
            <td class="ApplicationNo">` + checkformatvalue(val.ApplicationNo) + `</td>
            <td class="PublicationDate">` + convertdate(checkformatvalue(val.PublicationDate)) + `</td>
            <td class="FilingDate">` + convertdate(checkformatvalue(val.FilingDate)) + `</td>
            <td class="TitleOfInvention">` + checkformatvalue(val.TitleOfInvention) + `</td>
            <td class="InternationalClassification">` + checkformatvalue(val.InternationalClassification) + `</td>
            <td class="PriorityDocumentNo">` + checkformatvalue(val.PriorityDocumentNo) + `</td>
            <td class="PriorityDate">` + checkformatvalue(val.PriorityDate) + `</td>
            <td class="PriorityCountry">` + checkformatvalue(val.PriorityCountry) + `</td>
            <td class="InternationalApplicationNo">` + checkformatvalue(val.InternationalApplicationNo) + `</td>
            <td class="InternationalFilingDate">` + checkformatvalue(val.InternationalFilingDate) + `</td>
            <td class="InternationalPublicationNo">` + checkformatvalue(val.InternationalPublicationNo) + `</td>
            <td class="PatentAdditionNo">` + checkformatvalue(val.PatentAdditionNo) + `</td>
            <td class="FilingDatePatentAddition">` + checkformatvalue(val.FilingDatePatentAddition) + `</td>
            <td class="DivisionalNo">` + checkformatvalue(val.DivisionalNo) + `</td>
            <td class="FilingDateInventor">` + checkformatvalue(val.FilingDateInventor) + `</td>
            <td class="InventorName">` + checkformatvalue(val.InventorName) + `</td>
            <td class="Abstract">` + checkformatvalue(val.Abstract) + `</td>
            <td class="NoOfPages">` + checkformatvalue(val.NoOfPages) + `</td>
            <td class="NoOfClaims">` + checkformatvalue(val.NoOfClaims) + `</td>
            <td class="PatentOfficeJournal">` + checkformatvalue(val.PatentOfficeJournal) + `</td>
            <td>
                <ul class="table_action">
                    <li>
                        <span class="taskoutboxbtnicon" style="cursor:pointer;" id="editPatent" onclick="editMyListForPatent('` + iid + `')" title="Edit IPR Case">
                            <img src="/newassets/img/edit.svg" alt="Edit"/>
                        </span>
                    </li>
                    <li>
                        <span class="taskoutboxbtnicon" style="cursor:pointer;" id="deletePatent" onclick="confirmDeletePatentMyList('` + iid + `')" title="Delete">
                            <img src="/newassets/img/delete.svg" alt="Delete"/>
                        </span>
                    </li>
                </ul>
            </td>
        </tr>`;

                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<tr><td colspan="13" align="center">' +
                    //    '<div class="notfound">' +
                    //    '<img src="/newassets/img/not-found.png">' +
                    //    '<h4>Data Not Found</h4>' +

                    //    '</div>' +
                    //    '</td></tr>';
                    //htmls += '<tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not found");
                }

                $("#bindIPRData").html("");
                $("#bindIPRData").html(htmls);

                $.each($('#CustIPRcreatefield #myDropdown input'), function (i, val) {
                    if (val.checked == false) {
                        $('.' + val.name + '').css('display', 'none');
                    }
                    else {
                        $('.' + val.name + '').css('display', '');
                    }
                });

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

function AddIPRPatentCheckList() {
    $('#CustIPRcreatefield').html('');
    $('#CustIPRcreatefield').css('display', 'block');
    $('#CustIPRcreatefield').css('padding', '0 15px 0 0');
    var tfot = '';
    //tfot += '<ul class="pull-right"><li><div class="btn-group dropup">';
    //tfot += '<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" ';
    //tfot += 'style="background-color: #ebebeb !important; margin-top: -5px !important;white-space: nowrap;width:105%;" ';
    //tfot += 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Customize Field</a>';
    tfot += '<ul id="myDropdown">';
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="ApplicantName" name="ApplicantName" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="ApplicantName">Applicant Name</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="ApplicationNo" name="ApplicationNo" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="ApplicationNo">Applicant No</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="PublicationDate" name="PublicationDate" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PublicationDate">Publication Date</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="FilingDate" name="FilingDate" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="FilingDate">Date of filing of Application</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="TitleOfInvention" name="TitleOfInvention" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="TitleOfInvention">Title of the Invention</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="InternationalClassification" name="InternationalClassification" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="InternationalClassification">International Classification</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="PriorityDocumentNo" name="PriorityDocumentNo" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PriorityDocumentNo">Priority Document No</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="PriorityDate" name="PriorityDate" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PriorityDate">Priority Date</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="PriorityCountry" name="PriorityCountry" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PriorityCountry">Name of Priority Country</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="InternationalApplicationNo" name="InternationalApplicationNo" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="InternationalApplicationNo">International Application No</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="InternationalFilingDate" name="InternationalFilingDate" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="InternationalFilingDate">International Application Filing Date</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="InternationalPublicationNo" name="InternationalPublicationNo" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="InternationalPublicationNo">International Publication No</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="PatentAdditionNo" name="PatentAdditionNo" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PatentAdditionNo">Patent of Addition to Application Number</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="FilingDatePatentAddition" name="FilingDatePatentAddition" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="FilingDatePatentAddition">Patent of Addition to Application Filing Date</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="DivisionalNo" name="DivisionalNo" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="DivisionalNo">Divisional to Application Number</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="FilingDateInventor" name="FilingDateInventor" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="FilingDateInventor">Divisional to Application Filing Date</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="InventorName" name="InventorName" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="InventorName">Name of Inventor</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="Abstract" name="Abstract" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="Abstract">Abstract</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="NoOfPages" name="NoOfPages" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="NoOfPages">No. of pages</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="NoOfClaims" name="NoOfClaims" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="NoOfClaims">No. of claims</label>
        </li>`;
    tfot += `<li class="checkbox-item" id="checkboxItem">
            <input type="checkbox" id="PatentOfficeJournal" name="PatentOfficeJournal" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PatentOfficeJournal">The Patent Office Journal</label>
        </li>`;

    tfot += '</ul>';
    //tfot += '</ul></div></li></ul>';
    $('#CustIPRcreatefield').html(tfot);
}



function GetIPRListForGI(pageindex) {
    openload();
    $('#hideforCategory').hide();
    // Check if the table already exists
    var newTable = $('#newTable');
    if (newTable.length === 0) {
        newTable = $('<table>').addClass('table-panel').attr('id', 'newTable');
        var headerRow = $('<thead>').append(`
  <tr>
    <th><div class="thbg text-center" style="display:flex; justify-content:center;">S.No</div></th>
    <th><div class="thbg">Applicant Name</div></th>
    <th><div class="thbg">Address</div></th>
    <th><div class="thbg">Application Number</div></th>
    <th><div class="thbg">Name of the GI</div></th>
    <th><div class="thbg">Date</div></th>
    <th><div class="thbg">Class</div></th>
    <th><div class="thbg">Goods</div></th>
    <th><div class="thbg">Specification</div></th>
    <th style="text-align:center;"><div class="thbg" style="display:flex; justify-content:center;">Action</div></th>
  </tr>
`);

        newTable.append(headerRow);
        var tbody = $('<tbody>').attr('id', 'bindNewIPRData');
        newTable.append(tbody);
        $('#hideforCategory').after(newTable);
        // Create and append a new table-panel structure
        //$('#newPanel').hide();
        //var newTablePanel = $('<div>').addClass('table-panel');
        //var newSettingPanel = $('<div>').addClass('settingpanel');
        //var newColMd6_1 = $('<div>').addClass('col-md-6');
        //newColMd6_1.append('<div style="float: left;padding: 0 10px 0 0;"></div>');
        //newColMd6_1.append('<div id="ptfooter"></div>');
        //var newColMd6_2 = $('<div>').addClass('col-md-6');
        //var newUlPullRight = $('<ul>').addClass('pull-right');
        //var newLi = $('<li>');
        //var newBtnGroupDropup = $('<div>').addClass('btn-group dropup');
        //newBtnGroupDropup.append('<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action Selected</a>');
        //var newDropdownMenu = $('<ul>').addClass('dropdown-menu').attr('id', 'myDropdown');
        //newDropdownMenu.append('<li><a href="javascript:void()" id="oexcel" title="Export to Excel">Export to Excel</a></li>');
        //newDropdownMenu.append('<li><a href="javascript:void()" id="opdf" title="Export data to PDF">Export to PDF</a></li>');
        //newBtnGroupDropup.append(newDropdownMenu);
        //newLi.append(newBtnGroupDropup);
        //newUlPullRight.append(newLi);
        //newColMd6_2.append(newUlPullRight);
        //newSettingPanel.append(newColMd6_1);
        //newSettingPanel.append(newColMd6_2);
        //newTablePanel.append(newSettingPanel);
        //$('#newTable').parent().after(newTablePanel);
    }

    // Event handler for Export to PDF
    $('#opdf').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Pdf GI My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            //html += '<td>' +
            //    '<ul class="table_action">' +
            //    '<li>' +
            //    '<span style="cursor:pointer;color:#069;" id="exporttoPDFfileGI" pageno="' + i + '" type="pdf">' +
            //    '<img src="/newassets/img/download.svg" alt="Download File" />' +
            //    'Download File' +
            //    '</span>' +
            //    '</li>' +
            //    '</ul>' +
            //    '</td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoPDFfileGI" pageno="' + i + '" type="pdf"><img src="/newassets/img/download.svg" /></span></li></ul></td>';

            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    // Event handler for Export to Excel
    $('#oexcel').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Excel GI My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            //html += '<td>' +
            //    '<ul class="table_action">' +
            //    '<li>' +
            //    '<span style="cursor:pointer;color:#069;" id="exporttoexcelfileGI" pageno="' + i + '" type="excel">' +
            //    '<img src="/newassets/img/download.svg" alt="Download File" />' +
            //    'Download File' +
            //    '</span>' +
            //    '</li>' +
            //    '</ul>' +
            //    '</td>';
            html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" id="exporttoexcelfileGI" pageno="' + i + '" type="excel"><img src="/newassets/img/download.svg" /></span></li></ul></td>';

            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    var formData = new FormData();
    formData.append("pagenum1", pageindex);
    formData.append("pagesize1", pagesize);
    formData.append("iptypeid", IPname)
    var htmls = '';
    $.ajax(
        {
            async: true,
            type: "POST",
            url: "/api/IPRApi/ListForIPRGICase",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            async: true,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = response1.Data.data;
                var length = obj.length;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $("#divalertlist tr").remove();
                    $.each(obj, function (i, val) {
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
                        //        $("#pagnumvalueGI").attr("max", totpage);
                        //    }

                        //    var tfot = '';
                        //    $("#exportrecords").val(val.TotalRecord);
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalueGI" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenumGI" style="margin-left:10px;">Go</button></a> </li>'
                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginateGI"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginateGI"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginateGI" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }

                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#MyListCount").text(" (" + val.TotalRecord + ")");
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
                                totalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }


                        var RowId = val.RowId;
                        var iid = val.iid

                        htmls += `<tr>
            <td style="text-align:center;">${RowId}</td>
            <td>${val.ApplicantName}</td>
            <td>${checkformatvalue(val.ApplicantAddress)}</td>
            <td>${checkformatvalue(val.ApplicationNo)}</td>
            <td>${checkformatvalue(val.GIName)}</td>
            <td>${convertdate(checkformatvalue(val.GIDate))}</td>
            <td>${checkformatvalue(val.Class)}</td>
            <td>${checkformatvalue(val.Goods)}</td>
            <td>${checkformatvalue(val.Specifications)}</td>
            <td>
                <ul class="table_action">
                    <li>
                        <span class="taskoutboxbtnicon" 
                              style="cursor:pointer;" 
                              title="Edit IPR Case" 
                              onclick="editMyListForGI('${iid}')">
                            <img src="/newassets/img/edit.svg" alt="Edit IPR Case"/>
                        </span>
                    </li>
                    <li>
                        <span class="taskoutboxbtnicon" 
                              style="cursor:pointer;" 
                              title="Delete" 
                              onclick="confirmDeleteGIMyList('${iid}')">
                            <img src="/newassets/img/delete.svg" alt="Delete"/>
                        </span>
                    </li>
                </ul>
            </td>
          </tr>`;

                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<tr><td colspan="13" align="center">' +
                    //    '<div class="notfound">' +
                    //    '<img src="/newassets/img/not-found.png">' +
                    //    '<h4>Data Not Found</h4>' +

                    //    '</div>' +
                    //    '</td></tr>';
                    //htmls += '<tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not found");
                }
                $("#bindNewIPRData").html("");
                $("#bindNewIPRData").html(htmls);
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

function GetIPRListForDesign(pageindex) {
    openload();
    var newTablePanel = $('<div>').addClass('table-panel');
    var newSettingPanel = $('<div>').addClass('settingpanel');
    var newColMd6_1 = $('<div>').addClass('col-md-6');
    newColMd6_1.append('<div style="float: left;padding: 0 10px 0 0;"></div>');
    newColMd6_1.append('<div id="ptfooter"></div>');
    var newColMd6_2 = $('<div>').addClass('col-md-6');
    var newUlPullRight = $('<ul>').addClass('pull-right');
    var newLi = $('<li>');
    var newBtnGroupDropup = $('<div>').addClass('btn-group dropup');
    newBtnGroupDropup.append('<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action Selected</a>');
    var newDropdownMenu = $('<ul>').addClass('dropdown-menu').attr('id', 'myDropdown');
    newDropdownMenu.append('<li><a href="javascript:void()" id="oexcel" title="Export to Excel">Export to Excel</a></li>');
    newDropdownMenu.append('<li><a href="javascript:void()" id="opdf" title="Export data to PDF">Export to PDF</a></li>');
    newBtnGroupDropup.append(newDropdownMenu);
    newLi.append(newBtnGroupDropup);
    newUlPullRight.append(newLi);
    newColMd6_2.append(newUlPullRight);
    newSettingPanel.append(newColMd6_1);
    newSettingPanel.append(newColMd6_2);
    newTablePanel.append(newSettingPanel);

    // Append the new structure outside the table
    $('#newTable').parent().after(newTablePanel);
    $('#IPRheader').html(`
  <tr>
    <th style="text-align:center;">S.No</th>
    <th class="ApplicantName"><div class="thbg">Applicant Name</div></th>
    <th class="ApplicantAddress"><div class="thbg">Address</div></th>
    <th class="Title"><div class="thbg">Title</div></th>
    <th class="DesignNumber"><div class="thbg">Design number</div></th>
    <th class="Class"><div class="thbg">Class</div></th>
    <th class="dDate"><div class="thbg">Date</div></th>
    <th class="JournalNumber"><div class="thbg">Journal No.</div></th>
    <th class="PriorityNumber"><div class="thbg">Priority Number</div></th>
    <th class="PriorityDate"><div class="thbg">Priority Date</div></th>
    <th class="PriorityCountry"><div class="thbg">Priority Country</div></th>
    <th style="text-align:center;">Action</th>
  </tr>
`);


    // Event handler for Export to PDF
    $('#opdf').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Pdf Design My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td>' +
                '<ul class="table_action">' +
                '<li>' +
                '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttoPDFfileDesign" pageno="' + i + '" type="pdf" title="Download PDF">' +
                '<img src="/newassets/img/download.svg" alt="Download PDF"/>' +
                '</span>' +
                '</li>' +
                '</ul>' +
                '</td>';

            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    // Event handler for Export to Excel
    $('#oexcel').on('click', function () {
        $('#myModalexport').modal('show');
        $('#modalTitleExport').text('Export To Excel Design My List');
        var totalRecord = $("#exportrecords").val();
        var pagesize = 10;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td>' +
                '<ul class="table_action">' +
                '<li>' +
                '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttoexcelfileDesign" pageno="' + i + '" type="excel" title="Download Excel File">' +
                '<img src="/newassets/img/download.svg" alt="Download File"/>' +
                '</span>' +
                '</li>' +
                '</ul>' +
                '</td>';

            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    var formData = new FormData();
    formData.append("pagenum1", pageindex);
    formData.append("pagesize1", pagesize);
    formData.append("iptypeid", IPname)

    var htmls = '';
    $.ajax(
        {
            async: true,
            type: "POST",
            url: "/api/IPRApi/ListForIPRDesignCase",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            async: true,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = response1.Data.data;
                var length = obj.length;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $("#divalertlist tr").remove();
                    $.each(obj, function (i, val) {
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
                        //        $("#pagnumvaluePatent").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    $("#exportrecords").val(val.TotalRecord);
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalueDesign" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenumDesign" style="margin-left:10px;">Go</button></a> </li>'

                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginateDesign"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginateDesign"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginateDesign" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }

                        //    $("#IPRpaginfield").html("");
                        //    $("#IPRpaginfield").html(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#MyListCount").text(" (" + val.TotalRecord + ")");
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
                                totalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }


                        var RowId = val.RowId;
                        var iid = val.iid;
                        htmls += `<tr><td style="text-align:center;">` + RowId + `</td><td class="ApplicantName" >` + checkformatvalue(val.ApplicantName) + `</td><td class="ApplicantAddress" >` + checkformatvalue(val.ApplicantAddress) + `</td><td class="Title" >` + checkformatvalue(val.Title) + `</td><td class="DesignNumber" >` + checkformatvalue(val.DesignNumber) + `</td><td class="Class" >` + checkformatvalue(val.Class) + `</td><td class="dDate" >` + convertdate(checkformatvalue(val.dDate)) + `</td><td class="JournalNumber" >` + checkformatvalue(val.JournalNumber) + `</td><td class="PriorityNumber" >` + checkformatvalue(val.PriorityNumber) + `</td><td class="PriorityDate" >` + convertdate(checkformatvalue(val.PriorityDate)) + `</td><td class="PriorityCountry" >` + checkformatvalue(val.PriorityCountry) + `</td><td><ul class="table_action"><li><a class="taskoutboxbtnicon" style="cursor:pointer;" title="Edit IPR Case" onclick=editMyListForDesign("` + iid + `")><img src="/newassets/img/edit.svg" /></a></li>
                       <li><a class="taskoutboxbtnicon" style="cursor:pointer;" title="Delete" onclick=confirmDeleteDesignMyList("` + iid + `")><img src="/newassets/img/delete.svg" /></a></li></td></tr>`;
                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<tr><td colspan="13" align="center">' +
                    //    '<div class="notfound">' +
                    //    '<img src="/newassets/img/not-found.png">' +
                    //    '<h4>Data Not Found</h4>' +
                        
                    //    '</div>' +
                    //    '</td></tr>';

                    //htmls += '<tr>'
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html("Data not found");
                }

                $("#bindIPRData").html("");
                $("#bindIPRData").html(htmls);

                $.each($('#CustIPRcreatefield #myDropdown input'), function (i, val) {
                    if (val.checked == false) {
                        $('.' + val.name + '').css('display', 'none');
                    }
                    else {
                        $('.' + val.name + '').css('display', '');
                    }
                });
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

function AddIPRDesignCheckList() {
    $('#CustIPRcreatefield').html('');
    $('#CustIPRcreatefield').css('display', 'block');
    $('#CustIPRcreatefield').css('padding', '0 15px 0 0');
    var tfot = '';
    //tfot += '<ul class="pull-right"><li><div class="btn-group dropup">';
    //tfot += '<a href="javascript:void()" class="dropdown-toggle form-control selctInputFormat" ';
    //tfot += 'style="background-color: #ebebeb !important; margin-top: -5px !important;white-space: nowrap;width:105%;" ';
    //tfot += 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Customize Field</a>';
    tfot += '<ul id="myDropdown">';
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="ApplicantName" name="ApplicantName" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="ApplicantName">Applicant Name</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="ApplicantAddress" name="ApplicantAddress" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="ApplicantAddress">Address</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="Title" name="Title" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="Title">Title</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="DesignNumber" name="DesignNumber" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="DesignNumber">Design Number</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="Class" name="Class" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="Class">Class</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="dDate" name="dDate" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="dDate">Date</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="JournalNumber" name="JournalNumber" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="JournalNumber">Journal No</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="PriorityNumber" name="PriorityNumber" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PriorityNumber">Priority Number</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="PriorityDate" name="PriorityDate" checked onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PriorityDate">Priority Date</label>
        </li>`;
    tfot += `<li class="checkbox-item">
            <input type="checkbox" id="PriorityCountry" name="PriorityCountry" onchange="Customdisplay(this); toggleBorder(this)">
            <label for="PriorityCountry">Priority Country</label>
        </li>`;
    tfot += '</ul>';

    //tfot += '</ul></div></li></ul>';
    $('#CustIPRcreatefield').html(tfot);
}


function myfunctionPatent(objectValue) {
    openload();
    if (objectValue.checked === false) {
        $('#' + objectValue.name + '').css('display', 'none');
        $('.' + objectValue.name + '').css('display', 'none');
    }
    else {
        $('#' + objectValue.name + '').css('display', '');
        $('.' + objectValue.name + '').css('display', '');
    }
    closeload();
}

function myfunctionDesign(customValue) {
    openload();
    if (customValue.checked === false) {
        $('#' + customValue.name + '').css('display', 'none');
        $('.' + customValue.name + '').css('display', 'none');
    }
    else {
        $('#' + customValue.name + '').css('display', '');
        $('.' + customValue.name + '').css('display', '');
    }
    closeload();
}

function convertorightFormat(InputDate) {
    const inputDateString = '1900-01-01T00:00:00';
    // Create a Date object from the input string
    const dateObject = new Date(InputDate);
    // Define months array for mapping month numbers to month names
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    // Extract day, month, and year from the date object
    const day = dateObject.getDate();
    const month = months[dateObject.getMonth()];
    const year = dateObject.getFullYear();
    // Create the formatted date string
    const formattedDateString = `${day} ${month} ${year}`;
    return formattedDateString;
}

//  Export to pdf and Export to Excel Handling for Copyright My List   ---> Start
$(document).on("click", "#exporttoexcelfileCopyright", function () {
    openload();
    var IPList = '2'
    var txtApplicantName = $('#txtApplicantName').val();
    var applicantAddress = $("#txtAddress1").val();
    var titleWork = $('#txtTitleOfWork').val();
    var diaryNo = $('#txtDiaryNo').val();
    var rocNo = $('#txtRocNo').val();
    var category = $("#txtCategory").val();
    var dateValue = $("#txtCalendarView").val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoExcelCopyrightMyList?IPList=" + IPList + "&txtApplicantName=" + txtApplicantName + "&applicantAddress=" + applicantAddress + "&titleWork=" + titleWork
        + "&diaryNo=" + diaryNo + "&rocNo=" + rocNo + "&category=" + category + "&dateValue=" + dateValue + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});

$(document).on('click', '#exporttoPDFfileCopyright', function () {
    openload();
    var IPList = '2'
    var txtApplicantName = $('#txtApplicantName').val();
    var applicantAddress = $("#txtAddress1").val();
    var titleWork = $('#txtTitleOfWork').val();
    var diaryNo = $('#txtDiaryNo').val();
    var rocNo = $('#txtRocNo').val();
    var category = $("#txtCategory").val();
    var dateValue = $("#txtCalendarView").val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoPDFCopyrightMyList?IPList=" + IPList + "&txtApplicantName=" + txtApplicantName + "&applicantAddress=" + applicantAddress + "&titleWork=" + titleWork
        + "&diaryNo=" + diaryNo + "&rocNo=" + rocNo + "&category=" + category + "&dateValue=" + dateValue + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});
//  Export to pdf and Export to Excel Handling for Copyright My List   ---> End


//  Export to pdf and Export to Excel Handling for Patent My List   ---> Start
$(document).on("click", "#exporttoexcelfilePatent", function () {
    openload();
    var IPList = '3'
    var ApplicantName = $('#ApplicantName').val();
    var ApplicationNo = $('#ApplicationNo').val();
    var PublicationDate = $("#PublicationDate").val();
    var FilingDate = $('#FilingDate').val();
    var TitleOfInvention = $('#TitleOfInvention').val();
    var InventorName = $('#InventorName').val();
    var PatentOfficeJournal = $('#PatentOfficeJournal').val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoExcelPatentMyList?IPList=" + IPList + "&ApplicantName=" + ApplicantName + "&ApplicationNo=" + ApplicationNo + "&PublicationDate=" + PublicationDate
        + "&FilingDate=" + FilingDate + "&TitleOfInvention=" + TitleOfInvention + "&InventorName=" + InventorName + "&PatentOfficeJournal=" + PatentOfficeJournal + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});

$(document).on('click', '#exporttoPDFfilePatent', function () {
    openload();
    var IPList = '3'
    var ApplicantName = $('#ApplicantName').val();
    var ApplicationNo = $('#ApplicationNo').val();
    var PublicationDate = $("#PublicationDate").val();
    var FilingDate = $('#FilingDate').val();
    var TitleOfInvention = $('#TitleOfInvention').val();
    var InventorName = $('#InventorName').val();
    var PatentOfficeJournal = $('#PatentOfficeJournal').val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoPDFPatentMyList?IPList=" + IPList + "&ApplicantName=" + ApplicantName + "&ApplicationNo=" + ApplicationNo + "&PublicationDate=" + convertdate(PublicationDate)
        + "&FilingDate=" + convertdate(FilingDate) + "&TitleOfInvention=" + TitleOfInvention + "&InventorName=" + InventorName + "&PatentOfficeJournal=" + PatentOfficeJournal + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});
//  Export to pdf and Export to Excel Handling for Patent My List   ---> End

//  Export to pdf and Export to Excel Handling for GI My List   ---> Start

$(document).on("click", "#exporttoexcelfileGI", function () {
    openload();
    var IPList = '4'
    var ApplicantName = $('#ApplicantName').val();
    var ApplicantAddress = $('#ApplicantAddress').val();
    var ApplicationNo = $("#ApplicationNo").val();
    var GIName = $('#GIName').val();
    var GIDate = $('#GIDate').val();
    var Class = $('#Class').val();
    var Goods = $("#Goods").val();
    var Specifications = $("#Specifications").val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoExcelGIMyList?IPList=" + IPList + "&ApplicantName=" + ApplicantName + "&ApplicantAddress=" + ApplicantAddress + "&ApplicationNo=" + ApplicationNo
        + "&GIName=" + GIName + "&GIDate=" + GIDate + "&Class=" + Class + "&Goods=" + Goods + "&Specifications=" + Specifications + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});

$(document).on('click', '#exporttoPDFfileGI', function () {
    openload();
    var IPList = '4'
    var ApplicantName = $('#ApplicantName').val();
    var ApplicantAddress = $('#ApplicantAddress').val();
    var ApplicationNo = $("#ApplicationNo").val();
    var GIName = $('#GIName').val();
    var GIDate = $('#GIDate').val();
    var Class = $('#Class').val();
    var Goods = $("#Goods").val();
    var Specifications = $("#Specifications").val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoPDFGIMyList?IPList=" + IPList + "&ApplicantName=" + ApplicantName + "&ApplicantAddress=" + ApplicantAddress + "&ApplicationNo=" + ApplicationNo
        + "&GIName=" + GIName + "&GIDate=" + GIDate + "&Class=" + Class + "&Goods=" + Goods + "&Specifications=" + Specifications + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});
//  Export to pdf and Export to Excel Handling for GI My List   ---> End

//  Export to pdf and Export to Excel Handling for Design My List   ---> Start

$(document).on("click", "#exporttoexcelfileDesign", function () {
    openload();
    var IPList = '5'
    var ApplicantName = $('#ApplicantName').val();
    var ApplicantAddress = $('#ApplicantAddress').val();
    var Title = $("#Title").val();
    var DesignNumber = $('#DesignNumber').val();
    var Class = $('#Class').val();
    var dDate = $('#dDate ').val();
    var JournalNumber = $("#JournalNumber").val();
    var PriorityNumber = $("#PriorityNumber").val();
    var PriorityDate = $("#PriorityDate").val();
    var PriorityCountry = $("#PriorityCountry").val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoExcelDesignMyList?IPList=" + IPList + "&ApplicantName=" + ApplicantName + "&ApplicantAddress=" + ApplicantAddress + "&Title=" + Title + "&DesignNumber=" + DesignNumber + "&Class=" + Class
        + "&dDate=" + dDate + "&JournalNumber=" + JournalNumber + "&PriorityNumber=" + PriorityNumber + "&PriorityDate=" + PriorityDate + "&PriorityCountry=" + PriorityCountry + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});

$(document).on('click', '#exporttoPDFfileDesign', function () {
    openload();
    var IPList = '5'
    var ApplicantName = $('#ApplicantName').val();
    var ApplicantAddress = $('#ApplicantAddress').val();
    var Title = $("#Title").val();
    var DesignNumber = $('#DesignNumber').val();
    var Class = $('#Class').val();
    var dDate = $('#dDate ').val();
    var JournalNumber = $("#JournalNumber").val();
    var PriorityNumber = $("#PriorityNumber").val();
    var PriorityDate = $("#PriorityDate").val();
    var PriorityCountry = $("#PriorityCountry").val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoPDFDesignMyList?IPList=" + IPList + "&ApplicantName=" + ApplicantName + "&ApplicantAddress=" + ApplicantAddress + "&Title=" + Title + "&DesignNumber=" + DesignNumber + "&Class=" + Class
        + "&dDate=" + dDate + "&JournalNumber=" + JournalNumber + "&PriorityNumber=" + PriorityNumber + "&PriorityDate=" + PriorityDate + "&PriorityCountry=" + PriorityCountry + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});
//  Export to pdf and Export to Excel Handling for Design My List   ---> End


//  Export to pdf and Export to Excel Handling for Trademark My List   ---> Start

$(document).on("click", "#exporttoexcelfileTrademark", function () {
    openload()
    var IPList = '1'
    var name = $('#txtname').val();
    var trademark = $('#txttrademark').val();
    var UseOfMark = $('#ddlUseOfMark').val();
    var txtclass = $('#txtclass').val();
    var Priority = $('#ddlPriority').val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoExcelTrademarkMyList?IPList=" + IPList + "&name=" + name + "&trademark=" + trademark + "&UseOfMark=" + UseOfMark + "&txtclass=" + txtclass + "&Priority=" + Priority + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});

$(document).on('click', '#exporttoPDFfileTrademark', function () {
    openload();
    var IPList = '1'
    var name = $('#txtname').val();
    var UseOfMark = $('#ddlUseOfMark').val();
    var trademark = $('#txttrademark').val();
    var txtclass = $('#txtclass').val();
    var Priority = $('#ddlPriority').val();
    var pagenum = $(this).attr('pageno')

    window.location = encodeURI("/IPR/ExportoPDFTrademarkMyList?IPList=" + IPList + "&name=" + name + "&trademark=" + trademark + "&UseOfMark=" + UseOfMark + "&txtclass=" + txtclass + "&Priority=" + Priority
        + "&pagesize1=10" + "&pagenum1=" + pagenum);
    closeload();
});
//  Export to pdf and Export to Excel Handling for Trademark My List   ---> End


function deleteMyListForTrademark(id) {
    var ip = 1
    var formData = new FormData();
    formData.append("id", id);
    formData.append("ip", ip);
    openload();
    $.ajax({
        async: false,
        url: '/api/IPRApi/FetchDeleteIPRCaseById',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data && data.Status == true) {
                $("#myModalmarkdeleteTradeconfirmation").modal("hide");
                //alert('Record deleted successfully!');
                new PNotify({
                    title: 'Success!',
                    text: 'Record deleted successfully!',
                    type: 'success',
                    delay: 3000
                });
                window.location.reload();
                GetIPRList(pageindex);
            } else {
                //toastr.error('Error deleting record. Please try again.');
                new PNotify({
                    title: 'Error!',
                    text: 'Error deleting record. Please try again!',
                    type: 'Error',
                    delay: 3000
                });
            }
            closeload();
        },
        error: function (error) {
            console.error('Error calling controller method:', error);
            closeload();
        }
    });
}

function deleteMyListForCopyright(id) {
    var ip = 2
    var formData = new FormData();
    formData.append("id", id);
    formData.append("ip", ip);
    openload();
    $.ajax({
        async: false,
        url: '/api/IPRApi/FetchDeleteIPRCaseById',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data && data.Status == true) {
                $("#myModalmarkdeleteTradeconfirmation").modal("hide");
                //alert('Record deleted successfully!');
                new PNotify({
                    title: 'Success!',
                    text: 'Record deleted successfully!',
                    type: 'success',
                    delay: 3000
                });
                window.location.reload();
                GetIPRListForCopyright(pageindex);
            } else {
                //toastr.error('Error deleting record. Please try again.');
                new PNotify({
                    title: 'Error!',
                    text: 'Error deleting record. Please try again!',
                    type: 'Error',
                    delay: 3000
                });
            }
            closeload();
        },
        error: function (error) {
            console.error('Error calling controller method:', error);
            closeload();
        }
    });
}

function deleteMyListForPatent(id) {
    var ip = 3
    var formData = new FormData();
    formData.append("id", id);
    formData.append("ip", ip);
    openload();
    $.ajax({
        async: false,
        url: '/api/IPRApi/FetchDeleteIPRCaseById',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data && data.Status == true) {
                //alert('Record deleted successfully!');
                $("#myModalmarkdeleteTradeconfirmation").modal("hide");
                new PNotify({
                    title: 'Success!',
                    text: 'Record deleted successfully!',
                    type: 'success',
                    delay: 3000
                });
                window.location.reload();
                GetIPRListForPatent(pageindex);
            } else {
                //toastr.error('Error deleting record. Please try again.');
                new PNotify({
                    title: 'Error!',
                    text: 'Error deleting record. Please try again!',
                    type: 'Error',
                    delay: 3000
                });
            }
            closeload();
        },
        error: function (error) {
            console.error('Error calling controller method:', error);
            closeload();
        }
    });
}

function deleteMyListForGI(id) {
    var ip = 4
    var formData = new FormData();
    formData.append("id", id);
    formData.append("ip", ip);
    openload();
    $.ajax({
        async: false,
        url: '/api/IPRApi/FetchDeleteIPRCaseById',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data && data.Status == true) {
                //alert('Record deleted successfully!');
                $("#myModalmarkdeleteTradeconfirmation").modal("hide");
                new PNotify({
                    title: 'Success!',
                    text: 'Record deleted successfully!',
                    type: 'success',
                    delay: 3000
                });
                window.location.reload();
                GetIPRListForGI(pageindex);
            } else {
                //toastr.error('Error deleting record. Please try again.');
                new PNotify({
                    title: 'Error!',
                    text: 'Error deleting record. Please try again!',
                    type: 'Error',
                    delay: 3000
                });
            }
            closeload();
        },
        error: function (error) {
            console.error('Error calling controller method:', error);
            closeload();
        }
    });
}

function deleteMyListForDesign(id) {
    var ip = 5
    var formData = new FormData();
    formData.append("id", id);
    formData.append("ip", ip);
    openload();
    $.ajax({
        async: false,
        url: '/api/IPRApi/FetchDeleteIPRCaseById',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data && data.Status == true) {
                //alert('Record deleted successfully!');
                $("#myModalmarkdeleteTradeconfirmation").modal("hide");
                new PNotify({
                    title: 'Success!',
                    text: 'Record deleted successfully!',
                    type: 'success',
                    delay: 3000
                });
                window.location.reload();
                GetIPRListForDesign(pageindex);
            } else {
                //toastr.error('Error deleting record. Please try again.');
                new PNotify({
                    title: 'Error!',
                    text: 'Error deleting record. Please try again!',
                    type: 'Error',
                    delay: 3000
                });
            }
            closeload();
        },
        error: function (error) {
            console.error('Error calling controller method:', error);
            closeload();
        }
    });
}


function confirmDeleteTradeMyList(iid) {
    //var confirmation = confirm("Are you sure you want to delete?");
    //if (confirmation) {
    //    openload();
    //    deleteMyListForTrademark(iid);
    //    closeload();
    //}
    $("#ids_deleteTraderequesr").text("Delete Request");
    $("#msgRUSure").text("Are you sure you want to delete?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", iid);
}

$(document).on('click', '#deleteTrademarkDetails', function () {
    var trademarkIdDet = "";
    trademarkIdDet = $(this).attr("id-val");
    if (IPname == 1) {
        deleteMyListForTrademark(trademarkIdDet);
    } else if (IPname == 2) {
        deleteMyListForCopyright(trademarkIdDet);
    } else if (IPname == 3) {
        deleteMyListForPatent(trademarkIdDet);
    } else if (IPname == 4) {
        deleteMyListForGI(trademarkIdDet);
    } else {
        deleteMyListForDesign(trademarkIdDet);
    }
});

function confirmDeleteCopyMyList(iid) {
    //var confirmation = confirm("Are you sure you want to delete?");
    //if (confirmation) {
    //    openload();
    //    deleteMyListForCopyright(iid);
    //    closeload();
    //}
    $("#ids_deleteTraderequesr").text("Delete Request");
    $("#msgRUSure").text("Are you sure you want to delete?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", iid);
}

function confirmDeletePatentMyList(iid) {
    //var confirmation = confirm("Are you sure you want to delete?");
    //if (confirmation) {
    //    openload();
    //    deleteMyListForPatent(iid);
    //    closeload();
    //}
    $("#ids_deleteTraderequesr").text("Delete Request");
    $("#msgRUSure").text("Are you sure you want to delete?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", iid);
}

function confirmDeleteGIMyList(iid) {
    //var confirmation = confirm("Are you sure you want to delete?");
    //if (confirmation) {
    //    openload();
    //    deleteMyListForGI(iid);
    //    closeload();
    //}
    $("#ids_deleteTraderequesr").text("Delete Request");
    $("#msgRUSure").text("Are you sure you want to delete?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", iid);
}

function confirmDeleteDesignMyList(iid) {
    //var confirmation = confirm("Are you sure you want to delete?");
    //if (confirmation) {
    //    openload();
    //    deleteMyListForDesign(iid);
    //    closeload();
    //}
    $("#ids_deleteTraderequesr").text("Delete Request");
    $("#msgRUSure").text("Are you sure you want to delete?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", iid);
}