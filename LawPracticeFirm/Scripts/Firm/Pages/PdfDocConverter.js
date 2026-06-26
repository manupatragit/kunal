function fileValidation() {
    var fileInput = document.getElementById('attachment');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    if (!allowedExtensions.exec(filePath)) {
        alert('Please upload file having extensions .jpeg/.jpg/.png/.pdf only.');
        fileInput.value = '';
        return false;
    } else {
        //Image preview
    }
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
    /*Get file extension*/
    function getExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    /*Save new case file*/
    $("#savecasefilenew").click(function () {
        var comparesize = 0;
        var conversion = $("#conversion").val();
        if (conversion == "") {
            alert("Please Select Conversion Type");
            return false;
        }
        var formData = new FormData();
        var tempsize = 0;
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
            return false;
        }
        //else {
        var file = document.getElementById("attachment").files[0];
        filename = file.name;
        var filePath = file.value;
        var ext = filename.split('.').pop();
        if (conversion == "PDFTOW") {
            if (String(ext) == "pdf") {
            }
            else {
                alert('Please upload file having extensions .pdf only.');
                clearDocsUpload();
                file.value = '';
                return false;
            }
        }
        if (conversion == "WTOPDF") {
            if (String(ext) == "doc" || String(ext) == "docx") {
            }
            else {
                alert('Please upload file having extensions .doc/.docx only.');
                file.value = '';
                return false;
            }
        }
        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');
        var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfioename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
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
        tempsize = tempsize.toFixed(2);
        if (tempsize > newfilesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 20MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
        try {
            formData.append("convertertype", conversion);
            openload();
            $.ajax({
                url: "/Firm/ProcessPdfDocConverter",
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response != "") {
                        var hostname = window.location.hostname;
                        var pather = window.location.origin + response;
                        $('#container').empty().append(
                            $(document.createElement('a')).prop({
                                target: '_blank',
                                href: pather,
                                id: 'downloadfile',
                                innerText: 'Download',
                                className: 'btn btn-primary' // Add the Bootstrap button classes here
                            })
                        ).append(
                            $(document.createElement('br'))
                        );
                        $("#downloadfile").click();
                        clearDocsUpload();
                        alert("Document converted successfully.");
                    }
                    closeload();
                },

                error: function (response) {
                    alert('Error!');
                    clearDocsUpload();
                    closeload();
                }
            });
        }
        catch (msg) {
            //alert(msg.message);
        }
    });
});

let selectedFiles = [];

$(document).on('change', '#attachment', function (e) {
    selectedFiles = [];
    var fileCount = this.files.length;
    if (fileCount > 0) {
        $("#dropContainer").attr("title", "Document Attached");
    }
    else {
        $("#dropContainer").attr("title", "upload Attachment");
    }

    const files = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...files];
    displayDocsFiles();
});

$(document).on('click', '.remove-file', function () {
    const index = $(this).data('index');
    selectedFiles.splice(index, 1);
    displayDocsFiles();
});

function displayDocsFiles() {
    const fileList = $('#fileListDocs');
    fileList.empty();
    const fCount = selectedFiles.length;
    selectedFiles.slice(0, 5).forEach((file, index) => {
        const fileItem = $(`
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="remove-file" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
        fileList.append(fileItem);
    });
    if (fCount > 5) {
        const remaining = fCount - 5;
        fileList.append(`
            <div class="file-summary" style="margin-top:5px;color:#555;">
                +${remaining} more (Total ${fCount} files selected)
            </div>
        `);
    }
    updateDocsFileInput();
}

function updateDocsFileInput() {
    const dt = new DataTransfer();
    selectedFiles.forEach(file => dt.items.add(file));
    document.getElementById('attachment').files = dt.files;
}

function clearDocsUpload() {
    selectedFiles = [];
    const fileInput = document.getElementById("attachment");
    if (fileInput) fileInput.value = "";
    $('#fileListDocs').empty();
    $("#dropContainer").attr("title", "Upload Attachment");
    this.value = '';
}