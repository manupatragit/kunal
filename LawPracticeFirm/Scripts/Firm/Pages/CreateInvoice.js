function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
/*Bind state*/
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
var morepageno = 1;
var clietidsss = "";
$(document).ready(function () {
    loadmatter1(morepageno);
    var orderItems = [];
    var payorderItems = [];
    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;
    var subtotal = 0;
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
    $("#pmode").on("change", function () {
        $('#pmode').siblings('span.error1').css('display', 'none');
    });
    /*Change ptype*/
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
    $("#copyaddress").on("click", function () {
        if (this.checked) {
            var adddata = CKEDITOR.instances.address.getData();
            CKEDITOR.instances['saddress'].setData(adddata);
        }
        else {
            CKEDITOR.instances['saddress'].setData('');
        }
    });
    /*Bind biller address*/
    $("#billeraddress").on("change", function () {
        var addr = $('option:selected', this).attr('state');
        $("#billerstate").val(addr);
        totalsum($("#subtotal").text());
    });
    try {
        bindstate();
        bindbilleraddress();
    }
    catch (er) {
        alert(er.message);
    }
    var flagsgst = false;
    var flagcgst = false;
    var flagigst = false;
    var flagcount = 0;
    $("#createinv").attr("disabled", "disabled");
    $("#add1").attr("disabled", "disabled");
    $("#add3").attr("disabled", "disabled");
    $("#add4").attr("disabled", "disabled");
    $("#invdate").change(function () {
        $("#duedate").attr("min", this.value);
        var invtyp = $('input[name=tax]:checked', '#taxtype').val();
        flagsgst = false;
        flagcgst = false;
        flagigst = false;
        flagcount = 0;
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
                        $("#add3").attr("disabled", "disabled");
                        $("#add4").attr("disabled", "disabled");
                        totalsum($("#subtotal").text());
                        orderItems = [];
                        orderItems.length = 0;
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
                    }
                    if (flagsgst == false) {
                        strrmsg += 'SGST,';
                    }
                    if (flagcgst == false) {
                        strrmsg += ' CGST, ';
                    }
                    if (flagigst == false) {
                        strrmsg += ' IGST,';
                    }
                    if (invtyp == "1") {
                        if (flagcount != 3) {
                            alert(strrmsg + " are not set. (Go to Invoice > action selected > invoice setting > Taxes)");
                            $("#invdate").val("");
                        }
                    }
                    else {
                    }
                }
                else {
                    alert("Please contact the Administrator!");
                    $("#invdate").val("");
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
    /*Get assign user*/
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
                    //alert("not found");
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
    /*Bind details change on client change*/
    $(document).on("change", "#client", function () {
        orderItems = [];
        orderItems.length = 0;
        $("#subtotal").text("0");
        $("#igsttot").text("0");
        $("#cgsttot").text("0");
        $("#sgsttot").text("0");
        $("#finaltotal").text("0");
        $("#subtotaltemp").val("0");
        $("#igsttempval").val("0");
        $("#cgsttempval").val("0");
        $("#sgsttempval").val("0");
        $("#finaltotaltemp").val("0");
        $("#total1").text("0");
        $("#total2").text("0");
        $("#total3").text("0");
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
        $('#Case').empty();
        $('#casemoreoptiondivexp').hide();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter("1", clientds);
            loadstate(clientds);
            loadClientAddress(clientds);
            clietidsss = clientds;
        }
        else {
            clietidsss = "";
            $('#MatterName').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        }
    });

    /*Load state bu client id*/
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
                    if (response.Data == "null") {
                        $('#state').empty();
                        $('#sstate').empty();
                    }
                    else if (response.Data == null || response.Data == "") {
                        $('#state').empty();
                        $('#sstate').empty();
                    }
                    else {
                        var newstate = "";
                        if (response.Data.cstate == "null" || response.Data.cstate == null) {
                            newstate = "";
                        }
                        else {
                            newstate = response.Data.cstate;
                        }
                        $('#state').empty();
                        $('#sstate').empty();
                        if (newstate != "") {
                            $('#state').append('<option value="' + response.Data.cstate + '">' + response.Data.cstate + '</option>').prop("selected", "selected");
                            $('#sstate').append('<option value="' + response.Data.cstate + '">' + response.Data.cstate + '</option>').prop("selected", "selected");
                        }
                        $('#mobile').empty();
                        $('#mobile').val(response.Data.cmobile);
                        $('#address').empty();
                        $('#address').val(response.Data.caddress);
                        $('#EmailText').empty();
                        $('#EmailText').val(response.Data.email);
                    }
                    bindstate();
                    totalsum($("#subtotal").text());
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    $("#casemoreoption").click(function () {
        morepageno = morepageno + 1;
        loadmatter(morepageno, clietidsss);
    });

    //load matter
    function loadmatter1() {
        $("#MatterName").html('');
        $('#MatterName').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        var formData = new FormData();
        formData.append("Pageno", morepageno);
        openload();
        $.ajax({
            async: true,
            url: "/api/callApi/LoadAllMatterByFirmId",
            type: "POST",
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (response.Data.length == a.totRow) {
                        $("#casemoreoptiondiv").hide();
                    } else {
                        if (a.totRow > 500) {
                            //show more option
                            $("#casemoreoptiondiv").show();
                        }
                        else {
                            //hide more option
                            $("#casemoreoptiondiv").hide();
                        }
                    }
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#MatterName").append(option);
                    }
                    closeload();
                });
                closeload();
            },
            failure: function (response) {
                alert(data.responseText);
                closeload();
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }

    /*Load matter*/
    function loadmatter(morepageno, clientid) {
        $('#MatterName').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        var formData = new FormData();
        formData.append("Pageno", morepageno);
        formData.append("clientid", clientid);
        formData.append("companyids", "");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/LoadAllMatterByFirmId",
            type: "POST",
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                $.each(response.Data, function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (response.Data.length == a.totRow) {
                        $("#casemoreoptiondiv").hide();
                    } else {
                        if (a.totRow > 500) {
                            //show more option
                            $("#casemoreoptiondiv").show();
                        }
                        else {
                            //hide more option
                            $("#casemoreoptiondiv").hide();
                        }
                    }
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $('#MatterName').append(option);
                    }
                });
                closeload();
            },
            failure: function (response) {
                alert(data.responseText);
                closeload();
            },
            error: function (response) {
                alert(data.responseText);
                closeload();
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
            var $table4 = $('<table id="table4" class="table-panel "/>');
            $table4.append('<thead><tr><th><div class="thbg">Payment Type</div></th><th><div class="thbg">Payment Mode</div></th><th><div class="thbg">Amount</div></th><th><div class="thbg">Payment Date</div></th><th><div class="thbg">Bank Name</div></th><th><div class="thbg">DD No</div></th><th><div class="thbg">DD Issue Date</div></th><th><div class="thbg">Cheque No</div></th><th><div class="thbg">Cheque Issue Date</div></th><th><div class="thbg">Ref No</div></th><th><div class="thbg">Other Details</div></th><th><div class="thbg"></div></th></tr></thead>');
            var $tbody4 = $('<tbody/>');
            $.each(payorderItems, function (i, val) {
                var $row4 = $('<tr/>');
                $row4.append($('<td/>').html(val.PaymentType));
                $row4.append($('<td/>').html(val.PaymentMode));
                $row4.append($('<td/>').html(val.Amount));
                $row4.append($('<td/>').html((val.PDate) != "" ? formatDatetoIST(val.PDate) : ""));
                $row4.append($('<td/>').html(val.BankName));
                $row4.append($('<td/>').html(val.DdNo));
                $row4.append($('<td/>').html((val.Ddidate) != "" ? formatDatetoIST(val.Ddidate) : ""));
                $row4.append($('<td/>').html(val.ChequeNo));
                $row4.append($('<td/>').html((val.Chqidate) != "" ? formatDatetoIST(val.Chqidate) : ""));
                $row4.append($('<td/>').html(val.RefNo));
                $row4.append($('<td/>').html(val.OtherDetails));
                var $remove4 = $('<a href="#" ><span class="glyphicon glyphicon-trash" title="Delete" style="color:red" title="Delete"></span></a>');
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
            console.log("current", payorderItems);
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
                Type: "FlatFees",
                ItemName: $('#itemName1').val().trim(),
                CaseName: $('#CaseName1').val().trim(),
                UserName: $('#UserName1').val().trim(),
                Quantity: parseFloat($('#quantity1').val().trim()),
                Price: parseFloat($('#price1').val().trim()),
                TotalAmount: (parseFloat($('#quantity1').val().trim()) * parseFloat($('#price1').val().trim()).toFixed(2)),
                tempCaseName: $('#CaseName1').find('option:selected').attr('tempname'),
                tempUserName: $('#UserName1').find('option:selected').attr('tempname')
            });
            sum1 = (parseFloat(sum1) + parseFloat($('#quantity1').val().trim()) * parseFloat($('#price1').val().trim()).toFixed(2));
            $("#total1").text(sum1);
            $("#subtotal").text(parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3));
            totalsum($("#subtotal").text());
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
        if (orderItems.length > 0) {
            var $table = $('<table id="table1" class="dataTable table"/>');
            $table.append('<thead><tr><th>Item Name</th><th>Matter Name</th><th>Billed By</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr></thead>');
            var $tbody = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.Type == "FlatFees") {
                    var $row = $('<tr/>');
                    $row.append($('<td/>').html(val.ItemName));
                    $row.append($('<td/>').html(val.tempCaseName));
                    $row.append($('<td/>').html(val.tempUserName));
                    $row.append($('<td/>').html(val.Price));
                    $row.append($('<td/>').html(val.Quantity));
                    $row.append($('<td/>').html(val.TotalAmount));
                    var $remove = $('<a href="#" data-val="' + val.TotalAmount + '"><span class="glyphicon glyphicon-trash" title="Delete" title="Delete" style="color:red"></span></a>');
                    var result = confirm("Are you sure want to delete items ?");
                    if (result) {
                        $remove.click(function (e) {
                            e.preventDefault();
                            orderItems.splice(i, 1);
                            sum1 = parseFloat(sum1) - parseFloat($(this).attr("data-val"));
                            $("#total1").text(sum1);
                            $("#subtotal").text(parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3));
                            totalsum($("#subtotal").text());
                            GeneratedItemsTable1();
                        });
                    }
                    $row.append($('<td/>').html($remove));
                    $tbody.append($row);
                }
            });
            console.log("current", orderItems);
            $table.append($tbody);
            $('#orderItems1').html($table);
        }
        else {
            $('#orderItems1').html('');
        }
    }

    $('#add2').click(function () {
        //Check validation of order item
        var isValidItem = true;
        var invinvoicedates = $("#invdate").val();
        var invclients = $("#client").val();
        var invaddresss = CKEDITOR.instances.address.getData();
        var invsaddresss = CKEDITOR.instances.saddress.getData();
        var invmobs = $("#mobile").val();
        var invduedates = $("#duedate").val();
        var invstatese = $("#state").val();
        if (invstatese == "") {
            alert("Please select the client billing state.");
            $("#state").focus();
            return false;
        }
        if (invinvoicedates == "") {
            alert("Please select the invoice date.");
            $("#invdate").focus();
            return false;
        }
        if (invaddresss == "") {
            alert("Please fill the billing address.");
            $("#address").focus();
            return false;
        }
        if (invsaddresss == "") {
            alert("Please fill the shipping address.");
            $("#saddress").focus();
            return false;
        }
        if (invmobs != "") {
            if (invmobs.length < 10) {
                alert("Please enter a mobile number with 10 digits only.");
                $("#mobile").focus();
                return false;
            }
        }
        if (invduedates == "") {
            alert("Please select the invoice due date.");
            $("#duedate").focus();
            return false;
        }
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
                Type: "TimeEntries",
                ItemName: $('#itemName2').val().trim(),
                UserName: NewUserName2.trim(),
                Price: parseFloat($('#price2').val().trim()),
                tempCaseName: $('#CaseName2').find('option:selected').attr('tempname'),
                tempUserName: $('#UserName2').find('option:selected').attr('tempname')
            });
            sum2 = parseFloat($('#price2').val().trim()) + parseFloat(sum2);
            $("#total2").text(sum2);
            $("#subtotal").text(parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3));
            totalsum($("#subtotal").text());
            //Clear fields
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
        if (orderItems.length > 0) {
            var $table2 = $('<table id="table2" class="table-panel"/>');
            $table2.append('<thead><tr><th><div class="thbg">Particular</div></th><th><div class="thbg">Billed By</div></th><th><div class="thbg">Amount</div></th><th><div class="thbg">Action</div></th></tr></thead>');
            var $tbody2 = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.Type == "TimeEntries") {
                    var $row2 = $('<tr/>');
                    $row2.append($('<td/>').html(val.ItemName));
                    $row2.append($('<td/>').html(val.tempUserName));
                    $row2.append($('<td/>').html(val.Price));
                    var $remove2 = $('<a href="#" data-val="' + val.Price + '"><span class="glyphicon glyphicon-trash" title="Delete" title="Delete" style="color:red"></span></a>');
                    $remove2.click(function (e) {
                        var result = confirm("Are you sure want to delete items ?");
                        if (result) {
                            e.preventDefault();
                            orderItems.splice(i, 1);
                            sum2 = sum2 - parseFloat($(this).attr("data-val"));
                            $("#total2").text(sum2);
                            $("#subtotal").text(parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3));
                            totalsum($("#subtotal").text());
                            GeneratedItemsTable2();
                        }
                    });
                    $row2.append($('<td/>').html($remove2));
                    $tbody2.append($row2);
                }
            });
            console.log("current", orderItems);
            $table2.append($tbody2);
            $('#orderItems2').html($table2);
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
        if (isValidItem) {
            orderItems.push({
                Type: "Expense",
                ItemName: $('#itemName3').val().trim(),
                CaseName: $('#CaseName3').val().trim(),
                UserName: $('#UserName3').val().trim(),
                Quantity: parseFloat($('#quantity3').val().trim()),
                Price: parseFloat($('#price3').val().trim()),
                TotalAmount: (parseFloat($('#quantity3').val().trim()) * parseFloat($('#price3').val().trim()).toFixed(2)),
                tempCaseName: $('#CaseName3').find('option:selected').attr('tempname'),
                tempUserName: $('#UserName3').find('option:selected').attr('tempname')
            });
            sum3 = (parseFloat(sum3) + parseFloat($('#quantity3').val().trim()) * parseFloat($('#price3').val().trim()).toFixed(2));
            $("#total3").text(sum3);
            $("#subtotal").text(parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3));
            totalsum($("#subtotal").text());
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
        if (orderItems.length > 0) {
            var $table3 = $('<table id="table3" class="dataTable table"/>');
            $table3.append('<thead><tr><th><div class="thbg">Item Name</div></th><th><div class="thbg">Matter Name</div></th><th><div class="thbg">Billed By</div></th><th><div class="thbg">Price</div></th><th><div class="thbg">Quantity</div></th><th><div class="thbg">Total</div></th><th><div class="thbg"></div></th></tr></thead>');
            var $tbody3 = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                if (val.Type == "Expense") {
                    var $row3 = $('<tr/>');
                    $row3.append($('<td/>').html(val.ItemName));
                    $row3.append($('<td/>').html(val.tempCaseName));
                    $row3.append($('<td/>').html(val.tempUserName));
                    $row3.append($('<td/>').html(val.Price));
                    $row3.append($('<td/>').html(val.Quantity));
                    $row3.append($('<td/>').html(val.TotalAmount));
                    var $remove3 = $('<a href="#" data-val="' + val.TotalAmount + '"><span class="glyphicon glyphicon-trash"  title="Delete" style="color:red"></span></a>');
                    var result = confirm("Are you sure want to delete items ?");
                    if (result) {
                        $remove3.click(function (e) {
                            e.preventDefault();
                            orderItems.splice(i, 1);
                            sum3 = sum3 - parseFloat($(this).attr("data-val"));
                            $("#total3").text(sum3);
                            $("#subtotal").text(parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3));
                            totalsum($("#subtotal").text());
                            GeneratedItemsTable3();
                        });
                    }
                    $row3.append($('<td/>').html($remove3));
                    $tbody3.append($row3);
                }
            });
            console.log("current", orderItems);
            $table3.append($tbody3);
            $('#orderItems3').html($table3);
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
        var tstate = $("#sstate").val();
        var bstate = $("#billerstate").val();
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
            var invtypesss = $('input[name=tax]:checked', '#taxtype').val();
            if (invtypesss == "2") {
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
            var invtypesss = $('input[name=tax]:checked', '#taxtype').val();
            if (invtypesss == "2") {
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
    $('input[type=radio][name=tax]').change(function () {
        if ($(this).val() == "1") {
            $("#add4").attr("disabled", "disabled");
        }
        else {
            $("#add2").removeAttr("disabled");
            $("#add4").removeAttr("disabled");
        }
        sum1 = 0;
        sum2 = 0;
        sum3 = 0;
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
        if ($("#invdate").val() != "") {
            $("#invdate").change();
        }
        var newcurrentvlaues = $('input[name=tax]:checked', '#taxtype').val();
        if (newcurrentvlaues == "1") {
            $("#subtotals").show();
            $("#igst").show();
            $("#cgst").show();
            $("#sgst").show();
        }
        else {
            $("#subtotals").hide();
            $("#igst").hide();
            $("#cgst").hide();
            $("#sgst").hide();
        }
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
    });
    $("#createinv").click(function () {
        var invclient = $("#client").val();
        var invstate = $("#state").val();
        var invsstate = $("#sstate").val();
        var invinvoicedate = $("#invdate").val();
        var invduedate = $("#duedate").val();
        var invmob = $("#mobile").val();
        var invaddress = CKEDITOR.instances.address.getData();
        var invsaddress = CKEDITOR.instances.saddress.getData();
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
        var clientpan = $('#clientpan').val();
        var clientgst = $('#clientgst').val();
        var invsubject = $('#invsubject').val();
        var invReference = $('#invReference').val();
        //get paymentvalue
        var amount = 0;
        var i;
        if (invotype == "2") {
            for (i = 0; i < payorderItems.length; i++) {
                amount += payorderItems[i].Amount;
            }
            if (amount > parseInt(invsubtotaltemp)) {
                alert("You cannot pay more than the invoice amount.");
                return false;
            }
        }
        else {
            for (i = 0; i < payorderItems.length; i++) {
                amount += payorderItems[i].Amount;
            }
            if (amount > parseInt(finaltotaltemp)) {
                alert("You cannot pay more than the invoice amount.");
                return false;
            }
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
            alert("Please select the invoice due date.");
            return false;
        }
        if (invaddress == "") {
            alert("Please fill the billing address.");
            return false;
        }
        if (invstate == "") {
            alert("Please select the client billing state.");
            return false;
        }
        if (invduedate == "") {
            alert("Please select Due Date");
            return false;
        }
        if (invsaddress == "") {
            alert("Please fill the shipping address.");
            return false;
        }
        if (invsstate == "") {
            alert("Please select Ship state");
            return false;
        }
        if (invmob != "") {
            if (invmob.length < 10) {
                alert("Please enter a mobile number with 10 digits only.");
                return false;
            }
        }
        if (billeradress == "") {
            alert("Please set the biller address (Go to: Invoice > Action selected > Invoice settings).");
            return false;
        }
        if (billerstate == "") {
            alert("Please select the biller state.");
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
            alert("Please add at least one service.");
            return false;
        }
        // GST VALIDATION
        if (clientgst != "") {
            if ($("#clientgst").val().length < 15 || $("#clientgst").val().length > 15) {
                alert("Please enter a valid GST number. GST number should be of 15 characters only.");
                return false;
            }
            var reggst = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
            if (!reggst.test(clientgst) && clientgst != '') {
                alert('GST number is not valid. Please enter a valid GST number.');
                return false;
            }
        }
        // PAN VALIDATION
        var panregex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (clientpan != "") {
            var inputvalues = $("#clientpan").val().toUpperCase();
            if (panregex.test(inputvalues) == false) {
                alert("Please enter a valid PAN No.");
                return false;
            }
            if ($("#clientpan").val().length < 10) {
                alert("PAN no. should be of 10 characters only.");
                return false;
            }
        }
        var date1 = new Date(invinvoicedate);
        var date2 = new Date(invduedate);
        if (date1 > date2) {
            alert("Due date should be after invoice date.");
            return false;
        }
        var formData = new FormData();
        formData.append("invclient", EncodeText(invclient));
        formData.append("invstate", EncodeText(invstate));
        formData.append("invsstate", EncodeText(invsstate));
        formData.append("invinvoicedate", EncodeText(invinvoicedate));
        formData.append("invduedate", EncodeText(invduedate));
        formData.append("invmob", EncodeText(invmob));
        formData.append("invaddress", EncodeText(invaddress));
        formData.append("invsaddress", EncodeText(invsaddress));
        if (invotype == "2") {
            formData.append("invigstper", EncodeText(0));
            formData.append("invcgstper", EncodeText(0));
            formData.append("invsgstper", EncodeText(0));
            formData.append("invigsttempval", EncodeText(0));
            formData.append("finaltotaltemp", EncodeText(invsubtotaltemp));
        }
        else {
            formData.append("invigstper", EncodeText(invigstper));
            formData.append("invcgstper", EncodeText(invcgstper));
            formData.append("invsgstper", EncodeText(invsgstper));
            formData.append("invigsttempval", EncodeText(invigsttempval));
            formData.append("finaltotaltemp", EncodeText(finaltotaltemp));
        }
        formData.append("invcgsttempval", EncodeText(invcgsttempval));
        formData.append("invsgsttempval", EncodeText(invsgsttempval));
        formData.append("invsubtotaltemp", EncodeText(invsubtotaltemp));
        formData.append("invoicetype", EncodeText(invotype));
        formData.append("itemlistdata", JSON.stringify(orderItems));
        formData.append("itempaymentdata", JSON.stringify(payorderItems));
        formData.append("addressid", EncodeText(addressid));
        formData.append("UserNameFreeText", EncodeText(UserNameFreeText));
        formData.append("EmailText", EncodeText(EmailText));
        formData.append("MatterId", EncodeText(MatterName));
        formData.append("clientgst", EncodeText(clientgst));
        formData.append("clientpan", EncodeText(clientpan));
        formData.append("invReference", EncodeText(invReference));
        formData.append("invsubject", EncodeText(invsubject));
        $.ajax({
            url: '/api/OcrInvoiceApi/PostSaveInvoice',
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
                        $("#createinv").attr("disabled", "disabled");
                        alert("The invoice has been created successfully.");
                        var fcode = localStorage.getItem("FirmCode");
                        window.location = encodeURI("/" + fcode + "/Bill/ViewInvoice");
                        $("#savedata")[0].reset();
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

    /*Load client address*/
    function loadClientAddress(clientid) {
        var formdata = new FormData();
        formdata.append("client", EncodeText(clientid));
        formdata.append("pagenum", EncodeText(1));
        formdata.append("pagesize", EncodeText(1000));
        var clientAddress = $('#clientAddress');
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadMultipleAddress',
            type: 'POST',
            data: formdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response1) {
                d = JSON.parse(response1.Data);
                clientAddress.empty(); // Clear the plese wait
                clientAddress.append($("<option value'' selected></option>").val('').html('Select'));
                $.each(d, function (i, address) {
                    clientAddress.append($("<option></option>").val(address.Id).attr("data-pan", address.PANNo).attr("data-gst", address.GSTNo).attr("data-state", address.State).html(address.Address));
                });
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (d) {
                alert('Error!'); alert(d.responseText);
            }
        });
    }
    $(document).on("change", "#clientAddress", function () {
        var e = document.getElementById("clientAddress");
        var text = e.options[e.selectedIndex].text;
        var datapan = $("#clientAddress").children(':selected').attr("data-pan");
        var datagst = $("#clientAddress").children(':selected').attr("data-gst");
        var datastate = $("#clientAddress").children(':selected').attr("data-state");
        $("#address").val(text);
        $("#clientpan").val(datapan);
        $("#clientgst").val(datagst);
        $("#state").val(datastate);
    });
});