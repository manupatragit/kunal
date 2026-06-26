jQuery(document).ready(function () {
    loadworkflowdata();
});
/*Load work flow data*/
function loadworkflowdata() {
    var strtable = '';
    var strheader = '';
    var stritem = '';
    var q1 = 0;
    strtable = $('<table id="example" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
    $.ajax({
        async: true,
        type: 'POST',
        url: '/api/WorkFlowNewApi/WorkFlowNList',
        headers: {
            'fid': 1
        },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                strheader = $('<thead  >').html('<tr>');
                strheader = $('<thead><tr><th class="name">Workflow Name</th><th class="desc">Description</th><th class="desc">CreatedBy</th><th class="desc">Created On</th></tr></thead>');
                strtable.append(strheader);
                stritem = "<tbody>";
                $.each(obj, function (i, val) {
                    q1 = q1 + 1;
                    stritem += '<tr><td ' + q1 + '">' + val.WorkFlowName + '</td><td ' + q1 + '">' + val.WFDescription + '</td><td ' + q1 + '">' + val.UName + '</td><td ' + q1 + '">' + val.CreatedOn + '</td></tr>';
                });
                stritem += "</tbody>";
                strtable.append(stritem);
                $('#wfdata').html(strtable);
            }
            else {
                alert("not found");
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}
