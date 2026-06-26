var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);

var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var pagindexModal = 1,
    pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var Proname = "";
var PropAddress = "";
var Pwduserid = 0;
var courtActionStatusId = "";
var PwStatusId = "";

$(document).ready(function () {
    StfRolesModule();
    jQuery('#UserList').multiselect({
        columns: 1,
        search: true,
        selectAll: false

    });

    stfuserrightTabularData();

    STFFirmuserList();
 
    $('#chkSelectViewall, #chkSelectEditall').on('change', function () {
        if ($(this).attr('id') === 'chkSelectViewall') {
            $('.chkView').prop('checked', $(this).prop('checked'));
        } else if ($(this).attr('id') === 'chkSelectEditall') {
            $('.chkEdit').prop('checked', $(this).prop('checked'));
        }
    });
    



});


function ChangeCheck() {
    $('#chkSelectViewall').prop('checked', $('.chkView:checked').length === $('.chkView').length);
    $('#chkSelectEditall').prop('checked', $('.chkEdit:checked').length === $('.chkEdit').length);

}



//Get user Roles Module
function StfRolesModule() {
    $.ajax({
        type: "POST",
        url: "/STF/StfRoleModule",
        data: {},
        success: function (response) {
            var obj = response;
            var htmls = '';

 

            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    htmls += '<tr>' +
                        '<td>' + value.Role + '</td>' +
                        '<td>' + '<input type="checkbox" name="check" id="chkView_' + value.Role + '" class="chkView" style="margin-right: 10px !important;" onclick="ChangeCheck()">' + '</td>' +
                        '<td>' + '<input type="checkbox" name="edit" id="chkEdit_' + value.Role + '" class="chkEdit"  style="margin-right: 10px !important;" onclick="ChangeCheck()">' + '</td>' +
                        '</tr>';
                });
                $('#BindRoleData').html(htmls);


            }
            else {
                $('#BindRoleData').html(htmls);

            }
        },
        error: function (error) {
            $('#BindRoleData').html(htmls);


        }
    });

    return false;
}


function STFFirmuserList() {
    $.ajax({
        type: "POST",
        url: "/STF/StfUserListForUserrights",
        data: {},
        success: function (response) {
            var obj = response;
            $("#UserList").html("");
            $(".ms-selectall").show();

            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    $("#UserList").append($("<option></option>").val(value.Id).text(value.name));
                });
                $("#UserList").multiselect('reload');
            }
        },
        error: function (error) {
            $("#UserList").html("");
            $("#UserList").multiselect('reload');
        }
    });

    return false;
}

function saveUserRIghts() {
    
   
    var isView = "";
    var pwdetailsModule = "93320A14-71BE-4B71-ABFE-9ABDAF98B15D";
    var ProcessEntry = "300BEBDC-6015-4994-B3BB-A0ACAA4EBC8C";
    var moduleid = "";
    var isEdit = "";
    var userlistData = ""
    if ($("#UserList").val().length > 0) {
        const userListValues = $("#UserList").val();
        count = 0
        for (let i = 0; i < userListValues.length; i++) {
            const value = userListValues[i];
            if ($('#chkView_PWDeatils').prop('checked') == true && $('#chkEdit_PWDeatils').prop('checked') == true) {
                userlistData = userlistData +","+ userListValues[i];
                moduleid = moduleid +","+ pwdetailsModule;
                isView = isView + ",1";
                isEdit = isEdit + ",1";
                count += count;

            }
           else  if ($('#chkView_PWDeatils').prop('checked') != true && $('#chkEdit_PWDeatils').prop('checked') == true) {
                userlistData = userlistData + "," + userListValues[i];
                moduleid = moduleid + "," + pwdetailsModule;
                isView = isView + ",1";
                isEdit = isEdit + ",1";
                count += count;

            }
            else if ($('#chkView_PWDeatils').prop('checked') == true && $('#chkEdit_PWDeatils').prop('checked') != true) {
                userlistData = userlistData + "," + userListValues[i];
                moduleid = moduleid + "," + pwdetailsModule;
                isView = isView + ",1";
                isEdit = isEdit + ",0";
                count += count;

            }
           
        }
       
        for (let i = 0; i < userListValues.length; i++) {
            const value = userListValues[i];
            if ($('#chkView_ProcessEntry').prop('checked') == true && $('#chkEdit_ProcessEntry').prop('checked') == true) {
                userlistData = userlistData + "," + userListValues[i];
                moduleid = moduleid + "," + ProcessEntry;
                isView = isView + ",1";
                isEdit = isEdit + ",1";
                count += count;

            }
            else if ($('#chkView_ProcessEntry').prop('checked') != true && $('#chkEdit_ProcessEntry').prop('checked') == true) {
                userlistData = userlistData + "," + userListValues[i];
                moduleid = moduleid + "," + ProcessEntry;
                isView = isView + ",1";
                isEdit = isEdit + ",1";
                count += count;

            }
            else if ($('#chkView_ProcessEntry').prop('checked') == true && $('#chkEdit_ProcessEntry').prop('checked') != true) {
                userlistData = userlistData + "," + userListValues[i];
                moduleid = moduleid + "," + ProcessEntry;
                isView = isView + ",1";
                isEdit = isEdit + ",0";
                count += count;

            }

        }
        if (moduleid == "" || moduleid == null && moduleid == "" || moduleid == null && moduleid == "" || moduleid == null) {
            userlistData = userListValues.toString();
        }
        userlistData = userlistData.replace(/^,|,$/g, '');
        moduleid = moduleid.replace(/^,|,$/g, '');
        isView = isView.replace(/^,|,$/g, '');
        isEdit = isEdit.replace(/^,|,$/g, '');

        $.ajax({
            type: "POST",
            url: "/STF/StfInsertAndUpdateUserrights",
            data: {
                'userids': userlistData,
                'moduleids': moduleid,
                'isView': isView,
                'isEdit': isEdit

            },
            success: function (response) {
                var obj = response;
              
                if (obj > 0) {
                    window.alert("User right's assign successfully.")
                    
                    $('#chkSelectViewall').prop('checked', false);                  
                    $('#chkSelectEditall').prop('checked', false);
                    $('#chkView_ProcessEntry').prop('checked', false);
                    $('#chkEdit_ProcessEntry').prop('checked', false);
                    $('#chkView_PWDeatils').prop('checked', false);
                    $('#chkEdit_PWDeatils').prop('checked', false);
                    $('#multiselectUserField').show();
                    $('#userText').text("");
                    $('#userNameRight').hide();
                    $("#UserList").val("")
                    $("#UserList").multiselect('reload');
                    $('#btnMangaeUser').hide();

                    stfuserrightTabularData();
                }
            },
            error: function (error) {
                window.alert("Some thing went wrong.")

            }
        });

    }

    else {
        $("#UserList").focus();
        window.alert("Please select the user.");
        return;
    }


}


function stfuserrightTabularData() {
    openload();
    $.ajax({
        type: "POST",
        url: "/STF/TabularDataOFStfRolesRightUser",
        data: {
            'pageNo': pageindex,
            'pageSize':pagesize

        },
        success: function (response) {
            var obj = response;
            var htmls = '';
            if (obj.length > 0) {
                $("#pdatastatus").hide();
                $("#mtrPagination").show();
                $.each(obj, function (index, value) {

                    if (index === 0) {

                        firstvalue = value.RId;

                    }
                    if (index === (length - 3)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;

                        var totdata = value.TotalRecord;
                        var totpage = 0;
                        if (value.TotalRecord > 0) {
                            //pnext = parseInt(pnext) + 1;
                            //if (pnext == 0) pnext = 1;

                            //pprev = parseInt(pageno) - 1;
                            //if (pprev == 0) pprev = 1;
                            //totpage = parseInt(totdata) / parseInt(pagesize);

                            //if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //    totpage = parseInt(totpage) + 1;
                            //}

                            //$("#pagnumvalue").val(totpage);

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
                                tatalRecordCount = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                        //var tfot = '';
                        //// $("#exportrecords").val(value.TotalRecord);
                        //tfot += '<div class="row"><div class="col-md-6"><ul>'
                        //tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                        //if (value.TotalRecord <= length) {

                        //}
                        //else if (pageno == 1) {

                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'

                        //}

                        //else {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                        //}

                        //if (pageno < totpage) {
                        //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'

                        //}


         
                        //$("#ptfooter").html("");
                        //$("#ptfooter").html(tfot);
                    }


                    htmls += '<tr>' +
                        '<td>' + value.RId + '</td>' +
                        '<td>' + value.name + '</td>' +
                        '<td>' + value.userName + '</td>' +
                        '<td>' + value.emailId + '</td>' +
                   
                        '<td>' +
                        '<span id="userRightUpdate" class="glyphicon glyphicon-edit" style="color:black; cursor:pointer;" title="Update user right" onclick="UserRightDetails(\'' + encodeURIComponent(value.userid) + '\', \'' + encodeURIComponent(value.name) + '\')" ></span>'
                        +'</tr>';


                });

                $('#binduserRight').html(htmls);
                closeload();
            } else {
                //$("#ptfooter").html("");
                //htmls += '<tr>' +
                //    '<td colspan="5" style="text-align: center;">Data Not Found</td>' +
                //    '</tr>';

                //$('#binduserRight').html(htmls);
                $("#pdatastatus").show();
                $("#mtrPagination").hide();
                closeload();

            }


        
        },
        error: function (error) {
            closeload();


        }
    });
    closeload();

    return false;
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
    loaddatalist(setPageNo);
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
    //renderPagination(setPageNo, totalPageRec)
    loaddatalist(setPageNo);
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
    loaddatalist(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

$("#divGo").click(function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }

    if (goToPage > tatalRecordCount) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    loadflag = true;
    isRenderPage = true;
    loaddatalist(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

    /*Pagination End*/

function UserRightDetails(userId, name) {
    // $('#UserList').val(""); // Removed redundant line
    
    $('#chkView_PWDeatils').prop('checked', false);
    $('#chkEdit_PWDeatils').prop('checked', false);
    $('#chkView_ProcessEntry').prop('checked', false);
    $('#chkEdit_ProcessEntry').prop('checked', false);
    $('#UserList').val("");
   // $('#UserList').prop('disabled', true);
    $('#multiselectUserField').hide();
    $('#btnMangaeUser').show();
    $('#userText').text(decodeURIComponent(name));
    $('#userNameRight').show();
    $('#UserList option[value="' + userId + '"]').prop('selected', true);
    $("#UserList").multiselect('reload');


    $.ajax({
        type: "POST",
        url: "/STF/DetailsOfStfRolesRightUser",
        data: {
            'userid': userId
        },
        success: function (response) {
            var obj = response;
            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    if (value.Role == "PWDeatils") {
                        $('#chkView_PWDeatils').prop('checked', value.isView);
                        $('#chkEdit_PWDeatils').prop('checked', value.isEdit);
                    }
                    else if (value.Role == "ProcessEntry") {
                        $('#chkView_ProcessEntry').prop('checked', value.isView);
                        $('#chkEdit_ProcessEntry').prop('checked', value.isEdit);
                    }
                    $('#chkSelectViewall').prop('checked', $('.chkView:checked').length === $('.chkView').length);
                    $('#chkSelectEditall').prop('checked', $('.chkEdit:checked').length === $('.chkEdit').length);
                });
            }
        },
        error: function (error) {
            // Handle error if needed
        }
    });

    // Bind event handlers

    

    return false;
}


function ManageNewUserRight() {
    $('#multiselectUserField').show();

    $('#userText').text("");
    $('#userNameRight').hide();
    $("#UserList").val("")
    $("#UserList").multiselect('reload');
    $('#btnMangaeUser').hide();
    $('#chkSelectViewall').prop('checked', false);
    $('#chkSelectEditall').prop('checked', false);
    $('#chkView_ProcessEntry').prop('checked', false);
    $('#chkEdit_ProcessEntry').prop('checked', false);
    $('#chkView_PWDeatils').prop('checked', false);
    $('#chkEdit_PWDeatils').prop('checked', false);
}




