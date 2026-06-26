var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    $("#dynamiciprheader").text("Matter Rights");
    GetMappedCaseUsers();
    ViewCaseRoleAccess(pageindex);
});
$(document).on('click', '#addNewRole', function () {
    var urls = "/" + fcode + "/Role/CaseRoleAccessCreate";
    url_redirect({
        url: urls,
        method: "post",
        data: {}
    });
});
/*View case role access*/
function ViewCaseRoleAccess(pageindex) {
   
    var selectedauser = $("#ddlUsers").val();
    var selectedcase = $("#ddlCases").val();
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", EncodeText(pageindex));
    formData.append("pagesize", EncodeText(pagesize));
    formData.append("searchuser", EncodeText(selectedauser));
    formData.append("searchcase", EncodeText(selectedcase));
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/RoleApi/ViewCaseRoleAccessUsers",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $("#tfooter").html("");
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
            $.each(response1.Data, function (i, a) {
                if (i === 0) {
                    firstvalue = a.rownum;
                }
                if (i === (response1.Data.length - 1)) {
                    //var pnext = pageindex;
                    //var pprev = pageindex;
                    //var pageno = pageindex;
                    //var totdata = a.totRow;
                    //var totpage = 0;
                    //if (a.totRow > 0) {
                    //    pnext = parseInt(pnext) + 1;
                    //    if (pnext == 0) pnext = 1;
                    //    pprev = parseInt(pageno) - 1;
                    //    if (pprev == 0) pprev = 1;
                    //    totpage = parseInt(totdata) / parseInt(pagesize);
                    //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //        totpage = parseInt(totpage) + 1;
                    //    }
                    //    $("#pagnumvalue").attr("max", totpage);
                    //}
                    //var tfot = '';
                    //tfot += '<ul>'
                    //tfot += '<li>results <span>' + a.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                    //tfot += '<li><span>|</span></li>'
                    //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //tfot += '<li><span>|</span></li>'
                    //tfot += '<li ><input type="number" id="pagnumvalue" min="1" class="footerInput"><a type="button" class="gobtn" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a> </li>'
                    //if (a.totRow <= response1.Data.length) {
                    //}
                    //else if (pageno == 1) {
                    //}
                    //else if (pageno == totpage) {
                    //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //}
                    //else {
                    //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //}
                    //if (pageno < totpage) {
                    //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                    //}
                    //tfot += '</ul>'
                    //$("#tfooter").append(tfot);

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
                var caseassignedrights = "", createrights;
                var Username = a.cfname;
                var CreatedDate = a.dCreatedDate;
                var UpdatedDate = a.dUpdatedDate;
                var cases = a.UserCount;
                var Email = a.Email;
                var AssignUser = a.AssignUser;
                var caseid = a.caseid;
                caseassignedrights = a.rightslebel;
                var casename = a.Casename;
                var pageid = a.Pageid;
                var edit = '<ul class="table_action"><li><a class="taskoutboxbtnicon" data-toggle="tab" href="#" id="edtNewgroup" onclick=fn_EditCaseRoleAccess("' + AssignUser + '","' + caseid + '","' + pageid + '")> <img src="/newassets/img/edit.svg" /></a></li>';
                var deletegroup = '<li><a class="taskoutboxbtnicon" data-toggle="tab" href="#" id="delNewgroup" onclick=fn_DeleteCaseRoleAccess("' + AssignUser + '","' + caseid + '","' + pageid + '")> <img src="/newassets/img/delete.svg"> </a> </ul>';
                html3 += '<tr>'
                html3 += '<td>'
                html3 += '<span id="clname" style="">' + Username + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" style="">' + caseassignedrights + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" style="">' + casename + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + formatDatetoIST(CreatedDate) + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + formatDatetoIST(UpdatedDate) + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >'
                html3 += '' + edit + ''
                html3 += '' + deletegroup
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
var setTotalRecord = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isRenderPage = true;
    $("#txtgopage").val("");
    ViewCaseRoleAccess(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    ViewCaseRoleAccess(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    ViewCaseRoleAccess(setPageNo);
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
    ViewCaseRoleAccess(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

/*Get cases by users*/
function fn_showUserCaseContDetails(assignuser) {
    $("#modalUserCountView").modal();
    var html3 = '';
    var formData = new FormData();
    formData.append("loginid", EncodeText(assignuser));
    formData.append("flag", EncodeText(1));
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
                $("#bindUsercountdetails").html("");
            }
            else {
                $("#bindUsercountdetails").html("No User Found!");
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var LoginId = assignuser;
                var mname = a.mname;
                var caseid = a.caseid;
                var iscaserole = a.isCaseRole;
                var isrolled = "NO";
                if (iscaserole != "0") {
                    isrolled = 'YES';
                }
                $("#myModalUserLabel").html("User Cases");
                html3 += '<tr><td>' + mname + '</td><td>' + isrolled + '</td><td><a href="#" onclick=fn_RemoveCaseRoleUser("' + caseid + '","' + LoginId + '",1)>Remove</a></td ></tr > '
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
/*Remove case role by users*/
function fn_RemoveCaseRoleUser(caseid, loginid, flag) {
    if (confirm("Are you sure want to delete role for this case!")) {
        var formData = new FormData();
        formData.append("caseid", EncodeText(caseid));
        formData.append("loginid", EncodeText(loginid));
        formData.append("flag", EncodeText(flag));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/RemoveCaseRoleAccessbyAssignUser",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    ViewCaseRoleAccess(pageindex)
                    alert("Role deleted successfully for this case.");
                }
                else if (response1.Data == "error") {
                    alert("Oops! Something went wrong..");
                }
            }
        });
    }
}
function fn_EditCaseRoleAccess(loginid, editedcaseid, pageid) {
    var urls = "/" + fcode + "/Role/CaseRoleAccessUpdate";
    url_redirect({
        url: urls,
        method: "post",
        data: { "id": loginid, "editcaseid": editedcaseid, "pageid": pageid }
    });
}
/*Delete role access from case*/
function fn_DeleteCaseRoleAccess(loginid, caseid, pageid) {
    if (confirm("Are you sure want to delete the case role access for this user!")) {
        var formData = new FormData();
        formData.append("loginid", EncodeText(loginid));
        formData.append("caseid", EncodeText(caseid));
        formData.append("pageid", EncodeText(pageid));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/RemoveCaseRoleAccessbyAssignUser",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    alert("Successfully deleted");
                    ViewCaseRoleAccess(pageindex);
                }
                else if (response1.Data == "error") {
                    alert("Oops! Something went wrong..");
                }
            }
        });
    }
}
/*Get user mapped case*/
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
            html3 += '<option value="">Select All</option>';
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
$(document).on('change', '#ddlUsers', function () {
    isRenderPage = false;
    var selectedauser = $("#ddlUsers").val();
    if (selectedauser == "") {
        document.getElementById("ddlCases").style.display = "none";
        $("#ddlCases").val("");
        ViewCaseRoleAccess(pageindex);
    }
    else {
        ViewCaseRoleAccess(pageindex);
    }
});
/*Get mapped case*/
function MappedCasesOfUser(selectedauser) {
    $("#ddlCases").show();
    var html3 = '';
    var formData = new FormData();
    formData.append("loginid", selectedauser);
    if (selectedauser != "") {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/RoleApi/CaseListByAssignUser",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#ddlCases").html("");
                }
                else {
                    $("#ddlCases").html("No Case !");
                }
                var length = response1.Data.length;
                html3 += '<option value="">Select All</option>';
                $.each(response1.Data, function (i, a) {
                    var caseid = a.caseid;
                    var mname = a.mname;
                    html3 += '<option value="' + caseid + '">' + mname + '</option>';
                });
                $("#ddlCases").html("");
                $("#ddlCases").append(html3);
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
$(document).on('click', '#searchrights', function () {
    ViewCaseRoleAccess(pageindex);
});
/*Get data by page number*/
$(document).on('click', '#getdatabypagenum', function () {
    pageindex = $("#pagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var ppageindesx = $("#psotopage").text();
            if (pageindex <= parseInt(ppageindesx)) {
                ViewCaseRoleAccess(pageindex);
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
        else {
            alert("Please enter a valid page number.");
        }
    }
});
$(document).on('click', '#paginate', function () {
    pageindex = $(this).attr("index");
    ViewCaseRoleAccess(pageindex);
});
/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}
