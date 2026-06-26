function LoginController() {
    var privateVariables = {
        format: "^[a-zA-Z1-9]{6,}$",//"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$",
        key:'',
        password:''
    };
    var delegateMethods = {
        setDefaultButton: function (e) {
            e = e || window.event;
            if (e.keyCode == '13') {
                if (!$("#btnlogin").is(":focus") && !$("#Register").is(":focus") && !$("#ForgotPassword").is(":focus") && !$("#companyLogo").is(":focus") && !$("#password").is(":focus")) {
                    $(this).find("#btnlogin").click();
                }
            }
        },
        login: function() {
            if (privateMethods.validateLogin()) {
                var data = { "UserName": ($.trim($("#username").val())).toLowerCase() };
                privateVariables.password = $.trim($("#password").val());
                var headerdata = { "Password": privateVariables.password, "Key": privateVariables.key};
                Utility.postDataToServer("api/AccountApi/Login", data, headerdata, "json", privateMethods.LoginComplete, privateMethods.LoginError, null, false);
            }
            return false;
        },
        encrypt: function () {
            var reg = new RegExp(privateVariables.format);
            var input = $.trim($("#password").val());
            if (input !== "") {
                if (reg.test(input)) {
                    privateVariables.key = Generate_key();
                    var result = Encrypt_Text(input, privateVariables.key);
                    //privateVariables.password = result;
                    //$("#password").val(result);
                }
                else {
                    alert("Invalid Password Format.");
                }
            }
        },
        ForgotPassword: function () {
            window.location.href = Utility.URL + "Account/ForgotPassword";
        },
        Register: function () {
            window.location.href = Utility.URL + "Account/Register";
        }
    };
    var privateMethods = {
        validateLogin: function () {
            var output = true;
            var err = "** Validation Failed **\n";
            if ($.trim($("#username").val()) === "") {
                err += ">> Username is required \n";
                output = false;
                $("#username").focus();
            }
            if (output && $.trim($("#password").val()) === "") {
                err += ">> Password is required \n";
                output = false;
                $("#password").focus();
            }
            if (!output) {
                alert(err);
            }

            return output;
        },
        LoginComplete: function (loginResponse) {
            if (loginResponse.Status) {
                //if ($("#chk_remember").is(":checked")) {
                //    var p = $.trim($("#username").val());
                //    Utility.createCookie(Utility.URL + "name", $.trim($("#username").val()), 30);
                //    if (window.btoa) {
                //        Utility.createCookie(Utility.URL + "value", btoa($.trim($("#password").val())), 30);
                //    } else { //for <= IE9
                //        Utility.createCookie(Utility.URL + "value", base64.encode($.trim($("#password").val())), 30);
                //    }

                //} else {
                //    Utility.eraseCookie(Utility.URL + "name");
                //    Utility.eraseCookie(Utility.URL + "value");
                //}
                window.location.href = (Utility.URL + loginResponse.Data);
            } else {
                alert(loginResponse.Message);
                $("#username").focus();
            }
        },
        LoginError: function (loginErrorResponse) {

            //alert(loginErrorResponse.Message);
        },
        attachevents: function () {
            $("#btnLogin").unbind().bind("click", delegateMethods.login);
            $("#ForgotPassword").bind("click", delegateMethods.ForgotPassword);
            $("#Register").bind("click", delegateMethods.Register);
            $("#login-form").bind("keydown", delegateMethods.setDefaultButton);
            $("#password").bind("blur", delegateMethods.encrypt);
        },
        load: function() {
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