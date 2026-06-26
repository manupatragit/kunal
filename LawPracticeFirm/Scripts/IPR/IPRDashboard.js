var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var fcode = localStorage.getItem("FirmCode");
var eventDates = [];
$(document).ready(function () {
    
    GetCurrentDateInFormat();
    GetDashboardTotalIPCount();
    GetDataTypeOfIP();
    GetDashboardIPRStatusGraph();
    GetDashboardProprietorGraph();
    FillAllIps();
    DashboardRegisteredData();
    DashboardPendingData();
    GetRenewalDetailForCalender();
    GetDashboardIPRTotalSearchesGraph();

    function GetCurrentDateInFormat() {
        ///var dateStr = "Tue Jun 17 2025 10:28:24 GMT+0530 (India Standard Time)";
        var date = new Date();

        // Define formatting options
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        // Format the date
        var formattedDate = date.toLocaleDateString('en-US', options);

        console.log(formattedDate); // Output: Tuesday, June 17, 2025

        // Optional: remove comma if you want exactly "Tuesday June 17 2025"
        formattedDate = formattedDate.replace(/,/g, '');
        //var refDate = new Date();
        $("#spCurrentDate").html(formattedDate);
    }
    function GetDataTypeOfIP() {
        var iid = [];
        var IPName = [];
        var CCount = [];
        var html = '';
        var formdata = new FormData();

        $.ajax({
            type: "POST",
            url: "/api/IPRApi/DashboardTypeOfIPGraph",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {

                $(response.Data).each(function (key, value) {

                    if (value.IPName == '') { }
                    //if (value.IPName == '' || value.MarkCount == '') { }
                    else {
                        IPName.push(value.IPName);
                        CCount.push(value.MarkCount);
                        switch (value.IPName) {
                            case 'Trademark':
                                html += '<tr><td>' + value.IPName + '</td><td align="right"><p>' + value.MarkCount + '</p></td></tr>'
                                break;

                            case 'Copyright':
                                html += '<tr><td>' + value.IPName + '</td><td align="right"><p>' + value.MarkCount + '</p></td></tr>'
                                break;

                            case 'Patent':
                                html += '<tr><td>' + value.IPName + '</td><td align="right"><p>' + value.MarkCount + '</p></td></tr>'
                                break;

                            case 'GI':
                                html += '<tr><td>' + value.IPName + '</td><td align="right"><p>' + value.MarkCount + '</p></td></tr>'
                                break;

                            case 'Design':
                                html += '<tr><td>' + value.IPName + '</td><td align="right"><p>' + value.MarkCount + '</p></td></tr>'
                                break;
                        }
                    }
                });
                $("#tblbodyTypeOfIP").html(html)

            },
            failure: function (response) {
                alert("Something Went Wrong")
            }

        });
        var chart1 = new Chart(document.getElementById("barChartTypeOfIP"), {
            type: 'doughnut',
           
            data: {
                labels: IPName,
                datasets: [
                    {
                        // new
                        //backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                        //    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                        //    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                        //    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                        //    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                        //    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                        //    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                        //    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                        //    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                        //    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                        backgroundColor: [
                            '#0ea5e9', // Trademark
                            '#38bdf8', // Copyright
                            '#7dd3fc', // Design
                            '#bae6fd', // Patent
                            '#e0e7ff'  // Other
                        ],
                        data: CCount
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
                cutout: '70%',
            }
           
        });
    }

    $(document).on('click', '#TypeOfIPfront', function () {
        $("#div_totalIPCount").show();
        return false;
    });
    $(document).on('click', '#CancelTIpCount', function () {
        $("#div_totalIPCount").hide();
        return false;
    });

    $(document).on('click', '#id_TypeOfIPfront', function () {
        $("#div_StatusIPCount").show();
        return false;
    });
    $(document).on('click', '#id_CancelStatus', function () {
        $("#div_StatusIPCount").hide();
        return false;
    });

    $(document).on('click', '#id_TotalSearches', function () {
        $("#div_TotalSearchesCount").show();
        return false;
    });
    $(document).on('click', '#id_CancelSearches', function () {
        $("#div_TotalSearchesCount").hide();
        return false;
    });

    function FillAllIps() {
        $.ajax({
            type: "POST",
            url: "/api/IPRApi/DashboardDifferentIPs",
            dataType: 'json',
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {

                var data = JSON.parse(response.Data.data);
                var k = 0;
                $.each(data, function (i, val) {

                    k += 1;

                    switch (k) {
                        case 1:
                            $('#vl1').text(val.vCount);
                            break;

                        case 2:
                            $('#vl2').text(val.vCount);
                            break;

                        case 3:
                            $('#vl3').text(val.vCount);
                            break;

                        case 4:
                            $('#vl4').text(val.vCount);
                            break;

                        case 5:
                            $('#vl5').text(val.vCount);
                            break;
                    }
                });
            },

            error: function (response) {

            }

        });
    }

    function GetDashboardIPRStatusGraph() {
        var IPName = [];
        var CCount = [];
        var html = '';
        var formdata = new FormData();

        $.ajax({
            type: "POST",
            url: "/api/IPRApi/DashboardIPRStatusGraph",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
              
                $(response.Data).each(function (key, value) {

                    if (value.Name == "" || value.Name == null || value.Name == "null") {

                    }
                    else {
                        IPName.push(value.Name);
                        CCount.push(value.CCount);
                        html += '<tr><td>' + value.Name + '</td><td align="right"><a onclick=fn_TrackStatusDetail("' + value.Name + '"); href="#" id="regisstatus" data-toggle="modal" data-target="#myModalexport"><p>' + value.CCount + '</p></a></td></tr>';
                        //if (value.Name == "Registered") {
                        //    html += '<tr><td>' + value.Name + '</td><td><a onclick=fn_TrackStatusDetail(' + value.Name+'); href="#" id="regisstatus" data-toggle="modal" data-target="#myModalexport"><p>' + value.CCount + '</p></a></td></tr>';
                        //}

                        //if (value.Name == "Pending") {
                        //    html += '<tr><td>' + value.Name + '</td><td><a href="#" id="pendstatus" data-toggle="modal" data-target="#myModalexport"><p>' + value.CCount + '</p></a></td></tr>';
                        //}


                        if (value.Name == "Registered") {
                            $("#lblRegisteredcount").html(value.CCount);
                        }
                        if (value.Name == "Pending") {
                            $("#lblPendingcount").html(value.CCount);
                        }
                    }
                });
                $("#tblbodyStatus").html(html)

            },
            failure: function (response) {
                alert("Something Went Wrong")
            }

        });
        var chartDiv = $("#barChartStatus");
        var myChart = new Chart(chartDiv, {
            type: 'doughnut',
            data: {
                //labels: IPName,
                labels: IPName,
                datasets: [
                    {
                        data: CCount,
                        //backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F"]
                        backgroundColor: ["#e5e7eb","#0ea5e9"]
                    }]
            },
            options: {
                //title: {
                //    display: true,
                //    text: 'Pie Chart'
                //},
                //responsive: true,
                //maintainAspectRatio: false,
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    responsive: true,

                },
                legend: {
                    display: false,
                    position: 'middle',

                    labels: {
                        
                        fontSize: 12,
                        fontColor: '#333333'

                    }
                },
                cutout: '70%',
            }
        });
    }

    function GetDashboardProprietorGraph() {

        var Name = [];
        var CCount = [];
        var html = '';
        var formdata = new FormData();

        $.ajax({
            type: "POST",
            url: "/api/IPRApi/DashboardProprietorGraph",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {

                $(response.Data).each(function (key, value) {

                    if (value.Name == "" || value.Name == null || value.Name == "null") {

                    }
                    else {
                        Name.push(value.Name);
                        CCount.push(value.CCount);
                        html += '<tr><td>' + value.Name + '</td><td><p>' + value.CCount + '</p></td></tr>'
                    }
                });
                $("#tblbodyProprietor").html(html)

            },
            failure: function (response) {
                alert("Something Went Wrong")
            }

        });
        var chartDiv = $("#barChartProprietor");
        var myChart = new Chart(chartDiv, {
            type: 'doughnut',
            data: {
                //labels: ["Pending", "InProgress", "OnHold", "Complete", "Cancelled"],
                labels: Name,
                datasets: [
                    {
                        data: CCount,
                        // data: [21, 39, 10, 14, 16],
                        backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F"]
                    }]
            },
            options: {
                //title: {
                //    display: true,
                //    text: 'Pie Chart'
                //},
                //responsive: true,
                //maintainAspectRatio: false,
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
            }
        });
    }


    function GetDashboardTotalIPCount() {

        var typeofIPiid = [];
        var typeofIPIPName = [];
        var typeofIPCCount = [];
        var html = '';
        var formdata = new FormData();

        $.ajax({
            type: "POST",
            url: "/api/IPRApi/DashboardTotalIPCount",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                //alert(response.Data);               
                $("#lbltotalIPcount").html(response.Data[0]);

            },
            failure: function (response) {
                alert("Something Went Wrong")
            }

        });
    }
});

function fn_TrackStatusDetail(val) {
    //alert(val);
    $('#dynamititle').text('Status - ' + val);
    $('#statusbind').empty();
    var html = '';
    var status = val;
    var formData = new FormData();
    formData.append('status', status);
    $.ajax({
        type: "POST",
        url: "/api/IPRApi/DashboardIPRStatusGraphDetail",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            var obj = response.Data;
            $.each(obj, function (key, value) {

                html += '<tr><td>' + value.IPName + '</td><td>' + value.ccount + '</td></tr>';

                $('#statusbind').html(html);

            });
        },
        failure: function (response) {
            alert('Something went wrong');
        },
        error: function (response) {

            alert('Something went wrong');

        }
    });
}

function rotateCard(btn) {
    var $card = $(btn).closest('.card-container');
    if ($card.hasClass('hover')) {
        $card.removeClass('hover');
    } else {
        $card.addClass('hover');
    }
}

function DashboardRegisteredData() {
    $.ajax({
        type: "POST",
        url: "/api/IPRApi/IPRDashRegisteredData",
        dataType: 'json',
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            var data = JSON.parse(response.Data.data);
            $.each(data, function (index, value) {
                var Names = value.Names;
                var Count = value.CCount;

                switch (Names) {
                    case 'Trademark':
                        $('#R1').text(Count);
                        break;
                    case 'Copyright':
                        $('#R2').text(Count);
                        break;
                    case 'Patent':
                        $('#R3').text(Count);
                        break;
                    case 'GI':
                        $('#R4').text(Count);
                        break;
                    case 'Design':
                        $('#R5').text(Count);
                        break;
                }
            });
        },
        error: function (reponse) {


        }

    });
}

function DashboardPendingData() {
    $.ajax({
        type: "POST",
        url: "/api/IPRApi/IPRDashPendingData",
        dataType: 'json',
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            var data = JSON.parse(response.Data.data);
            $.each(data, function (index, value) {
                var Names = value.Names;
                var Count = value.CCount;

                switch (Names) {
                    case 'Trademark':
                        $('#P1').text(Count);
                        break;
                    case 'Copyright':
                        $('#P2').text(Count);
                        break;
                    case 'Patent':
                        $('#P3').text(Count);
                        break;
                    case 'GI':
                        $('#P4').text(Count);
                        break;
                    case 'Design':
                        $('#P5').text(Count);
                        break;
                }
            });
        },
        error: function (reponse) {
        }
    });
}



/*Calender renewal data binding*/
iprCalenderArray = [];
iprCalenderHearingArray = [];
iprCalCurrentMArray = [];
iprCalCurrentHArray = [];

var calDateForPage = "";
var html = "";
function GetRenewalDetailForCalender() {
    var pagesize = 10;
    var pageindex = 1;
    var formData = new FormData();
    formData.append("PageNum", pageindex);
    formData.append("PageSize", pagesize);
    $.ajax(
        {
            type: "POST",
            url: "/Firm/BindIPRRenewalData",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var datas = JSON.stringify(response);
                if (response == "") {
                    $("#pdatastatus").show();
                    $('#divdatetimepicker').datepicker();
                }
                else {
                    $("#pdatastatus").hide();
                    $.when(
                        $.each(response, function (i, val) {
                            if (val.Datetype == "Renewal") {
                                iprCalenderArray.push(moment(val.RenewalDate).format('MM/DD/YYYY'))
                                if (!iprCalCurrentMArray.includes(val.RenewalDate)) {
                                    iprCalCurrentMArray.push(moment(val.RenewalDate).format('MM/DD/YYYY'))
                                    if (getMonthName(val.RenewalDate) == getMonthName(new Date())) {
                                        html += formaRenewaltDate(val.RenewalDate) + " " + "<span class='clsRenewal'>Renewal</span>"
                                    }
                                }
                            }
                            if (val.Datetype == "Hearing") {
                                iprCalenderHearingArray.push(moment(val.RenewalDate).format('MM/DD/YYYY'))
                                if (!iprCalCurrentHArray.includes(val.RenewalDate)) {
                                    iprCalCurrentHArray.push(moment(val.RenewalDate).format('MM/DD/YYYY'))
                                    if (getMonthName(val.RenewalDate) == getMonthName(new Date())) {
                                        html += formaRenewaltDate(val.RenewalDate) + " " + "<span class='clsHearing'>Hearing</span>";
                                    }
                                }
                            }
                        })
                    ).then(function () {
                        if (JSON.stringify(iprCalenderArray) != "[]" || JSON.stringify(iprCalenderHearingArray) != "[]") {
                            $("#divdatetimepicker").datepicker("destroy");
                            datesTask = JSON.stringify(iprCalenderArray);
                            datesTask = String(datesTask).replace(/"/g, "");
                            datesTask = String(datesTask).replace(/]/g, "");
                            datesTask = String(datesTask).substr(1);
                            datesTask = datesTask.split(',');

                            datesHearing = JSON.stringify(iprCalenderHearingArray);
                            datesHearing = String(datesHearing).replace(/"/g, "");
                            datesHearing = String(datesHearing).replace(/]/g, "");
                            datesHearing = String(datesHearing).substr(1);
                            datesHearing = datesHearing.split(',');
                            //$("#showdatainUI").empty().html(html);
                            showAllCombineData(html);
                            var dates22 = ['03/10/2021', '03/06/2021'];
                            $('#divdatetimepicker').datepicker({
                                dateFormat: 'mm/dd/yy',
                                todayBtn: true,
                                beforeShowDay: highlightDays,

                                onSelect: function (date) {
                                    isDocRnd = false;
                                    isRenderPage = false;
                                    dt = date;
                                    //defined your own method here
                                    if (dt != null) {
                                        calDateForPage = date;
                                        BindRenewalPopup(1, calDateForPage);
                                        BindHearingPopup(1, calDateForPage);
                                        //var fcode33 = localStorage.getItem("FirmCode");
                                        //window.location = encodeURI("/" + fcode33 + "/firm/MergeCalendar");
                                    }
                                }
                            });
                            //}).attr('title', 'Application For Renewal');
                            /*$('#demo3loader').hide();*/
                            $('#divdatetimepicker').datepicker('setDate', new Date());
                            calendararray = [];
                            calendararrayTask = [];
                        }
                    });
                }
            },
            failure: function (response) {
                alert(data.responseText);
                closeload();
            },
            error: function (response) {
                alert(data.responseText);
                closeload();
            }
        });
}

function showAllCombineData(htmlData) {
    const rawData = htmlData;
    const currentYear = new Date().getFullYear();
    const regex = /([A-Za-z]+, [A-Za-z]{3} \d{2}, \d{4})\s*<span class='(cls\w+)'>(\w+)<\/span>/g;

    let match;
    const groupedData = {};

    while ((match = regex.exec(rawData)) !== null) {
        const fullDate = match[1];
        const year = parseInt(fullDate.split(', ')[2]);
        const shortDate = fullDate.split(', ')[1];
        const type = match[3];
        //if (year === currentYear) {
        if (!groupedData[fullDate]) {
            groupedData[fullDate] = [];
        }
        //groupedData[shortDate].push(fullDate);
        groupedData[fullDate].push(type);
        //}
    }

    let html = '';
    Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
        const items = groupedData[date].join(', ');
        var arrEvent = [];
        arrEvent = items.split(",");

        var uniqueArr = [];

        //$.each(arrEvent, function (i, el) {
        //    if ($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
        //});
        $.each(arrEvent, function (i, el) {
            var trimmed = el.trim();
            if ($.inArray(trimmed, uniqueArr) === -1) {
                uniqueArr.push(trimmed);
            }
        });

        var len = uniqueArr.length;
        html += `<span>${date}</span><br/>`;
        for (var i = 0; i < len; i++) {
            if (uniqueArr[i]) {
                var item = uniqueArr[i].trim();

                if (item === "Renewal") {
                    html += "<span class='clsRenewal'>Renewal</span>";
                } else if (item === "Hearing") {
                    html += "<span class='clsHearing'>Hearing</span>";
                } 
                else {
                    continue;
                }
            }
        }
    });
    $('#showdatainUI').empty().html(html);
}

function getMonthName(dateStr) {
    const date = new Date(dateStr); // "04/15/2025"
    const options = { month: 'long' }; // You can use 'short' for "Apr"
    return date.toLocaleString('en-US', options); // Returns "April"
}

function formaRenewaltDate(dateStr) {
    const date = new Date(dateStr); // MM/DD/YYYY format
    const options = {
        weekday: 'long',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    };

    return date.toLocaleDateString('en-US', options);
}

function highlightDays(date) {
    date = formatDate(date);

    for (var j = 0; j < datesHearing.length; j++) {
        //date = formatDate(date);
        dateHearing = formatDate(datesHearing[j]);
        if (dateHearing == date.toString()) {
            return [true, 'highlightHearing'];
        }
    }
    for (var i = 0; i < datesTask.length; i++) {
        dateTask = formatDate(datesTask[i]);
        if (dateTask == date.toString()) {
            return [true, 'highlight'];
        }
    }

    return [true, ''];
}

function formatDate(dateStr) {
    // Parse the date string to a Date object
    var date = new Date(dateStr);

    // Extract the month, day, and year
    var month = date.getMonth() + 1; // Months are zero-based, so add 1
    var day = date.getDate();
    var year = date.getFullYear();

    // Format the date to "MM/DD/YYYY"
    var formattedDate = (month < 10 ? '0' + month : month) + '/' +
        (day < 10 ? '0' + day : day) + '/' +
        year;

    return formattedDate;
}

/*Start calender renewal details in model popup*/

var cPageNo = "";
var calDate = "";
function BindRenewalPopup(cPageIndex, cDate) {
    $('#divRenewal').css("display", "none");
    $('#ShowRenewalTrade').modal('show');
    calDate = cDate;
    var html = '';
    cPageNo = 1;
    pagesize = 10;
    pageindex = cPageIndex;
    cPageNo = pageindex;
    $("#renewalFooter").html("");
    $("#bindAppForRenewal").html("");
    var formData = new FormData();
    formData.append("PageNum", pageindex);
    formData.append("PageSize", pagesize);
    formData.append("getDataByDate", cDate);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/Firm/BindRenewalAppDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1;
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $('#divRenewal').css("display", "block");
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            $('#docPagination').show();
                            var totdata = val.RenewalCount;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                //var pnext = pageindex;
                                //var pprev = pageindex;
                                //var pageno = pageindex;
                                //var totdata = val.RenewalCount;
                                //var totpage = 0;
                                //if (val.RenewalCount > 0) {
                                //    pnext = parseInt(pnext) + 1;
                                //    if (pnext == 0) pnext = 1;

                                //    pprev = parseInt(pageno) - 1;
                                //    if (pprev == 0) pprev = 1;
                                //    totpage = parseInt(totdata) / parseInt(pagesize);

                                //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                //        totpage = parseInt(totpage) + 1;
                                //    }

                                //    $("#pagnumvalue").attr("max", totpage);

                                //}
                                //var totalRecord = '';
                                //var tfot = '';
                                //tfot += '<ul>'
                                //tfot += '<li>results <span>' + val.RenewalCount + '</span>  <span id="Cortopage" style="display:none">' + totpage + '</span></li>'
                                //tfot += '<li><span>|</span></li>'
                                ///*tfot += '<li>pages ' + pageindex + '/ ' + parseInt(val.TotalCount) + '</li>'*/
                                //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                //tfot += '<li><span>|</span></li>'
                                //tfot += `<li><input type="number" id="renNumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getRenewalByPageNo" style="margin-left:10px;">Go</button></a></li>`

                                //if (val.TotalCount <= length) {

                                //}
                                //else if (pageno == 1) {

                                //}
                                //else if (pageno == totpage) {
                                //    tfot += '<li><span><a id="renPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'

                                //}

                                //else {
                                //    tfot += '<li><span><a id="renPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                                //}

                                //if (pageno < totpage) {
                                //    tfot += '<a  id="renPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                                //}

                                //tfot += '</ul>'
                                //$("#renewalFooter").html("");
                                //$("#renewalFooter").html(tfot);

                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#docNext').hide();
                                    $('#docPrev').css("display", "block");
                                }
                                else {
                                    $('#docNext').css("display", "block");
                                }
                                if (pageindex == 1) {
                                    $('#docPrev').css("display", "none");
                                }
                                else {
                                    $('#docPrev').css("display", "block");
                                }

                                if (isDocRnd == false) {
                                    docTotRecord = totpage;
                                    DocPaginationDetail(pageindex, totpage);
                                }
                            }
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.AppNo + '</td>';
                            html += '<td>' + val.Trademark + '</td>';
                            html += '<td>' + val.Proprietor + '</td>';
                            html += '<td>' + val.vClass + '</td>';
                            html += '<td>' + val.AppDate + '</td>';
                            /*html += '<td>' + '<a id="transferTrackerDetails" title="Redirect to tracker" onclick=openPage(' + val.AppNo +') >View</a></td>';*/
                            html += '</tr>';

                        });
                    }
                    else {
                        $('#docPagination').hide();
                        html += '<tr><td colspan="7" align="center">' + "Data not found" + '</td></tr>';
                    }
                }
                else {
                    $('#docPagination').hide();
                    html += '<tr><td colspan="7" align="center">' + "Data not found" + '</td></tr>';
                }
                $("#bindAppForRenewal").html("").html(html);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
/*Start detail pagination*/
var isDocRnd = false;
var setRenewalPage = 1;
function DocPaginationDetail(pageindex, totdata) {
    let totPages = totdata;
    setRenewalPage = pageindex;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btndocD ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btndocD ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btndocD ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#docPageNumbers").html(paginationHtml);
    isDocRnd = true;
}

$(document).on("click", ".page-btndocD", function () {
    let page = $(this).data("page");
    setRenewalPage = page;
    isDocRnd = true;
    $("#doctxtgopage").val("");
    BindRenewalPopup(setRenewalPage, calDate);
    $(".page-btndocD").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#docPrev", function () {
    if (setRenewalPage > 1) {
        setRenewalPage = setRenewalPage - 1;
    }
    isDocRnd = true;
    $("#doctxtgopage").val("");
    BindRenewalPopup(setRenewalPage, calDate);
    $(".page-btndocD").removeClass("active");
    $(".page-btndocD[data-page='" + setRenewalPage + "']").addClass("active");
});


$(document).on("click", "#docNext", function () {
    if (setRenewalPage => 1) {
        setRenewalPage = setRenewalPage + 1;
    }
    isDocRnd = true;
    $("#doctxtgopage").val("");
    BindRenewalPopup(setRenewalPage, calDate);
    $(".page-btndocD").removeClass("active");
    $(".page-btndocD[data-page='" + setRenewalPage + "']").addClass("active");
});

$(document).on("click", "#docDivGo", function () {
    let goToPage = parseInt($("#doctxtgopage").val());
    if (!isNaN(goToPage)) {
        setRenewalPage = goToPage;
    }
    if (goToPage > docTotRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        setRenewalPage = 1;
        return false;
    }
    isDocRnd = true;
    BindRenewalPopup(setRenewalPage, calDate);
    $(".page-btndocD").removeClass("active");
    $(".page-btndocD[data-page='" + setRenewalPage + "']").addClass("active");
});
/*End Document detail pagination*/


function openPage(AppNo) {

    var urls = "/" + fcode + "/IPR/ViewAddedTrademarks?IP=1";
    url_redirect({
        url: urls,
        method: "post",
        data: { applicationno: AppNo, IP: 1 }
    });

}

function changePage(page) {
    cPageNo = page;
    BindRenewalPopup(cPageNo, calDateForPage);
}

$(document).on('click', '#getRenewalByPageNo', function () {
    ppageindex = $("#renNumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#Cortopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                changePage(ppageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});

$(document).on('click', '#renPaginate', function () {
    cPageNo = $(this).attr("index");
    BindRenewalPopup(cPageNo, calDateForPage);
});

/*End calender renewal details in model popup*/

/*Start Bind calender hearing detail*/
var hearPageNo = "";
function BindHearingPopup(cPageIndex, cDate) {
    $('#ShowRenewalTrade').modal('show');
    $('#divHearing').css("display", "none");
    calDate = cDate;
    var html = '';
    hearPageNo = 1;
    pagesize = 10;
    pageindex = cPageIndex;
    cPageNo = pageindex;
    $("#hearingFooter").html("");
    $("#bindAppForHearing").html("");
    var formData = new FormData();
    formData.append("PageNum", pageindex);
    formData.append("PageSize", pagesize);
    formData.append("getDataByDate", cDate);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/Firm/BindHearingAppDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1;
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $('#divHearing').css("display", "block");
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            if (i === (length - 1)) {
                                $("#tradePagination").show();
                                //var pnext = pageindex;
                                //var pprev = pageindex;
                                //var pageno = pageindex;
                                //var totdata = val.RenewalCount;
                                //var totpage = 0;
                                //if (val.RenewalCount > 0) {
                                //    pnext = parseInt(pnext) + 1;
                                //    if (pnext == 0) pnext = 1;

                                //    pprev = parseInt(pageno) - 1;
                                //    if (pprev == 0) pprev = 1;
                                //    totpage = parseInt(totdata) / parseInt(pagesize);

                                //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                //        totpage = parseInt(totpage) + 1;
                                //    }
                                //    $("#pagnumvalue").attr("max", totpage);
                                //}
                                //var totalRecord = '';
                                //var tfot = '';
                                //tfot += '<ul>'
                                //tfot += '<li>results <span>' + val.RenewalCount + '</span>  <span id="Heartopage" style="display:none">' + totpage + '</span></li>'
                                //tfot += '<li><span>|</span></li>'
                                //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                //tfot += '<li><span>|</span></li>'
                                //tfot += `<li><input type="number" id="hearNumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getHearByPageNo" style="margin-left:10px;">Go</button></a></li>`

                                //if (val.TotalCount <= length) {

                                //}
                                //else if (pageno == 1) {

                                //}
                                //else if (pageno == totpage) {
                                //    tfot += '<li><span><a id="hearPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'

                                //}

                                //else {
                                //    tfot += '<li><span><a id="hearPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                                //}

                                //if (pageno < totpage) {
                                //    tfot += '<a  id="hearPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                                //}

                                //tfot += '</ul>'
                                //$("#hearingFooter").html("");
                                //$("#hearingFooter").html(tfot);
                                var totdata = val.RenewalCount;
                                var totpage = 0;
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#next').hide();
                                    $('#prev').css("display", "block");
                                }
                                else {
                                    $('#next').css("display", "block");
                                }
                                if (pageindex == 1) {
                                    $('#prev').css("display", "none");
                                }
                                else {
                                    $('#prev').css("display", "block");
                                }
                                if (isRenderPage == false) {
                                    setTotalRecord = totpage;
                                    renderPagination(pageindex, totpage);
                                }
                            }
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.AppNo + '</td>';
                            html += '<td>' + val.Trademark + '</td>';
                            html += '<td>' + val.Proprietor + '</td>';
                            html += '<td>' + val.vClass + '</td>';
                            html += '<td>' + val.AppDate + '</td>';
                            /*html += '<td>' + '<a id="transferTrackerDetails" title="Redirect to tracker" onclick=openPage(' + val.AppNo +') >View</a></td>';*/
                            html += '</tr>';

                        });
                    }
                    else {
                        $("#tradePagination").hide();
                        html += '<tr><td colspan="7" align="center">' + "Data not found" + '</td></tr>';
                    }
                }
                else {
                    $("#tradePagination").hide();
                    html += '<tr><td colspan="7" align="center">' + "Data not found" + '</td></tr>';
                }
                $("#bindAppForHearing").html("").html(html);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });

}

/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbers").html(paginationHtml);
    isRenderPage = true;
}
var setPageNo = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isRenderPage = true;
    $("#txtgopage").val("");
    BindHearingPopup(setPageNo, calDate);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = true;
    $("#txtgopage").val("");
    BindHearingPopup(setPageNo, calDate);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    BindHearingPopup(setPageNo, calDate);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isRenderPage = true;
    BindHearingPopup(setPageNo, calDate);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

$(document).on('click', '#getHearByPageNo', function () {
    ppageindex = $("#hearNumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#Heartopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                changeHearingPage(ppageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});
function changeHearingPage(page) {
    hearPageNo = page;
    BindHearingPopup(hearPageNo, calDateForPage);
}

$(document).on('click', '#hearPaginate', function () {
    ppageindex = $(this).attr("index");
    if (ppageindex != "" && ppageindex != 'undefined') {
        BindHearingPopup(ppageindex, calDateForPage)
    }

});

/*End Bind calender hearing detail*/

/*Start total search count widget*/
function GetDashboardIPRTotalSearchesGraph() {
    var IPName = [];
    var CCount = [];
    var html = '';
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/IPRApi/DashboardIPRTotalSearchesGraph",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            html = '';
            $(response.Data.data).each(function (key, value) {

                if (value.Name == "" || value.Name == null || value.Name == "null") {
                }
                else {
                    IPName.push(value.Name);
                    CCount.push(value.CCount);
                    //html += '<tr><td>' + value.Name + '</td><td><p>' + value.CCount + '</p></td></tr>';

                    if (value.Name == 'Trademark') {
                        html += '<tr><td>' + value.Name + '</td><td align="right"><a href="/' + fcode + '/IPR/TrademarkArchive?IP=1"><p>' + value.CCount + '</p></a></td></tr>'
                    }
                    else if (value.Name == 'Copyright') {
                        html += '<tr><td>' + value.Name + '</td><td align="right"><a href="/' + fcode + '/IPR/TrademarkArchive?IP=2"><p>' + value.CCount + '</p></a></td></tr>'
                    }
                    else if (value.Name == 'Patent') {
                        html += '<tr><td>' + value.Name + '</td><td align="right"><a href="/' + fcode + '/IPR/TrademarkArchive?IP=3"><p>' + value.CCount + '</p></a></td></tr>'
                    }
                    else if (value.Name == 'GI') {
                        html += '<tr><td>' + value.Name + '</td><td align="right"><a href="/' + fcode + '/IPR/TrademarkArchive?IP=4"><p>' + value.CCount + '</p></a></td></tr>'
                    }
                    else if (value.Name == 'Design') {
                        html += '<tr><td>' + value.Name + '</td><td align="right"><a href="/' + fcode + '/IPR/TrademarkArchive?IP=5"><p>' + value.CCount + '</p></a></td></tr>'
                    }
                    else {
                        html += '<tr><td>' + "" + '</td><td align="right"><p>' + "" + '</p></td></tr>'
                    }

                }
            });
            $("#tblbodyTotalSearches").html(html)

        },
        failure: function (response) {
            alert("Something Went Wrong")
        }

    });
    var chartDiv = $("#barChartTotalSearches");
    var myChart = new Chart(chartDiv, {
        type: 'doughnut',
        data: {
            //labels: IPName,
            labels: IPName,
            datasets: [
                {
                    data: CCount,
                    backgroundColor: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0e7ff"]
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
            cutout: '70%',
        }
    });
}

/*End total search count widget*/