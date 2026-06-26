$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    /*View invoice data*/
    $(document).on("click", "#viewinvoicedata", function () {
        var token = $(this).attr("data-val");
        var invtype = $(this).attr("data-type");
        var host = window.location.host
        var url = "/" + fcode + "/Bill/PrintInvoiceDetail?data=true&token=" + token + "&invtype=" + invtype;
        window.open("" + url + "", "_blank");
    });

    /*Pay invoice details*/
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
    $(document).on("click", "#editinvoice", function () {
        var token = $(this).attr("dataval");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Bill/EditInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
});
loadInvoicedata();
/*Load invoice details*/
function loadInvoicedata() {
    var html = '';
    var formData = new FormData();
    //read assign using list
    qty1 = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/OcrInvoiceApi/LoadInvoicedata",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var datas1 = JSON.stringify(response1);
            var obj = JSON.parse(response1.Data);
            $.each(obj, function (i, a) {
                qty1 = qty1 + 1;
                var famt = parseFloat(a.TotAmt) - parseFloat(a.PaidAmt);
                if (roleids == "3") {
                    if (famt == "0") {
                        html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.ClientName + ' </td><td><span name=' + a.invdate + '>' + formatDatetoIST(a.invdate) + '</span></td><td>' + a.TotAmt + '</td><td>' + famt + '</td><td>' + a.CreatedBy + '</td><td><span name=' + a.Inovicedate + '>' + formatDatetoIST(a.Inovicedate) + '</span></td><td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata"  href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                    }
                    else {
                        html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.ClientName + ' </td><td><span name=' + a.invdate + '>' + formatDatetoIST(a.invdate) + '</span></td><td>' + a.TotAmt + '</td><td>' + famt + '</td><td>' + a.CreatedBy + '</td><td><span name=' + a.Inovicedate + '>' + formatDatetoIST(a.Inovicedate) + '</span></td><td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                    }
                }
                else {
                    if (famt == "0") {
                        if (IsEdit == 1 && roleid == 1) {
                            html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.ClientName + ' </td><td><span name=' + a.invdate + '>' + formatDatetoIST(a.invdate) + '</span></td><td>' + a.TotAmt + '</td><td>' + famt + '</td><td>' + a.CreatedBy + '</td><td><span name=' + a.Inovicedate + '>' + formatDatetoIST(a.Inovicedate) + '</span></td><td><a class="" id="editinvoice" dataval="' + a.id + '">&nbsp; Edit &nbsp; </a></td><td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                        }
                        else {
                            html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.ClientName + ' </td><td><span name=' + a.invdate + '>' + formatDatetoIST(a.invdate) + '</span></td><td>' + a.TotAmt + '</td><td>' + famt + '</td><td>' + a.CreatedBy + '</td><td><span name=' + a.Inovicedate + '>' + formatDatetoIST(a.Inovicedate) + '</span></td><td></td><td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                        }
                    }
                    else {
                        if (IsEdit == 1 && roleid == 1) {
                            html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.ClientName + ' </td><td><span name=' + a.invdate + '>' + formatDatetoIST(a.invdate) + '</span></td><td>' + a.TotAmt + '</td><td>' + famt + '</td><td>' + a.CreatedBy + '</td><td><span name=' + a.Inovicedate + '>' + formatDatetoIST(a.Inovicedate) + '</span></td><td><a class="" id="editinvoice" dataval="' + a.id + '">&nbsp; Edit &nbsp; </a>&nbsp;&nbsp;&nbsp;<a class="" id="payinvoice" dataval="' + a.id + '">&nbsp; Pay &nbsp; </a></td><td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                        }
                        else {
                            html += '<tr><td>' + qty1 + '</td><td>' + a.InvoiceNo + '</td><td>' + a.ClientName + ' </td><td><span name=' + a.invdate + '>' + formatDatetoIST(a.invdate) + '</span></td><td>' + a.TotAmt + '</td><td>' + famt + '</td><td>' + a.CreatedBy + '</td><td><span name=' + a.Inovicedate + '>' + formatDatetoIST(a.Inovicedate) + '</span></td><td>&nbsp;&nbsp;&nbsp;<a class="" id="payinvoice" dataval="' + a.id + '">&nbsp; Pay &nbsp; </a></td><td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                        }
                    }
                }
            });
            $("#assignuserdata").append(html);
            getPagination1('#invlist');
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
function getPagination1(table) {
    $('.pagination').html('');						// reset pagination
    var trnum = 0;									// reset tr counter
    var maxRows = 15;
    //alert(maxRows);
    // alert(maxRows);// get Max Rows from select option
    var totalRows = $(table + ' tbody tr ').length;
    // alert(totalRows);// numbers of rows
    $('#invlist tbody tr').each(function () {			// each TR in  table and not the header
        trnum++;
        //alert(trnum);// Start Counter
        if (trnum > maxRows) {						// if tr number gt maxRows
            $(this).hide();							// fade it out
        } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    });											//  was fade out to fade it in
    if (totalRows > maxRows) {						// if tr total rows gt max rows option
        var pagenum = Math.ceil(totalRows / maxRows);
        // alert(pagenum);// ceil total(rows/maxrows) to get ..
        //	numbers of pages
        for (var i = 1; i <= pagenum;) {			// for each page append pagination li
            $('.pagination').append('<li data-page="' + i + '">\
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </li>').show();
        }											// end for i
    } 												// end if row count > max rows
    $('.pagination li:first-child').addClass('active'); // add active class to the first li
    $('.pagination li').on('click', function () {		// on click each page
        var pageNum = $(this).attr('data-page');
        // alert(pageNum);// get it's number
        var trIndex = 0;							// reset tr counter
        $('.pagination li').removeClass('active');	// remove active class from all li
        $(this).addClass('active');					// add active class to the clicked
        $('#invlist tbody tr').each(function () {		// each tr in table not the header
            trIndex++;
            // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
            if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
                $(this).hide();
            } else { $(this).show(); } 				//else fade in
        }); 										// end of for each tr in table
    });										// end of on click pagination list
    // end of on select change
    // END OF PAGINATION
}
