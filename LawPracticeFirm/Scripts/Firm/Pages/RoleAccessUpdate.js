var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    LoadEditRoleAccessLevelData();
});
/*Load edit role access level data*/
function LoadEditRoleAccessLevelData() {
    var rightlevel = 0;   
    var trdisplaystatus = "";
    var thdisplaystatus = "none";
    var thdisplayCVEDstatus = "";
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    openload();
    var urlpath = "";
    if (gop == 1) { urlpath = "/api/RoleApi/RoleAccessByGroupId?groupid=" + gid; BindGroupName(gid); }
    if (gop == 2) { urlpath = "/api/RoleApi/RoleAccessByAssignUser?assignuser=" + gid; BindUserProfileName(gid)}
    $("#hdniGroupId").val(gid);
    $.ajax({
        async: true,
        type: "POST",
        url: urlpath,
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
                var id = a.Id;
                var pagename = a.PageName;
                var ewrite = 0; eview = 0; eedit = 0; edelete = 0, eexport = 0, eshare = 0, eenabledisable = 0;
                var econtactcredential = 0, edocumentdonfidential = 0;
                ewrite = a.Write;
                eview = a.View;
                eedit = a.Edit;
                edelete = a.Delete;
                eviewall = a.ViewAll;
                eeditall = a.EditAll;
                eexport = a.Export;
                eshare = a.Share;
                eenabledisable = a.Enable;
                econtactcredential = a.Credentials;
                edocumentdonfidential = a.Confidential;
                rightlevel = a.iLevelType;
                $("#hdnrdrightslevelval").val(rightlevel);
                if (rightlevel == 2) {
                    $("#thCreate").hide();
                    $("#thView").hide();
                    $("#thEdit").hide();
                    $("#thDelete").hide();
                    $("#thExport").hide();
                    $("#thShare").hide();
                    $("#thEnable").hide();
                    $("#thglobalviewall").show();
                    $("#thglobaleditall").show();
                }
                else {
                    $("#thCreate").show();
                    $("#thView").show();
                    $("#thEdit").show();
                    $("#thDelete").show();
                    $("#thExport").show();
                    $("#thShare").show();
                    $("#thEnable").show();
                    $("#thglobalviewall").hide();
                    $("#thglobaleditall").hide();
                }
                var pname = pagename.replace(" ", "_");
                var displayCreatetatus = "block";
                var displayViewstatus = "block";
                var displayEditstatus = "block";
                var displayDeletestatus = "block";
                var displayViewAllstatus = "block";
                var displayEditAllstatus = "block";
                var displayExportEmailstatus = "block";
                var displaySharestatus = "block";
                var displayEnablestatus = "none";
                var displayDisabled = "";
                var pagelink = a.Pagelink;
                var contactcredential = econtactcredential == 1 ? '<input checked type="checkbox" id="chkcontactcredential_' + id + '" />' : '<input style="display:' + displayCreatetatus + ';" type="checkbox" id="chkcontactcredential_' + id + '" />';
                var documentconfidential = edocumentdonfidential == 1 ? '<input checked type="checkbox" id="chkDocumentConfidential_' + id + '" />' : '<input style="display:' + displayCreatetatus + ';" type="checkbox" id="chkDocumentConfidential_' + id + '" />';
                var contactsublink = "", directorysublink = "";
                if (rightlevel == 0) {
                    $("#divlevelrights").html("[User Level Rights]");
                    if (pagelink == "Userlist" || pagelink == "UserGroup" || pagelink == "RoleAccess" || pagelink == "CaseRoleAccess") {
                        trdisplaystatus = "none";
                    }
                    thdisplayCVEDstatus = "";
                }
                if (rightlevel == 1) {
                    $("#divlevelrights").html("[Partner Level Rights]");
                    if (pagelink == "ViewKnowledge" || pagelink == "MailBox") {
                        trdisplaystatus = "";
                    }
                    else {
                        trdisplaystatus = "";
                    }
                }
                //for firm level settings
                if (rightlevel == 2) {
                    $("#divlevelrights").html("[Firm Level Rights]");
                    if (pagelink == "MailBox") {
                        trdisplaystatus = "none";
                    }
                    else {
                        trdisplaystatus = "";
                    }
                    thdisplaystatus = "";
                    thdisplayCVEDstatus = "none";
                }
                if (pagelink == "UserGroup") {
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displaySharestatus = "none";
                    displayEnablestatus = "none";
                    displayExportEmailstatus = "none";
                    displayViewAllstatus = "";
                    displayEditAllstatus = "";
                }
                if (pagelink == "RoleAccess") {
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displaySharestatus = "none";
                    displayEnablestatus = "none";
                    displayExportEmailstatus = "none";
                    displayViewAllstatus = "";
                    displayEditAllstatus = "";
                }
                if (pagelink == "CaseRoleAccess") {
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displaySharestatus = "none";
                    displayEnablestatus = "none";
                    displayExportEmailstatus = "none";
                    displayViewAllstatus = "";
                    displayEditAllstatus = "";
                }
                if (pagelink == "ClientCredentials") {
                    displayCreatetatus = "block";
                    displayViewstatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displayExportEmailstatus = "none";
                    displayEnablestatus = "block";
                    displaySharestatus = "none";
                }
                if (pagelink == "DocumentConfidential") {
                    displayCreatetatus = "none";
                    displayViewstatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displayExportEmailstatus = "none";
                    displayEnablestatus = "block";
                    displaySharestatus = "none";
                }        
                if (pagelink == "ContactsList") {
                    displayEnablestatus = "block";
                }
                if (pagelink == "MergeCalendar") {
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayEditAllstatus = "none";                    
                    displaySharestatus = "none";
                    displayEnablestatus = "none";
                }
                if (pagelink == "ExpenseReport") {                    
                    displaySharestatus = "none";
                    displayEnablestatus = "none";
                }
                if (pagelink == "ReceiveMessageList") {
                    displayEditstatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displaySharestatus = "none";
                }
                if (pagelink == "ViewKnowledge") {
                    displayEditstatus = "none";
                    displayViewAllstatus = "";
                    displayEditAllstatus = "none";                    
                }
                if (pagelink == "MailBox") {
                    displayCreatetatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displaySharestatus = "none";
                    displayExportEmailstatus = "none";
                }
                if (pagelink == "ClientMessaging") {
                    displayCreatetatus = "block";
                    displayViewstatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displaySharestatus = "none";
                    displayExportEmailstatus = "none";
                }
                if (pagelink == "ViewTimer") {
                    displaySharestatus = "none";
                    displayEnablestatus = "none";
                }
                if (pagelink == "DirectoryList") {                    
                    displayExportEmailstatus = "none";
                    displayEnablestatus = "none";
                }
                if (pagelink == "Userlist") {
                    displaySharestatus = "none";
                    displayEnablestatus = "block";
                    displayViewAllstatus = "";
                    displayEditAllstatus = "";
                    displayDeletestatus = "none";
                }
                if (pagelink == "Notice Management") {
                    displaySharestatus = "none";
                    displayExportEmailstatus = "none";
                }
                if (pagelink == "TimeEntrySpecialRights") {
                    displayCreatetatus = "none";
                    displayViewstatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displayExportEmailstatus = "none";
                    displayEnablestatus = "block";
                    displaySharestatus = "none";
                }
                if (pagelink == "InvoiceSpecialRights") {
                    displayCreatetatus = "none";
                    displayViewstatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displayExportEmailstatus = "none";
                    displayEnablestatus = "block";
                    displaySharestatus = "none";
                }
                if (pagelink == "ExpenseSpecialRights") {
                    displayCreatetatus = "none";
                    displayViewstatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displayExportEmailstatus = "none";
                    displayEnablestatus = "block";
                    displaySharestatus = "none";
                }
                if (pagelink == "AIOrderSummary") {
                    displayCreatetatus = "none";
                    displayViewstatus = "none";
                    displayEditstatus = "none";
                    displayDeletestatus = "none";
                    displayViewAllstatus = "none";
                    displayEditAllstatus = "none";
                    displayExportEmailstatus = "none";
                    displayEnablestatus = "block";
                    displaySharestatus = "none";
                }
                if (rightlevel == 2 || rightlevel == 1) {
                    if (pagelink == "ClientCredentials" || pagelink == "DocumentConfidential") {
                        displayViewAllstatus = "";
                        displayEditAllstatus = "none";
                    }
                    if (pagelink == "ClientMessaging") {
                        displayViewAllstatus = "none";
                        displayEditAllstatus = "";
                    }
                }
                //disabled for case
                if (eenabledisable == 1 && pagelink == "ExpenseSpecialRights") {
                    displayDisabled = "disabled";
                }
                var write = "", view = "", edit = "", deletelevel = "", exportemaildownload = "", share = "", enabledisable = "";
                write = ewrite == 1 ? '<input style="display:' + displayCreatetatus + ';" checked type="checkbox" id="chkwrite_' + id + '" />' : '<input style="display:' + displayCreatetatus +';" type="checkbox" id="chkwrite_' + id + '" />';
                view = eview == 1 ? '<input style="display:' + displayViewstatus + ';" checked type="checkbox" id="chkview_' + id + '" />' : '<input style="display:' + displayViewstatus + ';" type="checkbox" id="chkview_' + id + '" />';
                edit = eedit == 1 ? '<input style="display:' + displayEditstatus +';" checked type="checkbox" id="chkedit_' + id + '" />' : '<input style="display:' + displayEditstatus +';" type="checkbox" id="chkedit_' + id + '" />';
                deletelevel = edelete == 1 ? '<input style="display:' + displayDeletestatus + ';" checked type="checkbox" id="chkdelete_' + id + '" />' : '<input style="display:' + displayDeletestatus +';" type="checkbox" id="chkdelete_' + id + '" />';
                exportemaildownload = eexport == 1 ? '<input style="display:' + displayExportEmailstatus + ';" checked type="checkbox" id="chkexportemaildownload_' + id + '" />' : '<input style="display:' + displayExportEmailstatus + ';" type="checkbox" id="chkexportemaildownload_' + id + '" />';
                share = eshare == 1 ? '<input style="display:' + displaySharestatus + ';" checked type="checkbox" id="chkshare_' + id + '" />' : '<input style="display:' + displaySharestatus + ';" type="checkbox" id="chkshare_' + id + '" />';
                enabledisable = eenabledisable == 1 ? '<input style="display:' + displayEnablestatus + ';" checked type="checkbox" id="chkenabledisable_' + id + '" />' : '<input style="display:' + displayEnablestatus + ';" type="checkbox" id="chkenabledisable_' + id + '" />';
                var viewall = eviewall == 1 ? '<input style="display:' + displayViewAllstatus + ';" checked type="checkbox" id="chkviewall_' + id + '" />' : '<input style="display:' + displayViewAllstatus + ';" type="checkbox" id="chkviewall_' + id + '" />';
                var editall = eeditall == 1 ? '<input checked style="display:' + displayEditAllstatus +';" type="checkbox" id="chkeditall_' + id + '" />' : '<input style="display:' + displayEditAllstatus +';" type="checkbox" id="chkeditall_' + id + '" />';
                html3 += '<tr style="display:' + trdisplaystatus + ';" id=chngcolor' + id + '>'
                html3 += '<td>'
                if (pagelink == "DocumentConfidential") {
                    html3 += '<span id="clname" style="margin-left:15px;"><img src="/newassets/images/rolls_icon1.png"></img> ' + pagename + '</span><input type=hidden id=m' + id + ' value=' + pname + '><input type="hidden" id="hdniGroupId" value="' + gid + '" /><input type="hidden" id="hdnrdaccessval" value="' + gop + '" />'                }
                else if (pagelink == "ClientCredentials") {
                    html3 += '<span id="clname" style="margin-left:15px;"><img src="/newassets/images/rolls_icon1.png"></img> ' + pagename + '</span><input type=hidden id=m' + id + ' value=' + pname + '><input type="hidden" id="hdniGroupId" value="' + gid + '" /><input type="hidden" id="hdnrdaccessval" value="' + gop + '" />'
                }
                else if (pagelink == "ClientMessaging") {
                    html3 += '<span id="clname" style="margin-left:15px;"><img src="/newassets/images/rolls_icon1.png"></img> ' + pagename + '</span><input type=hidden id=m' + id + ' value=' + pname + '><input type="hidden" id="hdniGroupId" value="' + gid + '" /><input type="hidden" id="hdnrdaccessval" value="' + gop + '" />'
                }
                else {
                    html3 += '<span id="clname" style="">' + pagename + '</span><input type=hidden id=m' + id + ' value=' + pname + '><input type="hidden" id="hdniGroupId" value="' + gid + '" /><input type="hidden" id="hdnrdaccessval" value="' + gop + '" />'
                }
                html3 += '<td style="display:' + thdisplayCVEDstatus + ';">'
                html3 += '<span id="clname" >' + write + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplayCVEDstatus + ';">'
                html3 += '<span id="clname" >' + view + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplayCVEDstatus + ';">'
                html3 += '<span id="clname" >' + edit + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplayCVEDstatus + ';">'
                html3 += '<span id="clname" >' + deletelevel + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplayCVEDstatus + ';">'
                html3 += '<span id="clname" >' + exportemaildownload + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplayCVEDstatus + ';">'
                html3 += '<span id="clname" >' + share + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplayCVEDstatus + ';">'
                html3 += '<span id="clname" >' + enabledisable + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplaystatus + ';">'
                html3 += '<span id="clname" >' + viewall + '</span>'
                html3 += '</td>'
                html3 += '<td style="display:' + thdisplaystatus + ';">'
                html3 += '<span id="clname" >' + editall + '</span>'
                html3 += '</td>'  
                html3 += '</tr>'
            });
            $("#bindEditRole").html("");
            $("#bindEditRole").append(html3);
            if (dashcalendar == "display:none") { $("#chngcolor75").hide(); }
            if (dashcontact == "display:none") { $("#chngcolor65,#chngcolor110").hide(); }
            if (dashdocument == "display:none") { $("#chngcolor92,#chngcolor111").hide(); }
            if (dashexpense == "display:none") { $("#chngcolor77").hide(); }
            if (dashinvoice == "display:none") { $("#chngcolor82").hide(); }
            if (dashtimeentry == "display:none") { $("#chngcolor102").hide(); }
            if (dashknow == "display:none") { $("#chngcolor79").hide(); }
            if (dashrights == "display:none") { $("#chngcolor108,#chngcolor109").hide(); }
            if (dashuser == "display:none") { $("#chngcolor106").hide(); }
            if (dashnotice == "display:none") { $("#chngcolor128").hide(); }
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
function fn_ContactCridential() {
    $("#divContactcredential").toggle();
}
function fn_DocumentConfidential() {
    $("#divDocumentConfidential").toggle();
}

/*Bind group name*/
function BindGroupName(groupval) {
    groupname = "Team: ";
    var igroupid = groupval;
    var formData = new FormData();
    formData.append("igroupid", igroupid);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/CallUserGroupbyiGroupId",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var length = response1.Data.length;
            groupname += response1.Data[0].vGroupname;
            $("#divlabel").html(groupname);
            var userviewlink = '<a data-toggle="tab" style="margin-left:12px; color:gray;"  href="#" id="showUserContDetails" onclick=fn_showUserContDetails("' + igroupid +'") >View User(s)</a>'
            $("#divShowUserCount").html(userviewlink);
        }
    });
}

/*Bind user profile name*/
function BindUserProfileName(assignuserid) {
    groupname = "User: ";
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
            groupname += response1.Data[0].cfname;
            $("#divlabel").html(groupname);
        }
    });
}
$(function () {
    $("#rSaveRoleAccessLevel").click(function () {
        var hdngroupaccessval = $("#hdnrdaccessval").val();
        var igroupid = "";
        var val = [];
        var userloginids = "";
        igroupid = $("#hdniGroupId").val();
        if (hdngroupaccessval == 1) {
            igroupid = $("#hdniGroupId").val();
        }
        if (hdngroupaccessval == 2) {
            userloginids = $("#hdniGroupId").val();
        }
        var rightlevel = $("#hdnrdrightslevelval").val();
        var addrawdata = "";
        var formData = new FormData();
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        formData.append("igroupid", igroupid);
        formData.append("userloginids", userloginids);
        formData.append("hdngroupaccessval", hdngroupaccessval);
        formData.append("levelid", rightlevel);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.Data.length;
                var writestatus = 0;
                var viewstatus = 0;
                var editstatus = 0;
                var deletestatus = 0;
                var viewallstatus = 0;
                var editallstatus = 0;
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
                    var pagelink = a.Pagelink;
                    var chkdata = "";
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
                if (isvalidate == false) {
                    alert("Select access level");
                    return false;
                }
                if (isvalidate == true) {
                    if (addrawdata == "") {
                        alert("Select access level");
                        return false;
                    }
                    else {
                        formData.append("addrawdata", addrawdata);
                        formData.append("rightlevel", rightlevel);
                        $.ajax({
                            async: true,
                            type: "POST",
                            url: "/api/RoleApi/UpdateRoleAccessLevelData",
                            dataType: 'json',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response1) {
                                if (response1.Data == "Success") {
                                    alert("Rights updated successfully");
                                    window.location.href = "/" + fcode + "/Role/RoleAccess";
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
                }
            },
        });
    });
});

/*Select all created data*/
$(document).on('click', '#chkSelectCreateall', function () {
    var rightlevel = $("#hdnrdrightslevelval").val();
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkwrite = 'chkwrite_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "ClientCredentials") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    if (pagelink == "DocumentConfidential") {
                        if ($("#hdnrdrightslevelval").val() == "0" || $("#hdnrdrightslevelval").val() == "1") {
                            document.getElementById(chkwrite + id).checked = false;
                        }
                    }
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    else if (pagelink == "MailBox") {
                        if ($("#hdnrdrightslevelval").val() == "0" || $("#hdnrdrightslevelval").val() == "1") {
                            document.getElementById(chkwrite + id).checked = false;
                        }
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkwrite + id).checked = true;
                    }
                    else {
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
            url: "/api/RoleApi/LoadPageAccesslevel",
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
$(document).on('click', '#chkSelectViewall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkview = 'chkview_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkview + id).checked = true;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkview + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkview + id).checked = true;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkview + id).checked = true;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkview + id).checked = true;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkview + id).checked = false;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkview + id).checked = true;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkview + id).checked = true;
                    }
                    else {
                        document.getElementById(chkview + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
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
$(document).on('click', '#chkSelectEditall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkedit = 'chkedit_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkedit + id).checked = false;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkedit + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkedit + id).checked = false;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkedit + id).checked = false;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkedit + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkedit + id).checked = false;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkedit + id).checked = true;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkedit + id).checked = true;
                    }
                    else {
                        document.getElementById(chkedit + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
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
$(document).on('click', '#chkSelectDeleteall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkdelete = 'chkdelete_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkdelete + id).checked = false;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkdelete + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkdelete + id).checked = true;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkdelete + id).checked = true;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkdelete + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkdelete + id).checked = false;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkdelete + id).checked = true;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkdelete + id).checked = true;
                    }
                    else {
                        document.getElementById(chkdelete + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkdelete = 'chkdelete_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    document.getElementById(chkdelete + id).checked = false;
                });
            }
        });
    }
});
$(document).on('click', '#chkSelectExportall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkexportemaildownload = 'chkexportemaildownload_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "UserGroup") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                    }
                    if (pagelink == "RoleAccess") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                    }
                    if (pagelink == "CaseRoleAccess") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                    }
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkexportemaildownload + id).checked = true;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkexportemaildownload + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkexportemaildownload + id).checked = true;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkexportemaildownload + id).checked = true;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkexportemaildownload + id).checked = true;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                    }
                    else {
                        document.getElementById(chkexportemaildownload + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
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
$(document).on('click', '#chkSelectShareall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
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
                    var pagelink = a.Pagelink;
                    if (pagelink == "UserGroup") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    if (pagelink == "RoleAccess") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    if (pagelink == "CaseRoleAccess") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    if (pagelink == "Userlist") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    else if (pagelink == "ContactsList") {
                        document.getElementById(chkshare + id).checked = true;
                    }
                    else if (pagelink == "MergeCalendar") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkshare + id).checked = true;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkshare + id).checked = false;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkshare + id).checked = true;
                    }
                    else {
                        document.getElementById(chkshare + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkshare = 'chkshare_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    document.getElementById(chkshare + id).checked = false;
                });
            }
        });
    }
});
$(document).on('click', '#chkSelectEnableall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkenabledisable = 'chkenabledisable_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "UserGroup") {
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    if (pagelink == "RoleAccess") {
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    if (pagelink == "CaseRoleAccess") {
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else {
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
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
$(document).on('click', '#chkGlobalViewall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkviewall = 'chkviewall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkviewall + id).checked = true;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkviewall + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkviewall + id).checked = false;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkviewall + id).checked = true;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkviewall + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkviewall + id).checked = false;
                    }
                    else {
                        document.getElementById(chkviewall + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkviewall = 'chkviewall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    document.getElementById(chkviewall + id).checked = false;
                });
            }
        });
    }
});
$(document).on('click', '#chkGlobalEditall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var rightlevel = $("#hdnrdrightslevelval").val();
    formData.append("levelid", rightlevel);
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkeditall = 'chkeditall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkeditall + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkeditall + id).checked = true;
                    }
                    else {
                        document.getElementById(chkeditall + id).checked = true;
                    }
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadPageAccesslevel",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkeditall = 'chkeditall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    document.getElementById(chkeditall + id).checked = false;
                });
            }
        });
    }
});
function fn_SetRoleAccessOption(val) {
    if (val == 1) {
        $("#hdnrdaccessval").val(1);
    }
    if (val == 2) {
        $("#hdnrdaccessval").val(2);
    }
}
function fn_showUserContDetails(groupval) {
    $("#modalUserCountView").modal();
    var html3 = '';
    var formData = new FormData();
    formData.append("igroupid", groupval);
    formData.append("flag", 1);
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
                html3 += '<tr><td>' + cfname + '</td><td>' + EmailId + '</td><td><a href="#" onclick=fn_RemoveRoleUser("' + groupval + '","' + LoginId +'",1)>Remove</a></td></tr>'
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
                    alert("Successfully deleted");
                    LoadUserGroupData(1);
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