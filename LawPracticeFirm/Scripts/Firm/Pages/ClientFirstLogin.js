jQuery(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    /*Change client first login password*/
    $("#changepassword").click(function () {
        try {
            var opassword = $("#opassword").val();
            var password = $("#password").val();
            var cpassword = $("#cpassword").val();
            if (opassword == "") {
                alert("Please enter old password");
                return false;
            }
            if (opassword.length < 8) {
                alert("Password must contain at least eight characters.");
                return false;
            }
            if ($("#opassword").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#opassword").val()) == false) {
                    alert("Old Password must be minimum eight characters,at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (specialcharecterpass($("#opassword")) == "1") {
                return false;
            }
            if (password == "") {
                alert("Please set the password for the User Id.");
                return false;
            }
            if (password.length < 8) {
                alert("Password must contain at least eight characters.");
                return false;
            }
            if ($("#password").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#password").val()) == false) {
                    alert("New Password must be minimum eight characters,at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (specialcharecterpass($("#password")) == "1") {
                return false;
            }
            if (cpassword == "") {
                alert("Please confirm your password that you want to set.");
                return false;
            }
            if (cpassword.length < 8) {
                alert("Confirm Password must contain at least eight characters.");
                return false;
            }
            if ($("#cpassword").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#cpassword").val()) == false) {
                    alert("Confirm password must be minimum eight characters,at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (specialcharecterpass($("#cpassword")) == "1") {
                return false;
            }
            var formData = new FormData();
            formData.append("newpass", cpassword);
            formData.append("oldpassword", opassword);
            if (password == cpassword) {
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/CallApi/ClientFilstLoginChangePassword",
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            if (data.Data == "1") {
                                alert("Password has been reset Successfully !");
                                window.location.href = "/" + newclientfirmcode + "/client/matterlist";
                            }
                            else if (String(data.Data) == "existpassword") {
                                alert("Password cannot be same as previous password.");
                            }
                            else if (String(data.Data) == "passwordmismatch") {
                                alert("Old password mismatched. Please enter correct password.");
                            }
                            else {
                                alert("Password has been reset Successfully !");
                                window.location.href = "/" + newclientfirmcode + "/Account/LogOut";
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
            }
            else {
                alert("Password does not match");
            }
        }
        catch (err) {
            alert(err.message);
        }
    });
    function specialcharecterpass(str) {
        var strretrn = "0";
        var iChars = "`%&()+=[]\\\';,./{}|\":<>? ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `%&()+=[]\\\';,./{}|\":<>?  special characters are allowed in the password.");
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
});