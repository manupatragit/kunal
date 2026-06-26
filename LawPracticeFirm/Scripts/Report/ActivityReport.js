$(document).ready(function () {

     $("#usertypess").on('change', function () {
         var UserTypes = $(this).val();
         loadteamleader(UserTypes);
    });
    //Bind Team Member List
    function loadteamleader(UserTypes) {
        $("#actcontacttype").html("");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuserteamlead",
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
                $("#actcontacttype option").remove();
                var html3 = '';
                $.each(obj, function (i, a) {
                    if (a.RoleName == UserTypes) {
                        option = '<option value="' + a["id"] + '"> ' + a["UserName"] + '</option>';
                        $("#actcontacttype").append(option);
                    }

                    //if (a.roleid == 1) {
                    //    option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                    //    $("#actcontacttype").append(option);
                    //}
                    //else {
                    //    if (a.IsPartner == 1) {
                    //        option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                    //        $("#actcontacttype").append(option);
                    //    }
                    //    else {
                    //        if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                    //            option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                    //            $("#actcontacttype").append(option);
                    //        }
                    //        else {
                    //            option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                    //            $("#actcontacttype").append(option);
                    //        }
                    //    }
                    //}
                });
                $("#actcontacttype").multiselect('reload');
                return false;
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }



   /*Export activity report in excel*/
    $("#oexcel").click(function () {
        var esdate = $("#fdate").val();
        var eedate = $("#tdate").val();
        var contacttype = $("#actcontacttype").val();
        if (contacttype == "") {
            alert("Please select users");
            return false;
        }
        if (esdate == "") {
            alert("Please select date From");
            return false;
        }
        if (eedate == "") {
            alert("Please select date To");
            return false;
        }
        var search = "";
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/ExportoExcelActivityReport";
        url_redirect({
            url: urls,
            method: "post",
            data: {
                "esdate": EncodeText(esdate), "eedate": EncodeText(eedate),
                "user": EncodeText(contacttype), "search": EncodeText(search)
            }
        });
    });

    /*Export activity report in pdf*/
    $("#opdf").click(function () {
        var esdate = $("#fdate").val();
        var eedate = $("#tdate").val();
        var contacttype = $("#actcontacttype").val();
        if (contacttype == "") {
            alert("Please select users");
            return false;
        }
        if (esdate == "") {
            alert("Please select date From");
            return false;
        }
        if (eedate == "") {
            alert("Please select date To");
            return false;
        }
        var search = "";
        window.location = encodeURI("/firm/ExportoPdfActivityReport?status=true&esdate=" + esdate + "&eedate=" + eedate + "&user=" + contacttype + "&search=" + search);
    });
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        $('input[type = "date"]').attr("onkeydown", "");
        $('input[type = "date"]').attr("onkeypress", "");
    }
    $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
    $('input[type = "date"]').blur(function () {
        var dateString = $(this).val();
        if (dateString != "") {
            var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
            var regex = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
            //Check whether valid dd/MM/yyyy Date Format.
            if (regex.test(dateString)) {
                var parts = dateString.split("-");
                var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                if (parseInt(parts[0]) < 1900) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[0]) > 3000) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[2]) == 00) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                var dtCurrent = new Date();
                return true;
            } else {
                $(this).focus();
                $(this).val("");
                alert("Invalid Date");
                return false;
            }
        }
    });
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    function formatDateTimeIST(date) {
        if (date == "1900-01-01T00:00:00" || date == "1900-01-01" || date == "") {
            return "";
        }
        else {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let current_datetime = new Date(date)
            let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear() +
                " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
            return formatted_date;
        }
    }
    $("#fdate,#tdate").prop("max", new Date().toISOString().split("T")[0]);
    closeload();
    $("#excel").click(function () {
        var esdate = $("#fdate").val();
        var eedate = $("#tdate").val();
        var contacttype = $("#actcontacttype").val();
        if (contacttype == "") {
            alert("Please select users");
            return false;
        }
        if (esdate == "") {
            alert("Please select date From");
            return false;
        }
        if (eedate == "") {
            alert("Please select date To");
            return false;
        }
        var search = "";
        window.location = encodeURI("/firm/ExportoExcel?status=true&esdate=" + esdate + "&eedate=" + eedate + "&user=" + contacttype + "&search=" + search);
    })
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    /*Search data by page number*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            pageindex = 1;
            getdata(pageindex);
        }
    });
    $("#searchreport").click(function () {
        pageindex = 1;
        getdata(pageindex);
    });
    $("#getreport").click(function () {
        pageindex = 1;
        getdata(pageindex);
    });
    $('#divcontent').off("click").on('click', '#actgetdatabypagenum', function () {
        pageindex = $("#actpagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                getdata(pageindex);
            }
            else {
                alert("Invalid page no");
                return false;
            }
        }
    });
    /*Get activity report details*/
    function getdata(pageindex) {
        $("#loadactivitydata").html("");
        var user = $("#actcontacttype").val();
        var fdate = $("#fdate").val();
        var tdate = $("#tdate").val();
        if (String(roleid) == "1") {
            if (user == "") {
                alert("Select User")
                return false;
            }
        }
        if (fdate == "") {
            alert("Select Start Date")
            return false;
        }
        if (tdate == "") {
            alert("Select End Date")
            return false;
        }
        openload();
        $("#getreport").prop("disabled", true);
        var formdata = new FormData();
        formdata.append("user", EncodeText(user));
        formdata.append("fromdate", EncodeText(fdate));
        formdata.append("todate", EncodeText(tdate));
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText($("#searchdata").val()));
        var qty1 = 0;
        var html = '';
        $("#actfooter").html("");
        var ld12 = $.ajax({
            async: true,
            url: "/api/CallApi/LoadactivitydaterangeNew",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#tfooter").html("");
                if (String(response.Data) == "[]") {
                    $("#dataarstatus").html("No result found !");
                    closeload();
                }
                $("#activityreport").css("display", "block");
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                $("#loadactivitydata tr").remove();
                $.each(obj, function (index, a) {
                    $("#dataarstatus").html("");
                    if (index === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (index === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
                            //$('#next').css("display", "none");
                            $('#prev').css("display", "block"); s
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
                    //if (index === 0) {
                    //    firstvalue = a.rownum;
                    //}
                    //if (index === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;
                    //    var totdata = a.totRow;
                    //    var totpage = 0;
                    //    if (a.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(pagesize);
                    //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#actpagnumvalue").attr("max", totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="actsotopage" style="display:none">' + totpage + '</span></li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li ><input type="number" id="actpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="actgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                    //    if (a.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="actpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="actpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="actpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }
                    //    tfot += '</ul>'
                    //    $("#actfooter").html("");
                    //    $("#actfooter").html(tfot);
                    //    closeload();
                    }
                    qty1 = qty1 + 1;
                    html += '<tr><td>' + a.rownum + '</td><td class="activitytype">' + a.ntype + '</td><td class="activityaction">' + a.notification + '</td><td class="adatetime">' + formatDateTimeIST(a.date_time) + '</td><td class="ausername">' + a.UserName + '</td></tr>';
                });
                $("#loadactivitydata").hide().append(html).fadeIn('fast');;
                $('#excel').css('display', 'block');
                $("#getreport").prop("disabled", false);
            },
            error: function (response) {
                $('#excel').css('display', 'none');
                alert(response.responseText);
                closeload();
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
            return false;
        });
        $("#getreport").prop("disabled", false);
    }

    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    function renderPagination(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
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
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totdata);
        isRenderPage = true;
    }
    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        getdata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        getdata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        getdata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        loadflag = true;
        isRenderPage = true;
        getdata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
    $(document).on('click', '#actpaginate', function () {
        pageindex = $(this).attr("index");
        getdata(pageindex);
    });
    jQuery('#actcontacttype').multiselect({
        columns: 1,
        search: true,
        selectAll: true
    });

    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
});