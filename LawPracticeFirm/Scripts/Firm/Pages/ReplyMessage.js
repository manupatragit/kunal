$(document).ready(function () {
    // load Client
    // Load user
    loadmatter();
    function loadmatter() {
        $.ajax({  async: true, 
            type: "POST",
            url: "/api/callApi/LoadMatterBound",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                   // alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#matter").append(option);
                    }
                });
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    //save data
    $(document).on("click", "#savereply", function () {
        alert(CKEDITOR.instances.details.getData());
        //    var formData = new FormData();
        //    var totalFiles = document.getElementById("postedFile").files.length;
        //    //alert(totalFiles);
        //    for (var i = 0; i < totalFiles; i++) {
        //        var file = document.getElementById("postedFile").files[i];
        //        formData.append("FileUpload", file);
        //    }
        //    var subject = $('#subject').val();
        //    var details = CKEDITOR.instances.details.getData();
        //    var matter = $('#matter').val();
        //    var user = $('#client').html();
        //if (user == null) {
        //    new PNotify({
        //        title: 'Warning!',
        //        text: 'Please Select users',
        //        type: 'error',
        //        delay: 3000
        //    });
        //    return false;
        //}
        //    formData.append("subject", subject);
        //    formData.append("details", details);
        //    formData.append("matter", matter);
        //    formData.append("user", user);
        //    //alert(iCnt);
        //    $.ajax(
        //        {
        //            type: "POST",
        //            url: "/api/callApi/PostSaveMessage", // Controller/View
        //            data: formData,
        //            contentType: false,
        //            processData: false,
        //            //},
        //            success: function (data) {
        //                $("#savemessageform")[0].reset();
        //                document.getElementById("close").click();
        //                new PNotify({
        //                    title: 'Success!',
        //                    text: ' Message Send Successfully',
        //                    type: 'success',
        //                    delay: 3000
        //                });
        //                //  $('#myModal').modal('toggle');
        //            }, //End of AJAX Success function
        //            failure: function (data) {
        //                alert(data.responseText);
        //            }, //End of AJAX failure function
        //            error: function (data) {
        //                alert(data.responseText);
        //            } //End of AJAX error function
        //        });
        //}
    });
