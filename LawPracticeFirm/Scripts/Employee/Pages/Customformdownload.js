$(document).ready(function () {
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }

    loadform();
    loadtabledata();
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
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" > ' + a["FormName"] + '</option>';
                    $("#formtype").append(option);
                }); //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var filedata = $(this).attr("data-val");
        localStorage.setItem("filedata-val", filedata);
        var url = "/firm/workflowfilelist/?ftype=customform&data=" + fileid;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    $(document).on("click", "#confirmstage", function () {
        verifydata();
        function verifydata() {
            var result = confirm("Are you sure to  confirm Data?");
            if (result) {

                openload();

                var workflowid = localStorage.getItem("stgid");
                var workflowtid = localStorage.getItem("taskid");
                var formData = new FormData();
                formData.append("wid", workflowid);
                formData.append("wtid", workflowtid);
                $.ajax({
                    async: true,
                    type: "POST",
                    url: '/api/CallApi/Verifydwonloadstage',
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        alert("Data download Verification Successfully");
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data download Verification Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            closeload();
                            window.location = encodeURI("/" + fcode + "/Employee/WorkFlowNUserActivity/");
                        }
                        else {
                            new PNotify({
                                title: 'Success!',
                                text: ' Data download Verification Successfully',
                                type: 'success',
                                delay: 3000
                            });
                        }
                    },
                    error: function () {
                        alert('Error!');
                    }
                });
            }
        }
    });
    /* //load table data*/
    var countcustomfoeld = "";
    function loadtabledata() {
        type = id;
        openload();
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" border="1px solid" style="overflow-x:auto;" /><tr><th bgcolor="DIMGRAY">').addClass('dataTable table table-bordered table-striped');
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
                    countcustomfoeld = obj.length;
                    $header = $('<thead  >').html('<tr>');
                    $head1 = $('<th bgcolor="DIMGRAY">Sl. No.</th><th bgcolor="DIMGRAY">UserName</th><th bgcolor="DIMGRAY">Date</th>');
                    $header.append($head1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        $header.append('<th bgcolor="DIMGRAY" style="text-align: center; padding-top: 12px;" class="class' + q1 + '">' + val.column_name + '</th>');
                    });
                    $table.append($header);
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        setTimeout(function () {
            var fcode = localStorage.getItem("FirmCode");
            $.ajax({
                async: true,
                url: '/api/CallApi/SpContactCustomFormDatadownload',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'fid': type,
                    'wfid': wftoken
                },
                dataType: 'json',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    if (response.Data.length > 2) {
                        $("#datastatus").html("");
                    }
                    else {
                        //alert(response.Data.length);
                        $("#datastatus").html("No result found !");
                    }
                    var it = 2;
                    var ct = 0;
                    var bclass = '';
                    var bstatus = '';
                    $.each(obj, function (i, val) {
                        ct = ct + 1;
                        it = it + 1;
                        // alert(val.Status);
                        if (val.Status == "1") {
                            bclass = "label label-success";
                            bstatus = "Verified";
                        }
                        if (val.Status == null) {
                            bclass = "label label-danger";
                            bstatus = "Not Verified";
                        }
                        var $row = $('<tr />');
                        $row.append($('<td class="sno" />').html("<span>" + (ct != "" ? ct : '<span style="visibility: hidden;">.</span>')));
                        $row.append($('<td class="userid" />').html("<span>" + (val.Userid != "" ? val.Userid : '<span style="visibility: hidden;">.</span>')));
                        $row.append($('<td class="date_time" />').html("<span>" + (val.date_time != "" ? checkdatetimecustom(val.date_time.substring(0, 10)) : '<span style="visibility: hidden;">.</span>')));
                        var countcf = countcustomfoeld;
                        for (var str = 1; str <= countcf; str++) {
                            if (str == 1) {
                                if (val.col1 == "") {
                                    $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col1 == null) {
                                    $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext1") {
                                        $row.append($('<td class="class3" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col1 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class3" />').html("<span>" + checkdatetimecustom(val.col1)));
                                    }
                                }
                            }
                            if (str == 2) {
                                if (val.col2 == "") {
                                    $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col2 == null) {
                                    $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext2") {
                                        $row.append($('<td class="class4" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col2 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class4" />').html("<span>" + checkdatetimecustom(val.col2)));
                                    }
                                }
                            }
                            if (str == 3) {
                                if (val.col3 == "") {
                                    $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col3 == null) {
                                    $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext3") {
                                        $row.append($('<td class="class5" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col3 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class5" />').html("<span>" + checkdatetimecustom(val.col3)));
                                    }
                                }
                            }
                            if (str == 4) {
                                if (val.col4 == "") {
                                    $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col4 == null) {
                                    $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext4") {
                                        $row.append($('<td class="class6" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col4 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class6" />').html("<span>" + checkdatetimecustom(val.col4)));
                                    }
                                }
                            }
                            if (str == 5) {
                                if (val.col5 == "") {
                                    $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col5 == null) {
                                    $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext5") {
                                        $row.append($('<td class="class7" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col5 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class7" />').html("<span>" + checkdatetimecustom(val.col5)));
                                    }
                                }
                            }
                            if (str == 6) {
                                if (val.col6 == "") {
                                    $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col6 == null) {
                                    $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext6") {
                                        $row.append($('<td class="class8" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col6 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class8" />').html("<span>" + checkdatetimecustom(val.col6)));
                                    }
                                }
                            }
                            if (str == 7) {
                                if (val.col7 == "") {
                                    $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col7 == null) {
                                    $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext7") {
                                        $row.append($('<td class="class9" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col7 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class9" />').html("<span>" + checkdatetimecustom(val.col7)));
                                    }
                                }
                            }
                            if (str == 8) {
                                if (val.col8 == "") {
                                    $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col8 == null) {
                                    $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext8") {
                                        $row.append($('<td class="class10" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col8 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class10" />').html("<span>" + checkdatetimecustom(val.col8)));
                                    }
                                }
                            }
                            if (str == 9) {
                                if (val.col9 == "") {
                                    $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col9 == null) {
                                    $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext9") {
                                        $row.append($('<td class="class11" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col9 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class11" />').html("<span>" + checkdatetimecustom(val.col9)));
                                    }
                                }
                            }
                            if (str == 10) {
                                if (val.col10 == "") {
                                    $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col10 == null) {
                                    $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext10") {
                                        $row.append($('<td class="class12" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col10 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class12" />').html("<span>" + checkdatetimecustom(val.col10)));
                                    }
                                }
                            }
                            if (str == 11) {
                                if (val.col11 == "") {
                                    $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col11 == null) {
                                    $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext11") {
                                        $row.append($('<td class="class13" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col11 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class13" />').html("<span>" + checkdatetimecustom(val.col11)));
                                    }
                                }
                            }
                            if (str == 12) {
                                if (val.col12 == "") {
                                    $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col12 == null) {
                                    $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext12") {
                                        $row.append($('<td class="class14" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col12 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class14" />').html("<span>" + checkdatetimecustom(val.col12)));
                                    }
                                }
                            }
                            if (str == 13) {
                                if (val.col13 == "") {
                                    $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col13 == null) {
                                    $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext13") {
                                        $row.append($('<td class="class15" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col13 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class15" />').html("<span>" + checkdatetimecustom(val.col13)));
                                    }
                                }
                            }
                            if (str == 14) {
                                if (val.col14 == "") {
                                    $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col14 == null) {
                                    $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext14") {
                                        $row.append($('<td class="class16" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col14 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class16" />').html("<span>" + checkdatetimecustom(val.col14)));
                                    }
                                }
                            }
                            if (str == 15) {
                                if (val.col15 == "") {
                                    $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col15 == null) {
                                    $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    if (val.Filenames == "demotext15") {
                                        $row.append($('<td class="class17" />').html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + val.col15 + "'  id-val=" + val.cid + ">Download File</a>"));
                                    }
                                    else {
                                        $row.append($('<td class="class17" />').html("<span>" + checkdatetimecustom(val.col15)));
                                    }
                                }
                            }
                        }
                        $table.append($row);
                    });
                    $('#updatePanel').html($table);
                    closeload();
                    // hideEmptyCols($("#example"));
                },
                error: function () {
                    alert('Error!');
                }
            });
        }, 3000);
    }
    function hideEmptyCols(table) {
        //  alert(table);
        //counti # of columns
        var numCols = $("th", table).length;
        //   alert(numCols);
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
            }
        }
    }
    var q = 2;
    loadmenu();
    /*Load menu*/
    function loadmenu() {
        type = id;
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
