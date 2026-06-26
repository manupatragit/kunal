function RegisterController() {
    var privateVariables = {
        format: "^[a-zA-Z1-9]{6,}$",//"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$",//"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}",
        key: '',
        password: ''
    };
    var delegateMethods = {
        setDefaultButton: function (e) {
            e = e || window.event;
            if (e.keyCode == '13') {
                $(this).find("#btnRegister").click();
            }
        },
        register: function () {
            if (privateMethods.validateRegister()) {
                privateVariables.key = Generate_key();
                var result = Encrypt_Text($.trim($("#password").val()), privateVariables.key);
                privateVariables.password = $.trim($("#password").val());
                var data = {
                    "FirmName": $.trim($("#firmname").val()),
                    "FirmCode": $.trim($("#firmCode").val()),
                    "FirmLabel": $.trim($("#firmTitle").val()),
                    "Email": $.trim($("#firmAdminEmail").val()),
                    "UserName": ($.trim($("#firmAdminUserName").val())).toUpperCase(),
                };
                var headerdata = { "Password": privateVariables.password, "Key": privateVariables.key };
                Utility.postDataToServer("api/FirmAccountApi/Registration", data, headerdata, "json", privateMethods.registerComplete, privateMethods.LoginError, data, false);
            }
            return false;
        },
        clear: function () {
            $(this).val('');
            return false;
        },
        encrypt: function () {
            var reg = new RegExp(privateVariables.format);
            var input = $.trim($(this).val());
            if (input !== "") {
                if (reg.test(input)) {
                    if (privateVariables.key === '') {
                        privateVariables.key = Generate_key();
                    }
                    var result = Encrypt_Text(input, privateVariables.key);
                    privateVariables.password = result;
                    $(this).val(result);
                }
                else {
                    alert("Invalid Password Format.");
                }
            }
            return false;
        }
    };
    var privateMethods = {
        validateRegister: function () {
            var output = true;
            var err = "** Validation Failed **\n";
            if ($.trim($("#firmname").val()) === "") {
                err += ">> firm name is required \n";
                output = false;
                $("#firmname").focus();
            }

            if ($.trim($("#firmCode").val()) === "") {
                err += ">> firm Code is required \n";
                output = false;
                $("#firmCode").focus();
            }

            if ($.trim($("#firmCode").val()).length < 3 || $.trim($("#firmCode").val()).length > 10) {
                err += ">> firm Code is should be between 3 to 10 characters \n";
                output = false;
                $("#firmCode").focus();
            }

            if ($.trim($("#firmTitle").val()) === "") {
                err += ">> firm title is required \n";
                output = false;
                $("#firmTitle").focus();
            }

            if ($.trim($("#firmAdminUserName").val()) === "") {
                err += ">> Admin User name is required \n";
                output = false;
                $("#firmAdminUserName").focus();
            }

            if ($.trim($("#firmAdminEmail").val()) === "") {
                err += ">> Admin Email is required \n";
                output = false;
                $("#firmAdminEmail").focus();
            }

            if ($.trim($("#password").val()) === "") {
                err += ">> Password is required \n";
                output = false;
                $("#password").focus();
            }

            if (!$("#password")[0].validity.valid) {
                err += ">> Password Format is not valid \n";
                output = false;
                $("#password").focus();
            }

            if ($.trim($("#confirmpassword").val()) !== $.trim($("#password").val())) {
                err += ">> Password not matched \n";
                output = false;
                $("#confirmpassword").focus();
            }

            if (!$("#confirmpassword")[0].validity.valid) {
                err += ">> Password Format is not valid \n";
                output = false;
                $("#confirmpassword").focus();
            }

            if (!output) {
                alert(err);
            }

            return output;
        },
        registerComplete: function (response, params) {
            if (response.Status && response.Data!=="") {
                alert("Registration Successfull!!");
                window.location.href = response.Data;
            } else {
                alert(response.Message);
                $("#username").focus();
            }
        },
        error: function (loginErrorResponse) {

            //alert(loginErrorResponse.Message);
        },
        attachevents: function () {
            $("#btnRegister").unbind().bind("click", delegateMethods.register);
            $("#Register").bind("click", delegateMethods.Register);
            $(".container-login100").bind("keydown", delegateMethods.setDefaultButton);
            //$("#password").bind("blur", delegateMethods.encrypt).bind("focus", delegateMethods.clear);
            //$("#confirmpassword").bind("blur", delegateMethods.encrypt).bind("focus", delegateMethods.clear);
        },
        load: function () {
            
        }
    };
    var constructor = {
        RegisterController: function () {
            privateMethods.load();
            privateMethods.attachevents();
        }
    };
    constructor.RegisterController();
}

$(document).ready(function () {
    var controller = new RegisterController();
});