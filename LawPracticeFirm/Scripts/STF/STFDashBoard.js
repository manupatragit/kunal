var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var userCaseID = urlParams.get("userCaseID");
var MatterID = urlParams.get("MatterID");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var pagindexModal = 1,
    pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var Proname = "";
var PropAddress = "";
var Pwduserid = 0;
var hasPermission = false;
var CaseDetails = "";

//This function will call during loading the Js page
$(document).ready(function () {

    redirectPermission();
    EditPermission();
    CaseDetailsByCaseId();

    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        getPwdTabularData();
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
        getPwdTabularData();
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
        getPwdTabularData();

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
        getPwdTabularData();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


});


function CaseDetailsByCaseId() {
    $.ajax({
        type: "POST",
        url: "/STF/CaseDetailsByCaseId",
        data: {
            caseid: userCaseID,

        },
        success: function (response) {
            $("#CaseDetailsBind").text("");
            if (response.length > 0) {
                $("#CaseDetailsBind").text(response[0].Case_Diary);
                CaseDetails = response[0].Case_Diary;

            }
            else {
                $("#CaseDetailsBind").text("");
                CaseDetails = "";

            }

        },
        error: function (error) {
            $("#caseDetail").val("");

            // Handle error
        }
    });
}



function redirectToDashboard() {
    var newUrl = "/" + fcode + "/STF/ProcessEntryDashboard?userCaseID=" + userCaseID + "&MatterID=" + MatterID;
    window.location.href = newUrl;
}

//Clear the form 
function clearForm() {
    $("#userName").val('');
    $("#rank").val('');
    $("#so").val('');
    $("#contactNo").val('');
    $("#Address").val('');
    $("#empcode").val('');

}



//Submit form data to store in db
function submitFormData() {
    
    var empcode = $("#empcode").val();
    var name = $("#userName").val();
    var rank = $("#rank").val();
    var so = $("#so").val();
    var contactNo = $("#contactNo").val();
    var address = $("#Address").val();

    var contactRegex = /^\d{10}$/;

    if (contactNo !== "" ) {
        if (contactRegex.test(contactNo)) {

        } else {
            alert('Please enter the valid CONTACT NO.');
            $('#contactNo').focus();
            return false;
        }
    }
    //if (address == null || address == "") {
    //    alert('Please enter the ADDRESS.');
    //    $('#address').focus();
    //    return false;
    //}
    if (name == null || name == "") {
        alert('Please enter the Name.');
        $('#userName').focus();
        return false;
    }
    //if (rank == null || rank == "") {
    //    alert('Please enter the RANK.');
    //    $('#rank').focus();
    //    return false;
    //}
    //if (so == null || so == "") {
    //    alert('Please enter the S/O.');
    //    $('#so').focus();
    //    return false;
    //}
    //if (contactNo == null || contactNo == "") {
    //    alert('Please enter the CONTACT NO.');
    //    $('#contactNo').focus();
    //    return false;
    //}
    if (empcode == null || empcode == "") {
        alert('Please enter the IHRMSID.');
        $('#empcode').focus();
        return false;
    }



    $.ajax({
        type: "POST", 
        url: "/STF/AddpwDetails", 
        data: {
            name: name,
            rank: rank,
            so: so,
            contactNo: contactNo,
            address: address,
            empcode: empcode,
            usercaseId: userCaseID,
            caseDetail: CaseDetails

        },
        success: function (response) {
            if (response == 1) {
                alert("Detail's Added successfuly");
                clearForm();
                //EditPermission();
                getPwdTabularData();
            }
            else {
                alert("Employee code is already exist.");
            }
       

        },
        error: function (error) {
          
        }
    });



 
    return false;
}


//Get tabular data of pwd

function getPwdTabularData() {
    
    var empcode = $("#empcode").val();
    if(empcode.length < 4){
        empcode = null;
    }
    openload();

    $.ajax({
        type: "POST",
        url: "/STF/PwdUserTabularListData",
        data: {
            pageNo: pageindex,
            pageSize: pagesize,
            empCode: empcode,
            usercaeId: userCaseID

        },

        success: function (response) {
            var obj = response;
            var htmls = '';
            if (obj.length > 0) {
                $("#pdatastatus").hide();
                document.querySelector(".pagination").style.display = "flex";

                $.each(obj, function (index, value) {

                    if (index === 0) {

                        firstvalue = value.rownum;

                    }
                    if (index === (length - 3)) {
                        var totdata = value.totRow;
                        totrecord = value.totRow;
                       // $("#exportrecords").val(value.totRow);
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
                           // totalRecordCount = totpage;
                            renderPagination(pageindex, totpage);
                        }


                        //var pnext = pageindex;
                        //var pprev = pageindex;
                        //var pageno = pageindex;

                        //var totdata = value.totRow;
                        //var totpage = 0;
                        //if (value.totRow > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;

                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(pagesize);

                        //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }

                        //    $("#pagnumvalue").val(totpage);

                        //}

                        //var tfot = '';
                        //$("#exportrecords").val(value.totRow);
                        //tfot += '<div class="row"><div class="col-md-6"><ul>'
                        //tfot += '<li>results <span>' + value.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

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


                        //tfot += '</ul></div>'
                        //tfot += '<div class="col-md-6"><ul class="pull-right"><div class="btn-group dropup "><a href="javascript:void()" class=" dropdown-toggle form-control selctInputFormat " style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action Selected</a><ul class="dropdown-menu settingaction " style="margin-left: -50px;"><li><a href="javascript:void()" id="oexcel" title="Export to Excel">Export to Excel</a></li></ul></div> </ul ></div >'
                        //$("#ptfooter").html("");
                        //$("#ptfooter").html(tfot);
                    }


                    htmls += '<tr>' +
                        '<td>' + value.rownum + '</td>' +
                        '<td>' + value.employeeCode + '</td>' +
                        '<td>' + value.vName + '</td>' +
                        '<td>' + value.vRank + '</td>' +
                        '<td>' + value.FatherName + '</td>' +
                        '<td>' + value.vAddress + '</td>' +
                        '<td>' + value.ContactNo + '</td>' +
                        '<td>' +
                        '<span id="updateUserById" style="cursor:pointer;" data-id="' + value.PWId + '" data-name="' + value.vName + '" data-rank="' + value.vRank + '"  data-father="' + value.FatherName + '" data-address="' + value.vAddress + '"  data-contact="' + value.ContactNo + '" data-empcode="' + value.employeeCode + '" data-toggle="modal" data-target="#UpdatePWDetaildata"  title="Update User" onclick="UpdateUserById()"><img src="/newassets/img/edit-icon.png" /></span>' + '';

                    if (hasPermission) {
                        htmls += '<span id="deleteUserByid" style="cursor:pointer;" data-id="' + value.PWId + '"  title="Delete User" onclick="DeleteUserById()"><img src="/newassets/img/deletecasesingle-icon.png" /></span>' + '';
                        htmls += '<span id="AssignCase" style="cursor:pointer;" data-id="' + value.PWId + '"  title="Assign case " onclick="AssignCase()"><img src="/newassets/img/add-user.png" /></span>' + '';
                        htmls += '<span id="ListMapedCased" style="cursor:pointer;" data-toggle="modal" data-target="#MapCaseListModal" title="View Map case List" onclick="ListUserMapCased(' + value.PWId + ','+"false"+')"><img src="/newassets/img/causelist-icon.png" /></span>';

                    }

                    htmls += '</td>' +
                        '</tr>';

                    
                 
                });

                $('#bindSTFpwdData').html(htmls);
            } else {
                document.querySelector(".pagination").style.display = "none";

                //var html3 = "";
                //html3 += '<td colspan="2" align="center">' +
                //    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                //    '<h4>No PW list found</h4>' +
                //    '<p>We found no PW list.</p>' +
                //    '</td>';
                $("#pdatastatus").show();

                $('#bindSTFpwdData').html(html3);
            }
            closeload();
            //EditPermission();

        },
        error: function (error) {
            closeload();

        }
    });
    closeload();

    return false;
}


//Delate the user record from table through userid= @PWID
$(document).on('click', '#deleteUserByid', function () {
    if (window.confirm("Are you sure you want to Delete?")) {
        openload();
        var id = $(this).data('id');
        $.ajax({
            type: "POST",
            url: "/STF/PwdUserTabularListRemoveById",
            data: {
                PWId: id,
            },
            success: function (response) {
                alert("Data deleted successfully.");
                getPwdTabularData();
                closeload();
            },
            error: function (error) {
                closeload();

            }
        });
    } else {

    }
 

})

//Update user details section start

$(document).on('click', '#updateUserById', function () {

     Pwduserid = $(this).data('id');
    var name = $(this).data('name');
    var rank = $(this).data('rank');
    var father = $(this).data('father');
    var address = $(this).data('address');
    var ContactNo = $(this).data('contact');
    var empcode = $(this).data('empcode');
    $("#userName1").val(name);
    $("#rank1").val(rank);

    $("#so1").val(father);

    $("#contactNo1").val(ContactNo);

    $("#Address1").val(address);
    $("#empcode1").val(empcode);



   

})
$(document).on('click', '#closeModal', function () {

    Pwduserid = 0;
    clearForm1();

})

//Clear the form 
function clearForm1() {
    $("#userName1").val('');
    $("#rank1").val('');
    $("#so1").val('');
    $("#contactNo1").val('');
    $("#Address1").val('');
    $("#empcode1").val('');

}

function UpdateUserDetails() {
    var name = $("#userName1").val();
    var rank = $("#rank1").val();
    var so = $("#so1").val();
    var contactNo = $("#contactNo1").val();
    var address = $("#Address1").val();
    var empcode = $("#empcode1").val();

    var contactRegex = /^\d{10}$/;

    if (contactNo !== "") {
        if (contactRegex.test(contactNo)) {

        } else {
            alert('Please enter the valid CONTACT NO.');
            $('#contactNo').focus();
            return false;
        }
    }
   
    if (name == null || name == "") {
        alert('Please enter the Name.');
        $('#userName').focus();
        return false;
    }
    //if (rank == null || rank == "") {
    //    alert('Please enter the RANK.');
    //    $('#rank').focus();
    //    return false;
    //}
    //if (so == null || so == "") {
    //    alert('Please enter the S/O.');
    //    $('#so').focus();
    //    return false;
    //}
    //if (contactNo == null || contactNo == "") {
    //    alert('Please enter the CONTACT NO.');
    //    $('#contactNo').focus();
    //    return false;
    //}
    //if (address == null || address == "") {
    //    alert('Please enter the ADDRESS.');
    //    $('#address').focus();
    //    return false;
    //}
    if (Pwduserid == 0) {
        alert('Something went wrong');
        return false;
    }


    $.ajax({
        type: "POST",
        url: "/STF/UpdatepwDetailsById",
        data: {
            id: Pwduserid,
            name: name,
            rank: rank,
            so: so,
            contactNo: contactNo,
            address: address,
            empcode: empcode,
            usercaseId: "0",
            caseDetail: ""
        },
        success: function (response) {
            if (response == 1) {
                alert("Detail's updated successfuly");
                clearForm1();
                getPwdTabularData();
                Pwduserid = 0;
                $('#UpdatePWDetaildata').modal('hide');

            }
            else {
                alert("You cant update user name and hrmsid");
            }


        },
        error: function (error) {

        }
    });




    return false;
}

//Update user detail's section end



//Pagination Section Start for table 
$(document).on('click', '#getdatabypagenum', function () {


    ppageindex = $("#pagnumvalue").val();

    if (ppageindex != "undefined") {
        pageindex = ppageindex;
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#sotopage").text();

            if (ppageindex <= parseInt(ppageindesx)) {
                openload();
                getPwdTabularData();
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
                return false;
            }
        }
    }
});

$(document).on('click', '#getdatabypagenumNext', function () {



    if (pageindex != "undefined") {
        pageindex = pageindex + 1;

        getPwdTabularData();
    }
    else {
        alert("Please enter a valid page number.");
        closeload();
        return false;
    }


});

$(document).on('click', '#getdatabypagenumPrev', function () {



    if (pageindex != "undefined") {
        pageindex = pageindex - 1;

        getPwdTabularData();
    }
    else {
        alert("Please enter a valid page number.");
        closeload();
        return false;
    }


});

//Pagination End


//Download Tabular data Start


$(document).on('click', '#oexcel', function () {
    debugger
    openload();
    window.location = encodeURI("/STF/PwdUserTabularListDataDownloadDocx")

    alert("Download Successful: Excelsheet");
    closeload();
    //var url = window.location.href;
    //var index = url.indexOf("STFDashboard");

    //// Extract the substring before "STFDashboard"
    //var result = url.substring(0, index);

    //var downloadUrl = encodeURI(result + "PwdUserTabularListDataDownloadDocx");
    //window.location.href = downloadUrl;

})



function redirectPermission() {
    
    $.ajax({
        type: "POST",
        url: "/STF/StfPermissionuserValidate",
        data: {},
        success: function (response) {
            var obj = response;
            if (obj <= 0) {
                $('#redirectProcess').hide();
            }
            else {
                $('#redirectProcess').show();

            }
        },
        error: function (error) {


        }
    });
}



function EditPermission() {
    
    $.ajax({
        type: "POST",
        url: "/STF/StfPermissionuserValidateEditPermission",
        data: {
            'roleiid':"PWDeatils"
        },
        success: function (response) {
            var obj = response;
            if (obj <= 0) {
                $('#btnsubmit').hide();
                $('#btnclear').hide();
                $('#btnsubmit1').hide();
                $('#btnclear1').hide();
                hasPermission = false;
           

            }
            else {
                $('#btnsubmit').show();
                $('#btnclear').show();
                $('#btnsubmit1').show();
                $('#btnclear1').show();
                hasPermission = true;




            }
            getPwdTabularData();
        },
        error: function (error) {


        }
    });
}
function checkhrmsIdExist() {
    
    if ($("#empcode").val().length > 4) {
        $.ajax({
            type: "POST",
            url: "/STF/checkEmployeeCodeExist",
            //url: "/STF/ProcessReport",

            
            data: {
                'empoyeeCode': $("#empcode").val()
            },
            success: function (response) {
                var obj = response;
                if (obj[0] > 0) {
                    $("#idExistMessage").text("HRMS ID already exists.");
                } else {
                    $("#idExistMessage").text("");

                }
                
            },
            error: function (error) {


            }
        });
    }
    getPwdTabularData();

}




//Delate the user record from table through userid= @PWID
$(document).on('click', '#AssignCase', function () {
    
        var id = $(this).data('id');
        $.ajax({
            type: "POST",
            url: "/STF/MapPwusertoCase",
            data: {
                'pwid': id,
                'usercaseId': userCaseID,
                'caseDetails': CaseDetails
            },
            success: function (response) {
                if (response == 0) {
                    window.alert("This case has already been mapped with this PW user.")
                }
                else {
                    window.alert("Case Mapped Successfully.")

                }
            },
            error: function (error) {
                closeload();

            }
        });



})

var PWID = 0;
function ListUserMapCased( pwId,isRenderP) {
    PWID = pwId;
    $.ajax({
        type: "POST",
        url: "/STF/MapPwuserMapCaseList",
        data: {
            'pwid': pwId,
            'pageNo': pagindexModal,
            'pageSize': pagesizeModal
        },
        success: function (response) {
            var obj = response;
            var htmls = '';
            if (obj.length > 0) {
                $("#popdatastatus").hide();
                $("#dasPagination").show();
                $.each(obj, function (index, value) {
                        var pnext = pagindexModal;
                        var pprev = pagindexModal;
                        var pageno = pagindexModal;

                        var totdata = value.TotalCount;
                        var totpage = 0;
                        if (value.TotalCount > 0) {
                            //pnext = parseInt(pnext) + 1;
                            //if (pnext == 0) pnext = 1;

                            //pprev = parseInt(pageno) - 1;
                            //if (pprev == 0) pprev = 1;
                            //totpage = parseInt(totdata) / parseInt(pagesize);

                            //if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //    totpage = parseInt(totpage) + 1;
                            //}

                            //$("#pagnumvalue1").val(totpage);

                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pagindexModal == totpage) {
                                $('#dasnext').hide();
                                $('#dasprev').css("display", "block"); s
                            }
                            else {
                                $('#dasnext').css("display", "block");
                            }
                            if (pagindexModal == 1) {
                                $('#dasprev').css("display", "none");
                            }
                            else {
                                $('#dasprev').css("display", "block");
                            }
                            if (isRenderP == false) {
                                PopTotalPageRec = totpage;
                                popRenderPagination(pagindexModal, totpage);
                            }
                        }

                        //var tfot = '';
                        //tfot += '<ul>'
                        //tfot += '<li>results <span>' + value.TotalCount + '</span>  <span id="sotopage1" style="display:none">' + totpage + '</span></li>'

                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>pages ' + pagindexModal + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += `<li><input type="number" id="pagnumvalue1" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum1" style="margin-left:10px;">Go</button></a></li>`

                        //if (value.TotalCount <= length) {

                        //}
                        //else if (pageno == 1) {

                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1"></a></span>   <span>'

                        //}

                        //else {
                        //    tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1" ></a></span><span>'
                        //}

                        //if (pageno < totpage) {
                        //    tfot += '<a  id="paginate1" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext1"></a ></span ></li >'

                        //}


                        //tfot += '</ul>'
                        //$("#ptfooter1").html("");
                        //$("#ptfooter1").html(tfot);
             
                    htmls += '<tr>' +
                        '<td>' + value.RowNumber + '</td>' +
                        '<td>' + value.caseDetail + '</td>' +
                        '<td>' + value.entryBy + '</td>' +
                        '<td>' + value.EntryOn + '</td>' +
                        '<td>' +
                        '<span id="DeleteMapCaseId" style=" cursor:pointer;" data-id="' + value.MapId + '"  title="Delete User" onclick="DeleteMapCaseId()"><img src="/newassets/img/deletecasesingle-icon.png"</span>' +
                        '</td>' +
                        '</tr>';
                });
            } else {
                //$("#ptfooter1").html("");

                //htmls += '<tr>' +
                //    '<td colspan="5" style="text-align: center;">Data Not Found</td>' +
                //    '</tr>';
                $("#popdatastatus").show();
                $("#dasPagination").hide();
            }
            $('#bindmapedCaseList').html(htmls);

            closeload();
        },
        error: function (error) {

            closeload();
            // Handle error
        }
    });
}


        //Modal pagination

/*Pagination Start*/
var isPopRenderPage = false;
var PopTotalPageRec = "";
var popsetPageNo = 1;
function popRenderPagination(Poppageindex, totdata) {
    let totPages = totdata;
    pagindexModal = Poppageindex;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="poppage-btn ${i === Poppageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (Poppageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="poppage-btn ${i === Poppageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="poppage-btn ${j === Poppageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#daspageNumbers").html(paginationHtml);
    $("#dasprev").toggleClass("disabled", Poppageindex === 1);
    $("#dasnext").toggleClass("disabled", Poppageindex === totdata);
    isPopRenderPage = true;
}



$(document).on("click", ".poppage-btn", function () {
    let page = $(this).data("page");
    pagindexModal = page;
    isPopRenderPage = true;
    $("#dastxtgopage").val("");
    ListUserMapCased(PWID, isPopRenderPage);
    $(".poppage-btn").removeClass("active");
    $(".poppage-btn[data-page='" + pagindexModal + "']").addClass("active");
});

$(document).on("click", "#dasprev", function () {
    if (pagindexModal > 1) {
        pagindexModal = pagindexModal - 1;
    }
    isPopRenderPage = true;
    $("#dastxtgopage").val("");
    //renderPagination(popsetPageNo, totalPageRec)
    ListUserMapCased(PWID, isPopRenderPage);
    $(".poppage-btn").removeClass("active");
    $(".poppage-btn[data-page='" + pagindexModal + "']").addClass("active");
})
$(document).on("click", "#dasnext", function () {
    if (pagindexModal => 1) {
        pagindexModal = pagindexModal + 1;
    }
    isPopRenderPage = true;
    $("#dastxtgopage").val("");
    ListUserMapCased(PWID, isPopRenderPage);
    $(".poppage-btn").removeClass("active");
    $(".poppage-btn[data-page='" + pagindexModal + "']").addClass("active");
});
$(document).on("click", "#dasdivGo", function () {
    let goToPage = parseInt($("#dastxtgopage").val());
    if (!isNaN(goToPage)) {
        pagindexModal = goToPage;
    }

    if (goToPage > PopTotalPageRec) {
        alert("Please enter a valid page number.");
        pagindexModal = 1;
        return false;
    }
    isPopRenderPage = true;
    ListUserMapCased(PWID, isPopRenderPage);
    $(".poppage-btn").removeClass("active");
    $(".poppage-btn[data-page='" + pagindexModal + "']").addClass("active");
})


    /*Pagination End*/



    $(document).on('click', '#getdatabypagenumNext1', function () {

        

        if (pagindexModal != "undefined") {
            pagindexModal = parseInt(pagindexModal) + 1;

            ListUserMapCased(PWID);
        }
        else {
            alert("Please enter a valid page number.");
            closeload();
            return false;
        }


    });


    $(document).on('click', '#getdatabypagenum1', function () {

        
        ppageindex = $("#pagnumvalue1").val();

        if (ppageindex != "undefined") {
            pagindexModal = ppageindex;
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage1").text();

                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    ListUserMapCased(PWID);
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });



    $(document).on('click', '#getdatabypagenumPrev1', function () {

        

        if (pagindexModal != "undefined") {
            pagindexModal = parseInt(pagindexModal) - 1;

            ListUserMapCased(PWID);

        }
        else {
            alert("Please enter a valid page number.");
            closeload();
            return false;
        }


    });

$(document).on('click', '#closeModalPage', function () {
     pagindexModal = 1,
         pagesizeModal = 10,
         recordcountModal = 0,
         totrecordModal = 0;
    $("#MapCaseListModal").hide();

})



//Delate the user record from table through userid= @PWID
$(document).on('click', '#DeleteMapCaseId', function () {
    if (window.confirm("Are you sure you want to Delete?")) {
        openload();
        var id = $(this).data('id');
        $.ajax({
            type: "POST",
            url: "/STF/DeleteMapCaseToPwUser",
            data: {
                id: parseInt(id),
            },
            success: function (response) {
                alert("Data deleted successfully.");
                ListUserMapCased(PWID, isPopRenderPage);
                closeload();
            },
            error: function (error) {
                closeload();

            }
        });
    } else {

    }


})



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