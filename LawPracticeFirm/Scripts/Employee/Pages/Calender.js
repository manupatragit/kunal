/*Open loader */
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader */
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    /*Transfer page event*/
    $(document).on("click", "#transferpageevent", function () {
        var modelid = $(this).attr("type");
        var transferid = $(this).attr("data-val");
        if (String(modelid) == "modelEditEvent") {
            var urls = "/" + fcode + "/Employee/EventSingleView";
            url_redirect({
                url: urls,
                method: "post",
                data: { "token": transferid }
            });
        }
        else if (String(modelid) == "modelEditTask") {
            var urls = "/" + fcode + "/Employee/TaskSingleView";
            url_redirect({
                url: urls,
                method: "post",
                data: { "token": transferid }
            });
        }
    });

    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        var urls = "/" + fcode + "/Employee/MatterSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Delete event by Id*/
    $(document).on("click", "#deleteevent", function () {
        var result = confirm("Are you sure to   delete this Event?");
        if (result) {
            var id = $(this).attr("value");
            var formData = new FormData();
            formData.append("Id", id);
            $.ajax({
                async: true,
                url: '/api/EmployeeApi/RemoveSingleEvent',
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
                        new PNotify({
                            title: 'Warning!',
                            text: ' Sorry ! You are not Authorized to Delete this Event',
                            type: 'error',
                            delay: 2000
                        });
                    }
                },
                error: function () {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Oops ! Please Contact your Administrator',
                        type: 'error',
                        delay: 2000
                    });
                }
            });
        }
        else {
        }
    });
    /*Delete task by Id*/
    $(document).on("click", "#deletetask", function () {
        var result = confirm("Are you sure to   delete this task?");
        if (result) {
            var id = $(this).attr("value");
            var formData = new FormData();
            formData.append("Id", id);
            $.ajax({
                async: true,
                url: '/api/EmployeeApi/RemoveSingleTask',
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
                        new PNotify({
                            title: 'Warning!',
                            text: ' Sorry ! You are not Authorized to Delete this Task',
                            type: 'error',
                            delay: 2000
                        });
                    }
                },
                error: function () {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Oops ! Please Contact your Administrator',
                        type: 'error',
                        delay: 2000
                    });
                }
            });
        }
        else {
        }
    });
    var dt = new Date();
    var urls = "/api/EmployeeApi/LoadEvent";
    var urls2 = "/api/EmployeeApi/LoadTask";
    setInterval(function () {
        var temp = localStorage.getItem("setname");
        if (temp != "") {
            calenderdata();
            calenderdata1();
            localStorage.setItem("setname", "");
        }
    }, 5000);
    if ($("#event").is(":checked")) {
        calenderdata();
    }
    if ($("#task").is(":checked")) {
        calenderdata1();
    }
    /*Event filter*/
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
    /*Task filter*/
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
    });
    $('#demo2').datetimepicker({
        date: new Date(),
        viewMode: 'YMD',
        onDateChange: function () {
            dt = this.getValue();
            if (dt != null) {
                $('#event').prop('checked', true);
                $('#task').prop('checked', true);;
                calenderdata();
                calenderdata1();
            }
        }
    });
    /*Get calender data*/
    function calenderdata() {
        var events = [];
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
                }
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
                        elink: "/" + fcode + '/Employee/EventSingleView/' + eids,
                        modelid: "modelEditEvent",
                        deleteid: "deleteevent"
                    });
                });
                calender(events);
                closeload();
            },
            error: function (error) {
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
                eventColor: '#1860a3',
                eventRender: function (event, element) {
                    element.popover({
                        title: '<a id="transferpageevent" href="javascript:void()" type="' + event.modelid + '" data-val="' + event.eid + '">' + event.title + '</a><button id="ids" data-toggle="popover" type="button" class="close" aria-hidden="true">&times;</button></div>',
                        animation: true,
                        delay: 300,
                        html: true,
                        placement: 'bottom',
                        content: '<p> <btn class="btn btn-default  btn-sm   " data-toggle="modal" value="' + event.eid + '" data-target="#myModal" id="' + event.modelid + '"> Edit</btn><btn value="' + event.eid + '" class="btn btn-default  btn-sm   " id="' + event.deleteid + '">Delete</btn></p><p><i class="glyphicon glyphicon-briefcase"></i><a id="transferpage" href="javascript:void()"  data-val="' + event.matterids + '"> ' + event.matternames + '' + '</a></p><p><i class="glyphicon glyphicon-comment"></i>::' + event.description,
                        trigger: 'click',
                        container: 'body'
                    });
                },
                events: event,
            });
        }
    }
    function calenderdata1() {
        var events1 = [];
        $.ajax({
            async: true,
            type: "POST",
            url: urls2,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj2 = JSON.parse(response.Data);
                }
                else {
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
                        elink: "/" + fcode + '/Employee/TaskSingleView/' + v.Id,
                        modelid: "modelEditTask",
                        deleteid: "deletetask"
                    });
                });
                calender1(events1);
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