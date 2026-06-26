$(document).ready(function () {
    var type = 9;
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0, totalRecordCount=0;

    /*Special character*/
    function specialcharecter() {
        var strretrn = "0";
        var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
        var data = document.getElementById("clusername").value;
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                showAlertStandaredUserlist("Validation Error","Special characters and spaces are not allowed in the User Id.")
               /* alert("Special characters and spaces are not allowed in the User Id.");*/
                document.getElementById("clusername").focus();
                // document.getElementById("txtCallSign").value = "";
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    /*Pass special character*/
    function specialcharecterpass(str) {
        var strretrn = "0";
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                showAlertStandaredUserlist("Validation Error", "`()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.")
                /*alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");*/
                document.getElementById("clnpassword").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }


    //Start pagination sub function
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        pageindex = page;
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    });

    $("#prev").click(function () {

        if (pageindex > 1) {
            pageindex = pageindex - 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    });

    $("#next").click(function () {
        if (pageindex => 1) {
            pageindex = pageindex + 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > totalRecordCount) {
            setPageNo = 1;
            alert("Please enter a valid page number.");
            return false;
        }
        isRenderPage = true;
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
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
    /*Create user login*/
    $(document).on("click", "#CreateUserlogin", function () {
        var token = $(this).attr("data-val");
        $("#cltoken").val(token);
        $("#frmpass")[0].reset();
        $('#myModalccc').modal({ show: true });
    });

    /*Reset user*/
    $(document).on("click", "#Resetuser", function () {
        var token = $(this).attr("id-val");
        $("#uservalue").val(token);
        $("#ResetPasswordtest")[0].reset();
        $('#ResetPassword').modal({ show: true });
    });
    /*Toggle password*/
    $(".toggle-password1").click(function () {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.prop("type") == "password") {
            input.prop("type", "text");
        } else {
            input.prop("type", "password");
        }
    });

    /*Submit password*/
    $("#submitPassword").click(function () {
        try {
            var password = $("#newpassword").val();
            var cpassword = $("#cnfpassword").val();
            var token = $("#uservalue").val();
            if (password == "") {
                $('#UserEnableDisbleModalConfirm').modal('show');
                
                //alert("Please set the password for the User Id.");
                return false;
            }
            if (password.length < 8) {
                alert("Password must contain at least eight characters.");
                return false;
            }
            if ($("#newpassword").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#newpassword").val()) == false) {
                    alert("Password must be minimum eight characters,at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (specialcharecterpass($("#newpassword")) == "1") {
                return false;
            }
            if (cpassword == "") {
                //alert("Please confirm your password that you want to set.");
                $('#SetPasswordModalConfirm').modal('show');
                return false;
            }
            if (cpassword.length < 8) {
                //alert("Confirm Password must contain at least eight characters.");
                $('#ConfirmPasswordLength').modal('show');
                return false;
            }
            if ($("#cnfpassword").val() != "") {
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (reg.test($("#cnfpassword").val()) == false) {
                    alert("Confirm password must be minimum eight characters,at least one uppercase letter, one lowercase letter, one number and one special character");
                    return false;
                }
            }
            if (specialcharecterpass($("#cnfpassword")) == "1") {
                return false;
            }
            var formData = new FormData();
            formData.append("newpass", EncodeText(cpassword));
            formData.append("token", EncodeText(''));
            formData.append("tokenid", EncodeText(token));
            if (password == cpassword) {
                openload();
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/api/CallApi/ResetUserPassword",
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.Data == "1") {
                            //alert("Password has been reset Successfully !");
                            $('#PasswordResetModalConfirm').modal('show');
                            $('#ResetPassword').modal('hide');
                            closeload();
                        }
                    }, //End of AJAX Success function
                    failure: function (response) {
                        alert(data.responseText);
                        closeload();
                    }, //End of AJAX failure function
                    error: function (response) {
                        alert(data.responseText);
                        closeload();
                    } //End of AJAX error function
                });
            }
            else {
                alert("Password does not match");
            }
        }
        catch (err) {
            alert(err.message);
        }
    });
    $("#chngclpwd").click(function () {


        var password = $("#clnpassword").val();
        var confirmPassword = $("#clcpassword").val();
        var username = $("#clusername").val();
        if (username == "") {
            //alert("Please enter a User Id.");

            //  $('#EnterUserIdModalConfirm').modal('show');
            document.getElementById("confirmTitle1").innerHTML = "Confirmation";
            document.getElementById("confirmMessage1").innerHTML = "Please Enter the User Id.";
            $('#UserEnableDisbleModalConfirm').modal('show');


            document.getElementById("clusername").focus();
            return false;
        }
        if (username.length < 5) {
            document.getElementById("confirmTitle1").innerHTML = "Confirmation";
            document.getElementById("confirmMessage1").innerHTML = "User id should be more than or equal to five characters.";
            $('#UserEnableDisbleModalConfirm').modal('show');
            document.getElementById("clusername").focus();
            return false;
        }
        if (specialcharecter() == "1") {
            return false;
        }
        if (password == "") {
            document.getElementById("confirmTitle1").innerHTML = "Confirmation";
            document.getElementById("confirmMessage1").innerHTML = "Please set the password for the User Id.";
            $('#UserEnableDisbleModalConfirm').modal('show');
            //alert("Please set the password for the User Id.");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if (password.length < 8) {
            document.getElementById("confirmTitle1").innerHTML = "Confirmation";
            document.getElementById("confirmMessage1").innerHTML = "Password must contain at least eight characters.";
            $('#UserEnableDisbleModalConfirm').modal('show');
           // alert("Password must contain at least eight characters.");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if ($("#clnpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#clnpassword").val()) == false) {
                document.getElementById("confirmTitle1").innerHTML = "Confirmation";
                document.getElementById("confirmMessage1").innerHTML = "Password must be minimum eight characters, with atleast 1 uppercase, 1 lowercase and 1 special character.";
                $('#UserEnableDisbleModalConfirm').modal('show');

                //alert("Password must be minimum eight characters, with atleast 1 uppercase, 1 lowercase and 1 special character");
                document.getElementById("clnpassword").focus();
                return false;
            }
        }
        if (specialcharecterpass($("#clnpassword")) == "1") {
            return false;
        }
        if (confirmPassword == "") {
            //alert("Please confirm your password that you want to set.");
            $('#SetPasswordModalConfirm').modal('show');
            document.getElementById("clcpassword").focus();
            return false;
        }
        if (confirmPassword.length < 8) {
            //alert("Confirm Password must contain at least eight characters.");
            $('#ConfirmPasswordLength').modal('show');
            document.getElementById("clcpassword").focus();
            return false;
        }
        if ($("#clcpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#clcpassword").val()) == false) {
                document.getElementById("confirmTitle1").innerHTML = "Confirmation";
                document.getElementById("confirmMessage1").innerHTML = "Confirm Password must be minimum eight characters, with atleast 1 uppercase, 1 lowercase and 1 special character.";
                $('#UserEnableDisbleModalConfirm').modal('show');
               // alert("Confirm Password must be minimum eight characters, with atleast 1 uppercase, 1 lowercase and 1 special character");
                document.getElementById("clcpassword").focus();
                return false;
            }
        }
        if (specialcharectercpass($("#clcpassword")) == "1") {
            return false;
        }
        if (password != confirmPassword) {
            document.getElementById("confirmTitle1").innerHTML = "Confirmation";
            document.getElementById("confirmMessage1").innerHTML = "Password did not match!";
            $('#UserEnableDisbleModalConfirm').modal('show');
           // alert("Password did not match!");
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
                    url: "/api/CallApi/CreateUserLogin", // Controller/View
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
                        else if (data.Data == "invalid user license") {
                            alert("Invalid user login credentials. Please check the same or contact your administrator.")
                            closeload();
                        }
                        else if (data.Data == "user exceed limit") {
                            alert("You have reached your License limit. Please upgrade your subscription Plan.")
                            closeload();
                        }
                        else {
                            $("#frmpass")[0].reset();
                            showAlertStandaredUserlist("Success", "User credentials created successfully");
                         /*   alert("User credentials created successfully");*/
                            document.getElementById("closemodel").click();
                            isRenderPage = false;

                            loaddatalist(pageindex);
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
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    var exportfilter = false;
    /*Export user in excel*/
    $("#excel").click(function () {
        var searchdata = $('#usernamefilter').val();
        var usernamesearchdata = $('#loginusernamefilter').val();
        window.location = encodeURI("/firm/ExportoExcelUser?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&usernamesearchdata=" + usernamesearchdata);
    })
    /*Export user in password*/
    $("#pdf").click(function () {
        var searchdata = $('#usernamefilter').val();
        var usernamesearchdata = $('#loginusernamefilter').val();
        window.location = encodeURI("/firm/ExportoPdfUser?status=true&searchdata=" + searchdata + "&exportfilter=" + exportfilter + "&usernamesearchdata=" + usernamesearchdata);
    })
    $("#linkuser").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateUser");
    });
    $("#raccess").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/setusermodulerights");
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();
    //Enable User
    $(document).on("click", "#enable", function () {
        selectedID = [];

        const userId = $(this).attr("data-id");

        if (!userId) {
            new PNotify({
                title: 'Warning',
                text: 'You have not selected any User to activate account, please select.',
                type: 'error',
                delay: 3000
            });
            return false;
        }

        selectedID.push(userId);

        showConfirmationModal(
            "Confirmation",
            "Are you sure you want to Enable the account?"
        ).then(function (result) {
            if (result) {
                // User clicked OK
                openload();

                $.ajax({
                    url: '/api/CallApi/EnableUser',
                    data: JSON.stringify(selectedID),
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function (response) {
                        selectedID = [];

                        if (response.Status === true) {
                            if (response.Data === "invalid user license") {
                                alert("Invalid user login credentials. Please check the same or contact your administrator.");
                            } else if (response.Data === "user exceed limit") {
                                alert("You have reached the maximum limit of user creation based on your plan. Please upgrade your plan for a seamless experience.");
                            } else {
                                new PNotify({
                                    title: 'Success!',
                                    text: 'User Account Activated Successfully',
                                    type: 'success',
                                    delay: 3000
                                });

                                loadtabledata();
                                $('.pagination').hide();

                                $('#maxRows option').prop('selected', function () {
                                    return this.defaultSelected;
                                });
                            }
                        }

                        closeload();
                    },
                    error: function () {
                        closeload();
                    }
                });
            } else {
                // User clicked Cancel
                console.log("Activation cancelled by user.");
            }
        });
    });


    //$(document).on("click", "#enable", function () {
    //    selectedID = [];
    //    selectedID.push($(this).attr("data-id"));
    //    if (JSON.stringify(selectedID) == "[]") {
    //        new PNotify({
    //            title: 'Warning',
    //            text: ' You have not selected any User to activate account, please select ',
    //            type: 'error',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    enableclient();
    //    function enableclient() {
    //        var result = confirm("Are you sure to Enable Account?");
    //        if (result) {
    //            if (JSON.stringify(selectedID) != "[]") {
    //                openload();
    //                $.ajax({
    //                    url: '/api/CallApi/EnableUser',
    //                    data: JSON.stringify(selectedID),
    //                    type: 'POST',
    //                    contentType: "application/json; charset=utf-8",
    //                    dataType: 'json',
    //                    success: function (response) {
    //                        selectedID = [];
    //                        if (response.Status == true) {
    //                            if (response.Data == "invalid user license") {
    //                                alert("Invalid user login credentials. Please check the same or contact your administrator.")
    //                                closeload();
    //                            }
    //                            else if (response.Data == "user exceed limit") {
    //                                alert("You have reached the maximum limit of the user creation based on your plan. Please upgrade your plan for a seamless experience.")
    //                                closeload();
    //                            }
    //                            else {
    //                                var datas = JSON.stringify(response);
    //                                new PNotify({
    //                                    title: 'Success!',
    //                                    text: 'User Account Activated Successfully',
    //                                    type: 'success',
    //                                    delay: 3000
    //                                });
    //                                loadtabledata();
    //                                $('.pagination').hide();
    //                                $('#maxRows option').prop('selected', function () {
    //                                    return this.defaultSelected;
    //                                });
    //                                closeload();
    //                            }
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
    //                    text: ' You have not selected any User to activate account, please select',
    //                    type: 'error',
    //                    delay: 3000
    //                });
    //                closeload();
    //            }
    //        }
    //    }
    //});
    /*Disable*/
    $(document).on("click", "#disable", function () {
        selectedID = [];

        const username = $(this).attr("username");
        const userId = $(this).attr("data-id");

        if (!userId) {
            new PNotify({
                title: 'Warning',
                text: 'You have not selected any User to deactivate account, please select.',
                type: 'error',
                delay: 3000
            });
            return false;
        }

        selectedID.push(userId);

        showConfirmationModal(
            "Confirmation",
            "If you disable the account, '" + username + "' will be removed automatically from all matters whether assigned or added and notifications. Are you sure you want to De-Activate the account?"
        ).then(function (result) {
            if (result) {
                // User confirmed
                openload();

                $.ajax({
                    url: '/api/CallApi/DisableUser',
                    data: JSON.stringify(selectedID),
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function (response) {
                        selectedID = [];

                        if (String(response.Data) === "true") {
                            new PNotify({
                                title: 'Success!',
                                text: 'User Account De-Activated Successfully',
                                type: 'success',
                                delay: 3000
                            });

                            loadtabledata();
                            $('.pagination').hide();

                            $('#maxRows option').prop('selected', function () {
                                return this.defaultSelected;
                            });
                        } else if (String(response.Data) === "false") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Oops, something went wrong',
                                type: 'warning',
                                delay: 3000
                            });
                        } else {
                            new PNotify({
                                title: 'Error!',
                                text: response.Data,
                                type: 'error',
                                delay: 3000
                            });
                        }

                        closeload();
                    },
                    error: function () {
                        alert('Error!');
                        closeload();
                    }
                });
            } else {
                // User cancelled
                console.log("Deactivation cancelled by user.");
            }
        });
    });
    function showConfirmationModal(title, message) {
        return new Promise(function (resolve) {
            $('#confirmTitle1').text(title);
            $('#confirmMessageforAccount').text(message);

            $('#UserEnableDisableConfirmation').modal('show');

            $('#okBtn').one('click', function () {
                $('#UserEnableDisableConfirmation').modal('hide');
                resolve(true);
            });

            $('#cancelBtn').one('click', function () {
                $('#UserEnableDisableConfirmation').modal('hide');
                resolve(false);
            });
        });
    }

    //$(document).on("click", "#disable", function () {
    //    selectedID = [];
    //    var username = $(this).attr("username");
    //    selectedID.push($(this).attr("data-id"));
    //    if (JSON.stringify(selectedID) == "[]") {
    //        new PNotify({
    //            title: 'Warning',
    //            text: ' You have not selected any User to deactivate account, please select ',
    //            type: 'error',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    enableclient();
    //    function enableclient() {
    //        var result = confirm("If you disable the account, '" + username + "' will be removed automatically from all matters whether assigned or added and notifications. Are sure to De-Activate the account? ");
    //        if (result) {
    //            if (JSON.stringify(selectedID) != "[]") {
    //                openload();
    //                $.ajax({
    //                    url: '/api/CallApi/DisableUser',
    //                    data: JSON.stringify(selectedID),
    //                    type: 'POST',
    //                    contentType: "application/json; charset=utf-8",
    //                    dataType: 'json',
    //                    success: function (response) {
    //                        selectedID = [];
    //                        if (String(response.Data) == "true") {
    //                            var datas = JSON.stringify(response);
    //                            new PNotify({
    //                                title: 'Success!',
    //                                text: ' User Account De-Activated Successfully',
    //                                type: 'success',
    //                                delay: 3000
    //                            });
    //                            loadtabledata();
    //                            $('.pagination').hide();
    //                            $('#maxRows option').prop('selected', function () {
    //                                return this.defaultSelected;
    //                            });
    //                            closeload();
    //                        }
    //                        else if (String(response.Data) == "false") {
    //                            new PNotify({
    //                                title: 'warning!',
    //                                text: ' oops something went wrong',
    //                                type: 'warning',
    //                                delay: 3000
    //                            });
    //                            closeload();
    //                        }
    //                        else {
    //                            new PNotify({
    //                                title: 'error!',
    //                                text: response.Data,
    //                                type: 'error',
    //                                delay: 3000
    //                            });
    //                            closeload();
    //                        }
    //                    },
    //                    error: function () {
    //                        alert('Error!');
    //                        closeload();
    //                    }
    //                });
    //            }
    //            else {
    //                new PNotify({
    //                    title: 'Warning',
    //                    text: ' You have not selected any User to deactivate account, please select ',
    //                    type: 'error',
    //                    delay: 3000
    //                });
    //                closeload();
    //            }
    //        }
    //    }
    //});



    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedIDSync = new Array();
    $(document).on("click", "#syncrqst", function () {
        selectedIDSync = [];
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                selectedIDSync.push($(this).val());
            }
        });
        if (JSON.stringify(selectedIDSync) == "[]") {
            new PNotify({
                title: 'Warning',
                text: 'You have not selected any row to sync?',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
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
                            isRenderPage = false;

                            loaddatalist(pageindex);
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
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    openload();
    loadtabledata();

    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    //load table data
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    loaddatalist(pageindex);
                    closeload();
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
    $("#searchdatas").click(function () {
        $("#searchdatas").attr("disabled", true);
        exportfilter = true;
        loaddatalist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loaddatalist(1);
                exportfilter = false;
                chksflag = false;
            }
        }
    });
    $("#clearnewsearchcompany").click(function () {
        $("#usernamefilter").val("");
        $("#clearnewsearchcompany").css("display", "none");
        isRenderPage = false;
        loaddatalist(1);
        chksflag = true;
    })
    $("#searchuser").click(function () {
        isRenderPage = false;

        loaddatalist(1);
        chksflag = true;
        $("#clearnewsearchcompany").css("display", "unset");
    });
    $("#clearnewsearchusername").click(function () {
        $("#loginusernamefilter").val("");
        $("#clearnewsearchusername").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
        chksflag = true;
    })
    $("#searchusername").click(function () {
        isRenderPage = false;

        loaddatalist(1);
        chksflag = true;
        $("#clearnewsearchusername").css("display", "unset");
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loaddatalist(pageindex);
    });
    function loadtabledata() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example" class="table-panel" /><tr><th bgcolor="DIMGRAY">').addClass('table1');
        $header = $('<thead  >').html('');
        if (stfUser > 0)
            $head1 = $('<th><div class="thbg"><input type="checkbox" id="select_all" /></div></th> <th class="cname"><div class="thbg"> <div style="float:left;width:80%"><input type="text" id="usernamefilter" placeholder="User Name" class="form-control pull-left" style="width:120px;"></div> <div style="float:left;width:20%"><span class="glyphicon glyphicon-search" id="searchuser" style="margin: 5px 0 0 -14px;float:right;"></span><span id="clearnewsearchcompany" style="display:none;color: black;font-weight: 350;font-size: 15px;cursor:pointer">x</span></div> </div> </th> <th class="designation"><div class="thbg">Designation</div></th> <th class="department"><div class="thbg">Department</div></th> <th class="branch"><div class="thbg">Branch</div></th> <th class="utype"><div class="thbg">User Type</div></th> <th class="rmanager"><div class="thbg">Reporting Manager</div></th> <th class="ppartner"><div class="thbg">Parent Secondary</div></th> <th class="email"><div class="thbg">Email</div></th> <th class="mobile"><div class="thbg">Mobile </div></th> <th class="status1"><div class="thbg" style="width:125px;">Status</div></th> <th class="date_time"><div class="thbg">Date</div></th> <th class="CreatedBy" ><div class="thbg">Created by </div></th> <th class="username" ><div class="thbg"> <div style="float:left;width:80%"><input type="text" id="loginusernamefilter" placeholder="Login User Name" class="form-control pull-left" style="width:120px;"></div> <div style="float:left;width:20%"><span class="glyphicon glyphicon-search" id="searchusername" style="margin: 5px 0 0 -14px;float:right;"></span><span id="clearnewsearchusername" style="display:none;color: black;font-weight: 350;font-size: 15px;cursor:pointer">x</span></div> </div></th> <th class="hrate"><div  class="thbg">Rate/hour</div></th> <th class="empcode"><div  class="thbg">Employee Code</div></th> <th class="qualification"> <div class="thbg">Qualification </div></th> <th class="areaofexpertise" style="min-width:200px;" ><div  class="thbg"> Area of Expertise </div></th> <th class="pqe" > <div  class="thbg">PQE </div></th> <th class="firmexperience" > <div class="thbg">Firm Experience </div></th> <th class="address" ><div  class="thbg">Address </div></th> <th class="city" ><div  class="thbg">City </div></th> <th class="state" ><div  class="thbg">State </div></th> <th class="country" ><div  class="thbg">Country </div></th> <th class="landline" ><div  class="thbg">Landline </div></th> <th class="extention" ><div  class="thbg">Extension</div></th> <th class="odetails" ><div  class="thbg">Other Details</div></th> <th><div class="thbg" style="min-width:120px">Action</div></th>');
        else {
            $head1 = $('<th><div class="thbg"><input type="checkbox" id="select_all" /></div></th> <th class="cname"><div class="thbg"> <div style="float:left;width:80%"><input type="text" id="usernamefilter" placeholder="User Name" class="form-control pull-left" style="width:120px;"></div> <div style="float:left;width:20%"><span class="glyphicon glyphicon-search" id="searchuser" style="margin: 5px 0 0 -14px;float:right;"></span><span id="clearnewsearchcompany" style="display:none;color: black;font-weight: 350;font-size: 15px;cursor:pointer">x</span></div> </div> </th> <th class="designation"><div class="thbg">Designation</div></th> <th class="department"><div class="thbg">Department</div></th> <th class="branch"><div class="thbg">Branch</div></th> <th class="utype"><div class="thbg">User Type</div></th> <th class="rmanager"><div class="thbg">Reporting Manager</div></th> <th class="ppartner"><div class="thbg">Parent Partners</div></th> <th class="email"><div class="thbg">Email</div></th> <th class="mobile"><div class="thbg">Mobile </div></th> <th class="status1"><div class="thbg" style="width:125px;">Status</div></th> <th class="date_time"><div class="thbg">Date</div></th> <th class="CreatedBy" ><div class="thbg">Created by </div></th> <th class="username" ><div class="thbg"> <div style="float:left;width:80%"><input type="text" id="loginusernamefilter" placeholder="Login User Name" class="form-control pull-left" style="width:120px;"></div> <div style="float:left;width:20%"><span class="glyphicon glyphicon-search" id="searchusername" style="margin: 5px 0 0 -14px;float:right;"></span><span id="clearnewsearchusername" style="display:none;color: black;font-weight: 350;font-size: 15px;cursor:pointer">x</span></div> </div></th> <th class="hrate"><div  class="thbg">Rate/hour</div></th> <th class="empcode"><div  class="thbg">Employee Code</div></th> <th class="qualification"> <div class="thbg">Qualification </div></th> <th class="areaofexpertise" style="min-width:200px;" ><div  class="thbg"> Area of Expertise </div></th> <th class="pqe" > <div  class="thbg">PQE </div></th> <th class="firmexperience" > <div class="thbg">Firm Experience </div></th> <th class="address" ><div  class="thbg">Address </div></th> <th class="city" ><div  class="thbg">City </div></th> <th class="state" ><div  class="thbg">State </div></th> <th class="country" ><div  class="thbg">Country </div></th> <th class="landline" ><div  class="thbg">Landline </div></th> <th class="extention" ><div  class="thbg">Extension</div></th> <th class="odetails" ><div  class="thbg">Other Details</div></th> <th><div class="thbg" style="min-width:120px">Action</div></th>');

        }



        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $('#updatePanel').html($table);
        setTimeout(function () {
            isRenderPage = false;
            loaddatalist(pageindex);
        }, 1000);
    }
    flaghide = true;
    /*Load data list*/
    function loaddatalist(pageindex) {
        $("#loadactivitydatas").html("");
        $("#datastatus").html("");
        $("#pagenatedArea").hide();

        var fcode = localStorage.getItem("FirmCode");
        var loginusername = $("#loginusernamefilter").val();
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText($('#usernamefilter').val()));
        formdata.append("loginusernamesrh", EncodeText(loginusername));
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/CallApi/SpUserDatabyrowid',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                debugger
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                $("#tfooter").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    // alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    closeload();
                }
                else {
                  
                    //document.querySelector(".pagination").style.display = "none";
                    //document.querySelector(".pagination").style.setProperty("display", "none", "important");

                    isRenderPage = false;
                    $("#datastatus").append(
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No  list found</h4>' +
                        '<p>We found no  list.</p>'
                    );
                    closeload();
                }

                var it = 2;
                var bclass = '';
                var bdata = '';
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    var totpage = 0;

                    if (i === (length - 1)) {
                        document.querySelector(".pagination").style.display = "flex";
                        $("#pagenatedArea").show();

                        var totdata = val.totRow

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
                            totalRecordCount = totpage;
                            renderPagination(pageindex, totpage);
                        }

                        closeload();
                    }
                    var btitle = "";
                    var dyids = "";
                    if (val.IsActive == true) {
                        bclass = "enabled_badge ";
                        bdata = "Enabled";
                        btitle = "Click here to deactivate User credentials."
                        dyids = "disable"
                    }
                    if (val.IsActive == false) {
                        bclass = "disabled_badge";
                        bdata = "Disabled";
                        btitle = "Click here to activate User credentials.";
                        dyids = "enable";
                        


                        //alert(bdata);
                    }
                    //alert(val.cphoto);
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr  />');
                    $row.append($('<td class="s" valign="top" />').html("<input style='margin:0 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.LoginId + "'/>"));
                    $row.append($('<td class="cname" />').html("<span>" + (val.cfname != null ? val.cfname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="designation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="department" />').html("<span>" + (val.Department != null ? val.Department : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="branch" />').html("<span>" + (val.Branch != null ? val.Branch : '<span style="visibility: hidden;">&nbsp;</span>')));
                    //if (val.IsPartner == "1") {
                    //    $row.append($('<td class="utype" />').html("<span>Partner</span>"));
                    //}
                    //else {
                    //    $row
                    //        .append($('<td class="utype" />').html("<span>User</span>"));
                    //}

                    if (stfUser > 0) {
                        if (val.IsPartner == "1") {
                            $row.append($('<td class="utype" />').html("<span>Secondary</span>"));
                        }
                        else {
                            $row
                                .append($('<td class="utype" />').html("<span>Tertiary</span>"));
                        }
                    }
                    else {
                        if (val.IsPartner == "1") {
                            $row.append($('<td class="utype" />').html("<span>Partner</span>"));
                        }
                        else {
                            $row
                                .append($('<td class="utype" />').html("<span>User</span>"));
                        }
                    }


                    $row.append($('<td class="rmanager" />').html("<span>" + (val.ReportManagerName != null ? val.ReportManagerName : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ppartner" />').html("<span>" + (val.PartnerName != null ? val.PartnerName : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="email" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="mobile" />').html("<span>" + (val.cmobile != null ? val.cmobile : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase())) {
                            $row.append($('<td class="status1 " />').html("<span style='cursor:pointer' title='Create User ID password for User' data-val='" + val.LoginId + "'  class='badge-ac' id='CreateUserlogin'> Add Credentials</span>"));
                        }
                        else {
                            $row.append($('<td class="status1 " />').html("&nbsp;"));
                        }
                    }
                    else {
                        $row.append($('<td class="status1 " />').html("<span class='" + bclass + "' title='" + btitle + "' username='" + val.Username + "'  style='cursor:pointer' id='" + dyids + "' data-id='" + val.LoginId + "'>" + (bdata != "" ? bdata : '<span style="">&nbsp;</span>')));
                    }
                    $row.append($('<td class="date_time" />').html("" + (val.date_time != null ? formatDatetoIST(val.date_time) : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="CreatedBy" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="username" />').html("<span>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="hrate" />').html("" + (val.HRate != null ? val.HRate : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="empcode" />').html("<span>" + (val.EmployeeCode != null ? val.EmployeeCode : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="qualification" />').html("<span>" + (val.Qualification != null ? val.Qualification : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="areaofexpertise" />').html("<span>" + (val.AreaOfExpertise != null ? val.AreaOfExpertise : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="pqe" />').html("<span>" + (val.PQE != null ? val.PQE : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="firmexperience" />').html("<span>" + (val.FirmExperience != null ? val.FirmExperience : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="address" />').html("<span>" + (val.caddress != null ? val.caddress : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="city" />').html("<span>" + (val.ccity != null ? val.ccity : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="state" />').html("<span>" + (val.cstate != null ? val.cstate : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="country" />').html("<span>" + (val.country != null ? val.country : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="landline" />').html("<span>" + (val.clandline != null ? val.clandline : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="extention" />').html("<span>" + (val.Extention != null ? val.Extention : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="odetails" />').html("<span>" + (val.OtherDetails != null ? val.OtherDetails : '<span style="visibility: hidden;">&nbsp;</span>')));
                    var html4 = '';
                    if (val.oedit == 1 || roleids == 1) {
                        if (val.Username == null || val.Username == "" || val.Username == "null") {
                            if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase())) {
                                html4 += "<ul class='action-ul'><li><span id='edituser' style='cursor:pointer;' title='Edit member' id-val=" + val.LoginId + "><img src='/newassets/img/edit-icon.png' /></span></li></ul>";
                            }
                            else {
                                html4 += "&nbsp;";
                                //$row.append($('<td class="status1" />').html("&nbsp;"));
                            }
                        }
                        else {
                            html4 += "<ul class='action-ul'>";
                            html4 += "<li><span id='edituser' style='cursor:pointer;' title='Edit member' id-val=" + val.LoginId + "><img src='/newassets/img/edit-icon.png' /></span></li>";
                            html4 += "<li><span id='Resetuser' style='cursor:pointer;' title='Reset Password' id-val=" + val.LoginId + "><img src='/newassets/img/key-icon.png' /></span></li>";
                            html4 += "</ul>";
                           // $row.append($('<td />').html("</li> "));
                        }
                    }
                    else {
                        html4 += "";
                       // $row.append($('</ul><td />').html(""));
                    }
                    $row.append($('<td class="status1"/>').html(html4));
                    $("#loadactivitydatas").append($row);
                });
                $("#searchdatas").removeAttr("disabled");
                if (flaghide == true) {
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                    $("input:checkbox").click(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).toggle();
                    });
                    flaghide = false;
                }
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                closeload();
            },
            error: function () {
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



    /*Load data list by user name*/
    function loaddatalistbyusername(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var usernamefilter = "";
        var usernameval = $('#usernamefilter').val();
        if (usernameval != "") {
            usernamefilter = usernameval.trim();
        }
        else {
            usernamefilter;
        }
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText(usernamefilter));
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/CallApi/SpUserDatabyusername',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                $("#tfooter").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    // alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    closeload();
                }
                else {
                    $("#datastatus").html("No result found !");
                    closeload();
                }
                var it = 2;
                var bclass = '';
                var bdata = '';
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
                        tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#tfooter").append(tfot);
                        closeload();
                    }
                    var btitle = "";
                    var dyids = "";
                    if (val.IsActive == true) {
                        bclass = "status_badge";
                        bdata = "Enabled";
                        btitle = "Click here to deactivate User credentials."
                        dyids = "disable"
                    }
                    if (val.IsActive == false) {
                        bclass = "label label-danger";
                        bdata = "Disabled";
                        btitle = "Click here to activate User credentials.";
                        dyids = "enable"
                    }
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr  />');
                    $row.append($('<td class="s" valign="top" />').html("<input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.LoginId + "'/>"));
                    $row.append($('<td class="cname" />').html("<span>" + (val.cfname != null ? val.cfname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="designation" />').html("<span>" + (val.Designation != null ? val.Designation : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="department" />').html("<span>" + (val.Department != null ? val.Department : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="branch" />').html("<span>" + (val.Branch != null ? val.Branch : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.IsPartner == "1") {
                        $row.append($('<td class="utype" />').html("<span>Partner</span>"));
                    }
                    else {
                        $row
                            .append($('<td class="utype" />').html("<span>User</span>"));
                    }
                    $row.append($('<td class="rmanager" />').html("<span>" + (val.ReportManagerName != null ? val.ReportManagerName : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ppartner" />').html("<span>" + (val.PartnerName != null ? val.PartnerName : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="email" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="mobile" />').html("<span>" + (val.cmobile != null ? val.cmobile : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase())) {
                            $row.append($('<td class="status1 prem1" />').html("<span class='' style='cursor:pointer' title='Create User ID password for User' data-val='" + val.LoginId + "'  class='badge-ac' id='CreateUserlogin'> Add Credentials</span>"));
                        }
                        else {
                            $row.append($('<td class="status1 prem2" />').html("&nbsp;"));
                        }
                    }
                    else {
                        $row.append($('<td class="status1 prem3" />').html("<span " + bclass + "' title='" + btitle + "' username='" + val.Username + "'  style='cursor:pointer' id='" + dyids + "' data-id='" + val.LoginId + "'>" + (bdata != "" ? bdata : '<span style="">&nbsp;</span>')));
                    }
                    $row.append($('<td class="date_time" />').html("" + (val.date_time != null ? formatDatetoIST(val.date_time) : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="CreatedBy" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="username" />').html("<span>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="hrate" />').html("" + (val.HRate != null ? val.HRate : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="empcode" />').html("<span>" + (val.EmployeeCode != null ? val.EmployeeCode : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="qualification" />').html("<span>" + (val.Qualification != null ? val.Qualification : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="areaofexpertise" />').html("<span>" + (val.AreaOfExpertise != null ? val.AreaOfExpertise : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="pqe" />').html("<span>" + (val.PQE != null ? val.PQE : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="firmexperience" />').html("<span>" + (val.FirmExperience != null ? val.FirmExperience : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="address" />').html("<span>" + (val.caddress != null ? val.caddress : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="city" />').html("<span>" + (val.ccity != null ? val.ccity : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="state" />').html("<span>" + (val.cstate != null ? val.cstate : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="country" />').html("<span>" + (val.country != null ? val.country : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="landline" />').html("<span>" + (val.clandline != null ? val.clandline : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="extention" />').html("<span>" + (val.Extention != null ? val.Extention : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="odetails" />').html("<span>" + (val.OtherDetails != null ? val.OtherDetails : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.oedit == 1 || roleids == 1) {
                        $row.append($('<td />').html("<span class='glyphicon glyphicon-edit' id='edituser' style='color:#069;cursor:pointer;' title='Edit member' id-val=" + val.LoginId + "></span>"));
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $("#loadactivitydatas").append($row);
                });
                $("#searchdatas").removeAttr("disabled");
                if (flaghide == true) {
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                    $("input:checkbox").click(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).toggle();
                    });
                    flaghide = false;
                }
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                closeload();
            },
            error: function () {
                // alert('Error!');
                closeload();
            }
        });
    }
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
                // $("th:nth-child(" + i + ")", table).hide(); //hide header <th bgcolor="DIMGRAY">
            }
        }
    }
    var q = 2;
    loadmenu();
    /*Load menu*/
    function loadmenu() {
        $.ajax({
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
});
var fcode = localStorage.getItem("FirmCode");
$(document).on('click', '#edituser', function () {
    var loginid = $(this).attr("id-val");
    var urls = "/" + fcode + "/Firm/EditUser";
    url_redirect({
        url: urls,
        method: "post",
        data: { "loginid": loginid }
    });
});
$("#ColumnSelectionopen").click(function () {
    //LoadColumnMaster();
    $('#myModalCustomizedcolumn').modal({ show: true });

});

function showAlertStandaredUserlist(title, message) {
    $("#alertTitle").text(title || "Alert");
    $("#alertMessage").text(message || "");

    $("#StandaredUserlistAlertconfirmationdal").modal("show");
}
