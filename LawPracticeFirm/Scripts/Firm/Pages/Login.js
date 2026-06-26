var Ispackmodule = "";
/*Login controller*/
function LoginController() {

    var privateVariables = {
        format: "^[a-zA-Z1-9]{6,}$",//"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$",
        key: '1',
        password: ''
    };
    var ajaxTime = "";
    var delegateMethods = {
        setDefaultButton: function (e) {
            e = e || window.event;
            if (e.keyCode == '13') {
                if (!$("#btnlogin").is(":focus") && !$("#Register").is(":focus") && !$("#ForgotPassword").is(":focus") && !$("#companyLogo").is(":focus") && !$("#password").is(":focus")) {
                    $(this).find("#btnlogin").click();
                }
            }
        },
        login: function () {
            if (privateMethods.validateLogin()) {
                var data = { "UserName": ($.trim($("#username").val())).toLowerCase() };
                privateVariables.password = $.trim($("#password").val());
                var headerdata = { "Password": privateVariables.password, "Key": privateVariables.key };
                ajaxTime = new Date().getTime();
                Utility.postDataToServer("api/AccountApi/Login", data, headerdata, "json", privateMethods.LoginComplete, privateMethods.LoginError, null, false);
                localStorage.removeItem('ShowPopUpSession', "ShowPopup");
                localStorage.setItem('ShowPopUpSession', "ShowPopup");

            }
            return false;
        },
        encrypt: function () {
            if (!$(this)[0].validity.valid) {
                alert("Password Format is invalid!");
                return false;
            }
        },
        ForgotPassword: function () {
            window.location.href = Utility.URL + "Account/ForgotPassword";
        },
        Register: function () {
            window.location.href = Utility.URL + "Account/Register";
        }
    };
    /*Private method*/
    var privateMethods = {
        validateLogin: function () {
            var output = true;
            var err = "";
            if ($.trim($("#username").val()) === "" && $.trim($("#password").val()) === "") {
                err += "Username & Password  is required \n";
                output = false;
                $("#username").focus();
            }
            else if ($.trim($("#username").val()) === "") {
                err += "Username is required \n";
                output = false;
                $("#username").focus();
            }
            else if (output && $.trim($("#password").val()) === "") {
                err += "Password is required \n";
                output = false;
                $("#password").focus();
            }
            if (!output) {
                alert(err);
            }
            return output;
        },
        LoginComplete: function (loginResponse) {
            var totalTime = new Date().getTime() - ajaxTime;
            console.log("details:" + totalTime);
            try {
                localStorage.setItem("savetimeentry", "1");
                localStorage.setItem("tasktimervalue", $("#duration2").val());
                localStorage.setItem('active_id', 'home_sidebar');
                //starttime();
                sessionStorage.setItem("h2", sessionStorage.getItem("h1"));
                sessionStorage.setItem("m2", sessionStorage.getItem("m1"));
                sessionStorage.setItem("s2", sessionStorage.getItem("s1"));
                sessionStorage.setItem("h1", 0);
                sessionStorage.setItem("m1", 0);
                sessionStorage.setItem("s1", 0);
                window.clearInterval(window.t11);
            }
            catch
            {
            }
            if (loginResponse.Status) {
                if (String(loginResponse.Data) == "alreadyloggedin") {
                    //alert("1. A session with the Sign In is currently active.\n2. You did not use the SignOut tab to exit, instead used the Close button(X). Close the mykase page. You should be able to log in after 6 mins or call at 0120-4014521/523/524 : Toll Free 1-800-103-3550 [Mon-Fri 8.30 am - 6.00 pm] Email: contact@mykase.in");
                    alert("A session with the Sign In is currently active.");
                    return false;
                }
                else if (String(loginResponse.Data) == "Authenticate") {
                    window.location.href = (Utility.URL + "/home/TwoFactorAuthentication");
                }
                else {
                    $.ajax({
                        async: true,
                        url: '/Firm/IsNoticePack',
                        //data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (response) {
                        
                            if (response == "Notice") {
                                //alert(loginResponse.Data);
                                //var fnlurl=http://localhost:55516/TECH/firm/dashboard
                                var fnlurl = (Utility.URL + loginResponse.Data);
                                fnlurl = fnlurl.replace("dashboard", "NoticeDashboard");
                                //fnlurl = fnlurl.replace("Employee", "firm");
                                //fnlurl = fnlurl.replace("/Client/Personaldashboard", "/Client/matterlist");
                                //  alert(Utility.URL + loginResponse.Data);
                                //  console.log(Utility.URL + loginResponse.Data);
                                //window.location.href = (Utility.URL + loginResponse.Data);
                                window.location.href = fnlurl;
                            }
                            else if (response == "MkLitigation") {
                                localStorage.setItem('active_id', 'matter_sidebar');
                                var fnlurl = (Utility.URL + loginResponse.Data);
                                fnlurl = fnlurl.replace("/firm/dashboard", "/CW/LitigationDashboard");
                                window.location.href = fnlurl;
                            }
                            else if (response == "IPR") {
                                var fnlurl = (Utility.URL + loginResponse.Data);
                                fnlurl = fnlurl.replace("/firm/dashboard", "/IPR/IPRDashboard");
                                window.location.href = fnlurl;
                            }
                            else {
                                //alert(loginResponse.Data);
                                //var fnlurl=http://localhost:55516/TECH/firm/dashboard
                                var fnlurl = (Utility.URL + loginResponse.Data);
                                fnlurl = fnlurl.replace("dashboard", "Personaldashboard");
                                fnlurl = fnlurl.replace("Employee", "firm");
                                fnlurl = fnlurl.replace("/Client/Personaldashboard", "/Client/matterlist");
                                //  alert(Utility.URL + loginResponse.Data);
                                //  console.log(Utility.URL + loginResponse.Data);
                                //window.location.href = (Utility.URL + loginResponse.Data);
                                window.location.href = fnlurl;
                            }
                        },
                        error: function () {
                            alert('Error!');
                        }
                    });
                }
            }
            else {
                if (loginResponse.Message == "Non-static method requires a target." || loginResponse.Message =="User id is not Activated.") {
                    alert("User id is not Activated.");
                }
                else {
                    alert(loginResponse.Message);
                }
                $("#username").focus();
            }
        },
        LoginError: function (loginErrorResponse) {
            console.
                alert(loginErrorResponse.Message);
        },
        attachevents: function () {
            $("#btnLogin").unbind().bind("click", delegateMethods.login);
            $("#ForgotPassword").bind("click", delegateMethods.ForgotPassword);
            $("#Register").bind("click", delegateMethods.Register);
            $("#login-form").bind("keydown", delegateMethods.setDefaultButton);
            // $("#password").bind("blur", delegateMethods.encrypt);
        },
        load: function () {
            //$("#chk_remember").attr("checked", "checked");
            var id = Utility.readCookie(Utility.URL + "name");
            $("#username").val(id);
            var pwd = Utility.readCookie(Utility.URL + "value");
            if ($.trim(pwd) != "") {
                if (window.atob) {
                    pwd = atob(pwd);
                } else { //for <= IE9
                    pwd = base64.decode(pwd);
                }
            }
            $("#password").val(pwd);
            $("#username").focus();
        }
    };
    var constructor = {
        LoginController: function () {
            privateMethods.load();
            privateMethods.attachevents();
        }
    };
    constructor.LoginController();
}
$(document).ready(function () {
    var loginController = new LoginController();
});
$(document).on('keypress', function (e) {
    if (e.which == 13) {
        //$("#btnLogin").find("#btnLogin").click();
        document.getElementById("btnLogin").click();
        // alert('You pressed enter!');
    }
});
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
$(document).ready(function () {
    $("#scheduledemoclose").click(function () {
        $("#scheduledemoiframe").prop("src", "/schedule-demo?f=1");
    });
    $("#Savecontact").click(function () {
        var contactname = $("#contactname").val();
        var contactemail = $("#contactemail").val();
        var contactphone = $("#contactphone").val();
        var contactmsg = $("#contactmessage").val();
        var cterms = $("#cterms").val();
        return false;
        if (contactname == "") {
            alert("Please enter name");
            return false;
        }
        if (contactemail == "") {
            alert("Please enter Email");
            return false;
        }
        if (contactemail != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(contactemail) == false) {
                alert('Invalid Email ID');
                return false;
            }
        }
        if (contactphone == "") {
            alert("Please enter phone No.");
            return false;
        }
        if (contactmsg == "") {
            alert("Please enter message");
            return false;
        }
        var isChecked = $("#cterms").is(":checked");
        if (isChecked) {
        } else {
            alert("Please tick Privacy Policy and Terms Conditions");
            return false;
        }
        var formData = new FormData();
        formData.append("contactname", contactname);
        formData.append("contactemail", contactemail);
        formData.append("contactphone", contactphone);
        formData.append("contactmsg", contactmsg);
        $.ajax({
            async: true,
            url: '/home/SaveContactUs',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response == "success") {
                    alert("Form saved successfully. Thank You.");
                    document.getElementById("ContactForm").reset();
                }
                else {
                    alert(response);
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
    $("#forgetidlink").click(function () {
        $("#modalheading").text("Reset Password");
        $("#loginwindow").css("display", "none");
        $("#forgetwindow").css("display", "block");
        $("#loginiddiv").css("display", "block");
        $("#forgetiddiv").css("display", "none");
    });
    $("#loginidlink").click(function () {
        $("#modalheading").text("Login");
        $("#loginwindow").css("display", "block");
        $("#forgetwindow").css("display", "none");
        $("#loginiddiv").css("display", "none");
        $("#forgetiddiv").css("display", "block");
    });
    $("#openlogin").click(function () {
        $("#modalheading").text("Login");
        $("#loginwindow").css("display", "block");
        $("#forgetwindow").css("display", "none");
        $("#loginiddiv").css("display", "none");
        $("#forgetiddiv").css("display", "block");
    });
    /*Save demo contact*/
    $("#SaveDemocontact").click(function () {
        var contactname = $("#demoname").val();
        var contactemail = $("#demoemail").val();
        var contactphone = $("#demophone").val();
        var contactmsg = "";
        if (contactname == "") {
            alert("Please enter name");
            return false;
        }
        if (contactemail == "") {
            alert("Please enter Email");
            return false;
        }
        if (contactemail != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(contactemail) == false) {
                alert('Invalid Email ID');
                return false;
            }
        }
        if (contactphone == "") {
            alert("Please enter phone No.");
            return false;
        }
        var formData = new FormData();
        formData.append("contactname", contactname);
        formData.append("contactemail", contactemail);
        formData.append("contactphone", contactphone);
        formData.append("contactmsg", contactmsg);
        $.ajax({
            async: true,
            url: '/home/SaveContactUs',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response == "success") {
                    $('#myModal').modal('show');
                    document.getElementById("democontact").reset();
                }
                else {
                    alert(response);
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
});
var arr = window.location.href.split('/');

/*Save contact*/
function fn_SaveContact() {
    var contactname = $("#conname").val();
    var contactemail = $("#conemail").val();
    var contactphone = $("#conphone").val();
    var contactmsg = $("#conmessage").val();
    var firmcode = arr[3];
    if (contactmsg == "undefined") contactmsg = "";
    if (contactname == "") {
        alert("Please enter name");
        return false;
    }
    if (contactemail == "") {
        alert("Please enter Email");
        return false;
    }
    if (contactemail != "") {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(contactemail) == false) {
            alert('Invalid Email ID');
            return false;
        }
    }
    if (contactphone == "") {
        alert("Please enter phone No.");
        return false;
    }
    if (contactmsg == "") {
        alert("Please enter message");
        return false;
    }
    var formData = new FormData();
    formData.append("contactname", contactname);
    formData.append("contactemail", contactemail);
    formData.append("contactphone", contactphone);
    formData.append("contactmsg", contactmsg);
    formData.append("firmcode", firmcode);
    $.ajax({
        async: true,
        url: '/home/SaveContactUs',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response == "success") {
                alert("Saved successfully. Thank You.");
                $("#conname").val("");
                $("#conemail").val("");
                $("#conphone").val("");
                $("#conmessage").val("");
            }
            else {
                alert(response);
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}
/*IsNumber*/
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
/*Restrict alphabate*/
function restrictAlphabets(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
//Check IsNotice PackModule
function Ischecknoticepack() {
    Ispackmodule = "";
    $.ajax({
        async: true,
        url: '/Firm/IsNoticePack',
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            debugger;
            if (response == "Notice") {
                Ispackmodule = "Notice";
            }
            else {
                Ispackmodule = "All";
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}