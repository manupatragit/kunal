$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    loadtabledata();
    /*Search data
    load table data*/
    function loadtabledata() {
        //openload();
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" class="sortable" sort="desc" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('<tr>');
        $head1 = $('<th>S.NO.</th><th class="fname" id="facility_header">Case</th><th class="cname" id="">Court</th><th class="cstatus">Case name</th><th class="auser">Bench name</th><th class="odate">Advocate</th><th class="cdate">Next hearing</th><th class="casedetails">Disposed Date</th><th class="casedetails">Status</th> ');
        $header.append($head1);
        $table.append($header);
        var fcode = localStorage.getItem("FirmCode");
        $.ajax({
            async: true,
            url: '/Employee/CaseViewDataDetail',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: {
                'search': $('#searchdata').val()
            },
            dataType: 'json',
            success: function (response) {
                var datas = JSON.stringify(response);
                alert(datas);
                var t = 0;
                $.each(response, function (i, val) {
                    t = t + 1;
                    var $row = $('<tr />');
                    $row.append($('<td class="" />').html("<span>&nbsp;" + t));
                    $row.append($('<td class="fname" />').html("<a style='cursor:pointer' onclick='loadcasedata()'><span>" + (val.Csno != null ? val.Csno : '')));
                    $row.append($('<td class="cname" />').html("<span><span>" + (val.Courtname != null ? val.Courtname : '')));
                    $row.append($('<td class="cstatus" />').html("<span>" + (val.Casename != null ? val.Casename : '</a>')));
                    $row.append($('<td class="auser" />').html("<span>" + (val.Benchname != null ? val.Benchname : '</a>')));
                    $row.append($('<td class="auser" />').html("<span>" + (val.Advname != null ? val.Advname : '</a>')));
                    $row.append($('<td class="auser" />').html("<span>" + (val.Nexthearing != null ? val.Nexthearing : '</a>')));
                    $row.append($('<td class="auser" />').html("<span>" + (val.Disposeddt != null ? val.Disposeddt : '</a>')));
                    $row.append($('<td class="auser" />').html("<span>" + (val.Status != null ? val.Status : '</a>')));
                    $table.append($row);
                });
                $('#updatePanel').html($table);
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    function hideEmptyCols(table) {
        var numCols = $("th", table).length;
        for (var i = 1; i <= 24; i++) {
            var empty = true;
            $("td:nth-child(" + i + ")", table).each(function (index, el) {
                if ($("span", el).text() != "") {
                    empty = false;
                    return false; //break out of each() early
                }
            });
            if (empty) {
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
            }
        }
    }
});
