/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/MatterSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    var dt = new Date();
    var calendararray = new Array();
    calendararray = [];
    var events = [];
    var events1 = [];
    $('#demo2').datepicker();
    $('#demo2').datepicker('setDate', new Date());
    calendararray = [];
    calendararrayTask = [];
    calendararrayEvent = [];
    calendararrayOrder = [];
    TaskCalCurrentMArray = [];
    EveCalCurrentHArray = [];
    HearingCalCurrentHArray = [];
    OrderCalCurrentHArray = [];
    download();
    var htmlEv = "";
    var count = 0;

    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date();
    var daysD = today.getDate();
    var monthName = monthNames[today.getMonth()];

    $("#spMonths").html(monthName);
    $("#spDays").html(daysD);

    /*Download merge next hearing details*/
    function download() {
        var urls31 = "/firm/LoadMergeNextHearing";
        $.ajax({
            async: true,
            type: "POST",
            url: urls31,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                var datas = JSON.stringify(response);
                if (response == "") {
                    closeload3();
                }
                else {
                    $.when(
                        $.each(response, function (i, val) {
                            if (val.EventType == "Task") {
                                calendararrayTask.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                                if (!TaskCalCurrentMArray.includes(val.Disposeddt)) {
                                    TaskCalCurrentMArray.push(moment(val.Disposeddt).format('MM/DD/YYYY'))
                                    //   if (getMonthName(val.Disposeddt) == getMonthName(new Date())) {
                                    htmlEv += formaRenewaltDate(val.Disposeddt) + " " + "<span class='clsTas'>Task</span>"
                                    // }
                                }
                            }
                            else if (val.EventType == "Event") {
                                calendararrayEvent.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                                if (!EveCalCurrentHArray.includes(val.Disposeddt)) {
                                    EveCalCurrentHArray.push(moment(val.Disposeddt).format('MM/DD/YYYY'))
                                    // if (getMonthName(val.Disposeddt) == getMonthName(new Date())) {
                                    htmlEv += formaRenewaltDate(val.Disposeddt) + " " + "<span class='clsEvent'>Event</span>"
                                    //  }
                                }
                            }
                            else if (val.EventType == "Order") {
                                calendararrayOrder.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                                if (!OrderCalCurrentHArray.includes(val.Disposeddt)) {
                                    OrderCalCurrentHArray.push(moment(val.Disposeddt).format('MM/DD/YYYY'))
                                    // if (getMonthName(val.Disposeddt) == getMonthName(new Date())) {
                                    htmlEv += formaRenewaltDate(val.Disposeddt) + " " + "<span class='clsOrder'>Order</span>"
                                    // }
                                }
                            }
                            else {
                                calendararray.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                                if (!HearingCalCurrentHArray.includes(val.Disposeddt)) {
                                    HearingCalCurrentHArray.push(moment(val.Disposeddt).format('MM/DD/YYYY'))
                                    //   if (getMonthName(val.Disposeddt) == getMonthName(new Date())) {
                                    htmlEv += formaRenewaltDate(val.Disposeddt) + " " + "<span class='clshearing'>Hearing</span>"
                                    //  }
                                }
                            }
                        })
                    ).then(function () {
                        if (JSON.stringify(calendararray) != "[]" || JSON.stringify(calendararrayTask) != "[]" || JSON.stringify(calendararrayEvent) != "[]" || JSON.stringify(calendararrayOrder) != "[]") {
                            $("#demo2").datepicker("destroy");
                            datesTask = JSON.stringify(calendararrayTask);
                            datesTask = String(datesTask).replace(/"/g, "");
                            datesTask = String(datesTask).replace(/]/g, "");
                            datesTask = String(datesTask).substr(1);
                            datesTask = datesTask.split(',');
                            datesEvent = JSON.stringify(calendararrayEvent);
                            datesEvent = String(datesEvent).replace(/"/g, "");
                            datesEvent = String(datesEvent).replace(/]/g, "");
                            datesEvent = String(datesEvent).substr(1);
                            datesEvent = datesEvent.split(',');
                            dates = JSON.stringify(calendararray);
                            dates = String(dates).replace(/"/g, "");
                            dates = String(dates).replace(/]/g, "");
                            dates = String(dates).substr(1);
                            dates = dates.split(',');
                            datesOrder = JSON.stringify(calendararrayOrder);
                            datesOrder = String(datesOrder).replace(/"/g, "");
                            datesOrder = String(datesOrder).replace(/]/g, "");
                            datesOrder = String(datesOrder).substr(1);
                            datesOrder = datesOrder.split(',');
                            $('#demo2').datepicker({
                                dateFormat: 'mm/dd/yy',
                                todayBtn: true,
                                beforeShowDay: highlightDays,
                                onSelect: function (date) {
                                    dt = date;
                                }
                            });
                            $('#demo2').datepicker('setDate', new Date());
                            calendararray = [];
                            closeload();
                            clearInterval(t);
                            //$("#showdatainUI").empty().html(htmlEv);
                            showAllCombineData(htmlEv);
                        }
                    });
                }
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

            //$.each(arrEvent, function (i, el) {
            //    if ($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
            //});

            var uniqueArr = [];
            $.each(arrEvent, function (i, el) {
                var trimmed = el.trim();
                if ($.inArray(trimmed, uniqueArr) === -1) {
                    uniqueArr.push(trimmed);
                }
            });
            var len = uniqueArr.length;
            html += `<span class="clsHTopBottom">${date}</span><br/>`;
            for (var i = 0; i < len; i++) {
                if (uniqueArr[i]) {
                    var item = uniqueArr[i].trim();

                    if (item === "Order") {
                        html += "<span class='clsOrder'>Order</span>";
                    }else if (item === "Hearing") {
                        html += "<span class='clshearing'>Hearing</span>";
                    }
                    else {
                        continue;
                    }
                }
            }
        });
        $('#showdatainUI').empty().html(html);
    }

    $(document).on('click', '.dhx_month_body', function () {
        var day = $(this).siblings('.dhx_month_head').text().trim();
        var fullDate = $('.dhx_cal_date').text().trim();
        var month = fullDate.split(' ')[0];
        $("#spMonths").html(month);
        $("#spDays").html(day);
    });

    /*Hign light days*/
    function highlightDays(date) {
        for (var i = 0; i < dates.length; i++) {
            if (new Date(dates[i]).toString() == date.toString()) {
                return [true, 'highlight'];
            }
        }
        for (var i = 0; i < datesTask.length; i++) {
            if (new Date(datesTask[i]).toString() == date.toString()) {
                return [true, 'highlightTask'];
            }
        }
        for (var i = 0; i < datesEvent.length; i++) {
            if (new Date(datesEvent[i]).toString() == date.toString()) {
                return [true, 'highlightEvent'];
            }
        }
        for (var i = 0; i < datesOrder.length; i++) {
            if (new Date(datesOrder[i]).toString() == date.toString()) {
                return [true, 'highlightOrder'];
            }
        }
        return [true, ''];
    }
    /*Calender data*/
    function calenderdata() {
        try {
            events = [];
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: urls,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        if (response.Data != "") {
                            var obj1 = JSON.parse(response.Data);
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                    }
                    $.when(
                        $.each(obj1, function (i, v) {
                            var sdate = v.sdate;
                            sdate = sdate.split('T')[0];
                            var stime = v.stime;
                            if (stime == null) {
                                stime = '00:00:00';
                            }
                            var newsdate = sdate + 'T' + stime;
                            var edate = v.edate;
                            edate = edate.split('T')[0];
                            var etime = v.etime;
                            if (etime == null) {
                                etime = '00:00:00';
                            }
                            var newedate = edate + 'T' + etime;
                            var matterid = v.tmatter;
                            var mattername = v.mattername;
                            var contactid = v.tcontact;
                            var contactname = v.fname + " " + v.mname + " " + v.lname;
                            var eids = v.Id;
                            events.push({
                                title: v.tsubject,
                                description: v.tdetails,
                                matterids: matterid,
                                matternames: mattername,
                                contactids: contactid,
                                contactnames: contactname,
                                start: newsdate,
                                end: newedate,
                                color: v.ecolor,
                                allDay: v.eallday,
                                eid: eids,
                                elink: "/" + fcode + '/Firm/EventSingleView/' + eids,
                                modelid: "modelEditEvent",
                                deleteid: "deleteevent"
                            });
                        })
                    ).then(function () {
                        closeload();
                    });
                },
                error: function (error) {
                    alert('failed');
                }
            });
        }
        catch (err) {
            alert(err.message);
        }
    }
    $(document).on("click", "#ids", function () {
        $('.popover').css("display", "none");
    });
    //For New UI Calender
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
});
var eventsdata = [];
eventsdata.push({
    title: "hi",
    modelid: "modelEditTask",
    deleteid: "deletetask"
});
var t = "nam";
var data1 = {
    'summary': t,
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
        'dateTime': '2018-12-21T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': '2018-12-22T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    }
};