var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var pagindexModal = 1,
    pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var Proname = "";
var PropAddress = "";
var searchName = "";
var searchAddress = "";
var PageIndexByName = 1;
$(document).ready(function () {
    $('#spPhoneticSearch').show();
    if (IPname == 1) {
        $('#searchAgent').css("display", "block");
    }
    function fn_search() {
        if (event.which === 13) {
            var agentname = $('#agentName').val();
            if (agentname != '') {
                GetAgentData();
            }
        }
    }
    $(document).on('click', '#btnsearch', function () {
        if ($('#agentName').val() == '') {
            alert('Please fill the Agent Name Textbox');
            return false;
        }
        isRenderPage = false;
        pageindex = 1;
        GetAgentData();
    });
    /*Start page redirection*/

    $(document).on('click', "#searchPhonetictab", function () {
        window.location.href = `/${fcode}/IPR/PhoneticSearch?IP=${IPname}`;
    })
    $(document).on('click', "#searchIP", function () {
        window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
    })
    $(document).on('click', "#propSearch", function () {
        window.location.href = `/${fcode}/IPR/ProprietorSearch?IP=${IPname}`;
    })
    $(document).on('click', "#searchAgent", function () {
        window.location.href = `/${fcode}/IPR/AgentSearch?IP=${IPname}`;
    })
    $(document).on('click', "#btnBack", function () {
        window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
    })
    /*End page redirection*/
    $(document).on("click", "#idcustomcommonFilter", function () {
        $("#iprform")[0].reset();
        $('#myModalCustomCommonFilter').modal({ show: true });
    })

    var setTotalRecord = 1;
    function GetAgentData(ppageindex) {
        
        var htmls = '';
        var iprid = $('#iprtypeid').val();
        var agentname = $('#agentName').val();
        var agentaddress = $('#agentAddress').val();

        var formData = new FormData();

        formData.append('iprtypeid', IPname);
        formData.append('agentname', agentname);
        formData.append('agentaddress', agentaddress);

        if (ppageindex != 'undefined' && ppageindex != null && ppageindex != undefined) {
            pageindex = ppageindex;
            formData.append('ppindex', pageindex);
        }

        else {
            formData.append('ppindex', pageindex);
        }
        formData.append('ppsize', pagesize);
        openload();

        $.ajax({

            async: true,
            type: "POST",
            url: "/api/IPRApi/AgentSearchForTrademark",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response) {
                var data = response.Data.data;
                if (data != undefined && data != 'undefined' && data.length > 0) {
                    var length = data.length;
                    $("#divalertlist tr").remove();
                    $('#pdatastatus').hide();
                    $('#tradePagination').show();
                    $.each(data, function (index, value) {
                        if (index === 0) {
                            firstvalue = value.RowId;
                        }
                        if (index === (length - 1)) {

                            //var pnext = pageindex;
                            //var pprev = pageindex;
                            //var pageno = pageindex;

                            //var totdata = value.TotalRecord;
                            //var totpage = 0;

                            //if (totdata > 0) {
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
                            //$("#exportrecords").val(value.TotalRecord);
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>'
                            //if (value.TotalRecord <= length) {

                            //}
                            //else if (pageno == 1) {

                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span><a id="paginatetblprev"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span><span>'
                            //}

                            //else {
                            //    tfot += '<li><span><a id="paginatetblprev"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span><span>'
                            //}

                            //if (pageno < totpage) {
                            //    tfot += '<a  id="paginatetblforw" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span></li>'
                            //}
                            //tfot += '</ul>'
                            //$("#ptfooter").html("");
                            //$("#ptfooter").html(tfot);


                            //var tfot = '';
                            //$("#exportrecords").val(totdata);
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + totdata + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                            $("#exportrecords").val(value.TotalRecord);

                            var totdata = value.TotalRecord;
                            $("#AgentCount").text("(" + value.TotalRecord + ")");
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

                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td style="white-space: pre;">' + value.Agent + '</td>' +
                            '<td style="white-space: pre;">' + ((value.AgentAddress == null || value.AgentAddress == 'null') ? '' : value.AgentAddress) + '</td>' +
                            '<td>' +
                            '<ul class="table_action"><li><span id="PropDetailsByName" class="taskoutboxbtnicon openModal" ' +
                            'style="cursor:pointer;" title="View details of Agent" ' +
                            'data-name="' + value.Agent + '" data-address="' + value.AgentAddress + '" ' +
                            'data-toggle="modal" data-target="#viewPropritordata">' +
                            '<img src="/newassets/img/eye.svg" /></span></li> ' +
                            '<li><span id="DownloadAgentDetailsExcel" class="taskoutboxbtnicon" ' +
                            'style="cursor:pointer;" data-name="' + value.Agent + '" ' +
                            'data-address="' + value.AgentAddress + '" ' +
                            'title="Download Excel data"> <img src="/newassets/img/download.svg" />' +
                            '</span> <ul>' +
                            '</td>'
                        '</tr>';


                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                    $('#pdatastatus').show();
                    $('#tradePagination').hide();
                }

                $("#bindIPRSearchData").html("").html(htmls);
                closeload();
            },

            error: function (data) {
                closeload();
            }

        });

    }

    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    var setPageNo = 1;
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

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        isRenderPage = true;
        $("#txtgopage").val("");
        GetAgentData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#prev", function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        GetAgentData(setPageNo);

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        GetAgentData(setPageNo);
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
        GetAgentData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    /*Pagination End*/


    $(document).on('click', '#DownloadAgentDetailsExcel', function () {

        var AgentName = $(this).data('name');
        var AgentAddress = $(this).data('address');

        //var formData = new FormData();
        //formData.append('vAgentName', AgentName);
        //formData.append('vAgentAddress', AgentAddress);

        window.location = encodeURI("/IPR/ExcelDownloadForAgent?vAgentName=" + AgentName
            + "&vAgentAddress=" + AgentAddress);

    });

    //$(document).on('click', '#PropDetailsByName', function (event, pageindex) {
    //    searchAddress = "";
    //    searchName = "";
    //    var AgentName = $(this).data('name');
    //    var AgentAddress = $(this).data('address');
    //    searchAddress = AgentAddress;
    //    searchName = AgentName;
    //    $("#modal-header").text(AgentName);

    //    var formData = new FormData();
    //    formData.append('agentname', AgentName);
    //    formData.append('agentaddress', AgentAddress);
    //    pageindex = pageindex ?? 1;
    //    formData.append('pageindex', pageindex);
    //    formData.append('pagesize', pagesize);
    //    openload();
    //    $.ajax({
    //        data: formData,
    //        type: "POST",
    //        url: "/api/IPRApi/AgentSearchByNameAndAddress",
    //        dataType: "json",
    //        async: true,
    //        contentType: false,
    //        processData: false,
    //        success: function (response) {
    //            var obj = response.Data.data;
    //            var htmls = '';
    //            if (obj.length > 0) {

    //                $.each(obj, function (index, value) {
    //                    var tfot = '';
    //                    if (index === (length - 1)) {
    //                        var pnext = pagindexModal;
    //                        var pprev = pagindexModal;
    //                        var pageno = pagindexModal;

    //                        var totdata = value.TotalRecord;
    //                        var totpage = 0;
    //                        if (value.TotalRecord > 0) {
    //                            pnext = parseInt(pnext) + 1;
    //                            if (pnext == 0) pnext = 1;

    //                            pprev = parseInt(pageno) - 1;
    //                            if (pprev == 0) pprev = 1;
    //                            totpage = parseInt(totdata) / parseInt(pagesize);

    //                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
    //                                totpage = parseInt(totpage) + 1;
    //                            }

    //                            $("#pagnumvalue1").val(totpage);

    //                        }

    //                        tfot += '<div class="col-md-4"><ul>'
    //                        tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage1" style="display:none">' + totpage + '</span></li>'

    //                        tfot += '<li><span>|</span></li>'
    //                        tfot += '<li>pages ' + pagindexModal + '/ ' + parseInt(totpage) + '</li>'
    //                        tfot += '<li><span>|</span></li>'
    //                        tfot += `<li><input type="number" id="pagnumvalue1" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum1" style="margin-left:10px;">Go</button></a></li>`

    //                        if (value.TotalRecord <= length) {

    //                        }
    //                        else if (pageno == 1) {

    //                        }
    //                        else if (pageno == totpage) {
    //                            tfot += '<li><span><a id="paginateprev"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>   <span>'

    //                        }

    //                        else {
    //                            tfot += '<li><span><a id="paginateprev"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span><span>'
    //                        }

    //                        if (pageno < totpage) {
    //                            tfot += '<a id="paginateforw" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span></li>'

    //                        }
    //                        tfot += '</ul> </div>'
    //                        //var emailButtonHtml = '<button  id="emexcel" class="sbtbtn pull-right" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';
    //                        //tfot += emailButtonHtml;
    //                        //if (IPname == "1") {
    //                        //    var trckButtonHtml = '<button id="Tracprop" class="sbtbtn" >Add To Tracker</button>';
    //                        //    tfot += trckButtonHtml
    //                        //}
    //                        ////tfot += '<button style="margin-right:-500px" id="emexcel" class="sbtbtn pull-right" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';

    //                        //// tfot += '</ul>'
    //                        //$("#ptfooter1").html("");
    //                        //$("#ptfooter1").html(tfot);
    //                    }
    //                    var emailButtonHtml = '<button  id="emexcel" class="sbtbtn pull-right" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';
    //                    tfot += emailButtonHtml;
    //                    if (IPname == "1") {
    //                        var trckButtonHtml = '<button id="Tracprop" class="sbtbtn" >Add To Tracker</button>';
    //                        tfot += trckButtonHtml
    //                    }
    //                    $("#ptfooter1").html("");
    //                    $("#ptfooter1").html(tfot);
    //                    htmls += '<tr>' +
    //                        '<td>' + value.RowId + '</td>' +
    //                        '<td>' + value.vApplNo + '</td>' +
    //                        '<td>' + value.vWordMark + '</td>' +
    //                        '<td>' + value.vProprietor + '</td>' +
    //                        '<td>' + value.vStatus + '</td>' +
    //                        '<td>' + value.vClass + '</td>' +
    //                        '<td>' + value.dApplDate + '</td>' +
    //                        '<td>' + value.vUsedSince + '</td>' +
    //                        '</tr>';
    //                });
    //            }
    //            else {
    //                htmls += '<tr>' +
    //                    '<td colspan="8" style="text-align: center;">Data Not Found</td>' +
    //                    '</tr>';
    //            }
    //            var appendData = $('#emexcel').attr({
    //                'data-name': AgentName,
    //                'data-address': AgentAddress
    //            });

    //            $('#bindviewPropritordata').html(htmls);
    //            closeload();
    //        },

    //        error: function () {
    //        }
    //    });
    //});

    $(document).on('click', '#PropDetailsByName', function () {
        searchAddress = "";
        searchName = "";
        isViewRenderPage = false;
        searchName = $(this).data('name');
        searchAddress = $(this).data('address');
        PageIndexByName = 1;
        AgentDetailByNameAddress();
    });



    function AgentDetailByNameAddress() {
        $("#modal-header").text(searchName);
        var formData = new FormData();
        formData.append('agentname', searchName);
        formData.append('agentaddress', searchAddress);
        formData.append('pageindex', PageIndexByName);
        formData.append('pagesize', pagesize);
        openload();
        $.ajax({
            data: formData,
            type: "POST",
            url: "/api/IPRApi/AgentSearchByNameAndAddress",
            dataType: "json",
            async: true,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.data;
                var htmls = '';
                if (obj.length > 0) {
                    $.each(obj, function (index, value) {
                        var tfot = '';
                        if (index === (obj.length - 1)) {
                            //var pnext = PageIndexByName;
                            //var pprev = PageIndexByName;
                            //var pageno = PageIndexByName;

                            //var totdata = value.TotalRecord;
                            //var totpage = 0;
                            //if (value.TotalRecord > 0) {
                            //    pnext = parseInt(pnext) + 1;
                            //    if (pnext == 0) pnext = 1;

                            //    pprev = parseInt(pageno) - 1;
                            //    if (pprev == 0) pprev = 1;
                            //    totpage = parseInt(totdata) / parseInt(pagesize);

                            //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //        totpage = parseInt(totpage) + 1;
                            //    }
                            //}

                            //tfot += '<div class="col-md-6"><ul>'
                            //tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopageforAgentName" style="display:none">' + totpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + PageIndexByName + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li><input type="number" id="pagnumvalueAgentName" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getpagenumforAgentName" style="margin-left:10px;" >Go</button></a></li>'
                            //tfot += '<li>'
                            //if (value.TotalRecord <= length) {

                            //}
                            //else if (pageno == 1) {

                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<span><a id="pageindexAgentName"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1"></a></span>   <span>'
                            //}
                            //else {
                            //    tfot += '<span><a id="pageindexAgentName"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1" ></a></span><span>'
                            //}

                            //if (pageno < totpage) {
                            //    tfot += '<a  id="pageindexAgentName" title="Next Page" href="javascript:void()" index="' + pnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext1"></a ></span >'
                            //}

                            //tfot += '</li ></ul> </div>'
                            var totdata = value.TotalRecord;
                            var totpage = 0;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (PageIndexByName == totpage) {
                                $('#viewNext').hide();
                                $('#viewPrev').css("display", "block");
                            }
                            else {
                                $('#viewNext').css("display", "block");
                            }
                            if (PageIndexByName == 1) {
                                $('#viewPrev').css("display", "none");
                            }
                            else {
                                $('#viewPrev').css("display", "block");
                            }

                            if (isViewRenderPage == false) {
                                setviewTotalRecord = totpage;
                                ViewRenderPagination(PageIndexByName, totpage);
                            }
                        }
                        var emailButtonHtml = '<button style="margin-left:10px;" id="emexcel" class="btn btn-primary pull-right" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';
                        tfot += emailButtonHtml;
                        if (IPname == "1") {
                            var trckButtonHtml = '<button id="Tracprop" class="btn btn-primary pull-right">Add To Tracker</button>';
                            tfot += trckButtonHtml
                        }
                        $("#ptfooter1").html("");
                        $("#ptfooter1").html(tfot);
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vApplNo + '</td>' +
                            '<td>' + value.vWordMark + '</td>' +
                            '<td>' + value.vProprietor + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '<td>' + value.vClass + '</td>' +
                            '<td>' + value.dApplDate + '</td>' +
                            '<td>' + value.vUsedSince + '</td>' +
                            '</tr>';
                    });
                }
                else {
                    htmls += '<tr>' +
                        '<td colspan="8" style="text-align: center;"><div clas="not_found"><img src="/newassets/img/not-found.svg" /> <h2>No Data Found</h2> </div></td>' +
                        '</tr>';
                }
                var appendData = $('#emexcel').attr({
                    'data-name': searchName,
                    'data-address': searchAddress
                });

                $('#bindviewPropritordata').html(htmls);
                closeload();
            },
            error: function () {
            }
        });
    }
    var setviewTotalRecord = 1;
    var isViewRenderPage = false;
    function ViewRenderPagination(IndexNo, totdata) {
        let totPages = totdata;
        PageIndexByName = IndexNo;
        totalPageRec = totdata;
        let paginationHtml = '';
        let maxVisible = 4;
        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="viewpage-btn ${i === PageIndexByName ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="viewpage-btn ${i === PageIndexByName ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="viewpage-btn ${j === PageIndexByName ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#viewPageNumbers").html(paginationHtml);
        isViewRenderPage = true;
    }
    var setViewPageNo = 1;
    $(document).on("click", ".viewpage-btn", function () {
        let page = $(this).data("page");
        PageIndexByName = page;
        isViewRenderPage = true;
        $("#viewtxtgopage").val("");
        AgentDetailByNameAddress();
        $(".viewpage-btn").removeClass("active");
        $(".viewpage-btn[data-page='" + PageIndexByName + "']").addClass("active");
    });

    $(document).on("click", "#viewPrev", function () {
        if (PageIndexByName > 1) {
            PageIndexByName = PageIndexByName - 1;
        }
        isViewRenderPage = true;
        $("#viewtxtgopage").val("");
        AgentDetailByNameAddress();

        $(".viewpage-btn").removeClass("active");
        $(".viewpage-btn[data-page='" + PageIndexByName + "']").addClass("active");
    });
    $(document).on("click", "#viewNext", function () {
        if (PageIndexByName => 1) {
            PageIndexByName = PageIndexByName + 1;
        }
        isViewRenderPage = true;
        $("#viewtxtgopage").val("");
        AgentDetailByNameAddress();
        $(".viewpage-btn").removeClass("active");
        $(".viewpage-btn[data-page='" + PageIndexByName + "']").addClass("active");
    });
    $(document).on("click", "#viewDivGo", function () {
        let goToPage = parseInt($("#viewtxtgopage").val());
        if (!isNaN(goToPage)) {
            PageIndexByName = goToPage;
        }
        if (goToPage > setviewTotalRecord || goToPage == 0 || isNaN(goToPage)) {
            alert("Please enter a valid page number.");
            PageIndexByName = 1;
            return false;
        }
        isViewRenderPage = true;
        AgentDetailByNameAddress();
        $(".viewpage-btn").removeClass("active");
        $(".viewpage-btn[data-page='" + PageIndexByName + "']").addClass("active");
    });
    $(document).on("click", "#btnclear", function () {
        $('#agentName').val('');
        $('#agentAddress').val('');
        $('#bindIPRSearchData').empty();
        $('#pageNumbers').html("");
        $('#tradePagination').hide();
        $('#AgentCount').text("");
        $('#ptfooter').empty();
        $("#pdatastatus").show();
        $("#tradePagination").hide();

    });

    //function fn_btnclear() {

    //    $('#agentName').val('');
    //    $('#agentAddress').val('');
    //    $('#bindIPRSearchData').empty();
    //    $('#ptfooter').empty();
    //}

    $(document).on('click', '#paginateforw', function () {

        ppageindex = $(this).attr('index');
        /*GetAgentData(ppageindex);*/
        $('#PropDetailsByName').trigger('click', [ppageindex]);
    });

    $(document).on('click', '#getdatabypagenum', function () {

        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();

                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    GetAgentData(ppageindex);
                    closeload();
                }
                else {
                    openload();
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
                closeload();
            }
        }
    });

    $(document).on('click', '#emexcel', function () {

        $('#btnEmail').attr({

            'data-name': $(this).data('name'),
            'data-address': $(this).data('address')
        });
    });

    $(document).on('click', '#btnEmail', function () {

        var getEmailVal = $('#emailtxt').val();

        if (getEmailVal == '') {

            alert('Please enter an email id');
            return false;
        }
        var AgentName = $(this).data('name');
        var AgentAddress = $(this).data('address');

        var formData = new FormData();
        formData.append('agentname', AgentName);
        formData.append('agentaddress', AgentAddress);
        formData.append('mail', getEmailVal);

        $.ajax({

            data: formData,
            type: "POST",
            url: "/IPR/SendEmailForAgentDetails",
            dataType: "text",
            async: false,
            contentType: false,
            processData: false,

            success: function (response) {
                //alert('A mail has been sent to the receiver');
                new PNotify({
                    title: 'Success!',
                    text: 'A mail has been sent to the receiver.',
                    type: 'success',
                    delay: 3000
                });
            },

            error: function (response) {

            },

            failure: function (response) {

            }
        });
    });

    //$('#paginateprev').on('click', function () {

    //    ppageindex = $(this).attr("index");
    //    $('#PropDetailsByName').trigger('click', [ppageindex])

    //});

    $(document).on('click', '#paginatetblprev', function () {

        ppageindex = $(this).attr("index");
        GetAgentData(ppageindex);
    });

    $(document).on('click', '#paginatetblforw', function () {

        ppageindex = $(this).attr("index");
        GetAgentData(ppageindex);
    });


    $(document).on('click', '#Tracprop', function () {
        openload();
        var formData = new FormData();
        formData.append('vProprietorSearch', searchName);
        formData.append('vProprietorAddressSearch', searchAddress);
        formData.append('SearchType', "AgentSearch");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/IPRApi/AddToTrackProprietorDetails",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                closeload();
                $("#msgRUSureCon").text("Marks have been added to the tracker successfully.");
                $("#myModalAlertconfirmation").modal();
                //alert('Tracker Added successfully.');
            },

            error: function () {
                closeload();
            },

            failure: function (response) {
                closeload();
            }

        });
    });

    $(document).on('click', '#pageindexAgentName', function () {
        PageIndexByName = $(this).attr('index');
        AgentDetailByNameAddress();
    });

    $(document).on('click', '#getpagenumforAgentName', function () {
        PageIndexByName = $('#pagnumvalueAgentName').val();

        if (PageIndexByName != "undefined") {
            if (Math.sign(PageIndexByName) == 1) {
                var pageindex = $("#sotopageforAgentName").text();

                if (PageIndexByName <= parseInt(pageindex)) {
                    AgentDetailByNameAddress();
                }
                else {
                    openload();
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
});