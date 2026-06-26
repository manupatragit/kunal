var fcode = localStorage.getItem("FirmCode");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var urlParams = new URLSearchParams(window.location.search);
var IPname = urlParams.get("IP");

$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    ArchivedIPRlist(pageindex);
});

var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {

    if (IPname == '1') {
        $("#SharedTradetab").css("display", "block");
    }
    $('form[id="iprform"]').validate({

        submitHandler: function (form) {
            GetIPRSignUP("");
        }
    });
    function convertDate(d) {
        var parts = d.split(" ");
        if (parts[1] == "") {
            return parts[0] + " " + parts[1] + " " + parts[2] + " " + parts[3];
        }
        else {
            return parts[0] + " " + parts[1] + " " + parts[2];
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


    function GetIPRSignUP(search) {

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/IPRApi/GetIPRSignUP1",
            dataType: 'json',
            success: function (response1) {

                //alert(response1);

                var length = response1.length;

                if (length > 0) {

                    $.each(response1, function (i, a) {

                    });
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


    //$(document).ready(function () {
    // GetIPRSignUP("");
    //GetClassList();
    /*GetStatusList();*/
    //GetIPList();
    //GetTypeList();
    //GetJurisdictionList();

    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;

    $(document).on('click', '#getdatabypagenum', function () {


        ppageindex = $("#pagnumvalue").val();

        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();

                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    ArchivedIPRlist(ppageindex);
                    closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
            //else {
            //    alert("Please enter a valid page number.");
            //    return false;
            //}
        }
    });
    var chksflag = true;

    $(document).on('click', '#paginate', function () {
        /* your code here */

        ppageindex = $(this).attr("index");
        ArchivedIPRlist(ppageindex)

    });
});
var totalArchiveRecord = 1;
function ArchivedIPRlist(pageindex) {
    openload();
    var Myobj = '';
    var spanChange = '';
    var htmls = '';

    var userName = $('#username').val();
    var userFullName = $('#userfname').val();

    switch (IPname) {
        case '1':
            $('#dynamicnotiheader').html('Trademark');
            $('#btnNameDetail').html('Add Trademark');
            $('#searchHeaderName').text('Trademark');
            $('#jAlertHistorytab').css("display", "block");
            //$('#spPhoneticSearch').show();
            Iplist = '1';
            break;
        case '2':
            $('#dynamicnotiheader').html('Copyright');
            $('#btnNameDetail').html('Add Copyright');
            $('#jAlertHistorytab').css("display", "none");
            Iplist = '2';
            break;
        case '3':
            $('#dynamicnotiheader').html('Patent');
            $('#btnNameDetail').html('Add Patent');
            $('#jAlertHistorytab').css("display", "none");
            Iplist = '3';
            break;
        case '4':
            $('#dynamicnotiheader').html('GI');
            $('#btnNameDetail').html('Add GI');
            $('#jAlertHistorytab').css("display", "none");
            Iplist = '4';
            break;
        case '5':
            $('#dynamicnotiheader').html('Design');
            $('#btnNameDetail').html('Add Design');
            $('#jAlertHistorytab').css("display", "none");
            Iplist = '5';
            break;
    }
    var formData = new FormData();
    formData.append('pageindex', pageindex);
    formData.append('ip', Iplist);
    $.ajax(
        {
            async: true,
            type: "POST",
            data: formData,
            url: "/api/IPRApi/ViewTrademarkArchiveList",
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                ShowAllSorting();
                var obj = JSON.parse(response1.Data.data);
                if (obj.data != null) {
                    var length = obj.data.length;
                    var obj1 = obj.data;
                    var qty = 0;
                    var k = 0;
                    if (length > 0) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                        $("#divalertlist tr").remove();
                        $("#pdatastatus").hide();
                        $("#dtNotFound").text("");
                        $.each(obj1, function (i, val) {
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

                            $("#SearchCount").text("(" + val.TotalRecord + ")");

                            if (i === (length - 1)) {
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
                                    totalArchiveRecord = totpage;
                                    renderPagination(pageindex, totpage);
                                }
                            }

                            qty = qty + 1;
                            var RowId = qty;
                            var TotalRecord = length;
                            //htmls += ' <tr><td>' + obj1[k].RowId + '</td><td style="text-align: left;"><a href="/' + fcode + '/IPR/IPRSearch?key=' + obj1[k].vKeyword + '&IP=' + IPname + '" style="cursor:pointer">' + obj1[k].vKeyword + '</a></td><td>' + splitDateFromT(obj1[k].dEntryDate) + '</td><td>' + userFullName + '</td>'
                            htmls += ' <tr><td style="display:none;">' + obj1[k].RowId + '</td><td style="text-align: left;">' + obj1[k].vKeyword + '</td><td>' + splitDateFromT(obj1[k].dEntryDate) + '</td><td>' + userFullName + '</td><td><ul class="table_action"><li><a class="taskoutboxbtnicon" href="/' + fcode + '/IPR/IPRSearch?key=' + obj1[k].vKeyword + '&IP=' + IPname + '" style="cursor:pointer"><img src="/newassets/img/search_icon.svg" /></a></li></ul></td>'
                            k = k + 1
                        });
                    } else {
                        $('#tradePagination').hide();
                        $("#SearchCount").text("");
                        $("#pdatastatus").show();
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                        $("#dtNotFound").text("Data not Found");
                        //htmls += '<tr>'
                        //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                        //htmls += '<tr>'
                    }
                    $("#bindIPRSearchData").html("").html(htmls);
                    closeload();
                }
                else {
                    $('#tradePagination').hide();
                    $("#SearchCount").text("");
                    $("#pdatastatus").show();
                    $("#dtNotFound").text("Data not Found");
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
    ArchivedIPRlist(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    isRenderPage = false;
    $("#txtgopage").val("");
    ArchivedIPRlist(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = false;
    $("#txtgopage").val("");
    ArchivedIPRlist(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > totalArchiveRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isRenderPage = false;
    ArchivedIPRlist(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/
//New Function for sorting Data.

function fnSort(sort, colname) {
    if ($('#hdnsort').val() == 0) {
        $('#hdnsort').val(1);
    }
    else {
        $('#hdnsort').val(0);
    }
}
function splitDateFromT(d) {
    var dateSplitValue = d.split("T");
    var newDate = dateSplitValue[0];
    return newDate;
}

function convertDate(d) {
    var parts = d.split(" ");
    if (parts[1] == "") {
        return parts[0] + " " + parts[1] + " " + parts[2] + " " + parts[3];
    }
    else {
        return parts[0] + " " + parts[1] + " " + parts[2];
    }
}

function ShowAllSorting() {
    $('#sortapplno').show();
    $('#sortmark').show();
    $('#sortpropname').show();
    $('#sortstatus').show();
    $('#sortclassdetails').show();
    $('#sortdateofappl').show();
    $('#sortuserdetails').show();
}