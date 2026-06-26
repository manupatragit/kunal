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

    /*Remove picture*/
    $("#removepic").click(function () {
        if (confirm('Are you sure you want to remove profile picture?')) {
            var formData = new FormData();
            formData.append("id", $("#hidid").val());
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

    /*Save client details*/
    $('form[id="saveclient"]').validate({
        submitHandler: function (form) {
            fname = $("#fname").val();
            mname = $("#mname").val();
            lname = $("#lname").val();
            designation = $("#designation").val();
            copin = $("#pin").val();
            name = $("#name").val();
            email = $("#email").val();
            landline = $("#landline").val();
            mobile = $("#mobile").val();
            address = $("#address").val();
            country = $("#country").val(),
                fstate = $("#state").val();
            fcity = $("#city").val();
            id = $("#hidid").val();
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
            var tempsize = 0;
            var tottempsize = 0;
            var formData = new FormData();
            var totalFiles = document.getElementById("attachment").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                var filename = file.name;
                //validate filechracter
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                    return false;
                }
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                var Extresponse = checkfileextDOC(filename);
                if (String(Extresponse) == "false") {
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
            }
            aadharno = $("#aadharno").val();
            gstno = $("#gstno").val();
            panno = $("#panno").val();
            if (panno != "") {
                var panregex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                if (panregex.test(panno) == false) {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Please enter valid PAN No. It should be 10 characters long. The first five characters should be alphabets in upper case. The next four characters should be any number from 0 to 9.The last (tenth) character should be any upper case alphabet. It should not contain any blank spaces.',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
            }
            if (gstno != "") {
                if (gstno.length != 15) {
                    new PNotify({
                        title: 'Warning!',
                        text: 'GSTIN no should be 15 character',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
            }
            if (gstno != "") {
                if (gstno.length < 15 || gstno.length > 15) {
                    new PNotify({
                        title: 'Warning!',
                        text: 'GSTIN no should be 15 character',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
                var gst = $("#gstno").val();
                var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;
                if (!reggst.test(gst) && gst != '') {
                    //alert('GST Number is not valid. It should be in this "11AAAAA1111Z1A1" format');
                    new PNotify({
                        title: 'Warning!',
                        text: 'GST Number is not valid. It should be in this "11AAAAA1111Z1A1" format',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
            }
            formData.append("fname", fname);
            formData.append("mname", mname);
            formData.append("lname", lname);
            formData.append("designation", designation);
            formData.append("pin", copin);
            formData.append("email", email);
            formData.append("landline", landline);
            formData.append("mobile", mobile);
            formData.append("address", address);
            formData.append("country", country);
            formData.append("state", fstate);
            formData.append("city", fcity);
            formData.append("id", id);
            formData.append("panno", panno);
            formData.append("gstin", gstno);
            formData.append("aadhar", aadharno);
            $.ajax(
                {
                    type: "POST",
                    url: "/api/WorkFlowNewApi/SaveProfile", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        var datas = JSON.stringify(data);
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
                            window.location.reload();
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
    //openloader();
    //$.ajax({
    //    async: true,
    //    url: '/api/WorkFlowNewApi/ClientDetail',
    //    type: 'POST',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: 'json',
    //    success: function (response) {
    //        if (response.Status == true) {
    //            var datas = JSON.stringify(response);
    //            var obj = JSON.parse(response.Data);
    //        }
    //        else {
    //            // alert("not found");
    //        }
    //        var it = 2;
    //        var bclass = '';
    //        var bdata = '';
    //        $.each(obj, function (i, val) {
    //            $("#fname").val(val.cfname);
    //            $("#mname").val(val.cmname);
    //            $("#lname").val(val.clname);
    //            if (val.Designation != null) {
    //                $('#designation option[value="' + val.Designation + '"]').attr("selected", true);
    //            }
    //            $("#pin").val(val.Pin);
    //            $("#email").val(val.cemail);
    //            $("#mobile").val(val.cmobile);
    //            $("#landline").val(val.clandline);
    //            $("#address").val(val.caddress);
    //            $("#name").val(val.cfname);
    //            $("#email").val(val.cemail);
    //            $("#mobile").val(val.cmobile);
    //            $("#landline").val(val.clandline);
    //            $("#address").val(val.caddress);
    //            $("#barno").val(val.BARNo);
    //            try {
    //                $("#Department").val(val.Department);
    //            }
    //            catch (er) {
    //            }
    //            if (val.country == null) {
    //                option11 = '<option value="" selected >Select</option>';
    //            }
    //            else {
    //                if (val.country != null) {
    //                    $('#country option[value="' + val.country + '"]').attr("selected", true);
    //                }
    //            }
    //            if (val.country == "India") {
    //                $("#state").css("display", "unset");
    //                $("#city").css("display", "unset");
    //                if (val.cstate != null) {
    //                    $('#state option[value="' + val.cstate + '"]').attr("selected", true);
    //                }
    //                var option1 = '<option value="' + val.ccity + '" selected > ' + val.ccity + ' </option>';
    //                $("#city").append(option1);
    //            }
    //            else {
    //                $("#ostate").css("display", "unset");
    //                $("#ocity").css("display", "unset");
    //                $("#ostate").val(val.cstate);
    //                $("#ocity").val(val.ccity);
    //            }
    //            $("#hidid").val(val.Id);
    //            if (val.cphoto != null) {
    //                $("#output_image").attr("src", val.cphoto);
    //                $("#removepic").css("display", "block");
    //            }
    //            else {
    //                $("#removepic").css("display", "none");
    //            }
    //            try {
    //                $("#designation").val(val.Designation);
    //            }
    //            catch (er) {
    //            }
    //            $("#aadharno").val(val.AadharCardNo);
    //            $("#gstno").val(val.GSTINNo);
    //            $("#panno").val(val.PANNo);
    //            closeloader();
    //        });
    //    },
    //    error: function () {
    //        alert('Error!');
    //    }
    //});
});