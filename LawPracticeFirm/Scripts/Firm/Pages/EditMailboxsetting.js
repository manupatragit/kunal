$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    function openload() {
        $('#myOverlay1').css("display", "block");
    }
    function closeload() {
        $('#myOverlay1').css("display", "none");
    }
/*Save mail box setting*/
    $("#savemailboxsetting").click(function () {
        var mservername = $("#mservername").val();
        var smtpserver = $("#smtpserver").val();
        var smtpport = $("#smtpport").val();
        var imapserver = $("#imapserver").val();
        var imapport = $("#imapport").val();
        var popserver = $("#popserver").val();
        var popport = $("#popport").val();
        if (mservername == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter Mail Server Name',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (smtpserver == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter SMTP Server Address',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (smtpport == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter SMTP Port',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (imapserver == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter IMAP Server Address',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (imapport == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter IMAP Port',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (popserver == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter POP Server Address',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (popport == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter POP Port',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        var formData = new FormData();
        formData.append("mservername", mservername);
        formData.append("smtpserver", smtpserver);
        formData.append("smtpport", smtpport);
        formData.append("imapserver", imapserver);
        formData.append("imapport", imapport);
        formData.append("popserver", popserver);
        formData.append("popport", popport);
        formData.append("token", token);
        openload();
        $.ajax({
            url: '/api/MailBoxApi/EditMailBoxSettings',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "alreadyexist") {
                        new PNotify({
                            title: 'warning!',
                            text: 'Mail server name already exist.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else {
                        $("#fileupload")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: 'Mail server updated successfully',
                            type: 'success',
                            delay: 3000
                        });
                        window.location = encodeURI("/" + fcode + "/firm/Mailboxsetting");
                    }
                }
                else {
                    // alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
});