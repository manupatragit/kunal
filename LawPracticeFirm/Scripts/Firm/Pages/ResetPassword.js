jQuery(document).ready(function () {

/*Reset password*/
    $("#resetpassword").click(function () {
        try {
            var formdata = new FormData();
            var forgetuserid = $("#forgetuserid").val();
            if (forgetuserid == "") {
                alert("Please Enter User Name");
                $("#forgetuserid").focus();
                return false;
            }
            var remail = $("#email").val();
            if (remail == "") {
                alert("Please enter Email");
                $("#email").focus();
                return false;
            }
            if (remail != "") {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test(remail) == false) {
                    alert('Invalid Email ID');
                    return false;
                }
            }
            formdata.append("email", remail);
            formdata.append("forgetuserid", forgetuserid);
            $.ajax({
                async: true,
                url: '/Api/callApi/ResetPassword',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (response.Data == "success") {
                        alert("A link to reset the password with instruction has been sent on your registered email, please check and follow the instruction.");
                        $("#email").val("");
                        $("#forgetuserid").val("");
                    }
                    else if (response.Data == "Please try after 2 minutes") {
                        alert("Reset link recently sent. Please try after 2 minutes");
                    }
                    else {
                        alert("UserId/Email is not registered with us. Please enter valid UserId/email");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
        catch (err) {
            alert(err.message);
        }
    });
});