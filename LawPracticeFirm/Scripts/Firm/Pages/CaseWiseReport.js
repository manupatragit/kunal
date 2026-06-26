var fcode = localStorage.getItem("FirmCode");
var AgainstBankFilter = "";
$(document).ready(function () {
    //start multiple validations
    var count = 0;
    var zonename = "", CourtName = "", Satatus = "", nexthearingdatefrm = "", nexthearingdateTo = "",Againstbytheparty="";
    var zonenameexpo = "", CourtNameexp = "", Satatusexp = "", nexthearingdatefrmexpo = "", nexthearingdateToexp = "", AgainstbythepartyExp = "", SubcourtNameExpo = "";
    var AllCourtChart = "", zonechart = "", Courtstatuschart = "", Againstbythechart = "";
    jQuery('#ZoneBind').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });
    jQuery('#UserAdvocatefilter').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });

    //For Reset the all graph settings
    $(document).on('click', '#Resetgrapah', function () {
        ClearAllGraph();
        $("#grphhearingfrom").val('');
        $("#grphhearingto").val('');
        AgainstBankFilter = "";
        GetAllReportData("", "", "", "","","");

    });
    //For NextHearing Search
    $(document).on('click', '#Grphsearchnexthering', function () {
       
        nexthearingdatefrm = $("#grphhearingfrom").val();
        nexthearingdateTo= $("#grphhearingto").val();
        if (nexthearingdatefrm == "") {
            alert("Please select filter from date");
            $("#grphhearingfrom").focus();
            return false;
        }
        if (nexthearingdateTo == "") {
            alert("Please select filter to date");
            $("#grphhearingto").focus();
            return false;
        }
        ClearAllGraph();
        GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);

    });
    //Graph Clear data
    $(document).on('click', '#Grphclearnextdate', function () {
        $("#grphhearingfrom").val('');
        $("#grphhearingto").val('');
        ClearAllGraph();
        GetAllReportData("", "", "", "","");
    });
    //For Binding the date on click event
    function GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        AllCaseCountByZone(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
        FillCustomZoneTypeChart(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
        GetMatterCount(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
        FillCourtStatusChartFront(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
        GetAllAssignUserCasesByZone(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
        AllMatterBySubCourtWise(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
        GetMatterDeatilsAgainsttheParty(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
        zonenameexpo = zonename;
        CourtNameexp = CourtName;
        Satatusexp = Satatus;
        debugger
        nexthearingdatefrmexpo = nexthearingdatefrm;
        nexthearingdateToexp = nexthearingdateTo;
        AgainstbythepartyExp = Againstbytheparty;
    }
    //openloaddashboard();
    AllCaseCountByZone(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    FillCustomZoneTypeChart(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    GetMatterCount(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    FillCourtStatusChartFront(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    GetAllAssignUserCasesByZone(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    AllMatterBySubCourtWise(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    GetMatterDeatilsAgainsttheParty(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    //For Adding New garph on Court type
    function GetMatterCount(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        var statusname = [];
        var statuscount = [];
        var html1 = '';
        $("#bindcourtwisestatus").html("");
        var formdata = new FormData();
        formdata.append("Zonevalue", zonename);
        formdata.append("court", CourtName);
        formdata.append("CourtStatus", Satatus);
        formdata.append("UserAdvocate", "");
        formdata.append("Nexthearing", nexthearingdatefrm);
        formdata.append("Nexthearingto", nexthearingdateTo);
        formdata.append("Againstthefilter", Againstbytheparty);
        formdata.append("type", $('input[name="filterType"]:checked').val() || "0");

        openloadgraphreport4();
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllMattersWithCourtWise",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                }
                else {
                    var obj = JSON.parse(response.Data);
                    var obj1 = JSON.parse(response.Data);

                    $(obj).each(function (key, value) {
                        if (value.Court == "" || value.Court == null || value.Court == "null") {
                        }
                        else {
                            statusname.push(value.Court);
                            statuscount.push(value.Totals);
                            //html += '<tr><td>' + value.Court + '</td><td><p>' + value.Totals + '</p></td></tr>'
                        }
                    });
                    $.each(obj1, function (i, a) {
                        count += 1;
                        html1 += "<tr>"
                        html1 += "<td><span style='cursor:pointer;font-size:14px !important' id='viewcourtdetails' Idss='" + a.Court+"'>" + a.Court + "</span></td>"
                        html1 += "<td><p>" + a.Totals + "</p></td>"
                        html1 += "</tr>"
                    });
                    $("#bindcourtwisestatus").append(html1);
                    
                }
                //$("#tblbodyCourtType").html(html)
            },
            failure: function (response) {
                alert("Something Went Wrong");
            }
        });
        var chartDiv = $("#chart-area-courttype");
         AllCourtChart = new Chart(chartDiv, {
            type: 'pie',
            data: {
                labels: statusname,
                datasets: [
                    {
                        data: statuscount,
                        backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F"]
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    responsive: true,
                },
                legend: {
                    display: false,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 2,
                        fontSize: 12,
                        fontColor: '#333333'
                    }
                },
                onClick: function (e) {
                    CourtName = this.getElementsAtEvent(e)[0]._model.label;
                    ClearAllGraph();
                    AllCourtChart.destroy();
                    GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
                    //alert(activePointLabel);
                }
            }

        });
        closeloadgraphreport4();
    }
    //Total Matter Count
    function AllCaseCountByZone(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        var formdata = new FormData();
        formdata.append("Zonevalue", zonename);
        formdata.append("court", CourtName);
        formdata.append("CourtStatus", Satatus);
        formdata.append("UserAdvocate", "");
        formdata.append("Nexthearing", nexthearingdatefrm);
        formdata.append("Nexthearingto", nexthearingdateTo);
        formdata.append("Againstthefilter", Againstbytheparty);
        formdata.append("type", $('input[name="filterType"]:checked').val() || "0");

        
        openloadgraphreport1();
        $("#lblmattercountcountbyzone").val('');
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllCaseCountByZone",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                } else {
                    var obj = JSON.parse(response.Data);

                    $("#lblmattercountcountbyzone").html(obj[0].MatterCount)
                    closeloadgraphreport1();
                }

                closeloadgraphreport1();
            },
            failure: function (response) {
                alert("Something Went Wrong");
                closeloadgraphreport1();
            }
        });
    }
    //Zone wise matter count
    function FillCustomZoneTypeChart(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        var NoticeStatusarray = [];
        var NoticeStatusvaluearray = [];
        $("#bindzonewisestatus").html("");
        var html1 = "";
        var formData = new FormData();
        formData.append("Zonevalue", zonename);
        formData.append("court", CourtName);
        formData.append("CourtStatus", Satatus);
        formData.append("UserAdvocate", "");
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("Againstthefilter", Againstbytheparty);
        formData.append("type", $('input[name="filterType"]:checked').val() || "0");

        openloadgraphreport3();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CustomZoneDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "") {
                }
                else {
                    var obj = JSON.parse(response1.Data);
                    $.each(obj, function (i, a) {
                        NoticeStatusarray.push(a.States);
                        NoticeStatusvaluearray.push(a.Total);
                    });
                     zonechart = new Chart(document.getElementById("chart-area-statetype"), {
                        type: 'pie',
                        data: {
                            labels: NoticeStatusarray,
                            datasets: [
                                {
                                    // new
                                    backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                        "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                        "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                        "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                        "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                        "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                        "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                        "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                        "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                        "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                    data: NoticeStatusvaluearray
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: false,
                                responsive: true,
                                text: ''
                            },
                            legend: {
                                display: false,
                                position: 'bottom',
                                labels: {
                                    boxWidth: 10,
                                    boxHeight: 2,
                                    fontSize: 12,
                                    fontColor: '#333333',
                                }
                            },
                            onClick: function (e) {
                                zonename = this.getElementsAtEvent(e)[0]._model.label;
                                ClearAllGraph();
                                zonechart.destroy();
                                GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
                                //zonename = activezonename;
                            }
                        }
                    });

                    $.each(obj, function (i, a) {
                        html1 += "<tr>"
                        html1 += "<td><span style='cursor:pointer;font-size:14px !important' title='click here to view matters' id='viewzonedetails'  type='status' value='" + a.States + "'>" + a.States + "</span></td>"
                        html1 += "<td><p>" + a.Total + "</p></td>"
                        html1 += "</tr>"
                    });
                    $("#bindzonewisestatus").append(html1);
                    closeloadgraphreport3();
                }
                closeloadgraphreport3();
            },
            error: function (response1)
            {
                closeloadgraphreport3();
            }
        });
    }
    /*Fill front Court chart status*/
    function FillCourtStatusChartFront(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        var NoticeStatusarray = [];
        var NoticeStatusvaluearray = [];
        $("#bindCourtchartstatus").html("");
        var html1 = "";
        var formData = new FormData();
        formData.append("Zonevalue", zonename);
        formData.append("court", CourtName);
        formData.append("CourtStatus", Satatus);
        formData.append("UserAdvocate", "");
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("Againstthefilter", Againstbytheparty);
        formData.append("type", $('input[name="filterType"]:checked').val() || "0");

        openloadgraphreport2();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/AllCourtCaseStatusChart",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "") {
                }
                else {
                    var obj = JSON.parse(response1.Data);
                    $.each(obj, function (i, a) {
                        NoticeStatusarray.push(a.CaseStatus);
                        NoticeStatusvaluearray.push(a.Total);
                    });
                    //chart1.destroy();
                     Courtstatuschart = new Chart(document.getElementById("chart-area-CourtStatus"), {
                        type: 'bar',
                        data: {
                            labels: NoticeStatusarray,
                            datasets: [
                                {
                                    // new
                                    backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                        "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                        "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                        "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                        "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                        "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                        "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                        "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                        "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                        "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                    data: NoticeStatusvaluearray
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: false,
                                responsive: true,
                                text: ''
                            },
                            legend: {
                                display: false,
                                position: 'bottom',
                                labels: {
                                    boxWidth: 10,
                                    boxHeight: 2,
                                    fontSize: 12,
                                    fontColor: '#333333',
                                }
                            },
                            onClick: function (e) {
                                var courtstatus = this.getElementsAtEvent(e)[0]._model.label;
                                Satatus = courtstatus;
                                ClearAllGraph();
                                Courtstatuschart.destroy();
                                GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
                            }
                        }
                    });
                    $.each(obj, function (i, a) {
                        count += 1;
                        html1 += "<tr>"
                        html1 += "<td><span id='linktomatterCaseStatus' style='cursor:pointer;font-size:14px !important;' title='click here to view matters'  type='Courtstatus' value='" + a.Type + "'>" + a.CaseStatus + "</span></td>"
                        html1 += "<td><p>" + a.Total + "</p></td>"
                        html1 += "</tr>"
                    });
                    $("#bindCourtchartstatus").append(html1);
                    closeloadgraphreport2();
                }
                closeloadgraphreport2();
            },
            error: function (response1) {
                closeloadgraphreport2();
            }
        });
    }
    //For All AssignUser Cases
    function GetAllAssignUserCasesByZone(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        var html3 = '';
        var html4 = '';
        var advocatecount = 0;
        var usercount = 0;
        $("#GarphbindMatterUserData").html("");
        $("#GarphbindMatterData").html("");
        var formdata = new FormData();
        formdata.append("Zonevalue", zonename);
        formdata.append("court", CourtName);
        formdata.append("CourtStatus", Satatus);
        formdata.append("UserAdvocate", "");
        formdata.append("Nexthearing", nexthearingdatefrm);
        formdata.append("Nexthearingto", nexthearingdateTo);
        formdata.append("Againstthefilter", Againstbytheparty);
        formdata.append("type", $('input[name="filterType"]:checked').val() || "0");

        openloadgraphreport7();
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllassignCaseByZonewise",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                }
                else {
                    var obj = JSON.parse(response.Data);
                    $(obj).each(function (key, val) {
                        if (val.UserType == "Advocate") {
                            advocatecount += 1;
                            html3 += '<tr>'
                            //html3 += '<td >' + val.UserType + '</td>';
                            html3 += '<td>' + val.UserName + '</td>';
                            html3 += '<td>' + val.LoginId + '</td>';
                            html3 += '<td><a style="color:#0059c1;" id="transferpage" href="javascript:void()" sno=' + val.Id + ' type="Advocate" val="' + val.UserName + '">' + val.Total + '</a></td>';
                        } else if (val.UserType == "User") {
                            usercount += 1;
                            html4 += '<tr>'
                            //html4 += '<td >' + val.UserType + '</td>';
                            html4 += '<td>' + val.UserName + '</td>';
                            html4 += '<td>' + val.LoginId + '</td>';
                            html4 += '<td><a style="color:#0059c1;" id="transferpage" href="javascript:void()" sno=' + val.Id + ' type="User" val="' + val.UserName + '">' + val.Total + '</a></td>';
                        } else {}
                     
                    });
                    $("#idadvocatecount").text('');
                    $("#idadvocatecount").text("(" + advocatecount + ")");

                    $("#idusercount").text('');
                    $("#idusercount").text("(" + usercount + ")");
                    
                    $("#GarphbindMatterData").append(html3);
                    $("#GarphbindMatterUserData").append(html4);
                }
                closeloadgraphreport7();
            },
            failure: function (response) {
                alert("Something Went Wrong");
                closeloadgraphreport7();
            }
        });
    }
    //Get All Sub Court Name
    function AllMatterBySubCourtWise(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        var formdata = new FormData();
        formdata.append("Zonevalue", zonename);
        formdata.append("court", CourtName);
        formdata.append("CourtStatus", Satatus);
        formdata.append("UserAdvocate", "");
        formdata.append("Nexthearing", nexthearingdatefrm);
        formdata.append("Nexthearingto", nexthearingdateTo);
        formdata.append("Againstthefilter", Againstbytheparty);
        formdata.append("type", $('input[name="filterType"]:checked').val() || "0");

        var html1 = '';
        var subcourtcount = 0;
        openloadgraphreport6();
        $("#tblbodyCourtType").html("");
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllMatterBySubCourtWise",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                } else {
                    //var obj = JSON.parse(response.Data);

                    //$("#lblsubcourtcount").html(obj[0].MatterCount)
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        subcourtcount += 1;
                        html1 += "<tr>"
                        html1 += "<td><p>" + a.Court + "</p></td>"
                       // html1 += "<td><p>" + a.Totals + "</p></td>"
                        html1 += "<td><a style='color:#0059c1;'id='transfersubcourt' href='javascript:void()' sno= '" + a.Court + "' > " + a.Totals + "</a ></td>";   
                        html1 += "</tr>"
                    });
                    $("#idcourtcasecount").text('');
                    $("#idcourtcasecount").text("(" + subcourtcount + ")");
                    $("#tblbodyCourtType").append(html1);
                    closeloadgraphreport6();
                }

                closeloadgraphreport6();
            },
            failure: function (response) {
                alert("Something Went Wrong");
                closeloadgraphreport6();
            }
        });
    }
    var fcode = localStorage.getItem("FirmCode");

    function GetMatterDeatilsAgainsttheParty(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty) {
        var partykeyword = ""

        var NoticeStatusarray = [];
        var NoticeStatusvaluearray = [];
        $("#bindAgaintBythe").html("");
        var html1 = "";
        var formData = new FormData();
        formData.append("Zonevalue", zonename);
        formData.append("court", CourtName);
        formData.append("CourtStatus", Satatus);
        formData.append("UserAdvocate", "");
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("Againstthefilter", Againstbytheparty);
        formData.append("type", $('input[name="filterType"]:checked').val() || "0");

        openloadgraphreport5();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/MatterReportAgaintthePartyName",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "") {
                }
                else {
                    var obj = JSON.parse(response1.Data);
                    $.each(obj, function (i, a) {
                        NoticeStatusarray.push(a.Type);
                        NoticeStatusvaluearray.push(a.Total);
                    });
                    //chart1.destroy();
                    Againstbythechart = new Chart(document.getElementById("chart-area-AgaintBy"), {
                        type: 'pie',
                        data: {
                            labels: NoticeStatusarray,
                            datasets: [
                                {
                                    // new
                                    backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                        "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                        "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                        "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                        "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                        "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                        "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                        "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                        "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                        "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                    data: NoticeStatusvaluearray
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: false,
                                responsive: true,
                                text: ''
                            },
                            legend: {
                                display: false,
                                position: 'bottom',
                                labels: {
                                    boxWidth: 10,
                                    boxHeight: 2,
                                    fontSize: 12,
                                    fontColor: '#333333',
                                }
                            },
                            onClick: function (e) {
                                var againsttheparty = this.getElementsAtEvent(e)[0]._model.label;
                                AgainstBankFilter = againsttheparty;
                                Againstbytheparty = againsttheparty;
                                ClearAllGraph();
                                Againstbythechart.destroy();
                                GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty, Againstbytheparty);
                            }
                        }
                    });
                    $.each(obj, function (i, a) {
                        count += 1;
                        html1 += "<tr>"
                        html1 += "<td><span  style='cursor:pointer;font-size:14px !important' Id='IdAgainstdta' idss='" + a.Type+"'   type='Courtstatus'>" + a.Type + "</span></td>"
                        html1 += "<td><p>" + a.Total + "</p></td>"
                        html1 += "</tr>"
                    });
                    $("#bindAgaintBythe").append(html1);
                    closeloadgraphreport5();
                }
                closeloadgraphreport5();
            },
            error: function (response1) {
                closeloadgraphreport5();
            }
        });
    }
    //For Matter Details 
    $(document).on("click", "#transferpage", function () {
        var UserIds = $(this).attr("sno");
        var UserName = $(this).attr("val"); 
        var UserType = $(this).attr("type"); 
        //setTimeout(function () { GetMatterDetailsByUserId(UserIds, UserName, UserType, zonenameexpo, CourtNameexp, Satatusexp, nexthearingdatefrmexpo, nexthearingdateToexp); }, 1000);
        GetMatterDetailsByUserId(UserIds, UserName, UserType, zonenameexpo, CourtNameexp, Satatusexp, nexthearingdatefrmexpo, nexthearingdateToexp, AgainstBankFilter);
    });
    //Clear All Graph value
    function ClearAllGraph() {
        Courtstatuschart.destroy();
        zonechart.destroy();
        AllCourtChart.destroy();
        Againstbythechart.destroy();
    }
    //For Binding the court details
    $(document).on("click", "#transfersubcourt", function () {
        var token = $(this).attr("sno");
        SubcourtNameExpo = token;
        GetSubCourtDetails(token, zonenameexpo, CourtNameexp, Satatusexp, nexthearingdatefrmexpo, nexthearingdateToexp);
        //alert(token); 
    });
    //For Get the Sub Court Details
    function GetSubCourtDetails(SubCourtName, zonenameexpo, CourtNameexp, Satatusexp, nexthearingdatefrmexpo, nexthearingdateToexp, AgainstBankFilter) {
        var formdata = new FormData();
        formdata.append("Zonevalue", zonenameexpo);
        formdata.append("court", CourtNameexp);
        formdata.append("CourtStatus", Satatusexp);
        formdata.append("UserAdvocate", "");
        formdata.append("Nexthearing", nexthearingdatefrmexpo);
        formdata.append("Nexthearingto", nexthearingdateToexp);
        formdata.append("SubCourtName", SubCourtName);
        formdata.append("Againstthefilter", AgainstbythepartyExp);
        formdata.append("type", $('input[name="filterType"]:checked').val() || "0");

        var html1 = '';
        $("#bindcourtname").html("");
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/MatterCountBySubCourtName",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                } else {
                    $("#myModalCourtComplex").modal({ show: true });
                    //var obj = JSON.parse(response.Data);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        count += 1;
                        var filingdate = a.dFilingDate;
                        if (filingdate == "1900-01-01T00:00:00") {
                            filingdate = null;
                        }
                        html1 += "<tr>"
                        html1 += "<td><p>" + a.Court + "</p></td>";
                       // html1 += "<td><p>" + a.CourtName + "</p></td>";
                        if (a.Court = "Tribunals") {
                            html1 += "<td><p>" + a.OtherCourtName + "</p></td>"
                        }
                        else {
                            html1 += "<td><p>" + a.CourtComplex + "</p></td>"
                        }
                        html1 += "<td><p>" + a.MatterName + "</p></td>";
                        html1 += "<td><p>" + a.CaseNo + "</p></td>";
                        html1 += "<td><p>" + a.VStatus + "</p></td>";
                        html1 += "<td><p>" + a.Nexthearingdate + "</p></td>";
                        html1 += "<td><p>" + (filingdate != null ? formatDatetoIST(filingdate) : '<span style="visibility: hidden;">&nbsp;</span>')+ "</p></td>";
                        html1 += "</tr>"
                    });
                    $("#bindcourtname").append(html1);
                    //closeloaddashboard1();
                }

               // closeloaddashboard1();
            },
            failure: function (response) {
                alert("Something Went Wrong");
               // closeloaddashboard1();
            }
        });
    }
    //For Matter details by Assign User
    function GetMatterDetailsByUserId(AssignUserId, UserName, UserType, zonenameexpo, CourtNameexp, Satatusexp, nexthearingdatefrmexpo, nexthearingdateToexp, AgainstbythepartyExp) {
        var formdata = new FormData();
        formdata.append("AssignUserId", AssignUserId);
        formdata.append("Zonevalue", zonenameexpo);
        formdata.append("court", CourtNameexp);
        formdata.append("CourtStatus", Satatusexp);
        formdata.append("UserAdvocate", "");
        formdata.append("Nexthearing", nexthearingdatefrmexpo);
        formdata.append("Nexthearingto", nexthearingdateToexp);
        formdata.append("Againstthefilter", AgainstbythepartyExp);
        formdata.append("type", $("input[name='filterType']:checked").val() || "0");

        var html1 = '';
        $("#bindreportmatterdetails").html("");
        $("#IdUserDetails").val('');
        $("#myModalReportMatterDetails").modal({ show: true });
        openloadgraphreport7();
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/MatterDetailsByAssignUser",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                } else {
                    $("#IdUserDetails").text("Matter Details-"+UserType+"-"+UserName);
                    //var obj = JSON.parse(response.Data);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        count += 1;
                        var filingdate = a.dFilingDate;
                        if (filingdate == "1900-01-01T00:00:00") {
                            filingdate = null;
                        }
                        html1 += "<tr>"
                        html1 += "<td><p>" + a.Court + "</p></td>";
                        html1 += "<td><p>" + a.OtherCourtName + "</p></td>";
                        html1 += "<td><p>" + a.CaseNo + "</p></td>";
                        html1 += "<td><p>" + a.MatterName + "</p></td>";
                        html1 += "<td><p>" + a.VStatus + "</p></td>";
                        html1 += "<td><p>" + a.Nexthearingdate + "</p></td>";
                        html1 += "<td><p>" + (filingdate != null ? formatDatetoIST(filingdate) : '<span style="visibility: hidden;">&nbsp;</span>') + "</p></td>";
                        html1 += "</tr>"
                    });
                    $("#bindreportmatterdetails").append(html1);
                    closeloadgraphreport7();
                }

            },
            failure: function (response) {
                alert("Something Went Wrong");
                closeloadgraphreport7();
            }
        });
    }
    //Open Loader
    $("#IdExcelExport").click(async function () {
            $("#myModalexport").modal({ show: true });
            var totalRecord = $("#lblmattercountcountbyzone").text();
            var pagesize = 5000;
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
    /*Export to excel report*/
    $(document).on("click", "#exporttoexcelfile", function () {
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 5000;
        var teAssignUserId = "";
        var SubCourtName = "";
        var type = $('input[name="filterType"]:checked').val() || "0";


        window.location = encodeURI("/firm/ExportoExcelBOMCustomReport?AssignUserId=" + teAssignUserId +
            "&SubCourtName=" + SubCourtName + "&zonenameexpo=" + zonenameexpo + "&CourtNameexp=" + CourtNameexp +
            "&Satatusexp=" + Satatusexp + "&nexthearingdatefrmexpo=" + nexthearingdatefrmexpo + "&nexthearingdateToexp=" + nexthearingdateToexp+
            "&pagenum=" + pagenum + "&pagesize=" + pagesizedata + "&Againstpartyname=" + AgainstbythepartyExp + "&type=" + type);
    });

    //Court Details Export to Excel
    $(document).on("click", "#CourtComplexExport", function () {
        var type = $('input[name="filterType"]:checked').val() || "0";
       
            window.location = encodeURI("/firm/ExporCourtComplexCustomReport?Zonevalue=" + zonenameexpo +
                "&SubCourtName=" + SubcourtNameExpo + "&CourtNameexp=" + CourtNameexp + "&Satatusexp=" + Satatusexp +
            "&nexthearingdatefrmexpo=" + nexthearingdatefrmexpo + "&nexthearingdateToexp=" + nexthearingdateToexp +
                "&Againstpartyname=" + AgainstbythepartyExp + "&type=" + type);
    });
    //Zone Back graph Matter List
    $(document).on("click", "#viewzonedetails", function () {
        ClearAllGraph();
        var token = $(this).attr("value");
        zonename = token;
        GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);

    });
    //Court Wise Back graph matter list
    $(document).on("click", "#viewcourtdetails", function () {
        ClearAllGraph();
        var tokens = $(this).attr("Idss");
        CourtName = tokens;
        GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    });

    //Againstthe bank Grap Report
    $(document).on("click", "#IdAgainstdta", function () {
        ClearAllGraph();
        var tokenss = $(this).attr("idss");
        Againstbytheparty = tokenss;
        AgainstBankFilter = Againstbytheparty;
        GetAllReportData(zonename, CourtName, Satatus, nexthearingdatefrm, nexthearingdateTo, Againstbytheparty);
    });
    
});


function openloadgraphreport() {
    $('#myOverlayDashboard').css("display", "block");
}
/*Close loader*/
function closeloadgraphreport() {
    $('#myOverlayDashboard').css("display", "none");
}

function openloadgraphreport1() {
    $(".loader1").css("display", "block");
}
function closeloadgraphreport1() {
    $(".loader1").css("display", "none");
}
function openloadgraphreport2() {
    $(".loader2").css("display", "block");
}
/*Close loader*/
function closeloadgraphreport2() {
    $(".loader2").css("display", "none");
}
function openloadgraphreport3() {
    $(".loader3").css("display", "block");
}
/*Close loader*/
function closeloadgraphreport3() {
    $(".loader3").css("display", "none");
}

function openloadgraphreport4() {
    $(".loader4").css("display", "block");
}
/*Close loader*/
function closeloadgraphreport4() {
    $(".loader4").css("display", "none");
}
function openloadgraphreport5() {
    $(".loader5").css("display", "block");
}
/*Close loader*/
function closeloadgraphreport5() {
    $(".loader5").css("display", "none");
}
function openloadgraphreport6() {
    $(".loader6").css("display", "block");
}
/*Close loader*/
function closeloadgraphreport6() {
    $(".loader6").css("display", "none");
}
function openloadgraphreport7() {
    $(".loader7").css("display", "block");
}
/*Close loader*/
function closeloadgraphreport7() {
    $(".loader7").css("display", "none");
}

