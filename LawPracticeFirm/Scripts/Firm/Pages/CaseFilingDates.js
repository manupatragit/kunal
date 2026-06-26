/**Open loader */
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}
$(document).ready(function () {
    clear_c();
    $("#c_btnsave").click(function () {
        var sdate = $("#submitDate").val();
        var edate = $("#returnDate").val();
        if (sdate == "") {
            alert("Please enter submit date");
            $("#submitDate").focus();
            return false;
        }
        if (edate == "") {
            alert("Please enter return date");
            $("#returnDate").focus();
            return false;
        }
        var formData = new FormData();
        formData.append("SubmitDate", $("#submitDate").val());
        formData.append("ReturnDate", $("#returnDate").val());
        formData.append("caseid", token);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExtraParty/PostCaseFillingDates",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    alert("Details successfully saved");
                    clear_c();
                }
                else {
                    alert("Oops! Something went wrong..");
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
    $(document).on('click', '.edit_c', function () {
        var id = $(this).attr("data-id");
        $("#hdnid").val(id);
        $("#submitDate").val($(this).data("submitdt"));
        $("#returnDate").val($(this).data("returndt"));
        $("#c_btnsave").hide();
        $("#c_btnupdate").show();
        $("#c_btncancel").show();
    });
    $("#c_btnupdate").click(function () {
        var sdate = $("#submitDate").val();
        var edate = $("#returnDate").val();
        if (sdate == "") {
            alert("Please enter submit date");
            $("#submitDate").focus();
            return false;
        }
        if (edate == "") {
            alert("Please enter return date");
            $("#returnDate").focus();
            return false;
        }
        var formData = new FormData();
        formData.append("Id", $("#hdnid").val());
        formData.append("SubmitDate", $("#submitDate").val());
        formData.append("ReturnDate", $("#returnDate").val());
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExtraParty/PutCaseFillingDates",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    alert("Details successfully updated");
                    clear_c();
                }
                else {
                    alert("Oops! Something went wrong..");
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
    /*Delete Case Filling Date*/
    $(document).on('click', '.remove_c', function () {
        // your function here
        var Id = $(this).data("id");
        var formData = new FormData();
        formData.append("Id", Id);
        var r = confirm("Are you Sure");
        if (r == true) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/ExtraParty/DeleteCaseFillingDate",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.Status == true) {
                        alert("Details successfully removed");
                        clear_c();
                    }
                    else {
                        alert("Oops! Something went wrong..");
                    }
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });
});
function clear_c() {
    $("#hdnid").val('');
    $("#submitDate").val('');
    $("#returnDate").val('');
    $("#c_btnsave").show();
    $("#c_btnupdate").hide();
    $("#c_btncancel").hide();
    bind_c();
}
/*Get case Filling Dates*/
function bind_c() {
    var formData = new FormData();
    formData.append("caseid", token);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/getcaseFillingDates",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var mydata = response.Data;
            var html = "";
            $("#tbody_casefillingdates").empty();
            $.each(mydata, function (i, item) {
                let date_ob = new Date(item.SubmitDate);
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                // current month
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                // current year
                let year = date_ob.getFullYear();
                let date_ob2 = new Date(item.ReturnDate);
                // adjust 0 before single digit date
                let date2 = ("0" + date_ob2.getDate()).slice(-2);
                // current month
                let month2 = ("0" + (date_ob2.getMonth() + 1)).slice(-2);
                // current year
                let year2 = date_ob2.getFullYear();
                var SubmitDate = year + "-" + month + "-" + date;
                var ReturnDate = year2 + "-" + month2 + "-" + date2;
                if (ReturnDate == "1970-01-01") {
                    ReturnDate = "";
                }
                html += "<tr>";
                html += "<td>" + formatDatetoIST(item.SubmitDate) + "</td>";
                if (ReturnDate == "") {
                    html += "<td>" + ReturnDate + "</td>";
                }
                else {
                    html += "<td>" + formatDatetoIST(ReturnDate) + "</td>";
                }
                html += "<td><button type='button' class='edit_c' style='border: none; background: transparent; margin: 0; padding: 0;' data-id='" + item.Id + "' data-submitdt='" + SubmitDate + "' data-returndt='" + ReturnDate + "' title='Edit Matter Filing Date' ><img src='/newassets/img/edit-icon.png' /></button> <button type='button' class='remove_c' style='border: none; background: transparent; margin: 0; padding: 0;' data-id='" + item.Id + "'  title='Remove Matter Filing Date'><img src='/newassets/img/deletecasesingle-icon.png' /></button></td>";
                html += "<tr>";
            });
            $("#tbody_casefillingdates").append(html);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
$("#c_btncancel").click(function () {
    clear_c();
});
