/**Cofiguration controller */
function ConfigureController() {
    var privateVariables = {};
    var privateMethods = {
        LoadPage: function (response) {
            $("#divmain").html(response);
        },
        LoadError: function () { },
        load: function () {
            Utility.LoadPartialView("/Firm/Configuration?type=" + type +"&id="+id, "html", privateMethods.LoadPage, privateMethods.LoadError, 'application/html;charset=utf-8')
        }
    };
    var constructor = {
        ConfigureController: function () {
            privateMethods.load();
        }
    };
    constructor.ConfigureController();
};
$(document).ready(function () {
    var main = new ConfigureController();
});