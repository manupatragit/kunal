var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var eventDates = [];
const options = {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
};
$(document).ready(function () {
    GetDataByNoticeStatus();
    GetNoticeType();
    GetNoticeSent();
    GetNoticeSubject();
    if (roleids == 3) {
        $("#sentnoticeheader").html("Received Notice")
    }
    GetAllNoticeCount();
    Getdatelistforduedate();
    $("#divdatetimepicker").datepicker({
        showOn: "both",
        buttonImageOnly: true,
        buttonImage: "calendar.gif",
        buttonText: "Calendar",
        beforeShowDay: highlightDays,
        onSelect: function (date) {
            dt = date;
            //defined your own method here
            if (dt != null) {
                GetNoticeListByNotifyDate(dt);
            }
        }
    });
});
function rotateCard(btn) {
    var $card = $(btn).closest('.card-container');
    if ($card.hasClass('hover')) {
        $card.removeClass('hover');
    } else {
        $card.addClass('hover');
    }
}
/*Get Notify high lighted date*/
var dates = "";
function Getdatelistforduedate() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/GetNotifyhighlighteddate",
        dataType: 'json',
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            var html = "";
            if (response.Data.length > 0) {
                $.each(response.Data, function (i, a) {
                    eventDates.push(moment(a).format('MM/DD/YYYY'));
                    const formattedDate = moment(a).format('dddd MMM DD, YYYY');

                    html += `
                            <div class="selected-date">
                            <div class="text58">${formattedDate}</div>
                            <div class="events">
                                <div class="calendar-eventmonth-view4">
                                    <div class="text-and-time">
                                        <div class="event">
                                            Notice Due Date
                                            <div class="time"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
                })
                $("#divcalendardata").empty().append(html);
                dates = JSON.stringify(eventDates);
                dates = String(dates).replace(/"/g, "");
                dates = String(dates).replace(/]/g, "");
                dates = String(dates).substr(1);
                dates = dates.split(',');
            }
        }

    })
}
function highlightDays(date) {
    debugger
    for (var i = 0; i < dates.length; i++) {
        if (new Date(dates[i]).toString() == date.toString()) {
            return [true, 'highlight'];
        }

    }
    return [true, ''];
}
/*Get Notice List By Notify Date*/
function GetNoticeListByNotifyDate(dt) {
    $("#schedulednoticemodal").modal('show');
    $("#bindnoticelist").html("");
    var html = "";
    var recentdate = dt.split("/");
    var recentdate1 = recentdate[0] + "/" + recentdate[1] + "/" + recentdate[2]
    var formdata = new FormData();
    formdata.append("notifydate", EncodeText(recentdate1));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/GetNoticeListByNotifyDate",
        dataType: 'json',
        contentType: false,
        data: formdata,
        processData: false,
        async: false,
        success: function (response) {
            $.each(response.Data, function (i, a) {
                html += "<tr>";
                if (String(a.SendersName) != "") {
                    html += "<td  class='SendersName'>" + a.SendersName + "</td>";
                }
                else {
                    html += "<td  class='SendersName'>" + a.AddresseeAddress + "</td>";
                }
                if (a.AddressedTo != "") {
                    html += "<td  class='AddressedTo'>" + a.AddressedTo + "</td>";
                }
                else {
                    html += "<td  class='AddressedTo'>" + a.RejoinderAddressedto + "</td>";
                }
                if (a.NoticeSubject != "") {
                    html += "<td  class='NoticeSubject'>" + a.NoticeSubject + "</td>";
                }
                else {
                    html += "<td  class='NoticeSubject'>" + a.RejoinderSubject + "</td>";
                }
                html += "<td  class='NoticeTitle'>" + a.NoticeTitle + "</td>";
                html += "<td  class='Criticality'>" + a.Criticality + "</td>";
                html += "<td  class='typeofnotice'>" + a.TypeofNotice + "</td>";
                html += "</tr>";
            })
            $("#bindnoticelist").append(html);
        }
    })
}
function checkformoredetail(noticeid) {
    window.location.href = "/NoticeNew/ScheduleActivity";
    sessionStorage.setItem("schedulenoticeid", noticeid);
}
/*Get all notice count*/
function GetAllNoticeCount() {
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeDataCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            console.log(response, "kkkk")
            if (response != null) {
                $("#lblnewnoticecount").html(response.Data.NewNoticeCount);
                $("#lblreplynoticecount").html(response.Data.ReplyCount);
                $("#lblBulknoticecount").html(response.Data.BulkNoticeSentTodayCount);
                $("#lblBulknoticereceivecount").html(response.Data.BulkNoticeReceiveTodayCount);
            }
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
}
/*Get notice status details for notice dashboard*/
function GetDataByNoticeStatus() {
    var statusname = [];
    var statuscount = [];
    var html = '';
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeStatusCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response.Data).each(function (key, value) {
                if (value.CaseStatus == "" || value.CaseStatus == null || value.CaseStatus == "null") {
                }
                else {
                    statusname.push(value.CaseStatus);
                    statuscount.push(value.StatusCount);
                    html += '<tr><td>' + value.CaseStatus + '</td><td><p>' + value.StatusCount + '</p></td></tr>'
                }
            });
            $("#tblbodystatusofnotice").html(html)
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
    var chartDiv = $("#barChartNoticeStatus");
    var myChart = new Chart(chartDiv, {
        type: 'doughnut',
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
        }
    });
}
/*Get notice status type for dashboard*/
function GetNoticeType() {
    var NoticeType = [];
    var NoticeTypeCount = [];
    var html = '';
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeTypeCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response.Data).each(function (key, value) {
                NoticeType.push(value.NoticeType);
                NoticeTypeCount.push(value.NoticeTypeCount);
                html += '<tr><td>' + value.NoticeType + '</td><td><p>' + value.NoticeTypeCount + '</p></td></tr>'
            });
            $("#tblbodytypeofnotice").html(html);
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
}
/*Get sent notice count details*/
function GetNoticeSent() {
    var senttomanager = "";
    var senttoclient = "";
    var html = '';
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeSentCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            senttomanager = response.Data[0].length == 0 ? 0 : response.Data[0][0].SentToManagerCount;
            senttoclient = response.Data[1].length == "undefined" || response.Data[1].length == 0 ? 0 : response.Data[1][0].SentToClientCount;
            html += '<tr><td>With Team Member</td><td><p>' + senttomanager + '</p></td></tr>'
            html += '<tr><td>With Client</td><td><p>' + senttoclient + '</p></td></tr>'
            $("#tblbodysentnotice").html(html);
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
    var chartDiv = $("#barChartNoticeSent");
    var myChart = new Chart(chartDiv, {
        type: 'doughnut',
        data: {
            labels: ["Sent To Manager", "Sent To Client"],
            datasets: [
                {
                    data: [senttomanager, senttoclient],
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
        }
    });
}

/*Get notice subject details*/
function GetNoticeSubject() {
    var NoticeSubject = [];
    var NoticeSubjectCount = [];
    var html = '';
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeSubjectCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response.Data).each(function (key, value) {
                if (value.NoticeSubject != null) {
                    NoticeSubject.push(value.NoticeSubject);
                    NoticeSubjectCount.push(value.NoticeTypeCount);
                    html += '<tr><td>' + value.NoticeSubject + '</td><td><p>' + value.NoticeTypeCount + '</p></td></tr>'
                }
            });
            $("#tblbodysubjectofnotice").html(html);
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
    var chartDiv = $("#barChartNoticesubject");
    var myChart = new Chart(chartDiv, {
        type: 'doughnut',
        data: {
            labels: NoticeSubject,
            datasets: [
                {
                    data: NoticeSubjectCount,
                    backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#1CC1EA", "#DDF49F", "#31EA1C", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#1C45EA", "#1CEA9F", "#1C9FEA", "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D", "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A", "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC", "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC", "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399", "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680", "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933", "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3", "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"]
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
        }
    });
}

/*Get notice subject count details*/
function GetNoticeSubject1() {
    var NoticeSubject = [];
    var NoticeSubjectCount = [];
    var html = '';
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeSubjectCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response.Data).each(function (key, value) {
                if (value.NoticeSubject != null) {
                    NoticeSubject.push(value.NoticeSubject);
                    NoticeSubjectCount.push(value.NoticeTypeCount);
                    html += '<tr><td>' + value.NoticeSubject + '</td><td><p>' + value.NoticeTypeCount + '</p></td></tr>'
                }
            });
            $("#tblbodysubjectofnotice").html(html);
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
    var chartDiv = $("#barChartNoticesubject");
    var myChart = new Chart(chartDiv, {
        type: 'bar',
        data: {
            labels: NoticeSubject,
            datasets: [
                {
                    data: NoticeSubjectCount,
                    backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F"]
                }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
                responsive: true,
            },
            legend: {
                display: false,
                position: 'top',
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
$(document).on('click', '#chart_55front', function () {
    $("#chart_55back").show();
    return false;
});

$(document).on('click', '#chart_55back', function () {
    $("#chart_55back").hide();
    return false;
});

$(document).on('click', '#chart_56front', function () {
    $("#chart_56back").show();
    return false;
});

$(document).on('click', '#chart_56back', function () {
    $("#chart_56back").hide();
    return false;
});
$(document).on('click', '#chart_57front', function () {
    $("#chart_57back").show();
    return false;
});

$(document).on('click', '#chart_57back', function () {
    $("#chart_57back").hide();
    return false;
});