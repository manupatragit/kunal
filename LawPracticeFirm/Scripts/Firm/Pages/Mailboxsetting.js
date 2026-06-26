/**
 * Get pagination
 * @param {any} table
 */
function getPagination1(table) {
    $('.pagination').html('');						// reset pagination
    var trnum = 0;									// reset tr counter
    var maxRows = 15;
    //alert(maxRows);
    // alert(maxRows);// get Max Rows from select option
    var totalRows = $(table + ' tbody tr ').length;
    // alert(totalRows);// numbers of rows
    $('#mailboxserver tbody tr').each(function () {			// each TR in  table and not the header
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
        $('#mailboxserver tbody tr').each(function () {		// each tr in table not the header
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
$(document).ready(function () {
    function openload() {
        $('#myOverlay1').css("display", "block");
    }
    function closeload() {
        $('#myOverlay1').css("display", "none");
    }
    var searchvar = "";
    loadmailboxsetting();
    openload();
    /*Load mailbox setting*/
    function loadmailboxsetting() {
        var html = '';
        $("#assignuserdata").html("");
        var formData = new FormData();
        formData.append("search", EncodeText(searchvar));
        //read assign using list
        qty1 = 0;
        var d1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/MailBoxApi/Loadmailboxserver",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    if (String(a.IsDefault) == "1") {
                        html += '<tr><td>' + qty1 + '</td><td class="mserver"><a>' + a.MailServerName + '</a></td><td class="msmtpa">' + a.SmtpAddress + ' </td><td class="msmtpp">' + a.SmtpPort + '</td><td class="mimapa">' + a.ImapAddress + ' </td><td class="mimapp">' + a.ImapPort + ' </td><td class="mpopa">' + a.PopAddress + ' </td><td class="mpopp">' + a.PopPort + ' </td><td class="mdate"><span name=' + a.date_time + '>' + formatDatetoIST(a.date_time) + '</span></td><td class="maction" >&nbsp;&nbsp;<a data-val="' + a.Id + '" id="removmailboxaccount" class=btn-sm btn-danger" title="Remove mailbox user account"><span class="glyphicon glyphicon-user" style="color:black" ></span></a></td></tr>';
                    }
                    else {
                        html += '<tr><td>' + qty1 + '</td><td class="mserver"><a>' + a.MailServerName + '</a></td><td class="msmtpa">' + a.SmtpAddress + ' </td><td class="msmtpp">' + a.SmtpPort + '</td><td class="mimapa">' + a.ImapAddress + ' </td><td class="mimapp">' + a.ImapPort + ' </td><td class="mpopa">' + a.PopAddress + ' </td><td class="mpopp">' + a.PopPort + ' </td><td class="mdate"><span name=' + a.date_time + '>' + formatDatetoIST(a.date_time) + '</span></td><td class="maction" ><a data-val="' + a.Id + '" id="editmailboxserver" class=" btn-sm btn-info" title="Edit mailbox Server"><span class="glyphicon glyphicon-edit" style="color:black"  ></span> </a>&nbsp;&nbsp;<a data-val="' + a.Id + '" id="removmailboxserver" class=" btn-sm btn-danger" title="Remove mailbox server"><span class="glyphicon glyphicon-trash"  style="color:black" ></span> </a>&nbsp;&nbsp;<a data-val="' + a.Id + '" id="removmailboxaccount" class=" btn-sm btn-danger" title="Remove mailbox user account"><span class="glyphicon glyphicon-user" style="color:black"  ></span></a></td></tr>';
                    }
                });
                $("#assignuserdata").append(html);
                $(" input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                getPagination1('#mailboxserver');
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        $.when(d1).then(function (x) {
            closeload();
        });
    }
    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#editmailboxserver", function () {
        var token = $(this).attr("data-val");
        window.location = encodeURI("/" + fcode + "/firm/EditMailboxserver?data=true&token=" + token);
    });
    $(document).on("click", "#removmailboxaccount", function () {
        var tokenid = $(this).attr("data-val");
        var cnfrm = confirm("Are you sure to remove mailbox Account ?");
        if (cnfrm) {
            var formData = new FormData();
            formData.append("token", EncodeText(tokenid));
            qty1 = 0;
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/MailBoxApi/RemoveMailBoxAccount",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    new PNotify({
                        title: 'Success!',
                        text: 'Mailbox User account removed successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loadmailboxsetting();
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
    /*Remove mailbox server*/
    $(document).on("click", "#removmailboxserver", function () {
        var tokenid = $(this).attr("data-val");
        var cnfrm = confirm("Are you sure to remove mailbox server ?");
        if (cnfrm) {
            var formData = new FormData();
            formData.append("token", EncodeText(tokenid));
            qty1 = 0;
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/MailBoxApi/RemoveMailBoxServer",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    new PNotify({
                        title: 'Success!',
                        text: 'Mailbox server removed successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loadmailboxsetting();
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

    /*Save mailbox setting*/
    $("#savemailboxsetting").click(function () {
        var mservername = $("#mservername").val();
        var smtpserver = $("#smtpserver").val();
        var smtpport = $("#smtpport").val();
        var imapserver = $("#imapserver").val();
        var imapport = $("#imapport").val();
        var popserver = $("#popserver").val();
        var popport = $("#popport").val();
        if (mservername == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter Mail Server Name',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (smtpserver == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter SMTP Server Address',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (smtpport == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter SMTP Port',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (imapserver == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter IMAP Server Address',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (imapport == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter IMAP Port',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (popserver == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter POP Server Address',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (popport == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Enter POP Port',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        var formData = new FormData();
        formData.append("mservername", EncodeText(mservername));
        formData.append("smtpserver", EncodeText(smtpserver));
        formData.append("smtpport", EncodeText(smtpport));
        formData.append("imapserver", EncodeText(imapserver));
        formData.append("imapport", EncodeText(imapport));
        formData.append("popserver", EncodeText(popserver));
        formData.append("popport", EncodeText(popport));
        openload();
        $.ajax({
            url: '/api/MailBoxApi/SaveMailBoxSettings',
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
                            text: 'Mail server name already exist.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else {
                        $("#fileupload")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: 'Mail server addedd successfully',
                            type: 'success',
                            delay: 3000
                        });
                        loadmailboxsetting();
                    }
                    //alert(datas);
                }
                else {
                    // //alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
});
