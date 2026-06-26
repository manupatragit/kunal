var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0, morepageno = 1;
var tfot = '';
$(document).ready(function () {
    $(".ms-selectall").hide();
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    $('#WorkMattertransfer').multiselect({
        columns: 1,
        placeholder: 'Select Matter',
        search: true,
        selectAll: true
    });
    /*Export work transfer in exxcel*/
    $("#oexcel").click(function () {
        var fromuser = $('#FilterFromWorkUser').val();
        var touser = $('#FilterToWorkUser').val();
        var casename = $('#casefiltercasename').val();
        window.location = encodeURI("/firm/ExportoExcelWorkTransfer?status=true&fromuser=" + fromuser + "&touser=" + touser + "&casename=" + casename);
    })
    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    $("#FromWorkUser").change(function () {
        $("#WorkMattertransfer").empty();
        $("#WorkMattertransfer").multiselect('reload');
        loadmatterbyCreatorId(morepageno);
    });
    $("#FilterFromWorkUser").change(function () {
        loadWorkTransfer(1);
    });
    $("#FilterToWorkUser").change(function () {
        loadWorkTransfer(1);
    });
    $("#searchdatas").click(function () {
        var casefiltercasename = $("#casefiltercasename").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#casefiltercasename").focus();
            return false;
        }
        $("#clearnewsearchcase").css("display", "unset")
        loadflag = true;
        loadWorkTransfer(1);
        chksflag = true;
    });
    $(document).on('keyup', '#casefiltercasename', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loadflag = true;
                loadWorkTransfer(1);
                $("#clearnewsearchcase").css("display", "none");
                chksflag = false;
            }
        }
    });
    $("#clearnewsearchcase").click(function () {
        $("#casefiltercasename").val("");
        $("#clearnewsearchcase").css("display", "none");
        loadflag = true;
        loadWorkTransfer(1);
        chksflag = true;
    })
    $("#casemoreoption").click(function () {
        morepageno = morepageno + 1;
        loadmatterbyCreatorId(morepageno);
    });
    function loadmatterbyCreatorId(morepageno) {
        $("#ToWorkUser").children('option').show();
        var formData = new FormData();
        formData.append("userid", $("#FromWorkUser").val());
        formData.append("Pagenumber", morepageno);
        $("#ToWorkUser").children("option[value^=" + $("#FromWorkUser").val() + "]").hide()
        $("#WorkMattertransfer").html("");
        $("#WorkMattertransfer").empty();
        $.ajax({
            url: '/api/CallApi/LoadCaseListByCreator',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        alert("No Matter exist. Please first create matter first.");
                        $(".ms-selectall").hide();
                        return false;
                    }
                    else {
                        $(".ms-selectall").show();
                    }
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var html3 = '';
                $.each(obj, function (i, a) {
                    var rowid = a.totRow;
                    if (obj.length == a.totRow) {
                        $("#casemoreoptiondiv").hide();
                    }
                    else {
                        if (a.totRow >= 50) {
                            $("#casemoreoptiondiv").show();
                        }
                        else {
                            $("#casemoreoptiondiv").hide();
                        }
                    }
                    var option = '<option value="' + a["Id"] + '"> ' + a["mname"] + '</option>';
                    $("#WorkMattertransfer").append(option);
                });
                $("#WorkMattertransfer").multiselect('reload');
            }, //End of AJAX Success function
            failure: function (response) {
            }, //End of AJAX failure function
            error: function (response) {
            } //End of AJAX error function
        });
    }
    /*Save work exchange details*/
    $("#saveworkexchange").click(function () {
        var FromWorkUser = $('#FromWorkUser').val();
        var ToWorkUser = $('#ToWorkUser').val();
        var WorkMatter = $('#WorkMattertransfer').val();
        if (FromWorkUser == "") {
            alert("Please select From user");
            return false;
        }
        if (ToWorkUser == "") {
            alert("Please select To user");
            return false;
        }
        if (FromWorkUser.toLowerCase() == ToWorkUser.toLowerCase()) {
            alert("You can not transfer work to same user");
            return false;
        }
        if (WorkMatter == "null" || WorkMatter == null) {
            WorkMatter = "";
        }
        if (WorkMatter == "") {
            alert("Please select matters");
            return false;
        }
        var formdata = new FormData();
        formdata.append("FromWorkUser", FromWorkUser);
        formdata.append("ToWorkUser", ToWorkUser);
        formdata.append("caseid", WorkMatter);
        openload();
        var ld12 = $.ajax({
            async: true,
            url: "/api/CallApi/SaveWortTransfer",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if (parseInt(data.Data) > 0) {
                    $("#savemultipleaddress")[0].reset();
                    $("#WorkMattertransfer").empty();
                    $("#WorkMattertransfer").multiselect('reload');
                    loadWorkTransfer(pageindex);
                    alert("Successfully saved");
                    closeload();
                }
                else if (data.Data = "0") {
                    alert("Alredy assigned.");
                    closeload();
                }
                else {
                    alert("OOPs! Something went wrong.");
                    closeload();
                }
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (data) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });
    $(document).on('click', '#paginate', function () {
        ipageindex = $(this).attr("index");
        loadWorkTransfer(ipageindex);
    });
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    loadWorkTransfer(pageindex);
                    //closeload();
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
    loadWorkTransfer(1);
    /*Load work transfer*/
    function loadWorkTransfer(pageindex) {
        var html3 = '';
        var formData = new FormData();
        var fromuser = $("#FilterFromWorkUser").val();
        var touser = $("#FilterToWorkUser").val();
        var casename = $("#casefiltercasename").val();
        if (fromuser == "null" || fromuser == null) {
            fromuser = "";
        }
        if (touser == "null" || touser == null) {
            touser = "";
        }
        if (casename == "null" || casename == null) {
            casename = "";
        }
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        formData.append("fromuser", fromuser);
        formData.append("touser", touser);
        formData.append("casename", casename);
        openload();
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadWorkTransfer",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#ulfooter").html("");
                response1 = JSON.parse(response.Data);
                var length = response1.length;
                if (length > 0) {
                    $("#notfound").hide();
                    html3 += ''
                    $("#bindClientAddress").html("");
                    $.each(response1, function (i, val) {
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
                            tfot += '<ul>'
                            tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a type="button" id="getdatabypagenum" class="gobtn" style="margin-left:10px;cursor:pointer">Go</button> </a></li>'
                            if (val.totRow <= length) {
                            }
                            else if (pageno == 1) {
                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            }
                            else {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#ulfooter").append(tfot);
                            closeload();
                        }
                        html3 += '<tr>'
                        html3 += '<td class="eType">'
                        html3 += val.rownum
                        html3 += '</td>'
                        html3 += '<td class="eType">'
                        html3 += val.FromUserName
                        html3 += '</td>'
                        html3 += '<td class="eClient">'
                        html3 += val.ToUserName
                        html3 += '</td>'
                        html3 += '<td class="eContact">'
                        html3 += val.MatterName
                        html3 += '</td>'
                        html3 += '<td class="eContact">'
                        html3 += val.Createdby
                        html3 += '</td>'
                        html3 += '<td class="eAddress">'
                        html3 += formatDatetoIST(val.CreateDate)
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#bindClientAddress").html("").html(html3);
                    closeload();
                }
                else {
                    $("#notfound").show();
                    $("#bindClientAddress").html("");
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
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            hide = false;
            //// }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
            return false;
        });
    }
    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    $(document).on('click', '#paginate', function () {
        cpageindex = $(this).attr("index");
        loadWorkTransfer(cpageindex);
    });
});
