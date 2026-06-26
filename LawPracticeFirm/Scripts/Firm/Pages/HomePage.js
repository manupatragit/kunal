$(document).ready(function () {
    $(document).on('keypress', '#phonenumber', function (event) {
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    /*Validate email*/
    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true;
        }
        return false;
    }
    /*Check URL is valid or not*/
    function isValidURL(string) {
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    };
    HomePageData();
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imglogo').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#attachment").change(function () {
        readURL(this);
    });

    /*Save details*/
    $("#btnsubmit").click(function () {
        var yourtext = CKEDITOR.instances.yourtext.getData();
        var aboutus = CKEDITOR.instances.aboutus.getData();
        var services = CKEDITOR.instances.services.getData();
        if ($("#attachment").val() == "" && $("#hidlogopath").val() == "") {
            alert("Please upload your logo.");
            return false;
        }
        if ($("#heading").val() == "") {
            alert("Please enter Logo Heading");
            return false;
        }
        var radioValue = $("input[name='position']:checked").val();
        if (aboutus == "") {
            alert("Please enter about us");
            return false;
        }
        if (services == "") {
            alert("Please enter services");
            return false;
        }
        if (yourtext.length > 8000) {
            alert("Max 8000 characters allowed in your text");
            return false;
        }
        if (aboutus.length > 8000) {
            alert("Max 8000 characters allowed in About");
            return false;
        }
        if (services.length > 8000) {
            alert("Max 8000 characters allowed in Services");
            return false;
        }
        if ($("#address").val() == "") {
            alert("Please enter address");
            return false;
        }
        if ($("#phonenumber").val() == "") {
            alert("Please enter phone number");
            return false;
        }
        if ($("#emailid").val() == "") {
            alert("Please Please enter the E-mail Id.");
            return false;
        }
        else {
            var chkemail = ValidateEmail($("#emailid").val());
            if (chkemail == false) {
                alert("You have entered invalid email id.");
                return false;
            }
        }
        if ($("#website").val() == "") {
            alert("Please enter website");
            return false;
        }
        else {
            var chkurl = isValidURL($("#website").val());
            if (chkurl == false) {
                alert("You have entered invalid website name.");
                return false;
            }
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
        var bkimg = $("#hidimgval").val();
        formData.append("bkimg", bkimg);
        if ($("#attachment").val() != "") {
            formData.append("logopath", $("#attachment").val());
        }
        else {
            formData.append("logopath", $("#hidlogopath").val());
        }
        formData.append("heading", $("#heading").val());
        formData.append("logotext", yourtext);
        formData.append("aboutus", aboutus);
        formData.append("services", services);
        formData.append("address", $("#address").val());
        formData.append("phonenumber", $("#phonenumber").val());
        formData.append("emailid", $("#emailid").val());
        formData.append("website", $("#website").val());
        formData.append("logoposition", radioValue);
        $.ajax(
            {
                type: "POST",
                url: "/api/WorkFlowNewApi/HomePageSave", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data.toString() == "0") {
                        alert('Something went wrong! Please try again.');
                        closeload();
                        return false;
                    }
                    else {
                        alert("Data saved successfully");
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
    });

    /*Get home page data*/
    function HomePageData() {
        openload();
        $.ajax({
            async: true,
            type: 'POST',
            dataType: 'json',
            url: '/api/WorkFlowNewApi/HomePageDataByFirmid',
            contentType: "application/json; charset=utf-8",
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                    }
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, val) {
                        $("#heading").val(val.LogoHeading);
                        $("#address").val(val.Address);
                        $("#phonenumber").val(val.ContactNo);
                        $("#emailid").val(val.email);
                        $("#website").val(val.website);
                        var imglogopath = "../.." + val.LogoPath;
                        $("#divlogoimg").attr("style", "dispaly:");
                        $("#imglogo").attr("src", imglogopath);
                        $("#hidlogopath").val(val.LogoPath);
                        $("#attachement").val(val.LogoPath);
                        var selected = $("input[type='radio'][name='rbt']");
                        if (selected.length > 0) {
                            $("#hidimgval").val(selected.val());
                        }
                        $("input[type='radio'][name='position']").each(function () {
                            if (val.LogoPosition == $(this).val()) {
                                $(this).attr("checked", "true");
                                return false;
                            }
                        });
                        $(':radio').each(function () {
                            if (val.BackgroundImg == $(this).val()) {
                                $(this).attr("checked", "true");
                                $("#hidimgval").val(val.BackgroundImg);
                                return false;
                            }
                        });
                        setTimeout(function () {
                            CKEDITOR.instances['yourtext'].setData(val.Logotext);
                            CKEDITOR.instances['aboutus'].setData(val.Aboutus);
                            CKEDITOR.instances['services'].setData(val.Services);
                        }, 1000);
                    });
                    closeload();
                }
                else {
                    closeload();
                    //  alert("not found");
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
function openload() {
    $('#myOverlay').css("display", "block");
}
function closeload() {
    $('#myOverlay').css("display", "none");
}
