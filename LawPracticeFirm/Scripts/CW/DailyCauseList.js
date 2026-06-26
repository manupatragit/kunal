$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
    var pageindex = 1, pagesize = 20, recordcount = 0, totrecord = 0, ppageindex = 1;
    var Isdatecwlist = 0
    $("#dtallcwlist").click(function () {
        Isdatecwlist = 1;
    });
    $("#dtcwlist").click(function () {
        //  alert("dtcwlist");
        Isdatecwlist = 0;
    });
    $(function () {
        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();
        var days = day - 3;
        var minDate = year + '-' + month + '-' + days;
        $('#casedate').attr('min', minDate);
    });
    // $("#casedate").datepicker({ minDate: -3 });
    //bindcustomdate();
    ////For Bind Custom date filter
    //function bindcustomdate() {
    //    var html1 = "";
    //    var date = new Date()
    //    var firstdate = date.setDate(date.getDate())
    //    var seconddate = date.setDate(date.getDate() + 1)
    //    var thirddate = date.setDate(date.getDate() + 1)
    //    var fourthddate = date.setDate(date.getDate() + 1)

    //    html1 += '<option value="" selected="selected">Please Select</option>';
    //    html1 += '<option value="' + formatDatetoIST(firstdate) + '" >' + formatDatetoIST(firstdate) + '</option>';
    //    html1 += '<option value="' + formatDatetoIST(seconddate) + '" >' + formatDatetoIST(seconddate) + '</option>';
    //    html1 += '<option value="' + formatDatetoIST(thirddate) + '" >' + formatDatetoIST(thirddate) + '</option>';
    //   // html1 += '<option value="' + formatDatetoIST(fourthddate) + '" >' + formatDatetoIST(fourthddate) + '</option>';
    //    $("#casedate").html(html1);
    //}


    var chksflag = true;
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Export CW Cause List Details in excel*/
    $("#exporttoexcel").click(function () {
        var casedate = $("#casedate").val();
        var scourt1 = $("#ocasedata1").val();
        var pagesizedata = 500;
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        if (casedate == "") {
            alert("select date");
            return false;
        }
        else {
            window.location = encodeURI("/CW/ExportToExcelCWCauseListDetails?status=true&casedate=" + escape(casedate) + "&court=" + escape(scourt1) + "&pageno=" + ppageindex + "&pagesize=" + pagesizedata + "");
        }
    });
    /*Export CW Cause List Details in pdf*/
    $("#exporttopdf").click(function () {
        var casedate = $("#casedate").val();
        var scourt1 = $("#ocasedata1").val();
        var pagesizedata = 20;
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        if (casedate == "") {
            alert("select date");
            return false;
        }
        else {
            window.location = encodeURI("/CW/ExportToPDFCWCauseListDetails?status=true&casedate=" + escape(casedate) + "&court=" + escape(scourt1) + "&pageno=" + ppageindex + "&pagesize=" + pagesizedata + "");
        }
    });
    var casedate = ""; var scourt1 = ""; var scourt2 = "";
    /*Get cause list details*/
    $("#getcauselist").click(function () {

        casedate = $("#casedate").val();
        scourt1 = $("#ocasedata1").val();
        if (scourt1 == "") {
            alert("Please select a court");
            return false;
        }
        if (casedate == "") {
            alert("Please select a date");
            return false;
        }
        else {
            isRenderPage = false;
            CauselistCaseWatch(casedate, scourt1, 1, 1);
        }
    });
    /*Paginate*/
    $(document).on('click', '#paginate', function () {
        if (Isdatecwlist == 0) {
            ppageindex = $(this).attr("index");
            CauselistCaseWatch(casedate, scourt1, 1, ppageindex);
        }
        else {
            ppageindex = $(this).attr("index");
            AllCauselistCaseWatch(scourt2, 1, ppageindex);
        }
    });
    /*Get data by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    if (Isdatecwlist == 0) {
                        CauselistCaseWatch(casedate, scourt1, 1, ppageindex);
                    }
                    else {
                        AllCauselistCaseWatch(scourt2, 1, ppageindex);
                    }
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    /*Get casewatch cause list*/
    function CauselistCaseWatch(casedate, scourt1, loader, pageindex) {
        // document.querySelector(".pagination").style.display = "none";
        $("#binddatacw").html("");
        $("#datastatus34").html("");
        var formData = new FormData();
        formData.append("casedate", casedate);
        formData.append("court", scourt1);
        formData.append("pageno", pageindex);
        formData.append("pagesize", pagesize);
        //read assign using list
        qty1 = 0;
        var html = '';
        if (String(loader) == "1") {
            openload();
        }
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CWCauseListDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {

                if (response == "") {
                    // document.querySelector(".pagination").style.display = "none";
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    if (String(scourt1) == "1") {
                        $("#causelist1").css("display", "");
                        $("#causelist3").css("display", "none");
                        $("#causelist4").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        $("#binddatacw1").html("");
                    }
                    if (String(scourt1) == "2") {
                        $("#causelisthigh").css("display", "");
                        $("#causelist1").css("display", "none");
                        $("#causelist3").css("display", "none");
                        $("#causelist4").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        $("#binddatacw1higcort").html("");
                    }
                    if (String(scourt1) == "4") {
                        $("#causelist4").css("display", "");
                        $("#causelist3").css("display", "none");
                        $("#causelist1").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        $("#binddatacw4").html("");
                    }
                    if (String(scourt1) == "3") {
                        $("#causelist3").css("display", "");
                        $("#causelist4").css("display", "none");
                        $("#causelist1").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        $("#binddatacw3").html("");
                    }
                    if (String(scourt1) == "RERH") {
                        $("#causelistRERH").css("display", "");
                        $("#causelist4").css("display", "none");
                        $("#causelist1").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelist3").css("display", "none");
                        $("#binddatacwRERH").html("");
                    }
                    if (String(scourt1) == "7") {
                        $("#causelist1").css("display", "");
                        $("#causelist3").css("display", "none");
                        $("#causelist4").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        var length = response.length;
                        var counts7 = 0;
                        $.each(response, function (i, a) {
                            q = q + 1;
                            counts7 = counts7 + 1;
                            if (i === 0) {
                                firstvalue = a.RowId;
                            }
                            var totpage = 0;
                            if (i === (length - 1)) {
                                var totdata = a.TotalRecord

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

                            }
                            html += '<tr><td class="case"> ' + a.Courtname + '</td>';
                            html += '<td class="court"> ' + a.CaseType + '</td>';
                            html += '<td class="cname"> ' + a.Caseno + '</td>';
                            html += '<td class="bname"> ' + a.Caseyear + '</td>';
                            html += '<td class="adv"> ' + a.CourtNo + '</td>';
                            html += '<td class="nh"> ' + a.JudgeName + '</td>';
                            html += '<td> ' + a.CauselistDate + '</td>';
                            if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            }
                            else {
                                if (a.CauselistDetail.length > 60) {
                                    html += '<td>'
                                    html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
                                    html += '<span data-toggle="collapse" data-target="#dtn' + counts7 + '" style="color:blue;cursor:pointer"> more</span>'
                                    html += ' <div id="dtn' + counts7 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + counts7 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html += '' + a.CauselistDetail + ''
                                    html += '</div>'
                                    html += '</td>'
                                }
                                else {
                                    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                                }
                            }
                            html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
                            html += '<td>' + (a.ItemNo == null ? "" : a.ItemNo) + '</td>';
                            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                                html += '<td></td>';
                            }
                            else {
                                html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</td>';
                            }
                            html += '</tr>';
                            if (i === (length - 1)) {

                                if (isRenderPage == false) {
                                    renderPagination(pageindex, totpage);
                                }
                            }
                        }); //End of foreach Loop
                        $("#binddatacw1").empty().html(html);

                        closeload();
                    }
                    //$("#ptfooter").html("");
                    $('#binddatacw1').html("");
                    $("#datastatus34").html(
                        '<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No causelist found</h4>' +
                        '<p>We found no causelist.</p>' +
                        '</div>'
                    );
                    closeload();
                    return false;
                }
                else {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                    $("#adatastatus34").html("");
                    var obj = JSON.stringify(response);
                    var size = response.length;
                    if (size > 0) {
                        //document.getElementById('pagenatedArea').style.display = 'block';

                    }
                    var q = 0;
                    if (String(scourt1) == "1") {
                        $("#causelist1").css("display", "");
                        $("#causelist3").css("display", "none");
                        $("#causelist4").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        var length = response.length;

                        var coints1 = 0;
                        $.each(response, function (i, a) {
                            q = q + 1;
                            coints1 = coints1 + 1;
                            if (i === 0) {
                                firstvalue = a.RowId;
                            }
                            var totpage = 0;
                            if (i === (length - 1)) {
                                var totdata = a.TotalRecord

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
                            }
                            html += '<tr><td class="case"> ' + a.Courtname + '</td><td class="court">' + a.CaseType + '</td><td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
                            html += '<td class="sdiaryno"> ' + a.DiaryNo + '</td>';
                            html += '<td class="sdiaryyear"> ' + a.DiaryYear + '</td>';
                            html += '<td class="adv"> ' + a.CourtNo + '</td>'
                            html += '<td class="nh"> ' + a.JudgeName + '</td>'
                            html += '<td> ' + a.CauselistDate + '</td > ';
                            if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            }
                            else {
                                if (a.CauselistDetail.length > 60) {
                                    html += '<td>'
                                    html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
                                    html += '<span data-toggle="collapse" data-target="#dtn' + coints1 + '" style="color:blue;cursor:pointer"> more</span>'
                                    html += ' <div id="dtn' + coints1 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + coints1 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html += '' + a.CauselistDetail + ''
                                    html += '</div>'
                                    html += '</td>'
                                }
                                else {
                                    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                                }
                            }
                            html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
                            html += '<td>' + (a.ItemNo == null ? "" : a.ItemNo) + '</td>';
                            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                                if (a.filename != "") {
                                    html += '<td><span><a style="color:blue" title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                                }
                                $("#actioncw3,#actioncw4,#actioncw1,#actioncw12").show();
                                //$("#actioncw12").hide();
                            }
                            else {
                                html += '<td style="width: 225px;"><span style="cursor:pointer;color:blue !important;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View Matter <span style="color: black;"> | </span></span>&nbsp;<span style="cursor:pointer;color:blue !important;"><a title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                            }
                            html += '</tr>';
                            if (i === (length - 1)) {

                                if (isRenderPage == false) {
                                    renderPagination(pageindex, totpage);
                                }
                            }
                        }); //End of foreach Loop
                        $("#binddatacw1").empty().html(html);

                        closeload();
                    }
                    if (String(scourt1) == "2") {
                        $("#causelist1").css("display", "none");
                        $("#causelist3").css("display", "none");
                        $("#causelist4").css("display", "none");
                        $("#causelisthigh").css("display", "");
                        $("#causelistRERH").css("display", "none");
                        var length = response.length;
                        var coints1 = 0;
                        $.each(response, function (i, a) {
                            q = q + 1;
                            coints1 = coints1 + 1;
                            if (i === 0) {
                                firstvalue = a.RowId;
                            }
                            var totpage = 0;
                            if (i === (length - 1)) {
                                var totdata = a.TotalRecord;
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
                            }
                            html += '<tr><td class="case"> ' + a.Courtname + '</td><td class="bench"> ' + a.Benchname + '</td><td class="court">' + a.CaseType + '</td><td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
                            html += '<td class="adv"> ' + a.CourtNo + '</td>'
                            html += '<td class="nh"> ' + a.JudgeName + '</td>'
                            html += '<td> ' + a.CauselistDate + '</td > ';
                            if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            }
                            else {
                                if (a.CauselistDetail.length > 60) {
                                    html += '<td>'
                                    html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
                                    html += '<span data-toggle="collapse" data-target="#dtn' + coints1 + '" style="color:blue;cursor:pointer"> more</span>'
                                    html += ' <div id="dtn' + coints1 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + coints1 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html += '' + a.CauselistDetail + ''
                                    html += '</div>'
                                    html += '</td>'
                                }
                                else {
                                    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                                }
                            }
                            html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
                            html += '<td>' + (a.ItemNo == null ? "" : a.ItemNo) + '</td>';
                            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                                if (a.filename != "") {
                                    html += '<td><span><a style="color:blue" title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                                }
                                $("#actioncw3,#actioncw4,#actioncw1,#actioncw12").show();
                                //$("#actioncw12").hide();
                            }
                            else {
                                html += '<td><span style="cursor:pointer;color:blue;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</span> &nbsp;<span><a title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                            }
                            html += '</tr>';
                            if (i === (length - 1)) {

                                if (isRenderPage == false) {
                                    renderPagination(pageindex, totpage);
                                }
                            }
                        }); //End of foreach Loop
                        $("#binddatacw1higcort").empty().html(html);

                        closeload();
                    }
                    if (String(scourt1) == "4") {
                        $("#causelist4").css("display", "");
                        $("#causelist3").css("display", "none");
                        $("#causelist1").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        var length = response.length;
                        var counts4 = 0;
                        var totpage = 0;
                        $.each(response, function (i, a) {
                            q = q + 1;
                            counts4 = counts4 + 1;
                            if (i === 0) {
                                firstvalue = a.RowId;
                            }
                            if (i === (length - 1)) {
                                var totdata = a.TotalRecord

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
                            }
                            html += '<tr><td class="case"> ' + a.Courtname + '</td><td class="benchs"> ' + a.Benchname + '</td><td class="court">' + a.CaseType + ' <td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
                            html += '<td class="bdiaryno">' + a.DiaryNo + '</td>';
                            html += '<td class="bdiaryyear">' + a.DiaryYear + '</td>';
                            html += '<td class="adv"> ' + a.CourtNo + '</td><td class="nh">' + a.JudgeName + '<td>' + a.CauselistDate + '</td>';
                            if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            }
                            else {
                                if (a.CauselistDetail.length > 60) {
                                    html += '<td>'
                                    html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
                                    html += '<span data-toggle="collapse" data-target="#dtn' + counts4 + '" style="color:blue;cursor:pointer"> more</span>'
                                    html += ' <div id="dtn' + counts4 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + counts4 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html += '' + a.CauselistDetail + ''
                                    html += '</div>'
                                    html += '</td>'
                                }
                                else {
                                    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                                }
                            }
                            html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
                            html += '<td>' + (a.ItemNo == null ? "" : a.ItemNo) + '</td>';
                            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                                if (a.filename != "") {
                                    html += '<td><span><a title="View Full CauseList" style="color:blue" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                                }
                            }
                            else {
                                html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter </span>&nbsp;<span><a title="View Full CauseList" style="color:blue" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                            }
                            html += '</tr>';
                            if (i === (length - 1)) {

                                if (isRenderPage == false) {
                                    renderPagination(pageindex, totpage);
                                }
                            }
                        }); //End of foreach Loop
                        $("#binddatacw4").empty().html(html);
                        closeload();
                    }
                    if (String(scourt1) == "3") {
                        $("#causelist3").css("display", "");
                        $("#causelist4").css("display", "none");
                        $("#causelist1").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        var contall4 = 0;
                        var length = response.length;
                        var totpage = 0;
                        $.each(response, function (i, a) {
                            q = q + 1;
                            contall4 = contall4 + 1;
                            if (i === 0) {
                                firstvalue = a.RowId;
                            }
                            if (i === (length - 1)) {
                                var totdata = a.TotalRecord;
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
                            }
                            html += '<tr><td class="case"> ' + a.Case + '</td><td class="court">' + a.State + ' <td class="cname"> ' + a.District + '</td><td class="bname">' + a.JudgeName + '</td>';
                            html += '<td  class="dd"> ' + a.CourtComplexCourtEstablishment + '</td><td>' + a.CauselistDate + '</td>';
                            if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            }
                            else {
                                if (a.CauselistDetail.length > 60) {
                                    html += '<td>'
                                    html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
                                    html += '<span data-toggle="collapse" data-target="#dtn' + contall4 + '" style="color:blue;cursor:pointer"> more</span>'
                                    html += ' <div id="dtn' + contall4 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + contall4 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html += '' + a.CauselistDetail + ''
                                    html += '</div>'
                                    html += '</td>'
                                }
                                else {
                                    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                                }
                            }
                            html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
                            html += '<td>' + (a.ItemNo == null ? "" : a.ItemNo) + '</td>';
                            if (a.CourtNo == "null" || a.CourtNo == null) {
                                html += '<td>&nbsp;</td>';
                            }
                            else {
                                html += '<td>' + a.CourtNo + '</td>';
                            }
                            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                                if (a.filename != "") {
                                    html += '<td><span><a style="color:blue" title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                                }
                            }
                            else {
                                html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter </span>&nbsp;<span><a style="color:blue" title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                            }
                            html += '</tr>';
                            if (i === (length - 1)) {

                                if (isRenderPage == false) {
                                    renderPagination(pageindex, totpage);
                                }
                            }
                        }); //End of foreach Loop
                        $("#binddatacw3").empty().html(html);
                        closeload();
                    }
                    if (String(scourt1) == "RERH") {
                        $("#causelistRERH").css("display", "");
                        $("#causelist4").css("display", "none");
                        $("#causelist1").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        var contall4 = 0;
                        var length = response.length;
                        var totpage = 0;
                        $.each(response, function (i, a) {
                            q = q + 1;
                            contall4 = contall4 + 1;
                            if (i === 0) {
                                //firstvalue = a.RowId;
                            }
                            if (i === (length - 1)) {
                                var totdata = a.TotalRecord;
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#next').hide();
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
                            }
                            html += '<tr><td class="case"> ' + a.vCaseName + '</td><td class="court">' + a.Courtname + ' <td class="cname"> ' + a.vCourt + '</td><td class="bname">' + a.AppealNo + '</td>';
                            html += '<td  class="dd"> ' + a.vCauselistDate + '</td>';
                            //if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
                            //    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            //}
                            //else {
                            //    if (a.CauselistDetail.length > 60) {
                            //        html += '<td>'
                            //        html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
                            //        html += '<span data-toggle="collapse" data-target="#dtn' + contall4 + '" style="color:blue;cursor:pointer"> more</span>'
                            //        html += ' <div id="dtn' + contall4 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                            //        html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + contall4 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                            //        html += '' + a.CauselistDetail + ''
                            //        html += '</div>'
                            //        html += '</td>'
                            //    }
                            //    else {
                            //        html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            //    }
                            //}
                            html += '<td>' + (a.vStatus == null ? "" : a.vStatus) + '</td>';
                            html += '<td>' + (a.vItemNo == null ? "" : a.vItemNo) + '</td>';
                            //if (a.CourtNo == "null" || a.CourtNo == null) {
                            //    html += '<td>&nbsp;</td>';
                            //}
                            //else {
                            //    html += '<td>' + a.CourtNo + '</td>';
                            //}
                            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                                if (a.filename != "") {
                                    html += '<td><span><a style="color:blue" title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                                }
                            }
                            else {
                                html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter </span>&nbsp;<span><a style="color:blue" title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                            }
                            html += '</tr>';
                            if (i === (length - 1)) {

                                if (isRenderPage == false) {
                                    renderPagination(pageindex, totpage);
                                }
                            }
                        }); //End of foreach Loop
                        $("#binddatacwRERH").empty().html(html);
                        closeload();
                    }
                    if (String(scourt1) == "7") {
                        $("#causelist1").css("display", "");
                        $("#causelist3").css("display", "none");
                        $("#causelist4").css("display", "none");
                        $("#causelisthigh").css("display", "none");
                        $("#causelistRERH").css("display", "none");
                        var length = response.length;
                        var counts7 = 0;
                        var totpage = 0;
                        $.each(response, function (i, a) {
                            q = q + 1;
                            counts7 = counts7 + 1;
                            if (i === 0) {
                                firstvalue = a.RowId;
                            }
                            if (i === (length - 1)) {
                                var totdata = a.TotalRecord

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
                            }
                            html += '<tr><td class="case"> ' + a.Courtname + '</td>';
                            html += '<td class="court"> ' + a.CaseType + '</td>';
                            html += '<td class="cname"> ' + a.Caseno + '</td>';
                            html += '<td class="bname"> ' + a.Caseyear + '</td>';
                            html += '<td class="sdiaryno"> ' + a.DiaryNo + '</td>';
                            html += '<td class="sdiaryyear"> ' + a.DiaryYear + '</td>';
                            html += '<td class="adv"> ' + a.CourtNo + '</td>';
                            html += '<td class="nh"> ' + a.JudgeName + '</td>';
                            html += '<td> ' + a.CauselistDate + '</td>';
                            if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                            }
                            else {
                                if (a.CauselistDetail.length > 60) {
                                    html += '<td>'
                                    html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
                                    html += '<span data-toggle="collapse" data-target="#dtn' + counts7 + '" style="color:blue;cursor:pointer"> more</span>'
                                    html += ' <div id="dtn' + counts7 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + counts7 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html += '' + a.CauselistDetail + ''
                                    html += '</div>'
                                    html += '</td>'
                                }
                                else {
                                    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                                }
                            }
                            html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
                            html += '<td>' + (a.ItemNo == null ? "" : a.ItemNo) + '</td>';
                            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                                html += '<td><span><a style="color:blue" title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                            }
                            else {
                                html += '<td><span style="cursor:pointer;color:blue" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</span>&nbsp;<span><a title="View Full CauseList" href="' + a.filename + '" target="_blank">FullCauseList</a></span></td>';
                            }
                            html += '</tr>';
                            if (i === (length - 1)) {

                                if (isRenderPage == false) {
                                    renderPagination(pageindex, totpage);
                                }
                            }
                        }); //End of foreach Loop
                        $("#binddatacw1").empty().html(html);
                        closeload();
                    }
                }
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
    }

    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    function renderPagination(pageindex, totdata) {
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
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$("#prev").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    //renderPagination(setPageNo, totalPageRec)
    //    CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$("#next").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    if (parseInt(totalPageRec) < setPageNo) {
    //        window.alert("Plese enter the valid page number.");
    //        return;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
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
        isRenderPage = false;
        CauselistCaseWatch(casedate, scourt1, 1, setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    /*Pagination End*/

    $("#aexporttoexcel").click(function () {
        var pagesizedata = 500;
        var fromdate = $("#frmcasedate").val();
        var todate = $("#tocasedate").val();
        var scourt1 = $("input[name='aocasedata1']:checked").val();
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        else {
            window.location = encodeURI("/CW/ExportToExcelAllCWCauseListDetails?statusd=true&court=" + escape(scourt1) + "&pageno=" + ppageindex + "&pagesize=" + pagesizedata + "&fromdate=" + fromdate + "&todate=" + todate + "");
        }
    });
    $("#aexporttopdf").click(function () {
        var fromdate = $("#frmcasedate").val();
        var todate = $("#tocasedate").val();
        var pagesizedata = 500;
        var scourt1 = $("input[name='aocasedata1']:checked").val();
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        else {
            window.location = encodeURI("/CW/ExportToPDFAllCWCauseListDetails?status=true&court=" + escape(scourt1) + "&pageno=" + ppageindex + "&pagesize=" + pagesizedata + "&fromdate=" + fromdate + "&todate=" + todate + "");
        }
    });
    $("#agetcauselist").click(function () {
        var casedate = $("#acasedate").val();
        scourt2 = $("input[name='aocasedata1']:checked").val();
        if (scourt2 == "") {
            alert("select court");
            return false;
        }
        else {
            AllCauselistCaseWatch(scourt2, 1, 1);
        }
    });
    //function AllCauselistCaseWatch(scourt2, loader, pageindex) {
    //    $("#binddatacw").html("");
    //    $("#datastatus34").html("");
    //    //Add range filter on causelist
    //    var fromdate = $("#frmcasedate").val();
    //    var todate = $("#tocasedate").val();

    //    var formData = new FormData();
    //    formData.append("casedate", "");
    //    formData.append("court", scourt2);
    //    formData.append("pageno", pageindex);
    //    formData.append("pagesize", pagesize);
    //    formData.append("fromdate", fromdate);
    //    formData.append("todate", todate);
    //    //read assign using list
    //    qty1 = 0;
    //    var html = '';
    //    if (String(loader) == "1") {
    //        openload();
    //    }
    //    var d0 = $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/CW/AllCWCauseListDetails",
    //        dataType: 'json',
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        success: function (response) {
    //            if (response == "") {
    //                if (String(scourt2) == "1") {
    //                    $("#acauselist1").css("display", "");
    //                    $("#acauselist3").css("display", "none");
    //                    $("#acauselist4").css("display", "none");
    //                }
    //                if (String(scourt2) == "4") {
    //                    $("#acauselist4").css("display", "");
    //                    $("#acauselist3").css("display", "none");
    //                    $("#acauselist1").css("display", "none");
    //                }
    //                if (String(scourt2) == "3") {
    //                    $("#acauselist3").css("display", "");
    //                    $("#acauselist4").css("display", "none");
    //                    $("#acauselist1").css("display", "none");
    //                }
    //                $("#adatastatus34").html(
    //                    '<div class="notfound" id="pdatastatus" style="text-align: center;">' +
    //                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
    //                    '<h4>No Matter list found</h4>' +
    //                    '<p>We found no matter list.</p>' +
    //                    '</div>'
    //                );
    //               // $("#adatastatus34").html("There are no Cause List Details available for this date.");
    //                closeload();
    //                return false;
    //            }
    //            else {
    //                closeload();
    //                $("#adatastatus34").html("");
    //                var obj = JSON.stringify(response);
    //                var q = 0;
    //                if (String(scourt2) == "1") {
    //                    $("#acauselist1").css("display", "");
    //                    $("#acauselist3").css("display", "none");
    //                    $("#acauselist4").css("display", "none");
    //                    var length = response.length;
    //                    var acounts1 = 0;
    //                    $.each(response, function (i, a) {
    //                        q = q + 1;
    //                        acounts1 = acounts1 + 1;
    //                        if (i === 0) {
    //                            firstvalue = a.RowId;
    //                        }
    //                        if (i === (length - 1)) {
    //                            var pnext = pageindex;
    //                            var pprev = pageindex;
    //                            var pageno = pageindex;
    //                            var totdata = a.TotalRecord;
    //                            var totpage = 0;
    //                            if (a.TotalRecord > 0) {
    //                                pnext = parseInt(pnext) + 1;
    //                                if (pnext == 0) pnext = 1;
    //                                pprev = parseInt(pageno) - 1;
    //                                if (pprev == 0) pprev = 1;
    //                                totpage = parseInt(totdata) / parseInt(pagesize);
    //                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
    //                                    totpage = parseInt(totpage) + 1;
    //                                }
    //                                $("#pagnumvalue").attr("max", totpage);
    //                            }
    //                            var tfot = '';
    //                            tfot += '<ul>'
    //                            tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button> </li>'
    //                            if (a.TotalRecord <= length) {
    //                            }
    //                            else if (pageno == 1) {
    //                            }
    //                            else if (pageno == totpage) {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
    //                            }
    //                            else {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
    //                            }
    //                            if (pageno < totpage) {
    //                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                            }
    //                            tfot += '</ul>'
    //                            $("#ptfooter").html("");
    //                            $("#ptfooter").html(tfot);
    //                        }
    //                        html += '<tr><td class="case"> ' + a.Courtname + '</td><td class="court">' + a.CaseType + ' <td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
    //                        html += '<td class="adv"> ' + a.CourtNo + '</td><td class="nh">' + a.JudgeName + '<td>' + a.CauselistDate + '</td>';
    //                        if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
    //                            html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
    //                        }
    //                        else {
    //                            if (a.CauselistDetail.length > 60) {
    //                                html += '<td>'
    //                                html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
    //                                html += '<span data-toggle="collapse" data-target="#dtn32' + acounts1 + '" style="color:blue;cursor:pointer"> more</span>'
    //                                html += ' <div id="dtn32' + acounts1 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
    //                                html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn32' + acounts1 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
    //                                html += '' + a.CauselistDetail + ''
    //                                html += '</div>'
    //                                html += '</td>'
    //                            }
    //                            else {
    //                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
    //                            }
    //                        }
    //                        html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
    //                        if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
    //                           // html += '<td></td>';
    //                            $("#actioncw3,#actioncw4,#actioncw1,#actioncw12").hide();
    //                        }
    //                        else {
    //                            html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</td>';
    //                        }
    //                        html += '</tr>';
    //                    }); //End of foreach Loop
    //                    $("#abinddatacw1").append(html);
    //                    closeload();
    //                }
    //                if (String(scourt2) == "4") {
    //                    $("#acauselist4").css("display", "");
    //                    $("#acauselist3").css("display", "none");
    //                    $("#acauselist1").css("display", "none");
    //                    var length = response.length;
    //                    var acounts4 = 0;
    //                    $.each(response, function (i, a) {
    //                        q = q + 1;
    //                        acounts4 = acounts4 + 1;
    //                        if (i === 0) {
    //                            firstvalue = a.RowId;
    //                        }
    //                        if (i === (length - 1)) {
    //                            var pnext = pageindex;
    //                            var pprev = pageindex;
    //                            var pageno = pageindex;
    //                            var totdata = a.TotalRecord;
    //                            var totpage = 0;
    //                            if (a.TotalRecord > 0) {
    //                                pnext = parseInt(pnext) + 1;
    //                                if (pnext == 0) pnext = 1;
    //                                pprev = parseInt(pageno) - 1;
    //                                if (pprev == 0) pprev = 1;
    //                                totpage = parseInt(totdata) / parseInt(pagesize);
    //                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
    //                                    totpage = parseInt(totpage) + 1;
    //                                }
    //                                $("#pagnumvalue").attr("max", totpage);
    //                            }
    //                            var tfot = '';
    //                            tfot += '<ul>'
    //                            tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button> </li>'
    //                            if (a.TotalRecord <= length) {
    //                            }
    //                            else if (pageno == 1) {
    //                            }
    //                            else if (pageno == totpage) {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
    //                            }
    //                            else {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
    //                            }
    //                            if (pageno < totpage) {
    //                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                            }
    //                            tfot += '</ul>'
    //                            $("#ptfooter").html("");
    //                            $("#ptfooter").html(tfot);
    //                        }
    //                        html += '<tr><td class="case"> ' + a.Courtname + '</td><td class="court">' + a.CaseType + ' <td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
    //                        html += '<td class="adv"> ' + a.CourtNo + '</td><td class="nh">' + a.JudgeName + '<td>' + a.CauselistDate + '</td>';
    //                        if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
    //                            html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
    //                        }
    //                        else {
    //                            if (a.CauselistDetail.length > 60) {
    //                                html += '<td>'
    //                                html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
    //                                html += '<span data-toggle="collapse" data-target="#dtn' + acounts4 + '" style="color:blue;cursor:pointer"> more</span>'
    //                                html += ' <div id="dtn' + acounts4 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
    //                                html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + acounts4 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
    //                                html += '' + a.CauselistDetail + ''
    //                                html += '</div>'
    //                                html += '</td>'
    //                            }
    //                            else {
    //                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
    //                            }
    //                        }
    //                        html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
    //                        if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
    //                           // html += '<td></td>';
    //                            $("#actioncw3,#actioncw4,#actioncw1,#actioncw12").hide();
    //                        }
    //                        else {
    //                            html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</td>';
    //                        }
    //                        html += '</tr>';
    //                    }); //End of foreach Loop
    //                    $("#abinddatacw4").append(html);
    //                    closeload();
    //                }
    //                if (String(scourt2) == "3") {
    //                    $("#acauselist3").css("display", "");
    //                    $("#acauselist4").css("display", "none");
    //                    $("#acauselist1").css("display", "none");
    //                    var countall3 = 0;
    //                    var length = response.length;
    //                    $.each(response, function (i, a) {
    //                        q = q + 1;
    //                        countall3 = countall3 + 1;
    //                        if (i === 0) {
    //                            firstvalue = a.RowId;
    //                        }
    //                        if (i === (length - 1)) {
    //                            var pnext = pageindex;
    //                            var pprev = pageindex;
    //                            var pageno = pageindex;
    //                            var totdata = a.TotalRecord;
    //                            var totpage = 0;
    //                            if (a.TotalRecord > 0) {
    //                                pnext = parseInt(pnext) + 1;
    //                                if (pnext == 0) pnext = 1;
    //                                pprev = parseInt(pageno) - 1;
    //                                if (pprev == 0) pprev = 1;
    //                                totpage = parseInt(totdata) / parseInt(pagesize);
    //                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
    //                                    totpage = parseInt(totpage) + 1;
    //                                }
    //                                $("#pagnumvalue").attr("max", totpage);
    //                            }
    //                            var tfot = '';
    //                            tfot += '<ul>'
    //                            tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button> </li>'
    //                            if (a.TotalRecord <= length) {
    //                            }
    //                            else if (pageno == 1) {
    //                            }
    //                            else if (pageno == totpage) {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
    //                            }
    //                            else {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
    //                            }
    //                            if (pageno < totpage) {
    //                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                            }
    //                            tfot += '</ul>'
    //                            $("#ptfooter").html("");
    //                            $("#ptfooter").html(tfot);
    //                        }
    //                        html += '<tr><td class="case"> ' + a.Case + '</td><td class="court">' + a.State + ' <td class="cname"> ' + a.District + '</td><td class="bname">' + a.JudgeName + '</td>';
    //                        html += '<td  class="dd"> ' + a.CourtComplexCourtEstablishment + '</td><td>' + a.CauselistDate + '</td>';
    //                        if (a.CauselistDetail == "" || a.CauselistDetail == null || a.CauselistDetail == "null") {
    //                            html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
    //                        }
    //                        else {
    //                            if (a.CauselistDetail.length > 60) {
    //                                html += '<td>'
    //                                html += '<span class="comment more" style="">' + a.CauselistDetail.substring(0, 60) + '</span>'
    //                                html += '<span data-toggle="collapse" data-target="#dtn' + countall3 + '" style="color:blue;cursor:pointer"> more</span>'
    //                                html += ' <div id="dtn' + countall3 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
    //                                html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + countall3 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
    //                                html += '' + a.CauselistDetail + ''
    //                                html += '</div>'
    //                                html += '</td>'
    //                            }
    //                            else {
    //                                html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
    //                            }
    //                        }
    //                        html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
    //                        if (a.CourtNo == "null" || a.CourtNo == null) {
    //                            html += '<td>&nbsp;</td>';
    //                        }
    //                        else {
    //                            html += '<td></td>';
    //                        }
    //                        if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
    //                           // html += '<td></td>';
    //                            $("#actioncw3,#actioncw4,#actioncw1,#actioncw12").hide();
    //                        }
    //                        else {
    //                            html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</td>';
    //                        }
    //                        html += '</tr>';
    //                    }); //End of foreach Loop
    //                    $("#abinddatacw3").html(html);
    //                    closeload();
    //                }
    //                if (String(scourt2) == "7") {
    //                    $("#acauselist1").css("display", "");
    //                    $("#acauselist3").css("display", "none");
    //                    $("#acauselist4").css("display", "none");
    //                    var length = response.length;
    //                    $.each(response, function (i, a) {
    //                        q = q + 1;
    //                        if (i === 0) {
    //                            firstvalue = a.RowId;
    //                        }
    //                        if (i === (length - 1)) {
    //                            var pnext = pageindex;
    //                            var pprev = pageindex;
    //                            var pageno = pageindex;
    //                            var totdata = a.TotalRecord;
    //                            var totpage = 0;
    //                            if (a.TotalRecord > 0) {
    //                                pnext = parseInt(pnext) + 1;
    //                                if (pnext == 0) pnext = 1;
    //                                pprev = parseInt(pageno) - 1;
    //                                if (pprev == 0) pprev = 1;
    //                                totpage = parseInt(totdata) / parseInt(pagesize);
    //                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
    //                                    totpage = parseInt(totpage) + 1;
    //                                }
    //                                $("#pagnumvalue").attr("max", totpage);
    //                            }
    //                            var tfot = '';
    //                            tfot += '<ul>'
    //                            tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
    //                            tfot += '<li><span>|</span></li>'
    //                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button> </li>'
    //                            if (a.TotalRecord <= length) {
    //                            }
    //                            else if (pageno == 1) {
    //                            }
    //                            else if (pageno == totpage) {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
    //                            }
    //                            else {
    //                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
    //                            }
    //                            if (pageno < totpage) {
    //                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                            }
    //                            tfot += '</ul>'
    //                            $("#ptfooter").html("");
    //                            $("#ptfooter").html(tfot);
    //                        }
    //                        html += '<tr><td class="case"> ' + a.Courtname + '</td><td class="court">' + a.CaseType + ' <td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
    //                        html += '<td class="adv"> ' + a.CourtNo + '</td><td class="nh">' + a.JudgeName + '<td>' + a.CauselistDate + '</td>';
    //                        html += '<td>' + a.CauselistDetail + '</td>';
    //                        html += '<td>' + (a.Stage == null ? "" : a.Stage) + '</td>';
    //                        if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
    //                           // html += '<td></td>';
    //                            $("#actioncw3,#actioncw4,#actioncw1,#actioncw12").hide();
    //                        }
    //                        else {
    //                            html += '<td><span style="cursor:pointer;color:#069;" id="viewcasedetails" data-val=' + a.MasterCaseId + ' data-user=' + a.UserCaseId + '>View matter</td>';
    //                        }
    //                        html += '</tr>';
    //                    }); //End of foreach Loop
    //                    $("#abinddatacw1").append(html);
    //                    closeload();
    //                }
    //            }
    //        }, //End of AJAX Success function
    //        failure: function (response) {
    //            alert(response.responseText);
    //            closeload();
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(response.responseText);
    //            closeload();
    //        } //End of AJAX error function
    //    });
    //}
    var fcode = localStorage.getItem("FirmCode");
    /*View case details*/
    $(document).on("click", "#viewcasedetails", function () {
        var caseid = $(this).attr("data-val");
        var usercaseid = $(this).attr("data-user");
        var formdata = new FormData();
        formdata.append("usercaseid", usercaseid);
        $.ajax({
            async: true,
            url: "/CW/GetMatterCaseIdMaptoCW",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response != "") {
                    if (response[0]["MatterID"] == "00000000-0000-0000-0000-000000000000") {
                        var urls = "/" + fcode + "/Firm/Casedetails";
                        url_redirect({
                            url: urls,
                            method: "post",
                            data: { "token": usercaseid }
                        });
                    }
                    else {
                        var urls = "/" + fcode + "/Firm/NewCaseDashboard?type=CW";
                        url_redirect({
                            url: urls,
                            method: "post",
                            data: { token: response[0]["MatterID"] }
                        });
                    }
                }
                else {
                    var urls = "/" + fcode + "/Firm/Casedetails";
                    url_redirect({
                        url: urls,
                        method: "post",
                        data: { "token": usercaseid }
                    });
                }
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    });
});