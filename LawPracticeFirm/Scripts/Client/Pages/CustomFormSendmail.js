$(document).ready(function () {
    var workflowid1 = localStorage.getItem("stgid");
    var workflowtid1 = localStorage.getItem("taskid");
    if (workflowid1 == " " || workflowtid1 == " ") {
        $("#wfdata1").html("");
    }
    else {
    }
});
/*Send mail*/
$(document).on("click", "#sendemail", function () {
    verifydata();
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    function verifydata() {
        var result = confirm("Are you sure to  Send Email?");
        if (result) {
            var workflowid = localStorage.getItem("stgid");
            var workflowtid = localStorage.getItem("taskid");
            if (workflowid == "" || workflowtid == "") {
            }
            else {
                var emailto = $("#emailto").val();
                var emailcc = $("#emailcc").val();
                var emailsub = $("#emailsub").val();
                var emailbody = $("#emailbody").val();
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
                    formData.append("wid", workflowid);
                    formData.append("wtid", workflowtid);
                    formData.append("emailto", emailto);
                    formData.append("emailcc", emailcc);
                    formData.append("emailsub", emailsub);
                    formData.append("emailbody", emailbody);
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: '/api/CallApi/Verifydwonloadstage',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Email Sent Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                localStorage.setItem("stgid", "  ");
                                localStorage.setItem("taskid", " ");
                                $("#wfdata1").html("");
                                var fcode = localStorage.getItem("FirmCode");
                                window.location = encodeURI("/" + fcode + "/client/WorkFlowNUserActivity/");
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
        }
    }
});
