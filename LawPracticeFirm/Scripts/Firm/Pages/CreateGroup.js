/**Open loader */
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).ready(function () {
    setInterval(function () {
        var temp = localStorage.getItem("groupmessage");
        if (temp != "") {
            loadgroupdata();
            localStorage.setItem("groupmessage", "");
        }
    }, 3000);
    var fcode = localStorage.getItem("FirmCode");
    loadgroupdata();
    /*Load group data*/
    function loadgroupdata() {
        var html = '';
        $("#assignuserdata").html("");
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/MessageGrouplist",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td>' + qty1 + '</td><td><a>' + a.Groupname + '</a></td><td>' + a.auser + ' </td><td><span name=' + a.date_time + '>' + formatDatetoIST(a.date_time) + '</span></td><td>' + a.Username + '</td><td>&nbsp;&nbsp;<a data-val="' + enctypesingle(a.Id) + '" id="editgroup" class="btn-sm btn-mail btn-info" title="Edit Group"><span class="glyphicon glyphicon-edit" ></span>&nbsp; </a>&nbsp;&nbsp;<a data-val="' + enctypesingle(a.Id) + '" id="removeocrfile" class="btn-sm btn-danger" title="Remove Group"><span class="glyphicon glyphicon-trash" ></span>&nbsp; </a></td></tr>';
                });
                $("#assignuserdata").append(html);
                closeload();
                getPagination1('#ocrlist');
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
    }
    /*Pagination*/
    function getPagination1(table) {
        $('.pagination').html('');						// reset pagination
        var trnum = 0;									// reset tr counter
        var maxRows = 15;
        var totalRows = $(table + ' tbody tr ').length;
        $('#ocrlist tbody tr').each(function () {			// each TR in  table and not the header
            trnum++;
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
                // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
                    $(this).hide();
                } else { $(this).show(); } 				//else fade in
            }); 										// end of for each tr in table
        });										// end of on click pagination list
        // end of on select change
        // END OF PAGINATION
    }

    //save data
    $(document).on("click", "#removeocrfile", function () {
        var tokenid = $(this).attr("data-val");
        var cnfrm = confirm("Are you sure to remove this group ?");
        if (cnfrm) {
            var formData = new FormData();
            formData.append("token", tokenid);
            qty1 = 0;
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveMessagegroup",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    new PNotify({
                        title: 'Success!',
                        text: ' Group removed successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loadgroupdata();
                    closeload();
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
        }
    });

    /*Edit group*/
    $(document).on("click", "#editgroup", function () {
        openload();
        var tokenid = $(this).attr("data-val");
        var url1 = "/firm/editgroup/?status=true&token=" + tokenid;
        $('.mymodels5').load(url1, function (result1) {
            closeload();
            $('#myModal5').modal({ show: true });
        });
    });

    /*Save message form*/
    $('form[id="savemessageform"]').validate({
        submitHandler: function (form) {
            var formData = new FormData();
            var groupname = $('#groupname').val();
            var user = $('#select-user').val();
            if (user == null) {
                new PNotify({
                    title: 'Warning!',
                    text: 'Please Select users',
                    type: 'error',
                    delay: 3000
                });
                return false;
            }
            formData.append("groupname", groupname);
            formData.append("user", user);
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/CreateGroup", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        $("#savemessageform")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: 'Group Created Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        var $select = $('#select-user').selectize();
                        var control = $select[0].selectize;
                        control.clear();
                        loadgroupdata();
                        closeload();
                    }, //End of AJAX Success function
                    failure: function (data) {
                        alert(data.responseText);
                        closeload();
                    }, //End of AJAX failure function
                    error: function (data) {
                        alert(data.responseText);
                        closeload();
                    } //End of AJAX error function
                });
        }
    });
});
