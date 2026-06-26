var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var tfot = '';
$(document).ready(function () {
    $(".ms-selectall").hide();
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    jQuery('#WorkMatter').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: true
    });
/*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
/*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    $("#FromWorkUserNew,#SelectContacts").change(function () {
        if ($(this).val() != "") {
            loadmatterbyUserId();
        }
    });
/*Load company contact*/
    $("#SelectCompany").change(function () {
        requestid = $(this).val();
        var formData = new FormData();
        formData.append("prefix", requestid)
        $("#SelectContacts").find('option').remove().end().append('<option value="">Select</option>');
        $.ajax({
            url: '/api/CallApi/loadcompanycontacts',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a.val + '" >  ' + a["label"] + '</option>';
                    $("#SelectContacts").append(option);
                }); //End of foreach Loop
            },
            error: function (response) {
                alert(response.responseText);
            },
            failure: function (response) {
                alert(response.responseText);
            }
        });
    });
    $("#SelectConType").change(function () {
        if ($(this).val() == 0) {
            $("#SelectCompanydiv,#SelectContactsdiv").val("").hide();
            $("#FromWorkUserdiv").val("").show();
        }
        else {
            $("#SelectCompanydiv,#SelectContactsdiv").val("").show();
            $("#FromWorkUserdiv").val("").hide();
        }
    });
/*Search data*/
    $("#searchdatas").click(function () {
        var casefiltercasename = $("#casefiltercasename").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#casefiltercasename").focus();
            return false;
        }
        $("#clearnewsearchcase").css("display", "unset")
        //$("#searchdatas").attr("disabled", true);
        /* your code here */
        loadflag = true;
        loadWorkTransfer(1);
        chksflag = true;
    });
/*Filter case file name on keyup*/
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
    $(document).on('click', '#selectop', function () {
        if ($("input[type='radio'].radioBtnClass").is(':checked')) {
            var card_type = $("input[type='radio'].radioBtnClass:checked").val();
            $("#pagingnocase").val(1);
            $('#FromWorkUserNew').prop('selectedIndex', 0);
            $("#WorkMatter").empty();
            $("#WorkMatter").multiselect('reload');
        }
    });
    $("#clearnewsearchcase").click(function () {
        $("#casefiltercasename").val("");
        $("#clearnewsearchcase").css("display", "none");
        loadflag = true;
        loadWorkTransfer(1);
        chksflag = true;
    })
    $(document).on('change', '#pagingnocase', function () {
            loadmatterbyUserId();
    });
/*Load matter by user id*/
    function loadmatterbyUserId() {
        var formData = new FormData();
        var pagingnocase = $('#pagingnocase').val();
        if (pagingnocase == "" || pagingnocase == "0") {
            pagingnocase = 1;
        }
        formData.append("userid", $("#FromWorkUserNew").val());
        var optype = "";
        if ($("input[type='radio'].radioBtnClass").is(':checked')) {
            var optype = $("input[type='radio'].radioBtnClass:checked").val();
        }
        if (optype == "") {
            alert("Please select type Case assign to user or add user for live update.");
            return false;
        }
        var SelectContacts = $('#SelectContacts').val();
        var SelectConType = $('#SelectConType').val();
        if (SelectContacts == "") {
            return false;
        }
        formData.append("optype", optype);
        formData.append("pageno", pagingnocase)
        formData.append("SelectConType", SelectConType);
        formData.append("SelectContacts", SelectContacts);
        $("#WorkMatter").html("");
        $("#WorkMatter").empty();
        $.ajax({
            url: '/api/MatterApi/LoadCaseListByAssignUserandAll',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]" || response.Data == "") {
                        alert("No Matter exist. Please first create matter first.");
                        $(".ms-selectall").hide();
                        $('#FromWorkUserNew').prop('selectedIndex', 0);
                        $("#WorkMatter").empty();
                        $("#WorkMatter").multiselect('reload');
                        return false;
                    }
                    else
                    {
                        $(".ms-selectall").show();
                    }
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var html3 = '';
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["id"] + '"> ' + a["mname"] + '</option>';
                    $("#WorkMatter").append(option);
                });
                $("#WorkMatter").multiselect('reload');
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                // alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                // alert(response.responseText);
            } //End of AJAX error function
        });
    }
/*Save assign bulk cases*/
    $("#SaveBulkCaseAssign").click(function () {
        var FromWorkUser = $('#FromWorkUserNew').val();
        var WorkMatter = $('#WorkMatter').val();
        var SelectContacts = $('#SelectContacts').val();
        var SelectConType = $('#SelectConType').val();
        if (SelectConType == 1) {
            if (SelectContacts == "" || SelectContacts == null || SelectContacts=="null") {
                alert("Please select Client Contacts");
                return false;
            }
        }
        else {
            if (FromWorkUserNew == "") {
                alert("Please select From user");
                return false;
            }
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
        formdata.append("caseid", WorkMatter);
        formdata.append("SelectConType", SelectConType);
        formdata.append("SelectContacts", SelectContacts);
        var optype = "";
        if ($("input[type='radio'].radioBtnClass").is(':checked')) {
            var optype = $("input[type='radio'].radioBtnClass:checked").val();
        }
        if (optype == "") {
            alert("Please select type Case assign to user or add user for live update.");
            return false;
        }
        formdata.append("optype", optype)
        openload();
        var ld12 = $.ajax({
            async: true,
            url: "/api/MatterApi/SaveBulkCaseAssign",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if (parseInt(data.Data) > 0)
                {
                    $("#savemultipleaddress")[0].reset();
                    $("#WorkMatter").empty();
                    $("#WorkMatter").multiselect('reload');
                    alert("Successfully saved");
                    closeload();
                }
                else if (parseInt(data.Data) == 0) {
                    alert("Already assigned matters.");
                    closeload();
                }
                else
                {
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
});
