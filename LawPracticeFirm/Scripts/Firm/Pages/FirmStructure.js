

$(document).ready(function () {
    if (dashcw == "display:unset") {
        $("#OpenAlertSettings").show();
    }
    else {
        $("#OpenAlertSettings").remove();
    }
    $("#sttypefilter").change(function () {
        isRenderPage = false;
        getdata(pageindex);
    });

    if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
        $("#noticelogodiv").hide();
    } else {
        $("#noticelogodiv").show();
    }

/*Open loader*/
    function openloadq() {
        $('#myOverlay').css("display", "block");
    }
/*Close loader*/
    function closeloadq() {
        $('#myOverlay').css("display", "none");
    }
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;

    /*Pagination Start*/

    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        getdata(pageindex);
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
        getdata(pageindex);
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
        getdata(pageindex);

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        isRenderPage = true;
        pageindex = setPageNo;
        getdata(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });



    getdata(pageindex);
    NoticeLogoPath();
    $("#getreport").click(function () {
        pageindex = 1;
        isRenderPage = false;
        getdata(pageindex);
    });
    //$(document).on('click', '#pgetdatabypagenum', function () {
    //    ppageindex = $("#ppagnumvalue").val();
    //    if (ppageindex != "undefined") {
    //        if (Math.sign(ppageindex) == 1) {
    //            var ppageindesx = $("#psotopage").text();
    //            if (ppageindex <= parseInt(ppageindesx)) {
    //                getdata(pageindex);
    //                //closeload();
    //            }
    //            else {
    //                alert("Please enter a valid page number.");
    //                closeload();
    //            }
    //        }
    //        else {
    //            alert("Please enter a valid page number.");
    //        }
    //    }
    //});
    openloadq();

    /*Get data*/
    function getdata(pageindex) {
        var formdata = new FormData();
        var stype = $("#sttypefilter").val(); 
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText(stype));
        var qty1 = 0;
        var html = '';
        openloadq();
        $.ajax({
            async: true,
            url: "/api/CallApi/LoadFirmStructure",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (String(response.Data) == "[]") {
                    document.querySelector(".pagination").style.display = "none";

                    $("#loadactivitydata").empty();
                    $("#activityreport").css("display", "block");
                    var html3 = "";
                    html3 += '<tr>';
                    html3 += '<td colspan="4" align="center"><div class="notFound">' +
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No Organisation list found</h4>' +
                        '<p>We found no Organisation list.</p>' +
                        '</div></td>';
                    $("#loadactivitydata").empty().hide().append(html3).fadeIn('fast');
                    setTimeout(function () {
                        closeloadq();
                    }, 4000);
                    return false;
                }
                $("#activityreport").css("display", "block");
                try {
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                catch
                {
                    document.querySelector(".pagination").style.display = "none";
                    var html3 = "";
                    html3 += '<tr>';
                    html3 += '<td colspan="2" align="center">' +
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No Organisation list found</h4>' +
                        '<p>We found no Organisation list.</p>' +
                        '</td>';
                    $("#loadactivitydata").empty().hide().append(html3).fadeIn('fast');
                    setTimeout(function () {
                        closeloadq();
                    }, 4000);
                    return false;
                }
                $.each(obj, function (index, a) {
                    document.querySelector(".pagination").style.display = "flex";

                    if (index === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;

                    if (index === (length - 1)) {
                        totrecord = a.totRow;

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
                    }
                    qty1 = qty1 + 1;
                    html += '<tr><td>' + a.rownum + '</td><td>' + a.SType + '</td><td>' + a.Name + '</td>';
                    html += '<td align="center">' + formatDatetoIST(a.CreateDate) + '</td><td><ul class="table_action"><li><span class="taskoutboxbtnicon" style="cursor:pointer;color:red" title="Delete ' + a.SType + '" id="removestype" data-val="'+a.Id+'"><img src="/newassets/img/delete.svg"  /></span></li></ul></td></tr>';
                });
                $("#loadactivitydata").empty().hide().append(html).fadeIn('fast');
                setTimeout(function () {
                    closeloadq();
                }, 4000);
            },
            error: function (response) {
                closeloadq();
            }
        });
    }
   
    //$(document).on('click', '#removestype', function () {
    //    var formData = new FormData();
    //    formData.append("token", EncodeText($(this).attr("data-val")));
    //    openloadq();
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/CallApi/RemoveFirmStructure",
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        success: function (data) {
    //            if (data.Data == "1") {
    //                alert("Data deleted successfully");
    //                closeloadq();
    //                isRenderPage = false;
    //                getdata(pageindex);
    //            }
    //            else {
    //                alert(data.Data);
    //                closeloadq();
    //            }
    //        }
    //    });
    //});

    $(document).on('click', '#removestype', function () {
        var token = $(this).attr("data-val");
        $("#myModalOrgCnf").modal();
        $("#deleteOrgDetails").attr("token", token);
    });
    $(document).on('click', "#deleteOrgDetails", function () {
        var token = $(this).attr("token");
        fnRemoveSType(token);
    });
    function fnRemoveSType(token) {
        var formData = new FormData();
        formData.append("token", EncodeText(token));
        openloadq();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/RemoveFirmStructure",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "1") {
                    //alert("Data deleted successfully");
                    new PNotify({
                        title: 'Success!',
                        text: 'Data deleted successfully',
                        type: 'success',
                        delay: 4000
                    });
                    $("#myModalOrgCnf").modal("hide");
                    closeloadq();
                    isRenderPage = false;
                    getdata(pageindex);
                }
                else {
                    alert(data.Data);
                    closeloadq();
                }
            }
        });
    }
/*Save firm structure*/
    $("#Savestructure").click(function () {
        var sttype = $("#sttype").val();
        var stname = $("#stname").val();
        if (sttype == "") {
            alert("Select Type");
            return false;
        }
        if (stname == "") {
            alert("Enter Name");
            return false;
        }
        var formData = new FormData();
        formData.append("sttype", EncodeText(sttype));
        formData.append("stname", EncodeText(stname));
        formData.append("token", "");
        openloadq();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SaveFirmStructure",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "1") {
                    alert("Data saved successfully");
                    $('#savedatastructure')[0].reset();
                    $('#OpenNewCatgory').modal('hide');

                    closeloadq();
                    isRenderPage = false;
                    getdata(pageindex);
                }
                else if (data.Data == "-1") {
                    alert("The details you have added, already exists.");
                    closeloadq();
                    getdata(pageindex);
                }
                else {
                    alert(data.Data);
                    closeloadq();
                }
            }
        });
    });

    //$("#OpenAlertSettings").click(function () {

    //    let idString = window.userIds.join(",");

    //    $.ajax({
    //        url: '/CW/GetAlertOnOffUserList',
    //        data: { userid: idString },
    //        type: 'GET',
    //        success: function (data) {

    //            let tableBody = $("#alertSettingsTable tbody");
    //            tableBody.empty();

    //            // Create status map from API response
    //            let statusMap = {};

    //            if (data && data.length > 0) {
    //                $.each(data, function (i, item) {
    //                    let cleanId = item.vUserid.replace("MyKase_", "");
    //                    statusMap[cleanId] = parseInt(item.iStatus);
    //                });
    //            }

    //            // Loop through ALL users (44)
    //            $.each(window.userIds, function (i, userId) {

    //                let username = window.userMap[userId] || "";

    //                // Default ON if not in API response
    //                let status = statusMap[userId] !== undefined ? statusMap[userId] : 1;

    //                let statusText = status === 1 ? "ON" : "OFF";

    //                let actionBtn = status === 1
    //                    ? '<button class="btn btn-danger toggleAlert" data-id="' + userId + '" data-status="0" style="font-size:12px;">Turn OFF</button>'
    //                    : '<button class="btn btn-success toggleAlert" data-id="' + userId + '" data-status="1" style="font-size:12px;">Turn ON</button>';

    //                let row = `
    //                <tr>
    //                    <td>${username}</td>
    //                    <td>${statusText}</td>
    //                    <td>${actionBtn}</td>
    //                </tr>
    //            `;

    //                tableBody.append(row);

    //            });

    //            $("#alertSettingsModal").modal("show");

    //        },
    //        error: function () {
    //            alert("Failed to load alert settings.");
    //        }
    //    });

    //});

    //$("#OpenAlertSettings").click(function () {

    //    let idString = window.userIds.join(",");

    //    $.ajax({
    //        url: '/CW/GetAlertOnOffUserList',
    //        type: 'POST',
    //        contentType: 'application/json',
    //        data: JSON.stringify({ userIds: window.userIds }),
    //        success: function (data) {

    //            let tableBody = $("#alertSettingsTable tbody");
    //            tableBody.empty();

    //            let statusMap = {};

    //            if (data && data.length > 0) {
    //                $.each(data, function (i, item) {
    //                    let cleanId = item.vUserid.replace("MyKase_", "");
    //                    statusMap[cleanId] = parseInt(item.iStatus);
    //                });
    //            }

    //            $.each(window.userIds, function (i, userId) {

    //                let username = window.userMap[userId] || "";

    //                let status = statusMap[userId] !== undefined ? statusMap[userId] : 1;

    //                let statusText = status === 1 ? "Active" : "Inactive";

    //                let actionBtn = status === 1
    //                    ? '<button class="btn btn-danger toggleAlert" data-id="' + userId + '" data-status="0" style="font-size:12px;">Deactivate</button>'
    //                    : '<button class="btn btn-success toggleAlert" data-id="' + userId + '" data-status="1" style="font-size:12px;">Activate </button>';

    //                let row = `
    //                <tr>
    //                    <td>${i + 1}</td>
    //                    <td>${username}</td>
    //                    <td>${statusText}</td>
    //                    <td>${actionBtn}</td>
    //                </tr>
    //            `;

    //                tableBody.append(row);

    //            });

    //            $("#alertSettingsModal").modal("show");

    //        },
    //        error: function (xhr, status, error) {
    //            console.error("AJAX Error:");
    //            console.error("Status:", status);
    //            console.error("Error:", error);
    //            console.error("Response:", xhr.responseText);
    //            alert("Failed to load alert settings.");
    //        }
    //    });

    //});
    $("#OpenAlertSettings").click(function () {

        let idString = window.userIds.join(",");

        $.ajax({
            url: '/CW/GetAlertOnOffUserList',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userIds: window.userIds }),

            success: function (data) {

                let tableBody = $("#alertSettingsTable tbody");
                tableBody.empty();

                let statusMap = {};
                if (data && data.length > 0) {

                    $.each(data, function (i, item) {

                        let cleanId = String(item.vUserid || "")
                            .replace(/^mykase_/i, "")
                            .trim()
                            .toLowerCase();

                        statusMap[cleanId] = parseInt(item.iStatus);
                    });
                }

                $.each(window.userIds, function (i, userId) {

                    let username = window.userMap[userId] || "";

                    let cleanUserId = String(userId || "")
                        .replace(/^mykase_/i, "")
                        .trim()
                        .toLowerCase();

                    let status = statusMap[cleanUserId] !== undefined
                        ? statusMap[cleanUserId]
                        : 1;

                    let statusText = status === 1 ? "Active" : "Inactive";

                    let actionBtn = status === 1
                        ? '<button class="btn btn-danger toggleAlert" data-id="' + userId + '" data-status="0" style="font-size:12px;">Deactivate</button>'
                        : '<button class="btn btn-success toggleAlert" data-id="' + userId + '" data-status="1" style="font-size:12px;">Activate</button>';

                    let row = `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${username}</td>
                        <td>${statusText}</td>
                        <td>${actionBtn}</td>
                    </tr>
                `;

                    tableBody.append(row);

                });

                $("#alertSettingsModal").modal("show");

            },

            error: function (xhr, status, error) {

                console.error("AJAX Error:");
                console.error("Status:", status);
                console.error("Error:", error);
                console.error("Response:", xhr.responseText);

                alert("Failed to load alert settings.");
            }
        });

    });
    $(document).on("click", ".toggleAlert", function () {
        openload();
        var formData = new FormData();
        let userId = $(this).data("id");
        let status = $(this).data("status");
        var UserAlertOnOff = userId;
        var UserAlertOnOffStatus = status;
        if (UserAlertOnOff == "") {
            alert("Please select User.")
            $("#UserAlertOnOff").focus();
            return false;
        }
        formData.append("userid", EncodeText(UserAlertOnOff));
        formData.append("status", EncodeText(UserAlertOnOffStatus));
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/AddCaseAlertOnOFF",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                closeload();
                alert(data.Message);
                $("#UserAlertOnOff").val("");
                $("#UserAlertOnOffStatus").val("1");
                $("#alertSettingsModal").modal("hide");
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });

    $("#searchUsername").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#alertSettingsTable tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });

    });

    $("#opennewcat").click(function () {
        $('#OpenNewCatgory').modal({ show: true });
    });
    $("#OpenAlertSettingsDay").click(function () {
        $('#myModalAlertDay').modal({ show: true });
    });
    $("#savealertOnOff").click(function () {
        var formData = new FormData();
        var UserAlertOnOff = $("#UserAlertOnOff").val();
        var UserAlertOnOffStatus = $("#UserAlertOnOffStatus").val();
        if (UserAlertOnOff == "") {
            alert("Please select User.")
            $("#UserAlertOnOff").focus();
            return false;
        }
        formData.append("userid", EncodeText(UserAlertOnOff));
        formData.append("status", EncodeText(UserAlertOnOffStatus));
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/AddCaseAlertOnOFF",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                alert(data.Message);
                $("#UserAlertOnOff").val("");
                $("#UserAlertOnOffStatus").val("1");
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });

    //Start Save Alert Day added by umesh on 6Jul22
    $("#UserListAlertDays").change(function () {
        var formData = new FormData();
        var UserListAlertDaysSelVal = $("#UserListAlertDays").val();
        formData.append("userid", EncodeText(UserListAlertDaysSelVal));
        $.ajax({
            async: true,
            url: '/CW/AlertDaysBefore',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                var obj = JSON.parse(response);
                $.each(obj.data, function (i, a) {
                    if (a.alertdays > 0)
                        $("#UserAlertdays").val(a.alertdays);
                    else
                        $("#UserAlertdays").val("2");
                });
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });

/*Save alert days*/
    $("#savealertdays").click(function () {
        var formData = new FormData();
        var UserListAlertDaysVal = $("#UserListAlertDays").val();
        var UserAlertdaysVal = $("#UserAlertdays").val();
        if (UserListAlertDaysVal == "") {
            alert("Please select User.")
            $("#UserListAlertDays").focus();
            return false;
        }
        formData.append("userid", EncodeText(UserListAlertDaysVal));
        formData.append("daysno", EncodeText(UserAlertdaysVal));
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/AddCaseAlertDays",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                alert(data.Message);
                $("#UserListAlertDays").val("");
                $("#UserAlertdays").val("1");
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
   // upload notice logo
    $("#uploadnoyilogo").click(function () {
        if ($("#attachment").val() == "") {
            alert("Please upload your logo.");
            return false;
        }
        var formData = new FormData();
        var tempsize = 0;
        var totalFiles = document.getElementById("attachment").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachment").files[i];
            var filename = file.name;
            //validate filechracter
            var fileNameIndex = filename.lastIndexOf("/") + 1;
            var dotIndex = filename.lastIndexOf('.');
            var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
            var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
            if (reg.test(newfioename) == true) {
                alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                return false;
            }
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileextLogo(filename);
            if (String(Extresponse) == "false") {
                return false;
            }
            formData.append("FileUpload", file);
            //try {
            //    if (typeof (file) != "undefined") {
            //        size = parseFloat(file.size / 1024).toFixed(2);
            //        tempsize = parseFloat(tempsize) + parseFloat(size);
            //    }
            //}
            //catch (err) {
            //    //alert(err.message);
            //}
        }
        //tempsize = tempsize.toFixed(2);
        //if (tempsize > filesize) {
        //    new PNotify({
        //        title: 'Warning!',
        //        text: 'File size greater than 2 MB cannot be accepted.',
        //        type: 'error',
        //        delay: 4000
        //    });
        //    return false
        //}
        formData.append("heading", "Notice Logo");
        $.ajax(
            {
                type: "POST",
                url: "/api/WorkFlowNewApi/NoticePageLogoSave", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data.toString() == "0") {
                        alert('Something went wrong! Please try again.');
                        closeload();
                        return false;
                    }
                    else {
                        alert("Data saved successfully");
                        NoticeLogoPath();
                        closeload();
                        window.location.reload();
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
    });

    var _validFileExtensionLogo = [".jpg", ".jpeg", ".png"];
    function checkfileextLogo(filename) {
        var blnValid = false;
        for (var j = 0; j < _validFileExtensionLogo.length; j++) {
            var sCurExtension = _validFileExtensionLogo[j];
            if (filename.substr(filename.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                blnValid = true;
                break;
            }
        }
        if (!blnValid) {
            alert("Sorry, " + filename + " is invalid, allowed extensions are: " + _validFileExtensionLogo.join(", "));
            try {
                $("#attachment").val("");
                $("#postedFile").val("");
            }
            catch (er) {
            }
            return "false";
        }
        else {
            return "true";
        }
    }
/*Notice logo path*/
    function NoticeLogoPath() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/WorkFlowNewApi/NoticeLogoPath",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Data != "") {
                    var SignatureLogo = response.Data;
                    $("#nfilepath").val(SignatureLogo);
                    // alert(a.SignatureLogo);
                    if (SignatureLogo == "") {
                        $("#nsignsource").attr("href", SignatureLogo).hide();
                    }
                    else {
                        $("#nsignsource").attr("href", SignatureLogo).show();
                        var filename = SignatureLogo.substring(SignatureLogo.lastIndexOf("/") + 1, SignatureLogo.length);
                        $("#nsignsource").attr("download", filename).show();
                        $("#nsignsource").attr("title", "Download the Signature Logo");
                        $("#Removenotilogo").show();
                    }
                }
                else {
                    $("#firmlogolink").hide();
                    $("#Removenotilogo").hide();
                    $("#nsignsource").hide();
                    $("#attachment").val('');
                }
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                if (String(response.responseJSON.Message) == "SessionTimeOut") {
                    alert("Your session has expired, please log out and then login again");
                    window.location.href = location.protocol + '//' + location.host;
                }
                else {
                    alert(response.responseText);
                }
            }
        });
    }

    //Remove logo
    $("#Removenotilogo").click(function () {
        var formData = new FormData();
        var nfilepath = $("#nfilepath").val();
        formData.append("filepath", EncodeText(nfilepath));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/WorkFlowNewApi/RemoveNoticeLogoPath",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("Remove successfully.");
                NoticeLogoPath();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });

    //image validations while uploading
    var _URL = window.URL || window.webkitURL;
//    $("#attachment").change(function (e) {
//        var file, img;
//        var widthtemp, heighttemp;
//        if ((file = this.files[0])) {
//            img = new Image();
//            var objectUrl = _URL.createObjectURL(file);
//            img.onload = function () {
//                widthtemp = this.width;
//                heighttemp = this.height;
//                //if (this.width > 160) {
//                //    alert("Please upload image width less than equal to 160 px and height less than equal to 40 px.");
//                //    $("#attachment").val('');
//                //    return false;
//                //} 
//                //if (this.height > 40) {
//                //    alert("Please upload image width less than equal to 160 px and height less than equal to 40 px.");
//                //    $("#attachment").val('');
//                //    return false;
//                //}
//            };
//            img.src = objectUrl;
//        }
//    });
    $("#attachment").change(function (e) {
        var file = this.files[0];
        if (!file) return;

        // Show filename
        $("#fileName").text(file.name);
        $("#fileInfo").show();

        // Preview size logic (you already have)
        var img = new Image();
        var objectUrl = URL.createObjectURL(file);
        img.onload = function () {
            // widthtemp = this.width;
            // heighttemp = this.height;
            // do your validations here
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var removeBtn = document.getElementById("removeLogoFile");
    if (removeBtn) {
        removeBtn.addEventListener("click", function () {
            document.getElementById("attachment").value = "";
            document.getElementById("fileInfo").style.display = "none";
            document.getElementById("fileName").textContent = "";
        });
    }
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