var ecpageindex = 1, ecpagesize = 10;
/*Create new chat channel*/
function CreateChannel() {
    var formData = new FormData();
    formData.append("ChannelName", EncodeText($("#ChannelName").val()));
    $.ajax(
        {
            type: "POST",
            url: "/api/ChatApi/InsertChatChannel", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == 1) {
                    alert("Channel created successfully.");
                    ChatChannellist();
                }
                else {
                    alert("Channel name already exists.");
                    return false;
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
/*Get chat channel list*/
function ChatChannellist() {
    $("#binddata").html("");
    var formdata = new FormData();
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/ChatChannellist',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            var html3 = '';
            $.each(response.Data, function (i, val) {
                html3 += '<tr><td>' + val.ChannelName + ' </td><td>' + val.CreatedBy + ' </td><td>' + val.CreatedDate + ' </td><td><a href=# onclick=JoinChat(' + val.ChannelGuid + ',' + val.CreatedBy + ')>JOIN CHANNEL</a></td><td><a href=# onclick=InviteUser("' + val.ChannelGuid + '")>INVITE USER</a> </td></tr>';
            });
            $("#binddata").append(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
    });
}
/*Invite chat user*/
function InviteUser(ChannelGuid) {
    var formData = new FormData();
    formData.append("ChannelGuid", EncodeText(ChannelGuid));
    formData.append("UserId", EncodeText($("#Userlist").val()));
    formData.append("activedate", EncodeText($("#activedate").val()));
    formData.append("chattype", EncodeText("1"));
    $.ajax(
        {
            type: "POST",
            url: "/api/ChatApi/InsertInviteChat", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                alert("Invited successfully.");
                ChatChannellist();
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
/*Invited channel list by user*/
function InvitedChannellistByUser() {
    $("#binddata").html("");
    var formdata = new FormData();
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/ChatChannellist',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            var html3 = '';
            $.each(response.Data, function (i, val) {
                html3 += '<tr><td>' + val.ChannelName + ' </td><td>' + val.CreatedBy + ' </td><td>' + val.CreatedDate + ' </td><td><a href=' + val.ChannelGuid + '>JOIN CHANNEL</a></td></tr>';
            });
            $("#binddata").append(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
    });
}
/*Get user list*/
function Userlist() {
    $("#member").html("");
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/Assignuserteamlead",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            var option = '';
            $.each(obj, function (i, a) {
                if (a.roleid == 1) {
                    option += '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                }
                else {
                    if (a.IsPartner == 1) {
                        option += '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                    }
                    else {
                        if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                            option += '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                        }
                        else {
                            option += '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                        }
                    }
                }
            });
            $("#Userlist").html("");
            $("#Userlist").append(option);
            $("#Userlist").css("height", "100px !Important");
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
/*Open loader*/
function openload() {
    $('#myOverlay23').css("display", "block");
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay23').css("display", "none");
    $('#myOverlay').css("display", "none");
}
TeamList(1);
/*Get team list*/
function TeamList(ecpageindex) {
    var ecpagesize = 10;
    $("#binddata").html("");
    var formData = new FormData();
    formData.append("teamname", EncodeText($("#teamname").val()));
    formData.append("pagenum", EncodeText(ecpageindex));
    formData.append("pagesize", EncodeText(ecpagesize));
    openload();
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/TeamList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            $("#ecfooterteam").empty();
            var length = response.Data.length;
            var tfot = "";
            var html3 = '';
            $.each(response.Data, function (i, val) {
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                if (i === (length - 1)) {
                    var pnext = ecpageindex;
                    var pprev = ecpageindex;
                    var pageno = ecpageindex;
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (val.totRow > 0) {
                        pnext = parseInt(pnext) + 1;
                        if (pnext == 0) pnext = 1;
                        pprev = parseInt(pageno) - 1;
                        if (pprev == 0) pprev = 1;
                        totpage = parseInt(totdata) / parseInt(ecpagesize);
                        if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#teamcpagnumvalue").attr("max", totpage);
                    }
                    tfot += '<li>results <span>' + totdata + '</span>  <span id="teamsotopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="teamcpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="teamcgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    tfot += '<li>'
                    if (val.totRow <= length) { }
                    else if (pageno == 1) { }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="teampaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="teampaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a id="teampaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                    }
                    $("#ecfooterteam").append(tfot);
                }
                if (val.InvitedByUser == 1) {
                    html3 += '<tr><td><a dataval=' + val.id + ' datatname=' + val.mname.toString().replace(/ /g, "_") + ' href="#" id="SelectUser">' + val.mname + ' </a></td><td align="left" style="display:none"> </a>&nbsp;<a href="#" id="ChannelidGroup1" data-val=' + val.id + ' data-tname=' + val.mname.toString().replace(/ /g, "_") + '><img src="/newassets/images/join.png" title="Rejoin" /></a></td></tr>';
                }
                else {
                    html3 += '<tr><td><a  dataval=' + val.id + ' datatname=' + val.mname.toString().replace(/ /g, "_") + ' href="#" id="SelectUser">' + val.mname + '</a></td><td align="left"  style="display:none"><a target="_self" href="#" onclick=ValidateTeamUser("' + val.id + '","' + val.mname.toString().replace(/ /g, "_") + '")><img src="/newassets/images/chat_icon.png" title="Chat" /></a></td></tr>';
                }
            });
            $("#binddata").append(html3);
            closeload();
        },
        error: function (response) {
            alert(response.responseText);
            closeload();
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        $("#EColli li input:checkbox:not(:checked)").each(function () {
            var column = "#cexample1 ." + $(this).attr("name");
            $(column).hide();
        });
    });
}
$(document).on('click', '#teampaginate', function () {
    ppageindex = $(this).attr("index");
    TeamList(ppageindex);
});
$(document).on('click', '#teamcgetpagnumvalue', function () {
    ppageindex = $("#teamcpagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#teamsotopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                TeamList(ppageindex);
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
/*Join other team in chat*/
function JoinTeam(strteamguid) {
    window.location.href = "TeamChat/" + strteamguid;
}
/*Validate team user*/
function ValidateTeamUser(strteamguid, strteamname) {
    var formData = new FormData();
    formData.append("TeamGuid", EncodeText(strteamguid));
    var guids = "";
    var ld123 = $.ajax({
        async: true,
        url: '/api/ChatApi/ChatTeamsUsers',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $.each(response.Data, function (i, val) {
                // Do Something in loop here
                guids += val.auser + "^";
            })
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld123).then(function (data, textStatus, jqXHR) {
        InsertAllTeamUserForChat(strteamguid, guids, "", strteamname);
    });
}
/*Join team*/
function JoinTeamChat(ChannelGuid, userid, username) {
    var formData = new FormData();
    var formData = new FormData();
    formData.append("ChannelGuid", EncodeText(ChannelGuid));
    formData.append("userid", EncodeText(userid));
    formData.append("username", EncodeText(username));
    $.ajax(
        {
            type: "POST",
            url: "/api/ChatApi/InsertChatChannelUser", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                // alert("Joined successfully.");
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
/*Get chat team user list*/
function TeamChatValidUserList(strteamguid) {
    $("#binddata").html("");
    var formData = new FormData();
    formData.append("TeamGuid", EncodeText(strteamguid));
    var strarruserid = "";
    var strarrusername = "";
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/TeamChatUserList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            var html3 = '';
            $.each(response.Data, function (i, val) {
                html3 += '<tr><td>' + val.Username + ' </td><td style=display:none>' + val.UserGuid + '</td></tr>';
                strarruserid += val.UserGuid + ",";
                strarrusername += val.Username + ",";
            });
            $("#binddata").append(html3);
            strarruserid = strarruserid.substring(0, strarruserid.lastIndexOf(','));
            strarrusername = strarrusername.substring(0, strarrusername.lastIndexOf(','));
            // var url = "http://localhost:62988/chat/joinchat?tid='" + strteamguid + "'&uid='" + strarruserid + "'&unm='" + strarrusername+"'"; 
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        //closeload();
    });
}
/*Get firm user list*/
function FirmUserList() {
    $("#binddata").html("");
    var formdata = new FormData();
    formdata.append("role", EncodeText(2));
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/FirmUserClientList',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            var html3 = '';
            $.each(response.Data, function (i, val) {
                html3 += '<tr><td>' + val.cfname + ' </td><td><input type="checkbox" name="chkuserid" id="chkuserid" value=' + val.id + '/></td></tr>';
            });
            $("#binddata").append(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        //closeload();
    });
}
/*Get firm client list*/
function FirmClientList() {
    $("#binddata1").html("");
    var formdata = new FormData();
    formdata.append("role", EncodeText(3));
    $.ajax({
        async: true,
        url: '/api/ChatApi/FirmUserClientList',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            var html3 = '';
            $.each(response.Data, function (i, val) {
                html3 += '<tr><td>' + val.cfname + ' </td><td><input type="checkbox" name="chkclientid" id="chkclientid" value=' + val.id + '/></td></tr>';
            });
            $("#binddata1").append(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
/*Insert invited user in chat*/
function InsertInviteUser(strflag) {
    var selectchkvals = "";
    if (strflag == 1) {
        var selectedchk = [];
        $.each($("input[name='chkuserid']:checked"), function () {
            selectedchk.push($(this).val());
            selectchkvals = selectedchk.join(", ");
        });
    }
    var selectchkvals1 = "";
    if (strflag == 2) {
        var selectedchk1 = [];
        $.each($("input[name='chkclientid']:checked"), function () {
            selectedchk1.push($(this).val());
            selectchkvals = selectedchk1.join(", ");
        });
    }
    var formData = new FormData();
    formData.append("ChannelGuid", EncodeText(ChannelGuid));
    formData.append("UserId", EncodeText(selectchkvals + "," + selectchkvals1));
    formData.append("activedate", EncodeText($("#curdate").val()));
    $.ajax(
        {
            type: "POST",
            url: "/api/ChatApi/InsertInviteChat", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                alert("Invited successfully.");
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
}
/*Get invited chat list*/
function InvitedChatList() {
    $("#binddata1").html("");
    var formdata = new FormData();
    formdata.append("role", EncodeText(3));
    $.ajax({
        async: true,
        url: '/api/ChatApi/InvitedChatList',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            var html3 = '';
            $.each(response.Data, function (i, val) {
                html3 += '<tr><td>' + val.SenderName + ' </td><td><a href="#" id="Channelid" data-val=' + val.ChannelGuid + '>Chat </a></td></tr>';
            });
            $("#binddata1").append(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
/*Insert all team user for chat*/
function InsertAllTeamUserForChat(ChannelGuid, userid, username, strteamname = null) {
    var formData = new FormData();
    formData.append("ChannelGuid", EncodeText(ChannelGuid));
    formData.append("UserId", EncodeText(userid));
    formData.append("activedate", EncodeText($("#currdate").val()));
    formData.append("chattype", EncodeText("1"));
    var sdr = $.ajax(
        {
            type: "POST",
            url: "/api/ChatApi/InsertInviteChatTeamUser", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                // alert("Invited successfully.");
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    $.when(sdr).then(function (data, textStatus, jqXHR) {
        var url = "TeamChat?tid=" + ChannelGuid + "&tnm=" + strteamname;
        window.open(url, ChannelGuid, "menubar=0,resizable=1,width=1000,height=600,left=200");
        CustomChannelList(1);
    });
}
$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(document).on('click', '#btnsearch', function () {
        $("#searchremovechannellist").show();
        ChatSaveList(ecpageindex);
    });
    $(document).on('click', '#searchremovechannellist', function () {
        $("#searchremovechannellist").hide();
        $("#Channelname,#name").val("");
        try {
            PrivateChannelList(1);
        }
        catch (er) {
        }
        try {
            ChatSaveList(1);
        }
        catch (er) {
        }
        try {
            CustomChannelList(1);
        }
        catch (er) {
        }
    });
    $(document).on('click', '#comparecgetpagnumvalue', function () {
        ppageindex = $("#comparecpagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#comparesotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadflag = true;
                    ChatSaveList(ppageindex);
                    //closeload();
                }
                else {
                    alert("Invalid page no.");
                    closeload();
                }
            }
            else {
                alert("Invalid page no.");
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#comparepaginate', function () {
        /* your code here */
        ppageindex = $(this).attr("index");
        ChatSaveList(ppageindex);
    });
    ChatSaveList(ecpageindex);
    /*Save chat list*/
    function ChatSaveList(ecpageindex) {
        $("#ecfooterexp").empty();
        var html3 = ''; var tfot = ''; var tfot1 = '';
        var formdata = new FormData();
        var name = $('#name').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        formdata.append("name", EncodeText(name));
        formdata.append("datefrom", EncodeText(datefrom));
        formdata.append("dateto", EncodeText(dateto));
        formdata.append("pagenum", EncodeText(ecpageindex));
        formdata.append("pagesize", EncodeText(ecpagesize));
        openload();
        var strrecord1 = 0;
        var sct1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/chatapi/ChatSaveList",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1 != "") {
                    $("#ecfootercompare").empty();
                    var length = response1.Data.length;
                    $.each(response1.Data, function (i, a) {
                        strrecord1 = 1;
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        if (i === (length - 1)) {
                            var pnext = ecpageindex;
                            var pprev = ecpageindex;
                            var pageno = ecpageindex;
                            var totdata = a.totRow;
                            var totpage = 0;
                            if (a.totRow > 0) {
                                pnext = parseInt(pnext) + 1;
                                if (pnext == 0) pnext = 1;
                                pprev = parseInt(pageno) - 1;
                                if (pprev == 0) pprev = 1;
                                totpage = parseInt(totdata) / parseInt(ecpagesize);
                                if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                $("#comparecpagnumvalue").attr("max", totpage);
                            }
                            tfot += '<li>results <span>' + totdata + '</span>  <span id="comparesotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="comparecpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="comparecgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                            tfot += '<li>'
                            if (a.totRow <= length) { }
                            else if (pageno == 1) { }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            }
                            else {
                                tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a id="comparepaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                            }
                            $("#ecfootercompare").append(tfot);
                        }
                        var Date = a.crdate;
                        var vChatName = a.vChatName;
                        var vChatText = a.vChatText;
                        var UserName = a.UserName;
                        html3 += '<tr>'
                        html3 += '<td class="ddate">'
                        html3 += '<span name="Date" id="clname" >' + Date + '</span></i>'
                        html3 += '</td>'
                        html3 += '<td class="vChatName">'
                        html3 += '<span id="vChatName" >' + vChatName + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="vChatText" style="width:200px;text-align:center" ">'
                        html3 += '<span id="vChatText"><a href="#" id="view" data-val="' + a.iid + '" title="click here to view"><span class="glyphicon glyphicon-eye-open" id="view"></span></a></span>'
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    if (strrecord1 > 0) {
                        $("#doclist").html(html3);
                    }
                    else {
                        $("#doclist").html("<tr><td align=center colspan=3>No record found</td></tr>");
                    }
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                    closeload();
                }
                else {
                    html3 = '<tr><td colspan=11>No result found !</td></tr>'
                    $("#doclist").html(html3);
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
        $(document).on('change', '.chkdhide', function () {
            var column = "." + $(this).attr("name");
            $(column).toggle();
        });
        $(document).on('click', '#view', function () {
            var token = $(this).attr("data-val");
            var url = "ChatView?id=" + token;
            $("#frmcompare").attr("src", url);
            $("#comparemodal").show();
        });
        $(document).on('click', '#mclose', function () {
            $("#comparemodal").hide();
        });
        function ModalClose() {
            document.getElementById("showMe").style.display = "none";
        }
        $.when(sct1).then(function (data, textStatus, jqXHR) {
            $("#EColli li input:checkbox:not(:checked)").each(function () {
                var column = "#cexample1 ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
});
/*Get chat team user list details*/
function ChatTeamsUserList(strteamguid) {
    var formData = new FormData();
    formData.append("TeamGuid", EncodeText(strteamguid));
    $("#CustomChanneldata").empty();
    var strflagvaliduser = 0;
    var html3 = "";
    var guids = "";
    openload();
    var ld1234 = $.ajax({
        async: true,
        url: '/api/ChatApi/ChatTeamsUsers',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $.each(response.Data, function (i, a) {
                var userid = a.auser;
                var UserName = a.cfname;
                html3 += '<tr>'
                html3 += '<td class="UserName">'
                html3 += '<span name="UserName" id="clname" >' + UserName + '</span></i>'
                html3 += '</td>'
                html3 += '<td class="chkbx">'
                if ($("#hidcuruser").val().toLowerCase() == userid.toLowerCase()) {
                    html3 += '<span id="chkbx"><input type="checkbox" name="chk" value=' + userid + ' checked disabled></span>'
                    strflagvaliduser = 1;
                }
                else {
                    html3 += '<span id="chkbx"><input type="checkbox" name="chk" value=' + userid + '></span>'
                }
                html3 += '</td>'
                html3 += '</tr>'
            })
            if (strflagvaliduser == 1) {
                $("#CustomChanneldata").html(html3);
            }
            else {
                window.location = encodeURI("/home/Unauthorise");
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld1234).then(function (data, textStatus, jqXHR) {
        closeload();
    });
}
/*Create custom chat channel*/
function CreateCustomChannel(strteamid) {
    if ($("#ChannelName").val() == "") {
        alert("Please enter channel name");
        return false;
    }
    else {
        var userid = "";
        $('input[name="chk"]:checked').each(function () {
            userid = this.value + "," + userid;
        });
        var selectedchk = userid.split(',');
        if (selectedchk.length > 2) {
            var formData = new FormData();
            formData.append("ChannelName", EncodeText($("#ChannelName").val()));
            formData.append("teamid", EncodeText(strteamid));
            formData.append("userid", EncodeText(userid));
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/ChatApi/CreateChatChannel", // Controller/View
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        closeload();
                        if (data.Data < 1) {
                            alert("Channel name already exists.");
                        }
                        else {
                            alert("Channel created successfully.");
                            var strteamname = $("#ChannelName").val();
                            var strffirmid = "";
                            var strfuserid = "";
                            var strfusername = "";
                            var url = encodeURI("UserLogin?tid=" + data.Data + "&uid=" + strfuserid + "&unm=" + strfusername + "&fid=" + strffirmid + "&tnm=" + strteamname + "&ty=m");            //window.location.href = url;
                            window.open(url, '', "menubar=0,resizable=1,width=1000,height=600,left=200");
                            setTimeout(window.location.href = "ChannelList", 3000);
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
        else {
            alert("Please select user");
            return false;
        }
    }
}
var customecpageindex = 1, customecpagesize = 10;
/*Create custom chat channel*/
function CustomChannelList(customecpageindex) {
    var ecpagesize = 10;
    $("#custombinddata").html("");
    var formData = new FormData();
    formData.append("channelname", EncodeText($("#Channelname").val()));
    formData.append("pagenum", EncodeText(customecpageindex));
    formData.append("pagesize", EncodeText(customecpagesize));
    openload();
    var strrecordexist = 0;
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/CreatedChatChannelList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            $("#ecfootercustom").empty();
            var length = response.Data.length;
            var tfot = "";
            var html3 = '';
            $.each(response.Data, function (i, val) {
                strrecordexist = 1;
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                if (i === (length - 1)) {
                    var pnext = customecpageindex;
                    var pprev = customecpageindex;
                    var pageno = customecpageindex;
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (val.totRow > 0) {
                        pnext = parseInt(pnext) + 1;
                        if (pnext == 0) pnext = 1;
                        pprev = parseInt(pageno) - 1;
                        if (pprev == 0) pprev = 1;
                        totpage = parseInt(totdata) / parseInt(ecpagesize);
                        if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#customcpagnumvalue").attr("max", totpage);
                    }
                    tfot += '<li>results <span>' + totdata + '</span>  <span id="customsotopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="customcpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="customcgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    tfot += '<li>'
                    if (val.totRow <= length) { }
                    else if (pageno == 1) { }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="custompaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="custompaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a id="custompaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                    }
                    $("#ecfootercustom").append(tfot);
                }
                if (val.InvitedByUser == 1) {
                    html3 += '<tr><td width="10%">' + val.CreatedOn + ' </td><td width="25%">' + val.ChannelName + ' </td><td width="30%">' + val.CaseName + ' </td><td width="20%">' + val.UserList + ' </td><td align="center"> </a>&nbsp;<a href="#" id="ChannelidGroup1" data-val=' + val.ChannelGuid + ' data-tname=' + val.ChannelName.toString().replace(/ /g, "_") + '><img src="/newassets/images/join.png" title="Rejoin" /></a></td><td align="center"><a id="ViewEdit" href="#" datachannel=' + val.ChannelGuid + ' datateamid=' + val.teamid + ' datateamname="' + val.CaseName + '" datachname="' + val.ChannelName + '" dataaction="viewedit"> <span class="glyphicon glyphicon-edit" title="Edit"></span></a> | <span class="glyphicon glyphicon-trash" title="Delete" style="color: red; cursor: pointer;text-align:center" datadel=' + val.ChannelGuid + ' id="channeldelete"></span> </td></tr>';
                }
                else {
                    html3 += '<tr><td width="10%">' + val.CreatedOn + ' </td><td width="25%">' + val.ChannelName + '</td><td width="30%">' + val.CaseName + ' </td><td width="20%">' + val.UserList + ' </td><td align="center" ><a target="_self" href="#" onclick=GetAndInsertCustomChannelUserList("' + val.ChannelGuid + '","' + val.ChannelName.toString().replace(/ /g, "_") + '")><img src="/newassets/images/chat_icon.png" title="Chat" /></a></td><td align="center"><a id="ViewEdit" href="#" datachannel=' + val.ChannelGuid + ' datateamid=' + val.teamid + ' datateamname="' + val.CaseName + '" datachname="' + val.ChannelName + '" dataaction="viewedit"> <span class="glyphicon glyphicon-edit" title="Edit"></span></a> | <span class="glyphicon glyphicon-trash" title="Delete" style="color: red; cursor: pointer;text-align:center" datadel=' + val.ChannelGuid + ' id="channeldelete"></span></td></tr>';
                }
            });
            if (strrecordexist > 0) {
                $("#custombinddata").append(html3);
            }
            else {
                $("#custombinddata").append("<tr><td colspan=6 align=center>No Record Found</td></tr>");
            }
            closeload();
        },
        error: function (response) {
            alert(response.responseText);
            closeload();
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        $("#EColli li input:checkbox:not(:checked)").each(function () {
            var column = "#cexample1 ." + $(this).attr("name");
            $(column).hide();
        });
    });
}
$(document).ready(function () {
    $(document).on('click', '#custompaginate', function () {
        customppageindex = $(this).attr("index");
        CustomChannelList(customppageindex);
    });
    $(document).on('click', '#customcgetpagnumvalue', function () {
        ppageindex = $("#customcpagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#customsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    loadflag = true;
                    CustomChannelList(ppageindex);
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
});
/*Get and insert custom user list in chat channel*/
function GetAndInsertCustomChannelUserList(strchannelguid, strteamname) {
    var formData = new FormData();
    formData.append("channelguid", EncodeText(strchannelguid));
    var guids = "";
    var ld123 = $.ajax({
        async: true,
        url: '/api/ChatApi/CreatedChatChannelUserList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $.each(response.Data, function (i, val) {
                // Do Something in loop here
                guids += val.UserID + "^";
            })
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld123).then(function (data, textStatus, jqXHR) {
        InsertAllTeamUserForChat(strchannelguid, guids, "", strteamname);
    });
}
/*Create channel member list*/
function ChannelMemberList(strchannelguid, strteamid, stractiontype) {
    var formData = new FormData();
    formData.append("channelguid", EncodeText(strchannelguid));
    formData.append("teamid", EncodeText(strteamid));
    $("#MemberListdata").empty();
    var html3 = "";
    var guids = "";
    var btnvisibleflag = "0";
    openload();
    var ld123 = $.ajax({
        async: true,
        url: '/api/ChatApi/ChannelMemberList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $.each(response.Data, function (i, a) {
                var userid = a.UserID;
                var UserName = a.UserName;
                var IsChannelMember = a.IsChannelMember;
                var colorname = "White";
                //already join color grey
                if ($("#hidcuruser").val().toLowerCase() == userid.toLowerCase()) {
                    colorname = "#E9E9E9";
                }
                if (a.ChatJoined == "1") {
                    colorname = "#E9E9E9";
                }
                html3 += '<tr>'
                html3 += '<td class="UserName" style="background-color:' + colorname + ';">'
                html3 += '<span name="UserName" id="clname" >' + UserName + '</span></i>'
                html3 += '</td>'
                html3 += '<td class="chkbx" style="background-color:' + colorname + ';">'
                if (IsChannelMember == "1") {
                    if ($("#hidcuruser").val().toLowerCase() == userid.toLowerCase()) {
                        html3 += '<span id="chkbx" ><input type="checkbox" name="chk" value=' + userid + ' checked disabled></span>'
                        if (btnvisibleflag != 1)
                            $("#btnupdatemember").hide();
                    }
                    else {
                        if (a.ChatJoined == "1") {
                            html3 += '<span id="chkbx" ><input type="checkbox" name="chk" value=' + userid + ' checked disabled></span>'
                            if (btnvisibleflag != 1)
                                $("#btnupdatemember").hide();
                        }
                        else {
                            html3 += '<span id="chkbx" ><input type="checkbox" name="chk" value=' + userid + ' checked></span>'
                            $("#btnupdatemember").show();
                            btnvisibleflag = 1;
                        }
                    }
                }
                else {
                    html3 += '<span id="chkbx"><input type="checkbox" name="chk" value=' + userid + '></span>'
                    $("#btnupdatemember").show();
                    btnvisibleflag = 1;
                }
                html3 += '</td>'
                html3 += '</tr>'
            })
            $("#MemberListdata").html(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld123).then(function (data, textStatus, jqXHR) {
        closeload();
    });
}
/*Update member list*/
function UpdateMemberList(strchannelid, strteamid, strChannelName) {
    openload();
    var userid = "";
    $('input[name="chk"]:checked').each(function () {
        userid = this.value + "," + userid;
    });
    var formData = new FormData();
    formData.append("ChannelName", EncodeText(strChannelName));
    formData.append("channelguid", EncodeText(strchannelid));
    formData.append("teamid", EncodeText(strteamid));
    formData.append("userid", EncodeText(userid));
    var lds = $.ajax({
        async: true,
        url: '/api/ChatApi/UpdateChatChannelUser',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            alert("Saved successfully.");
            self.close();
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(lds).then(function (data, textStatus, jqXHR) {
        closeload();
    });
}
/*Create private channel*/
function CreatePrivateChannel() {
    if ($("#ChannelName").val() == "") {
        alert("Please enter channel name");
        return false;
    }
    else if ($("#hidselecteduserid").val() == "") {
        alert("Please select at least one checkbox.");
        return false;
    }
    else {
        var userid = "";
        $('input[name="chk"]:checked').each(function () {
            userid = this.value + "," + userid;
        });
        var formData = new FormData();
        formData.append("ChannelName", EncodeText($("#ChannelName").val()));
        formData.append("teamid", EncodeText(""));
        formData.append("userid", EncodeText($("#hidselecteduserid").val()));
        $.ajax(
            {
                type: "POST",
                url: "/api/ChatApi/CreatePrivateChatChannel", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data < 1) {
                        alert("Channel name already exists.");
                        return false;
                    }
                    else {
                        alert("Channel created successfully.");
                        var strteamname = $("#ChannelName").val();
                        var strffirmid = "";
                        var strfuserid = "";
                        var strfusername = "";
                        var url = encodeURI("UserLogin?tid=" + data.Data + "&uid=" + strfuserid + "&unm=" + strfusername + "&fid=" + strffirmid + "&tnm=" + strteamname + "&ty=p");            //window.location.href = url;
                        window.open(url, '', "menubar=0,resizable=1,width=1000,height=600,left=200");
                        window.location.href = "PrivateChannelList";
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
//Start private channel list
var pvtcpageindex = 1, pvtecpagesize = 10;
function PrivateChannelList(pvtcpageindex) {
    var ecpagesize = 10;
    $("#pvtbinddata").html("");
    var formData = new FormData();
    formData.append("channelname", EncodeText($("#Channelname").val()));
    formData.append("pagenum", EncodeText(pvtcpageindex));
    formData.append("pagesize", EncodeText(pvtecpagesize));
    openload();
    var strrecordexist = 0;
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/PrivateChatChannelList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            $("#ecfooterpvt").empty();
            $("#pvtbinddata tr").html("");
            var length = response.Data.length;
            var tfot = "";
            var html3 = '';
            $.each(response.Data, function (i, val) {
                strrecordexist = 1;
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                if (i === (length - 1)) {
                    var pnext = pvtcpageindex;
                    var pprev = pvtcpageindex;
                    var pageno = pvtcpageindex;
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (val.totRow > 0) {
                        pnext = parseInt(pnext) + 1;
                        if (pnext == 0) pnext = 1;
                        pprev = parseInt(pageno) - 1;
                        if (pprev == 0) pprev = 1;
                        totpage = parseInt(totdata) / parseInt(ecpagesize);
                        if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#pvtcpagnumvalue").attr("max", totpage);
                    }
                    tfot += '<li>results <span>' + totdata + '</span>  <span id="pvtsotopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="pvtcpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pvtcgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    tfot += '<li>'
                    if (val.totRow <= length) { }
                    else if (pageno == 1) { }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="pvtpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="pvtpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a id="pvtpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                    }
                    $("#ecfooterpvt").append(tfot);
                }
                if (val.InvitedByUser == 1) {
                    html3 += '<tr><td>' + val.CreatedOn + ' </td><td>' + val.ChannelName + ' </td><td align="center"> </a>&nbsp;<a href="#" id="ChannelidGroup1" data-val=' + val.ChannelGuid + ' data-tname=' + val.ChannelName.toString().replace(/ /g, "_") + '><img src="/newassets/images/join.png" title="Rejoin" /></a></td><td align="center"><a id="ViewEdit" href="#" datachannel=' + val.ChannelGuid + ' datachname="' + val.ChannelName + '" dataaction="viewedit"> <span class="glyphicon glyphicon-edit" title="Edit"></span></a> | <span class="glyphicon glyphicon-trash" title="Delete" style="color: red; cursor: pointer;text-align:center" datadel=' + val.ChannelGuid + ' id="channeldelete"></span></td></tr>';
                }
                else {
                    html3 += '<tr><td>' + val.CreatedOn + ' </td><td>' + val.ChannelName + '</td><td align="center" ><a target="_self" href="#" onclick=GetAndInsertpvtChannelUserList("' + val.ChannelGuid + '","' + val.ChannelName.toString().replace(/ /g, "_") + '")><img src="/newassets/images/chat_icon.png" title="Chat" /></a></td><td align="center"><a id="ViewEdit" href="#" datachannel=' + val.ChannelGuid + '  datachname="' + val.ChannelName + '" dataaction="viewedit"> <span class="glyphicon glyphicon-edit" title="Edit"></span></a> | <span class="glyphicon glyphicon-trash" title="Delete" style="color: red; cursor: pointer;text-align:center" datadel=' + val.ChannelGuid + ' id="channeldelete"></span></td></tr>';
                }
            });
            if (strrecordexist > 0) {
                $("#pvtbinddata").append(html3);
            }
            else {
                $("#pvtbinddata").append("<tr><td colspan=5 align=center>No Record Found</td></tr>");
            }
            closeload();
        },
        error: function (response) {
            alert(response.responseText);
            closeload();
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        $("#EColli li input:checkbox:not(:checked)").each(function () {
            var column = "#cexample1 ." + $(this).attr("name");
            $(column).hide();
        });
    });
}
$(document).ready(function () {
    $(document).on('click', '#pvtpaginate', function () {
        pvtppageindex = $(this).attr("index");
        PrivateChannelList(pvtppageindex);
    });
    $(document).on('click', '#pvtcgetpagnumvalue', function () {
        ppageindex = $("#pvtcpagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#pvtsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    loadflag = true;
                    PrivateChannelList(ppageindex);
                }
                else {
                    alert("Invalid page no.");
                }
            }
            else {
                alert("Invalid page no.2");
            }
        }
    });
});
/*Update private member list*/
function UpdatePrivateMemberList(strchannelid, strChannelName) {
    var userid = "";
    $('input[name="chk"]:checked').each(function () {
        userid = this.value + "$true" + "," + userid;
    });
    $('input[type=checkbox]:not(:checked)').each(function () {
        userid = this.value + "$false" + "," + userid;
    });
    var formData = new FormData();
    formData.append("ChannelName", EncodeText(strChannelName));
    formData.append("channelguid", EncodeText(strchannelid));
    formData.append("userid", EncodeText(userid));
    formData.append("activedate", EncodeText($("#hidactivedate").val()));
    openload();
    var lds = $.ajax({
        async: true,
        url: '/api/ChatApi/UpdatePrivateChatChannelUser',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            alert("Updated successfully.");
            self.close();
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(lds).then(function (data, textStatus, jqXHR) {
        PrivateChannelMemberList($("#hidchannelid").val());
        closeload();
        // InsertAllTeamUserForChat(strchannelguid, guids, "", strteamname);
    });
}
/*Private channel member list*/
function PrivateChannelMemberList(strchannelguid) {
    openload();
    var formData = new FormData();
    formData.append("channelguid", EncodeText(strchannelguid));
    $("#MemberListdata").empty();
    var html3 = "";
    var guids = "";
    var btnpvtvivisbleflag = 0;
    var ld123 = $.ajax({
        async: true,
        url: '/api/ChatApi/PrivateChannelMemberList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $.each(response.Data, function (i, a) {
                var userid = a.UserID;
                var UserName = a.UserName;
                var IsChannelMember = a.IsChannelMember;
                var colorname = "White";
                //already join color grey
                if ($("#hidcuruser").val().toLowerCase() == userid.toLowerCase()) {
                    colorname = "#E9E9E9";
                }
                if (a.ChatJoined == "1") {
                    colorname = "#E9E9E9";
                }
                html3 += '<tr>'
                html3 += '<td class="UserName" style="background-color:' + colorname + ';">'
                html3 += '<span name="UserName" id="clname" >' + UserName + '</span></i>'
                html3 += '</td>'
                html3 += '<td class="chkbx" style="background-color:' + colorname + ';">'
                if (IsChannelMember == "1") {
                    if ($("#hidcuruser").val().toLowerCase() == userid.toLowerCase()) {
                        html3 += '<span id="chkbx" ><input type="checkbox" name="chk" value=' + userid + ' checked disabled></span>'
                        if (btnpvtvivisbleflag != 1)
                            $("#btnupdatemember").hide();
                    }
                    else {
                        if (a.ChatJoined == "1") {
                            html3 += '<span id="chkbx" ><input type="checkbox" name="chk" value=' + userid + ' checked disabled></span>'
                            if (btnpvtvivisbleflag != 1)
                                $("#btnupdatemember").hide();
                        }
                        else if (a.Active == "0") {
                            html3 += '<span id="chkbx"><input type="checkbox" name="chk" value=' + userid + '></span>'
                            $("#btnupdatemember").show();
                            btnpvtvivisbleflag = 1;
                        }
                        else {
                            html3 += '<span id="chkbx" ><input type="checkbox" name="chk" value=' + userid + ' checked></span>'
                            $("#btnupdatemember").show();
                            btnpvtvivisbleflag = 1;
                        }
                    }
                }
                else {
                    html3 += '<span id="chkbx"><input type="checkbox" name="chk" value=' + userid + '></span>'
                }
                html3 += '</td>'
                html3 += '</tr>'
            })
            $("#MemberListdata").html(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld123).then(function (data, textStatus, jqXHR) {
        closeload();
    });
}
function GetAndInsertpvtChannelUserList(strchannelguid, strchannelname) {
    var userid = "";
    $('input[name="chk"]:checked').each(function () {
        userid = this.value + "," + userid;
    });
    var formData = new FormData();
    formData.append("ChannelGuid", EncodeText(strchannelguid));
    formData.append("UserId", EncodeText(userid));
    formData.append("activedate", EncodeText($("#currdate").val()));
    formData.append("chattype", EncodeText("2"));
    var sdr = $.ajax(
        {
            type: "POST",
            url: "/api/ChatApi/InsertInvitationPrivateChannelMember", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data > 0) {
                    var url = "PrivateChat?tid=" + strchannelguid + "&tnm=" + strchannelname;
                    window.open(url, '', "menubar=0,resizable=1,width=1000,height=600,left=200");
                    PrivateChannelList(1);
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
//End private channel list
