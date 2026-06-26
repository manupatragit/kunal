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

    /*Load assign users*/
    function loadUsermgmt() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '</option>';
                    try {
                        if (a.IsPartner == "1") {
                            $("#rpartner").append(option);
                        }
                    }
                    catch (er) {
                        // alert(er.message);
                    }
                });
                setTimeout(function () { LoadUserData(); }, 3000);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    Loadstructure();
    /*Load structure*/
    function Loadstructure() {
        $("#designation,#branch,#department").html('');
        var option7 = '<option value="" > Select</option>';
        $("#designation,#branch,#department").append(option7);
        var formData = new FormData();
        openload();
        var d1 = $.ajax({
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
                loadUsermgmt();
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
    $(document).on('keypress', '#name', function (event) {
        var regex = new RegExp("^[a-zA-Z1-9 ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
    $(document).on('keypress', '#umobile,#upin,#uhrate,#uextention', function (event) {
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
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
            if (loginid != "") {
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
                if (!$("#isactivate").is(':checked')) {
                    isactivate = 0;
                }
                else {
                    isactivate = 1;
                }
                empcode = $("#empcode").val();
                var partnertype = $("input[name='partner']:checked").val();
                //if (couserid != "") {
                //    if (specialcharecter(couserid) == "1") {
                //        return false;
                //    }
                //}
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
                formData.append("loginid", EncodeText(loginid));
                openload();
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/CallApi/UpdateMembers", // Controller/View
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
                                alert("You have already created nos. of Users of License limit. Please upgrade your plan.")
                                closeload();
                            }
                            else if (data.Data == "Already Exists User Please Try Another User Name!") {
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
                                    text: 'Employee code is already exists. Please try with different employee code!',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else {
                                $("#output_image").attr("src", "/PanelDesign/images/Default_User_pic_new.png");
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Saved Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                closeload();
                                var fcode = localStorage.getItem("FirmCode");
                                window.location.href = "/" + fcode + "/firm/StandardUserList";
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

/*Load user data*/
function LoadUserData() {
    var formData = new FormData();
    formData.append("loginid", loginid);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: '/api/CallApi/SpUserDatabyLoginid',
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                var length = obj.length;
            }
            else {
                // alert("not found");
            }
            $.each(obj, function (i, val) {
                if (val.IsPartner == "1") {
                    document.getElementById("rdpartner").checked = true;
                    $("#rdpartner").attr("disabled", "disabled");
                    $("#rduser").attr("disabled", "disabled");
                    $("#partnerdiv").css("display", "none");
                    $("#rpartner").val();
                }
                else {
                    document.getElementById("rduser").checked = true;
                    $("#partnerdiv").css("display", "block");
                    $("#rduser").click();
                }
                $("#usertypepartnerornot").val(val.IsPartner);
                if (val.PartnerId != null) {
                    $('#rpartner option[value="' + val.PartnerId + '"]').attr("selected", true);
                }
                $("#empcode").val(val.EmployeeCode);
                $("#ufname").val(val.cufname.replace("&amp;","&"));
                $("#umname").val(val.cmname);
                $("#ulname").val(val.clname);
                $("#umobile").val(val.cmobile);
                $("#uemail").val(val.EmailId);
                $("#ulandline").val(val.clandline);
                $("#uextention").val(val.Extention);
                $("#uaddress").val(val.caddress);
                $("#cocountry").val(val.country);
                if (val.country == "India") {
                    var option = '<option value="' + val.cstate + '" selected > ' + val.cstate + ' </option>';
                    $("#costate").append(option);
                    var option1 = '<option value="' + val.ccity + '" selected > ' + val.ccity + ' </option>';
                    $("#cocity").append(option1);
                }
                else {
                    $("#costate").val(val.cstate);
                    $("#cocity").val(val.ccity);
                }
                $("#upin").val(val.Pin);
                if (val.UserDesignation != null) {
                    $('#designation option[value="' + val.UserDesignation + '"]').attr("selected", true);
                }
                if (val.Branch != null) {
                    $('#branch option[value="' + val.Branch + '"]').attr("selected", true);
                }
                if (val.Department != null) {
                    $('#department option[value="' + val.Department + '"]').attr("selected", true);
                }
                $("#rmanager").val(val.ReportManager);
                if (val.Qualification != null) {
                    $('#qualification option[value="' + val.Qualification + '"]').attr("selected", true);
                }
                if (val.PQE != null) {
                    $('#pqe option[value="' + val.PQE + '"]').attr("selected", true);
                }
                if (val.FirmExperience != null) {
                    $('#firmexperience option[value="' + val.FirmExperience + '"]').attr("selected", true);
                }
                if (val.AreaOfExpertise != null) {
                    $('#areaofexpertise option[value="' + val.AreaOfExpertise + '"]').attr("selected", true);
                }
                $("#uhrate").val(val.HRate);
                $("#barno").val(val.BARNo);
                $("#somedia").val(val.SocialMedia);
                $("#twitter").val(val.Twitter);
                $("#details").val(val.OtherDetails);
                if (val.IsActive == "1") {
                    document.getElementById("isactivate").checked = true;
                }
            });
            closeload();
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