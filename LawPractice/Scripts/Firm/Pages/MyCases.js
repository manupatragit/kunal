function MyCases() {
    var privateVariables = {
        url: ''
    };
    var delegateMethods = {};
    var privateMethods = {
        initiatePlugins: function () {
            $('#example').DataTable();
        },
        attachevents: function () {

        },
        load: function () {
        }
    };
    var constructor = {
        MyCases: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.MyCases();

}

$(document).ready(function () {
    var main = new MyCases();
});