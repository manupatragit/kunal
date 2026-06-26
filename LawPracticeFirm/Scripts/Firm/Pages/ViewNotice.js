$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    /*Export timer list in excel*/
    $("#excel").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoExcelTimerList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Export timer list in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoPdfTimerList?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter);
    })
    /*Edit notice*/
    $(document).on("click", "#editnotice", function () {
        var transferid = $(this).attr("idval");
        var urls = "/" + fcode + "/notice/EditNotice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    $("#linknotice").click(function () {
        window.location = encodeURI("/" + fcode + "/Notice/CreateNOtice");
    });
    /*Print*/
    $(document).on("click", "#print1", function () {
        var id = $(this).attr("idval");
        DivID = $("#print" + id).attr("id");
        var disp_setting = "toolbar=yes,location=no,";
        disp_setting += "directories=yes,menubar=yes,";
        disp_setting += "scrollbars=yes,width=650, height=600, left=100, top=25";
        var content_vlue = document.getElementById(DivID).innerHTML;
        var docprint = window.open("", "", disp_setting);
        docprint.document.open();
        docprint.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"');
        docprint.document.write('"https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
        docprint.document.write('<html xmlns="https://www.w3.org/1999/xhtml" xml:lang="en">');
        docprint.document.write('<head><title>My Title</title>');
        docprint.document.write('<style type="text/css">body{ margin:0px;');
        docprint.document.write('font-family:verdana,Arial;color:#000;');
        docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
        docprint.document.write('a{color:#000;text-decoration:none;} </style>');
        docprint.document.write('</head><body onLoad="self.print()">');
        docprint.document.write(content_vlue);
        docprint.document.write('</body></html>');
        docprint.document.close();
        docprint.focus();
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedIDSync = new Array();
    /*Save Sync Row Data*/
    $(document).on("click", "#syncrqst", function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", "timer");
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data sync request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            loaddatalist(pageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                    }
                });
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
    var selectedID = new Array();
    $(document).on("click", "#delete", function () {
        selectedID = [];
        deletetime();
        /*Delete time*/
        function deletetime() {
            var result = confirm("Are you sure to delete Notice?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveTimeEntry',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Case Time Entry Remove Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadtabledata();
                                $('.pagination').hide();
                                $('#maxRows option').prop('selected', function () {
                                    return this.defaultSelected;
                                });
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warn!ng',
                        text: 'You have not selected any row to delete?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
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
    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        // alert(search);
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    openload();
    loaddatalist(pageindex);
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
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
        /* your code here */
        exportfilter = true;
        loaddatalist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#searchdata', function () {
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
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });

    //load table data
    flaghide = true;
    function loaddatalist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadNoticebyrowid',
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
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    closeload();
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    closeload();
                }
                else {
                    $("#datastatus").html("No result found !");
                    closeload();
                }
                var it = 2;
                var qty = 0;
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
                    qty = qty + 1;
                    if (val.FileCount == "0") {
                        mfile = "#"
                        paperclip = "";
                        fileview = "display:none";
                    }
                    else {
                        mfile = val.mfile;
                        paperclip = "<i class='fa fa-paperclip'></i>";
                        fileview = "display:unset";
                    }
                    if (val.NoticeBody == null) {
                        Mbody = "";
                    }
                    else {
                        Mbody = val.NoticeBody;
                    }
                    var $row1 = '<div data-type="accordion-section" id="maindiv' + val.Id + '" class="search" style="cursor: pointer;border-left: 1px solid gray;border-right: 1px solid gray;border-bottom: 1px solid lightgray; overflow:hidden;margin:0 0 5px 0;" >' +
                        ' <table   data-type="accordion-section-title"   class="dataTable table style="border:0;background: white !important; " id="readtableid" val-id="' + val.Id + '"><tr><th align="left" width="52%"><i class="glyphicon glyphicon-list-alt" style="color:orange"></i> <span class="read' + val.Id + '" id="title' + val.Id + '" >' + val.Subject + '</span></th><th width="20%" align="left"><span class="read' + val.Id + '" id="read' + val.Id + '">' + val.CreatedBy + '</span></th><th width="5%" align="left"><span class="read' + val.Id + '">' + paperclip + '  </span><span style="display:none" id="noticemailbody' + val.Id + '">' + val.NoticeBody + '</span></th><th width="20%" align="left"  data-type="accordion-section-date"  > <span name="' + val.date_time + '" class="read' + val.Id + '">' + formatDatetoIST(val.date_time) + '&nbsp; ' + val.date_time.substring(11, 19) + '</span></th></tr></table>' +
                        ' ' +
                        '<div id="maindiv1' + val.Id + '" data-type="accordion-section-body" style="cursor:default" >' +
                        '<div class="mailbox-controls  with-border " style="padding:15px 0 15px 0;">' +
                        '<div class="btn-group ">' +
                        '</div>' +
                        '</div>' +
                        '<div style="padding-left: 15px;padding-right:15px;" class="buttonclass">' +
                        ' <button type="button" id="reply" idval="' + val.Id + '" class="btn btn-success btn-mail"><i class="fa fa-reply"></i> Reply</button>' +
                        ' <button type="button" class="btn btn-danger btn-mail"  title="Delete" idval="' + val.Id + '" id="removenotice"><i class="glyphicon glyphicon-trash"></i>&nbsp;</button>' +
                        ' <button type="button" class="btn btn-warning btn-mail" id="print1" data-toggle="tooltip" title="Print" idval="' + val.Id + '"><i class="glyphicon glyphicon-print"></i>&nbsp;</button>' +
                        ' <button type="button" class="btn btn-info btn-mail" id="editnotice" data-toggle="tooltip" title="Edit Notice" idval="' + val.Id + '"><i class="glyphicon glyphicon-pencil"></i>&nbsp;</button>' +
                        '<div  id="replyAllbox' + val.Id + '" style="display:none"><textarea id="replytext' + val.Id + '" style="margin: 0px; width: 476px; height: 74px;" cols="10" rows="5"></textarea>' +
                        '<div style="width:100%; padding:10px 0">' +
                        'Reply To<span class="required" style="color:red" aria-required="true">*</span><input class="form-control" name="emailsto" id="emailto' + val.Id + '" type="text" multiple placeholder="Enter Emails to send notice" />' +
                        '</div>' +
                        '<div class="grid-container" style="display:none;">' +
                        '<div id="editor">' +
                        '</div>' +
                        '</div > ' +
                        '<div style="width:25%; padding:30px 0">' +
                        'Select Deadline <input class="form-control" name="deadline" id="deadline' + val.Id + '" type="date" multiple placeholder="Select Deadline" />' +
                        '</div>' +
                        '<div style="widht:100%; padding:20px 0;clear:both">' +
                        '<input class="" name="postedFile" id="postedFile' + val.Id + '" type="file" multiple placeholder="Add description..." />' +
                        '</div>' +
                        '<div style="widht:100%">' +
                        '<input type="button" id="savereply" idval="' + val.Id + '" userval="' + val.userid + '" class="btn btn-mail save sh' + val.Id + '" style="padding:5px; !Important" value="Send">' +
                        '&nbsp;&nbsp;&nbsp;<input type="button" id="closereply" class="btn btn-mail save" value="Close" idval="' + val.Id + '" style="padding:5px; !Important">' +
                        '</div>' +
                        ' </div>' +
                        ' </div>' +
                        '<section class="content" id="print' + val.Id + '"  style="margin-top:10px;">' +
                        '<div id="replydata' + val.Id + '" class="replydata">' +
                        '</div>' +
                        '<div class="col-md-12" style="padding-left:0px;padding-right:0px;text-align:justify;">' +
                        '<div class=" ">' +
                        '<div class="box-body no-padding">' +
                        '<div class="mailbox-read-info"  >' +
                        '<h4 style="margin-bottom:10px;">  <b>Subject:</b> ' + val.Subject + '</h4>' +
                        '<p> <b>Created By :</b> ' + val.CreatedBy + '</p>' +
                        '<p> <b>Notice Date : </b> ' + formatDatetoIST(val.NoticeDate) + '&nbsp; ' + val.date_time.substring(11, 19) + '</p>' +
                        '<p> <b> Assign To : </b> <span>' + val.AssignUsers + '</span></p>' +
                        '</div><hr style="border-top:1px solid #c5baba;">' +
                        '<div class="mailbox-read-message" style="margin-top:10px;"> ' + Mbody + '' +
                        '</div>' +
                        '</div></div></div>' +
                        ' <div class="box-footer">' +
                        ' <ul class="mailbox-attachments clearfix" id="viewattachfile' + val.Id + '" style="' + fileview + '">' +
                        ' </ul>' +
                        ' </div>' +
                        '</section>' +
                        '</div>';
                    $('#accordion').append($row1);
                    $("#maindiv" + val.Id).find("[data-type='accordion-section-body']").css("display", "none");
                    var q = 0;
                    var dfilename = "";
                    var string1 = "";
                    var string2 = "";
                    if (String(val.FilesNameList) != "#") {
                        var str_array = val.FilesNameList.split(',');
                        var html = '';
                        for (var i = 0; i < str_array.length; i++) {
                            q = q + 1;
                            str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
                            dfilename = String(str_array[i]).substring(str_array[i].lastIndexOf("/") + 1);
                            var idx = String(dfilename).lastIndexOf(".");
                            if (idx != -1)
                                string1 = dfilename.substring(0, idx);
                            string2 = dfilename.substring(idx + 1);
                            string1 = string1.substring(0, string1.length - 10);
                            dfilename = string1 + "." + string2;
                            html += str_array[i];
                            var ftoken = "/DownloadFile.ashx?module=modulenotice&ftoken=" + str_array[i] + "&fid=" + val.Id;
                            // Add additional code here, such as:
                            var $row = $('<div>');
                            $row.append($('<div>').html("<div class='mailbox-attachment-info' >"));
                            $row.append($('<div>').html("<a name='file' href='" + ftoken + "' download='" + dfilename + "' target='_blank'   class='mailbox-attachment-name' title='File Attachment-click here to download'><i class='fa fa-paperclip'></i> " + q + ". " + dfilename + "  Attached.</a>"));
                            $row.append($('<div>').html("</div>"));
                            $("#viewattachfile" + val.Id).append($row);
                        }
                    }
                    CKEDITOR.replace('replytext' + val.Id, {
                        toolbar:
                            [
                                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'justify', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                                { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
                                { name: 'tools', items: ['Maximize'] },
                                { name: 'styles', items: ['Styles', 'format', 'Font', 'FontSize'] },
                                { name: 'colors', items: ['TextColor', 'BGColor'] },
                                { name: 'links', items: ['Link', 'Unlink', 'Anchor'] }
                            ],
                        height: 80
                    });
                    loadreplydata(val.Id);
                });
                $(function () {
                    $("#accordion").accordion({
                        active: false,
                        collapsible: true, heightStyle: "content"
                    });
                });
                closeload();
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    $(document).on("click", "#reply", function () {
        var id = $(this).attr("idval");
        $("#replyAllbox" + id).css("display", "unset");
        $(".ash" + id).css("display", "none");
        $(".sh" + id).css("display", "unset");
    });
    $(document).on("click", "#closereply", function () {
        var id = $(this).attr("idval");
        $("#replytext" + id).val(null)
        document.getElementById("postedFile" + id).value = null;
        $("#replyAllbox" + id).css("display", "none");
    });
    function checkEmail(email) {
        // var regExp = /(^[a-z][0-9]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }

    /*Save reply notice*/
    $(document).on("click", "#savereply", function () {
        var id = $(this).attr("idval");
        var userid = $(this).attr("userval");
        var datad = "replytext" + id;
        var bodydata = $("#noticemailbody" + id).html();
        var editorname = CKEDITOR.instances[datad].getData();
        var newcontent = bodydata;
        var emailto = $("#emailto" + id).val();
        var deadline = $("#deadline" + id).val();
        var formData = new FormData();
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("postedFile" + id).files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("postedFile" + id).files[i];
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
        formData.append("details", editorname);
        formData.append("newdetails", newcontent);
        formData.append("mid", id);
        formData.append("auser", emailto);
        formData.append("deadline", deadline);
        if (editorname == "") {
            new PNotify({
                title: 'Warning!',
                text: ' Please enter text in reply box',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        if (emailto == "") {
            new PNotify({
                title: 'Warning!',
                text: ' Please enter Email to reply.',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        if (emailto != "") {
            var emailArray = emailto.split(",");
            for (i = 0; i <= (emailArray.length - 1); i++) {
                if (checkEmail(emailArray[i])) {
                    vEmails = "true";
                } else {
                    vEmails = "false";
                    new PNotify({
                        title: 'Warning!',
                        text: ' Invalid email format in To email!',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
            }
        }
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/ReplyNotice", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    document.getElementById("postedFile" + id).value = null;
                    CKEDITOR.instances[datad].setData("");
                    $("#emailto" + id).val("");
                    $("#replyAllbox" + id).css("display", "none");
                    Id = id;
                    $('#replydata' + id).html("");
                    loadreplydata(id);
                    new PNotify({
                        title: 'Success!',
                        text: ' Reply Send Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    closeload();
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                    closeload();
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                    closeload();
                } //End of AJAX error function
            });
    });
    function loadreplydata(token) {
        var $table = '';
        var $table1 = '';
        var $header = '';
        var dt = '';
        var q1 = 0;
        var formData = new FormData();
        var fcode = localStorage.getItem("FirmCode");
        try {
            $.ajax({
                async: true,
                url: '/api/CallApi/LoadReplyNotice',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                headers: { "mid": token },
                dataType: 'json',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    else {
                        alert("not found");
                    }
                    if (response.Data.length > 2) {
                        $("#datastatus").html("");
                    }
                    else {
                    }
                    var it = 2;
                    var filename = "";
                    try {
                        $.each(obj, function (i, val) {
                            desired2 = String(val.date_time).replace(/[^\w\s]/gi, '')
                            datetime = val.date_time;
                            it = it + 1;
                            if (val.FileCount != null) {
                                btnclass = "btn btn-success details";
                                usercaseid = "View";
                            }
                            else {
                                btnclass = "";
                                usercaseid = "";
                            }
                            if (val.FileCount != null) {
                                mfile = val.FilesNameList;
                                fileview1 = "display:unset";
                                fileattach = "1 File Attached.";
                            }
                            else {
                                mfile = "#"
                                fileview1 = "display:none";
                                fileattach = "";
                            }
                            var ids = val.date_time.substring(0, 10) + val.date_time.substring(11, 19);
                            var desired = String(ids).replace(/[^\w\s]/gi, '')
                            var $row1 =
                                '<section class="reply sectionclass' + desired + '"  id="readdate' + desired2 + '" readdate="' + desired2 + '">' +
                                '<div class="col-md-12">' +
                                '<div class=" ">' +
                                '<div class="box-body no-padding">' +
                                '<div class="mailbox-read-info">' +
                                '<p> <b>To : </b>' + val.ReplyTo + '</p>' +
                                '<p> <b>Created By : </b>' + val.CreatedBy + '</p>' +
                                '<p datavalue="' + val.date_time + '" id="dateid' + val.Rid + '"><b>Sent : </b>' + formatDatetoIST(val.date_time) + '&nbsp; ' + val.date_time.substring(11, 19) + '</p>' +
                                '</div>' +
                                '<div class="mailbox-read-message"> ' + val.ReplyBody + '' +
                                '</div>' +
                                '</div>' +
                                ' <div class="box-footer">' +
                                ' <ul class="mailbox-attachments clearfix" id="viewattachfilereply' + token + val.Rid + '" style="' + fileview1 + '">' +
                                '</li>' +
                                ' </ul>' +
                                ' </div>' +
                                ' <br>' +
                                '</div > ' +
                                '</section>';
                            $('#replydata' + token).append($row1);
                            var q1 = 0;
                            try {
                                if (String(mfile) != "") {
                                    var str_array1 = mfile.split(',');
                                    var html1 = '';
                                    for (var i = 0; i < str_array1.length; i++) {
                                        q1 = q1 + 1;
                                        str_array1[i] = str_array1[i].replace(/^\s*/, "").replace(/\s*$/, "");
                                        dfilename1 = String(str_array1[i]).substring(str_array1[i].lastIndexOf("/") + 1);
                                        var idx1 = String(dfilename1).lastIndexOf(".");
                                        if (idx1 != -1)
                                            string11 = dfilename1.substring(0, idx1);
                                        string21 = dfilename1.substring(idx1 + 1);
                                        string11 = string11.substring(0, string11.length - 10);
                                        dfilename1 = string11.concat("." + string21)
                                        html1 += str_array1[i];
                                        var ftoken = "/DownloadFile.ashx?module=modulereplynotice&ftoken=" + str_array1[i] + "&fid=" + token;
                                        // Add additional code here, such as:
                                        var $row1 = $('<div>');
                                        $row1.append($('<div>').html("<div class='mailbox-attachment-info ' >"));
                                        $row1.append($('<div>').html("<a name='file' href='" + ftoken + "' download='" + dfilename1 + "' target='_blank'   class='mailbox-attachment-name' title='File Attachment-click here to download'><i class='fa fa-paperclip'></i> " + q1 + ". " + dfilename1 + "  Attached.</a>"));
                                        $row1.append($('<div>').html("</div>"));
                                        $("#viewattachfilereply" + token + val.Rid).append($row1);
                                    }
                                }
                            }
                            catch (err) {
                                alert(err.message);
                            }
                            mids = val.Rid;
                            var ids = val.date_time.substring(0, 10) + val.date_time.substring(11, 19);
                            var desired = String(ids).replace(/[^\w\s]/gi, '')
                            $('.sectionclass' + desired + ':not(:first)').remove();
                        });
                    }
                    catch (err) {
                        alert(err.message);
                    }
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });
        }
        catch (err1) {
            alert(err1.message);
        }
    }

/*Remove notice*/
    $(document).on("click", "#removenotice", function () {
        selectedID = $(this).attr("idval");
        var result = confirm("Are you sure to delete this notice?");
        if (result) {
            if (selectedID != "") {
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/RemoveNotice',
                    headers: { "sid": selectedID },
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function (response) {
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Notice Removed Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#maindiv" + selectedID).hide();
                            $("#maindiv1" + selectedID).hide();
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        alert('Error!');
                        closeload();
                    }
                });
            }
        }
    });
});
