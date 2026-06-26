var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var tfot = '';
$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    try {
        var aCountry = $('#aCountry');
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/BindCountryDetails',
            type: 'POST',
            dataType: 'json',
            success: function (d) {
                $.each(d.Data, function (i, country) {
                    aCountry.append($("<option selected></option>").val(country.CountryName).html(country.CountryName));
                });
            },
            error: function (d) {
                alert(d.responseText);
            }
        });
    }
    catch (err) {
        alert(err.message);
    }
    //auto state
    try {
        var CountryId = "India";
        var aState = $('#aState');
        aState.empty();
        aState.append($("<option></option>").val('').html('Please wait ...'));
        var aCity = $('#aCity');
        aCity.empty();
        aCity.append($("<option value='' selected ></option>").val('').html('Select'));
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/BindStateDetails',
            type: 'POST',
            dataType: 'json',
            headers: { CountryName: CountryId },
            success: function (d) {
                aState.empty();
                // Clear the please wait
                aState.append($("<option value='' selected ></option>").val('').html('Select'));
                $.each(d.Data, function (i, states) {
                    aState.append($("<option></option>").val(states.StateName).html(states.StateName));
                });
            },
            error: function (d) {
                alert(d.responseText);
            }
        });
    }
    catch (err) {
        alert(err.message);
    }
    //State details by country id
    $("#aCountry").change(function () {
        var CountryId = $(this).val();
        if (CountryId != "India") {
            $("#ostate").css("display", "unset");
            $("#ocity").css("display", "unset");
            $("#lstate").css("display", "none");
            $("#lcity").css("display", "none");
            return false;
        }
        else {
            $("#ostate").css("display", "none");
            $("#ocity").css("display", "none");
            $("#lstate").css("display", "unset");
            $("#lcity").css("display", "unset");
        }
        var aState = $('#aState');
        aState.empty();
        aState.append($("<option></option>").val('').html('Please wait ...'));
        var aCity = $('#cocity');
        aCity.empty();
        aCity.append($("<option value='' selected ></option>").val('').html('Select'));
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/BindStateDetails',
            type: 'POST',
            dataType: 'json',
            headers: { CountryName: CountryId },
            success: function (d) {
                aState.empty();
                // Clear the please wait
                aState.append($("<option value='' selected ></option>").val('').html('Select'));
                $.each(d.Data, function (i, states) {
                    aState.append($("<option></option>").val(states.StateName).html(states.StateName));
                });
            },
            error: function (d) {
                alert(d.responseText);
            }
        });
    });
    //City Bind By satate id
    $("#aState").change(function () {
        var StateId = $(this).val();
        var aCity = $('#aCity');
        aCity.append($("<option></option>").val('').html('Please wait ...'));
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/BindCityDetails',
            type: 'POST',
            dataType: 'json',
            headers: { StateName: StateId },
            success: function (d) {
                aCity.empty(); // Clear the plese wait
                aCity.append($("<option value'' selected></option>").val('').html('Select'));
                $.each(d.Data, function (i, cities) {
                    aCity.append($("<option></option>").val(cities.CityName).html(cities.CityName));
                });
            },
            error: function (d) {
                alert('Error!'); alert(d.responseText);
            }
        });
    });
    $("#savecontactaddress").click(function () {
        var multipleAddressContact = $('#multipleAddressContact').val();
        var multipleAddressClient = $('#multipleAddressClient').val();
        var mAddress = $('#mAddress').val();
        var aCountry = $('#aCountry').val();
        var aState = $('#aState').val();
        var aCity = $('#aCity').val();
        var aPincode = $('#aPincode').val();
        var aGST = $('#aGST').val();
        var aPAN = $('#aPAN').val();
        var hiddenAddIt = $('#hiddenAddIt').val();
        var lists = "Client";//$("#Clistctypeaddress option:selected").text();
        if (lists == "Client") {
            if (multipleAddressClient == "") {
                alert("Please select Client");
                return false;
            }
        }
        else {
            if (multipleAddressContact == "") {
                alert("Please select Contact");
                return false;
            }
        }
        if (mAddress == "") {
            alert("Please Enter Address");
            return false;
        }
        if (aCountry == "") {
            alert("Please Select Country");
            return false;
        }
        if (aState == "") {
            alert("Please Select State");
            return false;
        }
        if (aCity == "") {
            alert("Please Select City");
            return false;
        }
        if (aPincode == "") {
            alert("Please Enter Pincode");
            return false;
        }
        // PINCODE VALIDATION
        var pat1 = /^\d{6}$/;
        if (!pat1.test(aPincode)) {
            alert("Pin code should be 6 digits ");
            return false;
        }
        // GST VALIDATION
        if (aGST != "") {
            if ($("#aGST").val().length < 15 || $("#aGST").val().length > 15) {
                alert("Please enter a valid GST number. GST number should be of 15 characters only.");
                return false;
            }
            var reggst = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
            if (!reggst.test(aGST) && aGST != '') {
                alert('GST number is not valid. Please enter a valid GST number.');
                return false;
            }
        }
        // PAN VALIDATION
        var panregex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (aPAN != "") {
            var inputvalues = $("#aPAN").val().toUpperCase();
            if (panregex.test(inputvalues) == false) {
                alert("Please enter a valid PAN No.");
                return false;
            }
            if ($("#aPAN").val().length < 10) {
                alert("PAN no. should be of 10 characters only.");
                return false;
            }
        }
        var formdata = new FormData();
        formdata.append("multipleAddressContact", multipleAddressContact);
        formdata.append("multipleAddressClient", multipleAddressClient);
        formdata.append("mAddress", mAddress);
        formdata.append("aCountry", aCountry);
        formdata.append("aState", aState);
        formdata.append("aCity", aCity);
        formdata.append("aPincode", aPincode);
        formdata.append("aGST", aGST); //hiddenAddIt
        formdata.append("aPAN", aPAN);
        formdata.append("hiddenAddIt", hiddenAddIt);
        openload();
        var ld12 = $.ajax({
            async: true,
            url: "/api/CallApi/SaveClientAddressData",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                $("#savemultipleaddress")[0].reset();
                loadMultipleAddressTable(pageindex);
                $("#savecontactaddress").html("save");
                $("#savecontactaddress").removeAttr("title");
                $("#multipleAddressClient").removeAttr("disabled");
                $("#Clistctypeaddress").removeAttr("disabled");
                window.alert("Successfully saved");
                closeload();
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
    $("#multipleAddressClientFilter").change(function () {
        $("#multipleAddressContactFilter").val("");
        loadMultipleAddressTable(1);
    });
    $("#multipleAddressContactFilter").change(function () {
        $("#multipleAddressClientFilter").val("");
        loadMultipleAddressTable(1);
    });
    $(document).on('click', '#paginate', function () {
        ipageindex = $(this).attr("index");
        loadMultipleAddressTable(ipageindex);
    });
    /*Get multiple address by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    loadMultipleAddressTable(pageindex);
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
    function isUUID(uuid) {
        let s = "" + uuid;
        s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        if (s === null) {
            return false;
        }
        return true;
    }
    loadMultipleAddressTable(1);
    /*Load multiple address by page number*/
    function loadMultipleAddressTable(pageindex) {
        var html3 = '';
        var formData = new FormData();
        var clientids23 = $("#multipleAddressClientFilter").val();
        if (clientids23 == "null" || clientids23 == null || clientids23 == "undefined") {
            clientids23 = "";
        }
        var contactids23 = $("#multipleAddressContactFilter").val();
        if (contactids23 == "null" || contactids23 == null || contactids23 == "undefined") {
            contactids23 = "";
        }
        var typeid23 = "Client"; //$("#ClistctypeaddressFilter").val();
        if (typeid23 == "null" || typeid23 == null || typeid23 == "undefined") {
            typeid23 = "";
        }
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        formData.append("client", clientids23);
        formData.append("contact", contactids23);
        formData.append("type", typeid23);
        openload();
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadMultipleAddress",
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
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    html3 += ''
                    $("#bindClientAddress").html("");
                    $.each(response1, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
                        if (i === (length - 1)) {
                            //var pnext = pageindex;
                            //var pprev = pageindex;
                            //var pageno = pageindex;
                            //var totdata = val.totRow;
                            //var totpage = 0;
                            //if (val.totRow > 0) {
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
                            //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a type="button" id="getdatabypagenum" class="gobtn" style="margin-left:10px;cursor:pointer">Go</button> </a></li>'
                            //if (val.totRow <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //else {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#ulfooter").append(tfot);
                            //closeload();

                            var totdata = val.totRow;
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
                        html3 += '<tr>'
                        html3 += '<td class="eType">'
                        html3 += val.rownum
                        html3 += '</td>'
                        //html3 += '<td class="eType">'
                        //html3 += val.Contacttype
                        //html3 += '</td>'
                        html3 += '<td class="eClient">'
                        html3 += val.ClientName
                        html3 += '</td>'
                        html3 += '<td class="eContact">'
                        html3 += val.ContactName
                        html3 += '</td>'
                        html3 += '<td class="eAddress">'
                        html3 += val.Address
                        html3 += '</td>'
                        html3 += '<td class="eCountry">'
                        html3 += val.Country
                        html3 += '</td>'
                        html3 += '<td class="eState">'
                        html3 += val.State
                        html3 += '</td>'
                        html3 += '<td class="eCity">'
                        html3 += val.City
                        html3 += '</td>'
                        html3 += '<td class="ePIN">'
                        html3 += val.Pin
                        html3 += '</td>'
                        html3 += '<td class="eGST">'
                        html3 += val.GSTNo
                        html3 += '</td>'
                        html3 += '<td class="ePAN">'
                        html3 += val.PANNo
                        html3 += '</td>'
                        html3 += '<td class="eCreatedBy">'
                        html3 += val.CreatedBy
                        html3 += '</td>'
                        html3 += '<td class="edate">'
                        html3 += val.date_time
                        html3 += '</td>'
                        html3 += '<td class="eAction">'
                        html3 += '<ul class="table_action">'
                        html3 += '<li><span class="taskoutboxbtnicon" id="EditAddress" style="cursor:pointer;" Type="' + val.ProfileType + '" token="' + val.Id + '" title="Edit Address"> <img src="/newassets/img/edit.svg"> </span></li>'
                        html3 += '<li><span class="taskoutboxbtnicon" id="RemoveData" style=";cursor:pointer;" token="' + val.Id + '" title="Remove Address"><img src="/newassets/img/delete.svg"></span></li>'
                        html3 += '</ul>'
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#bindClientAddress").html("").html(html3);
                    closeload();
                }
                else {
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    //$("#notfound").show();
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

    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
    });

 /*Pagination Start*/
    var isRenderPage = false;
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
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        isRenderPage = true;
        $("#txtgopage").val("");
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#prev", function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = true;
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        cloadcontactlist(setPageNo);
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
        cloadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
/*Pagination End*/

    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    $(document).on('click', '#paginate', function () {
        cpageindex = $(this).attr("index");
        loadMultipleAddressTable(cpageindex);
    });
    /*Edit address*/
    $(document).on("click", "#EditAddress", function () {
        var Id = $(this).attr("token");
        var ProfileType = $(this).attr("type");
        $("#savecontactaddress").html("Update");
        $("#savecontactaddress").attr("title", "Update");
        var formData = new FormData();
        formData.append("Id", Id);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SingleAddressData",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                response = JSON.parse(response.Data);
                var length = response.length;
                if (length > 0) {
                    $.each(response, function (i, a) {
                        var client = a.ClientId;
                        var address = a.Address;
                        var Country = a.Country;
                        var state = a.State;
                        var city = a.City;
                        var pin = a.Pin;
                        var Gst = a.GSTNo;
                        var Pan = a.PANNo;
                        var aid = a.Id;
                        //if (client == null || client == "null" || client == "") {
                        //    $("#Propectdiv").show();
                        //    $("#clientdiv").hide();
                        //    $("#Clistctypeaddress").val(ProfileType).val(ProfileType.toLowerCase()).change();
                        //    setTimeout(function () {
                        //        $("#multipleAddressContact").val(a.ContactId);
                        //    }, 1000);
                        //    $("#multipleAddressClient").val("");
                        //    $("#multipleAddressContact,#Clistctypeaddress").attr("disabled", "disabled");
                        //}
                        //else {
                        //    $("#Propectdiv").hide();
                        //    $("#clientdiv").show();
                        //    $("#multipleAddressClient").val(client);
                        //    $("#multipleAddressContact").val("");
                        //    $("#multipleAddressClient,#Clistctypeaddress").attr("disabled", "disabled");
                        //}

                        
                        $("#clientdiv").show();
                        $("#multipleAddressClient").val(client);
                        $("#multipleAddressContact").val("");
                        $("#multipleAddressClient").attr("disabled", "disabled");

                        $("#mAddress").val(address);
                        $("#aCountry").val(Country);
                        $("#aState").val(state).change();
                        $("#aPincode").val(pin);
                        $("#aGST").val(Gst);
                        $("#aPAN").val(Pan);
                        $("#hiddenAddIt").val(aid);
                        setTimeout(function () { $("#aCity").val(city); }, 1000);
                    });
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    /*Remove client multiple address by Address id*/
    //$(document).on("click", "#RemoveData", function () {
    //    var Id = $(this).attr("token");
    //    var formData = new FormData();
    //    formData.append("Id", Id);
    //    var Con = confirm("Are you sure you want to delete this Address.");
    //    if (Con == true) {
    //        $.ajax({
    //            async: true,
    //            type: "POST",
    //            url: "/api/CallApi/RemoveAddressData",
    //            dataType: 'json',
    //            data: formData,
    //            contentType: false,
    //            processData: false,
    //            success: function (response) {
    //                response = JSON.parse(response.Data);
    //                if (response == "1") {
    //                    alert("Successfully Deleted");
    //                    loadMultipleAddressTable(pageindex);
    //                }
    //                else {
    //                    alert("Sorry It cannot be deleted");
    //                }
    //            },
    //            failure: function (data) {
    //                alert(data.responseText);
    //            },
    //            error: function (data) {
    //                alert(data.responseText);
    //            }
    //        });
    //    }
    //    else {
    //        return false;
    //    }
    //});

    $(document).on("click", "#RemoveData", function () {
        var Id = $(this).attr("token");
       
        //var Con = confirm("Are you sure you want to delete this Address.");
        //if (Con == true) {
           
        //}
        //else {
        //    return false;
        //}
        $("#myModalDeleteConfirmation").modal();
        $("#deleteListDetails").attr("data-val", Id);
    });
    $(document).on("click", "#deleteListDetails", function () {
        var Id = $(this).attr("data-val");
        fnRemoveData(Id);
    });

    function fnRemoveData(Id) {

        var formData = new FormData();
        formData.append("Id", Id);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/RemoveAddressData",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                response = JSON.parse(response.Data);
                if (response == "1") {
                   // alert("Successfully Deleted");
                    new PNotify({
                        title: 'Success!',
                        text: ' Successfully Deleted',
                        type: 'success',
                        delay: 3000
                    });
                    loadMultipleAddressTable(pageindex);
                }
                else {
                    //alert("Sorry It cannot be deleted");
                    new PNotify({
                        title: 'Info!',
                        text: 'Sorry It cannot be deleted',
                        type: 'error',
                        delay: 3000
                    });
                }
                $("#myModalDeleteConfirmation").modal("hide");
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    //$("#Clistctypeaddress").change(function () {
    //    var lists = $("#Clistctypeaddress option:selected").text();
    //    if (lists == "Client") {
    //        $("#Propectdiv").css("display", "none");
    //        $("#clientdiv").css("display", "block");
    //    }
    //    else {
    //        $("#Propectdiv").css("display", "block");
    //        $("#clientdiv").css("display", "none");
    //        BindcontactByContactId("multipleAddressContact", $("#Clistctypeaddress").val());
    //    }
    //});
    //$("#ClistctypeaddressFilter").change(function () {
    //    var lists = $("#ClistctypeaddressFilter option:selected").text();
    //    if (lists == "Client") {
    //        $("#PropectdivFilter").css("display", "none");
    //        $("#clientdivFilter").css("display", "block");
    //    }
    //    else {
    //        $("#PropectdivFilter").css("display", "block");
    //        $("#clientdivFilter").css("display", "none");
    //        BindcontactByContactId("multipleAddressContactFilter", $("#ClistctypeaddressFilter").val());
    //    }
    //});
    /*Get new standard contact by contact id*/
    function BindcontactByContactId(controlname, sendertype) {
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", 1000);
        formdata.append("search", "");
        formdata.append("type", sendertype);
        formdata.append("iscomorindv", "");
        $("#" + controlname).html("").append("<option value=''>Select</option>");
        var ld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewStandardContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                try {
                    $.each(JSON.parse(response.Data), function (i, a) {
                        var option = '<option value="' + a.cid + '" >' + a.fname + ' ' + a.mname + ' ' + a.lname + '-(' + a.ProfileType + ')</option>';
                        $("#" + controlname).append(option);
                    });
                }
                catch
                {
                }
            },
            failure: function (response) {
                //alert(response.responseText);
            },
            error: function (response) {
                //alert(response.responseText);
            }
        });
    }
});
