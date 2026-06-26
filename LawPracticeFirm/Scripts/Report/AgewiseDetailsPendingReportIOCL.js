
var expodateFlag = '', expoflag = '', expocourtFlag = '', expoyear = '', expomonth = '';

$(document).ready(function () {
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlYear").val(dd.getFullYear())
    $("#ddlMonth").val(monthnum);

    GetAgewiseDetailPendingReport();
    $("#searchdatas").click(function () {
        GetAgewiseDetailPendingReport();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())
        $("#ddlMonth").val(monthnum);
        $('#ddlCourt').val("SC");
        GetAgewiseDetailPendingReport();
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
        var urls = "/" + fcode + "/Report/ExportToExcelAgeWiseDetail";

        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val(),
            "Court": $("#hdnCourt").val()
        };
        url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
        setTimeout(function () { closeload() }, 5000);
    });
    $(document).on("click", "#exporttopdffile", function () {

        var urls = "/" + fcode + "/Report/ExportoAgeWiseDetailData";
      
        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val(),
            "Court": $("#hdnCourt").val()
        };
        url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
    });
})

function GetAgewiseDetailPendingReport() {
    openload();
    $("#opdf").hide();
    $("#oexcel").hide();
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var Court = $('#ddlCourt').val();
    $("#hdnMonth").val(month);
    $("#hdnYear").val(Year);
    $("#hdnCourt").val(Court);
    $.ajax({
        async: true,
        type: "POST",
        url: "/Report/GetAgewiseDetailPendingReport",
        dataType: 'json',
        data: { month: month, year: Year, Court: Court },

        success: function (response1) {
            closeload();
            var res = JSON.parse(response1);
            $('#appendData').empty();
            $("#opdf").show();
            $("#oexcel").show();
            var reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Age-wise analysis of pending cases</h3>";
            if (month !== "" && Year !== "") {
                var selectedMonthText = $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text();
                var selectedYear = $("#hdnYear").val();
                reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Age-wise analysis of pending cases - " + selectedMonthText + " " + selectedYear + "</h3>";
            }
            if (res.length > 0) {
                var strhtml = ''
                $.each(res, function (i) {
                    if (i == 0) {
                        strhtml += '<div style="width: 100%;">' + reportdata + '<p style="width: 100%;text-align: center;margin-bottom: 0;"><span style="font-size: 1.5em;font-weight: 900;">' + this.Court + '</span></p> <table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl"><tr><tr><th  style="text-align:center" rowspan="2">Row Labels</th><th  style="text-align:center" colspan="2">Count of Year of Filing</th></tr></th><th>Filed By IOCL</th><th>Filed Against IOCL</th></tr>'
                        strhtml += '<tr>' +
                            '<td>' + this.Rowlevel + '</td>' +
                            '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.Rowlevel + '\', \'filed\')">' + this.FiledbySEBICount + '</a></td>' +
                            '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.Rowlevel + '\', \'Against\')">' + this.FiledAgainstSEBICount + '</a></td>' +
                            '</tr>';
                        reportdata = "";
                    } else if (i != res.length - 1)
                        strhtml += '<tr>' +
                            '<td>' + this.Rowlevel + '</td>' +
                            '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.Rowlevel + '\', \'filed\')">' + this.FiledbySEBICount + '</a></td>' +
                            '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.Rowlevel + '\', \'Against\')">' + this.FiledAgainstSEBICount + '</a></td>' +
                            '</tr>';
                    if (i == res.length - 1) {
                        strhtml += '<tr><td>' + this.Rowlevel + '</td><td>' + this.FiledbySEBICount + '</td><td>' + this.FiledAgainstSEBICount + '</td></tr>';
                        strhtml += '</table></div>'
                    }

                })
                $('#appendData').append(strhtml);

            }


            

           


            //for (var key in res) {

            //    if (res.hasOwnProperty(key)) {
            //        var tableData = res[key];

            //        var strhtml = ''


            //        for (var i = 0; i < tableData.length; i++) {
            //            if (i == 0) {
            //                strhtml += '<div style="width: 100%;">' + reportdata + '<p style="width: 100%;text-align: center;margin-bottom: 0;"><span style="font-size: 1.5em;font-weight: 900;">' + tableData[i].Court + '</span></p> <table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl"><tr><tr><th  style="text-align:center">Row Labels</th><th  style="text-align:center">Count of Year of Filing</th></tr>'
            //                strhtml += '<tr><td>' + tableData[i].Rowlevel + '</td><td>' + tableData[i].CountofYearofFiling + '</td></tr>';
            //                reportdata = "";
            //            } else if (i != tableData.length - 1)
            //                strhtml += '<tr><td>' + tableData[i].Rowlevel + '</td><td>' + tableData[i].CountofYearofFiling + '</td></tr>';

            //            if (i == tableData.length - 1) {
            //                strhtml += '<tr><th  style="text-align:left">' + tableData[i].Rowlevel + '</th><th style="text-align:left">' + tableData[i].CountofYearofFiling + '</th></tr>';
            //                strhtml += '</table></div>'
            //            }

            //        }
            //        $('#appendData').append(strhtml);
            //    }
            //}
        },
        error: function () {
            closeload();
        }
    })
}
function MetterListData(row, type) {
    // Convert year range to numeric values

    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var Court = $('#ddlCourt').val();
    var yearFlag = "";
    var flag = "";

    switch (row) {
        case "0-6 Months": {
            yearFlag = "1";
            break;
        }
        case "6 Months to 1 Year": {
            yearFlag = "2";
            break;

        }
        case "1 Year to 18 Months": {
            yearFlag = "3";
            break;

        }
        case "18 Months to 2 Years": {
            yearFlag = "4";
            break;

        }
        case "> 2 Years < = 3 Years": {
            yearFlag = "5";
            break;

        }
        case "> 3 Years < = 5 Years": {
            yearFlag = "6";
            break;

        }
        case "> 5 Years < = 10 Years": {
            yearFlag = "7";
            break;

        }
        case "> 10 Years < = 15 Years": {
            yearFlag = "8";
            break;

        }
        case "> 15 Years < = 20 Years": {
            yearFlag = "9";
            break;

        }
        case "> 20 Years < = 25 Years": {
            yearFlag = "10";
            break;

        }
        case "> 25 Years": {
            yearFlag = "11";
            break;

        }
    }
    switch (type) {
        case "filed": {
            flag = "1";
            break;
        }
        case "Against": {
            flag = "2";
            break;
        }
    }
    switch (Court) {
        case "SC": {
            courtFlag = "1";
            break;
        }
        case "HC": {
            courtFlag = "2";
            break;
        }
        case "Others": {
            courtFlag = "3";
            break;
        }

    }

    var strhtml = "";

    openload();
    expodateFlag = yearFlag, expoflag = flag, expocourtFlag = courtFlag, expoyear = Year, expomonth = month;
    $.ajax({
        type: "POST",
        url: "/CW/GetFilterMetterListPendingData",
        data: {
            dateFlag: yearFlag,
            flag: flag,
            courtFlag: courtFlag,
            year: Year,
            month: month
        },
        success: function (response) {

            response = JSON.parse(response);

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

            OpenModalMatter(Court, row);
            closeload();
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            closeload();
        }
    });
}
function OpenModalMatter(court, year) {

    switch (court) {
        case "SC": {
            court = "Supreme court";
            break;
        }
        case "HC": {
            court = "High court"
            break;

        }
        case "other": {
            court = "Other forum"
            break;

        }

    }


    $("#titleMatter").html(`Matter List of ${court} (${year})`); // Update modal title dynamically
    $('#MatterListModal').modal({ show: true });
}



function DownloadmatterListExcel() {
    openload();
    //fileName = `Matter List for ${court} - ${zone} (${year})`;
   // fileName = `Matter List for ${courtName} - ${zoneWise} (${label})`;

    //window.location = encodeURI("/CW/ExportToExcel?zone=" + encodeURIComponent(escape(zoneWise)) + "&year=" + escape(yearwise) + "&court=" + escape(courtwise)
    //    + "&month=" + escape(month) + "&yearSize=" + escape(yearSize) + "&fileName=" + escape(fileName));
    const url = "/CW/ExportToExcelGetFilterMetterListPendingData?dateFlag=" + encodeURIComponent(expodateFlag)
        + "&flag=" + encodeURIComponent(expoflag)
        + "&courtFlag=" + encodeURIComponent(expocourtFlag)
        + "&year=" + encodeURIComponent(expoyear)
        + "&month=" + encodeURIComponent(expomonth);
    window.location = decodeURIComponent(encodeURI(url)); // Decodes %20 back to spaces

    alert("Download Successful: Excelsheet");
    closeload();

}