$(document).ready(function() {
   var URL=window.location.origin;
    try {
        $("#resendotp").click(function () {
            var formdata = new FormData();
            $.ajax({
                async: true,
                url: '/home/AuthSendOTP',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (response == "success") {
                        alert("One Time Password (OTP) has been sent to your Mobile No.");
                    }
                    else {
                    }
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });
        });
    }
    catch (er) {
        alert(er.message);
    }
    try {
        $("#verifyotp").click(function () {
            var formdata = new FormData();
            var otpvalue = $("#onetimepassword").val();
            if (otpvalue == "") {
                alert("Enter One Time Password(OTP)");
                return false;
            }
            else if (otpvalue.length < 6) {
                alert("Enter valid OTP");
                return false;
            }
            formdata.append("otpvalue", otpvalue);
            $.ajax({
                async: true,
                url: '/home/TwoFactorVerifyOTP',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (String(response) == "false") {
                        alert("Invalid OTP");
                    }
                    else {
                       // alert(URL);
                        var fnlurl = (URL + "/" + response);
                        fnlurl = fnlurl.replace("dashboard", "Personaldashboard");
                        fnlurl = fnlurl.replace("Employee", "firm");
                        fnlurl = fnlurl.replace("/Client/Personaldashboard", "/Client/matterlist");
                        window.location.href = fnlurl;
                    }
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });
        });
    }
    catch (er) {
        alert(er.message);
    }
})