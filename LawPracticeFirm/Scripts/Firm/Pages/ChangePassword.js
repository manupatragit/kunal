$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $(".toggle-password1").click(function () {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
/*Save change password details*/
    $('form[id="frmpass"]').validate({
        submitHandler: function (form) {
            var password = $("#newpass").val();
            var confirmPassword = $("#conpass").val();
            oldpass = $("#oldpass").val();
            newpass = $("#newpass").val();
            conpass = $("#conpass").val();
            if (newpass == "") {
                alert("Please enter new password");
                return false;
            }
            if (newpass.length < 8) {
                alert("New Password must contain at least eight characters.");
                return false;
            }
            if ($("#newpass").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#newpass").val()) == false) {
                    alert("New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (specialcharecterpass($("#newpass")) == "1") {
                return false;
            }
            if (conpass == "") {
                alert("Please enter Confirm new password");
                return false;
            }
            if (conpass.length < 8) {
                alert("Confirm new Password must contain at least eight characters.");
                return false;
            }
            if ($("#conpass").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#conpass").val()) == false) {
                    alert("Confirm New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (specialcharectercpass($("#conpass")) == "1") {
                return false;
            }
            var formData = new FormData();            
            formData.append("oldpass", EncodeText(oldpass));
            formData.append("newpass", EncodeText(newpass));
            formData.append("conpass", EncodeText(conpass));
            if (password == confirmPassword) {
                try {
                    openload();
                }
                catch (er) {
                }
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/WorkFlowNewApi/ChangePassword", // Controller/View
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            var datas = JSON.stringify(data);
                            if (parseInt(data.Data)>0) {
                                $("#frmpass")[0].reset();
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Updated Successfully. Please login again.',
                                    type: 'success',
                                    delay: 3000
                                });
                                location.href = "/"+fcode+"/Account/LogOut";
                                try {
                                    closeload();
                                }
                                catch (er) {
                                }
                            }
                            else if (String(data.Data) == "existpassword") {
                                alert("Password cannot be same as previous password.");
                                try {
                                    closeload();
                                }
                                catch (er) {
                                }
                            }
                            else if (String(data.Data) == "passwordmismatch") {
                                alert("Old password mismatched. Please enter correct password.");
                                try {
                                    closeload();
                                }
                                catch (er) {
                                }
                            }
                            else {
                                alert(data.Data);
                                try {
                                    closeload();
                                }
                                catch (er) {
                                }
                            }
                        },
                        failure: function (data) {
                            alert(data.responseText);
                            try {
                                closeload();
                            }
                            catch (er) {
                            }
                        },
                        error: function (data) {
                            alert(data.responseText);
                            try {
                                closeload();
                            }
                            catch (er) {
                            }
                        }
                    });
            }
            else {
                    new PNotify({
                        title: 'Warning!',
                        text: ' Password mismatch!',
                        type: 'error',
                        delay: 3000
                    });
                try {
                    closeload();
                }
                catch (er) {
                }
            }
        }
    });
/*Special character*/
    function specialcharecterpass(str) {
        var strretrn = "0";
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");
                document.getElementById("newpass").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    function specialcharectercpass(str) {
        var strretrn = "0";
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in confirm password.");
                document.getElementById("conpass").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
});