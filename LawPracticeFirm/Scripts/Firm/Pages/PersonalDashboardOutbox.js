$(document).ready(function () {
    var orowcount = 0;
    var opageindex = 1, opagesize = 3, orecordcount = 0, ototrecord = 0;
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
    $(document).on('click', '#opaginate', function () {
        opageindex = $(this).attr("index");
        oLoadTaskData(opageindex);
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var otarget = $(e.target).attr("href") // activated tab
        if (otarget == "#outboxtab") {
            if (orowcount == 0) {
                oLoadTaskData(opageindex);
            }
        }
    });
    $("#ocleardate").click(function () {
        $("#ofilterdate").val("");
        $("#ocleardate").css("display", "none");
        oLoadTaskData(1);
    })
    $("#ofilterdate").change(function () {
        $("#ocleardate").css("display", "block");
        oLoadTaskData(1);
    })
    $("#ofiltertask").change(function () {
        oLoadTaskData(1);
    })
    $("#ofilterclient").change(function () {
        oLoadTaskData(1);
    })
    /* Get Personal Dashboard Outbox Case Task List*/
    function oLoadTaskData(opageindex) {
        $("#otfooter").html("");
        $("#obindcasetask").html("");
        var ohtml3 = '';
        var formData = new FormData();
        formData.append("pagenum", opageindex);
        formData.append("pagesize", opagesize);
        formData.append("datefilter", $("#ofilterdate").val());
        formData.append("filtertask", $("#ofiltertask").val());
        formData.append("filterclient", $("#ofilterclient").val());
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskOutboxList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#odataescstatus").html("");
                }
                else {
                    $("#odataescstatus").html("No result found !");
                    closeload();
                }
                var olength = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    orowcount = 1;
                    if (i === 0) {
                        ofirstvalue = a.rownum;
                    }
                    if (i === (olength - 1)) {
                        var opnext = opageindex;
                        var opprev = opageindex;
                        var opageno = opageindex;
                        var ototdata = a.totRow;
                        var ototpage = 0;
                        if (a.totRow > 0) {
                            opnext = parseInt(opnext) + 1;
                            if (opnext == 0) opnext = 1;
                            opprev = parseInt(opageno) - 1;
                            if (opprev == 0) opprev = 1;
                            ototpage = parseInt(ototdata) / parseInt(opagesize);
                            if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                                ototpage = parseInt(ototpage) + 1;
                            }
                            $("#opagnumvalue").attr("max", ototpage);
                        }
                        var otfot = '';
                        otfot += '<table style="width:100%;background:#dddddd !important;"><tr><td colspan = "12">'
                        otfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + opageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(ototpage) + '</span> Pages</b>'
                        otfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + ofirstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                        otfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="opagnumvalue" min="1"  style="width: 30px;"><button type="button" id="ogetdatabypagenum" style="margin-left:10px;">Go</button>'
                        otfot += '</div>'
                        otfot += '<div style="float:right;">'
                        if (a.totRow <= olength) {
                        }
                        else if (opageno == 1) {
                        }
                        else if (opageno == ototpage) {
                            otfot += '<a id="ipaginate" class="btn  btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + opprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            otfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + opprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (opageno < ototpage) {
                            otfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Next Page" href="javascript:void()" index="' + opnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        otfot += '</td >'
                        otfot += '</tr >'
                        $("#otfooter").append(otfot);
                    }
                    var oAssignBycolor = "";
                    var oAssignTocolor = "";
                    var oClientName = a.ClientName;
                    if (oClientName == "") {
                        oClientName = "Test Client";
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
                    ohtml3 += '<tr>'
                    ohtml3 += '<th scope="row"><span class="text-success">' + formatAMPM(a.TaskDueTime) + '</span></th>'
                    ohtml3 += '<td><span>' + a.TaskName + '</span></td>'
                    ohtml3 += '<td>'
                    ohtml3 += '<div style="float:left">'
                    ohtml3 += '<span id="clname" style="font-weight:bold;">' + oClientName + '</span><br>'
                    ohtml3 += '<span style="font-size:12px;">' + oCaseName + '</span>'
                    ohtml3 += '</div>'
                    ohtml3 += '<div style="float:right">'
                    ohtml3 += '<div class="btn-group">'
                    ohtml3 += '<button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                    ohtml3 += '<span class="caret"></span>'
                    ohtml3 += '<span class="sr-only">Toggle Dropdown</span>'
                    ohtml3 += '</button>'
                    ohtml3 += '<ul class="dropdown-menu">'
                    ohtml3 += '<li><a href="#">Case Dashboard</a></li>'
                    ohtml3 += '<li><a href="#">Case Activity Chain</a></li>'
                    ohtml3 += '<li><a href="#">Case Comunnication</a></li>'
                    ohtml3 += '<li><a href="#">Case Documentation</a></li>'
                    ohtml3 += '<li role="separator" class="divider"></li>'
                    ohtml3 += '<li><a href="#">Case Events & Calendar</a></li>'
                    ohtml3 += '</ul>'
                    ohtml3 += '</div>'
                    ohtml3 += '</div>'
                    ohtml3 += '</td>'
                    ohtml3 += '<td>'
                    ohtml3 += 'By: <span id="clname" style="font-size:11px;color:' + oAssignBycolor + ';font-weight:bold"> ' + oAssignBy + '</span><br>'
                    ohtml3 += 'To:<span style="font-size:11px;color:' + oAssignTocolor + ';font-weight:bold"> ' + oAssignTo + '</span>'
                    ohtml3 += '</td>'
                    ohtml3 += '<td>'
                    ohtml3 += '<button type="button" class="btn btn-mail btn-info" val-data="' + a.CaseId + '" id="opendocs"><i class="glyphicon glyphicon-folder-open"></i></button>'
                    ohtml3 += '</td>'
                    ohtml3 += '<td>' + formatDatetoIST(a.TaskDueDate) + '</td>'
                    if (a.AssignTaskStatus == "") {
                        ohtml3 += '<td><span style="font-weight:bold;" class="text-success">In Process</span></td>'
                    }
                    else if (a.AssignTaskStatus == "Rejected") {
                        ohtml3 += '<td><span style="font-weight:bold;" class="text-danger">' + a.AssignTaskStatus + '</span> <button type="button" style="margin-left:5px" class="btn btn-warning btn-sm" title="Click here to Re-assign task" val-data="' + a.Tid + '" id="outboxaction"><i class="glyphicon  glyphicon glyphicon-share"></i></button></td>'
                    }
                    ohtml3 += '</td>'
                    ohtml3 += '</tr>'
                });
                $("#obindcasetask").append(ohtml3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    function formatAMPM(time) {
        var res = time.split(":");
        var hours = res[0];
        var minutes = res[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        hours = hours < 10 ? '0' + hours : hours;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    function formatDatetoIST(date) {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear()
        return formatted_date;
    }
    function checkdatetimecustomdt(date) {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear() + " / " + addZero(current_datetime.getHours()) + ":" + addZero(current_datetime.getMinutes()) + ":" + addZero(current_datetime.getSeconds())
        return formatted_date;
    }
});