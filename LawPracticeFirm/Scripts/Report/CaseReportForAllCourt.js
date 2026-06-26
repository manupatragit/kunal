var ExpCourtid = "", ExpMonthid = "", ExpYear = "", ExpCourttype = "";


$(document).ready(function () {
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    $("#ddlYear").val(dd.getFullYear())
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlMonth").val(monthnum);
    GetCaseReportForAllCourt();
    $("#searchdatas").click(function () {
        GetCaseReportForAllCourt();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())
        $("#ddlMonth").val(monthnum);
        GetCaseReportForAllCourt();
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
        var urls = "/" + fcode + "/Report/ExportExcelCaseReportForAllCourt";
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
        var urls = "/" + fcode + "/Report/ExportPDFCaseReportForAllCourt";
        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val()
        };
        var s = url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
        setTimeout(function () { closeload() }, 5000);

    });
})

function GetCaseReportForAllCourt() {
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
        url: "/Report/GetCaseReportForAllCourt",
        dataType: 'json',
        data: { month: month, year: Year },

        success: function (response1) {
            closeload();
            var res = JSON.parse(response1);
            $('#appendData').empty();
            if (!res.Status) {
                alert(res.Message)
            } else {
                res = res.data;
                if (res.length == 0) {
                    $('#appendData').append("No Record found");
                    return;
                }
                $("#opdf").show();
                $("#oexcel").show();
                var reportdata = "<style>.totaltd td{ font-weight:600!important} .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Break up of cases pending across the country (state/union territories)</h3>";
                if (month !== "" && Year !== "") {
                    var selectedMonthText = $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text();
                    var selectedYear = $("#hdnYear").val();
                    reportdata = "<style>.totaltd td{ font-weight:600!important}  .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Break up of cases pending across the country (state/union territories) as on  " + selectedMonthText + " " + selectedYear + "</h3>";
                }
                var strhtml = '<div style="width: 100%;overflow-x:auto">' + reportdata + '<table style="margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl">'

                strhtml += "<tr><th>State</th><th>High Court</th><th>City Civil Court</th><th>Consumer Forum/Commission</th><th>NCLT / NCLAT</th><th>Labour Commissioner / Labour Court</th><th>Commissioner of Income Tax</th><th>Debt Recovery Tribunal</th><th>SAT, Mumbai</th><th>Total</th></tr>"

                var totalHighCOURT = 0;
                var totalCityCivilCourt = 0;
                var totalCONSUMERFORUMS = 0;
                var totalNCLT_NCLAT = 0;
                var totalLabourCourt = 0;
                var totalCommissionerOfIncomeTax = 0;
                var totalDebtRecoveryTribunal = 0;
                var totalSAT_Mumbai = 0;
                var total = 0;
                $.each(res, function (i) {
                    var StateTotal = 0;

                    totalHighCOURT = totalHighCOURT + parseInt(this.HighCOURT);
                    totalCityCivilCourt = totalCityCivilCourt + parseInt(this.CityCivilCourt);
                    totalCONSUMERFORUMS = totalCONSUMERFORUMS + parseInt(this.CONSUMERFORUMS);
                    totalNCLT_NCLAT = totalNCLT_NCLAT + parseInt(this.NCLT_NCLAT);
                    totalLabourCourt = totalLabourCourt + parseInt(this.LabourCourt);
                    totalCommissionerOfIncomeTax = totalCommissionerOfIncomeTax + parseInt(this.CommissionerOfIncomeTax);
                    totalDebtRecoveryTribunal = totalDebtRecoveryTribunal + parseInt(this.DebtRecoveryTribunal);
                    totalSAT_Mumbai = totalSAT_Mumbai + parseInt(this.SAT_Mumbai);

                    StateTotal = parseInt(this.HighCOURT)
                        + parseInt(this.CityCivilCourt)
                        + parseInt(this.CONSUMERFORUMS)
                        + parseInt(this.NCLT_NCLAT)
                        + parseInt(this.LabourCourt)
                        + parseInt(this.CommissionerOfIncomeTax)
                        + parseInt(this.DebtRecoveryTribunal)
                        + parseInt(this.SAT_Mumbai);
                    total += StateTotal;
                    strhtml += "<tr>";
                    strhtml += '<td>' + this.vState + '</td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'1\',\'High Court\')">' + this.HighCOURT + '</a></td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'2\',\'City Civil Court\')">' + this.CityCivilCourt + '</a></td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'3\',\'Consumer Forum/Commission\')">' + this.CONSUMERFORUMS + '</a></td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'4\',\'NCLT / NCLAT\')">' + this.NCLT_NCLAT + '</a></td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'5\',\'Labour Commissioner / Labour Court\')">' + this.LabourCourt + '</a></td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'6\',\'Commissioner of Income Tax\')">' + this.CommissionerOfIncomeTax + '</a></td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'7\',\'Debt Recovery Tribunal\')">' + this.DebtRecoveryTribunal + '</a></td>';
                    strhtml += '<td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\', \'8\',\'SAT, Mumbai\')">' + this.SAT_Mumbai + '</a></td>';

                    //strhtml += "<td>" + this.CityCivilCourt + "</td>";
                    //strhtml += "<td>" + this.CONSUMERFORUMS + "</td>";
                    //strhtml += "<td>" + this.NCLT_NCLAT + "</td>";
                    //strhtml += "<td>" + this.LabourCourt + "</td>";
                    //strhtml += "<td>" + this.CommissionerOfIncomeTax + "</td>";
                    //strhtml += "<td>" + this.DebtRecoveryTribunal + "</td>";
                    //strhtml += "<td>" + this.SAT_Mumbai + "</td>";
                    strhtml += "<td>" + StateTotal + "</td>";
                    strhtml += "</tr>";
                })
                strhtml += "<tr class='totaltd'><td>Total</td><td>" + totalHighCOURT + "</td><td>" + totalCityCivilCourt + "</td><td>" + totalCONSUMERFORUMS + "</td><td>" + totalNCLT_NCLAT + "</td><td>" + totalLabourCourt + "</td><td>" + totalCommissionerOfIncomeTax + "</td><td>" + totalDebtRecoveryTribunal + "</td><td>" + totalSAT_Mumbai + "</td><td>" + total +"</td></tr>";
                strhtml += '</div>';
                $('#appendData').append(strhtml);
            }
        },
        error: function () {
            closeload();
        }
    })
}




function MetterListData(vState, type,label) {
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var vcourt = vState;
    var courtType = type;
    var stateName = "";
    switch (vcourt) {
        case "Andhra Pradesh": {
            stateName = "AP";
            break;
        }
        case "Arunachal Pradesh": {
            stateName = "AR";
            break;
        }
        case "Assam": {
            stateName = "AS";
            break;
        }
        case "Bihar": {
            stateName = "BR";
            break;
        }
        case "Delhi": {
            stateName = "DE";
            break;
        }
        case "Chhattisgarh": {
            stateName = "CH";
            break;
        }
        case "Goa": {
            stateName = "GOA";
            break;
        }
        case "Gujarat": {
            stateName = "GJ";
            break;
        }
        case "Himachal Pradesh": {
            stateName = "HP";
            break;
        }
        case "Jammu Kashmir": {
            stateName = "JK";
            break;
        }
        case "Jharkhand": {
            stateName = "JH";
            break;
        }
        case "Karnataka": {
            stateName = "KA";
            break;
        }
        case "Kerala": {
            stateName = "KE";
            break;
        }
        case "Madhya Pradesh": {
            stateName = "MP";
            break;
        }
        case "Maharashtra": {
            stateName = "MH";
            break;
        }
        case "Manipur": {
            stateName = "Manipur";
            break;
        }
        case "Meghalaya": {
            stateName = "MG";
            break;
        }
        case "Mizoram": {
            stateName = "MIZO";
            break;
        }
        case "Nagaland": {
            stateName = "Naga";
            break;
        }
        case "Odisha": {
            stateName = "OR";
            break;
        }
        case "Punjab/Haryana/Chandigarh": {
            stateName = "PH";
            break;
        }
        case "Rajasthan": {
            stateName = "RJ";
            break;
        }
        case "Sikkim": {
            stateName = "SIKKIM";
            break;
        }
        case "Tamil Nadu": {
            stateName = "TN";
            break;
        }
        case "Telangana": {
            stateName = "TL";
            break;
        }
        case "Tripura": {
            stateName = "TRIPURA";
            break;
        }
        case "Uttar Pradesh": {
            stateName = "UP";
            break;
        }
        case "Uttarakhand": {
            stateName = "UK";
            break;
        }
        case "West Bengal": {
            stateName = "WB";
            break;
        }
    }
    var strhtml = "";
    openload();
    ExpCourtid = stateName, ExpMonthid = month, ExpYear = Year, ExpCourttype = courtType;

    $.ajax({
        type: "POST",
        url: "/api/MatterApi/AllMatterListStConsolated",
        data: {
            Courtid: stateName,
            Monthid: month,
            Year: Year,
            Courttype: courtType 
        },
        success: function (response) {
            
            response = JSON.parse(response.Data);
            $("#caseData").empty(); // Clear existing table data before appending new data
            var tableData = response.data.Table;
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

            OpenModalMatter(vState, label);
            closeload();
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            closeload();
        }
    });
    closeload();

}

function OpenModalMatter(vcourt, year) {

    $("#titleMatter").html(`Matter List of ${vcourt} (${year})`); // Update modal title dynamically
    $('#MatterListModal').modal({ show: true });
}


function DownloadmatterListExcel() {
    
    openload();
    const url = "/CW/ExportToExcelAllMatterListStConsolated?Courtid=" + encodeURIComponent(ExpCourtid)
        + "&Monthid=" + encodeURIComponent(ExpMonthid)
        + "&Year=" + encodeURIComponent(ExpYear)
        + "&Courttype=" + encodeURIComponent(ExpCourttype);
    window.location = decodeURIComponent(encodeURI(url)); // Decodes %20 back to spaces

    alert("Download Successful: Excelsheet");
    closeload();

}