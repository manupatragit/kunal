$(document).ready(function () {
    $("#resultdiv").css("display", "none");
  //  load client list
    function loadclientlist() {
        $('#clientids').find('option').not(':first').remove();
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
                    // alert("not found");
                }
                var option = '<option value="">Select</option>';
                $.each(obj, function (i, a) {
                    option = '<option value="' + a["LoginId"] + '" >' + a["cfname"] + ' (' + a["Username"] + ')</option>';
                    $("#clientids").append(option);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
/*Load invoice by client id*/
    $("#clientids").change(function () {
        $("#resultdiv").css("display", "none");
        var ctoken = $("#clientids").val();
        var formdata = new FormData();
        formdata.append("ctoken", ctoken);
        $('#Invoiceid').find('option').not(':first').remove();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/LoadInvoicebyclientid",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    // alert("not found");
                }
                var option = '<option value="">Select</option>';
                $.each(obj, function (i, a) {
                    option = '<option value="' + a["id"] + '" >' + a["InvoiceNo"] + '</option>';
                    $("#Invoiceid").append(option);
                }); //End of foreach Loop
            },
            error: function () {
                // closeload();
            }
        });
    });
    $("#Invoiceid").change(function () {
        loaddata();
    });

/*Load data*/
    function loaddata() {
        var ptoken = $("#Invoiceid").val();
        $("#assignuserdata").html("");
        var formdata = new FormData();
        var qty1 = 0;
        var ddnos = "";
        formdata.append("ptoken", ptoken);
        var html = '';
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/LoadInvoicePaymentbyInvid",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#resultdiv").css("display", "block");
                var datas1 = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    if (a.ChequeNO != "") {
                        ddnos = a.ChequeNo;
                    }
                    if (a.DdNo != "") {
                        ddnos = a.DdNo;
                    }
                    if (String(a.Cleared) == "1") {
                        html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.PaymentType + ' </td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.Amount + '</td><td>' + a.BankName + '</td><td>' + ddnos + '</td><td>' + a.RefNo + '</td><td> Cleared</td></tr>';
                    }
                    else if (String(a.Cleared) == "2")
                    {
                        html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.PaymentType + ' </td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.Amount + '</td><td>' + a.BankName + '</td><td>' + ddnos + '</td><td>' + a.RefNo + '</td><td> Bounced</td></tr>';
                    }
                    else {
                        html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.PaymentType + ' </td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.Amount + '</td><td>' + a.BankName + '</td><td>' + ddnos + '</td><td>' + a.RefNo + '</td><td><a class="btn" style="border: 1px solid #008000; color: #008000;" title="Click here to clear Cheque/DD No." id="cleared" dataval="' + a.Id + '">Clear</a>&nbsp;<a class="btn" style="border: 1px solid #FF0000; color: #FF0000;" title="Click here to clear Cheque/DD No." id="bounce" dataval="' + a.Id + '">Bounce</a></td></tr>';
                    }
                });
                $("#assignuserdata").append(html);
            },
            error: function () {
            }
        });
    }
    $(document).on("click", "#cleared", function () {
        var tokenids = $(this).attr("dataval");
        $("#textinvid").val(tokenids);
        $('#myModaldocs1').modal({ show: true });
    });
    $("#clearpayment").click(function () {
        var formdata = new FormData();
        var cleardate = $("#cleardate").val();
        if (cleardate == "") {
            alert("select Clearance date.");
            return false;
        } 
        var tokens = $("#textinvid").val();
        formdata.append("cleardate", EncodeText(cleardate));
            formdata.append("token", tokens);
        formdata.append("isClearence", EncodeText("1"));
            $.ajax({
                async: true,
                url: "/api/OcrInvoiceApi/UpdateClearPayment",
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    alert("Payment Clear Successfully");
                    $('#myModaldocs1').modal('hide');
                loaddata();
                $("#cleardate").val("");
                },
                error: function () {
                }
            });
    });
    $(document).on("click", "#bounce", function () {
        var tokenids = $(this).attr("dataval");
        $("#textinvid").val(tokenids);
        $('#myModaldocs').modal({ show: true });
    });
    $("#bouncepayment").click(function () {
        var formdata = new FormData();
        var cleardate = $("#bouncedate").val();
        if (cleardate == "") {
            alert("select Bounce date.");
            return false;
        }
        var tokens = $("#textinvid").val();
        formdata.append("cleardate", EncodeText(cleardate));
        formdata.append("token", tokens);
        formdata.append("isClearence", EncodeText("0"));
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/UpdateClearPayment",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                alert("Payment Bounce Successfully");
                $('#myModaldocs').modal('hide');
                loaddata();
                $("#bouncedate").val("");
            },
            error: function () {
            }
        });
    });
});