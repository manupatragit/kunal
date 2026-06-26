$(document).ready(function () {
    $.ajax({
        async: true,
        url: '/Client/CalendarViewDataDetail',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data) {
            var strid = "";
            $.each(data, function (i, val) {
                alert(val.id);
                strid += val.Casetype + " " + CaseNo + " " + Caseyear;
            });
        },
        error: function () {
            alert('Error!');
        }
    });
});