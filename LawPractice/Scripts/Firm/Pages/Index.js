function Index() {
    var privateVariables = {
        url:''
    };
    var delegateMethods = {};
    var privateMethods = {
        getUserInfo: function () {
            
            Utility.postDataToServer("api/EmployeeApi/UserProfile", {}, {}, "json", privateMethods.userInfo, privateMethods.initiatePlugins, null, false);
        },
        userInfo: function (response) {
            if (response.Status) {
                privateVariables.url = response.Data["Item1"];
                var managedata = response.Data["Item2"];
                var adddata = response.Data["Item3"];
                var data = response.Data["Item4"];
                Utility.UserInfo = response.Data["Item4"];
                Utility.UserInfo["Details"] = JSON.parse(Utility.UserInfo["Details"]);
                $.each(data.Matters, function (i, a) {
                    $("#ulMatters").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Case/" + a["CaseId"] + '">' + a["CaseId"] + '</a></li>');
                });
                
                $("#ulMatters").append('<li role="presentation" class="divider"></li>');
                $("#ulMatters").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/MyCases" + '">' + "Show All" + '</a></li>');
                if (managedata.length>0) {
                    $("#liManage").show();
                    $.each(managedata, function (i, a) {
                        $("#ulManage").append('<li><a tabindex=" - 1" href="' + a["Url"] + '">' + a["Title"] + '</a></li>');
                    });
                }

                if (adddata.length > 0) {
                    //$("#liManage").show();
                    $.each(adddata, function (i, a) {
                        $("#ulAddNew").append('<li><a tabindex=" - 1" href="' + a["Url"] + '">' + a["Title"] + '</a></li>');
                    });
                }

                //if (data.IsAdmin) {
                //    $("#liManage").show();
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Cases" + '">' + "Cases" + '</a></li>');
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Employees" + '">' + "Users" + '</a></li>');
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/FirmInformation" + '">' + "Firm Details" + '</a></li>');
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Configuration/CaseField" + '">' + "Case Fields" + '</a></li>');
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Configuration/UserField" + '">' + "User Fields" + '</a></li>');
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Configuration/ClientField" + '">' + "Client Fields" + '</a></li>');
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Configuration/TaskField" + '">' + "Task Fields" + '</a></li>');
                //    $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Configuration/EventField" + '">' + "Event Fields" + '</a></li>');
                   
                //    $("#ulAddNew").append('<li><a tabindex=" - 1" href="' + "/"+privateVariables.url + "/Employee/Case" + '">' + "Case" + '</a></li>');
                //    $("#ulAddNew").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Employee" + '">' + "User" + '</a></li>');
                //    $("#ulAddNew").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Client" + '">' + "Client" + '</a></li>');
                //    $("#ulAddNew").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Task" + '">' + "Task" + '</a></li>');
                //    $("#ulAddNew").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Event" + '">' + "Event" + '</a></li>');
                //}
                //else {
                //    var m = ModulePermission.checkModule(data.Permissions, "Matters");
                //    if (m != null) {
                //        $("#liManage").show();
                //        $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Cases" + '">' + "Cases" + '</a></li>');
                //    }
                //    m = ModulePermission.checkModule(data.Permissions, "Users");
                //    if (m != null) {
                //        $("#liManage").show();
                //        $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/Employees" + '">' + "Users" + '</a></li>');
                //    }
                //    m = ModulePermission.checkModule(data.Permissions, "Firm");
                //    if (m != null) {
                //        $("#liManage").show();
                //        $("#ulManage").append('<li><a tabindex=" - 1" href="' + Utility.URL + privateVariables.url + "/Employee/FirmInformation" + '">' + "Firm Details" + '</a></li>');
                //    }
                //}
            }
           
        },
        initiatePlugins: function() {

        },
        attachevents: function () {
            
        },
        load: function () {
            privateMethods.getUserInfo();
        }
    };
    var constructor = {
        Index: function () {
            privateMethods.load();
            privateMethods.attachevents();
        }
    };
    constructor.Index();
}