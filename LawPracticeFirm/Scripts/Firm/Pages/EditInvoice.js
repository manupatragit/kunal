function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
/*Bind status*/
function bindstate() {
    var ddlState = $('#state');
    var bddlState = $('#billerstate');
    var sddlState = $('#sstate');
    $.ajax({
        async: true,
        url: '/api/EmployeeApi/BindStateDetails',
        type: 'POST',
        dataType: 'json',
        headers: { CountryName: 'India' },
        success: function (d) {
            ddlState.append($("<option value=''></option>").val('').html('Select State'));
            sddlState.append($("<option value=''></option>").val('').html('Select State'));
            $.each(d.Data, function (i, states) {
                ddlState.append($("<option></option>").val(states.StateName).html(states.StateName));
                sddlState.append($("<option></option>").val(states.StateName).html(states.StateName));
            });
        },
        error: function (d) {
            alert(d.responseText);
        }
    });
}

/*Bind biller address*/
function bindbilleraddress() {
    var ddlState = $('#state');
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/OcrInvoiceApi/Loadinvaddress",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var datas1 = JSON.stringify(response1);
            var obj = JSON.parse(response1.Data);
            $("#billeraddress").append($("<option value=''></option>").val('').html('Select Address'));
            $.each(obj, function (i, states) {
                $("#billeraddress").append($("<option></option>").val(states.Address).html(states.Address).attr("state", states.State).attr("tokenid", states.Id));
                if (String(states.isdefault) == "1") {
                    $('option[value="' + states.Address + '"]').attr("selected", true);
                    $("#billerstate").val(states.State);
                }
            });
        },
        failure: function (response1) {
            alert(response1.responseText);
        },
        error: function (response1) {
            alert(response1.responseText);
        }
    });
}
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    var orderItems = [];
    //check invoice type
    var invtype = $('input[name=tax]:checked', '#taxtype').val();
    if (invtype == "2") {
        $("#subtotals").hide();
        $("#igst").hide();
        $("#cgst").hide();
        $("#sgst").hide();
    }
    else {
        $("#subtotals").show();
        $("#igst").show();
        $("#cgst").show();
        $("#sgst").show();
    }
    $("#withtax").on("click", function () {
        $("#subtotals").show();
        $("#igst").show();
        $("#cgst").show();
        $("#sgst").show();
    });
    $("#withouttax").on("click", function () {
        $("#subtotals").hide();
        $("#igst").hide();
        $("#cgst").hide();
        $("#sgst").hide();
    });
    var payorderItems = [];
    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;
    var subtotal = 0;
    var tempinvid1 = "";
    var tempinvid2 = "";
    var tempinvid3 = "";
    var tempentryid1 = "";
    var tempentryid2 = "";
    var tempentryid3 = "";
    var fflag = false;
    var tflag = false;
    var eflag = false;

    /*Bind invoice entry*/
    function BindEntry() {
        var formData = new FormData();
        formData.append("token", $("#invcid").val());
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/OcrInvoiceApi/LoadEditInvEntry',
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (d) {
                orderItems = JSON.parse(d.Data);
                GeneratedItemsTableAll();
            },
            error: function (d) {
                alert(d.responseText);
            }
        });
    }

    /*Bind payment entry*/
    function BindPaymentEntry() {
        var formData = new FormData();
        formData.append("token", $("#invcid").val());
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/OcrInvoiceApi/LoadEditInvPayment',
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (d1) {
                payorderItems = JSON.parse(d1.Data);
                if (d1 != "[]") {
                    GeneratedItemsTable4();
                    $("#cport").prop("checked", true);
                    if ($("#cport").is(":checked")) {
                        $("#paymentdiv").show();
                    } else {
                        $("#paymentdiv").hide();
                        $("#p2,#p3,#p4,#p5,#p6,#p7,#p8,#p9,#p10,#p11").css("display", "none");
                        $('#ptype').prop('selectedIndex', 0);
                        payorderItems = [];
                        payorderItems.length = 0;
                        try {
                            document.getElementById("table4").innerHTML = "";
                        }
                        catch (er) {
                        }
                    }
                }
            },
            error: function (d) {
                alert(d.responseText);
            }
        });
    }

    /*Generate item*/
    function GeneratedItemsTableAll() {
        var temptotsum1 = 0;
        var temptotsum2 = 0;
        var temptotsum3 = 0;
        if (orderItems.length > 0) {
            var $table = $('<table id="table1" class="dataTable table table-bordered table-striped"/>');
            $table.append('<thead><tr><th>Item Name</th><th>Case Name</th><th>Billed By</th><th>Price</th><th>Quantity</th><th>Total</th><th></th><th></th></tr></thead>');
            var $tbody = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.type == "FlatFees") {
                    var $row = $('<tr/>');
                    $row.append($('<td/>').html(val.itemname));
                    $row.append($('<td/>').html(val.casename));
                    $row.append($('<td/>').html(val.billedbyname));
                    $row.append($('<td/>').html(val.price));
                    $row.append($('<td/>').html(val.QtyORHour));
                    $row.append($('<td/>').html((parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2))));
                    temptotsum1 = parseFloat(temptotsum1) + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2));
                    var $edit = $('<a title="Edit" href="#" entryid="' + val.Iid + '"  invoiceid="' + val.InvoiceId + '" casetoken="' + val.caseid + '" billtoken="' + val.billyby + '" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-pencil" style="color:#069;cursor:pointer;"></span></a>');
                    var $remove = $('<a title="Remove" href="#" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                    $remove.click(function (e) {
                        e.preventDefault();
                        orderItems.splice(i, 1);
                        var sum11 = parseFloat($("#total1").text()) - parseFloat($(this).attr("data-val"));
                        $("#total1").text(sum11);
                        GeneratedItemsTable1();
                    });
                    $edit.click(function (e) {
                        e.preventDefault();
                        var par1 = $(this).parent().parent(); //tr
                        var ItemName1 = par1.children("td:nth-child(1)");
                        var CaseName1 = par1.children("td:nth-child(2)");
                        var Billby1 = par1.children("td:nth-child(3)");
                        var Price1 = par1.children("td:nth-child(4)");
                        var Quantity1 = par1.children("td:nth-child(5)");
                        var Total1 = par1.children("td:nth-child(6)");
                        var edit1 = par1.children("td:nth-child(7)");
                        var casetoken1 = edit1.children("a").attr("casetoken");
                        var billtoken1 = edit1.children("a").attr("billtoken");
                        tempinvid1 = edit1.children("a").attr("invoiceid");
                        tempentryid1 = edit1.children("a").attr("entryid");
                        $("#itemName1").val(ItemName1.html());
                        $("#CaseName1").val(casetoken1);
                        $("#UserName1").val(billtoken1);
                        $("#price1").val(Price1.html());
                        $("#quantity1").val(Quantity1.html());
                        $("#add1").css("display", "none");
                        $("#edit1").css("display", "");
                    });
                    $row.append($('<td/>').html($edit));
                    $row.append($('<td/>').html($remove));
                    $tbody.append($row);
                    fflag = true;
                }
            });
            if (fflag == true) {
                $table.append($tbody);
                $('#orderItems1').html($table);
                $("#total1").text(temptotsum1);
                $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
                totalsum($("#subtotal").text());
            }
        }
        else {
            $('#orderItems1').html('');
        }
        if (orderItems.length > 0) {
            var $table2 = $('<table id="table2" class="dataTable table table-bordered table-striped"/>');
            $table2.append('<thead><tr><th>Item Name</th><th>Billed By</th><th>Amount</th><th>Action</th></tr></thead>');
            var $tbody2 = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.type == "TimeEntries") {
                    var $row2 = $('<tr/>');
                    $row2.append($('<td/>').html(val.itemname));
                    $row2.append($('<td/>').html(val.billedbyname));
                    $row2.append($('<td/>').html((parseFloat(val.price).toFixed(2))));
                    temptotsum2 = (parseFloat(temptotsum2) + parseFloat(val.price)).toFixed(2);
                    var $edit2 = $('<a title="Edit" href="#" entryid="' + val.Iid + '"  invoiceid="' + val.InvoiceId + '" casetoken="' + val.caseid + '" billtoken="' + val.billyby + '" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-pencil"  style="color:#069;cursor:pointer;"></span></a>');
                    var $remove2 = $('<a title="Remove" href="#" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                    $remove2.click(function (e) {
                        var result = confirm("Are you sure want to delete items ?");
                        if (result) {
                            e.preventDefault();
                            orderItems.splice(i, 1);
                            var sum21 = parseFloat($("#total2").text()) - parseFloat($(this).attr("data-val"));
                            $("#total2").text(sum21);
                            GeneratedItemsTable2();
                        }
                    });
                    $edit2.click(function (e) {
                        e.preventDefault();
                        var par2 = $(this).parent().parent(); //tr
                        var ItemName2 = par2.children("td:nth-child(1)");
                        var Billby2 = par2.children("td:nth-child(2)");
                        var Price2 = par2.children("td:nth-child(3)");
                        var Quantity2 = par2.children("td:nth-child(4)");
                        var Total2 = par2.children("td:nth-child(5)");
                        var edit2 = par2.children("td:nth-child(6)");
                        var billtoken2 = $(this).attr("billtoken");
                        tempinvid2 = $(this).attr("invoiceid");
                        tempentryid2 = $(this).attr("entryid");
                        var usernametest = Billby2.html();
                        $("#itemName2").val(ItemName2.html());
                        if (billtoken2 != "00000000-0000-0000-0000-000000000000") {
                            $('#UserName2 option[value="' + billtoken2 + '"]').prop("selected", true);
                            setTimeout(function () {
                                $("#UserName2").val(billtoken2);
                            }, 1000);
                        }
                        $("#price2").val(Price2.html());
                        $("#quantity2").val(Quantity2.html());
                        $("#add2").css("display", "none");
                        $("#edit2").css("display", "");
                    });
                    $row2.append($('<td/>').html($edit2).append("&nbsp;&nbsp;&nbsp;&nbsp;").append($remove2));
                    $tbody2.append($row2);
                    tflag = true;
                }
            });
            if (tflag == true) {
                $table2.append($tbody2);
                $('#orderItems2').html($table2);
                $("#total2").text(temptotsum2);
                $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
                totalsum($("#subtotal").text());
            }
        }
        else {
            $('#orderItems2').html('');
        }
        if (orderItems.length > 0) {
            var $table3 = $('<table id="table3" class="dataTable table table-bordered table-striped"/>');
            $table3.append('<thead><tr><th>Item Name</th><th>Matter Name</th><th>Billed By</th><th>Price</th><th>Quantity</th><th>Total</th><th></th><th></th></tr></thead>');
            var $tbody3 = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.type == "Expense") {
                    var $row3 = $('<tr/>');
                    $row3.append($('<td/>').html(val.itemname));
                    $row3.append($('<td/>').html(val.casename));
                    $row3.append($('<td/>').html(val.billedbyname));
                    $row3.append($('<td/>').html(val.price));
                    $row3.append($('<td/>').html(val.QtyORHour));
                    $row3.append($('<td/>').html((parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2))));
                    temptotsum3 = parseFloat(temptotsum3) + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2));
                    var $edit3 = $('<a title="Edit" href="#" entryid="' + val.Iid + '"  invoiceid="' + val.InvoiceId + '" casetoken="' + val.caseid + '" billtoken="' + val.billyby + '" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-pencil"  style="color:#069;cursor:pointer;"></span></a>');
                    var $remove3 = $('<a title="Remove" href="#" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                    $remove3.click(function (e) {
                        e.preventDefault();
                        orderItems.splice(i, 1);
                        var sum31 = parseFloat($("#total3").text()) - parseFloat($(this).attr("data-val"));
                        $("#total3").text(sum31);
                        GeneratedItemsTable3();
                    });
                    $edit3.click(function (e) {
                        e.preventDefault();
                        var par3 = $(this).parent().parent(); //tr
                        var ItemName3 = par3.children("td:nth-child(1)");
                        var CaseName3 = par3.children("td:nth-child(2)");
                        var Billby3 = par3.children("td:nth-child(3)");
                        var Price3 = par3.children("td:nth-child(4)");
                        var Quantity3 = par3.children("td:nth-child(5)");
                        var Total3 = par3.children("td:nth-child(6)");
                        var edit3 = par3.children("td:nth-child(7)");
                        var casetoken3 = edit3.children("a").attr("casetoken");
                        var billtoken3 = edit3.children("a").attr("billtoken");
                        tempinvid3 = edit3.children("a").attr("invoiceid");
                        tempentryid3 = edit3.children("a").attr("entryid");
                        $("#itemName3").val(ItemName3.html());
                        $("#CaseName3").val(casetoken3);
                        $("#UserName3").val(billtoken3);
                        $("#price3").val(Price3.html());
                        $("#quantity3").val(Quantity3.html());
                        $("#add3").css("display", "none");
                        $("#edit3").css("display", "");
                    });
                    $row3.append($('<td/>').html($edit3));
                    $row3.append($('<td/>').html($remove3));
                    $tbody3.append($row3);
                    eflag = true;
                }
            });
            if (eflag == true) {
                $table3.append($tbody3);
                $('#orderItems3').html($table3);
                $("#total3").text(temptotsum3);
                $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
                totalsum($("#subtotal").text());
            }
        }
        else {
            $('#orderItems3').html('');
        }
    }
    $("#pmode").on("change", function () {
        $('#pmode').siblings('span.error1').css('display', 'none');
    });
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
            $("#p2,#p,#p6,#p7,#p8,#p9,#p10,#p5").css("display", "none");
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
    $("#sstate").on("change", function () {
        totalsum($("#subtotal").text());
    });
    $("#cport").click(function () {
        if ($(this).is(":checked")) {
            $("#paymentdiv").show();
        } else {
            $("#paymentdiv").hide();
            $("#p2,#p3,#p4,#p5,#p6,#p7,#p8,#p9,#p10,#p11").css("display", "none");
            $('#ptype').prop('selectedIndex', 0);
            $('#pmode').prop('selectedIndex', 0);
            $("#paymentdiv input").each(function () {
                this.value = "";
            })
            $("#add4").attr("value", "Add Payment");
        }
    });
    $("#billeraddress").on("change", function () {
        var addr = $('option:selected', this).attr('state');
        $("#billerstate").val(addr);
        totalsum($("#subtotal").text());
    });
    try {
        bindbilleraddress();
    }
    catch (er) {
        alert(er.message);
    }
    setTimeout(function () {
        BindEntry();
        BindPaymentEntry();
    }, 3000);
    var flagsgst = false;
    var flagcgst = false;
    var flagigst = false;
    var flagcount = 0;
    $("#invdate").change(function () {
        $("#duedate").attr("min", this.value);
        flagsgst = false;
        flagcgst = false;
        flagigst = false;
        flagcount = 0;
        var invtyp = $('input[name=tax]:checked', '#taxtype').val();
        var invdate = this.value;
        $("#sgstpername").text("");
        $("#cgstpername").text("");
        $("#igstpername").text("");
        $("#sgsttemp").val("");
        $("#cgsttemp").val("");
        $("#igsttemp").val("");
        var strrmsg = '';
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/OcrInvoiceApi/LoadInvoicetaxbydate",
            headers: {
                "invdate": invdate
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        if (invtyp == "1") {
                            if (a.taxtype == "SGST") {
                                flagsgst = true;
                                $("#sgstpername").text("(" + a.tax + "%)");
                                $("#sgsttemp").val(a.tax);
                                flagcount = flagcount + 1;
                            }
                            if (a.taxtype == "CGST") {
                                flagcgst = true;
                                $("#cgstpername").text("(" + a.tax + "%)");
                                $("#cgsttemp").val(a.tax);
                                flagcount = flagcount + 1;
                            }
                            if (a.taxtype == "IGST") {
                                flagigst = true;
                                $("#igstpername").text("(" + a.tax + "%)");
                                $("#igsttemp").val(a.tax);
                                flagcount = flagcount + 1;
                            }
                        }
                        else {
                            if (a.taxtype == "SGST") {
                                flagsgst = true;
                            }
                            if (a.taxtype == "CGST") {
                                flagcgst = true;
                            }
                            if (a.taxtype == "IGST") {
                                flagigst = true;
                            }
                        }
                    });
                    if (flagcount == 3 && obj.length == 3) {
                        $("#createinv").removeAttr("disabled");
                        $("#add1").removeAttr("disabled");
                        $("#add2").removeAttr("disabled");
                        $("#add3").removeAttr("disabled");
                        $("#add4").removeAttr("disabled");
                        totalsum($("#subtotal").text());
                    }
                    else if (invtyp == "2") {
                        $("#createinv").removeAttr("disabled");
                        $("#add1").removeAttr("disabled");
                        $("#add2").removeAttr("disabled");
                        $("#add3").removeAttr("disabled");
                        $("#add4").removeAttr("disabled");
                        totalsum($("#subtotal").text());
                    }
                    else {
                        $("#createinv").attr("disabled", "disabled");
                        $("#add1").attr("disabled", "disabled");
                        $("#add2").attr("disabled", "disabled");
                        $("#add3").attr("disabled", "disabled");
                        $("#add4").attr("disabled", "disabled");
                        totalsum($("#subtotal").text());
                    }
                    if (flagsgst == false) {
                        strrmsg += 'SGST,';
                    }
                    if (flagcgst == false) {
                        strrmsg += 'CGST,';
                    }
                    if (flagigst == false) {
                        strrmsg += 'IGST,';
                    }
                    if (invtyp == "1") {
                        if (flagcount != 3) {
                            alert(strrmsg + "are not set. (Go to Invoice > action selected > invoice setting > Taxes)");
                            $("#invdate").val("");
                        }
                    }
                    else {
                    }
                }
                else {
                    alert("Please contact the Administrator!");
                }
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    });
    assignuser();
    /*Assign user*/
    function assignuser() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //   alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" tempname="' + a["UserName"] + '" >  ' + a["UserName"] + '</option>';
                    $("#UserName1").append(option);
                    $("#UserName2").append(option);
                    $("#UserName3").append(option);
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
    /*Change client*/
    $(document).on("change", "#client", function () {
        orderItems = [];
        orderItems.length = 0;
        payorderItems = [];
        payorderItems.length = 0;
        $("#subtotal").text(0);
        $("#igsttot").text(0);
        $("#cgsttot").text(0);
        $("#sgsttot").text(0);
        $("#finaltotal").text(0);
        $("#subtotaltemp").val(0);
        $("#igsttempval").val(0);
        $("#cgsttempval").val(0);
        $("#sgsttempval").val(0);
        $("#finaltotaltemp").val(0);
        $("#total1").text(0);
        $("#total2").text(0);
        $("#total3").text(0);
        try {
            document.getElementById("table1").innerHTML = "";
        }
        catch (er) {
        }
        try {
            document.getElementById("table2").innerHTML = "";
        }
        catch (er) {
        }
        try {
            document.getElementById("table3").innerHTML = "";
        }
        catch (er) {
        }
        try {
            document.getElementById("table4").innerHTML = "";
        }
        catch (er) {
        }
        $('#Case').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadstate(clientds);
            loadmatter(clientds);
        }
        else {
            $('#MatterName').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        }
    });

    /*Load state*/
    function loadstate(clientid) {
        $.ajax({
            async: true,
            url: '/api/OcrInvoiceApi/Statebyclient',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: {
                "clientid": clientid
            },
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    $('#state').empty();
                    $('#sstate').empty();
                    $('#state').append('<option value="' + response.Data.cstate + '">' + response.Data.cstate + '</option>').attr("selected", "selected");
                    $('#sstate').append('<option value="' + response.Data.cstate + '">' + response.Data.cstate + '</option>').attr("selected", "selected");
                    bindstate();
                    totalsum($("#subtotal").text());
                }
                else {
                    //alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    function loadmatter(clientid) {
        $('#MatterName').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
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
                    //alert("not found");
                }
                $.each(JSON.parse(response.Data), function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '"  tempname="' + mattername + '"> ' + mattername + '</option>';
                        $("#MatterName").append(option);
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
            if ($("#pdate").val().trim() == "") {
                isValidItem = false;
                $("#pdate").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pdate").siblings("span.error1").css("display", "none");
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
            if ($("#pdate").val().trim() == "") {
                isValidItem = false;
                $("#pdate").siblings('span.error1').css("display", "block");
                return false;
            }
            else {
                $("#pdate").siblings("span.error1").css("display", "none");
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
                OtherDetails: $('#pdetails').val().trim(),
                Cleared: null,
                Firmid: "",
                Id: "",
                InvoiceId: "",
                date_time: "",
                iupdate: null,
                iupload: null,
                userid: ""
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
            var $table4 = $('<table id="table4" class="dataTable table table-bordered table-striped"/>');
            $table4.append('<thead><tr><th>Payment Type</th><th>Payment Mode</th><th>Amount</th><th>Payment Date</th><th>Bank Name</th><th>DD No</th><th>DD Issue Date</th><th>Cheque No</th><th>Cheque Issue Date</th><th>Ref No</th><th>Other Details</th><th></th></tr></thead>');
            var $tbody4 = $('<tbody/>');
            $.each(payorderItems, function (i, val) {
                var $row4 = $('<tr/>');
                $row4.append($('<td/>').html(val.PaymentType));
                $row4.append($('<td/>').html(val.PaymentMode));
                $row4.append($('<td/>').html(val.Amount));
                $row4.append($('<td/>').html(formatDatetoIST(String(val.PDate).substring(0, 10))));
                $row4.append($('<td/>').html(val.BankName));
                $row4.append($('<td/>').html(val.DdNo));
                $row4.append($('<td/>').html((String(val.Ddidate).substring(0, 10)) != "" ? formatDatetoIST(String(val.Ddidate).substring(0, 10)) : ""));
                $row4.append($('<td/>').html(val.ChequeNo));
                $row4.append($('<td/>').html((String(val.Chqidate).substring(0, 10)) != "" ? formatDatetoIST(String(val.Chqidate).substring(0, 10)) : ""));
                $row4.append($('<td/>').html(val.RefNo));
                $row4.append($('<td/>').html(val.OtherDetails));
                var $remove4 = $('<a href="#" ><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                $remove4.click(function (e) {
                    var result = confirm("Are you sure want to delete items ?");
                    if (result) {
                        e.preventDefault();
                        payorderItems.splice(i, 1);
                        GeneratedItemsTable4();
                    }
                });
                $row4.append($('<td/>').html($remove4));
                $tbody4.append($row4);
            });
            $table4.append($tbody4);
            $('#orderItems4').html($table4);
        }
        else {
            $('#orderItems4').html('');
        }
    }
    //Add button click function
    $('#add1').click(function () {
        //Check validation of order item
        var isValidItem = true;
        if ($('#itemName1').val().trim() == '') {
            isValidItem = false;
            $('#itemName1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#itemName1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#CaseName1').val() != '')) {
            isValidItem = false;
            $('#CaseName1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#CaseName1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#UserName1').val().trim() != '')) {
            isValidItem = false;
            $('#UserName1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#UserName1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#quantity1').val().trim() != '' && !isNaN($('#quantity1').val().trim()))) {
            isValidItem = false;
            $('#quantity1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#quantity1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#price1').val().trim() != '' && !isNaN($('#price1').val().trim()))) {
            isValidItem = false;
            $('#price1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#price1').siblings('span.error').css('visibility', 'hidden');
        }
        //Add item to list if valid
        if (isValidItem) {
            orderItems.push({
                Iid: "",
                InvoiceNo: "",
                InvoiceId: tempinvid1,
                Firmid: "",
                userid: "",
                QtyORHour: parseFloat($('#quantity1').val().trim()),
                billedbyname: $('#UserName1').find('option:selected').attr('tempname'),
                billyby: $('#UserName1').val().trim(),
                caseid: $('#CaseName1').val().trim(),
                casename: $('#CaseName1').find('option:selected').attr('tempname'),
                date_time: "",
                itemname: $('#itemName1').val().trim(),
                iupdate: "",
                iupload: "",
                price: parseFloat($('#price1').val().trim()),
                type: "FlatFees",
                CaseName: $('#CaseName1').val().trim(),
                UserName: $('#UserName1').val().trim(),
                Price: parseFloat($('#price1').val().trim()),
                TotalAmount: (parseFloat($('#quantity1').val().trim()) * parseFloat($('#price1').val().trim()).toFixed(2)),
                tempCaseName: $('#CaseName1').find('option:selected').attr('tempname'),
                tempUserName: $('#UserName1').find('option:selected').attr('tempname')
            });
            //Clear fields
            $('#itemName1').val('').focus();
            $('#quantity1,#price1').val('');
            $('#UserName1 option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#CaseName1 option').prop('selected', function () {
                return this.defaultSelected;
            });
        }
        //populate order items
        GeneratedItemsTable1();
    });

    //function to show added item 
    function GeneratedItemsTable1() {
        $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
        totalsum($("#subtotal").text());
        var temptotsum1 = 0;
        if (orderItems.length > 0) {
            var $table1 = $('<table id="table1" class="dataTable table table-bordered table-striped"/>');
            $table1.append('<thead><tr><th>Item Name</th><th>Case Name</th><th>Billed By</th><th>Price</th><th>Quantity</th><th>Total</th><th></th><th></th></tr></thead>');
            var $tbody1 = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.type == "FlatFees") {
                    var $row = $('<tr/>');
                    $row.append($('<td/>').html(val.itemname));
                    $row.append($('<td/>').html(val.casename));
                    $row.append($('<td/>').html(val.billedbyname));
                    $row.append($('<td/>').html(val.price));
                    $row.append($('<td/>').html(val.QtyORHour));
                    $row.append($('<td/>').html((parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2))));
                    temptotsum1 = parseFloat(temptotsum1) + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2));
                    var $edit1 = $('<a title="Edit" href="#" entryid="' + val.Iid + '" invoiceid="' + val.InvoiceId + '" casetoken="' + val.caseid + '" billtoken="' + val.billyby + '" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-pencil"  style="color:#069;cursor:pointer;"></span></a>');
                    var $remove1 = $('<a href="#" data-val="' + val.TotalAmount + '"><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                    $remove1.click(function (e) {
                        e.preventDefault();
                        orderItems.splice(i, 1);
                        var sum11 = parseFloat($("#total1").text()) - parseFloat($(this).attr("data-val"));
                        $("#total1").text(sum11);
                        GeneratedItemsTable1();
                    });
                    $edit1.click(function (e) {
                        e.preventDefault();
                        var par1 = $(this).parent().parent(); //tr
                        var ItemName1 = par1.children("td:nth-child(1)");
                        var CaseName1 = par1.children("td:nth-child(2)");
                        var Billby1 = par1.children("td:nth-child(3)");
                        var Price1 = par1.children("td:nth-child(4)");
                        var Quantity1 = par1.children("td:nth-child(5)");
                        var Total1 = par1.children("td:nth-child(6)");
                        var edit1 = par1.children("td:nth-child(7)");
                        var casetoken1 = edit1.children("a").attr("casetoken");
                        var billtoken1 = edit1.children("a").attr("billtoken");
                        tempinvid1 = edit1.children("a").attr("invoiceid");
                        tempentryid1 = edit1.children("a").attr("entryid");
                        $("#itemName1").val(ItemName1.html());
                        $("#CaseName1").val(casetoken1);
                        $("#UserName1").val(billtoken1);
                        $("#price1").val(Price1.html());
                        $("#quantity1").val(Quantity1.html());
                        $("#add1").css("display", "none");
                        $("#edit1").css("display", "");
                    });
                    $row.append($('<td/>').html($edit1));
                    $row.append($('<td/>').html($remove1));
                    $tbody1.append($row);
                    fflag = true;
                }
            });
            if (fflag == true) {
                $table1.append($tbody1);
                $("#orderItems1").html($table1);
                $("#total1").text(temptotsum1);
                $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
                totalsum($("#subtotal").text());
            }
        }
        else {
            $('#orderItems1').html('');
        }
    }
    $('#add2').click(function () {
        var isValidItem = true;
        if ($('#itemName2').val().trim() == '') {
            isValidItem = false;
            $('#itemName2').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#itemName2').siblings('span.error').css('visibility', 'hidden');
        }
        var NewUserName2 = "00000000-0000-0000-0000-000000000000";
        if (($('#UserName2').val().trim() != '')) {
            NewUserName2 = $('#UserName2').val();
        }
        else {
        }
        if (!($('#price2').val().trim() != '' && !isNaN($('#price2').val().trim()))) {
            isValidItem = false;
            $('#price2').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#price2').siblings('span.error').css('visibility', 'hidden');
        }
        //Add item to list if valid
        if (isValidItem) {
            orderItems.push({
                Iid: "",
                InvoiceNo: "",
                InvoiceId: tempinvid2,
                Firmid: "",
                userid: "",
                billedbyname: $('#UserName2').find('option:selected').attr('tempname'),
                billyby: NewUserName2.trim(),
                date_time: "",
                itemname: $('#itemName2').val().trim(),
                iupdate: "",
                iupload: "",
                price: parseFloat($('#price2').val().trim()),
                type: "TimeEntries",
                UserName: NewUserName2.trim(),
                Price: parseFloat($('#price2').val().trim()),
                TotalAmount: parseFloat($('#price2').val().trim()).toFixed(2),
                tempUserName: $('#UserName2').find('option:selected').attr('tempname')
            });
            $('#itemName2').val('').focus();
            $('#price2').val('');
            $('#UserName2 option').prop('selected', function () {
                return this.defaultSelected;
            });
        }
        //populate order items
        GeneratedItemsTable2();
    });

    //function to show added item 
    function GeneratedItemsTable2() {
        $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
        totalsum($("#subtotal").text());
        var temptotsum2 = 0;
        if (orderItems.length > 0) {
            var $table2 = $('<table id="table2" class="dataTable table table-bordered table-striped"/>');
            $table2.append('<thead><tr><th>Particular</th><th>Billed By</th><th>Amount</th><th>Action</th></tr></thead>');
            var $tbody2 = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.type == "TimeEntries") {
                    var $row2 = $('<tr/>');
                    $row2.append($('<td/>').html(val.itemname));
                    $row2.append($('<td/>').html(val.billedbyname));
                    $row2.append($('<td/>').html(val.price));
                    var $edit2 = $('<a title="Edit" href="#" entryid="' + val.Iid + '" invoiceid="' + val.InvoiceId + '" casetoken="' + val.caseid + '" billtoken="' + val.billyby + '" data-val="' + parseFloat(val.price).toFixed(2) + '"><span class="glyphicon glyphicon-pencil"  style="color:#069;cursor:pointer;"></span></a>');
                    temptotsum2 = (parseFloat(val.price) + parseFloat(temptotsum2)).toFixed(2);
                    var $remove2 = $('<a title="Remove" href="#" data-val="' + parseFloat(val.price).toFixed(2) + '"><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                    $remove2.click(function (e) {
                        var result = confirm("Are you sure want to delete items ?");
                        if (result) {
                            e.preventDefault();
                            orderItems.splice(i, 1);
                            var sum21 = parseFloat($("#total2").text()) - parseFloat($(this).attr("data-val"));
                            $("#total2").text(sum21);
                            GeneratedItemsTable2();
                        }
                    });
                    $edit2.click(function (e) {
                        e.preventDefault();
                        var par2 = $(this).parent().parent(); //tr
                        var ItemName2 = par2.children("td:nth-child(1)");
                        var Billby2 = par2.children("td:nth-child(2)");
                        var Price2 = par2.children("td:nth-child(3)");
                        var Total2 = par2.children("td:nth-child(4)");
                        var edit2 = par2.children("td:nth-child(5)");
                        var billtoken2 = $(this).attr("billtoken");
                        tempinvid2 = $(this).attr("invoiceid");
                        tempentryid2 = $(this).attr("entryid");
                        $("#itemName2").val(ItemName2.html());
                        $("#UserName2").val(billtoken2);
                        $("#price2").val(Price2.html());
                        $("#add2").css("display", "none");
                        $("#edit2").css("display", "");
                    });
                    $row2.append($('<td/>').html($edit2).append("&nbsp;&nbsp;&nbsp;&nbsp;").append($remove2));
                    $tbody2.append($row2);
                    tflag = true;
                }
            });
            if (tflag == true) {
                $table2.append($tbody2);
                $('#orderItems2').html($table2);
                $("#total2").text(temptotsum2);
                $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
                totalsum($("#subtotal").text());
            }
        }
        else {
            $('#orderItems2').html('');
        }
    }
    $('#add3').click(function () {
        //Check validation of order item
        var isValidItem = true;
        if ($('#itemName3').val().trim() == '') {
            isValidItem = false;
            $('#itemName3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#itemName3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#CaseName3').val() != '')) {
            isValidItem = false;
            $('#CaseName3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#CaseName3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#UserName3').val().trim() != '')) {
            isValidItem = false;
            $('#UserName3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#UserName3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#quantity3').val().trim() != '' && !isNaN($('#quantity3').val().trim()))) {
            isValidItem = false;
            $('#quantity3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#quantity3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#price3').val().trim() != '' && !isNaN($('#price3').val().trim()))) {
            isValidItem = false;
            $('#price3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#price3').siblings('span.error').css('visibility', 'hidden');
        }
        //Add item to list if valid
        //Add item to list if valid
        if (isValidItem) {
            orderItems.push({
                Iid: "",
                InvoiceNo: "",
                InvoiceId: tempinvid3,
                Firmid: "",
                userid: "",
                QtyORHour: parseFloat($('#quantity3').val().trim()),
                billedbyname: $('#UserName3').find('option:selected').attr('tempname'),
                billyby: $('#UserName3').val().trim(),
                caseid: $('#CaseName3').val().trim(),
                casename: $('#CaseName3').find('option:selected').attr('tempname'),
                date_time: "",
                itemname: $('#itemName3').val().trim(),
                iupdate: "",
                iupload: "",
                price: parseFloat($('#price3').val().trim()),
                type: "Expense",
                CaseName: $('#CaseName3').val().trim(),
                UserName: $('#UserName3').val().trim(),
                Price: parseFloat($('#price3').val().trim()),
                TotalAmount: (parseFloat($('#quantity3').val().trim()) * parseFloat($('#price3').val().trim()).toFixed(2)),
                tempCaseName: $('#CaseName3').find('option:selected').attr('tempname'),
                tempUserName: $('#UserName3').find('option:selected').attr('tempname')
            });
            //Clear fields
            $('#itemName3').val('').focus();
            $('#quantity3,#price3').val('');
            $('#UserName3 option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#CaseName3 option').prop('selected', function () {
                return this.defaultSelected;
            });
        }
        //populate order items
        GeneratedItemsTable3();
    });
    //function to show added item 
    function GeneratedItemsTable3() {
        $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
        totalsum($("#subtotal").text());
        var temptotsum3 = 0;
        if (orderItems.length > 0) {
            var $table3 = $('<table id="table3" class="dataTable table table-bordered table-striped"/>');
            $table3.append('<thead><tr><th>Item Name</th><th>Case Name</th><th>Billed By</th><th>Price</th><th>Quantity</th><th>Total</th><th></th><th></th></tr></thead>');
            var $tbody3 = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.type == "Expense") {
                    var $row3 = $('<tr/>');
                    $row3.append($('<td/>').html(val.itemname));
                    $row3.append($('<td/>').html(val.casename));
                    $row3.append($('<td/>').html(val.billedbyname));
                    $row3.append($('<td/>').html(val.price));
                    $row3.append($('<td/>').html(val.QtyORHour));
                    $row3.append($('<td/>').html((parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2))));
                    temptotsum3 = parseFloat(temptotsum3) + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2));
                    var $edit3 = $('<a title="Edit" href="#" entryid="' + val.Iid + '" invoiceid="' + val.InvoiceId + '" casetoken="' + val.caseid + '" billtoken="' + val.billyby + '" data-val="' + (parseFloat(val.QtyORHour) * parseFloat(val.price).toFixed(2)) + '"><span class="glyphicon glyphicon-pencil"  style="color:#069;cursor:pointer;"></span></a>');
                    var $remove3 = $('<a href="#" data-val="' + val.TotalAmount + '"><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                    $remove3.click(function (e) {
                        e.preventDefault();
                        orderItems.splice(i, 1);
                        var sum31 = parseFloat($("#total3").text()) - parseFloat($(this).attr("data-val"));
                        $("#total3").text(sum31);
                        GeneratedItemsTable3();
                    });
                    $edit3.click(function (e) {
                        e.preventDefault();
                        var par3 = $(this).parent().parent(); //tr
                        var ItemName3 = par3.children("td:nth-child(1)");
                        var CaseName3 = par3.children("td:nth-child(2)");
                        var Billby3 = par3.children("td:nth-child(3)");
                        var Price3 = par3.children("td:nth-child(4)");
                        var Quantity3 = par3.children("td:nth-child(5)");
                        var Total3 = par3.children("td:nth-child(6)");
                        var edit3 = par3.children("td:nth-child(7)");
                        var casetoken3 = edit3.children("a").attr("casetoken");
                        var billtoken3 = edit3.children("a").attr("billtoken");
                        tempinvid3 = edit3.children("a").attr("invoiceid");
                        tempentryid3 = edit3.children("a").attr("entryid");
                        $("#itemName3").val(ItemName3.html());
                        $("#CaseName3").val(casetoken3);
                        $("#UserName3").val(billtoken3);
                        $("#price3").val(Price3.html());
                        $("#quantity3").val(Quantity3.html());
                        $("#add3").css("display", "none");
                        $("#edit3").css("display", "");
                    });
                    $row3.append($('<td/>').html($edit3));
                    $row3.append($('<td/>').html($remove3));
                    $tbody3.append($row3);
                    eflag = true;
                }
            });
            $('#orderItems3').html($table3);
            $("#total3").text(temptotsum3);
            $("#subtotal").text(parseFloat($("#total1").text()) + parseFloat($("#total2").text()) + parseFloat($("#total3").text()));
            totalsum($("#subtotal").text());
            if (eflag == true) {
                $table3.append($tbody3);
            }
        }
        else {
            $('#orderItems3').html('');
        }
    }
    var a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
    var b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    function inWords(num) {
        num = Math.round(num);
        if ((num = num.toString()).length > 9) return 'overflow';
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'CRORE ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'LAKH ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'THOUSAND ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'HUNDRED ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'AND ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'ONLY ' : '';
        return str;
    }
    var tload = false;
    function totalsum(sum1) {
        try {
            var tstate = $("#sstate").val();
            var bstate = $("#billerstate").val();
            if (tload == true) {
                if (tstate == "") {
                    alert("Please select the state for shipping client invoice.");
                    return false;
                }
                if (bstate == "") {
                    alert("Please select the biller state.");
                    return false;
                }
            }
            tload = true;
            var sgst = $("#sgsttemp").val();
            var cgst = $("#cgsttemp").val();
            var igst = $("#igsttemp").val();
            if (tstate == bstate) {
                var sgst1 = ((parseFloat(sum1) * parseFloat(sgst)) / 100).toFixed(2);
                $("#sgsttot").text(sgst1);
                $("#sgsttempval").val(sgst1)
                var cgst1 = ((parseFloat(sum1) * parseFloat(cgst)) / 100).toFixed(2);
                $("#cgsttot").text(cgst1);
                $("#cgsttempval").val(cgst1)
                var ftotal = parseFloat(sum1) + parseFloat(sgst1) + parseFloat(cgst1);
                $('#finaltotal').text(Math.round(ftotal));
                if (sgst == "") {
                    $('#totinwords').text(inWords(Math.round(sum1)));
                }
                else {
                    $('#totinwords').text(inWords(Math.round(ftotal)));
                }
                $("#igsttot").text(0);
                $("#igsttempval").val(0);
                $("#subtotaltemp").val(sum1);
                $("#finaltotaltemp").val(Math.round(ftotal));
            }
            else {
                var igst1 = ((parseFloat(sum1) * parseFloat(igst)) / 100).toFixed(2);
                $("#igsttot").text(igst1);
                $("#igsttempval").val(igst1)
                var ftotal = parseFloat(sum1) + parseFloat(igst1);
                $('#finaltotal').text(Math.round(ftotal));
                if (sgst == "") {
                    $('#totinwords').text(inWords(Math.round(sum1)));
                }
                else {
                    $('#totinwords').text(inWords(Math.round(ftotal)));
                }
                $("#subtotaltemp").val(sum1);
                $("#finaltotaltemp").val(Math.round(ftotal));
                $("#sgsttot").text(0);
                $("#cgsttot").text(0);
                $("#sgsttempval").val(0);
                $("#cgsttempval").val(0);
            }
            return sum1;
        }
        catch (ex) {
            alert(ex.message);
        }
    }
    $('#edit2').click(function () {
        var tempsum2 = 0;
        //Check validation of order item
        var isValidItem = true;
        if ($('#itemName2').val().trim() == '') {
            isValidItem = false;
            $('#itemName2').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#itemName2').siblings('span.error').css('visibility', 'hidden');
        }
        var NewUserName2 = "00000000-0000-0000-0000-000000000000";
        if (($('#UserName2').val().trim() != '')) {
            NewUserName2 = $('#UserName2').val();
        }
        else {
        }
        if (!($('#price2').val().trim() != '' && !isNaN($('#price2').val().trim()))) {
            isValidItem = false;
            $('#price2').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#price2').siblings('span.error').css('visibility', 'hidden');
        }
        if (isValidItem) {
            $("#edit2").css("display", "none");
            $("#add2").css("display", "");
            objIndex = orderItems.findIndex((obj => obj.Iid == tempentryid2));
            orderItems[objIndex].itemname = $('#itemName2').val().trim();
            orderItems[objIndex].billedbyname = $('#UserName2').find('option:selected').attr('tempname');
            orderItems[objIndex].billyby = NewUserName2.trim();
            orderItems[objIndex].itemname = $('#itemName2').val().trim();
            orderItems[objIndex].price = parseFloat($('#price2').val().trim());
            orderItems[objIndex].UserName = NewUserName2.trim();
            orderItems[objIndex].Price = parseFloat($('#price2').val().trim());
            orderItems[objIndex].TotalAmount = (parseFloat($('#price2').val().trim()).toFixed(2));
            orderItems[objIndex].tempUserName = $('#UserName2').find('option:selected').attr('tempname');
            //Clear fields
            $('#itemName2').val('').focus();
            $('#price2').val('');
            $('#UserName2 option').prop('selected', function () {
                return this.defaultSelected;
            });
        }
        GeneratedItemsTable2();
    });
    $('#edit1').click(function () {
        var tempsum1 = 0;
        //Check validation of order item
        var isValidItem = true;
        // alert($('#itemName2').val().trim());
        if ($('#itemName1').val().trim() == '') {
            isValidItem = false;
            $('#itemName1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#itemName1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#CaseName1').val() != '')) {
            isValidItem = false;
            $('#CaseName1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#CaseName1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#UserName1').val().trim() != '')) {
            isValidItem = false;
            $('#UserName1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#UserName1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#quantity1').val().trim() != '' && !isNaN($('#quantity1').val().trim()))) {
            isValidItem = false;
            $('#quantity1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#quantity1').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#price1').val().trim() != '' && !isNaN($('#price1').val().trim()))) {
            isValidItem = false;
            $('#price1').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#price1').siblings('span.error').css('visibility', 'hidden');
        }
        if (isValidItem) {
            $("#edit1").css("display", "none");
            $("#add1").css("display", "");
            objIndex = orderItems.findIndex((obj => obj.Iid == tempentryid1));
            orderItems[objIndex].itemname = $('#itemName1').val().trim();
            orderItems[objIndex].QtyORHour = parseFloat($('#quantity1').val().trim());
            orderItems[objIndex].billedbyname = $('#UserName1').find('option:selected').attr('tempname');
            orderItems[objIndex].billyby = $('#UserName1').val().trim();
            orderItems[objIndex].caseid = $('#CaseName1').val().trim();
            orderItems[objIndex].casename = $('#CaseName1').find('option:selected').attr('tempname');
            orderItems[objIndex].itemname = $('#itemName1').val().trim();
            orderItems[objIndex].price = parseFloat($('#price1').val().trim());
            orderItems[objIndex].CaseName = $('#CaseName1').val().trim();
            orderItems[objIndex].UserName = $('#UserName1').val().trim();
            orderItems[objIndex].Quantity = parseFloat($('#quantity1').val().trim());
            orderItems[objIndex].Price = parseFloat($('#price1').val().trim());
            orderItems[objIndex].TotalAmount = (parseFloat($('#quantity1').val().trim()) * parseFloat($('#price1').val().trim()).toFixed(2));
            orderItems[objIndex].tempCaseName = $('#CaseName1').find('option:selected').attr('tempname');
            orderItems[objIndex].tempUserName = $('#UserName1').find('option:selected').attr('tempname');
            //Clear fields
            $('#itemName1').val('').focus();
            $('#quantity1,#price1').val('');
            $('#UserName1 option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#CaseName1 option').prop('selected', function () {
                return this.defaultSelected;
            });
        }
        GeneratedItemsTable1();
    });
    $('#edit3').click(function () {
        var tempsum3 = 0;
        //Check validation of order item
        var isValidItem = true;
        if ($('#itemName3').val().trim() == '') {
            isValidItem = false;
            $('#itemName3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#itemName3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#CaseName3').val() != '')) {
            isValidItem = false;
            $('#CaseName3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#CaseName3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#UserName3').val().trim() != '')) {
            isValidItem = false;
            $('#UserName3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#UserName3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#quantity3').val().trim() != '' && !isNaN($('#quantity3').val().trim()))) {
            isValidItem = false;
            $('#quantity3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#quantity3').siblings('span.error').css('visibility', 'hidden');
        }
        if (!($('#price3').val().trim() != '' && !isNaN($('#price3').val().trim()))) {
            isValidItem = false;
            $('#price3').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#price3').siblings('span.error').css('visibility', 'hidden');
        }
        if (isValidItem) {
            $("#edit3").css("display", "none");
            $("#add3").css("display", "");
            objIndex = orderItems.findIndex((obj => obj.Iid == tempentryid3));
            orderItems[objIndex].itemname = $('#itemName3').val().trim();
            orderItems[objIndex].QtyORHour = parseFloat($('#quantity3').val().trim());
            orderItems[objIndex].billedbyname = $('#UserName3').find('option:selected').attr('tempname');
            orderItems[objIndex].billyby = $('#UserName3').val().trim();
            orderItems[objIndex].caseid = $('#CaseName3').val().trim();
            orderItems[objIndex].casename = $('#CaseName3').find('option:selected').attr('tempname');
            orderItems[objIndex].itemname = $('#itemName3').val().trim();
            orderItems[objIndex].price = parseFloat($('#price3').val().trim());
            orderItems[objIndex].CaseName = $('#CaseName3').val().trim();
            orderItems[objIndex].UserName = $('#UserName3').val().trim();
            orderItems[objIndex].Quantity = parseFloat($('#quantity3').val().trim());
            orderItems[objIndex].Price = parseFloat($('#price3').val().trim());
            orderItems[objIndex].TotalAmount = (parseFloat($('#quantity3').val().trim()) * parseFloat($('#price3').val().trim()).toFixed(2));
            orderItems[objIndex].tempCaseName = $('#CaseName3').find('option:selected').attr('tempname');
            orderItems[objIndex].tempUserName = $('#UserName3').find('option:selected').attr('tempname');
            //Clear fields
            $('#itemName3').val('').focus();
            $('#quantity3,#price3').val('');
            $('#UserName3 option').prop('selected', function () {
                return this.defaultSelected;
            });
            $('#CaseName3 option').prop('selected', function () {
                return this.defaultSelected;
            });
        }
        GeneratedItemsTable3();
    });

    /*Create invoice*/
    $("#createinv").click(function () {
        var invclient = $("#client").val();
        var invstate = $("#state").val();
        var invsstate = $("#sstate").val();
        var invinvoicedate = $("#invdate").val();
        var invduedate = $("#duedate").val();
        var invmob = $("#mobile").val();
        var invaddress = $("#address").val();
        var invsaddress = $("#saddress").val();
        var invigstper = $("#igsttemp").val();
        var invcgstper = $("#cgsttemp").val();
        var invsgstper = $("#sgsttemp").val();
        var invigsttempval = $("#igsttempval").val();
        var invcgsttempval = $("#cgsttempval").val();
        var invsgsttempval = $("#sgsttempval").val();
        var invsubtotaltemp = $("#subtotaltemp").val();
        var finaltotaltemp = $("#finaltotaltemp").val();
        var addressid = $("#billeraddress option:selected").attr("tokenid");
        var invotype = $('input[name=tax]:checked', '#taxtype').val();
        var billeradress = $('#billeraddress').val();
        var billerstate = $('#billerstate').val();
        var UserNameFreeText = $('#UserNameFreeText').val();
        var EmailText = $('#EmailText').val();
        var MatterName = $('#MatterName').val();
        //get paymentvalue
        var amount = 0;
        var cumlativeammount = 0;
        var i;
        for (i = 0; i < payorderItems.length; i++) {
            amount += payorderItems[i].Amount;
        }
        if (amount > parseInt(finaltotaltemp)) {
            alert("You cannot pay more than the invoice amount.");
            return false;
        }
        if (invclient == "") {
            alert("Please select client");
            return false;
        }
        if (UserNameFreeText == "") {
            alert("Please enter the name.");
            return false;
        }
        if (MatterName == "") {
            alert("Please select Matter");
            return false;
        }
        if (invinvoicedate == "") {
            alert("Please select Invoicedate");
            return false;
        }
        if (invaddress == "") {
            alert("please fill client bill Address");
            return false;
        }
        if (invstate == "") {
            alert("Please select client bill state");
            return false;
        }
        if (invduedate == "") {
            alert("Please select duedate");
            return false;
        }
        if (invsaddress == "") {
            alert("please fill client ship Address");
            return false;
        }
        if (invsstate == "") {
            alert("Please select the state for shipping client invoice.");
            return false;
        }
        if (invmob == "") {
            alert("Please enter mobile no");
            return false;
        }
        if (invmob.length < 10) {
            alert("Mobile no should be 10 digit");
            return false;
        }
        if (billeradress == "") {
            alert("Please set the biller address (Go to: Invoice > Action selected > Invoice settings).");
            return false;
        }
        if (billerstate == "") {
            alert("Please select the biller state.");
            return false;
        }
        if (EmailText == "") {
            alert("Please enter email");
            return false;
        }
        if (EmailText != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(EmailText) == false) {
                alert('Invalid email ID');
                document.getElementById("EmailText").focus();
                return false;
            }
        }
        if (orderItems.length == 0) {
            alert("Please add at least one item.");
            return false;
        }
        var date1 = new Date(invinvoicedate);
        var date2 = new Date(invduedate);
        if (date1 > date2) {
            alert("Due date should be after invoice date.");
            return false;
        }
        var formData = new FormData();
        formData.append("invclient", invclient);
        formData.append("invstate", invstate);
        formData.append("invsstate", invsstate);
        formData.append("invinvoicedate", invinvoicedate);
        formData.append("invduedate", invduedate);
        formData.append("invmob", invmob);
        formData.append("invaddress", invaddress);
        formData.append("invsaddress", invsaddress);
        formData.append("invigstper", invigstper);
        formData.append("invcgstper", invcgstper);
        formData.append("invsgstper", invsgstper);
        formData.append("invigsttempval", invigsttempval);
        formData.append("invcgsttempval", invcgsttempval);
        formData.append("invsgsttempval", invsgsttempval);
        formData.append("invsubtotaltemp", invsubtotaltemp);
        formData.append("finaltotaltemp", finaltotaltemp);
        formData.append("invoicetype", invotype);
        formData.append("itemlistdata", JSON.stringify(orderItems));
        formData.append("itempaymentdata", JSON.stringify(payorderItems));
        formData.append("token", $("#invcid").val());
        formData.append("addressid", addressid);
        formData.append("UserNameFreeText", UserNameFreeText);
        formData.append("EmailText", EmailText);
        formData.append("MatterId", MatterName);
        $.ajax({
            url: '/api/OcrInvoiceApi/PostUpdateInvoice',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "Invoice Series not found") {
                        alert("Please set the invoice series (Go to: Invoice > Action selected > Invoice settings > Invoice series).")
                    }
                    else {
                        new PNotify({
                            title: 'Success!',
                            text: ' Invoice Updated successfully',
                            type: 'success',
                            delay: 3000
                        });
                        var fcode5 = localStorage.getItem("FirmCode");
                        window.location = encodeURI("/" + fcode5 + "/Bill/ViewInvoice");
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