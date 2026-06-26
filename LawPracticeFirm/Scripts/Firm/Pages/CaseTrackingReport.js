$(document).ready(function () {
    GetDataByNoticeStatus();
});
/*Get data by notice status*/
function GetDataByNoticeStatus() {
    var statusname = [];
    var statuscount = [];
    var html = '';
    var superemecourt = 0;
    var higcourt = 0;
    var distirictcourt = 0;
    var tribunal = 0;
    var addcout = 0;
    var formdata = new FormData();
    openload();
    $.ajax({
        type: "POST",
        url: "/CW/MykaseCourtCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response).each(function (key, value) {
                if (value.Court == "" || value.Court == null || value.Court == "null") {
                }
                else {
                    statusname.push(value.Court);
                    statuscount.push(value.Totals);
                    html += '<tr><td>' + value.Court + '</td><td><p>' + value.Totals + '</p></td></tr>'
                }
            });
            $("#tblbodystatusofnotice").html(html)
            closeload();
        },
        failure: function (response) {
            alert("Something Went Wrong");
            closeload();
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
                // text: 'Status of Notice'
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
/*Rotate card*/
function rotateCard(btn) {
    var $card = $(btn).closest('.card-container');
    if ($card.hasClass('hover')) {
        $card.removeClass('hover');
    } else {
        $card.addClass('hover');
    }
}
/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
