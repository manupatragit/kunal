var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    GetMappedCaseUsers();
    LoadCaseRoleAccessLevelData(pageindex);
    /*Load Case Role Access Level Data*/
    function LoadCaseRoleAccessLevelData(pageindex) {
        var html3 = ''; var htmlsubmodule = '';
        var formData = new FormData();
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
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
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    var pagename = a.PageName;
                    var displayExportEmailstatus = "block";
                    if (pagename == "Documents under Matter") {
                        var displaySharestatus = "block";
                    }
                    else {
                        var displaySharestatus = "none";
                    }
                    var displayEnablestatus = "none";
                    var displaywritestatus = "block";
                    var write = '<input style="display:' + displaywritestatus + ';" type="checkbox" id="chkwrite_' + id + '" />';
                    var view = '<input type="checkbox" id="chkview_' + id + '" />';
                    var edit = '<input type="checkbox" id="chkedit_' + id + '" />';
                    var deletelevel = '<input type="checkbox" id="chkdelete_' + id + '" />';
                    var exportemaildownload = '<input style="display:' + displayExportEmailstatus + ';" type="checkbox" id="chkexportemaildownload_' + id + '" />';
                    var share = '<input style="display:' + displaySharestatus + ';" type="checkbox" id="chkshare_' + id + '" />';
                    var enabledisable = '<input style="display:' + displayEnablestatus + ';" type="checkbox" id="chkenabledisable_' + id + '" />';
                    var viewall = '<input type="checkbox" id="chkviewall_' + id + '" />';
                    var editall = '<input type="checkbox" id="chkeditall_' + id + '" />';
                    var pname = pagename.replace(" ", "_");
                    var featureTitle = "";
                    if (pagename == "Matter Documents") {
                        featureTitle = "Set Rights for documents under a matter";
                    }
                    if (pagename == "Matter") {
                        featureTitle = "Action rights under a matter, except documents";
                    }
                    html3 += '<tr>'
                    html3 += '<td title="' + featureTitle + '">'
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
    /*Get case mapped users*/
    function GetMappedCaseUsers() {
        var groupval = "";
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/CaseMappedUser",
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
                $("#ddlUsers option").remove();
                html3 += '<option value="">Select User</option>';
                $.each(response1.Data, function (i, a) {
                    var LoginId = a.auser;
                    var cfname = a.cfname;
                    var EmailId = a.EmailId;
                    html3 += '<option value="' + LoginId + '">' + cfname + ' (' + a.RoleName + ')</option>';
                });
                $("#ddlUsers").html("");
                $("#ddlUsers").append(html3);
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
/*Save role access level*/
$(function () {
    $("#rSaveRoleAccessLevel").click(function () {
        var val = [];
        var userloginids = "";
        userloginids = $("#ddlUsers").val();
        var selectedcases = "";
        var CaseOption = $("#hdnrdCaseOption").val();
        if (userloginids == "") {
            alert("Select user");
            return false;
        }
        if (CaseOption == 0) {
            CaseOption = 3;
        }
        if (CaseOption == 2) {
            $(':checkbox:checked').each(function (i) {
                val[i] = $(this).val();
                if (val[i] != "on") {
                    selectedcases += val[i] + ",";
                }
            });
            if (CaseOption == 3) {
                selectedcases = "00000000-0000-0000-0000-000000000000";
            }
            if (selectedcases == "") {
                alert("Select case");
                return false;
            }
        }
        var addrawdata = "";
        var formData = new FormData();
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        formData.append("userloginids", EncodeText(userloginids));
        formData.append("selectedcases", EncodeText(selectedcases));
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
                    var pname = mid.replace("_", " ");
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
                    if (chkdata != "0,0,0,0,0,0,0,0,0,") {
                        addrawdata += pageid + "_" + chkdata + "~";
                        isvalidate = true;
                    }
                });
                // save lavels ajax
                if (isvalidate == true || addrawdata == "") {
                    if (addrawdata == "") {
                        alert("Select access level");
                        closeload();
                        return false;
                    }
                    else {
                        openload();
                        formData.append("CaseOption", EncodeText(CaseOption));
                        formData.append("addrawdata", addrawdata);
                        $.ajax({
                            async: true,
                            type: "POST",
                            url: "/api/RoleApi/AddCaseRoleAccessLevelData",
                            dataType: 'json',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response1) {
                                if (response1.Data == "Success") {
                                    alert("Successfully created");
                                    closeload();
                                    window.location.href = "/" + fcode + "/role/CaseRoleAccess";
                                }
                                else if (response1.Data == "exists") {
                                    alert("Already role assigned for this User Group.");
                                    closeload();
                                }
                                else if (response1.Data == "error") {
                                    alert("Oops! Something went wrong..");
                                    closeload();
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
                    }
                }
            },
        });
    });
});
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
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    if (hdnrdCaseOptionVal != 1 && hdnrdCaseOptionVal != 2) {
                        document.getElementById(chkwrite + id).checked = true;
                    }
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
/*Check all selected contact list*/
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
/*Select Load Case Page Access level*/
$(document).on('click', '#chkSelectCreateall', function () {
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
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    if (hdnrdCaseOptionVal != 1 && hdnrdCaseOptionVal != 2) {
                        document.getElementById(chkwrite + id).checked = true;
                    }
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
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkwrite + id).checked = false;
                });
            }
        });
    }
});
/*View all selected details*/
$(document).on('click', '#chkSelectViewall', function () {
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
                var chkview = 'chkview_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    document.getElementById(chkview + id).checked = true;
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
                var chkview = 'chkview_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkview + id).checked = false;
                });
            }
        });
    }
});
/*Save all selected details*/
$(document).on('click', '#chkSelectEditall', function () {
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
                var chkedit = 'chkedit_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    document.getElementById(chkedit + id).checked = true;
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
                var chkedit = 'chkedit_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkedit + id).checked = false;
                });
            }
        });
    }
});
/*Delete selected details*/
$(document).on('click', '#chkSelectDeleteall', function () {
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
                var chkdelete = 'chkdelete_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    document.getElementById(chkdelete + id).checked = true;
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
                var chkdelete = 'chkdelete_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkdelete + id).checked = false;
                });
            }
        });
    }
});
/*Export all selected*/
$(document).on('click', '#chkSelectExportall', function () {
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
                var chkexportemaildownload = 'chkexportemaildownload_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    document.getElementById(chkexportemaildownload + id).checked = true;
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
                var chkexportemaildownload = 'chkexportemaildownload_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkexportemaildownload + id).checked = false;
                });
            }
        });
    }
});
/*Share all selected*/
$(document).on('click', '#chkSelectShareall', function () {
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
                var chkshare = 'chkshare_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    document.getElementById(chkshare + id).checked = true;
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
                var chkshare = 'chkshare_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkshare + id).checked = false;
                });
            }
        });
    }
});
/*Enable*/
$(document).on('click', '#chkSelectEnableall', function () {
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
                var chkenabledisable = 'chkenabledisable_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
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
                var chkenabledisable = 'chkenabledisable_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkenabledisable + id).checked = false;
                });
            }
        });
    }
});
/*View global details*/
$(document).on('click', '#chkGlobalViewall', function () {
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
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
                    document.getElementById(chkviewall + id).checked = true;
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
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkviewall + id).checked = false;
                });
            }
        });
    }
});
$(document).on('click', '#chkGlobalEditall', function () {
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
                var chkeditall = 'chkeditall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    var hdnrdCaseOptionVal = $("#hdnrdCaseOption").val();
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
                var chkeditall = 'chkeditall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var chkdata = "";
                    document.getElementById(chkeditall + id).checked = false;
                });
            }
        });
    }
});
$(document).on('change', '#ddlUsers', function () {
    var selectedauser = $("#ddlUsers").val();
    MappedCasesOfUser(selectedauser);
});
/*Mapped case user*/
function MappedCasesOfUser(selectedauser) {
    var html3 = '';
    var formData = new FormData();
    formData.append("loginid", EncodeText(selectedauser));
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
                var length = response1.Data.length;
                if (length != "0") {
                    $("#rCases").html("");
                }
                else {
                    $("#rCases").html("No Case !");
                }
                $("#rCases li").remove();
                $.each(response1.Data, function (i, a) {
                    var caseid = a.caseid;
                    var mname = a.mname;
                    html3 += '<li><input id="chkUsercase" type="checkbox" class="shcheckbox1" name="fname" value="' + caseid + '"><a href="#" class="dropdown-item">' + mname + '</a></li>'
                });
                $("#rCases").html("");
                $("#rCases").append(html3);
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
/*Role case access option*/
function fn_RoleCaseAccessOption(val) {
    if (val == 1) {
        $("#divddlCases").hide();
        $("#hdnrdCaseOption").val(1);
        $("#chkCreateall").hide();
        $("#chkwrite_95").hide();
        document.getElementById("chkwrite_95").checked = false;
    }
    if (val == 2) {
        $("#divddlCases").show();
        $("#hdnrdCaseOption").val(2);
        $("#chkCreateall").hide();
        $("#chkwrite_95").hide();
        document.getElementById("chkwrite_95").checked = false;
    }
    if (val == 3) {
        document.getElementById("rdnone").checked = true;
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
