var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0, mnexthearingflag = 0, totpage = 0;
$(document).ready(function () {
    $("#CustSelectionopen").click(function () {
        $('#myModalCustomizedcolumn').modal({ show: true });

    });


    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }

        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (totpage < setPageNo) {
            alert("Please enter the valid page number.");
            return;
        }
        isRenderPage = true;
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });

    //$(document).on('click', '#getdatabypagenum', function () {
    //    ppageindex = $("#pagnumvalue").val();
    //    if (ppageindex != "undefined") {
    //        if (Math.sign(ppageindex) == 1) {
    //            var ppageindesx = $("#sotopage").text();
    //            if (ppageindex <= parseInt(ppageindesx)) {
    //                openload();
    //                loaddatalist(ppageindex);
    //                //closeload();
    //            }
    //            else {
    //                alert("Please enter a valid page number.");
    //                closeload();
    //                return false;
    //            }
    //        }
    //    }
    //});
    //$(document).on('click', '#paginate', function () {
    //    ppageindex = $(this).attr("index");
    //    loaddatalist(ppageindex);
    //});
    $(document).on('click', '#btnAddUserModal', function () {
        $("#hdniid").attr("value", "0");
        OpenModal();
    });

    $(document).on('click', '#Update', function () {
        GetContactByID($(this).attr("data-id"));
    });



    //$(document).on('click', '#RemoveContact', function () {
    //    if (confirm("Are you sure you wants to delete this contact?")) {
    //        RemoveContact($(this).attr("data-id"));
    //    }
    //});
    $(document).on('click', '#RemoveContact', function () {
        var cntId = $(this).attr("data-id");
        $("#myModalContactConf").modal();
        $("#deleteContactDetails").attr("cntId", cntId);
    });
    $(document).on('click', '#deleteContactDetails', function () {
        var contactId = $(this).attr("cntId");
        RemoveContact(contactId);
    });

    loaddatalist(pageindex);
    /*Load data list*/

    /*Export to excel*/
    $("#exporttoexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        //var html = '';
        //for (var i = 1; i < recordsection; i++) {
        //    html += '<tr>';
        //    html += '<td>Page No:' + i + ' </td>';
        //    html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelContList" pageno="' + i + '" type="excel">Download File</span></td>';
        //    html += '</tr>';
        //}
        //$("#printexport").html(html);
        var html = '';
        html += '<option value="">Please Select</option>';
        for (var i = 1; i < recordsection; i++) {
            html += '<option value="' + i + '">' + i + '</option>';
        }
        $("#id_exportreportdrop").html(html);
    });
    //$(document).on("click", "#exporttoexcelContList", function () {
    //    var Search = "";
    //    var pagenum = $(this).attr("pageno");
    //    var pagesizedata = 500;
    //    window.location = encodeURI("/CW/ExportToExcelLitigationContactList?status=true&Search=" + escape(Search) +
    //        "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata));
    //});
    $(document).on("click", "#CommonExportExcel", function () {
        var pagenum = $('#id_exportreportdrop').val();
        if (pagenum == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please select page no.',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        var Search = "";
        //var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;
        window.location = encodeURI("/CW/ExportToExcelLitigationContactList?status=true&Search=" + escape(Search) +
            "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata));
    });

});

function loaddatalist(pageindex) {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("Search1", "");
    formData.append("Search2", "");
    formData.append("Search3", "");
    openload();
    var html3 = '';
    $("#alldatabindcontactlist").html("");
    $("#ptfootercontactlist").html("");
    var Licaselit1 = $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetLitigationContact",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $("#exportrecords").val(0);
            var length = response1.length;
            if (length > 0) {
                document.querySelector(".pagination").style.display = "flex";

            }
            else {
                document.querySelector(".pagination").style.display = "none";

            }
            var qty = 0;
            var qty1 = 0;
            if (length > 0) {
                $("#divalertlist tr").remove();
                $.each(response1, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.RowId;
                    }
                    var totdata = val.TotalRecord;

                    if (i === (length - 1)) {

                        var totalRecord = val.TotalRecord;
                        $('#totRecordData').text(" (" + totalRecord + ")");

                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
                            $('#prev').css("display", "block");
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (pageindex == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }

                        if (isRenderPage == false) {
                            renderPagination(pageindex, totpage);
                        }






                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.TotalRecord;
                        var totpage = 0;
                        if (val.TotalRecord > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        $("#exportrecords").val(val.TotalRecord);
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                        if (val.TotalRecord <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        }
                        else {
                            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#ptfootercontactlist").html("");
                        $("#ptfootercontactlist").html(tfot);
                    }
                    qty = qty + 1;
                    qty1 = qty1 + 1;
                    html3 += '<tr>'
                    html3 += '<td class="lName">' + val.vFullName + '</td>';
                    html3 += '<td class="lMobile">' + val.vMobile + '</td>';
                    html3 += '<td class="lEmail">' + val.vEmail + '</td>';
                    html3 += '<td class="lhomeaddress">' + val.vHome + '</td>';
                    html3 += '<td class="lofficename">' + val.vOffice + '</td>';
                    html3 += '<td class="lofficeaddress">' + val.vAddress + '</td>';
                    html3 += '<td class="lalternatemob">' + (val.vHomePhoneNo == null ? "" : val.vHomePhoneNo) + '</td>';
                    html3 += '<td class="lOrgnization">' + val.OrgnizationName + '</td>';
                    // html3 += '<td class="lwebsite">' + val.vWebsite + '</td>';
                    html3 += '<td>';
                    html3 += '<a class="" href="javascript:void(0)"><span Id="Update" data-id="' + val.iid + '" title="Edit"><img src="/newassets/img/edit-icon.png" /></span></a>';
                    html3 += '<a class="" href="javascript:void(0)"><span Id="RemoveContact" data-id="' + val.iid + '" title="Remove"><img src="/newassets/img/deletecasesingle-icon.png" /></span></a>';
                    html3 += '</td>';
                    html3 += '</tr>'
                });
                $("#alldatabindcontactlist").html("").html(html3);
            }
            else {
                closeload();
                $("#ptfootercontactlist").html("");
                $("#alldatabindcontactlist").html("");
            }
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
    $.when(Licaselit1).then(function (data, textStatus, jqXHR) {
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });
        closeload();
        return false;
    });
}
function OpenModal() {
    $("#hdniid").attr("value", "0");
    $("#txtFullName").val("");
    $("#txthome").val("");
    $("#txtMobile").val("");
    $("#txtoffice").val("");
    $("#txtFax").val("");
    $("#txtEmail").val("");
    $("#txthomephoneno").val("");
    $("#txtAddress").val("");
    $("#txtWebsite").val("");
    $("#txtOrgnization").val("");
    $('#myModalpopup').modal({ show: true });
}
function CloseModal() {
    $('#myModalpopup').modal("hide");
    // loaddatalist(1);
}

function GetContactByID(iid) {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("Search1", "");
    formData.append("Search2", "");
    formData.append("Search3", "");
    formData.append("iid", iid);
    openload();

    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetLitigationContact",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {

            var length = response1.length;
            var qty = 0;
            var qty1 = 0;
            if (length > 0) {

                $.each(response1, function (i, val) {
                    OpenModal();
                    $("#hdniid").attr("value", iid);
                    $("#txtFullName").val(this.vFullName);
                    $("#txthome").val(this.vHome);
                    $("#txtMobile").val(this.vMobile);
                    $("#txtoffice").val(this.vOffice);
                    $("#txtFax").val(this.vFax);
                    $("#txtEmail").val(this.vEmail);
                    $("#txthomephoneno").val(this.vHomePhoneNo);
                    $("#txtAddress").val(this.vAddress);
                    $("#txtWebsite").val(this.vWebsite);
                    $("#txtOrgnization").val(this.OrgnizationName);
                });
            }
            else {
                closeload();
            }
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
    //$.when(Licaselit).then(function (data, textStatus, jqXHR) {
    //    $("input:checkbox:not(:checked)").each(function () {
    //        var column = "table ." + $(this).attr("name");
    //        $(column).hide();
    //    });
    //    closeload();
    //    return false;
    //});

}

function RemoveContact(iid) {
    var formData = new FormData();
    formData.append("iid", iid);
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/RemoveLitigationContact",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1 == "Contact deleted successfully") {
                //alert(response1);
                new PNotify({
                    title: 'Success!',
                    text: 'Contact deleted successfully',
                    type: 'success',
                    delay: 3000
                });
                $("#myModalContactConf").modal("hide");
                isRenderPage = false;
                loaddatalist(1);
            } else {
                //alert("Something is going wrong!");
                new PNotify({
                    title: 'Error!',
                    text: 'Something is going wrong!',
                    type: 'error',
                    delay: 3000
                });
            }
        },
        error: function (data) {
            alert(data);
        }
    });

}
function validation() {


    if ($("#txtFullName").val() == "") {
        alert("Please enter Name");
        $("#txtFullName").focus;
        return false;
    }


    if ($("#txtMobile").val() != "") {

        if ($("#txtMobile").val().length < 10) {
            alert("Please enter Valid Mobile Number");
            $("#txtMobile").focus;
            return false;
        }
    }

    //if ($("#txtMobile").val().trim() != "") {
    //    var mob = /^[1-9]{1}[0-9]{9}$/;
    //    if (mob.test($("#txtMobile").val()) == false) {
    //        alert("Please enter valid Mobile Number");
    //        $("#txtMobile").focus();
    //        return false;
    //    }
    //}

    //if ($("#txtFax").val() != "") {

    //    if ($("#txtFax").val().length < 10) {
    //        alert("Please enter Valid Fax Number");
    //        $("#txtFax").focus;
    //        return false;
    //    }
    //}

    if ($("#txtMobile").val() == "") {
        alert("Please enter either Mobile Number.");
        $("#txtMobile").focus;
        return false;
    }
    if ($("#txtEmail").val() == "") {
        alert("Please enter either Email Id.");
        $("#txtMobile").focus;
        return false;
    }
    if ($("#txtEmail").val() != "") {

        var memberEmail = $('#txtEmail').val();
        var letters = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!memberEmail.match(letters)) {
            alert("Enter Valid Email Id");
            $("#txtEmail").focus();
            return false;
        }
    }


    //if ($("#txtWebsite").val() != "") {

    //    var url = $('#txtWebsite').val();
    //    var urlpattern = /(ftp|http|https|)(:\/\/|)(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    //    if (!urlpattern.test(url)) {
    //        alert("Enter Valid Website.");
    //        $("#txtWebsite").focus();
    //        return false;
    //    }
    //}
    var formData = new FormData();
    formData.append("iid", $("#hdniid").val());
    formData.append("fullname", $("#txtFullName").val());
    formData.append("home", $("#txthome").val());
    formData.append("mobile", $("#txtMobile").val());
    formData.append("office", $("#txtoffice").val());
    formData.append("fax", "");
    formData.append("email", $("#txtEmail").val());
    formData.append("homeph", $("#txthomephoneno").val());
    formData.append("address", $("#txtAddress").val());
    formData.append("website", "");
    formData.append("Organization", $("#txtOrgnization").val());
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/SaveLitigationContact",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1 == "Contact added successfully" || response1 == "Contact updated successfully") {
                alert(response1);
                isRenderPage = false;
                loaddatalist(1);
                CloseModal();
            } else {
                alert("Email Id or Mobile No. already exists");
                CloseModal();
                loaddatalist(1);
            }
        },
        error: function (data) {
            alert(data);
        }
    });
}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});



/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbers").html(paginationHtml);
    isRenderPage = true;
}