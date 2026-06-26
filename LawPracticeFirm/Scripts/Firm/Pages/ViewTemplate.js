$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    loadtabledata();
    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });

    //load table data
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" class="sortable" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('<tr>');
        $head1 = $('<th>S.No.</th><th class="matter">Title <span class="fa fa-sort "></span> </th><th class="date">Date <span class="fa fa-sort "></span></th><th class="dwonload">Download <span class="fa fa-sort "></span></th> ');
        $header.append($head1);
        $tbc = $('</tr>');
        $header.append($tbc);
        $table.append($header);
        var fcode = localStorage.getItem("FirmCode");
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadTemplateData',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                }
                else {
                    $("#datastatus").html("No result found !");
                }
                var it = 2;
                var qty = 0;
                $.each(obj, function (i, val) {
                    qty = qty + 1;
                    it = it + 1;
                    var $row = $('<tr />');
                    $row.append($('<td width="50px;" class="s" />').html("<span>" + qty + ""));
                    $row.append($('<td class="item" />').html("<span>" + (val.tname != "" ? val.tname : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="date" />').html("<span>" + (val.date_time != "" ? val.date_time.substring(0, 10) : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="contact" />').html("<a download='" + val.tname + "' class=='btn btn - success' href='/Template/" + val.firmid + "/" + val.firmuser + "/" + val.tfile + "'> <span>Download</a>"));
                    $table.append($row);
                    $table.append($row);
                });
                $('#updatePanel').html($table);
                closeload();
                hideEmptyCols($("#example"));
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    function hideEmptyCols(table) {
        //counti # of columns
        var numCols = $("th", table).length;
        for (var i = 1; i <= 24; i++) {
            var empty = true;
            //grab all the <td>'s of the column at i
            $("td:nth-child(" + i + ")", table).each(function (index, el) {
                //check if the <span> of this <td> is empty
                if ($("span", el).text() != "") {
                    empty = false;
                    return false; //break out of each() early
                }
            });
            if (empty) {
                //if()
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
                // $("th:nth-child(" + i + ")", table).hide(); //hide header <th>
            }
        }
    }
    var q = 2;
    loadmenu();
    /*Load menu*/
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/Demo/SpColMaps1',
            headers: {
                'fid': type
            },
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
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                var options = [];
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $("#example tr td").each(function () {
        //  alert("gi");
    });
});
