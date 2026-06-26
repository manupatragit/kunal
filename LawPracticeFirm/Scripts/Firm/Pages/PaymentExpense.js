function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
$(document).ready(function () {
    var orderItems = [];
    var payorderItems = [];
    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;
    var subtotal = 0;
    $("#ptype").on("change", function () {
        $("#ptype").siblings("span.error1").css("display", "none");
        $("#pmode").attr("selectedindex", 0);
        $("#pamount").val("");
        $("#pdate").val("");
        $("#pbank").val("");
        $("#pddno").val("");
        $("#pddidate").val("");
        $("#pchequeno").val("");
        $("#preference").val("");
        $("#pchqidate").val("");
        $("#pdetails").val("");
        var values = $('option:selected', this).attr('value');
        if (String(values) == "Cash") {
            $("#p3,#p4,#p11").css("display", "");
            $("#p2,#p,#p6,#p7,#p8,#p9,#p10").css("display", "none");
        }
        else if (String(values) == "Cheque") {
            $("#p3,#p4,#p5,#p8,#p10,#p11").css("display", "");
            $("#p2,#p6,#p7,#p9").css("display", "none");
        }
        else if (String(values) == "Online") {
            $("#p2,#p3,#p4,#p9,#p11").css("display", "");
            $("#p5,#p6,#p7,#p8,#p10").css("display", "none");
        }
        else if (String(values) == "Demand Draft") {
            $("#p3,#p4,#p5,#p6,#p7,#p11").css("display", "");
            $("#p2,#p9,#p8,#p10").css("display", "none");
        }
        else {
            $("#p2,#p3,#p4,#p5,#p6,#p7,#p8,#p9,#p10,#p11").css("display", "none");
        }
    });
    $("#state").on("change", function () {
        totalsum($("#subtotal").text());
    });
    $("#pmode").on("change", function () {
        $('#pmode').siblings('span.error1').css('display', 'none');
    });
    var flagcount = 0;
    $("#createinv").attr("disabled", "disabled");
    //Add button click function
    $('#add4').click(function () {
        //Check validation of order item
     
        var isValidItem = true;
        if ($("#ptype").val().trim() == "") {
            isValidItem = false;
            $("#ptype").siblings('span.error1').css("display", "block");
            return false;
        }
        else {
            $("#ptype").siblings("span.error1").css("display", "none");
        }
        var chkpytpes = $("#ptype").val();
        if (String(chkpytpes) == "Cash") {
            if (!($("#pamount").val().trim() != "" && !isNaN($("#pamount").val().trim()))) {
                isValidItem = false;
                $("#pamount").siblings("span.error1").css("display", "block");
                return false;
            }
            else {
                $("#pamount").siblings("span.error1").css("display", "none");
            }
        }
        else if (String(chkpytpes) == "Cheque") {
            if (!($("#pamount").val().trim() != "" && !isNaN($("#pamount").val().trim()))) {
                isValidItem = false;
                $("#pamount").siblings("span.error1").css("display", "block");
                return false;
            }
            else {
                $("#pamount").siblings("span.error1").css("display", "none");
            }
            if ($("#pbank").val().trim() == "") {
                isValidItem = false;
                $("#pbank").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pbank").siblings("span.error1").css("display", "none");
            }
            if ($("#pchequeno").val().trim() == "") {
                isValidItem = false;
                $("#pchequeno").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pchequeno").siblings("span.error1").css("display", "none");
            }
            if ($("#pchqidate").val().trim() == "") {
                isValidItem = false;
                $("#pchqidate").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pchqidate").siblings("span.error1").css("display", "none");
            }
        }
        else if (String(chkpytpes) == "Online") {
            if ($("#pmode").val().trim() == "") {
                isValidItem = false;
                $("#pmode").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $('#pmode').siblings('span.error1').css('display', 'none');
            }
            if (!($("#pamount").val().trim() != "" && !isNaN($("#pamount").val().trim()))) {
                isValidItem = false;
                $("#pamount").siblings("span.error1").css("display", "block");
                return false;
            }
            else {
                $("#pamount").siblings("span.error1").css("display", "none");
            }
        }
        else if (String(chkpytpes) == "Demand Draft") {
            if (!($("#pamount").val().trim() != "" && !isNaN($("#pamount").val().trim()))) {
                isValidItem = false;
                $("#pamount").siblings("span.error1").css("display", "block");
                return false;
            }
            else {
                $("#pamount").siblings("span.error1").css("display", "none");
            }
            if ($("#pdate").val().trim() == "") {
                isValidItem = false;
                $("#pdate").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pdate").siblings("span.error1").css("display", "none");
            }
            if ($("#pbank").val().trim() == "") {
                isValidItem = false;
                $("#pbank").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pbank").siblings("span.error1").css("display", "none");
            }
            if ($("#pddno").val().trim() == "") {
                isValidItem = false;
                $("#pddno").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pddno").siblings("span.error1").css("display", "none");
            }
            if ($("#pddidate").val().trim() == "") {
                isValidItem = false;
                $("#pddidate").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pddidate").siblings("span.error1").css("display", "none");
            }
        }
        else {
            return false;
        }
        //Add item to list if valid
        if (isValidItem) {
            payorderItems.push({
                PaymentType: $('#ptype').val().trim(),
                PaymentMode: $('#pmode').val().trim(),
                Amount: parseFloat($('#pamount').val().trim()),
                PDate: $('#pdate').val().trim(),
                BankName: $('#pbank').val().trim(),
                DdNo: $('#pddno').val().trim(),
                Ddidate: $('#pddidate').val().trim(),
                ChequeNo: $('#pchequeno').val().trim(),
                RefNo: $('#preference').val().trim(),
                Chqidate: $('#pchqidate').val().trim(),
                OtherDetails: $('#pdetails').val().trim()
            });
            $("#pmode").prop("selectedindex", 0);
            $("#ptype").prop('selectedIndex', 0);
            $("#pamount").val("");
            $("#pdate").val("");
            $("#pbank").val("");
            $("#pddno").val("");
            $("#pddidate").val("");
            $("#pchequeno").val("");
            $("#preference").val("");
            $("#pchqidate").val("");
            $("#pdetails").val("");
            $("#p2,#p3,#p4,#p5,#p6,#p7,#p8,#p9,#p10,#p11").css("display", "none");
        }
        //populate order items
        GeneratedItemsTable4();
    });

    //function to show added item 
    function GeneratedItemsTable4() {
        if (payorderItems.length > 0) {
            $("#createpay").show();
            var $table4 = $('<table id="table4" class="table-panel"/>');
            $table4.append('<thead><tr><th><div class="thbg">Date</div></th><th><div class="thbg">Payment Mode</div></th><th><div class="thbg">Pay Received</div></th><th><div class="thbg">Ref No</div></th><th><div class="thbg">Other Details</div></th><th><div class="thbg">Action</div></th></tr></thead>');
            var $tbody4 = $('<tbody/>');
            $.each(payorderItems, function (i, val) {
                var $row4 = $('<tr/>');
                if (val.PDate != "") {
                    $row4.append($('<td/>').html(formatDatetoIST(val.PDate)));
                }
                else {
                    $row4.append($('<td/>').html(val.PDate));
                }
                $row4.append($('<td/>').html(val.PaymentType));
                $row4.append($('<td/>').html(val.Amount));
                $row4.append($('<td/>').html(val.RefNo));
                $row4.append($('<td/>').html(val.OtherDetails));
                var $remove4 = $('<div class="table_action"> <li> <a href="#"> <img src="/newassets/img/darkdelete.svg" alt="delete"> </a>  </li>  </div> ');
                $remove4.click(function (e) {
                    var result = confirm("Are you sure to delete Payment ?");
                    if (result) {
                        e.preventDefault();
                        payorderItems.splice(i, 1);
                        GeneratedItemsTable4();
                    }
                });
                $row4.append($('<td/>').html($remove4));
                $tbody4.append($row4);
            });
            console.log("current", payorderItems);
            $table4.append($tbody4);
            $('#orderItems4').html($table4);
        }
        else {
            $('#orderItems4').html('');
        }
    }

    /*Save expense payment*/
    $("#createpay").click(function () {
        var formData = new FormData();
        var invtoken = $("#invoicetoken").val();
        formData.append("token", invtoken);
        formData.append("itempaymentdata", JSON.stringify(payorderItems));
        $.ajax({
            url: '/api/ExpenseApi/PostSaveExpensePayment',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "can not blank") {
                        alert("Please add payment")
                    }
                    else if (response.Data == "Invalid amount") {
                        alert("Paid amount is more than balance amount")
                        new PNotify({
                            title: 'Success!',
                            text: ' Payment added successfully',
                            type: 'success',
                            delay: 3000
                        });
                        payorderItems = [];
                        payorderItems.length = 0;
                        location.reload();
                        try {
                            document.getElementById("table4").innerHTML = "";
                        }
                        catch (er) {
                        }
                    }
                    else {
                        new PNotify({
                            title: 'Success!',
                            text: ' Payment added successfully',
                            type: 'success',
                            delay: 3000
                        });
                        payorderItems = [];
                        payorderItems.length = 0;
                        location.reload();
                        try {
                            document.getElementById("table4").innerHTML = "";
                        }
                        catch (er) {
                        }
                    }
                }
                else {
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
});