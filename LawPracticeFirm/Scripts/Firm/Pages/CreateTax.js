var searchvar = "";
loadtaxdata();
/*Load tax details*/
function loadtaxdata() {
    var html = '';
    $("#assignuserdata").html("");
    var formData = new FormData();
    formData.append("search", EncodeText(searchvar));
    //read assign using list
    qty1 = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/OcrInvoiceApi/Loadtaxdata",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var datas1 = JSON.stringify(response1);
            var obj = JSON.parse(response1.Data);
            $.each(obj, function (i, a) {
                qty1 = qty1 + 1;
                html += '<tr><td><a>' + a.taxtype + '</a></td><td>' + a.tax + ' %</td><td>' + a.UserName + '</td><td>&nbsp;&nbsp;<a data-val="' + enctypesingle(a.Id) + '" id="removeocrfile"  title="Remove file"><span><img src="/newassets/img/deletecasesingle-icon.png" height="32" width="32" /></span>&nbsp; </a></td></tr>';
            });
            $("#assignuserdata").append(html);
            getPagination1('#ocrlist');
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
/*Get pagination*/
function getPagination1(table) {
    $('.pagination').html('');						// reset pagination
    var trnum = 0;									// reset tr counter
    var maxRows = 10;
    var totalRows = $(table + ' tbody tr ').length;
    // alert(totalRows);// numbers of rows
    $('#ocrlist tbody tr').each(function () {			// each TR in  table and not the header
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
        var trIndex = 0;							// reset tr counter
        $('.pagination li').removeClass('active');	// remove active class from all li
        $(this).addClass('active');					// add active class to the clicked
        $('#ocrlist tbody tr').each(function () {		// each tr in table not the header
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
$(document).ready(function () {

    /*Remove OCR file*/
    $(document).on("click", "#removeocrfile", function () {
        var tokenid = $(this).attr("data-val");
        var cnfrm = confirm("Are you sure to remove tax entry ?");
        if (cnfrm) {
            var formData = new FormData();
            formData.append("token", tokenid);
            qty1 = 0;
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/OcrInvoiceApi/RemoveInvoicetax",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    new PNotify({
                        title: 'Success!',
                        text: ' Tax removed successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loadtaxdata();
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
    function openload1() {
        // $('#myOverlay1').css("display", "block");
    }
    function closeload() {
        // $('#myOverlay1').css("display", "none");
    }
    /*Save case file*/
    $("#savecasefile").click(function () {
        var taxname = $("#taxname").val();
        var tax = $("#tax").val();
        var sdate = $("#sdate").val();
        var edate = $("#edate").val();
        if (taxname == "") {
            new PNotify({
                title: 'Warning!',
                text: ' Please select the type of tax.',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (tax == "") {
            new PNotify({
                title: 'Warning!',
                text: ' Please enter applicable tax rate. ',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        var date1 = new Date();
        var date2 = new Date();
        var formData = new FormData();
        formData.append("taxname", EncodeText(taxname));
        formData.append("tax", EncodeText(tax));
        formData.append("sdate", EncodeText(date1));
        formData.append("edate", EncodeText(date2));
        openload1();
        $.ajax({
            url: '/api/OcrInvoiceApi/PostSaveInvoicetax',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "alreadyexist") {
                        new PNotify({
                            title: 'warning!',
                            text: 'Multiple tax slab is not allowed',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else {
                        $("#fileupload")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: ' Tax has been added successfully.',
                            type: 'success',
                            delay: 3000
                        });
                        $('#taxname').val('');
                        $('#tax').val('');
                        loadtaxdata();
                    }
                }
                else {
                    // alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
});