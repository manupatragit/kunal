var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
/*Logout*/
$(document).ready(function () {
    if (userDetails == null) {
        Logout();
    }
    if (userDetails.RoleId == 1) {
        $("#menubar").append(`<li><a href="/Home/Dashboard">Dashboard</a></li>
<li class="dropdown">
                              <a style="cursor:pointer;" class="dropdown-toggle" data-toggle="dropdown">Notice<b class="caret"></b></a>
                              <ul class="dropdown-menu">
                               <li> <a href="/NoticeNew/Home">New Notice List</a></li>
                               <li> <a href="/NoticeReceived/Index">Notice Received</a> </li>
                               <li> <a href="/NoticeNew/NoticeReminder">Reminder Notice</a> </li>
                              </ul>
                              </li>
 <li> <a href="/RejoinderNotice/RejoinderHome" onclick="fnremovesession()">Rejoinder List</a> </li>
        <li> <a href="/NoticeNew/Archive">Archive Notice</a> </li>
                               <li class="dropdown">
                              <a style="cursor:pointer;" class="dropdown-toggle" data-toggle="dropdown">Document<b class="caret"></b></a>
                              <ul class="dropdown-menu">
                              <li> <a href="/Document/Index">Document</a></li>
                               <li> <a href="/azure/directorylist/0">Document Management</a> </li>
                              </ul>
                              <li/>
                               <li class="dropdown">
                    <a style="cursor:pointer" class="dropdown-toggle" data-toggle="dropdown" title="Tool Box"> <img src="/Content/assets/toolbox2.png" style="padding-top: 5px;"></a>
                    <ul class="dropdown-menu">
                        <li><a href="/Tools/CompareDocList" title="Compare Documents">Compare Documents</a></li>
                        <li><a href="/Tools/Translator" title="Translator">Translator</a></li>
                        <li><a href="/Tools/DigitalSignature" title="Digital Signature">Digital Signature</a></li>
                    </ul>
                </li>
 <li class="dropdown">
         <a style="cursor:pointer" class="dropdown-toggle" data-toggle="dropdown" title="Notifications"> <span class="glyphicon glyphicon-bell" style="font-size: 14px;padding-top: 5px;color: #0059c1;"></span>   </a>
         <span class="badge badge-light" id="countnotify" style="margin:-51px 0px 0px 21px;position:absolute;background-color:#e39d05 !important"></span>
         <ul class="dropdown-menu" id="notimenu" style="width:360px;height:240px;overflow: auto;">
         <li class="notification"></li>
         </ul>
         </li>
                              <li class="dropdown" style="float:right">
                              <a style="cursor:pointer;color: #0059c1" class="dropdown-toggle" data-toggle="dropdown" id="wlcomename"><b class="caret"></b></a>
                              <ul class="dropdown-menu">
                              <li><a href="/Home/UserList">Manage Users</a></li>
                              <li><a href="/Home/ClientList">Manage Clients</a></li>
                              <li><a href="#" onclick="changePassword()">Change Password</a></li>
                              <li><a href="#" onclick="Logout()">Sign Out</a></li>
                              </ul>
                              </li>
         `)
    }
    else if (userDetails.RoleId == 2) {
        $("#menubar").append(`<li><a href="/Home/Dashboard">Dashboard</a></li>
 <li class="dropdown">
                              <a style="cursor:pointer;" class="dropdown-toggle" data-toggle="dropdown">Notice<b class="caret"></b></a>
                              <ul class="dropdown-menu">
                               <li> <a href="/NoticeNew/Home">Notice List</a></li>
                              <li><a href="/NoticeNew/DraftNotice">Notice Shared To Me</a></li>
                               <li><a href="/NoticeReceived/Index">Notice Received</a></li>
 <li> <a href="/NoticeNew/NoticeReminder">Reminder Notice</a> </li>
                              </ul>
                              </li>
                            <li class="dropdown">
                              <a style="cursor:pointer;" class="dropdown-toggle" data-toggle="dropdown">Rejoinder<b class="caret"></b></a>
                              <ul class="dropdown-menu">
                               <li> <a href="/RejoinderNotice/RejoinderHome" onclick="fnremovesession()">Rejoinder List</a></li>
                              <li><a href="/RejoinderNotice/DraftRejoinderNotice">Rejoinder Notice Shared To Me</a></li>
                              </ul>
                              </li>
  <li> <a href="/NoticeNew/Archive">Archive Notice</a> </li>
                                <li class="dropdown">
                              <a style="cursor:pointer;" class="dropdown-toggle" data-toggle="dropdown">Document<b class="caret"></b></a>
                              <ul class="dropdown-menu">
                              <li> <a href="/Document/Index">Document</a></li>
                               <li> <a href="/azure/directorylist/0">Document Management</a> </li>
                              </ul>
                              <li/>
                                <li class="dropdown">
                    <a style="cursor:pointer" class="dropdown-toggle" data-toggle="dropdown" title="Tool Box"> <img src="/Content/assets/toolbox2.png" style="padding-top: 5px;"></a>
                    <ul class="dropdown-menu">
                        <li><a href="/Tools/CompareDocList" title="Compare Documents">Compare Documents</a></li>
                        <li><a href="/Tools/Translator" title="Translator">Translator</a></li>
                    </ul>
                </li>
                             <li class="dropdown">
                             <a style="cursor:pointer" class="dropdown-toggle" data-toggle="dropdown" title="Notifications"> <span class="glyphicon glyphicon-bell" style="font-size: 14px;padding-top: 5px;color: #0059c1;"></span>   </a>
                             <span class="badge badge-light" id="countnotify" style="margin:-51px 0px 0px 21px;position:absolute;background-color:#e39d05 !important"></span>
                             <ul class="dropdown-menu" id="notimenu" style="width:360px;height:240px;overflow: auto;">
                             <li class="notification"></li>
                            </ul>
                             </li>
                              <li class="dropdown" style="float:right">
                              <a style="cursor:pointer;color: #0059c1" class="dropdown-toggle" data-toggle="dropdown" id="wlcomename"><b class="caret"></b></a>
                              <ul class="dropdown-menu">
                              <li><a href="#" onclick="changePassword()">Change Password</a></li>
                              <li><a href="#" onclick="Logout()">Sign Out</a></li>
                              </ul>
                              </li>
         `)
    }
    else if (userDetails.RoleId == 3) {
        $("#menubar").append(`<li><a href="/Home/Dashboard">Dashboard</a></li>
                              <li><a href="/NoticeNew/DraftNotice">Received Notice</a></li>
                              <li><a href="/RejoinderNotice/DraftRejoinderNotice">Received Rejoinder Notice</a></li>
                               <li class="dropdown">
                              <a style="cursor:pointer;" class="dropdown-toggle" data-toggle="dropdown">Document<b class="caret"></b></a>
                              <ul class="dropdown-menu">
                              <li> <a href="/Document/Index">Document</a></li>
                               <li> <a href="/azure/AssignUserFileList">Document Management</a> </li>
                              </ul>
                              <li/>
                             <li class="dropdown">
                             <a style="cursor:pointer" class="dropdown-toggle" data-toggle="dropdown" title="Notifications"> <span class="glyphicon glyphicon-bell" style="font-size: 14px;padding-top: 5px;color: #0059c1;"></span>   </a>
                             <span class="badge badge-light" id="countnotify" style="margin:-51px 0px 0px 21px;position:absolute;background-color:#e39d05 !important"></span>
                             <ul class="dropdown-menu" id="notimenu" style="width:360px;height:240px;overflow: auto;">
                             <li class="notification"></li>
                             </ul>
                             </li>
                              <li class="dropdown" style="float:right">
                              <a style="cursor:pointer;color: #0059c1" class="dropdown-toggle" data-toggle="dropdown" id="wlcomename"><b class="caret"></b></a>
                              <ul class="dropdown-menu">
                              <li><a href="#" onclick="changePassword()">Change Password</a></li>
                              <li><a href="#" onclick="Logout()">Sign Out</a></li>
                              </ul>
                              </li>`)
    }
    if (userDetails != null) {
        $("#wlcomename").append(" " + userDetails.UserName);
        $("#welcmdiv").css('display', 'block')
    }
    GetNotification();
})
/*Remove session*/
function fnremovesession() {
    sessionStorage.removeItem("mainnoticeid");
}
$('#eyeoldpswd').click(function () {
    if ($(this).hasClass('fa-eye-slash')) {
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
        $('#oldpswd').attr('type', 'password');
    } else {
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        $('#oldpswd').attr('type', 'text');
    }
});
$('#eyenewpswd').click(function () {
    if ($(this).hasClass('fa-eye-slash')) {
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
        $('#newpswd').attr('type', 'password');
    } else {
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        $('#newpswd').attr('type', 'text');
    }
});
$('#eyecnfrmpswd').click(function () {
    if ($(this).hasClass('fa-eye-slash')) {
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
        $('#cnfmpswd').attr('type', 'password');
    } else {
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        $('#cnfmpswd').attr('type', 'text');
    }
});
/*Get notification*/
function GetNotification() {
    var formdata = new FormData();
    formdata.append("RoleId", EncodeText(userDetails.RoleId));
    formdata.append("CreatedBy", EncodeText(userDetails.Id));
    $.ajax({
        type: "POST",
        url: "/api/Home/GetReplyAlertById",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            if (response == null) {
                return false;
            }
            if (response.length > 0) {
                $("#countnotify").append(response[0].Unseen)
                $.each(response, function (i, a) {
                    var msg = a.Message;
                    if (userDetails.RoleId == 1) {
                        if (!a.IsSeenByRequester) {
                            $("#notimenu").append(
                                `<li class="notification"><div style="width:100% !important; margin-left: -11px;">
					     <p style="float:left">&nbsp;&nbsp;&nbsp;<i style="font-size:15px;color:#85d000;" class="glyphicon glyphicon-bell"></i>
                         <a href="javascript:void()" style="color:black; font-size:10px;padding:0 0 0 6px; width:100%;"
                         title="Please take action against notice - Subject: ('`+ a.NoticeSubject + `')" onclick="ChaeckNotification('` + a.NoticeId + `')">` + msg + `</a>
                      </p>
					 </div></li>`)
                        }
                        else {
                            $("#notimenu").append(
                                `<li class="notification"><div style="width:100% !important; margin-left: -11px;">
					     <p style="float:left">&nbsp;&nbsp;&nbsp;<i style="font-size:15px;color:#696969;" class="glyphicon glyphicon-bell"></i>
                         <a href="javascript:void()" style="color:#A9A9A9; font-size:10px;padding:0 0 0 6px; width:100%;"
                         title="Please take action against notice - Subject: ('`+ a.NoticeSubject + `')" onclick="ChaeckNotification('` + a.NoticeId + `')">` + msg + `</a>
                      </p>
					 </div></li>`)
                        }
                    }
                    else if (userDetails.RoleId == 2 || userDetails.RoleId == 3) {
                        if (!a.IsSeenByReceiver) {
                            $("#notimenu").append(
                                `<li class="notification"><div style="width:100% !important; margin-left: -11px;">
					     <p style="float:left">&nbsp;&nbsp;&nbsp;<i style="font-size:15px;color:#85d000;" class="glyphicon glyphicon-bell"></i>
                         <a href="javascript:void()" style="color:black; font-size:10px;padding:0 0 0 6px; width:100%;"
                         title="Please take action against notice - Subject: (`+ a.NoticeSubject + `)" onclick=ChaeckNotification("` + a.NoticeId + `")>` + msg + `</a>
                      </p>
					 </div></li>`)
                        }
                        else {
                            $("#notimenu").append(
                                `<li class="notification"><div style="width:100% !important; margin-left: -11px;">
					     <p style="float:left">&nbsp;&nbsp;&nbsp;<i style="font-size:15px;color:#696969;" class="glyphicon glyphicon-bell"></i>
                         <a href="javascript:void()" style="color:#A9A9A9; font-size:10px;padding:0 0 0 6px; width:100%;"
                         title="Please take action against notice - Subject: (`+ a.NoticeSubject + `)"  onclick=ChaeckNotification("` + a.NoticeId + `")>` + msg + `</a>
                      </p>
					 </div></li>`)
                        }
                    }
                })
            }
            else {
                $("#countnotify").append(0);
                $("#notimenu").append('<p style="color:blue;text-align:center">No Item to view.</p>')
            }
        },
        failure: function (response) {
            alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        }//End of AJAX error function
    });
}
function ChaeckNotification(id) {
    console.log(id);
}
/*Logout*/
function Logout() {
    sessionStorage.removeItem("LoginDetails");
    sessionStorage.clear();
    $("#welcmdiv").css('display', 'none');
    $.ajax({
        url: "/Login/Logout",
        dataType: 'json',
        success: function (response) {
            window.location.href = "/Login/Index"
        },
        failure: function (response) {
            alert("Something Went Wrong")
        },
        error: function (response) {
            alert("Something Went Wrong")
        }
    });
}

/*Change password*/
function changePassword() {
    $("#changepasswordmodal").modal('show');
}
$("#btnchangepaswd").click(function () {
    $("#spanerr").html("");
    var oldpswd = $("#oldpswd").val();
    var newpswd = $("#newpswd").val();
    var cnfmpswd = $("#cnfmpswd").val();
    if (oldpswd == "" || newpswd == "" || cnfmpswd == "") {
        $("#changepswderrspan").html("Alert ! passwod can't be empty.")
        return false;
    }
    if ($("#newpswd").val() != "") {
        var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
        if (reg.test($("#newpswd").val()) == false) {
            $("#changepswderrspan").html("Alert ! Password must be minimum ten characters, at least one uppercase letter, one lowercase letter, one number and one special character");
            $("#newpswd").css("border-color", "red")
            return false;
        }
    }
    if ($("#oldpswd").val() != "") {
        var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
        if (reg.test($("#oldpswd").val()) == false) {
            $("#changepswderrspan").html("Alert ! Password must be minimum ten characters, at least one uppercase letter, one lowercase letter, one number and one special character");
            $("#oldpswd").css("border-color", "red")
            return false;
        }
    }
    if ($("#cnfmpswd").val() != "") {
        var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/;
        if (reg.test($("#cnfmpswd").val()) == false) {
            $("#changepswderrspan").html("Alert ! Password must be minimum ten characters, at least one uppercase letter, one lowercase letter, one number and one special character");
            $("#cnfmpswd").css("border-color", "red")
            return false;
        }
    }
    if (oldpswd != "" && newpswd != "" && cnfmpswd != "") {
        if (newpswd == cnfmpswd) {
            var formData = new FormData();
            formData.append("LoginUserId", EncodeText(userDetails.Id));
            formData.append("OldPassword", EncodeText(oldpswd));
            formData.append("NewPassword", EncodeText(newpswd));
            $.ajax({
                type: "POST",
                url: "/api/Login/ChangePassword",
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response != null) {
                        alert(response)
                        $("#changepasswordmodal").modal('hide');
                    }
                    else {
                        alert("Something went wrong.")
                    }
                },
                failure: function (response) {
                    alert(data.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    alert(data.responseText);
                } //End of AJAX error function
            })
        }
        else {
            $("#spanerr").html("Alert ! New password & Confirm password mismatched.")
        }
    }
    else {
        $("#spanerr").html("Alert ! Field can't be empty.")
    }
})
/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
/*Remove login*/
function RemoveLogin() {
    $.ajax({
        type: "POST",
        url: "/api/Login/LogOff",
        success: function (response) {
        },
        failure: function (response) {
            alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        }//End of AJAX error function
    });
}
function ChaeckNotification(noticeid) {
    window.location.href = "/NoticeNew/ScheduleActivity";
    sessionStorage.setItem("schedulenoticeid", noticeid);
}