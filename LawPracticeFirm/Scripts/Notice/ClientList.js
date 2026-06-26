var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    GetUserList(pageindex)
})
/*Get client user list*/
function GetUserList(pageindex) {
    sessionStorage.removeItem("ClientId");
    openload();
    var html1 = '';
    var formdata = new FormData();
    formdata.append("pageindex", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("search", EncodeText($("#usrname").val()));
    formdata.append("userid", EncodeText(""));
    $.ajax({
        type: "POST",
        url: "/api/Home/ClientList",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            $("#bindclientlist").html("");
            $("#clientlistfooter").html("");
            $("#noclientlist").html("");
            if (response == "") {
                $("#noclientlist").append("No client record found.");
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
                        $("#clientlistfooter").append(tfot);
                    }
                    html1 += '<tr scope="row">';
                    html1 += '<td class="usridcls">' + a.loginName + '</td>';
                    html1 += '<td class="pfname">' + a.fname + '</td>' +
                        '<td class="plname">' + a.lname + '</td>+<td class="pmobno">' + a.mobno + '</td>';
                    html1 += '<td class="pContactType">' + a.ProfileType + '</td>';
                    html1 += '<td class="pcemail">' + a.cemail + '</td>';
                    html1 += '<td class="pPtype">' + a.PropectType + '</td>' +
                        '<td class="psource">' + a.SourceRef + '</td>' + '<td class="pcadd1">"" </td>';
                    html1 += '<td class="pcweb">' + a.cwebsite + '</td>';
                    html1 += '<td class="pdesignation">' + a.Designation + '</td>';
                    html1 += '<td class="pcompanyname">' + a.CompanyName + '</td>' +
                        '<td class="pinfo">' + a.cnotes + '</td>';
                    html1 += '<td class="ppin">' + a.Pin + '</td>';
                    html1 += '<td class="pcountry">' + a.Country + '</td>';
                    html1 += '<td class="pstate">' + a.State + '</td>';
                    html1 += '<td class="pcity">' + a.City + '</td>';
                    html1 += '<td class="pcasetype">' + a.casetype + '</td>';
                    html1 += '<td class="pcreatedby">' + a.CreatedBy + '</td>';
                    html1 += '<td class="prospectdocs"> </td>';
                    html1 += '<td class="Landline">' + a.offno + '</td>';
                    html1 += '<td class="GSTNo">' + a.GSTINNo + '</td>';
                    html1 += '<td class="PANNo">' + a.PANNo + '</td>';
                    html1 += '<td class="AadharNo">' + a.AadharCardNo + '</td>';
                    html1 += '<td class="CompanyStructure">' + a.CompanyStructure + '</td>';
                    if (a.loginName == "" && a.loginpswd == "") {
                        html1 += '<td class="status1"><button style="background-color:#999;border-radius: 12px;"><b style="color:#fff" onclick=fnCreatecredential(`' + a.LoginId + '`)>Create Credentials</b></button></td>';
                    }
                    else if (a.IsActive == 0 && a.loginName !== "" && a.loginpswd !== "") {
                        html1 += '<td class="status1"><button style="background-color:#d9534f;border-radius: 12px;"><b style="color:#fff" onclick=fnEnableDisable("0",`' + a.LoginId + '`)>Disabled</b></button></td>';
                    }
                    else if (a.IsActive == 1 && a.loginName !== "" && a.loginpswd !== "") {
                        html1 += '<td class="status1"><button style="background-color:#4CAF50;border-radius: 12px;"><b style="color:#fff" onclick=fnEnableDisable("1",`' + a.LoginId + '`)>Enabled</b></button></td>';
                    }
                    html1 += '<td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditClient("' + a.ClientId + '") title="Edit Client"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=DeleteClient("' + a.ClientId + '") title = "Delete Client" ></a></td>';
                    html1 += '</td></tr>';
                });
                $("#bindclientlist").append(html1);
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
/*Get user list by page number*/
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
/*Enable disable user list*/
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
                window.location.reload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.message);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.message);
            } //End of AJAX error function
        });
    }
}
/*Create user credentials*/
var FirmUserId = "";
function fnCreatecredential(FirmUserIdd) {
    $("#credentialModal").modal('show');
    FirmUserId = FirmUserIdd;
}
/*Reset user credentials*/
var memberid = "";
function fnResetcredential(memberidd) {
    $("#resetcredentialModal").modal('show');
    memberid = memberidd;
}
/*Reset user credentials*/
$("#resetcredentail").click(function () {
    if (confirm("Alert ! are you sure you want to reset credentials?")) {
        var copassword = $("#copassword").val();
        var cocpassword = $("#cocpassword").val();
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
/*Add new credentials*/
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

/*Search user name*/
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

/*Delete client details*/
function DeleteClient(Id) {
    if (confirm("Alert ! are you sure")) {
        var formdata = new FormData();
        formdata.append("ClientId", EncodeText(Id));
        $.ajax({
            type: "POST",
            url: "/api/Home/InactiveClient",
            dataType: 'json',
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                alert(response.message);
                GetUserList(pageindex);
            },
            error: function (response) {
                alert(response.message);
                GetUserList(pageindex);
            }
        })
    }
}
/*Edit client details*/
function EditClient(Id) {
    window.location.href = "/Home/CreateClient";
    sessionStorage.setItem("ClientId", Id);
}