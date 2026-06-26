jQuery(document).ready(function () {
    loadform();
    loadformforEdit();
    loadUser();
    loadTaskItem();
    var counter = 2;
    $("#addEvent").click(function () {
        $(".addtxt").append('<div class="row" id="div' + counter + '"><hr/><div class="col-lg-6"><div class= "form-group" >' +
            '<label class="control-label col-md-4" for="AssignedToGuids">EVENT SUBJECT </label>' +
            '<div class="col-md-12">' +
            '<input class="form-control" placeholder="Add Subject" type="text" name="wfevtname' + counter + '" value="" id="wfevtname' + counter + '">' +
            '</div></div><div class="form-group">' +
            '<label class="control-label col-md-8" for="AssignedToGuids">EVENT DESCRIPTION </label>' +
            '<div class="col-md-12">' +
            '<input class="form-control" placeholder="Add description" type="text" name="wfevtdesc' + counter + '" value="" id="wfevtdesc' + counter + '">' +
            '</div></div>' +
            '<div class= "form-group">' +
            '<div class="col-md-12">' +
            '<img src="../../Content/img/delete.gif" height="20" width="20" style="vertical-align:middle" />' +
            '<a href="#" class="btn" placeholder="Add description" type="text" name="wfevtdel' + counter + '" value="" id="wfevtdel' + counter + '" onclick=deleteevt("' + counter + '")>Delete</a>' +
            '</div></div>' +
            '</div ></div > ');
        counter++;
        return false;
    });
    /*Add task*/
    var countertsk = 2;
    $("#addTask").click(function () {
        $(".addtsk").append(' <div class="row" id="divtsk' + countertsk + '">' +
            '<div class="col-lg-6">' +
            '<div class="form-group">' +
            '<label class="control-label col-md-4" for="AssignedToGuids">TASK SUBJECT </label>' +
            '<div class="col-md-12">' +
            ' <input class="form-control" placeholder="Add Subject" type="text" name="wftskname' + countertsk + '" value="" id="wftskname' + countertsk + '">' +
            ' </div>' +
            '</div>' +
            '<div class="form-group">' +
            ' <label class="control-label col-md-8" for="AssignedToGuids">TASK DESCRIPTION </label>' +
            ' <div class="col-md-12">' +
            ' <input class="form-control" placeholder="Add description" type="text" name="wftskdesc' + countertsk + '" value="" id="wftskdesc' + countertsk + '">' +
            ' </div>' +
            '</div>' +
            ' <div class="form-group">' +
            ' <label class="control-label col-md-8" for="AssignedToGuids">DUE DATE </label>' +
            ' <div class="col-md-12">' +
            ' <input class="form-control" name="duedt' + countertsk + '" type="date" placeholder="Date/Time" id="duedt' + countertsk + '" required />' +
            ' </div>' +
            '</div>' +
            '<div class="form-group">' +
            ' <div class="col-md-12">' +
            '<img src="../../Content/img/delete.gif" height="20" width="20" style="vertical-align:middle" />' +
            '<a href="#" class="btn" placeholder="Add description" type="text" name="wftskdel' + countertsk + '" value="" id="wfevtdel' + countertsk + '" onclick="deletetsk(' + countertsk + ')">Delete</a>' +
            '</div>' +
            '</div>' +
            ' </div>' +
            '</div> ');
        countertsk++;
        return false;
    });
    /*Save work flow*/
    $('form[id="saveworkflow"]').validate({
        submitHandler: function (form) {
            var wfname = $("#wfname").val();
            var wfdesc = $("#wfdesc").val();
            var struser = $("#drpuser").val();
            var druser = $("#drpuserlist1").val();
            var formData = new FormData();
            formData.append("wfname", wfname);
            formData.append("wfdesc", wfdesc);
            formData.append("struser", struser);
            var strevtname = "";
            var strdesc = "";
            var strtskname = "";
            var strtskdesc = "";
            var strdt = "";
            var drptask = "";
            var drptype = "";
            var totstage = "";
            for (var i = 1; i < counter; i++) {
                if (jQuery.type($("#wfevtname" + i).val()) !== "undefined") {
                    strevtname += $("#wfevtname" + i).val() + "^";
                    strdesc += $("#wfevtdesc" + i).val() + "^";
                }
            }
            for (var j = 1; j < countertsk; j++) {
                if (jQuery.type($("#wftskname" + j).val()) !== "undefined") {
                    strtskname += $("#wftskname" + j).val() + "^";
                    strtskdesc += $("#wftskdesc" + j).val() + "^";
                    strdt += $("#duedt" + j).val() + "^";
                    drptask += $("#drptask" + j).val() + "^";
                    drptype += $("#drptype" + j).val() + "^";
                    totstage += $("#totstage" + j).val() + "^";
                }
            }
            formData.append("strevtname", strevtname);
            formData.append("strdesc", strdesc);
            formData.append("strtskname", strtskname);
            formData.append("strtskdesc", strtskdesc);
            formData.append("strdt", strdt);
            formData.append("drptask", drptask);
            formData.append("drptype", drptype);
            formData.append("totstage", totstage);
            formData.append("duedts1", $("#duedts1").val());
            formData.append("duedts2", $("#duedts2").val());
            formData.append("duedts3", $("#duedts3").val());
            formData.append("duedts4", $("#duedts4").val());
            formData.append("formtype", $("#formtype").val());
            if ($("#drpuserlist1").val() == "") {
                alert("Plese select valid username in Stage 1");
                return false;
            }
            if ($("#drpuserlist2").val() == "") {
                alert("Plese select valid username in Stage 2");
                return false;
            }
            if ($("#drpuserlist3").val() == "") {
                alert("Plese select valid username in Stage 3");
                return false;
            }
            const element = document.querySelector('#divstage4');
            const display = element.style.display;
            if (display == "none") {
            }
            else {
                if ($("#drpuserlist4").val() == "") {
                    alert("Plese select valid username in Stage 4");
                    return false;
                }
            }
            formData.append("drpuserlist1", $("#drpuserlist1").val());
            formData.append("drpuserlist2", $("#drpuserlist2").val());
            formData.append("drpuserlist3", $("#drpuserlist3").val());
            formData.append("drpuserlist4", $("#drpuserlist4").val());
            var f1 = $.ajax(
                {
                    type: "POST",
                    url: "/api/WorkFlowNewApi/WorkFlowSave", // Controller/View
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        new PNotify({
                            title: 'Success!',
                            text: ' Workflow Added Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        var datas = JSON.stringify(data);
                        localStorage.setItem("tskid", data.Data.toString());
                    },
                    failure: function (data) {
                        alert(data.responseText);
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            $.when(f1).then(function (a1) {
                $("#hidtaskid").val(localStorage.getItem("tskid"));
                formData.append("taskid", $("#hidtaskid").val());
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/WorkFlowNewApi/InsertWorkFlowTaskStage", // Controller/View
                        dataType: 'json',
                        data: formData,
                        headers: { tskid: $("#hidtaskid").val() },
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            $("#saveworkflow")[0].reset();
                        },
                        failure: function (data) {
                            alert(data.responseText);
                        },
                        error: function (data) {
                            alert(data.responseText);
                        }
                    });
            }, function (jqXHR, textStatus, errorThrown) {
                //  alert('Either j1 or j2 failed!');
            });
        }
    });

    function deletetsk(str) {
        $("#divtsk" + str).remove();
    }
    function deleteevt(str) {
        $("#div" + str).remove();
    }
    /*Load form*/
    function loadform() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadPubCform",
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

    /*Load form for edit*/
    function loadformforEdit() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCform",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                $.each(obj, function (i, a) {
                    //alert(a.Id);
                    var option = '<option value="' + a["Id"] + '" > ' + a["FormName"] + '</option>';
                    $("#formtypeforedit").append(option);
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
    /*Load user*/
    function loadUser() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/WorkFlowNewApi/FirmUser",
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
                $("#drpuserlist1").append(option1);
                $("#drpuserlist2").append(option1);
                $("#drpuserlist3").append(option1);
                $("#drpuserlist4").append(option1);
                $("#drpuserlist5").append(option1);
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" > ' + a["UserName"] + '</option>';
                    $("#drpuserlist1").append(option);
                    $("#drpuserlist2").append(option);
                    $("#drpuserlist3").append(option);
                    $("#drpuserlist4").append(option);
                    $("#drpuserlist5").append(option);
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

    /*Load task item*/
    function loadTaskItem() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/WorkFlowNewApi/TaskItem",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    alert("not found");
                }
                var option1 = "<option value=\"\" >- Select Any -</option>";
                $("#drptask1").append(option1);
                $.each(response.Data, function (i, a) {
                    var option = '<option value="' + a["TaskItemId"] + '" > ' + a["TaskItem"] + ' - Workflow </option>';
                    $("#drptask1").append(option);
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
    $(function () {
        $("#txtuserlist1").typeahead({
            hint: true,
            highlight: true,
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    async: true,
                    url: '/api/WorkFlowNewApi/FirmUser',
                    data: "{ 'prefix': '" + request + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var datas = JSON.stringify(data);
                        var obj = JSON.parse(data.Data);
                        items = [];
                        map = {};
                        $.each(obj, function (i, item) {
                            // alert(item.UserName);
                            var id = item.Id;
                            var name = item.UserName;
                            map[name] = { id: id, name: name };
                            items.push(name);
                        });
                        response(items);
                        $(".dropdown-menu").css("height", "auto");
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            updater: function (item) {
                $('#drpuserlist1').val(map[item].id);
                request = map[item].id;
                return item;
            }
        });
    });
    $(function () {
        $("#txtuserlist2").typeahead({
            hint: true,
            highlight: true,
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    async: true,
                    url: '/api/WorkFlowNewApi/FirmUser',
                    data: "{ 'prefix': '" + request + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var datas = JSON.stringify(data);
                        var obj = JSON.parse(data.Data);
                        items = [];
                        map = {};
                        $.each(obj, function (i, item) {
                            // alert(item.UserName);
                            var id = item.Id;
                            var name = item.UserName;
                            map[name] = { id: id, name: name };
                            items.push(name);
                        });
                        response(items);
                        $(".dropdown-menu").css("height", "auto");
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            updater: function (item) {
                $('#drpuserlist2').val(map[item].id);
                request = map[item].id;
                return item;
            }
        });
    });
    $(function () {
        $("#txtuserlist3").typeahead({
            hint: true,
            highlight: true,
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    async: true,
                    url: '/api/WorkFlowNewApi/FirmUser',
                    data: "{ 'prefix': '" + request + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var datas = JSON.stringify(data);
                        var obj = JSON.parse(data.Data);
                        items = [];
                        map = {};
                        $.each(obj, function (i, item) {
                            // alert(item.UserName);
                            var id = item.Id;
                            var name = item.UserName;
                            map[name] = { id: id, name: name };
                            items.push(name);
                        });
                        response(items);
                        $(".dropdown-menu").css("height", "auto");
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            updater: function (item) {
                $('#drpuserlist3').val(map[item].id);
                request = map[item].id;
                return item;
            }
        });
    });
    $(function () {
        $("#txtuserlist4").typeahead({
            hint: true,
            highlight: true,
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    async: true,
                    url: '/api/WorkFlowNewApi/FirmUser',
                    data: "{ 'prefix': '" + request + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var datas = JSON.stringify(data);
                        var obj = JSON.parse(data.Data);
                        items = [];
                        map = {};
                        $.each(obj, function (i, item) {
                            // alert(item.UserName);
                            var id = item.Id;
                            var name = item.UserName;
                            map[name] = { id: id, name: name };
                            items.push(name);
                        });
                        response(items);
                        $(".dropdown-menu").css("height", "auto");
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            updater: function (item) {
                $('#drpuserlist4').val(map[item].id);
                request = map[item].id;
                return item;
            }
        });
    });
});
