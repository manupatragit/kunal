$(document).ready(function () {
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var cpageindex = 1, cpagesize = 10, crecordcount = 0, ctotrecord = 0;
    var opageindex = 1, opagesize = 10, orecordcount = 0, ototrecord = 0;
    var alpageindex = 1, alpagesize = 10, alrecordcount = 0, altotrecord = 0;
    var cpageindexcom = 1, cpagesizecom = 10, recordcountcom = 0, totrecordcom = 0;
    var Clientlistctype = "Client";
    var ClientlistctypeValue = "0f0acc92-5a81-4772-8423-b5468297df43";
    var setIsComorindividual = ''; 
    openload();
    $("#Propectdiv").css("display", "none");
    $("#clientdiv").css("display", "none");
    $("#otherdiv").css("display", "none");
    //$("#allcontactsdiv").css("display", "block");
    setTimeout(function () {
        //$("#Clistctype option:contains(" + Type + ")").attr('selected', 'selected');
        //allloadtabledata();
        setIsComorindividual = '';
        $("#clientdiv").css("display", "block");
        cloadtabledata();
    }, 2000);

    //if (Type == "Prospect") {
    //    $("#Propectdiv").css("display", "block");
    //    $("#clientdiv").css("display", "none");
    //    $("#otherdiv").css("display", "none");
    //    $("#allcontactsdiv").css("display", "none");
    //    setTimeout(function () {
    //        $("#Clistctype option:contains(" + Type + ")").attr('selected', 'selected');
    //        ploadtabledata();
    //    }, 2000);
    //}
    //else if (Type == "Client") {
    //    $("#Propectdiv").css("display", "none");
    //    $("#clientdiv").css("display", "block");
    //    $("#otherdiv").css("display", "none");
    //    $("#allcontactsdiv").css("display", "none");
    //    setTimeout(function () {
    //        $("#Clistctype option:contains(" + Type + ")").attr('selected', 'selected');
    //        cloadtabledata();
    //    }, 2000);
    //}
    //else if (Type == "All") {
    //    $("#Propectdiv").css("display", "none");
    //    $("#clientdiv").css("display", "none");
    //    $("#otherdiv").css("display", "none");
    //    $("#allcontactsdiv").css("display", "block");
    //    setTimeout(function () {
    //        $("#Clistctype option:contains(" + Type + ")").attr('selected', 'selected');
    //        allloadtabledata();
    //    }, 2000);
    //}
    //else {
    //    $("#Propectdiv").css("display", "none");
    //    $("#clientdiv").css("display", "none");
    //    $("#otherdiv").css("display", "block");
    //    $("#allcontactsdiv").css("display", "none");
    //    setTimeout(function () {
    //        $("#Clistctype option:contains(" + Type + ")").attr('selected', 'selected');
    //        oloadtabledata();
    //    }, 2000);
    //}
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=Lead&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });

    /*Export to excel*/
    var cexportfilter = false;
    $("#ocallexcel").click(function () {
        var chkArray3 = [];
        var selected = $("#odal input[type='checkbox']:checked");
        var category = setIsComorindividual;
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var searchdata = $('#searchdata').val();
        var pagetype = ClientlistctypeValue;//$('#Clistctype').val();
        window.location = encodeURI("/firm/ExportoExcelAllClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter + "&pagetype=" + pagetype + "&exportcolumn=" + selected3 + "&CFieldtype=" + ModuleType + "&category=" + category);
    })
    /*Export to pdf*/
    $("#ocallpdf").click(function () {
        var searchdata = $('#searchdata').val();
        var pagetype = ClientlistctypeValue;//$('#Clistctype').val();
        var category = setIsComorindividual;
        window.location = encodeURI("/firm/ExportoPdfAllClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter + "&pagetype=" + pagetype + "&category=" + category);
    })
    //setInterval(function () {
    //    var tempcases = localStorage.getItem("shortcontact");
    //    var lists2 = Clientlistctype;//$("#Clistctype option:selected").text();

    //    if (tempcases != "") {
    //        if (lists2 == "Prospect") {
    //            $("#Propectdiv").css("display", "block");
    //            $("#clientdiv").css("display", "none");
    //            $("#otherdiv").css("display", "none");
    //            $("#allcontactsdiv").css("display", "none");
    //            ploadtabledata();
    //        }
    //        else if (lists2 == "Client") {
    //            $("#Propectdiv").css("display", "none");
    //            $("#clientdiv").css("display", "block");
    //            $("#otherdiv").css("display", "none");
    //            $("#allcontactsdiv").css("display", "none");
    //            cloadtabledata();
    //        }
    //        else if (lists2 == "All") {
    //            $("#Propectdiv").css("display", "none");
    //            $("#clientdiv").css("display", "none");
    //            $("#otherdiv").css("display", "none");
    //            $("#allcontactsdiv").css("display", "block");
    //            allloadtabledata();
    //        }
    //        else {
    //            $("#Propectdiv").css("display", "none");
    //            $("#clientdiv").css("display", "none");
    //            $("#otherdiv").css("display", "block");
    //            $("#allcontactsdiv").css("display", "none");
    //            oloadtabledata();
    //        }
    //        localStorage.setItem("shortcontact", "");
    //    }
    //}, 2000);

    /*Remove special character*/
    function specialcharecterpass(str) {
        var strretrn = "0";
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");
                document.getElementById("clnpassword").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    function specialcharectercpass(str) {
        var strretrn = "0";
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");
                document.getElementById("clcpassword").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    function specialcharecter() {
        var strretrn = "0";
        var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
        var data = document.getElementById("clusername").value;
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert("Special characters and spaces are not allowed in the User Id.");
                document.getElementById("clusername").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }

    /*Create client login*/
    $(document).on("click", "#CreateClientlogin", function () {
        var token = $(this).attr("data-val");
        $("#cltoken").val(token);
        $("#frmpass")[0].reset();
        $('#myModalccc').modal({ show: true });
    });

    /*Create company details*/
    var tokenDetail = "";
    $(document).on("click", "#companydetails", function () {
        isExamRnd = false;
        var token = $(this).attr("data-id");
        tokenDetail = token;
        var name = $(this).attr("name");
        $('#companyname').text(name);
        $("#cltokencompany").val(token);
        $("#companys").val(name);
        $("#frmcompanydetails")[0].reset();
        var $ctable = '';
        var $cheader = '';
        var $chead1 = '';
        var cdt = '';
        var cq1 = 2;
        var csort = 10;
        $ctable = $('<table id="cexample"   class="table-panel" style="overflow-x:auto;" /><tr><th>').addClass('table-panel');
        $cheader = $('<thead>').html('');
        $chead1 += '<th ><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
        $chead1 += '<th  onclick="sortTable(3)" class="cityc"><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th class="cufnamec" onclick = "sortTable(4)" width = "20%" > <div class="thbg">First Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th class="clnamec" onclick = "sortTable(5)" width = "20%" ><div class="thbg"> Last Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th  class="mobnoc"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
        $chead1 += '<th  class="ccemailc"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
        $chead1 += '<th onclick="sortTable(8)" class="useridc"><div class="thbg"><span style="padding-right: 20px !important;">UserId</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th onclick="sortTable(9)" class="cstatusc" style="min-width: 120px;"><div class="thbg"><span style="padding-right: 10px !important;">Status</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(10)" class="createdbyc"><div class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(11)" ><div class="thbg">Action</div></th>';
        $chead1 += '<th onclick ="sortTable(12)" class="ContactTypec" width = "12%"  > <div class="thbg"><span style="padding-right: 10px !important;">Contact Type</span> <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(13)" class="landlinec"><div class="thbg"><span style="padding-right: 20px !important;">Landline</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(14)" class="cadd1c"><div class="thbg"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th   onclick="sortTable(15)" class="designationc"><div class="thbg"><span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(16)" class="countryc"><div class="thbg"><span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th onclick="sortTable(17)" class="statec"><div class="thbg"><span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(18)" class="pinc"><div class="thbg"><span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  class="GSTNoc"><div class="thbg"><span style="padding-right: 10px !important;">GSTNo</span></div></th >';
        $chead1 += '<th  class="PANNoc"><div class="thbg"><span style="padding-right: 10px !important;">PANNo</span></div></th >';
        $chead1 += '<th  class="AadharNoc"><div class="thbg"><span style="padding-right: 10px !important;">AadharNo</span></div></th >';
        $chead1 += '<th  class="CompanyStructurec"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
        $chead1 += '<th   class="clientdocsc"><div class="thbg"><span style="padding-right: 10px !important;">Documents</span></div></th >';
        $cheader.append($chead1);
        $cheader.append('</thead>');
        $ctable.append($cheader);
        $ctable.append('<tbody style="clear:both" id="cloadactivitydatasforcomapny">');
        $('#cupdatePanelforcompany').html($ctable);
        cloadcontactlistforcompany(cpageindexcom, token);
        $('#myModalcompanydetails').modal({ show: true });
    });
    $("#chngclpwd").click(function () {
        var password = $("#clnpassword").val();
        var confirmPassword = $("#clcpassword").val();
        var username = $("#clusername").val();
        if (username == "") {
            alert("Please enter User Id");
            document.getElementById("clusername").focus();
            return false;
        }
        if (username.length < 5) {
            $('#useriderror').text('User id should be more than or equal to five characters.');
            document.getElementById("clusername").focus();
            return false;
        }
        if (specialcharecter() == "1") {
            return false;
        }
        if (password == "") {
            alert("Please set the password for the User Id.");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if (password.length < 8) {
            alert("Password must contain at least eight characters.");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if ($("#clnpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#clnpassword").val()) == false) {
                alert("Password must contain at least eight characters, with at least one character in uppercase, one in lowercase and one special character (any one from @#$*!^_).");
                document.getElementById("clnpassword").focus();
                return false;
            }
        }
        if (specialcharecterpass($("#clnpassword")) == "1") {
            return false;
        }
        if (confirmPassword == "") {
            alert("Please confirm your password that you want to set.");
            document.getElementById("clcpassword").focus();
            return false;
        }
        if (confirmPassword.length < 8) {
            alert("Confirm Password must contain at least eight characters.");
            document.getElementById("clcpassword").focus();
            return false;
        }
        if ($("#clcpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#clcpassword").val()) == false) {
                alert("Confirm Password must contain at least eight characters, with at least one character in uppercase, one in lowercase and one special character (any one from @#$*!^_).");
                document.getElementById("clcpassword").focus();
                return false;
            }
        }
        if (specialcharectercpass($("#clcpassword")) == "1") {
            return false;
        }
        if (password != confirmPassword) {
            alert("Password did not match!");
        }
        else {
            var formData = new FormData();
            formData.append("userid", EncodeText(username));
            formData.append("cpassword", EncodeText(confirmPassword));
            formData.append("token", EncodeText($("#cltoken").val()));
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/CallApi/CreateClientLogin", // Controller/View
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (String(data.Data) == "ExistUserID") {
                            alert('User id already exists. Please try different user id');
                            closeload();
                            return false;
                        }
                        else if (String(data.Data) == "user exceed limit") {
                            alert("You have reached your License limit. Please upgrade your subscription Plan.")
                            closeload();
                        }
                        else {
                            $("#frmpass")[0].reset();
                            alert("Client credentials have been created successfully.");
                            document.getElementById("closemodel").click();
                            cloadcontactlist(cpageindex);
                            closeload();
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
    });

    /*Edit contact*/
    $(document).on("click", "#transferpage", function () {
        var type = $(this).attr("data-type");
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/EditContacts";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token, "type": type }
        });
    });

    /*Client case list*/
    $(document).on("click", "#transferpagetocase", function () {
      
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });

    /*Export contact in excel*/
    var exportfilter = false;
    $("#excel").click(function () {
        var chkArray3 = [];
        var selected = $("#bd input[type='checkbox']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var searchdata = $('#searchdata').val();
        var cltypes = ClientlistctypeValue;//$("#Clistctype").val();
        var category = setIsComorindividual;
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        cltypes = Clientlistctype;//$("#Clistctype option:selected").text();
        window.location = encodeURI("/firm/ExportoExcelContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes + "&exportcolumn=" + selected3 + "&CFieldtype=" + ModuleType + "&category=" + category);
    })

    /*Export contact in pdf*/
    $("#pdf").click(function () {
        var searchdata = $('#searchdata').val();
        var cltypes = ClientlistctypeValue;//$("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        var category = setIsComorindividual;
        window.location = encodeURI("/firm/ExportoPdfContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes + "&category=" + category);
    })
    $("#oexcel").click(function () {
        var chkArray3 = [];
        var selected = $("#od input[type='checkbox']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var searchdata = $('#searchdata').val();
        var cltypes = ClientlistctypeValue;//$("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        var category = setIsComorindividual;
        window.location = encodeURI("/firm/ExportoExcelContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes + "&exportcolumn=" + selected3 + "&CFieldtype=" + ModuleType + "&category=" + category);
    })
    $("#opdf").click(function () {
        var searchdata = $('#searchdata').val();
        var cltypes = ClientlistctypeValue;//$("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        var category = setIsComorindividual;
        window.location = encodeURI("/firm/ExportoPdfContacts?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&exporttype=" + cltypes + "&category=" + category);
    })

    $(document).on('click', '#allContacttab', function () {
        //$('#allContacttab').addClass('active');
        document.getElementById("allContacttab").classList.add("Active");
        document.getElementById("CompanyContab").classList.remove("Active");
        document.getElementById("IndContacttab").classList.remove("Active");

        isRenderPage = false;
        setIsComorindividual = '';
        cloadcontactlist(1);
        //alladcontactlist(1);
        //allloadtabledata();
    });
    $(document).on('click', '#CompanyContab', function () {
        document.getElementById("allContacttab").classList.remove("Active");
        document.getElementById("CompanyContab").classList.add("Active");
        document.getElementById("IndContacttab").classList.remove("Active");
        isRenderPage = false;
        setIsComorindividual = '1';
        cloadcontactlist(1);
        //allloadtabledata();
        //alladcontactlist(1);
    });
    $(document).on('click', '#IndContacttab', function () {
        document.getElementById("allContacttab").classList.remove("Active");
        document.getElementById("CompanyContab").classList.remove("Active");
        document.getElementById("IndContacttab").classList.add("Active");
        isRenderPage = false;
        setIsComorindividual = '0';
        cloadcontactlist(1);
        //allloadtabledata();
        //alladcontactlist(1);
    });
    $("#ColumnSelectionopen").click(function () {
        $('#myModalCustomizedcolumn').modal({ show: true });
    });

    $("#iscomorindividual").change(function () {
        $("#searchdatas").click();
    });
    //$("#Clistctype").change(function () {
    //    $("#searchdata").val("");
    //    var lists = $("#Clistctype option:selected").text();
    //    if (lists == "") {
    //        $("#Propectdiv").css("display", "none");
    //        $("#clientdiv").css("display", "none");
    //        $("#otherdiv").css("display", "none");
    //        $("#allcontactsdiv").css("display", "none");
    //    }
    //    else if (lists == "Prospect") {
    //        $("#Propectdiv").css("display", "block");
    //        $("#clientdiv").css("display", "none");
    //        $("#otherdiv").css("display", "none");
    //        $("#allcontactsdiv").css("display", "none");
    //        ploadtabledata();
    //    }
    //    else if (lists == "Client") {
    //        $("#Propectdiv").css("display", "none");
    //        $("#clientdiv").css("display", "block");
    //        $("#otherdiv").css("display", "none");
    //        $("#allcontactsdiv").css("display", "none");
    //        cloadtabledata();
    //    }
    //    else if (lists == "All") {
    //        $("#Propectdiv").css("display", "none");
    //        $("#clientdiv").css("display", "none");
    //        $("#otherdiv").css("display", "none");
    //        $("#allcontactsdiv").css("display", "block");
    //        allloadtabledata();
    //    }
    //    else {
    //        $("#Propectdiv").css("display", "none");
    //        $("#clientdiv").css("display", "none");
    //        $("#otherdiv").css("display", "block");
    //        $("#allcontactsdiv").css("display", "none");
    //        oloadtabledata();
    //    }
    //});
    var chksflag = true;
    /*Clear for new search*/
    $("#clearnewseach").click(function () {
        isRenderPage = false;
        $("#searchdata").val("");
        $("#clearnewseach").css("display", "none");
        //if ($("#Clistctype option:selected").text() == "Client") {
        //    exportfilter = true;
        //    cloadtabledata(1);
        //}
        //else if ($("#Clistctype option:selected").text() == "Prospect") {
        //    ploadtabledata(1);
        //}
        //else if ($("#Clistctype option:selected").text() == "All") {
        //    alladcontactlist(1)
        //}
        //else {
        //    oloadtabledata(1);
        //}
        cloadcontactlist(1);
        chksflag = true;
    })
    $("#searchdatas").click(function () {
        isRenderPage = false;
        $("#clearnewseach").css("display", "unset");
        exportfilter = true;
        cloadtabledata(1);
        //if ($("#Clistctype option:selected").text() == "Client") {
        //    exportfilter = true;
        //    cloadtabledata(1);
        //}
        //else if ($("#Clistctype option:selected").text() == "Prospect") {
        //    ploadtabledata(1);
        //}
        //else if ($("#Clistctype option:selected").text() == "All") {
        //    alladcontactlist(1)
        //}
        //else {
        //    oloadtabledata(1);
        //}
        chksflag = true;
    });

    /*Search data on keyup*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            cloadtabledata(1);
            cexportfilter = false;

            //if (chksflag == true) {
            //    if ($("#Clistctype option:selected").text() == "Client") {
            //        cloadtabledata(1);
            //        cexportfilter = false;
            //    }
            //    else if ($("#Clistctype option:selected").text() == "Prospect") {
            //        ploadtabledata(1);
            //    }
            //    else {
            //        oloadtabledata(1);
            //    }
            //    chksflag = false;
            //}
        }
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    ////////////////Start Propect///////////// 
    $(document).on('click', '#pgetdatabypagenum', function () {
        ppageindex = $("#ppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadcontactlist(ppageindex);
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
    var chksflag = true;
    $(document).on('click', '#ppaginate', function () {
        ppageindex = $(this).attr("index");
        loadcontactlist(ppageindex);
    });

    /*Load custom data*/
    //function ploadtabledata() {
    //    var $table = '';
    //    var $header = '';
    //    var $head1 = '';
    //    var dt = '';
    //    var q1 = 2;
    //    var sort = 18;
    //    $table = $('<table id="pexample"  class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
    //    var rt1 = $.ajax({
    //        async: true,
    //        type: 'POST',
    //        url: '/api/demo/FirmEmployeescreate1',
    //        headers: {
    //            'configurationtype': 11
    //        },
    //        contentType: "application/json; charset=utf-8",
    //        dataType: 'json',
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //                var obj = JSON.parse(response.Data);
    //                countcustomfoeld = obj.length;
    //                $header = $('<thead>').html('');
    //                $head1 += '<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
    //                $head1 += '<th  onclick="psortTable(1)" class="pcompanyname iscompanyindicidualclass"><div style="min-width: 140px" class="thbg"><span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort "></span></div></th >';
    //                $head1 += '<th  onclick="psortTable(2)" class="pcity"><div style="min-width: 80px" class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort "></span></div></th >';
    //                $head1 += '<th class="pfname" onclick = "psortTable(3)" width = "20%" ><div style="min-width: 100px" class="thbg"> First Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $head1 += '<th class="plname" onclick = "psortTable(4)" width = "20%" ><div style="min-width: 100px" class="thbg"> Last Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $head1 += '<th  class="pmobno"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
    //                $head1 += '<th  class="pcemail"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
    //                $head1 += '<th onclick="psortTable(7)" class="pcreatedby"><div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $head1 += '<th onclick="psortTable(8)" class="pContactType"><div style="min-width: 125px" class="thbg"><span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $head1 += '<th onclick="psortTable(9)" class="pPtype"><div style="min-width: 200px" class="thbg"><span style="padding-right: 20px !important;">Propspect Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $head1 += '<th onclick="psortTable(10)" class="psource"><div style="min-width: 200px" class="thbg"><span style="padding-right: 20px !important;">Source/Reference</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $head1 += '<th  onclick="psortTable(11)" class="pcadd1" style="min-width: 150px" ><div class="thbg"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $head1 += '<th  onclick="psortTable(12)" class="pcweb" style="min-width: 150px" ><div class="thbg"><span style="padding-right: 10px !important;">Website</span><span class="fa fa-fw fa-sort pull-right"></span></div></th> ';
    //                $head1 += '<th  onclick="psortTable(13)" class="pdesignation"><div style="min-width: 150px" class="thbg"><span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $head1 += '<th  onclick="psortTable(14)" class="pinfo"><div style="min-width: 150px" class="thbg"><span style="padding-right: 10px !important;">Add. Info</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $head1 += '<th  onclick="psortTable(15)" class="ppin"><div style="min-width: 80px" class="thbg"><span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $head1 += '<th  onclick="psortTable(16)" class="pcountry"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $head1 += '<th  style="display:none" onclick="psortTable(17)" class="pstate"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $head1 += '<th onclick="psortTable(18)" class="pcasetype"><div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Matter Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $head1 += '<th  class="Landline"><div class="thbg"><span style="padding-right: 10px !important;">LandlineNo</span></div></th >';
    //                $head1 += '<th  class="GSTNo"><div class="thbg"><span style="padding-right: 10px !important;">GSTNo</span></div></th >';
    //                $head1 += '<th  class="PANNo"><div class="thbg"><span style="padding-right: 10px !important;">PANNo</span></div></th >';
    //                $head1 += '<th  class="AadharNo"><div class="thbg"><span style="padding-right: 10px !important;">AadharNo</span></div></th >';
    //                $head1 += '<th  class="CompanyStructure"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
    //                $header.append($head1);
    //                $header.append('<th class="prospectdocs"><div class="thbg"><span style="padding-right: 10px !important;">Documents</span></div></th>');
    //                var option = "";
    //                $.each(obj, function (i, val) {
    //                    q1 = q1 + 1;
    //                    sort = sort + 1;
    //                    $header.append('<th   onclick="sortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" class="class' + q1 + '"><div class="thbg">' + val.FieldName + ' <span class="fa fa-fw fa-sort "></span></div></th>');        //option += '<li><a href="#" ><input  type="checkbox"  name="class' + q1 + '" >' + val.FieldName + ' </a></li>';
    //                });
    //                $header.append('<th width="100px;" ><div class="thbg"><span style="padding-right: 10px !important;" >Action&nbsp;&nbsp;&nbsp;</span></div></th>');
    //                $header.append('</thead>');
    //                $table.append($header);
    //                $table.append('<tbody style="clear:both" id="loadactivitydatas">');
    //                $('#pupdatePanel').html($table);
    //            }
    //            else {
    //                //  alert("not found");
    //            }
    //        },
    //        error: function () {
    //            alert('Error!');
    //        }
    //    });
    //    $.when(rt1).then(function (data, textStatus, jqXHR) {
    //        loadcontactlist(pageindex);
    //    });
    //}

    flaghide = true;
    /*Load contact list*/
    function loadcontactlist(pageindex) {
        debugger
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText($('#searchdata').val()));
        //formdata.append("type", EncodeText($('#Clistctype').val()));
        formdata.append("type", EncodeText(ClientlistctypeValue));
        formdata.append("iscomorindv", EncodeText($("#iscomorindividual").val()));
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#ptfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#pdatastatus").html("");
                }
                else {
                    $("#pdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
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
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="pgetdatabypagenum" style="margin-left:10px;">Go</button> </li>'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#ptfooter").append(tfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    } 
                    $row.append($('<td class="s" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork' style='display:none'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    $row.append($('<td class="pcompanyname iscompanyindicidualclass" />').html("<span>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcity" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pfname" />').html("<span>" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="plname" />').html("<span>" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pmobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcreatedby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pContactType" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pPtype" />').html("<span>" + (val.PropectType != null ? val.PropectType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="psource" />').html("<span>" + (val.SourceRef != null ? val.SourceRef : '<span >&nbsp;</span>')));
                    $row.append($('<td class="pcadd1" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcweb" />').html("<span>" + (val.cwebsite != null ? val.cwebsite : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pdesignation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pinfo" />').html("<span>" + (val.cnotes != null ? val.cnotes : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ppin" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcountry" />').html("<span>" + (val.Country != null ? val.Country : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pstate" />').html("<span>" + (val.State != null ? val.State : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcasetype" />').html("<span>" + (val.casetype != null ? val.casetype : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="Landline" />').html("<span>" + (val.offno != null ? val.offno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="GSTNo" />').html("<span>" + (val.GSTINNo != null ? val.GSTINNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="PANNo" />').html("<span>" + (val.PANNo != null ? val.PANNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="AadharNo" />').html("<span>" + (val.AadharCardNo != null ? val.AadharCardNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="CompanyStructure" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.DocsCount >= 1) {
                        $row.append($('<td class="prospectdocs" />').html("<span style='cursor:pointer;text-align:center;' id-val='" + val.cid + "' id='filelink'><i class='glyphicon glyphicon-folder-open'></i></span>"));
                    }
                    else {
                        $row.append($('<td class="prospectdocs" />').html(""));
                    }
                    try {
                        var countcf = countcustomfoeld;
                    }
                    catch
                    {
                    }
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    var proaction = '';
                    var proaction = '<td>';
                    if (val.oedit == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-pencil' id='transferpage' style='color:#069;cursor:postart printer;margin-right:5px;'title='Edit propsect' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "></span>&nbsp;";
                    }
                    if (val.odelete == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-trash' id='removeprospect' style='color: red; cursor: pointer; ' title='Remove propsect' id-val=" + val.cid + "></span>";
                    }
                    $row.append($('<td />').html(proaction));
                    $("#loadactivitydatas").append($row);
                });
                hideshowcompanycolumnbyfilter();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            ploadmenu();
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }

    /*Load menu*/
    var ploadcnt = 0;
    function ploadmenu() {
        if (ploadcnt == 0) {
            var qp = 2;
            $.ajax({
                async: true,
                type: "POST",
                url: '/api/demo/FirmEmployeescreate1',
                headers: {
                    // 'fid': type
                    'configurationtype': 11
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
                    $.each(obj, function (i, a) {
                        qp = qp + 1;
                        var option = '<li><input  class="chkdhide"  type="checkbox" value="' + a.FieldName + '"  name="class' + qp + '" ><a href="#" class="small" data-value="option' + qp + '" tabIndex="-1">' + a.FieldName + '</a></li>';
                        $("#bd").append(option);
                    }); //End of foreach Loop
                    ploadcnt = ploadcnt + 1;
                }, //End of AJAX Success function
                failure: function (response) {
                    alert(data.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    alert(data.responseText);
                } //End of AJAX error function
            });
        }
    }
    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    ////////////////END Propect/////////////
    ////////////////Start Client/////////////
    var fcode = localStorage.getItem("FirmCode");
    var cexportfilter = false;

    /*Export client list in excel*/
    $("#cexcel").click(function () {
        var category = setIsComorindividual;
        var chkArray3 = [];
        var selected = $("#odclient input[type='checkbox']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoExcelClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter + "&exportcolumn=" + selected3 + "&CFieldtype=" + ModuleType + "&category=" + category);
    })

    /*Export client list in pdf*/
    $("#cpdf").click(function () {
        var category = setIsComorindividual;
        var searchdata = $('#searchdata').val();
        window.location = encodeURI("/firm/ExportoPdfClientList?status=true&searchdata=" + searchdata + "&exportfilter=" + cexportfilter + "&category=" + category);
    })

    /*Email validation */
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    try {
        $("#sharedocs").click(function () {
            var formdata = new FormData();
            var emailto = $("#shareemail").val();
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
                formdata.append("email", EncodeText(emailto));
                openload();
                $.ajax({
                    async: true,
                    url: '/firm/SendContactsClientList',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        new PNotify({
                            title: 'Success!',
                            text: ' Data has been sent Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#shareemail").val("");
                        closeload();
                        document.getElementById("closesharebox").click();
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
        closeload();
    }
    var selectedID = new Array();
    /*Enable contact*/
    //$("#enable").click(function () {
    //    selectedID = [];
    //    enableclient();
        function enableclient(setSelectedId) {
            var result = confirm("Are you sure to Enable Account?");
            if (result) {
                //$('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                //    if ($(this).prop('checked')) {
                //        selectedID.push($(this).val());
                //    }
                //});
                //selectedID = setSelectedId;
                selectedID.push(setSelectedId);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/EnableClient',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                if (response.Data == "invalid user license") {
                                    alert("Invalid user login credentials. Please check the same or contact your administrator.")
                                    closeload();
                                }
                                else if (response.Data == "user exceed limit") {
                                    alert("You have reached the maximum limit of the client creation based on your plan. Please upgrade your plan for a seamless experience.")
                                    closeload();
                                }
                                else {
                                    var datas = JSON.stringify(response);
                                    new PNotify({
                                        title: 'Success!',
                                        text: '  ' + clientlable + '  Account Activated Successfully',
                                        type: 'success',
                                        delay: 3000
                                    });
                                    $('#select_all').prop('checked', false);
                                    cloadcontactlist(cpageindex);
                                    closeload();
                                }
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            alert('Error!');
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: 'You have not selected any rows to activate account.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    //});
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();

    //$(document).on("click", "#removeprospect", function () {
    //    selectedID = [];
    //    var cltypes = ClientlistctypeValue; //$("#Clistctype").val();
    //    if (cltypes == "") {
    //        alert("Please select the contact type.");
    //        return false;
    //    }
    //    var ids = $(this).attr("id-val");
    //    deletecontactsingle();
    //    //}
    //    function deletecontactsingle() {
    //        var result = confirm("Are you sure to delete contacts ?");
    //        if (result) {
    //            selectedID.push(ids);
    //            if (JSON.stringify(selectedID) != "[]") {
    //                openload();
    //                $.ajax({
    //                    async: true,
    //                    url: '/api/CallApi/RemoveContacts',
    //                    data: JSON.stringify(selectedID),
    //                    headers: {
    //                        'ctype': cltypes
    //                    },
    //                    type: 'POST',
    //                    contentType: "application/json; charset=utf-8",
    //                    dataType: 'json',
    //                    success: function (response) {
    //                        selectedID = [];
    //                        if (response.Status == true) {
    //                            var datas = JSON.stringify(response);
    //                            new PNotify({
    //                                title: 'Success!',
    //                                text: ' Contacts Removed Successfully',
    //                                type: 'success',
    //                                delay: 3000
    //                            });
    //                            $("#searchdatas").click();
    //                            closeload();
    //                        }
    //                        else {
    //                            closeload();
    //                        }
    //                    },
    //                    error: function () {
    //                        closeload();
    //                    }
    //                });
    //            }
    //            else {
    //                new PNotify({
    //                    title: 'Warning',
    //                    text: ' Please select a row to delete.',
    //                    type: 'error',
    //                    delay: 3000
    //                });
    //                closeload();
    //            }
    //        }
    //    }
    //});

    /*Remove other detail by selected id*/
    //$(document).on("click", "#removeothers", function () {
    //    selectedID = [];
    //    var cltypes = ClientlistctypeValue;//$("#Clistctype").val();
    //    if (cltypes == "") {
    //        alert("Please select the contact type.");
    //        return false;
    //    }
    //    var ids = $(this).attr("id-val");
    //    odeletecontactsingle();
    //    function odeletecontactsingle() {
    //        var result = confirm("Are you sure to delete Contacts?");
    //        if (result) {
    //            selectedID.push(ids);
    //            if (JSON.stringify(selectedID) != "[]") {
    //                openload();
    //                $.ajax({
    //                    async: true,
    //                    url: '/api/CallApi/RemoveContacts',
    //                    data: JSON.stringify(selectedID),
    //                    headers: {
    //                        'ctype': cltypes
    //                    },
    //                    type: 'POST',
    //                    contentType: "application/json; charset=utf-8",
    //                    dataType: 'json',
    //                    success: function (response) {
    //                        selectedID = [];
    //                        if (response.Status == true) {
    //                            var datas = JSON.stringify(response);
    //                            new PNotify({
    //                                title: 'Success!',
    //                                text: ' Contacts Removed Successfully',
    //                                type: 'success',
    //                                delay: 3000
    //                            });
    //                            oloadcontactlist(opageindex);
    //                            alladcontactlist(opageindex);
    //                            closeload();
    //                        }
    //                        else {
    //                            closeload();
    //                        }
    //                    },
    //                    error: function () {
    //                        closeload();
    //                    }
    //                });
    //            }
    //            else {
    //                new PNotify({
    //                    title: 'Warning',
    //                    text: ' Please select a row to delete.',
    //                    type: 'error',
    //                    delay: 3000
    //                });
    //                closeload();
    //            }
    //        }
    //    }
    //});
    var selectedID = new Array();
    $("#premove").click(function () {
        selectedID = [];
        var cltypes = ClientlistctypeValue;//$("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        deletecontact();
        function deletecontact() {
            var result = confirm("Are you sure to delete Contact?");
            if (result) {
                $('#loadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadcontactlist(pageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    $("#oremove").click(function () {
        selectedID = [];
        var cltypes = ClientlistctypeValue;//$("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        odeletecontact();
        function odeletecontact() {
            var result = confirm("Are you sure to delete Contact?");
            if (result) {
                $('#oloadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                oloadcontactlist(opageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });

    ///delete client contact
    $(document).on("click", "#removeclient", function () {
        var ids = $(this).attr("id-val");
        var comapnyIds = $(this).attr("idss");
        var formData = new FormData();
        formData.append("cids", EncodeText(ids));
        formData.append("comapnyids", EncodeText(comapnyIds));
        var result = confirm("Are you sure to delete Contacts?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                url: '/api/CallApi/Removecompanycontact',
                data: formData,
                type: 'POST',
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        new PNotify({
                            title: 'Success!',
                            text: ' Contacts Removed Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        alladcontactlist(opageindex);
                        closeload();
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    closeload();
                }
            });
        }
    });
    var selectedIDSync = new Array();
    $("#syncrqst").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("client"));
                openload();
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
                            cloadcontactlist(cpageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
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
                closeload();
            }
        }
    });
    $("#syncrqstprospect").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#loadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("contact"));
                openload();
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
                            loadcontactlist(pageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
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
                closeload();
            }
        }
    });

    /*Save Sync Row Data*/
    $("#syncrqstothers").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#oloadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("contact"));
                openload();
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
                            oloadcontactlist(opageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
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
                closeload();
            }
        }
    });
    var selectedID = new Array();
    //$("#disable").click(function () {
        //selectedID = [];
        //disableclient();

        /*Disable client*/
        function disableclient(selectedDataId) {
            var result = confirm("Are you sure to Disable Account?");
            if (result) {
                //$('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                //    if ($(this).prop('checked')) {
                //        selectedID.push($(this).val());
                //    }
                //});
                selectedID.push(selectedDataId);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/DisableClient',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: '  ' + clientlable + '  Account De-activated  Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                cloadcontactlist(cpageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: 'You have not selected any rows to de-activate account.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    //});

    /*Get data by page number*/
    $(document).on('click', '#cgetdatabypagenum', function () {
        cpageindex = $("#cpagnumvalue").val();
        if (cpageindex != "undefined") {
            if (Math.sign(cpageindex) == 1) {
                var cpageindesx = $("#csotopage").text();
                if (cpageindex <= parseInt(cpageindesx)) {
                    openload();
                    cloadcontactlist(cpageindex);
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
    $(document).on('click', '#cgetdatabypagenumforcompany', function () {
        cpageindex = $("#cpagnumvalue").val();
        if (cpageindex != "undefined") {
            if (Math.sign(cpageindex) == 1) {
                var cpageindesx = $("#csotopage").text();
                if (cpageindex <= parseInt(cpageindesx)) {
                    openload();
                    var token = $("#cltokencompany").val();
                    cloadcontactlistforcompany(cpageindex, token);
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
    var chksflag = true;
    $(document).on('click', '#cpaginate', function () {
        /* your code here */
        cpageindex = $(this).attr("index");
        cloadcontactlist(cpageindex);
    });
    $(document).on('click', '#cpaginateforcompany', function () {
        cpageindex = $(this).attr("index");
        var token = $("#cltokencompany").val();
        cloadcontactlistforcompany(cpageindex, token);
    });

    /*Close table data*/
    function cloadtabledata() {
        var $ctable = '';
        var $cheader = '';
        var $chead1 = '';
        var cdt = '';
        var cq1 = 2;
        var csort = 10;
        $ctable = $('<table id="cexample" class="table-panel" style="overflow-x:auto;" /><tr><th>').addClass('table-panel');
        $cheader = $('<thead>').html('');
        $chead1 += '<th ><div class="thbg"><input type="checkbox" id="select_all"/></th>'
        $chead1 += '<th class="IsCompany" onclick="sortTable(1)" width = "20%" ><div style="min-width: 130px" class="thbg"> Client Type <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th  onclick="sortTable(2)" class="companyname iscompanyindicidualclass" style="min-width:170px;"><div style="min-width: 140px" class="thbg"><span style="padding-right: 10px !important;">CompanyName</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(3)" class="city" style="min-width:100px;"><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th class="cufname" onclick = "sortTable(4)" width = "20%" > <div style="min-width: 100px" class="thbg">First Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th class="clname" onclick = "sortTable(5)" width = "20%" ><div style="min-width: 100px" class="thbg"> Last Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th  class="mobno"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
        $chead1 += '<th  class="ccemail"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
        $chead1 += '<th onclick="sortTable(8)" class="userid" style="min-width:170px;"><div class="thbg"><span style="padding-right: 20px !important;">UserId</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th onclick="sortTable(9)" class="cstatus"><div class="thbg"><span style="padding-right: 10px !important;">Status</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(10)" class="createdby"><div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(11)" ><div class="thbg">Action</div></th>';
        $chead1 += '<th onclick ="sortTable(12)" class="ContactType" width = "12%" style="min-width:150px;"  > <div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Contact Type</span> <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(13)" class="landline"><div style="min-width: 120px" class="thbg"><span style="padding-right: 20px !important;">Landline</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(14)" class="cadd1"><div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th   onclick="sortTable(15)" class="designation"><div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(16)" class="country"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th onclick="sortTable(17)" class="state"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(18)" class="pin"><div style="min-width: 70px" class="thbg"><span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  class="GSTNo"><div class="thbg"><span style="padding-right: 10px !important;">GSTNo</span></div></th >';
        $chead1 += '<th  class="PANNo"><div class="thbg"><span style="padding-right: 10px !important;">PANNo</span></div></th >';
        $chead1 += '<th  class="AadharNo"><div class="thbg"><span style="padding-right: 10px !important;">AadharNo</span></div></th >';
        $chead1 += '<th  class="CompanyStructure"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
        $chead1 += '<th   class="clientdocs"><div class="thbg"><span style="padding-right: 10px !important;">Documents</span></div></th >';
        $cheader.append($chead1);
        $cheader.append('</thead>');
        $ctable.append($cheader);
        $ctable.append('<tbody style="clear:both" id="cloadactivitydatas">');
        $('#cupdatePanel').html($ctable);
        cloadcontactlist(cpageindex);
    }
    var rer = 1;
    cflaghide = true;
    function cloadcontactlist(cpageindex) {
        debugger
        $("#cloadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        cltype = ClientlistctypeValue;//$('#Clistctype').val();
        if (cltype == "") {
            var cltype = "Client";
        }
        if (cltype != "Client") {
            cltype = "Client";
        }
        formdata.append("pagenum", EncodeText(cpageindex));
        formdata.append("pagesize", EncodeText(cpagesize));
        formdata.append("search", EncodeText($('#searchdata').val()));
        formdata.append("type", EncodeText(cltype));
        formdata.append("iscomorindv", EncodeText(setIsComorindividual));
        var ajaxTime = new Date().getTime();
        openload();
        var cld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                //console.log("loadcontact:" + totalTime)
                //$("#ctfooter").html("");
                $("#ctokens").html("");
                $("#pdatastatus").hide();
                $("#dtNotFound").text("");
                if (response.Status == true) {
                    if (response.Data == "" || response.Data == undefined || response.Data == null) {
                        $('#tradePagination').hide();
                        $("#pdatastatus").show();
                        $("#dtNotFound").text("No result found");
                        closeload();

                    }
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var clength = obj.length;
                }
                else {
                    //alert("not found");
                }

                if (response.Data.length > 2) {
                    $("#cdatastatus").html("");
                    closeload();
                }
                else {
                    //$("#cdatastatus").html("No result found");
                    $('#tradePagination').hide();
                    $("#pdatastatus").show();
                    $("#dtNotFound").text("No result found");
                    closeload();
                }
                var qty = 0;
                $("#cloadactivitydatas tr").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        cfirstvalue = val.rownum;
                    }
                    if (i === (clength - 1)) {
                        //var cpnext = cpageindex;
                        //var cpprev = cpageindex;
                        //var cpageno = cpageindex;
                        //var ctotdata = val.totRow;
                        //var ctotpage = 0;
                        //if (val.totRow > 0) {
                        //    cpnext = parseInt(cpnext) + 1;
                        //    if (cpnext == 0) cpnext = 1;
                        //    cpprev = parseInt(cpageno) - 1;
                        //    if (cpprev == 0) cpprev = 1;
                        //    ctotpage = parseInt(ctotdata) / parseInt(cpagesize);
                        //    if (parseInt(ctotdata) % parseInt(cpagesize) != 0) {
                        //        ctotpage = parseInt(ctotpage) + 1;
                        //    }
                        //    $("#cpagnumvalue").attr("max", ctotpage);
                        //}
                        //var ctfot = '';
                        //ctfot += '<ul>'
                        //ctfot += '<li>results <span>' + val.totRow + '</span>  <span id="csotopage" style="display:none">' + ctotpage + '</span></li>'
                        //ctfot += '<li><span>|</span></li>'
                        //ctfot += '<li>pages ' + cpageindex + '/ ' + parseInt(ctotpage) + '</li>'
                        //ctfot += '<li><span>|</span></li>'
                        //ctfot += '<li ><input type="number" id="cpagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="cgetdatabypagenum" >Go</a> </li>'
                        //if (val.totRow <= clength) {
                        //}
                        //else if (cpageno == 1) {
                        //}
                        //else if (cpageno == ctotpage) {
                        //    ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //else {
                        //    ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //if (cpageno < ctotpage) {
                        //    ctfot += '<a  id="cpaginate" title="Next Page" href="javascript:void()" index="' + cpnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //}
                        //ctfot += '</ul>'
                        //$("#ctfooter").append(ctfot);


                        var totdata = val.totRow;
                        var totpage = 0;
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (cpageindex == totpage) {
                            $('#next').hide();
                            $('#prev').css("display", "block");
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (cpageindex == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }
                        if (isRenderPage == false) {
                            setTotalRecord = totpage;
                            renderPagination(cpageindex, totpage);
                        }

                    }
                    qty = qty + 1;
                    var btitle = ""; 
                    var bclass = "";
                    var bdata = "";
                    var insideSpan =""
                    var setEnableDisable = "";
                    if (val.IsActive == true) {
                        bclass = "enable_badge_inside";
                        insideSpan = "enable_inside"
                        bdata = "Enabled";
                        btitle = "Client credentials active";
                        setEnableDisable = "Enabled";
                    }
                    if (val.IsActive == false) {
                        bclass = "disabled_badge_inside";
                        insideSpan="disable_inside"
                        bdata = "Disabled";
                        btitle = "Client credentials inactive";
                        setEnableDisable = "Disabled"
                    }
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    $row.append($('<td class="s" valign="top" />').html("<span><input style='margin:0px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.LoginId + "'/> "));
                    $row.append($('<td class="IsCompany" />').html("<span>" + (val.IsCompany != null  ? val.IsCompany : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="companyname iscompanyindicidualclass" />').html("<span name = '" + val.CompanyName + "' style='cursor:pointer;' data-id='" + val.CompanyId + "' title='View Client Contacts List' id='companydetails'    >" + ((val.CompanyName != null && val.IsCompany != 'Individual') ? val.CompanyName : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="city" />').html("<span>" + (val.City != null ? val.City : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cufname" />').html("<span name = '" + val.cufname + "' style='cursor:pointer;' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.cufname != null ? val.cufname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="clname" />').html("<span name = '" + val.clname + "' style='cursor:pointer;' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.clname != null ? val.clname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="mobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ccemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="userid" />').html("<span name='" + val.Username + "'>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (
                            String(roleids) == "1" ||
                            (String(userid.toLowerCase()) == val.firmuser.toLowerCase() && val.credentials == 1) ||
                            (String(IsViewAll) == "1" && val.credentials == 1)
                        ) {
                            $row.append($('<td class="cstatus" />').html("<span title='Create User ID password for Client' data-val='" + val.LoginId + "'  class='badge-ac' id='CreateClientlogin'> Add Credentials</span>"));
                        } else {
                            $row.append($('<td class="cstatus" />').html("<div>&nbsp;</div>"));
                        }
                    } else {
                        if (String(enablerights) == "1" || String(roleids) == "1") {
                            $row.append($('<td  title=' + btitle + ' class="cstatus"/>').html("<span id='enableDesable' setDataId='" + val.LoginId + "' setdataitem='" + setEnableDisable + "' class='" + bclass + "' title='" + btitle + "'><span class='" + insideSpan +"'></span>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                        } else {
                            $row.append($('<td  title=' + btitle + ' class="cstatus"/>').html("<span setDataId='" + val.LoginId + "' setdataitem='" + setEnableDisable + "' class='" + bclass + "' title='" + btitle + "'><span class='"+insideSpan+"'></span>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                        }
                        
                    }

                    $row.append($('<td class="createdby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.oedit == 1 || roleids == 1) {
                        $row.append($('<td />').html("<ul class='table_action' style='margin:0 auto;'><li><span class='taskoutboxbtnicon' id='editclient' title='Edit client' id-val=" + val.LoginId + "><img src='/newassets/img/edit.svg' /></span></li></ul>"));
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $row.append($('<td class="ContactType" />').html("<span>Client</span>"));
                    $row.append($('<td class="landline" />').html("<span>" + (val.offno != null ? val.offno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cadd1" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="designation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="country" />').html("<span>" + (val.Country != null ? val.Country : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="state" />').html("<span>" + (val.State != null ? val.State : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="pin" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="GSTNo" />').html("<span>" + (val.GSTINNo != null ? val.GSTINNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="PANNo" />').html("<span>" + (val.PANNo != null ? val.PANNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="AadharNo" />').html("<span>" + (val.AadharCardNo != null ? val.AadharCardNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="CompanyStructure" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.DocsCount >= 1) {
                        $row.append($('<td class="clientdocs" />').html("<span style='cursor:pointer;text-align:center;' id-val='" + val.cid + "' id='filelink'><i class='glyphicon glyphicon-folder-open'></i></span>"));
                    }
                    else {
                        $row.append($('<td class="clientdocs" />').html(""));
                    }
                    $("#cloadactivitydatas").append($row);
                });
                hideshowcompanycolumnbyfilter();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(cld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
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
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#prev", function () {
    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    isRenderPage = true;
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", "#prev", function ()  {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#next", function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", "#next", function (){
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        
        isRenderPage = false;
        $("#txtgopage").val("");
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#divGo", function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
    //        alert("Please enter a valid page number.");
    //        setPageNo = 1;
    //        return false;
    //    }
    //    isRenderPage = true;
    //    cloadcontactlist(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", "#divGo", function () {
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
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


/*Pagination End*/

    /*New Contacts Data For Company*/
    function cloadcontactlistforcompany(cpageindexcom, token) {
        $("#cloadactivitydatasforcomapny").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        cltype = ClientlistctypeValue//$('#Clistctype').val();
        if (cltype == "") {
            var cltype = "Client";
        }
        if (cltype != "Client") {
            cltype = "Client";
        }
        //fillvalue 
        formdata.append("pagenum", EncodeText(cpageindexcom));
        formdata.append("pagesize", EncodeText(cpagesizecom));
        formdata.append("search", EncodeText(token));
        formdata.append("type", EncodeText(cltype));
        formdata.append("iscomorindv", EncodeText($("#iscomorindividual").val()));
        var ajaxTime = new Date().getTime();
        openload();
        var cld121 = $.ajax({
            async: true,
            url: '/api/CallApi/NewContactsDataForCompany',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#ctfooterforcompany").html("");
                $("#ctokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var clength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#cdatastatus").html("");
                    closeload();
                }
                else {
                    $("#cdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                $("#cloadactivitydatasforcomapny tr").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        cfirstvalue = val.rownum;
                    }
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (i === (clength - 1)) {
                        //var cpnext = cpageindexcom;
                        //var cpprev = cpageindexcom;
                        //var cpageno = cpageindexcom;
                        //var ctotdata = val.totRow;
                        //var ctotpage = 0;
                        //if (val.totRow > 0) {
                        //    cpnext = parseInt(cpnext) + 1;
                        //    if (cpnext == 0) cpnext = 1;
                        //    cpprev = parseInt(cpageno) - 1;
                        //    if (cpprev == 0) cpprev = 1;
                        //    ctotpage = parseInt(ctotdata) / parseInt(cpagesizecom);
                        //    if (parseInt(ctotdata) % parseInt(cpagesizecom) != 0) {
                        //        ctotpage = parseInt(ctotpage) + 1;
                        //    }
                        //    $("#cpagnumvalue").attr("max", ctotpage);
                        //}
                        //var ctfot = '';
                        //ctfot += '<ul>'
                        //ctfot += '<li>results <span>' + val.totRow + '</span>  <span id="csotopage" style="display:none">' + ctotpage + '</span></li>'
                        //ctfot += '<li><span>|</span></li>'
                        //ctfot += '<li>pages ' + cpageindexcom + '/ ' + parseInt(ctotpage) + '</li>'
                        //ctfot += '<li><span>|</span></li>'
                        //ctfot += '<li ><input type="number" id="cpagnumvalue" min="1" class="footerInput"><a class="gobtn"  style="cursor:pointer" type="button" id="cgetdatabypagenumforcompany" >Go</a> </li>'
                        //ctfot += '<li ><input type="number" id="cpagnumvalue" min="1"  class="footerInput"><a class="gobtn"  style="cursor:pointer" type="button" id="cgetdatabypagenumforcompany" >Go</a> </li>'
                        //if (val.totRow <= clength) {
                        //}
                        //else if (cpageno == 1) {
                        //}
                        //else if (cpageno == ctotpage) {
                        //    ctfot += '<li><span><a id="cpaginateforcompany"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //else {
                        //    ctfot += '<li><span><a id="cpaginateforcompany"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //if (cpageno < ctotpage) {
                        //    ctfot += '<a  id="cpaginateforcompany" title="Next Page" href="javascript:void()" index="' + cpnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //}
                        //ctfot += '</ul>'
                        //$("#ctfooterforcompany").append(ctfot);

                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (cpageindexcom == totpage) {
                            $('#ExamNext').hide();
                            $('#ExamPrev').css("display", "block");
                        }
                        else {
                            $('#ExamNext').css("display", "block");
                        }
                        if (cpageindexcom == 1) {
                            $('#ExamPrev').css("display", "none");
                        }
                        else {
                            $('#ExamPrev').css("display", "block");
                        }

                        if (isExamRnd == false) {
                            examTotRecord = totpage;
                            ExamRenderPagination(cpageindexcom, totpage);
                        }

                    }
                    qty = qty + 1;
                    var btitle = "";
                    var bclass = "";
                    var bdata = "";
                    if (val.IsActive == true) {
                        bclass = "enabled_badge ";
                        bdata = "Enabled";
                        btitle = "Client credentials active"
                    }
                    if (val.IsActive == false) {
                        bclass = "disabled_badge";
                        bdata = "Disabled";
                        btitle = "Client credentials inactive";
                    }
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    $row.append($('<td class="s" valign="centre" />').html("<span><input style='margin:0px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.LoginId + "'/> "));
                    $row.append($('<td class="cityc" />').html("<span>" + (val.City != null ? val.City : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cufnamec" />').html("<span name = '" + val.cufname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.cufname != null ? val.cufname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="clnamec" />').html("<span name = '" + val.clname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.clname != null ? val.clname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="mobnoc" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ccemailc" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="useridc" />').html("<span name='" + val.Username + "'>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase() && val.credentials == 1) || (String(IsViewAll) == "1" && val.credentials == 1)) {
                            if (packmodules == "2" || packmodules == "3") {
                                $row.append($('<td class="cstatusc" />').html("<div><span style='cursor:pointer' title='Create User ID password for Client' data-val='" + val.LoginId + "'  class='label label-default' id='CreateClientlogin'> Create Credentials</span></div>"));
                            }
                            else {
                                $row.append($('<td class="cstatusc" />').html("&nbsp;"));
                            }
                        }
                        else {
                            $row.append($('<td class="cstatusc" />').html("&nbsp;"));
                        }
                    }
                    else {
                        $row.append($('<td  title=' + btitle + ' class="cstatus"/>').html("<span class='" + bclass + "' title='" + btitle + "'>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                    }
                    $row.append($('<td class="createdbyc" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.oedit == 1 || roleids == 1) {
                        $row.append($('<td  />').html("<ul class='table_action'><li><span class='taskoutboxbtnicon' id='editclient' style='color:#069;cursor:pointer;' title='Edit client' id-val=" + val.LoginId + "><img src='/newassets/img/edit.svg' /></span></li></ul>"));
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $row.append($('<td class="ContactTypec" />').html("<span>Client</span>"));
                    $row.append($('<td class="landlinec" />').html("<span>" + (val.offno != null ? val.offno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cadd1c" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="designationc" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="countryc" />').html("<span>" + (val.Country != null ? val.Country : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="statec" />').html("<span>" + (val.State != null ? val.State : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="pinc" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="GSTNoc" />').html("<span>" + (val.GSTINNo != null ? val.GSTINNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="PANNoc" />').html("<span>" + (val.PANNo != null ? val.PANNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="AadharNoc" />').html("<span>" + (val.AadharCardNo != null ? val.AadharCardNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="CompanyStructurec" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.DocsCount >= 1) {
                        $row.append($('<td class="clientdocsc" />').html("<span style='cursor:pointer;text-align:center;' id-val='" + val.cid + "' id='filelink'><i class='glyphicon glyphicon-folder-open'></i></span>"));
                    }
                    else {
                        $row.append($('<td class="clientdocsc" />').html(""));
                    }
                    $("#cloadactivitydatasforcomapny").append($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(cld121).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    $(document).on("click", "#enableDesable", function () {
        var enableDesable = $(this).attr("setdataitem");
        var setSelectedId = $(this).attr("setDataId");
        if (enableDesable == "Enabled") {
            disableclient(setSelectedId)
        } else if (enableDesable == "Disabled") {
            enableclient(setSelectedId);
        }
        
    });
 
    /*Pagination Start*/
    var examTotRecord = 1;
    var EPageIndex = 1;
    var isExamRnd = false;
    function ExamRenderPagination(EPageIndex, totdata) {
        let totPages = totdata;
        let paginationHtml = '';
        let maxVisible = 4;

        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button type='button' class="page-btnExam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button type='button' class="page-btnExam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button type='button' class="page-btnExam ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#ExamPageNumbers").html(paginationHtml);
        isExamRnd = true;
    }

    $(document).on("click", ".page-btnExam", function () {
        let page = $(this).data("page");
        EPageIndex = page;
        isExamRnd = true;
        $("#opptxtgopage").val("");
        cloadcontactlistforcompany(EPageIndex, tokenDetail);
        $(".page-btnExam").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on("click", "#ExamPrev", function () {
        if (EPageIndex > 1) {
            EPageIndex = EPageIndex - 1;
        }
        isExamRnd = true;
        $("#opptxtgopage").val("");
        cloadcontactlistforcompany(EPageIndex, tokenDetail);

        $(".page-btnExam").removeClass("active");
        $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
    });


    $(document).on("click", "#ExamNext", function () {
        if (EPageIndex => 1) {
            EPageIndex = EPageIndex + 1;
        }
        isExamRnd = true;
        $("#opptxtgopage").val("");
        cloadcontactlistforcompany(EPageIndex, tokenDetail);
        $(".page-btnExam").removeClass("active");
        $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
    });

    $(document).on("click", "#ExamDivGo", function () {
        let goToPage = parseInt($("#Examtxtgopage").val());
        if (!isNaN(goToPage)) {
            EPageIndex = goToPage;
        }

        if (goToPage > examTotRecord || goToPage == 0 || isNaN(goToPage)) {
            alert("Please enter a valid page number.");
            EPageIndex = 1;
            return false;
        }
        isExamRnd = true;
        cloadcontactlistforcompany(EPageIndex, tokenDetail);
        $(".page-btnExam").removeClass("active");
        $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
    });

    /*Pagination End*/

    ////////////////END Client/////////////
    ////////////////Start Others/////////////
    var otrgr = true;
    /*Load menu*/
    function loadmenu() {
        var qo = 2;
        if (otrgr == false) {
            return false;
        }
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
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
                $.each(obj, function (i, a) {
                    qo = qo + 1;
                    var option = '<li><input  class="chkdhide"  type="checkbox" value="' + a.FieldName + '"  name="class' + qo + '" ><a href="#" class="small" data-value="option' + qo + '" tabIndex="-1">' + a.FieldName + '</a></li>';
                    $("#od").append(option);
                }); //End of foreach Loop
                otrgr = false;
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }

    /*Get contact list by page number*/
    $(document).on('click', '#ogetdatabypagenum', function () {
        opageindex = $("#opagnumvalue").val();
        if (opageindex != "undefined") {
            if (Math.sign(opageindex) == 1) {
                var opageindesx = $("#osotopage").text();
                if (opageindex <= parseInt(opageindesx)) {
                    openload();
                    oloadcontactlist(opageindex);
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
    var chksflag = true;
    $(document).on('click', '#opaginate', function () {
        /* your code here */
        opageindex = $(this).attr("index");
        oloadcontactlist(opageindex);
    });

    /*Load table data*/
    function oloadtabledata() {
        var $otable = '';
        var $oheader = '';
        var $ohead1 = '';
        var dt = '';
        var q1 = 2;
        var sort = 10;
        $otable = $('<table id="oexample"   class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
        var ort1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $oheader = $('<thead>').html('');
                    $ohead1 += '<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
                    $ohead1 += '<th onclick="osortTable(1)" class="ocompanyname"><div style="min-width: 140px" class="thbg"><span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(2)" class="ocity"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th class="ofname" onclick = "osortTable(3)" width = "10%" ><div style="min-width: 100px" class="thbg">First Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th class="olname" onclick = "osortTable(4)" width = "20%" ><div style="min-width: 100px" class="thbg">Last Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th  class="omobno"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
                    $ohead1 += '<th  class="ocemail"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
                    $ohead1 += '<th onclick="osortTable(7)" class="ocreatedby"><div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(8)" class="oContactType"><div style="min-width: 150px" class="thbg"><span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th onclick="osortTable(9)" class="ocadd1"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th onclick="osortTable(10)" class="ocweb"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Website</span><span class="fa fa-fw fa-sort pull-right"></span></div></th> ';
                    $ohead1 += '<th onclick="osortTable(11)" class="odesignation"><div  style="min-width: 130px" class="thbg"><span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(12)" class="oinfo"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Add. Info</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(13)" class="opin"><div style="min-width: 70px" class="thbg"><span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(14)" class="ocountry"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(15)" class="ostate"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th  class="Landline"><div class="thbg"><span style="padding-right: 10px !important;">LandlineNo</span></div></th >';
                    $ohead1 += '<th  class="GSTNo"><div class="thbg"><span style="padding-right: 10px !important;">GSTNo</span></div></th >';
                    $ohead1 += '<th  class="PANNo"><div class="thbg"><span style="padding-right: 10px !important;">PANNo</span></div></th >';
                    $ohead1 += '<th  class="AadharNo"><div class="thbg"><span style="padding-right: 10px !important;">AadharNo</span></div></th >';
                    $ohead1 += '<th  class="CompanyStructureother"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
                    $ohead1 += '<th   class="otherdocs"><div class="thbg"><span style="padding-right: 10px !important;">Documents</span></div></th >';
                    $oheader.append($ohead1);
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        sort = sort + 1;
                        $oheader.append('<th  onclick="osortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" class="class' + q1 + '"><div class="thbg"> ' + val.FieldName + '<span class="fa fa-fw fa-sort"></span></div></th>');
                    });
                    $oheader.append('<th><div class="thbg">&nbsp;&nbsp;&nbsp;Action&nbsp;&nbsp;&nbsp;</div></th>');
                    $ohead1 += '';
                    $oheader.append('</thead>');
                    $otable.append($oheader);
                    $otable.append('<tbody style="clear:both" id="oloadactivitydatas">');
                    $('#oupdatePanel').html($otable);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(ort1).then(function (data, textStatus, jqXHR) {
            loadmenu();
            oloadcontactlist(pageindex);
        });
    }

    /*Load contact list*/
    function oloadcontactlist(opageindex) {
        $("#oloadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(opageindex));
        formdata.append("pagesize", EncodeText(opagesize));
        formdata.append("search", EncodeText($('#searchdata')).val());
        //formdata.append("type", EncodeText($('#Clistctype')).val());
        formdata.append("type", EncodeText(ClientlistctypeValue));
        formdata.append("iscomorindv", EncodeText($("#iscomorindividual")).val());
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#otfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var olength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#odatastatus").html("");
                }
                else {
                    $("#odatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        ofirstvalue = val.rownum;
                    }
                    if (i === (olength - 1)) {
                        var opnext = opageindex;
                        var opprev = opageindex;
                        var opageno = opageindex;
                        var ototdata = val.totRow;
                        var ototpage = 0;
                        if (val.totRow > 0) {
                            opnext = parseInt(opnext) + 1;
                            if (opnext == 0) opnext = 1;
                            opprev = parseInt(opageno) - 1;
                            if (opprev == 0) opprev = 1;
                            ototpage = parseInt(ototdata) / parseInt(opagesize);
                            if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                                ototpage = parseInt(ototpage) + 1;
                            }
                            $("#opagnumvalue").attr("max", ototpage);
                        }
                        var otfot = '';
                        otfot += '<ul>'
                        otfot += '<li>results <span>' + val.totRow + '</span>  <span id="osotopage" style="display:none">' + ototpage + '</span></li>'
                        otfot += '<li><span>|</span></li>'
                        otfot += '<li>pages ' + opageindex + '/ ' + parseInt(ototpage) + '</li>'
                        otfot += '<li><span>|</span></li>'
                        otfot += '<li ><input type="number" id="opagnumvalue" min="1"   class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="ogetdatabypagenum" >Go</a> </li>'
                        if (val.totRow <= olength) {
                        }
                        else if (opageno == 1) {
                        }
                        else if (opageno == ototpage) {
                            otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (opageno < ototpage) {
                            otfot += '<a  id="opaginate" title="Next Page" href="javascript:void()" index="' + opnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        otfot += '</ul>'
                        $("#otfooter").append(otfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    $row.append($('<td class="s" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork' style='display:none'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    $row.append($('<td class="companyname" />').html("<span name = '" + val.CompanyName + "' style='cursor:pointer;color:#069' data-id='" + val.CompanyId + "' title='View Client Contacts List' id='companydetails'    >" + (val.CompanyName != null ? val.CompanyName : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="ocity" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ofname" />').html("<span>" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="olname" />').html("<span>" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="omobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocreatedby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="oContactType" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocadd1" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocweb" />').html("<span>" + (val.cwebsite != null ? val.cwebsite : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="odesignation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="oinfo" />').html("<span>" + (val.cnotes != null ? val.cnotes : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="opin" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocountry" />').html("<span>" + (val.Country != null ? val.Country : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ostate" />').html("<span>" + (val.State != null ? val.State : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="Landline" />').html("<span>" + (val.offno != null ? val.offno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="GSTNo" />').html("<span>" + (val.GSTINNo != null ? val.GSTINNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="PANNo" />').html("<span>" + (val.PANNo != null ? val.PANNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="AadharNo" />').html("<span>" + (val.AadharCardNo != null ? val.AadharCardNo : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="CompanyStructureother" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.DocsCount >= 1) {
                        $row.append($('<td class="otherdocs" />').html("<span style='cursor:pointer;text-align:center;' id-val='" + val.cid + "' id='filelink'><i class='glyphicon glyphicon-folder-open'></i></span>"));
                    }
                    else {
                        $row.append($('<td class="otherdocs" />').html(""));
                    }
                    var countcf = countcustomfoeld;
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    var proaction = '';
                    var proaction = '<td>';
                    if (val.oedit == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-pencil' id='transferpage' style='color:#069;cursor:pointer;margin-right:5px;'title='Edit propsect' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "></span>|&nbsp;";
                    }
                    if (val.odelete == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-trash' id='removeprospect' style='color: red; cursor: pointer; ' title='Remove propsect' id-val=" + val.cid + "></span>";
                    }
                    $row.append($('<td />').html(proaction));
                    $("#oloadactivitydatas").append($row);
                });
                hideshowcompanycolumnbyfilter();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    ////////////////END Propect/////////////
    /////////////start all//////
    cflaghideall = true;
    
    function alladcontactlist(opageindex) {
        $("#alloadactivitydatas").html("");
        var allctypes = ClientlistctypeValue;//$('#Clistctype').val();
        if (allctypes == "null" || allctypes == null || allctypes == "") {
            allctypes = "all";
        }
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(opageindex));
        formdata.append("pagesize", EncodeText(opagesize));
        formdata.append("search", EncodeText($('#searchdata').val()));
        formdata.append("type", EncodeText(allctypes));
        formdata.append("iscomorindv", EncodeText(setIsComorindividual));
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#alfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var olength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#alldatastatus").html("");
                }
                else {
                    $("#alldatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        ofirstvalue = val.rownum;
                    }
                    if (i === (olength - 1)) {
                        var opnext = opageindex;
                        var opprev = opageindex;
                        var opageno = opageindex;
                        var ototdata = val.totRow;
                        var ototpage = 0;
                        if (val.totRow > 0) {
                            opnext = parseInt(opnext) + 1;
                            if (opnext == 0) opnext = 1;
                            opprev = parseInt(opageno) - 1;
                            if (opprev == 0) opprev = 1;
                            ototpage = parseInt(ototdata) / parseInt(opagesize);
                            if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                                ototpage = parseInt(ototpage) + 1;
                            }
                            $("#alpagnumvalue").attr("max", ototpage);
                        }
                        var alfot = '';
                        alfot += '<ul>'
                        alfot += '<li>results <span>' + val.totRow + '</span>  <span id="alsotopage" style="display:none">' + ototpage + '</span></li>'
                        alfot += '<li><span>|</span></li>'
                        alfot += '<li>pages ' + opageindex + '/ ' + parseInt(ototpage) + '</li>'
                        alfot += '<li><span>|</span></li>'
                        alfot += '<li ><input type="number" id="alpagnumvalue" min="1"   class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="algetdatabypagenum" >Go</a> </li>'
                        if (val.totRow <= olength) {
                        }
                        else if (opageno == 1) {
                        }
                        else if (opageno == ototpage) {
                            alfot += '<li><span><a id="alpaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            alfot += '<li><span><a id="alpaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (opageno < ototpage) {
                            alfot += '<a  id="alpaginate" title="Next Page" href="javascript:void()" index="' + opnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        alfot += '</ul>'
                        $("#alfooter").append(alfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var btitle = "";
                    var bclass = "";
                    var bdata = "";
                    if (val.IsActive == true) {
                        bclass = "enabled_badge ";
                        bdata = "Enabled";
                        btitle = "Client credentials active"
                    }
                    if (val.IsActive == false) {
                        bclass = "disabled_badge";
                        bdata = "Disabled";
                        btitle = "Client credentials inactive";
                    }
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    $row.append($('<td class="s" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork' style='display:none'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    if (val.ProfileType == "Client") {
                        $row.append($('<td class="oContactTypeal" />').html("<span>Client</span>"));
                    }
                    else if (val.ProfileType == "") {
                        $row.append($('<td class="oContactTypeal" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    }
                    else {
                        $row.append($('<td class="oContactTypeal" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    }
                    $row.append($('<td class="ocompanynameal iscompanyindicidualclass" />').html("<span name = '" + val.CompanyName + "' style='cursor:pointer;color:#069' data-id='" + val.CompanyId + "' title='View Client Contacts List' id='companydetails'    >" + (val.CompanyName != null ? val.CompanyName : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="ocityal" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="olclienttype" />').html("<span>" + (val.IsCompany != null ? val.IsCompany : '<span style="">&nbsp;</span>')));
                    if (val.ProfileType == "Client" || val.ProfileType == "") {
                        $row.append($('<td class="ofnameal" />').html("<span name='" + val.fname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'  >" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="olnameal" />').html("<span name='" + val.lname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'  >" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    }
                    else {
                        $row.append($('<td class="ofnameal" />').html("<span name='" + val.fname + "'>" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="olnameal" />').html("<span name='" + val.lname + "'>" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    }
                    $row.append($('<td class="omobnoal" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocemailal" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocreatedbyal" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocuserid" />').html("<span>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase() && val.credentials == 1) || (String(IsViewAll) == "1" && val.credentials == 1)) {
                            if (packmodules == "2" || packmodules == "3") {
                                if (val.ProfileType == "Client") {
                                    $row.append($('<td class="ocstatus" />').html("<span style='cursor:pointer' title='Create User ID password for Client' data-val='" + val.LoginId + "'  class='label label-default' id='CreateClientlogin'> Create Credentials</span>"));
                                }
                                else {
                                    $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                                }
                            }
                            else {
                                $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                            }
                        }
                        else {
                            $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                        }
                    }
                    else {
                        if (val.ProfileType == "Client") {
                            $row.append($('<td  title=' + btitle + ' class="ocstatus"/>').html("<span class='" + bclass + "' title='" + btitle + "'>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                        }
                        else {
                            $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                        }
                    }
                    $row.append($('<td class="ocadd1al" />').html("<span>" + (val.cadd1 != null ? val.cadd1 : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocwebal" />').html("<span>" + (val.cwebsite != null ? val.cwebsite : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="odesignational" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="oinfoal" />').html("<span>" + (val.cnotes != null ? val.cnotes : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="opinal" />').html("<span>" + (val.Pin != null ? val.Pin : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocountryal" />').html("<span>" + (val.Country != null ? val.Country : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ostateal" />').html("<span>" + (val.State != null ? val.State : '<span style="">&nbsp;</span>')));
                    if (val.DocsCount >= 1) {
                        $row.append($('<td class="alldocs" />').html("<span style='cursor:pointer;text-align:center;' id-val='" + val.cid + "' id='filelink'><i class='glyphicon glyphicon-folder-open'></i></span>"));
                    }
                    else {
                        $row.append($('<td class="alldocs" />').html(""));
                    }
                    var countcf = countcustomfoeld;
                    for (var str = 1; str <= countcf; str++) {
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }

                    if (val.odelete == 1 || roleids == 1) {
                        if (val.ProfileType == "") {
                            var proaction1 = '';
                            var proaction1 = '<td>';
                            proaction1 += "<span class='glyphicon glyphicon-edit' id='transferpage' style='color:#069;cursor:pointer;margin-right:5px;'title='Edit propsect'  data-id=" + val.cid + " sno=" + qty + "></span>|&nbsp;";
                            proaction1 += "<span class='glyphicon glyphicon-trash' id='removeprospect' style='color: red; cursor: pointer; ' title='Remove propsect' id-val=" + val.cid + "></span>";
                            $row.append($('<td />').html(proaction1));
                        }
                        else {
                            var proaction = '';
                            var proaction = '<td>';
                            if (val.oedit == 1 || roleids == 1) {
                                if (val.ProfileType == "Client") {
                                    proaction += "<span class='glyphicon glyphicon-edit' id='editclient' style='color:black;cursor:pointer;margin-right:5px;' title='Edit client' id-val=" + val.LoginId + "></span>";
                                }
                                else {
                                    proaction += "<span class='glyphicon glyphicon-edit' id='transferpage' style='color:#black;cursor:pointer;margin-right:5px;'title='Edit propsect' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "></span>";
                                }
                            }
                            if (val.odelete == 1 || roleids == 1) {
                                if (val.ProfileType == "Client") {
                                    if (val.IsclientMatter == 0) {
                                        proaction += "<span class='glyphicon glyphicon-trash' id='removeclient' style='color: red; cursor: pointer; ' title='Remove client' idss=" + val.CompanyId + " id-val=" + val.cid + "></span>";
                                    }
                                    else {
                                    }
                                }
                                else {
                                    proaction += "<span class='glyphicon glyphicon-trash' id='removeothers' style='color: red; cursor: pointer; ' title='Remove' id-val=" + val.cid + "></span>";
                                }
                            }
                            $row.append($('<td />').html(proaction));
                        }
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $("#alloadactivitydatas").append($row);
                    hideshowcompanycolumnbyfilter();
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            loadmenuall();
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
        });
    }
    function hideshowcompanycolumnbyfilter() {
        var takecategory = setIsComorindividual;
        if (takecategory == "0") {
            $(".iscompanyindicidualclass").css("display", "none");
            $('input:checkbox.shcheckbox1').each(function () {
                if ($(this).prop('checked')) {
                    var fileval = $(this).attr("value");
                    if (fileval == "CompanyName") {
                        $(this).prop('checked', false);
                    }
                }
            });
        }
        else {
            $(".iscompanyindicidualclass").css("display", "table-cell");
            $('input:checkbox.shcheckbox1').each(function () {
                if ($(this).prop('checked')) {
                    var fileval = $(this).attr("value");
                    if (fileval == "CompanyName") {
                        $(this).prop('checked', true);
                    }
                }
            });
        }
    }

    //function allloadtabledata() {
    //    var $altable = '';
    //    var $alheader = '';
    //    var $alhead1 = '';
    //    var dt = '';
    //    var q1 = 2;
    //    var sort = 10;
    //    $altable = $('<table id="alexample"  class="" style="overflow-x:auto;" /><tr><th>').addClass('table ');
    //    var alrt1 = $.ajax({
    //        async: true,
    //        type: 'POST',
    //        url: '/api/demo/FirmEmployeescreate1',
    //        headers: {
    //            // 'fid': type
    //            'configurationtype': 11
    //        },
    //        contentType: "application/json; charset=utf-8",
    //        dataType: 'json',
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //                var obj = JSON.parse(response.Data);
    //                countcustomfoeld = obj.length;
    //                $alheader = $('<thead>').html('');
    //                $alhead1 += '<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
    //                $alhead1 += '<th onclick="asortTable(1)" class="oContactTypeal"><div style="min-width: 130px" class="thbg"><span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $alhead1 += '<th onclick="asortTable(2)" class="ocompanynameal iscompanyindicidualclass"><div style="min-width: 140px" class="thbg"><span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th onclick="asortTable(3)" class="ocityal"><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th class="olclienttype" onclick = "asortTable(4)" width = "20%" ><div style="min-width: 110px" class="thbg"> Client Type <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
    //                $alhead1 += '<th class="ofnameal" onclick = "asortTable(5)" width = "10%" ><div style="min-width: 100px" class="thbg">First Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $alhead1 += '<th class="olnameal" onclick = "asortTable(6)" width = "10%" ><div style="min-width: 100px" class="thbg">Last Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $alhead1 += '<th  class="omobnoal"><div class="thbg"><span style="padding-right: 10px !important;">Mobile Number</span></div></th>';
    //                $alhead1 += '<th  class="ocemailal"><div class="thbg"><span style="padding-right: 10px !important;">Email ID</span></div></th>';
    //                $alhead1 += '<th onclick="asortTable(9)" class="ocreatedbyal"><div style="min-width: 110px" class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th onclick="asortTable(10)" class="ocuserid" style="min-width:150px;"><div class="thbg"><span style="padding-right: 20px !important;">UserId</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $alhead1 += '<th  class="ocstatus"><div class="thbg"><span style="padding-right: 10px !important;">Status</span></div></th>';
    //                $alhead1 += '<th onclick="asortTable(12)" class="ocadd1al"><div class="thbg"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
    //                $alhead1 += '<th onclick="asortTable(13)" class="ocwebal"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Website</span><span class="fa fa-fw fa-sort pull-right"></span></div></th> ';
    //                $alhead1 += '<th onclick="asortTable(14)" class="odesignational"><div style="min-width: 120px" class="thbg"><span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th onclick="asortTable(15)" class="oinfoal"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Add. Info</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th onclick="asortTable(16)" class="opinal"><div style="min-width: 70px" class="thbg"><span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th onclick="asortTable(17)" class="ocountryal"><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th onclick="asortTable(18)" class="ostateal"><div style="min-width: 90px" class="thbg"><span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
    //                $alhead1 += '<th class="alldocs"><div class="thbg"><span style="padding-right: 10px !important;">Documents</span></div></th >';
    //                $alheader.append($alhead1);
    //                $.each(obj, function (i, val) {
    //                    q1 = q1 + 1;
    //                    sort = sort + 1;
    //                    $alheader.append('<th  onclick="asortTable(' + sort + ')" style="text-align: center; padding-top: 12px;" class="class' + q1 + '"><div class="thbg">' + val.FieldName + ' <span class="fa fa-fw fa-sort "></span></div></th>');
    //                });
    //                $alheader.append('<th ><div style="min-width: 100px" class="thbg"><span style="padding-right: 10px !important;"></span>Action</div></th>');
    //                $alheader.append('</thead>');
    //                $altable.append($alheader);
    //                $altable.append('<tbody style="clear:both" id="alloadactivitydatas">');
    //                $('#allupdatePanel').html($altable);
    //            }
    //            else {
    //                //  alert("not found");
    //            }
    //        },
    //        error: function () {
    //            alert('Error!');
    //        }
    //    });
    //    $.when(alrt1).then(function (data, textStatus, jqXHR) {
    //        // loadmenu();
    //        alladcontactlist(alpageindex);
    //    });
    //}
    function loadmenuall() {
        var qo = 2;
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                'configurationtype': 11
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
                $.each(obj, function (i, a) {
                    qo = qo + 1;
                    var option = '<li><input  class="chkdhide"  type="checkbox" value="' + a.FieldName + '"  name="class' + qo + '" ><a href="#" class="small" data-value="option' + qo + '" tabIndex="-1">' + a.FieldName + '</a></li>';
                    $("#odal").append(option);
                }); //End of foreach Loop
                $("#odal li input:checkbox:not(:checked)").each(function () {
                    var column = "#alexample ." + $(this).attr("name");
                    $(column).hide();
                });
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $(document).on('click', '#alpaginate', function () {
        /* your code here */
        cpageindex = $(this).attr("index");
        alladcontactlist(cpageindex);
    });
    $(document).on('click', '#algetdatabypagenum', function () {
        ppageindex = $("#alpagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#alsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    alladcontactlist(ppageindex);
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
    //////end///////////////
    var fcode = localStorage.getItem("FirmCode");
    $(document).on('click', '#editclient', function () {
        var loginid = $(this).attr("id-val");
        var urls = "/" + fcode + "/Firm/EditClient";
        url_redirect({
            url: urls,
            method: "post",
            data: { "loginid": loginid }
        });
    });
    $('#clusername').keyup(function () {
        var dInput = this.value;
        if (dInput.length < 5) {
            $('#useriderror').text('kindly enter minimum 5 characters .');
        }
        else {
            $('#useriderror').text('');
        }
    });
    //Reset custmized fields
    $("#resetcf").click(function () {
        var result = confirm("Do you want to remove the added custom fields?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/matterApi/ResetCF",
                headers: {
                    'configurationtype': ModuleType
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $("#content").html("");
                    var datas = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: 'Custom fields removed successfully. A history of custom fields can be viewed in Custom Field History section.',
                        type: 'success',
                        delay: 3000
                    });
                    closeload();
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });
});