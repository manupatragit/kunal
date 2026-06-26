var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var regid = sessionStorage.getItem("regid");
var clientId = sessionStorage.getItem("ClientId");
$(document).ready(function () {
    bindCommonDropdown("cosource", "SOURCE_REFERENCE", 'Select');
    bindCommonDropdown("coptype", "PROSPECT_TYPE", 'Select');
    bindCommonDropdown("cocasetype", "Case_Type", 'Select');
    GetCountry();
    fnGetState();
    GetContactType();
    $('input[type=radio][name=fullselectusertype]').change(function () {
        if (this.value == 'company') {
            $("#fullcompanydiv").show();
            $("#fullcompanystructure").show();
            GetCompany();
            bindCommonDropdown("fcompanystructure", "Organisation_Type", 'Select');
        }
        else {
            $("#fullcompanydiv").hide();
            $("#fullcompanystructure").hide();
        }
    });
    if (clientId != "" && clientId != undefined) {
        GetClientDetailById(clientId);
        $("#logindiv").hide();
    }
})
/*Get client detail by Id*/
function GetClientDetailById(Id) {
    var formdata = new FormData();
    formdata.append("pageindex", EncodeText(1));
    formdata.append("pagesize", EncodeText(10));
    formdata.append("search", EncodeText(""));
    formdata.append("userid", EncodeText(Id));
    $.ajax({
        type: "POST",
        url: "/api/Home/ClientList",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            console.log(response, "kkkkkk")
            $("#comname").val(response[0].mname);
            $("#cofname").val(response[0].fname);
            $("#colname").val(response[0].lname);
            $("#codesignation").val(response[0].Designation);
            $("#cocomanyname").val(response[0].CompanyName);
            $("#comobile").val(response[0].mobno);
            $("#coemail").val(response[0].cemail);
            $("#colandline").val(response[0].offno);
            $("#coaddress").val(response[0].cadd1);
            $("#copin").val(response[0].Pin);
            $("#cocountry option:selected").text(response[0].Country);
            $("#costate option:selected").text(response[0].State);
            fnGetCityList();
            $("#cocity option:selected").text(response[0].City);
            $("#cowebsite").val(response[0].cwebsite);
            $("#coinfo").val(response[0].cnotes);
            $("#coctype option:selected").text(response[0].ProfileType);
            $("#cosource").val(response[0].SourceRef);
            $("#cocasetype").val(response[0].casetype);
            $("#couserid").val(response[0].loginName);
            $("#copassword").val(response[0].loginpswd);
            $("#cocpassword").val(response[0].loginpswd);
            $("#hiddenclntid").val(response[0].ClientId);
        },
        error: function (response) {
            console.log(response, "kiki")
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

/*Bind country dropdown*/
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
                    if (value.CountryName != 'India') {
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

/*Bind state based on country id*/
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
/*Bind city based onstate id*/
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
function fnGetCityList() {
    var formData = new FormData();
    $.ajax({
        type: "POST",
        url: "/api/Home/BindCityListDropdown",
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
/*Bind copany details*/
function GetCompany() {
    $.ajax({
        type: "POST",
        url: "/api/Home/BindCompanyDropdown",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#cocomanyname").append($("<option></option>").val("0").text('Please Select'));
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#cocomanyname").append($("<option></option>").val(value.Id).text(value.Name));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
function fnPaswordtogle() {
    var x = document.getElementById("copassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
function fnCnfPaswordtogle() {
    var x = document.getElementById("cocpassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
$(document).on('keypress', '#comobile,#copin,#colandline,#coaadharno', function (event) {
    var regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
/*Get contact type*/
function GetContactType() {
    $.ajax({
        type: "POST",
        url: "/api/Home/BindContactTypeDropdown",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#coctype").append($("<option></option>").val("0").text('Please Select'));
            if (response != null) {
                $.each(response, function (key, value) {
                    $("#coctype").append($("<option></option>").val(value.Id).text(value.ContactType));
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
$("#coctype").change(function () {
    if ($("#coctype option:selected").text() == "Prospect") {
        $("#prospectdiv").show();
    }
    else {
        $("#prospectdiv").hide();
    }
})

/*Add contact details*/
$("#addcontact").click(function () {
    var comname = $("#comname").val();
    var cofname = $("#cofname").val();
    var colname = $("#colname").val();
    var codesignation = $("#codesignation").val();
    var cocomanyname = $("#cocomanyname").val();
    var coothercomanyname = $("#coothercomanyname").val();
    var comobile = $("#comobile").val();
    var coemail = $("#coemail").val();
    var colandline = $("#colandline").val();
    var coaddress = $("#coaddress").val();
    var copin = $("#copin").val();
    var cocountry = $("#cocountry option:selected").text();
    var costate = $("#costate option:selected").text();
    var cocity = $("#cocity option:selected").text();
    var cowebsite = $("#cowebsite").val();
    var coinfo = $("#coinfo").val();
    var coctype = $("#coctype").val();
    var othercttype = $("#othercttype").val();
    var contacttypetext = $("#coctype option:selected").text();
    var cosource = $("#cosource").val();
    if (cosource == "Others") {
        cosource = $("#coothersource").val();
    }
    var coptype = $("#coptype").val();
    if (coptype == "Others") {
        alert("select Contact Type");
        document.getElementById("coptype").focus();
        return false;
    }
    var cocasetype = $("#cocasetype").val();
    var couserid = "";
    var copassword = "";
    var cocpassword = "";
    var contcatflag1 = 0;
    if (cofname == "") {
        alert("First name can't be empty.")
        return false;
    }
    if (colname == "") {
        alert("Last name can't be empty.")
        return false;
    }
    if (comobile == "") {
        alert("Mobile number can't be empty.")
        return false;
    }
    else if (comobile.length < 10) {
        $("#lblmobile-error").html("Mobile Phone should be 10 digit.");
        document.getElementById("comobile").focus();
        return false;
    }
    if (coemail != "") {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(coemail)) {
            $("#lblemail-error").html("Please provide a valid email address");
            return false;
        }
    }
    if (copin == "") {
        alert("Pin can't be empty.")
        return false;
    }
    else if (copin.length < 6) {
        $("#lblmobile-error").html("Pin should be 6 digit.");
        document.getElementById("comobile").focus();
        return false;
    }
    if (colandline != "") {
        if (colandline.length < 10) {
            $("#lbllandline-error").html("Landline should be minimum 10 digit.");
            document.getElementById("colandline").focus();
            return false;
        }
    }
    if (cocomanyname == "Others") {
        $("#lblcoothercomanyname-error").html("");
        if (coothercomanyname == "") {
            $("#lblcoothercomanyname-error").html("Enter Company Name");
            document.getElementById("coothercomanyname").focus();
            return false;
        }
        else {
            if (coothercomanyname.toUpperCase() == "OTHERS") {
                $("#lblcoothercomanyname-error").html("Company Name Already Exist");
                document.getElementById("coothercomanyname").focus();
                return false;
            }
        }
        cocomanyname = coothercomanyname;
    }
    //validate company name in case of company 
    var istypes = $("input[name='fullselectusertype']:checked").val();
    if (istypes == "company") {
        if (coothercomanyname == "" && cocomanyname == "") {
            alert("Please select company name");
            document.getElementById("cocomanyname").focus();
            return false;
        }
    }
    if (coctype == "Please Select") {
        $("#lblcoctype-error").text = "select Contact Type";
        alert("Alert ! contact type can't be empty")
        document.getElementById("coctype").focus();
        return false;
    }
    if (contacttypetext == "Others") {
        alert("select Contact Type");
        document.getElementById("coctype").focus();
        return false;
    }
    var gstinno = "";
    var panno = "";
    gstinno = $("#gstin").val();
    panno = $("#panno").val();
    if (gstinno != "") {
        if (gstinno == "") {
            $("#lblgstin-error").html("Please enter GSTIN no.");
            document.getElementById("gstin").focus();
            return false;
        }
        else {
            if (gstinno.length != 15) {
                $("#lblgstin-error").html("GSTIN no should be 15 character");
                document.getElementById("panno").focus();
                return false;
            }
            else {
                $("#lblgstin-error").html("");
            }
        }
    }
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    var totalFiles = document.getElementById("coattechment").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("coattechment").files[i];
        var filename = file.name;
        if (filename.length > 100) {
            $("#lblcoattechment-error").html("File name should not be more than 100 character. Please check file name: " + filename);
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
        var filesize = 20480;
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: Filesizelabel,
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    var coaadharno = $("#coaadharno").val();
    formData.append("istypes", EncodeText(istypes));
    formData.append("gstinno", EncodeText(gstinno));
    formData.append("panno", EncodeText(panno));
    formData.append("coinfo", EncodeText(coinfo));
    formData.append("cofname", EncodeText(cofname));
    formData.append("comname", EncodeText(comname));
    formData.append("colname", EncodeText(colname));
    formData.append("codesignation", EncodeText(codesignation));
    formData.append("cocomanyname", EncodeText(cocomanyname));
    formData.append("coothercomanyname", EncodeText(coothercomanyname));
    formData.append("comobile", EncodeText(comobile));
    formData.append("coemail", EncodeText(coemail));
    formData.append("colandline", EncodeText(colandline));
    formData.append("coaddress", EncodeText(coaddress));
    formData.append("copin", EncodeText(copin));
    formData.append("cocountry", EncodeText(cocountry));
    formData.append("costate", EncodeText(costate));
    formData.append("cocity", EncodeText(cocity));
    formData.append("coctype", EncodeText(coctype));
    formData.append("cowebsite", EncodeText(cowebsite));
    formData.append("cosource", EncodeText(cosource));
    formData.append("coptype", EncodeText(coptype));
    formData.append("cocasetype", EncodeText(cocasetype));
    formData.append("othercttype", EncodeText(othercttype));
    formData.append("couserid", EncodeText(couserid));
    formData.append("cocpassword", EncodeText(cocpassword));
    formData.append("contcatflag", EncodeText(contcatflag1));
    formData.append("coaadharno", EncodeText(coaadharno));
    formData.append("fcompanystructure", EncodeText($("#fcompanystructure").val()));
    formData.append("FirmIdd", EncodeText(""));
    formData.append("LoginUserId", EncodeText(""));
    formData.append("hiddenId", EncodeText($("#hiddenclntid").val()));
    $.ajax({
        type: "POST",
        url: "/api/Home/SaveClientData",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.message);
            window.location.href = "/Home/CreateClient";
            sessionStorage.removeItem("ClientId");
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
})