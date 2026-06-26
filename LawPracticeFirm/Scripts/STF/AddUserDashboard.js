
var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
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
    $("#togglePassword").click(function () {
        clearUserForm();
        var passwordInput = $("#password");
        var eyeIcon = $("#togglePassword");
        if (passwordInput.attr("type") === "password") {
            passwordInput.attr("type", "text");
            eyeIcon.removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open");
        } else {
            passwordInput.attr("type", "password");
            eyeIcon.removeClass("fglyphicon-eye-open").addClass("glyphicon-eye-close");
        }
    });
    getstfUserTabularData();
})


function clearUserForm() {
    $("#userName").val("");
    $("#emailId").val("");

    $("#mobileNo").val("");

    $("#Designation").val("");

    $("#zone").val("");
    $("#userId").val("");
    $("#password").val("");

}


function SubmitUserDetails() {
    openload();
    var iid = 0;
    var email = $("#emailId").val();
    var mobile = $("#mobileNo").val();
    var userid = $("#userId").val();
    var Password = $("#password").val();
    var Name = $("#userName").val();
   // var MKUserId = "";
    var Zone = $("#zone").val();
    var Designation = $("#Designation").val();
    $.ajax({
        type: "POST",
        url: "/STF/ValidateUserExistOrNot",
        data: {
            iid: iid,
            email: email,
            mobile: mobile,
            userid: userid,
            Password: Password,
            Name: Name,
            Zone: Zone,
            Designation: Designation,
        },
        success: function (response) {
            if (response == "UserId exists") {
                alert("Mentioned user Id is already exist. Please change the User Id");
                $("#userId").focus();
            }
            else if (response == "Mobile number exists") {
                alert("Mentioned Mobile number is already exist. Please change the Mobile Number");
                $("#mobileNo").focus();
                
            }
            else if (response == "Email exists") {
                alert("Mentioned Email Id is already exist. Please change the Email Id");
                $("#emailId").focus();
            }
            
            else {
                clearUserForm();
                alert("User Detail's  Added successfully.");
                var obj = response;
                if (obj.length > 0) {
                }
                //GetProcessEntryTabularData();
            }


            closeload();
            // Handle the success response if needed
        },
        error: function (error) {
            closeload();

            // Handle error
        }
    });
}

//Get Tabular data 

function getstfUserTabularData() {
    
    openload();

    $.ajax({
        type: "POST",
        url: "/STF/UserDetailsTabularData",
        data: {
            pageNo: pageindex,
            pageSize: pagesize,
        },

        success: function (response) {
            var obj = response;
            var htmls = '';
            if (obj.length > 0) {
                $.each(obj, function (index, value) {

                    if (index === 0) {

                        firstvalue = value.rownum;

                    }
                    if (index === (length - 3)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;

                        var totdata = value.totRow;
                        var totpage = 0;
                        if (value.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;

                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);

                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }

                            $("#pagnumvalue").val(totpage);

                        }

                        var tfot = '';
                        $("#exportrecords").val(value.totRow);
                        tfot += '<div class="row"><div class="col-md-6"><ul>'
                        tfot += '<li>results <span>' + value.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                        if (value.totRow <= length) {

                        }
                        else if (pageno == 1) {

                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'

                        }

                        else {
                            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                        }

                        if (pageno < totpage) {
                            tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'

                        }


                        tfot += '</ul></div>'
                        tfot += '<div class="col-md-6"><ul class="pull-right"><div class="btn-group dropup "><a href="javascript:void()" class=" dropdown-toggle form-control selctInputFormat " style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action Selected</a><ul class="dropdown-menu settingaction " style="margin-left: -50px;"><li><a href="javascript:void()" id="oexcel" title="Export to Excel">Export to Excel</a></li></ul></div> </ul ></div >'
                        $("#ptfooter").html("");
                        $("#ptfooter").html(tfot);
                    }


                    htmls += '<tr>' +
                        '<td>' + value.rownum + '</td>' +
                        '<td>' + value.vName + '</td>' +
                        '<td>' + value.vEmail + '</td>' +
                        '<td>' + value.vMobile + '</td>' +

                        '<td>' + value.Designation + '</td>' +

                        '<td>' + value.vZone + '</td>' +
                        '<td>' + value.UserId + '</td>' +
                        '<td>' + value.EntryOn + '</td>' +
                        
                        '<td>' +
                        '<span id="updateUserById" class="glyphicon glyphicon-edit" style="color:black; cursor:pointer;" data-id="' + value.iid + '" data-Mkid="' + value.MKUserId + '"  data-toggle="modal" data-target="#UpdatePWDetaildata" title="Update User" onclick="UpdateUserById()"> </span>' + ' | '
                        + '<span id="deleteUserByid" class="glyphicon glyphicon-trash"   style=" color:black; cursor:pointer;" data-id="' + value.iid + '" data-Mkid="' + value.MKUserId + '" title="Delete User" onclick="DeleteUserById()">  </span>'
                    '</td>'
                    '</tr>';


                });

                $('#bindSTFuserData').html(htmls);
            } else {
                $("#ptfooter").html("");
                htmls += '<tr>' +
                    '<td colspan="7" style="text-align: center;">Data Not Found</td>' +
                    '</tr>';

                $('#bindSTFuserData').html(htmls);
            }
            closeload();
        },
        error: function (error) {
            closeload();

        }
    });
    closeload();

    return false;
}
