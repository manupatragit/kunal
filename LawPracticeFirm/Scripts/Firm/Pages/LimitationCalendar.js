/**Open loader */
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");

    setInterval(function () {
        try {
            var temp = localStorage.getItem("setname");
            if (temp != "") {
                localStorage.setItem("setname", "");
            }
        }
        catch (err) {
            alert(err.message);
        }
    }, 3000);

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
    ////task filter
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
    loadcdata();
    function loadcdata() {
    }
    $('#demo2').datepicker();
    $('#demo2').datepicker('setDate', new Date());
    calendararray = [];
    var count = 0;
    function binddatepicker() {
        $.ajax({
            async: true,
            url: "/firm/CaseCalendarDatepicker",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                chartarray4 = [];
                chartcount4 = [];
                var dataT = "";
                var dataT2 = "";
                var htul = '';
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
                                    alert(dt);
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
        });
    }
    function highlightDays(date) {
        for (var i = 0; i < dates.length; i++) {
            if (new Date(dates[i]).toString() == date.toString()) {
                return [true, 'highlight'];
            }
        }
        return [true, ''];
    }
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
                        var obj1 = JSON.parse(response.Data);
                    }
                    else {
                        // alert("not found");
                    } $.when(
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
                        //   alert(datas);
                        var obj2 = JSON.parse(response.Data);
                    }
                    else {
                        // alert("not found");
                    }
                    $.each(obj2, function (i, v) {
                        // alert(v.tsubject);
                        //calendararray.push(moment(v.duedate).format('MM/DD/YYYY'));
                        var matterid = v.tmatter;
                        var mattername = v.mattername;
                        var contactid = v.tcontact;
                        var contactname = v.fname + " " + v.mname + " " + v.lname;
                        events1.push({
                            title: v.tsubject,
                            description: v.tdetails,
                            start: v.duedate,
                            //end: newedate,
                            matterids: matterid,
                            matternames: mattername,
                            contactids: contactid,
                            contactnames: contactname,
                            //color: v.ecolor,
                            eid: v.Id,
                            allDay: v.eallday,
                            elink: "/" + fcode + '/Firm/TaskSingleView/' + v.Id,
                            modelid: "modelEditTask",
                            deleteid: "deletetask"
                        });
                        // alert(JSON.stringify(events.title);
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
});
var eventsdata = [];
eventsdata.push({
    title: "hi",
    modelid: "modelEditTask",
    deleteid: "deletetask"
});
//alert(JSON.stringify(eventsdata));
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
