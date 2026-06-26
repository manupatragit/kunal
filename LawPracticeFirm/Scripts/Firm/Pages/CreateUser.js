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
    try {
        bindCommonDropdown("qualification", "Qualification", 'Select');
        bindCommonDropdown("pqe", "PQE", 'Select');
        bindCommonDropdown("areaofexpertise", "AreaofExperties", 'Select');
    }
    catch
    {
    }
    $('input[type=radio][name=partner]').change(function () {
        $("#rpartner").val("");
        if (this.value == '0') {
            $("#partnerdiv").show();
        }
        else {
            $("#partnerdiv").hide();
        }
    });
    Loadstructure();
    /*Load file structure*/
    function Loadstructure() {
        $("#designation,#branch,#department").html('');
        var option7 = '<option value="" > Select</option>';
        $("#designation,#branch,#department").append(option7);
        var formData = new FormData();
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadFirmStructureAll',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    if (a.SType == "Designation") {
                        var option = '<option value="' + a.Id + '" > ' + a.Name + '</option>';
                        $("#designation").append(option);
                    }
                    if (a.SType == "Branch") {
                        var option = '<option value="' + a.Id + '" > ' + a.Name + '</option>';
                        $("#branch").append(option);
                    }
                    if (a.SType == "Department") {
                        var option = '<option value="' + a.Id + '" > ' + a.Name + '</option>';
                        $("#department").append(option);
                    }
                });
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }

    /*Special character*/
    function specialcharecter() {
        var strretrn = "0";
        var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
        var data = document.getElementById("couserid").value;
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert("Special characters and spaces are not allowed in the User Id.");
                document.getElementById("couserid").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    /*Validate name on key press*/
    $(document).on('keypress', '#name', function (event) {
        var regex = new RegExp("^[a-zA-Z1-9 ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
    /*Validate details on key press*/
    $(document).on('keypress', '#umobile,#upin,#uhrate,#uextention', function (event) {
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
    /*Validate department on key press*/
    $(document).on('keypress', '#Department', function (event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
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
    $('form[id="saveuser"]').validate({
        submitHandler: function (form) {
            var copassword = "";
            var cocpassword = "";
            var couserid = "";
            ufname = $("#ufname").val();
            umname = $("#umname").val();
            ulname = $("#ulname").val();
            designation = $("#designation").val();
            branch = $("#branch").val();
            cocountry = $("#cocountry").val(),
                costate = $("#costate").val();
            cocity = $("#cocity").val();
            department = $("#department").val();
            umobile = $("#umobile").val();
            uemail = $("#uemail").val();
            ulandline = $("#ulandline").val();
            uextention = $("#uextention").val();
            rmanager = $("#rmanager").val();
            uaddress = $("#uaddress").val();
            rpartner = $("#rpartner").val();
            upin = $("#upin").val();
            barno = $("#barno").val();
            uhrate = $("#uhrate").val();
            somedia = $("#somedia").val();
            twitter = $("#twitter").val();
            details = $("#details").val();
            areaofexpertise = $("#areaofexpertise").val();
            firmexperience = $("#firmexperience").val();
            pqe = $("#pqe").val();
            qualification = $("#qualification").val();
            isactivate = 0;
            empcode = $("#empcode").val();
            var partnertype = $("input[name='partner']:checked").val();
            if (couserid != "") {
                if (specialcharecter(couserid) == "1") {
                    return false;
                }
            }
            if (!$("input[name='partner']:checked").val()) {
                alert("Please select user type");
                return false;
            }
            var formData = new FormData();
            formData.append("ufname", EncodeText(ufname));
            formData.append("umname", EncodeText(umname));
            formData.append("ulname", EncodeText(ulname));
            formData.append("designation", EncodeText(designation));
            formData.append("branch", EncodeText(branch));
            formData.append("cocountry", EncodeText(cocountry));
            formData.append("costate", EncodeText(costate));
            formData.append("cocity", EncodeText(cocity));
            formData.append("department", EncodeText(department));
            formData.append("umobile", EncodeText(umobile));
            formData.append("uemail", EncodeText(uemail));
            formData.append("ulandline", EncodeText(ulandline));
            formData.append("uextention", EncodeText(uextention));
            formData.append("upin", EncodeText(upin));
            formData.append("barno", EncodeText(barno));
            formData.append("uhrate", EncodeText(uhrate));
            formData.append("somedia", EncodeText(somedia));
            formData.append("twitter", EncodeText(twitter));
            formData.append("isactivate", EncodeText(isactivate));
            formData.append("partnertype", EncodeText(partnertype));
            formData.append("empcode", EncodeText(empcode));
            formData.append("uaddress", EncodeText(uaddress));
            formData.append("username", EncodeText(couserid));
            formData.append("password", EncodeText(cocpassword));
            formData.append("rpartner", EncodeText(rpartner));
            formData.append("rmanager", EncodeText(rmanager));
            formData.append("details", EncodeText(details));
            formData.append("areaofexpertise", EncodeText(areaofexpertise));
            formData.append("qualification", EncodeText(qualification));
            formData.append("firmexperience", EncodeText(firmexperience));
            formData.append("pqe", EncodeText(pqe));
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/CallApi/Createmembers", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        var datas = JSON.stringify(data);
                        if (data.Data == "invalid user license") {
                            alert("Invalid user login credentials. Please check the same or contact your administrator.")
                            closeload();
                        }
                        else if (data.Data == "user exceed limit") {
                            alert("You have reached the maximum limit of the user creation based on your plan. Please upgrade your plan for a seamless experience.")
                            closeload();
                        }
                        else if (data.Data == "Already Exists User Please Try Another User Name!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'User Id already exists. Please try a different User Id.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "Email id is already exists. Please try with different Id!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'E-mail Id already exists, please try a different E-mail Id.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "Already Exists Mobile Please Try Another Mobile!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Mobile No. already exists; please try a different mobile no.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "Employee code is already exists. Please try with different employee code!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Employee code already exists, please use a different code',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else {
                            $("#saveuser")[0].reset();
                            $("#output_image").attr("src", "/PanelDesign/images/Default_User_pic_new.png");
                            new PNotify({
                                title: 'Success!',
                                text: ' User Created Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            var fcode = localStorage.getItem("FirmCode");
                            window.location.href = "/" + fcode + "/Firm/StandardUserList";
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
    });
});