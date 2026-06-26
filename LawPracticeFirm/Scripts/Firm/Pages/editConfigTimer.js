var input = {
    hours: 0,
    minutes: 00,
    seconds: 00
};
var interval = 1;
var timestamp = new Date(input.hours, input.minutes, input.seconds);
var t = '';
function timesr(durationVal) {
    let h = 0, m = 0, s = 0;

    if (durationVal && typeof durationVal === 'string') {
        const parts = durationVal.split(':');
        if (parts.length === 3) {
            h = parseInt(parts[0]) || 0;
            m = parseInt(parts[1]) || 0;
            s = parseInt(parts[2]) || 0;
        }
    }
    timestamp = new Date(0, 0, 0, h, m, s);

    // Start timer
    t = window.setInterval(function () {
        timestamp = new Date(timestamp.getTime() + interval * 1000);

        const formatted = timestamp.getHours() + 'h:' + timestamp.getMinutes() + 'm:' + timestamp.getSeconds() + 's';
        document.getElementById('countdown2').innerHTML = formatted;
        document.getElementById("duration3").value = formatted;
    }, Math.abs(interval) * 1000);
}

///end timer
/*Close loader*/
$('#closemodel').click(function () {
    clearInterval(t);
});
$('#closemodels').click(function () {
    clearInterval(t);
});

$('#crossmodels').click(function () {
    clearInterval(t);
});
function openload() {
    $('#myOverlay21').css("display", "block");
}
function closeload() {
    $('#myOverlay21').css("display", "none");
}
$(document).ready(function () {
    var orderItemsBrowse = [];
    var firstopenbrowse = true;
    $(".browsetaskfile").click(function () {
        $(".browsetaskfile").attr("title", "No file chosen");
        var tvalues = $(this).attr("values");
        var tmodule = $(this).attr("module");
        $("#mykasefilemodulename").val(tmodule);
        orderItemsBrowse = [];
        orderItemsBrowse.length = 0;
        GeneratedBrowseList();
        $("input:checkbox.loadbrowsedirlist").prop('checked', false);
        if (firstopenbrowse == true) {
            var defaultdid = 0;
            var url = "/firm/BrowseDirList/" + defaultdid + "?sttus=true&type=folder&module=" + tmodule;
            $('.loadbrowsedirlist').load(url, function (result) {
                closeload1();
                $('#myModalbrowsedocs').modal({ show: true });
                firstopenbrowse = false;
            });
        }
        else {
            $('#myModalbrowsedocs').modal({ show: true });
        }
    });
    var filenamesstring = [];
    /*Open browse folder*/
    $("#Openbrowsefolder").click(function () {
        $("#myModalbrowsedocs").modal("hide");
        filenamesstring = [];
        fileidstring = [];
        var tempfilenames = "";
        var curentmodulefilename = $("#mykasefilemodulename").val();
        if (orderItemsBrowse.length > 0) {
            $.each(orderItemsBrowse, function (i, val) {
                filenamesstring.push(val.Name);
                fileidstring.push(val.Id);
                tempfilenames = val.Name;
            });
            $("#browsefile" + curentmodulefilename).attr("title", orderItemsBrowse.length + " files selected. | FileName: " + JSON.stringify(filenamesstring));
            if (orderItemsBrowse.length > 1) {
                $("#browsefilelbl" + curentmodulefilename).html(orderItemsBrowse.length + " files");
            }
            else {
                var length = 18;
                var string = tempfilenames;
                var trimmedString = string.length > length ? string.substring(0, 7) + "..." + string.substring(string.length - 9, string.length) : string;
                $("#browsefilelbl" + curentmodulefilename).html(trimmedString);
            }
            //create runtime input type hidden jquery
            $("#mykasefileid" + curentmodulefilename).remove();
            $('#hiddenlist').append('<input type="text" name="mykasefileid' + curentmodulefilename + '" id="mykasefileid' + curentmodulefilename + '" value="' + fileidstring + '" />');
            if (String(curentmodulefilename) == "compareattachone") {
                var urlcmopare11 = "/Compare/UploadFileFromDrive1"
                compareattachonetwo(curentmodulefilename, urlcmopare11, "one");
            }
            else if (String(curentmodulefilename) == "compareattachtwo") {
                var urlcmopare12 = "/Compare/UploadFileFromDrive2"
                compareattachonetwo(curentmodulefilename, urlcmopare12, "two");
            }
            else if (String(curentmodulefilename) == "bundlepdf") {
                BundlePDFDrive(curentmodulefilename);
            }
        }
        else {
            $("#browsefile" + curentmodulefilename).attr("title", "No file chosen");
            $("#browsefilelbl" + curentmodulefilename).html("No file chosen");
            $("#mykasefileid" + curentmodulefilename).val("");
        }
    });
    $(document).on("click", ".cancelbrowse", function () {
        orderItemsBrowse = [];
        orderItemsBrowse.length = 0;
        $("input:checkbox.loadbrowsedirlist").prop('checked', false);
        var curentmodulefilename = $("#mykasefilemodulename").val();
        $("#browsefile" + curentmodulefilename).attr("title", "No file chosen");
        $("#browsefilelbl" + curentmodulefilename).html("No file chosen");
        $("#mykasefileid" + curentmodulefilename).val("");
        GeneratedBrowseList();
    });
    /*Load browser directory list*/
    $(document).on("click", "#loadbrowsedirlist", function () {
        if ($(this).prop('checked')) {
            var vdata = $(this).attr("dir-val");
            var vname = $(this).attr("dir-name");
            insertUniqueObject(orderItemsBrowse, vdata, vname)
            GeneratedBrowseList();
        }
        else {
            var vdata = $(this).attr("dir-val");
            var vname = $(this).attr("dir-name");
            RemoveUniqueObject(orderItemsBrowse, vdata, vname)
            GeneratedBrowseList();
        }
        // });
    });
    var insertUniqueObject = function (arr, vdata, vname) {
        let isExist = arr.some(o => o.Name === vname && o.Id === vdata);
        if (!isExist)
            arr.push({
                Name: vname,
                Id: vdata,
                Module: "",
            });
        return arr;
    }
    var RemoveUniqueObject = function (arr, vdata, vname) {
        let isExist = arr.some(o => o.Name === vname && o.Id === vdata);
        if (isExist)
            var index = arr.findIndex(o => o.Name === vname && o.Id === vdata);
        arr.splice(index, 1);
        return arr;
    }
    function GeneratedBrowseList() {
        if (orderItemsBrowse.length > 0) {
            var $table4 = $('<table id="tablebrowseselect" class="table-panel"/>');
            $table4.append('<thead><tr><th>Name</th><th style="text-align:center;">Action</th></thead>');
            var $tbody4 = $('<tbody/>');
            $.each(orderItemsBrowse, function (i, val) {
                var $row4 = $('<tr/>');
                $row4.append($('<td/>').html(val.Name));
                var $remove4 = $('<a href="#" style="display:block; text-align:center;"><img src="/newassets/img/darkdelete.svg;" id="loadbrowsedirlist" title="Delete" title="Delete" dir-val="' + val.Id + '" dir-name="' + val.Name + '" /></a>');
                $row4.append($('<td/>').html($remove4));
                $tbody4.append($row4);
                $table4.append($tbody4);
                $('#BrowseSelectedlist').html($table4);
            });
        }
        else {
            $('#BrowseSelectedlist').html('');
        }
    }
    openload();
    bindCommonDropdown("EditTimeentrytype", "TimeEntry_Type", 'Select');
    function bindCommonDropdown2(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.length;
                $.each(response.Data, function (i, a) {
                    //alert(a.Value);
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
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
    bindTask();
    /*Bind task*/
    function bindTask() {
        $("#item,#item2").find('option').remove().end().append('<option value="">Select</option>');
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomAndDefaultTask",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["CaseTaskName"] + '</option>';
                    $("#item,#item2").append(option);
                }); //End of foreach Loop
                //  //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                // alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                // alert(response.responseText);
            } //End of AJAX error function
        });
    }
    loadcontact();
    setTimeout(function () {
        loaddata();
    }, 2000);

    /*Load data*/
    function loaddata() {
        var formData = new FormData();
        formData.append("Id", timeid);
        $.ajax({
            async: true,
            url: '/api/CallApi/SingleTimeEnrty',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var aassign = "";
                    $.each(obj, function (i, val) {
                        $("#duration3").val(val.callDura);
                        if (val.tcontact != null) {
                            $('#contact2 option[value="' + val.tcontact.toUpperCase() + '"]').attr("selected", true);
                            $('#contact2 option[value="' + val.tcontact + '"]').attr("selected", true);
                        }
                        if (val.tmatter != null) {
                            var option1 = '<option value="' + val.tmatter + '" selected > ' + val.mattername + '</option>';
                            $("#matter2").append(option1);
                        }
                        if (val.titem != null) {
                            $('#item2 option[value="' + val.titem + '"]').attr("selected", true);
                        }
                        if (val.tbillby != null) {
                            $('#billby2 option[value="' + val.tbillby + '"]').attr("selected", true);
                        }
                        if (val.TimeEntryType != null) {
                            $('#EditTimeentrytype option[value="' + val.TimeEntryType + '"]').attr("selected", true);
                        }
                        var dat = val.tdate;
                        var dates1 = dat.substring(0, 10);
                        $("#dt2").val(dates1);
                        $("#hrate2").val(val.hrrate);
                        $("#total2").val(val.total);
                        if (val.tbill == "1") {
                            $("#billable2").prop("checked", true);
                        }
                        else {
                            $("#billable2").prop("checked", false);
                        }
                        CKEDITOR.instances['details1'].setData(val.tdetails);
                        $("#privnotes2").val(val.tprivnotes);
                    });
                    closeload();
                }
                else {
                    //alert("not found");
                }
            },
            error: function () {
                closeload();
            }
        });
        closeload();
    }
    $("#stoptimer").css("display", "none");
    $("#starttimer").click(function () {
        $("#starttimer").css("display", "none");
        $("#stoptimer").css("display", "block");
        const durationVal = $("#duration3").val();

        console.log("oldTimeStamp", durationVal);
        timesr(durationVal);
    });
    $("#stoptimer").click(function () {
        clearInterval(t);
        $("#starttimer").css("display", "block");
        $("#stoptimer").css("display", "none");
    });

    // load contact
    function loadcontact() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/SpClientDataNew',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({}),
            dataType: "json",
            success: function (response) {
                var obj = [];
                if (response.Status == true) {
                    obj = JSON.parse(response.Data);
                }
                $("#contact2").empty().append("<option value=''>Select</option>");
                $.each(obj, function (i, a) {
                    var displayName = (a.LabelName || '').trim();
                    if (a.utype) {
                        displayName += ' (' + a.utype + ')';
                    }
                    var option = '<option value="' + a.val + '" >' + displayName + '</option>';
                    $("#contact2").append(option);
                });
            },
            failure: function (response) {
                // alert(response.responseText);
            },
            error: function (response) {
                // alert(response.responseText);
            }
        });
    }
    $("#contact2").change(function () {
        $('#matter2').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
        }
        else {
            $('#matter2').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        }
    });

    // Load Matter
    function loadmatter(clientid) {
        $('#matter2').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/LoadMatterforclient",
            headers: {
                "clientid": clientid
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    // alert("not found");
                }
                $.each(JSON.parse(response.Data), function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#matter2").append(option);
                    }
                });
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    clearInterval(t);
});

//save data
$('form[id="savecallform2"]').validate({
    submitHandler: function (form) {
        var contact = $('#contact2').val();
        var matter = $('#matter2').val();
        var item = $('#item2').val();
        var dt = $('#dt2').val();
        var duration = $('#duration3').val();
        var Timeentrytype = $('#EditTimeentrytype').val();
        duration = String(duration).replace(/([a-zA-Z ])/g, "");
        var patt3 = /[0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}$/m;
        var result1 = String(duration).match(patt3);
        if (result1 == null) {
            new PNotify({
                title: 'Warning!',
                text: 'Please Enter Correct Call Duration Formate: 00h:00m:00s',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        var array = duration.split(":");
        var ahour = String(array[0]).replace(/\D/g, '');
        var amin = String(array[1]).replace(/\D/g, '');
        var asec = String(array[2]).replace(/\D/g, '');
        if (ahour == 0 && amin == 0 && asec == 0) {
            new PNotify({
                title: 'Warning!',
                text: 'Time can not be 0h:0m:0s',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        if (ahour > 23) {
            new PNotify({
                title: 'Warning!',
                text: 'Hour should be less than 24 hour ',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        if (amin > 59) {
            new PNotify({
                title: 'Warning!',
                text: 'Minute should be less than 60 minutes ',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        if (asec > 59) {
            new PNotify({
                title: 'Warning!',
                text: 'Second should be less than 60 seconds',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        var details = CKEDITOR.instances.details1.getData();
        var billby = $('#billby2').val();
        var hrate = $('#hrate2').val();
        var total = $('#total2').val();
        var privnotes = $('#privnotes2').val();
        if (item == "") {
            alert("select task");
            $('#item').focus();
            return false;
        }
        if (item == "Others") {
            alert("select task");
            $('#item').focus();
            return false;
        }
        if (dt == "") {
            alert("select date");
            $('#dt').focus();
            return false;
        }
        var formData = new FormData();
        var ad = '';
        if ($("#billable:checked").prop('checked')) {
            ad = $("#billable:checked").val();
        }
        else {
            ad = false;
        }
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("postedfile").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("postedfile").files[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
                return false;
            }
            formData.append("FileUpload", file);
            try {
                if (typeof (file) != "undefined") {
                    size = parseFloat(file.size / 1024).toFixed(2);
                    tottempsize = parseFloat(tottempsize) + parseFloat(size);
                    tempsize = parseFloat(size);
                }
            }
            catch (err) {
                //alert(err.message);
            }
            tempsize = tempsize.toFixed(2);
            if (tempsize > filesize) {
                new PNotify({
                    title: 'Warning!',
                    text: Filesizelabel,
                    type: 'error',
                    delay: 3000
                });
                return false
            }
        }
        formData.append("contact", contact);
        formData.append("matter", matter);
        formData.append("item", item);
        formData.append("dt", dt);
        formData.append("duration", duration);
        formData.append("details", details);
        formData.append("billable", ad);
        formData.append("billby", billby);
        formData.append("hrate", hrate);
        formData.append("total", total);
        formData.append("prevnotes", "");
        formData.append("id", timeid);
        formData.append("type", Timeentrytype);
        formData.append("savemykasefileid", $("#mykasefileidEditTimeEntry").val());
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/PostUpdateTimer", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                //},
                success: function (data) {
                    var InfectFilesResult = "";
                    if (String(data.Data.Result) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        closeload();
                        return false;
                    }
                    else if (String(data.Data.Result) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        closeload();
                        return false;
                    }
                    else if (data.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + data.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    $("#mykasefileidEditTimeEntry").val("");
                    $("#browsefileEditTimeEntry").attr("title", "No file chosen");
                    $("#browsefilelblEditTimeEntry").html("No file chosen");
                    $("#postedfile").val("");
                    $("#savecallform2")[0].reset();
                    //document.getElementById("closemodel").click();
                    new PNotify({
                        title: 'Success!',
                        text: ' Time Entry Updated Successfully</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    localStorage.setItem("setname1", "calender");
                    localStorage.setItem("savetimeentry", "savetimeentry");
                    closeload();
                    $('#myModal5').modal('hide');
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                } //End of AJAX error function
            });
    }
});