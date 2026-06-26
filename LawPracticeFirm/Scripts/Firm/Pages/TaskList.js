jQuery(document).ready(function () {
    loadactdata();
});
/*Load act data*/
function loadactdata() {
    var formData = new FormData();
    var strtable = '';
    var strheader = '';
    var stritem = '';
    var q1 = 0;
    strtable = $('<table id="example" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
    $.ajax(
        {
            type: "POST",
            url: "/api/WorkFlowNewApi/TaskList", // Controller/View
            dataType: 'json',
            data: formData,
            headers: { uid: '1' },
            contentType: 'application/json;charset=utf-8',
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    strheader = $('<thead><tr><th class="name">Task</th><th class="name">Status</th><th class="name">Description</th><th class="name">Due Date</th></tr></thead>');
                    strtable.append(strheader);
                    stritem = "<tbody>";
                    $.each(response.Data, function (i, val) {
                        q1 = q1 + 1;                        
                        stritem += '<tr><td ' + q1 + '"><a href="#" onclick="UpdateStatus('+val.Id+')"> ' + val.tsubject + '</a></td><td ' + q1 + '">' + val.tstatus + '</td><td>' + val.tdetails + '</td><td>' + val.duedate + '</td></tr>';
                    });
                    stritem += "</tbody>";
                    strtable.append(stritem);
                    $('#wfdata').html(strtable);
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
/*Update stage status*/
function UpdateStageStatus() {
    $.ajax(
        {
            type: "POST",
            url: "/api/WorkFlowNewApi/UpdateStageStatus", // Controller/View
            dataType: 'json',
            data: formData,
            headers: { tskid: $("#hidtaskid").val() },
            contentType: false,
            processData: false,
            success: function (data) {
                $("#saveworkflow")[0].reset();
                new PNotify({
                    title: 'Success!',
                    text: ' Stage Added Successfully',
                    type: 'success',
                    delay: 3000
                });
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}  
