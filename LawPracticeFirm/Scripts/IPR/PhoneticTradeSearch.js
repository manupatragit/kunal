var pagesize = 10, pageindex = 1;
var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
$(document).ready(function () {
    if (IPname == "1") {
        $('#tradePagination').hide();
        $('#dynamiciprheader').text('Trademark');
        $('#searchHeaderName').text('Trademark');
        $('#btnNameDetail').html('Add Trademark');
        $('#spPhoneticSearch').show();
        $('#searchIP').show();
        $('#propSearch').show();
        $('#searchAgent').show();
    }
});
$(document).on("click", "#btnsearch", function () {
    isRenderPage = false;
    BindPhoneticWordDetail(pageindex);
});
$(document).on("click", "#btnClear", function () {
    $("#bindPhoneticSearchData").html("").html('');
    $('#tradePagination').hide();
    $("#PhoSearchCount").text("");
    $("#ptfooter").html("");
    $("#filtertradmark").val("");
    $("#pdatastatus").show();
    $("#tradePagination").hide();
});

/*Start page redirection*/
//$(document).on('click', "#searchPhonetictab", function () {
//    window.location.href = `/${fcode}/IPR/PhoneticSearch?IP=${IPname}`;
//})
//$(document).on('click', "#trackertab", function () {
//    window.location.href = `/${fcode}/IPR/ViewAddedTrademarks?IP=${IPname}`;
//})
//$(document).on('click', "#mylisttab", function () {
//    window.location.href = `/${fcode}/IPR/ViewIPRCase?IP=${IPname}`;
//})
//$(document).on('click', "#searchtab", function () {
//    window.location.href = `/${fcode}/IPR/TrademarkArchive?IP=${IPname}`;
//})
//$(document).on('click', "#deletemattertab", function () {
//    window.location.href = `/${fcode}/IPR/ViewDeletedTrademarks?IP=${IPname}`;
//})
//$(document).on('click', "#AddmanuallyTrade", function () {
//    window.location.href = `/${fcode}/IPR/CreateIPRCase?IP=${IPname}`;
//})
//$(document).on('click', "#AddTradeAfterSearch", function () {
//    window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
//})
//$(document).on('click', "#SharedTradetab", function () {
//    window.location.href = `/${fcode}/IPR/ViewSharedTrademark?IP=${IPname}`;
//})

$(document).on('click', "#backtoHome", function () {
    window.location.href = `/${fcode}/IPR/ViewAddedTrademarks?IP=${IPname}`;
})
$(document).on('click', "#searchIP", function () {
    window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
})
$(document).on('click', "#propSearch", function () {
    window.location.href = `/${fcode}/IPR/ProprietorSearch?IP=${IPname}`;
})
$(document).on('click', "#searchAgent", function () {
    window.location.href = `/${fcode}/IPR/AgentSearch?IP=${IPname}`;
})

/*End page redirection*/

function BindPhoneticWordDetail(pageindex) {
    var htmls = '';
    var searchTest = $('#filtertradmark').val();
    if (searchTest == "" || searchTest == undefined || searchTest == null || searchTest == 'null') {
        alert("Please fill input text");
        return false;
    }
    var formData = new FormData();
    formData.append("searchTest", searchTest);
    formData.append("PageNum", pageindex);
    formData.append("PageSize", pagesize);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/PhoneticSearchDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $("#ptfooter").html("");
            var totalRecord = '0';
            var totpage = 0;
            var obj1 = response1.Data;
            if (obj1 != "" && !obj1.ExceptionMessage) {
                var length = obj1[1].length;
                var qty = 0;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $('#tradePagination').show(); 
                    totalRecord = obj1[0].total;
                    $.each(obj1[1], function (i, val) {
                        var RowId = val[0].index
                        if (i === 0) {
                            firstvalue = RowId;
                        }
                        if (i === (length - 1)) {

                            //var pnext = pageindex;
                            //var pprev = pageindex;
                            //var pageno = pageindex;

                            //var totdata = totalRecord;
                            //if (totalRecord > 0) {
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
                            //$("#exportrecords").val(totalRecord);
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + totalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                            //if (totalRecord <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span id="paginate"  title="Previous Page" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></span></li>'
                            //}
                            //else {
                            //    tfot += '<li><span id="paginate"  title="Previous Page" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></span></li>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<span  id="paginate" title="Next Page"  index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#ptfooter").html("");
                            //$("#ptfooter").html(tfot);

                            $("#PhoSearchCount").text("(" + totalRecord + ")");

                            var totdata = totalRecord;
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
                        qty = qty + 1;

                        htmls += '<tr>'
                        htmls += '<td style="text-align: left;" id="rowid">' + RowId + '</td>';
                        htmls += '<td id="wordmark"><div style="display:flex; gap:20px;">' + val[0].vWordMark +
                            ' <span class="badge badge-light" style="color:black;margin-left:4px;position:relative;background-color: #87CEEB !important;">' +
                            val[0].count + '</span></div></td>';
                        htmls += '<td>' +
                            '<ul class="table_action">' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" style="margin-left:4px; cursor:pointer;" id="openTradePopup" wordmark="' +
                            val[0].vWordMark + '" data-toggle="modal" data-target="#bindTradeDetails"><img src="/newassets/img/eye.svg" /></span>' +
                            '</li>' +
                            '</ul>' +
                            '</td>';


                        htmls += '</tr>';

                    });
                } else {
                    //$("#bindPhoneticSearchData").html("").html('');
                    //htmls += '<tr>'
                    //htmls += '<td colspan=3 align=center>Data Not Found</td>'
                    //htmls += '<tr>'

                    $('#tradePagination').hide();
                    $("#PhoSearchCount").text("");
                    $("#pdatastatus").show();
                    $("#dtNotFound").text("No Trademarks found");
                }
            }
            else {
                $('#tradePagination').hide();
                $("#PhoSearchCount").text("");
                $("#pdatastatus").show();
                $("#dtNotFound").text("No Trademarks found");
                //htmls += '<tr>'
                //htmls += '<td colspan=3 align=center>Data Not Found</td>'
                //htmls += '<tr>'
            }

            $("#bindPhoneticSearchData").html("").html(htmls);
            closeload();
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
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
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbers").html(paginationHtml);
    isRenderPage = true;
}
var setPageNo = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isRenderPage = true;
    $("#txtgopage").val("");
    BindPhoneticWordDetail(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = true;
    $("#txtgopage").val("");
    BindPhoneticWordDetail(setPageNo);

    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    BindPhoneticWordDetail(setPageNo);
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
    isRenderPage = true;
    BindPhoneticWordDetail(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

$(document).on('click', '#paginate', function () {
    ppageindex = $(this).attr("index");
    BindPhoneticWordDetail(ppageindex);
});


$(document).on('click', '#getdatabypagenum', function () {
    var pageindex = $("#pagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            pagindexModal = pageindex;
            var totalpageindex = $("#sotopage").text();
            if (pagindexModal <= parseInt(totalpageindex)) {
                BindPhoneticWordDetail(pageindex);
            }
            else {
                alert("Please enter a valid page number.");
                return false;
            }
        }
    }
});

var wordMarkName = "";
var popindex = 1, popsize = 10;
$(document).on("click", "#openTradePopup", function () {
    isExamRnd = false;
    wordMarkName = $(this).attr("wordmark");//$('span#openTradePopup').attr('wordmark');
    popindex = 1;
    popsize = 10;
    BindModelPopUpDetail(popindex);
});

function BindModelPopUpDetail(indexnumber) {
    var htmls = '';
    popindex = indexnumber;
    var formData = new FormData();
    formData.append("searchTest", wordMarkName);
    formData.append("PageNum", indexnumber);
    formData.append("PageSize", popsize);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/PhoneticPopupDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $("#markFooter").html("");
            var totalRecord = '0';
            var totpage = 0;
            var obj1 = response1.Data;
            if (obj1 != "") {
                var length = obj1[1].length;
                var qty = 0;
                if (length > 0) {
                    totalRecord = obj1[0].total;
                    $.each(obj1[1], function (i, val) {
                        var RowId = val[0].index
                        if (i === 0) {
                            firstvalue = RowId;
                        }
                        if (i === (length - 1)) {
                            //var pnext = popindex;
                            //var pprev = popindex;
                            //var pageno = popindex;

                            //var totdata = totalRecord;
                            //if (totalRecord > 0) {
                            //    pnext = parseInt(pnext) + 1;
                            //    if (pnext == 0) pnext = 1;

                            //    pprev = parseInt(pageno) - 1;
                            //    if (pprev == 0) pprev = 1;
                            //    totpage = parseInt(totdata) / parseInt(popsize);

                            //    if (parseInt(totdata) % parseInt(popsize) != 0) {
                            //        totpage = parseInt(totpage) + 1;
                            //    }
                            //    $("#poppagnum").attr("max", totpage);
                            //}
                            //var tfot = '';
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + totalRecord + '</span>  <span id="poptopage" style="display:none">' + totpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + popindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="poppagnum" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="popgetdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'

                            //if (totalRecord <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span id="poppaginate"  title="Previous Page" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></span></li>'
                            //}
                            //else {
                            //    tfot += '<li><span id="poppaginate"  title="Previous Page" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></span></li>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<span  id="poppaginate" title="Next Page"  index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#markFooter").html("");
                            //$("#markFooter").html(tfot);

                            var totdata = totalRecord;
                            var totpage = 0;

                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (popindex == totpage) {
                                $('#ExamNext').hide();
                                $('#ExamPrev').css("display", "block");
                            }
                            else {
                                $('#ExamNext').css("display", "block");
                            }
                            if (popindex == 1) {
                                $('#ExamPrev').css("display", "none");
                            }
                            else {
                                $('#ExamPrev').css("display", "block");
                            }

                            if (isExamRnd == false) {
                                examTotRecord = totpage;
                                ExamRenderPagination(popindex, totpage);
                            }
                        }
                        qty = qty + 1;
                        //htmls += ' <tr><td style="text-align: left;" id ="rowid">' + RowId + '</td><td style="text-align: center;" id="applno">' + val[0].vApplNo + '</td><td id="wordmark">' + val[0].vWordMark + '</td>'
                        //    + '</tr>';
                        htmls += '<tr>'
                        htmls += '<td style="text-align: left;" id="rowid">' + RowId + '</td>';
                        htmls += ' <td id="applno">' + val[0].vApplNo + '</td>';
                        htmls += '<td id="wordmark">' + val[0].vWordMark + '</td>';
                        '</tr>';
                    });
                } else {
                    htmls += '<tr>'
                    htmls += '<td colspan=3 align=center>Data Not Found</td>'
                    htmls += '<tr>'
                }
            }
            else {

                htmls += '<tr>'
                htmls += '<td colspan=3 align=center>Data Not Found</td>'
                htmls += '<tr>'
            }

            $("#bindSameWordmark").html("").html(htmls);
            closeload();
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}


/*Popup Pagination Start*/
var isExamRnd = false;
function ExamRenderPagination(pageindex, totdata) {
    let totPages = totdata;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btnExam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btnExam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btnExam ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#ExamPageNumbers").html(paginationHtml);
    isExamRnd = true;
}

$(document).on("click", ".page-btnExam", function () {
    let page = $(this).data("page");
    popindex = page;
    isExamRnd = true;
    $("#opptxtgopage").val("");
    BindModelPopUpDetail(popindex);
    $(".page-btnExam").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#ExamPrev", function () {
    if (popindex > 1) {
        popindex = popindex - 1;
    }
    isExamRnd = true;
    $("#opptxtgopage").val("");
    BindModelPopUpDetail(popindex);

    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + popindex + "']").addClass("active");
});


$(document).on("click", "#ExamNext", function () {
    if (popindex => 1) {
        popindex = popindex + 1;
    }
    isExamRnd = true;
    $("#opptxtgopage").val("");
    BindModelPopUpDetail(popindex);
    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + popindex + "']").addClass("active");
});

$(document).on("click", "#ExamDivGo", function () {
    let goToPage = parseInt($("#Examtxtgopage").val());
    if (!isNaN(goToPage)) {
        popindex = goToPage;
    }

    if (goToPage > examTotRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        popindex = 1;
        return false;
    }
    isExamRnd = true;
    BindModelPopUpDetail(popindex);
    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + popindex + "']").addClass("active");
});

    /*Popup Pagination End*/

$(document).on('click', '#poppaginate', function () {
    ppageindex = $(this).attr("index");
    BindModelPopUpDetail(ppageindex);
});

$(document).on('click', '#popgetdatabypagenum', function () {
    var pageindex = $("#poppagnum").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            pagindexModal = pageindex;
            var totalpageindex = $("#sotopage").text();
            if (pagindexModal <= parseInt(totalpageindex)) {
                BindModelPopUpDetail(pageindex);
            }
            else {
                alert("Please enter a valid page number.");
                return false;
            }
        }
    }
});
