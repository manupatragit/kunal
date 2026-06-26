var expolikeFlag = "", expocourtTypeFlag = "", expoyearFlag = "", expoyear = "", expomonthid = "";
$(document).ready(function () {
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    $("#ddlYear").val(dd.getFullYear())
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlMonth").val(monthnum);
    GetFavourAgainstDisposedReport();
    $("#searchdatas").click(function () {
        GetFavourAgainstDisposedReport();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())
        $("#ddlMonth").val(monthnum);
        GetFavourAgainstDisposedReport();
    })
    $("#opdf").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = 1;
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:1 </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttopdffile" pageno="1" type="pdf">Download PDF File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    $("#oexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = 1;
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:1 </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="1" type="pdf">Download Excel File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);

    })
    $(document).on("click", "#exporttoexcelfile", function () {
        openload();
        var urls = "/" + fcode + "/Report/ExportExcelFavourAgainstDisposedReport";

        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val()
        };
        url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
        setTimeout(function () { closeload() }, 5000);
    });

    $(document).on("click", "#exporttopdffile", function () {

        openload();
        var urls = "/" + fcode + "/Report/ExportFavourAgainstDisposedReport";
        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val(),
            "htmlData": encodeURIComponent($('#appendData').html())
        };
        var s = url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
        setTimeout(function () { closeload() }, 5000);

    });
})

function GetFavourAgainstDisposedReport() {
    openload();
    $("#oexcel").hide();
    $("#opdf").hide();
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    $("#hdnMonth").val(month);
    $("#hdnYear").val(Year);
    $.ajax({
        async: true,
        type: "POST",
        url: "/Report/GetFavourAgainstDisposedReport",
        dataType: 'json',
        data: { month: month, year: Year },

        success: function (response1) {
            closeload();
            ;
            var res = JSON.parse(response1);
            $('#appendData').empty();
            if (!res.Status) {
                alert(res.Message)
            } else {
                res = res.data;
                $("#opdf").show();
                $("#oexcel").show();
                var reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style>Overview of disposed cases of litigation related matters";
                if (month !== "" && Year !== "") {
                    var selectedMonthText = $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text();
                    var selectedYear = $("#hdnYear").val();
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style>Overview of disposed cases of litigation related matters for the - " + selectedMonthText + " " + selectedYear + "";
                }
                var strhtml = '';
                strhtml += '<div style="width: 100%;">' +
                    '<table style="width:60%; margin:auto; border-collapse: separate; border-spacing: 0;" class="printtbl">';
                strhtml += '<thead><tr><th colspan="5" style="text-align:center">' + reportdata + '</th></tr>' +
                    '<tr><th>Year Pendency</th><th></th><th>Supreme Court (SC)</th><th>High Court (HC)</th><th>Other Fora (OF)</th></tr></thead><tbody>';

                // 0-1 Years
                strhtml += '<tr><td rowspan="2">0-1 Years</td><td>Favour</td>' +
                    '<td class="FSC0"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 1, 1)"></a></td>' +
                    '<td class="FHC0"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 2, 1)"></a></td>' +
                    '<td class="FOth0"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 3, 1)"></a></td></tr>';
                strhtml += '<tr><td>Against</td>' +
                    '<td class="ASC0"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 1, 1)"></a></td>' +
                    '<td class="AHC0"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 2, 1)"></a></td>' +
                    '<td class="AOth0"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 3, 1)"></a></td></tr>';

                // 1-2 Years
                strhtml += '<tr><td rowspan="2">1-2 Years</td><td>Favour</td>' +
                    '<td class="FSC1"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 1, 2)"></a></td>' +
                    '<td class="FHC1"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 2, 2)"></a></td>' +
                    '<td class="FOth1"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 3, 2)"></a></td></tr>';
                strhtml += '<tr><td>Against</td>' +
                    '<td class="ASC1"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 1, 2)"></a></td>' +
                    '<td class="AHC1"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 2, 2)"></a></td>' +
                    '<td class="AOth1"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 3, 2)"></a></td></tr>';

                // 2-5 Years
                strhtml += '<tr><td rowspan="2">2-5 Years</td><td>Favour</td>' +
                    '<td class="FSC2"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 1, 3)"></a></td>' +
                    '<td class="FHC2"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 2, 3)"></a></td>' +
                    '<td class="FOth2"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 3, 3)"></a></td></tr>';
                strhtml += '<tr><td>Against</td>' +
                    '<td class="ASC2"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 1, 3)"></a></td>' +
                    '<td class="AHC2"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 2, 3)"></a></td>' +
                    '<td class="AOth2"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 3, 3)"></a></td></tr>';

                // >5 Years
                strhtml += '<tr><td rowspan="2">>5 Years</td><td>Favour</td>' +
                    '<td class="FSC3"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 1, 4)"></a></td>' +
                    '<td class="FHC3"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 2, 4)"></a></td>' +
                    '<td class="FOth3"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 3, 4)"></a></td></tr>';
                strhtml += '<tr><td>Against</td>' +
                    '<td class="ASC3"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 1, 4)"></a></td>' +
                    '<td class="AHC3"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 2, 4)"></a></td>' +
                    '<td class="AOth3"><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 3, 4)"></a></td></tr>';

                // Empty row for spacing
                strhtml += '<tr><td colspan="5" style="height:25px"></td></tr>';

                // Total Rows
                strhtml += '<tr><td rowspan="2">Total</td><td>Favour</td>' +
                    '<td class="FSC4"></td><td class="FHC4"></td><td class="FOth4"></td></tr>';
                strhtml += '<tr><td>Against</td>' +
                    '<td class="ASC4"></td><td class="AHC4"></td><td class="AOth4"></td></tr>';

                // Total Disposal
                strhtml += '<tr><td colspan="2">Total Disposal</td>' +
                    '<td class="TotalSC"></td><td class="TotalHC"></td><td class="TotalOth"></td></tr>';

                strhtml += '</tbody></table></div>';

                $('#appendData').append(strhtml);

                for (var key in res) {
                    if (res.hasOwnProperty(key)) {
                        var tableData = res[key];
                        for (var i = 0; i < tableData.length; i++) {

                            if (key == "Table") {
                                // Regular rows - Add clickable links
                                if (i < tableData.length - 1) {
                                    $('.FSC' + i + '').html('<a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 1, ' + (i + 1) + ')">' + tableData[i].Favour + '</a>');
                                    $('.ASC' + i + '').html('<a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 1, ' + (i + 1) + ')">' + tableData[i].Against + '</a>');
                                }
                                // Last row (Total) - No clickable links
                                else {
                                    $('.FSC' + i + '').html(tableData[i].Favour);
                                    $('.ASC' + i + '').html(tableData[i].Against);
                                    var sumTotal = parseInt(tableData[i].Favour) + parseInt(tableData[i].Against);
                                    $('.TotalSC').html(sumTotal);
                                }
                            } else if (key == "Table1") {
                                if (i < tableData.length - 1) {
                                    $('.FHC' + i + '').html('<a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 2, ' + (i + 1) + ')">' + tableData[i].Favour + '</a>');
                                    $('.AHC' + i + '').html('<a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 2, ' + (i + 1) + ')">' + tableData[i].Against + '</a>');
                                } else {
                                    $('.FHC' + i + '').html(tableData[i].Favour);
                                    $('.AHC' + i + '').html(tableData[i].Against);
                                    var sumTotal = parseInt(tableData[i].Favour) + parseInt(tableData[i].Against);
                                    $('.TotalHC').html(sumTotal);
                                }
                            } else if (key == "Table2") {
                                if (i < tableData.length - 1) {
                                    $('.FOth' + i + '').html('<a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(1, 3, ' + (i + 1) + ')">' + tableData[i].Favour + '</a>');
                                    $('.AOth' + i + '').html('<a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(2, 3, ' + (i + 1) + ')">' + tableData[i].Against + '</a>');
                                } else {
                                    $('.FOth' + i + '').html(tableData[i].Favour);
                                    $('.AOth' + i + '').html(tableData[i].Against);
                                    var sumTotal = parseInt(tableData[i].Favour) + parseInt(tableData[i].Against);
                                    $('.TotalOth').html(sumTotal);
                                }
                            }
                        }
                    }
                }


            }
        },
        error: function () {
            closeload();
        }
    })
}


function MetterListData(flag, flag1,flag2) {
    // Convert year range to numeric values
    
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var likeFlag = flag
    var courtFlag = flag1;
    var yearFlag = flag2;
    var CourtName = "";
    var YearLabel = "";
    switch (yearFlag) {
        case "1": {
            YearLabel = "0-1 Years";
            break;
        }
        case "2": {
            YearLabel = "1-2 Years	";
            break;

        }
        case "3": {
            YearLabel= "2-5 Years";
            break;

        }
        case "4": {
            YearLabel = ">5 Years";
            break;

        }
        
    }
    switch (courtFlag) {
        case "1": {
            CourtName = "Supreme Court";
            break;
        }
        case "2": {
            CourtName = "High Court";
            break;
        }
        case "3": {
            CourtName = "Other Foram";
            break;
        }
    }
    var strhtml = "";
    openload();
     expolikeFlag = likeFlag;
    expocourtTypeFlag = courtFlag;
    expoyearFlag = yearFlag;
    expoyear = Year;
    expomonthid = month;
    $.ajax({
        type: "POST",
        url: "/api/MatterApi/AllMatterListFavourAgainst",
        data: {
            likeFlag: likeFlag,
            courtTypeFlag: courtFlag,
            yearFlag: yearFlag,
            year: Year,
            monthid: month
        },
        success: function (response) {

            response = JSON.parse(response.Data);

            $("#caseData").empty(); // Clear existing table data before appending new data



            var tableData = response.data.Table;  // Fixed the incorrect variable name

            for (var i = 0; i < tableData.length; i++) {
                strhtml += `<tr>
                                        <td>${i + 1}</td>
                                        <td>${tableData[i].CourtName}</td>
                                        <td>${tableData[i].vCaseName}</td>
                                        <td>${tableData[i].vCaseNo}</td>
                                        <td>${tableData[i].vStatus}</td>
                                        <td>${tableData[i].FilingDate}</td>
                                        <td>${tableData[i].vCauselistDate}</td>
                                    </tr>`;
            }



            $("#caseData").append(strhtml); // Append table rows only once
            console.log(response);

            OpenModalMatter(CourtName, YearLabel);
            closeload();
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            closeload();
        }
    });
}

function OpenModalMatter(court, year) {

    $("#titleMatter").html(`Matter List of ${court} (${year})`); // Update modal title dynamically
    $('#MatterListModal').modal({ show: true });
}


function DownloadmatterListExcel() {

    openload();
    const url = "/CW/ExportToExcelAllMatterListFavourAgainst?likeFlag=" + encodeURIComponent(expolikeFlag)
        + "&courtTypeFlag=" + encodeURIComponent(expocourtTypeFlag)
        + "&yearFlag=" + encodeURIComponent(expoyearFlag)
        + "&year=" + encodeURIComponent(expoyear)
        + "&monthid=" + encodeURIComponent(expomonthid);
    window.location = decodeURIComponent(encodeURI(url)); // Decodes %20 back to spaces

    alert("Download Successful: Excelsheet");
    closeload();

}