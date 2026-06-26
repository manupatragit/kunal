$(document).ready(function () {
    $("#login").click(function () {
        fnlogin();
    });
    $(".toggle-password").click(function () {
        var x = document.getElementById("pswd");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    });
})
$(document).on('keypress', function (e) {
    if (e.which == 13) {
        fnlogin();
    }
});
/*Login*/
function fnlogin() {
    sessionStorage.clear();
    var uname = $("#uname").val();
    var pswd = $("#pswd").val();
    $("#loginerrspan").html("");
    if (uname == "" || pswd == "") {
        $("#loginerrspan").html("Alert ! Username or Password can't be empty.")
        return false;
    }
    var formData = new FormData();
    formData.append("username", EncodeText(uname));
    formData.append("password", EncodeText(pswd));
    $.ajax({
        type: "POST",
        url: "/api/Login/Login",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                if (response == "Mismatched User Id or Password") {
                    alert("Mismatched User Id or Password");
                    return false;
                }
                sessionStorage.setItem("LoginDetails", JSON.stringify(response))
                if (response.RoleId == 1 || response.RoleId == 2) {
                   // window.location.href = "/NoticeNew/Home";
                    window.location.href = "/Home/Dashboard";
                }
                else {
                   // window.location.href = "/NoticeNew/DraftNotice";
                    window.location.href = "/Home/Dashboard";
                }
            }
        },
        failure: function (response) {
            alert("Something Went Wrong")
        },
        error: function (response) {
            alert("Something Went Wrong")
        }
    });
}
$("#resetpassword").click(function () {
    try {
        var formdata = new FormData();
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
        formdata.append("email", EncodeText(remail));
        $.ajax({
            async: true,
            url: '/api/Login/ResetPassword',
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
$('#eye').click(function () {
    if ($(this).hasClass('fa-eye-slash')) {
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
        $('#vendorpswd').attr('type', 'password');
    } else {
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        $('#vendorpswd').attr('type', 'text');
    }
});