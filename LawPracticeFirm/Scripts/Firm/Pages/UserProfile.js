function UserProfile() {
    var privateVariables = {
        configuredcustomfieldsdata: [],
        mode:"VIEW"
    };
    var delegateMethods = {
        save: function () {
            if (privateVariables.mode === "UPDATE") {
                privateVariables.configuredcustomfieldsdata = [];
                if (CustomFields.validateFields(privateVariables.configuredcustomfieldsdata, Utility.UserInfo.UserId)) {
                    CustomFields.saveCustomFieldValues("api/EmployeeApi/UpdateProfile", { Data: privateVariables.configuredcustomfieldsdata }, { "configurationtype": configurationtype }, delegateMethods.updated);
                }
            }
            if (privateVariables.mode === "VIEW") {
                privateVariables.mode = "UPDATE";
                $("#btnSave").text("Update");
                $("#btnCancel").show();
                $(".textinput", $("#divCFields")).removeClass("borderless");
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
                var data = Utility.UserInfo["Details"][id];
                CustomFields.setFieldValue($(a), fieldtype, data);
            });
            $(".textinput", $("#divCFields")).addClass("borderless");
            $(".radioinput", $("#divCFields")).addClass("borderless");
        }
    };
    var privateMethods = {
        displayProfile: function () {
            $("#txtusername").val(Utility.UserInfo.UserName);
            var fields = $(">div", $("#divCFields"));
            $.each(fields, function (i, a) {
                var id = parseInt($(a).attr("Id").replace("divCField",""), 10);
                var fieldtype = parseInt($(a).attr("fieldtype"), 10);
                var data = Utility.UserInfo["Details"][id];
                CustomFields.setFieldValue($(a), fieldtype, data);
            });
            if (privateVariables.mode==="VIEW") {
                $(".textinput", $("#divCFields")).addClass("borderless");
                $(".radioinput", $("#divCFields")).addClass("borderless");
            }
            if (mode === "UPDATE") {
                $(".textinput", $("#divCFields")).removeClass("borderless");
                $(".radioinput", $("#divCFields")).removeClass("borderless");
            }
        },
        initiatePlugins: function () {},
        attachevents: function () {
            $("#btnSave").unbind().bind("click", delegateMethods.save);
            $("#btnCancel").unbind().bind("click", delegateMethods.cancel);
        },
        load: function () {
            $("#btnCancel").hide();
            CustomFields.getConfiguredCustomField();
            privateMethods.displayProfile();
        }
    };
    var constructor = {
        UserProfile: function () {
            CustomFields.delayInitiate = true;
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.UserProfile();
}
$(document).ready(function () {
    var main = new UserProfile();
});
