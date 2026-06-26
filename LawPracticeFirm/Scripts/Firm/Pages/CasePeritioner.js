$(document).ready(function () {
    CaseInformationDetails();
    /*Get case information details*/
    function CaseInformationDetails() {
        var formData = new FormData();
        formData.append("caseid", token);
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExtraParty/GetCaseInformationFormatlist",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response.Data, function (i, b) {
                    $("#hdnId").val(b.Id);
                    $("#CompName").val(b.NameOfComplainent);
                    $("#p_Gaurdian").val(b.GaurdianName);
                    $("#p_Address").val(b.Address);
                    $("#p_adharcard").val(b.AdharCardNo);
                    $("#p_pincode").val(b.PinCode);
                    $('#p_gender option[value="' + b.Gender + '"]').attr("selected", true);
                    $("#p_Nationality").val(b.Nationality);
                    var dob = b.DateofBirth;
                    try {
                        var pdob = dob.split('T')[0];
                        if (pdob != "1900-01-01") {
                            $("#p_dob").val(pdob);
                        }
                    }
                    catch (er) {
                    }
                    $("#p_age").val(b.Age);
                    $("#p_mobileno").val(b.MobileNo);
                    $("#p_email").val(b.Email);
                    $("#p_actsection").val(b.ActSection);
                    $("#p_valuation").val(b.ValuationOfSuit);
                    $("#p_courtfeeasc").val(b.CourtFeeAscertained);
                    $("#p_courtfeedeposit").val(b.CourtFeePaidDeposit);
                    $("#p_polstn").val(b.PoliceStation);
                    $("#p_firno").val(b.FirNoYear);
                    $("#p_name2").val(b.DefendantName);
                    $("#p_gardian2").val(b.Def_GaurdianName);
                    $("#p_Address2").val(b.Def_Address);
                    $("#p_adharcard2").val(b.Def_AdharCard);
                    $("#p_pincode2").val(b.Def_Pincode);
                    $('#p_gender2 option[value="' + b.Def_gender + '"]').attr("selected", true);
                    $("#p_Nationality2").val(b.Def_Nationality);
                    var def_dob = b.Def_Dob;
                    try {
                        var defdob = def_dob.split('T')[0];
                        if (defdob != "1900-01-01") {
                            $("#p_dob2").val(defdob);
                        }
                    }
                    catch (er) {
                    }
                    $("#p_age2").val(b.Def_age);
                    $("#p_mobileno2").val(b.Def_MobileNo);
                    $("#p_email2").val(b.Def_Email);
                    $("#p_advoname").val(b.AdvocateName);
                    $("#p_barno").val(b.BarRegNo);
                    $("#p_AdvoAddress").val(b.AdvocateAddress);
                    $("#p_mobileno3").val(b.AdvocateMobile);
                    $("#p_email3").val(b.AdvocateEmail);
                });
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //
        });
    }
});
$("#btnprintCasePret").click(function () {
    var fcode = localStorage.getItem("FirmCode");
    var urls = "/" + fcode + "/Firm/printcaseinformationReport";
    url_redirect({
        url: urls,
        method: "post",
        formtarget: "_blank",
        data: { "token": token }
    });
});
/*Validate emails*/
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}
/*Save pretition case*/
$("#btnsaveCasePret").click(function () {
    if ($("#CompName").val() == "") {
        alert("NAME OF PLAINTIFF/COMPLAINANT ETC.");
        $("#CompName").focus();
        return false;
    }
    if ($("#p_adharcard").val() != "") {
        if ($("#p_adharcard").val().length < 12) {
            alert("Enter valid AADHAAR CARD NO");
            $("#p_adharcard").focus();
            return false;
        }
    }
    if ($("#p_mobileno").val() != "") {
        if ($("#p_mobileno").val().length < 10) {
            alert("Enter valid Mobile No");
            $("#p_mobileno").focus();
            return false;
        }
    }
    if ($("#p_email").val() != "") {
        if (isValidEmailAddress($("#p_email").val())) {
        }
        else {
            alert("Enter valid email");
            $("#p_email").focus();
            return false;
        }
    }
    if ($("#p_name2").val() == "") {
        alert("NAME OF DEFENDANT/ACCUSED ETC.");
        $("#p_name2").focus();
        return false;
    }
    if ($("#p_gardian2").val() == "") {
        alert("Enter S/O,W/O,D/O");
        $("#p_gardian2").focus();
        return false;
    }
    if ($("#p_Address2").val() == "") {
        alert("Enter Address");
        $("#p_Address2").focus();
        return false;
    }
    if ($("#p_gender2").val() == "") {
        alert("Select Gender");
        $("#p_gender2").focus();
        return false;
    }
    if ($("#p_adharcard2").val() != "") {
        if ($("#p_adharcard2").val().length < 12) {
            alert("Enter valid AADHAAR CARD NO");
            $("#p_adharcard2").focus();
            return false;
        }
    }
    if ($("#p_mobileno2").val() != "") {
        if ($("#p_mobileno2").val().length < 10) {
            alert("Enter valid Mobile No");
            $("#p_mobileno2").focus();
            return false;
        }
    }
    if ($("#p_email2").val() != "") {
        if (isValidEmailAddress($("#p_email2").val())) {
        }
        else {
            alert("Enter valid email");
            $("#p_email2").focus();
            return false;
        }
    }
    if ($("#p_advoname").val() == "") {
        alert("NAME OF ADVOCATE");
        $("#p_advoname").focus();
        return false;
    }
    if ($("#p_barno").val() == "") {
        alert("Enter BAR REGN.NO. ");
        $("#p_barno").focus();
        return false;
    }
    if ($("#p_AdvoAddress").val() == "") {
        alert("Enter Address");
        $("#p_AdvoAddress").focus();
        return false;
    }
    if ($("#p_mobileno3").val() == "") {
        alert("Enter Mobile No");
        $("#p_mobileno3").focus();
        return false;
    }
    if ($("#p_mobileno3").val() != "") {
        if ($("#p_mobileno3").val().length < 10) {
            alert("Enter valid Mobile No");
            $("#p_mobileno3").focus();
            return false;
        }
    }
    if ($("#p_email3").val() != "") {
        if (isValidEmailAddress($("#p_email3").val())) {
        }
        else {
            alert("Enter valid email");
            $("#p_email3").focus();
            return false;
        }
    }
    var formData = new FormData();
    formData.append("caseid", token);
    formData.append("NameOfComplainent", $("#CompName").val());
    formData.append("GaurdianName", $("#p_Gaurdian").val());
    formData.append("Address", $("#p_Address").val());
    formData.append("AdharCardNo", $("#p_adharcard").val());
    formData.append("PinCode", $("#p_pincode").val());
    formData.append("Gender", $("#p_gender").val());
    formData.append("Nationality", $("#p_Nationality").val());
    formData.append("DateofBirth", $("#p_dob").val());
    formData.append("Age", $("#p_age").val());
    formData.append("MobileNo", $("#p_mobileno").val());
    formData.append("Email", $("#p_email").val());
    formData.append("ActSection", $("#p_actsection").val());
    formData.append("ValuationOfSuit", $("#p_valuation").val());
    formData.append("CourtFeeAscertained", $("#p_courtfeeasc").val());
    formData.append("CourtFeePaidDeposit", $("#p_courtfeedeposit").val());
    formData.append("PoliceStation", $("#p_polstn").val());
    formData.append("FirNoYear", $("#p_firno").val());
    formData.append("DefendantName", $("#p_name2").val());
    formData.append("GaurdianName2", $("#p_gardian2").val());
    formData.append("Address2", $("#p_Address2").val());
    formData.append("AdharCardNo2", $("#p_adharcard2").val());
    formData.append("PinCode2", $("#p_pincode2").val());
    formData.append("Gender2", $("#p_gender2").val());
    formData.append("Nationality2", $("#p_Nationality2").val());
    formData.append("DateofBirth2", $("#p_dob2").val());
    formData.append("Age2", $("#p_age2").val());
    formData.append("MobileNo2", $("#p_mobileno2").val());
    formData.append("Email2", $("#p_email2").val());
    formData.append("AdvocateName", $("#p_advoname").val());
    formData.append("BarRegNo", $("#p_barno").val());
    formData.append("AdvocateAddress", $("#p_AdvoAddress").val());
    formData.append("AdvocateMobile", $("#p_mobileno3").val());
    formData.append("AdvocateEmail", $("#p_email3").val());
    formData.append("Id", $("#hdnId").val());
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/PostCasePretition",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                alert("Successfully Saved");
            }
            else {
                alert("Oops! Something went wrong..");
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
/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}