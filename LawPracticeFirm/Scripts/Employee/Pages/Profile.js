/**
 * Preview image
 * @param {any} event
 */

var userCurrentUsedEmail = "";
function preview_image(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output_image');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}
/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).ready(function () {
    /*Remove profile picture*/
    $("#removepic").click(function () {
        if (confirm('Are you sure you want to remove profile picture?')) {
            var formData = new FormData();
            formData.append("id", EncodeText($("#hidid").val()));
            openloader();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/EmployeeApi/RemoveProfilepic", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        $("#output_image").attr("src", "/PanelDesign/images/Default_User_pic_new.png");
                        new PNotify({
                            title: 'Success!',
                            text: ' Profile picture removed successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#removepic").css("display", "none");
                        closeloader();
                        try {
                            headercount();
                        }
                        catch (er) {
                        }
                    },
                    failure: function (data) {
                        alert(data.responseText);
                        closeloader();
                    },
                    error: function (data) {
                        alert(data.responseText);
                        closeloader();
                    }
                });
            return false;
        }
    });

    $(document).ready(function () {
        setupEmailVerification();
        document.getElementById('verifyEmailOTP').onclick = async function () { 
            var currentEmail = $('#email').val();
            $('#EmailOTPModal').modal('show');

            const payload = { To: currentEmail };
            openloader();

            try {
                const response = await fetch('/Firm/InsertOTPEmailVerify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json(); 

                if (data.success) {
                    alert("OTP on Email sent successfully.");
                    $('#emailVerified').hide();
                } else {
                    alert("Failed to send OTP. Please try again.");
                    $('#emailVerified').hide();
                }
            } catch (error) {
                console.error(error);
                $('#emailVerified').hide();
                alert("Technical Error. please try after some time.");
            }
        };
        document.getElementById('verifyOTPOnEmail').onclick = async function () {
            var emailotp = $('#emailotp').val();
            const payload = { OTP: emailotp };
            openloader();

            try {
                const response = await fetch('/Firm/UpdateIsUsedOnOTPVerification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    $('#emailVerified').show();
                    $('#addcontact').removeAttr('disabled');
                    $('#EmailOTPModal').modal('hide');
                } else {
                    $('#emailVerified').hide();
                    alert(data.message);
                }
            } catch (error) {
                console.error(error);
                $('#emailVerified').hide();
                alert("Technical Error. please try after some time.");
            }
        };
    });

    function setupEmailVerification() {
        const emailInput = document.getElementById('email');
        const verifyButton = document.getElementById('verifyEmailOTP');
        const emailVerifiedLabel = document.getElementById('emailVerified');
        var updateBtn = document.getElementById('addcontact');
        function checkEmailChange() {
            const currentEmail = $('#email').val().trim();
            verifyButton.disabled = (!currentEmail || currentEmail === lastVerifiedEmail);
            updateBtn.disabled = !verifyButton.disabled;
            emailVerifiedLabel.style.display = 'none';
        }

        let lastVerifiedEmail = null;

        function initLastVerifiedEmail() {
            const val = $('#email').val().trim();
            if (val !== "") {
                lastVerifiedEmail = val;
                userCurrentUsedEmail = val; 
                checkEmailChange();
            } else {
                setTimeout(initLastVerifiedEmail, 50);
            }
        }
        initLastVerifiedEmail();
        $('#email').on('input change', checkEmailChange);
    }

    /*Save Client details*/
    $('form[id="saveclient"]').validate({
        submitHandler: function (form,e) {
            openload();
            e.preventDefault();
            var commuemail = "";
            fname = $("#fname").val();
            mname = $("#mname").val();
            lname = $("#lname").val();
            designation = $("#codesignation").val();
            email = $("#email").val();
            landline = $("#landline").val();
            mobile = $("#mobile").val();
            var savedEmail = $("#currentEmail").val();
            var savedMobile = $("#currentMobile").val();
            address = $("#address").val();
            country = $("#country").val();
            fstate = $("#state").val();
            fcity = $("#city").val();
            id = $("#hidid").val();
            pin = $("#pin").val();
            gst = $("#gstin").val();
            panno = $("#panno").val();
            barno = $("#barno").val();
            
            commuemail = $("#commuemail").val();
            if (String(commuemail) == "undefined" || String(commuemail) == "null") {
                commuemail = "";
            }
            if (commuemail != "") {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test(commuemail) == false) {
                    alert('Invalid communication email ID');
                    document.getElementById("commuemail").focus();
                    closeload();
                    return false;
                }
            }
            if (country != "india") {
                fstate = $("#ostate").val();
                fcity = $("#ocity").val();
            }
            if (country == "India") {
                fstate = $("#state").val();
                fcity = $("#city").val();
            }
            var tempsize = 0;
            var tottempsize = 0;
            var formData = new FormData();

            var totalFiles = document.getElementById("attachment").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                var filename = file.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1);
                if (extension.toLowerCase() == "jpg" || extension.toLowerCase() == "jpeg" || extension.toLowerCase() == "png") {
                }
                else {
                    alert("Only JPG,JPEG and PNG extensions/files are allowed.");
                    closeload();
                    return false;
                }
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are  not allowed.');
                    closeload();
                    return false;
                }
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    closeload();
                    return false;
                }
                formData.append("FileUpload", file);
                try {
                    if (typeof (file) != "undefined") {
                        size = parseFloat(file.size / 1024).toFixed(2);
                        tottempsize = parseFloat(tottempsize) + parseFloat(size);
                        tempsize = parseFloat(size);
                    }
                }
                catch (err) {
                    //alert(err.message);
                }
                tempsize = tempsize.toFixed(2);
                if (tempsize > filesize) {
                    new PNotify({
                        title: 'Warning!',
                        text: Filesizelabel,
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                    return false
                }
            }
            formData.append("fname", EncodeText(fname));
            formData.append("mname", EncodeText(mname));
            formData.append("lname", EncodeText(lname));
            formData.append("designation", EncodeText(designation));
            formData.append("Gstin", EncodeText(gst));
            formData.append("panno", EncodeText(panno));
            formData.append("pin", EncodeText(pin));
            formData.append("email", EncodeText(email));
            formData.append("landline", EncodeText(landline));
            formData.append("mobile", EncodeText(mobile));
            formData.append("address", EncodeText(address));
            formData.append("country", EncodeText(country));
            formData.append("state", EncodeText(fstate));
            formData.append("city", EncodeText(fcity));
            formData.append("id", EncodeText($("#hidid").val()));
            formData.append("barno", EncodeText(barno));
            formData.append("commuemail", EncodeText(commuemail));
            formData.append("savedEmail", EncodeText(savedEmail));
            formData.append("savedMobile", EncodeText(savedMobile));
            var designation = "";
            try {
                designation = $("#designation").val();
            }
            catch (er) {
            }
            var department = "";
            try {
                department = $("#Department").val();
            }
            catch (er) {
            }
            formData.append("department", EncodeText(department));
            openloader();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/EmployeeApi/SaveProfile", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        var datas = JSON.stringify(data);
                        if (data.Data == "E-Mail Already Exists  Please Try Another E-Mail!") {
                            //alert("Email id is already exists. Please try with different Id!");
                            new PNotify({
                                title: 'Warning!',
                                text: 'Email id is already exists. Please try with different Id!',
                                type: 'error',
                                delay: 3000
                            });
                            closeloader();
                            return false;
                        }
                        if (data.Data == "Email id is already exists. Please try with different Id!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Email id is already exists. Please try with different Id!',
                                type: 'error',
                                delay: 3000
                            });
                            closeloader();
                        }
                        else if (data.Data == "Already Exists Mobile Please Try Another Mobile!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Mobile No. is already exists. Please try another Number!',
                                type: 'error',
                                delay: 3000
                            });
                            closeloader();
                        }
                        else {
                            new PNotify({
                                title: 'Success!',
                                text: ' Updated Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            closeloader();
                            localStorage.setItem("userprofile", "");
                            if ($("#output_image").attr("src") != "/PanelDesign/images/Default_User_pic_new.png") {
                                $("#removepic").css("display", "block");
                            }
                            else {
                                $("#removepic").css("display", "none");
                            }
                            try {
                                headercount();
                            }
                            catch (ex) {
                            }
                            window.location.reload(true);
                        }
                    },
                    failure: function (data) {
                        alert(data.responseText);
                        closeloader();
                    },
                    error: function (data) {
                        alert(data.responseText);
                        closeloader();
                    }
                });
        }
    });
    setTimeout(function () {
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/UserDetail',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    // alert("not found");
                }
                var it = 2;
                var bclass = '';
                var bdata = '';
                $.each(obj, function (i, val) {

                    $("#fname").val(val.cfname.replace("&amp;", "&"));
                    $("#mname").val(val.cmname);
                    $("#lname").val(val.clname);
                    $("#designation").val(val.Designation)
                    $("#pin").val(val.Pin);
                    $("#email").val(val.cemail);
                    $("#mobile").val(val.cmobile);
                    $("#landline").val(val.clandline);
                    $("#address").val(val.caddress);
                    $("#name").val(val.cfname);
                    $("#email").val(val.cemail);
                    $("#mobile").val(val.cmobile);
                    $("#currentEmail").val(val.cemail);
                    $("#currentMobile").val(val.cmobile);
                    $("#landline").val(val.clandline);
                    $("#address").val(val.caddress);
                    $("#barno").val(val.BARNo);
                    $("#commuemail").val(val.Commuemail);
                    try {
                        $("#Department").val(val.Department);
                    }
                    catch (er) {
                    }
                    if (val.country == null) {
                        option11 = '<option value="" selected >Select</option>';
                    }
                    else {
                        $('#country option[value="' + val.country + '"]').attr("selected", true);
                        setTimeout(function () {
                            $('#country option[value="' + val.country + '"]').attr("selected", true);
                        }, 2000);
                    }
                    //$("#country").append(option11);
                    if (val.country == "India") {
                        $("#ostate").css("display", "none");
                        $("#ocity").css("display", "none");
                        $("#state").css("display", "unset");
                        $("#city").css("display", "unset");
                        $("#country").change();
                        setTimeout(function () {
                            $('#state option[value="' + val.cstate + '"]').prop("selected", true);
                        }, 2000);
                        setTimeout(function () {
                            $("#state").change();
                        }, 2000);
                        setTimeout(function () {
                            $('#city option[value="' + val.ccity + '"]').prop("selected", true);
                            closeloader();
                        }, 3000);
                    }
                    else {
                        $("#ostate").css("display", "unset");
                        $("#ocity").css("display", "unset");
                        $("#state").css("display", "none");
                        $("#city").css("display", "none");
                        $("#ostate").val(val.cstate);
                        $("#ocity").val(val.ccity);
                        closeloader();
                    }
                    $("#hidid").val(val.Id);
                    if (val.cphoto != null) {
                        $("#output_image").attr("src", val.cphoto);
                        $("#removepic").css("display", "block");
                    }
                    else {
                        $("#removepic").css("display", "none");
                    }
                    if (val.Designation != null) {
                        $('#codesignation option[value="' + val.Designation + '"]').attr("selected", true);
                    }
                });
            },
            error: function () {
                alert('Error!');
            }
        });
    }, 6000);
});

