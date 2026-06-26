function AdminLogin() {
    var privateVariables = {};
    var delegateMethods = {
        login: function () {
            if (privateMethods.validateLogin()) {
                var data = { "UserName": ($.trim($("#username").val())).toLowerCase() };
                var headerdata = { "Password": $.trim($("#password").val()) };
                Utility.postDataToServer("api/ApplicationUserApi/Login", data, headerdata, "json", privateMethods.LoginComplete, privateMethods.LoginError, null, false);
            }
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
                //if (Url !== '') {
                //    window.location.href = (Utility.URL + Url);
                //}
                //else {
                //    window.location.href = (Utility.URL + loginResponse.Data);
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
        },
        load: function () { }
    };

    var constructor = {
        AdminLogin: function () {
            privateMethods.load();
            privateMethods.attachevents();
        }
    };
    constructor.AdminLogin();
}

$(document).ready(function () {
    var al = new AdminLogin();
});