$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    ColumnArray = [];
    var pageindex = 1, pagesize = 10;
    var pageindexFinal = 1, pagesizeFinal = 10;
    openload();
    BindModules();
    $("#getreport").click(function () {
        pageindexFinal = 1;
        getdata(pageindexFinal);
    });
    $(document).on('click', '#ppaginateFinal', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        getdata(pageindex);
    });
    $(document).on('click', '#pgetdatabypagenumFinal', function () {
        ppageindex = $("#ppagnumvalueFinal").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopageFinal").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    getdata(pageindexFinal);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    function getdata(pageindexFinal) {
        var Modules = $("#Modules").val();
        var Search = $("#SearchData").val();
        let formDatas = {
            "filternameforcustomRpt": Search,
            "moduleid": Modules,
            "pageno": pageindexFinal,
            "pagesize": pagesizeFinal,
        }
        var json = JSON.stringify(formDatas);
        var qty1 = 0;
        var html = '';
        openload();
        var rt2 = $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/CustomReportBuilderList',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                $("#tfooter").html("");
                if (response.Data == "Result Not Found") {
                    $("#loadactivitydata").html("");
                    $("#noresultdivFinal").show();
                    closeload();
                    return false;
                }
                else {
                    $("#noresultdivFinal").hide();
                }
                var result = JSON.stringify(response.Data);
                var obj = JSON.parse(result);
                var length = obj.length;
                $.each(obj, function (index, a) {
                    if (index === 0) {
                        firstvalue = a.RowId;
                    }
                    if (index === (length - 1)) {
                        var pnext = pageindexFinal;
                        var pprev = pageindexFinal;
                        var pageno = pageindexFinal;
                        var totdata = a.TotalRecord;
                        var totpage = 0;
                        if (a.TotalRecord > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesizeFinal);
                            if (parseInt(totdata) % parseInt(pagesizeFinal) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalueFinal").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="psotopageFinal" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindexFinal + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalueFinal" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenumFinal" style="margin-left:10px;cursor:pointer">Go</a> </li>'
                        if (a.TotalRecord <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                            //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                            //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        //tfot += '</td >'
                        //tfot += '</tr >'
                        tfot += '</ul>'
                        $("#tfooter").append(tfot);
                    }
                    qty1 = qty1 + 1;
                    html += '<tr><td>' + a.RowId + '</td><td>' + a.vReportName + '</td><td>' + a.vReportName + '</td>';
                    html += '<td>' + a.dcreateddate + '</td>';
                    html += '<td><span class="glyphicon glyphicon-eye-open" style="cursor:pointer;" title="Click here to View report" id="openreport" data-val="' + a.Id + '"></span>';
                    html += '&nbsp;&nbsp; | &nbsp; &nbsp;<span class="glyphicon glyphicon-trash" style="cursor:pointer;color:red" title="Click here to delete report" id="removereport" data-val="' + a.Id + '"></span></td></tr>';
                });
                $("#loadactivitydata").empty().hide().append(html).fadeIn('fast');;
                closeload();
            },
            error: function (response) {
                closeload();
            }
        });
    }
    $(document).on('click', '#openreport', function () {
        var ids = $(this).attr("data-val");
        $("#reportidhiddden").val(ids);
        var Modules = $("#Modules").val();
        $('#ReportBuilderPreview').modal({ show: true });
        let formDatas = {
            "moduleid": Modules,
            "pageno": pageindex,
            "pagesize": pagesize,
            "id": ids,
        }
        BindPreview(formDatas);
    });
    function BindPreview(formDatas) {
        ColumnArray = [];
        var json = JSON.stringify(formDatas);
        // openload();
        $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/BindCustomReportFinal',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var html1 = '';
                $("#Prevfooter,rptbody").html("");
                if (response.Data == "Result Not Found") {
                    $("#Prevfooter,#rptbody,#rpcolumn").html("");
                    $("#noresultdiv").show();
                    return false;
                }
                else {
                    $("#noresultdiv").hide();
                }
                var result = JSON.stringify(response.Data);
                var obj = JSON.parse(result);
                //set column
                for (var i = 0; i <= obj.length; i++) {
                    var columnsIn = obj[i];
                    for (var key in columnsIn) {
                        if (key == "TotalRecord" || key == "RowId") {
                        }
                        else {
                            ColumnArray.push(key);
                        }
                    }
                    break;
                }
                var html1 = '';
                for (var i = 0; i < ColumnArray.length; i++) {
                    html1 += `<th >
                        <div class="thbg"> &nbsp;&nbsp;`+ ColumnArray[i].replaceAll('_', ' ') + `  &nbsp;&nbsp;</div>
                          </th >`;
                }
                var html2 = '';
                $("#rpcolumn").html(html1);
                //set paging
                var length = obj.length;
                $.each(obj, function (index, a) {
                    if (index === 0) {
                        firstvalue = a.RowId;
                    }
                    if (index === (length - 1)) {
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
                        tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a> </li>'
                        if (a.TotalRecord <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#Prevfooter").append(tfot);
                    }
                });
                //set data
                for (var i = 0; i < obj.length; i++) {
                    html2 += `<tr>`;
                    for (var j = 0; j < ColumnArray.length; j++) {
                        html2 += `<td style="min-width:100px;" >` + (obj[i][ColumnArray[j]] == null ? "" : obj[i][ColumnArray[j]]) + `</td>`;
                    }
                    html2 += `</tr>`;
                }
                $("#rptbody").html(html2);
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    $(document).on('click', '#pgetdatabypagenum', function () {
        ppageindex = $("#ppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    pageindex = ppageindex;
                    var ids = $("#reportidhiddden").val();
                    var Modules = $("#Modules").val();
                    let formDatas = {
                        "moduleid": Modules,
                        "pageno": pageindex,
                        "pagesize": pagesize,
                        "id": ids,
                    }
                    BindPreview(formDatas);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#ppaginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        var ids = $("#reportidhiddden").val();
        var Modules = $("#Modules").val();
        let formDatas = {
            "moduleid": Modules,
            "pageno": pageindex,
            "pagesize": pagesize,
            "id": ids,
        }
        BindPreview(formDatas);
    });
    $(document).on('click', '#removereport', function () {
        /* your code here */
        if (confirm("Are you sure to delete this report")) {
            var Modules = $("#Modules").val();
            var ids = $(this).attr("data-val");
            let formDatas = {
                "id": ids,
                "moduleid": Modules,
            }
            var json = JSON.stringify(formDatas);
            openload();
            var rt2 = $.ajax({
                async: true,
                url: '/api/ReportBuilderApi/RemoveCustomReportById',
                data: json,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                type: 'POST',
                success: function (response) {
                    getdata(pageindex);
                    alert(response.Data);
                    closeload();
                },
                error: function (response) {
                    closeload();
                }
            });
        }
    });
    function BindModules() {
        var dataobj = {};
        var rt2 = $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/ModuleListForReport',
            //data: dataobj,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var html1 = '';
                var obj = JSON.parse(response.Data);
                if (obj != "") {
                    $.each(obj, function (i, val) {
                        html1 += '<option value="' + val.id + '" >' + val.ModuleName + '</option>';
                    });
                }
                $("#Modules").html(html1);
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
        $.when(rt2).then(function (data, textStatus, jqXHR) {
            getdata(pageindexFinal);
        });
    }
    $("#oexcel").click(function () {
        var moduleid = $("#Modules").val();
        var id = $("#reportidhiddden").val();
        var pagenumber = 1;
        var pagesize = 10;
        window.location = encodeURI("/ReportBuilder/ExportToExcelReportBuilder?status=true&moduleid=" + moduleid + "&id=" + id + "&pagenumber=" + pagenumber + "&pagesize=" + pagesize);
    });
    $("#opdf").click(function () {
        var moduleid = $("#Modules").val();
        var id = $("#reportidhiddden").val();
        var pagenumber = 1;
        var pagesize = 10;
        window.location = encodeURI("/ReportBuilder/ExportToPDFReportBuilder?status=true&moduleid=" + moduleid + "&id=" + id + "&pagenumber=" + pagenumber + "&pagesize=" + pagesize);
    });
});