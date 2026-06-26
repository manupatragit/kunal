$(document).ready(function () {
    if ($("#hdnLitigation").val() == 'display:unset') {
        $("#dvCourtDetailName").css("display", "none");
    } else {
        $("#dvCourtDetailName").css("display", "block");
    }

    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
    let selectUserVal = $('#ddlFromUsers').val();
    if (selectUserVal == "" || selectUserVal == null) {
        $("#pdatastatus").show();
    }
    $(".ms-selectall").hide();
    LoadUsers();
    $(document).on('change', '#ddlFromUsers', function () {
        $('#ddlToUsers').val([])
        $('#ddlToUsers').multiselect('refresh')
        $('#ddlToUsers').multiselect('reload')
        isRenderPage = false;
        var id = $("#ddlFromUsers").val();
        if (id != "") {
            $("#ddlToUsers").removeAttr("disabled");
            $("#sectiontemp .ms-options input").removeAttr("disabled");
            $("#sectiontemp .ms-options input[value='" + id + "']").prop("disabled", true);
        } else {
            $("#ddlToUsers").prop("disabled", true);
        }
        //$("#hdncurrentPage").val("1");
        $("#chkAll").prop("checked", false);
        var hdncurrentPage = 1;
        var hdnpagesize = 100;
        //loadmatterbyUserId($("#hdncurrentPage").val());
        isRenderPage = false;
        loadmatterbyUserId(hdncurrentPage);
    });
    //$(document).on('click', '#pgnext', function () {
    //    var next = $("#hdncurrentPage").val();
    //    var totalpage = $("#TotalPage").html();
    //    if (parseInt(next) < parseInt(totalpage)) {
    //        $("#chkAll").prop("checked", false);
    //        $("#hdncurrentPage").val(parseInt(next) + 1)
    //        loadmatterbyUserId($("#hdncurrentPage").val());
    //    }
    //});
    //$(document).on('click', '#pgPrev', function () {
    //    var next = $("#hdncurrentPage").val();
    //    var totalpage = $("#TotalPage").html();
    //    if (parseInt(next) > 1) {
    //        $("#hdncurrentPage").val(parseInt(next) - 1)
    //        $("#chkAll").prop("checked", false);
    //        loadmatterbyUserId($("#hdncurrentPage").val());
    //    }
    //});

    //$(document).on('click', '#pgetdatabypagenum', function () {
    //    var next = $("#ppagnumvalue").val();
    //    var totalpage = $("#TotalPage").html();
    //    if (parseInt(next) >= 1 && parseInt(next) <= parseInt(totalpage)) {
    //        $("#hdncurrentPage").val(parseInt(next))
    //        $("#chkAll").prop("checked", false);
    //        loadmatterbyUserId($("#hdncurrentPage").val());
    //    } else if (parseInt(next) > parseInt(totalpage)) {
    //        alert("Max Allowed- " + totalpage);
    //    }
    //});

    $(document).on('click', '#chkAll', function () {
        if ($("#chkAll").is(':checked')) {
            $('#bindbulkcases input[type="checkbox"]').prop("checked", true);
        } else {
            $('#bindbulkcases input[type="checkbox"]').prop("checked", false)
        }
        //EnableSaveButton();
    });
    //$(document).on('click', '#bindbulkcases input[type="checkbox"]', function () {
    //    EnableSaveButton();
    //})
    $(document).on('click', '#savework', function () {
        if ($('#ddlToUsers').val() != null) {
            if ($('#bindbulkcases input[type="checkbox"]:checked').length > 0) {
                AssignCase();
            } else {
                //alert("Please Select atleast one matter from list");
                new PNotify({
                    title: 'Warning!',
                    text: 'Please Select atleast one matter from list',
                    type: 'warning',
                    delay: 3000
                });
            }
        } else {
            //alert("Please Select atleast one user to assign");
            new PNotify({
                title: 'Warning!',
                text: 'Please Select atleast one user to assign',
                type: 'warning',
                delay: 3000
            });
        }
    })
    $(document).on('click', '#searchdatas', function () {
        hdncurrentPage = 1;
        isRenderPage = false;
        $("#clearnewsearchcase").css("display", "block");
        if ($("#bindbulkcases tr").length == 0) {
            return false;
        }
        else if ($("#casefiltercasename").val() == "") {
            alert("Enter matter name");
            return false;
        }
        //$("#hdncurrentPage").val("1");
        $("#chkAll").prop("checked", false);
        //loadmatterbyUserId($("#hdncurrentPage").val());
        loadmatterbyUserId(hdncurrentPage);
    });

    $(document).on('change', '#ddlCourtType', function () {
        if ($("#bindbulkcases tr").length == 0) {
            return false;
        }
        hdncurrentPage = 1;
        isRenderPage = false;
        //$("#hdncurrentPage").val("1");
        $("#chkAll").prop("checked", false);
        loadmatterbyUserId(hdncurrentPage);
    })

    $(document).on('change', '#ddlCourtName', function () {
        var courtTypeName = $("#ddlCourtName").val();
        $("#ddlCourtType").empty();
        if (courtTypeName == "Normal") {
            $('#ddlCourtType').append(
                '<option value="">Court</option>' +
                '<option value="1">Supreme Court</option>' +
                '<option value="2">High Court</option>' +
                '<option value="3">District Court</option>' +
                '<option value="4">Tribunals</option>' +
                '<option value="5">Add a Court</option>' 
            );
        } else if (courtTypeName == "Rera Court") {
            $('#ddlCourtType').append(
                '<option value="">Court</option>' +
                '<option value="7">Rera Court</option>' 
            );
        } else {
            $('#ddlCourtType').append(
                '<option value="">Court</option>' +
                '<option value="6">Revenue Court</option>'
            );
        }
       

        $("#chkAll").prop("checked", false);
        $("#bindbulkcases").html("");
        $('#ddlToUsers').multiselect('rebuild');
        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
        $("#pdatastatus").show();
        LoadUsers();
    })

})

$(document).on('click', '#clearnewsearchcase', function () {

    $("#casefiltercasename").val("");
    $("#searchdatas").css("display", "block");
    $("#clearnewsearchcase").css("display", "none");
    hdncurrentPage = 1;
    isRenderPage = false;
    if ($("#bindbulkcases tr").length != 0) {
        //$("#hdncurrentPage").val("1");
        $("#chkAll").prop("checked", false);
        loadmatterbyUserId(hdncurrentPage);
    }
});
//function EnableSaveButton() {
//    if ($('#bindbulkcases input[type="checkbox"]:checked').length > 0) {
//        $("#savework").removeAttr("disabled");
//    } else {
//        $("#savework").prop("disabled", true);
//    }
//}
function LoadUsers() {
    openload();
    var firmcode = $('#hdnfirmcode').val();
    $.ajax({
        url: '/' + firmcode + '/firm/FirmUserList',
        data: "",
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {

            var obj = JSON.parse(response);
            $("#ddlFromUsers,#ddlToUsers").empty();
            $("#ddlFromUsers").empty().append("<option value=''>Select Users</option>")
            $.each(obj, function (i, a) {
                $("#ddlFromUsers").append("<option value='" + this.id + "' UserName='" + this.UserName + "' >" + this.UserName + " - ( " + this.RoleName + " )</option>")
                $("#ddlToUsers").append("<option value='" + this.id + "' IsCWRegistered='" + this.IsCWRegistered + "' UserName='" + this.UserName + "' >" + this.UserName + " - ( " + this.RoleName + " )</option>")
            }); //End of foreach Loop
            $("#ddlToUsers").prop("disabled", true);
            $('#ddlToUsers').multiselect({
                columns: 1,
                placeholder: 'Select User',
                search: true,
                selectAll: true
            });
            $("#ddlToUsers").multiselect("disable");
            $("#ddlToUsers").multiselect('reload');
            closeload();

        },
        error: function (response) {
            closeload();
            alert(response.responseText);
        },
        failure: function (response) {
            closeload();
            alert(response.responseText);
        }
    });
}

/*Load matter by user id*/
function loadmatterbyUserId(pageno) {
    hdnpagesize = 100;
    var formData = new FormData();
    var courtTypeName = $("#ddlCourtName").val();
    if ($("#ddlFromUsers").val() == "") {
        alert("Please select user");
        $("#bindbulkcases").empty();
        $("#pdatastatus").show();
        $(".settingpanel").hide();
        return false;
    }
    openload();
    var mattername = $("#casefiltercasename").val();
    formData.append("UserID", $("#ddlFromUsers").val());
    formData.append("UserName", $("#ddlFromUsers option:selected").attr("username"));
    formData.append("MatterName", mattername);
    formData.append("CourtType", $("#ddlCourtType").val());
    formData.append("CourtTypeName", courtTypeName);
    formData.append("PageSize", hdnpagesize);
    formData.append("PageNo", pageno)
    $.ajax({
        url: '/Firm/FirmMatterList',
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            closeload();
            var obj = JSON.parse(response);

            $("#bindbulkcases").empty();
            if (obj.length > 0) {
                $("#pdatastatus").hide();
                $("#removeBtn").show();
                //$(".settingpanel").show();
                //$("#totalResult").html(obj[0]["TotalRecord"]);
                //var AllowedPageNumber = parseInt(obj[0]["TotalRecord"]) / parseInt($("#hdnpagesize").val());
                var AllowedPageNumber = parseInt(obj[0]["TotalRecord"]) / parseInt(hdnpagesize);
                if (AllowedPageNumber % 1 != 0)
                    AllowedPageNumber = parseInt(AllowedPageNumber) + 1
                else
                    AllowedPageNumber = parseInt(AllowedPageNumber)


                //$("#TotalPage").html(AllowedPageNumber);
                //$("#spnPage").html("pages " + $("#hdncurrentPage").val() + "/ " + AllowedPageNumber + "")
                //$("#pagefromto").html(obj[0]["sno"] + " -" + obj[obj.length - 1]["sno"])
                //$("#ppagnumvalue").attr("max", AllowedPageNumber)

                if (pageno == AllowedPageNumber) {
                    $('#next').hide();
                    $('#prev').css("display", "block");
                }
                else {
                    $('#next').css("display", "block");
                }
                if (pageno == 1) {
                    $('#prev').css("display", "none");
                }
                else {
                    $('#prev').css("display", "block");
                }
                if (isRenderPage == false) {
                    renderPagination(pageno, AllowedPageNumber);
                }

                $.each(obj, function (i, a) {
                    $("#bindbulkcases").append("<tr><td><input type='checkbox' value='" + this.Id + "' usercaseid='" + this.UserCaseId + "'/></td><td>" + this.sno + "</td><td style='text-align:left'>" + this.mname + "</td>" +
                        "<td>" + this.mtrno + "</td>" +
                        "<td><span style=\"display: inline-flex; align-items: center; padding: 1px 5px; border: 1px solid #d1d5db; border-radius: 8px; background: #f9fafb; font-size: 12px; color: #374151; font-family: Arial, sans-serif; width: max-content;\"><img src='/newassets/img/court.svg' alt='court' style='width: 10px; height: 10px; margin-right: 6px;'>" + this.CourtName + "</span></td>" +
                        "<td>" + this.OtherCourtName + "</td>" +
                        "</tr>");
                }); //End of foreach Loop
            } else {
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
                $("#pdatastatus").show();
                //$("#bindbulkcases").append("<tr><td colspan='6'>No Record Found!</td></tr>");
                $(".settingpanel").hide();
            }

        }, //End of AJAX Success function
        failure: function (response) {
            $("#pdatastatus").show();
            closeload();
            // alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            closeload();
            // alert(response.responseText);
        } //End of AJAX error function
    });
}

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
//            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (pageindex <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        }
//    }

//    $("#pageNumbers").html(paginationHtml);
//    $("#prev").toggleClass("disabled", pageindex === 1);
//    $("#next").toggleClass("disabled", pageindex === totdata);
//    isRenderPage = true;
//}


function renderPagination(pageindex, totdata) {
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
//    //if (page) changePage(page);
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    loadmatterbyUserId(setPageNo)

//    $(".page-btn").removeClass("active");
//    $(this).addClass("active");
//});

$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    //if (page) changePage(page);
    isRenderPage = false;
    $("#txtgopage").val("");
    loadmatterbyUserId(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

//$(document).on('click', '#prev', function () {
//    if (setPageNo > 1) {
//        setPageNo = setPageNo - 1;
//    }
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    loadmatterbyUserId(setPageNo);

//    $(".page-btn").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//})

$(document).on('click', '#prev', function () {

    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    isRenderPage = false;
    $("#txtgopage").val("");
    //renderPagination(setPageNo, totalPageRec)
    loadmatterbyUserId(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

//$(document).on('click', '#next', function () {
//    if (setPageNo => 1) {
//        setPageNo = setPageNo + 1;
//    }
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    loadmatterbyUserId(setPageNo);
//    $(".page-btn").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});

$(document).on('click', '#next', function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = false;
    $("#txtgopage").val("");
    loadmatterbyUserId(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

//$(document).on('click', '#divGo', function () {
//    let goToPage = parseInt($("#txtgopage").val());
//    if (!isNaN(goToPage)) {
//        setPageNo = goToPage;
//    }
//    isRenderPage = true;
//    loadmatterbyUserId(setPageNo);
//    $(".page-btn").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//})
$(document).on('click', '#divGo', function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }

    if (goToPage > parseInt(totalPageRec)) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isRenderPage = false;
    loadmatterbyUserId(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

/*Case Assign*/
function AssignCase() {
    //var Caseid = "";
    //$('#bindbulkcases input[type="checkbox"]:checked').each(function (i) {
    //    if (i == 0)
    //        Caseid = Caseid + $(this).attr('value')
    //    else
    //        Caseid = Caseid + "," + $(this).attr('value')
    //})
    //var users = "";
    //for (var i = 0; i < $('#ddlToUsers').val().length - 1; i++) {
    //    if (i == 0)
    //        users = users + $('#ddlToUsers').val()[i]
    //    else
    //        users = users + "," + $('#ddlToUsers').val()[i]
    //}
    var courtTypeName = $("#ddlCourtName").val();

    var MatterID = $('#bindbulkcases input[type="checkbox"]:checked')
        .map(function () {
            var value = $(this).attr('value');
            return (value && value !== "null" && $.trim(value) !== "") ? value : null;
        })
        .get()
        .join(',');
    var UserCaseid = $('#bindbulkcases input[type="checkbox"]:checked')
        .map(function () {
            var value = $(this).attr('usercaseid');
            return (value && value !== "null" && $.trim(value) !== "") ? value : null;
        })
        .get()
        .join(',');

    var users = $('#ddlToUsers').val()
        .join(',');
    var NotReegistredUser = $("#ddlToUsers option[iscwregistered='0']:selected").map(function () {
        return $(this).val()
    }).get().join(',');
    var allToUserName =
        $("#ddlToUsers option:selected").map(function () {
            var value = $(this).attr('username');
            return (value && value !== "null" && $.trim(value) !== "") ? value : null;
        }).get().join(',')
    var formData = new FormData();
    formData.append("UserID", users);
    formData.append("AllToUserName", allToUserName);
    formData.append("MatterID", MatterID);
    formData.append("UserCaseid", UserCaseid);
    formData.append("FromUser", $('#ddlFromUsers').val())
    formData.append("FromUserName", $("#ddlFromUsers option:selected").attr("username"))
    formData.append("NotReegistredUser", NotReegistredUser)
    formData.append("courtTypeName", courtTypeName)
    openload();
    $.ajax({
        url: '/Firm/BulkMatterCaseAssign',
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            closeload();
            response = JSON.parse(response);
            if (response.Status) {
                //alert(response.Message);
                $("#MatterAssigned").modal();
                $('#ddlFromUsers').change();
            } else {
                alert(response.Message);
            }
        }, //End of AJAX Success function
        failure: function (response) {
            closeload();
            // alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            closeload();
            // alert(response.responseText);
        } //End of AJAX error function
    });
}
$(document).on('click', "#resetMatter", function () {
    $('#ddlFromUsers').val('');
    $(".ms-options input[type='checkbox']").prop("checked", false);
    $(".ms-options li").removeClass("selected");
    $(".ms-options-wrap > button").text("Select options");
    $("#bindbulkcases").html("");
    $("#removeBtn").hide();
    //$('#ddlToUsers').val(null).trigger('change');
})
/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}