$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Compose message*/
    $("#composemessage").click(function () {
        if (roleid == "1") {
            window.location = encodeURI("/" + fcode + "/Firm/composemessage");
        }
        if (roleid == "2") {
            window.location = encodeURI("/" + fcode + "/Employee/composemessage");
        }
        if (roleid == "3") {
            window.location = encodeURI("/" + fcode + "/client/composemessage");
        }
    });
    $(document).on("click", ".idss", function () {
        if (roleid == "1") {
            var transferid = $(this).attr("token");
            var urls = "/" + fcode + "/Firm/composemessage";
            url_redirect({
                url: urls,
                method: "post",
                data: { "token": transferid }
            });
        }
        if (roleid == "2") {
            var transferid = $(this).attr("token");
            var urls = "/" + fcode + "/Firm/composemessage";
            url_redirect({
                url: urls,
                method: "post",
                data: { "token": transferid }
            });
        }
        if (roleid == "3") {
            var transferid = $(this).attr("token");
            var urls = "/" + fcode + "/Firm/composemessage";
            url_redirect({
                url: urls,
                method: "post",
                data: { "token": transferid }
            });
        }
    })
    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });

    //remove draft
    $(document).on("click", "#removedraftdata", function () {
        var fileids = $(this).attr("data-val");
        var formData = new FormData();
        formData.append("fileid", fileids);
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/RemoveDraft",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                new PNotify({
                    title: 'Success!',
                    text: ' Draft removed successfully',
                    type: 'success',
                    delay: 3000
                });
                $("#accordiondata").html("");
                loadtabledata(pageindex);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    /*Get data by page number*/
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    loadtabledata(pageindex);
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

    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loadtabledata(pageindex);
    });
    loadtabledata(pageindex);

    //load table data
    var mids = 0;
    var ausers = "";
    function loadtabledata(pageindex) {
        $("#accordiondata").html("");
        var q1 = 0;
        var html = '';
        openload();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadDraftMessagebyrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#tfooter").html("");
                var it = 2;
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                try {
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
                        if (i === (length - 1)) {
                            var pnext = pageindex;
                            var pprev = pageindex;
                            var pageno = pageindex;
                            var totdata = val.totRow;
                            var totpage = 0;
                            if (val.totRow > 0) {
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
                            tfot += '<table style="width:100%;background:white"><tr><td colspan = "12">'
                            tfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + pageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
                            tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + val.rownum + '</b> of <b style="font-size:12px;">' + val.totRow + ' Entries</b>'
                            tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  style="width: 30px;"><button type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button>'
                            tfot += '</div>'
                            tfot += '<div style="float:right;">'
                            if (val.totRow <= length) {
                            }
                            else if (pageno == 1) {
                            }
                            else if (pageno == totpage) {
                                tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                            }
                            else {
                                tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                            }
                            tfot += '</td >'
                            tfot += '</tr >'
                            $("#tfooter").append(tfot);
                            closeload();
                        }
                        try {
                            mids = enctypesingle(val.did);
                        }
                        catch (er) {
                        }
                        auser = val.auser;
                        if (auser == null) {
                            ausers = "";
                        }
                        else {
                            ausers = val.auser;
                        }
                        if (val.msubject == null) {
                            msubject = "";
                        }
                        else {
                            msubject = val.msubject;
                        }
                        it = it + 1;
                        html += '<tr  ><td class="idss" token=' + mids + '  >' + msubject + ' <span style="display:none">' + val.mbody + '</span></td><td>' + ausers + '</td><td>' + formatDatetoIST(val.date_time) + " " + String(val.date_time).substring(11, 19) + '</td><td><a data-val="' + mids + '" id="removedraftdata" class="btn btn-sm btn-danger" title="Remove draft"><span class="glyphicon glyphicon-trash" ></span>&nbsp; </a></td></tr>';
                    });
                    $("#accordiondata").append(html);
                    closeload();
                }
                catch (err) {
                    alert(err.message);
                }
            }
        });
    }
});
