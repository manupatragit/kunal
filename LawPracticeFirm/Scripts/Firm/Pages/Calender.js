function openload() {
    $('#myOverlay').css("display", "block");
}
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    
    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var today = new Date();
    var daysD = today.getDate();
    var monthName = monthNames[today.getMonth()];

    $("#spMonths").html(monthName);
    $("#spDays").html(daysD);

    /*Transfer single matter*/
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/MatterSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    /*Remove single event*/
    $(document).on("click", "#deleteevent", function () {
        var result = confirm("Are you sure to   delete this Event?");
        if (result) {
            var id = $(this).attr("value");
            var formData = new FormData();
            formData.append("Id", id);
            $.ajax({
                async: true,
                url: '/api/CallApi/RemoveSingleEvent',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        new PNotify({
                            title: 'Success!',
                            text: ' Event Deleted Successfully',
                            type: 'success',
                            delay: 2000
                        });
                        $('.popover').css("display", "none");
                        calenderdata();
                        calenderdata1();
                    }
                    else {
                        //alert("not found");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
        else {
        }
    });
    /*Remove single task*/
    $(document).on("click", "#deletetask", function () {
        var result = confirm("Are you sure to   delete this task?");
        if (result) {
            var id = $(this).attr("value");
            var formData = new FormData();
            formData.append("Id", id);
            $.ajax({
                async: true,
                url: '/api/CallApi/RemoveSingleTask',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        new PNotify({
                            title: 'Success!',
                            text: ' Task Deleted Successfully',
                            type: 'success',
                            delay: 2000
                        });
                        $('.popover').css("display", "none");
                        calenderdata();
                        calenderdata1();
                    }
                    else {
                        //alert("not found");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
        else {
        }
    });
    var dt = new Date();
    var urls = "/api/EmployeeApi/LoadEvent";
    var urls2 = "/api/EmployeeApi/LoadTask";

    //event filetr
    $('#event').click(function () {
        if ($("#task").is(":checked")) {
            if ($(this).is(":checked")) {
                $('#calendar').fullCalendar('removeEvents');
                calenderdata();
                calenderdata1();
            }
            if ($(this).is(":not(:checked)")) {
                $('#calendar').fullCalendar('removeEvents');
                calenderdata1();
            }
        }
        if ($("#task").is(":not(:checked)")) {
            if ($(this).is(":checked")) {
                $('#calendar').fullCalendar('removeEvents');
                calenderdata();
            }
            if ($(this).is(":not(:checked)")) {
                $('#calendar').fullCalendar('removeEvents');
            }
        }
        closeload();
    });
    //task filetr
    $('#task').click(function () {
        if ($("#event").is(":checked")) {
            if ($(this).is(":checked")) {
                $('#calendar').fullCalendar('removeEvents');
                calenderdata();
                calenderdata1();
            }
            if ($(this).is(":not(:checked)")) {
                $('#calendar').fullCalendar('removeEvents');
                calenderdata();
            }
        }
        if ($("#event").is(":not(:checked)")) {
            if ($(this).is(":checked")) {
                $('#calendar').fullCalendar('removeEvents');
                calenderdata1();
            }
            if ($(this).is(":not(:checked)")) {
                $('#calendar').fullCalendar('removeEvents');
            }
        }
        closeload();
    });
    var calendararray = new Array();
    calendararray = [];
    var events = [];
    var events1 = [];
    function loadcdata() {
        calenderdata1(calenderdata());
    }
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
    var count = 0;
    var htmlEv = "";

    //function convertDateFormat(dateStr) {
    //    var date = new Date(dateStr);
    //    if (isNaN(date)) {
    //        return "Invalid Date";
    //    }
    //    var month = date.getMonth() + 1;
    //    var day = date.getDate();
    //    var year = date.getFullYear();
    //    return `${month}/${day}/${year} 12:00:00 AM`;
    //}

    function download() {
        var urls31 = "/firm/LoadMergeNextHearing";
        $.ajax({
            async: true,
            type: "POST",
            url: urls31,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //debugger;
                var datas = JSON.stringify(response);
                //var data = datas;
                //const sortedData = data
                //    .filter(item => convertDateFormat(item.Disposeddt))
                //    .sort((a, b) => new Date(a.Disposeddt) - new Date(b.Disposeddt));
                //debugger;

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
                                    //defined your own method here
                                    if (dt != null) {
                                    }
                                }
                            });
                            $('#demo2').datepicker('setDate', new Date());
                            calendararray = [];
                            closeload();
                            clearInterval(t);
                            showAllCombineData(htmlEv);
                            //$("#showdatainUI").empty().html(htmlEv);
                        }
                    });
                }
            }
        });
    }

    //function showAllCombineData(htmlData) {
    //    const rawData = htmlData;

    //    const currentYear = new Date().getFullYear();
    //    // Step 1: Match all "Day, Mon dd, yyyy <span class='class'>Type</span>"
    //    const regex = /([A-Za-z]+, [A-Za-z]{3} \d{2}, \d{4})\s*<span class='(cls\w+)'>(\w+)<\/span>/g;

    //    let match;
    //    const groupedData = {};

    //    // Step 2: Process matches
    //    while ((match = regex.exec(rawData)) !== null) {
    //        const fullDate = match[1]; // e.g., "Thursday, Jun 05, 2025"
    //        const shortDate = fullDate.split(', ')[1]; // e.g., "Jun 05, 2025"
    //        const type = match[3]; // e.g., Hearing, Task, Order



    //        if (!groupedData[fullDate]) {
    //            groupedData[fullDate] = [];
    //        }
    //        //groupedData[shortDate].push(fullDate);
    //        groupedData[fullDate].push(type);
    //    }

    //    // Step 3: Display grouped result
    //    let html = '';
    //    Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
    //        const items = groupedData[date].join(', ');
    //        var arrEvent = [];
    //        arrEvent = items.split();
    //        var len = arrEvent.length;
    //        html += `<span>${date}</span><br/>`;
    //        for (var i = 0; i <= len; i++) {
    //            if (items[i] == "Task") {
    //                html += "<span class='clsTas'>Task</span>";
    //            } else if (items[i] == "Order") {
    //                html += "<span class='clsOrder'>Order</span>";
    //            }
    //            else if (items[i] == "Event") {
    //                html += "<span class='clsEvent'>Event</span>";
    //            } else {
    //                html += "<span class='clshearing'>Hearing</span>";
    //            }
    //            html += "<br/>";
    //        }
    //        //if (arrEvent.count >= 0) {
                
    //        //}
            
    //        //html += `<div><strong>${date}:</strong> ${items}</div>`;
    //    });

    //    $('#showdatainUI').empty().html(html);
    //}

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

                    if (item === "Task") {
                        html += "<span class='clsTas'>Task</span>";
                    } else if (item === "Order") {
                        html += "<span class='clsOrder'>Order</span>";
                    } else if (item === "Event") {
                        html += "<span class='clsEvent'>Event</span>";
                    } else if (item === "Hearing") {
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

    /*Bind datepicker details*/
    function binddatepicker() {
        var urls31 = "/firm/CaseCalendarDatepicker";
        $.ajax({
            async: true,
            type: "POST",
            url: urls31,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                chartarray4 = [];
                chartcount4 = [];
                alert(JSON.stringify(response));
                var dataT = "";
                var dataT2 = "";
                var htul = '';
                if (response == "") {
                    closeload3();
                }
                else {
                    $.when(
                        $.each(response, function (i, val) {
                            calendararray.push(moment(val.vDisposedDate).format('MM/DD/YYYY'));
                        })
                    ).then(function () {
                        if (JSON.stringify(calendararray) != "[]") {
                            $("#demo2").datepicker("destroy");
                            dates = JSON.stringify(calendararray);
                            dates = String(dates).replace(/"/g, "");
                            dates = String(dates).replace(/]/g, "");
                            dates = String(dates).substr(1);
                            dates = dates.split(',');
                            $('#demo2').datepicker({
                                dateFormat: 'mm/dd/yy',
                                todayBtn: true,
                                beforeShowDay: highlightDays,
                                onSelect: function (date) {
                                    dt = date;
                                    //defined your own method here
                                    if (dt != null) {
                                    }
                                }
                            });
                            $('#demo2').datepicker('setDate', new Date());
                            calendararray = [];
                            closeload();
                            clearInterval(t);
                        }
                    });
                }
            },
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //
        });
    }
    /*Highlight days*/
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
    /*Get calender data*/
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
                        // alert("not found");
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
            function calender(event) {
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', event);
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay,listWeek'
                    },
                    contentHeight: 400,
                    defaultDate: dt,
                    timeFormat: 'h(:mm)a',
                    navLinks: true, // can click day/week names to navigate views
                    //eventLimit: true, // allow "more" link when too many events
                    eventColor: '#1860a3',
                    eventRender: function (event, element) {
                        element.popover({
                            title: '<a style="cursor:pointer" id="transferpageevent" href="javascript:void()" type="' + event.modelid + '" data-val="' + event.eid + '">' + event.title + '</a><button id="ids" data-toggle="popover" type="button" class="close" aria-hidden="true">&times;</button></div>',
                            animation: true,
                            delay: 300,
                            html: true,
                            placement: 'bottom',
                            content: '<p> <btn class="btn btn-default  btn-sm   " data-toggle="modal" value="' + event.eid + '" data-target="#myModal" id="' + event.modelid + '"> Edit</btn>&nbsp;&nbsp;&nbsp;<btn value="' + event.eid + '" class="btn btn-default  btn-sm   " id="' + event.deleteid + '">Delete</btn></p><p><i class="glyphicon glyphicon-briefcase"></i></p><p><a id="transferpage" href="javascript:void()"  data-val="' + event.matterids + '"> ' + event.matternames + '' + '</a></p><p><i class="glyphicon glyphicon-comment"></i>:' + event.description + '</p>',
                            trigger: 'click',
                            container: 'body'
                        });
                    },
                    events: event,
                });
            }
        }
        catch (err) {
            alert(err.message);
        }
    }

    $(document).on('click', '.dhx_month_body', function () {
        var day = $(this).siblings('.dhx_month_head').text().trim();
        var fullDate = $('.dhx_cal_date').text().trim();
        var month = fullDate.split(' ')[0];
        $("#spMonths").html(month);
        $("#spDays").html(day);
    });

    ///////////////////////
    function calenderdata1(callback) {
        setTimeout(function () {
            // and call `resolve` on the deferred object, once you're done
            events1 = [];
            //alert("data");
            console.log("");
            var ajaxTime = new Date().getTime();
            $.ajax({
                async: true,
                type: "POST",
                url: urls2,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var totalTime = new Date().getTime() - ajaxTime;
                    console.log("eventdetails:" + totalTime);
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        if (response.Data != "") {
                            var obj2 = JSON.parse(response.Data);
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        // alert("not found");
                    }
                    $.each(obj2, function (i, v) {
                        var matterid = v.tmatter;
                        var mattername = v.mattername;
                        var contactid = v.tcontact;
                        var contactname = v.fname + " " + v.mname + " " + v.lname;
                        events1.push({
                            title: v.tsubject,
                            description: v.tdetails,
                            start: v.duedate,
                            matterids: matterid,
                            matternames: mattername,
                            contactids: contactid,
                            contactnames: contactname,
                            eid: v.Id,
                            allDay: v.eallday,
                            elink: "/" + fcode + '/Firm/TaskSingleView/' + v.Id,
                            modelid: "modelEditTask",
                            deleteid: "deletetask"
                        });
                    });
                    //calender1(events1);
                },
                error: function (error) {
                    alert('failed');
                }
            });
            function calender1(event) {
                $('#calendar').fullCalendar('addEventSource', event);
                $('#calendar').fullCalendar('gotoDate', dt);
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay,listWeek'
                    },
                    contentHeight: 400,
                    defaultDate: dt,
                    timeFormat: 'h(:mm)a',
                    navLinks: true, // can click day/week names to navigate views
                    eventColor: '#1860a3',
                    events: event
                });
            }
        }, 2000);
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

    //function getMonthName(dateStr) {
    //    const date = new Date(dateStr); // "04/15/2025"

    //    const options = { month: 'long' }; // You can use 'short' for "Apr"
    //    return date.toLocaleString('en-US', options); // Returns "April"
    //}
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