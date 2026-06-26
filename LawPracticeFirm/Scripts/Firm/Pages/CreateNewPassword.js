jQuery(document).ready(function () {
    $(".toggle-password1").click(function () {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

/*Change password*/
    $("#changepassword").click(function () {
        try {
            var password = $("#password").val();
            var cpassword = $("#cpassword").val();
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
                    alert("Password must be minimum eight characters,at least one uppercase letter, one lowercase letter, one number and one special character");
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
            formData.append("token", token);
            formData.append("tokenid", reftid);
            if (password == cpassword) {
                $.ajax(
                    {
                        type: "POST",
                        url: '/Api/callApi/CreateNewPassword',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            if (parseInt(data.Data)>0) {
                                alert("Password has been reset Successfully !");
                                window.location.href = location.protocol + '//' + location.hostname;
                            }
                            else if (String(data.Data) == "existpassword") {
                                alert("Password cannot be same as previous password.");
                            }
                            else if (String(data.Data) == "passwordmismatch") {
                                alert("Old password mismatched. Please enter correct password.");
                            }
                            else {
                                alert(data.Data);
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
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
});