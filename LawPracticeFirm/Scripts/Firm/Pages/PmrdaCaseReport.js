var fcode = localStorage.getItem("FirmCode");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var courtChart = null;
$(document).ready(function () {
    GetChartData("","","","");
    var courtChart = null; // global ref so we can destroy/redraw
    LoadCourtDropdown();
    LoadStatusDropdown();
    LoadAdvocateDropdown();
    function LoadCourtDropdown() {
        // clear existing except the first "All"
        var $ddl = $("#compCourt");
        $ddl.empty();
        $ddl.append('<option value="">All</option>');

        $.ajax({
            type: "POST", // or GET if your API is GET, change if needed
            url: "/api/MatterApi/IprdaGrahDataCourtList",
            contentType: false,
            processData: false,
            success: function (response) {
                // expecting something like { Data: "[{ \"CourtName\":\"SUPREME COURT\"}, ...]" }
                if (!response || !response.Data) {
                    console.warn("No court list data");
                    return;
                }

                var list;
                try {
                    list = JSON.parse(response.Data) || [];
                } catch (err) {
                    console.error("Failed to parse court list Data", err);
                    list = [];
                }

                // build <option> for each court
                $.each(list, function (i, row) {
                    var court = (row.CourtName || "").trim();
                    if (court !== "") {
                        // value and text are same
                        $ddl.append(
                            '<option value="' + court + '">' + court + '</option>'
                        );
                    }
                });
            },
            error: function (xhr, status, err) {
                console.error("Error loading court list", err);
            }
        });
    }
    function LoadStatusDropdown() {
        // clear existing except the first "All"
        var $ddl = $("#CaseStatus");
        $ddl.empty();
        $ddl.append('<option value="">All</option>');

        $.ajax({
            type: "POST", // or GET if your API is GET, change if needed
            url: "/api/MatterApi/IprdaGrahDatastatusList",
            contentType: false,
            processData: false,
            success: function (response) {
                // expecting something like { Data: "[{ \"CourtName\":\"SUPREME COURT\"}, ...]" }
                if (!response || !response.Data) {
                    console.warn("No Status list data");
                    return;
                }

                var list;
                try {
                    list = JSON.parse(response.Data) || [];
                } catch (err) {
                    console.error("Failed to parse status list Data", err);
                    list = [];
                }

                // build <option> for each court
                $.each(list, function (i, row) {
                    var vstatus = (row.vstatus || "").trim();
                    if (vstatus !== "") {
                        // value and text are same
                        $ddl.append(
                            '<option value="' + vstatus + '">' + vstatus + '</option>'
                        );
                    }
                });
            },
            error: function (xhr, status, err) {
                console.error("Error loading court list", err);
            }
        });
    }
    function LoadAdvocateDropdown() {
        // clear existing except the first "All"
        var $ddl = $("#compAdvocate");
        $ddl.empty();
        $ddl.append('<option value="">All</option>');

        $.ajax({
            type: "POST", // or GET if your API is GET, change if needed
            url: "/api/MatterApi/IprdaGrahDataAdvocateList",
            contentType: false,
            processData: false,
            success: function (response) {
                if (!response || !response.Data) {
                    console.warn("No Status list data");
                    return;
                }

                var list;
                try {
                    list = JSON.parse(response.Data) || [];
                } catch (err) {
                    console.error("Failed to parse status list Data", err);
                    list = [];
                }

                // build <option> for each court
                $.each(list, function (i, row) {
                    var AdvocateName = (row.AdvocateName || "").trim();
                    if (AdvocateName !== "") {
                        // value and text are same
                        $ddl.append(
                            '<option value="' + AdvocateName + '">' + AdvocateName + '</option>'
                        );
                    }
                });
            },
            error: function (xhr, status, err) {
                console.error("Error loading court list", err);
            }
        });
    }

    $(document).on('click', '#GrphsearchResult', function () {

        SearchFilterData();

    });
    $(document).on('click', '#GrphsearchResultClear', function () {

        ResetFilter();

    });

    function SearchFilterData() {
        var filterCourtName = $("#compCourt").val();
        var filterDepartment = $("#compDepart").val();
        var filterAdvocate = $("#compAdvocate").val();
        var filterStatus = $("#CaseStatus").val();
        GetChartData(filterCourtName, filterStatus, filterDepartment, filterAdvocate);
    }
    function ResetFilter() {
        $("#compCourt").val("");
         $("#compDepart").val("");
        $("#compAdvocate").val("");
       $("#CaseStatus").val("");
        GetChartData("", "", "", "");

    }
    // keep a handle so we can destroy/redraw the status chart
    function GetChartData(filterCourtName, filterStatus, filterDepartment, filterAdvocate) {
        courtWiseData(filterCourtName, filterStatus, filterDepartment, filterAdvocate);
        StatusWiseData(filterCourtName, filterStatus, filterDepartment, filterAdvocate);
        TotalcountData(filterCourtName, filterStatus, filterDepartment, filterAdvocate);
        AdvocateWiseStatusData(filterCourtName, filterStatus, filterDepartment, filterAdvocate);
        LoadStatusSummary(filterCourtName, filterStatus, filterDepartment, filterAdvocate);
        DepartmentWiseData(filterCourtName, filterStatus, filterDepartment, filterAdvocate);
    }

    function courtWiseData(filterCourtName, filterStatus, filterDepartment, filterAdvocate) {

        var formData = new FormData();
        formData.append("filterCourtName", filterCourtName || "");
        formData.append("filterStatus", filterStatus || "");
        formData.append("filterDepartment", filterDepartment || "");
        formData.append("filterAdvocate", filterAdvocate || "");

        $.ajax({
            type: "POST",
            url: "/api/MatterApi/IprdaGrahDataCourtWise", // this should call proc that returns court-wise data
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {

                if (!response1 || !response1.Data) return;

                // Expecting: [ {Label:"SUPREME COURT", Cnt:126}, ... ]
                var courtArray;
                try {
                    courtArray = JSON.parse(response1.Data) || [];
                } catch (e) {
                    console.error("Cannot parse response1.Data", e);
                    courtArray = [];
                }

                // ---------------------------
                // Build COURT WISE LIST (left card content with mini bars)
                // ---------------------------

                var maxCnt = 0;
                $.each(courtArray, function (i, row) {
                    var v = parseInt(row.Cnt || 0, 10);
                    if (v > maxCnt) maxCnt = v;
                });
                if (maxCnt === 0) maxCnt = 1;

                var htmlCourtList = "";
                $.each(courtArray, function (i, row) {
                    var fullName = row.Label || "N/A";
                    var cnt = parseInt(row.Cnt || 0, 10);

                    // trim long court names to keep UI neat
                    var shortName = fullName.length > 60
                        ? (fullName.substring(0, 60) + "…")
                        : fullName;

                    var pct = (cnt / maxCnt) * 100;

                    htmlCourtList += `
                    <div class="court-row"
                         style="margin-bottom:8px;
                                font-size:14px;
                                line-height:1.4;
                                color:#000;
                                border-bottom:1px solid #e5e5e5;
                                padding-bottom:6px;">

                        <div style="display:flex;
                                    justify-content:space-between;
                                    align-items:flex-start;">
                            <div style="flex:1;
                                        padding-right:8px;
                                        font-weight:500;">
                                ${shortName}
                            </div>
                            <div style="white-space:nowrap;
                                        font-weight:bold;
                                        font-size:14px;">
                                ${cnt}
                            </div>
                        </div>

                        <div style="background:#eee;
                                    height:6px;
                                    border-radius:3px;
                                    margin-top:4px;">
                            <div style="
                                width:${pct}%;
                                max-width:100%;
                                background:#A0D930;
                                height:6px;
                                border-radius:3px;">
                            </div>
                        </div>
                    </div>
                `;
                });

                // inject scroll list
                $("#court-list").html(htmlCourtList);

                // ---------------------------
                // Build TABLE on back side
                // ---------------------------

                var courtTableHtml = "";
                $.each(courtArray, function (i, row) {
                    courtTableHtml += "<tr>" +
                        "<td>" + (row.Label || "N/A") + "</td>" +
                        "<td>" + (row.Cnt || 0) + "</td>" +
                        "</tr>";
                });

                $("#bindCourtTableBody").html(courtTableHtml);
            }
        });
    }


    var statusPieChart = null;

    function StatusWiseData(filterCourtName, filterStatus, filterDepartment, filterAdvocate) {

        var formData = new FormData();
        formData.append("filterCourtName", filterCourtName || "");
        formData.append("filterStatus", filterStatus || "");
        formData.append("filterDepartment", filterDepartment || "");
        formData.append("filterAdvocate", filterAdvocate || "");

        $.ajax({
            type: "POST",
            url: "/api/MatterApi/IprdaGrahDataStatusWise", // should return status-wise data
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {

                if (!response1 || !response1.Data) return;

                // Expecting something like:
                // [ { "Label": "Pending", "Cnt": 120 }, { "Label": "Disposed", "Cnt": 40 }, ... ]
                var statusArray;
                try {
                    statusArray = JSON.parse(response1.Data) || [];
                } catch (e) {
                    console.error("Cannot parse response1.Data", e);
                    statusArray = [];
                }

                // ============================
                // 1. Build table rows (back side)
                // ============================

                var tblHtml = "";
                $.each(statusArray, function (i, row) {
                    tblHtml += "<tr>" +
                        "<td>" + (row.Label || "N/A") + "</td>" +
                        "<td>" + (row.Cnt || 0) + "</td>" +
                        "</tr>";
                });
                $("#bindStatusTableBody").html(tblHtml);


                // ============================
                // 2. Build pie chart (front side)
                // ============================

                // labels = status names, data = counts
                var pieLabels = [];
                var pieValues = [];
                $.each(statusArray, function (i, row) {
                    pieLabels.push(row.Label || "N/A");
                    pieValues.push(parseInt(row.Cnt || 0, 10));
                });

                // palette (re-use your color set)
                var pieColors = [
                    "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F",
                    "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"
                ];

                // kill old chart instance if exists
                if (statusPieChart) {
                    statusPieChart.destroy();
                }

                var ctx = document.getElementById("status-chart").getContext("2d");

                statusPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: pieLabels,
                        datasets: [{
                            data: pieValues,
                            backgroundColor: pieColors.slice(0, pieValues.length),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false // you can flip this to true if you want the legend
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    var idx = tooltipItem.index;
                                    var label = data.labels[idx] || "N/A";
                                    var val = data.datasets[0].data[idx] || 0;
                                    return label + ": " + val + " cases";
                                }
                            }
                        }
                    }
                });

            }
        });
    }

    //Bind count 
    function TotalcountData(filterCourtName, filterStatus, filterDepartment, filterAdvocate) {

        var formData = new FormData();
        formData.append("filterCourtName", filterCourtName || "");
        formData.append("filterStatus", filterStatus || "");
        formData.append("filterDepartment", filterDepartment || "");
        formData.append("filterAdvocate", filterAdvocate || "");

        $.ajax({
            type: "POST",
            url: "/api/MatterApi/IprdaGrahDataTotalCount",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {

                // expecting response1.Data like:
                // '[{"TotalCount":123}]' OR '[{"Cnt":123}]'
                if (!response1 || !response1.Data) {
                    $("#lblmattercountcountbyzone").text("0");
                    return;
                }

                var arr;
                try {
                    arr = JSON.parse(response1.Data) || [];
                } catch (e) {
                    console.error("Cannot parse total count response", e);
                    arr = [];
                }

                // try common field names
                var totalVal = 0;
                if (arr.length > 0) {
                    if (arr[0].TotalCount !== undefined && arr[0].TotalCount !== null) {
                        totalVal = parseInt(arr[0].TotalCount, 10) || 0;
                    } else if (arr[0].Cnt !== undefined && arr[0].Cnt !== null) {
                        totalVal = parseInt(arr[0].Cnt, 10) || 0;
                    }
                }

                $("#lblmattercountcountbyzone").text(totalVal);
            },
            error: function () {
                // fallback if API fails
                $("#lblmattercountcountbyzone").text("0");
            }
        });
    }
    var advocateChart = null;

    function AdvocateWiseStatusData(filterCourtName, filterStatus, filterDepartment, filterAdvocate) {

        var formData = new FormData();
        formData.append("filterCourtName", filterCourtName || "");
        formData.append("filterStatus", filterStatus || "");
        formData.append("filterDepartment", filterDepartment || "");
        formData.append("filterAdvocate", filterAdvocate || "");

        $.ajax({
            type: "POST",
            url: "/api/MatterApi/IprdaGrahDataAdvocateWiseStatusData",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {

                if (!response1 || !response1.Data) {
                    console.warn("No advocate data");
                    return;
                }

                var rawRows;
                try {
                    rawRows = JSON.parse(response1.Data) || [];
                } catch (e) {
                    console.error("Cannot parse advocate status matrix", e);
                    rawRows = [];
                }

                // Build advMap and statusBuckets:
                // advMap = {
                //    "Adv 1": { total: 10, "Live": 4, "Disposed": 6, ... },
                //    "Adv 2": { total: 5,  "Live": 2, "Disposed": 3, ... }
                // }
                // statusBuckets = ["Live","Disposed",...]
                var advMap = {};
                var statusBuckets = [];

                rawRows.forEach(function (row) {
                    var adv = (row.AdvocateLabel || "N/A").trim();
                    var st = (row.StatusLabel || "N/A").trim();
                    var cnt = parseInt(row.Cnt || 0, 10);

                    if (!advMap[adv]) {
                        advMap[adv] = { total: 0 };
                    }
                    if (advMap[adv][st] == null) {
                        advMap[adv][st] = 0;
                    }

                    if (!isNaN(cnt)) {
                        advMap[adv][st] += cnt;
                        advMap[adv].total += cnt;
                    }

                    if (statusBuckets.indexOf(st) === -1) {
                        statusBuckets.push(st);
                    }
                });

                // Sort advocates by total desc
                var sortedAdv = Object.keys(advMap).sort(function (a, b) {
                    return (advMap[b].total || 0) - (advMap[a].total || 0);
                });

                // We'll render all
                var yLabels = sortedAdv;

                // Build stacked datasets (one per status)
                var palette = [
                    "#4D95DD", "#00B050", "#002060", "#FF6633", "#9FD8FF",
                    "#707070", "#FFB399", "#33FFCC", "#E6B333", "#3366E6"
                ];

                var datasets = statusBuckets.map(function (bucketName, idx) {
                    var color = palette[idx % palette.length];
                    return {
                        label: bucketName,
                        backgroundColor: color,
                        data: yLabels.map(function (adv) {
                            return advMap[adv][bucketName] || 0;
                        })
                    };
                });

                // ==== FRONT CARD GRAPH =================================================

                if (window.advocateChart) {
                    window.advocateChart.destroy();
                }

                var ctx = document.getElementById("advocate-chart").getContext("2d");

                window.advocateChart = new Chart(ctx, {
                    type: 'horizontalBar',
                    data: {
                        labels: yLabels,     // advocates down the Y axis
                        datasets: datasets   // one stacked bar segment per status bucket
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,

                        // no built-in legend in the chart area
                        legend: { display: false },

                        tooltips: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                // tooltip still useful on hover
                                footer: function (tooltipItems, data) {
                                    var idx = tooltipItems[0].index;
                                    var total = 0;
                                    for (var di = 0; di < data.datasets.length; di++) {
                                        total += data.datasets[di].data[idx] || 0;
                                    }
                                    return "Total: " + total;
                                }
                            }
                        },

                        scales: {
                            xAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                    precision: 0
                                },
                                gridLines: {
                                    color: "rgba(0,0,0,0.1)"
                                }
                            }],
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                    fontSize: 11,
                                    fontColor: "#000",
                                    callback: function (value) {
                                        // trim super long advocate names in axis
                                        return value.length > 20
                                            ? value.substring(0, 20) + "…"
                                            : value;
                                    }
                                },
                                gridLines: { display: false }
                            }]
                        },

                        animation: {
                            duration: 300,
                            onComplete: function () {
                                // draw TOTAL at end of each row,
                                // even for rows with only tiny bars
                                var chartInstance = this.chart;
                                var ctx2 = chartInstance.ctx;

                                ctx2.save();
                                ctx2.font = "bold 11px sans-serif";
                                ctx2.fillStyle = "#000";
                                ctx2.textBaseline = "middle";
                                ctx2.textAlign = "left";

                                for (var i = 0; i < yLabels.length; i++) {
                                    var advName = yLabels[i];
                                    var totalVal = advMap[advName].total || 0;

                                    // figure out pixel x/y where the stacked bar ends
                                    var maxX = null;
                                    var midY = null;

                                    for (var di = 0; di < datasets.length; di++) {
                                        var meta = chartInstance.controller.getDatasetMeta(di);
                                        var barEl = meta.data[i];
                                        if (!barEl || !barEl._model) continue;

                                        // only consider if this segment actually has >0
                                        var thisSegmentVal = datasets[di].data[i] || 0;
                                        if (thisSegmentVal > 0) {
                                            var x = barEl._model.x;
                                            var y = barEl._model.y;
                                            if (maxX === null || x > maxX) {
                                                maxX = x;
                                                midY = y;
                                            }
                                        }
                                    }

                                    // fallback if row is all zero (rare)
                                    if (maxX === null) {
                                        var lastMeta = chartInstance.controller.getDatasetMeta(datasets.length - 1);
                                        var fb = lastMeta.data[i];
                                        if (fb && fb._model) {
                                            maxX = fb._model.x;
                                            midY = fb._model.y;
                                        }
                                    }

                                    if (maxX !== null && midY !== null) {
                                        ctx2.fillText(totalVal, maxX + 5, midY);
                                    }
                                }

                                ctx2.restore();
                            }
                        }
                    }
                });

                // ==== BACK SIDE TABLE =================================================
                // We rebuild the header row and body rows now.

                // Header row:
                // | Advocate | <Status1> | <Status2> | ... | Total |
                var headHtml = "<th><div class='thbg'>Advocate</div></th>";
                statusBuckets.forEach(function (bucketName) {
                    headHtml += "<th><div class='thbg'>" + bucketName + "</div></th>";
                });
                headHtml += "<th><div class='thbg'>Total</div></th>";
                $("#adv-head-row").html(headHtml);

                // Body rows:
                // each advocate: adv | count(status1) | count(status2) | ... | total
                var bodyHtml = "";
                yLabels.forEach(function (adv) {
                    bodyHtml += "<tr>";
                    bodyHtml += "<td>" + adv + "</td>";

                    statusBuckets.forEach(function (bucketName) {
                        bodyHtml += "<td>" + (advMap[adv][bucketName] || 0) + "</td>";
                    });

                    bodyHtml += "<td>" + (advMap[adv].total || 0) + "</td>";
                    bodyHtml += "</tr>";
                });

                $("#bindAdvocateTableBody").html(bodyHtml);

                // NOTE: we are NOT rebuilding the legend on the front
                // on purpose, since you asked to hide those colored labels.
            }
        });
    }
    function LoadStatusSummary(filterCourtName, filterStatus, filterDepartment, filterAdvocate) {

        var formData = new FormData();
        formData.append("filterCourtName", filterCourtName || "");
        formData.append("filterStatus", filterStatus || "");
        formData.append("filterDepartment", filterDepartment || "");
        formData.append("filterAdvocate", filterAdvocate || "");

        $.ajax({
            type: "POST",
            url: "/api/MatterApi/IprdaGrahDataStatusData",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                // safety guards
                if (!response1 || !response1.Data) {
                    console.warn("No status summary data.");
                    $("#statusSummaryBody").html("");
                    $("#statusSummaryTotal").text("0");
                    return;
                }

                var rows;
                try {
                    // expecting something like:
                    // [ { "Label": "Live", "Cnt": 553 }, { "Label": "Disposed Of", "Cnt": 73 }, ... ]
                    rows = JSON.parse(response1.Data) || [];
                } catch (e) {
                    console.error("Failed to parse status summary data", e);
                    rows = [];
                }

                var bodyHtml = "";
                var grandTotal = 0;

                $.each(rows, function (i, r) {
                    var label = r.Label || "N/A";
                    var cnt = parseInt(r.Cnt || 0, 10);
                    if (isNaN(cnt)) cnt = 0;

                    grandTotal += cnt;

                    bodyHtml += `
                    <tr>
                        <td style="
                            border:1px solid #d2691e;
                            padding:6px 8px;
                            white-space:nowrap;">
                            ${label}
                        </td>
                        <td style="
                            border:1px solid #d2691e;
                            padding:6px 8px;
                            text-align:right;">
                            ${cnt}
                        </td>
                    </tr>
                `;
                });

                $("#statusSummaryBody").html(bodyHtml);
                $("#statusSummaryTotal").text(grandTotal);
            },
            error: function (xhr) {
                console.error("Status summary request failed", xhr);
                // clear UI on error
                $("#statusSummaryBody").html("");
                $("#statusSummaryTotal").text("0");
            }
        });
    }
    // keep a global ref so we can destroy on refresh
    var deptChart = null;

    function DepartmentWiseData(filterCourtName, filterStatus, filterDepartment, filterAdvocate) {

        var formData = new FormData();
        formData.append("filterCourtName", filterCourtName || "");
        formData.append("filterStatus", filterStatus || "");
        formData.append("filterDepartment", filterDepartment || "");
        formData.append("filterAdvocate", filterAdvocate || "");

        $.ajax({
            type: "POST",
            url: "/api/MatterApi/IprdaGrahDataDepartmentData",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {

                if (!response1 || !response1.Data) {
                    console.warn("No department data");
                    $("#bindDepartmentTableBody").html("");
                    if (deptChart) { deptChart.destroy(); deptChart = null; }
                    return;
                }

                var deptRows;
                try {
                    // expecting:
                    // [ { "Label": "L & E Dept", "Cnt": 233 }, { "Label": "Illegal Dept", "Cnt":178 }, ... ]
                    deptRows = JSON.parse(response1.Data) || [];
                } catch (e) {
                    console.error("Cannot parse department data", e);
                    deptRows = [];
                }

                // sort by count desc, just like screenshot: big bars first
                deptRows.sort(function (a, b) {
                    return (parseInt(b.Cnt || 0, 10)) - (parseInt(a.Cnt || 0, 10));
                });

                // -------------------------
                // BACK SIDE TABLE
                // -------------------------
                var tblHtml = "";
                $.each(deptRows, function (i, row) {
                    tblHtml += "<tr>" +
                        "<td>" + (row.Label || "N/A") + "</td>" +
                        "<td>" + (row.Cnt || 0) + "</td>" +
                        "</tr>";
                });
                $("#bindDepartmentTableBody").html(tblHtml);

                // -------------------------
                // FRONT SIDE CHART
                // We'll plot the full sorted list (or top N if you want)
                // -------------------------

                // Extract labels and values
                var labels = [];
                var values = [];
                $.each(deptRows, function (i, row) {
                    // Shorten VERY long names on axis (we can still show full name in tooltip)
                    var name = row.Label || "N/A";
                    var shortName = (name.length > 20) ? (name.substring(0, 20) + "…") : name;

                    labels.push(shortName);
                    values.push(parseInt(row.Cnt || 0, 10));
                });

                // Colors per bar (repeat if needed)
                var barColors = [
                    "#4D95DD", "#FF6633", "#E91E63", "#9C27B0", "#3F51B5",
                    "#009688", "#CDDC39", "#FFC107", "#FF9800", "#795548"
                ];
                var bgColors = [];
                for (var i = 0; i < values.length; i++) {
                    bgColors.push(barColors[i % barColors.length]);
                }

                // Kill previous chart
                if (deptChart) {
                    deptChart.destroy();
                }

                var ctx = document.getElementById("dept-chart").getContext("2d");

                deptChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            backgroundColor: bgColors,
                            borderWidth: 0,
                            data: values
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,

                        legend: { display: false },

                        title: {
                            display: false // we're already showing header text in card
                        },

                        tooltips: {
                            callbacks: {
                                title: function (tooltipItems, data) {
                                    // show FULL department name on hover, not the truncated one
                                    var idx = tooltipItems[0].index;
                                    return deptRows[idx].Label || "N/A";
                                },
                                label: function (tooltipItem, data) {
                                    var val = data.datasets[0].data[tooltipItem.index] || 0;
                                    return "Cases: " + val;
                                }
                            }
                        },

                        scales: {
                            xAxes: [{
                                ticks: {
                                    fontColor: "#000",
                                    fontSize: 11,
                                    autoSkip: false,
                                    maxRotation: 45,
                                    minRotation: 45
                                },
                                gridLines: {
                                    color: "rgba(0,0,0,0.1)"
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    precision: 0,
                                    fontColor: "#000"
                                },
                                gridLines: {
                                    color: "rgba(0,0,0,0.1)"
                                }
                            }]
                        },

                        animation: {
                            duration: 300,
                            onComplete: function () {
                                // draw numeric value above each bar like your screenshot
                                var chartInstance = this.chart;
                                var ctx2 = chartInstance.ctx;
                                ctx2.save();
                                ctx2.font = "bold 12px sans-serif";
                                ctx2.fillStyle = "#000";
                                ctx2.textAlign = "center";
                                ctx2.textBaseline = "bottom";

                                var dataset = chartInstance.controller.getDatasetMeta(0);
                                dataset.data.forEach(function (bar, idx) {
                                    var val = values[idx];
                                    // bar._model.x, bar._model.y = top center of bar
                                    ctx2.fillText(val, bar._model.x, bar._model.y - 4);
                                });

                                ctx2.restore();
                            }
                        }
                    }
                });

            },
            error: function (xhr) {
                console.error("DepartmentWiseData ajax error", xhr);
                $("#bindDepartmentTableBody").html("");
                if (deptChart) { deptChart.destroy(); deptChart = null; }
            }
        });
    }

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

