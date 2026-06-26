var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var eventDates = [];
$(document).ready(function () {
    GetDataByNoticeStatus();
    GetNoticeType();
    GetNoticeSent();
    if (userDetails.RoleId == 3) {
        $("#sentnoticeheader").html("Received Notice")
    }
    GetAllNoticeCount();
    Getrecentactivitydata();
    Getdatelistforduedate();
    $("#divdatetimepicker").datepicker({
        showOn: "both",
        buttonImageOnly: true,
        buttonImage: "calendar.gif",
        buttonText: "Calendar",
        beforeShowDay: function (date) {
            var highlight = eventDates[date];
            if (highlight) {
                return [true, "event", 'Response due date.'];
            } else {
                return [true, '', ''];
            }
        },
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

/*Get date list for due date*/
function Getdatelistforduedate() {
    $.ajax({
        type: "POST",
        url: "/api/Home/GetNotifyhighlighteddate",
        dataType: 'json',
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            if (response.length > 0) {
                $.each(response, function (i, a) {
                    eventDates[new Date(a)] = new Date(a);
                })
            }
        }
    })
}

/*Get notice list by notify date*/
function GetNoticeListByNotifyDate(dt) {
    $("#schedulednoticemodal").modal('show');
    $("#bindnoticelist").html("");
    var html = "";
    var recentdate = dt.split("/");
    var recentdate1 = recentdate[1] + "/" + recentdate[0] + "/" + recentdate[2]
    var formdata = new FormData();
    formdata.append("notifydate", recentdate1);
    $.ajax({
        type: "POST",
        url: "/api/Home/GetNoticeListByNotifyDate",
        dataType: 'json',
        contentType: false,
        data: formdata,
        processData: false,
        async: false,
        success: function (response) {
            $.each(response, function (i, a) {
                html += "<tr  onclick=checkformoredetail('" + a.NoticeID + "') style='cursor:pointer;' title='Click for more details'>";
                html += "<td  class='SendersName'>" + a.SendersName + "</td>";
                html += "<td  class='AddressedTo'>" + a.AddressedTo + "</td>";
                html += "<td  class='NoticeSubject'>" + a.NoticeSubject + "</td>";
                html += "<td  class='NoticeTitle'>" + a.NoticeTitle + "</td>";
                html += "<td  class='Criticality'>" + a.Criticality + "</td>";
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
    formdata.append("LoginUserId", userDetails.Id);
    formdata.append("RoleId", userDetails.RoleId);
    $.ajax({
        type: "POST",
        url: "/api/Home/NoticeDataCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            if (response != null) {
                $("#lblnewnoticecount").html(response.NewNoticeCount);
                $("#lblreplynoticecount").html(response.ReplyCount);
                $("#lblrejoindercount").html(response.RejoinderCount);
                $("#lblsharedtomecount").html(response.SharedToMeCount);
            }
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
}
/*Get recent activity data*/
function Getrecentactivitydata() {
    var formdata = new FormData();
    formdata.append("RoleId", userDetails.RoleId);
    formdata.append("CreatedBy", userDetails.Id);
    formdata.append("ReceiverId", userDetails.Id);
    $.ajax({
        type: "POST",
        url: "/api/Home/GetNotificationAlertById",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            if (response.length > 0) {
                $.each(response, function (i, a) {
                    $("#loadractivity").append(
                        `<ul class="notification"><li class="recent">
                         <span  style="color:black; font-size:10px;padding:0 0 0 6px; width:100%;"
                         title="Please take action against notice - Subject: ('`+ a.NoticeSubject + `')">` + a.Message + ' ' + a.CreateDate + `</span>
					     </li></ul>`)
                })
            }
            else {
                $("#loadractivity").append('<p style="color:blue;text-align:center">No Item to view.</p>')
            }
        },
        failure: function (response) {
            alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        }//End of AJAX error function
    });
}

/*Get data by notice status*/
function GetDataByNoticeStatus() {
    var statusname = [];
    var statuscount = [];
    var html = '';
    var formdata = new FormData();
    formdata.append("LoginUserId", userDetails.Id);
    formdata.append("RoleId", userDetails.RoleId);
    $.ajax({
        type: "POST",
        url: "/api/Home/NoticeStatusCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response).each(function (key, value) {
                statusname.push(value.CaseStatus);
                statuscount.push(value.StatusCount);
                html += '<tr><td>' + value.CaseStatus + '</td><td>' + value.StatusCount + '</td></tr>'
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
                    backgroundColor: [
                        "#f9bf39", "#3bc1e6", "#ff7ab5", "#5c31bf", "#b7e666",
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED",
                        "#36A2EB"
                    ]
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                responsive: true,
                // text: 'Status of Notice'
            },
            legend: {
                display: true,
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
function GetNoticeType() {
    var NoticeType = [];
    var NoticeTypeCount = [];
    var html = '';
    var formdata = new FormData();
    formdata.append("LoginUserId", userDetails.Id);
    formdata.append("RoleId", userDetails.RoleId);
    $.ajax({
        type: "POST",
        url: "/api/Home/NoticeTypeCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response).each(function (key, value) {
                NoticeType.push(value.NoticeType);
                NoticeTypeCount.push(value.NoticeTypeCount);
                html += '<tr><td>' + value.NoticeType + '</td><td>' + value.NoticeTypeCount + '</td></tr>'
            });
            $("#tblbodytypeofnotice").html(html);
        },
        failure: function (response) {
            alert("Something Went Wrong")
        }
    });
    var chartDiv = $("#barChartNoticeType");
    var myChart = new Chart(chartDiv, {
        type: 'doughnut',
        data: {
            labels: NoticeType,
            datasets: [
                {
                    data: NoticeTypeCount,
                    //  data: [21, 39, 10, 14, 16],
                    backgroundColor: [
                        "#f9bf39", "#3bc1e6", "#ff7ab5", "#5c31bf", "#b7e666",
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED",
                        "#36A2EB"
                    ]
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                responsive: true,
                // text: 'Type  of Notice'
            },
            legend: {
                display: true,
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

/*Get sent notice*/
function GetNoticeSent() {
    var senttomanager = "";
    var senttoclient = "";
    var html = '';
    var formdata = new FormData();
    formdata.append("LoginUserId", userDetails.Id);
    formdata.append("RoleId", userDetails.RoleId);
    $.ajax({
        type: "POST",
        url: "/api/Home/NoticeSentCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            senttomanager = response[0].length == 0 ? 0 : response[0][0].SentToManagerCount;
            senttoclient = response[1].length == "undefined" || response[1].length == 0 ? 0 : response[1][0].SentToClientCount;
            html += '<tr><td>Sent To Manager</td><td>' + senttomanager + '</td></tr>'
            html += '<tr><td>Sent To Client</td><td>' + senttoclient + '</td></tr>'
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
                    backgroundColor: [
                        "#f9bf39", "#3bc1e6", "#ff7ab5", "#5c31bf", "#b7e666",
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED",
                        "#36A2EB"
                    ]
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
                display: true,
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