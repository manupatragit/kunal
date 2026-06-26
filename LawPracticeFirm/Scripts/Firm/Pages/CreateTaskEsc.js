$(document).ready(function () {
    /*Open loader*/
    function openloadq() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeloadq() {
        $('#myOverlay').css("display", "none");
    }
    /*Clear form details*/
    function clearForm() {
        $('#saveescform')[0].reset();
    }
    loadlevel();
    /*Load level*/
    function loadlevel() {
        $('#level').find('option').not(':first').remove();
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/BindEscLevel',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    // alert("not found");
                }
                $.each(obj, function (i, a) {
                    //   alert(a.Id);
                    option = '<option value="' + a["Id"] + '" >' + a["LevelName"] + '</option>';
                    $("#level").append(option);
                }); //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Save escilation*/
    $("#saveesc").click(function () {
        var users = $("#select-user").val();
        var level = $("#level").val();
        var tokenids = $("#tokenids").val();
        var alertDays = $("#ddldays").val();
        var hearingAlert = $("#ddlHearing").val();
        var caldate = $("#callfromdate").val();
        var formData = new FormData();
        if (level == "") {
            alert("Select level");
            return false;
        }
        if (users == "" || users == "null" || users == null) {
            alert("Select users");
            return false;
        }
        if (caldate != "") {
            var currentDt = new Date(caldate);
            var mm = currentDt.getMonth() + 1;
            mm = (mm < 10) ? '0' + mm : mm;
            var dd = currentDt.getDate();
            dd = (dd < 10) ? '0' + dd : dd;
            var yyyy = currentDt.getFullYear();
            caldate = mm + '/' + dd + '/' + yyyy;
        }
        if (caldate != "" && (hearingAlert != "0" || alertDays != "")) {
            alert("Please select one Date");
            return false;
        }
        if (tokenids == "") {
            if (caldate == "") {
                if (hearingAlert != 3) {
                    if (alertDays == 0) {
                        alert("Please Set Alert Date");
                        return false;
                    }
                }
                if (hearingAlert == 0) {
                    alert("Please Set Alert Date");
                    return false;
                }
                if (hearingAlert == 3 && alertDays == "") {
                    alertDays = "0";
                }
            }
            if (caldate != "") {
                alertDays = 0;
                hearingAlert == 0;
            }
        }
        formData.append("level", level);
        formData.append("user", users);
        formData.append("token", tokenids);
        formData.append("hearingAlert", hearingAlert);
        formData.append("alertDays", alertDays);
        formData.append("caldate", caldate);
        openloadq();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/saveescilation",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "success") {
                    alert("Data saved successfully");
                    clearForm();
                    var $select1 = $('#select-user').selectize();
                    var control1 = $select1[0].selectize;
                    control1.clear();
                    $('#ddlHearing').prop('selectedIndex', 0);
                    $('#ddldays').prop('selectedIndex', 0);
                    localStorage.setItem("encremind", "1");
                    closeloadq();
                }
                else {
                    alert(data.Data);
                    closeloadq();
                }
            }
        });
    });
});