jQuery(document).ready(function () {

/*Save new demo inquiry*/
    $("#btnsave").click(function () {
        var cptval = $("#hdncaptcha").text();
        var name = $("#name").val();
        var product = $("#product").val();
        var remail = $("#remail").val();
        var rcontact = $("#rcontact").val();
        var city = $("#ccity").val();
        if (name == "") {
            alert("Please enter name");
            document.getElementById("name").focus();
            return false;
        }  
        if (rcontact == "") {
            alert("Please enter contact no");
            document.getElementById("rcontact").focus();
            return false;
        }
        rcontact = rcontact.replace(/ /g, "");
        if (rcontact.length < 10) {
            alert("Please enter valid contact no.");
            return false;
        }
        if (rcontact.length > 10) {
            alert("Please enter valid contact no.");
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
        if (cptval != $("#txtcaptcha").val()) {
            alert("Please enter valid captcha code");
            return false;
        }
        var formData = new FormData();
        formData.append("name", $("#name").val());
        formData.append("product", $("#product").val());
        formData.append("remail", $("#remail").val());
        formData.append("rcontact", $("#rcontact").val());
        formData.append("city", $("#ccity").val());
        formData.append("Source", Source);
        $("#btnsave").attr("disabled", true);
        $.ajax(
            {
                type: "POST",
                url: "/Enquiry/SaveDemoEnquiryNew", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#btnsave").attr("disabled", false);
                    $("#saveenquiry")[0].reset();
                    alert("Enquiry saved successfully");
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
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
$(document).ready(function () {
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        $('input[type = "date"]').attr("onkeydown", "");
        $('input[type = "date"]').attr("onkeypress", "");
    }
    $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
    $('input[type = "date"]').blur(function () {
        var dateString = $(this).val();
        if (dateString != "") {
            var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
            var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
            var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
            //Check whether valid dd/MM/yyyy Date Format.
            if (regex.test(dateString)) {
                var parts = dateString.split("-");
                var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                if (parseInt(parts[0]) < 1900) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[0]) > 3000) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[2]) == 00) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                var dtCurrent = new Date();
                return true;
            } else {
                $(this).focus();
                $(this).val("");
                alert("Invalid Date");
                return false;
            }
        }
    });
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
function fn_RefreshCaptcha() {
    loadCaptcha1();
}