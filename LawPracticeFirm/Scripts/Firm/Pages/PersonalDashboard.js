$(document).ready(function () {
    //$('.freeze-text').each(function () {
    //    if (this.offsetWidth < this.scrollWidth) {
    //        $(this).attr('title', $(this).text().trim());
    //    } else {
    //        $(this).removeAttr('title');
    //    }
    //});
    $(document).on('mouseenter', '.freeze-text', function (e) {
        if (this.offsetWidth < this.scrollWidth) {
            const text = $(this).text().trim();

            $('body').append('<div id="custom-tooltip"></div>');
            $('#custom-tooltip')
                .text(text)
                .css({
                    position: 'absolute',
                    top: e.pageY + 10,
                    left: e.pageX + 10,
                    background: '#000',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 1000,
                    whiteSpace: 'normal',
                    maxWidth: '300px'
                });
        }
    });

    $(document).on('mouseleave', '.freeze-text', function () {
        $('#custom-tooltip').remove();
    });

    $(document).on('mousemove', '.freeze-text', function (e) {
        $('#custom-tooltip').css({
            top: e.pageY + 10,
            left: e.pageX + 10
        });
    });
    const priorityClassMap = {
        "in process": "in-process",
        "completed": "medium",
        "overdue": "high"
    };
    $("#callfromdate").attr("min", new Date().toISOString().substring(0, 10));
    //document.getElementById('attachmenttask4').addEventListener('change', function () {
    //    const files = this.files;
    //    const display = document.getElementById('fileNameDisplay');
    //    if (files.length > 0) {
    //        const fileNames = Array.from(files).map(file => file.name).join(', ');
    //        display.textContent = fileNames;
    //    } else {
    //        display.textContent = 'No file chosen';
    //    }
    //});
    /*Load matter by client id*/
    function loadmatter(clientid, control) {
        $('#' + control).empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
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
                    //alert("not found");
                }
                $.each(JSON.parse(response.Data), function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '"  tempname="' + mattername + '"> ' + mattername + '</option>';
                        $("#" + control).append(option);
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
    $('body').on("click", ".dropdown-menuinbox  li", function (e) {
        var strid = $(this).attr("data-id");
        if (e.target != "[object HTMLInputElement]") {
            setTimeout(function () {
                $("#btngroup" + strid).addClass("open").addClass("open");
            }, 5);
        }
        else {
            e.stopPropagation();
        }
    });
    /*Load inbox task*/
    $(document).on("click", "#a_taskrequest", function () {
        $("#bindcasetask tr").remove();
        $("#ifiltertask").val("");
        $("#ifilterclient").val("");
        $("#ifiltercasescheduler").val("");
        $("#taskrequesttab").show();
        $("#inboxtab").hide();

        LoadTaskData(1);

    });
    /*Load inbox task*/
    $(document).on("click", "#a_taskinbox", function () {
      
        $("#ibindcasetask tr").remove();
        $("#ifiltertask").val("");
        $("#ifilterclient").val("");
        $("#ifiltercasescheduler").val("");
        $("#taskrequesttab").hide();
        $("#inboxtab").show();
        //taskrequesttabevt
        iLoadTaskData(1);


    });
    /*Load over due task*/
    $(document).on("click", "#a_taskoverdue", function () {
        $("#dbindcasetask tr").remove();
        $("#dfiltertask").val("");
        $("#dfilterclient").val("");
        $("#dfiltercasescheduler").val("");
        $("#dfilteruserto").val("");
        $("#taskrequesttab").hide();
        $("#inboxtab").hide();
        isRenderPage_Over = false;
        dLoadTaskData(1);
    });

    /*Load outbox task*/
    $(document).on("click", "#a_taskoutbox", function () {
        $("#ofiltertask").val("");
        $("#ofilterclient").val("");
        $("#ofiltercasescheduler").val("");
        $("#ofilteruserscheduleto").val("");
        $("#ofilterStatus").val("");
        $("#taskrequesttab").hide();
        $("#inboxtab").hide();

        oLoadTaskData(1);
    });
    /*Archive task*/
    $(document).on("click", "#a_taskarchive", function () {
        $("#ofiltertaskarchive").val("");
        $("#afilterclient").val("");
        $("#afiltercasescheduler").val("");
        $("#afilteruserto").val("");
        $("#afilterStatus").val("");
        $("#taskrequesttab").hide();
        $("#inboxtab").hide();

        oLoadTaskArchiveData(1);
    });
    $(document).on("click", "#CompleteTaskattachment", function () {
        var tokenid = tempTokenId;
        var srno = globalFileId;
        //var result = confirm("Are you sure to save attachment?");
        //if (result) {
            var attachmenttask = "attachmenttask4";
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            var totalFiles = document.getElementById(attachmenttask).files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById(attachmenttask).files[i];
                var filename = file.name;
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                    return false;
                }
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
            formData.append("token", tokenid);
            formData.append("savemykasefileid", EncodeText($("#mykasefileidcompletetask" + srno).val()));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SaveAttachmentCompleteTask",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    //alert(response1.Data);
                    if (response1.Data.Result == 1) {
                        var InfectFilesResult = "";
                        if (response1.Data.InfectFiles != "") {
                            InfectFilesResult = VirusScanResultMsgBefore + " " + response1.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                        }
                        new PNotify({
                            title: 'Success!',
                            text: 'This has been saved successfully.</br>' + InfectFilesResult,
                            type: 'success',
                            delay: 3000
                        });
                        dLoadTaskData(dpageindex);
                        closeload();
                        loadInoutCount();
                        oLoadTaskData(opageindex);
                        iLoadTaskData(ipageindex);
                    }
                    else if (String(response1.Data.Result) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        closeload();
                        return false;
                    }
                    else if (String(response1.Data.Result) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        closeload();
                        return false;
                    }
                    else {
                        alert("Please select the attachment.");
                        $("#attachmenttask" + srno).focus();
                        closeload();
                        return false;
                    }
                },
                failure: function (response1) {
                    alert(response1.responseText);
                    closeload();
                },
                error: function (response1) {
                    alert(response1.responseText);
                    closeload();
                }
            });
        //}
    });
    var ipageindex = 1, ipagesize = 10, irecordcount = 0, itotrecord = 0;
    $(document).on("click", "#acancel", function () {
        var strid = $(this).attr("data-temp");
        $("#inacptdiv" + strid).show();
        $("#inacrjtdiv" + strid).hide();
        iLoadTaskData(ipageindex);
    });
    $(document).on("click", "#ainbox", function () {
        var strid = $(this).attr("data-temp");
        var tokenid = $(this).attr("data-id");
        var inboxstartdate = $("#inboxstartdate" + strid).val();
        var inboxenddate = $("#inboxenddate" + strid).val();
        if (inboxstartdate != "" || inboxenddate != "") {
            if (inboxstartdate == "") {
                alert("Please select start date.");
                return false;
            }
            if (inboxenddate == "") {
                alert("Please select end date.");
                return false;
            }
            var date1 = new Date(inboxstartdate);
            var date2 = new Date(inboxenddate);
            if (date2 < date1) {
                alert("Please enter a valid start / end date. Start date cannot be after the end date.");
                return false;
            }
        }
        var formData = new FormData();
        formData.append("tokenid", tokenid);
        formData.append("inboxstartdate", EncodeText(inboxstartdate));
        formData.append("inboxenddate", EncodeText(inboxenddate));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/UpdateGaintChartDate",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (parseInt(response1.Data) > 0) {
                    alert("Duration Added Successfully");
                    $("#inacptdiv" + strid).hide();
                    $("#inacrjtdiv" + strid).hide();
                    iLoadTaskData(ipageindex);
                }
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
        iLoadTaskData(1);
    });
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });




    $(document).on("click", "#completetaskfilelink", function () {
        openload();
        var fileid = globalToken;
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=completetask&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#modalShowDocumentFileDocumentOverDue').modal('hide');
            $('#myModal').modal({ show: true });
        });
    });
    $(document).on("click", "#Deletesingle_final", function () {
        var result = confirm("Are you sure you want to delete task from archive.");
        if (result) {
            var idval = globalToken;
            var formData = new FormData();
            formData.append("tokenid", idval);
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveFirmCaseTask",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data == 1) {
                        alert("The task has been deleted successfully.");
                        oLoadTaskArchiveData(1);
                        $('#myModalmarkDelete').modal('hide');

                        closeload();
                    }
                    else {
                        alert("Oops! Something went wrong.");
                    }
                    closeload();
                },
                failure: function (response1) {
                    alert(response1.responseText);
                    closeload();
                },
                error: function (response1) {
                    alert(response1.responseText);
                    closeload();
                }
            });
        }
    });
    //start next hearing///////////////
    //load chart next hearing 
    function loadchartnexthearing() {
        var d1 = $.ajax({
            async: true,
            url: "/firm/LoadNextHearingGraph",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                //alert(response);
                chartarray4 = [];
                chartcount4 = [];
                var dataT = "";
                var dataT2 = "";
                var htul = '';
                response.sort(GetSortOrder("Disposeddt"));
                $.each(response, function (i, val) {
                    chartarray4.push(val.t);
                    console.log(val.Disposeddt);
                    htul += '<li>';
                    htul += ' <a href="javascript:void()" title="Next Hearing: (' + moment(val.Disposeddt).format("DD-MMM-YYYY") + ') - ' + val.Casetype + ' ' + val.CaseNo + ' / ' + val.Caseyear + ' (' + val.CourseName + ')" ><span class="text" style="color:black;font-weight:normal">' + val.Casetype + '  ' + val.CaseNo + ' /  ' + val.Caseyear + ')</span></a >';
                    htul += '<small class="label label-info"><i class="fa fa-clock-o"></i>  ' + moment(val.Disposeddt).format("DD-MMM-YYYY") + '</small>';
                    htul += '</li>';
                })
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    $(document).on("click", "#dueCompleteTaskattachment", function () {
        var tokenid = globalToken;
        var srno = srnotemp;
        //var result = confirm("Are you sure to save attachment?");
        //if (result) {
            var attachmenttask = "dueattachmenttask2";
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            var totalFiles = document.getElementById(attachmenttask).files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById(attachmenttask).files[i];
                var filename = file.name;
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                    return false;
                }
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
            formData.append("token", tokenid);
            formData.append("savemykasefileid", EncodeText($("#mykasefileidduecompletetask" + srno).val()));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SaveOverdueAttachmentCompleteTask",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (parseInt(response1.Data.Result) > 0) {
                        var InfectFilesResult = "";
                        if (response1.Data.InfectFiles != "") {
                            InfectFilesResult = VirusScanResultMsgBefore + " " + response1.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                        }
                        new PNotify({
                            title: 'Success!',
                            text: 'This has been saved successfully.</br>' + InfectFilesResult,
                            type: 'success',
                            delay: 3000
                        });
                        $("#mykasefileidduecompletetask" + srno).val("");
                        $("#browsefileduecompletetask" + srno).attr("title", "No file chosen");
                        $("#browsefilelblduecompletetask" + srno).html("No file chosen");
                        LoadTaskData(pageindex, curtab);
                        dLoadTaskData(dpageindex);
                        closeload();
                        loadInoutCount();
                        oLoadTaskData(opageindex);
                        iLoadTaskData(ipageindex);
                    }
                    else if (String(response1.Data.Result) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        closeload();
                        return false;
                    }
                    else if (String(response1.Data.Result) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        closeload();
                        return false;
                    }
                    else {
                        alert("Please select the attachment.");
                        $("#dueattachmenttask" + srno).focus();
                        closeload();
                        return false;
                    }
                },
                failure: function (response1) {
                    alert(response1.responseText);
                    closeload();
                },
                error: function (response1) {
                    alert(response1.responseText);
                    closeload();
                }
            });
        //}
    });
    function GetSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        }
    }
    function myFunction1() {
        var x = document.getElementById("bd");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }
    //end next hearing//////////
    //setInterval(function () {
    //    var inval = localStorage.getItem("activityremind");
    //    if (String(inval) == "1") {
    //        loadactivityreminder();
    //        localStorage.setItem("activityremind", "2");
    //    }
    //    var invalenc = localStorage.getItem("encremind");
    //    if (String(invalenc) == "1") {
    //        loadesclist();
    //        localStorage.setItem("encremind", "2");
    //    }
    //}, 3000);
    function clearForm() {
        $('#saveactivityalert')[0].reset();
    }
    $(document).on("click", "#clrFormDetails", function () {
        $('#saveactivityalert')[0].reset();
        $('#myModalreminder').modal('hide');
    })

    /*Create alert*/
    var taskalerttoken = "";
    $("#createalert").click(function () {
        var alertid = $("#edittoken").val();
        var alertDays = $("#ddldays").val();
        var hearingAlert = $("#ddlHearing").val();
        var caldate = $("#callfromdate").val();
        var duedate = $("#alertduedate").val();
        var reminderfor = $("#reminderfor").val();
        var formData = new FormData();
        if (duedate == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please select due date',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (caldate != "") {
            var currentDt = new Date(caldate);
            var mm = currentDt.getMonth() + 1;
            mm = (mm < 10) ? '0' + mm : mm;
            var dd = currentDt.getDate();
            dd = (dd < 10) ? '0' + dd : dd;
            var yyyy = currentDt.getFullYear();
            caldate = mm + '/' + dd + '/' + yyyy;
        }
        if (caldate != "" && (hearingAlert != "0" || alertDays != "")) {
            alert("Please select one Date");
            return false;
        }
        if (alertid == "") {
            if (caldate == "") {
                if (hearingAlert != 3) {
                    if (alertDays == 0) {
                        alert("Please Set Alert Date");
                        return false;
                    }
                }
                if (hearingAlert == 0) {
                    alert("Please Set Alert Date");
                    return false;
                }
                if (hearingAlert == 3 && alertDays == "") {
                    alertDays = "0";
                }
            }
            if (caldate != "") {
                alertDays = 0;
                hearingAlert == 0;
            }
        }
        if (reminderfor == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please select reminder for',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        formData.append("hearingAlert", EncodeText(hearingAlert));
        formData.append("alertDays", EncodeText(alertDays));
        formData.append("caldate", EncodeText(caldate));
        formData.append("etype", EncodeText("Task"));
        formData.append("alertid", EncodeText(alertid));
        formData.append("duedate", EncodeText(duedate));
        formData.append("eventid", EncodeText(taskalerttoken));
        formData.append("remark", EncodeText($("#alertremark").val()));
        formData.append("reminderfor", EncodeText(reminderfor));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/saveactivityeventalerts",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "success") {
                    alert("Alert saved successfully");
                    clearForm();
                    $("#customeventblock").css("display", "none");
                    $("#customevent").val("");
                    localStorage.setItem("activityremind", "1");
                    $("#eventtext").html("Create");
                    $("#filelist").html("");
                    $("#seconddiv").css("display", "none");
                    $("#firstdiv").css("display", "unset");
                    $("#tempeventname").html("");
                    $("#edittoken").val("");
                    $("#edittoken").val("");
                    $('#ddlHearing').prop('selectedIndex', 0);
                    $('#ddldays').prop('selectedIndex', 0);
                    $('#saveactivityalert')[0].reset();
                    var setdate = new Date(duedate)
                    setdate.setDate(setdate.getDate() + 1);
                    $("#alertduedate").val(new Date(setdate).toISOString().substring(0, 10));
                    closeload();
                }
                else {
                    alert(data.Data);
                    closeload();
                }
            }
        });
    });

    /*Load reminder activity*/
    function loadactivityreminder() {
        $("#edittoken").val("");
        $("#bindatareminder").html("");
        var html1 = '';
        var eventid = taskalerttoken;
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
                    //$("#dataremindstatus").html("");
                    $("#textcaseidcallremind").hide();
                    closeload();
                }
                else {
                    $("#textcaseidcallremind").show();
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
                    var EventName = $("#duedatestxt").html();
                    html1 += '<tr><td>' + qty1 + '</td><td>' + EventName + '</td><td>' + a.alertDays + '</td><td>' + alerts + '</td><td width="120px;">' + formatDatetoIST(a.Duedate) + '</td><td width="120px;">' + formatDatetoIST(a.AlertDate) + '</td><td>' + a.Createdby + '</td><td>' + formatDatetoIST(a.Date_time) + '</td><td><a href="javascript:void()" id="removealert" data-val="' + a.Id + '" title="Remove activity alert"><span class="glyphicon glyphicon-trash" style="color:red"></a>&nbsp;|&nbsp;<a href="javascript:void()" id="editalert" style="color:black !Important;" event-val="' + a.EventName + '" data-val="' + a.Id + '" title="Edit activity alert"><span style="color:black !Important;" class="glyphicon glyphicon-edit" style="color:#72afd2"></a></td><td>' + a.Remark + '</td>'
                    if (a.CreatedForReminder != null) {
                        html1 += '<td> ' + a.CreatedForReminder + '</td>'
                    }
                    else {
                        html1 += '<td>' & nbsp; '</td>'
                    }
                    html1 += '</tr > ';
                });
                $("#bindatareminder").append(html1).hide().fadeIn('slow');;
            },
            failure: function (response1) {
                alert(response1.responseText);
            },
            error: function (response1) {
                alert(response1.responseText);
            }
        });
    }

    $(document).on("click", "#gopreviuspage", function () {
        $("#showPreDetail").show();
        $("#gopreviuspage").hide();
    });


    $(document).on("click", "#showPreDetail", function () {
        $("#showPreDetail").hide();
        $("#gopreviuspage").show();
        loadactivityreminder();
    });
    /*Set alert*/
    $(document).on("click", "#setalert", function () {
        openload();
        $('#gopreviuspage').trigger('click');
        $("#eventtext").html("Set Alert");
        var idval = $(this).attr("val-data");
        taskalerttoken = idval;
        var taskname = $(this).attr("val-task");
        var duedate = $(this).attr("duedate");
        var alertfor = $(this).attr("alertfor-val");
        var assigntoval = $(this).attr("assignto-val");
        var setdate = new Date(duedate)
        setdate.setDate(setdate.getDate() + 1);
        $("#duedatestxt").text(taskname);
        $("#alertduedate").val(new Date(setdate).toISOString().substring(0, 10));
        $("#callfromdate").attr("max", new Date(setdate).toISOString().substring(0, 10));
        $("#createalert").attr("alertfor", alertfor);
        var html78 = '';
        if (alertfor == "all") {
            html78 += '<option value="Assignee" >Assignee(' + assigntoval + ')</option>';
            html78 += '<option value="Self"  selected> Self</option>';
            html78 += '<option value="Both" > Both</option>';
        }
        else {
            html78 += '<option value="Self"  selected> Self</option>';
        }
        $("#reminderfor").empty().html(html78);
        //$('.nav-pills a[href="#1a111"]').tab('show');
        $('#myModalreminder').modal({ show: true });
        loadactivityreminder();
        closeload();
    });

    /*Remove alert*/
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
                failure: function (response1) {
                    alert(response1.responseText);
                },
                error: function (response1) {
                    alert(response1.responseText);
                }
            });
        }
    });
    $(document).on("click", "#editalert", function () {
        $("#eventtext").html("Set Alert");
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
        formData.append("remark", EncodeText($("#alertremark").val()));
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
                    $("#alertduedate").val(String(a.Duedate).replace(/\T.+/g, "$'"));
                    $("select#ddldays").val(a.alertDays);
                    $("select#ddlHearing").val(a.Alert);
                    $("#alertremark").val(a.Remark);
                    $("#reminderfor").val(a.CreatedForReminder);
                });
            },
            failure: function (response1) {
                alert(response1.responseText);
            },
            error: function (response1) {
                alert(response1.responseText);
            }
        });
    });
    var timerID = setInterval(function () {
        try {
            var chckommanitem = localStorage.getItem("Checkcommansidetask");
            if (chckommanitem != "") {
                LoadTaskData(pageindex, curtab);
                closeload();
                iLoadTaskData(ipageindex);
                oLoadTaskData(opageindex);
                loadInoutCount();
                dLoadTaskData(dpageindex);
                localStorage.setItem("Checkcommansidetask", "");
            }
        }
        catch (er) {
        }
    }, 5000);
    $("#cleardate").css("display", "block");
    document.getElementById("savetaskform").reset();
    function scheduleloadUser() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/ScheduleTaskAssignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    // alert(a.UserName);      
                    var option = '<option value="' + a["AssignUser"] + '" > ' + a["UserId"] + ' (' + a["RoleName"] + ')</option>';
                    $("#filteruserschedule,#filteruserscheduleby,#filteruserscheduleto").append(option);
                });
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    }
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var searchflag = false;
    var chckfilter = false;
    var tempexcel = false;
    var fromdatefilter = new Date().toISOString().substring(0, 10);
    var todatefilter = new Date().toISOString().substring(0, 10);
    var pagenames;
    var pagenames1 = location.pathname.split('/');
    var pagenames = pagenames1[3];
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    var curtab = "";

    /*Load task details by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    LoadTaskData(pageindex, curtab);
                    closeload();
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

    /*Delete task*/
    $(document).on('click', '#archivesingle_finalOutgoing', function () {

        //var result = confirm("Are you sure to archive task?");
        //if (result) {
            var formData = new FormData();
            formData.append("token", globalToken);
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveCaseTask",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (parseInt(data.Data) > 0) {
                        //alert("The task has been added to archive successfully.");
                        new PNotify({
                            title: 'Success!',
                            text: 'The task has been added to archive successfully.',
                            type: 'success',
                            delay: 3000
                        });
                        $('#myModalmarkArchiveconfirmationOutgoing').modal('hide');
                        closeload();
                        isRenderPage_out = false;
                        oLoadTaskData(opageindex);
                        oLoadTaskArchiveData(apageindex);
                        LoadTaskData(pageindex, curtab);
                        iLoadTaskData(ipageindex);
                        loadInoutCount();
                        dLoadTaskData(dpageindex);
                    }
                    else {
                        //alert(data.Data);
                        new PNotify({
                            title: 'Info!',
                            text: data.Data,
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                }
            });
        //}
    });

    /*Unarchive task dettails*/
    $(document).on('click', '#archivesingle_final', function () {
        //var result = confirm("Are you sure to unarchive task?");
        //if (result) {
            var formData = new FormData();
            formData.append("token", globalToken);
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveCaseTask",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (parseInt(data.Data) > 0) {
                        //alert("The task has been removed from archive successfully.");
                        new PNotify({
                            title: 'Success!',
                            text: 'The task has been removed from archive successfully.',
                            type: 'success',
                            delay: 3000
                        });
                        $('#myModalmarkArchiveconfirmation').modal('hide');

                        closeload();
                        oLoadTaskData(opageindex);
                        oLoadTaskArchiveData(apageindex);
                        LoadTaskData(pageindex, curtab);
                        iLoadTaskData(ipageindex);
                        loadInoutCount();
                        dLoadTaskData(dpageindex);
                    }
                    else {
                        //alert(data.Data);
                        new PNotify({
                            title: 'Info!',
                            text: data.Data,
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                }
            });
        //}
    });
    $(document).on('click', '#paginate', function () {
        var chksearchs = $("#myinput").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        LoadTaskData(pageindex, "#frange");
    });

    /*Clear date*/
    $("#cleardate").click(function () {
        fromdatefilter = "";
        $("#cleardate").css("display", "none");
        LoadTaskData(1, curtab);
    })
    /*Filter date*/
    $("#filterdate").change(function () {
        $("#cleardate").css("display", "block");
        LoadTaskData(1, curtab);
    })
    $("#filtertask").change(function () {
        isRenderPage = false;
        LoadTaskData(1, curtab);
    })
    /*Filter task*/
    $("#filterclient").change(function () {
        isRenderPage = false;
        loadmatter($(this).val(), "filtercasescheduler");
        LoadTaskData(1, curtab);
    })
    /*Filter user schedule*/
    $("#filteruserschedule").change(function () {
        isRenderPage = false;

        LoadTaskData(1, curtab);
    });
    $("#filteruserscheduleby").change(function () {
        isRenderPage = false;
        LoadTaskData(1, curtab);
    });
    $("#filteruserscheduleto").change(function () {
        isRenderPage = false;

        LoadTaskData(1, curtab);
    });
    $("#filterduedatescheduler").change(function () {
        isRenderPage = false;

        LoadTaskData(1, curtab);
        $("#duecleardate").css("display", "block");
    });
    $("#filterStatus").change(function () {
        isRenderPage = false;

        LoadTaskData(1, curtab);
    });
    $("#filterscttime").change(function () {
        isRenderPage = false;

        LoadTaskData(1, curtab);
        $("#scttimecleardate").css("display", "block");
    });
    $("#filterAcceptRejectBy").change(function () {
        isRenderPage = false;

        LoadTaskData(1, curtab);
        $("#AcceptRejectBycleardate").css("display", "block");
    });
    $("#rangebtn").click(function () {
        isRenderPage = false;

        LoadTaskData(1, "#frange");
    })
    $('#filterbox a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        pageindex = 1;
        var target = $(e.target).attr("href"); // activated tab
        curtab = target;
        if (target == "#ftoday") {
            $("#rangesearchfrom,#rangesearchto").val("");
            $("#prangediv").hide();
            isglobalsearch = "";
            LoadTaskData(pageindex, target);
        }
        if (target == "#ftomorrow") {
            $("#prangediv").hide();
            $("#rangesearchfrom,#rangesearchto").val("");
            isglobalsearch = "";
            LoadTaskData(pageindex, target);
        }
        if (target == "#frange") {
            $("#prangediv").show();
            $("#rangesearchfrom,#rangesearchto").val("");
        }
        if (target == "#fweek") {
            $("#rangesearchfrom,#rangesearchto").val("");
            $("#prangediv").hide();
            isglobalsearch = "";
            LoadTaskData(pageindex, target);
        }
    });
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    $("#sortscheduler").click(function () {
        var sortvalue = $(this).attr("sortvalue");
        if (sortvalue == "") {
            $(this).attr("sortvalue", "desc");
            sortvalue = "desc";
        }
        else if (sortvalue == "asc") {
            $(this).attr("sortvalue", "desc");
        }
        else {
            $(this).attr("sortvalue", "asc");
        }
        isRenderPage = false;

        LoadTaskData(pageindex, curtab, sortvalue);
    });
    /*Load task data*/
    function LoadTaskData(pageindex, type = null, sortvalue = null) {
        $("#tfooter").html("");
        if (type == "#ftoday") {
            fromdatefilter = new Date().toISOString().substring(0, 10);
            todatefilter = new Date().toISOString().substring(0, 10);
        }
        else if (type == "#ftomorrow") {
            fromdatefilter = new Date().toISOString().substring(0, 10);
            fromdatefilter = new Date(new Date(fromdatefilter).setDate(new Date(fromdatefilter).getDate() + 1)).toISOString().substring(0, 10);
            todatefilter = fromdatefilter;
        }
        else if (type == "#frange") {
            fromdatefilter = $("#rangesearchfrom").val();
            if (fromdatefilter == "") {
                alert("Please select from date.");
                $("#rangesearchfrom").focus();
                return false;
            }
            todatefilter = $("#rangesearchto").val();
            if (todatefilter == "") {
                alert("Please select to date.");
                $("#rangesearchto").focus();
                return false;
            }
        }
        else if (type == "#fweek") {
            var curr = new Date;
            var fromdatefilter = new Date(curr.setDate(curr.getDate() + 1 - curr.getDay())).toISOString().substring(0, 10);
            var todatefilter = new Date(curr.setDate(curr.getDate() + 1 - curr.getDay() + 6)).toISOString().substring(0, 10);
        }
        else {
            checktokendate = getParameterByName('type', window.location.href);
            if (checktokendate == "today") {
                fromdatefilter = new Date().toISOString().substring(0, 10);
                todatefilter = new Date().toISOString().substring(0, 10);
                $("#ftoday").click();
            }
            else {
                var curr = new Date;
                var fromdatefilter = new Date(curr.setDate(curr.getDate() + 1 - curr.getDay())).toISOString().substring(0, 10);
                var todatefilter = new Date(curr.setDate(curr.getDate() + 1 - curr.getDay() + 6)).toISOString().substring(0, 10);
            }
        }
        var html3 = '';
        var formData = new FormData();
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        formData.append("datefilterfrom", EncodeText(fromdatefilter));
        formData.append("datefilterto", EncodeText(todatefilter));
        formData.append("filtertask", EncodeText($("#filtertask").val()));
        formData.append("filterclient", EncodeText($("#filterclient").val()));
        formData.append("filteruser", EncodeText($("#filteruserschedule").val()));
        formData.append("filterStatus", EncodeText($("#filterStatus").val()));
        formData.append("filteruserby", EncodeText($("#filteruserscheduleby").val()));
        formData.append("filteruserto", EncodeText($("#filteruserscheduleto").val()));
        formData.append("filterduedate", EncodeText($("#filterduedatescheduler").val()));
        formData.append("filtercasescheduler", EncodeText($("#filtercasescheduler").val()));
        formData.append("filterscttime", EncodeText($("#filterscttime").val()));
        formData.append("filterAcceptRejectBy", EncodeText($("#filterAcceptRejectBy").val()));
        if (sortvalue == null) {
            sortvalue = "";
        }
        formData.append("sortvalue", sortvalue);
        if (isglobalsearch != "") {
            formData.append("globaldatevalue", isFilterdateGlobal);
        }
        else {
            formData.append("globaldatevalue", "");
        }
        openload();
        var ctq = 0;
        var sct1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    //$("#dataescstatus").html("");
                    $("#dataescstatus").hide();
                    $("#dtNotFound1").text("");
                    $("#scstPagination").show();
                }
                else {
                    //$("#dataescstatus").html("No result found !");
                    $("#dataescstatus").show();
                    $("#dtNotFound1").text("No Data Found");
                    $("#scstPagination").hide();
                    closeload();
                }
                var length = response1.Data.length;
                var qty1 = 0;
                //$("#bindcasetask tr").remove();
                //$("#tfooter ul").remove();
                $.each(response1.Data, function (i, a) {
                    //For Added total row
                    $("#inboxevt").text(a.totRow);

                    qty1 = qty1 + 1;
                    ctq = ctq + 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
                            //$('#next').css("display", "none");
                            $('#prev').css("display", "block"); s
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (pageindex == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }

                        if (isRenderPage == false) {
                            renderPaginationNewTask(pageindex, totpage);
                        }
                        //if (i === 0) {
                        //    firstvalue = a.rownum;
                        //}
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = a.totRow;
                        //    var totpage = 0;
                        //    if (a.totRow > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(pagesize);
                        //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#pagnumvalue").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    if (a.totRow <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    $("#tfooter").append(tfot);
                    }
                    var AssignBycolor = "";
                    var AssignTocolor = "";
                    var ClientName = a.ClientName;
                    if (ClientName == "null" || ClientName == null) {
                        ClientName = "";
                    }
                    var CaseName = a.CaseName;
                    var AssignBy = a.AssignBy;
                    var AssignTo = a.AssignTo;
                    if (AssignTo == "ME") {
                        var AssignTocolor = "#069";
                    }
                    else {
                        var AssignTocolor = "maroon";
                    }
                    var AssignBy = a.AssignBy;
                    if (AssignBy == "ME") {
                        AssignBycolor = "#069";
                    }
                    else {
                        var AssignBycolor = "maroon";
                    }
                    html3 += '<tr>'
                    html3 += '<td class="scttime"><span>' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    html3 += '<td class="scttype"><span>' + a.TaskName + '</span></td>'
                    html3 += '<td class="sctclient">'
                    html3 += '<div style="float:left">'
                    html3 += '<span id="clname" class="LoginId" style="cursor: pointer; color: #069" data-id="' + a.ClientId + '">' + ClientName + '</span><br>'
                    html3 += '</div>'
                    html3 += '</td>'
                    html3 += '<td class="sctcase Border_freeze" ><div class="freeze-text" id="caseid" style="cursor: pointer;" sno="' + a.CaseId + '" >' + CaseName + '</div></td>'
                    if (a.TDetails == "" || a.TDetails == null || a.TDetails == "null") {
                        html3 += '<td scope="row" class="sctbrief" ></td>'
                    }
                    else {
                        if (a.TDetails.length > 60) {
                            html3 += '<td class="sctbrief">'
                            html3 += '<span class="comment more" style="">' + a.TDetails.substring(0, 60) + '</span>'
                            html3 += '<span data-toggle="collapse" data-target="#dt' + ctq + '" style="color:#069;cursor:pointer"> more</span>'
                            html3 += ' <div id="dt' + ctq + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            html3 += '' + a.TDetails + ''
                            html3 += '</div>'
                            if (a.UserId == userid && a.AssignTaskStatus == "1" && a.Status == "In Process") {
                                html3 += '<button type="button"  class="taskoutboxbtnicon pull-right" title="Edit Note" val-data="' + a.Tid + '" id="edittasknote"><i class="glyphicon glyphicon-edit"   style="color:black" ></i></button>'
                            }
                            html3 += '</td>'
                        }
                        else {
                            html3 += '<td class="sctbrief">'
                            html3 += '<span class="comment more" style="">' + a.TDetails + '</span>'
                            if (a.UserId == userid && a.AssignTaskStatus == "1" && a.Status == "In Process") {
                                html3 += '<button type="button" class="taskoutboxbtnicon pull-right" title="Edit Note" val-data="' + a.Tid + '" id="edittasknote"><img src="/newassets/img/edit.svg" /></button>'
                            }
                            html3 += '</td>'
                        }
                    }
                    html3 += '<td  class="sctassigntoby" >'
                    html3 += '<span id="clname" > ' + AssignBy + '</span><br>'
                    html3 += '</td>'
                    html3 += '<td   class="sctassigntoto">'
                    html3 += '<span ><span title="View profile" id="linkprofile" style="cursor: pointer; color: #069" data-val=' + a.AssignUser + '>  ' + AssignTo + '</span></span>'
                    html3 += '</td>'
                    if (a.AcceptDueDate == "" || a.AcceptDueDate == null || a.AcceptDueDate == "null") {
                        html3 += '<td scope="row" class="sctassigneeduedate"></td>'
                    }
                    else {
                        html3 += '<td scope="row" class="sctassigneeduedate"><span class="text-success">' + formatDatetoIST(a.AcceptDueDate) + '</span></td>'
                    }
                    html3 += '<td s class="sctduedate">' + formatDatetoIST(a.TaskDueDate) + '</td>'
                 
                    const priorityKey = (a.Status || "").toLowerCase().trim();
                    if (priorityClassMap[priorityKey]) {
                        html3 += `<td class="scstatus">
                <div class="status_badge">
                  <span class="${priorityClassMap[priorityKey]}"></span>${a.Status || ""}
                </div>
              </td>`;
                    } else {
                        html3 += `<td class="scstatus" style="white-space: nowrap;">
                <span style="color:#ff0000 !important; font-size:12px;">${a.Status || ""}</span>
              </td>`;
                    }

                    html3 += '</td>'


                    if (a.TaskSubject == "" || a.TaskSubject == null || a.TaskSubject == "null") {
                        html3 += '<td  class="ssubject"></td>'
                    }
                    else {
                        html3 += '<td  class="ssubject">' + a.TaskSubject + '</td>'
                    }
                    var alertforval = "";
                    if (a.UserId == userid) {
                        alertforval = "all";
                    }

                    html3 += '<td><ul class="table_action" style="justify-content: flex-start;">';

                    if (a.Status === "In Process") {
                        // Accept Button
                        if (a.AssignUser == userid && a.AssignTaskStatus == "1") {
                            html3 += '<li><button id="dueaction" title="Complete" data-id="' + a.Tid + '" type="button" class="taskoutboxbtnicon">' +
                                '<img src="/newassets/img/right_tig.svg"></button></li>';
                        }
                        // Folder Button
                        html3 += '<li><button type="button" title="Documents" class="taskoutboxbtnicon" id="btn-' + a.Tid + '" onclick="openFolderFile(\'' + a.Tid + '\')" id-val="' + a.Tid + '">' +
                            '<i><img src="/newassets/img/folder.svg" alt="Folder Icon"></i></button></li>';

                        // Dropdown Button

                        html3 += '<li>' +
                            '<div class="dropdown">' +
                            '<button style="cursor: pointer; border: none !important; box-shadow: none; padding: 0; margin: 0; width: 27px; height: 27px; background: transparent !important;" class="dropdown-toggle taskoutboxbtnicon" id="menu1" type="button" data-toggle="dropdown" title="More Action">' +
                            '<img src="/newassets/img/more-action.png" style="width: 100%;height: 100%;display: block;padding: 0;margin: 0;">' +
                            '</button>' +
                            '<ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';
                        

                        if (a.Status === "In Process") {
                            html3 += '<li><div>' +
                                '<button style="border: none !important;box-shadow: inherit;" type="button" class="taskoutboxbtnicon" title="Click here to set alert" val-data="' + a.Tid + '" val-task="' + a.TaskName + '" duedate="' + a.TaskDueDate + '" id="setalert" alertfor-val="' + alertforval + '" assignto-val="' + AssignTo + '">' +
                                '<img src="/newassets/img/bell-01.png"> <span> Set Alert</span> </button>' +
                                '</div></li>';
                        }
                        if (a.AssignUser == userid && a.AssignTaskStatus == "1") {
                            html3 += '<li><div>' +
                                '<button style="border: none !important; box-shadow: inherit;" type="button" class="taskoutboxbtnicon" title="Click here to set alert" onclick="uploadDocument(\'' + a.Tid + '\', \'' + qty1 + '\')">' +
                                '<i style="width: 23px; height: 23px; border-radius: 4px; padding: 4px;" class="glyphicon glyphicon-paperclip" style="color:grey !important;"></i> <span>Attachment</span>' +
                                '</button>' +
                                '</div></li>'
                        }
                            +
                            '</ul></div></li>';
                    } else if (a.Status === "Completed" || a.Status === "Overdue") {
                        // Only Folder Button
                        html3 += '<li><button type="button" title="Documents" class="taskoutboxbtnicon" id="btn-' + a.Tid + '" onclick="openFolderFile(\'' + a.Tid + '\')" id-val="' + a.Tid + '">' +
                            '<i><img src="/newassets/img/folder.svg" alt="Folder Icon"></i></button></li>';
                    }

                    html3 += '</ul></td>';

                });
                $("#bindcasetask").html("");
                $("#bindcasetask").append(html3);
                closeload();
            },
            failure: function (response1) {
                alert(response1.responseText);
                closeload();
            },
            error: function (response1) {
                alert(response1.responseText);
                closeload();
            }
        });
        $.when(sct1).then(function (data, textStatus, jqXHR) {
            $("#schduleolli li input:checkbox:not(:checked)").each(function () {
                var column = "#schedulertable ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    //Paging For New Task Request-
    /*Pagination Start*/
    //var isRenderPage = false;
    //var totalPageRec = "";
    //function renderPaginationNewTask(pageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = pageindex;
    //    totalPageRec = totdata;
    //    let paginationHtml = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (pageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtml += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers").html(paginationHtml);
    //    $("#prev").toggleClass("disabled", pageindex === 1);
    //    $("#next").toggleClass("disabled", pageindex === totdata);
    //    isRenderPage = true;
    //}
    var isRenderPage = false;
    var totalPageRec = "";
    function renderPaginationNewTask(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

            let start = Math.max(2, pageindex - delta);
            let end = Math.min(totPages - 1, pageindex + delta);
            if (pageindex <= maxVisible) {
                start = 2;
                end = maxVisible;
            }

            if (pageindex >= totPages - maxVisible + 1) {
                start = totPages - maxVisible + 1;
                end = totPages - 1;
            }
            if (start > 2) paginationHtml += `<span class="dots">...</span>`;
            for (let i = start; i <= end; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
            paginationHtml += `<button class="page-btn ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#pageNumbers").html(paginationHtml);
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totPages);
        isRenderPage = true;
    }

    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    LoadTaskData(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        LoadTaskData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#prev").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    LoadTaskData(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        LoadTaskData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });




    //$("#next").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    LoadTaskData(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        LoadTaskData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    LoadTaskData(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        isRenderPage = false;
        LoadTaskData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });



    /*Pagination End*/


    $(document).on("click", ".LoginId", function () {
        var token = $(this).attr("data-id");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });
    $(document).on("click", "#caseid", function () {
        var token = $(this).attr("sno");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    var moretext = "more";
    var lesstext = "less";
    $(document).on("click", ".morelink,.imorelink,.dmorelink,.omorelink", function () {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
    loadInoutCount();
    function loadInoutCount() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskInboxCount",
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    if (a.InboxCount > 0) {
                        $("#taskrequesttabevt").text(a.InboxCount);
                        $("#taskrequesttabevt").css("display", "unset");
                    }
                    else {
                        $("#taskrequesttabevt").text(a.InboxCount);
                        $("#taskrequesttabevt").css("display", "none");
                    }
                    if (a.OutBoxCount > 0) {
                        $("#outboxevt").text(a.OutBoxCount);
                        $("#outboxevt").css("display", "unset");
                    }
                    else {
                        $("#outboxevt").text(a.OutBoxCount);
                        $("#outboxevt").css("display", "none");
                    }
                    if (a.MyTaskCount > 0) {
                        $("#inboxevt").text(a.MyTaskCount);
                        $("#inboxevt").css("display", "unset");
                    }
                    else {
                        $("#inboxevt").text(a.MyTaskCount);
                        $("#inboxevt").css("display", "none");
                    }

                    if (a.OverDueTaskCount > 0) {
                        $("#overdueevt").text(a.OverDueTaskCount);
                        $("#overdueevt").css("display", "unset");
                    }
                    else {
                        $("#overdueevt").text(a.OverDueTaskCount);
                        $("#overdueevt").css("display", "none");
                    }
                    if (a.ArchiveCount > 0) {
                        $("#archiveboxevt").text(a.ArchiveCount);
                        $("#archiveboxevt").css("display", "unset");
                    }
                    else {
                        $("#archiveboxevt").text(a.ArchiveCount);
                        $("#archiveboxevt").css("display", "none");
                    }

                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    }
    function formatAMPM(time) {
        var res = time.split(":");
        var hours = res[0];
        var minutes = res[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        if (minutes.length > 1) {
            minutes = minutes < 10 ? minutes : minutes;
        }
        else {
            minutes = minutes < 10 ? '0' + minutes : minutes;
        }
        hours = hours < 10 ? '0' + hours : hours;
        var strTime = hours + ':' + minutes + ' <span>' + ampm + '</span>';
        return strTime;
    }
    function formatDatetoIST(date) {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let current_datetime = new Date(date)
        //let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear()
        let cday = current_datetime.getDate().toString();
        if (current_datetime.getDate().toString().length === 1) {
            cday = "0" + current_datetime.getDate().toString();
        }
        let formatted_date = cday + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear().toString().substr(-2)
        return formatted_date;
    }
    function checkdatetimecustomdt(date) {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear() + " / " + addZero(current_datetime.getHours()) + ":" + addZero(current_datetime.getMinutes()) + ":" + addZero(current_datetime.getSeconds())
        return formatted_date;
    }
    ////////----------------- START INBOX------------------///////
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href"); // activated tab
        if (target == "#inboxtab") {
            if (irowcount == 0) {
                $(".inboxtab").css("color", "#0059c1");
                $(".overduetab").css("color", "gray");
                $(".outboxtab").css("color", "gray");
                $(".archivetab").css("color", "gray");
                iLoadTaskData(ipageindex);
            }
        }
        if (target == "#overduetab") {
            $(".inboxtab").css("color", "gray");
            $(".overduetab").css("color", "#0059c1");
            $(".outboxtab").css("color", "gray");
            $(".archivetab").css("color", "gray");
            if (drowcount == 0) {
                dLoadTaskData(dpageindex);
            }
        }
        if (target == "#outboxtab") {
            $(".inboxtab").css("color", "gray");
            $(".overduetab").css("color", "gray");
            $(".outboxtab").css("color", "#0059c1");
            $(".archivetab").css("color", "gray");
            if (orowcount == 0) {
                oLoadTaskData(opageindex);
            }
        }
        if (target == "#archivetab") {
            $(".inboxtab").css("color", "gray");
            $(".overduetab").css("color", "gray");
            $(".outboxtab").css("color", "gray");
            $(".archivetab").css("color", "#0059c1");
            if (arowcount == 0) {
                oLoadTaskArchiveData(apageindex);
            }
        }
    });

    /*Accept reject task details*/
    var irowcount = 0;
    var isearchflag = false;
    var ichckfilter = false;
    var tempexcel = false;
    $(document).on('click', '#accpetdivbtn', function () {
        var result = confirm("Are you sure you want to accept the task?");
        if (result) {
            var tokenid = $(this).attr("data-val");
            var idatatemp = $(this).attr("data-temp");
            var iacceptdate = $("#inboxacceptdate" + idatatemp).val();
            var inboxstartdate = $("#inboxstartdate" + idatatemp).val();
            var inboxenddate = $("#inboxenddate" + idatatemp).val();
            if (iacceptdate == "") {
                alert("Please select action date.");
                return false;
            }
            if (inboxstartdate != "" || inboxenddate != "") {
                if (inboxstartdate == "") {
                    alert("Please select start date.");
                    return false;
                }
                if (inboxenddate == "") {
                    alert("Please select end date.");
                    return false;
                }
                var date1 = new Date(inboxstartdate);
                var date2 = new Date(inboxenddate);
                if (date2 < date1) {
                    alert("Please enter a valid start / end date. Start date cannot be after the end date.");
                    return false;
                }
            }
            var formData = new FormData();
            formData.append("tokenid", tokenid);
            formData.append("RequestType", EncodeText("A"));
            formData.append("acceptdate", EncodeText(iacceptdate));
            formData.append("rejectdetails", EncodeText(""));
            formData.append("inboxstartdate", EncodeText(inboxstartdate));
            formData.append("inboxenddate", EncodeText(inboxenddate));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/AcceptRejectInbox",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (parseInt(response1.Data) > 0) {
                        alert("The task has been accepted successfully.");
                        $("#inacptdiv" + idatatemp).show();
                        $("#inacrjtdiv" + idatatemp).hide();
                        LoadTaskData(pageindex, curtab);
                        closeload();
                        loadInoutCount();
                        oLoadTaskData(opageindex);
                        dLoadTaskData(dpageindex);
                    }
                    closeload();
                },
                failure: function (data) {
                    alert(data.responseText);
                    closeload();
                },
                error: function (data) {
                    alert(data.responseText);
                    closeload();
                }
            });
        }
    })
    $(document).on('click', '#rinbox', function () {
        var result = confirm("Are you sure you want to reject the task?");
        if (result) {
            var tokenid = $("#hidrjctatoken").val();
            var rdetails = $("#rdetails").val();
            if (rdetails == "") {
                alert("Please specify the reason for rejecting the task.");
                $("#rdetails").focus();
                return false;
            }
            var formData = new FormData();
            formData.append("tokenid", tokenid);
            formData.append("RequestType", EncodeText("R"));
            formData.append("rejectdetails", EncodeText(rdetails));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/AcceptRejectInbox",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (parseInt(response1.Data) > 0) {
                        alert("You have rejected the task successfully.");
                        document.getElementById("closereject").click();
                        iLoadTaskData(ipageindex);
                        closeload();
                        loadInoutCount();
                        oLoadTaskData(opageindex);
                        dLoadTaskData(dpageindex);
                    }
                    closeload();
                },
                failure: function (data) {
                    alert(data.responseText);
                    closeload();
                },
                error: function (data) {
                    alert(data.responseText);
                    closeload();
                }
            });
        }
    });
    $(document).on('click', '#btnsendback', function () {
        var result = confirm("Are you sure to send back this task?");
        if (result) {
            var tokenid = $("#hidrjctatoken").val();
            var rdetails = $("#sendbackreason").val();
            if (rdetails == "") {
                alert("Please specify the reason for sending back the task to the assignor.");
                $("#sendbackreason").focus();
                return false;
            }
            var formData = new FormData();
            formData.append("tokenid", tokenid);
            formData.append("RequestType", EncodeText("OR"));
            formData.append("rejectdetails", EncodeText(rdetails));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/AcceptRejectInbox",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (parseInt(response1.Data) > 0) {
                        alert("Task has been rejected successfully.");
                        $('#sendbackmyModal').modal('hide');
                        document.getElementById("closereject").click();
                        iLoadTaskData(ipageindex);
                        closeload();
                        loadInoutCount();
                        oLoadTaskData(opageindex);
                        dLoadTaskData(dpageindex);
                    }
                    closeload();
                },
                failure: function (data) {
                    alert(data.responseText);
                    closeload();
                },
                error: function (data) {
                    alert(data.responseText);
                    closeload();
                }
            });
        }
    });

    /*Load inbox task details*/
    $(document).on('click', '#igetdatabypagenum', function () {
        ipageindex = $("#ipagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#isotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    iLoadTaskData(ipageindex);
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
    $(document).on('click', '#ipaginate', function () {
        /* your code here */
        ipageindex = $(this).attr("index");
        iLoadTaskData(ipageindex);
    });

    /*Accept reject by create date*/
    $("#AcceptRejectBycleardate").click(function () {
        $("#filterAcceptRejectBy").val("");
        $("#AcceptRejectBycleardate").css("display", "none");
        isRenderPage = false;
        LoadTaskData(1, curtab);
    })
    $("#scttimecleardate").click(function () {
        $("#filterscttime").val("");
        $("#scttimecleardate").css("display", "none");
        isRenderPage = false;
        LoadTaskData(1, curtab);
    })
    $("#duecleardate").click(function () {
        $("#filterduedatescheduler").val("");
        $("#duecleardate").css("display", "none");
        isRenderPage = false;
        LoadTaskData(1, curtab);
    })
    /*Clear new search*/
    $("#clearnewsearchcasesch").click(function () {
        isRenderPage = false;
        $("#filtercasescheduler").val("");
        $("#clearnewsearchcasesch").css("display", "none");
        isRenderPage = false;
        LoadTaskData(1, curtab);
    })
    $("#searchdatassch").click(function () {
        isRenderPage = false;
        var casefiltercasename = $("#filtercasescheduler").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#filtercasescheduler").focus();
            return false;
        }
        $("#clearnewsearchcasesch").css("display", "unset")
        isRenderPage = false;
        LoadTaskData(1, curtab);
    });
    $("#icleardate").click(function () {
        $("#ifilterdate").val("");
        $("#icleardate").css("display", "none");
        isRenderPage_mytask = false;
        iLoadTaskData(1);
    })
    $("#ifilterdate").change(function () {
        $("#icleardate").css("display", "block");
        isRenderPage_mytask = false;
        iLoadTaskData(1);
    })
    $("#ifiltertask").change(function () {
        isRenderPage_mytask = false;
        iLoadTaskData(1);
    })
    $("#ifilterclient").change(function () {
        loadmatter($(this).val(), "ifiltercasescheduler");
        isRenderPage_mytask = false;
        iLoadTaskData(1);
    })
    $("#filterStatus").change(function () {
        isRenderPage_mytask = false;

        iLoadTaskData(1);
    })
    $("#ifiltertdate").change(function () {
        isRenderPage_mytask = false;

        iLoadTaskData(1);
        $("#idatecleardate").css("display", "block");
    })
    $("#ifilteruserto").change(function () {
        isRenderPage_mytask = false;

        iLoadTaskData(1);
    })
    $("#ifilterAcceptRejectBy").change(function () {
        isRenderPage_mytask = false;

        iLoadTaskData(1);
        $("#iAcceptRejectBycleardate").css("display", "block");
    })
    $("#ifilterduedate").change(function () {
        isRenderPage_mytask = false;

        iLoadTaskData(1);
        $("#iduecleardate").css("display", "block");
    })
    $("#clearnewsearchcaseibn").click(function () {
        $("#ifiltercasescheduler").val("");
        $("#clearnewsearchcaseibn").css("display", "none");
        isRenderPage_mytask = false;

        iLoadTaskData(1);
    })
    $("#searchdatasibn").click(function () {
        var casefiltercasename = $("#ifiltercasescheduler").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#ifiltercasescheduler").focus();
            return false;
        }
        $("#clearnewsearchcaseibn").css("display", "unset")
        isRenderPage_mytask = false;

        iLoadTaskData(1);
    });
    $("#refinbox").click(function () {
        $("#refinbox").addClass("fa-spin");
        isRenderPage_mytask = false;

        iLoadTaskData(ipageindex);
        loadInoutCount();
    })
    $("#idatecleardate").click(function () {
        $("#ifiltertdate").val("");
        $("#idatecleardate").css("display", "none");
        isRenderPage_mytask = false;

        iLoadTaskData(1);
    })
    $("#iAcceptRejectBycleardate").click(function () {
        $("#ifilterAcceptRejectBy").val("");
        $("#iAcceptRejectBycleardate").css("display", "none");
        isRenderPage_mytask = false;

        iLoadTaskData(1);
    })
    $("#iduecleardate").click(function () {
        $("#ifilterduedate").val("");
        $("#iduecleardate").css("display", "none");
        isRenderPage_mytask = false;

        iLoadTaskData(1);
    })

    /*Lod inbox task data*/
    function iLoadTaskData(ipageindex) {
        $("#itfooter ul").remove();
        var ihtml3 = '';
        var filetrtask = $("#ifiltertask").val();
        if (filetrtask == null || filetrtask == undefined) {
            filetrtask = "";
        }
        var formData = new FormData();
        formData.append("pagenum", EncodeText(ipageindex));
        formData.append("pagesize", EncodeText(ipagesize));
        formData.append("datefilter", EncodeText($("#ifilterduedate").val()));
        formData.append("filtertask", EncodeText(filetrtask));
        formData.append("filterclient", EncodeText($("#ifilterclient").val()));
        formData.append("filterStatus", EncodeText($("#filterStatus").val()));
        formData.append("ifilteruserto", EncodeText($("#ifilteruserto").val()));
        formData.append("ifilterAcceptRejectBy", EncodeText($("#ifilterAcceptRejectBy").val()));
        formData.append("ifiltertdate", EncodeText($("#ifiltertdate").val()));
        formData.append("ifiltercasescheduler", EncodeText($("#ifiltercasescheduler").val()));
        openload();
        var inbx = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskInboxList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    //$("#idataescstatus").html("");
                    $("#pdatastatus").hide();
                    $("#dtNotFound").text("");
                    $("#tskPagination").show();
                }
                else {
                    //$("#idataescstatus").html("No result found !");
                    $("#pdatastatus").show();
                    $("#dtNotFound").text("No Data Found");
                    $("#tskPagination").hide();
                    closeload();
                }
                var ilength = response1.Data.length;
                var ictq = 0;
                $.each(response1.Data, function (i, a) {
                    ictq = ictq + 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (ilength - 1)) {
                        totpage = parseInt(totdata) / parseInt(ipagesize);
                        if (parseInt(totdata) % parseInt(ipagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (ipageindex == totpage) {
                            $('#next_mytask').hide();
                            //$('#next').css("display", "none");
                            $('#prev_mytask').css("display", "block"); s
                        }
                        else {
                            $('#next_mytask').css("display", "block");
                        }
                        if (ipageindex == 1) {
                            $('#prev_mytask').css("display", "none");
                        }
                        else {
                            $('#prev_mytask').css("display", "block");
                        }

                        if (isRenderPage_mytask == false) {
                            renderPagination_mytask(ipageindex, totpage);
                        }
                        //if (i === 0) {
                        //    ifirstvalue = a.rownum;
                        //}
                        //if (i === (ilength - 1)) {
                        //    var ipnext = ipageindex;
                        //    var ipprev = ipageindex;
                        //    var ipageno = ipageindex;
                        //    var itotdata = a.totRow;
                        //    var itotpage = 0;
                        //    if (a.totRow > 0) {
                        //        ipnext = parseInt(ipnext) + 1;
                        //        if (ipnext == 0) ipnext = 1;
                        //        ipprev = parseInt(ipageno) - 1;
                        //        if (ipprev == 0) ipprev = 1;
                        //        itotpage = parseInt(itotdata) / parseInt(ipagesize);
                        //        if (parseInt(itotdata) % parseInt(ipagesize) != 0) {
                        //            itotpage = parseInt(itotpage) + 1;
                        //        }
                        //        $("#ipagnumvalue").attr("max", itotpage);
                        //    }
                        //    var itfot = '';
                        //    itfot += '<ul>'
                        //    itfot += '<li>results <span>' + a.totRow + '</span>  <span id="isotopage" style="display:none">' + itotpage + '</span></li>'
                        //    itfot += '<li><span>|</span></li>'
                        //    itfot += '<li>pages ' + ipageindex + '/ ' + parseInt(itotpage) + '</li>'
                        //    itfot += '<li><span>|</span></li>'
                        //    itfot += '<li ><input type="number" id="ipagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="igetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    if (a.totRow <= ilength) {
                        //    }
                        //    else if (ipageno == 1) {
                        //    }
                        //    else if (ipageno == itotpage) {
                        //        itfot += '<li><span><a id="ipaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ifirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        itfot += '<li><span><a id="ipaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + ifirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (ipageno < itotpage) {
                        //        itfot += '<a  id="ipaginate" title="Next Page" href="javascript:void()" index="' + ipnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    $("#itfooter").html("");
                        //    $("#itfooter").html(itfot);
                    }
                    var iAssignBycolor = "";
                    var iAssignTocolor = "";
                    var iClientName = a.ClientName;
                    if (iClientName == "null" || iClientName == null) {
                        iClientName = "";
                    }
                    var iCaseName = a.CaseName;
                    var iAssignBy = a.AssignBy;
                    var iAssignTo = a.AssignTo;
                    var iAssignBy = a.AssignBy;
                    if (iAssignTo == "ME") {
                        var iAssignTocolor = "#069";
                    }
                    else {
                        var iAssignTocolor = "maroon";
                    }
                    var iAssignBy = a.AssignBy;
                    if (iAssignBy == "ME") {
                        iAssignBycolor = "#069";
                    }
                    else {
                        var iAssignBycolor = "maroon";
                    }
                    var istr = a.CreateDate;
                    var itemptype = istr.replace(/[^a-zA-Z0-9]/g, "");
                    var duerowcss = "";
                    if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                        duerowcss = "";
                    }
                    ihtml3 += '<tr >'
                    ihtml3 += '<td class="indate" style="' + duerowcss + '"><span>' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    ihtml3 += '<td  class="intask" style="' + duerowcss + '"><span>' + a.TaskName + '</span></td>'
                    ihtml3 += '<td  class="inclient" style="' + duerowcss + '">'
                    ihtml3 += '<div style="float:left">'
                    ihtml3 += '<span id="clname" class="LoginId" style="cursor: pointer; color: #069" data-id="' + a.ClientId + '">' + iClientName + '</span><br>'
                    ihtml3 += '</div>'
                    ihtml3 += '</td>'
                    ihtml3 += '<td  class="inmatters Border_freeze"><div class="freeze-text" id="caseid" style="' + duerowcss + ';cursor: pointer;" sno="' + a.CaseId + '">' + iCaseName + '</div></td>'
                    if (a.TDetails == "" || a.TDetails == null || a.TDetails == "null") {
                        ihtml3 += '<td class="innote" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        if (a.TDetails.length > 60) {
                            ihtml3 += '<td class="innote"><span class="comment more" style="">' + a.TDetails.substring(0, 60) + '</span>'
                            ihtml3 += '<span data-toggle="collapse" data-target="#dti' + ictq + '" style="color:#069;cursor:pointer"> more</span>'
                            ihtml3 += ' <div id="dti' + ictq + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            ihtml3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dti' + ictq + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                            ihtml3 += '' + a.TDetails + ''
                            ihtml3 += '</div>'
                            ihtml3 += '</td>'
                        }
                        else {
                            ihtml3 += '<td class="innote"><span class="comment more" style="">' + a.TDetails + '</span></td>'
                        }
                    }
                    ihtml3 += '<td   class="inassignby" style="' + duerowcss + '">'
                    if (a.TaskName == "Assign Team Members") {
                        ihtml3 += '<span id="clname" > ' + iAssignBy + '</span></td>'
                    }
                    else {
                        ihtml3 += '<span id="clname"> ' + iAssignBy + '</span><br>'
                    }
                    ihtml3 += '</td>'
                    ihtml3 += '<td class="inassignto" style="' + duerowcss + '" scope="row">' + iAssignTo + '</td>'
                    if (a.ActionByDate == "" || a.ActionByDate == null || a.ActionByDate == "null") {
                        ihtml3 += '<td  class="inacptrject" scope="row" style="' + duerowcss + '">&nbsp;</td>'
                    }
                    else {
                        ihtml3 += '<td  class="inacptrject" scope="row " style="' + duerowcss + '"><span class="text-success">' + formatDatetoIST(a.ActionByDate) + '</span></td>'
                    }
                    const dueDate = new Date(a.TaskDueDate);
                    const today = new Date();
                    const diffTime = dueDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let dueMessage = '';

                    if (diffDays > 0) {
                        dueMessage = `<br><span style='color: green;'>${diffDays} day${diffDays > 1 ? 's' : ''} to go</span>`;
                    } else if (diffDays < 0) {
                        dueMessage = `<br><span style='color: red;'>${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue</span>`;
                    } else {
                        dueMessage = `<br><span style='color: orange;'>Due today</span>`;
                    }

                    ihtml3 += '<td class="induedate" style="' + duerowcss + '">' +
                        formatDatetoIST(a.TaskDueDate) + dueMessage + '</td>';
                    //ihtml3 += '<td  class="induedate" style="' + duerowcss + '">' + formatDatetoIST(a.TaskDueDate) + '</td>'
                 
                    if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                        ihtml3 += '<td  class="taskstatus" style="' + duerowcss + '"><div class="status_badge"><span style="background:red"></span>Reject<div></td>'
                    }
                    else {
                        ihtml3 += '<td  class="taskstatus" style="' + duerowcss + '"><div class="status_badge"><span style="background:yellow"></span>Pending</div></td>'

                    }

                    if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                        if (a.DocsCount > 0) {


                            ihtml3 += '<td ><i  title="Document" class="" id-val="' + a.Tid + '" id="filelink"><img src="/newassets/img/folder.svg"></i></td>'
                        }
                        else {
                            ihtml3 += '<td  class=""></td>'
                        }
                    }
                    else {
                        if (a.DocsCount > 0) {
                            ihtml3 += '<td style=""> <ul class="table_action" style="justify-content: flex-start;">' +
                                '<li><button title="Accept" onclick="openStatusUpdateButton(\'' + a.Tid + '\', \'1\')" type="button" class="taskoutboxbtnicon">' +
                                '<img src="/newassets/img/right_tig.svg"></button></li>' +
                                '<li><button title="Reject" type="button" class="taskoutboxbtnicon" data-id="#" onclick="openStatusUpdateButton(\'' + a.Tid + '\', \'2\')">' +
                                '<img style="padding:6px;" src="/newassets/img/cross.svg"></button></li>' +
                                '<li><button title="Document" type="button" class="taskoutboxbtnicon" id="filelink" id-val="' + a.Tid + '">' +
                                '<img src="/newassets/img/folder.svg"></button></li>' +
                                '</ul></td>';
                        }
                        else {
                            ihtml3 += `<td style="">
  <ul class="table_action" style="justify-content: flex-start;">
    <li>
      <button  onclick="openStatusUpdateButton('${a.Tid}', '1')" type="button" class="taskoutboxbtnicon"title="Accept">
        <img src="/newassets/img/right_tig.svg">
      </button>
    </li>
    <li>
      <button type="button" class="taskoutboxbtnicon" title="Reject" data-id="#" onclick="openStatusUpdateButton('${a.Tid}', '2')">
        <img style="padding:6px;" src="/newassets/img/cross.svg">
      </button>
    </li>
  </ul>
</td>`;

                        }
                    }



                    //else {
                    //    ihtml3 += '<td style="' + duerowcss + '" style="white-space: nowrap;"> <ul class="table_action"><li><button type="button" class="taskoutboxbtnicon" title="#" id="#"><img src="/newassets/img/right_tig.svg"></button></li><li><button type="button" class="taskoutboxbtnicon" title="#" data-id="#" id="#"><img src="/newassets/img/bell.svg"></button></li><li><button type="button" class="taskoutboxbtnicon" title="#" id="#"><img src="/newassets/img/file.svg"></button></li>'
                    //    if ((a.TaskName == "Assign Team Members" && String(a.isPartner) == "1") || (a.TaskName == "Assign Team Members" && roleids == "1")) {
                    //        if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                    //            ihtml3 += '<input type="date" value="' + a.CreateDate.substring(0, 10) + '" style="display:none"  class="inboxdashdate" id="inboxacceptdate' + itemptype + '">'
                    //            ihtml3 += '<ul class="table_action"><li><button type="button" class="taskoutboxbtnicon" style="float:none" title="click here to reject task"><a href="javascript:void()" data-id="' + a.Tid + '" id="rejectaction"><img style="padding:6px;" src="/newassets/img/cross.svg" /></a></button></li>'
                    //        }
                    //        else {
                    //            ihtml3 += '<input type="date" style="width:120px;float:left" min="' + new Date().toISOString().substring(0, 10) + '"  max="' + a.TaskDueDate.substring(0, 10) + '" class="inboxdashdate" id="inboxacceptdate' + itemptype + '">'
                    //            ihtml3 += '<div class="btn-group" id="btngroup' + itemptype + '" style="float:left">'
                    //            ihtml3 += '<button type="button" title="Click here to accept/reject the task" style="height: 23px;" class="taskoutboxbtnicon dropdown-toggle pull-right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                    //            ihtml3 += '<span class="caret"></span>'
                    //            ihtml3 += '<span class="sr-only">Toggle Dropdown</span>'
                    //            ihtml3 += '</button>'
                    //            ihtml3 += '<ul class="dropdown-menu dropdown-menuinbox" style="left:unset !important;right:0;">'
                    //            ihtml3 += '<li style="float:none;display:none;" id="inacptdiv' + itemptype + '" data-id="' + itemptype + '">'
                    //            ihtml3 += '<table cellspacing = "2" cellpadding = "2" > <tr><td style="background-color:#BBDDF2;" colspan="2" >Add duration of the task for the purpose of Gantt Chart</td></tr><tr><td style="background-color:#e9e9e9;">Start Date</td><td style="background-color:#e9e9e9;">End Date</td></tr><tr><td ><input type= "date" style="width: 95px;" min="' + new Date().toISOString().substring(0, 10) + '"  max="' + a.TaskDueDate.substring(0, 10) + '" class="inboxdashdate" id = "inboxstartdate' + itemptype + '" ></td><td><input type="date" style="width: 95px;" min="' + new Date().toISOString().substring(0, 10) + '"  max="' + a.TaskDueDate.substring(0, 10) + '" class="inboxdashdate" id="inboxenddate' + itemptype + '"></td></tr>'
                    //            ihtml3 += '<tr><td align="right" style="border-bottom:1px solid #8fd500; padding:10px 0 10px 0 !important;"><a href="javascript:void()" data-id="' + a.Tid + '" data-temp="' + itemptype + '" id="ainbox" class="sbtbtn" style="padding:4px 6px !important; font-size:12px !important; margin:10px 0 10px 9px;">Save</a></td> <td align="left" style="border-bottom:1px solid #8fd500; padding:10px 0 10px 0 !important;"> <a href="javascript:void()" data-id="' + a.Tid + '" data-temp="' + itemptype + '" id="acancel" class="btn btn-primary" style="padding:4px 6px !important; font-size:12px !important; margin:0 0 0px 9px;">Skip</td></tr></table > '
                    //            ihtml3 += ' </li>'
                    //            ihtml3 += '<li style="float:none" id="inacrjtdiv' + itemptype + '"  data-id="' + itemptype + '">'
                    //            ihtml3 += '<table><tr><td style="padding:7px 0 8px 0 !important"><a class="sbtbtn" style="padding:4px 9px !important; font-size:12px !important; margin:0 0 0 9px;" href="javascript:void()" data-id="' + itemptype + '" data-temp="' + itemptype + '" data-val="' + a.Tid + '"  id="accpetdivbtn">Accept</a></td><td  style="padding:7px 0 8px 0 !important"> <a class="sbtbtn" style="padding:4px 9px !important; font-size:12px !important; margin:0 0 0 9px;" href="javascript:void()" data-id="' + a.Tid + '" id="rejectaction">Rejects</a> </td></tr></table>'
                    //            ihtml3 += ' </li></ul>'
                    //        }
                    //    }
                    //    else {
                    //        if (a.TaskName == "Assign Team Members") {
                    //        }
                    //        else {
                    //            if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                    //                ihtml3 += '<input type="date" value="' + a.CreateDate.substring(0, 10) + '" style="display:none"  class="inboxdashdate" id="inboxacceptdate' + itemptype + '">'
                    //                ihtml3 += '<li><button class="taskoutboxbtnicon" href="javascript:void()" data-id="' + a.Tid + '" id="rejectaction"><img style="padding:6px;" src="/newassets/img/cross.svg" /></button></li></ul>'
                    //            }
                    //            else {
                    //                ihtml3 += '<input type="date" style="width:120px;float:left" min="' + new Date().toISOString().substring(0, 10) + '"  max="' + a.TaskDueDate.substring(0, 10) + '" class="inboxdashdate" id="inboxacceptdate' + itemptype + '">'
                    //                ihtml3 += '<div class="btn-group" id="btngroup' + itemptype + '" style="float:left">'
                    //                ihtml3 += '<button type="button" title="Click here to accept/reject the task" style="height: 23px;" class="taskoutboxbtnicon dropdown-toggle pull-right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                    //                ihtml3 += '<span class="caret"></span>'
                    //                ihtml3 += '<span class="sr-only">Toggle Dropdown</span>'
                    //                ihtml3 += '</button>'
                    //                ihtml3 += '<ul class="dropdown-menu dropdown-menuinbox" style="left:unset !important;right:0;">'
                    //                ihtml3 += '<li style="float:none;display:none;" id="inacptdiv' + itemptype + '" data-id="' + itemptype + '">'
                    //                ihtml3 += '<table cellspacing = "2" cellpadding = "2" > <tr><td style="background-color:#BBDDF2;" colspan="2" >Add duration of the task for the purpose of Gantt Chart</td></tr><tr><td style="background-color:#e9e9e9;">Start Date</td><td style="background-color:#e9e9e9;">End Date</td></tr><tr><td ><input type= "date" style="width: 95px;" min="' + new Date().toISOString().substring(0, 10) + '"  max="' + a.TaskDueDate.substring(0, 10) + '" class="inboxdashdate" id = "inboxstartdate' + itemptype + '" ></td><td><input type="date" style="width: 95px;" min="' + new Date().toISOString().substring(0, 10) + '"  max="' + a.TaskDueDate.substring(0, 10) + '" class="inboxdashdate" id="inboxenddate' + itemptype + '"></td></tr>'
                    //                ihtml3 += '<tr><td align="right" style="border-bottom:1px solid #8fd500; padding:10px 0 10px 0 !important;"><a href="javascript:void()" data-id="' + a.Tid + '" data-temp="' + itemptype + '" id="ainbox" class="sbtbtn" style="padding:4px 6px !important; font-size:12px !important; margin:10px 0 10px 9px;">Save</a></td> <td align="left" style="border-bottom:1px solid #8fd500; padding:10px 0 10px 0 !important;"> <a href="javascript:void()" data-id="' + a.Tid + '" data-temp="' + itemptype + '" id="acancel" class="sbtbtn" style="padding:4px 6px !important; font-size:12px !important; margin:0 0 0px 9px;">Skip</td></tr></table > '
                    //                ihtml3 += ' </li>'
                    //                ihtml3 += '<li style="float:none" id="inacrjtdiv' + itemptype + '"  data-id="' + itemptype + '">'
                    //                ihtml3 += '<table><tr><td style="padding:7px 0 8px 0 !important"><a class="sbtbtn" style="padding:4px 9px !important; font-size:12px !important; margin:0 0 0 9px;" href="javascript:void()" data-id="' + itemptype + '" data-temp="' + itemptype + '" data-val="' + a.Tid + '"  id="accpetdivbtn">Accept</a></td><td  style="padding:7px 0 8px 0 !important"> <a class="sbtbtn" style="padding:4px 9px !important; font-size:12px !important; margin:0 0 0 9px;" href="javascript:void()" data-id="' + a.Tid + '" id="rejectaction">Reject</a> </td></tr></table>'
                    //                ihtml3 += ' </li></ul>'
                    //            }
                    //        }
                    //    }
                    //    ihtml3 += '</td>'
                    //    ihtml3 += '</ul>'
                    //    ihtml3 += '</div>'
                    //}
                    // ihtml3 += '</td>'
                    //if (a.DocsCount > 0) {
                    //    ihtml3 += '<td  class="inattach"><span style="cursor:pointer; text-align:center;" id-val="' + a.Tid + '" id="filelink"><i class="glyphicon glyphicon-folder-open"></i></span></td>'
                    //}
                    //else {
                    //    ihtml3 += '<td  class="inattach"></td>';
                    //}
                    if (a.TaskSubject == "" || a.TaskSubject == null || a.TaskSubject == "null") {
                        ihtml3 += '<td  class="isubject" style="' + duerowcss + '"></td>'
                    }
                    else {
                        ihtml3 += '<td  class="isubject" style="' + duerowcss + '">' + a.TaskSubject + '</td>'
                    }
                    ihtml3 += '</tr>'
                });
                $("#ibindcasetask").html("");
                $("#ibindcasetask").append(ihtml3);
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    $('input[type = "date"]').attr("onkeydown", "");
                    $('input[type = "date"]').attr("onkeypress", "");
                }
                $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
                $('input[type = "date"]').blur(function () {
                    var dateString = $(this).val();
                    if (dateString != "") {
                        var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
                        var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                        var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                        //Check whether valid dd/MM/yyyy Date Format.
                        if (regex.test(dateString)) {
                            var parts = dateString.split("-");
                            var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                            if (parseInt(parts[0]) < 1900) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[0]) > 3000) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[2]) == 00) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            var dtCurrent = new Date();
                            return true;
                        } else {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                    }
                });
                $("#refinbox").removeClass("fa-spin");
                var ishowChar = 150;
                var iellipsestext = "...";
                var imoretext = "more";
                var ilesstext = "less";
                $('.imore').each(function () {
                    var icontent = $(this).html();
                    if (icontent.length > ishowChar) {
                        var ic = icontent.substr(0, ishowChar);
                        var ih = icontent.substr(ishowChar - 1, icontent.length - ishowChar);
                        var ihtml = ic + '<span class="imoreellipses">' + iellipsestext + '&nbsp;</span><span class="imorecontent"><span>' + ih + '</span>&nbsp;&nbsp;<a href="javascript:void()" class="imorelink">' + imoretext + '</a></span>';
                        $(this).html(ihtml);
                    }
                });
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
        $.when(inbx).then(function (data, textStatus, jqXHR) {
            //$("input:checkbox:not(:checked)").each(function () {
            //    var column = "table ." + $(this).attr("name");
            //    $(column).hide();
            //});
            $("#inlist li input:checkbox:not(:checked)").each(function () {
                var column = "#inboxtables ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    //New Pagination Start
    /*Pagination Start*/

    //function renderPagination_mytask(ipageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = ipageindex;
    //    totalPageRec = totdata;
    //    let paginationHtmli = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtmli += `<button class="page-btn_mytask ${i === ipageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (ipageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtmli += `<button class="page-btn page-btn_mytask ${i === ipageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtmli += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtmli += `<button class="page-btn_mytask ${j === ipageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers_mytask").html(paginationHtmli);
    //    $("#prev_mytask").toggleClass("disabled", ipageindex === 1);
    //    $("#next_mytask").toggleClass("disabled", ipageindex === totdata);
    //    isRenderPage_mytask = true;
    //}
    var isRenderPage_mytask = false;
    var totalPageRec = "";
    function renderPagination_mytask(ipageindex, totdata) {
        let totPages = totdata;
        setPageNo = ipageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btn_mytask  ${i === ipageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtml += `<button class="page-btn_mytask  ${ipageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

            let start = Math.max(2, ipageindex - delta);
            let end = Math.min(totPages - 1, ipageindex + delta);
            if (ipageindex <= maxVisible) {
                start = 2;
                end = maxVisible;
            }

            if (ipageindex >= totPages - maxVisible + 1) {
                start = totPages - maxVisible + 1;
                end = totPages - 1;
            }
            if (start > 2) paginationHtml += `<span class="dots">...</span>`;
            for (let i = start; i <= end; i++) {
                paginationHtml += `<button class="page-btn_mytask ${i === ipageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
            paginationHtml += `<button class="page-btn_mytask ${ipageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#pageNumbers_mytask").html(paginationHtml);
        $("#prev_mytask").toggleClass("disabled", ipageindex === 1);
        $("#next_mytask").toggleClass("disabled", ipageindex === totPages);
        isRenderPage_mytask = true;
    }


    var setPageNo = 1;
    //$(document).on("click", ".page-btn_mytask", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage_mytask = true;
    //    $("#txtgopage_mytask").val("");
    //    iLoadTaskData(setPageNo);
    //    $(".page-btn_mytask").removeClass("active");
    //    $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn_mytask", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage_mytask = false;
        $("#txtgopage_mytask").val("");
        iLoadTaskData(setPageNo);
        $(".page-btn_mytask").removeClass("active");
        $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#prev_mytask").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_mytask = true;
    //    $("#txtgopage_mytask").val("");
    //    iLoadTaskData(setPageNo);
    //    $(".page-btn_mytask").removeClass("active");
    //    $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    //});


    $("#prev_mytask").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage_mytask = false;
        $("#txtgopage_mytask").val("");
        //renderPagination(setPageNo, totalPageRec)
        iLoadTaskData(setPageNo);
        $(".page-btn_mytask").removeClass("active");
        $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#next_mytask").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_mytask = true;
    //    $("#txtgopage_mytask").val("");
    //    iLoadTaskData(setPageNo);
    //    $(".page-btn_mytask").removeClass("active");
    //    $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next_mytask").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage_mytask = false;
        $("#txtgopage_mytask").val("");
        iLoadTaskData(setPageNo);
        $(".page-btn_mytask").removeClass("active");
        $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo_mytask").click(function () {
    //    let goToPage = parseInt($("#txtgopage_mytask").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage_mytask = true;
    //    iLoadTaskData(setPageNo);
    //    $(".page-btn_mytask").removeClass("active");
    //    $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#divGo_mytask").click(function () {
        let goToPage = parseInt($("#txtgopage_mytask").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        isRenderPage_mytask = false;
        iLoadTaskData(setPageNo);
        $(".page-btn_mytask").removeClass("active");
        $(".page-btn_mytask[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    function currentdate() {
        var dtToday = new Date();
        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();
        var maxDate = year + '-' + month + '-' + day;
        return maxDate;
    }
    ////////-----------------  END INBOX------------------///////
    ////////----------------- START OUTBOX------------------///////
    var orowcount = 0;
    var opageindex = 1, opagesize = 10, orecordcount = 0, ototrecord = 0;
    var osearchflag = false;
    var ochckfilter = false;
    var otempexcel = false;
    $(document).on('click', '#ogetdatabypagenum', function () {
        opageindex = $("#opagnumvalue").val();
        if (opageindex != "undefined") {
            if (Math.sign(opageindex) == 1) {
                var opageindesx = $("#osotopage").text();
                if (opageindex <= parseInt(opageindesx)) {
                    oLoadTaskData(opageindex);
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
    $(document).on('click', '#opaginatearchive', function () {
        opageindex = $(this).attr("index");
        oLoadTaskArchiveData(opageindex);
    });
    $(document).on('click', '#opaginate', function () {
        opageindex = $(this).attr("index");
        oLoadTaskData(opageindex);
    });
    $(document).on('click', '#edittasknote', function () {
        $("#thideditatoken").val($(this).attr("val-data"));
        $("#editnoteModal").modal();
        var formData = new FormData();
        formData.append("token", $(this).attr("val-data"))
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/CaseTaskById",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    $("#etasknotedetails").val(a.TDetails);
                });
                closeload();
                //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    });

    /*Edit note task*/
    $("#EditTaskNote").click(function () {
        openload();
        var formData = new FormData();
        var token = $("#thideditatoken").val();
        var taskdetails = $("#etasknotedetails").val();
        formData.append("token", token);
        formData.append("details", EncodeText(taskdetails));
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/UpdateTaskNote",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (parseInt(response.Data) > 0) {
                    //alert("The task has been updated successfully.");
                    new PNotify({
                        title: 'Success!',
                        text: 'The task has been updated successfully.',
                        type: 'success',
                        delay: 3000
                    });
                    //document.getElementById("editclose").click();
                    $("#editnoteModal").modal("hide");
                    try {
                        LoadTaskData(pageindex, curtab);
                        iLoadTaskData(ipageindex);
                        oLoadTaskData(opageindex);
                        loadInoutCount();
                        dLoadTaskData(dpageindex);
                    }
                    catch (er) {
                    }
                    closeload();
                }
                else {
                    alert(response.Data);
                }
                //  //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    });

    /*Edit task details*/
    $(document).on('click', '#edittask', function () {
        $("#thideditatoken").val($(this).attr("val-data"));
        document.getElementById("esavetaskform").reset();
        $("#edittmyModal").modal();
        var formData = new FormData();
        formData.append("token", $(this).attr("val-data"))
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/CaseTaskById",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var odt = a.TaskDueDate;
                    var today = odt.split('T')[0];
                    $("#etaskduedate").val(today);
                    try {
                        var adt = a.ActionByDate;
                        var atoday = adt.split('T')[0];
                        $("#eactionbydate").val(atoday);
                    }
                    catch (er) {
                    }
                    $("#etaskduedate,#eactionbydate").attr("min", new Date().toISOString().substring(0, 10));
                    $("#eactionbydate").attr("max", new Date().toISOString().substring(0, 10));
                    $("#etaskdetails").val(a.TDetails);
                    $("#etasksubject").val(a.TaskSubject);
                    $('#etasktype option[value="' + a.TaskType + '"]').prop("selected", true);
                    $('#econtact option').removeAttr('selected');
                    //alert(a.ClientId);
                    if (a.ClientId == null || a.ClientId == "" || a.ClientId == "null") {
                        $('#econtact option')[0].selected = true;
                    }
                    else {
                        $('#econtact option[value="' + a.ClientId.toLowerCase() + '"]').prop("selected", true);
                        $('#econtact option[value="' + a.ClientId.toUpperCase() + '"]').prop("selected", true);
                    }
                    if (a.CaseId == null || a.CaseId == "" || a.CaseId == "null") {
                        $('#ematter option')[0].selected = true;
                    }
                    else {
                        var option = '<option value="' + a.CaseId + '" selected > ' + a.CaseName + ' </option>';
                        $("#ematter").empty().append(option);
                        var caseids = a.CaseId;
                        $("#emember").empty();
                        EditloadCaseUser(caseids, "#emember");
                    }
                    setTimeout(function () {
                        $('#emember option[value="' + a.AssignUser + '"]').prop("selected", true);
                    }, 3000);
                    closeload();
                });
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    });
    $("#ematter").change(function () {
        EditloadCaseUser($(this).val(), "#emember")
    });
    function EditloadCaseUser(caseids, target) {
        if (caseids == null || caseids == "" || caseids == "null" || caseids == "00000000-0000-0000-0000-000000000000") {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/MatterApi/Assignuserteamlead",
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
                    var html3 = '';
                    $.each(obj, function (i, a) {
                        if (a.roleid == 1) {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                            $("#emember").append(option);
                        }
                        else {
                            if (a.IsPartner == 1) {
                                var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                                $("#emember").append(option);
                            }
                            else {
                                if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                                    if (a.roleid == 3) {
                                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '(' + a.RoleName + ')</option>';
                                        $("#emember").append(option);
                                    }
                                    else {
                                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                                        $("#emember").append(option);
                                    }
                                }
                                else {
                                    if (a.roleid == 3) {
                                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '(' + a.RoleName + ')</option>';
                                        $("#emember").append(option);
                                    }
                                    else {
                                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                                        $("#emember").append(option);
                                    }
                                }
                            }
                        }
                    });
                    return false;
                    //End of foreach Loop
                    //console.log(response);
                }, //End of AJAX Success function
                failure: function (response) {
                    // alert(response.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                } //End of AJAX error function
            });
        }
        else {
            $(target).empty();
            var optiont1 = '<option value="" >Select</option>';
            $(target).append(optiont1);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/BindCaseAssignuser",
                headers: {
                    "caseid": caseids
                },
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
                    var html3 = '';
                    $.each(obj, function (i, a) {
                        var option = '<option value="' + a["auser"] + '" > ' + a["UserId"] + '</option>';
                        $(target).append(option);
                    });
                    $(target).append(html3);
                    //End of foreach Loop
                    //console.log(response);
                }, //End of AJAX Success function
                failure: function (response) {
                    //alert(response.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                } //End of AJAX error function
            });
        }
    }

    /*Edit case task details*/
    $("#EditCaseTask").click(function () {
        var formData = new FormData();
        var caseid = $("#ematter").val();
        var tasktype = $("#etasktype").val();
        var member = $("#emember").val();
        var taskduedate = $("#etaskduedate").val();
        var eactionbydate = $("#eactionbydate").val();
        var taskdetails = $("#etaskdetails").val();
        var client = $("#econtact").val();
        var token = $("#thideditatoken").val();
        var tasksubject = $("#etasksubject").val();
        if (tasktype == "") {
            alert("Please select the type of task you would like to add in the matter.");
            document.getElementById("tasktype").focus();
            return false;
        }
        if (member == "") {
            alert("Please assign the task to a particular team member.");
            document.getElementById("member").focus();
            return false;
        }
        if (taskduedate == "") {
            alert("Please select a due date for the task, on or before which the task needs to be completed.");
            document.getElementById("taskduedate").focus();
            return false;
        }
        if (eactionbydate == "") {
            alert("Please select the date by when the team member can accept or reject the task.");
            document.getElementById("eactionbydate").focus();
            return false;
        }
        if (taskduedate != "" && eactionbydate != "") {
            var date1 = new Date(taskduedate);
            var date2 = new Date(eactionbydate);
            if (date2 > date1) {
                alert("Due date should not be less than Accept/Reject By date");
                return false;
            }
        }
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("attachmenttask").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachmenttask").files[i];
            var filename = file.name;
            //validate filechracter
            var fileNameIndex = filename.lastIndexOf("/") + 1;
            var dotIndex = filename.lastIndexOf('.');
            var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
            var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
            if (reg.test(newfioename) == true) {
                alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                return false;
            }
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
        formData.append("caseid", caseid);
        formData.append("assignuser", EncodeText(member));
        formData.append("tasktype", EncodeText(tasktype));
        formData.append("duedate", EncodeText(taskduedate));
        formData.append("actionbydate", EncodeText(eactionbydate));
        formData.append("details", EncodeText(taskdetails));
        formData.append("token", token);
        formData.append("client", EncodeText(client));
        formData.append("savemykasefileid", EncodeText($("#mykasefileidedittask").val()));
        formData.append("tasksubject", EncodeText(tasksubject));
        //read assign using list
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/UpdateCaseTask",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (parseInt(response.Data.Result) > 0) {
                    var InfectFilesResult = "";
                    if (response.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    new PNotify({
                        title: 'Success!',
                        text: 'Task updated successfully.</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    document.getElementById("editclose").click();
                    $("#mykasefileidedittask").val("");
                    $("#browsefileedittask").attr("title", "No file chosen");
                    $("#browsefilelbledittask").html("No file chosen");
                    try {
                        LoadTaskData(pageindex, curtab);
                        iLoadTaskData(ipageindex);
                        oLoadTaskData(opageindex);
                        loadInoutCount();
                        dLoadTaskData(dpageindex);
                    }
                    catch (er) {
                    }
                    closeload();
                }
                else if (String(response.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    closeload();
                    return false;
                }
                else if (String(response.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    closeload();
                    return false;
                }
                else if (response.Data.Result == "-1") {
                    alert("Already Assigned task to this Team Member related this case");
                    closeload();
                }
                else {
                    alert(response.Data);
                    closeload();
                }
                //  //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    });
    $("#rduedate").change(function () {
        $("#actiondate").attr("max", $("#rduedate").val());
    });

    $(document).on('click', '#outboxaction', function () {
        $("#rmyModal").modal();
        $("#hidratoken").val($(this).attr("val-data"));
        $("#rduedate").val(new Date().toISOString().substring(0, 10));
        $("#rduedate").attr("min", new Date().toISOString().substring(0, 10));
        $("#actiondate").val(new Date().toISOString().substring(0, 10));
        $("#actiondate").attr("min", new Date().toISOString().substring(0, 10));
        $("#actiondate").attr("max", $(this).attr("val-date"));
        $('#rmember option[value="' + $(this).attr("val-auser").toLowerCase() + '"]').prop("selected", true);
        $('#rmember option[value="' + $(this).attr("val-auser").toUpperCase() + '"]').prop("selected", true);
    });
    $(document).on('click', '#rejectaction', function () {
        $("#rdetails").val("");
        $("#rjctmyModal").modal();
        $("#hidrjctatoken").val($(this).attr("data-id"));
    });

    /*Get reassign task details*/
    $("#rSaveCaseTask").click(function () {
        var rmember = $("#rmember").val();
        if (rmember == "") {
            alert("select team member");
            return false;
        }
        var result = confirm("Are you sure to reassign task?");
        if (result) {
            var tokenid = $("#hidratoken").val();
            var rduedate = $("#rduedate").val();
            if (rduedate == "") {
                alert("select due date");
                return false;
            }
            var actiondate = $("#actiondate").val();
            if (actiondate == "") {
                alert("select action by date");
                return false;
            }
            var rmember = $("#rmember").val();
            if (rmember == "") {
                alert("select team member");
                return false;
            }
            var formData = new FormData();
            formData.append("tokenid", tokenid);
            formData.append("memberid", EncodeText(rmember));
            formData.append("rduedate", EncodeText(rduedate));
            formData.append("actiondate", EncodeText(actiondate));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/ReAssignTask",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (parseInt(response1.Data) > 0) {
                        alert("The task has been reassigned successfully.");
                        oLoadTaskData(opageindex);
                        iLoadTaskData(ipageindex);
                        closeload();
                        loadInoutCount();
                        dLoadTaskData(dpageindex);
                        $("#closeassign").click();
                    }
                    closeload();
                },
                failure: function (response1) {
                    alert(response1.responseText);
                    closeload();
                },
                error: function (response1) {
                    alert(response1.responseText);
                    closeload();
                }
            });
        }
    });
    $("#ocleardate").click(function () {
        $("#ofilterdate").val("");
        $("#ocleardate").css("display", "none");
        isRenderPage_out = false;
        oLoadTaskData(1);
    })
    $("#ocleardate").click(function () {
        $("#ofilterdate").val("");
        $("#oAcceptRejectBycleardate").css("display", "block");
        isRenderPage_out = false;

        oLoadTaskData(1);
    })
    $("#ocleardate").click(function () {
        $("#ofilterdate").val("");
        $("#ofilterttduedate").css("display", "block");
        isRenderPage_out = false;

        oLoadTaskData(1);
    })
    $("#ofilterdate").change(function () {
        $("#ocleardate").css("display", "block");
        isRenderPage_out = false;

        oLoadTaskData(1);
    })
    $("#ofiltertask").change(function () {
        isRenderPage_out = false;
        oLoadTaskData(1);
    })
    $("#ofilterclient").change(function () {
        isRenderPage_out = false;
        loadmatter($(this).val(), "ofiltercasescheduler");
        oLoadTaskData(1);
    })
    $("#ofiltertdate").change(function () {
        isRenderPage_out = false;

        oLoadTaskData(1);
        $("#tdatecleardate").css("display", "block");
    })
    $("#ofilterAcceptRejectBy").change(function () {
        isRenderPage_out = false;

        oLoadTaskData(1);
        $("#oAcceptRejectBycleardate").css("display", "block");
    })
    $("#ofilterttduedate").change(function () {
        isRenderPage_out = false;

        oLoadTaskData(1);
        $("#tduedatecleardate").css("display", "block");
    })
    $("#ofilteruserscheduleto").change(function () {
        isRenderPage_out = false;
        oLoadTaskData(1);
    });
    $("#ofilterStatus").change(function () {
        isRenderPage_out = false;
        oLoadTaskData(1);
    })
    $("#clearnewsearchcaseof").click(function () {
        isRenderPage_out = false;
        $("#ofiltercasescheduler").val("");
        $("#clearnewsearchcaseof").css("display", "none");
        oLoadTaskData(1);
    })
    $("#searchdatasof").click(function () {
        isRenderPage_out = false;
        var casefiltercasename = $("#ofiltercasescheduler").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#ofiltercasescheduler").focus();
            return false;
        }
        $("#clearnewsearchcaseof").css("display", "unset")
        /* your code here */
        oLoadTaskData(1);
    });
    /* your code here */
    $("#tdatecleardate").click(function () {
        $("#ofiltertdate").val("");
        $("#tdatecleardate").css("display", "none");
        isRenderPage_out = false;
        oLoadTaskData(1);
    })
    $("#oAcceptRejectBycleardate").click(function () {
        $("#ofilterAcceptRejectBy").val("");
        $("#oAcceptRejectBycleardate").css("display", "none");
        isRenderPage_out = false;

        oLoadTaskData(1);
    })
    $("#tduedatecleardate").click(function () {
        $("#ofilterttduedate").val("");
        $("#tduedatecleardate").css("display", "none");
        isRenderPage_out = false;

        oLoadTaskData(1);
    })
    $("#sortoutbox").click(function () {
        var sortvalue = $(this).attr("sortvalue");
        if (sortvalue == "") {
            $(this).attr("sortvalue", "desc");
            sortvalue = "desc";
        }
        if (sortvalue == "asc") {
            $(this).attr("sortvalue", "desc");
        }
        else {
            $(this).attr("sortvalue", "asc");
        }
        isRenderPage_out = false;

        oLoadTaskData(opageindex, sortvalue);
    });

    /*GEt outbox task details*/
    function oLoadTaskData(opageindex, sortvalue = null) {
        $("#otfooter ul").remove();
        var ohtml3 = '';
        var formData = new FormData();
        formData.append("pagenum", EncodeText(opageindex));
        formData.append("pagesize", EncodeText(opagesize));
        formData.append("datefilter", EncodeText($("#ofilterttduedate").val()));
        formData.append("filtertask", EncodeText($("#ofiltertask").val()));
        formData.append("filterclient", EncodeText($("#ofilterclient").val()));
        formData.append("filtertdate", EncodeText($("#ofiltertdate").val()));
        formData.append("ofilterAcceptRejectBy", EncodeText($("#ofilterAcceptRejectBy").val()));
        formData.append("ofiltertdate", EncodeText($("#ofiltertdate").val()));
        formData.append("ofilteruserscheduleto", EncodeText($("#ofilteruserscheduleto").val()));
        formData.append("ofilterStatus", EncodeText($("#ofilterStatus").val()));
        formData.append("ofiltercasescheduler", EncodeText($("#ofiltercasescheduler").val()));
        if (sortvalue == null) {
            sortvalue = "";
        }
        formData.append("sortvalue", sortvalue);
        ////read assign using list
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskOutboxList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    //$("#odataescstatus").html("");
                    $("#odataescstatus").hide();
                    $("#odtNotFound").text("");
                    $("#outTskPagination").show();
                }
                else {
                    //$("#odataescstatus").html("No result found !");
                    $("#odataescstatus").show();
                    $("#odtNotFound").text("No Data Found");
                    $("#outTskPagination").hide();
                    closeload();
                }
                var olength = response1.Data.length;
                var octq = 0;
                $.each(response1.Data, function (i, a) {
                    octq = octq + 1;
                    orowcount = 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (olength - 1)) {
                        totpage = parseInt(totdata) / parseInt(opagesize);
                        if (parseInt(totdata) % parseInt(opagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (opageindex == totpage) {
                            $('#next_Out').hide();
                            //$('#next').css("display", "none");
                            $('#prev_Out').css("display", "block"); s
                        }
                        else {
                            $('#next_Out').css("display", "block");
                        }
                        if (opageindex == 1) {
                            $('#prev_Out').css("display", "none");
                        }
                        else {
                            $('#prev_Out').css("display", "block");
                        }

                        if (isRenderPage_out == false) {
                            renderPagination_out(opageindex, totpage);
                        }
                        //if (i === 0) {
                        //    ofirstvalue = a.rownum;
                        //}
                        //if (i === (olength - 1)) {
                        //    var opnext = opageindex;
                        //    var opprev = opageindex;
                        //    var opageno = opageindex;
                        //    var ototdata = a.totRow;
                        //    var ototpage = 0;
                        //    if (a.totRow > 0) {
                        //        opnext = parseInt(opnext) + 1;
                        //        if (opnext == 0) opnext = 1;
                        //        opprev = parseInt(opageno) - 1;
                        //        if (opprev == 0) opprev = 1;
                        //        ototpage = parseInt(ototdata) / parseInt(opagesize);
                        //        if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                        //            ototpage = parseInt(ototpage) + 1;
                        //        }
                        //        $("#opagnumvalue").attr("max", ototpage);
                        //    }
                        //    var otfot = '';
                        //    var otfot = '';
                        //    otfot += '<ul>'
                        //    otfot += '<li>results <span>' + a.totRow + '</span>  <span id="osotopage" style="display:none">' + ototpage + '</span></li>'
                        //    otfot += '<li><span>|</span></li>'
                        //    otfot += '<li>pages ' + opageindex + '/ ' + parseInt(ototpage) + '</li>'
                        //    otfot += '<li><span>|</span></li>'
                        //    otfot += '<li ><input type="number" id="opagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="ogetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    if (a.totRow <= olength) {
                        //    }
                        //    else if (opageno == 1) {
                        //    }
                        //    else if (opageno == ototpage) {
                        //        otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + ofirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (opageno < ototpage) {
                        //        otfot += '<a  id="opaginate" title="Next Page" href="javascript:void()" index="' + opnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    $("#otfooter").html(otfot);
                    }
                    var oAssignBycolor = "";
                    var oAssignTocolor = "";
                    var oClientName = a.ClientName;
                    if (oClientName == "null" || oClientName == null) {
                        oClientName = "";
                    }
                    var oCaseName = a.CaseName;
                    var oAssignBy = a.AssignBy;
                    var oAssignTo = a.AssignTo;
                    var oAssignBy = a.AssignBy;
                    if (oAssignTo == "ME") {
                        var oAssignTocolor = "#069";
                    }
                    else {
                        var oAssignTocolor = "maroon";
                    }
                    var oAssignBy = a.AssignBy;
                    if (oAssignBy == "ME") {
                        oAssignBycolor = "#069";
                    }
                    else {
                        var oAssignBycolor = "maroon";
                    }
                    var duerowcss = "";
                    if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                        duerowcss = "";
                    }
                    ohtml3 += '<tr>'
                    ohtml3 += '<td style="' + duerowcss + '"><span>' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    ohtml3 += '<td class="ottaskoutbox" style="' + duerowcss + '"><span>' + a.TaskName + '</span></td>'
                    ohtml3 += '<td class="tclientoutbox" style="' + duerowcss + '">'
                    ohtml3 += '<div style="float:left">'
                    ohtml3 += '<span id="clname" class="LoginId" style="cursor: pointer; color: #069" data-id="' + a.ClientId + '">' + oClientName + '</span><br>'
                    ohtml3 += '</div>'
                    ohtml3 += '</td>'
                    if (oCaseName == "null" || oCaseName == null || oCaseName == "") {
                        ohtml3 += '<td class="tcaseoutbox" ><span>' + oCaseName + '</span></td>'
                    }
                    else {
                        ohtml3 += '<td class="tcaseoutbox Border_freeze"  id="caseid" style="' + duerowcss + ';cursor: pointer; " sno="' + a.CaseId + '"><div class="freeze-text">' + oCaseName + '</div></td>'
                    }
                    if (a.TDetails == "" || a.TDetails == null || a.TDetails == "null") {
                        ohtml3 += '<td class="tbriefoutbox" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        if (a.TDetails.length > 60) {
                            ohtml3 += '<td class="tbriefoutbox"><span class="comment more" style="">' + a.TDetails.substring(0, 60) + '</span>'
                            ohtml3 += '<span data-toggle="collapse" data-target="#dto' + octq + '" style="color:#069;cursor:pointer"> more</span>'
                            ohtml3 += ' <div id="dto' + octq + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            ohtml3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dto' + octq + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                            ohtml3 += '' + a.TDetails + ''
                            ohtml3 += '</div>'
                            ohtml3 += '</td>'
                        }
                        else {
                            ohtml3 += '<td class="tbriefoutbox"><span class="comment more" style="">' + a.TDetails + '</span></td>'
                        }
                    }
                    ohtml3 += '<td class="tassignbybyoutbox" style="' + duerowcss + '" scope="row">' + oAssignBy + '</td>'
                    ohtml3 += ' <td class="tassigntobyoutbox" style = "' + duerowcss + '"  ><span title="View profile" id="linkprofile" style="cursor: pointer; color: #069" data-val=' + a.AssignUser + '> ' + oAssignTo + '</span></span>'
                    ohtml3 += '</td>'
                    if (a.ActionByDate == "" || a.ActionByDate == null || a.ActionByDate == "null") {
                        ohtml3 += '<td class="ttimeoutbox" scope="row" style="' + duerowcss + ';text-align:center"></td>'
                    }
                    else {
                        ohtml3 += '<td class="ttimeoutbox" scope="row" style="' + duerowcss + '"><span class="text-success">' + formatDatetoIST(a.ActionByDate) + '</span></td>'
                    }
                    const dueDate = new Date(a.TaskDueDate);
                    const today = new Date();
                    const diffTime = dueDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let dueMessage = '';

                    if (diffDays > 0) {
                        dueMessage = `<br><span style='color: green;'>${diffDays} day${diffDays > 1 ? 's' : ''} to go</span>`;
                    } else if (diffDays < 0) {
                        dueMessage = `<br><span style='color: red;'>${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue</span>`;
                    } else {
                        dueMessage = `<br><span style='color: orange;'>Due today</span>`;
                    }

                    ohtml3 += '<td class="tduedateoutbox" style="' + duerowcss + '">' +
                        formatDatetoIST(a.TaskDueDate) + dueMessage + '</td>';
                    //ohtml3 += '<td class="tduedateoutbox" style="' + duerowcss + '">' + formatDatetoIST(a.TaskDueDate) + '</td>'
                    if (a.AssignTaskStatus == "") {
                        if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                            if (a.TaskName == "Assign Team Members") {
                                ohtml3 += '<td style="' + duerowcss + '">';
                                ohtml3 += '<ul class="table_action">';
                                ohtml3 += '<li><button type="button" class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask">';
                                ohtml3 += '<img src="/newassets/images/archive_icon.png" id="removetask" /></button></li>';
                                ohtml3 += '<li><button type="button" class="taskoutboxbtnicon" title="Re-assign task" actionval-date="' + a.TaskDueDate.substring(0, 10) + '" val-date="' + a.TaskDueDate.substring(0, 10) + '" val-data="' + a.Tid + '" id="outboxaction">';
                                ohtml3 += '<i class="glyphicon glyphicon-share"></i></button></li>';
                                ohtml3 += '<li>';
                                ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Document"  id-val="' + a.Tid + '"  id="filelink">';
                                ohtml3 += '<img src="/newassets/img/folder.svg">';
                                ohtml3 += '</button>';
                                ohtml3 += '</li></ul>'
                                ohtml3 += '</td>';
                            }
                            else {
                                ohtml3 += '<td style="' + duerowcss + '"> <ul class="table_action"> <li><button type="button" class="taskoutboxbtnicon" title="Edit task" val-data="' + a.Tid + '" id="edittask"> <img src="/newassets/img/edit.svg"> </button></li> <li> <button type="button" class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask"><img src="/newassets/img/archive.svg" id="removetask" /></button></li> ';
                                ohtml3 += ' <li> <button type="button" class="taskoutboxbtnicon" title="Click here to send reminder for accept/reject task" val-data="' + a.Tid + '" val-task="' + a.TaskName + '" duedate="' + a.TaskDueDate + '" id="setremind"><img src="/newassets/img/bell.svg" /></button></li>'
                                ohtml3 += '<li>';
                                ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Document"  id-val="' + a.Tid + '"  id="filelink">';
                                ohtml3 += '<img src="/newassets/img/folder.svg">';
                                ohtml3 += '</button>';
                                ohtml3 += '</li></ul>';
                                ohtml3 += '</td>';
                            }
                        }
                        else {
                            if (a.TaskName == "Assign Team Members") {
                                ohtml3 += '<td style="' + duerowcss + '"><ul class="table_action"><li><button type="button"  class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask"><img src="/newassets/images/archive_icon.png" id="removetask" /></button></li></ul></td>'
                            }
                            else {
                                ohtml3 += '<td style="' + duerowcss + '"><ul class="table_action"><li><button type="button" class="taskoutboxbtnicon" title="Edit task" val-data="' + a.Tid + '" id="edittask"><img src="/newassets/img/edit.svg" /></button></li><li><button type="button"  class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask"><img src="/newassets/img/archive.svg" id="removetask" /></button></li>'
                                ohtml3 += '<li><button type="button" class="taskoutboxbtnicon"   title="Click here to send reminder for accept/reject task" val-data="' + a.Tid + '" val-task="' + a.TaskName + '" duedate="' + a.TaskDueDate + '" id="setremind"><img src="/newassets/img/bell.svg" /></button></li>'
                                ohtml3 += '<li>';
                                ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Document"  id-val="' + a.Tid + '"  id="filelink">';
                                ohtml3 += '<img src="/newassets/img/folder.svg">';
                                ohtml3 += '</button>';
                                ohtml3 += '</li>';
                                ohtml3 += '</ul></td>';
                            }
                        }
                        ohtml3 += '<td class="otstatus" style="' + duerowcss + '"><div class="status_badge"><span style="background:green"></span>In Process</div></td>'
                    }
                    else if (a.AssignTaskStatus == "Rejected") {
                        RejectDetails = "";
                        if (a.RejectDetails == "" || a.RejectDetails == null || a.RejectDetails == "null") {
                            RejectDetails = "";
                        }
                        else {
                            RejectDetails = a.RejectDetails;
                        }
                        if (a.TaskName == "Assign Team Members") {
                            ohtml3 += '<td style="' + duerowcss + '"><ul class="table_action"><li><button type="button"  class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask"><img src="/newassets/img/archive.svg" id="removetask" /></button><span style="color:red;margin-left:5px;" ></li></ul> </td>'
                            ohtml3 += '<td class="otstatus" style="' + duerowcss + '"><div class="status_badge"><span style="background:red"></span>Rejected</div></td>'
                        }
                        else {
                            ohtml3 += '<td style="' + duerowcss + '"><ul class="table_action"><li><button type="button"  class="taskoutboxbtnicon" title="Edit task" val-data="' + a.Tid + '" id="edittask"><img src="/newassets/img/edit.svg" /></button></li><li><button type="button"  class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask"><img src="/newassets/img/archive.svg" id="removetask" /></button></li><li><button type="button" class="taskoutboxbtnicon" title="Re-assign task" actionval-date="' + a.TaskDueDate.substring(0, 10) + '" val-date="' + a.TaskDueDate.substring(0, 10) + '" val-data="' + a.Tid + '"  val-auser="' + a.AssignUser + '" id="outboxaction"><img src="/newassets/img/reload.svg" /></button></li>'
                            ohtml3 += '<li>';
                            ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Document"  id-val="' + a.Tid + '"  id="filelink">';
                            ohtml3 += '<img src="/newassets/img/folder.svg">';
                            ohtml3 += '</button>';
                            ohtml3 += '</li>';
                            ohtml3 += '</ul></td>'
                            ohtml3 += '<td class="otstatus" style="' + duerowcss + '"><div class="status_badge"><span style="background:red"></span>Rejected</div></td>'

                        }
                    }
                    else if (a.AssignTaskStatus == "OverdueRejected") {
                        a.AssignTaskStatus = "Overdue Rejected";
                        RejectDetails = "";
                        if (a.RejectDetails == "" || a.RejectDetails == null || a.RejectDetails == "null") {
                            RejectDetails = "";
                        }
                        else {
                            RejectDetails = a.RejectDetails;
                        }
                        if (a.TaskName == "Assign Team Members") {
                            ohtml3 += '<td class="" style="' + duerowcss + '"><button type="button"  class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask"><img src="/newassets/images/archive_icon.png" id="removetask" /></button><span style="color:red;margin-left:5px;" >| </td>'
                            ohtml3 += '<td class="otstatus" style="' + duerowcss + '"><div class="status_badge"><span style="background:red"></span>Overdue Rejected</div></td>'

                        }
                        else {
                            ohtml3 += '<td class="" style="' + duerowcss + '">';
                            ohtml3 += '<ul class="table_action" style="list-style: none; padding: 0; margin: 0; display: flex; gap: 10px; align-items: center;">';

                            // Edit Task Button
                            ohtml3 += '<li>';
                            ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Edit task" val-data="' + a.Tid + '" id="edittask">';
                            ohtml3 += '<img src="/newassets/img/edit.svg">';
                            ohtml3 += '</button>';
                            ohtml3 += '</li>';

                            // Archive Task Button
                            ohtml3 += '<li>';
                            ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Archive task" val-data="' + a.Tid + '" id="deletetask">';
                            ohtml3 += '<img src="/newassets/img/archive.svg" id="removetask">';
                            ohtml3 += '</button>';
                            ohtml3 += '</li>';

                            // Reassign Task Button
                            ohtml3 += '<li>';
                            ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Re-assign task" actionval-date="' + a.TaskDueDate.substring(0, 10) + '" val-date="' + a.TaskDueDate.substring(0, 10) + '" val-data="' + a.Tid + '" val-auser="' + a.AssignUser + '" id="outboxaction">';
                            ohtml3 += '<img src="/newassets/img/reload.svg">';
                            ohtml3 += '</button>';
                            ohtml3 += '</li>';


                            ohtml3 += '<li>';
                            ohtml3 += '<button type="button" class="taskoutboxbtnicon" title="Document"  id-val="' + a.Tid + '"  id="filelink">';
                            ohtml3 += '<img src="/newassets/img/folder.svg">';
                            ohtml3 += '</button>';
                            ohtml3 += '</li>';

                            ohtml3 += '</ul>';
                            ohtml3 += '</td>';
                            ohtml3 += '<td class="otstatus" style="' + duerowcss + '"><div class="status_badge"><span style="background:red"></span>Overdue Rejected</div></td>'
                        }
                    }
                    ohtml3 += '</td>'
                    //if (a.DocsCount > 0) {
                    //    ohtml3 += '<td class="outboxattach"><span style="cursor:pointer; text-align:center;" id-val="' + a.Tid + '" id="filelink"><i class="glyphicon glyphicon-folder-open"></i></span></td>'
                    //}
                    //else {
                    //    ohtml3 += '<td class="outboxattach"></td>';
                    //}
                    if (a.TaskSubject == "" || a.TaskSubject == null || a.TaskSubject == "null") {
                        ohtml3 += '<td class="otsubject" style="' + duerowcss + '"></td>'
                    }
                    else {
                        ohtml3 += '<td class="otsubject" style="' + duerowcss + '"><span>' + a.TaskSubject + '</span></td>'
                    }
                    ohtml3 += '</tr>'
                });
                $("#obindcasetask").html("");
                $("#obindcasetask").append(ohtml3);
            },
            failure: function (response1) {
                alert(response1.responseText);
            },
            error: function (data) {
                alert(response1.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            //$("input:checkbox:not(:checked)").each(function () {
            //    var column = "table ." + $(this).attr("name");
            //    $(column).hide();
            //});
            $("#od li input:checkbox:not(:checked)").each(function () {
                var column = "#bigTable ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    //New Pagination Start
    /*Pagination Start*/
    //var isRenderPage_out = false;
    //var totalPageRec = "";
    //function renderPagination_out(opageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = opageindex;
    //    totalPageRec = totdata;
    //    let paginationHtmlo = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtmlo += `<button class="page-btn_out ${i === opageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (opageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtmlo += `<button class="page-btn_out ${i === opageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtmlo += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtmlo += `<button class="page-btn_out ${j === opageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers_Out").html(paginationHtmlo);
    //    $("#prev_Out").toggleClass("disabled", opageindex === 1);
    //    $("#next_Out").toggleClass("disabled", opageindex === totdata);
    //    isRenderPage_out = true;
    //}
    var isRenderPage_out = false;
    var totalPageRec = "";
    function renderPagination_out(opageindex, totdata) {
        let totPages = totdata;
        setPageNo = opageindex;
        totalPageRec = totdata;

        let paginationHtmlo = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtmlo += `<button class="page-btn_out ${i === opageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtmlo += `<button class="page-btn_out ${opageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

            let start = Math.max(2, opageindex - delta);
            let end = Math.min(totPages - 1, opageindex + delta);
            if (opageindex <= maxVisible) {
                start = 2;
                end = maxVisible;
            }

            if (opageindex >= totPages - maxVisible + 1) {
                start = totPages - maxVisible + 1;
                end = totPages - 1;
            }
            if (start > 2) paginationHtmlo += `<span class="dots">...</span>`;
            for (let i = start; i <= end; i++) {
                paginationHtmlo += `<button class="page-btn_out ${i === opageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtmlo += `<span class="dots">...</span>`;
            paginationHtmlo += `<button class="page-btn_out ${opageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#pageNumbers_Out").html(paginationHtmlo);
        $("#prev_Out").toggleClass("disabled", opageindex === 1);
        $("#next_Out").toggleClass("disabled", opageindex === totPages);
        isRenderPage_out = true;
    }

    var setPageNo = 1;
    //$(document).on("click", ".page-btn_out", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage_out = true;
    //    $("#txtgopage_Out").val("");
    //    oLoadTaskData(setPageNo);
    //    $(".page-btn_out").removeClass("active");
    //    $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    //});


    $(document).on("click", ".page-btn_out", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage_out = false;
        $("#txtgopage_Out").val("");
        oLoadTaskData(setPageNo);
        $(".page-btn_out").removeClass("active");
        $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#prev_Out").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_out = true;
    //    $("#txtgopage_mytask").val("");
    //    oLoadTaskData(setPageNo);
    //    $(".page-btn_out").removeClass("active");
    //    $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev_Out").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage_out = false;
        $("#txtgopage_Out").val("");
        //renderPagination(setPageNo, totalPageRec)
        oLoadTaskData(setPageNo);
        $(".page-btn_out").removeClass("active");
        $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#next_Out").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_out = true;
    //    $("#txtgopage_Out").val("");
    //    oLoadTaskData(setPageNo);
    //    $(".page-btn_out").removeClass("active");
    //    $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next_Out").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage_out = false;
        $("#txtgopage_Out").val("");
        oLoadTaskData(setPageNo);
        $(".page-btn_out").removeClass("active");
        $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo_Out").click(function () {
    //    let goToPage = parseInt($("#divGo_Out").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage_out = true;
    //    oLoadTaskData(setPageNo);
    //    $(".page-btn_out").removeClass("active");
    //    $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    //});


    $("#divGo_Out").click(function () {
        let goToPage = parseInt($("#txtgopage_Out").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        isRenderPage_out = true;
        oLoadTaskData(setPageNo);
        $(".page-btn_out").removeClass("active");
        $(".page-btn_out[data-page='" + setPageNo + "']").addClass("active");
    });


    /*Pagination End*/
    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    $(document).on('click', '#linkprofile', function () {
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/CaseUserProfile";
        url_redirect({
            url: urls,
            method: "post",
            data: { "loginid": $(this).attr('data-val'), "type": "1" }
        });
    });
    ////////----------------- END OUTBOX------------------///////
    ////////----------------- START DUE------------------///////
    var drowcount = 0;
    var dpageindex = 1, dpagesize = 10, drecordcount = 0, dtotrecord = 0;
    var dsearchflag = false;
    var dchckfilter = false;
    var dtempexcel = false;
    /*Get task data by page number*/
    $(document).on('click', '#dgetdatabypagenum', function () {
        dpageindex = $("#dpagnumvalue").val();
        if (dpageindex != "undefined") {
            if (Math.sign(dpageindex) == 1) {
                var dpageindesx = $("#dsotopage").text();
                if (dpageindex <= parseInt(dpageindesx)) {
                    //openload();
                    dLoadTaskData(dpageindex);
                    //closeload();
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

    /*Get dropbox task data*/
    $(document).on('click', '#dpaginate', function () {
        dpageindex = $(this).attr("index");
        dLoadTaskData(dpageindex);
    });
    $(document).on('click', '#setremindoverdue', function () {
        $("#setremindoverduesend").attr("val-data", $(this).attr("val-data"));
        $("#overduereminderModal").modal();
    });

    /*Set send reminder ourdue*/
    $(document).on('click', '#setremindoverduesend', function () {
        //var result = confirm("Are you sure you want to send overdue task reminder?");
        //if (result) {
            var tokenid = $(this).attr("val-data");
            var remarksoverdue = $("#overdueremarks").val();
            if (remarksoverdue == "") {
                new PNotify({
                    title: 'Info!',
                    text: 'Please fill the remark.',
                    type: 'warning',
                    delay: 3000
                });
                return false;
            }
            var formData = new FormData();
            formData.append("tokenid", tokenid);
            formData.append("remarks", EncodeText(remarksoverdue));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SendReminderoverdue",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data == "") {
                        //alert("Reminder sent successfully.");
                        new PNotify({
                            title: 'Success!',
                            text: 'Reminder sent successfully.',
                            type: 'success',
                            delay: 3000
                        });
                        $("#overduereminderModal").modal("hide");
                        $("#overdueremarks").val("")
                        dLoadTaskData(dpageindex);
                    }
                    else {
                        alert("Oops! something went wrong.");
                    }
                    closeload();
                },
                failure: function (response1) {
                    alert(response1.responseText);
                    closeload();
                },
                error: function (response1) {
                    alert(response1.responseText);
                    closeload();
                }
            });
        //}
    });

    /*Send reminder*/
    //$(document).on('click', '#setremind', function () {
    //    var result = confirm("Are you sure you want to send accept/reject task reminder?");
    //    if (result) {
    //        var tokenid = $(this).attr("val-data");
    //        var formData = new FormData();
    //        formData.append("tokenid", tokenid);
    //        openload();
    //        $.ajax({
    //            async: true,
    //            type: "POST",
    //            url: "/api/CallApi/SendReminder",
    //            dataType: 'json',
    //            data: formData,
    //            contentType: false,
    //            processData: false,
    //            success: function (response1) {
    //                if (response1.Data == "") {
    //                    alert("Reminder sent successfully.");
    //                }
    //                else {
    //                    alert("Oops! something went wrong.");
    //                }
    //                closeload();
    //            },
    //            failure: function (response1) {
    //                alert(response1.responseText);
    //                closeload();
    //            },
    //            error: function (response1) {
    //                alert(response1.responseText);
    //                closeload();
    //            }
    //        });
    //    }
    //});
    $(document).on("click", "#setremind", function () {
        var tknId = $(this).attr("val-data");
       
        $("#myModalAcceptRejectConfirmation").modal("show");
        $("#AcceptReject_Cfinal").attr("tknId", tknId);

    });
    $(document).on("click", "#AcceptReject_Cfinal", function () {
        var tokenid = $(this).attr("tknId");
        var acceptRejectMsg = $("#remarkForAcceptRejectTask").val();
        if (acceptRejectMsg == "" || acceptRejectMsg == undefined || acceptRejectMsg == null) {
            new PNotify({
                title: 'Info!',
                text: 'Please fill remark.',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        fnSetReminder(tokenid);
    });
    function fnSetReminder(tokenid) {
            //var result = confirm("Are you sure you want to send accept/reject task reminder?");
            //if (result) {
                //var tokenid = $(this).attr("val-data");
        var txtAccRejectMsg = $("#remarkForAcceptRejectTask").val();
                var formData = new FormData();
        formData.append("txtAccRejMsg", txtAccRejectMsg);
                formData.append("tokenid", tokenid);
                openload();
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/api/CallApi/SendReminder",
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response1) {
                        if (response1.Data == "") {
                            //alert("Reminder sent successfully.");
                            new PNotify({
                                title: 'Success!',
                                text: 'Reminder sent successfully.',
                                type: 'success',
                                delay: 3000
                            });
                            $("#myModalAcceptRejectConfirmation").modal("hide");
                        }
                        else {
                            //alert("Oops! something went wrong.");
                            new PNotify({
                                title: 'Error!',
                                text: 'Oops! something went wrong.',
                                type: 'error',
                                delay: 3000
                            });
                        }
                        closeload();
                    },
                    failure: function (response1) {
                        alert(response1.responseText);
                        closeload();
                    },
                    error: function (response1) {
                        alert(response1.responseText);
                        closeload();
                    }
                });
            //}
    }



    $(document).on("click", "#dueaction", function () {
        globalToken = $(this).attr("data-id");
        $('#ActualclosurModalCurrenttask').modal('show');
    });
    $(document).on('click', '#submitAcceptFinalTask', function () {
        //var result = confirm("Are you sure you want to mark the task as completed?");
        //if (result) {
            var tokenid = globalToken;
            var formData = new FormData();
            formData.append("tokenid", tokenid);
            formData.append("RequestType", EncodeText("TC"));
            formData.append("rejectdetails", EncodeText(""));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/AcceptRejectInbox",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (parseInt(response1.Data) > 0) {
                        //alert("Task status updated successfully");
                        new PNotify({
                            title: 'Success!',
                            text: 'Task status updated successfully.',
                            type: 'success',
                            delay: 3000
                        });
                        $('#ActualclosurModalCurrenttask').modal('hide');
                        LoadTaskData(pageindex, curtab);
                        dLoadTaskData(dpageindex);
                        closeload();
                        loadInoutCount();
                        oLoadTaskData(opageindex);
                        iLoadTaskData(ipageindex);
                    }
                    closeload();
                },
                failure: function (response1) {
                    alert(response1.responseText);
                    closeload();
                },
                error: function (response1) {
                    alert(response1.responseText);
                    closeload();
                }
            });
        //}
    });
    $(document).on('click', '#dueactionReassign', function () {
        $("#sendbackreason").val("");
        $("#sendbackmyModal").modal();
        $("#hidrjctatoken").val($(this).attr("data-id"));
    });
    $("#dcleardate").click(function () {
        $("#dfilterdate").val("");
        $("#dcleardate").css("display", "none");
        isRenderPage_Over = false;
        dLoadTaskData(1);
    })
    $("#dfilterdate").change(function () {
        $("#dcleardate").css("display", "block");
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })
    $("#dfiltertask").change(function () {
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })
    $("#dfilterclient").change(function () {
        loadmatter($(this).val(), "dfiltercasescheduler");
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })
    $("#dfiltertdate").change(function () {
        isRenderPage_Over = false;

        dLoadTaskData(1);
        $("#ddatecleardate").css("display", "block");
    })
    $("#dfilteruserto").change(function () {
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })
    $("#dfilterAcceptRejectBy").change(function () {
        isRenderPage_Over = false;

        dLoadTaskData(1);
        $("#dAcceptRejectBycleardate").css("display", "block");
    })
    $("#dfilterduedate").change(function () {
        isRenderPage_Over = false;

        dLoadTaskData(1);
        $("#dduecleardate").css("display", "block");
    })
    /*Search in dropbox task*/
    $("#clearnewsearchcasedf").click(function () {
        $("#dfiltercasescheduler").val("");
        $("#clearnewsearchcasedf").css("display", "none");
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })
    $("#searchdatasdf").click(function () {
        var casefiltercasename = $("#dfiltercasescheduler").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#dfiltercasescheduler").focus();
            return false;
        }
        /*Clear in dropbox task*/
        $("#clearnewsearchcasedf").css("display", "unset")
        isRenderPage_Over = false;

        dLoadTaskData(1);
    });
    $("#ddatecleardate").click(function () {
        $("#dfiltertdate").val("");
        $("#ddatecleardate").css("display", "none");
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })
    $("#dAcceptRejectBycleardate").click(function () {
        $("#dfilterAcceptRejectBy").val("");
        $("#dAcceptRejectBycleardate").css("display", "none");
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })
    $("#dduecleardate").click(function () {
        $("#dfilterduedate").val("");
        $("#dduecleardate").css("display", "none");
        isRenderPage_Over = false;

        dLoadTaskData(1);
    })

    /*Get dropbox task details*/
    function dLoadTaskData(dpageindex) {
        $("#dtfooter ul").remove();
        var dhtml3 = '';
        var formData = new FormData();
        formData.append("pagenum", EncodeText(dpageindex));
        formData.append("pagesize", EncodeText(dpagesize));
        formData.append("datefilter", EncodeText($("#dfilterduedate").val()));
        formData.append("filtertask", EncodeText($("#dfiltertask").val()));
        formData.append("filterclient", EncodeText($("#dfilterclient").val()));
        formData.append("dfilteruserto", EncodeText($("#dfilteruserto").val()));
        formData.append("dfilterAcceptRejectBy", EncodeText($("#dfilterAcceptRejectBy").val()));
        formData.append("dfiltertdate", EncodeText($("#dfiltertdate").val()));
        formData.append("dfiltercasescheduler", EncodeText($("#dfiltercasescheduler").val()));
        var overduefx = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskdueList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    //$("#ddataescstatus").html("");
                    $("#ddataescstatus").hide();
                    $("#dtNotFound2").text("");
                    $("#escPagination").show();
                }
                else {
                    $("#ddataescstatus").show();
                    $("#dtNotFound2").text("No Data Found");
                    $("#escPagination").hide();
                    //$("#ddataescstatus").html("No result found !");
                    closeload();
                }
                var dlength = response1.Data.length;
                var dctq = 0;
                $.each(response1.Data, function (i, a) {
                    dctq = dctq + 1;
                    drowcount = 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    $('#overdueevt').text(a.totRow);
                    if (i === (dlength - 1)) {
                        totpage = parseInt(totdata) / parseInt(dpagesize);
                        if (parseInt(totdata) % parseInt(dpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (dpageindex == totpage) {
                            $('#next_Over').hide();
                            $('#prev_Over').css("display", "block"); s
                        }
                        else {
                            $('#next_Over').css("display", "block");
                        }
                        if (dpageindex == 1) {
                            $('#prev_Over').css("display", "none");
                        }
                        else {
                            $('#prev_Over').css("display", "block");
                        }

                        if (isRenderPage_Over == false) {
                            renderPagination_Over(dpageindex, totpage);
                        }
                        //if (i === 0) {
                        //    dfirstvalue = a.rownum;
                        //}
                        //if (i === (dlength - 1)) {
                        //    var dpnext = dpageindex;
                        //    var dpprev = dpageindex;
                        //    var dpageno = dpageindex;
                        //    var dtotdata = a.totRow;
                        //    var dtotpage = 0;
                        //    if (a.totRow > 0) {
                        //        dpnext = parseInt(dpnext) + 1;
                        //        if (dpnext == 0) dpnext = 1;
                        //        dpprev = parseInt(dpageno) - 1;
                        //        if (dpprev == 0) dpprev = 1;
                        //        dtotpage = parseInt(dtotdata) / parseInt(dpagesize);
                        //        if (parseInt(dtotdata) % parseInt(dpagesize) != 0) {
                        //            dtotpage = parseInt(dtotpage) + 1;
                        //        }
                        //        $("#dpagnumvalue").attr("max", dtotpage);
                        //    }
                        //    var dtfot = '';
                        //    dtfot += '<ul>'
                        //    dtfot += '<li>results <span>' + a.totRow + '</span>  <span id="dsotopage" style="display:none">' + dtotpage + '</span></li>'
                        //    dtfot += '<li><span>|</span></li>'
                        //    dtfot += '<li>pages ' + dpageindex + '/ ' + parseInt(dtotpage) + '</li>'
                        //    dtfot += '<li><span>|</span></li>'
                        //    dtfot += '<li ><input type="number" id="dpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="dgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    if (a.totRow <= dlength) {
                        //    }
                        //    else if (dpageno == 1) {
                        //    }
                        //    else if (dpageno == dtotpage) {
                        //        dtfot += '<li><span><a id="dpaginate"  title="Previous Page" href="javascript:void()" index="' + dpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + dfirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        dtfot += '<li><span><a id="dpaginate"  title="Previous Page" href="javascript:void()" index="' + dpprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + dfirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (dpageno < dtotpage) {
                        //        dtfot += '<a  id="dpaginate" title="Next Page" href="javascript:void()" index="' + dpnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    $("#dtfooter").html(dtfot);
                    }
                    var dAssignBycolor = "";
                    var dAssignTocolor = "";
                    var dClientName = a.ClientName;
                    if (dClientName == "null" || dClientName == null) {
                        dClientName = "";
                    }
                    var dCaseName = a.CaseName;
                    var dAssignBy = a.AssignBy;
                    var dAssignTo = a.AssignTo;
                    var dAssignBy = a.AssignBy;
                    if (dAssignTo == "ME") {
                        var dAssignTocolor = "#069";
                    }
                    else {
                        var dAssignTocolor = "maroon";
                    }
                    var dAssignBy = a.AssignBy;
                    if (dAssignBy == "ME") {
                        dAssignBycolor = "#069";
                    }
                    else {
                        var dAssignBycolor = "maroon";
                    }
                    var dremindercolor = a.ReminderSentCount == "0" ? "" : "color:0ec60e";
                    var dremindercontent = (a.ReminderSentContent == null || a.ReminderSentContent == "null" || a.ReminderSentContent == "") ? "Click here to send reminder for overdue task" : a.ReminderSentContent;
                    dhtml3 += '<tr>'
                    dhtml3 += '<td class="overddate"><span>' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    dhtml3 += '<td class="overdtask"><span>' + a.TaskName + '</span></td>'
                    dhtml3 += '<td class="overdclient">'
                    dhtml3 += '<div style="float:left">'
                    dhtml3 += '<span id="clname" class="LoginId" style="cursor: pointer; color: #069" data-id="' + a.ClientId + '">' + dClientName + '</span><br>'
                    dhtml3 += '</div>'
                    dhtml3 += '</td>'
                    dhtml3 += '<td class="overdmatters Border_freeze"><div class="freeze-text" id="caseid" style="cursor: pointer;" sno="' + a.CaseId + '">' + dCaseName + '</div></td>'
                    if (a.TDetails == "" || a.TDetails == null || a.TDetails == "null") {
                        dhtml3 += '<td class="overdnote"  scope="row">&nbsp;</td>'
                    }
                    else {
                        if (a.TDetails.length > 60) {
                            dhtml3 += '<td class="overdnote"><span class="comment more" style="">' + a.TDetails.substring(0, 60) + '</span>'
                            dhtml3 += '<span data-toggle="collapse" data-target="#dt' + dctq + '" style="color:#069;cursor:pointer"> more</span>'
                            dhtml3 += ' <div id="dt' + dctq + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            dhtml3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dt' + dctq + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                            dhtml3 += '' + a.TDetails + ''
                            dhtml3 += '</div>'
                            dhtml3 += '</td>'
                        }
                        else {
                            dhtml3 += '<td class="overdnote"><span class="comment more" style="">' + a.TDetails + '</span></td>'
                        }
                    }
                    dhtml3 += '<td class="overdassignby">'
                    dhtml3 += '<span id="clname" > ' + dAssignBy + '</span></td>'
                    dhtml3 += '<td  class="overdassignto"><span > ' + dAssignTo + '</span></td>'
                    dhtml3 += '</td>'
                    if (a.ActionByDate == "" || a.TaskModifyDate == null || a.TaskModifyDate == "null") {
                        dhtml3 += '<td scope="row"  class=""overdassigee></td>'
                    }
                    else {
                        const dueDate = new Date(a.TaskModifyDate);
                        const today = new Date();
                        const diffTime = dueDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        let dueMessage = '';

                        if (diffDays > 0) {
                            dueMessage = `<br><span style='color: green;'>${diffDays} day${diffDays > 1 ? 's' : ''} to go</span>`;
                        } else if (diffDays < 0) {
                            dueMessage = `<br><span style='color: red;'>${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue</span>`;
                        } else {
                            dueMessage = `<br><span style='color: orange;'>Due today</span>`;
                        }

                        dhtml3 += '<td class="overdassigee" >' +
                            formatDatetoIST(a.TaskModifyDate) + dueMessage + '</td>';
                    //    dhtml3 += '<td scope="row"  class="overdassigee"><span class="text-success">' + formatDatetoIST(a.TaskModifyDate) + '</span></td>'
                    }
                    const dueDate1 = new Date(a.TaskDueDate);
                    const today1 = new Date();
                    const diffTime1 = dueDate1.getTime() - today1.getTime();
                    const diffDays1 = Math.ceil(diffTime1 / (1000 * 60 * 60 * 24));

                    let dueMessage1 = '';

                    if (diffDays1 > 0) {
                        dueMessage1 = `<br><span style='color: green;'>${diffDays1} day${diffDays1 > 1 ? 's' : ''} to go</span>`;
                    } else if (diffDays1 < 0) {
                        dueMessage1 = `<br><span style='color: red;'>${Math.abs(diffDays1)} day${Math.abs(diffDays1) > 1 ? 's' : ''} overdue</span>`;
                    } else {
                        dueMessage1 = `<br><span style='color: orange;'>Due today</span>`;
                    }

                    dhtml3 += '<td class="overdassignoer" >' +
                        formatDatetoIST(a.TaskDueDate) + dueMessage1 + '</td>';


                    //dhtml3 += '<td  class="overdassignoer">' + formatDatetoIST(a.TaskDueDate) + '</td>'
                    if (a.UserId == userid && a.AssignUser == userid) {
                        dhtml3 += '<td style="white-space: nowrap;" ><ul class="table_action"><li><button type="button"  class="taskoutboxbtnicon" title="Click here to mark  status for Task completed." data-id="' + a.Tid + '" id="dueaction"><img src="/newassets/img/right_tig.svg"></button></li>' +
                            '<li><button type="button"  class="taskoutboxbtnicon" title="Click here to Reject Overdue Task." data-id="' + a.Tid + '" id="dueactionReassign"><img style="padding:6.5px;" src="/newassets/img/rejecttaskcross.svg"></button></li>' +

                            '<li>' +
                            '<div class="dropdown">' +
                            '<button style="margin: 0 0 0 0;padding: 0 0 0 0;border: none;background: transparent;font - size: 18px;font - weight: bold; cursor: pointer;" class="dropdown-toggle" id="menu1" type="button" data-toggle="dropdown" title="More Action">' +
                            '<img src="/newassets/img/more-action.png" style="width: 30px;height: 28px;display: block;padding: 0;margin: 0;">' +
                            '</button>' +
                            '<ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">' +
                            '<li><button type="button" class="taskoutboxbtnicon" style="border: none !important;box-shadow: inherit;"   title="' + dremindercontent + '" val-data="' + a.Tid + '" val-task="' + a.TaskName + '" duedate="' + a.TaskDueDate + '" id="setremindoverdue"> <img src="/newassets/img/bell.svg">Send Reminder</button></li>' +
                            '<li><button type="button" class="taskoutboxbtnicon" style="border: none !important;box-shadow: inherit;" title="upload Attachment"  id="divduecompletetaskattach" task-id="' + dctq + '"  data-id="' + a.Tid + '" style="cursor:pointer;" class="collapsed"><img src="/newassets/img/docUpAtt.png">Attach Document</button></li>' +
                            '<li style="float:left;"><button type="button"  class="taskoutboxbtnicon" style="border: none !important;box-shadow: inherit;"  title="Documents" id="divduecompletetaskattach1" task-id="' + dctq + '"  data-id="' + a.Tid + '" > <img src="/newassets/img/file.svg">Document List</button></li>' +
                            '</ul>' +
                            '</div>' +
                            '</li>' +
                            ' </ul></td>';

                    }
                    else if (a.UserId != userid && a.AssignUser == userid) {
                        dhtml3 += '<td style="white-space: nowrap;"><ul class="table_action"><li><button type="button"  class="taskoutboxbtnicon" title="Click here to mark  status for Task completed." data-id="' + a.Tid + '" id="dueaction"><img src="/newassets/img/right_tig.svg"></button></li>' +
                            '<li style="float:left;"><button type="button"  class="taskoutboxbtnicon" title="Click here to Reject Overdue Task." data-id="' + a.Tid + '" id="dueactionReassign"><img style="padding:6px;" src="/newassets/img/cross.svg"></button></li>' +
                            '<li>' +
                            '<div class="dropdown">' +
                            '<button style="margin: 0 0 0 0;padding: 0 0 0 0;border: none;background: transparent;font - size: 18px;font - weight: bold; cursor: pointer;" class="dropdown-toggle" id="menu1" type="button" data-toggle="dropdown" title="More Action">' +
                            '<img src="/newassets/img/more-action.png" style="width: 30px;height: 28px;display: block;padding: 0;margin: 0;">' +
                            '</button>' +
                            '<ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">' +
                            //'<li><button type="button" class="taskoutboxbtnicon" style="border: none !important;box-shadow: inherit;" title="upload Attachment"  id="divduecompletetaskattach" task-id="' + dctq + '"  data-id="' + a.Tid + '" style="cursor:pointer;" class="collapsed"> <img src="/newassets/img/atchDoc.png">Attach Document</button></li>' +
                            '<li><button type="button" class="taskoutboxbtnicon" style="border: none !important;box-shadow: inherit;" title="upload Attachment"  id="divduecompletetaskattach" task-id="' + dctq + '"  data-id="' + a.Tid + '" style="cursor:pointer;" class="collapsed"> <img src="/newassets/img/docUpAtt.png">Attach Document</button></li>' +
                            '<li style="float:left;"><button type="button"  class="taskoutboxbtnicon" style="border: none !important;box-shadow: inherit;"  title="Documents" id="divduecompletetaskattach1" task-id="' + dctq + '"  data-id="' + a.Tid + '" > <img src="/newassets/img/folder.svg">Document List</button></li>' +
                            '</ul>' +
                            '</div>' +
                            '</li>' +
                            ' </ul></td>';
                            '</td>'
                    }
                    else {
                        dhtml3 += '<td style="white-space: nowrap;">'
                        dhtml3 += '<ul class="table_action"><li><button type="button" class="taskoutboxbtnicon" title="' + dremindercontent + '" val-data="' + a.Tid + '" val-task="' + a.TaskName + '" duedate="' + a.TaskDueDate + '" id="setremindoverdue"> <img src="/newassets/img/bell.svg"> </button></li>';
                        dhtml3 += '<li style="float:left;"><button type="button"  class="taskoutboxbtnicon"  title="Documents" id="divduecompletetaskattach1"  data-id="' + a.Tid + '" > <img src="/newassets/img/folder.svg"></button></li></ul>'
                        dhtml3 += '</td>'
                    }
                    dhtml3 += '</td>'
                    //if (a.DocsCount > 0) {
                    //    dhtml3 += '<td  class="overdattach"><span style="cursor:pointer; text-align:center;" id-val="' + a.Tid + '" id="filelink"><i class="glyphicon glyphicon-folder-open"></i></span></td>'
                    //}
                    //else {
                    //    dhtml3 += '<td  class="overdattach"></td>';
                    //}
                    //if (a.CompleteDocsCount > 0) {
                    //    dhtml3 += '<td  class="overdfattach"><span style="cursor:pointer; text-align:center;" id-val="' + a.Tid + '" id="completetaskfilelink"><i class="glyphicon glyphicon-folder-open"></i></span></td>'
                    //}
                    //else {
                    //    dhtml3 += '<td  class="overdfattach"></td>';
                    //}
                    if (a.TaskSubject == "" || a.TaskSubject == null || a.TaskSubject == "null") {
                        dhtml3 += '<td class="otsubject" ></td>'
                    }
                    else {
                        dhtml3 += '<td class="osubject"><span>' + a.TaskSubject + '</span></td>'
                    }
                    dhtml3 += '</tr>'
                });
                $("#dbindcasetask").html("");
                $("#dbindcasetask").append(dhtml3);
            },
            failure: function (response1) {
                alert(response1.responseText);
            },
            error: function (response1) {
                alert(response1.responseText);
            }
        });
        $.when(overduefx).then(function (data, textStatus, jqXHR) {
            $("#overduelist li input:checkbox:not(:checked)").each(function () {
                var column = "#overduelists ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }

    //For New Paging
    /*Pagination Start*/
    var isRenderPage_Over = false;
    var totalPageRec = "";
    //function renderPagination_Over(dpageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = dpageindex;
    //    totalPageRec = totdata;
    //    let paginationHtml = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtml += `<button class="page-btn_ove ${i === dpageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (dpageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtml += `<button class="page-btn_ove ${i === dpageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtml += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtml += `<button class="page-btn_ove ${j === dpageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers_Over").html(paginationHtml);
    //    $("#prev_Over").toggleClass("disabled", pageindex === 1);
    //    $("#next_Over").toggleClass("disabled", pageindex === totdata);
    //    isRenderPage_Over = true;
    //}

    function renderPagination_Over(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btn_ove ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtml += `<button class="page-btn_ove ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

            let start = Math.max(2, pageindex - delta);
            let end = Math.min(totPages - 1, pageindex + delta);
            if (pageindex <= maxVisible) {
                start = 2;
                end = maxVisible;
            }

            if (pageindex >= totPages - maxVisible + 1) {
                start = totPages - maxVisible + 1;
                end = totPages - 1;
            }
            if (start > 2) paginationHtml += `<span class="dots">...</span>`;
            for (let i = start; i <= end; i++) {
                paginationHtml += `<button class="page-btn_ove ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
            paginationHtml += `<button class="page-btn_ove ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#pageNumbers_Over").html(paginationHtml);
        $("#prev_Over").toggleClass("disabled", pageindex === 1);
        $("#next_Over").toggleClass("disabled", pageindex === totPages);
        isRenderPage_Over = true;
    }

    var setPageNo = 1;
    //$(document).on("click", ".page-btn_ove", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage_Over = true;
    //    $("#txtgopage_Over").val("");
    //    dLoadTaskData(setPageNo);
    //    $(".page-btn_ove").removeClass("active");
    //    $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn_ove", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage_Over = false;
        $("#txtgopage_Over").val("");
        dLoadTaskData(setPageNo);
        $(".page-btn_ove").removeClass("active");
        $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#prev_Over").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_Over = true;
    //    $("#txtgopage_Over").val("");
    //    dLoadTaskData(setPageNo);
    //    $(".page-btn_ove").removeClass("active");
    //    $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev_Over").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage_Over = false;
        $("#txtgopage_Over").val("");
        //renderPagination(setPageNo, totalPageRec)
        dLoadTaskData(setPageNo);
        $(".page-btn_ove").removeClass("active");
        $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#next_Over").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_Over = true;
    //    $("#txtgopage_Over").val("");
    //    dLoadTaskData(setPageNo);
    //    $(".page-btn_ove").removeClass("active");
    //    $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next_Over").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage_Over = false;
        $("#txtgopage_Over").val("");
        dLoadTaskData(setPageNo);
        $(".page-btn_ove").removeClass("active");
        $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo_Over").click(function () {
    //    let goToPage = parseInt($("#txtgopage_Over").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage_Over = true;
    //    dLoadTaskData(setPageNo);
    //    $(".page-btn_ove").removeClass("active");
    //    $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#divGo_Over").click(function () {
        let goToPage = parseInt($("#txtgopage_Over").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
      loadflag = true;
        isRenderPage_Over = true;
        dLoadTaskData(setPageNo);
        $(".page-btn_ove").removeClass("active");
        $(".page-btn_ove[data-page='" + setPageNo + "']").addClass("active");
    });
    /*Pagination End*/
    ////////----------------- END DUE------------------///////
    ///////--------------Archive Task----------------//////////////
    var arowcount = 0;
    var apageindex = 1, apagesize = 10, arecordcount = 0, atotrecord = 0;
    $(document).on('click', '#ogetdatabypagenumarchive', function () {
        dpageindex = $("#opagnumvaluearchive").val();
        if (dpageindex != "undefined") {
            if (Math.sign(dpageindex) == 1) {
                var dpageindesx = $("#sotopagearchive").text();
                if (dpageindex <= parseInt(dpageindesx)) {
                    oLoadTaskArchiveData(dpageindex);
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
    $(document).on('click', '#dpaginatearchive', function () {
        dpageindex = $(this).attr("index");
        oLoadTaskArchiveData(dpageindex);
    });
    $("#dcleardatearchive").click(function () {
        $("#ofilterdatearchive").val("");
        $("#dcleardatearchive").css("display", "none");
        oLoadTaskArchiveData(1);
    })
    $("#ofilterdatearchive").change(function () {
        $("#dcleardatearchive").css("display", "block");
        oLoadTaskArchiveData(1);
    })
    $("#ofiltertaskarchive").change(function () {
        oLoadTaskArchiveData(1);
    })
    $("#afilterclient").change(function () {
        loadmatter($(this).val(), "afiltercasescheduler");
        oLoadTaskArchiveData(1);
    })
    $("#clearnewsearchcaseaf").click(function () {
        $("#afiltercasescheduler").val("");
        $("#clearnewsearchcaseaf").css("display", "none");
        oLoadTaskArchiveData(1);
    })
    $("#searchdatasaf").click(function () {
        var casefiltercasename = $("#afiltercasescheduler").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#afiltercasescheduler").focus();
            return false;
        }
        $("#clearnewsearchcaseaf").css("display", "unset")
        oLoadTaskArchiveData(1);
    });
    $("#afiltertdate").change(function () {
        oLoadTaskArchiveData(1);
        $("#adatecleardate").css("display", "block");
    })
    $("#afilterAcceptRejectBy").change(function () {
        oLoadTaskArchiveData(1);
        $("#aAcceptRejectBycleardate").css("display", "block");
    })
    $("#afilterduedate").change(function () {
        oLoadTaskArchiveData(1);
        $("#aduecleardate").css("display", "block");
    })
    $("#afilteruserto").change(function () {
        oLoadTaskArchiveData(1);
    })
    $("#afilterStatus").change(function () {
        oLoadTaskArchiveData(1);
    })
    $("#adatecleardate").click(function () {
        $("#afiltertdate").val("");
        $("#adatecleardate").css("display", "none");
        oLoadTaskArchiveData(1);
    })
    $("#aAcceptRejectBycleardate").click(function () {
        $("#afilterAcceptRejectBy").val("");
        $("#aAcceptRejectBycleardate").css("display", "none");
        oLoadTaskArchiveData(1);
    })
    $("#aduecleardate").click(function () {
        $("#afilterduedate").val("");
        $("#aduecleardate").css("display", "none");
        oLoadTaskArchiveData(1);
    })
    /*Get archive task details*/
    function oLoadTaskArchiveData(apageindex) {
        $("#oarchivefooter ul").remove();
        var ohtml3 = '';
        var formData = new FormData();
        formData.append("pagenum", EncodeText(apageindex));
        formData.append("pagesize", EncodeText(apagesize));
        formData.append("datefilter", EncodeText($("#afilterduedate").val()));
        formData.append("filtertask", EncodeText($("#ofiltertaskarchive").val()));
        formData.append("filterclient", EncodeText($("#afilterclient").val()));
        formData.append("afiltertdate", EncodeText($("#afiltertdate").val()));
        formData.append("afilterAcceptRejectBy", EncodeText($("#afilterAcceptRejectBy").val()));
        formData.append("afilteruserto", EncodeText($("#afilteruserto").val()));
        formData.append("afilterStatus", EncodeText($("#afilterStatus").val()));
        formData.append("afiltercasescheduler", EncodeText($("#afiltercasescheduler").val()));
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskArchiveList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#archivedataescstatus").hide();
                    $("#archivePagination").show();
                    //$("#oarchivedatastatus").html("");
                }
                else {
                    //$("#oarchivedatastatus").html("No result found !");
                    $("#archivedataescstatus").show();
                    $("#archivePagination").hide();
                    closeload();
                }
                var sictq = 0;
                var alength = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    sictq = sictq + 1;
                    arowcount = 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    $('#archiveboxevt').text(a.totRow);
                    if (i === (alength - 1)) {
                        totpage = parseInt(totdata) / parseInt(apagesize);
                        if (parseInt(totdata) % parseInt(apagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (apageindex == totpage) {
                            $('#next_Arch').hide();
                            $('#prev_Arch').css("display", "block");
                        }
                        else {
                            $('#next_Arch').css("display", "block");
                        }
                        if (apageindex == 1) {
                            $('#prev_Arch').css("display", "none");
                        }
                        else {
                            $('#prev_Arch').css("display", "block");
                        }

                        if (isRenderPage_Arch == false) {
                            renderPagination_Arch(apageindex, totpage);
                        }
                        //if (i === 0) {
                        //    afirstvalue = a.rownum;
                        //}
                        //if (i === (alength - 1)) {
                        //    var apnext = apageindex;
                        //    var apprev = apageindex;
                        //    var apageno = apageindex;
                        //    var atotdata = a.totRow;
                        //    var atotpage = 0;
                        //    if (a.totRow > 0) {
                        //        apnext = parseInt(apnext) + 1;
                        //        if (apnext == 0) apnext = 1;
                        //        apprev = parseInt(apageno) - 1;
                        //        if (apprev == 0) apprev = 1;
                        //        atotpage = parseInt(atotdata) / parseInt(apagesize);
                        //        if (parseInt(atotdata) % parseInt(apagesize) != 0) {
                        //            atotpage = parseInt(atotpage) + 1;
                        //        }
                        //        $("#opagnumvaluearchive").attr("max", atotpage);
                        //    }
                        //    var atfot = '';
                        //    var atfot = '';
                        //    atfot += '<ul>'
                        //    atfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopagearchive" style="display:none">' + atotpage + '</span></li>'
                        //    atfot += '<li><span>|</span></li>'
                        //    atfot += '<li>pages ' + apageindex + '/ ' + parseInt(atotpage) + '</li>'
                        //    atfot += '<li><span>|</span></li>'
                        //    atfot += '<li ><input type="number" id="opagnumvaluearchive" min="1"  class="footerInput"><a class="gobtn" type="button" id="ogetdatabypagenumarchive" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    if (a.totRow <= alength) {
                        //    }
                        //    else if (apageno == 1) {
                        //    }
                        //    else if (apageno == atotpage) {
                        //        atfot += '<li><span><a id="opaginatearchive"  title="Previous Page" href="javascript:void()" index="' + apprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + afirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        atfot += '<li><span><a id="opaginatearchive"  title="Previous Page" href="javascript:void()" index="' + apprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + afirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (apageno < atotpage) {
                        //        atfot += '<a  id="opaginatearchive" title="Next Page" href="javascript:void()" index="' + apnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    $("#oarchivefooter").html(atfot);
                    }
                    var oAssignBycolor = "";
                    var oAssignTocolor = "";
                    var oClientName = a.ClientName;
                    if (oClientName == "null" || oClientName == null) {
                        oClientName = "";
                    }
                    var oCaseName = a.CaseName;
                    var oAssignBy = a.AssignBy;
                    var oAssignTo = a.AssignTo;
                    var oAssignBy = a.AssignBy;
                    if (oAssignTo == "ME") {
                        var oAssignTocolor = "#069";
                    }
                    else {
                        var oAssignTocolor = "maroon";
                    }
                    var oAssignBy = a.AssignBy;
                    if (oAssignBy == "ME") {
                        oAssignBycolor = "#069";
                    }
                    else {
                        var oAssignBycolor = "maroon";
                    }
                    var duerowcss = "";
                    if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                    }
                    ohtml3 += '<tr>'
                    ohtml3 += '<td style="' + duerowcss + '"><span>' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    ohtml3 += '<td class="ttask" style="' + duerowcss + '"><span>' + a.TaskName + '</span></td>'
                    ohtml3 += '<td class="oclient" style="' + duerowcss + '">'
                    ohtml3 += '<div style="float:left">'
                    ohtml3 += '<span id="clname" class="LoginId"   style="cursor: pointer; color: #069" data-id="' + a.ClientId + '">' + oClientName + '</span>'
                    ohtml3 += '</div>'
                    ohtml3 += '</td>'
                    if (oCaseName == "null" || oCaseName == null || oCaseName == "") {
                        ohtml3 += '<td class="tcase" ><span>' + oCaseName + '</span></td>'
                    }
                    else {
                        ohtml3 += '<td class="tcase Border_freeze" id="caseid" style="' + duerowcss + ';cursor: pointer;" sno="' + a.CaseId + '"><div class="freeze-text">' + oCaseName + '</div></td>'
                    }
                    if (a.TDetails == "" || a.TDetails == null || a.TDetails == "null") {
                        ohtml3 += '<td class="tbrief" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        if (a.TDetails.length > 60) {
                            ohtml3 += '<td class="tbrief"><span class="comment more" style="">' + a.TDetails.substring(0, 60) + '</span>'
                            ohtml3 += '<span data-toggle="collapse" data-target="#dtm' + sictq + '" style="color:#069;cursor:pointer"> more</span>'
                            ohtml3 += ' <div id="dtm' + sictq + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            ohtml3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtm' + sictq + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                            ohtml3 += '' + a.TDetails + ''
                            ohtml3 += '</div>'
                            ohtml3 += '</td>'
                        }
                        else {
                            ohtml3 += '<td class="tbrief"><span class="comment more" style="">' + a.TDetails + '</span></td>'
                        }
                    }
                    ohtml3 += '<td class="tassigntoby" style="' + duerowcss + '">'
                    ohtml3 += '<span id="clname"> ' + oAssignBy + '</span></td>'
                    ohtml3 += '<td class="tassigntoby" style="' + duerowcss + '"><span > ' + oAssignTo + '</span>'
                    ohtml3 += '</td>'
                    if (a.ActionByDate == "" || a.ActionByDate == null || a.ActionByDate == "null") {
                        ohtml3 += '<td class="ttimearchive" scope="row" style="' + duerowcss + '"></td>'
                    }
                    else {
                        ohtml3 += '<td class="ttimearchive" scope="row" style="' + duerowcss + '"><span class="text-success">' + formatDatetoIST(a.ActionByDate) + '</span></td>'
                    }
                    ohtml3 += '<td class="tduedate" style="' + duerowcss + '">' + formatDatetoIST(a.TaskDueDate) + '</td>'
                    ohtml3 += '<td class="archivedate" style="' + duerowcss + '">' + (a.ArchiveDate == null ? " " : formatDatetoIST(a.ArchiveDate)) + '</td>'
                    if (a.AssignTaskStatus == "Rejected") {
                        ohtml3 += '<td style="' + duerowcss + '"><div class="status_badge"><span class="rejected_badge" title="' + a.RejectDetails + '"></span> ' + a.AssignTaskStatus + '</div> </td>';
                        ohtml3 += '</td>'
                    }
                    else {
                        ohtml3 += '<td><div class="status_badge"><span class="inprogress_badge"></span>' + a.AssignTaskStatus + '</div> </td>';
                        ohtml3 += '</td>'
                    }
                    ohtml3 += '<td style="' + duerowcss + '"> <ul class="table_action"><li> <button type="button" style="" class="taskoutboxbtnicon" title="Click here to unarchive task" val-data="' + a.Tid + '" id="unarchivetask"><img src="/newassets/img/archive.svg" id="removetask1" /></button> </li> <li><button class="taskoutboxbtnicon" title="Delete" data-toggle="tab" href="#" id="delArchive" val-data=' + a.Tid + '> <img src="/newassets/img/delete.svg">  </button></li></ul></td>'
                    ohtml3 += '</tr>'
                });
                $("#obindarchive").html("");
                $("#obindarchive").append(ohtml3);
            },
            failure: function (response1) {
                alert(response1.responseText);
            },
            error: function (response1) {
                alert(response1.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            //$("input:checkbox:not(:checked)").each(function () {
            //    var column = "table ." + $(this).attr("name");
            //    $(column).hide();
            //});
            $("#od li input:checkbox:not(:checked)").each(function () {
                var column = "#archiTable ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }





    //For New Paging
    /*Pagination Start*/

    //function renderPagination_Arch(apageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = apageindex;
    //    totalPageRec = totdata;
    //    let paginationHtml = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtml += `<button class="page-btn_Arch ${i === apageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (apageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtml += `<button class="page-btn_Arch ${i === apageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtml += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtml += `<button class="page-btn_Arch ${j === apageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers_Arch").html(paginationHtml);
    //    $("#prev_Arch").toggleClass("disabled", pageindex === 1);
    //    $("#next_Arch").toggleClass("disabled", pageindex === totdata);
    //    isRenderPage_Arch = true;
    //}
    var isRenderPage_Arch = false;
    var totalPageRec = "";
    function renderPagination_Arch(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

            let start = Math.max(2, pageindex - delta);
            let end = Math.min(totPages - 1, pageindex + delta);
            if (pageindex <= maxVisible) {
                start = 2;
                end = maxVisible;
            }

            if (pageindex >= totPages - maxVisible + 1) {
                start = totPages - maxVisible + 1;
                end = totPages - 1;
            }
            if (start > 2) paginationHtml += `<span class="dots">...</span>`;
            for (let i = start; i <= end; i++) {
                paginationHtml += `<button class="page-btn_Arch  ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
            paginationHtml += `<button class="page-btn_Arch  ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#pageNumbers_Arch").html(paginationHtml);
        $("#prev_Arch").toggleClass("disabled", pageindex === 1);
        $("#next_Arch").toggleClass("disabled", pageindex === totPages);
        isRenderPage_Arch = true;
    }


    var setPageNo = 1;
    //$(document).on("click", ".page-btn_Arch", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage_Arch = true;
    //    $("#txtgopage_Arch").val("");
    //    oLoadTaskArchiveData(setPageNo);
    //    $(".page-btn_Arch").removeClass("active");
    //    $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    //});


    $(document).on("click", ".page-btn_Arch", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage_Arch = false;
        $("#txtgopage_Arch").val("");
        oLoadTaskArchiveData(setPageNo);
        $(".page-btn_Arch").removeClass("active");
        $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#prev_Arch").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_Arch = true;
    //    $("#txtgopage_Arch").val("");
    //    oLoadTaskArchiveData(setPageNo);
    //    $(".page-btn_Arch").removeClass("active");
    //    $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev_Arch").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage_Arch = false;
        $("#txtgopage_Arch").val("");
        //renderPagination(setPageNo, totalPageRec)
        oLoadTaskArchiveData(setPageNo);
        $(".page-btn_Arch").removeClass("active");
        $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    });



    //$("#next_Arch").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage_Arch = true;
    //    $("#txtgopage_Arch").val("");
    //    oLoadTaskArchiveData(setPageNo);
    //    $(".page-btn_Arch").removeClass("active");
    //    $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next_Arch").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage_Arch = false;
        $("#txtgopage_Arch").val("");
        oLoadTaskArchiveData(setPageNo);
        $(".page-btn_Arch").removeClass("active");
        $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    });


    //$("#divGo_Arch").click(function () {
    //    let goToPage = parseInt($("#txtgopage_Arch").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage_Arch = true;
    //    oLoadTaskArchiveData(setPageNo);
    //    $(".page-btn_Arch").removeClass("active");
    //    $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#divGo_Arch").click(function () {
        let goToPage = parseInt($("#txtgopage_Arch").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage_Arch = false;
        oLoadTaskArchiveData(setPageNo);
        $(".page-btn_Arch").removeClass("active");
        $(".page-btn_Arch[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
    ///////----------------------END Archive Task///////////////////
    ///////------------------Chart Section Start here---//////    
    function Assignto() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/ScheduleTaskAssignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    alert(a["AssignUser"]);
                    var option = '<option value="' + a["AssignUser"] + '" > ' + a["UserId"] + ' (' + a["RoleName"] + ')</option>';
                    $("#ofilteruserscheduleto").append(option);
                });
                //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    }
    Assignto();
    $(document).on("click", "#filelinkdue", function () {
        openload();
        var fileid = globalToken;
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=task&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#modalShowDocumentFileDocumentOverDue').modal('hide');
            $('#myModal').modal({ show: true });
        });
    });
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=task&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    if (String(isglobalsearch) != "") {
        if (isFiltermoduleGlobal == "Archive") {
            oLoadTaskArchiveData(apageindex);
            $("#a_taskarchive").click();
        }
        else if (isFiltermoduleGlobal == "Outbox") {
            oLoadTaskData(opageindex);
            $("#a_taskoutbox").click();
        }
        else if (isFiltermoduleGlobal == "Inbox") {
            iLoadTaskData(ipageindex);
            $("#a_taskinbox").click();
        }
        else {
            $("#frange").click();
            $("#prangediv").show();
            fromdatefilter = new Date(isFilterdateGlobal).toISOString().substring(0, 10);
            todatefilter = new Date(isFilterdateGlobal).toISOString().substring(0, 10);
            $("#rangesearchfrom").val(fromdatefilter);
            $("#rangesearchto").val(todatefilter);
            LoadTaskData(pageindex, curtab);
        }
    }
    else {
        iLoadTaskData(1);
    }



});

$(document).on("click", "#cusnewtaskreq", function () {
    $('#modaltaskrequestcus').modal('show');
});
$(document).on("click", "#custasklist", function () {
    $('#modalmytask').modal('show');
});
$(document).on("click", "#cusoverdue", function () {
    $('#modaloverdue').modal('show');
});
$(document).on("click", "#cusoutgoingtask", function () {
    $('#modaloutgoingtask').modal('show');
});
$(document).on("click", "#cusarchived", function () {
    $('#modalArchivetask').modal('show');
});
var globalToken = "";
$(document).on("click", "#unarchivetask", function () {
    globalToken = $(this).attr("val-data");
    $('#myModalmarkArchiveconfirmation').modal('show');
});

$(document).on("click", "#delArchive", function () {
    globalToken = $(this).attr("val-data");
    $('#myModalmarkDelete').modal('show');
});

//$(document).on("click", "#removetask", function () {
$(document).on("click", "#deletetask", function () {
    globalToken = $(this).attr("val-data");
    $('#myModalmarkArchiveconfirmationOutgoing').modal('show');
});


$(document).on("click", "#divduecompletetaskattach1", function () {
    globalToken = $(this).attr("data-id");
    //srnotemp = $(this).attr("task-id");
    $('#modalShowDocumentFileDocumentOverDue').modal('show');
});

var srnotemp
$(document).on("click", "#divduecompletetaskattach", function () {
    globalToken = $(this).attr("data-id");
    srnotemp = $(this).attr("task-id");
    $('#modalUploadDocumentDue').modal('show');
    $('#modalUploadDocumentDue').on('shown.bs.modal', function () {
        // Target the specific row/element to update
        let $li = $('li[id^="browsefileduecompletetask"]');

        // Step 3: Update the id and module with current srnotemp
        if ($li.length) {
            $li.attr('id', 'browsefileduecompletetask' + srnotemp);
            $li.attr('module', 'duecompletetask' + srnotemp);
        }
    });
});


var taskIdtemp = "";
var tempType = "";
//$('#myOverlay').css("display", "block");

function openStatusUpdateButton(taskId, type) {
    taskIdtemp = taskId;
    tempType = type;
    $("#inboxacceptdate").val(""); // Clears a date input
    $("#rdetailsval").val("");

    if (type == "1") {
        $("#textLabel").html("Accept Task");
        $('#RejectSection').css("display", "none");

        $('#acceptSection').css("display", "block");

        $("#saveclosuedate").html("Accept Task");


    }
    else if (type == "2") {
        $("#textLabel").html("Reject Task");
        $('#acceptSection').css("display", "none");

        $('#RejectSection').css("display", "block");
        $("#saveclosuedate").html("Reject Task");

    }
    else {
        $("#ActualclosurModal").modal('hide');

    }
    $("#ActualclosurModal").modal('show');

}


function AcceptandRejectRequestTask() {
    var acceptDate = $("#inboxacceptdate").val();
    var rdetails = $("#rdetailsval").val();
    var type = "";
    if (tempType == "1") {
        rdetails = "";
        type = "A"
        if (acceptDate == null || acceptDate == undefined || acceptDate == "") {
            alert("Please select the Deadline date.")
            return;
        }
    }
    else if (tempType == "2") {
        if (rdetails == null || rdetails == undefined || rdetails == "") {
            alert("Please enter the reason.")
            return;
        }
        acceptDate = "";
        type = "R"
    }
    var formData = new FormData();
    formData.append("tokenid", taskIdtemp);
    formData.append("RequestType", EncodeText(type));
    formData.append("acceptdate", EncodeText(acceptDate));
    formData.append("rejectdetails", EncodeText(rdetails));
    formData.append("inboxstartdate", EncodeText(""));
    formData.append("inboxenddate", EncodeText(""));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CallApi/AcceptRejectInbox",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (parseInt(response1.Data) > 0) {
                if (type == "1") {
                    alert("The task has been accepted successfully.");

                }
                else if (type == "2") {
                    alert("The task has been rejected successfully.");

                }
                //$("#inacptdiv" + idatatemp).show();
                //$("#inacrjtdiv" + idatatemp).hide();
                location.reload();
            }
            $("#ActualclosurModal").modal('hide');
        },
        failure: function (data) {
            $("#ActualclosurModal").modal('hide');

            alert(data.responseText);
        },
        error: function (data) {
            $("#ActualclosurModal").modal('hide');
            alert(data.responseText);
        }
    });
}

function uploadDocuments() {
    var tokenid = tempTokenId;
    var result = confirm("Are you sure to save attachment?");
    if (result) {
        var formData = new FormData();
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("attachmenttask4").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachmenttask4").files[i];
            var filename = file.name;
            var fileNameIndex = filename.lastIndexOf("/") + 1;
            var dotIndex = filename.lastIndexOf('.');
            var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
            var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
            if (reg.test(newfioename) == true) {
                alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                return false;
            }
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
        formData.append("token", tokenid);
        formData.append("savemykasefileid", EncodeText($("#mykasefileidcompletetask" + globalFileId).val()));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SaveAttachmentCompleteTask",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                //alert(response1.Data);
                if (response1.Data.Result == 1) {
                    var InfectFilesResult = "";
                    if (response1.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response1.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    new PNotify({
                        title: 'Success!',
                        text: 'This has been saved successfully.</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    $("#modalUoploadDocument").modal('hide');

                    closeload();
                    location.reload()

                }
                else if (String(response1.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    $("#modalUoploadDocument").modal('hide');

                    closeload();
                    return false;
                }
                else if (String(response1.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    $("#modalUoploadDocument").modal('hide');

                    closeload();
                    return false;
                }
                else {
                    alert("Please select the attachment.");
                    $("#attachmenttask" + srno).focus();
                    $("#modalUoploadDocument").modal('hide');

                    closeload();
                    return false;
                }
            },
            failure: function (response1) {
                alert(response1.responseText);
                closeload();
            },
            error: function (response1) {
                alert(response1.responseText);
                closeload();
            }
        });
    }
}


function triggerFileInput() {
    document.getElementById('attachmenttask4').click();
}
var tempTokenId = "";
var globalFileId = ""
function uploadDocument(id, row) {
    tempTokenId = id;
    globalFileId = row;
    let $btn = $('button[id^="browsefilecompletetask"]');

    if ($btn.length) {
        $btn.attr('id', 'browsefilecompletetask' + globalFileId);
        $btn.attr('module', 'completetask' + globalFileId);
    }
    $("#modalUoploadDocument").modal('show');

}

var fileTokenId = "";
function openFolderFile(tokenId) {
    fileTokenId = tokenId;
    $("#modalShowDocumentFileDocument").modal('show');
}
//$(document).on("click", "#closemodels", function () {
//    fileTokenId = globalToken;
//    $("#modalShowDocumentFileDocument").modal('show');
//})
//$(document).on("click", "#closetaskmodel", function () {
//    $("#modalShowDocumentFileDocument").modal('show');
//})

function OpenAttachFile() {
    $("#modalShowDocumentFileDocument").modal('hide');
    openload();
    var fileid = fileTokenId;
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=task&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        closeload();
        $('#myModal').modal({ show: true });
        //$('#closemodels').text('Back');
    });
}

function FinalAttachFile() {
    openload();
    $("#modalShowDocumentFileDocument").modal('hide');

    var fileid = fileTokenId;
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=completetask&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        closeload();
        $('#myModal').modal({ show: true });
        //$('#closemodels').text('Back');
    });
}
function triggerFileInput1() {
    document.getElementById('dueattachmenttask2').click();
}