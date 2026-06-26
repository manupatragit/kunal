var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    $("#divddlUsers").show();
    $("#hdnrdaccessval").val("2");
    LoadRoleAccessLevelData(pageindex);
});
/*Load role access level*/
function LoadRoleAccessLevelData(pageindex) {

    var rightlevel = $("#hdnrdrightslevelval").val();
    var trdisplaystatus = "";
    var thdisplaystatus = "none";
    var thdisplayCVEDstatus = "";
    if (rightlevel == "2") {
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
    var html3 = ''; var htmlsubmodule = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("levelid", rightlevel);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/LoadPageAccesslevel",
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
            var qty1 = 0;
            $.each(response1.Data, function (i, a) {
                qty1 = qty1 + 1;
                var id = a.Id;
                var pagename = a.PageName;
                var displayCreatetatus = "block";
                var displayViewstatus = "block";
                var displayEditstatus = "block";
                var displayDeletestatus = "block";
                var displayViewAllstatus = "block";
                var displayEditAllstatus = "block";
                var displayExportEmailstatus = "block";
                var displaySharestatus = "block";
                var displayEnablestatus = "none";
                var pagelink = a.Pagelink;
                //for user level settings
                if (rightlevel == "0") {
                    if (pagelink == "Userlist" || pagelink == "UserGroup" || pagelink == "RoleAccess" || pagelink == "CaseRoleAccess") {
                        trdisplaystatus = "none";
                    }
                    thdisplayCVEDstatus = "";
                }
                //for partner level setting
                if (rightlevel == "1") {
                    if (pagelink == "ViewKnowledge" || pagelink == "MailBox") {
                        trdisplaystatus = "";
                    }
                    else {
                        trdisplaystatus = "";
                    }
                }
                if (rightlevel == "2") {
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
                var contactsublink = "", directorysublink = "";
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
                if (pagelink == "Notice Management") {
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
                if (rightlevel == "2" || rightlevel == "1") {
                    if (pagelink == "ClientCredentials" || pagelink == "DocumentConfidential") {
                        displayViewAllstatus = "";
                        displayEditAllstatus = "none";
                    }
                    if (pagelink == "ClientMessaging") {
                        displayViewAllstatus = "none";
                        displayEditAllstatus = "";
                    }
                }
                var write = "", view = "", edit = "", deletelevel = "", viewall = "", editall = "", exportemaildownload = "", share = "", enabledisable = "";
                write = '<input style="display:' + displayCreatetatus + ';" type="checkbox" id="chkwrite_' + id + '" />';
                view = '<input style="display:' + displayViewstatus + ';" type="checkbox" id="chkview_' + id + '" />';
                edit = '<input style="display:' + displayEditstatus + ';" type="checkbox" id="chkedit_' + id + '" />';
                deletelevel = '<input style="display:' + displayDeletestatus + ';" type="checkbox" id="chkdelete_' + id + '" />';
                exportemaildownload = '<input style="display:' + displayExportEmailstatus + ';" type="checkbox" id="chkexportemaildownload_' + id + '" />';
                share = '<input style="display:' + displaySharestatus + ';" type="checkbox" id="chkshare_' + id + '" />';
                enabledisable = '<input style="display:' + displayEnablestatus + ';" type="checkbox" id="chkenabledisable_' + id + '" />';
                viewall = '<input style="display:' + displayViewAllstatus + ';" type="checkbox" id="chkviewall_' + id + '" />';
                editall = '<input style="display:' + displayEditAllstatus + ';" type="checkbox" id="chkeditall_' + id + '" />';
                var pname = pagename.replace(" ", "_");
                html3 += '<tr style="display:' + trdisplaystatus + ';" id=chngcolor' + id + '>'
                html3 += '<td>'
                if (pagelink == "ContactsList") {
                    html3 += '<span id="clname" ><input type=hidden id=m' + id + ' value=' + pname + '>' + pagename + contactsublink + '</span>'
                }
                else if (pagelink == "DirectoryList") {
                    html3 += '<span id="clname" "><input type=hidden id=m' + id + ' value=' + pname + '>' + pagename + directorysublink + '</span>'
                }
                else if (pagelink == "DocumentConfidential") {
                    html3 += '<span id="clname" ><input type=hidden id=m' + id + ' value=' + pname + '><img src="/newassets/images/rolls_icon2.png"></img> ' + pagename + directorysublink + '</span>'
                }
                else if (pagelink == "ClientCredentials") {
                    html3 += '<span id="clname"><input type=hidden id=m' + id + ' value=' + pname + '><img src="/newassets/images/rolls_icon2.png"></img> ' + pagename + directorysublink + '</span>'
                }
                else if (pagelink == "ClientMessaging") {
                    html3 += '<span id="clname"><input type=hidden id=m' + id + ' value=' + pname + '><img src="/newassets/images/rolls_icon2.png"></img> ' + pagename + directorysublink + '</span>'
                }
                else {
                    html3 += '<span id="clname" ><input type=hidden id=m' + id + ' value=' + pname + '>' + pagename + '</span>'
                }
                html3 += '</td>'
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
            $("#bindcasetask").html("");
            $("#bindcasetask").append(html3);
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
            if (rightlevel == "0") {
                $("#chkwrite_75,#chkview_75,#chkedit_75,#Chkdelete_75").prop("checked", true);
                $("#chkwrite_65,#chkview_65,#chkedit_65").prop("checked", true);
                $("#chkwrite_92,#chkview_92").prop("checked", true);
                $("#chkenabledisable_111").prop("checked", true);
                $("#chkwrite_77,#chkview_77,#chkedit_77").prop("checked", true);
                $("#chkwrite_82,#chkview_82").prop("checked", true);
                $("#chkwrite_79,#chkview_79").prop("checked", true);
                $("#chkwrite_102,#chkview_102,#chkedit_102").prop("checked", true);
            }
            else if (rightlevel == "1") {
                $("#chkwrite_75,#chkview_75,#chkedit_75,#Chkdelete_75,#chkexportemaildownload_75").prop("checked", true);
                $("#chkwrite_65,#chkview_65,#chkedit_65,#Chkdelete_65,#chkexportemaildownload_65,#chkshare_65,#chkenabledisable_65").prop("checked", true);
                $("#chkwrite_92,#chkview_92,#chkedit_92,#Chkdelete_92,#chkshare_92,#chkenabledisable_92").prop("checked", true);
                $("#chkenabledisable_111").prop("checked", true);
                $("#chkwrite_77,#chkview_77,#chkedit_77,#Chkdelete_77,#chkexportemaildownload_77").prop("checked", true);
                $("#chkwrite_82,#chkview_82,#chkedit_82,#Chkdelete_82,#chkexportemaildownload_82,#chkshare_82").prop("checked", true);
                $("#chkwrite_79,#chkview_79,#Chkdelete_79,#chkexportemaildownload_79,#chkshare_79").prop("checked", true);
                $("#chkwrite_102,#chkview_102,#chkedit_102,#Chkdelete_102,#chkexportemaildownload_102").prop("checked", true);
                $("#chkwrite_106,#chkview_106,#chkedit_106,#chkexportemaildownload_106").prop("checked", true);
                $("#chkwrite_108,#chkview_108,#chkedit_108,#Chkdelete_108,#chkexportemaildownload_108,#chkshare_108").prop("checked", true);
                $("#chkwrite_109,#chkview_109,#chkedit_109,#Chkdelete_109,#chkexportemaildownload_109,#chkshare_109,#chkenabledisable_109").prop("checked", true);
            }
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
function fn_userlevelrights(rval) {
    var getSelectedVal = $("#hdnrdrightslevelval").val();
    //$("#hdnrdrightslevelval").val(rval);
    $("#hdnrdrightslevelval").val(getSelectedVal);
    LoadRoleAccessLevelData(pageindex);
}
function fn_ContactCridential() {
    $("#divContactcredential").toggle();
}
function fn_DocumentConfidential() {
    $("#divDocumentConfidential").toggle();
}
function fn_GetSubmodule(parentpage) {
    alert(parentpage);
    var divSubmodule = "#divSubmodule_" + parentpage;
    var htmlsubmodule = "";
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/LoadSubModulePage?parentpage=" + parentpage,
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var starttable = "<table>";
            var endtable = "</table>";
            var submodule = "";
            if (response1.Data != "") {
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    var pagename = a.PageName;
                    submodule += "<tr><td>" + pagename + "</td></tr>";
                });
            }
            htmlsubmodule = starttable + submodule + endtable;
            alert(htmlsubmodule);
            $(divSubmodule).html(htmlsubmodule);
        }
    });
}
/*Role access option*/
function fn_RoleAccessOption(val) {
    alert(val);
    if (val == 1) {
        $("#divddlGroup").show();
        $("#divddlUsers").hide();
        $("#hdnrdaccessval").val("1");
    }
    if (val == 2) {
        $("#divddlGroup").hide();
        $("#divddlUsers").show();
        $("#hdnrdaccessval").val("2");
    }
}
