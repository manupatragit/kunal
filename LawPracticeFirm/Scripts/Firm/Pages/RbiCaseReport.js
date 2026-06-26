var fcode = localStorage.getItem("FirmCode");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {
    var count = 0; 
    var location = "", department = "", subCourt = "", status = "", nexthearingdatefrm = "", nexthearingdateTo = "", nexthearing = "", typeFlag="";
    var locationExp = "", departmentExp = "", subCourtExp = "", statusExp = "", nexthearingdatefrmExp = "", nexthearingdateToExp = "", typeFlagExp="";
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
        GetChartData("", "", "", "", "", "","");

    });
    //Clear All Graph value
    function ClearAllGraph() {
        Courtstatuschart.destroy();
        zonechart.destroy();
        AllCourtChart.destroy();
        Againstbythechart.destroy();
    }
    //$('#downloadPPT').click(function () {
    //    // Get the chart canvas
    //    var canvas = document.getElementById('chart-area-contested');

    //    // Convert the canvas to an image
    //    var image = canvas.toDataURL("image/png");

    //    // Create a new PowerPoint presentation
    //    var pptx = new PptxGenJS();

    //    // Add a slide
    //    var slide = pptx.addSlide();

    //    // Add the chart image to the slide
    //    slide.addImage({ data: image, x: 1, y: 1, w: 8, h: 4.5 });

    //    // Save the PowerPoint file
    //    pptx.writeFile({ fileName: 'ChartPresentation.pptx' });
    //});


    $('#downloadPPT').click(function () {
        // Create a new PowerPoint presentation
        var pptx = new PptxGenJS();

        // Function to add a chart to a slide
        function addChartToSlide(canvasId, slideTitle) {
            var canvas = document.getElementById(canvasId);
            if (canvas) {
                var image = canvas.toDataURL("image/png"); // Convert canvas to image
                var slide = pptx.addSlide(); // Add a new slide
                slide.addText(slideTitle, { x: 1, y: 0.5, fontSize: 18, bold: true }); // Add a title
                slide.addImage({ data: image, x: 1, y: 1, w: 8, h: 4.5 }); // Add the chart image
            } else {
            }
        }

        // Function to add a table to a slide
        function addTableToSlide(tableId, slideTitle) {
            var table = document.getElementById(tableId).closest('table'); // Get the full table
            if (table) {
                var tableData = [];

                // Extract table headers from <thead>
                var thead = table.querySelector('thead');
                if (thead) {
                    var headerRow = thead.querySelector('tr');
                    if (headerRow) {
                        var headers = [];
                        var headerCells = headerRow.querySelectorAll('th');
                        for (var i = 0; i < headerCells.length; i++) {
                            headers.push(headerCells[i].innerText.trim());
                        }
                        tableData.push(headers); // Add headers to table data
                    }
                }

                // Extract table rows from <tbody>
                var tbody = table.querySelector('tbody');
                if (tbody) {
                    var rows = tbody.querySelectorAll('tr');
                    for (var i = 0; i < rows.length; i++) {
                        var rowData = [];
                        var cells = rows[i].querySelectorAll('td');
                        for (var j = 0; j < cells.length; j++) {
                            // Extract text content from <td> (ignore <a> tags)
                            var cellContent = cells[j].innerText.trim();
                            rowData.push(cellContent);
                        }
                        tableData.push(rowData); // Add row data to table data
                    }
                }

                // Add a new slide with the table
                var slide = pptx.addSlide();
                slide.addText(slideTitle, { x: 1, y: 0.5, fontSize: 18, bold: true }); // Add a title
                slide.addTable(tableData, { x: 1, y: 1, w: 8, colW: [6, 2], fontSize: 12 }); // Add the table
            } else {
                console.error(`Table with ID "${tableId}" not found.`);
            }
        }

        // Add each chart to the presentation
        addChartToSlide('chart-area-contested', 'Contested/Non-Contested');
        addChartToSlide('chart-area-location', 'Location');
        addChartToSlide('chart-area-subCourt', 'Sub-Court');
        addChartToSlide('chart-area-department', 'Department');

        // Add the table to the presentation
        addTableToSlide('tblbodyCourtType', 'Court Cases Count');

        // Save the PowerPoint file
        pptx.writeFile({ fileName: 'CaseWiseReport.pptx' });
    });

    //For NextHearing Search
    $(document).on('click', '#Grphsearchnexthering', function () {

        nexthearingdatefrm = $("#grphhearingfrom").val();
        nexthearingdateTo = $("#grphhearingto").val();
        typeFlag = $("input[name='filterType']:checked").val();
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
        GetChartData(status, location, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);

    });
    //Graph Clear data
    $(document).on('click', '#Grphclearnextdate', function () {
        $("#grphhearingfrom").val('');
        $("#grphhearingto").val('');
        ClearAllGraph();
        GetChartData("", "", "", "", "","","");
    });
    //For Binding the date on click event
    function GetChartData(status, location, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag) {
        pageindex = 1;
            pagesize = 10;
        AllCaseCountByZone(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
        FillCustomlocationTypeChart(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
        FillCourtStatusChartFront(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
        GetMatterDepartmentCount(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
        AllMatterByNextHearingWise(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
        GetMatterSubCourtCount(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
        GetMatterList(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);

        locationExp = location;
        departmentExp = department;
        subCourtExp = subCourt;
        statusExp = status;
        nexthearingdatefrmExp = nexthearingdatefrm;
        nexthearingdateToExp = nexthearingdateTo;
        typeFlagExp = typeFlag;

    }


    //Prem Development
    AllCaseCountByZone(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
    FillCustomlocationTypeChart(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
    FillCourtStatusChartFront(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
    GetMatterDepartmentCount(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
    AllMatterByNextHearingWise(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
    GetMatterSubCourtCount(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
    GetMatterList(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag);
    function GetMatterSubCourtCount(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag) {
        var statusname = [];
        var statuscount = [];
        var html1 = '';
        $("#bindcourtwisestatus").html("");
        var formData = new FormData();
        formData.append("location", location);
        formData.append("status", status);
        formData.append("department", department);
        formData.append("subCourt", subCourt);
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("typeFlag", typeFlag);

        openloadgraphreport4();
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/CustomSubcourt",
            dataType: 'json',
            data: formData,
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
                        if (value.subcourt == "" || value.subcourt == null || value.subcourt == "null") {
                        }
                        else {
                            statusname.push(value.subcourt);
                            statuscount.push(value.Total);
                            //html += '<tr><td>' + value.Court + '</td><td><p>' + value.Totals + '</p></td></tr>'
                        }
                    });
                    $.each(obj1, function (i, a) {
                        count += 1;
                        html1 += "<tr>"
                        html1 += "<td><span style='cursor:pointer;font-size:14px !important' id='viewcourtdetails' Idss='" + a.subcourt + "'>" + a.subcourt + "</span></td>"
                        html1 += "<td><p>" + a.Total + "</p></td>"
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
        var chartDiv = $("#chart-area-subCourt");
        AllCourtChart = new Chart(chartDiv, {
            type: 'pie',
            data: {
                labels: statusname,
                datasets: [
                    {
                        data: statuscount,
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
                    var tempsubCourt = this.getElementsAtEvent(e)[0]._model.label;
                    subCourt = tempsubCourt;
                    ClearAllGraph();
                    AllCourtChart.destroy();
                    GetChartData(status, location, department, subCourt, nexthearingdatefrm, nexthearingdateTo);
                    //alert(activePointLabel);
                }
            }

        });
        closeloadgraphreport4();
    }
    function FillCustomlocationTypeChart(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo,typeFlag) {
        var NoticeStatusarray = [];
        var NoticeStatusvaluearray = [];
        $("#bindzonewisestatus").html("");
        var html1 = "";
        var formData = new FormData();
        formData.append("location", location);
        formData.append("status", status);
        formData.append("department", department);
        formData.append("subCourt", subCourt);
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("typeFlag", typeFlag);


        openloadgraphreport3();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CustomLocation",
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
                        NoticeStatusarray.push(a.Location);
                        NoticeStatusvaluearray.push(a.Total);
                    });
                    zonechart = new Chart(document.getElementById("chart-area-location"), {
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
                                location = this.getElementsAtEvent(e)[0]._model.label;
                                ClearAllGraph();
                                zonechart.destroy();
                                GetChartData(status, location, department, subCourt, nexthearingdatefrm, nexthearingdateTo);
                         }
                        }
                    });

                    $.each(obj, function (i, a) {
                        html1 += "<tr>"
                        html1 += "<td><span style='cursor:pointer;font-size:14px !important' title='click here to view matters' id='viewzonedetails'  type='status' value='" + a.Location + "'>" + a.Location + "</span></td>"
                        html1 += "<td><p>" + a.Total + "</p></td>"
                        html1 += "</tr>"
                    });
                    $("#bindzonewisestatus").append(html1);
                    closeloadgraphreport3();
                }
                closeloadgraphreport3();
            },
            error: function (response1) {
                closeloadgraphreport3();
            }
        });
    }
    function FillCourtStatusChartFront(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo,typeFlag) {
        var NoticeStatusarray = [];
        var NoticeStatusvaluearray = [];
        $("#bindCourtchartstatus").html("");
        var html1 = "";
        var formData = new FormData();
        formData.append("location", location);
        formData.append("status", status);
        formData.append("department", department);
        formData.append("subCourt", subCourt);
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("typeFlag", typeFlag);

        openloadgraphreport2();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/AllCourtCaseContestedChart",
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
                    Courtstatuschart = new Chart(document.getElementById("chart-area-contested"), {
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
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true // ✅ Ensures the y-axis starts from 0
                                    }
                                }]
                            },
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
                                status = courtstatus;
                                ClearAllGraph();
                                Courtstatuschart.destroy();
                                GetChartData(status, location, department, subCourt, nexthearingdatefrm, nexthearingdateTo);
                            }
                        }
                    });
                    $.each(obj, function (i, a) {
                        count += 1;
                        html1 += "<tr>"
                        html1 += "<td><span id='linktomatterCaseStatus' style='cursor:pointer;font-size:14px !important' title='click here to view matters'  type='Courtstatus' value='" + a.Type + "'>" + a.CaseStatus + "</span></td>"
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
    function GetMatterDepartmentCount(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo,typeFlag) {
        var partykeyword = ""
        var NoticeStatusarray = [];
        var NoticeStatusvaluearray = [];
        $("#bindAgaintBythe").html("");
        var html1 = "";
        var formData = new FormData();
        formData.append("location", location);
        formData.append("status", status);
        formData.append("department", department);
        formData.append("subCourt", subCourt);
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("typeFlag", typeFlag);

        openloadgraphreport5();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CustomDepartment",
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
                        NoticeStatusarray.push(a.department);
                        NoticeStatusvaluearray.push(a.Total);
                    });
                    //chart1.destroy();
                    Againstbythechart = new Chart(document.getElementById("chart-area-department"), {
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
                                var tempdepartment = this.getElementsAtEvent(e)[0]._model.label;
                                department = tempdepartment;
                                ClearAllGraph();
                                Againstbythechart.destroy();
                                GetChartData(status, location, department, subCourt, nexthearingdatefrm, nexthearingdateTo);
                            }
                        }
                    });
                    $.each(obj, function (i, a) {
                        count += 1;
                        html1 += "<tr>"
                        html1 += "<td><span  style='cursor:pointer;font-size:14px !important' Id='IdAgainstdta' idss='" + a.department + "'   type='Courtstatus'>" + a.department + "</span></td>"
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
    function AllCaseCountByZone(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag) {
        var formData = new FormData();
        formData.append("location", location);
        formData.append("status", status);
        formData.append("department", department);
        formData.append("subCourt", subCourt);
        formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("typeFlag", typeFlag);

        openloadgraphreport1();
        $("#lblmattercountcountbyzone").val('');
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllMatterCountRbi",
            dataType: 'json',
            data: formData,
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


    function AllMatterByNextHearingWise(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag) {
         var formData = new FormData();
         formData.append("location", location);
         formData.append("status", status);
         formData.append("department", department);
         formData.append("subCourt", subCourt);
         formData.append("Nexthearing", nexthearingdatefrm);
        formData.append("Nexthearingto", nexthearingdateTo);
        formData.append("typeFlag", typeFlag);

        var html1 = '';
        var subcourtcount = 0;
        openloadgraphreport6();
        $("#tblbodyCourtType").html("");
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllMatterCountNextHearing",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                } else {

                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        subcourtcount += 1;
                        html1 += "<tr>"
                        html1 += "<td><p>" + a.Nexthearing + "</p></td>"
                        html1 += "<td><a style='color:#0059c1;'id='transfersubcourt' href='javascript:void()' sno= '" + a.Nexthearing + "' > " + a.Total + "</a ></td>";
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

    //For Binding the court details
    $(document).on("click", "#transfersubcourt", function () {
        var token = $(this).attr("sno");
        nexthearing = token;
        GetCourtDataOnHearing(token);
        //alert(token); 
    });

    function GetCourtDataOnHearing(token) {
      //  location = "", department = "", subCourt = "", status = "", nexthearingdatefrm = "", nexthearingdateTo = "", nexthearing = "";
        var formdata = new FormData();
         formdata.append("Nexthearing", token);
        formdata.append("location", locationExp);
        formdata.append("status", statusExp);
        formdata.append("department", departmentExp);
        formdata.append("subCourt", subCourtExp);
        var html1 = '';
        $("#bindcourtname").html("");
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllMatterCountNextHearingTabularData",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                if (response.Data == "") {
                } else {
                    $("#myModalNextHearingCases").modal({ show: true });
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
                        html1 += "<td><p>" + a.OtherCourtName + "</p></td>"
                        html1 += "<td><p>" + a.CourtComplex + "</p></td>"                      
                        html1 += "<td><p>" + a.MatterName + "</p></td>";
                        html1 += "<td><p>" + a.CaseNo + "</p></td>";
                        html1 += "<td><p>" + a.contested + "</p></td>";
                        html1 += "<td><p>" + a.location + "</p></td>";
                        html1 += "<td><p>" + a.department + "</p></td>";
                        html1 += "<td><p>" + a.Nexthearingdate + "</p></td>";
                        html1 += "<td><p>" + a.dFilingDate + "</p></td>";
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


    $(document).on("click", "#caseExportNextHearing", function () {


        window.location = `/firm/ExporCourtComplexCustomReportRBI?nextHearing=${encodeURIComponent(nexthearing)}&location=${encodeURIComponent(locationExp)}&status=${encodeURIComponent(statusExp)}&department=${encodeURIComponent(departmentExp)}&subCourt=${encodeURIComponent(subCourtExp)}`;

    });
    $(document).on("click", "#IdExcelExport", function () {

        window.location = `/firm/ExportTotalcaseCustomReportRBI?Nexthearing=${encodeURIComponent(nexthearingdatefrmExp)}&Nexthearingto=${encodeURIComponent(nexthearingdateToExp)}&location=${encodeURIComponent(locationExp)}&status=${encodeURIComponent(statusExp)}&department=${encodeURIComponent(departmentExp)}&subCourt=${encodeURIComponent(subCourtExp)}&typeFlag=${encodeURIComponent(typeFlagExp)}`;

    });

    function GetMatterList(location, status, department, subCourt, nexthearingdatefrm, nexthearingdateTo, typeFlag) {
        $.ajax({
            type: "POST",
            url: "/api/MatterApi/AllMatterList",
            data: {
                location: location,
                status: status,
                department: department,
                subCourt: subCourt,
                Nexthearing: nexthearingdatefrm,
                Nexthearingto: nexthearingdateTo,
                typeFlag: typeFlag,
                pageNo: pageindex,
                pageSize: pagesize
            },

            success: function (response) {
                var obj = JSON.parse(response.Data);
                var htmls = '';
                if (obj.length > 0) {
                    $.each(obj, function (index, value) {

                        //if (index === 0) {

                        //    firstvalue = value.rownum;

                        //}
                        if (index === (length - 3)) {
                            var pnext = pageindex;
                            var pprev = pageindex;
                            var pageno = pageindex;

                            var totdata = value.TotalRecord;
                            var totpage = 0;
                            if (value.TotalRecord > 0) {
                                pnext = parseInt(pnext) + 1;
                                if (pnext == 0) pnext = 1;

                                pprev = parseInt(pageno) - 1;
                                if (pprev == 0) pprev = 1;
                                totpage = parseInt(totdata) / parseInt(pagesize);

                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }

                                $("#pagnumvalue").val(totpage);

                            }

                            var tfot = '';
                            $("#exportrecords").val(value.TotalRecord);
                            tfot += '<div><div class="col-md-6"><ul>'
                            tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                            if (value.TotalRecord <= length) {

                            }
                            else if (pageno == 1) {

                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'

                            }

                            else {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                            }

                            if (pageno < totpage) {
                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'

                            }


                            tfot += '</ul></div>'
                            $("#ptfooter").html("");
                            $("#ptfooter").html(tfot);
                        }


                        htmls += '<tr>' +
                            '<td>' + value.MatterName + '</td>' +
                            '<td>' + value.CaseNo + '</td>' +
                            '<td>' + value.OtherCourtName + '</td>' +
                            '<td>' + value.Nexthearingdate + '</td>' +
                            '<td>' + value.dFilingDate + '</td> </tr>';
 
                    });

                    $('#tblbodyMatterList').html(htmls);
                    closeloadgraphreport7();

                } else {
                    $("#ptfooter").html("");
                    htmls += '<tr>' +
                        '<td colspan="7" style="text-align: center;">Data Not Found</td>' +
                        '</tr>';

                    $('#tblbodyMatterList').html(htmls);
                    closeloadgraphreport7();
                }
                //EditPermission();

            },
            error: function (error) {
                closeloadgraphreport7();

            }
        });

        return false;
    }


    $(document).on('click', '#getdatabypagenumNext', function () {
        if (pageindex != "undefined") {
            pageindex = pageindex + 1;
            GetMatterList(locationExp, statusExp, departmentExp, subCourtExp, nexthearingdatefrmExp, nexthearingdateToExp, typeFlagExp);
        }
        else {
            alert("Please enter a valid page number.");
            closeload();
            return false;
        }
    });

    $(document).on('click', '#getdatabypagenumPrev', function () {
        if (pageindex != "undefined") {
            pageindex = pageindex - 1;
            GetMatterList(locationExp, statusExp, departmentExp, subCourtExp, nexthearingdatefrmExp, nexthearingdateToExp, typeFlagExp);
        }
        else {
            alert("Please enter a valid page number.");
            closeload();
            return false;
        }
    });
    //Pagination Section Start for table 
    //Pagination Section Start for table
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            pageindex = parseInt(ppageindex, 10);
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();

                if (ppageindex <= parseInt(ppageindesx)) {
                    GetMatterList(locationExp, statusExp, departmentExp, subCourtExp, nexthearingdatefrmExp, nexthearingdateToExp, typeFlagExp);
                }
                else {
                    alert("Please enter a valid page number.");
                    return false;
                }
            }
        }
    });
//End Prem Developmentt



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

