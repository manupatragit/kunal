$(document).ready(function () {
    /*Load event matter on contact change*/
    $("#contact").change(function () {
        $('#matter').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
            return false;
        }
        else {
            $('#matter').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
            return false;
        }
    });
    /*Load event matter by event client*/
    function loadmatter(clientid) {
        $('#matter').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/LoadMatterforclient",
            headers: {
                "clientid": clientid
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                }
                $.each(JSON.parse(response.Data), function (i, a) {
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
                return false;
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
        return false;
    }
    loadcontact1();
    /*load contact*/
    function loadcontact1() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/SpClientData',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a.LoginId + '" >' + a.Username + ' (' + a.cfname + ') </option> ';
                    $("#contact").append(option);
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
    $('#allday').click(function () {
        if ($("#allday:checked").prop('checked')) {
            $("#st").hide();
            $("#et").hide();
            $('#st').val("");
            $('#et').val(null);
        }
        else {
            $("#st").show();
            $("#et").show();
        }
    });
    /*save data*/
    $('form[id="saveeventform"]').validate({
        submitHandler: function (form) {
            var x1 = '';
            var x2 = '';
            var x3 = '';
            var x4 = '';
            var x5 = '';
            var nx1 = '';
            var nx2 = '';
            var nx3 = '';
            var nx4 = '';
            var nx5 = '';
            var tnx1 = '';
            var tnx2 = '';
            var tnx3 = '';
            var tnx4 = '';
            var tnx5 = '';
            colort = $("#color").val();
            x1 = $("#type1").val();
            x2 = $("#type2").val();
            x3 = $("#type3").val();
            x4 = $("#type4").val();
            x5 = $("#type5").val();
            nx1 = $("#num1").val();
            nx2 = $("#num2").val();
            nx3 = $("#num3").val();
            nx4 = $("#num4").val();
            nx5 = $("#num5").val();
            tnx1 = $("#time1").val();
            tnx2 = $("#time2").val();
            tnx3 = $("#time3").val();
            tnx4 = $("#time4").val();
            tnx5 = $("#time5").val();
            var formData = new FormData();
            var tempsize = 0;
            var totalFiles = document.getElementById("postedFile").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("postedFile").files[i];
                var filename = file.name;
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                checkfileext(filename);
                formData.append("FileUpload", file);
                try {
                    if (typeof (file) != "undefined") {
                        size = parseFloat(file.size / 1024).toFixed(2);
                        tempsize = parseFloat(size);
                    }
                }
                catch (err) {
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
            var contact = $('#contact').val();
            var matter = $('#matter').val();
            var subject = $('#subject').val();
            var color = $('#color').val();
            var location = $('#location').val();
            var status = $('#status').val();
            var sd = $('#sd').val();
            var ed = $('#ed').val();
            var st = $('#st').val();
            var et = $('#et').val();
            var date1 = new Date(sd);
            var date2 = new Date(ed);
            if (date1 > date2) {
                alert("End date should not be less than Start date");
                return false;
            }
            var details = CKEDITOR.instances.details.getData();
            var user = $('#user').val();
            if (user == null) {
                alert("Please select assigned user");
                return false;
            }
            var acontact = $('#acontact').val();
            var tags = $('#tags').val();
            var priority = $('#priority').val();
            var repeat = $('#repeat').val();
            var cp = '';
            if ($("#assign:checked").prop('checked')) {
                cp = $("#assign:checked").val();
            }
            else {
                cp = "0";
            }
            var ad = '';
            if (st == "") {
                ad = 1;
            }
            else {
                ad = 0;
            }
            formData.append("contact", contact);
            formData.append("matter", matter);
            formData.append("subject", subject);
            formData.append("status", status);
            formData.append("color", color);
            formData.append("location", location);
            formData.append("sd", sd);
            formData.append("ed", ed);
            formData.append("st", st);
            formData.append("et", et);
            formData.append("user", user);
            formData.append("details", details);
            formData.append("acontact", acontact);
            formData.append("priority", priority);
            formData.append("tags", tags);
            formData.append("allday", ad);
            formData.append("assign", cp);
            formData.append("repeat", repeat);
            if (x1 == undefined) {
                x1 = '';
            }
            if (x2 == undefined) {
                x2 = '';
            }
            if (x3 == undefined) {
                x3 = '';
            }
            if (x4 == undefined) {
                x4 = '';
            }
            if (x5 == undefined) {
                x5 = '';
            }
            if (nx1 == undefined) {
                nx1 = '';
            }
            if (nx2 == undefined) {
                nx2 = '';
            }
            if (nx3 == undefined) {
                nx3 = '';
            }
            if (nx4 == undefined) {
                nx4 = '';
            }
            if (nx5 == undefined) {
                nx5 = '';
            }
            if (tnx1 == undefined) {
                tnx1 = '';
            }
            if (tnx2 == undefined) {
                tnx2 = '';
            }
            if (tnx3 == undefined) {
                tnx3 = '';
            }
            if (tnx4 == undefined) {
                tnx4 = '';
            }
            if (tnx5 == undefined) {
                tnx5 = '';
            }
            openloader();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/CallApi/PostSaveEvent", // Controller/View
                    headers: {
                        "x1": x1,
                        "x2": x2,
                        "x3": x3,
                        "x4": x4,
                        "x5": x5,
                        "nx1": nx1,
                        "nx2": nx2,
                        "nx3": nx3,
                        "nx4": nx4,
                        "nx5": nx5,
                        "ctxt1": tnx1,
                        "ctxt2": tnx2,
                        "ctxt3": tnx3,
                        "ctxt4": tnx4,
                        "ctxt5": tnx5,
                        "sum": iCnt
                    },
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        closeloader();
                        $("#saveeventform")[0].reset();
                        document.getElementById("close").click();
                        new PNotify({
                            title: 'Success!',
                            text: ' Event Added Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        localStorage.setItem("setname", "calender");
                        localStorage.setItem("setname2", "calender");
                        var $select = $('#user').selectize();
                        var control = $select[0].selectize;
                        control.clear();
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
        }
    });
    /*add reminder*/
    var iCnt = 0;
    $('#addremind').click(function () {
        var html = '';
        if (iCnt <= 4) {
            iCnt = iCnt + 1;
            html += '<div class="form-group form-horizontal" id="div' + iCnt + '"><div class="col-xs-4"><select name="" class="form-control input-sm" width="40px;" id="type' + iCnt + '"> ';
            html += '<option value="PopUp">Popup</option> ';
            html += '<option value="Email">Email</option> ';
            html += '<option value="Message">Message</option></select></div>';
            html += '<div class="col-xs-3"> <input class="form-control" type="number" id="num' + iCnt + '" /></div>';
            html += '<div class="col-xs-4"><select name="" class="form-control input-sm" width="40px;" id="time' + iCnt + '">';
            html += '<option value="Days">Days</option> ';
            html += '<option value="Hours">Hours</option> ';
            html += '<option value="Minutes">Minutes</option></select> </div> ';
            html += '<span id="idss" value="' + iCnt + '" style="float:left;padding:8px 0 0 2px;" class="idss glyphicon glyphicon-trash"></span></div >';
            html += '</select>';
            $("#dataremind").append(html + '');
        }
        else {
            alert("limit completed");
        }
    });
    /*REMOVE ONE ELEMENT PER CLICK.*/
    $(document).on("click", "#idss", function () {
        var t = $(this).attr("value");
        var result = confirm("Are you sure to   delete this field?");
        if (result) {
            $('#div' + iCnt).remove();
            iCnt = iCnt - 1;
        }
        else {
        }
    });
});