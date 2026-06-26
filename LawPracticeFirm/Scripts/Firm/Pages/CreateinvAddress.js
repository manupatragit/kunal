$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#multipleaddress", function () {
        window.location = encodeURI("/" + fcode + "/bill/InvoiceOtherAddress");
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    bindstate();
    /*Bind state*/
    function bindstate() {
        var ddlState = $('#state');
        openload();
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/BindStateDetails',
            type: 'POST',
            dataType: 'json',
            headers: { CountryName: 'India' },
            success: function (d) {
                ddlState.empty();
                // Clear the please wait
                ddlState.append($("<option value='' selected ></option>").val('').html('Select State'));
                $.each(d.Data, function (i, states) {
                    ddlState.append($("<option></option>").val(states.StateName).html(states.StateName));
                });
                var hidstates = $("#hidstate").val();
                $('#state option[value="' + hidstates + '"]').attr("selected", true);
                closeload();
            },
            error: function (d) {
                alert(d.responseText);
                closeload();
            }
        });
    }
    var ftoken = "";
    if (token != "") {
        ftoken = token;
    }
    else {
        ftoken = "";
    }
    /*Save details*/
    $("#btnsubmit").click(function () {
        if ($("#state").val() == "") {
            alert("Select the state.");
            $("#state").focus();
            return false;
        }
        if ($("#address").val() == "") {
            alert("Please enter address");
            $("#address").focus();
            return false;
        }
        if ($("#phonenumber").val() == "") {
            alert("Please enter phone number");
            $("#phonenumber").focus();
            return false;
        }
        if ($("#phonenumber").val().length < 10 || $("#phonenumber").val().length > 16) {
            alert("Phone number should be atleast 10 digits");
            $("#phonenumber").focus();
            return false;
        }
        if ($("#emailid").val() == "") {
            alert("Please enter the E-mail Id");
            $("#emailid").focus();
            return false;
        }
        else {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test($("#emailid").val()) == false) {
                alert('Invalid Email Address');
                $("#emailid").focus();
                return false;
            }
        }
        if ($("#gstno").val() != "") {
            if ($("#gstno").val().length < 15 || $("#gstno").val().length > 15) {
                alert("GST Number should be 15 Charaters.");
                $("#gstno").focus();
                return false;
            }
            var gst = $("#gstno").val();
            var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;
            if (!reggst.test(gst) && gst != '') {
                // alert('GST Number is not valid. It should be in this "11AAAAA1111Z1A1" format');
                alert('GST Number is not valid');
                return false;
            }
        }
        if ($("#pan").val() == "") {
            alert("Please enter PAN No");
            $("#pan").focus();
            return false;
        }
        var panregex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        var inputvalues = $("#pan").val().toUpperCase();
        if (panregex.test(inputvalues) == false) {
            alert("Please enter valid PAN No. It should be 10 characters long. The first five characters should be alphabets in upper case. The next four characters should be any number from 0 to 9.The last (tenth) character should be any upper case alphabet. It should not contain any blank spaces.");
            $("#pan").focus();
            return false;
        }
        var formData = new FormData();
        var gstno = $("#gstno").val();
        var panno = $("#pan").val();
        formData.append("sacno", EncodeText($("#sac").val()));
        formData.append("pan", EncodeText(panno));
        formData.append("gstno", EncodeText(gstno));
        formData.append("state", EncodeText($("#state").val()));
        formData.append("address", EncodeText($("#address").val()));
        formData.append("phonenumber", EncodeText($("#phonenumber").val()));
        formData.append("emailid", EncodeText($("#emailid").val()));
        formData.append("website", EncodeText($("#website").val()));
        try {
            formData.append("token", ftoken);
        }
        catch (er) {
        }
        formData.append("isactive", EncodeText($("#isactive").val()));
        var cp = '';
        if ($("#cport:checked").prop('checked')) {
            cp = $("#cport:checked").val();
        }
        else {
            cp = "0";
        }
        formData.append("isdefault", cp);
        if ($("#isactive").val() == "0" && cp == "1") {
            alert("Please  set a default address.");
            return false;
        }
        $.ajax(
            {
                type: "POST",
                url: "/api/OcrInvoiceApi/SaveInvoiceAddress", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data.toString() == "0") {
                        alert('Something went wrong! Please try again.');
                        return false;
                    }
                    else {
                        if (ftoken == "") {
                            $("#savedata")[0].reset();
                            alert("Saved Successfully");
                            var fcode1 = localStorage.getItem("FirmCode");
                            window.location = encodeURI("/" + fcode1 + "/bill/InvoiceOtherAddress");
                        }
                        else {
                            alert("Updated Successfully");
                            var fcode1 = localStorage.getItem("FirmCode");
                            window.location = encodeURI("/" + fcode1 + "/bill/InvoiceOtherAddress");
                        }
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
});