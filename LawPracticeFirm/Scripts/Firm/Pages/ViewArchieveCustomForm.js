$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    var fcode = localStorage.getItem("FirmCode");
    $("#btnGroupDrop1").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateCustomForm");
    });
    $(document).on("click", "#edit", function () {
        var pval = $(this).attr("dataval");
        window.location = encodeURI("/" + fcode + "/Firm/CreateCustomForm/" + pval);
    });
    /*Live page preview demo*/
    $(document).on("click", "#livepreview", function () {
        var pval = $(this).attr("dataval");
        var urls = "/" + fcode + "/Firm/LivePagePreviewDemo";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": pval }
        });
    });
    //Publish Form
    $(document).on("click", "#publish", function () {
        var pval = $(this).attr("dataval");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PublishCustomform",
            headers: {
                'pval': pval
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var datas = JSON.stringify(data);
                objtask = JSON.parse(data.Data);
                if (objtask == "0") {
                    new PNotify({
                        title: 'Warning!',
                        text: ' Form Already Published',
                        type: 'error',
                        delay: 3000
                    });
                }
                else {
                    new PNotify({
                        title: 'Success!',
                        text: ' Form Published Published',
                        type: 'success',
                        delay: 3000
                    });
                    $('#updatePanel').html('');
                    table();
                    task();
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    // Un published Form
    $(document).on("click", "#archieved", function () {
        var result = confirm("Are you sure to  un-archive this Form?");
        if (result) {
            var pval = $(this).attr("dataval");
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/UnarchievedCustomform",
                headers: {
                    'pval': pval
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var datas = JSON.stringify(data);
                    objtask = JSON.parse(data.Data);
                    if (objtask == "0") {
                        new PNotify({
                            title: 'Warning!',
                            text: ' Form already  Un-archive',
                            type: 'error',
                            delay: 3000
                        });
                    }
                    else {
                        new PNotify({
                            title: 'Success!',
                            text: ' Form un-archived Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#updatePanel').html('');
                        table();
                        task();
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
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var $table = '';
    var $header = '';
    var dt = '';
    var q1 = 2;
    var objcall = '';
    var objnote = '';
    var objevent = '';
    var objtask = '';
    table();
    task();
    setInterval(function () {
        var temp = localStorage.getItem("setname");
        if (temp != "") {
            $('.pagination').hide();
            $('#maxRows option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#filter option').prop('selected', function () {
                return this.defaultSelected;
            });
            openload();
            $('#updatePanel').html('');
            table();
            task();
            localStorage.setItem("setname", "");
        }
    }, 5000);
    function table() {
        $table = $('<table id="example" border="1px solid" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('<tr>');
        $head1 = $('<th width="40px;">Sl. No.</th><th class="Activity" width="400px;">Form Name</th><th class="DStatus" width="200px;">Status</th><th class="Date">Action</th> ');
        $header.append($head1);
        $table.append($header);
        $('#updatePanel').html($table);
    }
    var ct = 0;
    /*Load task*/
    function task() {
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadACform',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    objtask = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                }
                else {
                }
                var it = 0;
                var bclass = '';
                var blabel = "";
                var arcshowhide = "";
                $.each(objtask, function (i, val) {
                    if (val.IsPublished == "1") {
                        bclass = "label label-success";
                        blabel = "Published";
                        arcshowhide = "display:unset";
                    }
                    if (val.IsPublished == "0") {
                        bclass = "label label-danger";
                        blabel = "Not Nublished";
                        arcshowhide = "display:unset";
                    }
                    it = it + 1;
                    var $row = $('<tr />');
                    $row.append($('<td class="s" />').html("" + it + ""));
                    $row.append($('<td class="Activity" />').html("<i class='fa fa-file-text-o'></i>&nbsp;&nbsp;<span>" + (val.FormName != null ? val.FormName : '')));
                    $row.append($('<td class="DStatus" />').html("<span class='" + bclass + "'>" + (blabel != null ? blabel : '')));
                    $row.append($('<td class="Date" />').html("&nbsp;<button title='View Form live Preview ' id='livepreview' dataval='" + val.Id + "' type='button' class='btn btn-info btn-mail '  ><span class='glyphicon glyphicon-globe' ></span> Live Preview </button > &nbsp;&nbsp;<button title='Move to Archieve Form' id='archieved' dataval='" + val.Id + "' type='button' class='btn btn-default btn-mail '  style=" + arcshowhide + " ><span class='glyphicon glyphicon-circle-arrow-down'  ></span>Un-archive </button >"));
                    $table.append($row);
                });
                $('#updatePanel').html($table);
                closeload();
            },
            error: function () {
                alert('Error!');
            }
        });
    }
});
