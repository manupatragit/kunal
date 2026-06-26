
var expvCourtval = "", expYear = "", expoMonthid = "", expoflag = "", expocourtType = "";




$(document).ready(function () {
    var dd = new Date()
    for (var i = dd.getFullYear(); i >= 2000; i--) {
        $("#ddlYear").append("<option value='" + i + "'>" + i + "</option>")
    }
    $("#ddlYear").val(dd.getFullYear())
    var monthnum = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    $("#ddlMonth").val(monthnum);
    ;
    BindRegion();
    $("#searchdatas").click(function () {
        CategorisationofLitigationcases();
    })
    $('#btnClear').click(function () {
        $("#ddlYear").val(dd.getFullYear())
        $("#ddlMonth").val(monthnum);
        CategorisationofLitigationcases();
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
        var urls = "/" + fcode + "/Report/ExportExcelCategorisationofLitigationcases";

        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val(),
            "Region": $("#hdnRegion").val()

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
        var urls = "/" + fcode + "/Report/ExportCategorisationofLitigationcases";
        var data1 = {
            "month": $("#hdnMonth").val(),
            "year": $("#hdnYear").val(),
            "Region":$("#hdnRegion").val()
        };
        var s = url_redirect({
            url: urls,
            method: "post",
            data: data1
        })
        setTimeout(function () { closeload() }, 5000);

    });
})
function BindRegion() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/Report/BindSebiRegion",
        dataType: 'json',
        data: {},
        success: function (response1) {
            var res = JSON.parse(response1);
            res = res.data;
            $('#ddlRegion').empty();
            $.each(res, function (i) {
                $('#ddlRegion').append("<option value='" + this.vName + "'>" + this.vName + "</option>")
            })
            CategorisationofLitigationcases()
        }, error: function () { }
    })
}
function CategorisationofLitigationcases() {
    
    openload();
    $("#oexcel").hide();
    $("#opdf").hide();
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var Region = $('#ddlRegion').val();
    $("#hdnMonth").val(month);
    $("#hdnYear").val(Year);
    $("#hdnRegion").val(Region);
    $.ajax({
        async: true,
        type: "POST",
        url: "/Report/GetCategorisationofLitigationcases",
        dataType: 'json',
        data: { month: month, year: Year, Region: Region },

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
                var reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Categorisation of Litigation cases as per Super Active, Active and Dormant of HO and ROs</h2>";
                if (month !== "" && Year !== "") {
                    var selectedMonthText = $('#ddlMonth option[value="' + $("#hdnMonth").val() + '"]').text();
                    var selectedYear = $("#hdnYear").val();
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Categorisation of Litigation cases as per Super Active, Active and Dormant of HO and ROs - " + selectedMonthText + " " + selectedYear + "</h2>";
                }
                var RegionDetail = "";
                var strSTring = "";
                if (Region == "NRO") {
                    strSTring = "NRO - States/UT - Delhi, Himachal Pradesh, Jammu and Kashmir, Punjab, Haryana and Chandigarh, Uttar Pradesh and Uttarakhand";
                }
                else if (Region == "ERO") {
                    strSTring = "ERO - States/UT - Arunachal Pradesh, Assam, Bihar, Jharkhand, Manipur, Meghalaya, Mizoram, nageland, Odisha, Sikkim, Tripura, West Bengal";
                }
                else if (Region == "SRO") {
                    strSTring = "SRO - States/UT - Andhra Pradesh, Karnataka, Kerala, Tamil Nadu and Telengana";
                }
                else if (Region == "WRO") {
                    strSTring = "WRO - States/UT - Chhattisgarh, Goa, Gujarat, Madhya Pradesh and Rajasthan";
                }
                else if (Region == "HO") {
                    strSTring = "HO - State - Maharashtra";
                }
               
                var strhtml = '<div style="width: 100%;">' + reportdata + '<p style="width: 100%;text-align: center;margin-bottom: 0;"><span style="font-size: 1.5em;font-weight: 900;">' + RegionDetail + '</span></p> <table style="width:60%;margin:auto;border-collapse: separate;border-spacing: 0;" class="printtbl">'

                var columnsIn = res[0];
                if (strSTring!="")
                strhtml += "<tr><th style='white-space: break-spaces;text-align:center;' colspan='" + (Object.keys(res[0]).length - 1) + "'>" + strSTring + "</th></tr>"

                strhtml += "<tr><th></th>";
                for (var key in columnsIn) {
                    if (key != "id" && key != "CaseCriteria")
                        strhtml += "<th>" + key + "</th>" // here is your column name you are looking for
                }
                strhtml += "</tr>"
                $.each(res, function (i) {
                    strhtml += "<tr>";
                    var typeName = "";
                    for (var key in columnsIn) {
                        if (key != "id") {
                            if (key == "CaseCriteria") {
                                typeName = res[i][key] ;
                                strhtml += "<td>" + res[i][key] + "</td>";

                            }
                            else {
                                var keysArray = Object.keys(columnsIn);

                                var lastKey = keysArray[keysArray.length - 1];
                                 if (key === lastKey && (Region !== "Tribunals" && Region !== "Add Court"))
                                     {
                                    strhtml += "<td>" + res[i][key] + "</td>";

                                }
                                else if (typeName != "Total" ) {
                                    strhtml += "<td><a href='#' style='color: blue; cursor: pointer;' onclick=\"MetterListData('" + key + "','" + Region + "','" + typeName + "')\">" + res[i][key] + "</a></td>";

                                }
                                //else if (Region == "Tribunals") {
                                //    strhtml += "<td><a href='#' style='color: blue; cursor: pointer;' onclick=\"MetterListData('" + key + "','" + Region + "','" + typeName + "')\">" + res[i][key] + "</a></td>";

                                //}

                                else {
                                    strhtml += "<td>" + res[i][key] + "</td>";

                                }

                            }

                        }
                    }
                    strhtml += "</tr>";
                })
                strhtml += '</table><div style="width:60%;margin:30px auto;">';
                strhtml += '<strong>The Criteria for Super Active, Active and Dormant/Active Cases is as follows: </strong>'
                strhtml += '<ul style="list-style:auto"><li><strong>Super Active Cases :</strong> Cases listed or action taken by SEBI since in the past 12 months.</li>'
                strhtml += '<li><strong>Active Cases :</strong> Cases listed or action taken by SEBI in more than 12 but less than 24 months.</li>'
                strhtml += '<li><strong>Dormant/Static. Cases :</strong> Other than 1 and 2</li>'
                strhtml += '</ul>'

                strhtml += '</div></div>'
                $('#appendData').append(strhtml);
            }
        },
        error: function () {
            closeload();
        }
    })
}



function MetterListData(courtType1, region,priority) {
    // Convert year range to numeric values
    
    var month = $('#ddlMonth').val();
    var Year = $('#ddlYear').val();
    var courtFlag = "";
    var courtType=''
    var flag = "";

    switch (courtType1) {
        case "SC": {
            courtFlag = "1";
            break;
        }
        case "HC": {
            courtFlag = "2";
            break;

        }
        case "OTF": {
            courtFlag = "3";
            break;

        }
       
    }
    switch (region) {
        case "NRO": {
            courtType = "1";
            break;
        }
        case "ERO": {
            courtType = "2";
            break;
        }
        case "SRO": {
            courtType = "3";
            break;
        }
        case "WRO": {
            courtType = "4";
            break;
        }
        case "HO": {
            courtType = "5";
            break;
        }
        case "HO": {
            courtType = "5";
            break;
        }
        case "Tribunals": {
            courtType = "6";
            courtFlag="3"
            break;
        }
        case "Add Court": {
            courtType = "7";
            courtFlag = "3"
            break;
        }
           
    }
    switch (priority) {
        case "Super Active": {
            flag = "1";
            break;
        }
        case "Active": {
            flag = "2";
            break;
        }
        case "Dormant": {
            flag = "3";
            break;
        }

    }

    var strhtml = "";

    openload();
     expvCourtval = courtFlag;
    expYear = Year;
    expoMonthid = month;
    expoflag = flag;
    expocourtType = courtType;

    $.ajax({
        type: "POST",
        url: "/api/MatterApi/AllMatterListZoneWise",
        data: {
            vCourtval: courtFlag,
            Year: Year,
            Monthid: month,
            flag: flag,
            courtType: courtType
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
                                        <td>${tableData[i].vCauselistDate}</td>
                                    </tr>`;
            }



            $("#caseData").append(strhtml); // Append table rows only once
            console.log(response);

            OpenModalMatter(courtType1, priority+"-"+region);
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
        case "OTF": {
            court = "Other forum"
            break;

        }

    }


    $("#titleMatter").html(`Matter List of ${court} (${year})`); // Update modal title dynamically
    $('#MatterListModal').modal({ show: true });
}


function DownloadmatterListExcel() {
    openload();
    const url = "/CW/ExportToExcelAllMatterListZoneWise?vCourtval=" + encodeURIComponent(expvCourtval)
        + "&Year=" + encodeURIComponent(expYear)
        + "&Monthid=" + encodeURIComponent(expoMonthid)
        + "&flag=" + encodeURIComponent(expoflag)
        + "&courtType=" + encodeURIComponent(expocourtType);
    window.location = decodeURIComponent(encodeURI(url)); // Decodes %20 back to spaces

    alert("Download Successful: Excelsheet");
    closeload();

}