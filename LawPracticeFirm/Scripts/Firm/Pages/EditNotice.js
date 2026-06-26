$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    openloader();
    setTimeout(function () {
        var formData = new FormData();
        formData.append("token", token);
        $.ajax({
            async: true,
            url: '/api/CallApi/NoticeDetailsById',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var aassign = "";
                    $.each(obj, function (i, val) {
                        $("#nsubject").val(val.Subject);
                        var dat = val.NoticeDate;
                        var dates1 = dat.substring(0, 10);
                        $("#ndate").val(dates1);
                        $('#nparty').val(val.NameOfParty);
                        $('#aparty').val(val.AddressOfParty);
                        $('#place').val(val.Place);
                        $('#noparty').val(val.NameofOPParty);
                        $('#aoparty').val(val.AddressOfOPParty);
                        CKEDITOR.instances['details'].setData(val.NoticeBody);
                    });
                    closeloader();
                }
                else {
                    closeloader();
                }
            },
            error: function () {
                alert('Error!');
                closeloader();
            }
        });
    }, 1500);
    //Check email
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }

    /*Save notice details*/
    $("#savenotice").click(function () {
        var nsubject = $('#nsubject').val();
        var ndate = $('#ndate').val();
        var nparty = $('#nparty').val();
        var aparty = $('#aparty').val();
        var place = $('#place').val();
        var details = CKEDITOR.instances.details.getData();
        var noparty = $('#noparty').val();
        var aoparty = $('#aoparty').val();
        var user = $('#user').val();
        if (nsubject == "") {
            alert("Enter notice subject");
            return false;
        }
        if (details == "") {
            alert("Enter notice body");
            return false;
        }
        if (ndate == "") {
            alert("select notice date");
            return false;
        }
        if (nparty == "") {
            alert("Enter name of party");
            return false;
        }
        if (aparty == "") {
            alert("Enter address of party");
            return false;
        }
        if (place == "") {
            alert("Enter place");
            return false;
        }
        if (noparty == "") {
            alert("Enter name of other party");
            return false;
        }
        if (aoparty == "") {
            alert("Enter address of other party");
            return false;
        }
        var formData = new FormData();
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("postedFile").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("postedFile").files[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
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
        formData.append("nsubject", nsubject);
        formData.append("details", details);
        formData.append("ndate", ndate);
        formData.append("nparty", nparty);
        formData.append("aparty", aparty);
        formData.append("place", place);
        formData.append("noparty", noparty);
        formData.append("aoparty", aoparty);
        formData.append("token", token);
        formData.append("user", user);
        openloader();
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/SaveNotice", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    closeloader();
                    new PNotify({
                        title: 'Success!',
                        text: ' Notice Saved Successfully',
                        type: 'success',
                        delay: 3000
                    });
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                    closeloader();
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                    closeloader();
                } //End of AJAX error function
            });
    });
});
