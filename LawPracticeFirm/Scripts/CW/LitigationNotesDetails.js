$(document).ready(function () {
    (async function () {
        openload();
        await BindTotalNotesDetails();
        await BindTotalOrderNotesDetails();
        closeload();
    })();
})
function BindTotalNotesDetails() {
    openload();
    return new Promise(function (resolve, reject) {
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/TotalNotesDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.data.length;
                if (length > 0) {
                    $("#alldatabindCaseNotes tr").remove();
                    response1 = response1.data;
                    $.each(response1, function (i, val) {
                        $("#alldatabindCaseNotes").append(
                            '<tr>' +
                            '<td><a href="javascript:redirectToUrl(\'' + val.caseid + '\')">' + val.caseno + '</a></td>' +
                            '<td>' +
                            '<a href="#" title="Notes" onclick="OpenNotes(\'' + val.caseid + '\')">' +
                            '<img src="/newassets/img/view-icon.png" />' +
                            '</a>' +
                            '</td>' +
                            '<td><a href="#" data-toggle="tooltip" title="Share Notes" onclick="EmailCase(\'' + val.caseid + '\')">' +
                            '<img src="/newassets/img/share-icon.png" />' +
                            '</a></td>' +
                            '<td><a href="#" data-toggle="tooltip" title="Delete Notes" onclick="DeleteCaseNotes(\'' + val.caseid + '\')">' +
                            '<img src="/newassets/img/deletecasesingle-icon.png" />' +
                            '</a></td>' +
                            '</tr>'
                        );
                    });

                } else {
                    $("#alldatabindCaseNotes tr").remove();
                    $("#alldatabindCaseNotes").append('<tr><td>' + response1.Message + '</td></tr > ')
                }
                resolve();
            },
            failure: function (data) {
                alert(data.responseText);
                reject(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
                reject(data.responseText);
            }
        });
    });
}
function BindTotalOrderNotesDetails() {
    openload();
    return new Promise(function (resolve, reject) {
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/TotalOrderNotesDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.data.length;
                if (length > 0) {
                    $("#alldatabindOrderNotes tr").remove();
                    response1 = response1.data;
                    $.each(response1, function (i, val) {
                        $("#alldatabindOrderNotes").append('<tr><td><a href=javascript:redirectToUrl(' + this.caseid + ')>' + this.caseno + '</a></td><td>' + this.orderdate + '</td><td><a href="#" title="Notes" onclick=OpenOrderNotes("' + this.vOrderDtid + '")><img src="/newassets/img/view-icon.png" /></a></td>' +
                            '<td><a href="#" data-toggle="tooltip" title="Delete Notes" onclick=DeleteOrderNotes("' + this.vOrderDtid + '")><img src="/newassets/img/deletecasesingle-icon.png" /> </a></td></tr > ')
                    })
                } else {
                    $("#alldatabindOrderNotes tr").remove();
                    $("#alldatabindOrderNotes").append('<tr><td colspan="4">' + response1.Message + '</td></tr > ')
                }
                resolve();
            },
            failure: function (data) {
                alert(data.responseText);
                reject(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
                reject(data.responseText);
            }
        });
    });
}

function OpenNotes(val) {
    var search = "";
    search = $("#Search").val();
    search = "";
    /* var url = "/CW/GetCaseNotesList?id=" + val + "&search=";*/
    $('#myModal .ctitle').html("Case Notes Details");

    var formData = new FormData();
    formData.append("id", val);
    formData.append("search", search);
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetCaseNotesList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $('#mymodels').empty();
            $('#myModal').modal({ show: true });
            var str = "";
            str += '<table width="100%" class="table table-panel" border="0" cellspacing="0" cellpadding="0">' +
                '<thead><tr><th width="20%" style="padding:4px; text-align:left;"> Created Date</th>' +
                '<th width="80%" style="padding:4px; text-align:left;"> Notes</th>' +
                '</tr></thead><tbody>';
            var length = response1.data.length;
            if (length > 0) {
                response1 = response1.data;
                $.each(response1, function (i, val) {
                    str += '<tr><td>' + this.CreatedDate + '</td><td>' + this.Notes + '</td></tr>';
                    if (i == length - 1) {
                        str += '</tbody></table>';
                        $('#mymodels').append(str);
                    }
                })
            } else {
                str += '<tr><td>' + response1.Message + '</td></tr ></tbody></table>';
                $('#mymodels').append(str);
            }

        },
        failure: function (data) {
            $('.mymodels').html("").html(data.responseText);
            $('#myModal').modal({ show: true });
            //alert(data.responseText);
        },
        error: function (data) {
            $('.mymodels').html("").html(data.responseText);
            $('#myModal').modal({ show: true });
            //alert(data.responseText);
        }
    });
}
/*Open order notes*/
function OpenOrderNotes(val) {
    var search = "";
    search = $("#Search").val();

    search = "";

    $('#myModal .ctitle').html("Order Notes Details");
    var formData = new FormData();
    formData.append("id", val);
    formData.append("search", search);
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/MyCaseOrderNotes",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $('#mymodels').empty();
            $('#myModal').modal({ show: true });
            var str = "";
            str += '<table width="100%" class="table table-panel" border="0" cellspacing="0" cellpadding="0">' +
                '<thead><tr><th width="20%"> Created Date</th>' +
                '<th width="80%"> Notes</th>' +
                '</tr></thead><tbody>';
            var length = response1.data.length;
            if (length > 0) {
                response1 = response1.data;
                $.each(response1, function (i, val) {
                    str += '<tr><td>' + this.CreatedDate + '</td><td>' + this.Notes + '</td></tr>';
                    if (i == length - 1) {
                        str += '</tbody></table>';
                        $('#mymodels').append(str);
                    }
                })
            } else {
                str += '<tr><td>' + response1.Message + '</td></tr ></tbody></table>';
                $('#mymodels').append(str);
            }
        },
        failure: function (data) {
            $('.mymodels').html("").html(data.responseText);
            $('#myModal').modal({ show: true });
            //alert(data.responseText);
        },
        error: function (data) {
            $('.mymodels').html("").html(data.responseText);
            $('#myModal').modal({ show: true });
            //alert(data.responseText);
        }
    });
}
/*Email cases*/
//function EmailCase(val) {
//    var search = "";
//    search = $("#Search").val();
//    search = "";
//    $('#myModal .ctitle').html("Case Notes Details");

//    var formData = new FormData();
//    formData.append("id", val);
//    formData.append("search", search);
//    $.ajax({
//        async: true,
//        type: "POST",
//        url: "/CW/GetCaseNotesList",
//        dataType: 'json',
//        data: formData,
//        contentType: false,
//        processData: false,
//        success: function (response1) {
//            $('#mymodels').empty();
//            $('#myModal').modal({ show: true });
//            var bodyhtml = '<div id="content">' +
//                '<div class="table-panel table-responsive">' +
//                '<div style="background:#e3efff;">' +
//                '<table class="table table-panel" cellpadding="0" cellspacing="0" border="0" width="100%">' +
//                '<tr>' +
//                '<td align="left">' +
//                '<table cellpadding="0" cellspacing="5" border="0" width="100%">' +
//                '<tr> ' +
//                '<td rowspan="2" width="10%"><button class="btn btn-primary" type="submit" name="submit" value="Submit" Text="Submit" onClick=mailsend("' + val + '"); style="margin:0px 6px 0 1px;"> Send </button></td>' +
//                '<td width="10%"><p style="background:#e1e1e1; border:1px solid #adadad; text-align:center; padding:3px 0; margin:0;"> To:</p></td>' +
//                '<td><input style="border: 1px solid #d5d7da !important;"  class="form-control inputFormat" type="text" name="mailto" id="mailto" /></td>' +
//                '</tr>' +
//                '<tr>' +
//                '<td width="10%"><p style="background:#e1e1e1; border:1px solid #adadad; text-align:center; padding:3px 0; margin:0;"> Subject:</p></td>' +
//                '<td><input class="form-control inputFormat" disabled type="text" name="mailsubject" id="mailsubject" value="" style="width:100%; padding:8px 8px;" /></td>' +
//                '</tr>' +
//                '</table>' +
//                '</td>' +
//                '</tr>' +
//                '<tr>' +
//                '<td align="left" style="padding:10px;">' +
//                '<fieldset>' +
//                '<legend> Mail Body</legend>' +
//                '<table width="100%" cellpadding="0" cellspacing="0">' +
//                '<tbody style="text-align:center;" id="casenotes"></tbody>' +
//                '</table>' +
//                '</fieldset>' +
//                '</td>' +
//                '</tr>' +
//                '<tr></tr>' +
//                '</table>' +
//                '</div>' +
//                '</div>' +
//                '</div>'
//            var str = "";

//            var length = response1.data.length;
//            if (length > 0) {
//                response1 = response1.data;
//                $.each(response1, function (i, val) {
//                    var casename = this.Casename;
//                    str += '<tr><td>' + this.CreatedDate + '</td><td>' + this.Notes + '</td></tr>';
//                    if (i == length - 1) {
//                        str += '</tbody></table>';
//                        $('#mymodels').append(bodyhtml);
//                        $('#casenotes').append(str);
//                        $('#mailsubject').val(casename)
//                    }
//                })
//            } else {
//                str += '<tr><td>' + response1.Message + '</td></tr ></tbody></table>';
//                $('#mymodels').append(bodyhtml);
//                $('#casenotes').append(str);
//            }

//        },
//        failure: function (data) {
//            alert(data.responseText);
//        },
//        error: function (data) {
//            alert(data.responseText);
//        }
//    });
//}

function EmailCase(val) {
    var search = "";
    search = $("#Search").val();
    search = "";
    $('#myModal .ctitle').html("Case Notes Details");

    var formData = new FormData();
    formData.append("id", val);
    formData.append("search", search);
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetCaseNotesList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $('#mymodels').empty();
            $('#myModal').modal({ show: true });
            var bodyhtml = '<div id="content">' +
                
                '<div class="row" style="padding: 5px 0 0 0;">'+
                '<label class="col-md-3">To : </label>' +
                '<div class="col-md-9">' +
                '<input style="border: 1px solid #d5d7da !important;" class="form-control inputFormat" type="text" name="mailto" id="mailto">' +
                '</div></div>' +
                '<div class="row" style="padding: 5px 0 0 0;">' +
                '<label class="col-md-3">Subject : </label>' +
                '<div class="col-md-9">' +
                '<input class="form-control inputFormat" disabled="" type="text" name="mailsubject" id="mailsubject" value="" style="width:100%; padding:8px 8px;">' +
                '</div></div>' +
                '<div class="row">' +
                '<div class="col-md-12 text-right" style="margin:10px 0;">' +
                '<button class="btn btn-primary" type="submit" name="submit" value="Submit" Text="Submit" onClick=mailsend("' + val + '"); > Send</button>' +
                '</div></div>' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<table width="100%" cellpadding="0" cellspacing="0" class="table-panel">' +
                '<tbody style="text-align:center;" id="casenotes"></tbody>' +
                '</table>' +
                '</div>' +
                '</div>' +




                //'<table class="table table-panel" cellpadding="0" cellspacing="0" border="0" width="100%">' +
                //'<tr>' +
                //'<td align="left">' +
                //'<table cellpadding="0" cellspacing="5" border="0" width="100%">' +
                //'<tr> ' +
                //'<td rowspan="2" width="10%"><button class="btn btn-primary" type="submit" name="submit" value="Submit" Text="Submit" onClick=mailsend("' + val + '"); style="margin:0px 6px 0 1px;"> Send </button></td>' +
                //'<td width="10%"><p style="background:#e1e1e1; border:1px solid #adadad; text-align:center; padding:3px 0; margin:0;"> To:</p></td>' +
                //'<td><input style="border: 1px solid #d5d7da !important;"  class="form-control inputFormat" type="text" name="mailto" id="mailto" /></td>' +
                //'</tr>' +
                //'<tr>' +
                //'<td width="10%"><p style="background:#e1e1e1; border:1px solid #adadad; text-align:center; padding:3px 0; margin:0;"> Subject:</p></td>' +
                //'<td><input class="form-control inputFormat" disabled type="text" name="mailsubject" id="mailsubject" value="" style="width:100%; padding:8px 8px;" /></td>' +
                //'</tr>' +
                //'</table>' +
                //'</td>' +
                //'</tr>' +
                //'<tr>' +
                //'<td align="left" style="padding:10px;">' +
                //'<fieldset>' +
                //'<legend> Mail Body</legend>' +
                //'<table width="100%" cellpadding="0" cellspacing="0">' +
                //'<tbody style="text-align:center;" id="casenotes"></tbody>' +
                //'</table>' +
                //'</fieldset>' +
                //'</td>' +
                //'</tr>' +
                //'<tr></tr>' +
                //'</table>' +


                
                '</div>'
            var str = "";

            var length = response1.data.length;
            if (length > 0) {
                response1 = response1.data;
                $.each(response1, function (i, val) {
                    var casename = this.Casename;
                    str += '<tr><td>' + this.CreatedDate + '</td><td>' + this.Notes + '</td></tr>';
                    if (i == length - 1) {
                        str += '</tbody></table>';
                        $('#mymodels').append(bodyhtml);
                        $('#casenotes').append(str);
                        $('#mailsubject').val(casename)
                    }
                })
            } else {
                str += '<tr><td>' + response1.Message + '</td></tr ></tbody></table>';
                $('#mymodels').append(bodyhtml);
                $('#casenotes').append(str);
            }

        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
/*Close notes model*/
function ModalNotesClose1() {
    $("#myModal").hide();
    $('#myModal').modal({ show: false });
}

//function DeleteCaseNotes(strid) {

//    if (confirm("Are you sure want to delete this notes!") == true) {
//        var formData = new FormData();
//        formData.append("ccc", strid);
//        $.ajax({
//            type: "POST",
//            url: "/CW/RemoveCaseNotesList",
//            dataType: "text",
//            data: formData,
//            contentType: false,
//            processData: false,
//            success: function (data) {
//                debugger;
//                data = JSON.parse(data)
//                if (data.Status == true) {
//                    alert("Deleted successfully");
//                    (async function () {
//                        await BindTotalNotesDetails();
//                        closeload();
//                    })();
//                }
//                else {
//                    alert("OOps! Something went wrong");
//                }
//            },
//            error: function (data) {

//            }
//        });
//    }
//    else {

//    }

//}
function DeleteCaseNotes(strid) {
    $("#removeCaseNoteConfModal").modal();
    $("#removeCaseNoteCnf").attr("strid", strid);
}
$(document).on("click", "#removeCaseNoteCnf", function () {
    openload();
    var strid = $(this).attr("strid");
    DeleteCaseNoteDetails(strid);
});
function DeleteCaseNoteDetails(strid) {
    var formData = new FormData();
    formData.append("ccc", strid);
    $.ajax({
        type: "POST",
        url: "/CW/RemoveCaseNotesList",
        dataType: "text",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            data = JSON.parse(data)
            if (data.Status == true) {
                new PNotify({
                    title: 'Success!',
                    text: 'Deleted successfully',
                    type: 'success',
                    delay: 3000
                });
                $("#removeCaseNoteConfModal").modal("hide");
                //alert("Deleted successfully");
                (async function () {
                    await BindTotalNotesDetails();
                    closeload();
                })();
            }
            else {
                //alert("OOps! Something went wrong");
                new PNotify({
                    title: 'Info!',
                    text: 'OOps! Something went wrong',
                    type: 'error',
                    delay: 3000
                });
            }
        },
        error: function (data) {

        }
    });
}

//function DeleteOrderNotes(strid) {
//    if (confirm("Are you sure want to delete this notes!") == true) {
//        var formData = new FormData();
//        formData.append("ccc", strid);
//        $.ajax({
//            type: "POST",
//            url: "/CW/RemoveCaseOrderNotes",
//            dataType: "text",
//            data: formData,
//            contentType: false,
//            processData: false,
//            success: function (data) {
//                data = JSON.parse(data)
//                if (data.Status == true) {
//                    alert("Deleted successfully");
//                    (async function () {
//                        await BindTotalOrderNotesDetails();
//                        closeload();
//                    })();
//                }
//                else {
//                    alert("OOps! Something went wrong");
//                }
//            },
//            error: function (data) {

//            }
//        });
//    }
//    else {

//    }

//}

function DeleteOrderNotes(strid) {
    //if (confirm("Are you sure want to delete this notes!") == true) {
    $("#removeOrderNoteConfModal").modal();
    $("#removeOrderNoteCnf").attr("strid", strid);
}
$(document).on("click", "#removeOrderNoteCnf", function () {
    openload();
    var strid = $(this).attr("strid");
    RemoveOrderNotesDetails(strid);
});
function RemoveOrderNotesDetails(strid) {
    var formData = new FormData();
    formData.append("ccc", strid);
    $.ajax({
        type: "POST",
        url: "/CW/RemoveCaseOrderNotes",
        dataType: "text",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            data = JSON.parse(data)
            if (data.Status == true) {
                //alert("Deleted successfully");
                new PNotify({
                    title: 'Success!',
                    text: 'Deleted successfully',
                    type: 'success',
                    delay: 3000
                });
                $("#removeOrderNoteConfModal").modal("hide");
                (async function () {
                    await BindTotalOrderNotesDetails();
                    closeload();
                })();
            }
            else {
                //alert("OOps! Something went wrong");
                new PNotify({
                    title: 'Info!',
                    text: 'OOps! Something went wrong',
                    type: 'error',
                    delay: 3000
                });
            }
        },
        error: function (data) {

        }
    });
    
}

function isValidEmail(email) {
    // Regular expression for a basic email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function mailsend(val) {
    debugger;
    var toemail = $("#mailto").val();
    if (toemail == "") {
        alert("Please enter emailId");
        return false;
    } else if (!isValidEmail(toemail)) {
        alert("Please valid emailId");
        return false;
    }
    var formData = new FormData();
    formData.append("caseid", val);
    formData.append("toemail", toemail);

    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/ShareEmailNotes",
        dataType: 'text',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            alert(response1);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function redirectToUrl(val) {
    var fcode = window.location.pathname;
    fcode = fcode.split("/")[1];
    var urls = "/" + fcode + "/CW/LitigationCaseList";
    url_redirect({
        url: urls,
        method: "post",
        data: { caseid: val }
    });
}