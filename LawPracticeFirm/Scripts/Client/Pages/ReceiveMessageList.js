$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    /*Link to create new lead*/
    $("#linklead").click(function () {
        window.location = encodeURI("/" + fcode + "/client/CreateLead");
    });
    /*Link to compose message*/
    $("#composemessage").click(function () {
        window.location = encodeURI("/" + fcode + "/client/composemessage");
    });
    /*Link to select all message*/
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    /*Update message status*/
    $(document).on("click", "#readtableid", function () {
        var sid = $(this).attr("val-id");
        $(".read" + sid).css("font-weight", "normal");
        $.ajax({
            async: true,
            url: '/api/CallApi/StatusMessageUpdate',
            headers: { "sid": sid },
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    loadMessageCount();
                }
                else {
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
    /*Remove message*/
    $(document).on("click", "#removemessage", function () {
        selectedID = $(this).attr("idval");
        var result = confirm("Are you sure to  delete this message?");
        if (result) {
            if (selectedID != "") {
                $.ajax({
                    async: true,
                    url: '/api/CallApi/RemoveMessage',
                    headers: { "sid": selectedID },
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function (response) {
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Message Removed Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#maindiv" + selectedID).hide();
                            $("#maindiv1" + selectedID).hide();
                        }
                        else {
                        }
                    },
                    error: function () {
                        alert('Error!');
                    }
                });
            }
        }
    });
    function openload() {
        $('#myOverlay').css("display", "unset");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    if (type == "7") {
        $("#updatePanel").css("display", "block");
    }
    else {
        $("#updatePanel").css("display", "hide");
    }
    $(function () {
        //  $("#accordion").accordion("option", "active", 1);
        // $("#accordion").accordion({ header: "#maindiv117", collapsible: true, active: false });
    });
    /*search data*/
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    loadtabledata(pageindex);
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
    $(document).on('click', '#paginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        loadtabledata(pageindex);
    });
    loadtabledata(pageindex);
    /*load table data*/
    var mids = 0;
    function loadtabledata(pageindex) {
        $("#accordion").html("");
        var $table = '';
        var $table1 = '';
        var $header = '';
        var dt = '';
        var q1 = 0;
        openload();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadReceiveMessagebyrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#tfooter").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {

                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                }
                else {
                    $("#datastatus").html("No result found !");
                }
                var it = 2;
                var filename = "";
                try {
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
                        mids = val.mid;
                        it = it + 1;
                        if (val.mfile != null) {
                            btnclass = "btn btn-success details";
                            usercaseid = "View";
                        }
                        else {
                            btnclass = "";
                            usercaseid = "";
                        }
                        if (val.mmatter != null) {
                            mattername = val.mattername;
                        }
                        else {
                            mattername = "";
                        }
                        if (val.mfile == null || val.mfile == "") {
                            mfile = "#"
                            paperclip = "";
                            fileview = "display:none";
                        }
                        else {
                            mfile = val.mfile;
                            paperclip = "<i class='fa fa-paperclip'></i>";
                            fileview = "display:unset";
                        }
                        if (String(val.mbody).search("mailbox-attachment-name") == "-1" && (val.mfile == null || val.mfile == "")) {
                            paperclip = "";
                        }
                        else {
                            paperclip = "<i class='fa fa-paperclip'></i>";
                        }
                        if (val.mbody == null) {
                            Mbody = "";
                        }
                        else {
                            Mbody = val.mbody;
                        }
                        var $row1 = '<div data-type="accordion-section" id="maindiv' + val.mid + '" class="search" style="cursor: pointer;border-left: 1px solid gray;border-right: 1px solid gray;border-bottom: 1px solid lightgray; overflow:hidden;margin:0 0 5px 0;" >' +
                            ' <table   data-type="accordion-section-title"   class="dataTable table style="border:0;background: white !important; " id="readtableid" val-id="' + val.mid + '"><tr><th align="left" width="52%"><i class="glyphicon glyphicon-envelope" style="color:orange"></i> <span class="read' + val.mid + '" id="title' + val.mid + '" >' + val.msubject + '</span></th><th width="20%" align="left"><span class="read' + val.mid + '" id="read' + val.mid + '">' + val.UserName + '</span></th><th width="5%" align="left"><span class="read' + val.mid + '">' + paperclip + '  </span><span style="display:none">' + val.mbody + '</span></th><th width="20%" align="left"  data-type="accordion-section-date"  > <span name="' + val.date_time + '" class="read' + val.mid + '">' + formatDatetoIST(val.date_time) + '&nbsp; ' + val.date_time.substring(11, 19) + '</span></th></tr></table>' +
                            ' ' +
                            '<div id="maindiv1' + val.mid + '" data-type="accordion-section-body" style="cursor:default" >' +
                            '<div class="mailbox-controls  with-border " style="padding:15px 0 15px 0;">' +
                            '<div class="btn-group ">' +
                            '</div>' +
                            '</div>' +
                            '<div style="padding-left: 15px;padding-right:15px;">' +
                            ' <button type="button" id="replyAll" idval="' + val.mid + '" class="btn btn-success btn-mail"><i class="fa fa-reply"></i> Reply All</button>' +
                            ' <button type="button" id="reply" idval="' + val.mid + '" class="btn btn-success btn-mail"><i class="fa fa-reply"></i> Reply</button>' +
                            ' <button type="button" id="forword" idval="' + val.mid + '" class="btn btn-info btn-mail"><i class="glyphicon glyphicon-share-alt"></i> Forward</button>' +
                            ' <button type="button" class="btn btn-danger btn-mail"  title="Delete" idval="' + val.mid + '" id="removemessage"><i class="glyphicon glyphicon-trash"></i>&nbsp;</button>' +
                            ' <button type="button" class="btn btn-warning btn-mail" id="print1" data-toggle="tooltip" title="Print" idval="' + val.mid + '"><i class="glyphicon glyphicon-print"></i>&nbsp;</button>' +
                            ' <button type="button" id="archivemsg" idval="' + val.mid + '" class="btn btn-primary btn-mail"><i class="fa fa-archive"></i> Archive</button>' +
                            '<div  id="replyAllbox' + val.mid + '" style="display:none"><textarea id="replytext' + val.mid + '" style="margin: 0px; width: 476px; height: 74px;" cols="10" rows="5"></textarea>' +
                            '<div class="grid-container" style="display:none">' +
                            '<div id="editor">' +
                            '</div>' +
                            '</div > ' +
                            '<div style="widht:100%; padding:10px 0">' +
                            '<input class="" name="postedFile" id="postedFile' + val.mid + '" type="file" multiple placeholder="Add description..." />' +
                            '</div>' +
                            '<div style="widht:100%">' +
                            '<input type="button" id="savereplyAll" idval="' + val.mid + '" userval="' + val.userid + '" class="btn btn-mail save ash' + val.mid + '" style="padding:5px; !Important" value="Send All">' +
                            '<input type="button" id="savereply" idval="' + val.mid + '" userval="' + val.userid + '" class="btn btn-mail save sh' + val.mid + '" style="padding:5px; !Important" value="Send">' +
                            '&nbsp;&nbsp;&nbsp;<input type="button" id="closereply" class="btn btn-mail save" value="Close" idval="' + val.mid + '" style="padding:5px; !Important">' +
                            '</div>' +
                            ' </div>' +
                            ' </div>' +
                            '<section class="content" id="print' + val.mid + '"  style="margin-top:10px;">' +
                            '<div id="replydata' + val.mid + '" class="replydata">' +
                            '</div>' +
                            '<div class="col-md-12" style="padding-left:0px;padding-right:0px;text-align:justify;">' +
                            '<div class=" ">' +
                            '<div class="box-body no-padding">' +
                            '<div class="mailbox-read-info"  >' +
                            '<h4 style="margin-bottom:10px;">  <b>Subject:</b> ' + val.msubject + '</h4>' +
                            '<p> <b>From :</b> ' + val.UserName + '</p>' +
                            '<p> <b>Sent : </b> ' + formatDatetoIST(val.date_time) + '&nbsp; ' + val.date_time.substring(11, 19) + '</p>' +
                            '<p> <b>To : </b> <span id="touser' + val.mid + '"></span></p>' +
                            '<p id="case' + val.mid + '"> <b>Case : </b> <span> ' + val.mattername + '</span></p>' +
                            '</div><hr style="border-top:1px solid #c5baba;">' +
                            '<div class="mailbox-read-message" style="margin-top:10px;"> ' + Mbody + '' +
                            '</div>' +
                            '</div></div></div>' +
                            ' <div class="box-footer">' +
                            ' <ul class="mailbox-attachments clearfix" id="viewattachfile' + val.mid + '" style="' + fileview + '">' +
                            ' </ul>' +
                            ' </div>' +
                            '</section>' +
                            '<div  class="loaddatareply" id="replyAllbox1' + val.mid + '" style="display:none">' +
                            '</div > ' +
                            '</div>';
                        $('#accordion').append($row1);
                        if (val.mattername == null || val.mattername == "") {
                            $("#case" + val.mid).css("display", "none");
                        }
                        else {
                            $("#case" + val.mid).css("display", "unset");
                        }
                        $("#maindiv" + val.mid).find("[data-type='accordion-section-body']").css("display", "none");
                        var q = 0;
                        var dfilename = "";
                        var string1 = "";
                        var string2 = "";
                        try {
                            if (String(mfile) != "#") {
                                var str_array = mfile.split('|');
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
                                    var ftoken = "/DownloadFile.ashx?module=module1&ftoken=" + enctypesingle(str_array[i]);
                                    // Add additional code here, such as:
                                    var $row = $('<div>');
                                    $row.append($('<div>').html("<div class='mailbox-attachment-info' >"));
                                    $row.append($('<div>').html("<a name='file' href='" + ftoken + "' download='" + dfilename + "' target='_blank'   class='mailbox-attachment-name' title='File Attachment-click here to download'><i class='fa fa-paperclip'></i> " + q + ". " + dfilename + "  Attached.</a>"));
                                    $row.append($('<div>').html("</div>"));
                                    //alert($row);
                                    $("#viewattachfile" + val.mid).append($row);
                                }
                            }
                        }
                        catch (err) {
                        }
                        CKEDITOR.replace('replytext' + val.mid, {
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
                        loadmessagestatus();
                        loadtouserlist();
                        loadreplydata();
                    });
                    $(function () {
                        $("#accordion").accordion({
                            active: false,
                            collapsible: true, heightStyle: "content"
                        });
                    });
                }
                catch (err) {
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
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
    $(document).on("click", "#forword", function () {
        openload();
        var id = $(this).attr("idval");
        var url = "/Firm/ReplySentMessage";
        var bodydata = $("#print" + id).html();
        var subject = $("#title" + id).text();
        localStorage.setItem("details", bodydata);
        localStorage.setItem("subject", subject);
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
            closeload();
        });
    });
    $(document).on("click", "#replyAll", function () {
        var id = $(this).attr("idval");
        $("#replyAllbox" + id).css("display", "unset");
        $(".ash" + id).css("display", "unset");
        $(".sh" + id).css("display", "none");
    });
    /*Get archive message*/
    $(document).on("click", "#archivemsg", function () {
        if (confirm('Are you sure to archive this message?')) {
            var id = $(this).attr("idval");
            var formData = new FormData();
            formData.append("msgid", id);
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/ArchiveMessage", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    //},
                    success: function (data) {
                        $("#maindiv" + id).css("display", "none");
                        new PNotify({
                            title: 'Success!',
                            text: ' Message archived successfully',
                            type: 'success',
                            delay: 3000
                        });
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
    $(document).on("click", "#reply", function () {
        var id = $(this).attr("idval");
        $("#replyAllbox" + id).css("display", "unset");
        $(".ash" + id).css("display", "none");
        $(".sh" + id).css("display", "unset");
    });
    /*Close reply*/
    $(document).on("click", "#closereply", function () {
        var id = $(this).attr("idval");
        $("#replytext" + id).val(null)
        document.getElementById("postedFile" + id).value = null;
        $("#replyAllbox" + id).css("display", "none");
    });
    /*Save all reply*/
    $(document).on("click", "#savereplyAll", function () {
        var id = $(this).attr("idval");
        var userid = $(this).attr("userval");
        var datad = "replytext" + id;
        var bodydata = $("#print" + id).html();
        var editorname = CKEDITOR.instances[datad].getData();
        var newcontent = editorname + "<br>" + bodydata;
        var formData = new FormData();
        try {
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
                var Extresponse = checkfileextmsg(filename);
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
        }
        catch (err) {
            alert(er.message);
        }
        formData.append("details", editorname);
        formData.append("newdetails", newcontent);
        formData.append("mid", id);
        formData.append("auser", userid);
        if (editorname == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please enter text in reply Box.',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/PostAllReplyMessage", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                //},
                success: function (data) {
                    document.getElementById("postedFile" + id).value = null;
                    CKEDITOR.instances[datad].setData("");
                    $("#replyAllbox" + id).css("display", "none");
                    mids = id;
                    $('#replydata' + id).html("");
                    Afterloadreplydata();
                    new PNotify({
                        title: 'Success!',
                        text: ' Message Send Successfully',
                        type: 'success',
                        delay: 3000
                    });
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                } //End of AJAX error function
            });
    });
    /*Save reply*/
    $(document).on("click", "#savereply", function () {
        var id = $(this).attr("idval");
        var userid = $(this).attr("userval");
        var datad = "replytext" + id;
        var bodydata = $("#print" + id).html();
        var editorname = CKEDITOR.instances[datad].getData();
        var newcontent = editorname + "<br>" + bodydata;
        var formData = new FormData();
        try {
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
                var Extresponse = checkfileextmsg(filename);
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
        }
        catch (err) {
            alert(er.message);
        }
        formData.append("details", editorname);
        formData.append("newdetails", newcontent);
        formData.append("mid", id);
        formData.append("auser", userid);
        if (editorname == "") {
            new PNotify({
                title: 'Warning!',
                text: ' Please enter text in reply boxin reply box',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/PostReplyMessage", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    document.getElementById("postedFile" + id).value = null;
                    CKEDITOR.instances[datad].setData("");
                    $("#replyAllbox" + id).css("display", "none");
                    mids = id;
                    $('#replydata' + id).html("");
                    Afterloadreplydata();
                    new PNotify({
                        title: 'Success!',
                        text: ' Message Send Successfully',
                        type: 'success',
                        delay: 3000
                    });
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                } //End of AJAX error function
            });
    });
    /*Load reply data*/
    function loadreplydata() {
        var $table = '';
        var $table1 = '';
        var $header = '';
        var dt = '';
        var q1 = 0;
        var formData = new FormData();
        formData.append("mid", mids);
        var fcode = localStorage.getItem("FirmCode");
        try {
            $.ajax({
                async: true,
                url: '/api/CallApi/LoadReplyMessage',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                headers: { "mid": mids },
                dataType: 'json',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    else {
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
                            if (val.mfile != null) {
                                btnclass = "btn btn-success details";
                                usercaseid = "View";
                            }
                            else {
                                btnclass = "";
                                usercaseid = "";
                            }
                            if (val.mmatter != null) {
                                mattername = val.mattername;
                            }
                            else {
                                mattername = "";
                            }
                            if (val.mfile != null) {
                                mfile = val.mfile;
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
                                '<h4><b>Re:' + val.msubject + '</b></h4>' +
                                '<p> <b>From : </b>' + val.UserName + '</p>' +
                                '<p datavalue="' + val.date_time + '" id="dateid' + val.id + '"><b>Sent : </b>' + formatDatetoIST(val.date_time) + '&nbsp; ' + val.date_time.substring(11, 19) + '</p>' +
                                '<p> <b>To : </b> <span id="touserreply' + desired2 + '"></span></p>' +
                                '</div>' +
                                '<div class="mailbox-read-message"> ' + val.mbody + '' +
                                '</div>' +
                                '</div>' +
                                ' <div class="box-footer">' +
                                ' <ul class="mailbox-attachments clearfix" id="viewattachfilereply' + val.mid + val.id + '" style="' + fileview1 + '">' +
                                '</li>' +
                                ' </ul>' +
                                ' </div>' +
                                ' <br>' +
                                '</div > ' +
                                '</section>';
                            $('#replydata' + val.mid).append($row1);
                            var q1 = 0;
                            try {
                                if (String(mfile) != "") {
                                    var str_array1 = mfile.split('|');
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
                                        var ftoken = "/DownloadFile.ashx?module=module1&ftoken=" + enctypesingle(str_array1[i]);
                                        // Add additional code here, such as:
                                        var $row1 = $('<div>');
                                        $row1.append($('<div>').html("<div class='mailbox-attachment-info ' >"));
                                        $row1.append($('<div>').html("<a name='file' href='" + ftoken + "' download='" + dfilename1 + "' target='_blank'   class='mailbox-attachment-name' title='File Attachment-click here to download'><i class='fa fa-paperclip'></i> " + q1 + ". " + dfilename1 + "  Attached.</a>"));
                                        $row1.append($('<div>').html("</div>"));
                                        $("#viewattachfilereply" + val.mid + val.id).append($row1);
                                    }
                                }
                            }
                            catch (err) {
                            }
                            mids = val.mid;
                            Replyloadtouserlist();
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
    /*Load detail after reply*/
    function Afterloadreplydata() {
        var $table = '';
        var $table1 = '';
        var $header = '';
        var dt = '';
        var q1 = 0;
        var formData = new FormData();
        formData.append("mid", mids);
        var fcode = localStorage.getItem("FirmCode");
        try {
            $.ajax({
                async: true,
                url: '/api/CallApi/LoadReplyMessage',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                headers: { "mid": mids },
                dataType: 'json',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    else {
                    }
                    if (response.Data.length > 2) {
                        $("#datastatus").html("");
                    }
                    else {
                        $("#datastatus").html("No result found !");
                    }
                    var it = 2;
                    var filename = "";
                    try {
                        $.each(obj, function (i, val) {
                            desired2 = String(val.date_time).replace(/[^\w\s]/gi, '')
                            datetime = val.date_time;
                            it = it + 1;
                            if (val.mfile != null) {
                                btnclass = "btn btn-success details";
                                usercaseid = "View";
                            }
                            else {
                                btnclass = "";
                                usercaseid = "";
                            }
                            if (val.mmatter != null) {
                                mattername = val.mattername;
                            }
                            else {
                                mattername = "";
                            }
                            if (val.mfile != null) {
                                mfile = val.mfile;
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
                                '<h4><b>Re:' + val.msubject + '</b></h4>' +
                                '<p> <b>From : </b>' + val.UserName + '</p>' +
                                '<p datavalue="' + val.date_time + '" id="dateid' + val.id + '"><b>Sent : </b>' + formatDatetoIST(val.date_time) + '&nbsp; ' + val.date_time.substring(11, 19) + '</p>' +
                                '<p> <b>To : </b> <span id="touserreply' + desired2 + '"></span></p>' +
                                '</div>' +
                                '<div class="mailbox-read-message"> ' + val.mbody + '' +
                                '</div>' +
                                '</div>' +
                                ' <div class="box-footer">' +
                                ' <ul class="mailbox-attachments clearfix" id="viewattachfilereplyAll' + val.mid + val.id + '" style="' + fileview1 + '">' +
                                '</li>' +
                                ' </ul>' +
                                ' </div>' +
                                ' <br>' +
                                '</div > ' +
                                '</section>';
                            $('#replydata' + val.mid).append($row1);
                            var q2 = 0;
                            try {
                                if (String(mfile) != "") {
                                    var str_array2 = mfile.split(',');
                                    var html2 = '';
                                    for (var i = 0; i < str_array2.length; i++) {
                                        q1 = q1 + 1;
                                        str_array2[i] = str_array2[i].replace(/^\s*/, "").replace(/\s*$/, "");
                                        dfilename2 = String(str_array2[i]).substring(str_array2[i].lastIndexOf("/") + 1);
                                        string11 = String(dfilename2).split('.')[0];
                                        string21 = String(dfilename2).split('.')[1];
                                        var string11 = String(string11).substring(0, String(string11).length - 10);
                                        dfilename2 = string11.concat("." + string21)
                                        html2 += str_array2[i];
                                        var ftoken = "/DownloadFile.ashx?module=module1&ftoken=" + enctypesingle(str_array2[i]);
                                        // Add additional code here, such as:
                                        var $row2 = $('<div>');
                                        $row2.append($('<div>').html("<div class='mailbox-attachment-info ' >"));
                                        $row2.append($('<div>').html("<a name='file' href='" + ftoken + "' download='" + dfilename2 + "' target='_blank'   class='mailbox-attachment-name' title='File Attachment-click here to download'><i class='fa fa-paperclip'></i> " + q1 + ". " + dfilename2 + "  Attached.</a>"));
                                        $row2.append($('<div>').html("</div>"));
                                        $("#viewattachfilereplyAll" + val.mid + val.id).append($row2);
                                    }
                                }
                            }
                            catch (err) {
                            }
                            mids = val.mid;
                            Replyloadtouserlist();
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
    /*Load message status*/
    function loadmessagestatus() {
        var formData = new FormData();
        formData.append("mid", mids);
        var fcode = localStorage.getItem("FirmCode");
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadMessageStatus',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "mid": mids },
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, val) {
                        if (val.readstatus == "0") {
                            $(".read" + val.MessageId).css("font-weight", "bold");
                        }
                        else {
                            $(".read" + val.MessageId).css("font-weight", "normal");
                        }
                    });
                }
                else {
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    /*Load user list details*/
    function loadtouserlist() {
        var formData = new FormData();
        formData.append("mid", mids);
        var fcode = localStorage.getItem("FirmCode");
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadToUserList',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "mid": mids },
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, val) {
                        var subdata = $("#read" + val.MessageId).text();
                        $("#touser" + val.MessageId).append(" " + val.shareby + ", ");
                    });
                }
                else {
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    /*Load reply user list details*/
    function Replyloadtouserlist() {
        var formData = new FormData();
        formData.append("mid", mids);
        var fcode = localStorage.getItem("FirmCode");
        datetime = datetime;
        $.ajax({
            async: true,
            url: '/api/CallApi/ReplyLoadToUserList',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "mid": mids, "datetime": datetime },
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, val) {
                        desireds = String(val.date_time).replace(/[^\w\s]/gi, '')
                        var subdata1 = $("#readdate" + desireds).attr("readdate");
                        if (subdata1 == desireds) {
                            if ($("#touserreply" + desireds).text().indexOf(val.shareby) !== -1) {
                            }
                            else {
                                $("#touserreply" + desireds).append(" " + val.shareby + ", ");
                            }
                        }
                    });
                    var x = $("#touserreply" + desireds).text();
                    x = Array.from(new Set(x.split(','))).toString();
                    $("#touserreply" + desireds).text("");
                    $("#touserreply" + desireds).append(x);
                }
                else {
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    loadMessageCount();
    /*Load message count*/
    function loadMessageCount() {
        var fcode = localStorage.getItem("FirmCode");
        $.ajax({
            async: true,
            url: '/api/CallApi/loadMessageCount',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    $("#msgcount").html(response.Data);
                    $("#msgcount1").html(response.Data);
                }
                else {
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    setTimeout(function () {
        closeload();
    }, 3000);
});
