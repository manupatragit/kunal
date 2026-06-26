$(document).ready(function () {
    var pageindex = 1, pagesize = 20, recordcount = 0, totrecord = 0;
    var apageindex = 1, apagesize = 20, arecordcount = 0, atotrecord = 0;
    /*Get data by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    pageindex = ppageindex;
                    $("#getcauselist").click();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    /*Paginate*/
    $(document).on('click', '#paginate', function () {
        ppageindex = $(this).attr("index");
        pageindex = ppageindex;
        $("agetcauselist").click();
    });
    /*Get data by page number*/
    $(document).on('click', '#agetdatabypagenum', function () {
        ppageindex = $("#apagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#asotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    apageindex = ppageindex;
                    openload();
                    $("#agetcauselist").click();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    $(document).on('click', '#apaginate', function () {
        ppageindex = $(this).attr("index");
        apageindex = ppageindex;
        $("#agetcauselist").click();
    });
    /*Export CW Cause Lis tDetails Revenue in excel*/
    $("#exporttoexcel").click(function () {
        var casedate = $("#casedate").val();
        var scourt1 = $("input[name='ocasedata1']:checked").val();
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        if (casedate == "") {
            alert("select date");
            return false;
        }
        else {
            window.location = encodeURI("/Revenue/ExportToExcelCWCauseListDetailsRevenue?status=true&casedate=" + escape(casedate) + "&pageno=1&pagesize=20");
        }
    });
    /*Export CW Cause Lis tDetails Revenue in pdf*/
    $("#exporttopdf").click(function () {
        var casedate = $("#casedate").val();
        var scourt1 = $("input[name='ocasedata1']:checked").val();
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        if (casedate == "") {
            alert("select date");
            return false;
        }
        else {
            window.location = encodeURI("/Revenue/ExportToPDFCWCauseListDetailsRevenue?status=true&casedate=" + escape(casedate) + "&pageno=1&pagesize=20");
        }
    });
    /*Get cause list*/
    $("#getcauselist").click(function () {
        var casedate = $("#casedate").val();
        var scourt1 = $("input[name='ocasedata1']:checked").val();
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        if (casedate == "") {
            alert("select date");
            return false;
        }
        else {
            CauselistCaseWatch(casedate, 1);
        }
    });
    /*Casewatch counsel list details*/
    function CauselistCaseWatch(casedate, loader) {
        $("#binddatacw").html("");
        $("#datastatus34").html("");
        var formData = new FormData();
        formData.append("casedate", casedate);
        formData.append("pageno", pageindex);
        formData.append("pagesize", pagesize);
        //read assign using list
        qty1 = 0;
        var html = '';
        if (String(loader) == "1") {
            openload();
        }
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/Revenue/CWCauseListDetailsRevenue",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#ptfooter").html("");
                if (response == "") {
                    $("#causelist1").css("display", "");
                    $("#binddatacw1").html("");
                    $("#datastatus34").html("There are no Cause List Details available for this date.");
                    closeload();
                    return false;
                }
                else {
                    $("#adatastatus34").html("");
                    var obj = JSON.stringify(response);
                    var q = 0;
                    $("#causelist1").css("display", "");
                    var length = response.length;
                    $.each(response, function (i, a) {
                        q = q + 1;
                        if (i === 0) {
                            firstvalue = a.RowId;
                        }
                        if (i === (length - 1)) {
                            var pnext = pageindex;
                            var pprev = pageindex;
                            var pageno = pageindex;
                            var totdata = a.TotalRecord;
                            var totpage = 0;
                            if (a.TotalRecord > 0) {
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
                            tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</a> </li>'
                            if (a.TotalRecord <= length) {
                            }
                            else if (pageno == 1) {
                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            }
                            else {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#ptfooter").html("");
                            $("#ptfooter").html(tfot);
                        }
                        html += '<tr><td class="RevenueCourtName"> ' + (a.RevenueCourtName == null ? "" : a.RevenueCourtName) + '</td><td class="JanpadName">' + (a.JanpadName == null ? "" : a.JanpadName) + ' <td class="MandalName"> ' + (a.MandalName == null ? "" : a.MandalName) + '</td><td class="TahsilName">' + (a.TahsilName == null ? "" : a.TahsilName) + '</td>';
                        html += '<td class="vCaseName"> ' + (a.vCaseName == null ? "" : a.vCaseName) + '</td><td class="vCaseNo"> ' + (a.vCaseNo == null ? "" : a.vCaseNo) + '</td><td>' + (a.vCauselistDate == null ? "" : a.vCauselistDate) + '</td>';
                        html += '<td>' + (a.Filetext == null ? "" : a.Filetext) + '</td>';
                        html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</td>';
                        html += '</tr>';
                    }); //End of foreach Loop
                    $("#binddatacw1").empty().html(html);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    /*Export data in excel*/
    $("#aexporttoexcel").click(function () {
        var scourt1 = $("input[name='aocasedata1']:checked").val();
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        else {
            window.location = encodeURI("/Revenue/ExportToExcelAllCWCauseListDetailsRevenue?status=true&pageno=1&pagesize=20");
        }
    });
    $("#aexporttopdf").click(function () {
        var scourt1 = $("input[name='aocasedata1']:checked").val();
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        else {
            window.location = encodeURI("/Revenue/ExportToPDFAllCWCauseListDetailsRevenue?status=true&pageno=1&pagesize=20");
        }
    });
    /*Get cause list details*/
    $("#agetcauselist").click(function () {
        AllCauselistCaseWatch(1);
    });
    /*Get casewatch cause list details */
    function AllCauselistCaseWatch(loader) {
        $("#binddatacw").html("");
        $("#datastatus34").html("");
        var formData = new FormData();
        formData.append("casedate", "");
        formData.append("pageno", apageindex);
        formData.append("pagesize", apagesize);
        //read assign using list
        qty1 = 0;
        var html = '';
        if (String(loader) == "1") {
            openload();
        }
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/Revenue/AllCWCauseListDetailsRevenue",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#aptfooter").html("");
                if (response == "") {
                    $("#acauselist1").css("display", "");
                    $("#acauselist3").css("display", "none");
                    $("#acauselist4").css("display", "none");
                    $("#adatastatus34").html("There are no Cause List Details available for this date.");
                    closeload();
                    return false;
                }
                else {
                    $("#adatastatus34").html("");
                    var obj = JSON.stringify(response);
                    var q = 0;
                    $("#acauselist1").css("display", "");
                    var length = response.length;
                    $.each(response, function (i, a) {
                        q = q + 1;
                        if (i === 0) {
                            firstvalue = a.RowId;
                        }
                        if (i === (length - 1)) {
                            var pnext = apageindex;
                            var pprev = apageindex;
                            var pageno = apageindex;
                            var totdata = a.TotalRecord;
                            var totpage = 0;
                            if (a.TotalRecord > 0) {
                                pnext = parseInt(pnext) + 1;
                                if (pnext == 0) pnext = 1;
                                pprev = parseInt(pageno) - 1;
                                if (pprev == 0) pprev = 1;
                                totpage = parseInt(totdata) / parseInt(apagesize);
                                if (parseInt(totdata) % parseInt(apagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                $("#apagnumvalue").attr("max", totpage);
                            }
                            var tfot = '';
                            tfot += '<ul>'
                            tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="asotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + apageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="apagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="agetdatabypagenum" style="margin-left:10px;">Go</a> </li>'
                            if (a.TotalRecord <= length) {
                            }
                            else if (pageno == 1) {
                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="apaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            }
                            else {
                                tfot += '<li><span><a id="apaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a  id="apaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#aptfooter").html("");
                            $("#aptfooter").html(tfot);
                        }
                        html += '<tr><td class="RevenueCourtName"> ' + (a.RevenueCourtName == null ? "" : a.RevenueCourtName) + '</td><td class="JanpadName">' + (a.JanpadName == null ? "" : a.JanpadName) + ' <td class="MandalName"> ' + (a.MandalName == null ? "" : a.MandalName) + '</td><td class="TahsilName">' + (a.TahsilName == null ? "" : a.TahsilName) + '</td>';
                        html += '<td class="vCaseName"> ' + (a.vCaseName == null ? "" : a.vCaseName) + '</td><td class="vCaseNo"> ' + (a.vCaseNo == null ? "" : a.vCaseNo) + '</td><td>' + (a.vCauselistDate == null ? "" : a.vCauselistDate) + '</td>';
                        html += '<td>' + (a.Filetext == null ? "" : a.Filetext) + '</td>';
                        html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.caseid + ' data-user=' + a.usercaseid + '>View matter</td>';
                        html += '</tr>';
                    }); //End of foreach Loop
                    $("#abinddatacw1").empty().append(html);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    var fcode = localStorage.getItem("FirmCode");
    /*View case details*/
    $(document).on("click", "#viewcasedetails", function () {
        var caseid = $(this).attr("data-val");
        var usercaseid = $(this).attr("data-user");
        var formdata = new FormData();
        formdata.append("usercaseid", usercaseid);
        $.ajax({
            async: true,
            url: "/CW/GetMatterCaseIdMaptoCW",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response != "") {
                    if (response[0]["MatterID"] == "00000000-0000-0000-0000-000000000000") {
                        var urls = "/" + fcode + "/Firm/Casedetails";
                        url_redirect({
                            url: urls,
                            method: "post",
                            data: { "token": usercaseid }
                        });
                    }
                    else {
                        var urls = "/" + fcode + "/Firm/NewCaseDashboard?type=CW";
                        url_redirect({
                            url: urls,
                            method: "post",
                            data: { token: response[0]["MatterID"] }
                        });
                    }
                }
                else {
                    var urls = "/" + fcode + "/Firm/Casedetails";
                    url_redirect({
                        url: urls,
                        method: "post",
                        data: { "token": usercaseid }
                    });
                }
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    });
});