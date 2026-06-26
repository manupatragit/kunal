$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    /*Bind case subject*/
    function bindcasesubject() {
        $("#casesubjectdrop").empty();
        $("#casesubjectdrop").find('option')
            .remove()
            .end()
            .append('<option value="">Select</option>');
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/Loadcasesubject",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["SubjectName"] + '" >  ' + a["SubjectName"] + '</option>';
                    $("#casesubjectdrop").append(option);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
        return false;
    }
    $('#casesubjectdrop').on('change', function () {
        $('#searchdata2').val($(this).val());
        exportfilter = true;
        loaddatalist(1);
    });
    $('#fstatus').on('change', function () {
        $('#searchdata2').val($(this).val());
        exportfilter = true;
        loaddatalist(1);
    });
    var exportfilter = false;
    /*Export case in excel*/
    $("#excel").click(function () {
        var searchdata = $('#searchdata2').val();
        window.location = encodeURI("/employee/ExportoExcelCase?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Export case in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata2').val();
        window.location = encodeURI("/employee/ExportoPdfCase?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Transfer pages*/
    $(document).on("click", "#transferpage", function () {
        var serial = $(this).attr("sno");
        var transferid = $("#hid" + serial).val();
        var urls = "/" + fcode + "/Employee/MatterSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    $(document).on("click", "#transferpagecase", function () {
        var transferid = $(this).attr("sno");
        var urls = "/" + fcode + "/firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    $(document).on("click", "#cnrcaselink", function () {
        var idstemp = $(this).attr("data-val");
        var caseidtemps = $(this).attr("case-val");
        var urls = "/" + fcode + "/Firm/cnrCasedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": caseidtemps, "cnr": idstemp }
        });
    });
    /*Load case notes*/
    $(document).on("click", "#casenotes", function () {
        openload();
        var caseid = $(this).attr("id-val");
        $("#textcaseidnote").text(caseid);
        loadcasenote();
        $('.nav-pills a[href="#1a1"]').tab('show');
        $('#myModalcasenote').modal({ show: true });
        closeload();
    });
    /*Remove notes*/
    $(document).on("click", "#removenotes", function () {
        var noteid = $(this).attr("id-val");
        if (confirm("Are you sure to remove note entry?")) {
            // your deletion code
            var formData = new FormData();
            formData.append("noteid", noteid);
            //read assign using list
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/removecasenotes",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    new PNotify({
                        title: 'Success!',
                        text: ' Notes has been removed Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    closeload();
                    loadcasenote();
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
    $("#savenote").click(function () {
        var caseid = $("#textcaseidnote").text();
        var notesdetails = CKEDITOR.instances.casenotedetails.getData();
        if (notesdetails == "") {
            alert("please enter notes");
            return false;
        }
        var formData = new FormData();
        formData.append("caseid", caseid);
        formData.append("notes", notesdetails);
        //read assign using list
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/savecasenotes",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                loadcasenote();
                new PNotify({
                    title: 'Success!',
                    text: ' Notes has been saved Successfully',
                    type: 'success',
                    delay: 3000
                });
                closeload();
                CKEDITOR.instances['casenotedetails'].setData(" ");
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
    });
    /*load case note*/
    function loadcasenote() {
        $("#bindatanote").html("");
        var html1 = '';
        var caseid = $("#textcaseidnote").text();
        // alert(caseid);
        var formData = new FormData();
        formData.append("caseid", caseid);
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCasenotes",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html1 += '<tr><td>' + qty1 + '</td><td>' + a.mattername + '</td><td>' + a.notes + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.createdby + '</td><td><a href="javascript:void()" id-val="' + a.Id + '" id="removenotes"><i class="glyphicon glyphicon-trash" style="color:red" title="Remove case note"></i></a></td></tr>';
                });
                $("#bindatanote").append(html1);
                if (qty1 == 0) {
                    $("#stsdatanote").css("display", "block");
                }
                else {
                    $("#stsdatanote").css("display", "none");
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
    /*Validate email*/
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    try {
        $("#sharedocs").click(function () {
            var formdata = new FormData();
            var emailto = $("#shareemail").val();
            if (emailto == "") {
                alert("Please enter the E-mail Id.");
                return false;
            }
            else {
                if (emailto != "") {
                    var emailArray = emailto.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            //  alert("true");
                            vEmails = "true";
                        } else {
                            vEmails = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid email format!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
            }
            if (vEmails == "" || vEmails == "true") {
                formdata.append("email", emailto);
                openload();
                $.ajax({
                    async: true,
                    url: '/firm/SendCaseData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        new PNotify({
                            title: 'Success!',
                            text: ' Data has been sent Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#shareemail").val("");
                        closeload();
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
        closeload();
    }
    $(document).on("click", "#tst", function () {
        openload();
        var caseid = $(this).attr("data-val");
        $("#textcaseid").text(caseid);
        loadcasetime();
        $('#myModalleadcall').modal({ show: true });
    });
    /*Load case calls*/
    function loadcasecall() {
        $("#bindatacall").html("");
        var html1 = '';
        var caseid = $("#textcaseidcall").text();
        //alert(caseid);
        var formData = new FormData();
        formData.append("caseid", caseid);
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCasecalltime",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html1 += '<tr><td>' + qty1 + '</td><td  style="cursor:pointer;color:cornflowerblue" id="transferpagecall" title="View call details"  sno="' + a.Id + '">' + a.csubject + '</td><td>' + a.ctype + '</td><td>' + a.mattername + '</td><td>' + a.cdura + '</td><td width="120px;">' + a.cdetails + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.createdby + '</td></tr>';
                });
                $("#bindatacall").append(html1);
                if (qty1 == 0) {
                    $("#stsdatacall").css("display", "block");
                }
                else {
                    $("#stsdatacall").css("display", "none");
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
    $(document).on("click", "#viewcasecalls", function () {
        openload();
        var caseid = $(this).attr("data-val");
        $("#textcaseidcall").text(caseid);
        loadcasecall();
        var url = "/firm/ConfigCaseCall";
        $('#addcallcontent').load(url);
        $('.nav-pills a[href="#1a1"]').tab('show');
        $('#myModalcasecall').modal({ show: true });
        closeload();
    });
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=case&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    setInterval(function () {
        var tempdata = localStorage.getItem("setname1");
        if (tempdata != "") {
            loadtabledata();
            loadcasetime();
            localStorage.setItem("setname1", "");
            //alert(tempdata);
        }
    }, 4000);
    /*Load case time*/
    function loadcasetime() {
        $("#assignuserdata").html("");
        var html = '';
        var caseid = $("#textcaseid").text();
        var formData = new FormData();
        formData.append("caseid", caseid);
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCasetime",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                //  alert(datas1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    //  alert(a.ppermission);
                    html += '<tr><td>' + qty1 + '</td><td>' + a.mattername + '</td><td>' + formatTimeEntry(a.callDura) + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.createdby + '</td></tr>';
                });
                $("#assignuserdata").append(html);
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
    $("#linkmatter").click(function () {
        window.location = encodeURI("/" + fcode + "/Employee/Configmatter/matter");
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();
    $(document).on("click", "#delete", function () {
        deletematter();
        function deletematter() {
            var result = confirm("Are you sure to save delete case request?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                        // alert(JSON.stringify(selectedID));
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    //  alert("hi");
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/EmployeeApi/RemoveMatter',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                if (response.Data != "") {
                                    new PNotify({
                                        title: 'Success!',
                                        text: ' Case remove request saved successfully',
                                        type: 'success',
                                        delay: 3000
                                    });
                                    // alert(datas);
                                    // alert("deleted");
                                    loadtabledata();
                                    $('.pagination').hide();
                                    $('#maxRows option').prop('selected', function () {
                                        return this.defaultSelected;
                                    });
                                    closeload();
                                }
                                else {
                                    new PNotify({
                                        title: 'Warning!',
                                        text: ' You are not Authotized to delete this Case !',
                                        type: 'error',
                                        delay: 2000
                                    });
                                    closeload();
                                }
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' You are not Authotized to delete this Matter !',
                                    type: 'error',
                                    delay: 2000
                                });
                                closeload();
                            }
                        },
                        error: function () {
                            new PNotify({
                                title: 'Warning!',
                                text: ' Oops, Please Contact to Administrator',
                                type: 'error',
                                delay: 2000
                            });
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    if (type == "8") {
        $("#updatePanel").css("display", "block");
    }
    else {
        $("#updatePanel").css("display", "hide");
    }
    $('#sortdata').on('change', function () {
        var sort = $('#example').attr("sort");
        var svalue = $(this).val();
        if (svalue == "") {
            new PNotify({
                title: 'Warning!',
                text: ' Please Select value for sort data',
                type: 'error',
                delay: 2000
            });
        }
        else {
            //alert(sort);
            alert(svalue);
        }
    });
    loadtabledata();
    setTimeout(function () {
        var urlpath = location.pathname.split('/');
        var activityname = urlpath[5];
        if (activityname != "") {
            if (activityname == "Pending") {
                fsearchUrl("Pending");
                $('#fstatus option[value="Pending"]').attr("selected", true);
            }
        }
    }, 4000);

    //search data
    var d3 = "ok";
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    loaddatalist(pageindex);
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
    var chksflag = true;
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        /* your code here */
        exportfilter = true;
        loaddatalist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#searchdata2', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                exportfilter = false;
                loaddatalist(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    //load table data
    openload();
    var countcustomfoeld = "";
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        var sort = 12;
        $table = $('<table id="example" border="1px solid" class="" sort="" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table table-bordered table-striped');
        var rt1 = $.ajax({
            async: true,
            type: 'POST',
            //url: '/api/Demo/SpColMaps1', '
            url: '/api/demo/FirmEmployees1',
            headers: {
                // 'fid': type
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    //alert(datas);
                    countcustomfoeld = obj.length;
                    $header = $('<thead  >').html('');
                    // $head1 = $('<th><input type="checkbox" id="select_all" width="15%"/></th><th  onclick="sortTable(1)" class="fname" id="facility_header"  width="">Case Name &nbsp;<span class="fa fa-sort pull-right"></span></th><th onclick="sortTable(2)" class="cname"  width="">Client/Lead Name &nbsp;<span class="fa fa-sort pull-right"></span></th><th onclick="sortTable(3)"  class="cstatus"  width="">Status &nbsp;<span class="fa fa-sort pull-right"></span></th><th onclick="sortTable(4)" class="tst"  width="">Time Spent &nbsp;<span class="fa fa-sort pull-right"></span></th><th onclick="sortTable(5)" class="auserto"  width="">Assign To &nbsp;<span class="fa fa-sort pull-right"></span></th><th onclick="sortTable(6)" class="auserby"  width="">Created By &nbsp;<span class="fa fa-sort pull-right"></span></th><th onclick="sortTable(7)" class="tags">Tags<span class="fa fa-sort pull-right"></span></th><th onclick="sortTable(8)" class="odate"  width="">Open Date &nbsp;<span class="fa fa-sort pull-right"></span></th><th  onclick="sortTable(9)" width="" class="cdate">Close Date &nbsp;<span class="fa fa-sort pull-right"></span></th><th  width="" class="document" align="center">Document &nbsp;</th><th class="casedetails"  width="" align="center">Case Details &nbsp;</th> ');
                    $head1 = $('<th bgcolor="DIMGRAY"><input type="checkbox" id="select_all" width="1%"/></th><th bgcolor="DIMGRAY" onclick="sortTable(1)"  class="fname"   width="15%;">Case Name &nbsp;<span class="fa fa-sort pull-right"></span></th><th bgcolor="DIMGRAY" onclick="sortTable(2)" class="cname" >' + clientlable + '/Prospect Name &nbsp;<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(3)"  class="cstatus"  width="80px;">Status &nbsp;<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(4)"  class="casesubject"  width="80px;">Case Subject &nbsp;<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(5)" class="tst"  width="100px;">Time Spent &nbsp;<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(6)" class="auserto"  width="100px;">Assign To &nbsp;<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(7)" class="auserby">Created By<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY" onclick="sortTable(8)" class="tags"  width="100px;">Tags &nbsp;<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY"  onclick="sortTable(9)" width="100px;" class="odate">Open Date &nbsp;<span class="fa fa-sort "></span></th><th bgcolor="DIMGRAY"  onclick="sortTable(10)" width="100px;" class="cdate">Close Date &nbsp;<span class="fa fa-sort "></span></th><th class="casedetails"  width="" align="center">Case Details &nbsp;</th><th bgcolor="DIMGRAY"   class="document">Document &nbsp;</th><th bgcolor="DIMGRAY" class="notes">Calls/Notes &nbsp;</th> ');
                    $header.append($head1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        sort = sort + 1;
                        $header.append('<th bgcolor="DIMGRAY" onclick="sortTable(' + sort + ')"  style="text-align: center; padding-top: 12px;" class="class' + q1 + '">' + val.FieldName + ' <span class="fa fa-sort pull-right"></span></th>');
                        // alert(val.column_name);
                    });
                    $header.append('<th bgcolor="DIMGRAY"  style="text-align: center; padding-top: 12px;"> Linked Case</th>');
                    // $tbc = $('</tr>');
                    //$header.append($tbc);
                    $header.append('</thead>');
                    $table.append($header);
                    $table.append('<tbody style="clear:both" id="loadactivitydatas">');
                    $('#updatePanel').html($table);
                }
                else {
                    //alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            loadmenu();
            loaddatalist(pageindex);
            bindcasesubject();
        });
    }
    flaghide = true;
    function loaddatalist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata2').val());
        var ld12 = $.ajax({
            async: true,
            url: '/api/EmployeeApi/SpMatterData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#tfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                    // alert(response.Data);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                //if (datas.Data == null) {
                //    alert(datas.data);
                //}
                if (response.Data.length > 2) {
                    //  alert(response.Data.length);
                    $("#datastatus").html("");
                }
                else {
                    // alert(response.Data.length);
                    $("#datastatus").html("No result found !");
                }
                var qty = 0;
                var it = 2;
                var q = 0;
                var firstvalue = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (val.totRow > 0) {
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
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + val.rownum + '</b> of <b style="font-size:12px;">' + val.totRow + ' Entries</b>'
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
                    q = q + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + q + '" value="' + val.Id + '">')
                    qty = qty + 1;
                    it = it + 1;
                    // alert(val.UserCaseid);
                    if (val.UserCaseid != null) {
                        btnclass = "details";
                        usercaseid = "";
                        fileiconcase = "glyphicon glyphicon-book";
                    }
                    else {
                        btnclass = "";
                        usercaseid = "";
                        fileiconcase = "";
                    }
                    //if (val.cfile != null) {
                    btnclassdocs = "  ";
                    userdocs = "";
                    fileicon = "glyphicon glyphicon-folder-open";
                    if (val.IsDelete == "1") {
                        deleterqst = "trcolor";
                    }
                    else {
                        deleterqst = "";
                    }
                    var tst = val.TotalCaseTime == null ? '' : val.TotalCaseTime;
                    var $row = $('<tr class="' + deleterqst + '" />');
                    $row.append($('<td class="" />').html("<span>&nbsp;<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.Id + "'/>"));
                    $row.append($('<td class="fname" />').html("<a  name=" + val.mname + " id='transferpage' href='javascript:void()' sno=" + q + "><span>" + (val.mname != null ? val.mname : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cname" />').html("<span><span>" + (val.UserName != null ? val.UserName : '')));
                    $row.append($('<td class="cstatus" />').html("<span>" + (val.cstatus != null ? val.cstatus : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="casesubject" />').html("<span>" + (val.CaseSubject != "" ? val.CaseSubject : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="tst" />').html("<span style='font-weight:bold;cursor:pointer' id='tst' data-val='" + val.Id + "'>" + (tst != null ? tst : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="auserto" />').html("<span>" + (val.assignuserto != null ? val.assignuserto : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="auserby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="tags" />').html("<span>" + (val.tags != "" ? val.tags : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="odate" />').html("<span  name='" + val.odate + "'>" + (val.odate != null ? formatDatetoIST(val.odate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cdate" />').html("<span  name='" + val.cdate + "'>" + (val.cdate != null ? formatDatetoIST(val.cdate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="casedetails"  />').html("<a  class='" + btnclass + " ' style='' id='transferpagecase' href='javascript:void()' sno=" + val.UserCaseid + "><span class='" + fileiconcase + "' align='center'> " + usercaseid + " </span></a>"));
                    $row.append($('<td class="document" />').html("<a  class='" + btnclassdocs + " ' style='' href='javascript:void(0)' id='filelink'   id-val='" + val.Id + "'><span class='" + fileicon + "'>" + userdocs + " </span></a>"));
                    $row.append($('<td class="" />').html("<a  id='viewcasecalls' data-val='" + val.Id + "' class='" + btnclass + " '  href='javascript:void(0)' title='Calls'><span class='glyphicon glyphicon-earphone' align='center'>  </span></a>&nbsp;&nbsp;&nbsp;<a  class='" + btnclass + " ' style='' href='javascript:void(0)' id-val='" + val.Id + "' id='casenotes' title='Add Notes'><span class='fa fa-comment' align='center'>  </span></a>"));
                    var countcf = countcustomfoeld;
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    if (String(val.CNRCase) != "") {
                        $row.append($('<td/>').html("<a style='cursor:pointer' id='cnrcaselink' case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href='javascript:void()'>&nbsp;" + val.CNRCase + "</a>"));
                    }
                    else {
                        $row.append($('<td/>').html("<span>&nbsp;</span>"));
                    }
                    $("#loadactivitydatas").append($row);
                });
                // hideEmptyCols($("#example"));
            },
            error: function () {
                // alert('Error!');
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            //if (flaghide == true) {
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            $("input:checkbox").click(function () {
                var column = "table ." + $(this).attr("name");
                $(column).toggle();
            });
            closeload();
        });
    }
    function hideEmptyCols(table) {
        //  alert(table);
        //counti # of columns
        var numCols = $("th", table).length;
        //   alert(numCols);
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
                //$("th:nth-child(" + i + ")", table).hide(); //hide header <th>
            }
        }
    }
    var q = 2;
    //loadmenu();
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            //url: '/api/Demo/SpColMaps1', '
            url: '/api/demo/FirmEmployees1',
            headers: {
                // 'fid': type
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $.each(obj, function (i, a) {
                    q = q + 1;
                    // var option = ' <li><a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li>';
                    //var option = '<option value="' + a["Id"] + '" formatter="' + a["Formatter"] + '" defaultvalues="' + (a["DefaultValues"] === null ? "" : a["DefaultValues"]) + '" aurl="' + (a["Url"] === null ? "" : a["Url"]) + '">' + a["Text"] + '</option>';
                    var option = '<li><a href="#" class="small" data-value="option' + q + '" tabIndex="-1"><input  type="checkbox"  name="class' + q + '" >' + a["FieldName"] + '</a></li>';
                    $("#bd").append(option);
                    //var option2 = '<option value="' + a["column_name"] + '" >  ' + a["column_name"] + '</option>';
                    //$("#sortdata").append(option2);
                    // alert("d");
                    //  alert(a.Id);
                }); //End of foreach Loop
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
});
