$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    /*Export activity report in excel*/
    $("#excel").click(function () {
        var pagestypes = $("#filter").val();
        var searchdatss = "";
        searchdatss = $("#myInput").val();
        if (searchdatss == "") {
            searchdatss = $("#fstatus").val();
        }
        window.location = encodeURI("/firm/ExportoExcelActivityList?status=true&pagetype=" + pagestypes + "&search=" + searchdatss);
    })
    /*Export activity report in pdf*/
    $("#pdf").click(function () {
        var pagestypes = $("#filter").val();
        var searchdatss = "";
        searchdatss = $("#myInput").val();
        if (searchdatss == "") {
            searchdatss = $("#fstatus").val();
        }
        window.location = encodeURI("/firm/ExportoPdfActivityList?status=true&pagetype=" + pagestypes + "&search=" + searchdatss);
    })
    $(document).on("click", "#transferpageevent", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/Firm/EventSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    /*Note single view*/
    $(document).on("click", "#transferpagenote", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/Firm/NoteSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    /*Note single task*/
    $(document).on("click", "#transferpagetask", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/Firm/TaskSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    /*Calling single view*/
    $(document).on("click", "#transferpagecall", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/Firm/CallSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    $(document).on("click", "#transferpage", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hidtask" + serial).val();
        var urls = "/" + fcode + "/Firm/CustomActivitySingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    var dselectedIDscall = new Array();
    var dselectedIDsnote = new Array();
    var dselectedIDstask = new Array();
    var dselectedIDsevent = new Array();
    var dtitleevent = new Array();
    var dselectedIDscustom = new Array();
    var selectedIDSync = new Array();
    $(document).on("click", "#syncrqst", function () {
        var result = confirm("Are you sure to save data sync request? ");
        if (result) {
            openload();
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    if ($(this).attr('ntype') == 'task') {
                        dselectedIDstask.push($(this).val());
                    }
                    if ($(this).attr('ntype') == 'call') {
                        dselectedIDscall.push($(this).val());
                    }
                    if ($(this).attr('ntype') == 'event') {
                        dselectedIDsevent.push($(this).val());
                    }
                    if ($(this).attr('ntype') == 'note') {
                        dselectedIDsnote.push($(this).val());
                    }
                    if ($(this).attr('ntype') == 'custom') {
                        dselectedIDscustom.push($(this).val());
                    }
                }
            });
            if (JSON.stringify(dselectedIDstask) != "[]" || JSON.stringify(dselectedIDscall) != "[]" || JSON.stringify(dselectedIDsevent) != "[]" || JSON.stringify(dselectedIDsnote) != "[]" || JSON.stringify(dselectedIDscustom) != "[]") {
                var formdatatask = new FormData();
                var formdatanote = new FormData();
                var formdatacall = new FormData();
                var formdataevent = new FormData();
                var formdataca = new FormData();
                if (JSON.stringify(dselectedIDstask) != "[]") {
                    formdatatask.append("token", dselectedIDstask);
                    formdatatask.append("tablekey", "task");
                }
                if (JSON.stringify(dselectedIDscall) != "[]") {
                    formdatacall.append("token", dselectedIDscall);
                    formdatacall.append("tablekey", "call");
                }
                if (JSON.stringify(dselectedIDsevent) != "[]") {
                    formdataevent.append("token", dselectedIDsevent);
                    formdataevent.append("tablekey", "event");
                }
                if (JSON.stringify(dselectedIDsnote) != "[]") {
                    formdatanote.append("token", dselectedIDsnote);
                    formdatanote.append("tablekey", "note");
                }
                if (JSON.stringify(dselectedIDscustom) != "[]") {
                    formdataca.append("token", dselectedIDscustom);
                    formdataca.append("tablekey", "cactivity");
                }
                var sq1 = $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdataca,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        dselectedIDscustom = [];
                    },
                    error: function () {
                    }
                });
                $.when(sq1).then(function (data, textStatus, jqXHR) {
                    var sq2 = $.ajax({
                        async: true,
                        url: '/api/CallApi/SaveSyncRowData',
                        data: formdatatask,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (response) {
                            dselectedIDstask = [];
                        },
                        error: function () {
                        }
                    });
                    $.when(sq2).then(function (data, textStatus, jqXHR) {
                        var sq3 = $.ajax({
                            async: true,
                            url: '/api/CallApi/SaveSyncRowData',
                            data: formdatacall,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function (response) {
                                dselectedIDscall = [];
                            },
                            error: function () {
                            }
                        });
                        $.when(sq3).then(function (data, textStatus, jqXHR) {
                            var sq4 = $.ajax({
                                async: true,
                                url: '/api/CallApi/SaveSyncRowData',
                                data: formdatanote,
                                processData: false,
                                contentType: false,
                                type: 'POST',
                                success: function (response) {
                                    dselectedIDsnote = [];
                                },
                                error: function () {
                                }
                            });
                            $.when(sq4).then(function (data, textStatus, jqXHR) {
                                var sq5 = $.ajax({
                                    async: true,
                                    url: '/api/CallApi/SaveSyncRowData',
                                    data: formdataevent,
                                    processData: false,
                                    contentType: false,
                                    type: 'POST',
                                    success: function (response) {
                                        dselectedIDsevent = [];
                                    },
                                    error: function () {
                                    }
                                });
                                $.when(sq3).then(function (data, textStatus, jqXHR) {
                                    new PNotify({
                                        title: 'Success!',
                                        text: ' Data sync request saved successfully',
                                        type: 'success',
                                        delay: 3000
                                    });
                                    $('#select_all').prop('checked', false);
                                    loaddatalist(pageindex);
                                });
                            });
                        });
                    });
                });
                closeload();
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to sync?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });
    loadform();
    /*Load form*/
    function loadform() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomActivity",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<p> <a class="dropdown-item" href="#" data-toggle="modal" data-target="#myModal" data-val="' + a.ActivityName + '" id-val="' + a.Id + '" id="customact">  <i class="glyphicon glyphicon-th-list"></i> ' + a.ActivityName + '</a></p>';
                    $("#loadcustomactivity").append(option);
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
    $("#addcustomactivity").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateCustomActivity");
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedIDscall = new Array();
    var titlecall = new Array();
    var selectedIDsnote = new Array();
    var titlenote = new Array();
    var selectedIDstask = new Array();
    var titletask = new Array();
    var selectedIDsevent = new Array();
    var titleevent = new Array();
    var selectedIDscustom = new Array();
    var titlecustom = new Array();
    var countdelete = 0;
    var vcall = "";
    var vnote = "";
    var vtask = "";
    var vevent = "";
    var vcustom = "";
    var j1 = '';
    var j2 = '';
    $(document).on("click", "#delete", function () {
        deleteactivity();
        function data() {
            $('.pagination').hide();
            $('#maxRows option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#filter option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#updatePanel').html('');
            vcall = "";
            vnote = "";
            vtask = "";
            vevent = "";
            vcustom = "";
            try {
                table();
            }
            catch (err) {
            }
            try {
                event();
            }
            catch (err) {
            }
            try {
                task();
            }
            catch (err) {
            }
            try {
                note();
            }
            catch (err) {
            }
            try {
                call();
            }
            catch (err) {
            }
            try {
                customactivity();
            }
            catch (err) {
            }
        }
        /*Delete activity*/
        function deleteactivity() {
            var result = confirm("Are you sure to delete Activities?");
            if (result) {
                openload();
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        if ($(this).attr('ntype') == 'task') {
                            titletask.push($(this).attr("ntype"));
                            selectedIDstask.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'call') {
                            titlecall.push($(this).attr("ntype"));
                            selectedIDscall.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'event') {
                            titleevent.push($(this).attr("ntype"));
                            selectedIDsevent.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'note') {
                            titlenote.push($(this).attr("ntype"));
                            selectedIDsnote.push($(this).val());
                        }
                        if ($(this).attr('ntype') == 'custom') {
                            titlecustom.push($(this).attr("ntype"));
                            selectedIDscustom.push($(this).val());
                        }
                    }
                });
                // Delete Event
                if (JSON.stringify(selectedIDsevent) != "[]") {
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveEvent',
                        data: JSON.stringify(selectedIDsevent),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDsevent = [];
                            titleevent = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                //alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
                // Delete Call
                if (JSON.stringify(selectedIDscall) != "[]") {
                    j1 = $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveCall',
                        data: JSON.stringify(selectedIDscall),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDscall = [];
                            titlecall = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
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
                // Delete Note
                if (JSON.stringify(selectedIDsnote) != "[]") {
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveNote',
                        data: JSON.stringify(selectedIDsnote),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDsnote = [];
                            titlenote = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                vnote = "success";
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
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
                // Delete Task
                if (JSON.stringify(selectedIDstask) != "[]") {
                    j2 = $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveTask',
                        data: JSON.stringify(selectedIDstask),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDstask = [];
                            titletask = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                // alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    })
                }
                //delete custom
                if (JSON.stringify(selectedIDscustom) != "[]") {
                    j2 = $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveCustomActivities',
                        data: JSON.stringify(selectedIDscustom),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedIDscustom = [];
                            titlecustom = [];
                            if (response.Status == true) {
                                countdelete = countdelete + 1;
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Data Deleted Successfully',
                                    type: 'success',
                                    delay: 2000
                                });
                            }
                            else {
                                // alert("not found");
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    })
                }
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to delete?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
        $.when(j1, j2).then(function (a1, a2) {
            closeload();
            data();
            closeload();
        }, function (jqXHR, textStatus, errorThrown) {
            //  alert('Either j1 or j2 failed!');
        });
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(document).on("click", ".nav-pills a[href='#1a111']", function () {
        $("#eventtext").html("Create");
        $("#filelist").html("");
        $("#seconddiv").css("display", "none");
        $("#firstdiv").css("display", "unset");
        $("#tempeventname").html("");
        $("#edittoken").val("");
        $("#saveactivityalert")[0].reset();
        $("select#ddldays").val('');
        $("select#ddlHearing").val('0');
    });
    $(document).on("click", "#removeescl", function () {
        var escid = $(this).attr("data-val");
        if (confirm("Are you sure to remove alert entry?")) {
            // your deletion code
            var formData = new FormData();
            formData.append("token", escid);
            //read assign using list
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveEsc",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    new PNotify({
                        title: 'Success!',
                        text: ' Data has been removed Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loadesclist();
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
    /*Remove activity event alert*/
    $(document).on("click", "#removealert", function () {
        var alertid = $(this).attr("data-val");
        if (confirm("Are you sure to remove alert entry?")) {
            // your deletion code
            var formData = new FormData();
            formData.append("AlertId", alertid);
            //read assign using list
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/Removeactivityeventalert",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    new PNotify({
                        title: 'Success!',
                        text: ' Alert has been removed Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loadactivityreminder();
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

    /*Edit alert*/
    $(document).on("click", "#editalert", function () {
        $("#eventtext").html("Edit");
        $('.nav-pills a[href="#2a111"]').tab('show');
        var evname = $(this).attr("event-val");
        $("#seconddiv").css("display", "unset");
        $("#firstdiv").css("display", "none");
        $("#caseevents").css("display", "none");
        $("#tempeventname").html(evname);
        var alertid = $(this).attr("data-val");
        $("#edittoken").val(alertid);
        var formData = new FormData();
        formData.append("AlertId", alertid);
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/Singleactivityeventalert",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                if (response1.Data.length > 2) {
                    closeload();
                }
                else {
                    closeload();
                }
                var obj2 = JSON.parse(response1.Data);
                $.each(obj2, function (i, a) {
                    $("#duedate").val(String(a.Duedate).replace(/\T.+/g, "$'"));
                    $("select#ddldays").val(a.alertDays);
                    $("select#ddlHearing").val(a.Alert);
                });
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    $(document).on("click", "#setescl", function () {
        openload();
        $("#eventtext").html("Create");
        var idval = $(this).attr("id-val");
        var dataval = $(this).attr("data-val");
        var datatype = $(this).attr("data-type");
        var acttype = $(this).attr("data-type2");
        var etype = $(this).attr("data-type1");
        token = idval;
        loadesclist();
        var url = "/firm/CreateTaskEsc?status=true&token=" + idval + "&subject=" + datatype + "&date=" + dataval;
        $('.mymodelsesc').load(encodeURI(url));
        $('.nav-pills a[href="#1a111e"]').tab('show');
        $('#myModalESC').modal({ show: true });
        closeload();
    });
    function loadesclist() {
        $("#dataescstatus").html("");
        $("#bindataesc").html("");
        var html3 = '';
        var formData = new FormData();
        formData.append("token", token);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/BindEscList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                if (response1.Data.length > 2) {
                    $("#dataescstatus").html("");
                    closeload();
                }
                else {
                    $("#dataescstatus").html("No result found !");
                    closeload();
                }
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html3 += '<tr><td>' + qty1 + '</td><td>' + a.TaskName + '</td><td>' + a.AssignUserName + '</td><td>' + a.LevelName + '</td><td width="120px;">' + formatDatetoIST(a.DueDate) + '</td><td>' + a.Createdby + '</td><td>' + formatDatetoIST(a.dEnteryDate) + '</td><td><a href="javascript:void()" id="removeescl" data-val="' + a.iid + '" title="Remove Escilation "><span class="glyphicon glyphicon-trash" style="color:red"></a></td></tr>';
                });
                $("#bindataesc").append(html3).hide().fadeIn('slow');;
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }

    /*Set alert*/
    $(document).on("click", "#setalerts", function () {
        openload();
        $("#eventtext").html("Create");
        var idval = $(this).attr("id-val");
        var dataval = $(this).attr("data-val");
        var datatype = $(this).attr("data-type");
        var acttype = $(this).attr("data-type2");
        var etype = $(this).attr("data-type1");
        token = idval;
        loadactivityreminder();
        var url = "/firm/CreateActivityReminders?status=true&token=" + idval + "&type=" + datatype + "&date=" + dataval + "&evtype=" + etype + "&acttype=" + acttype;
        $('.mymodels12').load(url);
        $('.nav-pills a[href="#1a111"]').tab('show');
        $('#myModalreminder').modal({ show: true });
        closeload();
    });
    setInterval(function () {
        var inval = localStorage.getItem("activityremind");
        if (String(inval) == "1") {
            loadactivityreminder();
            localStorage.setItem("activityremind", "2");
        }
        var invalenc = localStorage.getItem("encremind");
        if (String(invalenc) == "1") {
            loadesclist();
            localStorage.setItem("encremind", "2");
        }
    }, 3000);
    /*Load activity reminder*/
    function loadactivityreminder() {
        $("#edittoken").val("");
        $("#bindatareminder").html("");
        var html1 = '';
        var eventid = token;
        var formData = new FormData();
        formData.append("eventid", eventid);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/activityeventalertlist",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                if (response1.Data.length > 2) {
                    $("#dataremindstatus").html("");
                    closeload();
                }
                else {
                    closeload();
                }
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    var alerts = "";
                    if (String(a.Alert) == "1") {
                        alerts = "Days Before Due date";
                    }
                    if (String(a.Alert) == "2") {
                        alerts = "Days After Due date";
                    }
                    if (String(a.Alert) == "3") {
                        alerts = "On Same Day";
                    }
                    var q = 0;
                    var dfilename = "";
                    var string1 = "";
                    var string2 = "";
                    var flhtml = "";
                    html1 += '<tr><td>' + qty1 + '</td><td>' + a.EventName + '</td><td>' + a.alertDays + '</td><td>' + alerts + '</td><td width="120px;">' + formatDatetoIST(a.Duedate) + '</td><td>' + a.Createdby + '</td><td>' + formatDatetoIST(a.Date_time) + '</td><td><a href="javascript:void()" id="removealert" data-val="' + a.Id + '" title="Remove activity alert"><span class="glyphicon glyphicon-trash" style="color:red"></a>&nbsp;&nbsp;<a href="javascript:void()" id="editalert" event-val="' + a.EventName + '" data-val="' + a.Id + '" title="Edit activity alert"><span class="glyphicon glyphicon-edit" style="color:#72afd2"></a></td></tr>';
                });
                $("#bindatareminder").append(html1).hide().fadeIn('slow');;
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    setInterval(function () {
        var setvalue = localStorage.getItem("setname");
        if (String(setvalue) != "") {
            loaddatalist(pageindex);
            localStorage.setItem("setname", "");
        }
    }, 3000);
    var urlpath = location.pathname.split('/');
    var activityname = urlpath[4];
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    var searchflag = false;
    var chckfilter = false;
    var tempexcel = false;
    $(document).on('click', '#getdatabypagenum', function () {
        var chksearchs = $("#myinput").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    loaddatalist(pageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        searchflag = true;
        tempexcel = true;
        loaddatalist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#myInput', function () {
        $("#fstatus").val("");
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loaddatalist(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        /* your code here */
        var chksearchs = $("#myinput").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    var urlpath = location.pathname.split('/');
    var activityname = urlpath[4];
    function table() {
        $("#updatePanel").html("");
        $table = $('<table id="example" border = "1px solid" class=""  style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        $header = $('<thead  >').html('');
        $head1 = $('<th bgcolor="DIMGRAY"><input type="checkbox" id="select_all"/></th><th bgcolor="DIMGRAY"  onclick="sortTable(1)" class="Activity">Activity <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(2)" class="Status12">Status <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(3)" class="Date">Date <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(4)" class="Matter">Case <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(5)" class="assignto">Assign To <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(6)" class="assignby">Assign By <span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(7)" class="action">Action <span class="fa fa-sort "></span></th>');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $('#updatePanel').html($table);
        setTimeout(function () {
            loaddatalist(pageindex);
        }, 500);
    }
    table();
    /*Load All Activity Data by row id*/
    function loaddatalist(pageindex) {
        var inpt = $('#myInput').val();
        var penfilter = $('#fstatus').val();
        var fltr = $('#filter').val();
        if (penfilter == "") {
            if (chckfilter == false) {
                if (activityname != "") {
                    if (activityname == "Pending") {
                        fltr = "task";
                        $('#filter option[value="task"]').attr("selected", true);
                    }
                    else {
                        fltr = activityname;
                        $('#filter option[value="' + activityname + '"]').attr("selected", true);
                    }
                }
            }
            if (searchflag == true) {
                inpt = inpt;
                if (fltr == "" || fltr == "task") {
                    if (inpt == "Pending" || inpt == "pending") {
                        inpt = "not completed";
                    }
                }
                searchflag = false;
            }
            else {
                inpt = "";
                searchflag = false;
            }
        }
        else {
            inpt = penfilter;
        }
        openload();
        $("#loadactivitydatas").html("");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", inpt);
        formdata.append("type", fltr);
        var ajaxTime = new Date().getTime();
        var f1 = $.ajax({
            async: true,
            url: '/api/CallApi/LoadAllActivityDatabyrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                $("#tfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    objtask = JSON.parse(response.Data);
                    var length = objtask.length;
                }
                else {
                    // alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    closeload();
                }
                else {
                    $("#datastatus").html("No result found!");
                    closeload();
                }
                var it = 2;
                var bclass = '';
                var t2 = 0;
                $.each(objtask, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.TotalRows;
                        var totpage = 0;
                        if (val.TotalRows > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<table style="width:100%;background:white"><tr><td colspan = "12">'
                        tfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + pageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + val.rownum + '</b> of <b style="font-size:12px;">' + val.TotalRows + ' Entries</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  style="width: 30px;"><button type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button>'
                        tfot += '</div>'
                        tfot += '<div style="float:right;">'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        tfot += '</td >'
                        tfot += '</tr >'
                        $("#tfooter").append(tfot);
                        closeload();
                    }
                    t2 = t2 + 1;
                    $("#tokens").append('<input type="hidden" id="hidtask' + t2 + '" value="' + val.Id + '">')
                    if (val.status == "Completed") {
                        bclass = "label label-success";
                    }
                    if (val.status == "Not Completed") {
                        bclass = "label label-danger";
                    }
                    if (val.status == "In Progress") {
                        bclass = "label label-warning";
                    }
                    var dat = val.date_time;
                    var dates1 = formatDatetoIST(dat);
                    var statusvalue = "";
                    if (val.status == "Not Completed") {
                        statusvalue = "Pending";
                    }
                    else {
                        statusvalue = val.status;
                    }
                    var duedates = "";
                    if (String(val.Duedate) != '1900-01-01T00:00:00') {
                        duedates = formatDatetoIST(val.Duedate);
                    }
                    else {
                        duedates = '';
                    }
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr />');
                    if (String(val.TempField) == "task") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-file-text-o'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpagetask' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>') + '<i class= "' + dsyncicon + ' pull-right" title = "' + dsynctitle + '" ></i>'));
                    }
                    if (String(val.TempField) == "note") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='note' class='checkbox' ntype='note'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-sticky-note'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpagenote' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>') + '<i class= "' + dsyncicon + ' pull-right" title = "' + dsynctitle + '" ></i>'));
                    }
                    if (String(val.TempField) == "call") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='call' class='checkbox' ntype='call'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-phone'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpagecall' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>') + '<i class= "' + dsyncicon + ' pull-right" title = "' + dsynctitle + '" ></i>'));
                    }
                    if (String(val.TempField) == "event") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='event' class='checkbox' ntype='event'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='fa fa-calendar'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpageevent' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>') + '<i class= "' + dsyncicon + ' pull-right" title = "' + dsynctitle + '" ></i>'));
                    }
                    if (String(val.TempField) == "cactivity") {
                        $row.append($('<td class="s" />').html("<span><input type='checkbox' id='custom' class='checkbox' ntype='custom'  value='" + val.Id + "'/>"));
                        $row.append($('<td class="Activity" />').html("<i name='" + val.subject + "' class='glyphicon glyphicon-th-list'></i>&nbsp;&nbsp;<span><a name='" + val.subject + "' id='transferpage' href='javascript:void()' sno=" + t2 + ">" + (val.subject != null ? val.subject : '</a>') + '<i class= "' + dsyncicon + ' pull-right" title = "' + dsynctitle + '" ></i>'));
                    }
                    $row.append($('<td class="Status12" />').html("<span class='" + bclass + "'>" + (statusvalue != null ? statusvalue : '')));
                    $row.append($('<td class="Date" />').html("<span  name='" + val.date_time + "'>" + (dates1 != null ? dates1 : '')));
                    $row.append($('<td class="Matter" />').html("<span>" + (val.mattername != null ? val.mattername : '')));
                    $row.append($('<td class="assignto" />').html("<span>" + (val.assignuserto != null ? val.assignuserto : '')));
                    $row.append($('<td class="assignby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '')));
                    if (String(duedates) != "" && String(val.TempField) == "task") {
                        $row.append($('<td class="action" />').html("<center><span data-val='" + enctypesingle(duedates) + "' data-type='" + enctypesingle(val.subject) + "' data-type2='" + val.TempField + "' data-type1='" + enctypesingle(val.TempField) + "' catr='" + duedates + "' id-val='" + val.Id + "' id='setalerts' class='btn btn-info btn-mail' title='Set alert'><i class='glyphicon glyphicon-bell'></i></span> &nbsp;&nbsp;<span data-val='" + duedates + "' data-type='" + val.subject + "' data-type2='" + val.TempField + "' data-type1='" + val.TempField + "' catr='" + duedates + "' id-val='" + val.Id + "' id='setescl' class='btn btn-warning btn-mail' title='Set Escalation for Task'><i class='glyphicon glyphicon-flag'></i>"));
                    }
                    else if (String(duedates) != "") {
                        $row.append($('<td class="action" />').html("<center><span data-val='" + enctypesingle(duedates) + "' data-type='" + enctypesingle(val.subject) + "' data-type2='" + val.TempField + "' data-type1='" + enctypesingle(val.TempField) + "' catr='" + duedates + "' id-val='" + val.Id + "' id='setalerts' class='btn btn-info btn-mail' title='Set alert'><i class='glyphicon glyphicon-bell'></i>"));
                    }
                    else {
                        $row.append($('<td class="action" />').html("<span>"));
                    }
                    $("#loadactivitydatas").append($row);
                });
                closeload();
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(f1).then(function (x) {
            $("#searchdatas").removeAttr("disabled");
            if (activityname == "Pending") {
                fsearchPending(activityname);
                closeload();
                $('#fstatus option[value="Pending"]').attr("selected", true);
                $('#filter option[value="Tasks"]').attr("selected", true);
            }
        });
    }
    $('#fstatus').on('change', function () {
        $("#myInput").val("");
        searchflag = false;
        chckfilter = true;
        tempexcel = false;
        loaddatalist(1);
    });
    $('#filter').on('change', function () {
        $("#myInput").val("");
        $("#fstatus").val("");
        chckfilter = true;
        tempexcel = false;
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
        searchflag = false;
        loaddatalist(1);
    });
});
