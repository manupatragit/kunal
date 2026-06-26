var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('IP');
var copyrightEmailvalidation = true;
var copyrightPhonenovalidation = true;

$(document).ready(function () {
    var id = sessionStorage.getItem('iprcaseid');
    if (myParam === '1' && id != '' && id != null)
    {
        FillFormById(id);
        $('#btnsave').text('Update Manual Trademark');
    }
    //Copyright, Patent, GI, Design Docs Upload 
    const CopyrightFileUpload = initFileUpload({
        inputId: "fileCopyrightAppForm",
        listContainerId: "fileListCopyrightApp",
        removeBtnClass: "remove-file-copyrightApp",
        maxVisible: 5
    });
    const CopyrightFileUpload1 = initFileUpload({
        inputId: "fileUploadDocuments",
        listContainerId: "fileListCopyrightDocs",
        removeBtnClass: "remove-file-copyrightAppDocs",
        maxVisible: 5
    });

    $(document).on('click', '#btnReset', function () {
        $('#ipraddform')[0].reset();
        clearuploadedFile();
        clearpostedFileUpload();
        CopyrightFileUpload.clear();
        CopyrightFileUpload1.clear();
    });

    // Copyright Part handling 
    if (myParam == 2 && id != '' && id != null) {
        IPRCategoryMyList();
        FillCopyrightFormById(id);
        $('#btnsave').text('Update Manual Copyright');
    }
    if (myParam == '2' && (id == '' || id == null))
    {
        IPRCategoryMyList();
    }
    // Patent Part handling 
    if (myParam == 3 && id != '' && id != null) {
        IPRPatentMyList();
        FillPatentFormById(id);
        $('#btnsave').text('Update Manual Patent');
    }
    if (myParam == '3' && (id == '' || id == null)) {
        IPRPatentMyList();
    }
    // GI Part Handling 
    if (myParam == 4 && id != '' && id != null) {
        IPRGIMyList();
        FillGIFormById(id);
        $('#btnsave').text('Update Manual GI');
    }
    if (myParam == '4' && (id == '' || id == null)) {
        IPRGIMyList();
    }
    // Design Part Handling 
    if (myParam == 5 && id != '' && id != null) {
        IPRDesignMyList();
        FillDesignFormById(id);
        $('#btnsave').text('Update Manual Design');
    }
    if (myParam == '5' && (id == '' || id == null)) {
        IPRDesignMyList();
    }
});
function FillFormById(iid)
{
    var formData = new FormData();
    formData.append('iid',iid);
    openload();
    $.ajax({
        async: false,
        type: "POST",
        url: "/api/IPRApi/ViewIPRCaseById",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var Data = response.Data.data;
            var applicantAddress = Data[0].Applicant_Address;
            var applicantCountry = Data[0].Applicant_Country;
            var applicantDistrict = Data[0].Applicant_District;
            var applicantEmail = Data[0].Applicant_EmailId;
            var applicantName = Data[0].Applicant_Name;
            var applicantPhone = Data[0].Applicant_PhoneNo;
            var applicantState = Data[0].Applicant_State;
            var applicantType = Data[0].Applicant_Type;
            var CategoryOfMark = Data[0].Category_of_Mark;
            var vClass = Data[0].Class;
            var LegalStatus = Data[0].Legal_Status;
            var MarkOfTitle = Data[0].Mark_of_Title;
            var Priority = Data[0].Priority;
            var UseOfMark = Data[0].Use_Of_Mark;
            var iprDate = Data[0].vUsedSince;
            var conditions = Data[0].Conditions;

            $('#txtname').val(applicantName);
            $('#txtAddress').val(applicantAddress);
            $('#txtCountry').val(applicantCountry);
            $('#txtState').val(applicantState);
            $('#txtDistrict').val(applicantDistrict);
            $('#txtEmailId').val(applicantEmail);
            $('#txtPhoneNo').val(applicantPhone);
            $('#txtLegalStatus').val(LegalStatus);
            $('#ddlCategoryOfMark').val(CategoryOfMark);
            $('#txttrademark').val(MarkOfTitle);
            $('#txtConditionsLimitations').val(conditions);
            $('#ddlPriority').val(Priority);
            $('#ddlApplicantType').val(applicantType);
            $('#txtclass').val(vClass);
            $('#ddlUseOfMark').val(UseOfMark);
            $('#iprDate').val(iprDate);
            if (UseOfMark == "User Detail") $("#iprDate").css({ display: "block" });
            closeload();
        },
        failure: function (response) {
            alert('Code failed due to incorrect logic');
            closeload();
        },
        error: function (response) {
            alert('An error occurred');
            closeload();
        }
    });
}

function FillCopyrightFormById(iid) {
    var formData = new FormData();
    formData.append('iid', iid);
    formData.append('iptypeid', myParam);
    openload();
    $.ajax({
        async: false,
        type: "POST",
        url: "/api/IPRApi/ViewCopyrightIPRById",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var Data = response.Data.data;
            var ApplicantCat_Name = Data[0].ApplicantCat_Name;
            var ApplicantCat_Address = Data[0].ApplicantCat_Address;
            var Title_Work = Data[0].Title_Work;
            var Diary_No = Data[0].Diary_No;
            var Roc_No = Data[0].Roc_No;
            var Category = Data[0].Category;
            var dDate = Data[0].dDate;

            $('#txtApplicantName').val(ApplicantCat_Name);
            $('#txtAddress1').val(ApplicantCat_Address);
            $('#txtTitleOfWork').val(Title_Work);
            $('#txtDiaryNo').val(Diary_No);
            $('#txtRocNo').val(Roc_No);
            $('#txtCategory').val(Category);           
            $('#txtCalendarView').val(dDate);
            closeload();
        },
        failure: function (response) {
            alert('Code failed due to incorrect logic');
            closeload();
        },
        error: function (response) {
            alert('An error occurred');
            closeload();
        }
    });
}
$(document).on('click', "#backtoHome", function () {
    window.location.href = `/${fcode}/IPR/ViewIPRCase?IP=${myParam}`;
})
function FillPatentFormById(iid) {
    var formData = new FormData();
    formData.append('iid', iid);
    formData.append('iptypeid', myParam);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/ViewPatentIPRById",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var Data = response.Data.data;
            var ApplicantName = Data[0].ApplicantName;
            var ApplicationNo = Data[0].ApplicationNo;
            var PublicationDate = Data[0].PublicationDate;
            var FilingDate = Data[0].FilingDate;
            var TitleOfInvention = Data[0].TitleOfInvention;
            var InternationalClassification = Data[0].InternationalClassification;
            var PriorityDocumentNo = Data[0].PriorityDocumentNo;
            var PriorityDate = Data[0].PriorityDate;
            var PriorityCountry = Data[0].PriorityCountry;
            var InternationalApplicationNo = Data[0].InternationalApplicationNo;
            var InternationalFilingDate = Data[0].InternationalFilingDate;
            var InternationalPublicationNo = Data[0].InternationalPublicationNo;
            var PatentAdditionNo = Data[0].PatentAdditionNo;
            var FilingDatePatentAddition = Data[0].FilingDatePatentAddition;
            var DivisionalNo = Data[0].DivisionalNo;
            var FilingDateInventor = Data[0].FilingDateInventor;
            var InventorName = Data[0].InventorName;
            var Abstract = Data[0].Abstract;
            var NoOfPages = Data[0].NoOfPages;
            var NoOfClaims = Data[0].NoOfClaims;
            var PatentOfficeJournal = Data[0].PatentOfficeJournal;

            $('#ApplicantName').val(ApplicantName);
            $('#ApplicationNo').val(ApplicationNo);
            $('#PublicationDate').val(PublicationDate);
            $('#FilingDate').val(FilingDate);
            $('#TitleOfInvention').val(TitleOfInvention);
            $('#InternationalClassification').val(InternationalClassification);
            $('#PriorityDocumentNo').val(PriorityDocumentNo);
            $('#PriorityDate').val(PriorityDate);
            $('#PriorityCountry').val(PriorityCountry);
            $('#InternationalApplicationNo').val(InternationalApplicationNo);
            $('#InternationalFilingDate').val(InternationalFilingDate);
            $('#InternationalPublicationNo').val(InternationalPublicationNo);
            $('#PatentAdditionNo').val(PatentAdditionNo);
            $('#FilingDatePatentAddition').val(FilingDatePatentAddition);
            $('#DivisionalNo').val(DivisionalNo);
            $('#FilingDateInventor').val(FilingDateInventor);
            $('#InventorName').val(InventorName);
            $('#Abstract').val(Abstract);
            $('#NoOfPages').val(NoOfPages);
            $('#NoOfClaims').val(NoOfClaims);
            $('#PatentOfficeJournal').val(PatentOfficeJournal);
            closeload();
        },
        failure: function (response) {
            alert('Code failed due to incorrect logic');
            closeload();
        },
        error: function (response) {
            alert('An error occurred');
            closeload();
        }
    });
}

function FillGIFormById(iid) {
    var formData = new FormData();
    formData.append('iid', iid);
    formData.append('iptypeid', myParam);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/ViewGIIPRById",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var Data = response.Data.data;
            var ApplicantName = Data[0].ApplicantName;
            var ApplicantAddress = Data[0].ApplicantAddress;
            var ApplicationNo = Data[0].ApplicationNo;
            var GIName = Data[0].GIName;
            var GIDate = ConvertGIDate(Data[0].GIDate);
            var Class = Data[0].Class;
            var Goods = Data[0].Goods;
            var Specifications = Data[0].Specifications;

            $('#ApplicantName').val(ApplicantName);
            $('#ApplicantAddress').val(ApplicantAddress);
            $('#ApplicationNo').val(ApplicationNo);
            $('#GIName').val(GIName);
            $('#GIDate').val(GIDate);
            $('#Class').val(Class);
            $('#Goods').val(Goods);
            $('#Specifications').val(Specifications);
            closeload();
        },
        failure: function (response) {
            alert('Code failed due to incorrect logic');
            closeload();
        },
        error: function (response) {
            alert('An error occurred');
            closeload();
        }
    });
}

function FillDesignFormById(iid) {
    var formData = new FormData();
    formData.append('iid', iid);
    formData.append('iptypeid', myParam);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/ViewDesignIPRById",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var Data = response.Data.data;
            var ApplicantName = Data[0].ApplicantName;
            var ApplicantAddress = Data[0].ApplicantAddress;
            var Title = Data[0].Title;
            var DesignNumber = Data[0].DesignNumber;
            var Class = Data[0].Class;
            var dDate = Data[0].dDate;
            var JournalNumber = Data[0].JournalNumber;
            var PriorityNumber = Data[0].PriorityNumber;
            var PriorityDate = Data[0].PriorityDate;
            var PriorityCountry = Data[0].PriorityCountry;

            $('#ApplicantName').val(ApplicantName);
            $('#ApplicantAddress').val(ApplicantAddress);
            $('#Title').val(Title);
            $('#DesignNumber').val(DesignNumber);
            $('#Class').val(Class);
            $('#dDate').val(dDate);
            $('#JournalNumber').val(JournalNumber);
            $('#PriorityNumber').val(PriorityNumber);
            $('#PriorityDate').val(PriorityDate);
            $('#PriorityCountry').val(PriorityCountry);
            closeload();
        },
        failure: function (response) {
            alert('Code failed due to incorrect logic');
            closeload();
        },
        error: function (response) {
            alert('An error occurred');
            closeload();
        }
    });
}

$(document).on('change', '#ddlCategoryOfMark', function () {
    var vall = $("#ddlCategoryOfMark option:selected").val();

    $("#UploadImgMark1").toggle(["2", "3", "4", "6"].includes(vall));
    $("#UploadSoundMark1").toggle(vall == "5");
    $("#txtDescription1").toggle(["2", "3", "4", "5", "6"].includes(vall));
});

$(document).ready(function () {
    dynaheader();
    drpipTypebind();
    $('form[id="ipraddform"]').validate({
        submitHandler: function (form) {
            if (myParam == '2') {
                submitcopyrightIPR();
            } else if (myParam == '3') {
                submitPatenttIPR();
            } else if (myParam == '4') {
                submitGIIPR();
            } else if (myParam == '5') {
                submitDesignIPR();
            } else {
                var id = sessionStorage.getItem('iprcaseid');
                var iptype = 'TradeMark';
                var Applicantdetail = $("#ddlApplicantdetail").val();
                var ddlApplicantType = $("#ddlApplicantType").val();
                var name = $('#txtname').val().trim();
                var Address = $('#txtAddress').val();
                var Country = $('#txtCountry').val();
                var State = $('#txtState').val();
                var District = $('#txtDistrict').val();
                var EmailId = $('#txtEmailId').val();
                var PhoneNo = $('#txtPhoneNo').val();
                var LegalStatus = $('#txtLegalStatus').val();
                var UseOfMark = $('#ddlUseOfMark').val();
                var CategoryOfMark = $('#ddlCategoryOfMark').val();
                var trademark = $('#txttrademark').val();
                var ConditionsLimitations = $('#txtConditionsLimitations').val();
                var txtclass = $('#txtclass').val();
                var Priority = $('#ddlPriority').val();
                var ImageDes = $('#txtDescription').val();
                var IPRDate = $('#iprDate').val();
                if (!validatePhoneno(PhoneNo) || !validateEmail(EmailId)) {
                    return false;
                }
                if (name === '') {
                    alert("Please fill the 'Name' textbox!");
                    return false;
                }

                var formData = new FormData();
                var tempsize = 0;
                var tottempsize = 0;

                var totalFiles = document.getElementById("postedFile").files.length;

                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("postedFile").files[i];
                    var filename = file.name;
                    var fileNameIndex = filename.lastIndexOf("/") + 1;
                    var dotIndex = filename.lastIndexOf('.');

                    var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                    var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                    if (reg.test(newfilename) == true) {
                        alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                        return false;
                    }
                    if (filename.length > 100) {
                        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                        return false;
                    }
                    var Extresponse = checkfileextDOC(filename);
                    if (String(Extresponse) == "false") {
                        return false;
                    }

                    formData.append("FilePosted[" + i + "]", file);

                    try {

                        if (typeof (file) != "undefined") {
                            size = parseFloat(file.size / 1024).toFixed(2);
                            tottempsize = parseFloat(tottempsize) + parseFloat(size);
                            tempsize = parseFloat(size);
                        }
                    }
                    catch (err) {
                    }

                    tempsize = tempsize.toFixed(2);
                    var filesize = 5120
                    if (tempsize > filesize) {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Maximum File size 5MB Allowed for each File',
                            type: 'error',
                            delay: 3000
                        });
                        return false
                    }
                }

                var files = document.getElementById("uploadedFile").files.length;

                for (var i = 0; i < files; i++) {
                    var file = document.getElementById("uploadedFile").files[i];
                    var filename = file.name;

                    var fileNameIndex = filename.lastIndexOf("/") + 1;
                    var dotIndex = filename.lastIndexOf('.');

                    var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                    var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                    if (reg.test(newfilename) == true) {
                        alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                        return false;
                    }
                    if (filename.length > 100) {
                        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                        return false;
                    }
                    var Extresponse = checkfileextDOC(filename);
                    if (String(Extresponse) == "false") {
                        return false;
                    }

                    formData.append("FileUpload[" + i + "]", file);

                    try {
                        if (typeof (file) != "undefined") {
                            size = parseFloat(file.size / 1024).toFixed(2);
                            tottempsize = parseFloat(tottempsize) + parseFloat(size);
                            tempsize = parseFloat(size);
                        }
                    }
                    catch (err) {
                    }

                    tempsize = tempsize.toFixed(2);
                    var filesize = 5120
                    if (tempsize > filesize) {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Maximum File size 5MB Allowed for each File',
                            type: 'error',
                            delay: 3000
                        });
                        return false
                    }
                }

                openload();
                formData.append("hidden", EncodeText(id));
                formData.append("iptype", EncodeText(iptype));
                formData.append("Applicantdetail", EncodeText(Applicantdetail));
                formData.append("ddlApplicantType", EncodeText(ddlApplicantType));
                formData.append("name", EncodeText(name));
                formData.append("Address", EncodeText(Address));
                formData.append("Country", EncodeText(Country));
                formData.append("State", EncodeText(State));
                formData.append("District", EncodeText(District));
                formData.append("EmailId", EncodeText(EmailId));
                formData.append("PhoneNo", EncodeText(PhoneNo));
                formData.append("LegalStatus", EncodeText(LegalStatus));
                formData.append("UseOfMark", EncodeText(UseOfMark));
                formData.append("CategoryOfMark", EncodeText(CategoryOfMark));
                formData.append("trademark", EncodeText(trademark));
                formData.append("ConditionsLimitations", EncodeText(ConditionsLimitations));
                formData.append("txtclass", EncodeText(txtclass));
                formData.append("Priority", EncodeText(Priority));
                formData.append("ImageDes", EncodeText(ImageDes));
                formData.append("IPRDate", EncodeText(IPRDate));
                formData.append("ip", EncodeText(myParam));

                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/api/IPRApi/CreateIPRCase",
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (!response.Data.Status) {
                            alert(response.Data.data);
                        }
                        else {
                            //alert('Your information has been successfully recorded');
                            new PNotify({
                                title: 'Success!',
                                text: 'Your information has been successfully recorded',
                                type: 'success',
                                delay: 3000
                            });
                            sessionStorage.removeItem('iprcaseid');
                            //alert(data.Data.data.message);
                            if (response.Data.data == null || response.Data.data == "null") {
                                alert("There was an error while adding your IPR Case.....");
                                closeload();
                                false;
                            }
                            var firmcode = localStorage.getItem("FirmCode");
                            window.location.href = "/" + firmcode + "/IPR/ViewIPRCase?IP=" + myParam;
                        }
                        closeload();
                    },
                    failure: function (data) {
                        alert(data.message);
                        closeload();
                    },
                    error: function (data) {
                        alert(data.message);
                        closeload();
                    }
                });
            }
        }
    });
});

$(document).on('change', '#ddlUseOfMark', function () {
    if ($("#ddlUseOfMark").val() == "User Detail") {
        $("#iprDate").css({ display: "none" });
    }
    else {
        $("#iprDate").css({ display: "none" });
    }
});

function dynaheader() {
    if (myParam == "1") {
        $('#dynamicnotiheader').text('Add Trademark Manually');
    }
    if (myParam == "2") {
        $('#dynamicnotiheader').text('Add Copyright Manually');
    }
    if (myParam == "3") {
        $('#dynamicnotiheader').text('Add Patent Manually');
    }
    if (myParam == "4") {
        $('#dynamicnotiheader').text('Add GI Manually');
    }
    if (myParam == "5") {
        $('#dynamicnotiheader').text('Add Design Manually');
    }
}

function drpipTypebind() {

    $('#iptype').empty();

    if (myParam == "1") {

        $('#iptype').append('<option value="">Please Select</option>');
        $('#iptype').append('<option value="TradeMark">Trademark</option>');
    }

    if (myParam == "2") {

        $('#iptype').append('<option value="">Please Select</option>');
        $('#iptype').append('<option value="Copyright">Copyright</option>');
    }

    if (myParam == "3") {
        $('#iptype').append('<option value="">Please Select</option>');
        $('#iptype').append('<option value="Patent">Patent</option>');
    }

    if (myParam == "4") {
        $('#iptype').append('<option value="">Please Select</option>');
        $('#iptype').append('<option value="GeographicalIndication">Geographical Indication</option>');
    }

    if (myParam == "5") {
        $('#iptype').append('<option value="">Please Select</option>');
        $('#iptype').append('<option value="Design">Design</option>');
    }
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Patent Page xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function emptyForm()
{
    if (myParam != "1")
    {
        $('#ipraddform').empty();
    }
}

function fillFormForPatent()
{
    if (myParam != 1)
    {
        //if (myParam == "2")
        //{
        //    var conten1 = `<input type="hidden" value="" id="hiddenid"><div class="row"><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">IP Type<span class="required" aria-required="true" style="color:red"><b>*</b></span></span></label><select class="selctInputFormat" id="iptype"><option value="">Please Select</option><option value="Copyright">Copyright</option></select>`;

        //    var content2 = ``

        //    $('#ipraddform').append(conten1);
        //}

        if (myParam == "3") {

            var conten1 = `<input type="hidden" value="" id="hiddenid"><div class="row"><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">IP Type<span class="required" aria-required="true"><b>*</b></span></span></label><select class="selctInputFormat" id="iptype"><option value="">Please Select</option><option value="Patent">Patent</option></select></div></div>`;

            var content2 = `<div class="row"><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Client/Applicant's Name</span></label><textarea type="text" class="inputFormat" id="txtConditionsLimitations"></textarea></div></div><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Patent Title</span></label><textarea type="text" class="inputFormat" id="txtConditionsLimitations"></textarea></div></div><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Application Number</span></label><input class="inputFormat" type="number" id="quantity" name="quantity"></div></div></div>`;

            var content3 = `<div class="row"><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select class="selctInputFormat" id="searchstatusforPatent"></select></div></div><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Date Of Application</span></label><input class="inputFormat valid" type="date" id="doa" placeholder="yyyy-mm-dd"></div></div><div class="col-md-4"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Date Of Application</span></label><input class="inputFormat valid" type="date" id="priorityDate" placeholder="yyyy-mm-dd"></div></div></div>`;

            var content4 = ``;

            $('#ipraddform').append(conten1, content2, content3);
        }
    }
}

function GetStatusListForPatent() {

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/IPRApi/FetchPatentStatus",
        success: function (response) {
            var obj = JSON.parse(response.Data.data);
            var obj1 = obj.data;
            $("#searchstatusforPatent").html("");
            //  $("#searchstatus").append("<option value=''>Select</option>");
            $(".ms-selectall").show();
            $("#searchstatusforPatent").append($("<option></option>").val('').text('Select Status'));
            $.each(obj1, function (i, b) {


                $("#searchstatusforPatent").append($("<option></option>").val(b.StatusId).text(b.StatusName));

            });
            /*$("#searchstatusforPatent").multiselect('reload');*/
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Copyright Page xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function IPRCategoryMyList() {
    var existingForm = $('#ipraddform');
    if (existingForm.length > 0) {
        existingForm.empty();
    } else {
        // Create a new form if it doesn't exist
        existingForm = $('<form>').addClass('ec_bg').attr({
            'enctype': 'multipart/form-data',
            'autocomplete': 'off',
            'id': 'ipraddform'
        });
        $('.container-main').append(existingForm);
    }

    existingForm.append('<input type="hidden" value="" id="hiddenid" />');
    var newRow1 = $('<div class="row rowPurse">');
    newRow1.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Applicant Details<span class="required " aria-required="true"><b> *</b> </span></h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">
                            Applicant name
                            <span class="required" aria-required="true"><b>&nbsp;*</b></span>
                        </span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Add Applicant Name" id="txtApplicantName" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Address</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Add Applicant Address" id="txtAddress1" />
                </div>
            </div>
           
        </div>
    </div>
`);

    existingForm.append(newRow1);
    var newRow2 = $('<div class="row rowPurse">');
    newRow2.append(`
 <div class="col-md-4">
        <div class="name_active">
            <h5>Copyright Information</h5>
        </div>
    </div>
<div class="col-md-8">
    <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Title of Work</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Type here" id="txtTitleOfWork" />
                </div>
            </div>
        <div class="col-md-6">
            <div class="form-group">
                <label class="formLabel colorDark">
                    <span class="control-label">Diary No.</span>
                </label>
                <input type="text" class="form-control inputFormat" placeholder="Type here" id="txtDiaryNo" />
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label class="formLabel colorDark">
                    <span class="control-label">ROC No.</span>
                </label>
                <input type="text" class="form-control inputFormat" placeholder="Type here" id="txtRocNo" />
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label class="formLabel colorDark">
                    <span class="control-label">Category</span>
                </label>
                <input type="text" class="form-control inputFormat" placeholder="Type here" id="txtCategory" />
            </div>
        </div>
        <div class="col-md-6">
                    <div class="form-group">
                        <label class="formLabel colorDark">
                            <span class="control-label">Date</span>
                        </label>
                        <input type="date" class="form-control inputFormat" id="txtCalendarView" />
                    </div>
                </div>
        </div>
    </div>
    </div>
`);

    existingForm.append(newRow2);
    var newRow3 = $('<div class="row rowPurse">');
    newRow3.append(`
 <div class="col-md-4">
        <div class="name_active">
            <h5>Copyright Information</h5>
        </div>
    </div>
<div class="col-md-8">
    <div class="row">       
        <div class="col-md-12">
        <div class="form-group">
            <div class="upload_wrapper">
                <div class="label_wrapper">
                    <label class="formLabel colorDark">
                        <span class="control-label">Copyright Application Form</span>
                    </label>
                </div>
               <input type="file" class="form-control inputFormat" id="fileCopyrightAppForm" style="display:none" multiple />
                <label for="fileCopyrightAppForm" class="upload_btn" id="fileCopyrightAppForm1">
                    <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                </label>
            </div>
            <div id="fileListCopyrightApp" style="margin-top:10px;"></div>
        </div>

        </div>
        <div class="col-md-12">
           <div class="form-group">
            <div class="upload_wrapper">
                <div class="label_wrapper">
                    <label class="formLabel colorDark">
                        <span class="control-label">Upload Documents</span>
                    </label>
                </div>
            <input type="file" class="form-control inputFormat" id="fileUploadDocuments" style="display:none" multiple />
                <label for="fileUploadDocuments" class="upload_btn" id="fileUploadDocuments1">
                    <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                </label>
            </div>
            <div id="fileListCopyrightDocs" style="margin-top:10px;"></div>
        </div>

        </div>
    </div>
</div>
`);

    existingForm.append(newRow3);


    var newRow4 = $('<div class="row rowPurse" style="display: flex; justify-content: flex-end; margin-top: -15px;">');

    // Create the "Save" button and append it to the form
    //var saveButton = $('<button>').attr({
    //    'type': 'submit',
    //    'id': 'btnsave',
    //    'class': 'btn btn-primary pull-right',
    //}).text('Add Manual Copyright').css('margin', '15px 15px 0 0');
    //existingForm.append(saveButton);
    //newRow4.append(`</div>`);

    //existingForm.append(newRow4);
    var saveButton = $('<button>').attr({
        'type': 'submit',
        'id': 'btnsave',
        'class': 'btn btn-primary pull-right',
    }).text('Add Manual Copyright').css({
        'margin': '15px 8px 20px 0px'
    });

    var cancelButton = $('<button>').attr({
        'type': 'button',
        'id': 'btnReset',
        'class': 'btn btn-secondary pull-right',
    }).text('Reset').css({
        'margin': '15px 8px 20px 0px'
    });

    newRow4.append(cancelButton, saveButton);

    // Append newRow4 to the form
    existingForm.append(newRow4);

}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Patent Page xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function IPRPatentMyList() {
    var existingForm = $('#ipraddform');
    if (existingForm.length > 0) {
        existingForm.empty();
    } else {
        // Create a new form if it doesn't exist
        existingForm = $('<form>').addClass('ec_bg').attr({
            'enctype': 'multipart/form-data',
            'autocomplete': 'off',
            'id': 'ipraddform'
        });
        $('.container-main').append(existingForm);
    }

    existingForm.append('<input type="hidden" value="" id="hiddenid" />');
    var newRow1 = $('<div class="row rowPurse">');
    newRow1.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Applicant Information  <span class="required " aria-required="true"><b> *</b> </span></h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Applicant name
                            <span class="required" aria-required="true"><b>&nbsp;*</b></span>
                        </span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Add Applicant Name" id="ApplicantName" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Application No.</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Application No."  id="ApplicationNo" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Publication Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat" id="PublicationDate" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Date of filing of Application</span>
                    </label>
                    <input type="date" class="form-control inputFormat" id="FilingDate" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Title of the Invention</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Title"  id="TitleOfInvention" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">International Classification</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter International Classification"  id="InternationalClassification" />
                </div>
            </div>
        </div>
    </div>
`);


    existingForm.append(newRow1);

//    var newRow2 = $('<div class="row rowPurse">');
//    newRow2.append(`
//    <div class="col-md-4">
//        <div class="name_active">
//            <h5>Invention Details</h5>
//        </div>
//    </div>
//    <div class="col-md-8">
//        <div class="row">
           
           
           
//        </div>
//    </div>
//`);

//    existingForm.append(newRow2);

    var newRow3 = $('<div class="row rowPurse">');
    newRow3.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Priority Information</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Priority Document No.</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here"  id="PriorityDocumentNo" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Priority Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat" id="PriorityDate" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Name of Priority Country</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="PriorityCountry" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow3);

    var newRow4 = $('<div class="row rowPurse">');
    newRow4.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>International Filing Details</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">International Application No.</span>
                    </label>
                    <input type="text" class="form-control inputFormat"  placeholder="Enter here" id="InternationalApplicationNo" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">International Application Filing Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat"  placeholder="Enter here" id="InternationalFilingDate" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">International Publication No.</span>
                    </label>
                    <input type="text" class="form-control inputFormat"  placeholder="Enter here" id="InternationalPublicationNo" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow4);

    var newRow5 = $('<div class="row rowPurse">');
    newRow5.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Related Applications</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Patent of Addition to Application Number</span>
                    </label>
                    <input type="text" class="form-control inputFormat"  placeholder="Enter here" id="PatentAdditionNo" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Patent of Addition to Application Filing Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat" id="FilingDatePatentAddition" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Divisional to Application Number</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="DivisionalNo" />
                </div>
            </div>
<div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Divisional to Application Filing Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat" id="FilingDateInventor" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow5);

    var newRow6 = $('<div class="row rowPurse">');
    newRow6.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Invention Details</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Name of Inventor</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="InventorName" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Abstract</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="Abstract" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow6);

    var newRow7 = $('<div class="row rowPurse">');
    newRow7.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Document Information</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">No. of pages</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="NoOfPages" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">No. of claims</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="NoOfClaims" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">The Patent Office Journal</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="PatentOfficeJournal" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow7);

    var newRow8 = $('<div class="row rowPurse">');
    newRow8.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Required Documents</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                <div class="upload_wrapper">
                    <div class="label_wrapper">
                        <label class="formLabel colorDark">
                            <span class="control-label">Patent Application Form</span>
                        </label>
                    </div>
                  <input type="file" class="form-control inputFormat" id="fileCopyrightAppForm" style="display:none" multiple />
                    <label for="fileCopyrightAppForm" class="upload_btn" id="filePatentAppForm1">
                        <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                    </label>
                </div>
                <div id="fileListCopyrightApp" style="margin-top:10px;"></div>
            </div>

            </div>
            <div class="col-md-12">
                <div class="form-group">
                <div class="upload_wrapper">
                    <div class="label_wrapper">
                        <label class="formLabel colorDark">
                            <span class="control-label">Upload Documents</span>
                        </label>
                    </div>
                 <input type="file" class="form-control inputFormat" id="fileUploadDocuments" style="display:none" multiple />
                    <label for="fileUploadDocuments" class="upload_btn" id="fileUploadDocuments1">
                        <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                    </label>
                </div>
                 <div id="fileListCopyrightDocs" style="margin-top:10px;"></div>
            </div>

            </div>
        </div>
    </div>
`);

    existingForm.append(newRow8);


    var newRow9 = $('<div class="row rowPurse" style="display: flex; justify-content: flex-end; margin-top: -15px;">');

    //existingForm.append(newRow4);
    var saveButton = $('<button>').attr({
        'type': 'submit',
        'id': 'btnsave',
        'class': 'btn btn-primary pull-right',
    }).text('Add Manual Patent').css({
        'margin': '15px 8px 20px 0px'
    });

    var cancelButton = $('<button>').attr({
        'type': 'button',
        'id': 'btnReset',
        'class': 'btn btn-secondary pull-right',
    }).text('Reset').css({
        'margin': '15px 8px 20px 0px'
    });

    newRow9.append(cancelButton, saveButton);

    // Append newRow4 to the form
    existingForm.append(newRow9);



    // Create the "Save" button and append it to the form
    //var saveButton = $('<button>').attr({
    //    'type': 'submit',
    //    'id': 'btnsave',
    //    'class': 'btn btn-primary pull-right',
    //}).text('Add Manual Patent').css('margin', '15px 0px 35px 10px');
    //var resetBTN = $('<button>').attr({
    //    'type': 'submit',
    //    'id': 'btnReset',
    //    'class': 'btn btn-secondary pull-right',
    //}).text('Reset').css('margin', '15px 0px 35px 10px');
    //existingForm.append(saveButton);
    //existingForm.append(resetBTN);
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for GI Page xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function IPRGIMyList() {
    var existingForm = $('#ipraddform');
    if (existingForm.length > 0) {
        existingForm.empty();
    } else {
        // Create a new form if it doesn't exist
        existingForm = $('<form>').addClass('ec_bg').attr({
            'enctype': 'multipart/form-data',
            'autocomplete': 'off',
            'id': 'ipraddform'
        });
        $('.container-main').append(existingForm);
    }

    existingForm.append('<input type="hidden" value="" id="hiddenid" />');
    var newRow1 = $('<div class="row rowPurse">');
    newRow1.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Applicant Details</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Applicant Name<span class="required" aria-required="true"><b>&nbsp;*</b></span></span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Add Applicant Name" id="ApplicantName" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Applicant Address</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Applicant Address" id="ApplicantAddress" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Application Number</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Application No." id="ApplicationNo" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow1);

    var newRow2 = $('<div class="row rowPurse">');
    newRow2.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>GI Information</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Name of the GI</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter here" id="GIName" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">GI Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat" placeholder="" id="GIDate" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">GI Class</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter GI class" id="Class" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Goods</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter type of goods" id="Goods" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">GI Specification</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Specification" id="Specifications" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow2);

    var newRow3 = $('<div class="row rowPurse">');
    newRow3.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>GI Information</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">          
            <div class="col-md-12">
                <div class="form-group">
                <div class="upload_wrapper">
                    <div class="label_wrapper">
                        <label class="formLabel colorDark">
                            <span class="control-label">GI Application Form</span>
                        </label>
                    </div>
      <input type="file" class="form-control inputFormat" id="fileCopyrightAppForm" style="display:none" multiple />
                    <label for="fileCopyrightAppForm" class="upload_btn" id="fileGIAppForm1">
                        <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                    </label>
                </div>
                 <div id="fileListCopyrightApp" style="margin-top:10px;"></div>
            </div>

            </div>
            <div class="col-md-12">
                <div class="form-group">
                <div class="upload_wrapper">
                    <div class="label_wrapper">
                        <label class="formLabel colorDark">
                            <span class="control-label">Upload Supporting Document</span>
                        </label>
                    </div>
     <input type="file" class="form-control inputFormat" id="fileUploadDocuments" style="display:none" multiple />
                    <label for="fileUploadDocuments" class="upload_btn" id="fileSupportingDocument1">
                        <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                    </label>
                </div>
                 <div id="fileListCopyrightDocs" style="margin-top:10px;"></div>
                 </div>

            </div>
        </div>
    </div>
`);

    existingForm.append(newRow3);

    var newRow4 = $('<div class="row rowPurse" style="display: flex; justify-content: flex-end; margin-top: -15px;">');

    //existingForm.append(newRow4);
    var saveButton = $('<button>').attr({
        'type': 'submit',
        'id': 'btnsave',
        'class': 'btn btn-primary pull-right',
    }).text('Add Manual GI').css({
        'margin': '15px 8px 20px 0px'
    });

    var cancelButton = $('<button>').attr({
        'type': 'button',
        'id': 'btnReset',
        'class': 'btn btn-secondary pull-right',
    }).text('Reset').css({
        'margin': '15px 8px 20px 0px'
    });

    newRow4.append(cancelButton, saveButton);

    // Append newRow4 to the form
    existingForm.append(newRow4);


//    existingForm.append(newRow4);

    // Create the "Save" button and append it to the form
    //var saveButton = $('<button>').attr({
    //    'type': 'submit',
    //    'id': 'btnsave',
    //    'class': 'btn btn-primary pull-right',
    //}).text('Add Manual GI').css('margin', '15px 0px 35px 10px');
    //var resetBTN = $('<button>').attr({
    //    'type': 'submit',
    //    'id': 'btnReset',
    //    'class': 'btn btn-secondary pull-right',
    //}).text('Reset').css('margin', '15px 0px 35px 10px');
    //existingForm.append(saveButton);
    //existingForm.append(resetBTN);
 
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Design Page xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


function IPRDesignMyList() {
    var existingForm = $('#ipraddform');
    if (existingForm.length > 0) {
        existingForm.empty();
    } else {
        // Create a new form if it doesn't exist
        existingForm = $('<form>').addClass('ec_bg').attr({
            'enctype': 'multipart/form-data',
            'autocomplete': 'off',
            'id': 'ipraddform'
        });
        $('.container-main').append(existingForm);
    }

    existingForm.append('<input type="hidden" value="" id="hiddenid" />');
    var newRow1 = $('<div class="row rowPurse">');
    newRow1.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Applicant Details<span class="required " aria-required="true"><b> *</b> </span></h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Applicant Name
                            <span class="required" aria-required="true"><b>&nbsp;*</b></span>
                        </span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Add Applicant Name" id="ApplicantName" />
                </div>
            </div>
<div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Address</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Applicant Address" id="ApplicantAddress" />
                </div>
            </div>
           
        </div>
    </div>
`);

    existingForm.append(newRow1);

    var newRow2 = $('<div class="row rowPurse">');
    newRow2.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Design Details</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
 
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Title</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Design Title" id="Title" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Design Number</span>
                    </label>
                    <input type="text" class="form-control inputFormat" placeholder="Enter Design No." id="DesignNumber" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Design Class</span>
                    </label>
                    <input type="text" placeholder="Enter Class" class="form-control inputFormat" id="Class" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat" id="dDate" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Journal Number</span>
                    </label>
                    <input type="text" placeholder="Enter Journay No." class="form-control inputFormat" id="JournalNumber" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Priority Number</span>
                    </label>
                    <input type="text" placeholder="Enter Priority No." class="form-control inputFormat" id="PriorityNumber" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Priority Date</span>
                    </label>
                    <input type="date" class="form-control inputFormat" id="PriorityDate" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="formLabel colorDark">
                        <span class="control-label">Priority Country</span>
                    </label>
                    <input type="text" placeholder="Enter Priority Country" class="form-control inputFormat" id="PriorityCountry" />
                </div>
            </div>
        </div>
    </div>
`);

    existingForm.append(newRow2);


//    existingForm.append(newRow3);

    var newRow4 = $('<div class="row rowPurse">');
    newRow4.append(`
    <div class="col-md-4">
        <div class="name_active">
            <h5>Priority and Required Documents</h5>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
           
            <div class="col-md-12">
                <div class="form-group">
                <div class="upload_wrapper">
                    <div class="label_wrapper">
                        <label class="formLabel colorDark">
                            <span class="control-label">Design Application Form</span>
                        </label>
                    </div>
     <input type="file" class="form-control inputFormat" id="fileCopyrightAppForm" style="display:none" multiple />
                    <label for="fileCopyrightAppForm" class="upload_btn" id="fileDesignAppForm">
                        <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                    </label>
                </div>
                 <div id="fileListCopyrightApp" style="margin-top:10px;"></div>
            </div>

            </div>
           <div class="col-md-12">
            <div class="form-group">
                <div class="upload_wrapper">
                    <div class="label_wrapper">
                        <label class="formLabel colorDark">
                            <span class="control-label">Upload Supporting Document</span>
                        </label>
                    </div>
                  <input type="file" class="form-control inputFormat" id="fileUploadDocuments" style="display:none" multiple />
                    <label for="fileUploadDocuments" class="upload_btn" id="fileSupportingDocument">
                        <img src="/newassets/img/upload-cloud.svg" /> Upload Document
                    </label>
                </div>
                 <div id="fileListCopyrightDocs" style="margin-top:10px;"></div>
            </div>
        </div>

        </div>
    </div>
`);

    existingForm.append(newRow4);

    // Create the "Save" button and append it to the form
    //var resetButton = $('<button>').attr({
    //    'type': 'reset',
    //    'id': 'btnreset',
    //    'class': 'btn btn-secondary pull-right',
    //}).text('Reset').css({
    //    'margin': '15px 8px 20px 0'
    //});

    //var saveButton = $('<button>').attr({
    //    'type': 'submit',
    //    'id': 'btnsave',
    //    'class': 'btn btn-primary pull-right',
    //}).text('Add Manual Design').css('margin', '15px 0 20px 0');
    //existingForm.append(saveButton);
    //existingForm.append(resetButton);



    var newRow5 = $('<div class="row rowPurse" style="display: flex; justify-content: flex-end; margin-top: -15px;">');

    //existingForm.append(newRow4);
    var saveButton = $('<button>').attr({
        'type': 'submit',
        'id': 'btnsave',
        'class': 'btn btn-primary pull-right',
    }).text('Add Manual Design').css({
        'margin': '15px 8px 20px 0px'
    });

    var cancelButton = $('<button>').attr({
        'type': 'button',
        'id': 'btnReset',
        'class': 'btn btn-secondary pull-right',
    }).text('Reset').css({
        'margin': '15px 8px 20px 0px'
    });

    newRow5.append(cancelButton, saveButton);

    // Append newRow4 to the form
    existingForm.append(newRow5);




}
function submitcopyrightIPR() {

    if ($('#txtApplicantName').val() == '' || $('#txtApplicantName').val() == null) {
        alert("Please fill the 'Applicant Name' textbox!")
        return false;
    }
    var id = sessionStorage.getItem('iprcaseid');
    var txtApplicantName = $('#txtApplicantName').val().trim();
    var applicantAddress = $("#txtAddress1").val();
    var titleWork = $('#txtTitleOfWork').val();
    var diaryNo = $('#txtDiaryNo').val();
    var rocNo = $('#txtRocNo').val();
    var category = $("#txtCategory").val();
    var dateValue = $("#txtCalendarView").val();
    var copyrightForm = $('#fileCopyrightAppForm').val();
    var uploadDocument = $('#fileUploadDocuments').val();
    if (txtApplicantName === '') {
        alert("Please fill the 'Applicant Name' textbox!");
        return false;
    }
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    //  formData.append("FileUpload", file);
    var totalFiles = document.getElementById("fileCopyrightAppForm").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("fileCopyrightAppForm").files[i];
        var filename = file.name;
        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }

        formData.append("FilePosted[" + i + "]", file);
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
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }

    var files = document.getElementById("fileUploadDocuments").files.length;
    for (var i = 0; i < files; i++) {
        var file = document.getElementById("fileUploadDocuments").files[i];
        var filename = file.name;

        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }

        formData.append("FileUpload[" + i + "]", file);

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
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    openload();
    formData.append("hidden", EncodeText(id));
    formData.append("txtApplicantName", EncodeText(txtApplicantName));
    formData.append("applicantAddress", EncodeText(applicantAddress));
    formData.append("titleWork", EncodeText(titleWork));
    formData.append("diaryNo", EncodeText(diaryNo));
    formData.append("rocNo", EncodeText(rocNo));
    formData.append("category", EncodeText(category));
    formData.append("dateValue", EncodeText(dateValue));
    formData.append("copyrightForm", EncodeText(copyrightForm));
    formData.append("uploadDocument", EncodeText(uploadDocument));
    formData.append("ip", EncodeText(myParam));

    $.ajax({
        async: false,
        type: "POST",
        url: "/api/IPRApi/CreateIPRCaseForCopyRight",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response) {
            if (!response.Data.Status) {
                alert(response.Data.data);
            }
            else {
                //alert('Your information has been successfully recorded.');
                new PNotify({
                    title: 'Success!',
                    text: 'Your information has been successfully recorded.',
                    type: 'success',
                    delay: 3000
                });
                sessionStorage.removeItem('iprcaseid');
                //alert(data.Data.data.message);
                if (response.Data.data == null || response.Data.data == "null") {
                    alert("There was an error while adding your IPR Case.....");
                    closeload();
                    return false;
                }
                var firmcode = localStorage.getItem("FirmCode");
                window.location.href = "/" + firmcode + "/IPR/ViewIPRCase?IP=" + myParam;
            }
            closeload();
        },
        failure: function (data) {
            alert(data.message);
            closeload();
        },
        error: function (data) {
            alert(data.message);
            closeload();
        }
    });
}

function ConvertDate(InputDate)
{
    const dateVal = InputDate.split('T');
    var newDateValue = dateVal[0];
    return newDateValue;
}

function submitPatenttIPR() {
    if ($('#ApplicantName').val() == '' || $('#ApplicantName').val() == null) {
        alert("Please fill the 'Applicant Name' textbox!")
        return false;
    }
    var id = sessionStorage.getItem('iprcaseid');
    var ApplicantName = $('#ApplicantName').val().trim();
    var ApplicationNo = $('#ApplicationNo').val();
    var PublicationDate = $("#PublicationDate").val();
    var FilingDate = $('#FilingDate').val();
    var TitleOfInvention = $('#TitleOfInvention').val();
    var InternationalClassification = $('#InternationalClassification').val();
    var PriorityDocumentNo = $("#PriorityDocumentNo").val();
    var PriorityDate = $("#PriorityDate").val();
    var PriorityCountry = $('#PriorityCountry').val();
    var InternationalApplicationNo = $('#InternationalApplicationNo').val();
    var InternationalFilingDate = $('#InternationalFilingDate').val();
    var InternationalPublicationNo = $('#InternationalPublicationNo').val();
    var PatentAdditionNo = $('#PatentAdditionNo').val();
    var FilingDatePatentAddition = $('#FilingDatePatentAddition').val();
    var DivisionalNo = $('#DivisionalNo').val();
    var FilingDateInventor = $('#FilingDateInventor').val();
    var InventorName = $('#InventorName').val();
    var Abstract = $('#Abstract').val();
    var NoOfPages = $('#NoOfPages').val();
    var NoOfClaims = $('#NoOfClaims').val();
    var PatentOfficeJournal = $('#PatentOfficeJournal').val();
    var copyrightForm = $('#fileCopyrightAppForm').val();
    var uploadDocument = $('#fileUploadDocuments').val();
    if (ApplicantName === '') {
        alert("Please fill the 'Applicant Name' textbox!");
        return false;
    }
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;

    var totalFiles = document.getElementById("fileCopyrightAppForm").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("fileCopyrightAppForm").files[i];
        var filename = file.name;
        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }


        formData.append("FilePosted[" + i + "]", file);
        try {
            if (typeof (file) != "undefined") {
                size = parseFloat(file.size / 1024).toFixed(2);
                tottempsize = parseFloat(tottempsize) + parseFloat(size);
                tempsize = parseFloat(size);
            }
        }
        catch (err) {
        }

        tempsize = tempsize.toFixed(2);
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }

    var files = document.getElementById("fileUploadDocuments").files.length;

    for (var i = 0; i < files; i++) {
        var file = document.getElementById("fileUploadDocuments").files[i];
        var filename = file.name;
        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }


        formData.append("FileUpload[" + i + "]", file);
        try {
            if (typeof (file) != "undefined") {
                size = parseFloat(file.size / 1024).toFixed(2);
                tottempsize = parseFloat(tottempsize) + parseFloat(size);
                tempsize = parseFloat(size);
            }
        }
        catch (err) {
        }
        tempsize = tempsize.toFixed(2);
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    openload();
    formData.append("hidden", EncodeText(id));
    formData.append("ApplicantName", EncodeText(ApplicantName));
    formData.append("ApplicationNo", EncodeText(ApplicationNo));
    formData.append("PublicationDate", EncodeText(PublicationDate));
    formData.append("FilingDate", EncodeText(FilingDate));
    formData.append("TitleOfInvention", EncodeText(TitleOfInvention));
    formData.append("InternationalClassification", EncodeText(InternationalClassification));
    formData.append("PriorityDocumentNo", EncodeText(PriorityDocumentNo));
    formData.append("PriorityDate", EncodeText(PriorityDate));
    formData.append("PriorityCountry", EncodeText(PriorityCountry));
    formData.append("InternationalApplicationNo", EncodeText(InternationalApplicationNo));
    formData.append("InternationalFilingDate", EncodeText(InternationalFilingDate));
    formData.append("InternationalPublicationNo", EncodeText(InternationalPublicationNo));
    formData.append("PatentAdditionNo", EncodeText(PatentAdditionNo));
    formData.append("FilingDatePatentAddition", EncodeText(FilingDatePatentAddition));
    formData.append("DivisionalNo", EncodeText(DivisionalNo));
    formData.append("FilingDateInventor", EncodeText(FilingDateInventor));
    formData.append("InventorName", EncodeText(InventorName));
    formData.append("Abstract", EncodeText(Abstract));
    formData.append("NoOfPages", EncodeText(NoOfPages));
    formData.append("NoOfClaims", EncodeText(NoOfClaims));
    formData.append("PatentOfficeJournal", EncodeText(PatentOfficeJournal));
    formData.append("copyrightForm", EncodeText(copyrightForm));
    formData.append("uploadDocument", EncodeText(uploadDocument));
    formData.append("ip", EncodeText(myParam));

    $.ajax({
        async: false,
        type: "POST",
        url: "/api/IPRApi/CreateIPRCaseForPatent",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (!response.Data.Status) {
                alert(response.Data.data);
            }
            else {
                //alert('Your information has been successfully recorded.');
                new PNotify({
                    title: 'Success!',
                    text: 'Your information has been successfully recorded.',
                    type: 'success',
                    delay: 3000
                });
                sessionStorage.removeItem('iprcaseid');

                if (response.Data.data == null || response.Data.data == "null") {
                    //alert("There was an error while adding your IPR Case.....");
                    new PNotify({
                        title: 'Success!',
                        text: 'There was an error while adding your IPR Case.',
                        type: 'success',
                        delay: 3000
                    });
                    closeload();
                    false;
                }
                var firmcode = localStorage.getItem("FirmCode");
                window.location.href = "/" + firmcode + "/IPR/ViewIPRCase?IP=" + myParam;
            }
            closeload();
        },
        failure: function (data) {
            alert(data.message);
            closeload();
        },
        error: function (data) {
            alert(data.message);
            closeload();
        }
    });
}

function ConvertDate1(InputDate) {
    const splitDate = InputDate.split('T');
    var newDateValue = splitDate[0];
    return newDateValue;
}


function submitGIIPR() {
    if ($('#ApplicantName').val() == '' || $('#ApplicantName').val() == null) {
        alert("Please fill the 'Applicant Name' textbox!")
        return false;
    }
    var id = sessionStorage.getItem('iprcaseid');
    var ApplicantName = $('#ApplicantName').val().trim();
    var ApplicantAddress = $('#ApplicantAddress').val();
    var ApplicationNo = $("#ApplicationNo").val();
    var GIName = $('#GIName').val();
    var GIDate = $('#GIDate').val();
    var Class = $('#Class').val();
    var Goods = $("#Goods").val();
    var Specifications = $("#Specifications").val();
    var copyrightForm = $('#fileCopyrightAppForm').val();
    var uploadDocument = $('#fileUploadDocuments').val();
    if (ApplicantName === '') {
        alert("Please fill the 'Applicant Name' textbox!");
        return false;
    }
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    var totalFiles = document.getElementById("fileCopyrightAppForm").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("fileCopyrightAppForm").files[i];
        var filename = file.name;
        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }
        formData.append("FilePosted[" + i + "]", file);
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
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }

    var files = document.getElementById("fileUploadDocuments").files.length;
    for (var i = 0; i < files; i++) {
        var file = document.getElementById("fileUploadDocuments").files[i];
        var filename = file.name;
        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }


        formData.append("FileUpload[" + i + "]", file);
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
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    openload();
    formData.append("hidden", EncodeText(id));
    formData.append("ApplicantName", EncodeText(ApplicantName));
    formData.append("ApplicantAddress", EncodeText(ApplicantAddress));
    formData.append("ApplicationNo", EncodeText(ApplicationNo));
    formData.append("GIName", EncodeText(GIName));
    formData.append("GIDate", EncodeText(GIDate));
    formData.append("Class", EncodeText(Class));
    formData.append("Goods", EncodeText(Goods));
    formData.append("Specifications", EncodeText(Specifications));
    formData.append("copyrightForm", EncodeText(copyrightForm));
    formData.append("uploadDocument", EncodeText(uploadDocument));
    formData.append("ip", EncodeText(myParam));

    $.ajax({
        async: false,
        type: "POST",
        url: "/api/IPRApi/CreateIPRCaseForGI",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (!response.Data.Status) {
                alert(response.Data.data);
                closeload();
            }
            else {
                //alert('Your information has been successfully recorded.');
                new PNotify({
                    title: 'Success!',
                    text: 'Your information has been successfully recorded.',
                    type: 'success',
                    delay: 3000
                });
                sessionStorage.removeItem('iprcaseid');
                //alert(data.Data.data.message);
                if (response.Data.data == null || response.Data.data == "null") {
                    //alert("There was an error while adding your IPR Case.....");
                    new PNotify({
                        title: 'Error!',
                        text: 'There was an error while adding your IPR Case.',
                        type: 'Error',
                        delay: 3000
                    });
                    closeload();
                    false;
                }
                var firmcode = localStorage.getItem("FirmCode");
                window.location.href = "/" + firmcode + "/IPR/ViewIPRCase?IP=" + myParam;
            }
            closeload();
        },
        failure: function (data) {
            alert(data.message);
            closeload();
        },
        error: function (data) {
            alert(data.message);
            closeload();
        }
    });
}

function ConvertGIDate(InputDate) {
    const GIDate = InputDate.split('T');
    var newDateValue = GIDate[0];
    return newDateValue;
}

function submitDesignIPR() {
    if ($('#ApplicantName').val() == '' || $('#ApplicantName').val() == null) {
        alert("Please fill the 'Applicant Name' textbox!")
        return false;
    }
    var id = sessionStorage.getItem('iprcaseid');
    var ApplicantName = $('#ApplicantName').val().trim();
    var ApplicantAddress = $('#ApplicantAddress').val();
    var Title = $("#Title").val();
    var DesignNumber = $('#DesignNumber').val();
    var Class = $('#Class').val();
    var dDate = $('#dDate').val();
    var JournalNumber = $("#JournalNumber").val();
    var PriorityNumber = $("#PriorityNumber").val();
    var PriorityDate = $("#PriorityDate").val();
    var PriorityCountry = $("#PriorityCountry").val();
    var copyrightForm = $('#fileCopyrightAppForm').val();
    var uploadDocument = $('#fileUploadDocuments').val();

    if (ApplicantName === '') {
        alert("Please fill the 'Applicant Name' textbox!");
        return false;
    }
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;

    var totalFiles = document.getElementById("fileCopyrightAppForm").files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("fileCopyrightAppForm").files[i];
        var filename = file.name;
        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }


        formData.append("FilePosted[" + i + "]", file);
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
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }

    var files = document.getElementById("fileUploadDocuments").files.length;
    for (var i = 0; i < files; i++) {
        var file = document.getElementById("fileUploadDocuments").files[i];
        var filename = file.name;

        var fileNameIndex = filename.lastIndexOf("/") + 1;
        var dotIndex = filename.lastIndexOf('.');

        var newfilename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(newfilename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        if (filename.length > 100) {
            alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            return false;
        }
        var Extresponse = checkfileextDOC(filename);
        if (String(Extresponse) == "false") {
            return false;
        }


        formData.append("FileUpload[" + i + "]", file);
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
        var filesize = 5120
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    openload();
    formData.append("hidden", EncodeText(id));
    formData.append("ApplicantName", EncodeText(ApplicantName));
    formData.append("ApplicantAddress", EncodeText(ApplicantAddress));
    formData.append("Title", EncodeText(Title));
    formData.append("DesignNumber", EncodeText(DesignNumber));
    formData.append("Class", EncodeText(Class));
    formData.append("dDate", EncodeText(dDate));
    formData.append("JournalNumber", EncodeText(JournalNumber));
    formData.append("PriorityNumber", EncodeText(PriorityNumber));
    formData.append("PriorityDate", EncodeText(PriorityDate));
    formData.append("PriorityCountry", EncodeText(PriorityCountry));
    formData.append("copyrightForm", EncodeText(copyrightForm));
    formData.append("uploadDocument", EncodeText(uploadDocument));
    formData.append("ip", EncodeText(myParam));

    $.ajax({
        async: false,
        type: "POST",
        url: "/api/IPRApi/CreateIPRCaseForDesign",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (!response.Data.Status) {
                alert(response.Data.data);
            }
            else {
                //alert('Your information has been successfully recorded.');
                new PNotify({
                    title: 'Success!',
                    text: 'Your information has been successfully recorded.',
                    type: 'success',
                    delay: 3000
                });
                sessionStorage.removeItem('iprcaseid');
                //alert(data.Data.data.message);
                if (response.Data.data == null || response.Data.data == "null") {
                    //alert("There was an error while adding your IPR Case.....");
                    new PNotify({
                        title: 'Error!',
                        text: 'There was an error while adding your IPR Case.',
                        type: 'Error',
                        delay: 3000
                    });
                    closeload();
                    false;
                }
                var firmcode = localStorage.getItem("FirmCode");
                window.location.href = "/" + firmcode + "/IPR/ViewIPRCase?IP=" + myParam;
            }
            closeload();
        },
        failure: function (data) {
            alert(data.message);
            closeload();
        },
        error: function (data) {
            alert(data.message);
            closeload();
        }
    });
}


function ConvertdDate(InputDate) {
    const dDate = InputDate.split('T');
    var newDateValue = dDate[0];
    return newDateValue;
}


// Function to validate and show email validation message
function validateEmail(emailInput) {
    const validationMessage = document.getElementById('emailValidationMessage');
    const emailArray = emailInput.split(',');
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailInput!="" && !emailArray.every(email => emailPattern.test(email.trim()))) {
        validationMessage.textContent = 'Please enter a valid email address.';
        return false;
    } else {
        validationMessage.textContent = '';
        return true;
    }
}

$(document).on('input', '#txtEmailId', function () {
    const getEmailVal1 = $(this).val();
    validateEmail(getEmailVal1);
});


function validatePhoneno(Phoneno) {
    const validationMessage = document.getElementById('PhoneNoValidationMessage');
    const PhonePattern = /^\d{10}$/;

    if (Phoneno != "" && Phoneno.length != 10) {
        validationMessage.textContent = 'Please enter a valid Phone no.';
        return false;
    }
    else if (Phoneno.length == 10 && !PhonePattern.test(Phoneno.trim())) {
        validationMessage.textContent = 'Please enter a valid Phone no.';
        return false;
    }
    else {
        validationMessage.textContent = '';
        return true;
    }
}

$(document).on('input', '#txtPhoneNo', function () {
    var getPhoneno = $(this).val();
    validatePhoneno(getPhoneno);
});

let selectedpostedFile = [];
$(document).on('change', '#postedFile', function (e) {
    selectedpostedFile = [];
    var fileCount = this.files.length;
    if (fileCount > 0) {
        $("#dropContainer").attr("title", "Document Attached");
    }
    else {
        $("#dropContainer").attr("title", "upload Attachment");
    }

    const files = Array.from(e.target.files);
    selectedpostedFile = [...selectedpostedFile, ...files];
    displaypostedFile();
});

$(document).on('click', '.remove-file-postedFile', function () {
    const index = $(this).data('index');
    selectedpostedFile.splice(index, 1);
    displaypostedFile();
});

function displaypostedFile() {
    const fileList = $('#fileListTMApplication');
    fileList.empty();
    const fCount = selectedpostedFile.length;
    selectedpostedFile.slice(0, 5).forEach((file, index) => {
        const fileItem = $(`
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="remove-file-postedFile" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
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
    updatepostedFileInput();
}

function updatepostedFileInput() {
    const dt = new DataTransfer();
    selectedpostedFile.forEach(file => dt.items.add(file));
    document.getElementById('postedFile').files = dt.files;
}

function clearpostedFileUpload() {
    selectedpostedFile = [];
    const fileInput = document.getElementById("postedFile");
    if (fileInput) fileInput.value = "";
    $('#fileListTMApplication').empty();
    $("#dropContainer").attr("title", "Upload Attachment");
}

let selecteduploadedFile = [];
$(document).on('change', '#uploadedFile', function (e) {
    selecteduploadedFile = [];
    var fileCount = this.files.length;
    if (fileCount > 0) {
        $("#dropContainer").attr("title", "Document Attached");
    }
    else {
        $("#dropContainer").attr("title", "upload Attachment");
    }

    const files = Array.from(e.target.files);
    selecteduploadedFile = [...selecteduploadedFile, ...files];
    displayuploadedFile();
});

$(document).on('click', '.remove-file-uploadedFile', function () {
    const index = $(this).data('index');
    selecteduploadedFile.splice(index, 1);
    displayuploadedFile();
});

function displayuploadedFile() {
    const fileList = $('#fileListSupportingDoc');
    fileList.empty();
    const fCount = selecteduploadedFile.length;
    selecteduploadedFile.slice(0, 5).forEach((file, index) => {
        const fileItem = $(`
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="remove-file-uploadedFile" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
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
    updateuploadedFileInput();
}

function updateuploadedFileInput() {
    const dt = new DataTransfer();
    selecteduploadedFile.forEach(file => dt.items.add(file));
    document.getElementById('uploadedFile').files = dt.files;
}

function clearuploadedFile() {
    selecteduploadedFile = [];
    const fileInput = document.getElementById("uploadedFile");
    if (fileInput) fileInput.value = "";
    $('#fileListSupportingDoc').empty();
    $("#dropContainer").attr("title", "Upload Attachment");
}

function initFileUpload({
    inputId,
    listContainerId,
    removeBtnClass,
    dropContainerId = null,  
    maxVisible = 5
}) {
    let selectedFiles = [];
    $(document).on('change', `#${inputId}`, function (e) {

        selectedFiles = Array.from(e.target.files);

        if (dropContainerId) {
            $(`#${dropContainerId}`).attr("title",
                selectedFiles.length > 0 ? "Document Attached" : "Upload Attachment"
            );
        }

        displayFiles();
    });

    $(document).on('click', `.${removeBtnClass}`, function () {
        const index = $(this).data('index');
        selectedFiles.splice(index, 1);
        displayFiles();
    });
    function displayFiles() {

        const fileList = $(`#${listContainerId}`);
        fileList.empty();

        let count = selectedFiles.length;

        selectedFiles.slice(0, maxVisible).forEach((file, index) => {
            fileList.append(`
                <div class="file-item">
                    <span class="file-name">${file.name}</span>
                    <span class="${removeBtnClass}" data-index="${index}"
                          style="cursor:pointer;color:red;margin-left:10px;">
                        ✖
                    </span>
                </div>
            `);
        });

        if (count > maxVisible) {
            fileList.append(`
                <div style="margin-top:5px;color:#555;">
                    +${count - maxVisible} more (Total ${count} files selected)
                </div>
            `);
        }

        updateInputFiles();
    }
    function updateInputFiles() {
        const dt = new DataTransfer();
        selectedFiles.forEach(f => dt.items.add(f));
        document.getElementById(inputId).files = dt.files;
    }

    return {
        clear: function () {
            selectedFiles = [];
            const input = document.getElementById(inputId);
            if (input) input.value = "";
            $(`#${listContainerId}`).empty();
            if (dropContainerId) {
                $(`#${dropContainerId}`).attr("title", "Upload Attachment");
            }
        }
    };
}

