$(document).ready(function () {
    loadtabledata();
    loadform();
    /*Load form*/
    function loadform() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCform",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    // alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" > ' + a["FormName"] + '</option>';
                    $("#formtype").append(option);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }

    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    $(document).on("click", "#verify", function () {
        selectedID = [];
        verifydata();

        /*Verify data*/
        function verifydata() {
            var result = confirm("Are you sure to verify Data?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push(dtoe($(this).val()));
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/Verifydata',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Verified Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadtabledata();
                                $('.pagination').hide();
                                $('#maxRows option').prop('selected', function () {
                                    return this.defaultSelected;
                                });
                            }
                            else {
                                // alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' You do not have selected any row?',
                        type: 'error',
                        delay: 3000
                    });
                }
            }
        }
    });

    //load table data
    function loadtabledata() {
        var url = window.location.href;
        var segments = url.split('/');
        var type = '';
        var id = segments[6];
        if (id == "undefined") {
            type = 0;
        }
        else {
            type = id;
        }
        openload();
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $.ajax({
            async: true,
            type: 'POST',
            url: '/api/CallApi/SpColMapsCustomForm',
            headers: {
                'fid': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $header = $('<thead  >').html('<tr>');
                    $head1 = $('<th><input type="checkbox" id="select_all"/></th><th>Status</th>');
                    $header.append($head1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        $header.append('<th style="text-align: center; padding-top: 12px;" class="class' + q1 + '">' + val.column_name + '</th>');
                    });
                    $table.append($header);
                }
                else {
                    // alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        var fcode = localStorage.getItem("FirmCode");
        $.ajax({
            async: true,
            url: '/api/CallApi/SpContactCustomFormData',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: {
                'fid': type
            },
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                }
                else {
                    $("#datastatus").html("No result found !");
                }
                var it = 2;
                var bclass = '';
                var bstatus = '';
                $.each(obj, function (i, val) {
                    it = it + 1;
                    if (val.Status == "1") {
                        bclass = "label label-success";
                        bstatus = "Verified";
                    }
                    if (val.Status == null) {
                        bclass = "label label-danger";
                        bstatus = "Not Verified";
                    }
                    var $row = $('<tr />');
                    $row.append($('<td class="s" />').html("<span>.<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + enctype(val.cid) + "'/>"));
                    $row.append($('<td class="Status1" />').html("<span class='" + bclass + "'>" + (val.Status != 1 ? bstatus + '.' : bstatus)));
                    if (val.col1 != null) {
                        $row.append($('<td  class="class3" />').html("<span>" + val.col1));
                    }
                    else {
                        $row.append($('<td class="class3" />').html("<span>"));
                    }
                    if (val.col2 != null) {
                        $row.append($('<td class="class4"  />').html("<span>" + val.col2));
                    }
                    else {
                        $row.append($('<td class="class4" />').html("<span>"));
                    }
                    if (val.col3 != null) {
                        $row.append($('<td class="class5" />').html("<span>" + val.col3));
                    }
                    else {
                        $row.append($('<td  class="class5"/>').html("<span>"));
                    }
                    if (val.col4 != null) {
                        $row.append($('<td  class="class6"/>').html("<span>" + val.col4));
                    }
                    else {
                        $row.append($('<td class="class6"  />').html("<span>"));
                    }
                    if (val.col5 != null) {
                        $row.append($('<td class="class7" />').html("<span>" + val.col5));
                    }
                    else {
                        $row.append($('<td class="class7"/>').html("<span>"));
                    }
                    if (val.col6 != null) {
                        $row.append($('<td  class="class8"/>').html("<span>" + val.col6));
                    }
                    else {
                        $row.append($('<td class="class8" />').html("<span>"));
                    }
                    if (val.col7 != null) {
                        $row.append($('<td  class="class9"/>').html("<span>" + val.col7));
                    }
                    else {
                        $row.append($('<td class="class9" />').html("<span>"));
                    }
                    if (val.col8 != null) {
                        $row.append($('<td class="class10" />').html("<span>" + val.col8));
                    }
                    else {
                        $row.append($('<td class="class10" />').html("<span>"));
                    }
                    if (val.col9 != null) {
                        $row.append($('<td class="class11" />').html("<span>" + val.col9));
                    }
                    else {
                        $row.append($('<td class="class11" />').html("<span>"));
                    }
                    if (val.col10 != null) {
                        $row.append($('<td class="class12" />').html("<span>" + val.col10));
                    }
                    else {
                        $row.append($('<td class="class12" />').html("<span>"));
                    }
                    if (val.col11 != null) {
                        $row.append($('<td class="class13" />').html("<span>" + val.col11));
                    }
                    else {
                        $row.append($('<td class="class13"/>').html("<span>"));
                    }
                    if (val.col12 != null) {
                        $row.append($('<td class="class14" />').html("<span>" + val.col12));
                    }
                    else {
                        $row.append($('<td class="class14"  />').html("<span>"));
                    }
                    if (val.col13 != null) {
                        $row.append($('<td class="class15" />').html("<span>" + val.col13));
                    }
                    else {
                        $row.append($('<td class="class15" />').html("<span>"));
                    }
                    if (val.col14 != null) {
                        $row.append($('<td class="class16" />').html("<span>" + val.col14));
                    }
                    else {
                        $row.append($('<td class="class16"/>').html("<span>"));
                    }
                    if (val.col15 != null) {
                        $row.append($('<td  class="class17"/>').html("<span>" + val.col15));
                    }
                    else {
                        $row.append($('<td  class="class17"/>').html("<span>"));
                    }
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
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
            }
        }
    }
    var q = 2;
    loadmenu();
    /*Load menu*/
    function loadmenu() {
        var url = window.location.href;
        var segments = url.split('/');
        var type = '';
        var id = segments[6];
        if (id == "undefined") {
            type = 0;
        }
        else {
            type = id;
        }
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/SpColMapsCustomForm',
            headers: {
                'fid': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#bd").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $.each(obj, function (i, a) {
                    q = q + 1;
                    var option = '<li><a href="#" class="small" data-value="option' + q + '" tabIndex="-1"><input checked type="checkbox"  name="class' + q + '" >' + a["column_name"] + '</a></li>';
                    $("#bd").append(option);
                }); //End of foreach Loop
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                var options = [];
                $('.dropdown-menu a').on('click', function (event) {
                    var $target = $(event.currentTarget),
                        val = $target.attr('data-value'),
                        $inp = $target.find('input'),
                        idx;
                    if ((idx = options.indexOf(val)) > -1) {
                        options.splice(idx, 1);
                        setTimeout(function () { $inp.prop('checked', true); }, 0);
                    } else {
                        options.push(val);
                        setTimeout(function () { $inp.prop('checked', false); }, 0);
                    }
                    $(event.target).blur();
                    return false;
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
    $("#example tr td").each(function () {
        alert("gi");
    });
});
