/**
 * Preview image
 * @param {any} event
 */
function preview_image(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output_image');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}
$(document).ready(function () {
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(".validpanel").css("display", "none");
    var newURL = window.location.protocol + "/" + window.location.host
    var pagetype = 5;
    if (pagetype == "5") {
        $("#showcontent").css("display", "block");
    }
    else {
        $("#showcontent").css("display", "block");
    }

    //save data
    $('form[id="saveclient"]').validate({
        submitHandler: function (form) {
            var password = $("#npassword").val();
            var confirmPassword = $("#cpassword").val();
            if (password == "") {
                alert("Please set the password for the User Id.");
                return false;
            }
            if (password.length < 8) {
                alert("Password must contain at least eight characters.");
                return false;
            }
            if ($("#npassword").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#npassword").val()) == false) {
                    alert("Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (confirmPassword == "") {
                alert("Please confirm your password that you want to set.");
                return false;
            }
            if (confirmPassword.length < 8) {
                alert("Confirm Password must contain at least eight characters.");
                return false;
            }
            if ($("#cpassword").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#cpassword").val()) == false) {
                    alert("Confirm password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (password != confirmPassword) {
                new PNotify({
                    title: 'Warning!',
                    text: 'Password did not match!',
                    type: 'error',
                    delay: 3000
                });
            }
            else {
                name = $("#name").val();
                email = $("#email").val();
                landline = $("#landline").val();
                mobile = $("#mobile").val();
                address = $("#address").val();
                country = $("#country").val(),
                    fstate = $("#state").val();
                fcity = $("#city").val();
                username = $("#username").val();
                npassword = $("#npassword").val();
                cpassword = $("#cpassword").val();
                barno = $("#barno").val();
                designation = $("#designation").val();
                if (username != "") {
                    if (specialcharecter(username) == "1") {
                        return false;
                    }
                }
                if (country != "India") {
                    fstate = $("#ostate").val();
                    fcity = $("#ocity").val();
                }
                if (country == "India") {
                    fstate = $("#state").val();
                    fcity = $("#city").val();
                }
                if (fstate == "") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Please fill the state name.',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
                if (fcity == "") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Please fill the city name.',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
                var formData = new FormData();
                var tempsize = 0;
                var totalFiles = document.getElementById("attachment").files.length;
                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("attachment").files[i];
                    var filename = file.name;
                    if (filename.length > 100) {
                        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                        return false;
                    }
                    formData.append("FileUpload", file);
                    try {
                        if (typeof (file) != "undefined") {
                            size = parseFloat(file.size / 1024).toFixed(2);
                            tempsize = parseFloat(tempsize) + parseFloat(size);
                        }
                    }
                    catch (err) {
                        //alert(err.message);
                    }
                }
                tempsize = tempsize.toFixed(2);
                if (tempsize > filesize) {
                    new PNotify({
                        title: 'Warning!',
                        text: 'File size greater than 2 MB cannot be accepted.',
                        type: 'error',
                        delay: 3000
                    });
                    return false
                }
                formData.append("name", name);
                formData.append("email", email);
                formData.append("landline", landline);
                formData.append("mobile", mobile);
                formData.append("address", address);
                formData.append("country", country);
                formData.append("state", fstate);
                formData.append("city", fcity);
                formData.append("username", username);
                formData.append("npassword", npassword);
                formData.append("cpassword", cpassword);
                openload();
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/CallApi/PostSaveClient", // Controller/View
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            var datas = JSON.stringify(data);
                            if (data.Data == "Already Exists User Please Try Another User Name!") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'User ID is already exists. Please Try Another User ID !',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else if (data.Data == "Email id is already exists. Please try with different Id!") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' Email id is already exists. Please try with different Id! ',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else if (data.Data == "Already Exists Mobile Please Try Another Mobile!") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'Mobile No. is already exists. Please try another Number!',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else {
                                $("#saveclient")[0].reset();
                                $("#output_image").attr("src", "/PanelDesign/images/Default_User_pic_new.png");
                                new PNotify({
                                    title: 'Success!',
                                    text: ' ' + clientlable + ' Created Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                closeload();
                            }
                        },
                        failure: function (data) {
                            alert(data.responseText);
                            closeload();
                        },
                        error: function (data) {
                            alert(data.responseText);
                            closeload();
                        }
                    });
            }
        }
    });
});