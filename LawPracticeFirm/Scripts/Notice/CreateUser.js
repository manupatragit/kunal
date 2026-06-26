var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var regid = sessionStorage.getItem("regid");
$(document).ready(function () {
    $('input[type=radio][name=partner]').change(function () {
        $("#rpartner").val("");
        if (this.value == '0') {
            $("#partnerdiv").show();
        }
        else {
            $("#partnerdiv").hide();
        }
    });
    var $select = $("#firmexperience");
    $select.append($('<option ></option>').val("").html("Select"));
    for (i = 1; i <= 25; i++) {
        $select.append($('<option></option>').val(i).html(i + " [Year]"))
    }
    bindCommonDropdown("qualification", "Qualification", 'Select');
    bindCommonDropdown("pqe", "PQE", 'Select');
    bindCommonDropdown("areaofexpertise", "AreaofExperties", 'Select');
    GetCountry();
    fnGetState();
    GetFirmStructure();
    Getmanagerlist();
    if (regid != undefined && regid != null && regid != "") {
        getEditUserData();
    }
})
/*Edit user data*/
function getEditUserData() {
    var formdata = new FormData();
    formdata.append("pageindex", EncodeText(1));
    formdata.append("pagesize", EncodeText(10));
    formdata.append("search", EncodeText(""));
    formdata.append("userid", EncodeText(regid));
    $.ajax({
        type: "POST",
        url: "/api/Home/UserList",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (data) {
            $("#hidid").val(data[0].regId);
            $("#ufname").val(data[0].cufname);
            $("#umname").val(data[0].cmname);
            $("#ulname").val(data[0].clname);
            $("#designation").val(data[0].UserDesignation);
            $("#branch").val(data[0].branchId);
            $("#cocountry option:selected").text(data[0].country);
            $("#costate option:selected").text(data[0].cstate);
            $("#cocity option:selected").text(data[0].ccity);
            $("#department").val(data[0].DeptId)
            $("#umobile").val(data[0].cmobile);
            $("#uemail").val(data[0].EmailId);
            $("#ulandline").val(data[0].clandline);
            $("#uextention").val(data[0].Extention);
            $("#rmanager").val(data[0].ReportManager);
            $("#uaddress").val(data[0].caddress);
            $("#rpartner").val(data[0].PartnerName);
            $("#upin").val(data[0].Pin);
            $("#barno").val(data[0].BARNo);
            $("#uhrate").val(data[0].HRate);
            $("#details").val(data[0].OtherDetails);
            $("#areaofexpertise").val(data[0].areaExpertId);
            $("#firmexperience").val(data[0].FirmExperience);
            $("#pqe").val(data[0].pqueId)
            $("#qualification option:selected").text(data[0].Qualification);
            $("#empcode").val(data[0].EmployeeCode);
            if (data[0].IsPartner) {
                $("#partner").prop("checked", true);
                $("#user").attr("disabled", true);
            }
            else {
                $("#user").prop("checked", true);
                $("#partner").attr("disabled", true);
                $("#partnerdiv").show();
            }
        },
        error: function (data) {
        }
    })
}

/*Bind common dropdown*/
function bindCommonDropdown(controlname, dropdownname, selecttext) {
    var html1 = '<option value="">' + selecttext + '</option>';
    var formData = new FormData();
    formData.append("dropdownname", EncodeText(dropdownname));
    $.ajax({
        async: false,
        type: "POST",
        url: "/api/Home/LoadCommonDropdown",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $.each(response, function (i, a) {
                html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                $("#" + controlname).html(html1);
            }); //End of foreach Loop
        }, //End of AJAX Success function
        failure: function (response) {
        }, //End of AJAX failure function
        error: function (response) {
        } //End of AJAX error function
    });
}
/*Get country*/
function GetCountry() {
    $.ajax({
        type: "POST",
        url: "/api/Home/BindCountryDropdown",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#cocountry").append($("<option></option>").val("1").text('India'));
            if (response != null) {
                $.each(response, function (key, value) {
                    if (value.CountryName == 'India') { }
                    else {
                        $("#cocountry").append($("<option></option>").val(value.CountryId).text(value.CountryName));
                    }
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Get state based on country*/
function fnGetState() {
    var countryid = $("#cocountry").val();
    if (countryid == 0) {
        Alert("Alert ! please select country.");
        return false;
    }
    var formData = new FormData();
    formData.append('countryId', EncodeText(countryid))
    $.ajax({
        type: "POST",
        url: "/api/Home/BindStateDropdown",
        dataType: 'json',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#costate").append($("<option></option>").val(value.StateId).text(value.StateName));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Get city based on state*/
function fnGetCity() {
    var stateid = $("#costate").val();
    if (stateid == 0) {
        Alert("Alert ! please select state.");
        return false;
    }
    var formData = new FormData();
    formData.append('stateid', EncodeText(stateid))
    $.ajax({
        type: "POST",
        url: "/api/Home/BindCityDropdown",
        dataType: 'json',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#cocity").append($("<option></option>").val(value.CityId).text(value.CityName));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

/*Get firm structure*/
function GetFirmStructure() {
    $.ajax({
        type: "POST",
        url: "/api/Home/FirmStructureDropdown",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response, function (key, value) {
                    if (value.SType === "Branch") {
                        $("#branch").append($("<option></option>").val(value.Id).text(value.Name));
                    }
                    if (value.SType == "Designation") {
                        $("#designation").append($("<option></option>").val(value.Id).text(value.Name));
                    }
                    if (value.SType == "Department") {
                        $("#department").append($("<option></option>").val(value.Id).text(value.Name));
                    }
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Load manager list*/
function Getmanagerlist() {
    $.ajax({
        type: "POST",
        url: "/api/Home/PartnerList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                $.each(response, function (key, value) {
                    if (value.RoleId == 2) {
                        $("#rpartner").append($("<option></option>").val(value.Id).text(value.UserName));
                        $("#rmanager").append($("<option></option>").val(value.Id).text(value.UserName));
                    }
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
$(document).on('keypress', '#name', function (event) {
    var regex = new RegExp("^[a-zA-Z1-9 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
$(document).on('keypress', '#umobile,#upin,#uhrate,#uextention,#ulandline', function (event) {
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
function specialcharecter() {
    var strretrn = "0";
    var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
    var data = document.getElementById("couserid").value;
    for (var i = 0; i < data.length; i++) {
        if (iChars.indexOf(data.charAt(i)) != -1) {
            alert("Special character and Space not allowed in user id.");
            document.getElementById("couserid").focus();
            strretrn = "1";
            break;
        }
    }
    return strretrn;
}
/*Add contact details*/
$("#addcontact").click(function () {
    var hiddnid = $("#hidid").val();
    var ufname = $("#ufname").val();
    var umname = $("#umname").val();
    var ulname = $("#ulname").val();
    var designation = $("#designation").val();
    var branch = $("#branch").val();
    var cocountry = $("#cocountry option:selected").text();
    var costate = $("#costate option:selected").text();
    var cocity = $("#cocity option:selected").text();
    var department = $("#department").val();
    var umobile = $("#umobile").val();
    var uemail = $("#uemail").val();
    var ulandline = $("#ulandline").val();
    var uextention = $("#uextention").val();
    var rmanager = $("#rmanager").val();
    var uaddress = $("#uaddress").val();
    var rpartner = $("#rpartner").val();
    var upin = $("#upin").val();
    var barno = $("#barno").val();
    var uhrate = $("#uhrate").val();
    var somedia = $("#somedia").val();
    var twitter = $("#twitter").val();
    var details = $("#details").val();
    var areaofexpertise = $("#areaofexpertise").val();
    var firmexperience = $("#firmexperience").val();
    var pqe = $("#pqe").val();
    var qualification = $("#qualification").val();
    var isactivate = 0;
    var empcode = $("#empcode").val();
    var partnertype = $("input[name='partner']:checked").val();
    if (empcode == "" || ufname == "" || ulname == "" || umobile == "" || uemail == "" || cocountry == "0" || costate == "0" || cocity == "0" || upin == "" || designation == "0") {
        alert("Alert ! mandatory fields can't be empty.")
        return false;
        if (empcode == "") {
            alert("Alert ! Emplolyee Code can't be empty.")
            return false;
        }
        else if (ufname == "") {
            alert("Alert ! First name can't be empty.")
            return false;
        }
        else if (ulname == "") {
            alert("Alert ! Last name can't be empty.")
            return false;
        }
        else if (umobile == "") {
            alert("Alert ! Mobile number can't be empty.")
            return false;
        }
        else if (uemail == "") {
            alert("Alert ! Email can't be empty.")
            return false;
        }
        else if (cocountry == "0") {
            alert("Alert ! Country name can't be empty.")
            return false;
        }
        else if (costate == "0") {
            alert("Alert ! State name can't be empty.")
            return false;
        }
        else if (cocity == "0") {
            alert("Alert ! City name can't be empty.")
            return false;
        }
        else if (upin == "") {
            alert("Alert ! Pincode can't be empty.")
            return false;
        }
        else if (designation == "0") {
            alert("Alert ! Designation can't be empty.")
            return false;
        }
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
    formData.append("rpartner", EncodeText(rpartner));
    formData.append("rmanager", EncodeText(rmanager));
    formData.append("details", EncodeText(details));
    formData.append("areaofexpertise", EncodeText(areaofexpertise));
    formData.append("qualification", EncodeText(qualification));
    formData.append("firmexperience", EncodeText(firmexperience));
    formData.append("pqe", EncodeText(pqe));
    formData.append("FirmIdd", EncodeText(userDetails.FirmId));
    formData.append("LoginUserId", EncodeText(userDetails.Id));
    formData.append("hiddenid", EncodeText(hiddnid));
    $.ajax({
        type: "POST",
        url: "/api/Home/Savemembers",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.message)
            window.location.href = "/Home/UserList";
            sessionStorage.removeItem("regid");
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
});
$("#backbtn").click(function () {
    window.location.href = "/Home/UserList";
    sessionStorage.removeItem("regid");
})
