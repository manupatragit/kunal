var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var ocreate, oedit, odelete = "";
var isRenderPage = false;
var regionalLanguageSubscription = $("#hdnbulkNoticeRegionalLanuage").val();
$(document).ready(function () {

    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        //pageindex = setPageNo;
        //GetNoticeList(pageindex);
        GetNoticeList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        //pageindex = setPageNo;
        //GetNoticeList(pageindex);
        GetNoticeList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        //pageindex = setPageNo;

        if (totpage < pageindex) {
            //alert("Please enter the valid page number");
            new PNotify({
                title: 'Warning!',
                text: 'Please enter the valid page number.',
                type: 'error',
                delay: 2000
            });
            return;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        GetNoticeList(setPageNo);

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage = false;
        //pageindex = setPageNo;
        GetNoticeList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $("#templateListBody").css('display', 'block');
    $("#CreateButtonShow").css('display', 'block');

    
    GetNoticeList(pageindex)
    $("#BackToList").on("click", function () {
        $("#CreateButtonShow").css('display', 'block');
        $("#templateListBody").css("display", "block");
        $("#createTempBody").css("display", "none");
    });
})
function openload() {
    $('#myOverlay').css("display", "block");
}
function closeload() {
    $('#myOverlay').css("display", "none");
}
/*Get notice list details*/
function GetNoticeList(pageindex) {
    openload();
    var html1 = '';
    var formdata = new FormData();
    formdata.append("pageindex", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));

    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/TemplateList",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            $("#bindtemplatelist").html("");
            $("#templatelistfooter").html("");
            $("#notemplatelist").html("");
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            if (response == "") {
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                $("#notemplatelist").append("No client record found.");
                closeload();
                return false;
            }
            else {
                $.each(response, function (i, a) {
                    oedit = a.oedit;
                    odelete = a.odelete;
                    ocreate = a.ocreate;
                    return false;
                });
                $.each(response, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.TotalRows;

                    if (i === (response.length - 1)) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                        totrecord = a.TotalRows;

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
                            renderPagination(pageindex, totpage);
                        }


                    }

                    html1 += '<tr scope="row">';
                    html1 += '<td>' + a.TemplateName + '</td>';
                    html1 += '<td>'
                    if (oedit == "1") {
                        html1 += '<a style="cursor:pointer;"  onclick=EditTemplate("' + a.Id + '") title="Edit Template"><img src="/newassets/img/edit-icon.png" /></a>'
                    }
                    if (odelete == "1") {
                        html1 += '<a style="cursor:pointer;" onclick=DeleteTemplate("' + a.Id + '") title = "Delete Template" ><img src="/newassets/img/deletecasesingle-icon.png" /></a>';
                    }
                    html1 += '</td></tr>';
                });
                $("#bindtemplatelist").append(html1);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
            closeload();
        },

        failure: function (response) {
            alert(response);
            closeload();
        }, //End of AJAX failure function
        error: function (response) {
            alert(response);
            closeload();
        } //End of AJAX error function
    });

}
/*Edit template*/
function EditTemplate(id) {
    var formdata = new FormData();
    formdata.append("templateid", EncodeText(id))
    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/TemplateDataById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            closeload();
            var targetLanguage = "";
            if (data[0].TempLanguage == null || data[0].TempLanguage == "") {
                targetLanguage = "English";
            }
            else {
                targetLanguage = data[0].TempLanguage;
            }
            $("#txthidden").val(data[0].Id);
            $('#ddlLanguageType').val(targetLanguage);

            $("#txttemplatename").val(data[0].TemplateName);
            CKEDITOR.instances['CreateNotice'].setData(data[0].TemplateContent);
            $("#templateListBody").css("display", "none");
            $("#createTempBody").css("display", "block");
            $("#CreateButtonShow").css('display', 'none');

        },
        failure: function (data) {
            alert(data);
        },
        error: function (data) {
            alert(data);
        }
    });
}


/*Delete template entry*/
function DeleteTemplate1(id) {
    if (confirm("Are you sure you want to remove this entry.")) {
        var formdata = new FormData();
        formdata.append("templateid", EncodeText(id))
        openload();
        $.ajax({
            type: "POST",
            url: "/NoticeTemplate/RemoveTemplate",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (data) {
                closeload();
                //alert(data.message);
                new PNotify({
                    title: 'Success!',
                    text: data.message,
                    type: 'success',
                    delay: 3000
                });
                isRenderPage = false;
                GetNoticeList(pageindex);
            },
            failure: function (data) {
                alert(data.message);
            },
            error: function (data) {
                alert(data.message);
            }
        });
    }
}
function DeleteTemplate(id) {
    $("#myModalNoticeDeleteconfirmation").modal();
    $("#deleteNT_final").attr("id-val", id);
}
$(document).on("click", "#deleteNT_final", function () {
    var Id = $(this).attr("id-val");
    DeleteTemplateByTempId(Id)
});
function DeleteTemplateByTempId(id) {
    //if (confirm("Are you sure you want to remove this entry.")) {
        var formdata = new FormData();
        formdata.append("templateid", EncodeText(id))
        openload();
        $.ajax({
            type: "POST",
            url: "/NoticeTemplate/RemoveTemplate",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (data) {
                closeload();
                //alert(data.message);
                isRenderPage = false;
                new PNotify({
                    title: 'Success!',
                    text: data.message,
                    type: 'success',
                    delay: 3000
                });
                $("#myModalNoticeDeleteconfirmation").modal("hide");
                //isRenderPage = false;
                isRenderPage = false;
                GetNoticeList(pageindex);
            },
            failure: function (data) {
                alert(data.message);
            },
            error: function (data) {
                alert(data.message);
            }
        });
    //}
}
/*Get notice list by page number*/
$(document).on('click', '#pgetdatabypagenum', function () {
    ppageindex = $("#ppagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#psotopage").text();

            if (pageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                GetNoticeList(pageindex);
            }
            else {
                //alert("Invalid page no.");
                new PNotify({
                    title: 'Warning!',
                    text: 'Invalid page no.',
                    type: 'error',
                    delay: 2000
                });
            }
        }
        else {
            //alert("Invalid page no.");
            new PNotify({
                title: 'Warning!',
                text: 'Invalid page no.',
                type: 'error',
                delay: 2000
            });
        }
    }
});

$(document).on('click', '#ppaginate', function () {
    pageindex = $(this).attr("index");
    GetNoticeList(pageindex);
});


$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
/*Save notice template*/
$("#savetemplatenotice").click(function () {
    var CreateNotice = CKEDITOR.instances.CreateNotice.getData();
    var txttemplatename = $("#txttemplatename").val();
    var txthidden = $("#txthidden").val();
    var target_Language = $("#ddlLanguageType").val();
   

    if (txttemplatename == "") {
        //alert("Please Add Template Name");
        new PNotify({
            title: 'Warning!',
            text: 'Please Add Template Name.',
            type: 'error',
            delay: 2000
        });
        return false;
    }
    if (CreateNotice == "") {
        //alert("Please Add Create Notice");
        new PNotify({
            title: 'Warning!',
            text: 'Please Add Create Template.',
            type: 'error',
            delay: 2000
        });
        return false;
    }

    //if (target_Language != "English" && regionalLanguageSubscription != 'display:unset') {
    //    new PNotify({
    //        title: 'Subscription Required',
    //        text: 'Except English, if you want to translate into any regional language, please subscribe to the Notice Translator feature.',
    //        type: 'error',
    //        delay: 2000
    //    });
    //    return false;
    //}
    var formData = new FormData();


    formData.append("CreateNotice", EncodeText(CreateNotice));
    formData.append("txttemplatename", EncodeText(txttemplatename));
    formData.append("target_Language", EncodeText(target_Language));
    formData.append("hidden", EncodeText(txthidden));

    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/AddUpdateTemplate",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            closeload();
            //alert(data.message);
            new PNotify({
                title: 'Success!',
                text: data.message,
                type: 'success',
                delay: 3000
            });
            if (data.status) {
                $("#txttemplatename").val("");
                $("#txthidden").val("");
                CKEDITOR.instances.CreateNotice.setData("");
            }
            isRenderPage = false;
            GetNoticeList(pageindex);
                $("#CreateButtonShow").css('display', 'block');
                $("#templateListBody").css("display", "block");
                $("#createTempBody").css("display", "none");
        
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });

});

function OpenCreateSection() {
    $("#templateListBody").css('display', 'none');
    $("#createTempBody").css('display', 'block');
    $("#CreateButtonShow").css('display', 'none');
    $("#txthidden").val("");
    $("#txttemplatename").val("");
    CKEDITOR.instances['CreateNotice'].setData("");


}


/*Pagination Start*/

var totalPageRec = "";
var setPageNo = 1;
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRec = totdata;

    let paginationHtml = '';
    let maxVisible = 4;
    let delta = 2;
    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    }
    else {
        paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

        let start = Math.max(2, pageindex - delta);
        let end = Math.min(totPages - 1, pageindex + delta);
        if (pageindex <= maxVisible) {
            start = 2;
            end = maxVisible;
        }

        if (pageindex >= totPages - maxVisible + 1) {
            start = totPages - maxVisible + 1;
            end = totPages - 1;
        }
        if (start > 2) paginationHtml += `<span class="dots">...</span>`;
        for (let i = start; i <= end; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
        paginationHtml += `<button class="page-btn ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
    }
    $("#pageNumbers").html(paginationHtml);
    $("#prev").toggleClass("disabled", pageindex === 1);
    $("#next").toggleClass("disabled", pageindex === totPages);
    isRenderPage = true;
}


$(document).on("click", "#btnTranslateTemplate", function () {
    $("#myModalSelectLanguage").modal();
});

$(document).on("click", "#btnSelectLanguagefortranslate", function () {
    var CreateNotice = CKEDITOR.instances.CreateNotice.getData();
    if (CreateNotice == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please Add Create Template.',
            type: 'error',
            delay: 2000
        });
        return false;
    }
    var target_Language = $("#ddlLanguageType").val();
    var formData = new FormData();
    formData.append("CreateNotice", EncodeText(CreateNotice));
    formData.append("target_Language", EncodeText(target_Language));
    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/BindDetailsAfterTranslate",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            closeload();
            var AfterTranslateText = data.Data;
            if (AfterTranslateText!="") {
                CKEDITOR.instances['CreateNotice'].setData(AfterTranslateText);
            }
            $("#myModalSelectLanguage").modal("hide");

        },
        
    });
});