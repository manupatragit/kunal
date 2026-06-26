function Details() {
    var privateVariables = {
        configuredcustomfieldsdata: [],
        mode: "VIEW",
        updateUrl: "",
        infoUrl: "",
        id: 0,
        info: []
    };
    var delegateMethods = {
        save: function () {
            if (privateVariables.mode === "UPDATE") {
                privateVariables.configuredcustomfieldsdata = [];
                if (CustomFields.validateFields(privateVariables.configuredcustomfieldsdata, privateVariables.id)) {
                    CustomFields.saveCustomFieldValues(privateVariables.updateUrl, { "Id": privateVariables.id,"Data": privateVariables.configuredcustomfieldsdata }, { "configurationtype": configurationtype }, delegateMethods.updated);
                }
            }
            if (privateVariables.mode === "VIEW") {
                privateVariables.mode = "UPDATE";
                $("#btnSave").text("Update");
                $("#btnCancel").show();
                $(".textinput", $("#divCFields")).not("[id='txtusername']").removeClass("borderless");
                $(".radioinput", $("#divCFields")).removeClass("borderless");
            }
        },
        updated: function (response) {
            if (response.Status) {
                alert("Save Successfully!!");
                location.reload();
            }
        },
        cancel: function() {
            privateVariables.mode = "VIEW";
            $("#btnSave").text("Edit");
            $("#btnCancel").hide();
            var fields = $(">div", $("#divCFields"));
            $.each(fields, function (i, a) {
                var id = parseInt($(a).attr("Id").replace("divCField", ""), 10);
                var fieldtype = parseInt($(a).attr("fieldtype"), 10);
                var data = privateVariables.info[id];
                CustomFields.setFieldValue($(a), fieldtype, data);
            });
            $(".textinput", $("#divCFields")).addClass("borderless");
            $(".radioinput", $("#divCFields")).addClass("borderless");
        }
    };
    var privateMethods = {
        getProfile: function() {
            Utility.postDataToServer(privateVariables.infoUrl, { "Id": privateVariables.id }, { "configurationtype": configurationtype }, "json", privateMethods.displayProfile, null, null, true);
        },
        displayProfile: function (response) {
            if (response.Status) {
                privateVariables.info = JSON.parse(response.Data["Item2"]);
                $("#txtusername").val(response.Data["Item1"]);
                var fields = $(">div", $("#divCFields"));
                $.each(fields, function (i, a) {
                    var id = parseInt($(a).attr("Id").replace("divCField", ""), 10);
                    var fieldtype = parseInt($(a).attr("fieldtype"), 10);
                    var data = privateVariables.info[id];
                    CustomFields.setFieldValue($(a), fieldtype, data);
                });
            }
            if (privateVariables.mode==="VIEW") {
                $(".textinput", $("#divCFields")).addClass("borderless");
                $(".radioinput", $("#divCFields")).addClass("borderless");
            }
            if (privateVariables.mode === "UPDATE") {
                $(".textinput", $("#divCFields")).removeClass("borderless");
                $(".fstQueryInput", $("#divCFields")).removeClass("borderless");
                $(".fstToggleBtn", $("#divCFields")).removeClass("borderless");
                $(".radioinput", $("#divCFields")).removeClass("borderless");
            }
        },
        setPrivateValues: function () {
            switch (configurationtype) {
                case 1:
                    privateVariables.infoUrl = "api/EmployeeApi/EmployeeDetails";
                    privateVariables.updateUrl = "api/EmployeeApi/UpdateUser";
                    privateVariables.id = parseInt(Id, 10);
                    break;
                case 2:
                    privateVariables.infoUrl = "api/FirmApi/CaseDetails";
                    privateVariables.updateUrl = "api/FirmApi/UpdateCaseDetail";
                    privateVariables.id = parseInt(Id, 10);
                    $("#divUserName").remove();
                    break;
                case 3:
                    privateVariables.infoUrl = "api/FirmApi/TaskDetails";
                    privateVariables.updateUrl = "api/FirmApi/UpdateTaskDetail";
                    privateVariables.id = parseInt(Id, 10);
                    $("#divUserName").remove();
                    break;
                case 4:
                    privateVariables.infoUrl = "api/FirmApi/EventDetails";
                    privateVariables.updateUrl = "api/FirmApi/UpdateEventDetail";
                    privateVariables.id = parseInt(Id, 10);
                    $("#divUserName").remove();
                    break;
                case 5:
                    privateVariables.infoUrl = "api/FirmApi/ClientDetails";
                    privateVariables.updateUrl = "api/FirmApi/UpdateClientDetail";
                    privateVariables.id = parseInt(Id, 10);
                    break;
                case 3:
                case 4:
                    $("#divUserName").remove();
                    break;
            }
        },
        initiatePlugins: function () { },
        attachevents: function () {
            $("#btnSave").unbind().bind("click", delegateMethods.save);
            $("#btnCancel").unbind().bind("click", delegateMethods.cancel);
        },
        load: function () {
            $("#btnCancel").hide();
            privateMethods.setPrivateValues();
            CustomFields.getConfiguredCustomField();
            privateMethods.getProfile();
        }
    };
    var constructor = {
        Details: function () {
            CustomFields.delayInitiate = true;
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.Details();
}
$(document).ready(function () {
    var main = new Details();
});