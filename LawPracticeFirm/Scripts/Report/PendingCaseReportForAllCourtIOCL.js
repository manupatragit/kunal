var ExpovCourtval = "", Expoyear = "", Expomonthid = "";


$(document).ready(function () {
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    $("#ddlYear").val(dd.getFullYear())
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlMonth").val(monthnum);
    GetPendingCaseReportForAllCourt();
    $("#searchdatas").click(function () {
        GetPendingCaseReportForAllCourt();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())
        $("#ddlMonth").val(monthnum);
        GetPendingCaseReportForAllCourt();
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
         var urls = "/" + fcode + "/Report/ExportExcelPendingCaseReportForAllCourt";

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
        var urls = "/" + fcode + "/Report/ExportPDFPendingCaseReportForAllCourt";
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
function GetPendingCaseReportForAllCourt() {
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
        url: "/Report/GetPendingCaseReportForAllCourt",
        dataType: 'json',
        data: { month: month, year: Year },
        success: function (response1) {

            closeload();
            var res = JSON.parse(response1);
            $('#appendData').empty();
            if (!res.Status) {
                alert(res.Message)
            } else {
                $("#opdf").show();
                $("#oexcel").show();
                var reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style>Consolidated Fora wise status of cases";
                var selectedMonthText = $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text();
                var selectedYear = $("#hdnYear").val();
                var strhtml = ''
                strhtml += '<div style="width: 100%;"><table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl">'
                strhtml += '<thead><tr><th colspan="2" style="text-align:center">' + reportdata + '</th></tr> <tr><th>Particulars</th><th>Pending as on ' + selectedMonthText + ', ' + selectedYear +'</th></tr></thead><tbody>'
                $.each(res.data, function (i) {
                    if (i < res.data.length-1)
                        strhtml += '<tr><td>' + this.Court + '</td><td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.Court + '\')">' + this.CountofYearofFiling + '</a></td></tr>'
                    else
                        strhtml += '<tr><td>' + this.Court + '</td><td>' + this.CountofYearofFiling + '</td></tr>'

                })
                strhtml += '</tbody></table></div>'
                $('#appendData').append(strhtml);
            }
        },
        error: function () {
            closeload();
        }
    })
}


function MetterListData(flag) {
    // Convert year range to numeric values
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var courtValue = flag
    var CourtName = "";
    var YearLabel = "Pending as on " + $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text() + ", "+Year;
    var vCourt = "";
    switch (courtValue) {
        case "SUPREME COURT": {
            CourtName = "SUPREME COURT";
            vCourt = "1";
            break;
        }
        case "High COURT": {
            CourtName = "High COURT";
            vCourt = "2";
            break;
        }
        case "Civil Court": {
            CourtName = "Civil Court";
            vCourt = "3";
            break;
        }
        case "CONSUMER FORUMS": {
            CourtName = "CONSUMER FORUMS";
            vCourt = "4";
            break;
        }
        case "NCLT": {
            CourtName = "NCLT";
            vCourt = "5";
            break;
        }
        case "NCLAT": {
            CourtName = "NCLAT";
            vCourt = "6";
            break;
        }
        case "The Debt Recovery Tribunal": {
            CourtName = "The Debt Recovery Tribunal";
            vCourt = "7";
            break;
        }
        case "Commissioner Of Income Tax": {

            CourtName = "Commissioner Of Income Tax";
            vCourt = "8";
            break;
        }
        case "Labour Court": {
            CourtName = "Labour Court";
            vCourt = "9";
            break;
        }
    }
    var strhtml = "";
    openload();
     ExpovCourtval = vCourt;
    Expoyear = Year;
    Expomonthid = month;
    $.ajax({
        type: "POST",
        url: "/api/MatterApi/AllMatterListCourtWise",
        data: {
            vCourtval: vCourt,
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
    const url = "/CW/ExportToExcelAllMatterListCourtWise?vCourtval=" + encodeURIComponent(ExpovCourtval)
        + "&Year=" + encodeURIComponent(Expoyear)
        + "&Monthid=" + encodeURIComponent(Expomonthid);
    window.location = decodeURIComponent(encodeURI(url)); // Decodes %20 back to spaces

    alert("Download Successful: Excelsheet");
    closeload();

}
