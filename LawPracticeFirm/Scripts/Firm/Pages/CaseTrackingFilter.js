$(document).ready(function () {
    // $("#iot").html("Case Tracking Search")
    // Get references to the start date and end date inputs
    const startDateInput = document.getElementById('hearingfrom');
    const endDateInput = document.getElementById('hearingto');
    // Add event listeners to the start date input
    startDateInput.addEventListener('change', function () {
        // Get the selected start date
        const startDate = new Date(startDateInput.value);
        // Calculate the one month later date from the selected start date
        const oneMonthLater = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
        // Set the min and max attributes of the end date input
        endDateInput.min = startDateInput.value;
        endDateInput.max = oneMonthLater.toISOString().split('T')[0];
    });
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    /*Get data by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loaddatalist(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#paginate', function () {
        /* your code here */
        ppageindex = $(this).attr("index");
        loaddatalist(ppageindex);
    });
    var fcode = localStorage.getItem("FirmCode");
    /*Export in excel*/
    $("#exporttoexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });
    /*Export in pdf*/
    $("#exporttopdf").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttopdffile" pageno="' + i + '" type="pdf">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });
    $(document).on("click", "#exporttoexcelfile", function () {
        var courttype = "";
        var courtname = null;
        var stateid = null;
        var districtid = null;
        var courtcompestname = null;
        var ditrictcourt = null;
        var sortdate = "";
        var CaseStatus = "";
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 50;
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var casename = "";
        var searchany = "1";
        var tagname = "";
        var benchname = "";
        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        window.location = encodeURI("/CW/ExportToExcelCaseTrackingSearch?status=true&courttype=" + escape(courttype) + "&courtname=" + escape(courtname) + "&stateid=" + escape(stateid) + "&districtid=" + escape(districtid) + "&courtcompestname=" + escape(courtcompestname) + "&ditrictcourt=" + escape(ditrictcourt) + "&sortdate=" + escape(sortdate) + "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) + "&casename=" + casename + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) + "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&benchname=" + escape(benchname));
    });
    $(document).on("click", "#exporttopdffile", function () {
        var courttype = "";
        var courtname = null;
        var stateid = null;
        var districtid = null;
        var courtcompestname = null;
        var ditrictcourt = null;
        var sortdate = "";
        var CaseStatus = "";
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 50;
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var casename = "";
        var searchany = "1";
        var tagname = "";
        var benchname = "";
        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        window.location = encodeURI("/CW/ExportToPDFCaseTrackingSearch?status=true&courttype=" + escape(courttype) + "&courtname=" + escape(courtname) + "&stateid=" + escape(stateid) + "&districtid=" + escape(districtid) + "&courtcompestname=" + escape(courtcompestname) + "&ditrictcourt=" + escape(ditrictcourt) + "&sortdate=" + escape(sortdate) + "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) + "&casename=" + escape(casename) + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) + "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&benchname=" + escape(benchname));
    });

    $("#searchhearingforcasefilter").click(function () {
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        if (fromdt == "") {
            alert("Please select next hearing from date");
            $("#hearingfrom").focus();
            return false;
        }
        if (todt == "") {
            alert("Please select next hearing to date");
            $("#hearingto").focus();
            return false;
        }
        $("#clearhearing").show();
        loaddatalist(pageindex);
    });
    $("#clearhearing").click(function () {
        $("#clearhearing").hide();
        $("#hearingfrom").val("");
        $("#hearingto").val("");
        loaddatalist(pageindex);
    });
    /*Load data list*/
    function loaddatalist(pageindex) {
        var formData = new FormData();
        var benchname = "";
        formData.append("courttype", "");
        formData.append("courtname", "");
        formData.append("stateid", "");
        formData.append("districtid", "");
        formData.append("courtcompestname", "");
        formData.append("ditrictcourt", "");
        formData.append("sortdate", "");
        formData.append("CaseStatus", "");
        formData.append("benchname", benchname);
        const startDate = new Date();
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var casename = "";
        var searchany = "1";
        var tagname = "";
        formData.append("pagenum", pageindex);
        if (fromdt != "" && todt != "") {
            pagesize = 10;
        }
        else {
            searchany = "tes";
            pagesize = 10;
        }
        formData.append("pagesize", pagesize);
        formData.append("hearingfrom", fromdt);
        formData.append("hearingto", todt);
        formData.append("casename", "");
        formData.append("searchany", searchany);
        formData.append("tagname", "");
        openload();
        var html3 = '';
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CWCaseListSearch",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                $("#ptfooter").html("");
                var length = response1.length;
                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $.each(response1, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        if (i === (length - 1)) {
                            var pnext = pageindex;
                            var pprev = pageindex;
                            var pageno = pageindex;
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (val.TotalRecord > 0) {
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
                            $("#exportrecords").val(val.TotalRecord);
                            tfot += '<ul>'
                            tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                            if (val.TotalRecord <= length) {
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
                            $("#ptfooter").html(tfot);
                        }
                        qty = qty + 1;
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var casenotfoundcolorstyle = "";
                        if (String(val.CaseName) == "Case not available") {
                            casenotfoundcolorstyle = "background: #eb7373;color: white;font-size: 14px;background: #d55555;text-align: center;color: White;padding: 10px 0;";
                        }
                        html3 += '<tr>'
                        html3 += '<td>' + val.CaseDiary + '</td>'
                        html3 += '<td>' + (val.Court == null ? "" : val.Court) + '</td>'
                        if (val.CaseName == "" || val.CaseName == null || val.CaseName == "null") {
                            html3 += '<td>&nbsp;</td>'
                        }
                        else {
                            if (val.CaseName.length > 20) {
                                html3 += '<td>'
                                html3 += '<span class="comment more" style="">' + val.CaseName.substring(0, 20) + '</span>'
                                html3 += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                html3 += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html3 += '' + val.CaseName + ''
                                html3 += '</div>'
                                html3 += '</td>'
                            }
                            else {
                                html3 += '<td style="' + casenotfoundcolorstyle + '">' + (val.CaseName == null ? "" : val.CaseName) + '</td>'
                            }
                        }
                        html3 += '<td>' + val.NextHearing + '</td>';
                        html3 += '<td>' + (val.Status == null ? "" : val.Status) + '</td>'
                        html3 += '</tr>'
                    });
                } else {
                    html3 += '<tr>'
                    if ($("#divSCHCDistrict").val() == "3") {
                        html3 += '<td colspan=10 align=center>Data Not Found</td>'
                    }
                    else {
                        html3 += '<td colspan=11 align=center>Data Not Found</td>'
                    }
                    html3 += '<tr>'
                }
                $("#alldatabindhearing").html("");
                $("#alldatabindhearing").html("").html(html3);
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
    $(document).on("click", "#viewmatter", function () {
        var fcode = localStorage.getItem("FirmCode");
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/CaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
});