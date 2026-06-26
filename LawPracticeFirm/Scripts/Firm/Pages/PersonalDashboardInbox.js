$(document).ready(function () {
    var irowcount = 0;
    var ipageindex = 1, ipagesize = 3, irecordcount = 0, itotrecord = 0;
    var isearchflag = false;
    var ichckfilter = false;
    var tempexcel = false;
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
/*Accept Reject Inbox*/
    $(document).on('click', '#ainbox', function () {
        var result = confirm("Are you sure to accept task request?");
        if (result) {
            var tokenid = $(this).attr("data-id");
            var formData = new FormData();
            formData.append("tokenid", tokenid);
            formData.append("RequestType", "A");
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
                    if (response1.Data == 1) {
                        alert("Request accpeted successfully");
                        iLoadTaskData(ipageindex);
                        loadInoutCount();
                        closeload();
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
        ipageindex = $(this).attr("index");
        iLoadTaskData(ipageindex);
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab
        if (target == "#inboxtab")
        {
            if (irowcount == 0)
            {
                iLoadTaskData(ipageindex);
            }
        }
    });
    $("#icleardate").click(function () {
        $("#ifilterdate").val("");
        $("#icleardate").css("display", "none");
        iLoadTaskData(1);
    })
    $("#ifilterdate").change(function () {
        $("#icleardate").css("display", "block");
        iLoadTaskData(1);
    })
    $("#ifiltertask").change(function () {
        iLoadTaskData(1);
    })
    $("#ifilterclient").change(function () {
        iLoadTaskData(1);
    })
    /*Inbox task data*/
    function iLoadTaskData(ipageindex)
    {
        $("#itfooter").html("");
        $("#ibindcasetask").html("");
        var ihtml3 = '';
        var formData = new FormData();
        formData.append("pagenum", ipageindex);
        formData.append("pagesize", ipagesize);
        formData.append("datefilter", $("#ifilterdate").val());
        formData.append("filtertask", $("#ifiltertask").val());
        formData.append("filterclient", $("#ifilterclient").val());
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PersonalDashboardCaseTaskInboxList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#idataescstatus").html("");
                }
                else {
                    $("#idataescstatus").html("No result found !");
                    closeload();
                }
                var ilength = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    irowcount = 1;
                    if (i === 0) {
                        ifirstvalue = a.rownum;
                    }
                    if (i === (ilength - 1)) {
                        var ipnext = ipageindex;
                        var ipprev = ipageindex;
                        var ipageno = ipageindex;
                        var itotdata = a.totRow;
                        var itotpage = 0;
                        if (a.itotRow > 0) {
                            ipnext = parseInt(ipnext) + 1;
                            if (ipnext == 0) ipnext = 1;
                            ipprev = parseInt(ipageno) - 1;
                            if (ipprev == 0) ipprev = 1;
                            itotpage = parseInt(itotdata) / parseInt(ipagesize);
                            if (parseInt(itotdata) % parseInt(ipagesize) != 0) {
                                itotpage = parseInt(itotpage) + 1;
                            }
                            $("#ipagnumvalue").attr("max", itotpage);
                        }
                        var itfot = '';
                        itfot += '<table style="width:100%;background:#dddddd !important;"><tr><td colspan = "12">'
                        itfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + ipageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(itotpage) + '</span> Pages</b>'
                        itfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + ifirstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                        itfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="ipagnumvalue" min="1"  style="width: 30px;"><button type="button" id="igetdatabypagenum" style="margin-left:10px;">Go</button>'
                        itfot += '</div>'
                        itfot += '<div style="float:right;">'
                        if (a.totRow <= ilength) {
                        }
                        else if (ipageno == 1) {
                        }
                        else if (ipageno == itotpage) {
                            itfot += '<a id="ipaginate" class="btn  btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + ipprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            itfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + ipprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (ipageno < itotpage) {
                            itfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Next Page" href="javascript:void()" index="' + ipnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        itfot += '</td >'
                        itfot += '</tr >'
                        $("#itfooter").append(itfot);
                    }
                    var iAssignBycolor = "";
                    var iAssignTocolor = "";
                    var iClientName = a.ClientName;
                    if (iClientName == "")
                    {
                        iClientName = "Test Client";
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
                    ihtml3 += '<tr>'
                    ihtml3 += '<th scope="row"><span class="text-success">' + formatAMPM(a.TaskDueTime) + '</span></th>'
                    ihtml3 += '<td><span>' + a.TaskName+ '</span></td>'
                    ihtml3 += '<td>'
                    ihtml3 += '<div style="float:left">'
                    ihtml3 += '<span id="clname" style="font-weight:bold;">' + iClientName + '</span><br>'
                    ihtml3 += '<span style="font-size:12px;">' + iCaseName + '</span>'
                    ihtml3 += '</div>'
                    ihtml3 += '<div style="float:right">'
                    ihtml3 += '<div class="btn-group">'
                    ihtml3 += '<button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                    ihtml3 += '<span class="caret"></span>'
                    ihtml3 += '<span class="sr-only">Toggle Dropdown</span>'
                    ihtml3 += '</button>'
                    ihtml3 += '<ul class="dropdown-menu">'
                    ihtml3 += '<li><a href="#">Case Dashboard</a></li>'
                    ihtml3 += '<li><a href="#">Case Activity Chain</a></li>'
                    ihtml3 += '<li><a href="#">Case Comunnication</a></li>'
                    ihtml3 += '<li><a href="#">Case Documentation</a></li>'
                    ihtml3 += '<li role="separator" class="divider"></li>'
                    ihtml3 += '<li><a href="#">Case Events & Calendar</a></li>'
                    ihtml3 += '</ul>'
                    ihtml3 += '</div>'
                    ihtml3 += '</div>'
                    ihtml3 += '</td>'
                    ihtml3 += '<td>'
                    ihtml3 += '<span id="clname" style="font-size:11px;color:' + iAssignBycolor + ';font-weight:bold"> ' + iAssignBy + '</span><br>'
                    ihtml3 += '</td>'
                    ihtml3 += '<td>'
                    ihtml3 += '<button type="button" class="btn btn-mail btn-info" val-data="' + a.CaseId + '" id="opendocs"><i class="glyphicon glyphicon-folder-open"></i></button>'
                    ihtml3 += '</td>'
                    ihtml3 += '<td>' + formatDatetoIST(a.TaskDueDate) + '</td>'
                    if (a.AssignTaskStatus == "Accepted")
                    {
                        ihtml3 += '<td><span style="font-weight:bold;" class="text-success">' + a.AssignTaskStatus + '</span></td>'
                    }
                    else if (a.AssignTaskStatus == "Rejected") {
                        ihtml3 += '<td><span style="font-weight:bold;" class="text-danger">' + a.AssignTaskStatus + '</span></td>'
                    }
                    else
                    {
                        ihtml3 +='<td>'
                        ihtml3 += '<input type="date" id="inboxacceptdate' + a.Tid + '">'
                        ihtml3 += '<div class="btn-group" style="float:right">'
                        ihtml3 += '<button type="button" title="Cliek here to Perofom action like accept/reject request" style="height: 26px;" class="btn  btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                        ihtml3 += '<span class="caret"></span>'
                        ihtml3 += '<span class="sr-only">Toggle Dropdown</span>'
                        ihtml3 += '</button>'
                        ihtml3 += '<ul class="dropdown-menu">'
                        ihtml3 += '<li><a href="javascript:void()" data-id="' + a.Tid + '" id="ainbox" class=" text-success">Accept</a></li>'
                        ihtml3 +='<li role="separator" class="divider" ></li>'
                        ihtml3 += '<li><a href="javascript:void()" data-id="' + a.Tid + '" id="rinbox" class=" text-danger">Reject</a></li>'
                        ihtml3 += '</ul>'
                        ihtml3 += '</div>'
                    }
                    ihtml3 += '</td>'
                    ihtml3 += '</tr>'
                });
                $("#ibindcasetask").append(ihtml3);
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