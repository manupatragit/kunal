$(document).ready(function () {
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var fcode = localStorage.getItem("FirmCode");
    /*Create directory*/
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
        dirname = String(dirname).replace(/[@\\/:*?"<>|.]/g, '');
        dirname = $.trim(dirname);
        dirname = dirname.replace(/[/]+/g, '/')
        var fdirname = dirname.charAt(0);
        var ldirname = dirname.charAt(dirname.length - 1);
        if (fdirname == '/') {
            var dirname = dirname.substr(1);
        }
        if (ldirname == "/") {
            dirname = dirname.slice(0, -1);
        }
        var string = dirname;
        newString = string.replace(/([\\+])\s+/g, "");
        newString1 = newString.replace(/(\s+[\\+])/g, "");
        dirname = newString1;
        if (dirname == "") {
            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
            return false;
        }
        if (dirname.length > 25) {
            $(".validpanel").css("display", "block").html("Folder Name should be less than 26 character");
            return false;
        }
        formData.append("foldername", EncodeText(dirname));
        formData.append("hiddenpath", EncodeText($("#hiddenpath").val()));
        if (dirname != "") {
            openload();
            $.ajax({
                async: true,
                url: '/dropbox/CreateFolder',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (String(response) == "true") {
                        alert("Folder created successfully.");
                        location.reload();
                        return false;
                    }
                    else if (String(response) == "exist") {
                        alert("Folder already exists.");
                        closeload();
                        return false;
                    }
                    else {
                        alert(response);
                        closeload();
                        return false;
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });

    /*Create files*/
    $("#createfiles").click(function () {
        var chkArray3 = [];
        var selected = $("input[name='options[]']:checked")
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var dname = $("#directory").val();
        if (dname == "" && directoryid == 0) {
            dname = dname;
        }
        else if (dname == "" && directoryid != 0) {
            dname = directoryid;
        }
        var filedetails = $("#filedetails").val();
        var formData = new FormData();
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var tempsize = 0;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                var filename = file.name;
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
                }
            }
            tempsize = tempsize.toFixed(2);
            if (tempsize > filesize) {
                new PNotify({
                    title: 'Warning!',
                    text: Filesizelabel,
                    type: 'error',
                    delay: 3000
                });
                return false
            }
            formData.append("hiddenpath", EncodeText($("#hiddenpath").val()));
            openload();
            $.ajax({
                async: true,
                url: '/Dropbox/UploadFile',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (String(response) == "true") {
                        alert("File uploaded successfully.");
                        location.reload();
                        return false;
                    }
                    else {
                        alert(response);
                        closeload();
                        return false;
                    }
                },
                error: function () {
                    closeload();
                    alert('Error!');
                }
            });
        }
    });
});