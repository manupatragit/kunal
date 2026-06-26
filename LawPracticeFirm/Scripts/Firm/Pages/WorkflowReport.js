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
    strtable = $('<table id="example"  border="1px solid" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
    $.ajax(
        {
            type: "POST",
            url: "/api/WorkFlowNewApi/WorkflowTaskDetail", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: 'application/json;charset=utf-8',
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    strheader = $('<thead><tr><th bgcolor="DIMGRAY" class="name">Workflow Name</th><th bgcolor="DIMGRAY" class="name">Description</th><th bgcolor="DIMGRAY" class="desc">Created On</th><th bgcolor="DIMGRAY" class="task">Task</th><th bgcolor="DIMGRAY"class="desc">Task Detail</th><th bgcolor="DIMGRAY" class="desc">Task Due On</th></tr></thead>');
                    strtable.append(strheader);
                    stritem = "<tbody>";
                    $.each(obj, function (i, val) {
                        stritem += '<tr id="opendata" dataval="' + enctype(val.id) + '" style="cursor:pointer"><td class="taskid" id=' + enctype(val.id) + ' >' + val.WorkFlowName + '</td><td>' + val.WFDescription + '</td><td>' + formatDatetoIST(val.CreatedOn) + '</td><td ' + q1 + '">' + val.Task + '</td><td ' + q1 + '">' + val.TaskDescription + '</td><td ' + q1 + '">' + formatDatetoIST(val.DueDate) + '</td></td></tr>';
                        stritem += '<tr><td colspan=6><div id=div' + enctype(val.id) + '></td></tr>';
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
$(document).on("click", "#opendata", function () {
    GetStageDetailBytaskid($(this).attr("dataval"));
});
function GetStageDetailBytaskid(strtaskid) {
    var strdivid = '#div' + strtaskid;
    var formData = new FormData();
    var strheader1 = '';
    var stritem1 = '';
    var c1 = 0;
    var strtable1 = '';
    formData.append("strtid", strtaskid);
    strtable1 = $('<table border="1px solid" id=divstage' + strtaskid + ' style="overflow-x:auto;width:95%; border:2px solid #204D74" align="center" /><tr><th>').addClass('dataTable table table-bordered table-striped');
    $.ajax(
        {
            type: "POST",
            url: "/api/WorkFlowNewApi/WorkflowStageDetail", // Controller/View
            dataType: 'json',
            data: formData,
            headers: { tskid: dtoe(strtaskid) },
            contentType: 'application/json;charset=utf-8',
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    strheader1 = $('<thead><tr><th class="Collapseheader">User</th><th class="Collapseheader">Created On</th><th class="Collapseheader">Status</th><th class="Collapseheader">Due Date</th><th class="Collapseheader">Stage</th><th class="Collapseheader">Stage Name</th><th class="Collapseheader">Updated On <div style=float:right;cursor:pointer><span class="glyphicon glyphicon-remove"  id="closelist" dataval="' + strtaskid + '" onclick="Hidediv(' + strtaskid + ')"/></span></div></th></tr></thead>');
                    strtable1.append(strheader1);
                    stritem1 = "<tbody>";
                    $.each(obj, function (i, val) {
                        var strupdatedon = val.UpdatedOn == null ? '' : formatDatetoIST(val.UpdatedOn);
                        var strCreatedon = val.Createdon == null ? '' : formatDatetoIST(val.Createdon);
                        var strDueDate = val.DueDate == null ? '' : formatDatetoIST(val.DueDate);
                        stritem1 += '<tr><td class="taskid" ' + val.id + '">' + val.username + '</td><td>' + strCreatedon + '</td><td>' + val.StatusText + ' <br>' + val.Remark + '</td><td>' + strDueDate + '</td><td ' + c1 + '">' + val.stage + '</td><td ' + c1 + '">' + val.stagetext + '</td><td ' + c1 + '">' + strupdatedon + '</td></td></tr>';
                    });
                    stritem1 += "</tbody>";
                    strtable1.append(stritem1);
                    $(strdivid).html(strtable1);
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
/*Load user*/
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
                alert("not found");
            }
            $.each(obj, function (i, a) {
                var option = '<option value="' + a["Id"] + '" > ' + a["UserName"] + '</option>';
                $("#drpuserlist1").append(option);
            });
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
