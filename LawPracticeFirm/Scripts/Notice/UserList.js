var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    GetUserList(pageindex)
})
/*Get user notice list detail*/
function GetUserList(pageindex) {
    sessionStorage.removeItem("regid");
    openload();
    var html1 = '';
    var formdata = new FormData();
    formdata.append("pageindex", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("search", EncodeText($("#usrname").val()));
    formdata.append("userid", EncodeText(""));
    $.ajax({
        type: "POST",
        url: "/api/Home/UserList",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            $("#bindusrlist").html("");
            $("#usrlistfooter").html("");
            $("#nousrlist").html("");
            if (response == "") {
                $("#nousrlist").append("No user record found.");
                closeload();
                return false;
            }
            else {
                $.each(response, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    if (i === (response.length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (a.totRow > 0) {
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
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + a.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (a.totRow <= response.length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#usrlistfooter").append(tfot);
                    }
                    html1 += '<tr scope="row">';
                    html1 += '<td class="usridcls">' + a.UserName + '</td>';
                    html1 += '<td class="cname">' + a.cfname + '</td>' +
                        '<td class="designation">' + a.Designation + '</td>+<td class="department">' + a.Department + '</td>' +
                        '<td class="branch">' + a.Branch + '</td>';
                    if (a.IsPartner) {
                        html1 += '<td class="utype">Partner</td>';
                    }
                    else {
                        html1 += '<td class="utype">User</td>';
                    }
                    html1 += '<td class="rmanager">' + a.ReportingMangerName + '</td>';
                    html1 += '<td class="ppartner">' + a.PartnerName + '</td>' +
                        '<td class="email">' + a.EmailId + '</td>' + '<td class="mobile">' + a.cmobile + '</td>';
                    if (a.UserName == "" && a.Password == "") {
                        html1 += '<td class="status1"><button style="background-color:#999;border-radius: 12px;"><b style="color:#fff" onclick=fnCreatecredential(`' + a.LoginId + '`)>Create Credentials</b></button></td>';
                    }
                    else if (a.IsActive == 0 && a.UserName !== "" && a.Password !== "") {
                        html1 += '<td class="status1"><button style="background-color:#d9534f;border-radius: 12px;"><b style="color:#fff" onclick=fnEnableDisable("0",`' + a.LoginId + '`)>Disabled</b></button></td>';
                    }
                    else if (a.IsActive == 1 && a.UserName !== "" && a.Password !== "") {
                        html1 += '<td class="status1"><button style="background-color:#4CAF50;border-radius: 12px;"><b style="color:#fff" onclick=fnEnableDisable("1",`' + a.LoginId + '`)>Enabled</b></button></td>';
                    }
                    html1 += '<td class="date_time">' + a.date_time + '</td>';
                    html1 += '<td class="hrate">' + a.HRate + '</td>';
                    html1 += '<td class="empcode">' + a.EmployeeCode + '</td>';
                    html1 += '<td class="qualification">' + a.Qualification + '</td>';
                    html1 += '<td class="areaofexpertise">' + a.AreaOfExpertise + '</td>';
                    html1 += '<td class="pqe">' + a.PQE + '</td>';
                    html1 += '<td class="firmexperience">' + a.FirmExperience + '</td>';
                    html1 += '<td class="address">' + a.caddress + '</td>';
                    html1 += '<td class="city">' + a.ccity + '</td>';
                    html1 += '<td class="state">' + a.cstate + '</td>';
                    html1 += '<td class="country">' + a.country + '</td>';
                    html1 += '<td class="landline">' + a.clandline + '</td>';
                    html1 += '<td class="extention">' + a.Extention + '</td>';
                    html1 += '<td class="odetails">' + a.OtherDetails + '</td>';
                    if (a.IsActive) {
                        html1 += '<td><span class="glyphicon glyphicon-pencil" id="edituser" style="color:#069;cursor:pointer;" title="Edit member" onclick=fnEditUserDetail(`' + a.regId + '`)></span>&nbsp;|&nbsp' +
                            '<span class="fa fa-key" id="Resetuser" style="color:#069;cursor:pointer;" title="Reset Password" onclick=fnResetcredential(`' + a.LoginId + '`)></span></td>';
                    }
                    else {
                        html1 += '<td><span class="glyphicon glyphicon-pencil" id="edituser" style="color:#069;cursor:pointer;" title="Edit member" onclick=fnEditUserDetail(`' + a.regId + '`)></span></td>';
                    }
                    html1 += '</td></tr>';
                });
                $("#bindusrlist").append(html1);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
            closeload();
        },
        failure: function (response) {
            alert(data.responseText);
            closeload();
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
            closeload();
        } //End of AJAX error function
    });
}
$(document).on('click', '#pgetdatabypagenum', function () {
    ppageindex = $("#ppagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#psotopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                GetUserList(pageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});
$(document).on('click', '#ppaginate', function () {
    ppageindex = $(this).attr("index");
    GetUserList(pageindex);
});
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
/*Get notice list by search user name*/
$("#searchusrname").click(function () {
    var usrname = $("#usrname").val();
    if (usrname == "") {
        alert("enter user name");
        $("#usrname").focus();
        return false;
    }
    GetUserList(1)
});
$('#usrname').keyup(function () {
    var txtlength = $(this).val().length;
    if (txtlength > 0) {
    }
    else {
        GetUserList(1);
    }
});
/*Create credential*/
var FirmUserId = "";
function fnCreatecredential(FirmUserIdd) {
    $("#credentialModal").modal('show');
    FirmUserId = FirmUserIdd;
}
/*Reset credential*/
var memberid = "";
function fnResetcredential(memberidd) {
    $("#resetcredentialModal").modal('show');
    memberid = memberidd;
}
/*Reset user credentials*/
$("#resetcredentail").click(function () {
    if (confirm("Alert ! are you sure you want to reset credentials?")) {
        var copassword = $("#resetcopassword").val();
        var cocpassword = $("#resetcocpassword").val();
        if (copassword == "") {
            alert("Please enter password");
            document.getElementById("resetcopassword").focus();
            return false;
        }
        if (copassword.length < 10) {
            alert("Password must be atleast 10 Characters ");
            document.getElementById("resetcopassword").focus();
            return false;
        }
        if ($("#resetcopassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
            if (reg.test($("#resetcopassword").val()) == false) {
                alert("Password must contain atleast ten characters with combination of one uppercase and lowercase letter , one numeric and one special character");
                document.getElementById("resetcopassword").focus();
                return false;
            }
        }
        if (cocpassword == "") {
            alert("Please enter Confirm password");
            document.getElementById("resetcocpassword").focus();
            return false;
        }
        if (cocpassword.length < 10) {
            alert("Confirm password must be atleast 10 Characters ");
            document.getElementById("resetcocpassword").focus();
            return false;
        }
        if ($("#resetcocpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
            if (reg.test($("#resetcocpassword").val()) == false) {
                alert("Confirm Password must contain atleast ten characters with combination of one uppercase and lowercase letter , one numeric and one special character");
                document.getElementById("resetcocpassword").focus();
                return false;
            }
        }
        if (copassword != cocpassword) {
            alert("Passwords do not match!");
            return false;
        }
        if (memberid != "") {
            var formData = new FormData();
            formData.append("memberid", EncodeText(memberid));
            formData.append("copassword", EncodeText(copassword));
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/Home/ResetCredential",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data) {
                        alert("Password changed successfully.");
                    }
                    else {
                        alert("Something went wrong.");
                    }
                    $("#resetcredentialModal").modal('hide');
                    window.location.reload();
                }, //End of AJAX Success function
                failure: function (response) {
                    alert(data.message);
                    //alert(response.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    alert(data.message);
                    //alert(response.responseText);
                } //End of AJAX error function
            });
        }
    }
})
$('#eyeresetnewpswd').click(function () {
    if ($(this).hasClass('fa-eye-slash')) {
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
        $('#resetcopassword').attr('type', 'password');
    } else {
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        $('#resetcopassword').attr('type', 'text');
    }
});
$('#eyeresetconfirm').click(function () {
    if ($(this).hasClass('fa-eye-slash')) {
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
        $('#resetcocpassword').attr('type', 'password');
    } else {
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        $('#resetcocpassword').attr('type', 'text');
    }
});
$("#addcredentail").click(function () {
    if (confirm("Alert ! are you sure?")) {
        var copassword = $("#copassword").val();
        var cocpassword = $("#cocpassword").val();
        var couserid = $("#couserid").val();
        if (couserid == "") {
            alert("Please enter User Id");
            document.getElementById("couserid").focus();
            return false;
        }
        if (couserid.length < 5) {
            alert("User id should be more than or equal to five characters.");
            document.getElementById("couserid").focus();
            return false;
        }
        if (copassword == "") {
            alert("Please enter password");
            document.getElementById("copassword").focus();
            return false;
        }
        if (copassword.length < 10) {
            alert("Password must be atleast 10 Characters ");
            document.getElementById("copassword").focus();
            return false;
        }
        if ($("#copassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
            if (reg.test($("#copassword").val()) == false) {
                alert("Password must contain atleast ten characters with combination of one uppercase and lowercase letter , one numeric and one special character");
                document.getElementById("copassword").focus();
                return false;
            }
        }
        if (cocpassword == "") {
            alert("Please enter Confirm password");
            document.getElementById("cocpassword").focus();
            return false;
        }
        if (cocpassword.length < 10) {
            alert("Confirm password must be atleast 10 Characters ");
            document.getElementById("cocpassword").focus();
            return false;
        }
        if ($("#cocpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
            if (reg.test($("#cocpassword").val()) == false) {
                alert("Confirm Password must contain atleast ten characters with combination of one uppercase and lowercase letter , one numeric and one special character");
                document.getElementById("cocpassword").focus();
                return false;
            }
        }
        if (copassword != cocpassword) {
            alert("Passwords do not match!");
            return false;
        }
        if (FirmUserId != "") {
            var formData = new FormData();
            formData.append("FirmUserId", EncodeText(FirmUserId));
            formData.append("copassword", EncodeText(copassword));
            formData.append("couserid", EncodeText(couserid));
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/Home/GenerateCredential",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    alert(data.message);
                    $("#credentialModal").modal('hide');
                    GetUserList(pageindex);
                }, //End of AJAX Success function
                failure: function (response) {
                    alert(data.message);
                    //alert(response.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    alert(data.message);
                    //alert(response.responseText);
                } //End of AJAX error function
            });
        }
    }
})
/*Edit user details*/
function fnEditUserDetail(reguserId) {
    window.location.href = "/Home/CreateUser";
    sessionStorage.setItem("regid", reguserId);
}
/*Enable disable user details*/
function fnEnableDisable(currstatus, firmusrid) {
    var message = "";
    var status = null;
    if (currstatus == "0") {
        message = "Alert ! are you sure to enable this user."
        status = true;
    }
    else if (currstatus == "1") {
        message = "Alert ! are you sure to disable this user."
        status = false;
    }
    if (confirm(message)) {
        var formData = new FormData();
        formData.append("FirmUserId", EncodeText(firmusrid));
        formData.append("status", EncodeText(status));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/Home/UserEnableDisable",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                alert(data.message);
                GetUserList(pageindex);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.message);
                //alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.message);
                //alert(response.responseText);
            } //End of AJAX error function
        });
    }
}