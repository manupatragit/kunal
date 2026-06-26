jQuery(document).ready(function () {
    bindCommonDropdown("OrganisationSize", "Organisation_Size", 'Select');
    bindCommonDropdown("OrganisationType", "Organisation_Type", 'Select');
    bindCommonDropdown("regtype", "Reg_Type", 'Select');

/*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", EncodeText(dropdownname));
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

/*Encode text*/
    function EncodeText(data) {
        if (data == "null" || data == null || data == "") {
        }
        else {
            data = encodeURIComponent(data);
        }
        return data;
    }

/*IP user login*/
    $("#IPUserLogin22").click(function () {
        $.ajax(
            {
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
            var intRegex = /^\d+$/;
            var mobileotp = $("#adminmobile").val();
            if (mobileotp == "") {
                alert("Enter contact no to generate OTP");
                return false;
            }
            else if (mobileotp.length < 10) {
                alert("Enter valid contact no.");
                return false;
            }
            else if (intRegex.test(mobileotp)) { }
            else {
                alert("Please enter valid admin mobile no");
                document.getElementById("adminmobile").focus();
                return false;
            }
            formdata.append("mobileotp", EncodeText(mobileotp));
            $.ajax({
                async: true,
                url: '/firm/SendOTP',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (response.toString() == "waitresendotp") {
                        alert("Please wait for one minute");
                        return false;
                    }
                    $("#otpdiv").css("display", "block");
                    $("#otpdiv1").css("display", "block");
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
            var mobileotp = $("#adminmobile").val();
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
            formdata.append("mobileotp", EncodeText(mobileotp));
            formdata.append("otpvalue", EncodeText(otpvalue));
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
                        $("#otpdiv1").css("display", "none");
                        $("#btnsave").removeAttr("disabled");
                        alert("One Time Password (OTP) has been verified Successfully");
                    }
                    else {
                        $("#btnsave").removeAttr("disabled");
                        $("#otpdiv").css("display", "block");
                        $("#otpdiv1").css("display", "block");
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
        var firstname = $("#firstname").val();
        var middlename = $("#middlename").val();
        var lastname = $("#lastname").val();
        var Designation = $("#Designation").val();
        var OrganisationType = $("#OrganisationType").val();
        var OrganisationName = $("#OrganisationName").val();
        var OrganisationSize = $("#OrganisationSize").val();
        var remail = $("#remail").val();
        var rcontact = $("#rcontact").val();
        var raddress = $("#raddress").val();
        var country = $("#country").val();
        var state = $("#state").val();
        var txtstate = $("#txtstate").val();
        var city = $("#city").val();
        var txtcity = $("#txtcity").val();
        var pincode = $("#pincode").val();
        var adminusername = $("#adminusername").val();
        var adminemail = $("#adminemail").val();
        var adminmobile = $("#adminmobile").val();
        var username = $("#rusername").val();
        var password = $("#rpassword").val();
        var confirmPassword = $("#cpassword").val();
        var secondaryname = $("#secondaryname").val();
        var secondemail = $("#secondaryemail").val();
        var secondarymobile = $("#secondarymobile").val();
        var pack = $("#pack").val();
        var name = $("#OrganisationName").val();
        var confirmPassword = $("#cpassword").val();
        var strfirmnane = $("#OrganisationName").val();
        var strusername = username;
        var regtype = $("#regtype").val();
        var pack = $("#pack").val();
        regtype = OrganisationType;
        if (firstname == "") {
            alert("Please enter first name");
            document.getElementById("firstname").focus();
            return false;
        }
        if (OrganisationName == "") {
            alert("Please enter organisation name");
            document.getElementById("OrganisationName").focus();
            return false;
        }
        if (OrganisationName.length < 8) {
            alert("Organisation name should be more than or equal to eight characters.");
            document.getElementById("OrganisationName").focus();
            return false;
        }
        if (remail == "") {
            alert("Please enter email");
            document.getElementById("remail").focus();
            return false;
        }
        if (remail != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(remail) == false) {
                alert('Invalid email ID');
                document.getElementById("remail").focus();
                return false;
            }
        }
        if (rcontact == "") {
            alert("Please enter mobile no");
            document.getElementById("rcontact").focus();
            return false;
        }
        var intRegex = /^\d+$/;
        if (intRegex.test(rcontact)) {
        }
        else {
            alert("Please enter valid mobile no");
            document.getElementById("rcontact").focus();
            return false;
        }
        if (pack == "") {
            alert("Please select plan");
            document.getElementById("pack").focus();
            return false;
        }
        if (adminusername == "") {
            alert("Please enter admin user name");
            document.getElementById("adminusername").focus();
            return false;
        }
        if (adminemail == "") {
            alert("Please enter admin email-id");
            document.getElementById("adminemail").focus();
            return false;
        }
        if (adminmobile == "") {
            alert("Please enter admin mobile no");
            document.getElementById("adminmobile").focus();
            return false;
        }
        if (intRegex.test(adminmobile)) {
        }
        else {
            alert("Please enter valid admin mobile no");
            document.getElementById("adminmobile").focus();
            return false;
        }
        if (username == "") {
            alert("Please enter a User Id.");
            document.getElementById("rusername").focus();
            return false;
        }
        if (strusername.length < 5) {
            alert("User id should be more than or equal to five characters.");
            document.getElementById("rusername").focus();
            return false;
        }
        if (specialcharecter() == "1") {
            return false;
        }
        if (password == "") {
            alert("Please set the password for the User Id.");
            document.getElementById("rpassword").focus();
            return false;
        }
        if (password.length < 8) {
            alert("Password must contain at least eight characters.");
            document.getElementById("rpassword").focus();
            return false;
        }
        if ($("#rpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#rpassword").val()) == false) {
                alert("Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
                document.getElementById("rpassword").focus();
                return false;
            }
        }
        if (specialcharecterpass($("#rpassword")) == "1") {
            return false;
        }
        if (confirmPassword == "") {
            alert("Please confirm your password that you want to set.");
            document.getElementById("cpassword").focus();
            return false;
        }
        if (confirmPassword.length < 8) {
            alert("Confirm Password must contain at least eight characters.");
            document.getElementById("cpassword").focus();
            return false;
        }
        if ($("#cpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#cpassword").val()) == false) {
                alert("Confirm password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
                document.getElementById("cpassword").focus();
                return false;
            }
        }
        if (specialcharectercpass($("#cpassword")) == "1") {
            return false;
        }
        if (secondemail != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(secondemail) == false) {
                alert('Invalid Secondary Email');
                document.getElementById("secondemail").focus();
                return false;
            }
        }
        if (cptval != $("#txtcaptcha").val()) {
            alert("Please enter valid captcha code");
            return false;
        }
        var chktnc = $("#chktnc").is(':checked');
        if (chktnc == false) {
            alert("Please select terms and conditions");
            return false;
        }
        var formData = new FormData();
        formData.append("firstname", EncodeText($("#firstname").val()));
        formData.append("middlename", EncodeText($("#middlename").val()));
        formData.append("lastname", EncodeText($("#lastname").val()));
        formData.append("Designation", EncodeText($("#Designation").val()));
        formData.append("OrganisationName", EncodeText($("#OrganisationName").val()));
        formData.append("OrganisationType", EncodeText($("#OrganisationType").val()));
        formData.append("OrganisationSize", EncodeText($("#OrganisationSize").val()));
        formData.append("email", EncodeText($("#remail").val()));
        formData.append("contact", EncodeText($("#rcontact").val()));
        formData.append("address", EncodeText($("#raddress").val()));
        formData.append("country", EncodeText($("#country").val()));
        if ($("#state").val() == null) {
            formData.append("state", EncodeText($("#txtstate").val()));
        }
        else {
            formData.append("state", EncodeText($("#state").val()));
        }
        if ($("#city").val() == null) {
            formData.append("city", EncodeText($("#txtcity").val()));
        }
        else {
            formData.append("city", EncodeText($("#city").val()));
        }
        formData.append("pincode", EncodeText($("#pincode").val()));
        formData.append("adminusername", EncodeText($("#adminusername").val()));
        formData.append("adminemail", EncodeText($("#adminemail").val()));
        formData.append("adminmobile", EncodeText($("#adminmobile").val()));
        formData.append("rusername", EncodeText($("#rusername").val()));
        formData.append("rpassword", EncodeText($("#rpassword").val()));
        formData.append("secondaryname", EncodeText($("#secondaryname").val()));
        formData.append("secondaryemail", EncodeText($("#secondaryemail").val()));
        formData.append("secondarymobile", EncodeText($("#secondarymobile").val()));
        formData.append("otptemp", EncodeText($("#otptemp").val()));
        formData.append("regtype", EncodeText($("#regtype").val()));
        formData.append("pack", EncodeText($("#pack").val()));
        $("#btnsave").attr("disabled", true);
        if (password == confirmPassword) {
            $.ajax(
                {
                    type: "POST",
                    url: "/api/WorkFlowNewApi/FirmRegistrationNew", // Controller/View
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
                        else if (String(data.Data) == "Unauthorisedotp") {
                            alert('Please verify OTP');
                            return false;
                        }
                        else if (parseInt(data.Data) > 0) {
                            alert("Firm Registration Successfully");
                            $("#getotp").text("SEND OTP");
                            location.reload();
                        }
                        else {
                            alert('something went wrong!.');
                            return false;
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
        }
        else {
            $("#btnsave").attr("disabled", false);
            alert("Password Does Not match");
        }
    });
});
/*Special character*/
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
    var data = document.getElementById("rname").value;
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
    var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
    var data = str.val();
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");
            document.getElementById("rpassword").focus();
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
function specialcharectercpass(str) {
    var strretrn = "0";
    var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
    var data = str.val();
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in confirm password.");
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
    var iChars = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
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

/*Restrict alphabate fax*/
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
});

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
            $("#m_imgCaptcha").html(response.Data);
            $("#hdncaptcha").html(response.Data);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}

/*Refresh captha*/
function fn_RefreshCaptcha() {
    loadCaptcha1();
}