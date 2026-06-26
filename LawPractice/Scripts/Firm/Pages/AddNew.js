function AddNewController() {
    var privateVariables = {
        configuredcustomfields: []
    };
    var delegateMethods = {
        save: function () {
            if (CustomFields.validateFields()) {
                alert("Save Successfully!!");
            }
        }
    };
    var privateMethods = {
        initiatePlugins: function () {

        },
        attachevents: function () {
            $("#btnSave").unbind().bind("click", delegateMethods.save);
        },
        load: function () {
            CustomFields.getConfiguredCustomField();
        }
    };
    var constructor = {
        AddNewController: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.AddNewController();
}

$(document).ready(function () {
    var main = new AddNewController();
});