jQuery(document).ready(function () {
    bindCommonDropdown("OrganisationSize", "Organisation_Size", 'Select');
    bindCommonDropdown("OrganisationType", "Organisation_Type", 'Select');

    /*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/PublicApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*IP user login*/
    $("#IPUserLogin22").click(function () {
        $.ajax({
            type: "GET",
            url: "/firm/testpage1", // Controller/View
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data.toString() == "0") {
                    alert('User Id or Email already exist.');
                    return false;
                }
                else {
                    $("#saveuser")[0].reset();
                    alert("Firm registration has been completed successfully");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    try {
        $("#getotp").click(function () {
            var formdata = new FormData();
            var btntxt = $("#getotp").text();
            var mobileotp = $("#rcontact").val();
            if (mobileotp == "") {
                alert("Enter contact no to generate OTP");
                return false;
            }
            else if (mobileotp.length < 10) {
                alert("Enter valid contact no.");
                return false;
            }
            formdata.append("mobileotp", mobileotp);
            $.ajax({
                async: true,
                url: '/firm/SendOTP',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    $("#otpdiv").css("display", "block");
                    if (btntxt == "Resend OTP") {
                        alert("One Time Password (OTP) has been resend to your Mobile No.");
                    }
                    else {
                        alert("One Time Password (OTP) has been sent to your Mobile No.");
                    }
                    $("#getotp").text("Resend OTP");
                    $("#otpvalue").val("");
                },
                error: function () {
                    alert('Error!');
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
            var otpvalue = $("#otpvalue").val();
            if (otpvalue == "") {
                alert("Enter One Time Password(OTP)");
                document.getElementById("otpvalue").focus();
                return false;
            }
            else if (otpvalue.length < 6) {
                alert("Enter valid OTP");
                document.getElementById("otpvalue").focus();
                return false;
            }
            var mobileotp = $("#rcontact").val();
            if (mobileotp == "") {
                alert("Enter mobile no to Generate OTP");
                document.getElementById("rcontact").focus();
                return false;
            }
            else if (mobileotp.length < 10) {
                alert("Enter valid mobile no.");
                document.getElementById("rcontact").focus();
                return false;
            }
            formdata.append("mobileotp", mobileotp);
            formdata.append("otpvalue", otpvalue);
            $.ajax({
                async: true,
                url: '/firm/VerifyOTP',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (response == "success") {
                        $("#otptemp").val(otpvalue);
                        $("#otpdiv").css("display", "none");
                        $("#btnsave").removeAttr("disabled");
                        alert("One Time Password (OTP) has been verified Successfully");
                    }
                    else {
                        $("#btnsave").removeAttr("disabled");
                        $("#otpdiv").css("display", "block");
                        document.getElementById("otpvalue").focus();
                        alert("One Time Password (OTP) is Invalid.");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        });
    }
    catch (er) {
        alert(er.message);
    }

    /*Save data*/
    $("#btnsave").click(function () {
        var cptval = $("#hdncaptcha").text();
        var chktnc = $("#chktnc").is(':checked');
        var tfirstname = $("#tfirstname").val();
        var tmiddlename = $("#tmiddlename").val();
        var tlastname = $("#tlastname").val();
        var tDesignation = $("#tDesignation").val();
        var tOrganisationName = $("#tOrganisationName").val();
        var temail = $("#temail").val();
        var tmobile = $("#tmobile").val();
        var OrganisationSize = $("#OrganisationSize").val();
        var OrganisationType = $("#OrganisationType").val();
        var tuserid = $("#tuserid").val();
        if (tfirstname == "") {
            alert("Please enter first name");
            document.getElementById("tfirstname").focus();
            return false;
        }
        if (tOrganisationName == "") {
            alert("Please enter orgnisation name.");
            document.getElementById("tOrganisationName").focus();
            return false;
        }
        if (tOrganisationName != "") {
            if (tOrganisationName.length < 8) {
                alert("Orgnisation name should be more than or equal to eight characters.");
                document.getElementById("tOrganisationName").focus();
                return false;
            }
        }
        if (tmobile == "") {
            alert("Please enter mobile no");
            document.getElementById("tmobile").focus();
            return false;
        }
        if (temail == "") {
            alert("Please enter email");
            document.getElementById("temail").focus();
            return false;
        }
        if (temail != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(temail) == false) {
                alert('Invalid email id');
                document.getElementById("temail").focus();
                return false;
            }
        }
        if (specialcharecterFirmName() == "1") {
            return false;
        }
        if (tuserid == "") {
            alert("Please enter a User Id.");
            document.getElementById("tuserid").focus();
            return false;
        }
        if (chktnc == false) {
            alert("Please select terms and conditions and privacy policy");
            return false;
        }
        if (cptval != $("#txtcaptcha").val()) {
            alert("Please enter valid captcha code");
            return false;
        }
        var formData = new FormData();
        formData.append("fname", $("#tfirstname").val());
        formData.append("mname", $("#tmiddlename").val());
        formData.append("lname", $("#tlastname").val());
        formData.append("tDesignation", $("#tDesignation").val());
        formData.append("tOrganisationName", $("#tOrganisationName").val());
        formData.append("OrganisationSize", $("#OrganisationSize").val());
        formData.append("OrganisationType", $("#OrganisationType").val());
        formData.append("email", $("#temail").val());
        formData.append("code", "");
        formData.append("contact", $("#tmobile").val());
        formData.append("remark", "");
        formData.append("title", "");
        formData.append("address", "");
        formData.append("country", "");
        formData.append("landline", "");
        formData.append("secondemail", "");
        formData.append("otptemp", "");
        formData.append("state", "");
        formData.append("city", "");
        formData.append("username", $("#tuserid").val());
        formData.append("password", "");
        formData.append("pincode", "");
        formData.append("adminusername", $("#tfirstname").val());
        formData.append("regtype", "");
        formData.append("pack", "");
        $("#btnsave").attr("disabled", true);
        $.ajax(
            {
                type: "POST",
                url: "/api/WorkFlowNewApi/FirmRegistrationTrialNew", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#btnsave").attr("disabled", false);
                    if (String(data.Data) == "ExistUserID") {
                        alert('UserId is already exists. Try with another UserId!');
                        return false;
                    }
                    else if (String(data.Data) == "ExistEmail") {
                        alert('Email id is already exists. Try with another ID!');
                        return false;
                    }
                    else if (String(data.Data) == "ExistContact") {
                        alert('Contact No. is already exists. Please try another No.');
                        return false;
                    }
                    else if (data.Data.toString() == "0") {
                        alert('User Id or Email already exists.');
                        return false;
                    }
                    else {
                        $("#getotp").text("SEND OTP");
                        $('#myModal').modal('show');
                        $("#hdncaptcha").text("");
                        $("#tfirstname").val("");
                        $("#tmiddlename").val("");
                        $("#tlastname").val("");
                        $("#tDesignation").val("");
                        $("#tOrganisationName").val("");
                        $("#temail").val("");
                        $("#tmobile").val("");
                        $("#OrganisationSize").val("");
                        $("#OrganisationType").val("");
                        $("#tuserid").val("");
                    }
                },
                failure: function (data) {
                    $("#btnsave").attr("disabled", false);
                    alert(data.responseText);
                },
                error: function (data) {
                    $("#btnsave").attr("disabled", false);
                    alert(data.responseText);
                }
            });
    });
});
function specialcharecter() {
    var strretrn = "0";
    var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
    var data = document.getElementById("rusername").value;
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert("Special characters and spaces are not allowed in the User Id.");
            document.getElementById("rusername").focus();
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
function specialcharecterFirmName() {
    var strretrn = "0";
    var iChars = "@#!`$%^&*()+=-[]\\\';,/{}|\":<>?~_";
    var data = document.getElementById("tOrganisationName").value;
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert("Special character not allowed in Firm Name.");
            document.getElementById("rname").focus();
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
function specialcharecterpass(str) {
    var strretrn = "0";
    var iChars = "`%&()+=[]\\\';,./{}|\":<>? ";
    var data = str.val();
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert(" `%&()+=[]\\\';,./{}|\":<>?  special characters are allowed in the password.");
            document.getElementById("password").focus();
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
function specialcharectercpass(str) {
    var strretrn = "0";
    var iChars = "`%&()+=[]\\\';,./{}|\":<>? ";
    var data = str.val();
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert(" `%&()+=[]\\\';,./{}|\":<>?  special characters are allowed in the confirm password.");
            document.getElementById("cpassword").focus();
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
/*Validate password*/
function passwordvalidate(str) {
    var strretrn = "0";
    var iChars = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$"
    var data = str;
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert("Minimum eight characters,at least one uppercase letter, one lowercase letter, one number and one special character");
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
function validateEmail(emailField) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField.value) == false) {
        alert('Invalid Email Address');
        return false;
    }
    return true;
}

/*Restrict alphabate passwird*/
function restrictAlphabetsfax(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 45 || charCode == 47) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
$(document).on('keypress', '#rname', function (event) {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
$(document).on('keypress', '#rtitle', function (event) {
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
$(document).on('keypress', '#adminusername', function (event) {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
$(document).ready(function () {
    loadCaptcha1();
    $('input.form-control').bind('copy paste', function (e) {
        e.preventDefault();
    });
});
function fn_RefreshCaptcha() {
    loadCaptcha1();
}

/*Load captcha*/
function loadCaptcha1() {
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/PublicApi/GenerateCaptcha",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#hdncaptcha").html(response.Data);
            $("#m_imgCaptcha").html(response.Data);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
