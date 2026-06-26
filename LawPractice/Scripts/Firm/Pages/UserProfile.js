function UserProfile() {
    var privateVariables = {
        configuredcustomfieldsdata: []
    };
    var delegateMethods = {
        save: function () {
            privateVariables.configuredcustomfieldsdata = [];
            if (CustomFields.validateFields(privateVariables.configuredcustomfieldsdata, Utility.UserInfo.UserId)) {
                CustomFields.saveCustomFieldValues("api/EmployeeApi/UpdateProfile", { Data: privateVariables.configuredcustomfieldsdata }, { "configurationtype": configurationtype }, privateMethods.updated);
            }
        }
    };
    var privateMethods = {
        updated: function (response) {
            if (response.Success) {
                alert("Save Successfully!!");
            }
        },
        displayProfile: function () {
            var fields = $(">div", $("#divCFields"));
            $.each(fields, function (i, a) {
                var id = parseInt($(a).attr("Id").replace("divCField",""), 10);
                var fieldtype = parseInt($(a).attr("fieldtype"), 10);
                var data = Utility.UserInfo["Details"][id];
                CustomFields.setFieldValue($(a), fieldtype, data);
            });
        },
        initiatePlugins: function () {},
        attachevents: function () {
            $("#btnSave").unbind().bind("click", delegateMethods.save);
        },
        load: function () {
            CustomFields.getConfiguredCustomField();
            privateMethods.displayProfile();
        }
    };
    var constructor = {
        UserProfile: function () {
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