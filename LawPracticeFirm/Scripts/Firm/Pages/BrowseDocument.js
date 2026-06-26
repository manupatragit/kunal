$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    var filext1 = "";
    var filext2 = "";
/*Open Browse Document file One Attachment*/
    $("#attachmentone").change(function () {
        var formData = new FormData();
        var attachmentonefiles = document.getElementById("attachmentone").files.length;
        if (attachmentonefiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var tempsize = 0;
            var tottempsize = 0;
            for (var i = 0; i < attachmentonefiles; i++) {
                var file = document.getElementById("attachmentone").files[i];
                var filename = file.name;
                filext1= filename.split('.').pop();
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                var Extresponse = browsecomparedoc(filename);
                if (String(Extresponse) == "false") {
                    $("#attachmentone").val("");
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
            }
            if (tottempsize > parseFloat(TOTALLIMIT)) {
                alert(TOTALLIMITMSG);
                return false;
            }
            $.ajax({
                async: true,
                url: '/api/WorkFlowNewApi/OpenBrowseDocumentfileOne',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create file for other users directory");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        var path = BaseDomainURL + response.Data;
                        var returnpath = "https://view.officeapps.live.com/op/view.aspx?src=" + path;
                        if (filext1.toLowerCase() == "pdf" || filext1.toLowerCase() == "png" || filext1.toLowerCase() == "gif" || filext1.toLowerCase() == "jpg" || filext1.toLowerCase() == "jpeg"  ) {
                            $('#frmFileone').attr('src', path)
                        }
                        else {
                            $('#frmFileone').attr('src', returnpath)
                        }
                        //remove file
                        RemoveFile(path);
                    }
                    else {
                        //closeload();
                        //alert("not found");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });
/*Open Browse Document file Two*/
    $("#attachmenttwo").change(function () {
        var formData = new FormData();
        var attachmentonefiles = document.getElementById("attachmenttwo").files.length;
        if (attachmentonefiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var tempsize = 0;
            var tottempsize = 0;
            for (var i = 0; i < attachmentonefiles; i++) {
                var file = document.getElementById("attachmenttwo").files[i];
                var filename = file.name;
                filext2 = filename.split('.').pop();
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    $("#attachmenttwo").val("");
                    return false;
                }
                var Extresponse = browsecomparedoc(filename);
                if (String(Extresponse) == "false") {
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
            }
            if (tottempsize > parseFloat(TOTALLIMIT)) {
                alert(TOTALLIMITMSG);
                return false;
            }
            $.ajax({
                async: true,
                url: '/api/WorkFlowNewApi/OpenBrowseDocumentfileTwo',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create file for other users directory");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        var path = BaseDomainURL + response.Data;
                        var returnpath = "https://view.officeapps.live.com/op/view.aspx?src=" + path;
                        if (filext2.toLowerCase() == "pdf" || filext2.toLowerCase() == "png" || filext2.toLowerCase() == "gif" || filext2.toLowerCase() == "jpg" || filext2.toLowerCase() == "jpeg") {
                            $('#frmFiletwo').attr('src', path)
                        }
                        else {
                            $('#frmFiletwo').attr('src', returnpath)
                        }
                        //remove file
                        RemoveFile(path);
                        
                    }
                    else {
                        //closeload();
                        //alert("not found");
                    }
                },
                error: function () {
                    // closeload();
                    alert('Error!');
                }
            });
        }
    });
/*Remove files*/
    function RemoveFile(path) {
        var formData = new FormData();
        formData.append("filepath", path);
        $.ajax({
            async: true,
            url: '/api/WorkFlowNewApi/RemoveBrowseDocumentfile',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {               
                if (response.Status == true) {
                }
                else {
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
});