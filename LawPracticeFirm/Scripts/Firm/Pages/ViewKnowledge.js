$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    loadtabledata(pageindex);
    function searchTable() {
        var input, filter, found, table, tr, td, i, j;
        input = document.getElementById("searchdata");
        filter = input.value.toLowerCase();
        table = document.getElementById("example");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            for (j = 0; j < td.length; j++) {
                if (td[j].innerHTML.toLowerCase().indexOf(filter) > -1) {
                    found = true;
                }
            }
            if (found) {
                tr[i].style.display = "";
                found = false;
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    $('#btnsearch').on('click', function () {
        isRenderPage = false;
        Getdata();
    });

    function Getdata() {
        $("#btnback").css("display", "unset");
        var searchtype = $('#searchtype').val();
        searchdatac = $('#searchdatainfile').val();
        if (searchdatac.length > 2) {
            loadtabledata(1);
        }
        else {
            alert("Please enter minimum of three characters to start your search.");
            $('#searchdata').focus();
        }
    }
    $('#btnback').on('click', function () {
        isRenderPage = false;
        BacktoResult();
    });
    function BacktoResult() {
        $('#searchdatainfile').val("");
        $("#searchtype").val('1');
        $("#btnback").css("display", "none");
        loadtabledata(1);
    }
    function searchinfile() {
        var strval = $("#searchdatainfile").val();
        var strtype = $("#searchtype").val();
        var dirnames = $("#directory").val();
        if (dirnames == "" && directoryid == 0) {
            dirnames = dirnames;
        }
        else if (dirnames == "" && directoryid != 0) {
            dirnames = directoryid;
        }
        if (strval.length > 2) {
            var $table = '';
            var $header = '';
            var dt = '';
            var q1 = 2;
            $table = $('<table id="example" /><tr><th>').addClass('table-panel ');
            $header = $('<thead>').html('');
            $head1 = $('<th><div class="thbg"><input type="checkbox" id="select_all"></div></th><th onclick="sortTable(1)" class="mycursor1" style="display:none"><div class="thbg">Sl. No. <span class="fa fa-sort fa-fw pull-right "></span></div> </th><th onclick="sortTable(2)"  class="date"><div class="thbg">Date <span class="fa fa-sort fa-fw pull-right "></span>></div></th> <th  class="size"><div class="thbg">Size</div></th><th onclick="sortTable(4)" class="titles"><div class="thbg">Title <span class="fa fa-sort fa-fw pull-right "></span></div> </th></th><th onclick="sortTable(5)" class="authordate"><div class="thbg">Author Date <span class="fa fa-sort fa-fw pull-right "></span> </div></th><th onclick="sortTable(6)" class="category"><div class="thbg">Category <span class="fa fa-sort fa-fw pull-right "></span> </div></th><th onclick="sortTable(7)" class="details"><div class="thbg">Description <span class="fa fa-sort fa-fw pull-right"></span></div> </th><th onclick="sortTable(8)" class="author"><div class="thbg">Author <span class="fa fa-sort fa-fw pull-right "></span></div> </th><th onclick="sortTable(9)" class="source"><div class="thbg">Source <span class="fa fa-sort fa-fw pull-right "></span> </div></th><th onclick="sortTable(10)" class="createdby"><div class="thbg">Created by <span class="fa fa-sort fa-fw pull-right "></span></div></th> <th onclick="sortTable(11)" class="Action" width="14%"><div class="thbg">Action</div> </th> <th onclick="sortTable(12)" class="Favourite"><div class="thbg">Favourite </div></th> ');
            $header.append($head1);
            $tbc = $('</tr>');
            $header.append($tbc);
            $table.append($header);
            var fcode = localStorage.getItem("FirmCode");
            openload();
            $.ajax({
                async: true,
                url: '/api/WorkFlowNewApi/ElasticSearchinDoc',
                type: 'POST',
                headers: { 'strtxt': strval, 'type': strtype, 'dirname': dirnames },
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response) {
                    try {
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            var obj = JSON.parse(response.Data);
                            datauser = "";
                        }
                        else {
                            // alert("not found");
                        }
                        if (response.Data.length > 2) {
                            $("#datastatus").html("");
                        }
                        else {
                            alert("No result found !");
                            closeloader();
                        }
                    }
                    catch (er) {
                        alert("No result found !");
                        closeloader();
                    }
                    var it = 2;
                    var qty = 0;
                    $.each(obj, function (i, val) {
                        qty++;
                        if (String(val.IsSync) == "1") {
                            dsyncicon = "glyphicon glyphicon-retweet";
                            dsynctitle = "Marked for data synchronization";
                        }
                        else {
                            dsyncicon = "";
                            dsynctitle = "";
                        }
                        var str = val.tfile;
                        var ficon = "";
                        var icolor = "";
                        if (str != null) {
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            if (ftype == "DOC" || ftype == "DOCX") {
                                ficon = "fa fa-file-word-o";
                                icolor = "#1860a3";
                            }
                            else if (ftype == "PPT" || ftype == "PPTX") {
                                ficon = "fa fa-file-powerpoint-o";
                                icolor = "orange";
                            }
                            else if (ftype == "PDF") {
                                ficon = "fa fa-file-pdf-o";
                                icolor = "red";
                            }
                            else if (ftype == "ZIP") {
                                ficon = "fa fa-file-archive-o";
                                icolor = "orange";
                            }
                            else if (ftype == "PNG" || ftype == "JPG" || ftype == "JPEG") {
                                ficon = "fa fa-file-photo-o";
                                icolor = "#1860a3";
                            }
                            else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS") {
                                ficon = "fa fa-file-excel-o";
                                icolor = "green";
                            }
                            else if (ftype == "TXT") {
                                ficon = "fa fa-file-code-o";
                                icolor = "skyblue";
                            }
                            else {
                                ficon = "glyphicon glyphicon-list-alt";
                                icolor = "black";
                            }
                        }
                        var ftoken = "/DownloadFile.ashx?module=modulek&title=" + val.tfile + "&ftoken=" + val.tid;
                        var $row = $('<tr />');
                        $row.append($('<td />').html("<input type='checkbox' class='checkbox' data-flag='-1' data-val='" + val.Id + "' />"));
                        $row.append($('<td width="50px;" class="s" style="display:none" />').html("<span>" + qty + ""));
                        $row.append($('<td class="date" />').html("<span name=" + val.date_time + ">" + (val.date_time == null ? "" : formatDatetoIST(val.date_time))));
                        $row.append($('<td class="size" />').html("<span name=" + val.FileSize + ">" + (val.FileSize == null ? "" : val.FileSize)));
                        if (val.ftype == 0) {
                            $row.append($('<td class="titles"  />').html("<span>" + (val.tname != "" ? '<span name="' + val.tname + '" class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<span style="cursor:pointer" id="transferpage" data-val="' + val.Id + '">' + val.tname + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></span>' : '<span style="visibility: hidden;">.</span>')));
                        }
                        else {
                            $row.append($('<td class="titles" />').html("<span>" + (val.tname != "" ? '<span name="' + val.tname + '" class="' + ficon + '" aria-hidden="true" style="color:' + icolor + '"> </span>&nbsp;&nbsp;' + val.tname + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>' : '<span style="visibility: hidden;">.</span>')));
                        }
                        $row.append($('<td class="authordate" />').html("<span name=" + val.DocDate + ">" + (val.DocDate == null ? "" : val.DocDate)));
                        $row.append($('<td class="category" />').html("<span name=" + val.Category + ">" + (val.Category == null ? "" : val.Category)));
                        if (val.Content == null) {
                            $row.append($('<td class="details"  />').html('<span>&nbsp;</span>'));
                        }
                        else {
                            $row.append($('<td  class="details"/>').html("<span>" + (val.Content != "" ? val.Content : '<span style="visibility: hidden;">.</span>')));
                        }
                        $row.append($('<td class="author" />').html("<span name=" + val.AuthorName + ">" + (val.AuthorName == null ? "" : val.AuthorName)));
                        $row.append($('<td class="source" />').html("<span name=" + val.Source + ">" + (val.Source == null ? "" : val.Source)));
                        $row.append($('<td class="createby" />').html("<span name=" + val.Createby + ">" + (val.Createby == null ? "" : val.Createby)));
                        if (val.ftype == "1") {
                            var chtml = "";
                            chtml += "<a download='" + val.tname + "' class=='btn btn-success' href='javascript:void()' title='View Document' data-val='" + val.tid + "'  id='openknowfile' > <img src='/newassets/img/view-icon.png' /></a>";
                            if (val.odelete == 1) {
                                if (roleids == "1") {
                                    chtml += "<span style='cursor:pointer;' title='Delete Document'  onclick=MarkDelete('" + val.tid + "',this.value)  id=" + val.tid + " name=" + val.tid + " ><img src='/newassets/img/deletecasesingle-icon.png' /></span>  &nbsp;";
                                }
                                else {
                                    if ((val.firmuser).toLowerCase() == userid.toLowerCase()) {
                                        chtml += "<span  style='cursor:pointer;' title='Delete Document'  onclick=MarkDelete('" + val.tid + "',this.value)  id=" + val.tid + " name=" + val.tid + " ><img src='/newassets/img/deletecasesingle-icon.png' /></span>  &nbsp;";
                                    }
                                }
                            }
                            if (val.export == 1) {
                                if (roleids == "1") {
                                    chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'><img src='/newassets/img/download-icon.png' /></a>";
                                    chtml += "<a title = 'Email document' class== 'btn btn - success' href = 'javascript:void()' data - val='" + val.tid + "'  id = 'shareknowfile' ><img src='/newassets/img/mail-icon.png' /></a>";
                                }
                                else {
                                    if ((val.firmuser).toLowerCase() == userid.toLowerCase()) {
                                        chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'><img src='/newassets/img/download-icon.png' /></a>";
                                    }
                                    else {
                                        if (val.DownRight == 1) {
                                            chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'><img src='/newassets/img/download-icon.png' /></a>";
                                        }
                                    }
                                }
                            }
                            if (val.share == 1) {
                                if (roleids == "1") {
                                    chtml += "<a title='Document Permission' class='' style='cursor:pointer' href='javascript:void()' data-val='" + val.tid + "'  id='sharepermission' ><img src='/newassets/img/share-icon.png' /></a>";
                                    chtml += "<a title = 'Email document' class== 'btn btn - success' href = 'javascript:void()' data - val='" + val.tid + "'  id = 'shareknowfile' ><img src='/newassets/img/mail-icon.png' /></a>";
                                }
                                else {
                                    if ((val.firmuser).toLowerCase() == userid.toLowerCase()) {
                                        chtml += "<a title='Document Permission' class='' style='cursor:pointer' href='javascript:void()' data-val='" + val.tid + "'  id='sharepermission' ><img src='/newassets/img/share-icon.png' /></a>";
                                        chtml += "<a title = 'Email document' class== 'btn btn - success' href = 'javascript:void()' data - val='" + val.tid + "'  id = 'shareknowfile' ><img src='/newassets/img/mail-icon.png' /></a>";
                                    }
                                }
                            }
                            $row.append($('<td class="contact" />').html(chtml));
                        }
                        else {
                            if (val.odelete == 1 || roleids == "1") {
                                $row.append($('<td class="contact" />').html("<span style='cursor:pointer;' title='Delete Folder'  onclick=MarkDelete('" + val.tid + "',this.value)  id=" + val.tid + " name=" + val.tid + " ><img src='/newassets/img/deletecasesingle-icon.png' /><span>  "));
                            }
                            else {
                                $row.append('<td />');
                            }
                        }
                        if (val.ftype == 1) {
                            if (val.Fav != null && val.Fav.toString() == "1")
                                $row.append($('<td />').html("<span><input onchange=MarkFav('" + val.tid + "',this.value) type=checkbox id=" + val.tid + " checked=true name=" + val.tid + "></span>"));
                            else
                                $row.append($('<td />').html("<span><input onchange=MarkFav('" + val.tid + "',this.value) type=checkbox id=" + val.tid + " name=" + val.tid + "></span>"));
                        }
                        else {
                            $row.append('<td />');
                        }
                        $table.append($row);
                    });
                    $('#updatePanel').html($table);
                    closeloader();
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    }
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
                    closeloader();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#searchdatas', function () {
        searchdatac = $('#searchdata').val();
        if (searchdatac.length > 2) {
            loadtabledata(1);
        }
        else {
            alert("Please enter minimum of three characters to start your search.");
            $('#searchdata').focus();
        }
    });
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            loadtabledata(1);
        }
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loadtabledata(pageindex);
    });
    function loadtabledata(pageindex) {
        openload();
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example"   /><tr><th>').addClass('table-panel ');
        $header = $('<thead>').html('');
        $head1 = $('<th><div class="thbg"><input type="checkbox" id="select_all"></div></th><th onclick="sortTable(1)" class="mycursor1" style="display:none"><div class="thbg">Sl. No. <span class="fa fa-sort fa-fw pull-right "></span> </div></th><th onclick="sortTable(2)"  class="date"><div class="thbg">Date <span class="fa fa-sort fa-fw pull-right "></span></div></th><th onclick="sortTable(3)"  class="size"><div class="thbg">Size</div></th> <th onclick="sortTable(4)" class="titles"><div class="thbg">Title <span class="fa fa-sort fa-fw pull-right "></span></div> </th></th><th onclick="sortTable(5)" class="authordate"><div class="thbg">Author Date <span class="fa fa-sort fa-fw pull-right "></span></div> </th><th onclick="sortTable(6)" class="category"><div class="thbg">Category <span class="fa fa-sort fa-fw pull-right "></span></div> </th><th onclick="sortTable(7)" class="details"><div class="thbg">Description <span class="fa fa-sort fa-fw pull-right"></span></div> </th><th onclick="sortTable(8)" class="author"><div class="thbg">Author <span class="fa fa-sort fa-fw pull-right "></span> </div></th><th onclick="sortTable(9)" class="source"><div class="thbg">Source <span class="fa fa-sort fa-fw pull-right "></span> </div></th><th onclick="sortTable(10)" class="createdby"><div class="thbg">Created by <span class="fa fa-sort fa-fw pull-right "></span></div></th> <th onclick="sortTable(11)" class="Action" width="14%"><div class="thbg">Action </div></th> <th onclick="sortTable(12)" class="Favourite"><div class="thbg">Favourite</div> </th> ');
        $header.append($head1);
        $header.append('</thead>');
        $table.append($header);
        $table.append('<tbody id="loadactivitydatas">');
        var searchtxt = $('#searchdatainfile').val();
        var fcode = localStorage.getItem("FirmCode");
        var strval = $("#searchdatainfile").val();
        var strtype = $("#searchtype").val();
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("dirtoken", EncodeText(directoryid));
        formdata.append("type", EncodeText(strtype));
        formdata.append("strtxt", EncodeText(strval));
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/WorkFlowNewApi/LoadKnowldgeDetailsbyrowid',
            data: formdata,
            headers: {
                'title': searchtxt
            },
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {

                if (response.Status === true && response.Data && response.Data.trim() !== "") {
                    var totalTime = new Date().getTime() - ajaxTime;
                    console.log("details:" + totalTime);
                    $("#tfooter").html("");
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                        var length = obj.length;
                    }
                    else {
                        //alert("not found");
                    }
                    if (obj.length == 0) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    }
                    if (response.Data.length > 2) {
                        $("#datastatus").html("");
                    }
                    else {
                        $("#datastatus").html("No result found !");
                        $('#myOverlay23').css("display", "none");
                    }
                    var it = 2;
                    var qty = 0;
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#next').hide();
                                //$('#next').css("display", "none");
                                $('#prev').css("display", "block"); s
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
                            $("#exportrecords").val(val.totRow);
                            //if (i === 0) {
                            //    firstvalue = val.rownum;
                            //}
                            //if (i === (length - 1)) {
                            //    var pnext = pageindex;
                            //    var pprev = pageindex;
                            //    var pageno = pageindex;
                            //    var totdata = val.totRow;
                            //    var totpage = 0;
                            //    if (val.totRow > 0) {
                            //        pnext = parseInt(pnext) + 1;
                            //        if (pnext == 0) pnext = 1;
                            //        pprev = parseInt(pageno) - 1;
                            //        if (pprev == 0) pprev = 1;
                            //        totpage = parseInt(totdata) / parseInt(pagesize);
                            //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //            totpage = parseInt(totpage) + 1;
                            //        }
                            //        $("#pagnumvalue").attr("max", totpage);
                            //    }
                            //    var tfot = '';
                            //    tfot += '<ul>'
                            //    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                            //    if (val.totRow <= length) {
                            //    }
                            //    else if (pageno == 1) {
                            //    }
                            //    else if (pageno == totpage) {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //    }
                            //    else {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //    }
                            //    if (pageno < totpage) {
                            //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }
                            //    tfot += '</ul>'
                            //    $("#tfooter").append(tfot);
                            //    closeloader();
                            $("#CcaseCount").text("(" + val.totRow + ")");
                        }
                        qty++;
                        if (String(val.IsSync) == "1") {
                            dsyncicon = "glyphicon glyphicon-retweet";
                            dsynctitle = "Marked for data synchronization";
                        }
                        else {
                            dsyncicon = "";
                            dsynctitle = "";
                        }
                        var str = val.tfile;
                        var ficon = "";
                        var icolor = "";
                        if (str != null) {
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            //ficon = "zip.png";
                            if (ftype == "DOC" || ftype == "DOCX") {
                                ficon = "doc-icon.png";
                                //icolor = "#1860a3";
                            }
                            else if (ftype == "PPT" || ftype == "PPTX") {
                                ficon = "ppt.png";
                                //icolor = "orange";
                            }
                            else if (ftype == "PDF") {
                                ficon = "pdf-icon.png";
                                //icolor = "red";
                            }
                            else if (ftype == "ZIP") {
                                ficon = "zip.png";
                                //icolor = "orange";
                            }
                            else if (ftype == "PNG" || ftype == "JPG" || ftype == "JPEG") {
                                ficon = "png.png";
                                //icolor = "#1860a3";
                            }
                            else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS") {
                                ficon = "xls.png";
                                //icolor = "green";
                            }
                            else if (ftype == "TXT") {
                                ficon = "fa fa-file-code-o";
                                //icolor = "skyblue";
                            }
                            else {
                                ficon = "glyphicon glyphicon-list-alt";
                                //icolor = "black";
                            }
                        }
                        var ftoken = "/DownloadFile.ashx?module=modulek&title=" + val.tfile + "&ftoken=" + val.tid;
                        var $row = $('<tr />');
                        $row.append($('<td />').html("<input type='checkbox' class='checkbox' data-flag='-1' data-val='" + val.Id + "' />"));
                        $row.append($('<td width="50px;" class="s" style="display:none" />').html("<span>" + qty + ""));
                        $row.append($('<td class="date" />').html("<span name=" + val.date_time + ">" + (val.date_time == null ? "" : formatDatetoIST(val.date_time))));
                        $row.append($('<td class="size" />').html("<span name=" + val.FileSize + ">" + (val.FileSize == null ? "" : val.FileSize)));
                        if (val.ftype == 0) {
                            $row.append($('<td class="titles"  />').html("<span>" + (val.tname != "" ? '<span name="' + val.tname + '" aria-hidden="true"><img height="30px" width="30px" src="/newassets/img/file_blue.svg"></span>&nbsp;&nbsp;<span style="cursor:pointer" id="transferpage" data-val="' + val.Id + '">' + val.tname + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></span>' : '<span style="visibility: hidden;">.</span>')));
                        }
                        else {
                            $row.append($('<td class="titles" />').html("<span>" + (val.tname != "" ? '<span name="' + val.tname + '" > <img width="32px" height="32px" name = "' + val.tname + '" src=" /newassets/img/' + ficon + '" /></span>&nbsp;&nbsp;' + val.tname + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>' : '<span style="visibility: hidden;">.</span>')));
                        }
                        $row.append($('<td class="authordate" />').html("<span name=" + val.DocDate + ">" + (val.DocDate == null ? "" : val.DocDate)));
                        $row.append($('<td class="category" />').html("<span name=" + val.Category + ">" + (val.Category == null ? "" : val.Category)));
                        if (val.Content == null) {
                            $row.append($('<td class="details"  />').html('<span>&nbsp;</span>'));
                        }
                        else {
                            $row.append($('<td  class="details"/>').html("<span>" + (val.Content != "" ? val.Content : '<span style="visibility: hidden;">.</span>')));
                        }
                        $row.append($('<td class="author" />').html("<span name=" + val.AuthorName + ">" + (val.AuthorName == null ? "" : val.AuthorName)));
                        $row.append($('<td class="source" />').html("<span name=" + val.Source + ">" + (val.Source == null ? "" : val.Source)));
                        $row.append($('<td class="createby" />').html("<span name=" + val.Createby + ">" + (val.Createby == null ? "" : val.Createby)));
                        if (val.ftype == "1") {
                            var chtml = "";
                            chtml += "<a download='" + val.tname + "' class=='btn btn-success' href='javascript:void()' title='View Document' data-val='" + val.tid + "'  id='openknowfile' ><img src='/newassets/img/view-icon.png' /></a>";
                            if (val.odelete == 1) {
                                if (roleids == "1") {
                                    chtml += "<span style='cursor:pointer;' title='Delete Document'  onclick=MarkDelete('" + val.tid + "',this.value)  id=" + val.tid + " name=" + val.tid + " ><img src='/newassets/img/deletecasesingle-icon.png' /></span>";
                                }
                                else {
                                    if ((val.firmuser).toLowerCase() == userid.toLowerCase()) {
                                        chtml += "<span style='cursor:pointer;' title='Delete Document'  onclick=MarkDelete('" + val.tid + "',this.value)  id=" + val.tid + " name=" + val.tid + " ><img src='/newassets/img/deletecasesingle-icon.png' /></span>";
                                    }
                                }
                            }
                            if ((val.firmuser).toLowerCase() != userid.toLowerCase()) {
                                if (val.DownRight == 1) {
                                    chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'><img src='/newassets/img/download-icon.png' /></a>";
                                }
                            }
                            else {
                                if (val.export == 1) {
                                    chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'><img src='/newassets/img/download-icon.png' /></a>";
                                }
                            }
                            if (val.share == 1) {
                                if (roleids == "1") {
                                    chtml += "<a title='Document Permission' class='' style='cursor:pointer' href='javascript:void()' data-val='" + val.tid + "'  id='sharepermission' ><img src='/newassets/img/share-icon.png' /></a>";
                                    chtml += "<a title = 'Email document' class== 'btn btn - success' href = 'javascript:void()' data - val='" + val.tid + "'  id = 'shareknowfile' ><img src='/newassets/img/mail-icon.png' /></a>";
                                }
                                else {
                                    if ((val.firmuser).toLowerCase() == userid.toLowerCase()) {
                                        chtml += "<a title='Document Permission' class='' style='cursor:pointer' href='javascript:void()' data-val='" + val.tid + "'  id='sharepermission' ><img src='/newassets/img/share-icon.png' /></a>";
                                        chtml += "<a title = 'Email document' class== 'btn btn - success' href = 'javascript:void()' data - val='" + val.tid + "'  id = 'shareknowfile' ><img src='/newassets/img/mail-icon.png' /></a>";
                                    }
                                }
                            }
                            $row.append($('<td class="contact" />').html(chtml));
                        }
                        else {
                            if (val.odelete == 1 || roleids == "1") {
                                $row.append($('<td class="contact" />').html("<span style='cursor:pointer;' title='Delete Folder'  onclick=MarkDelete('" + val.tid + "',this.value)  id=" + val.tid + " name=" + val.tid + " ><img src='/newassets/img/deletecasesingle-icon.png' /><span>  "));
                            }
                            else {
                                $row.append('<td />');
                            }
                        }
                        if (val.ftype == 1) {
                            if (val.Fav != null && val.Fav.toString() == "1")
                                $row.append($('<td class="Favourite" />').html("<span><input onchange=MarkFav('" + val.tid + "',this.value) type=checkbox id=" + val.tid + " checked=true name=" + val.tid + "></span>"));
                            else
                                $row.append($('<td class="Favourite" />').html("<span><input onchange=MarkFav('" + val.tid + "',this.value) type=checkbox id=" + val.tid + " name=" + val.tid + "></span>"));
                        }
                        else {
                            $row.append('<td class="Favourite" />');
                        }
                        $table.append($row);
                    });
                    $('#updatePanel').html($table);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                    closeloader();
                    $('#myOverlay23').css("display", "none");
                }
            },
            error: function () {
                alert('Error!');
                closeloader();
                $('#myOverlay23').css("display", "none");
            }
        });
    }
    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    //function renderPagination(pageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = pageindex;
    //    totalPageRec = totdata;
    //    let paginationHtml = '';
    //    let maxVisible = 4; // Visible page numbers before ellipsis
    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (pageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtml += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#pageNumbers").html(paginationHtml);
    //    $("#prev").toggleClass("disabled", pageindex === 1);
    //    $("#next").toggleClass("disabled", pageindex === totdata);
    //    isRenderPage = true;
    //}
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


    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadtabledata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    //$(document).on("click", "#prev", function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadtabledata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    //$(document).on("click", "#next", function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadtabledata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    loadtabledata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

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
        PageNumber = setPageNo;
        isRenderPage = false;
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    $(document).on("click", "#openknowfile", function () {
        var data = $(this).attr("data-val");
        var formdata = new FormData();
        formdata.append("filepath", data);
        $.ajax({
            async: true,
            url: '/api/CallApi/Knowledgefilepath',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var parts = String(response.Data).split('/');;
                $("#loadfile").load(response.Data);
                var lastSegment = parts.pop() || parts.pop();
                var chckfileext = lastSegment.substring(lastSegment.lastIndexOf(".") + 1, lastSegment.length);
                var urlopen = '';
                if (String(chckfileext).toLowerCase() == "doc" || String(chckfileext).toLowerCase() == "docx") {
                    urlopen = "https://view.officeapps.live.com/op/view.aspx?src=" + location.protocol + "//" + location.hostname + "/" + response.Data;
                }
                else if (String(chckfileext).toLowerCase() == "ppt" || String(chckfileext).toLowerCase() == "pptx") {
                    urlopen = "https://view.officeapps.live.com/op/view.aspx?src=" + location.protocol + "//" + location.hostname + "/" + response.Data;
                }
                else if (String(chckfileext).toLowerCase() == "csv" || String(chckfileext).toLowerCase() == "xlsx" || String(chckfileext).toLowerCase() == "xls") {
                    urlopen = "https://view.officeapps.live.com/op/view.aspx?src=" + location.protocol + "//" + location.hostname + "/" + response.Data;
                }
                else if (chckfileext.toLowerCase() == "pdf") {
                    urlopen = window.origin + "/" + response.Data;
                }
                else {
                    urlopen = window.origin + "/" + response.Data;
                }
                if (chckfileext.toLowerCase() == "pdf") {
                    $('#docframe').attr('src', urlopen);
                    $('#myModal8').modal({ show: true });
                    setTimeout(function () {
                        var iframe = document.getElementById('docframe');
                        iframe.src = iframe.src;
                    }, 1000);
                }
                else {
                    $('#docframe').attr('src', urlopen);
                    $('#myModal8').modal({ show: true });
                }
            },
            error: function () {
                //  alert('Error!');
            }
        });
        function openWindow(urls, id, value) {
            var form = document.createElement('FORM');
            form.method = 'POST';
            form.action = urls;
            form.target = 'newWindow'; // Specify the name of the window(second parameter to window.open method.)
            var input = document.createElement("INPUT");
            input.id = id;
            input.name = id;
            input.type = "hidden";
            input.value = value;
            form.appendChild(input);
            document.body.appendChild(form);
            window.open("", "newWindow", "location=yes,width=600,height=600");
            //window.open("", "newWindow");
            form.submit();
        }
    });

    $(document).on("click", "#shareknowfile", function () {
        var thisvalue = $(this).attr("val");
        $("#knowfileid").val(thisvalue);
        $("#myModal23").modal();
    });
    $(document).on("click", "#myModal12", function () {
        $(".validpanel").css("display", "none");
        $('#myModal').modal({ show: true });
    });
    $(document).on("click", "#myModal123", function () {
        $(".validpanel").css("display", "none");
        //$("#fileupload")[0].reset();
        $("#attachment").val('');
        $("#directory").val("");  
        $("#title").val("");
        $("#category").val("");
        $("#author").val("");
        $("#source").val("");
        $("#desc").val("");
        $("#dDate").val("");
        $('#myModalupload').modal({ show: true });
    });
    $(document).on("click", "#sharepermission", function () {
        var tids = $(this).attr("data-val");
        $("#Vew").attr("data-val", tids);
        $("#Dwn").attr("data-val", tids);
        $("#hdn").val(tids);
        $("#Dwn").prop("checked", false);
        $("#Vew").prop("checked", false);
        $("#btnSavePermission").attr("data-val", tids);
        $("#drpuserlist").val($("#drpuserlist option:first").val());
        $('#myModalpermission').modal({ show: true });
    });
    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
    });
    var type = 9;
    /*Open loader*/
    function openload() {
        $('#myOverlay23').css("display", "block");
    }
    /*Close loader*/
    function closeloader() {
        $('#myOverlay23').css("display", "none");
    }
    var fcode = localStorage.getItem("FirmCode");
    $("#pdf").click(function () {
        var searchdatss = "";
        var pagestypes = $("#searchtype").val();
        if (pagestypes == "1") {
            searchdatss = $("#searchdatainfile").val();
        }
        window.location = encodeURI("/firm/ExportoPdfKnowledge?status=true&pagetype=" + pagestypes + "&search=" + searchdatss + "&dirtoken=" + directoryid);
    })
    LoadDirectory();
    /*Load directory details*/
    function LoadDirectory() {
        $("#directory").html('');
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        dirtoken = directoryid;
        var dirid = dirtoken;
        var formData = new FormData();
        formData.append("dirtoken", dirtoken);
        $.ajax({
            async: true,
            url: '/api/AzureApi/knowledgeDirectoryList',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    if (obj.length == 0) {
                        $("#dirdiv").hide();
                    }
                    else {
                        $("#dirdiv").show();
                    }
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    if (a.ftype == "0") {
                        var option = '<option value="' + a.tid + '" > ' + a.tfile + '</option>';
                        $("#directory").append(option);
                    }
                });
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    /*View knowledge*/
    $(document).on("click", "#transferpage12", function () {
        location.href = "/" + fcode + "/firm/Viewknowledge/0"
    });
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        $("#transferpage12").attr("data-val", transferid);
        var tflags = 0;
        var urls = "/" + fcode + "/firm/Viewknowledge/1";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid, "tflag": tflags }
        });
    });

    /*Create directory*/
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(dirname) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        dirname = String(dirname).replace(/[@\\/:*?"<>|.&$%#!~+`*^,]/g, '');
        dirname = $.trim(dirname);
        dirname = dirname.replace(/[/]+/g, '/')
        var fdirname = dirname.charAt(0);
        var ldirname = dirname.charAt(dirname.length - 1);
        if (fdirname == '/') {
            var dirname = dirname.substr(1);
        }
        if (ldirname == "/") {
            dirname = dirname.slice(0, -1);
        }
        var string = dirname;
        newString = string.replace(/([\\+])\s+/g, "");
        newString1 = newString.replace(/(\s+[\\+])/g, "");
        dirname = newString1;
        if (dirname == "") {
            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
            return false;
        }
        if (dirname.length > 25) {
            $(".validpanel").css("display", "block").html("Folder Name should be less than 26 character");
            return false;
        }
        formData.append("dname", EncodeText(dirname));
        formData.append("directoryid", EncodeText(directoryid));
        if (dirname != "") {
            openload();
            $.ajax({
                async: true,
                url: '/api/WorkFlowNewApi/CreatefileDirectory',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#foldercreate")[0].reset();
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create folder for other users directory");
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        if (datas.length == 58) {
                            $(".validpanel").css("display", "none");
                            loadtabledata(pageindex);
                            LoadDirectory();
                            $('#myModal').modal('hide');
                            new PNotify({
                                title: 'Success!',
                                text: ' Folder Created Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (datas.length == 61) {
                            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
                            closeload();
                        }
                        else if (datas.length == 76) {
                            $(".validpanel").css("display", "block").html("Folder Already Exist");
                            closeload();
                        }
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });

    /*Load progress bar*/
    function LoadProgressBar(result) {
        var progressbar = $("#progressbar-5");
        var progressLabel = $(".progress-label");
        progressbar.show();
        $("#progressbar-5").progressbar({
            value: 37,
            change: function () {
                progressLabel.text(
                    progressbar.progressbar("value") + "%");  // Showing the progress increment value in progress bar  
            },
            complete: function () {
                progressLabel.text("Loading Completed!");
                progressbar.progressbar("value", 0);  //Reinitialize the progress bar value 0  
                progressLabel.text("");
                progressbar.hide(); //Hiding the progress bar  
                var markup = "<tr><td>" + result + "</td><td><a href='#' onclick='DeleteFile(\"" + result + "\")'><span class='glyphicon glyphicon-remove red'></span></a></td></tr>"; // Binding the file name  
                $("#ListofFiles tbody").append(markup);
                $('#Files').val('');
                $('#FileBrowse').find("*").prop("disabled", false);
            }
        });
        function progress() {
            var val = progressbar.progressbar("value") || 0;
            progressbar.progressbar("value", val + 1);
            if (val < 99) {
                setTimeout(progress, 25);
            }
        }
        setTimeout(progress, 100);
    }

    /*Create files*/
    var uploadprogressflag = false;
    $("#createfiles").click(function () {
        var dname = $("#directory").val();
        if (dname == "" && directoryid == 0) {
            dname = dname;
        }
        else if (dname == "" && directoryid != 0) {
            dname = directoryid;
        }
        var filedetails = $("#desc").val();
        var title = $("#title").val();
        var category = $("#category").val();
        var author = $("#author").val();
        var source = $("#source").val();
        var date = $("#dDate").val();
        if (title == "") {
            alert("Please enter a title.");
            $("#title").focus();
            return false;
        }
        var formData = new FormData();
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var tempsize = 0;
            var tottempsize = 0;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                var filename = file.name;
                //validate filechracter
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are  not allowed.');
                    return false;
                }
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                var Extresponse = checkfileext(filename);
                if (String(Extresponse) == "false") {
                    return false;
                }
                formData.append("FileUpload", file);
                try {
                    if (typeof (file) != "undefined") {
                        size = parseFloat(file.size / 1024).toFixed(2);
                        tottempsize = parseFloat(tottempsize) + parseFloat(size);
                        tempsize = parseFloat(size);
                    }
                }
                catch (err) {
                    //alert(err.message);
                }
                tempsize = tempsize.toFixed(2);
                if (tempsize > filesize) {
                    new PNotify({
                        title: 'Warning!',
                        text: Filesizelabel,
                        type: 'error',
                        delay: 3000
                    });
                    return false
                }
            }
            formData.append("title", EncodeText(title));
            formData.append("dirname", EncodeText(dname));
            formData.append("desc", EncodeText(filedetails));
            formData.append("category", EncodeText(category));
            formData.append("author", EncodeText(author));
            formData.append("source", EncodeText(source));
            formData.append("date", EncodeText(date));
            var randomeno = Math.floor(Math.random() * 30) + 1;
            $("#progressBarstatus").show();
            $(".progress").show();
            $.ajax({
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            var percent = Math.round((e.loaded / e.total) * 100);
                            $('#progressBar').attr('aria-valuenow', percent - randomeno).css('width', percent - randomeno + '%').text(percent - randomeno + '%');
                        }
                    });
                    return xhr;
                },
                url: '/api/WorkFlowNewApi/Createknowledgefile',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $('#attachment').find("*").prop("disabled", true);
                    uploadprogressflag = false;
                    $(".progress").show();
                    $("#fileupload")[0].reset();
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create file for other users directory");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "unauthoriseuser") {
                        alert("You can not upload document to other user folder");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        $('#progressBar').attr('aria-valuenow', 100).css('width', 100 + '%').text(100 + '%');
                        $("#dirbound").html('');
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        loadtabledata(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' File Uploaded Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#myModalupload').modal('hide');
                        closeload();
                        $("#list").text("");
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    closeload();
                    alert('Error!');
                }
            });
        }
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedIDSync = new Array();
    $(document).on("click", "#syncrqst", function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    var vdata = $(this).attr("data-val");
                    selectedIDSync.push(vdata);
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("knowledge"));
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data sync request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            loadtabledata(pageindex);
                        }
                        else {
                        }
                    },
                    error: function () {
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to sync?',
                    type: 'error',
                    delay: 3000
                });
            }
        }
    });
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    try {
        $("#sharedocs").click(function () {
            var formdata1 = new FormData();
            var emailto = $("#shareemail").val();
            var token = $("#knowfileid").val();
            if (emailto == "") {
                alert("Please enter the E-mail Id.");
                return false;
            }
            else {
                if (emailto != "") {
                    var emailArray = emailto.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            vEmails = "true";
                        } else {
                            vEmails = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid email format!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
            }
            if (vEmails == "" || vEmails == "true") {
                formdata1.append("email", EncodeText(emailto));
                formdata1.append("token", token);
                $.ajax({
                    async: true,
                    url: '/firm/SendKnowledgefile',
                    data: formdata1,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        new PNotify({
                            title: 'Success!',
                            text: 'Document has been sent Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#shareemail").val("");
                        //closeload();
                    },
                    error: function () {
                        alert('Error!');
                        //closeload();
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
        closeload();
    }

    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        // alert(search);
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    //load table data
    function hideEmptyCols(table) {
        //  alert(table);
        //counti # of columns
        var numCols = $("th", table).length;
        //   alert(numCols);
        for (var i = 1; i <= 24; i++) {
            var empty = true;
            //grab all the <td>'s of the column at i
            $("td:nth-child(" + i + ")", table).each(function (index, el) {
                //check if the <span> of this <td> is empty
                if ($("span", el).text() != "") {
                    empty = false;
                    return false; //break out of each() early
                }
            });
            if (empty) {
                //if()
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
                // $("th:nth-child(" + i + ")", table).hide(); //hide header <th>
            }
        }
    }
    var q = 2;
    loadmenu();
    /*Load menu*/
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/Demo/SpColMaps1',
            headers: {
                'fid': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                var options = [];
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $("#example tr td").each(function () {
        //  alert("gi");
    });

    function sortTable(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("example");
        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc";
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 0; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /*check if the two rows should switch place,
                based on the direction, asc or desc:*/
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                //Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /*If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again.*/
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }
    loadUser();
    /*Load user*/
    function loadUser() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                var option1 = "<option value=\"\" >- Select Any -</option>";
                $("#drpuserlist").append(option1);
                $.each(obj, function (i, a) {
                    if (a.Id != userid) {
                        var option = '<option value="' + a["Id"] + '" > ' + a["UserName"] + '</option>';
                        $("#drpuserlist").append(option);
                    }
                });
                //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*User Knowledge Permission*/
    $("#drpuserlist").change(function () {
        var strid = $("#hdn").val();
        var struser = $("#drpuserlist").val();
        if (struser != "") {
            $.ajax({
                async: true,
                url: '/api/WorkFlowNewApi/UserKnowledgePermission',
                headers: { id: strid, Userid: struser },
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#Dwn").prop("checked", false);
                    $("#Vew").prop("checked", false);
                    var obj1 = JSON.parse(response.Data);
                    $.each(obj1, function (i, a) {
                        if (obj1.DownloadRight == 1) {
                            $("#Dwn").prop("checked", true);
                        }
                        else {
                            $("#Dwn").prop("checked", false);
                        }
                        if (obj1.ViewRight == 1) {
                            $("#Vew").prop("checked", true);
                        }
                        else {
                            $("#Vew").prop("checked", false);
                        }
                    });
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
        else {
            document.getElementById(str).checked = false;
            alert("Please select User");
            return false;
        }
    });
    //$("#Vew").change(function () {
    //    var strid = $(this).attr("data-val");
    //    var strright = "0";
    //    var str = "Vew"
    //    var str1 = "Dwn"
    //    var strchkval = $('input[name=' + str + ']').is(':checked');
    //    if (strchkval) {
    //        strright = "1";
    //    }
    //    else {
    //        strright = "0";
    //    }
    //    var strchkval1 = $('input[name=' + str1 + ']').is(':checked');
    //    if (strchkval1) {
    //        strright1 = "1";
    //    }
    //    else {
    //        strright1 = "0";
    //    }
    //    var struser = $("#drpuserlist").val();
    //    if (struser != "") {
    //        $.ajax({
    //            async: true,
    //            url: '/api/WorkFlowNewApi/KnowledgePermission',
    //            headers: { id: strid, chkView: strright, chkDwn: strright1, Userid: struser },
    //            contentType: false,
    //            processData: false,
    //            type: 'POST',
    //            success: function (response) {
    //                $("#fileupload")[0].reset();
    //                if (response.Status == true) {
    //                    var datas = JSON.stringify(response);
    //                    new PNotify({
    //                        title: 'Success!',
    //                        text: 'Updated Successfully',
    //                        type: 'success',
    //                        delay: 3000
    //                    });
    //                }
    //                else {
    //                    alert("not found");
    //                }
    //            },
    //            error: function () {
    //                alert('Error!');
    //            }
    //        });
    //    }
    //    else {
    //        document.getElementById(str).checked = false;
    //        alert("Please select User");
    //        return false;
    //    }
    //});
    //$("#Dwn").change(function () {
    //    var strid = $(this).attr("data-val");
    //    var strright = "0";
    //    var str = "Dwn";
    //    strchkval = $('input[name=' + str + ']').is(':checked');
    //    if (strchkval) {
    //        strright = "1";
    //    }
    //    else {
    //        strright = "0";
    //    }
    //    var str1 = "Vew";
    //    var strchkval1 = $('input[name=' + str1 + ']').is(':checked');
    //    if (strchkval1) {
    //        strright1 = "1";
    //    }
    //    else {
    //        strright1 = "0";
    //    }
    //    var struser = $("#drpuserlist").val();
    //    if (struser != "") {
    //        $.ajax({
    //            async: true,
    //            url: '/api/WorkFlowNewApi/KnowledgeDwnPermission',
    //            headers: { id: strid, chkDwn: strright, chkView: strright1, Userid: struser },
    //            contentType: false,
    //            processData: false,
    //            type: 'POST',
    //            success: function (response) {
    //                $("#fileupload")[0].reset();
    //                if (response.Status == true) {
    //                    var datas = JSON.stringify(response);
    //                    new PNotify({
    //                        title: 'Success!',
    //                        text: 'Updated Successfully',
    //                        type: 'success',
    //                        delay: 3000
    //                    });
    //                }
    //                else {
    //                    alert("not found");
    //                }
    //            },
    //            error: function () {
    //                alert('Error!');
    //            }
    //        });
    //    }
    //    else {
    //        document.getElementById(str).checked = false;
    //        alert("Please select User");
    //        return false;
    //    }
    //});
    $(document).on("click", "#btnSavePermission", function () {
        var tids = $(this).attr("data-val");
        SavePermission(tids);
    });
    function SavePermission(tids) {
        var strid = tids;//$(this).attr("data-val");
        var strright = "0";
        var str = "Vew"
        var str1 = "Dwn"
        var strchkval = $('input[name=' + str + ']').is(':checked');
        if (strchkval) {
            strright = "1";
        }
        else {
            strright = "0";
        }
        var strchkval1 = $('input[name=' + str1 + ']').is(':checked');
        if (strchkval1) {
            strright1 = "1";
        }
        else {
            strright1 = "0";
        }
        if (!strchkval && !strchkval1) {
            new PNotify({
                title: 'Info!',
                text: 'Please checked atleast one',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        var struser = $("#drpuserlist").val();
        if (struser != "") {
            $.ajax({
                async: true,
                url: '/api/WorkFlowNewApi/KnowledgePermission',
                headers: { id: strid, chkView: strright, chkDwn: strright1, Userid: struser },
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#fileupload")[0].reset();
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        new PNotify({
                            title: 'Success!',
                            text: 'Updated Successfully',
                            type: 'success',
                            delay: 3000
                        });
                    }
                    else {
                        //alert("not found");
                        new PNotify({
                            title: 'Info!',
                            text: 'No data found',
                            type: 'warning',
                            delay: 3000
                        });
                    }
                    $("#myModalpermission").modal("hide");
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
        else {
            document.getElementById(str).checked = false;
            alert("Please select User");
            return false;
        }
    }
});
/*Mark as Fav*/
function MarkFav(strid, strchkval) {
    var strright = "0";
    var strchkval = $('input[name=' + strid + ']').is(':checked');
    if (strchkval) {
        strright = "1";
    }
    else {
        strright = "0";
    }
    $.ajax({
        async: true,
        url: '/api/WorkFlowNewApi/MarkFavourite',
        headers: { id: strid, fav: strright },
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            $("#fileupload")[0].reset();
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                if (strright == "1") {
                    new PNotify({
                        title: 'Success!',
                        text: 'Marked Favourite successfully',
                        type: 'success',
                        delay: 3000
                    });
                }
                else {
                    new PNotify({
                        title: 'Success!',
                        text: 'Unmarked successfully',
                        type: 'success',
                        delay: 3000
                    });
                }
            }
            else {
                alert("not found");
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}
/*Mark as delete*/
function MarkDelete(strid, strchkval) {
    var result = confirm("Are you sure you want to delete this item?");
    if (result) {
        $.ajax({
            async: true,
            url: '/api/WorkFlowNewApi/MarkDelete',
            headers: { id: strid },
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                $("#fileupload")[0].reset();
                if (response.Status == true) {
                    if (response.Data == "false") {
                        new PNotify({
                            title: 'info!',
                            text: 'Folder cannot be removed. It has some folders or files',
                            type: 'error',
                            delay: 4000
                        });
                    }
                    else {
                        $("#dirbound").html('');
                        loadtabledata(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: 'Removed Successfully',
                            type: 'success',
                            delay: 3000
                        });
                    }
                }
                else {
                    alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        document.getElementById("btnback").click();
    }
    else {
        $("input[name='" + strid + "']:checkbox").prop('checked', false);
    }
    loadtabledata(pageindex);
}

let selectedFiles = [];
$(document).on('change', '#attachment', function (e) {
    selectedFiles = [];
    var fileCount = this.files.length;
    if (fileCount > 0) {
        $("#dropContainer").attr("title", "Document Attached");
    }
    else {
        $("#dropContainer").attr("title", "upload Attachment");
    }

    const files = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...files];
    displayDocsFiles();
});

$(document).on('click', '.remove-file', function () {
    const index = $(this).data('index');
    selectedFiles.splice(index, 1);
    displayDocsFiles();
});

function displayDocsFiles() {
    const fileList = $('#fileListDocs');
    fileList.empty();
    const fCount = selectedFiles.length;
    selectedFiles.slice(0, 5).forEach((file, index) => {
        const fileItem = $(`
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="remove-file" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
        fileList.append(fileItem);
    });
    if (fCount > 5) {
        const remaining = fCount - 5;
        fileList.append(`
            <div class="file-summary" style="margin-top:5px;color:#555;">
                +${remaining} more (Total ${fCount} files selected)
            </div>
        `);
    }
    updateDocsFileInput();
}

function updateDocsFileInput() {
    const dt = new DataTransfer();
    selectedFiles.forEach(file => dt.items.add(file));
    document.getElementById('attachment').files = dt.files;
}

function clearDocsUpload() {
    selectedFiles = [];
    const fileInput = document.getElementById("attachment");
    if (fileInput) fileInput.value = "";
    $('#fileListDocs').empty();
    $("#dropContainer").attr("title", "Upload Attachment");
}
$(document).on('click', '#resercreatefiles', function () {
    clearDocsUpload();
    $('#myModalupload').modal('hide');
});
$(document).on('click', '#closeDocsUploadBtn', function () {
    clearDocsUpload();
    $('#myModalupload').modal('hide');
});