var ipageindex = 1, ipagesize = 10, irecordcount = 0, itotrecord = 0;
$(document).ready(function () {
    debugger
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    /*View invoice data*/
    $(document).on("click", "#viewinvoicedata", function () {
        var token = $(this).attr("data-val");
        var invtype = $(this).attr("data-type");
        var host = window.location.host
        var url = "/" + fcode + "/Bill/PrintInvoiceDetail?data=true&token=" + token + "&invtype=" + invtype;
        window.open("" + url + "", "_blank");
    });

    //share invoice deatils 
    $(document).on("click", "#shareinvoiceclient", function () {
        $('#myModaldocsclient').modal({ show: true });
        tokenemail = $(this).attr("data-val");
        invtypeemail = $(this).attr("data-type");
        invamendcnt = $(this).attr("data-amend");
        $("#saveshareinvoiceclient").attr("data-val", $(this).attr("data-val"));
        var cml = '';

        //cml += '<input type="radio" value="o" title="Original Version"  name="editversionmailclient" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Original Version">O</span> &nbsp;&nbsp;';
        //for (var i = 1; i <= invamendcnt; i++) {
        //    cml += '<input type="radio" value="' + i + '" title="Version ' + i + '"  name="editversionmailclient" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Version ' + i + '">' + i + '</span> &nbsp;&nbsp;';
        //}
        //$("#emailVersionclient").html(cml);

        $("#emailVersionclient").html("");
        $("#emailVersionclient").append("<option value='o'>Original Version</option>");
        for (var i = 1; i <= invamendcnt; i++) {
            $("#emailVersionclient").append($("<option value='" + i + "'>Version"+ i +"</option>"));
        }
    })
    $(document).on("click", "#saveshareinvoiceclient", function () {
        tokeninvoice = $(this).attr("data-val");
        var invversion = $('#emailVersionclient').val();
        //var invversion = $("input[name='editversionmailclient']:checked").val();
        //if (String(invversion) == "undefined" || String(invversion) == "") {
        //    alert("Select invoice version");
        //    return false;
        //}
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("invversion", EncodeText(invversion));
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/ShareInvoicetoClient",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data == "") {
                    alert("OOps something went wrong.");
                    closeload();
                    return false;
                }
                else if (parseInt(response.Data) > 0) {
                    alert("Invoice shared successfully with client.");
                    $("#myModaldocsclient").modal("hide");
                    loadInvoicedata(ipageindex);
                    closeload();
                    return false;
                }
                else {
                    alert(response.Data);
                    closeload();
                    return false;
                }
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    var tokenemail = "";
    var invtypeemail = "";
    /*Open payment model popup*/
    $(document).on("click", "#OpenPayment", function () {
        $('#myModalpayment').modal({ show: true });
        tokeninvoice = $(this).attr("data-id");
        paymentype = $(this).attr("data-paymentype");
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("PaymentTypeFilter", EncodeText(""));
        var htmlpay = '';
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/InvoicePaymentbyInvoiceID",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#PaymentDetailsdiv").empty();
                var obj = JSON.parse(response.Data);
                try {
                    if (parseInt(obj.length) == 0) {
                        $("#paymentdetaisnoresultdiv").css("display", "block");
                    }
                    else {
                        $("#paymentdetaisnoresultdiv").css("display", "none");
                    }
                }
                catch
                {
                    $("#paymentdetaisnoresultdiv").css("display", "block");
                    closeload();
                    return false;
                }
                $.each(obj, function (i, a) {
                    htmlpay += '<tr>'
                    htmlpay += '<td>' + formatDatetoIST(a.PDate) + '</td>'
                    htmlpay += '<td>' + a.PaymentType + '</td>'
                    htmlpay += '<td>' + a.Amount + '</td>'
                    htmlpay += '<td>' + a.BankName + '</td>'
                    htmlpay += '<td>' + a.DdNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Ddidate) + '</td>'
                    htmlpay += '<td>' + a.ChequeNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Chqidate) + '</td>'
                    htmlpay += '<td>' + a.RefNo + '</td>'
                    htmlpay += '<td>' + a.OtherDetails + '</td>'
                    htmlpay += '<td>' + a.CheckStatus + '</td>'
                    htmlpay += '</tr>'
                }); //End of foreach Loop
                $("#PaymentDetailsdiv").empty().html(htmlpay);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    /*Open payment status model*/
    $(document).on("click", "#OpenPaymentStatus", function () {
        $('#myModalpayment').modal({ show: true });
        tokeninvoice = $(this).attr("data-id");
        paymentype = $(this).attr("data-paymentype");
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("PaymentTypeFilter", EncodeText("Cheque"));
        var htmlpay = '';
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/InvoicePaymentbyInvoiceID",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#PaymentDetailsdiv").empty();
                var obj = JSON.parse(response.Data);
                try {
                    if (parseInt(obj.length) == 0) {
                        $("#paymentdetaisnoresultdiv").css("display", "block");
                    }
                    else {
                        $("#paymentdetaisnoresultdiv").css("display", "none");
                    }
                }
                catch
                {
                    $("#paymentdetaisnoresultdiv").css("display", "block");
                    closeload();
                    return false;
                }
                $.each(obj, function (i, a) {
                    htmlpay += '<tr>'
                    htmlpay += '<td>' + formatDatetoIST(a.PDate) + '</td>'
                    htmlpay += '<td>' + a.PaymentType + '</td>'
                    htmlpay += '<td>' + a.Amount + '</td>'
                    htmlpay += '<td>' + a.BankName + '</td>'
                    htmlpay += '<td>' + a.DdNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Ddidate) + '</td>'
                    htmlpay += '<td>' + a.ChequeNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Chqidate) + '</td>'
                    htmlpay += '<td>' + a.RefNo + '</td>'
                    htmlpay += '<td>' + a.OtherDetails + '</td>'
                    htmlpay += '<td>' + a.CheckStatus + '</td>'
                    htmlpay += '</tr>'
                }); //End of foreach Loop
                $("#PaymentDetailsdiv").empty().html(htmlpay);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });

    //share invoice deatils 
    $(document).on("click", "#shareinvoicedata", function () {
        $('#myModaldocs').modal({ show: true });
        var emailto = "rdubey@manupatra.com"
        tokenemail = $(this).attr("data-val");
        invtypeemail = $(this).attr("data-type");
        invamendcnt = $(this).attr("data-amend");
        var cml = '';
        //cml += '<input type="radio" value="o" title="Original Version"  name="editversionmail" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Original Version">O</span> &nbsp;&nbsp;';
        //for (var i = 1; i <= invamendcnt; i++) {
        //    cml += '<input type="radio" value="' + i + '" title="Version ' + i + '"  name="editversionmail" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Version ' + i + '">' + i + '</span> &nbsp;&nbsp;';
        //}
        //$("#emailVersion").html(cml);

        $("#emailVersion").html("");
        $("#emailVersion").append("<option value='o'>Original Version</option>");
        for (var i = 1; i <= invamendcnt; i++) {
            $("#emailVersion").append($("<option value='" + i + "'>Version" + i + "</option>"));
        }

    })
    $("#shareinvoice").click(function () {
        var formdata = new FormData();
        var emailto = $("#semail").val();
        var token = tokenemail;
        var invtype = invtypeemail;
        var remarksemail = $("#remarksemail").val();
        var invversion = $('#emailVersion').val();//$("input[name='editversionmail']:checked").val();
        if (String(invversion) == "undefined" || String(invversion) == "") {
            alert("Select invoice version");
            return false;
        }
        else if (invtype == "") {
            alert("Please select the invoice type");
            return false;
        }
        else if (emailto == "") {
            alert("Please enter the E-mail Id");
            return false;
        }
        else {
            if (emailto != "") {
                var emailArray = emailto.split(",");
                for (i = 0; i <= (emailArray.length - 1); i++) {
                    if (checkEmail(emailArray[i])) {
                        vEmails = "true";
                    } else {
                        vEmails = "false";
                        new PNotify({
                            title: 'Warning!',
                            text: ' Invalid email format!',
                            type: 'error',
                            delay: 3000
                        });
                    }
                }
            }
        }
        if (vEmails == "" || vEmails == "true") {
            formdata.append("email", EncodeText(emailto));
            formdata.append("invtype", EncodeText(invtype));
            formdata.append("token", token);
            formdata.append("remarksemail", EncodeText(remarksemail));
            formdata.append("invversion", EncodeText(invversion));
            $('#shareinvoice').prop('disabled', true);
            openload();
            $.ajax({
                async: true,
                url: '/Bill/SendInvoice',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (String(response) == "true") {
                        closeload();
                        alert("Invoice Sent Successfully");
                        $('#myModaldocs').modal('hide');
                        $("#semail,#remarksemail").val("");
                        $('#shareinvoice').prop('disabled', false);
                    }
                    else {
                        alert(response);
                    }
                    closeload();
                },
                error: function () {
                    closeload();
                }
            });
        }
    });

    /*View invoice version*/
    $(document).on("click", "#viewinvoiceversion", function () {
        var valuetoken = $(this).attr("token");
        var invno = $(this).attr("filename");
        var ct = 5;
        var formData = new FormData();
        formData.append("Invoiceid", valuetoken);
        var html6 = '';
        $.ajax({
            async: true,
            url: '/api/OcrInvoiceApi/InvoiceVersionList',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                $("#invoicetabparentdiv").animate({ scrollTop: $("#invoicetabparentdiv").height() }, 1000);
                invno = String(invno).replaceAll('/', '_');
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        $("#bindinvoiceversion" + invno).empty().html("<tr><td colspan='6' align='center'>No invoice found</td</tr>");
                        return false;
                    }
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var cheintb = false;
                ct = 1;
                $.each(obj, function (i, a) {
                    var downloadpath = "";
                    html6 += '<tr>';
                    html6 += '<td>' + a.RowNum + '</td>';
                    html6 += '<td>' + formatDatetoIST(a.Inovicedate) + '</td>';
                    html6 += '<td>' + a.InvoiceNo + '</td>';
                    html6 += '<td>' + a.CreatedBy + '</td>';
                    html6 += '<td>' + a.TotAmt + '</td>';
                    if (a.IsAmend == "1") {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download Invoice" data-val="' + a.id + '" id="viewinvoicedata" data-type="' + ct + '" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + invno + ' (Version - ' + ct + ')</span></td>';
                        ct = ct + 1;
                    }
                    else {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download Invoice" data-val="' + a.id + '" id="viewinvoicedata" data-type="o" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">Original Invoice</span></td>';
                    }
                    html6 += '</tr>';
                });
                $("#bindinvoiceversion" + invno).empty().html(html6);
                $("#invoicetabparentdiv").animate({ scrollTop: $("#invoicetabparentdiv").height() }, 1000);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    });
    /*Cancel invoice details*/
    //$(document).on("click", "#cancelinvoice", function () {
    //    var tokeninvoice = $(this).attr("dataval");
    //    var result = confirm("Are you sure to cancel this invoice?");
    //    if (result) {
    //        var formdata = new FormData();
    //        formdata.append("Invoiceid", tokeninvoice);
    //        openload();
    //        $.ajax({
    //            async: true,
    //            url: "/api/OcrInvoiceApi/CancelInvoice",
    //            data: formdata,
    //            processData: false,
    //            contentType: false,
    //            type: 'POST',
    //            success: function (response) {
    //                if (response.Data == "") {
    //                    alert("OOps something went wrong.");
    //                    closeload();
    //                    return false;
    //                }
    //                else if (parseInt(response.Data) > 0) {
    //                    alert("Invoice cancelled successfully.");
    //                    loadInvoicedata(ipageindex);
    //                    closeload();
    //                    return false;
    //                }
    //                else if (String(response.Data) == "-1") {
    //                    alert("You are not Authorise to cancel this invoice.");
    //                    closeload();
    //                    return false;
    //                }
    //                else {
    //                    alert(response.Data);
    //                    closeload();
    //                    return false;
    //                }
    //                // closeload();
    //            },
    //            error: function (response) {
    //                alert(response.responseText);
    //                closeload();
    //            }
    //        });
    //    }
    //});

    $(document).on("click", "#cancelinvoice", function () {
        var tokeninvoice = $(this).attr("dataval");
        $("#myModalDelConfirmation").modal();
        $("#cancelInvoiceDetails").attr("id-val", tokeninvoice);
    });
    $(document).on('click', '#cancelInvoiceDetails', function () {
        var tokInvoice = $(this).attr("id-val");
        CancelInvoiceDetail(tokInvoice);
    });
    function CancelInvoiceDetail(tokInvoice) {
        var tokeninvoice = tokInvoice;
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/CancelInvoice",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#myModalDelConfirmation").modal("hide");
                if (response.Data == "") {
                    //alert("OOps something went wrong.");
                    new PNotify({
                        title: 'Error!',
                        text: 'OOps something went wrong.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                    return false;
                }
                else if (parseInt(response.Data) > 0) {
                    //alert("Invoice cancelled successfully.");
                    new PNotify({
                        title: 'Success!',
                        text: 'Invoice cancelled successfully.',
                        type: 'success',
                        delay: 3000
                    });
                    loadInvoicedata(ipageindex);
                    closeload();
                    return false;
                }
                else if (String(response.Data) == "-1") {
                    //alert("You are not Authorise to cancel this invoice.");
                    new PNotify({
                        title: 'Warning!',
                        text: 'You are not Authorise to cancel this invoice.',
                        type: 'Warning',
                        delay: 3000
                    });
                    closeload();
                    return false;
                }
                else {
                    alert(response.Data);
                    closeload();
                    return false;
                }
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    $(document).on("click", "#payinvoice", function () {
        var token = $(this).attr("dataval");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Bill/PaymentInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Amend invoice*/
    $(document).on("click", "#amendinvoice", function () {
        var token = $(this).attr("dataval");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Bill/AmendInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#recurinvoice", function () {
        var token = $(this).attr("dataval");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Bill/NewInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Send invoice through mails*/
    $(document).on("click", "#sendemailinv", function () {
        var tokenids = $(this).attr("dataval");
        $("#textinvid").val(tokenids);
        $('#myModaldocs1').modal({ show: true });
    });
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    try {
        $("#sharedocs").click(function () {
            var formdata = new FormData();
            var invoicetype = $("#invoicetype").val();
            var emailto = $("#shareemail").val();
            if (invoicetype == "") {
                alert("Please select the invoice type.");
                return false;
            }
            if (emailto == "") {
                alert("Please enter the E-mail Id.");
                return false;
            }
            else {
                if (emailto != "") {
                    var emailArray = emailto.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            vEmails = "true";
                        } else {
                            vEmails = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid email format!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
            }
            var tokens = $("#textinvid").val();
            if (vEmails == "" || vEmails == "true") {
                formdata.append("email", EncodeText(emailto));
                formdata.append("invtype", EncodeText(invoicetype));
                formdata.append("token", tokens);
                $.ajax({
                    async: true,
                    url: '/Bill/SendInvoice',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        if (String(response) == "true") {
                            alert("Invoice Sent Successfully");
                            $("#shareemail").val("");
                        }
                        else {
                            alert(response);
                        }
                    },
                    error: function () {
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
    }
    var searchflag = 0;
    /*Search invoice*/
    $("#searchinvoice").click(function () {
        $("#clearnewseach").css("display", "unset");
        var cnamefilter = $("#searchname").val();
        var fromfilter = $("#searchfrom").val();
        $("#casetfooter1").html('');
        var tofilter = $("#searchto").val();
        var amountfilter = $("#searchamount").val();
        if (cnamefilter == "" && fromfilter == "" && tofilter == "" && amountfilter == "") {
            searchflag = 0;
        }
        else {
            searchflag = 1;
        }
        var date1 = new Date(fromfilter);
        var date2 = new Date(tofilter);
        if (fromfilter != "" && tofilter != "") {
            if (date1 > date2) {
                alert("To date should be after from date.");
                return false;
            }
        }
        if (fromfilter == "" && tofilter != "") {
            alert("Please select the date from where you want to see the invoice list.");
            return false;
        }
        $("#searchinvoice").attr("disabled", true);
        isRenderPage = false;
        loadInvoicedata(1);
    });
    /*Load client list detaisl*/
    //function loadclientlist() {
    //    $('#searchname').find('option').not(':first').remove();
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: '/api/CallApi/SpClientData',
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //                var obj = JSON.parse(response.Data);
    //            }
    //            else {
    //                // alert("not found");
    //            }
    //            var option = '<option value="">Select</option>';
    //            $.each(obj, function (i, a) {
    //                option = '<option value="' + a["LoginId"] + '" >' + a["cfname"] + ' (' + a["Username"] + ')</option>';
    //                $("#searchname").append(option);
    //            }); //End of foreach Loop
    //        }, //End of AJAX Success function
    //        failure: function (response) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(data.responseText);
    //        } //End of AJAX error function
    //    });
    //}
    $("#InvoiceType,#InvoiceStatus").change(function () {
        debugger
        isRenderPage = false;
        loadInvoicedata(1);
    });
    debugger

    loadInvoicedata(ipageindex);
    /*Load invoice data*/
    var totalRecordCountD = 1;
    function loadInvoicedata(ipageindex) {
        debugger
        var html = '';
        var payrecivedamount = 0;
        var formData = new FormData();
        formData.append("cnamefilter", EncodeText($("#searchname").val()));
        formData.append("fromfilter", EncodeText($("#searchfrom").val()));
        formData.append("tofilter", EncodeText($("#searchto").val()));
        formData.append("amountfilter", EncodeText($("#searchamount").val()));
        formData.append("searchflag", EncodeText(searchflag));
        formData.append("Pagesize", EncodeText(ipagesize));
        formData.append("Pageindex", EncodeText(ipageindex));
        formData.append("filterinvoietype", EncodeText($("#InvoiceType").val()));
        formData.append("FilterInvoiceStatus", EncodeText($("#InvoiceStatus").val()));
        $("#assignuserdata").html("");
        $("#casetfooter1").html("");
        //read assign using list
        openload();
        qty1 = 0;
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/OcrInvoiceApi/LoadInvoicedata",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    var obj = response1.Data;//JSON.parse(response1.Data);
                    var ilength = obj.length;
                    if (ilength != 0) {
                        $("#datastatus").html("");
                    }
                    else {
                        $("#datastatus").html("No result found !");
                    }
                    if (ilength < 10) {
                        renderPagination(1, 1);
                        $('#prev').css("display", "none");
                        $('#next').css("display", "none");
                    }
                    $.each(obj, function (i, a) {
                        qty1 = qty1 + 1;
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(ipagesize);
                            //totpage = Math.ceil(parseInt(totdata) / parseInt(ipagesize));
                            if (totpage < 1) {
                                totpage = 1;
                            }
                            if (totpage === 1) {
                                $('#prev, #next').hide();
                            }
                            if (parseInt(totdata) % parseInt(ipagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (ipageindex == totpage) {
                                $('#next').hide();
                                //$('#next').css("display", "none");
                                $('#prev').css("display", "block"); s
                            }
                            else {
                                $('#next').css("display", "block");
                            }
                            if (ipageindex == 1) {
                                $('#prev').css("display", "none");
                            }
                            else {
                                $('#prev').css("display", "block");
                            }
                            //if (!isRenderPage) {
                            //    totalRecordCountD = totpage;
                            //    renderPagination(ipageindex, totpage);
                            //    isRenderPage = true;
                            //}
                            if (isRenderPage == false) {
                                totalRecordCountD = totpage;
                                renderPagination(ipageindex, totpage);
                            }
                            $("#exportrecords").val(a.totRow);
                            //if (i === 0) {
                            //    ifirstvalue = a.rownum;
                            //}
                            //if (i === (ilength - 1)) {
                            //    var ipnext = ipageindex;
                            //    var ipprev = ipageindex;
                            //    var ipageno = ipageindex;
                            //    var itotdata = a.totRow;
                            //    var itotpage = 0;
                            //    if (a.totRow > 0) {
                            //        // alert(a.totRow);
                            //        ipnext = parseInt(ipnext) + 1;
                            //        if (ipnext == 0) ipnext = 1;
                            //        ipprev = parseInt(ipageno) - 1;
                            //        if (ipprev == 0) ipprev = 1;
                            //        itotpage = parseInt(itotdata) / parseInt(ipagesize);
                            //        if (parseInt(itotdata) % parseInt(ipagesize) != 0) {
                            //            itotpage = parseInt(itotpage) + 1;
                            //        }
                            //        $("#ipagnumvalue").attr("max", itotpage);
                            //    }
                            //    var itfot = '';
                            //    itfot += '<ul>'
                            //    itfot += '<li>results <span>' + a.totRow + '</span>  <span id="isotopage" style="display:none">' + itotpage + '</span></li>'
                            //    itfot += '<li><span>|</span></li>'
                            //    itfot += '<li>pages ' + ipageindex + '/ ' + parseInt(itotpage) + '</li>'
                            //    itfot += '<li><span>|</span></li>'
                            //    itfot += '<li ><input type="number" id="ipagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="igetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                            //    if (a.totRow <= ilength) {
                            //    }
                            //    else if (ipageno == 1) {
                            //    }
                            //    else if (ipageno == itotpage) {
                            //        itfot += '<li><span><a id="ipaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ifirstvalue + '-' + a.rownum + '  <span>'
                            //    }
                            //    else {
                            //        itfot += '<li><span><a id="ipaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + ifirstvalue + '-' + a.rownum + '  <span>'
                            //    }
                            //    if (ipageno < itotpage) {
                            //        itfot += '<a  id="ipaginate" title="Next Page" href="javascript:void()" index="' + ipnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }
                            //    $("#casetfooter1").html("");
                            //    $("#casetfooter1").html(itfot);
                        }
                        let statusClass = '';
                        if (a.InvoiceStatus === 'Pending') {
                            statusClass = 'pending';
                        } else if (a.InvoiceStatus === 'Settled') {
                            statusClass = 'settled';
                        }
                        var famt = parseFloat(a.TotAmt) - parseFloat(a.PaidAmt);
                        var trcolordata = "";
                        var d1 = new Date();
                        var d2 = new Date(a.duedate);
                        if (d1 >= d2 && famt != "0") {
                            trcolordata = "trcolor";
                        }
                        else {
                            trcolordata = "";
                        }
                        if (a.IsCanceled == 1) {
                            trcolordata = "";
                        }
                        else {
                        }
                        var paymentcursor = "";
                        if (a.PaymentType != "") {
                            paymentcursor = "cursor:pointer;color:#069;"
                        }
                        var statuscursor = "";
                        if (a.ChequeStatus != "") {
                            statuscursor = "cursor:pointer;color:#069;"
                        }
                        var shareinvoiceclientcss = "";
                        if (a.IsInvoiceClientShared == "1") {
                            shareinvoiceclientcss = "color:#37c137 !important";
                        }
                        var ClientGSTNo = "";
                        var ClientPanNo = "";
                        if (a.ClientGSTNo == "" || a.ClientGSTNo == null || a.ClientGSTNo == "null") {
                            ClientGSTNo = "";
                        }
                        else {
                            ClientGSTNo = a.ClientGSTNo;
                        }
                        if (a.ClientPanNo == "" || a.ClientPanNo == null || a.ClientPanNo == "null") {
                            ClientPanNo = "";
                        }
                        else {
                            ClientPanNo = a.ClientPanNo;
                        }
                        if (roleids == "3") {
                            if (famt == "0") {
                                html += '<tr class="' + trcolordata + '"><td class="InvoiceNo">' + a.InvoiceNo + '</td><td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invName">' + a.UserNameInvoice + ' </td><td class="invdate" >' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td></td><td class="InvoiceStatus"><div class="status_badge"><span class="' + statusClass + '"></span>' + a.InvoiceStatus + '</div></td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                html += '<td> <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a> & nbsp;|& nbsp; <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a> & nbsp;|& nbsp; <div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span title="Share as Mail"><img src="/newassets/img/mail-01.png"> Share as Mail</span></div></td ></tr > ';
                            }
                            else {
                                html += '<tr class="' + trcolordata + '" ><td class="InvoiceNo">' + a.InvoiceNo + '</td><td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invName">' + a.UserNameInvoice + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td></td><td class="InvoiceStatus"><div class="status_badge"><span class="' + statusClass + '"></span>' + a.InvoiceStatus + '</div></td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</span></td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                html += '<td ><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a>&nbsp;|&nbsp;<div name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span title="Share as Mail"><img src="/newassets/img/mail-01.png"> Share as Mail</span></div></td></tr>';
                            }
                        }
                        else {
                            if (famt == "0") {
                                if (roleids == 1) {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + ''
                                    //html += '<div class="pull-right">'
                                    //html += '<div class="btn-group" >'
                                    //html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn-viewdv  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                    //html += '<span><img src="/newassets/img/refresh-cw-04.png"></span>'
                                    //html += '<span class="sr-only">Toggle Dropdown</span>'
                                    //html += '</button>'
                                    //html += '<div class="dropdown-menu" style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    //html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    //var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    //html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    //html += '</tbody>'
                                    //html += '</table>'
                                    //html += '</div>'
                                    //html += '</div>'
                                    html += '</td>'
                                    html += '<td class="ClientName">' + a.ClientName + ' </td>';
                                    if (a.MatterName != null || a.MatterName != "") {
                                        html += '<td class="invMatterName"><a style="color:#0059c1;" id="transferpage" href="javascript:void()" sno=' + a.matterid + '>' + a.MatterName + '</a></td>';
                                    } else {
                                        html += '<td class="invMatterName">' + a.MatterName + ' </td>';
                                    }
                                    html += ' <td class="invName">' + a.UserNameInvoice + ' </td> <td class="invdate">' + formatDatetoIST(a.invdate) + '</td> <td class="Invoicetype">' + a.Invoicetype + '</td> </td><td class="InvoiceStatus"><div class="status_badge"><span class="' + statusClass + '"></span>' + a.InvoiceStatus + '</div></td> <td class="TotAmt">' + a.TotAmt + '</td> <td class="PaidAmt">' + a.PaidAmt + '</td> <td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td> <td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td> <td class="famt">' + famt + '</td> <td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td> <td class="CreatedBy">' + a.CreatedBy + '</td> <td class="duedate">' + formatDatetoIST(a.duedate) + '</td>'
                                    html += '<td class="ClientGST">' + ClientGSTNo + ' </td>'
                                    html += '<td class="ClientPAN">' + ClientPanNo + ' </td>'
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:left;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>';
                                        html += '<ul class="action-ul"><li><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" style="' + shareinvoiceclientcss + '" data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript:void()"><span><i style="' + shareinvoiceclientcss + '"><img src="/newassets/img/share-icon.png" /></i></span></a></li>';
                                        html += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="32" width="32"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';
                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '<li><a class="" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Amend Invoice"><img src="/newassets/img/plus-circle.png" />Amend Invoice</span></a></li>';
                                            }
                                            html += '<li><div style="cursor:pointer" class="" id="cancelinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Cancel Invoice"><img src="/newassets/img/x-circle.png" /> Cancel Invoice</span> </div></li>';
                                        }
                                        html += '<li><div class="" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Recurring Invoice"><img src="/newassets/img/refresh-ccw-05.png" /> Recurring Invoice</span> </div></li>';



                                    }

                                    html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span title="Share as Mail"><img src="/newassets/img/mail-01.png"> Share as Mail</span></div></li>'

                                    //html += '<li><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a><li>';
                                    //for (var i = 1; i <= a.AmendCount; i++) {
                                    //    html += '<li><a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a><li>';
                                    //}
                                    html += '<li><div class="" style="cursor:pointer" id="dvVersionHistory" originalInvId="' + a.OriginalInvoiceNo + '" versionName="' + a.InvoiceNo + '" InvoiceId="' + a.id + '"><span style="cursor: pointer;" title="Version History"><img src="/newassets/img/versionHi.png" /> Version History</span> </div></li>';

                                    html += "</ul></div></li></ul>";
                                    html += '</td ></tr >';
                                }
                                else {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + '';
                                    //html += '<div class="pull-right">'
                                    //html += '<div class="btn-group" >'
                                    //html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                    //html += '<span><img src="/newassets/img/refresh-cw-04.png"></span>'
                                    //html += '<span class="sr-only">Toggle Dropdown</span>'
                                    //html += '</button>'
                                    //html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    //html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    //var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    //html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    //html += '</tbody>'
                                    //html += '</table>'
                                    //html += '</div>'
                                    //html += '</div>'
                                    html += '</td>';
                                    html += '<td class="ClientName">' + a.ClientName + ' </td>';
                                    if (a.MatterName != null || a.MatterName != "") {
                                        html += '<td class="invMatterName"><a style="color:#0059c1;" id="transferpage" href="javascript:void()" sno=' + a.matterid + '>' + a.MatterName + '</a></td>';
                                    } else {
                                        html += '<td class="invMatterName">' + a.MatterName + ' </td>';
                                    }
                                    html += '<td class="invName">' + a.UserNameInvoice + ' </td> <td class="invdate">' + formatDatetoIST(a.invdate) + '</td> <td class="Invoicetype">' + a.Invoicetype + '</td> </td><td class="InvoiceStatus"><div class="status_badge"><span class="' + statusClass + '"></span>' + a.InvoiceStatus + '</div></td> <td class="TotAmt">' + a.TotAmt + '</td> <td class="PaidAmt">' + a.PaidAmt + '</td> <td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td> <td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td> <td class="famt">' + famt + '</td> <td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td> <td class="CreatedBy">' + a.CreatedBy + '</td> <td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    html += '<td class="ClientGST">' + ClientGSTNo + ' </td>'
                                    html += '<td class="ClientPAN">' + ClientPanNo + ' </td>'
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:left;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>';
                                        html += '<ul class="action-ul"><li><div name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript:void()"><i style="' + shareinvoiceclientcss + '"><img src="/newassets/img/share-icon.png" /></i></div></li>';
                                        html += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="32" width="32"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';
                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '<li><div class="" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Amend Invoice"><img src="/newassets/img/plus-circle.png" /> Amend Invoice</span> </div></li>';
                                            }
                                            html += '<li><div style="cursor:pointer" class="" id="cancelinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Cancel Invoice"><img src="/newassets/img/x-circle.png" /> Cancel Invoice</span></div></li>';

                                        }
                                        html += '<li><div class="" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Recurring Invoice"><img src="/newassets/img/refresh-ccw-05.png" /> Recurring Invoice</span> </div></li>';
                                        html += '<li> <div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="d" style="' + shareinvoiceclientcss + '" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span title="Share as Mail"><img src="/newassets/img/mail-01.png"> Share as Mail</span></div><li>';

                                        // html += '</td>';
                                    }
                                    // html += '<td>';
                                  


                                    html += '<li><div class="" style="cursor:pointer" id="dvVersionHistory" originalInvId="' + a.OriginalInvoiceNo + '" versionName="' + a.InvoiceNo + '" InvoiceId="' + a.id + '"><span style="cursor: pointer;" title="Version History"><img src="/newassets/img/versionHi.png" /> Version History</span> </div></li>';

                                    //html += '<li><div name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold;">O</div></li>';
                                    //for (var i = 1; i <= a.AmendCount; i++) {
                                    //    html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</div></li>';
                                    //}
                                    html += "</ul></div></li></ul>";
                                    html += '</td></tr>';
                                }
                            }
                            else {
                                if (roleids == 1) {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + '';
                                    //html += '<div class="pull-right">'
                                    //html += '<div class="btn-group" >'
                                    //html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn-viewdv  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                    //html += '<span><img src="/newassets/img/refresh-cw-04.png"></span>'
                                    //html += '<span class="sr-only">Toggle Dropdown</span>'
                                    //html += '</button>'
                                    //html += '<div class="dropdown-menu" style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    //html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    //var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    //html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    //html += '</tbody>'
                                    //html += '</table>'
                                    //html += '</div>'
                                    //html += '</div>'
                                    html += '</td>';
                                    html += '<td class="ClientName">' + a.ClientName + ' </td>';
                                    if (a.MatterName != null || a.MatterName != "") {
                                        html += '<td class="invMatterName"><a style="color:#0059c1;"  id="transferpage" href="javascript:void()" sno=' + a.matterid + '>' + a.MatterName + '</a></td>';
                                    } else {
                                        html += '<td class="invMatterName">' + a.MatterName + ' </td>';
                                    }
                                    html += '<td class="invName">' + a.UserNameInvoice + ' </td> <td class="invdate">' + formatDatetoIST(a.invdate) + '</td> <td class="Invoicetype">' + a.Invoicetype + '</td> </td><td class="InvoiceStatus"><div class="status_badge"><span class="' + statusClass + '"></span>' + a.InvoiceStatus + '</div></td><td class="TotAmt">' + a.TotAmt + '</td> <td class="PaidAmt">' + a.PaidAmt + '</td> <td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td> <td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td> <td class="famt">' + famt + '</td> <td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td> <td class="CreatedBy">' + a.CreatedBy + '</td> <td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    html += '<td class="ClientGST">' + ClientGSTNo + ' </td>'
                                    html += '<td class="ClientPAN">' + ClientPanNo + ' </td>'
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:left;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>'

                                        html += '<ul class="action-ul"><li><a style="cursor:pointer" class="" id="payinvoice" dataval="' + a.id + '"><img src="/newassets/img/r-icon.png" /></a>';
                                        html += '<li><a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="d" style="' + shareinvoiceclientcss + '"  data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript: void ()"><span><i style="' + shareinvoiceclientcss + '"><img src="/newassets/img/share-icon.png" /></i></span></a></li>';
                                        html += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="32" width="32"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';


                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '<li><div class="" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Amend Invoice"><img src="/newassets/img/plus-circle.png" /> Amend Invoice</span> </div></li>';
                                            }
                                            html += '<li><div style="cursor:pointer" class="" id="cancelinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Cancel Invoice"><img src="/newassets/img/x-circle.png" /> Cancel Invoice</span>  </div></li>';
                                        }

                                        html += '<li><div class="" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '"> <span style="cursor: pointer;" title="Recurring Invoice"><img src="/newassets/img/refresh-ccw-05.png" /> Recurring Invoice</span></div></li>';
                                        html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-amend="' + a.AmendCount + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span title="Share as Mail"><img src="/newassets/img/mail-01.png"> Share as Mail</span></div></li>';

                                        html += '<li><div class="" style="cursor:pointer" id="dvVersionHistory" originalInvId="' + a.OriginalInvoiceNo + '" versionName="' + a.InvoiceNo + '" InvoiceId="' + a.id + '"><span style="cursor: pointer;" title="Version History"><img src="/newassets/img/versionHi.png" /> Version History</span> </div></li>';

                                        //html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</div><li>'
                                        //for (var i = 1; i <= a.AmendCount; i++) {
                                        //    html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</div></li>';
                                        //}

                                        html += "</ul></div></li></ul>";
                                        html += '</td>';
                                    }

                                    //html += '<td>&nbsp;|&nbsp'
                                    //html += ' | ';
                                    //for (var i = 1; i <= a.AmendCount; i++) {
                                    //    html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                    //}
                                    //html += '</td></tr>';
                                    html += '</tr>';
                                }
                                else {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + '';
                                    //html += '<div class="pull-right">'
                                    //html += '<div class="btn-group" >'
                                    //html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                    //html += '<span><img src="/newassets/img/refresh-cw-04.png"></span>'
                                    //html += '<span class="sr-only">Toggle Dropdown</span>'
                                    //html += '</button>'
                                    //html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    //html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    //var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    //html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    //html += '</tbody>'
                                    //html += '</table>'
                                    //html += '</div>'
                                    //html += '</div>'
                                    html += '</td>';
                                    html += '<td class="ClientName">' + a.ClientName + ' </td>';
                                    if (a.MatterName != null || a.MatterName != "") {
                                        html += '<td class="invMatterName"><a style="color:#0059c1;" id="transferpage" href="javascript:void()" sno=' + a.matterid + '>' + a.MatterName + '</a></td>';
                                    } else {
                                        html += '<td class="invMatterName">' + a.MatterName + ' </td>';
                                    }
                                    html += '<td class="invName">' + a.UserNameInvoice + ' </td> <td class="invdate">' + formatDatetoIST(a.invdate) + '</td> <td class="Invoicetype">' + a.Invoicetype + '</td> </td><td class="InvoiceStatus"><div class="status_badge"><span class="' + statusClass + '"></span>' + a.InvoiceStatus + '</div></td><td class="TotAmt">' + a.TotAmt + '</td> <td class="PaidAmt">' + a.PaidAmt + '</td> <td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td> <td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td> <td class="famt">' + famt + '</td> <td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td> <td class="CreatedBy">' + a.CreatedBy + '</td> <td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    html += '<td class="ClientGST">' + ClientGSTNo + ' </td>'
                                    html += '<td class="ClientPAN">' + ClientPanNo + ' </td>'
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:left;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>'

                                        html += '<ul class="action-ul"><li><a style="cursor:pointer" class="" id="payinvoice" dataval="' + a.id + '"><img src="/newassets/img/r-icon.png" /></a>';
                                        html += '<li><a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="d" style="' + shareinvoiceclientcss + '"  data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript: void ()"><span><i style="' + shareinvoiceclientcss + '"><img src="/newassets/img/share-icon.png" /></i></span></a></li>';
                                        html += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="32" width="32"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';


                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '<li><div class="" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Amend Invoice"><img src="/newassets/img/plus-circle.png" /> Amend Invoice</span> </div></li>';
                                            }
                                            html += '<li><div style="cursor:pointer" class="" id="cancelinvoice" dataval="' + a.id + '"><span style="cursor: pointer;" title="Cancel Invoice"><img src="/newassets/img/x-circle.png" /> Cancel Invoice</span>  </div></li>';
                                        }

                                        html += '<li><div class="" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '"> <span style="cursor: pointer;" title="Recurring Invoice"><img src="/newassets/img/refresh-ccw-05.png" /> Recurring Invoice</span></div></li>';
                                        html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-amend="' + a.AmendCount + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span title="Share as Mail"><img src="/newassets/img/mail-01.png"> Share as Mail</span></div></li>';

                                        //html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</div><li>'
                                        //for (var i = 1; i <= a.AmendCount; i++) {
                                        //    html += '<li><div name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</div></li>';
                                        //}
                                        html += '<li><div class="" style="cursor:pointer" id="dvVersionHistory" originalInvId="' + a.OriginalInvoiceNo + '" versionName="' + a.InvoiceNo + '" InvoiceId="' + a.id + '"><span style="cursor: pointer;" title="Version History"><img src="/newassets/img/versionHi.png" /> Version History</span> </div></li>';
                                        html += "</ul></div></li></ul>";
                                        html += '</td>';
                                    }
                                    //html += '<td>&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d"  style="' + shareinvoiceclientcss + '" data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript:void()"><span><i style="' + shareinvoiceclientcss + '"><img src="/newassets/img/share-icon.png" /></i></span></a>&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span title="Share as Mail"><img src="/newassets/img/mail-01.png"> Share as Mail</span></div>';
                                    //html += ' | <a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                    //for (var i = 1; i <= a.AmendCount; i++) {
                                    //    html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                    //}
                                    //html += '</td></tr>';
                                }
                            }
                        }
                    });
                    $("#assignuserdata").append(html);
                    $("#searchinvoice").removeAttr("disabled");
                    //For Calculating the header ammount.
                    calculateTotalamt(8);
                    calculateTotalOutStanding(7);
                    calculateTotaldue(11);
                    $('#Invoicepagination').show();
                    $('#paymentdetaisnoresultdiv').hide();
                    closeload();
                }
                else {
                    $('#Invoicepagination').hide();
                    $('#paymentdetaisnoresultdiv').show();
                    closeload();
                }
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            try {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
            catch
            {
            }
            closeload();
            return false;
        });
    }


    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    //$(document).on('click', '#ipaginate', function () {
    //    ipageindex = $(this).attr("index");
    //    loadInvoicedata(ipageindex);
    //});
    //$(document).on('click', '#igetdatabypagenum', function () {
    //    pageindex = $("#ipagnumvalue").val();
    //    if (pageindex != "undefined") {
    //        if (Math.sign(pageindex) == 1) {
    //            var pageindesx = $("#isotopage").text();
    //            if (pageindex <= parseInt(pageindesx)) {
    //                loadInvoicedata(pageindex);
    //            }
    //            else {
    //                alert("Please enter a valid page number.");
    //            }
    //        }
    //        else {
    //            alert("Please enter a valid page number.");
    //        }
    //    }
    //});

    //Redirect to Matter List
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/StandardCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });

    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    //function renderPagination(pageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = pageindex;
    //    totalPageRec = totdata;
    //    let paginationHtml = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtml += `<button type="button" class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (pageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtml += `<button type="button" class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtml += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtml += `<button type="button" class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers").html(paginationHtml);
    //    $("#prev").toggleClass("disabled", pageindex === 1);
    //    $("#next").toggleClass("disabled", pageindex === totdata);
    //    isRenderPage = true;
    //}
    function renderPagination(pageindex, totdata) {
        debugger
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

            let start = Math.max(2, pageindex - delta);
            let end = Math.min(totPages - 1, pageindex + delta);
            if (pageindex <= maxVisible) {
                start = 2;
                end = maxVisible;
            }

            if (pageindex >= totPages - maxVisible + 1) {
                start = totPages - maxVisible + 1;
                end = totPages - 1;
            }
            if (start > 2) paginationHtml += `<span class="dots">...</span>`;
            for (let i = start; i <= end; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
            paginationHtml += `<button class="page-btn ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#pageNumbers").html(paginationHtml);
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totPages);
        isRenderPage = true;
    }


    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadInvoicedata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    isRenderPage = false;
    //    $("#txtgopage").val("");
    //    loadInvoicedata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function (e) {
        e.preventDefault();
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
       // loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    $(document).on("click", "#prev", function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        //loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        //loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#divGo", function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > totalRecordCountD) {
            setPageNo = 1;
            alert("Please enter a valid page number.");
            return false;
        }
        //loadflag = true;
        isRenderPage = false;
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
});
function calculateTotalamt(index) {
    var total = 0;
    $('#invlist tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total += value;
        }
    });
    $('#totcolamt').text(total);
}
function calculateTotalOutStanding(index) {
    var total1 = 0;
    $('#invlist tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total1 += value;
        }
    });
    $('#totoutamt').text(total1);
}
function calculateTotaldue(index) {
    var total2 = 0;
    $('#invlist tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total2 += value;
        }
    });
    $('#totoverdueamt').text(total2);
}

$(document).on('click', '#dvVersionHistory', function () {
    var versionname = this.getAttribute('versionname');
    var VersionInvoiceId = this.getAttribute('invoiceid');
    var OriginalInvoiceNo = this.getAttribute('originalInvId');
    BindInvoiceVersionHistory(versionname, VersionInvoiceId, OriginalInvoiceNo);
});
function BindInvoiceVersionHistory(versionname, VersionInvoiceId, OriginalInvoiceNo) {
    $('#versionDetailModel').modal({ show: true });
    $("#bindInvoiceData").html("");
    var versionname = versionname;
    var InvoiceId = VersionInvoiceId;
    var formData = new FormData();
    formData.append("versionname", versionname);
    formData.append("InvoiceId", InvoiceId);
    formData.append("OriginalInvoiceNo", OriginalInvoiceNo);
    $.ajax({
        async: true,
        url: '/api/OcrInvoiceApi/LoadInvoiceVersionHistory',
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            var obj = JSON.parse(response.Data);
            var list = obj;
            var html = "";
            var cnt = 0;
            var srNo = 1;
            $.each(obj, function (i, a) {
                html = "";
                var filename = obj[i].InvoiceNo;
                filename = filename.replace(/\//g, "_");
                if (obj[i].IsAmend != 1) {
                    filename = filename + "_" + "Original";
                }
                html += '<tr>'
                html += "<td>" + srNo + "</td>"
                html += "<td>" + obj[i].CreatedBy + "</td>"
                html += "<td>" + formatToDDMMYYYY(obj[i].Inovicedate) + "</td>"
                html += "<td>" + filename + "</td>"
                if (cnt == 0) {
                    html += '<td><a name="' + obj[i].InvoiceNo + '" data-val="' + obj[i].id + '" data-type="o" id="viewinvoicedata" href="javascript: void ()" ><img src="/newassets/img/download-01.png"></a></td>'
                    cnt = cnt + 1;
                }
                else {
                    html += '<td><a name="' + obj[i].InvoiceNo + '" data-val="' + obj[i].id + '" data-type="' + cnt + '" id="viewinvoicedata" href="javascript:void()"><img src="/newassets/img/download-01.png"></a></td>'
                    cnt = cnt + 1;
                }
                html += '</tr>'
                srNo = srNo + 1;
                $("#bindInvoiceData").append(html);
            });
           // $("#bindInvoiceData").html("").append(html);
        },
        failure: function (response) {

        },
        error: function (response) {

        }
    });
}

function formatToDDMMYYYY(dateString) {
    var date = new Date(dateString);

    if (isNaN(date)) return ''; // Handle invalid date

    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return day + "/" + month + "/" + year;
}