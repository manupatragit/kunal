var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
var morepageno6 = 1;


let selectedLocalFilesExp = [];
let selectedServerFilesExp = [];
$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    var fcode = localStorage.getItem("FirmCode");
    Casebyajax(morepageno6, "", "");
    $("#txtdate").attr("max", new Date().toISOString().substring(0, 10));
    $("#filterclientexpense").change(function () {
        loadflag = true;
        LoadExpenseData(1);
    });
    $("#ddlExpenseTypeFilter").change(function () {
        loadflag = true;
        LoadExpenseData(1);
    });
    $("#ddlCategoryFilter").change(function () {
        loadflag = true;
        LoadExpenseData(1);
    });
    $("#ddlCurrencyFilter").change(function () {
        loadflag = true;
        LoadExpenseData(1);
    });
    $("#ddlExpenseStatusFilter").change(function () {
        loadflag = true;
        LoadExpenseData(1);
    });
    var chksflag = true;
    $("#clearnewsearchcase").click(function () {
        $("#expensefiltercasename").val("");
        $("#clearnewsearchcase").css("display", "none");
        loadflag = true;
        LoadExpenseData(1);
        chksflag = true;
    })
    //Delete event handler.
    $("#tblCustomers").on("click", "#DeleteCategory", function () {
        if (confirm("Do you want to delete this expense Category?")) {
            var customerId = $(this).attr("ids");
            var formData = new FormData();
            formData.append("id", customerId);
            openload();
            $.ajax({
                url: '/api/ExpenseApi/RemoveExpenseCategory',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    Loadexpensecategory();
                    GetExpenseCategory();
                    closeload();
                }
            });
            return false;
        }
    });
    GetExpenseType();
    GetExpenseCategory();
    Loadexpensecategory();
    /*Load expense category*/
    function Loadexpensecategory() {
        var html = '';
        $("#assignuserdata").html("");
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/LoadExpenseCategory",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                if (obj == null) {
                    $("#categorystatus").show();
                }
                else {
                    $("#categorystatus").hide();
                }
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td class="CustomerId"><span style="display:none">' + a.iid + '</span>' + qty1 + '</td><td class="Name"><span>' + a.ExpenseCategory + '</span> <input type="text" class="form-control" value="' + a.ExpenseCategory + '" style="display:none" /></td><td><a class="" href="javascript:;" style="display:none">Edit</a><a class="Update btn btn-info btn-mail" href="javascript:;" style="display:none">Update</a> <a class="Cancel btn btn-default btn-mail" href="javascript:;" style="display:none">Cancel</a>&nbsp;  <a class="" href="javascript:;"><span  style="color:Red" class="glyphicon glyphicon-trash" id="DeleteCategory" ids="' + a.iid + '" title="Delete Expense Category"></span></a></td></tr>';
                });
                $("#assignuserdata").append(html);
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
    $("#btnAdd").click(function () {
        try {
            var formData = new FormData();
            var txtName = $("#txtName").val();
            if (txtName == "") {
                alert("Please enter category type");
                return false;
            }
            formData.append("SubjectName", EncodeText(txtName.trim()));
            openload();
            $.ajax({
                url: '/api/ExpenseApi/InsertExpenseCategory',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Data != "-1") {
                        new PNotify({
                            title: 'Success',
                            text: 'Data saved Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        Loadexpensecategory();
                        $("#txtName").val("");
                        GetExpenseCategory();
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'Warning',
                            text: 'Expense Category already exists.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    return false;
                }
            });
        }
        catch (er) {
            alert(er.message);
            closeload();
        }
    });
    $("#ddlCategory").change(function () {
        if (roleids == "1") {
            var values = $(this).val();
            if (values == "Others") {
                $("#myModalcategory").modal();
            }
        }
    });
    $(document).on('keypress', '#txtTotal', function (event) {
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
    $(document).on('keypress', '#pamount', function (event) {
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    LoadExpenseData(pageindex);
    //  Save Sync Row Data
    $("#syncrqst").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#bindexpense input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("expense"));
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
                            LoadExpenseData(pageindex)
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
    $(document).on("click", "#searchdatas", function () {
        isRenderPage = false;
        var casefiltercasename = $("#expensefiltercasename").val();
        //if (casefiltercasename == "") {
        //    alert("Please enter the matter name.");
        //    $("#expensefiltercasename").focus();
        //    return false;
        //}
        //$("#clearnewsearchcase").css("display", "unset")
        $("#Cancelsearchdatas").css("display","unset")
        LoadExpenseData(1);
    });
    $(document).on("click", "#Cancelsearchdatas", function () {
        $("#datefrom").val("");
        $("#dateto").val("");
        $("#Cancelsearchdatas").css("display", "none")
        isRenderPage = false;
        LoadExpenseData(1);
    });
    $(document).on("click", "#clearnewsearchcase", function () {
        isRenderPage = false;

        $("#expensefiltercasename").val("");
        $("#clearnewsearchcase").css("display", "none");
        LoadExpenseData(1);
    });
    $(document).on("click", "#searretainerName", function () {
        isRenderPage = false;
        var casefiltercasename = $("#filterretainerName").val();
        if (casefiltercasename == "") {
            alert("Please enter the retainer name.");
            $("#filterretainerName").focus();
            return false;
        }
        $("#clearretainerName").css("display", "unset");
        LoadExpenseData(1);
    });
    $(document).on("click", "#clearretainerName", function () {
        isRenderPage = false;

        $("#filterretainerName").val("");
        $("#clearretainerName").css("display", "none");
        LoadExpenseData(1);
    });
    $(document).on("click", "#searchdescription", function () {
        isRenderPage = false;
        var casefiltercasename = $("#expensefilterdescription").val();
        if (casefiltercasename == "") {
            alert("Please enter the description.");
            $("#expensefilterdescription").focus();
            return false;
        }
        $("#clearnewsearchdescription").css("display", "unset");
        LoadExpenseData(1);
    });
    $(document).on("click", "#clearnewsearchdescription", function () {
        isRenderPage = false;

        $("#expensefilterdescription").val("");
        $("#clearnewsearchdescription").css("display", "none");
        LoadExpenseData(1);
    });
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=Expense&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });

    /*Load firm user by firm id*/
    //function LoadUsersbyFirmid_Roleid() {
    //    var html3 = '';
    //    var formData = new FormData();
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/ExpenseApi/UsersbyFirmid_Userid_Roleid",
    //        dataType: 'json',
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        success: function (response1) {
    //            if (response1.Data != "") {
    //                $("#filteruserdocument").html("");
    //            }
    //            html3 += '<option value="">Select User</option>';
    //            $.each(response1.Data, function (k, a) {
    //                var LoginId = a.LoginId;
    //                var cfname = a.cfname + " [" + a.EmailId + "]";
    //                var EmailId = a.EmailId;
    //                html3 += '<option value=' + LoginId + '>' + cfname + '</option>'
    //            });
    //            $("#filteruserdocument").html("");
    //            $("#filteruserdocument").append(html3);
    //        },
    //        failure: function (data) {
    //            alert(data.responseText);
    //        },
    //        error: function (data) {
    //            alert(data.responseText);
    //        }
    //    });
    //}
    $(document).on("click", "#RemoveData", function () {
        if (confirm("Are you sure you want to delete the expense record?")) {
            var cvalue = $(this).attr("token");
            RemoveSelectedData(cvalue);
        }
    });
    /*Edit expense details*/
    $(document).on("click", "#EditExpenseData", function () {
        var cvalue = $(this).attr("token");
        $("#hdnExpenseid").val(cvalue);
        $("#padditem").html("edit item");
        $("#AddExpense").html("Update Item");
        $("#AddExpense").attr("title", "update");
        $("#casemoreoptiondivexp").hide();
        var caseid = "";
        var formData = new FormData();
        formData.append("expenseid", cvalue);
        openload();
        loadteamleaderexpense();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/ExpenseDatabyId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $.each(response1.Data, function (i, a) {
                        var dDate = a.dExpensedate;
                        var CASEName = a.mname;
                        var CLIENTName = a.cfname;
                        if (CLIENTName == "'") {
                            CLIENTName = "";
                        }
                        var Expensetype = a.ExpenseTypeId;
                        var Category = a.ExpenseCategoryId;
                        var Description = a.Descriptions;
                        var Price = a.Price_Rate;
                        var Unit = a.Units;
                        var Total = a.Total;
                        var Receipt = a.UploadReceipt;
                        var expenseid = a.ExpenseId;
                        var clientid = a.Clientid;
                        var teammember = a.Userid;
                        var currency = a.Currency;
                        var retainerName = a.Retainername;
                        var receiptDate = a.ReceiptDate;
                        caseid = a.Caseid;
                        $("#exclienthide").val(a.Clientid);
                        $('#ddlExpenceCase').empty().append('<option value="' + a.Caseid + '">' + a.mname + '</option>').find('option:first').attr("selected", "selected");
                        $("#ddlExpenceClient").val(CLIENTName);
                        if (caseid == "00000000-0000-0000-0000-000000000000") {
                        }
                        else {
                            $("#ddlExpenceCase").change();
                        }
                        $("#ddlExpenseType").val(Expensetype);
                        $("#ddlCategory").val(Category);
                        $("#ddlCurrency").val(currency);
                        $("#txtprice").val(Price);
                        $("#txtUnits").val(Unit);
                        $("#txtTotal").val(Total);
                        $("#txtDescription").val(Description);
                        $("#txtretainername").val(retainerName);
                        $("#txtReceiptDate").val(receiptDate);
                        setTimeout(function () {
                            closeload();
                            $("#ddlExpenceTeamMember").val(a.TeamMember);
                        }, 2000);
                        var txtFile = "";
                        try {
                            var edate = dDate.split('T')[0];
                            $("#txtdate").val(edate);
                        }
                        catch (er) {
                        }
                        try {
                            if (a.duedate != null && a.duedate != "1900-01-01T00:00:00") {
                                var etxtduedate = a.duedate.split('T')[0];
                                $("#txtduedate").val(etxtduedate);
                            }
                        }
                        catch (er) {
                        }
                    });
                    //For Showing Page.
                    $("#main_wrapper_form").hide();
                    $("#createExpense_page").show();
                    $("#editText").text("Update Expense");
                    $("#AddExpense").attr("title", "save")
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
    });
    $("#casemoreoptionexp").click(function () {
        morepageno6 = morepageno6 + 1;
        var clietid = $("#expenseclienthide").val();
        var companyIdas = $("#expensecomapnyclienthide").val();
        Casebyajax(morepageno6, clietid, companyIdas);
    });
    $('#expenseexcel').click(function () {
        var datefrom = $("#datefrom").val();
        var dateto = $("#dateto").val();
        // var loginid = $("#filteruserdocument").val();
        var loginid = "";
        var client = $("#filterclientexpense").val();
        var categoryfilter = $("#ddlCategoryFilter").val();
        var etypefilter = $("#ddlExpenseTypeFilter").val();
        var currencyfilter = $("#ddlCurrencyFilter").val();
        var ExpenseStatusFilter = $("#ddlExpenseStatusFilter").val();
        var txtRetainername = $("#filterretainerName").val();
        var decriptionfilter = $("#expensefilterdescription").val();
        var CreatedForFilter = $("#ddlExpenseCreatedForFilter").val();
        loginid = CreatedForFilter;
        if (client == "null" || client == null || client == "") {
            client = "";
        }
        if (etypefilter == "null" || etypefilter == null || etypefilter == "") {
            etypefilter = "";
        }
        if (categoryfilter == "null" || categoryfilter == null || categoryfilter == "") {
            categoryfilter = "";
        }
        if (ExpenseStatusFilter == "null" || ExpenseStatusFilter == null || ExpenseStatusFilter == "") {
            ExpenseStatusFilter = "";
        }
        var casename = $("#expensefiltercasename").val();
        window.location = encodeURI("/Expense/ExportoExcelExpenseReport?pagenum=" + pageindex + "&pagesize=" + pagesize + "&datefrom=" + datefrom + "&dateto=" + dateto +
            "&loginid=" + loginid + "&client=" + client + "&casename=" + casename + "&categoryfilter=" + categoryfilter + "&etypefilter=" + etypefilter +
            "&currencyfilter=" + currencyfilter + "&ExpenseStatusFilter=" + ExpenseStatusFilter + "&Retainername=" + txtRetainername + "&decriptionfilter=" + decriptionfilter);
    });

    /*Export expense in pdf*/
    $('#expensepdf').click(function () {
        var datefrom = $("#datefrom").val();
        var dateto = $("#dateto").val();
        //var loginid = $("#filteruserdocument").val();
        var loginid = "";
        var client = $("#filterclientexpense").val();
        var categoryfilter = $("#ddlCategoryFilter").val();
        var etypefilter = $("#ddlExpenseTypeFilter").val();
        var currencyfilter = $("#ddlCurrencyFilter").val();
        var ExpenseStatusFilter = $("#ddlExpenseStatusFilter").val();
        var txtRetainername = $("#filterretainerName").val();
        var decriptionfilter = $("#expensefilterdescription").val();
        var CreatedForFilter = $("#ddlExpenseCreatedForFilter").val();
        loginid = CreatedForFilter;
        if (client == "null" || client == null || client == "") {
            client = "";
        }
        if (etypefilter == "null" || etypefilter == null || etypefilter == "") {
            etypefilter = "";
        }
        if (categoryfilter == "null" || categoryfilter == null || categoryfilter == "") {
            categoryfilter = "";
        }
        if (ExpenseStatusFilter == "null" || ExpenseStatusFilter == null || ExpenseStatusFilter == "") {
            ExpenseStatusFilter = "";
        }
        var casename = $("#expensefiltercasename").val();
        window.location = encodeURI("/Expense/ExportoPdfExpenseReport?pagenum=" + pageindex + "&pagesize=" + pagesize + "&datefrom=" + datefrom + "&dateto=" + dateto +
            "&loginid=" + loginid + "&client=" + client + "&casename=" + casename + "&categoryfilter=" + categoryfilter + "&etypefilter=" + etypefilter +
            "&currencyfilter=" + currencyfilter + "&ExpenseStatusFilter=" + ExpenseStatusFilter + "&Retainername=" + txtRetainername + "&decriptionfilter=" + decriptionfilter);
    });
    $(document).on('click', '#PayExpense', function () {
        openloader();
        var token = $(this).attr("token");
        var url = "/" + fcode + "/Expense/PaymentExpense?token=" + token;
        $('.mymodelspay').load(url, function (result) {
            closeloader();
            $("#myModalpayment").modal({ show: true });
        });
    });
    $("#ChangeExepnseStatus").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to change expense status?");
        if (result) {
            $('#bindexpense input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                openloader();
                $.ajax({
                    async: true,
                    url: '/api/ExpenseApi/SaveExpenseStatus',
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
                                text: ' expense status changed saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            LoadExpenseData(pageindex)
                            closeloader();
                        }
                        else {
                            closeloader();
                        }
                    },
                    error: function () {
                        closeloader();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row',
                    type: 'error',
                    delay: 3000
                });
                closeloader();
            }
        }
    });
    //For ICICI Bank Change
    $("#txtretainername").change(function () {
        if (FIrmIds.toString() == "875e7a27-2f7f-4caa-9278-05119b1ae470") {
            var retainsers = $("#txtretainername").val();
            if (retainsers != "") {
                if (retainsers.toLowerCase() == "counsel7") {
                    $("#txtTotal").val(10000);
                }
                else if (retainsers.toLowerCase() == "counsel8") {
                    $("#txtTotal").val(20000);
                }
                else if (retainsers.toLowerCase() == "counsel9") {
                    $("#txtTotal").val(15000);
                }
                else if (retainsers.toLowerCase() == "counsel10") {
                    $("#txtTotal").val(7000);
                }
                else if (retainsers.toLowerCase() == "counsel11") {
                    $("#txtTotal").val(6000);
                }
                else {
                    $("#txtTotal").val('');
                }
            }
            else {
                $("#txtTotal").val('');
            }
        }
        else {
        }
    });
});

/*Get expense type*/
function GetExpenseType() {
    var groupval = "";
    var html3 = '';
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/BindExpenseType",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#ddlExpenseType").html("");
            }
            else {
                $("#ddlExpenseType").html("No Expense Type !");
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var IId = a.IId;
                var ExpenseType = a.ExpenseType;
                html3 += '<option value="' + IId + '">' + ExpenseType + '</option>';
            });
            html31 = '<option value="">Select</option>';
            html32 = '<option value="">Expense Type</option>';
            $("#ddlExpenseType,#ddlExpenseTypeFilter").html("");
            $("#ddlExpenseType").append(html31).append(html3);
            $("#ddlExpenseTypeFilter").append(html32).append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

/*Get expense category*/
function GetExpenseCategory() {
    var groupval = "";
    var html3 = '';
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/BindExpenseCategory",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#ddlCategory,#ddlCategoryFilter,#ddlCategory_1").html("");
            }
            else {
                $("#ddlCategory,#ddlCategory_1").html("No Category !");
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var IId = a.iid;
                var ExpenseCategory = a.ExpenseCategory;
                html3 += '<option value="' + IId + '">' + ExpenseCategory + '</option>';
            });
            var html31 = '<option value="" selected>Select</option>';
            var html32 = '<option value="" selected>Category</option>';
            $("#ddlCategory,#ddlCategoryFilter,#ddlCategory_1").html("");
            $("#ddlCategory,#ddlCategory_1").append(html31).append(html3);
            $("#ddlCategoryFilter").append(html32).append(html3);
            if (roleids == "1") {
                var optiont1 = '<option value="Others" style="font-weight:bold;color:#069;font-size:11px;">ADD NEW CATEGORY</option>';
                $("#ddlCategory_1").append(optiont1);
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
function fnCalculate() {
    var txtUnits = $("#txtUnits").val();
    if (txtUnits == "") {
        $("#txtUnits").val(1);
    }
    var txtprice = $("#txtprice").val();
    if (/[^\d.]/g.test(txtprice)) {
        $("#txtprice").val(txtprice.replace(/[^\d.]/g, ''));
    }
    if ($("#txtprice").val() == "") {
        txtprice = 0;
    }
    var totprice = parseInt($("#txtUnits").val()) * parseFloat(txtprice);
    $("#txtTotal").val(Math.round(totprice));
    $("#txtTotal").attr("title", "Showing round of " + totprice);
}
function fnCalculateunit() {
    var txtUnits = $("#txtUnits").val();
    if (/[^\d.]/g.test(txtUnits)) {
        $("#txtUnits").val(txtUnits.replace(/[^\d.]/g, ''));
    }
    if (txtUnits == "") {
    }
    var txtprice = $("#txtprice").val();
    if ($("#txtprice").val() == "") {
        txtprice = 0;
    }
    var totprice = parseInt($("#txtUnits").val()) * parseFloat(txtprice);
    $("#txtTotal").val(Math.round(totprice));
    $("#txtTotal").attr("title", "Showing round of " + totprice);
}
var uploadprogressflag = false;
$(function () {
    $("#AddExpense").click(function () {
        uploadprogressflag = true;
        var datefrom = "";
        var dateto = "";
        var ddlClient = $("#ddlExpenceClient").val();
        var ddlCase = $("#ddlExpenceCase").val();
        var ddlTeamMember = $("#ddlExpenceTeamMember").val();
        var ddlExpenseType = $("#ddlExpenseType").val();
        if (ddlExpenseType == null) {
            ddlExpenseType = "";
        }
        var ddlCategory = $("#ddlCategory").val();
        var txtprice = $("#txtprice").val();
        var txtUnits = $("#txtUnits").val();
        var txtTotal = $("#txtTotal").val();
        var txtFile = "";
        var txtdate = $("#txtdate").val();
        var txtDescription = $("#txtDescription").val();
        var txtduedate = $("#txtduedate").val();
        var ddlCurrency = $("#ddlCurrency").val();
        //Added as per new requirement
        var txtReceiptDate = $("#txtReceiptDate").val();
        var txtRetainername = $("#txtretainername").val();
        if (txtdate == "") {
            alert("select date");
            $("#txtdate").focus();
            return false;
        }
        if (ddlCurrency == "") {
            alert("select Currency");
            $("#ddlCurrency").focus();
            return false;
        }
        if (ddlCategory == "") {
            alert("Please select the category of expense incurred from the given list or add your own category.");
            $("#ddlExpenseType").focus();
            return false;
        }
        if (ddlCategory == "Others") {
            alert("Please select the category of expense incurred from the given list or add your own category.");
            $("#ddlExpenseType").focus();
            return false;
        }
        if (txtTotal == "") {
            alert("Please enter the total amount of expense incurred for the mentioned category.");
            $("#txtTotal").focus();
            return false;
        }
        var randomeno = Math.floor(Math.random() * 30) + 1;
        var formData = new FormData();
        var filelenght = 0;
        var tempsize = 0;
        var totalFiles = selectedLocalFilesExp.length;
        filelenght = totalFiles
        for (var i = 0; i < totalFiles; i++) {
            var file = selectedLocalFilesExp[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
                return false;
            }
            //const fileList = $('#fileListTMApplication');
            //displaypostedFile(fileName, $("#mykasefileid" + curentmodulefilename).val())
            formData.append("FileUpload", file);
            try {
                if (typeof (file) != "undefined") {
                    size = parseFloat(file.size / 1024).toFixed(2);
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
        formData.append("datefrom", EncodeText(datefrom));
        formData.append("dateto", EncodeText(dateto));
        formData.append("ddlClient", EncodeText($("#exclienthide").val()));
        formData.append("ddlCase", EncodeText(ddlCase));
        formData.append("ddlTeamMember", EncodeText(ddlTeamMember));
        formData.append("ddlExpenseType", EncodeText(ddlExpenseType));
        formData.append("ddlCategory", EncodeText(ddlCategory));
        formData.append("ddlCurrency", EncodeText(ddlCurrency));
        formData.append("txtprice", EncodeText(0));
        formData.append("txtUnits", EncodeText(0));
        formData.append("txtTotal", EncodeText(txtTotal));
        formData.append("txtdate", EncodeText(txtdate));
        formData.append("txtDescription", EncodeText(txtDescription));
        formData.append("expenseid", EncodeText($("#hdnExpenseid").val()));
        formData.append("txtduedate", EncodeText($("#txtduedate").val()));
        formData.append("txtReceiptDate", EncodeText(txtReceiptDate));
        formData.append("txtretainername", EncodeText(txtRetainername));
        // save lavels ajax
        formData.append("savemykasefileid", EncodeText($("#mykasefileidexpense").val()));
        openload();
        $("#AddExpense").attr("disabled", true);
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (e) {
                    if (filelenght == 0) {
                        $(".progress").hide();
                        $("#progressBarstatus").hide();
                    }
                    else {
                        $(".progress").show();
                        $("#progressBarstatus").show();
                        if (e.lengthComputable) {
                            var percent = Math.round((e.loaded / e.total) * 100);
                            $('#progressBar').attr('aria-valuenow', percent - randomeno).css('width', percent - randomeno + '%').text(percent - randomeno + '%');
                        }
                    }
                });
                return xhr;
            },
            type: "POST",
            url: "/api/ExpenseApi/AddExpenseData",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                loadteamleaderexpense();
                $("#AddExpense").removeAttr("disabled");
                $('#attachment').find("*").prop("disabled", true);
                uploadprogressflag = false;
                $(".progress").show();
                if (response1.Data.Result == "Success") {
                    var InfectFilesResult = "";
                    if (response1.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response1.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    ClearForm();
                    $("#hdnExpenseid").val("");
                    $('#progressBar').attr('aria-valuenow', 100).css('width', 100 + '%').text(100 + '%');
                    $("#dirbound").html('');
                    $("#progressBarstatus").hide();
                    $(".progress").hide();
                    new PNotify({
                        title: 'Success!',
                        text: 'Successfully saved</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    Casebyajax("1", "", "");
                    $("#postedFile").val("");
                    $("#mykasefileidexpense").val("");
                    $("#browsefileexpense").attr("title", "No file chosen");
                    $("#browsefilelblexpense").html("No file chosen");
                    LoadExpenseData(pageindex);
                    $("#createExpense_page").hide();
                    $("#main_wrapper_form").show();
                }
                else if (String(response1.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    closeload();
                    return false;
                }
                else if (String(response1.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    closeload();
                    return false;
                }
                else if (response1.Data.Result == "exists") {
                    alert("Already added.");
                }
                else if (response1.Data.Result == "error") {
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
        closeload();
    });
});

/*Load expense team leader*/
function loadteamleaderexpense() {
    $("#ddlExpenceTeamMember").html("");
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
            else {
                //alert("not found");
            }
            var html3 = '';
            $("#ddlExpenceTeamMember").append('<option value="" >Select</option >');
            $.each(obj, function (i, a) {
                if (a.roleid == 1) {
                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                    $("#ddlExpenceTeamMember").append(option);
                }
                else {
                    if (a.IsPartner == 1) {
                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                        $("#ddlExpenceTeamMember").append(option);
                    }
                    else {
                        if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                            $("#ddlExpenceTeamMember").append(option);
                        }
                        else {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                            $("#ddlExpenceTeamMember").append(option);
                        }
                    }
                }
            });
            $("#member").html("");
            $("#member").append(html3);
            $("#member").css("height", "100px !Important");
            return false;
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
function ClearForm() {
    $("#datefrom").val("");
    $("#dateto").val("");
    $("#ddlExpenceClient").val("");
    $("#ddlExpenceCase").val("");
    $("#ddlExpenceTeamMember").find('option:first').attr("selected", "selected")
    $("#ddlExpenseType").val("");
    $("#ddlCategory").val("");
    $("#ddlCurrency").val("");
    $("#txtprice").val("");
    $("#txtUnits").val("");
    $("#txtTotal").val("");
    $("#txtdate,#txtduedate").val("");
    $("#txtDescription").val("");
    $("#txtReceiptDate").val("");
    $("#txtretainername").val("");
}
function calculateColumn(index) {
    var total = 0;
    $('#cexample tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total += value;
        }
    });
    $('#totalamount').text(total);
}
function calculatePaidColumn(index) {
    var total1 = 0;
    $('#cexample tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total1 += value;
        }
    });
    $('#totalpaidamount').text(total1);
}
function calculatebalenceColumn(index) {
    var total2 = 0;
    $('#cexample tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total2 += value;
        }
    });
    $('#totalalanceamount').text(total2);
}
$(document).on("click", "#transferpage", function () {
    var token = $(this).attr("sno");
    var urls = "/" + fcode + "/Firm/StandardCaseList";
    url_redirect({
        url: urls,
        method: "post",
        data: { "token": token }
    });
});
function LoadExpenseData(pageindex) {
    $("#padditem").html("add item");
    $("#AddExpense").html("<img src='/newassets/img/plus-icon.png' /> Add Item");
    $("#tfooter").html("");
    var html3 = ''; var tfot = ''; var tfot1 = '';
    var formdata = new FormData();
    var ddlExpenceClient = $('#ddlExpenceClient').val();
    var ddlExpenceCase = $('#ddlExpenceCase').val();
    var ddlExpenceClient = $('#ddlExpenceClient').val();
    var datefrom = $('#datefrom').val();
    var dateto = $('#dateto').val();
    // var loginid = $("#filteruserdocument").val();
    var loginid = "";
    var client = $("#filterclientexpense").val();
    var categoryfilter = $("#ddlCategoryFilter").val();
    var currencyfilter = $("#ddlCurrencyFilter").val();
    var etypefilter = $("#ddlExpenseTypeFilter").val();
    var ExpenseStatus = $("#ddlExpenseStatusFilter").val();
    var CreatedForFilter = $("#ddlExpenseCreatedForFilter").val();
    loginid = CreatedForFilter;
    //Added as per new requirement
    var txtRetainername = $("#filterretainerName").val();
    var txtdescriptionfilter = $("#expensefilterdescription").val();
    if (client == "null" || client == null || client == "") {
        client = "";
    }
    if (etypefilter == "null" || etypefilter == null || etypefilter == "") {
        etypefilter = "";
    }
    if (categoryfilter == "null" || categoryfilter == null || categoryfilter == "") {
        categoryfilter = "";
    }
    var casename = $("#expensefiltercasename").val();
    formdata.append("pagenum", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("ddlExpenceClient", EncodeText(ddlExpenceClient));
    formdata.append("ddlExpenceCase", EncodeText(ddlExpenceCase));
    formdata.append("datefrom", EncodeText(datefrom));
    formdata.append("dateto", EncodeText(dateto));
    formdata.append("loginid", EncodeText(loginid));
    formdata.append("client", EncodeText(client));
    formdata.append("casename", EncodeText(casename));
    formdata.append("categoryfilter", EncodeText(categoryfilter));
    formdata.append("currencyfilter", EncodeText(currencyfilter));
    formdata.append("etypefilter", EncodeText(etypefilter));
    formdata.append("ExpenseStatus", EncodeText(ExpenseStatus));
    formdata.append("txtRetainername", EncodeText(txtRetainername));
    formdata.append("txtdescriptionfilter", EncodeText(txtdescriptionfilter));
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/ViewExpenseReport",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {

                $("#pdatastatus").hide();
                $("#bindexpense").html("");
                var length = response1.Data.length;
                if (response1.Data.length == 0) {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
                }

                $.each(response1.Data, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
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
                        $("#exportrecords").val(a.totRow);
                        $("#idexpensecount").text(a.totRow);
                        //if (i === 0) {
                        //    firstvalue = a.rownum;
                        //}
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = a.totRow;
                        //    var totpage = 0;
                        //    if (a.totRow > 0) {
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
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>results ' + totdata + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/' + totpage + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>'
                        //    if (a.totRow <= length) { }
                        //    else if (pageno == 1) { }
                        //    else if (pageno == totpage) {
                        //        tfot += '<span> <a class="glyphicon glyphicon-arrow-left" id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"> ' + firstvalue + '-' + a.rownum + '</a></span>'
                        //    }
                        //    else {
                        //        tfot += '<span> <a class="glyphicon glyphicon-arrow-left" id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"> ' + firstvalue + '-' + a.rownum + '</a></span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a class="glyphicon glyphicon-arrow-right" id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"></a></span>'
                        //    }
                        //    tfot += '</li>'
                        //    $("#ulfooter").html(tfot);
                    }
                    var Date = a.dExpensedate;
                    var CASEName = a.Casename;
                    var CLIENTName = a.cfname;
                    var Expensetype = a.ExpenseType;
                    var Category = a.ExpenseCategory;
                    var CurrencyName = a.CurrencyName;
                    if (Category == "null" || Category == null || Category == "") {
                        CurrencyName = "";
                    }
                    if (CurrencyName == "null" || CurrencyName == null || CurrencyName == "") {
                        CurrencyName = "";
                    }
                    if (Expensetype == 0 || Expensetype == "null" || Expensetype == null) {
                        Expensetype = "";
                    }
                    var Description = a.Descriptions;
                    var Price = a.Price_Rate;
                    var Unit = a.Units;
                    var Total = a.Total;
                    var Receipt = a.UploadReceipt;
                    var expenseid = a.ExpenseId;
                    var ReceivedTotal = a.PaidAmt;
                    var FinalTotal = parseFloat(a.Total) - parseFloat(a.PaidAmt);
                    var duedate = a.duedate;
                    if (String(duedate) == "null" || String(duedate) == null || duedate == "") {
                        duedate = "";
                    }
                    else {
                        duedate = formatDatetoIST(a.duedate);
                    }
                    if (String(a.isSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    html3 += '<tr>'
                    html3 += '<td>'
                    html3 += '<input id=chkEId_' + expenseid + ' class="checkbox" type="checkbox" value="' + expenseid + '">'
                    html3 += '</td>'
                    html3 += '<td class="eDate">'
                    html3 += '<span name="Date" id="clname" >' + formatDatetoIST(Date) + '</span><i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                    html3 += '</td>'
                    html3 += '<td class="eCaseName">'
                    html3 += '<span id="clname" ><a style="text-decoration:none; color:#1F2937;" name="' + CASEName + '"  id="transferpage" href="javascript: void ()" sno=' + a.Caseid + '>' + CASEName + '</a></span><i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                    html3 += '</td>'
                    html3 += '<td class="eCategory">'
                    html3 += '<span id="clname" >' + Category + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="Retainername">'
                    html3 += '<span id="Retainername" >' + a.Retainername + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eTotalPayment">'
                    html3 += '' + a.Total + ''
                    html3 += '</td>'
                    html3 += '<td class="ePayReceived">'
                    html3 += '<span>' + a.PaidAmt + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eTotal">'
                    html3 += '' + FinalTotal + ''
                    html3 += '</td>'
                    html3 += '<td class="eDescription">'
                    html3 += '<span id="clname" >' + Description + '</span>'
                    html3 += '</td>'
                    if (a.IsExpensePaid == 1) {
                        html3 += '<td class="eexpstatus" style="text-align:center">'
                        html3 += '<div class="status_badge"><span class="paid" title="Payment Paid"></span>' + a.ExpenseStatus + '</div>';
                        html3 += '</td>'
                    }
                    else {
                        html3 += '<td class="eexpstatus" style="text-align:center">'
                        html3 += '<div class="status_badge"><span class="unPaid" title="Payment Unpaid"></span>' + a.ExpenseStatus + '</div>'
                        html3 += '</td>'
                    }
                    html3 += '<td class="eClientName">'
                    html3 += '<span id="clname" >' + CLIENTName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eExpenseType">'
                    html3 += '<span id="clname" >' + Expensetype + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eCurrency">'
                    html3 += '<span id="clname" >' + CurrencyName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eDueDate">'
                    html3 += '<span>' + duedate + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="createdby">'
                    html3 += '<span id="createdby" >' + a.CreatedBy + '</span>'
                    html3 += '</td>'
                    if (a.DocsCount > 0) {
                        html3 += '<td class="eReceipt">'
                        html3 += '<button type="button" class="btn  btn-sm" id-val="' + expenseid + '" id="filelink"><i class="glyphicon glyphicon-folder-open"></i></button>'
                        html3 += '</td>'

                    }
                    else {
                        html3 += '<td class="eReceipt">'
                        html3 += '</td>'
                    }
                    html3 += '<td class="createdfor">'
                    html3 += '<span id="createdfor" >' + a.MemberName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eCreatedOn">'
                    html3 += '<span name="eCreatedOn" id="CreatedOn" >' + formatDatetoIST(a.CreatedOn) + '</span><i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                    html3 += '</td>'
                    html3 += '<td class="eEditedOn">'
                    html3 += '<span name="eEditedOn" id="eEditedOn" >' + formatDatetoIST(a.LastupdatedOn) + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="ReceiptDate">'
                    html3 += '<span name="ReceiptDate">' + formatDatetoIST(a.ReceiptDate) + '</span>'
                    html3 += '</td>'
                    html3 += '<td>';
                    if (a.oedit == 1 || roleids == 1) {
                        html3 += '<ul class="table_action">';
                        html3 += '<li> <button type="button" id="EditExpenseData" class="taskoutboxbtnicon" title="Edit Expense" style="cursor: pointer; color: #0059c1;" token="' + expenseid + '"><img src="/newassets/img/edit.svg"></button></li>'
                            ;
                    }
                    if (a.oedit == 1 || a.create == 1 || roleids == 1) {
                        html3 += '<li><button class="taskoutboxbtnicon" title="Pay Expense" id="PayExpense" style="cursor:pointer;" token="' + expenseid + '"> <img src="/newassets/img/currency-rupee.svg"></button></li>';
                    }
                    if (a.odelete == 1 || roleids == 1) {
                        html3 += ' <li><div class="input-group-btn"><button class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/newassets/img/dots-vertical.svg" alt="action button"></button><ul class="dropdown-menu">'
                        if (a.DocsCount > 0) {
                            html3 += '<li><a href="#" id-val="' + expenseid + '" id="filelink"> <img src="/newassets/img/folder.svg" alt="receiptBtn"> Receipt</a></li>';
                        }
                        html3 += ' <li><a id="RemoveData" token="' + expenseid + '" title="Delete" href="#"><img src="/newassets/img/darkdelete.svg" alt="action button"> Delete</a></li>';

                        html3 += ' </ul></div> </li>'
                    }

                    html3 += '</ul>';
                    html3 += '</td>';
                    html3 += '</tr>'
                });
                $("#bindexpense").html("");
                $("#bindexpense").append(html3);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                var clientfilterval = "";
                if ($("#filterclientexpense").val() == "null" || $("#filterclientexpense").val() == null || $("#filterclientexpense").val() == "") {
                    clientfilterval = "";
                }
                else {
                    clientfilterval = $("#filterclientexpense").val();
                }
                $("#pdatastatus").hide();
                calculateColumn(5);
                calculatePaidColumn(6);
                calculatebalenceColumn(7);
                closeload();
            }
            else {
                $("#pdatastatus").show();
                $("#Expensepagination").hide();
                $("#totalamount").text(0);
                $("#totalpaidamount").text(0);
                $("#totalalanceamount").text(0);
                $("#bindexpense").html(html3);
                $("#ulfooter").html("");
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
//    LoadExpenseData(setPageNo);
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
    LoadExpenseData(setPageNo);
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
//    LoadExpenseData(setPageNo);
//    $(".page-btn").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});
$(document).on("click", "#prev", function () {

    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = false;
    $("#txtgopage").val("");
    //renderPagination(setPageNo, totalPageRec)
    LoadExpenseData(setPageNo);
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
//    LoadExpenseData(setPageNo);
//    $(".page-btn").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    loadflag = true;
    isRenderPage = false;
    $("#txtgopage").val("");
    LoadExpenseData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
//$(document).on("click", "#divGo", function () {
//    let goToPage = parseInt($("#txtgopage").val());
//    if (!isNaN(goToPage)) {
//        setPageNo = goToPage;
//    }
//    loadflag = true;
//    isRenderPage = true;
//    LoadExpenseData(setPageNo);
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
    LoadExpenseData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/
/*Select all*/
$(document).on('click', '#chkSelectAll', function () {
    var formdata = new FormData();
    var ddlExpenceClient = $('#ddlExpenceClient').val();
    var ddlExpenceCase = $('#ddlExpenceCase').val();
    var ddlExpenceClient = $('#ddlExpenceClient').val();
    var datefrom = $('#datefrom').val();
    var dateto = $('#dateto').val();
    formdata.append("pagenum", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("ddlExpenceClient", EncodeText(ddlExpenceClient));
    formdata.append("ddlExpenceCase", EncodeText(ddlExpenceCase));
    formdata.append("datefrom", EncodeText(datefrom));
    formdata.append("dateto", EncodeText(dateto));
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/ViewExpenseReport",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkEId = 'chkEId_';
                $.each(response1.Data, function (i, a) {
                    var id = a.ExpenseId;
                    document.getElementById(chkEId + id).checked = true;
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/ViewExpenseReport",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkEId = 'chkEId_';
                $.each(response1.Data, function (i, a) {
                    var id = a.ExpenseId;
                    document.getElementById(chkEId + id).checked = false;
                });
            }
        });
    }
});
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});

/*Remove expense selected data*/
function RemoveSelectedData(val) {
    var formData = new FormData();
    formData.append("expenseid", val);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/RemovExpenseData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "Success") {
                alert("Successfully deleted");
                LoadExpenseData(pageindex);
            }
            else if (response1.Data == "error") {
                alert("Oops! Something went wrong..");
            }
        }
    });
}
$(document).on('click', '#paginate', function () {
    cpageindex = $(this).attr("index");
    LoadExpenseData(cpageindex);
});
//$(document).on('change', '#filteruserdocument', function () {
//    LoadExpenseData(1);
//});
/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}
/*Get All Matter By FirmId*/
function Casebyajax(morepageno6, expenseclienthide, companyIdas) {
    var clientid = $("#ddlExpenceClient").val();
    if (clientid == "") {
        clientid = "00000000-0000-0000-0000-000000000000";
    }
    $('#ddlExpenceCase').empty().append('<option value="">Select</option>').find('option:first').attr("selected", "selected");

    var formData = new FormData();
    formData.append("Pageno", morepageno6);
    formData.append("clientid", expenseclienthide);
    formData.append("companyids", companyIdas);
    openload();
    $.ajax({
        async: true,
        url: "/api/callApi/LoadAllMatterByFirmId",
        type: "POST",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            else {
                //alert("not found");
            }
            $.each(response.Data, function (i, a) {
                var mattername = a.mname;
                var mid = a.Id;
                if (response.Data.length == a.totRow) {
                    $("#casemoreoptiondivexp").hide();
                } else {
                    if (a.totRow > 500) {
                        $("#casemoreoptiondivexp").show();
                    }
                    else {
                        $("#casemoreoptiondivexp").hide();
                    }
                }
                if (mattername == null) {
                    mattername = "";
                    mid = "";
                }
                else {
                    var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                    $("#ddlExpenceCase").append(option);
                }
                closeload();
            });
            closeload();
        },
        failure: function (response) {
            alert(data.responseText);
            closeload();
        },
        error: function (response) {
            alert(data.responseText);
        }
    });
}


$(document).on("change", "#postedFile", function (e) {
    const files = Array.from(this.files || []);
    if (!files.length) return;

    selectedLocalFilesExp.push(...files);
    renderAllFilesExp();

    this.value = ""; // allow reselect same file
});
//$(document).on('change', '#postedFile', function (e) {
//    selectedpostedFile = [];
//    var fileCount = this.files.length;
//    if (fileCount > 0) {
//        $("#dropContainer").attr("title", "Document Attached");
//    }
//    else {
//        $("#dropContainer").attr("title", "upload Attachment");
//    }

//    const files = Array.from(e.target.files);
//    selectedpostedFile = [...selectedpostedFile, ...files];
//    displaypostedFile();
//});

//$(document).on('click', '.remove-file-postedFile', function () {
//    const index = $(this).data('index');
//    selectedLocalFilesExp.splice(index, 1);
//    displaypostedFile();
//});

//function displaypostedFile() {
//    const fileList = $('#fileListTMApplication');
//    fileList.empty();
//    const fCount = selectedpostedFile.length;
//    selectedpostedFile.slice(0, 5).forEach((file, index) => {
//        const fileItem = $(`
//            <div class="file-item">
//                <span class="file-name">${file.name}</span>
//                <span class="remove-file-postedFile" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
//            </div>
//        `);
//        fileList.append(fileItem);
//    });
//    if (fCount > 5) {
//        const remaining = fCount - 5;
//        fileList.append(`
//            <div class="file-summary" style="margin-top:5px;color:#555;">
//                +${remaining} more (Total ${fCount} files selected)
//            </div>
//        `);
//    }
//    updatepostedFileInput();
//}

$(document).on('click', '.remove-local-Exp', function () {
    const index = Number($(this).data('index'));
    selectedLocalFilesExp.splice(index, 1);
    renderAllFilesExp();
});

$(document).on('click', '.remove-server-Exp', function () {
    const index = Number($(this).data('index'));
    const removed = selectedServerFilesExp.splice(index, 1)[0];
    renderAllFilesExp();

    // ✅ If you need to also remove it on backend, call your API here:
    // if (removed?.id) deleteServerFile(removed.id);
});
function displayExistingAddExpense(fileName, fileId) {
    if (!fileName) return;

    // Optional: prevent duplicates by name+id
    const exists = selectedServerFilesExp.some(x =>
        (fileId && x.id === fileId) || (!fileId && x.name === fileName)
    );
    if (!exists) selectedServerFilesExp.push({ id: fileId || null, name: fileName });

    renderAllFilesExp();
    //const fileList = $('#CommfileList');
    ////fileList.empty();
    //if (fileName) {
    //    const fileItem = `
    //   <div class="file-item">
    //            <span class="file-name">${fileName}</span>
    //            <span class="remove-file-add-comm" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
    //        </div>
    //`;

    //    fileList.append(fileItem);
    //    $("#dropContainer").attr("title", "Document Attached");
    //    //$('#uploadTimerDiv').hide();
    //}
    //updateFileInputExp();
}

function updateFileInputExp() {
    const dt = new DataTransfer();
    selectedLocalFilesExp.forEach(file => dt.items.add(file));
    document.getElementById('postedFile').files = dt.files;
}
//function updatepostedFileInput() {
//    const dt = new DataTransfer();
//    selectedpostedFile.forEach(file => dt.items.add(file));
//    document.getElementById('postedFile').files = dt.files;
//}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}



function renderAllFilesExp() {
    console.log("LOCAL:", selectedLocalFilesExp.map(x => x.name));
    console.log("SERVER:", selectedServerFilesExp.map(x => x.name));
    console.log("renderAllFilesExp called", selectedLocalFilesExp.length, selectedServerFilesExp.length);
    const fileList = $('#fileListTMApplication');
    fileList.empty(); // ✅ clear UI only

    // 1) Local files
    selectedLocalFilesExp.forEach((file, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(file.name)}</span>
                <span class="remove-file remove-local-Exp" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });

    // 2) Server files
    selectedServerFilesExp.forEach((f, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(f.name)}</span>
                <span class="remove-file remove-server-Exp" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });

    // Title update
    const total = selectedLocalFilesExp.length + selectedServerFilesExp.length;
    $("#dropContainer").attr("title", total > 0 ? "Document Attached" : "upload Attachment");

    updateFileInputExp(); // ✅ updates only local input files
}

//function clearpostedFileUpload() {
//    selectedpostedFile = [];
//    const fileInput = document.getElementById("postedFile");
//    if (fileInput) fileInput.value = "";
//    $('#fileListTMApplication').empty();
//    $("#dropContainer").attr("title", "Upload Attachment");
//}