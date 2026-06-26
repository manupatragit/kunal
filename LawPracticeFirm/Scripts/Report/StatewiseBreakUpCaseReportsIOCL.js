var Expvcourt = "", Expmonthid = "", Expyear="",Explike = "", Expstatus = "", ExpcourtType = "", expCourtName = "";


$(document).ready(function () {
    debugger;
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    $("#ddlYear").val(dd.getFullYear())
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlMonth").val(monthnum);
    GetStatewiseBreakUpCaseReports();
    $("#searchdatas").click(function () {
        GetStatewiseBreakUpCaseReports();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())
        $("#ddlMonth").val(monthnum);
        $("#ddlCourt").val("2");
        $("#ddlStatus").val("disposed");
        GetStatewiseBreakUpCaseReports();
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
        var urls = "/" + fcode + "/Report/ExportExcelStatewiseBreakUpCaseReports";

        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val(),
            "Courttype": $("#hdnCourt").val(),
            "Status": $("#hdnStatus").val(),

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
        var urls = "/" + fcode + "/Report/ExportPDFStatewiseBreakUpCaseReports";
        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val(),
            "Courttype": $("#hdnCourt").val(),
            "Status": $("#hdnStatus").val(),
        };
        var s = url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
        setTimeout(function () { closeload() }, 5000);

    });
})

function GetStatewiseBreakUpCaseReports() {
    openload();
    $("#oexcel").hide();
    $("#opdf").hide();
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var Court = $('#ddlCourt').val();
    var Status = $('#ddlStatus').val();
    $("#hdnMonth").val(month);
    $("#hdnYear").val(Year);
    $("#hdnCourt").val(Court);
    $("#hdnStatus").val(Status);
    $.ajax({
        async: true,
        type: "POST",
        url: "/Report/GetStatewiseBreakUpCaseReports",
        dataType: 'json',
        data: { month: month, year: Year, Courttype: Court, Status: Status },
        success: function (response1) {
            closeload();
            debugger;
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

                var selectedYear = $("#hdnYear").val();
                var selectedMonthText = "";
                if (month !== "") {
                    selectedMonthText = $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text() +',';
                }
                var reportdata = "";
                if (Status == "disposed")
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>State-wise break-up of cases disposed during " + selectedMonthText + " " + selectedYear + " </h3>";
                else if (Status == "pending")
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>State-wise break-up of cases pending at the end of the " + selectedMonthText + " " + selectedYear + " </h3>";

                var strhtml = '<div style="width: 100%;">' + reportdata + '<table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl"><tr><th>State</th><th>No.of cases filed by IOCL</th><th>No. of cases filed against IOCL</th></tr>';
                $.each(res, function (i) {
                    if (i < res.length-1)
                        strhtml += '<tr><td>' + this.vState + '</td><td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\',\'' + this.vCourt + '\',\'Filed By\')">' + this.FiledbySEBICount + '</a></td><td><a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vState + '\',\'' + this.vCourt + '\',\'Against By\')">' + this.FiledAgainstSEBICount + '</a></td></tr>';

                    else
                        strhtml += '<tr><td>' + this.vState + '</td><td>' + this.FiledbySEBICount + '</td><td>' + this.FiledAgainstSEBICount + '</td></tr>';

                })
                strhtml += '</table></div>'
                $('#appendData').append(strhtml);
            }
        },
        error: function () {
            closeload();
        }
    })
}
function MetterListData(vState, vCourt, fileBy) {
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var vcourt = vCourt;
    var CourtName = vState;
    var courtType = $('#ddlCourt').val();
    var status = $('#ddlStatus').val();
    var finalStatus = "";
    var like = fileBy;
    var YearLabel = "Pending as on " + $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text() + ", " + Year;
    var vCourt = "";
    switch (status) {
        case "disposed": {
            finalStatus = "dis";
            break;
        }
        case "pending": {
            finalStatus = "pend";
            break;
        }
    }
    var strhtml = "";
    openload();
    Expvcourt = vcourt, Expmonthid = month, Expyear = Year, Explike = like, Expstatus = finalStatus, ExpcourtType = courtType, expCourtName = CourtName;

    $.ajax({
        type: "POST",
        url: "/api/MatterApi/AllMatterListStateWise",
        data: {
            vcourt: vcourt,
            monthid: month,
            year: Year,
            like: like,
            status: finalStatus,
            courtType: courtType,
            CourtName: CourtName
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

            OpenModalMatter(CourtName, status);
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
    const url = "/CW/ExportToExcelAllMatterListStateWise?vcourt=" + encodeURIComponent(Expvcourt)
        + "&monthid=" + encodeURIComponent(Expmonthid)
        + "&year=" + encodeURIComponent(Expyear)
        + "&like=" + encodeURIComponent(Explike)
        + "&status=" + encodeURIComponent(Expstatus)
        + "&courtType=" + encodeURIComponent(ExpcourtType)
        + "&CourtName=" + encodeURIComponent(expCourtName);
    window.location = decodeURIComponent(encodeURI(url)); // Decodes %20 back to spaces

    alert("Download Successful: Excelsheet");
    closeload();

}