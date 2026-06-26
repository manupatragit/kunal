$(document).ready(function () {
    var drowcount = 0;
    var dpageindex = 1, dpagesize = 3, drecordcount = 0, dtotrecord = 0;
    var dsearchflag = false;
    var dchckfilter = false;
    var dtempexcel = false;
    $(document).on('click', '#dgetdatabypagenum', function () {
        dpageindex = $("#dpagnumvalue").val();
        if (dpageindex != "undefined") {
            if (Math.sign(dpageindex) == 1) {
                var dpageindesx = $("#osotopage").text();
                if (dpageindex <= parseInt(dpageindesx)) {
                    dLoadTaskData(dpageindex);
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
    /*Get dropbox details*/
    $(document).on('click', '#dpaginate', function () {
        dpageindex = $(this).attr("index");
        dLoadTaskData(dpageindex);
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var dtarget = $(e.target).attr("href"); // activated tab
        if (dtarget == "#overduetab") {
            if (drowcount == 0) {
                dLoadTaskData(dpageindex);
            }
        }
    });
    $("#dcleardate").click(function () {
        $("#dfilterdate").val("");
        $("#dcleardate").css("display", "none");
        dLoadTaskData(1);
    })
    $("#dfilterdate").change(function () {
        $("#dcleardate").css("display", "block");
        dLoadTaskData(1);
    })
    $("#dfiltertask").change(function () {
        dLoadTaskData(1);
    })
    $("#dfilterclient").change(function () {
        dLoadTaskData(1);
    })
    /*Load Personal Dashboard Case Task dueList details */
    function dLoadTaskData(dpageindex) {
        $("#dtfooter").html("");
        $("#dbindcasetask").html("");
        var dhtml3 = '';
        var formData = new FormData();
        formData.append("pagenum", dpageindex);
        formData.append("pagesize", dpagesize);
        formData.append("datefilter", $("#dfilterdate").val());
        formData.append("filtertask", $("#dfiltertask").val());
        formData.append("filterclient", $("#dfilterclient").val());
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskdueList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#ddataescstatus").html("");
                }
                else {
                    $("#ddataescstatus").html("No result found !");
                    closeload();
                }
                var dlength = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    drowcount = 1;
                    if (i === 0) {
                        dfirstvalue = a.rownum;
                    }
                    if (i === (dlength - 1)) {
                        var dpnext = dpageindex;
                        var dpprev = dpageindex;
                        var dpageno = dpageindex;
                        var dtotdata = a.totRow;
                        var dtotpage = 0;
                        if (a.totRow > 0) {
                            dpnext = parseInt(dpnext) + 1;
                            if (dpnext == 0) dpnext = 1;
                            dpprev = parseInt(dpageno) - 1;
                            if (dpprev == 0) dpprev = 1;
                            dtotpage = parseInt(dtotdata) / parseInt(dpagesize);
                            if (parseInt(dtotdata) % parseInt(dpagesize) != 0) {
                                dtotpage = parseInt(dtotpage) + 1;
                            }
                            $("#dpagnumvalue").attr("max", dtotpage);
                        }
                        var dtfot = '';
                        dtfot += '<table style="width:100%;background:#dddddd !important;"><tr><td colspan = "12">'
                        dtfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + dpageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(dtotpage) + '</span> Pages</b>'
                        dtfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + dfirstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                        dtfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="opagnumvalue" min="1"  style="width: 30px;"><button type="button" id="ogetdatabypagenum" style="margin-left:10px;">Go</button>'
                        dtfot += '</div>'
                        dtfot += '<div style="float:right;">'
                        if (a.totRow <= dlength) {
                        }
                        else if (dpageno == 1) {
                        }
                        else if (dpageno == dtotpage) {
                            dtfot += '<a id="ipaginate" class="btn  btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + dpprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            dtfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + dpprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (dpageno < dtotpage) {
                            dtfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Next Page" href="javascript:void()" index="' + dpnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        dtfot += '</td >'
                        dtfot += '</tr >'
                        $("#dtfooter").append(dtfot);
                    }
                    var dAssignBycolor = "";
                    var dAssignTocolor = "";
                    var dClientName = a.ClientName;
                    if (dClientName == "") {
                        dClientName = "Test Client";
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
                    dhtml3 += '<tr>'
                    dhtml3 += '<th scope="row"><span class="text-success">' + formatAMPM(a.TaskDueTime) + '</span></th>'
                    dhtml3 += '<td><span>' + a.TaskName + '</span></td>'
                    dhtml3 += '<td>'
                    dhtml3 += '<div style="float:left">'
                    dhtml3 += '<span id="clname" style="font-weight:bold;">' + dClientName + '</span><br>'
                    dhtml3 += '<span style="font-size:12px;">' + dCaseName + '</span>'
                    dhtml3 += '</div>'
                    dhtml3 += '<div style="float:right">'
                    dhtml3 += '<div class="btn-group">'
                    dhtml3 += '<button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                    dhtml3 += '<span class="caret"></span>'
                    dhtml3 += '<span class="sr-only">Toggle Dropdown</span>'
                    dhtml3 += '</button>'
                    dhtml3 += '<ul class="dropdown-menu">'
                    dhtml3 += '<li><a href="#">Case Dashboard</a></li>'
                    dhtml3 += '<li><a href="#">Case Activity Chain</a></li>'
                    dhtml3 += '<li><a href="#">Case Comunnication</a></li>'
                    dhtml3 += '<li><a href="#">Case Documentation</a></li>'
                    dhtml3 += '<li role="separator" class="divider"></li>'
                    dhtml3 += '<li><a href="#">Case Events & Calendar</a></li>'
                    dhtml3 += '</ul>'
                    dhtml3 += '</div>'
                    dhtml3 += '</div>'
                    dhtml3 += '</td>'
                    dhtml3 += '<td>'
                    dhtml3 += '<span id="clname" style="font-size:11px;color:' + dAssignBycolor + ';font-weight:bold"> ' + dAssignBy + '</span><br>'
                    dhtml3 += '</td>'
                    dhtml3 += '<td>'
                    dhtml3 += '<button type="button" class="btn btn-mail btn-info" val-data="' + a.CaseId + '" id="opendocs"><i class="glyphicon glyphicon-folder-open"></i></button>'
                    dhtml3 += '</td>'
                    dhtml3 += '<td>' + formatDatetoIST(a.TaskDueDate) + '</td>'
                    dhtml3 += '<td><span style="font-weight:bold;" class="text-success">' + a.AssignTaskStatus + '</span> <button type="button" style="margin-left:5px" class="btn btn-warning btn-sm" title="Click here to Re-assign task" val-data="' + a.Tid + '" id="outboxaction"><i class="glyphicon  glyphicon glyphicon-share"></i></button></td>'
                    dhtml3 += '</td>'
                    dhtml3 += '</tr>'
                });
                $("#dbindcasetask").append(dhtml3);
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