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
function preview_image1(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output_image1');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

$(document).ready(function () {
    bindstate();
    var fcode = localStorage.getItem("FirmCode");

    //For Temaplte Preview
    $(document).on("click", "#invtemplatepreview", function () {

        var Invtemplate = $("#selectinvtemplate").val();
        if (Invtemplate == "") {
            alert("Please select template");
            return false;

        }
        var templattvalue = Invtemplate;
        $("#hidimgval").val(templattvalue);
        var url = "/bill/viewinvoicetemplate/?ftype=invoice&data=" + templattvalue;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
        
    });

    // Invoice Settings Upload
    const invoiceSettingsUploadLogo = initFileUpload({
        inputId: "attachment",
        listContainerId: "fileListUploadLogo",
        removeBtnClass: "remove-file-UploadLogo",
        maxVisible: 5
    });
    const invoiceSettingsUploadSignature = initFileUpload({
        inputId: "attachment1",
        listContainerId: "fileListUploadSignature",
        removeBtnClass: "remove-file-UploadSignature",
        maxVisible: 5
    });
    //$(document).on("click", "#viewtemplate", function () {
    //    var value = $(this).attr("value");
    //    var url = "/bill/viewinvoicetemplate/?ftype=invoice&data=" + value;
    //    $('.mymodels').load(url, function (result) {
    //        $('#myModal').modal({ show: true });
    //    });
    //});
    $(document).on("click", "#multipleaddress", function () {
        window.location = encodeURI("/" + fcode + "/bill/InvoiceOtherAddress");
    });

    /*Bind state*/
    function bindstate() {
        var ddlState = $('#state');
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
                $('#state').val(statesvalues);
            },
            error: function (d) {
                alert(d.responseText);
            }
        });
    }

    /*Save data*/
    $("#btnsubmit").click(function () {
        var notes = CKEDITOR.instances.notes.getData();
        var terms = CKEDITOR.instances.terms.getData();
        var invoicename = $("#hidimgval").val();
        if ($("#state").val() == "") {
            alert("Select the state.");
            return false;
        }
        if ($("#cname").val() == "") {
            alert("Please enter the company name.");
            return false;
        }
        if ($("#emailid").val() == "") {
            alert("Please enter the company E-mail Id.");
            return false;
        }
        else {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test($("#emailid").val()) == false) {
                alert('Invalid Email Address');
                return false;
            }
        }
        if ($("#address").val() == "") {
            alert("Please enter the company address.");
            return false;
        }
        if ($("#phonenumber").val() == "") {
            alert("Please enter the company phone number.");
            return false;
        }
        if ($("#phonenumber").val().length > 16) {
            alert("Please enter a valid company phone number.");
            return false;
        }
        var webregexp = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}$/;
        if ($("#website").val() != "") {
            if (webregexp.test($("#website").val()) == false) {
                alert("Please enter the valid website URL.");
                return false;
            }
        }
        var gst = $("#gstno").val();
        if (gst != "") {
            if ($("#gstno").val().length < 15 || $("#gstno").val().length > 15) {
                alert("Please enter a valid GST number. GST number should be of 15 characters only.");
                $("#gstno").focus();
                return false;
            }
            var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;
            if (!reggst.test(gst) && gst != '') {
                //   alert('GST number is not valid. It should be in the "11AAAAA1111Z1A1" format only.');
                alert('GST number is not valid. Please enter a valid GST number.');
                return false;
            }
        }
        if ($("#pan").val() != "") {
            var panregex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            var inputvalues = $("#pan").val().toUpperCase();
            if (panregex.test(inputvalues) == false) {
                alert("Please enter a valid PAN No.");
                //alert("Please enter valid PAN No. It should be 10 characters long. The first five characters should be alphabets in upper case. The next four characters should be any number from 0 to 9.The last (tenth) character should be any upper case alphabet. It should not contain any blank spaces.");
                return false;
            }
            if ($("#pan").val().length < 10) {
                alert("PAN no. should be of 10 characters only.");
                return false;
            }
        }
        var formData = new FormData();
        if ($("#attachment").val() != "") {
            var totalFiles = document.getElementById("attachment").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                formData.append("logo", file);
                formData.append("logo1", EncodeText(""));
            }
        }
        else {
            formData.append("logo1", EncodeText($("#templogo").val()));
        }
        if ($("#attachment1").val() != "") {
            var totalFiles = document.getElementById("attachment1").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment1").files[i];
                formData.append("logosign", file);
                formData.append("logosign1", EncodeText(""));
            }
        }
        else {
            formData.append("logosign1", EncodeText($("#templogo1").val()));
        }
        var gstno = $("#gstno").val();
        var panno = $("#pan").val();
        formData.append("invoicename", EncodeText(invoicename));
        formData.append("cname", EncodeText($("#cname").val()));
        formData.append("sacno", EncodeText($("#sac").val()));
        formData.append("notes", EncodeText(notes));
        formData.append("terms", EncodeText(terms));
        formData.append("pan", EncodeText(panno));
        formData.append("gstno", EncodeText(gstno));
        formData.append("state", EncodeText($("#state").val()));
        formData.append("address", EncodeText($("#address").val()));
        formData.append("phonenumber", EncodeText($("#phonenumber").val()));
        formData.append("emailid", EncodeText($("#emailid").val()));
        formData.append("website", EncodeText($("#website").val()));
        var cp = '';
        if ($("#cport:checked").prop('checked')) {
            cp = $("#cport:checked").val();
        }
        else {
            cp = "0";
        }
        formData.append("isdefault", cp);
        $.ajax(
            {
                type: "POST",
                url: "/api/OcrInvoiceApi/InvoiceSettingsPageSave", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data.toString() == "0") {
                        alert('Something went wrong! Please try again.');
                        return false;
                    }
                    else if (data.Data.toString() == "setdefault") {
                        alert("Please select set a default company address by enabling ‘Set Default’ option.");
                    }
                    else {
                        alert("Saved Successfully");
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
})

function initFileUpload({
    inputId,
    listContainerId,
    removeBtnClass,
    dropContainerId = null,
    maxVisible = 5
}) {
    let selectedFiles = [];
    $(document).on('change', `#${inputId}`, function (e) {

        selectedFiles = Array.from(e.target.files);

        if (dropContainerId) {
            $(`#${dropContainerId}`).attr("title",
                selectedFiles.length > 0 ? "Document Attached" : "Upload Attachment"
            );
        }

        displayFiles();
    });

    $(document).on('click', `.${removeBtnClass}`, function () {
        const index = $(this).data('index');
        selectedFiles.splice(index, 1);
        displayFiles();
    });
    function displayFiles() {

        const fileList = $(`#${listContainerId}`);
        fileList.empty();

        let count = selectedFiles.length;

        selectedFiles.slice(0, maxVisible).forEach((file, index) => {
            fileList.append(`
                <div class="file-item">
                    <span class="file-name">${file.name}</span>
                    <span class="${removeBtnClass}" data-index="${index}"
                          style="cursor:pointer;color:red;margin-left:10px;">
                        ✖
                    </span>
                </div>
            `);
        });

        if (count > maxVisible) {
            fileList.append(`
                <div style="margin-top:5px;color:#555;">
                    +${count - maxVisible} more (Total ${count} files selected)
                </div>
            `);
        }

        updateInputFiles();
    }
    function updateInputFiles() {
        const dt = new DataTransfer();
        selectedFiles.forEach(f => dt.items.add(f));
        document.getElementById(inputId).files = dt.files;
    }

    return {
        clear: function () {
            selectedFiles = [];
            const input = document.getElementById(inputId);
            if (input) input.value = "";
            $(`#${listContainerId}`).empty();
            if (dropContainerId) {
                $(`#${dropContainerId}`).attr("title", "Upload Attachment");
            }
        }
    };
}