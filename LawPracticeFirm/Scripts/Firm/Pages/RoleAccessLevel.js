var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    $("#dynamiciprheader").text("Assign Rights");
    var fcode = localStorage.getItem("FirmCode");
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    GetUsersbyFirmid_Roleid();
    LoadUserGroups();
    LoadRoleAccessData(pageindex);
    /*Get users by firmid*/
    function GetUsersbyFirmid_Roleid() {
        var groupval = "";
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
                    html3 += '<li><input id="chkUserrightsteam" type="checkbox" class="shcheckbox1" name="fname" value="' + LoginId + '"><a href="#" class="dropdown-item">' + cfname + '</a></li>'
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

    /*Load group users*/
    function LoadUserGroups() {
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/LoadUserGroups",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.Data.length;
                html3 += ' <option value="">Select Team</option>'
                $.each(response1.Data, function (i, a) {
                    var GroupId = a.iGroupId;
                    var Groupname = a.vGroupname;
                    html3 += ' <option value=' + GroupId + '>' + Groupname + '</option>'
                });
                $("#ddlGroups").html("");
                $("#ddlGroups").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    $(function () {
        $("#rSaveRoleAccessLevel").click(function () {
            var rightlevel = $("#hdnrdrightslevelval").val();
            var hdngroupaccessval = $("#hdnrdaccessval").val();
            var igroupid = "";
            var val = [];
            var userloginids = "";
            if (hdngroupaccessval == 0) {
                alert("Select role access option");
                return false;
            }
            if (hdngroupaccessval == 1) {
                igroupid = $("#ddlGroups").val();
                if (igroupid == "") {
                    alert("Select Team");
                    return false;
                }
            }
            if (hdngroupaccessval == 2) {
                $(':checkbox:checked').each(function (i) {
                    val[i] = $(this).val();
                    if (val[i] != "on") {
                        userloginids += val[i] + ",";
                    }
                });
                if (userloginids == "") {
                    alert("Select user(s)");
                    return false;
                }
            }
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
                    var chkcontactcredential = 'chkcontactcredential_';
                    var chkDocumentConfidential = 'chkDocumentConfidential_';
                    var pageid = 0;
                    var isvalidate = false;
                    $.each(response1.Data, function (i, a) {
                        var id = a.Id;
                        pageid = id;
                        var pagelink = a.Pagelink;
                        var hdnmid = "#m" + id;
                        var mid = $(hdnmid).val();
                        if (document.getElementById(chkdelete + id).checked == true) {
                            if (document.getElementById(chkview + id).checked == false) {
                                document.getElementById(chkview + id).checked = true;
                            }
                        }
                        if (document.getElementById(chkedit + id).checked == true) {
                            if (document.getElementById(chkview + id).checked == false) {
                                document.getElementById(chkview + id).checked = true;
                            }
                        }
                        if (document.getElementById(chkwrite + id).checked == true) {
                            if ($("#hdnrdrightslevelval").val() == "0" || $("#hdnrdrightslevelval").val() == "1")
                                if (pagelink == "ClientCredentials" || pagelink == "ClientMessaging") {
                                    document.getElementById(chkview + id).checked = false;
                                }
                                else if (document.getElementById(chkview + id).checked == false) {
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
                            return false;
                        }
                        else {
                            formData.append("addrawdata", addrawdata);
                            formData.append("rightlevel", rightlevel);
                            $.ajax({
                                async: true,
                                type: "POST",
                                url: "/api/RoleApi/AddRoleAccessLevelData",
                                dataType: 'json',
                                data: formData,
                                contentType: false,
                                processData: false,
                                success: function (response1) {
                                    if (response1.Data == "Success") {
                                        alert("Successfully created");
                                        window.location.href = "/" + fcode + "/Role/RoleAccess";
                                    }
                                    else if (response1.Data == "exists") {
                                        alert("Already role assigned for this User Team.");
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
    $("#searchdatas").click(function () {
        var roleoption = $("#hdnrdaccessval").val();
        if (roleoption == 1) {
            ViewRoleAccessGroups(pageindex);
        }
        if (roleoption == 2) {
            ViewRoleAccessUsers(pageindex);
        }
    });
});

/*Load role access data by page index*/
function LoadRoleAccessData(pageindex) {
    var roleoption = $("#hdnrdaccessval").val();
    ViewRoleAccessUsers(pageindex);
}
/*View group role access by page index*/
function ViewRoleAccessGroups(pageindex) {
    $("#tfooter").html("");
    $("#thusercol").show();
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var selectedauser = $("#ddlUsers").val();
    formData.append("searchuser", selectedauser);
    openload();
    alert("rtere");
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/ViewRoleAccessGroups",
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
                    cfirstvalue = a.rownum;
                }
                if (i === (length - 1)) {
                    var cpnext = pageindex;
                    var cpprev = pageindex;
                    var cpageno = pageindex;
                    var ctotdata = a.totRow;
                    var ctotpage = 0;
                    if (a.totRow > 0) {
                        cpnext = parseInt(cpnext) + 1;
                        if (cpnext == 0) cpnext = 1;
                        cpprev = parseInt(cpageno) - 1;
                        if (cpprev == 0) cpprev = 1;
                        ctotpage = parseInt(ctotdata) / parseInt(pagesize);
                        if (parseInt(ctotdata) % parseInt(pagesize) != 0) {
                            ctotpage = parseInt(ctotpage) + 1;
                        }
                        $("#cpagnumvalue").attr("max", ctotpage);
                    }
                    var ctfot = '';
                    ctfot += '<ul>'
                    ctfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopage" style="display:none">' + ctotpage + '</span></li>'
                    ctfot += '<li><span>|</span></li>'
                    ctfot += '<li>pages ' + cpageindex + '/ ' + parseInt(ctotpage) + '</li>'
                    ctfot += '<li><span>|</span></li>'
                    ctfot += '<li ><input type="number" id="cpagnumvalue" min="1" class="footerInput" ><a class="gobtn"  style="cursor:pointer" type="button" id="cgetdatabypagenum" >Go</a> </li>'
                    if (a.totRow <= length) {
                    }
                    else if (cpageno == 1) {
                    }
                    else if (cpageno == ctotpage) {
                        ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + a.rownum + '  <span>'
                    }
                    else {
                        ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + a.rownum + '  <span>'
                    }
                    if (cpageno < ctotpage) {
                        ctfot += '<a  id="cpaginate" title="Next Page" href="javascript:void()" index="' + cpnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    }
                    ctfot += '</ul>'
                    $("#tfooter").append(ctfot);
                }
                if (a.dCreatedDate == "1900-01-01T00:00:00") {
                    a.dCreatedDate = a.dUpdatedDate;
                }
                var GroupId = a.iGroupId;
                var Groupname = a.vGroupname;
                var CreatedDate = a.dCreatedDate;
                var UpdatedDate = a.dUpdatedDate;
                var UserCount = a.UserCount;
                var edit = '<ul class=""table_action"> <li> <a class="taskoutboxbtnicon" data-toggle="tab" href="#" id="edtNewgroup" onclick=fn_EditRoleAccessGroup("' + GroupId + '")><img src="/newassets/img/edit.svg"  /></a> </li>';
                var deletegroup = '<li><a class="taskoutboxbtnicon" data-toggle="tab" href="#" id="delNewgroup" onclick=fn_DeleteRoleAccessGroup("' + GroupId + '")><img src="/newassets/img/delete.svg"  /> </a></li></ul>';
                html3 += '<tr>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + Groupname + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" ><a data-toggle="tab" href="#" id="showUserContDetails" onclick=fn_showUserContDetails("' + GroupId + '")>' + UserCount + '</a></span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + formatDatetoIST(CreatedDate) + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + formatDatetoIST(UpdatedDate) + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >'
                if (a.oedit == 1) {
                    html3 += '' + edit + ''
                }
                if (a.odelete == 1) {
                    html3 += '' + deletegroup + ' '
                }
                html3 += '</span>'
                html3 += '</td>'
                html3 += '</tr>'
            });
            $("#bindroleaccess").html("");
            $("#bindroleaccess").append(html3);
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



/*View role access uers*/
function ViewRoleAccessUsers(pageindex) {
    $("#tfooter").html("");
    $("#thusercol").hide();
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    var selectedauser = $("#ddlUsersRights").val();
    formData.append("searchuser", selectedauser);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/ViewRoleAccessUsers",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                //$("#dataescstatus").html("");
                $("#pdatastatus").hide();
                $("#tradePagination").show();
            }
            else {
                //$("#dataescstatus").html("No result found !");
                $("#pdatastatus").show();
                $("#tradePagination").hide();
                closeload();
            }
            var length = response1.Data.length;
            
            var qty1 = 0;
            $.each(response1.Data, function (i, a) {
                if (i === 0) {
                    cfirstvalue = a.rownum;
                }
                if (i === (length - 1)) {

                    //var cpnext = pageindex;
                    //var cpprev = pageindex;
                    //var cpageno = pageindex;
                    //var ctotdata = a.totRow;
                    //var ctotpage = 0;
                    //if (a.totRow > 0) {
                    //    cpnext = parseInt(cpnext) + 1;
                    //    if (cpnext == 0) cpnext = 1;
                    //    cpprev = parseInt(cpageno) - 1;
                    //    if (cpprev == 0) cpprev = 1;
                    //    ctotpage = parseInt(ctotdata) / parseInt(pagesize);
                    //    if (parseInt(ctotdata) % parseInt(pagesize) != 0) {
                    //        ctotpage = parseInt(ctotpage) + 1;
                    //    }
                    //    $("#cpagnumvalue").attr("max", ctotpage);
                    //}
                    //var ctfot = '';
                    //ctfot += '<ul>'
                    //ctfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopage" style="display:none">' + ctotpage + '</span></li>'
                    //ctfot += '<li><span>|</span></li>'
                    //ctfot += '<li>pages ' + cpageindex + '/ ' + parseInt(ctotpage) + '</li>'
                    //ctfot += '<li><span>|</span></li>'
                    //ctfot += '<li ><input type="number" id="cpagnumvalue" min="1" class="footerInput" ><a class="gobtn" style="cursor:pointer" type="button" id="cgetdatabypagenum" >Go</a> </li>'
                    //if (a.totRow <= length) {
                    //}
                    //else if (cpageno == 1) {
                    //}
                    //else if (cpageno == ctotpage) {
                    //    ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + a.rownum + '  <span>'
                    //}
                    //else {
                    //    ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + a.rownum + '  <span>'
                    //}
                    //if (cpageno < ctotpage) {
                    //    ctfot += '<a  id="cpaginate" title="Next Page" href="javascript:void()" index="' + cpnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //}
                    //ctfot += '</ul>'
                    //$("#tfooter").append(ctfot);

                    var totdata = a.totRow;
                    var totpage = 0;
                    totpage = parseInt(totdata) / parseInt(pagesize);
                    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        totpage = parseInt(totpage) + 1;
                    }
                    if (pageindex == totpage) {
                        $('#next').hide();
                        $('#prev').css("display", "block");
                    }
                    else {
                        $('#next').css("display", "block");
                    }
                    if (pageindex == 1) {
                        $('#prev').css("display", "none");
                    }
                    else {
                        $('#prev').css("display", "block");
                    }
                    if (isRenderPage == false) {
                        setTotalRecord = totpage;
                        renderPagination(pageindex, totpage);
                    }
                }
                qty1 = qty1 + 1;
                if (a.dCreatedDate == "1900-01-01T00:00:00") {
                    a.dCreatedDate = a.dUpdatedDate;
                }
                var LoginId = a.AssignUser;
                var cfname = a.cfname;
                var mobile = a.cmobile;
                var CreatedDate = a.dCreatedDate;
                var UpdatedDate = a.dUpdatedDate;
                var UserCount = a.UserCount;
                var edit = '<ul class="table_action"> <li> <a class="taskoutboxbtnicon" data-toggle="tab" href="#" id="edtNewgroup" onclick=fn_EditRoleAccessUser("' + LoginId + '")> <img src="/newassets/img/edit.svg" /> </a> </li>';
                var deletegroup = '<li><a class="taskoutboxbtnicon" data-toggle="tab" href="#" id="delNewgroup" onclick=fn_DeleteRoleAccessUser("' + LoginId + '")><img src="/newassets/img/delete.svg" /></a></li></ul>';
                html3 += '<tr>'
                html3 += '<td>'
                html3 += '<span id="clname">' + cfname + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + formatDatetoIST(CreatedDate) + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + formatDatetoIST(UpdatedDate) + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >'
                if (a.oedit == 1) {
                    html3 += '' + edit + ''
                }
                if (a.odelete == 1) {
                    html3 += '' + deletegroup + ''
                }
                html3 += '</span>'
                html3 += '</td>'
                html3 += '</tr>'
            });
            $("#bindroleaccess").html("");
            $("#bindroleaccess").append(html3);
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

/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbers").html(paginationHtml);
    isRenderPage = true;
}
var setPageNo = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isRenderPage = true;
    $("#txtgopage").val("");
    ViewRoleAccessUsers(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    ViewRoleAccessUsers(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    ViewRoleAccessUsers(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isRenderPage = true;
    ViewRoleAccessUsers(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

/*Role access option by value*/
function fn_RoleAccessOption(val) {
    var rightlevel = $("#hdnrdrightslevelval").val();
    //alert(rightlevel);
    $("#hdnrdrightslevelval").val();
    //if (rightlevel == 0) { document.getElementById("rduserlevel").checked = true; }
    //if (rightlevel == 1) { document.getElementById("rdpartnerlevel").checked = true; }
    //if (rightlevel == 2) { document.getElementById("rdfirmlevel").checked = true; }
    if (val == "1") {
        $("#divddlGroup").show();
        $("#divddlUsers").hide();
        //$("#hdnrdaccessval").val(1);
    }
    if (val == "2") {
        $("#divddlGroup").hide();
        $("#divddlUsers").show();
       // $("#hdnrdaccessval").val(2);
    }
}
function fn_SetRoleAccessOption(val) {
    if (val == 1) {
        //$("#hdnrdaccessval").val(1);
    }
    if (val == 2) {
       // $("#hdnrdaccessval").val(2);
    }
}
function fn_EditRoleAccessGroup(groupid) {
    var urls = "/" + fcode + "/Role/RoleAccessUpdate";
    url_redirect({
        url: urls,
        method: "post",
        data: { "id": groupid, "op": "1" }
    });
}
function fn_EditRoleAccessUser(loginid) {
    var urls = "/" + fcode + "/Role/RoleAccessUpdate";
    url_redirect({
        url: urls,
        method: "post",
        data: { "id": loginid, "op": "2" }
    });
}
/*Delete group roel access*/
function fn_DeleteRoleAccessGroup(groupval) {
    if (confirm("Are you sure want to delete the role access for this team!")) {
        var formData = new FormData();
        formData.append("igroupid", groupval);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/RemoveRoleAccessbyGroupId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    alert("Successfully deleted");
                    ViewRoleAccessGroups(pageindex);
                }
                else if (response1.Data == "error") {
                    alert("Oops! Something went wrong..");
                }
            }
        });
    }
}

/*Delete role access user*/
function fn_DeleteRoleAccessUser(loginid) {
    if (confirm("Are you sure want to delete the role access for this user!")) {
        var formData = new FormData();
        formData.append("loginid", loginid);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/RemoveRoleAccessbyAssignUser",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    alert("Successfully deleted");
                    ViewRoleAccessUsers(pageindex);
                }
                else if (response1.Data == "error") {
                    alert("Oops! Something went wrong..");
                }
            }
        });
    }
}
$(document).on('click', '#addNewRole', function () {
    var urls = "/" + fcode + "/Role/RoleAccessCreate";
    url_redirect({
        url: urls,
        method: "post",
        data: {}
    });
});
/*Select all contact list*/
$(document).on('click', '#chkContactsselectall', function () {
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
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
                var chkview = 'chkview_';
                var chkedit = 'chkedit_';
                var chkdelete = 'chkdelete_';
                var chkexportemaildownload = 'chkexportemaildownload_';
                var chkshare = 'chkshare_';
                var chkenabledisable = 'chkenabledisable_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    pageid = id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "UserGroup") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    if (pagelink == "RoleAccess") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    if (pagelink == "CaseRoleAccess") {
                        document.getElementById(chkexportemaildownload + id).checked = false;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    if (pagelink == "ClientCredentials") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = false;
                        document.getElementById(chkedit + id).checked = false;
                        document.getElementById(chkdelete + id).checked = false;
                        document.getElementById(chkexportemaildownload + id).checked = false;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    if (pagelink == "DocumentConfidential") {
                        document.getElementById(chkwrite + id).checked = false;
                        document.getElementById(chkview + id).checked = false;
                        document.getElementById(chkedit + id).checked = false;
                        document.getElementById(chkdelete + id).checked = false;
                        document.getElementById(chkexportemaildownload + id).checked = false;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    if (pagelink == "ContactsList") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = true;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = true;
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    else if (pagelink == "MergeCalendar") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = false;
                        document.getElementById(chkdelete + id).checked = false;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = true;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = false;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = true;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = false;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = true;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkwrite + id).checked = false;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = false;
                        document.getElementById(chkdelete + id).checked = false;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = true;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = false;
                        document.getElementById(chkedit + id).checked = false;
                        document.getElementById(chkdelete + id).checked = false;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = true;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "ViewTimer") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = true;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "DirectoryList") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = true;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = false;
                        document.getElementById(chkshare + id).checked = true;
                        document.getElementById(chkenabledisable + id).checked = false;
                    }
                    else if (pagelink == "Userlist") {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = true;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = false;
                        document.getElementById(chkenabledisable + id).checked = true;
                    }
                    else {
                        document.getElementById(chkwrite + id).checked = true;
                        document.getElementById(chkview + id).checked = true;
                        document.getElementById(chkedit + id).checked = true;
                        document.getElementById(chkdelete + id).checked = true;
                        document.getElementById(chkexportemaildownload + id).checked = true;
                        document.getElementById(chkshare + id).checked = true;
                        document.getElementById(chkenabledisable + id).checked = false;
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
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
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
                var chkeditall = 'chkeditall_';
                $.each(response1.Data, function (i, a) {
                    var id = a.Id;
                    var pagelink = a.Pagelink;
                    if (pagelink == "MergeCalendar") {
                        document.getElementById(chkviewall + id).checked = true;
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "ExpenseReport") {
                        document.getElementById(chkviewall + id).checked = true;
                        document.getElementById(chkeditall + id).checked = true;
                    }
                    else if (pagelink == "ReceiveMessageList") {
                        document.getElementById(chkviewall + id).checked = false;
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "ViewKnowledge") {
                        document.getElementById(chkviewall + id).checked = false;
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "MailBox") {
                        document.getElementById(chkviewall + id).checked = false;
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else if (pagelink == "ClientMessaging") {
                        document.getElementById(chkviewall + id).checked = false;
                        document.getElementById(chkeditall + id).checked = false;
                    }
                    else {
                        document.getElementById(chkviewall + id).checked = true;
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
/*Creaye select all*/
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

/*Select all view*/
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

/*Export all selected*/
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
/*Share selected all role*/
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

/*Select enable role*/
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

/*Check all global view*/
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
var cpageindex = 1;
$(document).on('click', '#cpaginate', function () {
    /* your code here */
    cpageindex = $(this).attr("index");
    LoadRoleAccessData(cpageindex);
});
$(document).on('change', '#ddlUsersRights', function () {
    isRenderPage = false;
    LoadRoleAccessData(1);
});
$(document).on('click', '#cgetdatabypagenum', function () {
    cpageindex = $("#cpagnumvalue").val();
    if (cpageindex != "undefined") {
        if (Math.sign(cpageindex) == 1) {
            var cpageindesx = $("#sotopage").text();
            if (cpageindex <= parseInt(cpageindesx)) {
                openload();
                LoadRoleAccessData(cpageindex);
                //closeload();
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
            }
        }
        else {
            alert("Please enter a valid page number.");
        }
    }
});
/*Show user details by group id*/
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
                html3 += '<tr><td>' + cfname + '</td><td>' + EmailId + '</td><td><a href="#" onclick=fn_RemoveRoleUser("' + groupval + '","' + LoginId + '",1)><span class="glyphicon glyphicon-trash" style="color:red;"></span></a></td></tr>'
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

/*Remove users*/
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
                    LoadRoleAccessData(1);
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
