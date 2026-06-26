$(document).ready(function () {
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    $("#ddlYear").val(dd.getFullYear())    
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlMonth").val(monthnum);
    GetAgewiseShortPendingReport();
    $("#searchdatas").click(function () {
        GetAgewiseShortPendingReport();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())   
        $("#ddlMonth").val(monthnum);
        GetAgewiseShortPendingReport();
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
        var urls = "/" + fcode + "/Report/ExportToExcelAgewiseShort";
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
        var urls = "/" + fcode + "/Report/ExportoAgeWiseData";
        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val()
        };
        var s=url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
        setTimeout(function () { closeload() }, 5000);
        
    });
})

function GetAgewiseShortPendingReport() {
    openload();
    $("#opdf").hide();
    $("#oexcel").hide();
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    $("#hdnMonth").val(month);
    $("#hdnYear").val(Year);
    $.ajax({
        async: true,
        type: "POST",
        url: "/Report/GetAgewiseShortPendingReport",
        dataType: 'json',
        data: { month: month, year: Year },
        
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
            for (var key in res) {
               
                if (res.hasOwnProperty(key)) {
                    var tableData = res[key];

                    var strhtml=''

                    
                    switch (key) {
                        case "Table": {
                            var years = ["0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years"];
                            var zones = ["15Z", "Non 15Z"]; // Adjust zones based on your data
                            var strhtml = "";

                            var summaryData = {};
                            years.forEach(year => {
                                summaryData[year] = {};
                                zones.forEach(zone => {
                                    summaryData[year][zone] = 0;
                                });
                            });
                            tableData.forEach(entry => {
                                if (summaryData[entry.year] && summaryData[entry.year][entry.ZoneName] !== undefined) {
                                    summaryData[entry.year][entry.ZoneName] += entry.CaseCount;
                                }
                            });

                            strhtml += '<div style="width: 100%;margin-top:10px;">' + reportdata +
                                '<p style="width: 100%;text-align: center;margin-bottom: 0;">' +
                                '<span style="font-size: 1.5em;font-weight: 900;">' + 'Supreme Court ' +
                                '</span></p>' +
                                '<table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl">' +
                                '<tr><th style="text-align:center">Row Labels</th>';
                            zones.forEach(zone => {
                                strhtml += '<th style="text-align:center">' + zone + '</th>';
                            });

                            strhtml += '</tr>';
                            years.forEach(year => {
                                strhtml += '<tr><td>' + year + '</td>';
                                zones.forEach(zone => {
                                    strhtml += `<td style="text-align:center">
                <a href="#" style="color: blue; cursor: pointer;" onclick="getMatterList('${zone}', '${year}', 'Sc')">
                    ${summaryData[year][zone]}
                </a>
            </td>`;
                                });
                                strhtml += '</tr>';
                            });
                            strhtml += '<tr><th style="text-align:left">Total</th>';
                            zones.forEach(zone => {
                                let total = years.reduce((sum, year) => sum + summaryData[year][zone], 0);
                                strhtml += '<th style="text-align:center">' + total + '</th>';
                            });

                            strhtml += '</tr>';
                            strhtml += '</table></div>';
                            break;
                        }
                        case "Table1": {
                            var years = ["0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years"];
                            var zones = ["HO", "ERO", "NRO", "WRO","SRO"]; // Adjust zones based on your data
                            var strhtml = "";

                            var summaryData = {};
                            years.forEach(year => {
                                summaryData[year] = {};
                                zones.forEach(zone => {
                                    summaryData[year][zone] = 0;
                                });
                            });
                            tableData.forEach(entry => {
                                if (summaryData[entry.year] && summaryData[entry.year][entry.ZoneName] !== undefined) {
                                    summaryData[entry.year][entry.ZoneName] += entry.CaseCount;
                                }
                            });

                            strhtml += '<div style="width: 100%;margin-top:10px;">' + reportdata +
                                '<p style="width: 100%;text-align: center;margin-bottom: 0;">' +
                                '<span style="font-size: 1.5em;font-weight: 900;">' + 'High Court ' +
                                '</span></p>' +
                                '<table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl">' +
                                '<tr><th style="text-align:center">Row Labels</th>';
                            zones.forEach(zone => {
                                strhtml += '<th style="text-align:center">' + zone + '</th>';
                            });

                            strhtml += '</tr>';
                            years.forEach(year => {
                                strhtml += '<tr><td>' + year + '</td>';
                                zones.forEach(zone => {
                                    strhtml += `<td style="text-align:center">
                <a href="#" style="color: blue; cursor: pointer;" onclick="getMatterList('${zone}', '${year}', 'HC')">
                    ${summaryData[year][zone]}
                </a>
            </td>`;
                                });
                                strhtml += '</tr>';
                            });
                            strhtml += '<tr><th style="text-align:left">Total</th>';
                            zones.forEach(zone => {
                                let total = years.reduce((sum, year) => sum + summaryData[year][zone], 0);
                                strhtml += '<th style="text-align:center">' + total + '</th>';
                            });

                            strhtml += '</tr>';
                            strhtml += '</table></div>';

                            break;
                        }
                        case "Table2": {
                            var years = ["0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years"];
                            var zones = ["HO", "ERO", "NRO", "WRO","SRO"]; // Adjust zones based on your data
                            var strhtml = "";

                            var summaryData = {};
                            years.forEach(year => {
                                summaryData[year] = {};
                                zones.forEach(zone => {
                                    summaryData[year][zone] = 0;
                                });
                            });
                            tableData.forEach(entry => {
                                if (summaryData[entry.year] && summaryData[entry.year][entry.ZoneName] !== undefined) {
                                    summaryData[entry.year][entry.ZoneName] += entry.CaseCount;
                                }
                            });

                            strhtml += '<div style="width: 100%;margin-top:10px;">' + reportdata +
                                '<p style="width: 100%;text-align: center;margin-bottom: 0;">' +
                                '<span style="font-size: 1.5em;font-weight: 900;">' + 'NCLT/NCLAT Court ' +
                                '</span></p>' +
                                '<table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl">' +
                                '<tr><th style="text-align:center">Row Labels</th>';
                            zones.forEach(zone => {
                                strhtml += '<th style="text-align:center">' + zone + '</th>';
                            });

                            strhtml += '</tr>';
                            years.forEach(year => {
                                strhtml += '<tr><td>' + year + '</td>';
                                zones.forEach(zone => {
                                    strhtml += `<td style="text-align:center">
                <a href="#" style="color: blue; cursor: pointer;" onclick="getMatterList('${zone}', '${year}', 'NCLT')">
                    ${summaryData[year][zone]}
                </a>
            </td>`;
                                });
                                strhtml += '</tr>';
                            });
                            strhtml += '<tr><th style="text-align:left">Total</th>';
                            zones.forEach(zone => {
                                let total = years.reduce((sum, year) => sum + summaryData[year][zone], 0);
                                strhtml += '<th style="text-align:center">' + total + '</th>';
                            });

                            strhtml += '</tr>';
                            strhtml += '</table></div>';

                            break;
                        }
                        case "Table3": {
                            var strhtml = "";
                            var count = 0;
                            for (var i = 0; i < tableData.length; i++) {
                                if (i === 0) {
                                    strhtml += '<div style="width: 100%;margin-top:10px;">' + reportdata +
                                        '<p style="width: 100%;text-align: center;margin-bottom: 0;">' +
                                        '<span style="font-size: 1.5em;font-weight: 900;">' + 'Other Forum ' +
                                        '</span></p>' +
                                        '<table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl">' +
                                        '<tr><th style="text-align:center">Row Labels</th>' +
                                        '<th style="text-align:center">Count of Year of Filing</th></tr>';
                                    reportdata = "";
                                }

                                // Add rows dynamically
                                strhtml += '<tr><td>' + tableData[i].year + '</td>' +
                                    `<td>
                <a href="#" style="color: blue; cursor: pointer;" onclick="getMatterList('', '${tableData[i].year}', 'other')">
                    ${tableData[i].CaseCount}
                </a>
            </td></tr>`;
                                count = tableData[i].CaseCount + count;
                                // Closing the table on last iteration
                                if (i === tableData.length - 1) {
                                    strhtml += '<tr><th style="text-align:left">' + 'Total' +
                                        '</th><th style="text-align:left">' + count +
                                        '</th></tr>';
                                    strhtml += '</table></div>';
                                }
                            }

                            // Append to DOM after constructing the string
                            //$('#appendData').append(strhtml);
                            break;
                        }

                    }

                    $('#appendData').append(strhtml);

                }
            }
        },
        error: function () {
            closeload();
        }
    })
}
var yearwise = "";
var zoneWise = "";
var courtwise = "";
// Get matter list  details by id
function getMatterList(zone, year, court) {
    // Convert year range to numeric values
    courtwise = court;
    zoneWise = zone;
    if (year === "0-2 Years") {
        year = "1";
        yearwise = "1";
    } else if (year === "2-5 Years") {
        year = "2";
        yearwise = "2";
    } else if (year === "> 5 Years") {
        year = "3";
        yearwise = "3";
    } else if (year === "> 10 Years") {
        year = "4";
        yearwise = "4";
    } else {
        year = "";
        yearwise = "";
    }

    var month = $('#ddlMonth').val();
    var yearSize = $('#ddlYear').val();
    var strhtml = "";

    openload();

    $.ajax({
        type: "POST",
        url: "/CW/GetFilterMetterList",
        data: {
            zone: zone,
            year: year,
            court: court,
            month: month,
            yearSize: yearSize
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

            OpenModalMatter(court, year, zone);
            closeload();
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            closeload();
        }
    });
}




function OpenModalMatter(court, year, zone) {

    switch (court) {
        case "SC": {
            court = "Supreme court";
            break;
        }
        case "HC": {
            court = "High court"
            break;

        }
        case "NCLT": {
            court = "NCLT/NCLAT court"
            break;

        }
        case "other": {
            court = "Other forum"
            break;

        }

    }
    switch (year) {
        case "1": {
            year = "0-2 Years";
            break;
        }
        case "2": {
            year = "2-5 Years";
            break;
        }
        case "3": {
            year = "> 5 Years";
            break;
        }
        case "4": {
            year = "> 10 Years";
            break;
        }
    }
    $("#titleMatter").html(`Matter List for ${court} - ${zone} (${year})`); // Update modal title dynamically
    $('#MatterListModal').modal({ show: true });
}

function closeModalMatter() {
    $('#AssignUserToZone').modal('hide');
}

function DownloadmatterListExcel() {
    debugger;
    openload();
    var courtName = "";
    var label = "";
    var month = $('#ddlMonth').val();
    var yearSize = $('#ddlYear').val();
    //(string zone, string year, string court, string month, string yearSize)
    var fileName = "";
    switch (courtwise) {
        case "SC": {
            courtName = "supreme court";
            break;
        }
        case "HC": {
            courtName = "High court"
            break;

        }
        case "NCLT": {
            courtName = "NCLT/NCLAT court"
            break;

        }
        case "other": {
            courtName = "Other forum"
            break;

        }

    }
    switch (yearwise) {
        case "1": {
            label = "0-2 Years";
            break;
        }
        case "2": {
            label = "2-5 Years";
            break;
        }
        case "3": {
            label = "> 5 Years";
            break;
        }
        case "4": {
            label = "> 10 Years";
            break;
        }
    }
    //fileName = `Matter List for ${court} - ${zone} (${year})`;
    fileName = `Matter List for ${courtName} - ${zoneWise} (${label})`;

    //window.location = encodeURI("/CW/ExportToExcel?zone=" + encodeURIComponent(escape(zoneWise)) + "&year=" + escape(yearwise) + "&court=" + escape(courtwise)
    //    + "&month=" + escape(month) + "&yearSize=" + escape(yearSize) + "&fileName=" + escape(fileName));
    const url = "/CW/ExportToExcel?zone=" + encodeURIComponent(zoneWise)
        + "&year=" + encodeURIComponent(yearwise)
        + "&court=" + encodeURIComponent(courtwise)
        + "&month=" + encodeURIComponent(month)
        + "&yearSize=" + encodeURIComponent(yearSize)
        + "&fileName=" + encodeURIComponent(fileName);
    window.location = decodeURIComponent(encodeURI(url)); // Decodes %20 back to spaces

    alert("Download Successful: Excelsheet");
    closeload();

}