function AddController() {
    var privateVariables = {};
    var privateMethods = {
        LoadPage: function (response) {
            $("#divmain").html(response);
        },
        LoadError: function () { },
        load: function () {
            Utility.LoadPartialView("/Firm/Add?type=" + type, "html", privateMethods.LoadPage, privateMethods.LoadError, 'application/html;charset=utf-8')
        }
    };
    var constructor = {
        AddController: function () {
            privateMethods.load();
        }
    };
    constructor.AddController();
};
$(document).ready(function () {
    var main = new AddController();
});