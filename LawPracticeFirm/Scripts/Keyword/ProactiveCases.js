var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, ppageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;


$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
        //document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    });
    var fcode = localStorage.getItem("FirmCode");
    $("#proactiveKeywordlink").attr("href", "/" + fcode + "/Keyword/Proactivealert");
    $("#proactivecaselink").attr("href", "/" + fcode + "/Keyword/ProactiveCases");
    jQuery('#teammemberidKey').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });

    FillKeywordCourtType();
    localStorage.setItem("shortcontact", "1");
    setTimeout(function () {
        isRenderPage = false;
        BindKeywordCaseList(pageindex);
    }, 3000);


    $("#btnsearch").click(function () {
        var itype = $("#divcourt").val();
        var frmdate = $("#frmdate").val();
        var todate = $("#todate").val();
        var vcourtId = $("#divcourtname").val();
        var ddlKeyword = $("#ddlKeyword").val();
        vcourtId = (itype == 7 ? $("#divcourtnamerera").val() : $("#divcourtname").val())

        if (itype == "") {
     /*       alert("Please select Court Type");*/
            showAlert("Validation Error", "Please select Court Type");
            return false;
        }
        else {
            if (frmdate != "") {
                //document.getElementById("lbldate").innerHTML = (frmdate + " - " + todate);
            }
            isRenderPage = false;
            BindKeywordCaseList(pageindex);
        }

    });

    /*Pagination Start*/


    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindKeywordCaseList(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        BindKeywordCaseList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$("#prev").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindKeywordCaseList(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        BindKeywordCaseList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#next").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindKeywordCaseList(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        //loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        BindKeywordCaseList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    if (goToPage > totalRecordCount) {
    //        setPageNo = 1;
    //        showAlert("Validation Error", "Please enter a valid page number.");
    //     /*   alert("Please enter a valid page number.");*/
    //        return false;
    //    }
    //    isRenderPage = true;
    //    BindKeywordCaseList(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
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
        BindKeywordCaseList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

/*Get keyword case list data by page number*/
    //$(document).on('click', '#getdatabypagenum', function () {

    //    ppageindex = $("#pagnumvalue").val();
    //    if (ppageindex != "undefined") {
    //        if (Math.sign(ppageindex) == 1) {
    //            var ppageindesx = $("#sotopage").text();

    //            if (ppageindex <= parseInt(ppageindesx)) {

    //                //openload();
    //                BindKeywordCaseList(ppageindex);
    //                //closeload();
    //            }
    //            else {
    //                alert("Please enter a valid page number.");
    //                //closeload();
    //                return false;
    //            }
    //        }
    //    }
    //});

    //$(document).on('click', '#paginate', function () {

    //    ppageindex = $(this).attr("index");
    //    BindKeywordCaseList(ppageindex);
    //});
    /*Export to excel start*/
    $("#oexcelforcases").click(function () {
        $("#Exporttype").val('');
        $("#Exporttype").val("Excel");
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        $("#id_exportreportdrop").html('');
        var pagesize = 200;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '<option value="" selected>Please Select</option>';
        for (var i = 1; i < recordsection; i++) {
            //html += '<tr>';
            //html += '<td>Page No:' + i + ' </td>';
            //html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
            //html += '</tr>';
            html += '<option value="' + i + '" > ' + i + ' </option>';

        }
        $("#id_exportreportdrop").html(html);
    });

    $(document).on("click", "#CommonExportExcel", function () {
        var PageIndex = $("#id_exportreportdrop").val();
        if (PageIndex == "") {
            showAlert("Validation Error", "Please select the page no.");
            /*alert("Please select the page no.");*/
            return false;
        }
        var pagenum = PageIndex;//$(this).attr("pageno");
        var pagesizedata = 500;
        var itype = $("#divcourt").val();
        var frmdate = $("#frmdate").val();
        var todate = $("#todate").val();
        var vcourtId = (itype == 7 ? $("#divcourtnamerera").val() : $("#divcourtname").val());//$("#divcourtname").val();
        var ddlKeyword = $("#ddlKeyword").val();
        var causelistdatefilter = $("#divfilteroption").val();
        if (vcourtId == null) {
            vcourtId = "";
        }
        if (ddlKeyword == null) {
            ddlKeyword = "";
        }

        window.location =
            "/Keyword/ExportToExcelProActiveCaseListDetails" +
            "?status=true" +
            "&itype=" + encodeURIComponent(itype) +
            "&frmdate=" + encodeURIComponent(frmdate) +
            "&todate=" + encodeURIComponent(todate) +
            "&vcourtId=" + encodeURIComponent(vcourtId) +
            "&ddlKeyword=" + encodeURIComponent(ddlKeyword) +
            "&pagesize=" + encodeURIComponent(pagesizedata) +
            "&pagenum=" + encodeURIComponent(pagenum) +
            "&causelistdatefilter=" + encodeURIComponent(causelistdatefilter);
       // window.location = encodeURI("/Keyword/ExportToExcelProActiveCaseListDetails?status=true&itype=" + escape(itype) + "&frmdate=" + escape(frmdate) + "&todate=" + escape(todate) + "&vcourtId=" + escape(vcourtId) + "&ddlKeyword=" + escape(ddlKeyword) + "&pagesize=" + escape(pagesizedata) + "&pagenum=" + escape(pagenum) + "&causelistdatefilter=" + escape(causelistdatefilter));
    });
});

function fillReraCourt1() {
    var reracourt = "";
    $("#drpcourtname1 option").remove();
    $.ajax({
        type: "POST",
        url: "/AddCase/BindReraCourtType?reracourt=" + reracourt,
        dataType: "json",
        success: function (data) {
            $("#divcourtnamerera").html("");
            $("#divcourtnamerera").append("<option value='0'>Select Court</option>");
            for (var i = 0; i < data.length; i++) {
                if (data[i].casetype == "MHRERA") {
                    $("#divcourtnamerera").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                }
            }
        },
        error: function (data) {
        }
    });
}
/*Bind keyword case list*/
var totalRecordCount = 1;
function BindKeywordCaseList(pageindex) {
    document.querySelector(".pagination").style.display = "none";
    //document.getElementById('pagenatedArea').style.display = 'none';
    var htmls = '';
    var formData = new FormData();
    pagesize = 10;
    var itype = $("#divcourt").val();
    if (itype == null) {
        itype = "1";
    }
    var frmdate = $("#frmdate").val();
    var todate = $("#todate").val();
    //var vcourtId = $("#divcourtname").val();
    var vcourtId = (itype == 7 ? $("#divcourtnamerera").val() : $("#divcourtname").val())
    var ddlKeyword = $("#ddlKeyword").val();
    var causelistdatefilter = $("#divfilteroption").val();
    if (vcourtId == null) {
        vcourtId = "";
    }
    if (ddlKeyword == null) {
        ddlKeyword = "";
    }
    formData.append("itype", itype);
    formData.append("frmdate", frmdate);
    formData.append("todate", todate);
    formData.append("vcourtId", vcourtId);
    formData.append("ddlKeyword", ddlKeyword);
    formData.append("pagesize", pagesize);
    formData.append("pagenum", pageindex);
    formData.append("causelistdatefilter", causelistdatefilter);
    openloadPro();
  var keywordcases=  $.ajax(
        {
            async: true,
            type: "POST",
            url: "/Keyword/ViewProactiveAlerts",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {
                //$("#exportrecords").val(0);
                var obj = response1;
                var length = obj.length;
                var obj1 = obj;
                var qty = 0;
                var qty1 = 0;
                $('.pagination').css('display', 'flex');
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                if (length > 0) {

                    //document.getElementById('pagenatedArea').style.display = 'block';
                    // $("#bindKeywordData tr").remove();
                    $.each(response1, function (i, val) {
                        //alert(val.RowId);

                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        var totpage = 0;
                        if (i === (length - 1)) {
                            var totdata = val.TotalRecord;

                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#next').hide();
                                //$('#next').css("display", "none");
                                $('#prev').css("display", "block"); s
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
                        }
                        $("#exportrecords").val(totdata);
                        qty = qty + 1;
                        qty1 = qty1 + 1;
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        //debugger
                        var casensss1 = val.Filetext;
                        var addcaselink = "";
                        if (role == "1") {
                            if (val.isAdded == "0") {
                                addcaselink = "<ul class='table_action'><li><a class='taskoutboxbtnicon addcasebtn' title='Add Case' href='javascript:void' id='AddKeywordCase' val-id='" + val.iid + "' val-ittype='" + val.itype + "' sno='" + casensss1 + "' data-appealno='" + val.appealno + "' data-courtname='" + (val.vCourtName || "") + "' data-estbname='" + (val.vCompEstbCodeName || "") + "' data-cnrno='" + (val.vCNRNo || "") + "' data-keyword='" + (val.vKeyword || "") + "' data-statename='" + (val.Statename || "") + "' data-districtname='" + (val.vDistrictName || "") + "' style='font-size: 12px; background: #fff; text-transform: capitalize; border-radius: 20px; padding: 2px 8px;'>+ Add</a></li></ul>";
                            } else {
                                addcaselink = "ADDED";
                            }
                        }
                        htmls += '<tr>';
                        htmls += '<td style="text-align: left;" class="SrNo">' + RowId + '</td>';
                        htmls += '<td style="text-align: left;" class="nheaingdate">' + val.vCauselistdate + '</td>';
                        htmls += '<td class="partyname">' + val.vKeyword + '</td>';
                        htmls += '<td class="appealno">' + val.appealno + '</td>';
                        htmls += '<td class="coutname"><span style="display: inline-flex; align-items: center; padding: 1px 5px; border: 1px solid #d1d5db; border-radius: 8px; background: #f9fafb; color: #374151; font-family: Arial, sans-serif; width: max-content;"><img src="/newassets/img/court.svg" alt="court" style="width: 10px; height: 10px; margin-right: 6px;">' + val.vCourtName + '</span></td>';
                        htmls += '<td class="district">' + val.vDistrict + '</td>';
                        htmls += '<td class="courtestablishment">' + val.vCompEstbCodeName + '</td>';
                        htmls += '<td class="cnrno">' + val.vCNRNo + '</td>';
                        if (val.Filetext == "" || val.Filetext == null || val.Filetext == "null") {
                            htmls += '<td class="searchresult">&nbsp;</td>'
                        }
                        else {
                            if (val.Filetext.length > 20) {
                                htmls += '<td class="searchresult">'
                                htmls += '<span class="comment more" style="">' + val.Filetext.substring(0, 20) + '</span>'
                                htmls += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                htmls += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;right:80px;height:auto;">'
                                htmls += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                htmls += '' + val.Filetext + ''
                                htmls += '</div>'
                                htmls += '</td>'
                            }
                            else {
                                htmls += '<td class="searchresult">' + (val.Filetext == null ? "" : val.Filetext) + '</td>'
                            }
                        }

                        if (val.vJudge == "" || val.vJudge == null || val.vJudge == "null") {
                            htmls += '<td class="judgename">&nbsp;</td>'
                        }
                        else {
                            if (val.vJudge.length > 20) {
                                htmls += '<td class="judgename">'
                                htmls += '<span class="comment more" style="">' + val.vJudge.substring(0, 20) + '</span>'
                                htmls += '<span data-toggle="collapse" data-target="#dtnj' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                htmls += ' <div id="dtnj' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;right:80px;height:auto;">'
                                htmls += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtnj' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                htmls += '' + val.vJudge + ''
                                htmls += '</div>'
                                htmls += '</td>'
                            }
                            else {
                                htmls += '<td class="judgename">' + (val.vJudge == null ? "" : val.vJudge) + '</td>'
                            }
                        }
                        htmls += '<td class="filingdate">' + val.filingdate + '</td>';
                        htmls += '<td class="alertreceiveddate">' + val.AlertReceivedOn + '</td>';
                        if (val.vCourt == "CT" && val.appealno.indexOf("DN/") >= 0)
                        {
                            htmls += '<td style="text-align: left;"></td>';
                        }
                        else if (val.vCourt == "KA" && val.appealno.indexOf("Filing No.") >= 0) {
                            htmls += '<td style="text-align: left;"></td>';
                        }
                        else
                        {
                            htmls += '<td style="text-align: left;">' + addcaselink + '</td>';
                        }
                       
                        htmls += '</tr>';

                        if (i === (length - 1)) {

                            if (isRenderPage == false) {
                                totalRecordCount = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }
                    });
                    closeloadPro();
                } else {

                    $('.pagination').css('display', 'none');  // To hide
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });


                    htmls += '<td></td>';
                    htmls += '<td></td>';
                    htmls += '<td></td>';
                    htmls += '<td></td>';

                    htmls += '<td><div class="notfound" id="pdatastatus" style="text-align: center;">' +
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No Matter list found</h4>' +
                        '<p>We found no matter list.</p>' +
                        '</div></td>';
                    htmls += '<td></td>';
                    closeloadPro();
                }

                //  $("#districtdatabind,#alldatabind").html("");                    
                $("#bindKeywordData").html("").html(htmls);

            },
            failure: function (data) {
                alert(data.responseText);
                closeloadPro();
            },
            error: function (data) {
                alert(data.responseText);
                closeloadPro();
            }
        });
    $.when(keywordcases).then(function (data, textStatus, jqXHR) {
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });
        closeload();
        return false;
    });
}


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

function addtaskmember() {

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TeamMemberbyFirmId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response) {

            if (response.Status == true) {
                var datas = JSON.stringify(response);
                //alert(datas);
                var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }

            var html3 = '';
            $("#teammemberidKey").html("");
            if (response != null) {
                $.each(obj, function (key, value) {
                    $("#teammemberidKey").append($("<option></option>").val(value.id).text(value.UserName));

                });
            }
            else {
            }

            $("#teammemberidKey").multiselect('reload');
        },


        failure: function (response) {
            //alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            //alert(response.responseText);
        } //End of AJAX error function

    });
}
//Add Keyword case
$(document).on("click", "#AddKeywordCase", function () {
    var kiid = $(this).attr("val-id");
    var itype = $(this).attr("val-ittype");
    var Filetext = $(this).attr("sno");
    var appealNo = $(this).data("appealno");
    var courtName = ($(this).data("courtname") || "").replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    var establishment = $(this).data("estbname");
    var cnrNo = $(this).data("cnrno");
    var keyword = $(this).data("keyword");
    var statename = $(this).data("statename");
    var districtname = $(this).data("districtname");

    $("#iids").val(kiid);
    $("#itype").val(itype);
    $('#casenameids').attr('title', Filetext);
    var litigationcasenameer = Filetext.substr(0, 100);
    $("#casenameids").val(litigationcasenameer.trim());
    $('#appealno').val(appealNo);
    $('#courtname').val(courtName);
    $('#establishment').val(establishment);
    $('#cnrNo').val(cnrNo);
    $('#statename').val(statename);
    $('#districtname').val(districtname);

    if (itype === "2" || itype === "0") {
        $("#statename").closest('.form-row').hide();
    } else {
        $("#statename").closest('.form-row').show();
    }
    addtaskmember();
    $('#saveKeywordKase').prop('disabled', false);
    $("#myModalKeywordAddCase ").modal('show');


});
$(document).on("click", "#saveKeywordKase", function () {
    
    $('#saveKeywordKase').prop('disabled', true);
    var iids = $("#iids").val();
    var ittype = $("#itype").val();
    var casename = $('#casenameids').val();
    var courtname = "";
    var othercourtname = "";
    var appealNo = "";
    var courtAndOtherCourtName = $('#courtname').val();

    if (/supreme\s*court/i.test(courtAndOtherCourtName)) {
        courtname = "Supreme Court";
        othercourtname = "Supreme Court";
    }
    if (ittype === "2") {
        if (/supreme\s*court/i.test(courtAndOtherCourtName)) {
            courtname = "Supreme Court";
            othercourtname = "Supreme Court";
        }
        else {
            courtname = "High Court";
            othercourtname = courtAndOtherCourtName
                .split(/\high/i)[0]
                .trim();;
        }
    }
    if (ittype === "1") {
        courtname = "District Court";
        othercourtname = courtAndOtherCourtName;
    }
    if (ittype === "3") {
        courtname = "Tribunals";
        othercourtname = courtAndOtherCourtName
            .split(/\(bench/i)[0]
            .trim();;
    }
    if (ittype === "7") {
        courtname = "Rera Maharashtra";
        othercourtname = courtAndOtherCourtName;

    }
    appealNo = $("#appealno").val();

    //console.log("courtname", courtname);
    //console.log("othercourtname", othercourtname);
    if (casename == "") {
        showAlert("Validation Error", "Please enter the case name.");
        /*    alert("Please enter the case name");*/
        return false;
    }
    var teammember = $("#teammemberidKey").val();
    var formData = new FormData();
    formData.append("iids", iids);
    formData.append("ittype", ittype);
    formData.append("casename", casename);
    formData.append("teammember", teammember);
    formData.append("courtName", courtname);
    formData.append("otherCourtName", othercourtname);
    formData.append("appealNo", appealNo);

    $.ajax({
        async: true,
        type: "POST",
        url: "/Keyword/AddKeywordCase",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1 == "sucess") {
                $('#myModalKeywordAddCase').modal('hide');
                showAlert("Success", "Case successfully added");
                /*  alert("Case successfully added");*/
                
                isRenderPage = true;
                var pageindexCurrent = $(".page-btn.active").data("page");
                BindKeywordCaseList(pageindexCurrent);
                closeload();
                $('#btnSave').prop('disabled', false);
            }
            else if (response1 == "Case Detail Already Exist!!") {
                showAlert("Validation Error", "Case Detail Already Exist!!");
                $('#saveKeywordKase').prop('disabled', false);
                /* alert("Case Detail Already Exist!!");*/
                closeload();
            }
            else if (response1 == "Case entry Limit Exceeded, Please upgrade your plan.") {
                showAlert("Validation Error", "Case entry Limit Exceeded, please upgrade your plan.");
                $('#btnSave').prop('disabled', false);
                /*    alert("Case entry Limit Exceeded, please upgrade your plan.");*/
                closeload();
            }

            else {
                showAlert("Validation Error", "OOPs! Something went wrong.");
                /*  alert("OOPs! Something went wrong.");*/
                // $('#myModalKeywordAddCase').modal('hide');
                closeload();
            }
            closeload();
            $('#saveKeywordKase').prop('disabled', false);
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

    //$.ajax({
    //    type: "POST",
    //    url: "/Keyword/AddKeywordCase?keyid=" + kiid + "&itypeval=" + itype,
    //    dataType: "text",
    //    success: function (data) {
    //        if (data == "") {
    //            alert("OOPs! Something went wrong.");
    //        }
    //        else {
    //            alert(data);
    //            BindKeywordCaseList(pageindex);
    //        }
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        alert("Status: " + textStatus); alert("Error: " + errorThrown);
    //    }
    //});
});
function FillKeywordCourtType() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Keyword/FillKeywordCourtType",
        dataType: 'json',
        success: function (response) {
            $("#divcourt").html("");
            $("#divcourt").append("<option value='' selected='selected'>Select Court Type</option>");

            $.each(response, function (i, b) {
                if (b.CourtTypeId == "1") {
                    $("#divcourt").append("<option selected='selected' value='" + b.CourtTypeId + "'>" + b.CourtType + "</option>");
                }
                else {
                    $("#divcourt").append("<option value='" + b.CourtTypeId + "'>" + b.CourtType + "</option>");
                }
            });

        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }
    });
    fn_OnChangeCourt("1");//set default district on loading
}

function fn_OnChangeCourt(ival) {

    //if (ival != "0") {
    if (ival == "2" || ival == "3") {
        document.getElementById("divcourtname-div").style.display = "block";
        document.getElementById("divcourtnamerera-div").style.display = "none";
        FillCourt(ival);
    }
    else if (ival == "7") {
        document.getElementById("divcourtname-div").style.display = "none";
        document.getElementById("divcourtnamerera-div").style.display = "block";
        fillReraCourt1();
    }
    else {
        document.getElementById("divcourtname-div").style.display = "none";
        document.getElementById("divcourtnamerera-div").style.display = "none";
    }
    fn_BindKeywordDDList(ival);
}

function FillCourt(id) {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Keyword/GetCourt?courttypeId=" + id,
        dataType: 'json',
        success: function (response) {
            $("#divcourtname").html("");
            $("#divcourtname").append("<option value='' selected='selected'>Select Court</option>");

            $.each(response, function (i, b) {
                if (id == "3") {
                    if (b.CourtTypeId == "NC" || b.CourtTypeId == "NL" || b.CourtTypeId == "DT" || b.CourtTypeId == "CF" || b.CourtTypeId == "ST" || b.CourtTypeId == "CT" || b.CourtTypeId == "NGT" || b.CourtTypeId == "CI") {
                        $("#divcourtname").append("<option value='" + b.CourtTypeId + "'>" + b.CourtType + "</option>");
                    }
                }
                else {
                    //if (b.CourtTypeId != "TL") {
                        $("#divcourtname").append("<option value='" + b.CourtTypeId + "'>" + b.CourtType + "</option>");
                   // }
                }
            });

        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });

}

function fn_BindKeywordDDList(ival) {

    $("#ddlKeyword option").remove();
	openloadPro();
    $.ajax({
        type: "POST",
        url: "/Keyword/GetUserSearchKeywordsByCourt?courttype=" + ival,
        dataType: "text",
        success: function (data) {

            $("#ddlKeyword").append("<option value='' selected='selected'>Select Name</option>");
            $("#ddlKeyword").append(data);
			closeloadPro();
        },
        error: function (data) {
        }
    });
}
function openloadPro() {
    $('#myOverlay5').css("display", "block");
}

function closeloadPro() {
    $('#myOverlay5').css("display", "none");
}




/*Export to excel End*/
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});


function cloaseMatterModal() {
    $("#myModalKeywordAddCase ").modal('hide');
}

//$("#CustomizedSection").click(function () {
//    //LoadColumnMaster();
//    $('#myModalCustomizedSection').modal({ show: true });
//});
$(document).on("click", "#CustomizedSection", function () {
    $('#myModalCustomizedSection').modal({ show: true });
});


function showAlert(title, message) {
    $("#alertTitle").text(title || "Alert");
    $("#alertMessage").text(message || "");

    $("#myModalAlertconfirmation").modal("show");
}