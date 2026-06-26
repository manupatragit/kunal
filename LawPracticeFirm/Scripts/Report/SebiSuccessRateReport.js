$(document).ready(function () {
    debugger;
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    $("#ddlYear").val(dd.getFullYear())
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlMonth").val(monthnum);
    GetSebiSuccessRateReport();
    $("#searchdatas").click(function () {
        GetSebiSuccessRateReport();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())
        $("#ddlMonth").val(monthnum);
        GetSebiSuccessRateReport();
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
        var urls = "/" + fcode + "/Report/ExportExcelSebiSuccessRateReport";
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
        var urls = "/" + fcode + "/Report/ExportPDFSebiSuccessRateReport";
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

function GetSebiSuccessRateReport() {
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
        url: "/Report/GetSebiSuccessRateReport",
        dataType: 'json',
        data: { month: month, year: Year },

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
                var reportdata = "<style>.totaltd td{ font-weight:600!important} .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Success Rate before Supreme Court</h3>";
                if (month !== "" && Year !== "") {
                    var selectedMonthText = $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text();
                    var selectedYear = $("#hdnYear").val();
                    reportdata = "<style>.totaltd td{ font-weight:600!important}  .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Success Rate before Supreme Court as on  " + selectedMonthText + " " + selectedYear + "</h3>";
                }
                var strhtml = '<div style="width: 100%;overflow-x:auto">' + reportdata + '<table style="min-width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl"><thead>'
                strhtml += "<tr><th colspan='3' style='text-align: center;'>Supreme Court (SC)/ High Court(HC)/ Other Fora(OF)</th></tr></thead><tbody>"
                $.each(res, function (i) {
                    strhtml += "<tr>"
                    if (i == 0 || i % 2 == 0) {
                        strhtml += "<td rowspan='2'>" + this.vStatus + "</td >";
                    }
                    if (i < res.length-2)
                        strhtml += '<td>' + this.vAction + '</td><td> <a href="#" style="color: blue; cursor: pointer;" onclick="MetterListData(\'' + this.vAction + '\', \''+ (i+1) + '\')">' + this.SubTotal + '</a></td></tr>';
                    else
                    strhtml += "<td>" + this.vAction + "</td><td>" + this.SubTotal + "</td></tr>";
                })
                strhtml += '</tbody></table></div>';
                $('#appendData').append(strhtml);
            }
        },
        error: function () {
            closeload();
        }
    })
}
function MetterListData(Action, flag) {
    // Convert year range to numeric values
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var strhtml = "";
    openload();
    $.ajax({
        type: "POST",
        url: "/api/MatterApi/AllMatterListSebiSuccess",
        data: {
            flag: flag,
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

            OpenModalMatter(Action);
            closeload();
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            closeload();
        }
    });
}

function OpenModalMatter(court) {

    $("#titleMatter").html(`Matter List of ${court}`); // Update modal title dynamically
    $('#MatterListModal').modal({ show: true });
}