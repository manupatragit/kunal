$(document).ready(function () {
    $("#CreeateDir").click(function () {
        var formData = new FormData();
        var d = "dir2"
        var firm = localStorage.getItem("FirmCode");
        formData.append("dname", d);
        formData.append("firm", firm);
        $.ajax({  async: true, 
            url: '/api/CallApi/CreatefileDirectory',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
               // alert("hi");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    alert(datas);
                }
                else {
                    alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    });
    $("#save").click(function () {
        var chkArray3 = [];
        var selected = $("#lstFruits option:selected");
        //        var message = "";
        //        selected.each(function () {
        //            message += $(this).text() + " " + $(this).val() + "\n";
        //});
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
             alert(selected3);
        } 
    });
});
$(function () {
    $('#lstFruits').multiselect({
        // includeSelectAllOption: true
    });
});
permission();
            //$('#btnSelected').click(function () {
            //  
            //});
        loadcontact();
        loadmatter();
    // load contact
        function loadcontact() {
        $.ajax({  async: true, 
            type: "POST",
            url: "/api/matterApi/ContactMatter",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                }
                else {
                    alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var fname = a.fname;
                    var mname = a.mname;
                    var lname = a.lname;
                    if (fname == null) {
                        fname = "";
                    }
                    if (mname == null) {
                        mname = "";
                    }
                    if (lname == null) {
                        lname = "";
                    }
                    var option = '<option value="' + a["cid"] + '" > ' + fname + ' ' + mname + ' ' + lname + '</option>';
                    $("#contact").append(option);
                });
                //console.log(response);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    // Load Matter
        function loadmatter() {
        $.ajax({  async: true, 
            type: "POST",
            url: "/api/callApi/LoadMatterBound",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                }
                else {
                    alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#matter").append(option);
                    }
                });
                //console.log(response);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
        // Load Permissions
        function permission() {
            $.ajax({  async: true, 
                type: "POST",
                url: "/api/callApi/permissionList",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                       // alert(datas);
                    }
                    else {
                        alert("not found");
                    }
                    $.each(response.Data, function (i, a) {
                            var option = '<option value="' + a.Id + '" > ' + a.Pname + '</option>';
                        $("#lstFruits").append(option);
                    });
                    //console.log(response);
                },
                failure: function (response) {
                    alert(data.responseText);
                },
                error: function (response) {
                    alert(data.responseText);
                }
            });
        }
