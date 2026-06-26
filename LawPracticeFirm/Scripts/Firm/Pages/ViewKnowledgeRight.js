$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    loadUser();
    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        // alert(search);
        loadtabledata(1);
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    //load table data
    function hideEmptyCols(table) {
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
/*Insert View Permission*/
function InsertViewPermission(strid) {
    var strright = "0";
    var str = "Vew" + strid;
    var strchkval = $('input[name=' + str + ']').is(':checked');
    if (strchkval) {
        strright = "1";
    }
    else {
        strright = "0";
    }
    var struser = $("#drpuserlist").val();
    if (struser != "") {
        $.ajax({
            async: true,
            url: '/api/WorkFlowNewApi/KnowledgePermission',
            headers: { id: dtoe(strid), chkView: strright, Userid: struser },
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                $("#fileupload")[0].reset();
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    new PNotify({
                        title: 'Success!',
                        text: 'Updated Successfully',
                        type: 'success',
                        delay: 3000
                    });
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
    else {
        document.getElementById(str).checked = false;
        alert("Please select user from user drop-down");
        return false;
    }
}
/*Download Permission*/
function DownloadPermission(strid) {
    var strright = "0";
    var str = "Dwn" + strid;
    var strchkval = $('input[name=' + str + ']').is(':checked');
    if (strchkval) {
        strright = "1";
    }
    else {
        strright = "0";
    }
    var struser = $("#drpuserlist").val();
    if (struser != "") {
        $.ajax({
            async: true,
            url: '/api/WorkFlowNewApi/KnowledgeDwnPermission',
            headers: { id: dtoe(strid), chkDwn: strright, Userid: struser },
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                $("#fileupload")[0].reset();
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    new PNotify({
                        title: 'Success!',
                        text: 'Updated Successfully',
                        type: 'success',
                        delay: 3000
                    });
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
    else {
        document.getElementById(str).checked = false;
        alert("Please select user from user drop-down.");
        return false;
    }
}
/*Load user*/
function loadUser() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/Assignuser",
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
            var option1 = "<option value=\"\" >- Select Any -</option>";
            $("#drpuserlist").append(option1);
            $.each(obj, function (i, a) {
                if (a.Id != userid) {
                    var option = '<option value="' + a["Id"] + '" > ' + a["UserName"] + '</option>';
                    $("#drpuserlist").append(option);
                }
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