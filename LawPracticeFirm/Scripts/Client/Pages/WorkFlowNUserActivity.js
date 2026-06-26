jQuery(document).ready(function () {
    loadactdata();
    setInterval(function () {
        var temp = localStorage.getItem("wfstgupdate");
        if (temp != "") {
            $('#wfdata').html('');
            loadactdata();
            localStorage.setItem("wfstgupdate", "");
        }
    }, 3000
    );
});
/*Load assign work flow task details*/
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
            url: "/api/WorkFlowNewApi/AssignWorkflowTaskDetail", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: 'application/json;charset=utf-8',
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    strheader = $('<thead><tr><th class="name">Workflow Name</th><th class="name">Description</th><th class="desc">Created On</th><th class="task">Task</th><th class="desc">Task Detail</th><th class="desc">Task Due On </th></tr></thead>');
                    strtable.append(strheader);
                    stritem = "<tbody>";
                    $.each(obj, function (i, val) {
                        stritem += '<tr onclick=\"GetStageDetailBytaskid(' + val.taskid + ')\" style="cursor:pointer"><td class="taskid" id=' + val.id + ' >' + val.WorkFlowName + '</td><td>' + val.WFDescription + '</td><td>' + formatDatetoIST(val.CreatedOn) + '</td><td ' + q1 + '">' + val.Task + '</td><td ' + q1 + '">' + val.TaskDescription + '</td><td ' + q1 + '">' + formatDatetoIST(val.DueDate) + '</td></td></tr>';
                        stritem += '<tr><td colspan=6><div id=div' + val.taskid + '></td></tr>';
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
/*Get Stage Detail By task id*/
function GetStageDetailBytaskid(strtaskid) {
    var strdivid = '#div' + strtaskid;
    var formData = new FormData();
    var strtable = '';
    var strheader = '';
    var stritem = '';
    var q1 = 0;
    strtable = $('<table id=divstage' + strtaskid + ' style="overflow-x:auto;width:95%; border:2px solid #204D74" align="center" /><tr><th>').addClass('dataTable table table-bordered table-striped');
    $.ajax(
        {
            type: "POST",
            url: "/api/WorkFlowNewApi/WorkflowTaskList", // Controller/View
            dataType: 'json',
            data: formData,
            headers: { 'uid': '1', 'taskid': strtaskid },
            contentType: 'application/json;charset=utf-8',
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    strheader = $('<thead><tr><th class="Collapseheader">Workflow Name</th><th class="Collapseheader">Previous Stage Status</th><th class="Collapseheader">Action</th><th class="Collapseheader">Current Status</th><th class="Collapseheader">Current Updated On</th><th class="Collapseheader">Task Stage</th><th class="Collapseheader">Task</th><th class="Collapseheader">Task Detail</th><th class="Collapseheader">Task Due On <div style=float:right;cursor:pointer><span class="glyphicon glyphicon-remove"  onclick="Hidediv(' + strtaskid + ')"/></span></div></th></tr></thead>');
                    strtable.append(strheader);
                    stritem = "<tbody>";
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        var strupdatedon = val.UpdatedOn == null ? '' : formatDatetoIST(val.UpdatedOn);
                        if (val.PreviousStageStatus == "Pending" && val.stage != "1") {
                            stritem += '<tr><td ' + q1 + '">' + val.WorkFlowName + '</td><td ' + q1 + '">' + val.PreviousStageStatus + '</td><td ' + q1 + '">' + val.stagetext + '</td><td>' + val.StatusText + '</td><td>' + strupdatedon + '</td><td ' + q1 + '">' + val.stage + '</td><td ' + q1 + '">' + val.TaskItem + '</td><td ' + q1 + '">' + val.TaskDescription + '</td><td ' + q1 + '">' + formatDatetoIST(val.DueDate) + '</td></tr>';
                        }
                        else if (val.PreviousStageStatus == "Re-Open" && val.stage == "1") {
                            stritem += '<tr><td ' + q1 + '">' + val.WorkFlowName + '</td><td ' + q1 + '">' + val.PreviousStageStatus + '</td><td ' + q1 + '">' + val.stagetext + '</td><td>' + val.StatusText + '</td><td>' + strupdatedon + '</td><td ' + q1 + '">' + val.stage + '</td><td ' + q1 + '">' + val.TaskItem + '</td><td ' + q1 + '">' + val.TaskDescription + '</td><td ' + q1 + '">' + formatDatetoIST(val.DueDate) + '</td></tr>';
                        }
                        else {
                            if (val.status == "3") {
                                stritem += '<tr><td ' + q1 + '">' + val.WorkFlowName + '</td><td ' + q1 + '">' + val.PreviousStageStatus + '</td><td ' + q1 + '">' + val.stagetext + '</td><td>' + val.StatusText + '</td><td>' + strupdatedon + '</td><td ' + q1 + '">' + val.stage + '</td><td ' + q1 + '">' + val.TaskItem + '</td><td ' + q1 + '">' + val.TaskDescription + '</td><td ' + q1 + '">' + formatDatetoIST(val.DueDate) + '</td></tr>';
                            }
                            else {
                                stritem += '<tr><td ' + q1 + '">' + val.WorkFlowName + '</td><td ' + q1 + '">' + val.PreviousStageStatus + '</td><td ' + q1 + '"><a href="#" id="opentrigger" valf="' + enctypesingle(val.frmid) + '" vals="' + val.stage + '" valt="' + enctypesingle(val.TaskId) + '" vali="' + enctypesingle(val.id) + '" valfo="' + enctypesingle(val.FormId) + '" valw="' + enctypesingle(val.wfid) + '"  >' + val.stagetext + '</a></td><td>' + val.StatusText + '</td><td>' + strupdatedon + '</td><td ' + q1 + '">' + val.stage + '</td><td ' + q1 + '">' + val.TaskItem + '</td><td ' + q1 + '">' + val.TaskDescription + '</td><td ' + q1 + '">' + formatDatetoIST(val.DueDate) + '</td></tr>';
                            }
                        }
                    });
                    stritem += "</tbody>";
                    strtable.append(stritem);
                    $(strdivid).html(strtable);
                    $("#totstage").val("");
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
/*Load user details*/
function loadUser() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/WorkFlowNewApi/GetTaskStatus",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
            }
            $.each(obj, function (i, a) {
                var option = '<option value="' + a["Id"] + '" > ' + a["UserName"] + '</option>';
                $("#drpuserlist1").append(option);
            });
            //End of foreach Loop
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
function Hidediv(strdivid) {
    var strdivid = '#divstage' + strdivid;
    $(strdivid).hide();
}
$(document).on("click", "#closelist", function () {
    Hidediv($(this).attr("dataval"));
});
$(document).on("click", "#opentrigger", function () {
    openfrmswin($(this).attr("valf"), $(this).attr("vals"), $(this).attr("valt"), $(this).attr("vali"), $(this).attr("valfo"), $(this).attr("valw"));
});