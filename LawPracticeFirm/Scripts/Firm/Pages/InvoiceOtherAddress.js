$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#multipleaddress", function () {
        window.location = encodeURI("/" + fcode + "/bill/CreateinvAddress");
    });
    $(document).on("click", "#editaddress", function () {
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/bill/CreateinvAddress";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
});

/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}

/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
loadinvaddress();

/*Load invoice address*/
function loadinvaddress() {
    try {
        var html = '';
        $("#assignuserdata").html("");
        var formData = new FormData();
        openload();
        //read assign using list
        qty1 = 0;
        var status =
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
                    $.each(obj, function (i, a) {
                        qty1 = qty1 + 1;
                        if (a.Isactive == "0") {
                            status = "Invisible";
                        }
                        else {
                            status = "Visible";
                        }
                        var newids = "";
                        newids = a.Id;
                        html += '<tr><td>' + qty1 + '</td><td><a>' + a.Address + '</a></td><td>' + a.State + ' </td><td><span name=' + a.Phoneno + '>' + a.Phoneno + '</span></td><td><span name=' + a.Email + '>' + a.Email + '</span></td><td>' + a.website + '</td><td>' + a.GSTNo + '</td><td>' + a.Pan.toUpperCase() + '</td><td>' + a.Sac + '</td><td> ' + status + '</td><td><a href="javascript:void()" id="editaddress" data-val="' + newids + '"><span><img src="/newassets/img/edit-icon.png" height="32" width="32" /></span></a></td></tr>';
                    });
                    $("#assignuserdata").append(html);
                    getPagination1('#ocrlist');
                    closeload();
                },
                failure: function (response1) {
                    alert(response1.responseText);
                    closeload();
                },
                error: function (response1) {
                    alert(response1.responseText);
                    closeload();
                } 
            });
    }
    catch (er) {
        alert(er.message);
        closeload();
    }
}
function getPagination1(table) {
    $('.pagination').html('');						// reset pagination
    var trnum = 0;									// reset tr counter
    var maxRows = 15;
    //alert(maxRows);
    // alert(maxRows);// get Max Rows from select option
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
        // alert(pageNum);// get it's number
        var trIndex = 0;							// reset tr counter
        $('.pagination li').removeClass('active');	// remove active class from all li
        $(this).addClass('active');					// add active class to the clicked
        $('#ocrlist tbody tr').each(function () {		// each tr in table not the header
            trIndex++;
            // alert(trIndex);
            // tr index counter
            // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
            if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
                $(this).hide();
            } else { $(this).show(); } 				//else fade in
        }); 										// end of for each tr in table
    });										// end of on click pagination list
    // end of on select change
    // END OF PAGINATION
}
