$(document).ready(function () {
    var flagcheckmaore = false;
    var chckmailserver = "";
    openload();
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var fcode = localStorage.getItem("FirmCode");
    /*Print*/
    $(document).on("click", "#print1", function () {
        var id = $(this).attr("idval");
        DivID = "content" + String(id).replace(/[^0-9a-zA-Z]/g, "");
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
    /*Reply all*/
    $(document).on("click", "#replyAll", function () {
        $("#replyform")[0].reset();
        CKEDITOR.instances.replyemailbody.setData("");
        $("#replytitle").text("ReplyAll Mail");
        try {
            var msgid = $(this).attr("idval");
            var replyallto = $(this).attr("toval");
            var replyallcc = $(this).attr("ccval");
            var replyallfrom = $(this).attr("fromval");
            var replyallsubject = $(this).attr("subval");
            var replyallbody = $("#content" + String(msgid).replace(/[^0-9a-zA-Z]/g, "")).html();
            $("#replymsgid").val(msgid);
            var xto = String(replyallto).replace(/ /g, '') + "," + String(replyallfrom).replace(/ /g, '');
            xto = Array.from(new Set(xto.split(','))).toString();
            $("#replyemailto").val(xto);
            var xcc = String(replyallcc).replace(/ /g, '')
            xcc = Array.from(new Set(xcc.split(','))).toString();
            $("#replyemailcc").val(xcc);
            $("#replyemailsub").val("Re:" + replyallsubject);
            setTimeout(function () {
                CKEDITOR.instances.replyemailbody.setData(replyallbody);
            }, 1000);
        }
        catch (er) {
            alert(er.message);
        }
        $('#myModal1').modal({ show: true });
    });

    /*Reply*/
    $(document).on("click", "#reply", function () {
        $("#replyform")[0].reset();
        CKEDITOR.instances.replyemailbody.setData("");
        $("#replytitle").text("Reply Mail");
        try {
            var msgid = $(this).attr("idval");
            var replyallto = $(this).attr("toval");
            var replyallcc = $(this).attr("ccval");
            var replyallfrom = $(this).attr("fromval");
            var replyallsubject = $(this).attr("subval");
            var replyallbody = $("#content" + String(msgid).replace(/[^0-9a-zA-Z]/g, "")).html();
            $("#replymsgid").val(msgid);
            var xto = String(replyallfrom).replace(/ /g, '')
            xto = Array.from(new Set(xto.split(','))).toString();
            $("#replyemailto").val(xto);
            $("#replyemailsub").val("Re:" + replyallsubject);
            setTimeout(function () {
                CKEDITOR.instances.replyemailbody.setData(replyallbody);
            }, 1000);
        }
        catch (er) {
            alert(er.message);
        }
        $('#myModal1').modal({ show: true });
    });
    $(document).on("click", "#forword", function () {
        $("#forwardform")[0].reset();
        CKEDITOR.instances.forwardemailbody.setData("");
        try {
            var msgid = $(this).attr("idval");
            var forwardallsubject = $(this).attr("subval");
            var forwardbody = $("#content" + String(msgid).replace(/[^0-9a-zA-Z]/g, "")).html();
            $("#forwardmsgid").val(msgid);
            $("#forwardemailsub").val("Fwd:" + forwardallsubject);
            $("#forwardmsgtype").val("false");
            setTimeout(function () {
                CKEDITOR.instances.forwardemailbody.setData(forwardbody);
            }, 1000);
        }
        catch (er) {
            alert(er.message);
        }
        $('#myModal2').modal({ show: true });
    });
    $(document).on("click", "#composed", function () {
        $("#forwardform")[0].reset();
        CKEDITOR.instances.forwardemailbody.setData("");
        try {
            var msgid = $(this).attr("idval");
            var replyallto = $(this).attr("toval");
            var replyallcc = $(this).attr("ccval");
            var forwardallsubject = $(this).attr("subval");
            var forwardbody = $("#content" + String(msgid).replace(/[^0-9a-zA-Z]/g, "")).html();
            $("#forwardemailto").val(String(replyallto).replace(/ /g, ''));
            $("#forwardemailcc").val(String(replyallcc).replace(/ /g, ''));
            $("#forwardmsgid").val(msgid);
            $("#forwardemailsub").val(forwardallsubject);
            $("#forwardmsgtype").val("draft");
            setTimeout(function () {
                CKEDITOR.instances.forwardemailbody.setData(forwardbody);
            }, 1000);
        }
        catch (er) {
            alert(er.message);
        }
        $('#myModal2').modal({ show: true });
    });
    var flaginbox = false;
    var flagsent = false;
    var flagdraft = false;
    var trigger = "Inbox";
    $(document).on("click", "#inboxtab", function () {
        flaginbox = true;
        trigger = "Inbox";
    });
    $(document).on("click", "#senttab", function () {
        trigger = "sent";
        if (flagsent == false) {
            flagsent = true;
            getinbox($("#senttab").attr("value"));
        }
    });
    $(document).on("click", "#drafttab", function () {
        trigger = "draft";
        if (flagdraft == false) {
            flagdraft = true;
            getinbox($("#drafttab").attr("value"));
        }
    });
    $("#reditecttomailboxsetting").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/Mailboxsetting");
    });
    var batchsize = 10;
    /*Load more*/
    $("#loadmore").click(function () {
        var length = $("#loadmore").attr("dataval");
        var lastlength = parseInt(length) + parseInt(batchsize);
        $("#loadmore").attr("dataval", lastlength);
        var servereamil_value = $("#servereamil").val();
        var serverpassword_value = $("#serverpassword").val();
        var mailserverdata = $("#mailserver").val();
        var folderdata = $("#inboxtab").attr("value");
        if (folderdata == "") {
            alert("select mail folder");
            return false;
        }
        if (flagcheckmaore == true) {
            loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 1, folderdata);
        }
        else {
            loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 0, folderdata);
        }
    });

    /*Load more sent*/
    $("#loadmoresent").click(function () {
        var length = $("#loadmoresent").attr("dataval");
        var lastlength = parseInt(length) + parseInt(batchsize);
        $("#loadmoresent").attr("dataval", lastlength);
        var servereamil_value = $("#servereamil").val();
        var serverpassword_value = $("#serverpassword").val();
        var mailserverdata = $("#mailserver").val();
        var folderdata = $("#senttab").attr("value");
        if (folderdata == "") {
            alert("select mail folder");
            return false;
        }
        if (flagcheckmaore == true) {
            loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 1, folderdata);
        }
        else {
            loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 0, folderdata);
        }
    });

    /*Load more draft*/
    $("#loadmoredraft").click(function () {
        var length = $("#loadmoredraft").attr("dataval");
        var lastlength = parseInt(length) + parseInt(batchsize);
        $("#loadmoredraft").attr("dataval", lastlength);
        var servereamil_value = $("#servereamil").val();
        var serverpassword_value = $("#serverpassword").val();
        var mailserverdata = $("#mailserver").val();
        var folderdata = $("#drafttab").attr("value");
        if (folderdata == "") {
            alert("select mail folder");
            return false;
        }
        if (flagcheckmaore == true) {
            loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 1, folderdata);
        }
        else {
            loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 0, folderdata);
        }
    });
    $("#otheraccount").click(function () {
        var mailserver_value = $("#mailserver").val();
        if (mailserver_value == "") {
            $("#checkserverlogin").css("display", "none");
            alert("select mail server name");
            return false;
        }
        else {
            $("#servereamil").val("");
            $("#serverpassword").val("");
            $("#loadinboxcontent").html("");
            $("#inboxcontent").css("display", "none");
            $("#loadmore").attr("dataval", "0");
            $("#checkserverlogin").css("display", "block");
            $("#chkfolderlist").css("display", "none");
        }
    });

    /*Mail server*/
    $("#mailserver").on("change", function () {
        $("#chkfolderlist").css("display", "none");
        flaginbox = false;
        flagsent = false;
        flagdraft = false;
        $("#servereamil").val("");
        $("#serverpassword").val("");
        $("#loadinboxcontent").html("");
        $("#inboxcontent").css("display", "none");
        $("#loadsentcontent").html("");
        $("#sentcontent").css("display", "none");
        $("#loaddraftcontent").html("");
        $("#draftcontent").css("display", "none");
        $("#loadmore").attr("dataval", "0");
        $("#loadmoresent").attr("dataval", "0");
        $("#loadmoredraft").attr("dataval", "0");
        flagcheckmaore = false;
        chckmailserver = "";
        var mailserver_value = $(this).val();
        if (mailserver_value == "") {
            $("#checkserverlogin").css("display", "none");
            $("#loadinboxcontent").html("");
            $("#inboxcontent").css("display", "none");
            $("#loadsentcontent").html("");
            $("#sentcontent").css("display", "none");
            $("#loaddraftcontent").html("");
            $("#draftcontent").css("display", "none");
            alert("select mail server name");
            return false;
        }
        else {
            $("#loadinboxcontent").html("");
            $("#inboxcontent").css("display", "none");
            $("#loadsentcontent").html("");
            $("#sentcontent").css("display", "none");
            $("#loaddraftcontent").html("");
            $("#draftcontent").css("display", "none");
            //check crediantials for server
            checklogindata(mailserver_value);
        }
    });
    $("#savelogin").click(function () {
        flaginbox = false;
        flagsent = false;
        flagdraft = false;
        var servereamil_value = $("#servereamil").val();
        var serverpassword_value = $("#serverpassword").val();
        var mailserverdata = $("#mailserver").val();
        if (mailserverdata == "") {
            alert("select mail server ");
            return false;
        }
        if (servereamil_value == "") {
            alert("Enter email ");
            return false;
        }
        if (serverpassword_value == "") {
            alert("Enter password");
            return false;
        }
        if (servereamil_value != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(servereamil_value) == false) {
                alert('Invalid Email ');
                return false;
            }
        }
        $("#inboxcontent").css("display", "none");
        $("#loadinboxcontent").html("");
        $("#loadmore").attr("dataval", "0");
        $("#sentcontent").css("display", "none");
        $("#loadsentcontent").html("");
        $("#loadmoresent").attr("dataval", "0");
        $("#draftcontent").css("display", "none");
        $("#loaddraftcontent").html("");
        $("#loadmoredraft").attr("dataval", "0");
        var formData = new FormData();
        formData.append("mailserver", EncodeText(mailserverdata));
        formData.append("servereamil_value", EncodeText(servereamil_value));
        formData.append("serverpassword_value", EncodeText(serverpassword_value));
        var cp = '';
        if ($("#cport:checked").prop('checked')) {
            cp = $("#cport:checked").val();
        }
        else {
            cp = "0";
        }
        var cport = cp;
        trigger = "Inbox";
        openload();
        if (String(cport) == "0") {
            loadfoldermailbox(mailserverdata, servereamil_value, serverpassword_value, 0);
            loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 0, "Inbox");
        }
        else {
            formData.append("savedornot", EncodeText(cport));
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/MailBoxApi/Savemaillogindata",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (String(response1.Data) == "true") {
                        loadfoldermailbox(mailserverdata, servereamil_value, serverpassword_value, 0);
                        loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 0, "Inbox");
                    }
                    else if (String(response1.Data) == "Invalid URI: The hostname could not be parsed.") {
                        alert("Invalid IMAP Address");
                        closeload();
                    }
                    else if (String(response1.Data) == "No such host is known") {
                        alert("Invalid IMAP Address");
                        closeload();
                    }
                    else {
                        alert(response1.Data);
                        closeload();
                    }
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });

    /*Get inbox*/
    function getinbox(type) {
        var servereamil_value = $("#servereamil").val();
        var serverpassword_value = $("#serverpassword").val();
        var mailserverdata = $("#mailserver").val();
        if (mailserverdata == "") {
            alert("select mail server ");
            return false;
        }
        if (servereamil_value != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(servereamil_value) == false) {
                alert('Invalid Email ');
                return false;
            }
        }
        if (String(type) == "sent") {
            $("#sentcontent").css("display", "none");
            $("#loadsentcontent").html("");
            $("#loadmoresent").attr("dataval", "0");
        }
        else if (String(type) == "draft") {
            $("#draftcontent").css("display", "none");
            $("#loaddraftcontent").html("");
            $("#loadmoredraft").attr("dataval", "0");
        }
        var formData = new FormData();
        formData.append("mailserver", EncodeText(mailserverdata));
        formData.append("servereamil_value", EncodeText(servereamil_value));
        formData.append("serverpassword_value", EncodeText(serverpassword_value));
        var cp = '';
        if ($("#cport:checked").prop('checked')) {
            cp = $("#cport:checked").val();
        }
        else {
            cp = "0";
        }
        var cport = cp;
        loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 1, type);
    }

    /*Check login data*/
    function checklogindata(mailserverdata) {
        openload();
        if (String(mailserverdata) != String(chckmailserver)) {
            $("#loadinboxcontent").html("");
            $("#inboxcontent").css("display", "none");
            $("#loadsentcontent").html("");
            $("#sentcontent").css("display", "none");
            $("#loaddraftcontent").html("");
            $("#draftcontent").css("display", "none");
        }
        var formData = new FormData();
        formData.append("mailserver", EncodeText(mailserverdata));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MailBoxApi/checklogindata",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (String(response1.Data) == "no") {
                    closeload();
                    $("#checkserverlogin").css("display", "block");
                }
                else {
                    $("#loadmore").attr("dataval", "0");
                    $("#loadmoresent").attr("dataval", "0");
                    $("#loadmoredraft").attr("dataval", "0");
                    var tempemaill = "false";
                    var temppass = "false";
                    $("#checkserverlogin").css("display", "none");
                    loadfoldermailbox(mailserverdata, tempemaill, temppass, 1);
                    flagcheckmaore = true;
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    loadmailboxsetting();
    function loadmailboxsetting() {
        var formData = new FormData();
        var d1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/MailBoxApi/Loadmailboxserver",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    $('#mailserver').append($("<option></option>").attr("value", a.Id).text(a.MailServerName));
                    $('#sendmailserver').append($("<option></option>").attr("value", a.Id).text(a.MailServerName));
                });
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        $.when(d1).then(function (x) {
            closeload();
        });
    }
    var firstloadcheck = false;

    //bind folder
    function loadfoldermailbox(serverdata, emaildata, passworddata, saved) {
        var formData = new FormData();
        formData.append("emaildata", EncodeText(emaildata));
        formData.append("passworddata", EncodeText(passworddata));
        formData.append("serverdata", EncodeText(serverdata));
        formData.append("saved", EncodeText(saved));
        var d1 = $.ajax({
            url: '/api/MailBoxApi/LoadfolderInbox',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (String(response.Data) == "") {
                    alert("Directory not found! ");
                }
                else if (String(response.Data) == "Specified argument was out of the range of valid values.\r\nParameter name: index") {
                    alert("Specified argument was out of the range of valid values.\r\nParameter name: index");
                }
                else if (String(response.Data) == "Invalid URI: The hostname could not be parsed.") {
                    alert("Invalid IMAP Address");
                }
                else if (String(response.Data) == "No such host is known") {
                    alert("Invalid IMAP Address");
                }
                else if (String(response.Data) == "Invalid length for a Base-64 char array or string.") {
                    alert("Invalid length for a Base-64 char array or string.");
                }
                else if (String(response.Data) == "Invalid credentials(Failure)") {
                    alert("Invalid credentials(Failure)");
                }
                else if (String(response.Data) == "The ImapClient is not authenticated.") {
                    alert("The ImapClient is not authenticated.");
                    closeload();
                    return false;
                }
                else {
                    var n = String(response.Data).search("Sent");
                    if (String(n) == "-1") {
                        flaginbox = true;
                        if (firstloadcheck == true) {
                            alert(response.Data);
                            firstloadcheck = true;
                        }
                        closeload();
                        return false;
                    }
                    else {
                    }
                    var boundfolder = response.Data;
                    var nameArr = String(boundfolder).split(',');
                    $("#inboxtab").attr("value", "Inbox");
                    for (var i = 0; i < nameArr.length; i++) {
                        if (String(nameArr[i]) != "") {
                            if ((String(nameArr[i]).indexOf("Sent")) != "-1") {
                                $("#senttab").attr("value", nameArr[i]);
                            }
                            if ((String(nameArr[i]).indexOf("Draft")) != "-1") {
                                $("#drafttab").attr("value", nameArr[i]);
                            }
                        }
                    }
                    $("#checkserverlogin").css("display", "none");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(d1).then(function (x) {
            if (flaginbox == false) {
                getinbox("Inbox");
            }
        });
    }
    //load mail box
    function loadmailbox(serverdata, emaildata, passworddata, saved, folder) {
        $("#inboxcontent").css("display", "block");
        $("#sentcontent").css("display", "block");
        $("#draftcontent").css("display", "block");
        $("#checkserverlogin").css("display", "none");
        openload();
        var formData = new FormData();
        if (String(folder) == "Inbox") {
            activetab("inboxtablink");
            trigger = "Inbox";
            var length = $("#loadmore").attr("dataval");
            var lastlength = parseInt(length) + parseInt(batchsize);
        }
        if (String(folder) == $("#senttab").attr("value")) {
            trigger = "sent";
            var length = $("#loadmoresent").attr("dataval");
            var lastlength = parseInt(length) + parseInt(batchsize);
        }
        if (String(folder) == $("#drafttab").attr("value")) {
            trigger = "draft";
            var length = $("#loadmoredraft").attr("dataval");
            var lastlength = parseInt(length) + parseInt(batchsize);
        }
        formData.append("length", EncodeText(length));
        formData.append("lastlength", EncodeText(lastlength));
        formData.append("emaildata", EncodeText(emaildata));
        formData.append("passworddata", EncodeText(passworddata));
        formData.append("serverdata", EncodeText(serverdata));
        formData.append("saved", EncodeText(saved));
        formData.append("folder", EncodeText(folder));
        var d1 = $.ajax({
            url: '/api/MailBoxApi/LoadInbox',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (String(response.Data) == "") {
                    if (trigger == "Inbox") {
                        $("#loadmore").css("display", "none");
                    }
                    else if (trigger == "sent") {
                        $("#loadmoresent").css("display", "none");
                    }
                    else if (trigger == "draft") {
                        $("#loadmoredraft").css("display", "none");
                    }
                }
                else if (String(response.Data) == "Specified argument was out of the range of valid values.\r\nParameter name: index") {
                    if (trigger == "Inbox") {
                        $("#loadmore").css("display", "none");
                    }
                    else if (trigger == "sent") {
                        $("#loadmoresent").css("display", "none");
                    }
                    else if (trigger == "draft") {
                        $("#loadmoredraft").css("display", "none");
                    }
                }
                else if (String(response.Data) == "Invalid URI: The hostname could not be parsed.") {
                    alert("Invalid IMAP Address");
                    if (trigger == "Inbox") {
                        $("#loadmore").css("display", "none");
                        $("#inboxcontent").css("display", "none");
                    }
                    else if (trigger == "sent") {
                        $("#loadmoresent").css("display", "none");
                        $("#sentcontent").css("display", "none");
                    }
                    else if (trigger == "draft") {
                        $("#loadmoredraft").css("display", "none");
                        $("#draftcontent").css("display", "none");
                    }
                }
                else if (String(response.Data) == "No such host is known") {
                    alert("Invalid IMAP Address");
                    if (trigger == "Inbox") {
                        $("#loadmore").css("display", "none");
                        $("#inboxcontent").css("display", "none");
                    }
                    else if (trigger == "sent") {
                        $("#loadmoresent").css("display", "none");
                        $("#sentcontent").css("display", "none");
                    }
                    else if (trigger == "draft") {
                        $("#loadmoredraft").css("display", "none");
                        $("#draftcontent").css("display", "none");
                    }
                }
                else if (String(response.Data) == "Invalid length for a Base-64 char array or string.") {
                    if (trigger == "Inbox") {
                        $("#loadmore").css("display", "none");
                    }
                    else if (trigger == "sent") {
                        $("#loadmoresent").css("display", "none");
                    }
                    else if (trigger == "draft") {
                        $("#loadmoredraft").css("display", "none");
                    }
                }
                else if (String(response.Data) == "Invalid credentials(Failure)") {
                    alert("Invalid credentials(Failure)");
                }
                else {
                    var n = String(response.Data).search("<tr>");
                    if (String(n) == "-1") {
                        if (trigger == "Inbox") {
                            $("#loadmore").css("display", "none");
                            $("#inboxcontent").css("display", "none");
                        }
                        else if (trigger == "sent") {
                            $("#loadmoresent").css("display", "none");
                            $("#sentcontent").css("display", "none");
                        }
                        else if (trigger == "draft") {
                            $("#loadmoredraft").css("display", "none");
                            $("#draftcontent").css("display", "none");
                        }
                    }
                    else {
                        $("#chkfolderlist").css("display", "block");
                        if (trigger == "Inbox") {
                            $("#loadinboxcontent").append(response.Data);
                            $("#loadmore").css("display", "unset");
                            var numItems = (String(response.Data).match(/collapsible1/g)).length;
                            if (parseInt(numItems) < 10) {
                                $("#loadmore").css("display", "none");
                            }
                        }
                        else if (trigger == "sent") {
                            $("#loadsentcontent").append(response.Data);
                            $("#loadmoresent").css("display", "unset");
                            var numItems1 = (String(response.Data).match(/collapsible2/g)).length;
                            if (parseInt(numItems1) < 10) {
                                $("#loadmoresent").css("display", "none");
                            }
                        }
                        else if (trigger == "draft") {
                            $("#loaddraftcontent").append(response.Data);
                            $("#loadmoredraft").css("display", "unset");
                            var numItems2 = (String(response.Data).match(/collapsible3/g)).length;
                            if (parseInt(numItems2) < 10) {
                                $("#loadmoredraft").css("display", "none");
                            }
                        }
                    }
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(d1).then(function (x) {
            closeload();
            if (String(folder) == "Inbox") {
                var coll = document.getElementsByClassName("collapsible1");
                var i;
                var length1 = $("#loadmore").attr("dataval");
                var lastlength1 = parseInt(length1) + parseInt(batchsize);
                for (i = parseInt(length1); i < parseInt(lastlength1); i++) {
                    coll[i].addEventListener("click", function () {
                        this.classList.toggle("active");
                        var content = this.nextElementSibling;
                        if (content.style.maxHeight) {
                            content.style.maxHeight = null;
                        } else {
                            content.style.maxHeight = content.scrollHeight + "px";
                        }
                    });
                }
            }
            if (String(folder) == $("#senttab").attr("value")) {
                var coll = document.getElementsByClassName("collapsible2");
                var i;
                var length1 = $("#loadmoresent").attr("dataval");
                var lastlength1 = parseInt(length1) + parseInt(batchsize);
                for (i = parseInt(length1); i < parseInt(lastlength1); i++) {
                    coll[i].addEventListener("click", function () {
                        this.classList.toggle("active");
                        var content = this.nextElementSibling;
                        if (content.style.maxHeight) {
                            content.style.maxHeight = null;
                        } else {
                            content.style.maxHeight = content.scrollHeight + "px";
                        }
                    });
                }
            }
            if (String(folder) == $("#drafttab").attr("value")) {
                var coll = document.getElementsByClassName("collapsible3");
                var i;
                var length1 = $("#loadmoredraft").attr("dataval");
                var lastlength1 = parseInt(length1) + parseInt(batchsize);
                for (i = parseInt(length1); i < parseInt(lastlength1); i++) {
                    coll[i].addEventListener("click", function () {
                        this.classList.toggle("active");
                        var content = this.nextElementSibling;
                        if (content.style.maxHeight) {
                            content.style.maxHeight = null;
                        } else {
                            content.style.maxHeight = content.scrollHeight + "px";
                        }
                    });
                }
            }
        });
    }
    $("#sentotheraccount").click(function () {
        var mailserver_value = $("#sendmailserver").val();
        if (mailserver_value == "") {
            $("#sendcheckserverlogin").css("display", "none");
            $("#success").css("display", "none");
            $("#error").css("display", "none");
            alert("select mail server name");
            return false;
        }
        else {
            $("#sendservereamil").val("");
            $("#sendserverpassword").val("");
            $("#success").css("display", "none");
            $("#error").css("display", "none");
            $("#sendcheckserverlogin").css("display", "block");
        }
    });
    $("#sendmailserver").change(function () {
        var selectedValue = $(this).val();
        if (selectedValue == "") {
            $("#sendcheckserverlogin").css("display", "none");
            $("#success").css("display", "none");
            $("#error").css("display", "none");
            alert("select mail server name");
            return false;
        }
        else {
            $("#sendservereamil").val();
            $("#sendserverpassword").val();
            sendchecklogindata(selectedValue);
        }
    });
    /*send check login data*/
    function sendchecklogindata(mailserverdata) {
        openload();
        var formData = new FormData();
        formData.append("mailserver", EncodeText(mailserverdata));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MailBoxApi/checklogindata",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (String(response1.Data) == "no") {
                    closeload();
                    $("#sendcheckserverlogin").css("display", "block");
                    $("#success").css("display", "none");
                    $("#error").css("display", "block");
                }
                else if (String(response1.Data) == "false") {
                    closeload();
                    $("#sendcheckserverlogin").css("display", "block");
                    $("#success").css("display", "none");
                    $("#error").css("display", "block");
                }
                else if (String(response1.Data) == "truewithoutc") {
                    closeload();
                    $("#sendcheckserverlogin").css("display", "block");
                    $("#success").css("display", "block");
                    $("#error").css("display", "none");
                }
                else {
                    $("#sendcheckserverlogin").css("display", "none");
                    $("#success").css("display", "block");
                    $("#error").css("display", "none");
                    closeload();
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }

    /*Save login details*/
    function savelogindetails() {
        var cpcom = '';
        if ($("#cportcom:checked").prop('checked')) {
            cpcom = $("#cportcom:checked").val();
        }
        else {
            cpcom = "0";
            return false;
        }
        var cportcom = cpcom;
        var mailservercom = $("#sendmailserver").val();
        var serveremailcom = $("#sendservereamil").val();
        var serverpasscom = $("#sendserverpassword").val();
        var formData = new FormData();
        formData.append("savedornot", EncodeText(cportcom));
        formData.append("mailserver", EncodeText(mailservercom));
        formData.append("servereamil_value", EncodeText(serveremailcom));
        formData.append("serverpassword_value", EncodeText(serverpasscom));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MailBoxApi/Savemaillogindata",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (String(response1.Data) == "true") {
                    //loadmailbox(mailserverdata, servereamil_value, serverpassword_value, 0, "Inbox");
                }
                else {
                    alert(response1.Data);
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }

    /*Send email*/
    $("#sendmail").click(function () {
        verifydata();
        function checkEmail(email) {
            var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regExp.test(email);
        }
        /*Verify data*/
        function verifydata() {
            var sendmailserver = $("#sendmailserver").val();
            var sendservereamil = $("#sendservereamil").val();
            var sendserverpassword = $("#sendserverpassword").val();
            if (sendmailserver == "") {
                alert("select mail server name");
                return false;
            }
            if (sendservereamil != "") {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test(sendservereamil) == false) {
                    alert('Invalid authentication email');
                    return false;
                }
            }
            var result = confirm("Are you sure to send email?");
            if (result) {
                var emailto = $("#emailto").val();
                var emailcc = $("#emailcc").val();
                var emailsub = $("#emailsub").val();
                var emailbody = CKEDITOR.instances.emailbody.getData();
                var vEmails = "";
                var vEmails1 = "";
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
                        }
                    }
                }
                if (emailcc != "") {
                    var emailArray = emailcc.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            vEmails1 = "true";
                        } else {
                            vEmails1 = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid Email Format in CC Email!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
                if (vEmails == "" || vEmails == null) {
                    new PNotify({
                        title: 'Warning!',
                        text: ' Please Enter To Email!',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
                if ((vEmails == "" && vEmails1 == "true") || (vEmails1 == "" && vEmails == "true") || (vEmails == "" && vEmail1 == "") || (vEmails == "true" && vEmails1 == "true")) {
                    var formData = new FormData();
                    formData.append("sendmailservername", EncodeText(sendmailserver));
                    formData.append("sendservereamil", EncodeText(sendservereamil));
                    formData.append("sendserverpassword", EncodeText(sendserverpassword));
                    formData.append("emailto", EncodeText(emailto));
                    formData.append("emailcc", EncodeText(emailcc));
                    formData.append("emailsub", EncodeText(emailsub));
                    formData.append("emailbody", EncodeText(emailbody));
                    var tempsize = 0;
                    var tottempsize = 0;
                    var totalFiles = document.getElementById("postedFile").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("postedFile").files[i];
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
                    /*Send mail*/
                    formData.append("savemykasefileid", EncodeText($("#mykasefileidemailsynccompose").val()));
                    openload();
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: '/api/MailBoxApi/SendEmail',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            savelogindetails();
                            if (String(response.Data) == "true") {
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Email Sent Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#sendmailform")[0].reset();
                                $("#mykasefileidemailsynccompose").val("");
                                $("#browsefileemailsynccompose").attr("title", "No file chosen");
                                $("#browsefilelblemailsynccompose").html("No file chosen");
                                CKEDITOR.instances.emailbody.setData("");
                                $(".mailsuccess").css("display", "none");
                                $(".mailfail").css("display", "none");
                                closeload();
                            }
                            else {
                                alert(response.Data);
                                closeload();
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
            }
        }
    });

    /*Save draft*/
    $("#Savedraft").click(function () {
        verifydata();
        function checkEmail(email) {
            var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regExp.test(email);
        }
        function verifydata() {
            var sendmailserver = $("#sendmailserver").val();
            var sendservereamil = $("#sendservereamil").val();
            var sendserverpassword = $("#sendserverpassword").val();
            if (sendmailserver == "") {
                alert("select mail server name");
                return false;
            }
            if (sendservereamil != "") {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test(sendservereamil) == false) {
                    alert('Invalid authentication email');
                    return false;
                }
            }
            var result = confirm("Are you sure to save email as draft?");
            if (result) {
                var emailto = $("#emailto").val();
                var emailcc = $("#emailcc").val();
                var emailsub = $("#emailsub").val();
                var emailbody = CKEDITOR.instances.emailbody.getData();
                var vEmails = "";
                var vEmails1 = "";
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
                if (emailcc != "") {
                    var emailArray = emailcc.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            vEmails1 = "true";
                        } else {
                            vEmails1 = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid Email Format in CC Email!',
                                type: 'error',
                                delay: 3000
                            });
                            return false;
                        }
                    }
                }
                var formData = new FormData();
                formData.append("sendmailservername", EncodeText(sendmailserver));
                formData.append("sendservereamil", EncodeText(sendservereamil));
                formData.append("sendserverpassword", EncodeText(sendserverpassword));
                formData.append("emailto", EncodeText(emailto));
                formData.append("emailcc", EncodeText(emailcc));
                formData.append("emailsub", EncodeText(emailsub));
                formData.append("emailbody", EncodeText(emailbody));
                var tempsize = 0;
                var tottempsize = 0;
                var totalFiles = document.getElementById("postedFile").files.length;
                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("postedFile").files[i];
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
                formData.append("savemykasefileid", EncodeText($("#mykasefileidemailsynccompose").val()));
                openload();
                $.ajax({
                    async: true,
                    type: "POST",
                    url: '/api/MailBoxApi/SaveDraft',
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        savelogindetails();
                        if (String(response.Data) == "true") {
                            new PNotify({
                                title: 'Success!',
                                text: 'Email save in draft Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#sendmailform")[0].reset();
                            $("#mykasefileidemailsynccompose").val("");
                            $("#browsefileemailsynccompose").attr("title", "No file chosen");
                            $("#browsefilelblemailsynccompose").html("No file chosen");
                            CKEDITOR.instances.emailbody.setData("");
                            $(".mailsuccess").css("display", "none");
                            $(".mailfail").css("display", "none");
                            closeload();
                        }
                        else {
                            alert(response.Data);
                            closeload();
                        }
                    },
                    error: function () {
                        alert('Error!');
                    }
                });
            }
        }
    });

    /*Reply mail*/
    $("#replysendmail").click(function () {
        verifydata();
        function checkEmail(email) {
            var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regExp.test(email);
        }
        function verifydata() {
            var sendmailserver = $("#mailserver").val();
            var sendservereamil = $("#servereamil").val();
            var sendserverpassword = $("#serverpassword").val();
            if (sendmailserver == "") {
                alert("select mail server name");
                return false;
            }
            if (sendservereamil != "") {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test(sendservereamil) == false) {
                    alert('Invalid authentication email');
                    return false;
                }
            }
            var result = confirm("Are you sure to send email?");
            if (result) {
                var emailto = $("#replyemailto").val();
                var emailcc = $("#replyemailcc").val();
                var emailsub = $("#replyemailsub").val();
                var emailbody = CKEDITOR.instances.replyemailbody.getData();
                var vEmails = "";
                var vEmails1 = "";
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
                        }
                    }
                }
                if (emailcc != "") {
                    var emailArray = emailcc.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            vEmails1 = "true";
                        } else {
                            vEmails1 = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid Email Format in CC Email!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
                if (vEmails == "" || vEmails == null) {
                    new PNotify({
                        title: 'Warning!',
                        text: ' Please Enter To Email!',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
                if ((vEmails == "" && vEmails1 == "true") || (vEmails1 == "" && vEmails == "true") || (vEmails == "" && vEmail1 == "") || (vEmails == "true" && vEmails1 == "true")) {
                    var formData = new FormData();
                    formData.append("sendmailservername", EncodeText(sendmailserver));
                    formData.append("sendservereamil", EncodeText(sendservereamil));
                    formData.append("sendserverpassword", EncodeText(sendserverpassword));
                    formData.append("emailto", EncodeText(emailto));
                    formData.append("emailcc", EncodeText(emailcc));
                    formData.append("emailsub", EncodeText(emailsub));
                    formData.append("emailbody", EncodeText(emailbody));
                    formData.append("msgid", EncodeText($("#replymsgid").val()));
                    try {
                        var fp = $("#replypostedFile");
                        var lg = fp[0].files.length; // get length
                        var items = fp[0].files;
                        var fileSizes = 0;
                        if (lg > 0) {
                            for (var i = 0; i < lg; i++) {
                                fileSizes = fileSizes + items[i].size; // get file size
                            }
                            if (fileSizes > filesize) {
                                alert('File size must not be more than 2 MB');
                                $('#postedFile').val('');
                                return false;
                            }
                        }
                    }
                    catch (err) {
                        alert(er.message);
                    }
                    var totalFiles = document.getElementById("replypostedFile").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("replypostedFile").files[i];
                        formData.append("FileUpload", file);
                    }
                    formData.append("savemykasefileid", EncodeText($("#mykasefileidEmailsyncreply").val()));
                    openload();
                    $("#myModal1").modal('hide');
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: '/api/MailBoxApi/ReplySendEmail',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (String(response.Data) == "true") {
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Email Sent Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#replyform")[0].reset();
                                $("#mykasefileidEmailsyncreply").val("");
                                $("#browsefileEmailsyncreply").attr("title", "No file chosen");
                                $("#browsefilelblEmailsyncreply").html("No file chosen");
                                CKEDITOR.instances.replyemailbody.setData("");
                                closeload();
                            }
                            else {
                                alert(response.Data);
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
        }
    });
    /*Forword mail*/
    $("#forwardsendmail").click(function () {
        verifydata();
        function checkEmail(email) {
            var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regExp.test(email);
        }
        function verifydata() {
            var sendmailserver = $("#mailserver").val();
            var sendservereamil = $("#servereamil").val();
            var sendserverpassword = $("#serverpassword").val();
            if (sendmailserver == "") {
                alert("select mail server name");
                return false;
            }
            if (sendservereamil != "") {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test(sendservereamil) == false) {
                    alert('Invalid authentication email');
                    return false;
                }
            }
            var result = confirm("Are you sure to send email?");
            if (result) {
                var emailto = $("#forwardemailto").val();
                var emailcc = $("#forwardemailcc").val();
                var emailsub = $("#forwardemailsub").val();
                var emailbody = CKEDITOR.instances.forwardemailbody.getData();
                var vEmails = "";
                var vEmails1 = "";
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
                        }
                    }
                }
                if (emailcc != "") {
                    var emailArray = emailcc.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            vEmails1 = "true";
                        } else {
                            vEmails1 = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid Email Format in CC Email!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
                if (vEmails == "" || vEmails == null) {
                    new PNotify({
                        title: 'Warning!',
                        text: ' Please Enter To Email!',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
                if ((vEmails == "" && vEmails1 == "true") || (vEmails1 == "" && vEmails == "true") || (vEmails == "" && vEmail1 == "") || (vEmails == "true" && vEmails1 == "true")) {
                    var formData = new FormData();
                    formData.append("sendmailservername", EncodeText(sendmailserver));
                    formData.append("sendservereamil", EncodeText(sendservereamil));
                    formData.append("sendserverpassword", EncodeText(sendserverpassword));
                    formData.append("emailto", EncodeText(emailto));
                    formData.append("emailcc", EncodeText(emailcc));
                    formData.append("emailsub", EncodeText(emailsub));
                    formData.append("emailbody", EncodeText(emailbody));
                    formData.append("msgid", EncodeText($("#forwardmsgid").val()));
                    formData.append("folder", EncodeText($("#drafttab").attr("value")));
                    formData.append("msgtype", EncodeText($("#forwardmsgtype").val()));
                    try {
                        var fp = $("#forwardpostedFile");
                        var lg = fp[0].files.length; // get length
                        var items = fp[0].files;
                        var fileSizes = 0;
                        if (lg > 0) {
                            for (var i = 0; i < lg; i++) {
                                fileSizes = fileSizes + items[i].size; // get file size
                            }
                            if (fileSizes > filesize) {
                                alert('File size must not be more than 2 MB');
                                $('#postedFile').val('');
                                return false;
                            }
                        }
                    }
                    catch (err) {
                        alert(er.message);
                    }
                    var totalFiles = document.getElementById("forwardpostedFile").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("forwardpostedFile").files[i];
                        formData.append("FileUpload", file);
                    }
                    formData.append("savemykasefileid", EncodeText($("#mykasefileidEmailsyncforword").val()));
                    openload();
                    $("#myModal2").modal('hide');
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: '/api/MailBoxApi/ForwardSendEmail',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (String(response.Data) == "true") {
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Email Sent Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#forwardform")[0].reset();
                                $("#mykasefileidEmailsyncforword").val("");
                                $("#browsefileEmailsyncforword").attr("title", "No file chosen");
                                $("#browsefilelblEmailsyncforword").html("No file chosen");
                                CKEDITOR.instances.forwardemailbody.setData("");
                                closeload();
                                var gettypemsg = $("#forwardmsgtype").val();
                                if (String(gettypemsg) == "draft") {
                                    var tempmsgid = $("#forwardmsgid").val();
                                    tempmsgid = String(tempmsgid).replace(/[^0-9a-zA-Z]/g, "");
                                    $("#tr" + tempmsgid).css("display", "none");
                                }
                            }
                            else {
                                alert(response.Data);
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
        }
    });
});
