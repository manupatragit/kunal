var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    LoadUserGroupData(pageindex);
    /*Search data by group name*/
    $("#searchdatas").click(function () {
        var groupname = $("#txtgroupsearch").val();
        if (groupname.length == 0) {
            alert("Enter Team Name");
        }
        LoadUserGroupData(pageindex);
    });
    var chksflag = true;
    $(document).on('keyup', '#txtgroupsearch', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                LoadUserGroupData(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#addNewgroup', function () {
        $("#divusergroupLabel").html("");
        var lblusergroup = '<h4 class="modal-title" id="myModalLabel">Create New Team</h4>';
        $("#divusergroupLabel").html(lblusergroup);
        $("#txtnewgroupname").val("");
        $("#hidgroupid").val("");
        $("#hidIsClone").val("0");
        $("#modalNewgroup").modal();
        GetUsersbyFirmid_Roleid();
        /*Get user by firm id and role id*/
        function GetUsersbyFirmid_Roleid() {
            var html3 = '';
            var formData = new FormData();
            formData.append("igroupid", "");
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/RoleApi/UsersbyFirmid_Roleid",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data != "") {
                        $("#rUsers").html("");
                    }
                    else {
                        $("#rUsers").html("No User !");
                    }
                    var length = response1.Data.length;
                    $.each(response1.Data, function (i, a) {
                        var LoginId = a.LoginId;
                        var cfname = a.cfname;
                        var EmailId = a.EmailId;
                        html3 += '<li><input id="chkUsergroupteam" type="checkbox" class="shcheckbox1" name="fname" value="' + LoginId + '"><a href="#" class="dropdown-item">' + cfname + '</a></li>'
                    });
                    $("#rUsers").html("");
                    $("#rUsers").append(html3);
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });

    /*Add new user group*/
    $(function () {
        $("#rSaveNewGroup").click(function () {
            var newgroupname = $("#txtnewgroupname").val();
            var groupval = $("#hidgroupid").val();
            var isClone = $("#hidIsClone").val();
            var val = [];
            var userloginids = "";
            $(':checkbox:checked').each(function (i) {
                val[i] = $(this).val();
                userloginids += val[i] + ",";
            });
            if (newgroupname == "") {
                alert("Enter team name");
                return false;
            }
            if (userloginids == "") {
                alert("Select user(s) for team");
                return false;
            }
            var formData = new FormData();
            formData.append("userloginids", userloginids);
            formData.append("newgroupname", newgroupname);
            formData.append("igroupId", groupval);
            formData.append("isClone", isClone);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/RoleApi/AddNewUserGroupData",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data == "Success") {
                        alert("Team created successfully");
                        $("#txtnewgroupname").val("");
                        $(".close").click();
                        LoadUserGroupData(1);
                    }
                    else if (response1.Data == "Exist") {
                        alert("Team name already exists, please try another name");
                    }
                    else if (response1.Data == "error") {
                        alert("Oops! Something went wrong..");
                    }
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        });
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        LoadUserGroupData(pageindex);
    });
});

/*View user group details*/
function LoadUserGroupData(pageindex) {
    $("#tfooter").html("");
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("groupfilter", $("#txtgroupsearch").val());
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/ViewUserGroupsData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#dataescstatus").html("");
            }
            else {
                $("#dataescstatus").html("No result found !");
                closeload();
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                if (i === 0) {
                    firstvalue = a.rownum;
                }
                if (i === (length - 1)) {
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
                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    if (a.totRow <= length) {
                    }
                    else if (pageno == 1) {
                    }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                    }
                    $("#tfooter").append(tfot);
                }
                qty1 = qty1 + 1;
                var GroupId = a.iGroupId;
                var Groupname = a.vGroupname;
                var CreatedDate = a.dCreatedDate;
                var UpdatedDate = a.dUpdatedDate;
                var UserCount = a.UserCount;
                var edit = '<a data-toggle="tab" href="#" id="edtNewgroup" onclick=fn_SetEditGroupId("' + GroupId + '")><span class="glyphicon glyphicon-pencil"></span></a>';
                var deletegroup = '<a data-toggle="tab" href="#" id="delNewgroup" onclick=fn_DeleteGroupId("' + GroupId + '")><span class="glyphicon glyphicon-trash" style="color:red;"></span></a>';
                var clone = '<a data-toggle="tab" href="#" id="cloneNewgroup" onclick=fn_SetCloneGroupId("' + GroupId + '")>clone</a>';
                html3 += '<tr>'
                html3 += '<td>'
                html3 += '<span id="clname">' + Groupname + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" ><a data-toggle="tab" href="#" id="showUserContDetails" onclick=fn_showUserContDetails("' + GroupId + '")>' + UserCount + '</a></span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + formatDatetoIST(CreatedDate) + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >'
                if (a.oedit == 1) {
                    html3 += '' + edit + ' |'
                }
                if (a.odelete == 1) {
                    html3 += '' + deletegroup + ' |'
                }
                if (a.ocreate == 1) {
                    html3 += '' + clone + ' '
                }
                html3 += '</span>'
                html3 += '</td>'
                html3 += '</tr>'
            });
            $("#bindcasetask").html("");
            $("#bindcasetask").append(html3);
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
}

/*Set edit user group id*/
function fn_SetEditGroupId(groupval) {
    $("#divusergroupLabel").html("");
    var lblusergroup = '<h4 class="modal-title" id="myModalLabel">Edit Teams</h4>';
    $("#divusergroupLabel").html(lblusergroup);
    $("#hidIsClone").val("0");
    $("#modalNewgroup").modal();
    GetUsersbyFirmid_Roleid(groupval);
    UserGroupbyiGroupId(groupval);
    function GetUsersbyFirmid_Roleid(groupval) {
        $("#hidgroupid").val(groupval);
        $("#rUsers").html("");
        var html3 = '';
        var formData = new FormData();
        formData.append("igroupid", groupval);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/UsersbyFirmid_Roleid",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#rUsers").html("");
                }
                else {
                    $("#rUsers").html("No User !");
                }
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    var LoginId = a.LoginId;
                    var cfname = a.cfname;
                    var EmailId = a.EmailId;
                    var isChecked = a.isUsergroup;
                    if (isChecked == 1) {
                        html3 += '<li><input checked id="chkUsergroupteam" type="checkbox" class="shcheckbox1" name="fname" value="' + LoginId + '"><a href="#" class="dropdown-item">' + cfname + '</a></li>'
                    }
                    else {
                        html3 += '<li><input id="chkUsergroupteam" type="checkbox" class="shcheckbox1" name="fname" value="' + LoginId + '"><a href="#" class="dropdown-item">' + cfname + '</a></li>'
                    }
                });
                $("#rUsers").html("");
                $("#rUsers").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
}

/*Delete group id*/
function fn_DeleteGroupId(groupval) {
    if (confirm("Are you sure want to delete this user Team!")) {
        var formData = new FormData();
        formData.append("igroupid", groupval);
        formData.append("flag", 0);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/RemoveUserGroupbyiGroupId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    LoadUserGroupData(pageindex);
                    alert("Successfully deleted");
                }
                else if (response1.Data == "error") {
                    alert("Oops! Something went wrong..");
                }
            }
        });
    }
}

/*Clone group id*/
function fn_SetCloneGroupId(groupval) {
    $("#divusergroupLabel").html("");
    var lblusergroup = '<h4 class="modal-title" id="myModalLabel">Create New Team</h4>';
    $("#divusergroupLabel").html(lblusergroup);
    $("#hidgroupid").val(groupval);
    $("#hidIsClone").val("1");
    $("#modalNewgroup").modal();
    GetUsersbyFirmid_Roleid();
    UserGroupbyiGroupId(groupval);
    function GetUsersbyFirmid_Roleid() {
        var html3 = '';
        var formData = new FormData();
        formData.append("igroupid", groupval);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/UsersbyFirmid_Roleid",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#rUsers").html("");
                }
                else {
                    $("#rUsers").html("No User !");
                }
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    var LoginId = a.LoginId;
                    var cfname = a.cfname;
                    var EmailId = a.EmailId;
                    var isChecked = a.isUsergroup;
                    if (isChecked == 1) {
                        html3 += '<li><input checked id="chkUsergroupteam" type="checkbox" class="shcheckbox1" name="fname" value="' + LoginId + '"><a href="#" class="dropdown-item">' + cfname + '</a></li>'
                    }
                    else {
                        html3 += '<li><input id="chkUsergroupteam" type="checkbox" class="shcheckbox1" name="fname" value="' + LoginId + '"><a href="#" class="dropdown-item">' + cfname + '</a></li>'
                    }
                });
                $("#rUsers").html("");
                $("#rUsers").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
}

/*Get user by group id*/
function UserGroupbyiGroupId(groupval) {
    groupname = "";
    var igroupid = groupval;
    $("#txtnewgroupname").val(groupname);
    var formData = new FormData();
    formData.append("igroupid", igroupid);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/UserGroupbyiGroupId",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var length = response1.Data.length;
            groupname = response1.Data[0].vGroupname;
            $("#txtnewgroupname").val(groupname);
        }
    });
}
$(function () {
    $("#groupcancel").click(function () {
        $(".close").click();
    });
});
function fn_showUserContDetails(groupval) {
    $("#modalUserCountView").modal();
    var html3 = '';
    var formData = new FormData();
    formData.append("igroupid", groupval);
    formData.append("flag", 0);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/UserDetailsbyiGroupId",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#bindUsercountdetails").html("");
            }
            else {
                $("#bindUsercountdetails").html("No User Found!");
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var LoginId = a.LoginId;
                var cfname = a.cfname;
                var EmailId = a.EmailId;
                $("#myModalUserLabel").html("User(s) in " + a.vGroupname + " Team");
                html3 += '<tr><td>' + cfname + '</td><td>' + EmailId + '</td><td><a href="#"  onclick=fn_RemoveRoleUser("' + groupval + '","' + LoginId + '",0)><i class="glyphicon glyphicon-trash" style="color:red"></i></a></td></tr>'
            });
            $("#bindUsercountdetails").html("");
            $("#bindUsercountdetails").append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

/*Remove user role id*/
function fn_RemoveRoleUser(groupid, loginid, flag) {
    if (confirm("Are you sure want to delete this user!")) {
        var formData = new FormData();
        formData.append("igroupid", groupid);
        formData.append("assignuser", loginid);
        formData.append("flag", flag);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/RemoveUserFromGroup",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    fn_showUserContDetails(groupid);
                    LoadUserGroupData(pageindex);
                    alert("Successfully deleted");
                }
                else if (response1.Data == "error") {
                    alert("Oops! Something went wrong..");
                }
            }
        });
    }
}
/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}
