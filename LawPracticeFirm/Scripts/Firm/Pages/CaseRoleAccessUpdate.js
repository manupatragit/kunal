var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    BindUserProfileName();
    MappedCasesOfUser();
    LoadCaseRoleAccessLevelData(pageindex);
    /*Load Case Role Access Level Data*/
    function LoadCaseRoleAccessLevelData(pageindex) {
        var html3 = ''; var htmlsubmodule = '';
        var formData = new FormData();
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        formData.append("auser", EncodeText(gid));
        formData.append("op", EncodeText(gop));
        formData.append("editcaseid", EncodeText(editcaseid));
        formData.append("pageid", EncodeText(pageid));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadCasePageAccesslevel",
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
                var parentpage = "";
                $("#bindcasetask tr").remove();
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    var pagename = a.PageName;
                    var ewrite = 0; eview = 0; eedit = 0; edelete = 0;
                    ewrite = a.Write;
                    eview = a.View;
                    eedit = a.Edit;
                    edelete = a.Delete;
                    eviewall = a.ViewAll;
                    eeditall = a.EditAll;
                    eexport = a.Export;
                    eshare = a.Share;
                    eenabledisable = a.Enable;
                    var coption = a.CaseOption;
                    if (pagename == "Documents under Matter") {
                        var displaySharestatus = "block";
                    }
                    else {
                        var displaySharestatus = "none";
                    }
                    var displayExportEmailstatus = "block";
                    var displayEnablestatus = "none";
                    var write = "", view = "", edit = "", deletelevel = "", exportemaildownload = "", share = "", enabledisable = "";;
                    if (coption == '3') {
                        if (pagename == "Matter Documents") {
                            write = ewrite == 1 ? '<input style="display:' + displaySharestatus + ';" checked type="checkbox" id="chkwrite_' + id + '" />' : '<input style="display:' + displaySharestatus + ';" type="checkbox" id="chkwrite_' + id + '" />';
                        }
                        else {
                            write = ewrite == 1 ? '<input checked type="checkbox" id="chkwrite_' + id + '" />' : '<input type="checkbox" id="chkwrite_' + id + '" />';
                        }
                    }
                    else {
                        if (pagename == "Matter Documents") {
                            write = ewrite == 1 ? '<input style="display:' + displaySharestatus + ';" checked type="checkbox" id="chkwrite_' + id + '" />' : '<input style="display:' + displaySharestatus + ';" type="checkbox" id="chkwrite_' + id + '" />';
                        }
                        else {
                            write = ewrite == 1 ? '<input checked type="checkbox" id="chkwrite_' + id + '" />' : '<input type="checkbox" id="chkwrite_' + id + '" />';
                        }
                    }
                    view = eview == 1 ? '<input checked type="checkbox" id="chkview_' + id + '" />' : '<input type="checkbox" id="chkview_' + id + '" />';
                    edit = eedit == 1 ? '<input checked type="checkbox" id="chkedit_' + id + '" />' : '<input type="checkbox" id="chkedit_' + id + '" />';
                    deletelevel = edelete == 1 ? '<input checked type="checkbox" id="chkdelete_' + id + '" />' : '<input type="checkbox" id="chkdelete_' + id + '" />';
                    exportemaildownload = eexport == 1 ? '<input style="display:' + displayExportEmailstatus + ';" checked type="checkbox" id="chkexportemaildownload_' + id + '" />' : '<input style="display:' + displayExportEmailstatus + ';" type="checkbox" id="chkexportemaildownload_' + id + '" />';
                    share = eshare == 1 ? '<input style="display:' + displaySharestatus + ';" checked type="checkbox" id="chkshare_' + id + '" />' : '<input style="display:' + displaySharestatus + ';" type="checkbox" id="chkshare_' + id + '" />';
                    enabledisable = eenabledisable == 1 ? '<input style="display:' + displayEnablestatus + ';" checked type="checkbox" id="chkenabledisable_' + id + '" />' : '<input style="display:' + displayEnablestatus + ';" type="checkbox" id="chkenabledisable_' + id + '" />';
                    var viewall = eviewall == 1 ? '<input checked type="checkbox" id="chkviewall_' + id + '" />' : '<input type="checkbox" id="chkviewall_' + id + '" />';
                    var editall = eeditall == 1 ? '<input checked type="checkbox" id="chkeditall_' + id + '" />' : '<input type="checkbox" id="chkeditall_' + id + '" />';
                    var pname = pagename.replace(" ", "_");
                    html3 += '<tr>'
                    html3 += '<td>'
                    html3 += '<span id="clname" style="font-weight:bold;"><input type=hidden id=m' + id + ' value=' + pname + '>' + pagename + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    html3 += '<span id="clname" >' + write + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    html3 += '<span id="clname" >' + view + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    html3 += '<span id="clname" >' + edit + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    html3 += '<span id="clname" >' + deletelevel + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    html3 += '<span id="clname" >' + exportemaildownload + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    html3 += '<span id="clname" >' + share + '</span>'
                    html3 += '</td>'
                    html3 += '<td style="display:none;">'
                    html3 += '<span id="clname" >' + enabledisable + '</span>'
                    html3 += '</td>'
                    html3 += '<td style="display:none;">'
                    html3 += '<span id="clname" >' + viewall + '</span>'
                    html3 += '</td>'
                    html3 += '<td style="display:none;">'
                    html3 += '<span id="clname" >' + editall + '</span>'
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
    /*Bind user profile*/
    function BindUserProfileName() {
        var assignuserid = gid;
        var name = "";
        var igroupid = assignuserid;
        var formData = new FormData();
        formData.append("assignuser", igroupid);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/CallUserprofilebyLoginId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.Data.length;
                groupname = response1.Data[0].cfname;
                if (groupname == "") {
                    groupname = response1.Data[0].Username
                }
                $("#lblusername").html(groupname);
            }
        });
    }
});
/*Save role access level*/
$(function () {
    $("#rSaveRoleAccessLevel").click(function () {
        var val = [];
        var userloginids = gid;
        var selectedcases = "";
        var CaseOption = $("#hdnrdCaseOption").val();
        if (CaseOption == "0") CaseOption = 2;
        if (userloginids == "") {
            alert("Select user");
            return false;
        }
        if (CaseOption == 0) {
            alert("Select matter option");
            return false;
        }
        if (CaseOption == 2) {
            $(':checkbox:checked').each(function (i) {
                val[i] = $(this).val();
                if (val[i] != "on") {
                    selectedcases += val[i] + ",";
                }
            });
            if (selectedcases == "") {
                alert("Select matter");
                return false;
            }
        }
        var addrawdata = "";
        var formData = new FormData();
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        formData.append("userloginids", EncodeText(userloginids));
        formData.append("selectedcases", EncodeText(selectedcases));
        formData.append("editcaseid", EncodeText(editcaseid));
        formData.append("pageid", EncodeText(pageid));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadCasePageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.Data.length;
                var chkwrite = 'chkwrite_';
                var chkview = 'chkview_';
                var chkedit = 'chkedit_';
                var chkdelete = 'chkdelete_';
                var chkviewall = 'chkviewall_';
                var chkeditall = 'chkeditall_';
                var chkexportemaildownload = 'chkexportemaildownload_';
                var chkshare = 'chkshare_';
                var chkenabledisable = 'chkenabledisable_';
                var pageid = 0;
                var isvalidate = false;
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var hdnmid = "#m" + id;
                    var mid = $(hdnmid).val();
                    if (document.getElementById(chkedit + id).checked == true) {
                        if (document.getElementById(chkview + id).checked == false) {
                            document.getElementById(chkview + id).checked = true;
                        }
                    }
                    if (document.getElementById(chkdelete + id).checked == true) {
                        if (document.getElementById(chkview + id).checked == false) {
                            document.getElementById(chkview + id).checked = true;
                        }
                    }
                    if (document.getElementById(chkwrite + id).checked == true) {
                        if (document.getElementById(chkview + id).checked == false) {
                            document.getElementById(chkview + id).checked = true;
                        }
                    }
                    var chkdata = "";
                    if (document.getElementById(chkwrite + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        chkdata = chkdata + 0 + ",";
                    }
                    if (document.getElementById(chkview + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        chkdata = chkdata + 0 + ",";
                    }
                    if (document.getElementById(chkedit + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        chkdata = chkdata + 0 + ",";
                    }
                    if (document.getElementById(chkdelete + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        chkdata = chkdata + 0 + ",";
                    }
                    if (document.getElementById(chkexportemaildownload + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        chkdata = chkdata + 0 + ",";
                    }
                    if (document.getElementById(chkshare + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        chkdata = chkdata + 0 + ",";
                    }
                    if (document.getElementById(chkenabledisable + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        chkdata = chkdata + 0 + ",";
                    }
                    if (document.getElementById(chkviewall + id).checked == true) {
                        chkdata = chkdata + 1 + ",";
                    }
                    if (document.getElementById(chkeditall + id).checked == true) {
                        if (document.getElementById(chkviewall + id).checked == false) {
                            document.getElementById(chkviewall + id).checked = true;
                            chkdata = chkdata + 1 + ",";
                        }
                        chkdata = chkdata + 1 + ",";
                    }
                    else {
                        if (document.getElementById(chkviewall + id).checked == false) {
                            chkdata = chkdata + 0 + ",";
                        }
                        chkdata = chkdata + 0 + ",";
                    }
                    addrawdata += pageid + "_" + chkdata + "~";
                    if (chkdata != "0,0,0,0,0,0,0,0,0,") {
                        isvalidate = true;
                    }
                });
                // save lavels ajax
                if (addrawdata == "") {
                    alert("Select access level");
                    return false;
                }
                else {
                    formData.append("CaseOption", EncodeText(CaseOption));
                    formData.append("addrawdata", EncodeText(addrawdata));
                    formData.append("ecaseid", EncodeText(editcaseid));
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: "/api/RoleApi/UpdateCaseRoleAccessLevelData",
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response1) {
                            if (response1.Data == "Success") {
                                alert("Successfully updated");
                                window.location.href = "/" + fcode + "/role/CaseRoleAccess";
                            }
                            else if (response1.Data == "exists") {
                                alert("Already role assigned for this User Group.");
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
                }
                //
            },
        });
    });
});
/*Get selected contact details*/
$(document).on('click', '#chkContactsselectall', function () {
    var formData = new FormData();
    formData.append("pagenum", EncodeText(pageindex));
    formData.append("pagesize", EncodeText(pagesize));
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadCasePageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkwrite = 'chkwrite_';
                var chkview = 'chkview_';
                var chkedit = 'chkedit_';
                var chkdelete = 'chkdelete_';
                var chkexportemaildownload = 'chkexportemaildownload_';
                var chkshare = 'chkshare_';
                var chkenabledisable = 'chkenabledisable_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkwrite + id).checked = true;
                    document.getElementById(chkview + id).checked = true;
                    document.getElementById(chkedit + id).checked = true;
                    document.getElementById(chkdelete + id).checked = true;
                    document.getElementById(chkexportemaildownload + id).checked = true;
                    document.getElementById(chkshare + id).checked = true;
                    document.getElementById(chkenabledisable + id).checked = true;
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadCasePageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkwrite = 'chkwrite_';
                var chkview = 'chkview_';
                var chkedit = 'chkedit_';
                var chkdelete = 'chkdelete_';
                var chkexportemaildownload = 'chkexportemaildownload_';
                var chkshare = 'chkshare_';
                var chkenabledisable = 'chkenabledisable_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkwrite + id).checked = false;
                    document.getElementById(chkview + id).checked = false;
                    document.getElementById(chkedit + id).checked = false;
                    document.getElementById(chkdelete + id).checked = false;
                    document.getElementById(chkexportemaildownload + id).checked = false;
                    document.getElementById(chkshare + id).checked = false;
                    document.getElementById(chkenabledisable + id).checked = false;
                });
            }
        });
    }
});
$(document).on('click', '#chkAllContactsselectall', function () {
    var formData = new FormData();
    formData.append("pagenum", EncodeText(pageindex));
    formData.append("pagesize", EncodeText(pagesize));
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadCasePageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkviewall = 'chkviewall_';
                var chkeditall = 'chkeditall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    document.getElementById(chkviewall + id).checked = true;
                    document.getElementById(chkeditall + id).checked = true;
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadCasePageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkviewall = 'chkviewall_';
                var chkeditall = 'chkeditall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    document.getElementById(chkviewall + id).checked = false;
                    document.getElementById(chkeditall + id).checked = false;
                });
            }
        });
    }
});
/*Get mapped case user*/
function MappedCasesOfUser() {
    var selectedauser = gid;
    var html3 = '';
    var formData = new FormData();
    var tempeditcaseid = "";
    if (editcaseid == "" || editcaseid == "null" || editcaseid == null || editcaseid == "undefined") {
        tempeditcaseid = "00000000-0000-0000-0000-000000000000";
    }
    else {
        tempeditcaseid = editcaseid;
    }
    formData.append("loginid", selectedauser);
    formData.append("flag", 1);
    formData.append("editcaseid", EncodeText(tempeditcaseid));
    if (selectedauser != "") {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/CasesByAuser",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#rEditCases").html("");
                }
                else {
                    mname = "All Cases";
                    var casename = "Matter Name: " + mname;
                    $("#divcasename").html(casename);
                    $("#rEditCases").html("No Matter !");
                }
                var length = response1.Data.length;
                var caseoption = 0;
                $.each(response1.Data, function (i, a) {
                    caseoption = a.CaseOption;
                    var caseid = a.caseid;
                    var mname = a.mname;
                    var iscaseroled = a.isCaseRole
                    if (mname == "" || mname == "null" || mname == null || mname == "undefined") {
                        mname = "All Cases";
                    }
                    var casename = "Matter Name: " + mname;
                    $("#divcasename").html(casename);
                    if (iscaseroled == 0) {
                        html3 += '<li><input id="chkUsercase" type="checkbox" class="shcheckbox1" name="fname" value="' + caseid + '"><a href="#" class="dropdown-item">"' + mname + '"</a></li>'
                        $("#rEditCases").html(html3);
                    }
                    if (iscaseroled != 0) {
                        html3 += '<li><input checked id="chkUsercase" type="checkbox" class="shcheckbox1" name="fname" value="' + caseid + '"><a href="#" class="dropdown-item">"' + mname + '"</a></li>'
                        $("#rEditCases").html(html3);
                    }
                });
                $("#hdnrdCaseOption").val(caseoption);
                document.getElementById("arefresh").style.display = "none";
                if (caseoption == 2) {
                    document.getElementById("rdgroups").disabled = true;
                    document.getElementById("rdusers").checked = "checked";
                    fn_RoleCaseAccessOption(2);
                }
                else if (caseoption == 1) {
                    document.getElementById("rdusers").disabled = true;
                    document.getElementById("rdgroups").checked = "checked";
                    fn_RoleCaseAccessOption(1);
                }
                else {
                    document.getElementById("rdusers").disabled = true;
                    document.getElementById("rdgroups").disabled = true;
                    fn_RoleCaseAccessOption(3);
                }
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
/*Role access option*/
function fn_RoleCaseAccessOption(val) {
    if (val == 1) {
        $("#divddlCases").hide();
        $("#hdnrdCaseOption").val(1);
        $("#chkCreateall").hide();
    }
    if (val == 2) {
        $("#divddlCases").show();
        $("#hdnrdCaseOption").val(2);
        $("#chkCreateall").hide();
    }
    if (val == 3) {
        $("#divddlCases").hide();
        $("#hdnrdCaseOption").val(3);
        $("#chkCreateall").show();
        $("#chkwrite_95").show();
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
